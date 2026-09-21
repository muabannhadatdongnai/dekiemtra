/**
 * khgdSgkReview.js  (Phiên 50)
 * Nhận diện các phần ÔN TẬP / ĐÁNH GIÁ cấp HỌC KÌ ngay TRONG Markdown SGK (VD Tiếng Việt 2 KNTT có bài "Ôn tập và
 * đánh giá cuối học kì 1" - đọc/viết/luyện từ và câu, tiết 1-10) để bảng Khung KHGD dùng ĐÚNG nội dung SGK thay vì
 * tự đề xuất (nguyên tắc Hoan chốt: "tuyệt đối bám theo SGK không tự bịa ra").
 *
 * Dùng CHUNG cho 2 tab (Tiểu học + THCS/THPT) - đây là tiện ích thuần chuỗi, không chứa chính sách theo cấp
 * (chính sách nằm ở khgdTieuHocSchedulePolicy.js / khgdSchedulePolicy.js).
 *
 * Nhận diện theo TIÊU ĐỀ (dòng `#`...) hoặc tên dòng đã dựng (`tenBai`), KHÔNG dựa vào nội dung thân bài:
 *   - phải có từ khoá ôn tập/đánh giá/kiểm tra VÀ một mốc học kì: "giữa kì", "cuối kì", "cuối năm", "học kì 1/2/I/II".
 *   - "Ôn tập phép cộng, phép trừ trong phạm vi 100", "Bài tập cuối chương", "Ôn tập chương I" KHÔNG phải mốc học kì → bỏ qua.
 */

function fold(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();
}

const RE_KEYWORD = /\b(on tap|danh gia|kiem tra)\b/;
const RE_MILESTONE = /(giua|cuoi)\s*(hoc\s*)?(ki|ky|nam)\b|hoc\s*(ki|ky)\s*(1|2|i|ii)\b/;
const RE_TIET = /\(\s*(\d+)\s*tiết\s*\)/i;

/**
 * @param {string} title
 * @returns {{ moc: "giua"|"cuoi", hocKi: 1|2|null, coKiemTra: boolean } | null}
 */
export function classifyReviewTitle(title) {
  const f = fold(title);
  if (!RE_KEYWORD.test(f) || !RE_MILESTONE.test(f)) return null;
  if (/\bbai tap\b/.test(f)) return null; // "Bài tập cuối học kì" (bài tập thường) - không phải mốc

  const moc = f.includes("giua") ? "giua" : "cuoi";
  let hocKi = null;
  const m = f.match(/hoc\s*(?:ki|ky)\s*(1|2|i|ii)\b/);
  if (m) hocKi = m[1] === "2" || m[1] === "ii" ? 2 : 1;
  else if (/cuoi\s*nam/.test(f)) hocKi = 2;

  return { moc, hocKi, coKiemTra: /\b(danh gia|kiem tra)\b/.test(f) };
}

const RE_NUMBERED_BAI = /^#{1,6}\s*B[ÀA]I\s+(\d+)\b/i;
const RE_HEADING = /^(#{1,6})\s+(.*\S)\s*$/;

function stripCitations(s) {
  return String(s ?? "").replace(/\s*\[\s*\d+(?:\s*,\s*\d+)*\s*\]/g, "");
}

/**
 * Quét Markdown tìm tiêu đề ôn tập/đánh giá học kì KHÔNG đánh số Bài (VD `## ÔN TẬP VÀ ĐÁNH GIÁ CUỐI HỌC KÌ 1`).
 * Tiêu đề có số Bài (`## Bài 17: Ôn tập giữa học kì 1`) đã được các bộ đọc "Bài" dựng thành dòng riêng → xử lý ở
 * applySgkReviewToRows (phân loại lại dòng), không lặp ở đây.
 * @returns {Array<{ title: string, tiet: number|null, moc: string, hocKi: number|null, coKiemTra: boolean, afterSoBai: number|null }>}
 */
export function extractUnnumberedReviewHeadings(markdown) {
  const out = [];
  let lastSoBai = null;
  for (const raw of String(markdown ?? "").normalize("NFC").split(/\r?\n/)) {
    const line = stripCitations(raw);
    const mBai = line.match(RE_NUMBERED_BAI);
    if (mBai) {
      lastSoBai = Number(mBai[1]);
      continue;
    }
    const mHead = line.match(RE_HEADING);
    if (!mHead) continue;
    const text = mHead[2];
    const info = classifyReviewTitle(text);
    if (!info) continue;
    const tiet = text.match(RE_TIET);
    out.push({
      title: text
        .replace(RE_TIET, "")
        .replace(/\(\s*trang[^)]*\)/gi, "")
        .replace(/^tuần\s*\d+\s*[:.\-–]\s*/i, "") // "TUẦN 18: ÔN TẬP..." → bỏ tiền tố tuần
        .replace(/^\d+\.\s*/, "")
        .trim(),
      tiet: tiet ? Number(tiet[1]) : null,
      ...info,
      afterSoBai: lastSoBai,
    });
  }
  return out;
}

/**
 * Áp dụng lên các dòng bảng đã dựng:
 *   (1) dòng có tên khớp mốc học kì (VD "Bài 17: Ôn tập giữa học kì 1") → đánh dấu loai:"onTap", nguon:"sgk", moc;
 *   (2) tiêu đề không đánh số Bài → thêm dòng mới, chèn SAU dòng cuối của Bài đứng ngay trước nó trong Markdown
 *       (cần `soBai` trên dòng; không thấy thì thêm CUỐI danh sách).
 * @param {Array<Object>} rows
 * @param {string} markdown
 * @param {{ normalizeTitle?: (s:string)=>string, defaultTiet?: number }} [opts]
 */
export function applySgkReviewToRows(rows, markdown, { normalizeTitle = (s) => s, defaultTiet = 1 } = {}) {
  const out = (rows || []).map((r) => {
    const info = classifyReviewTitle(r.tenBai);
    if (!info) return r;
    return { ...r, loai: "onTap", nguon: "sgk", moc: info.moc, coKiemTra: info.coKiemTra, blockKey: `sgk-${info.moc}` };
  });

  for (const h of extractUnnumberedReviewHeadings(markdown)) {
    const newRow = {
      tenBai: normalizeTitle(h.title) || h.title,
      soTiet: h.tiet && h.tiet > 0 ? h.tiet : defaultTiet,
      tietChot: !!(h.tiet && h.tiet > 0),
      loai: "onTap",
      nguon: "sgk",
      moc: h.moc,
      coKiemTra: h.coKiemTra,
      blockKey: `sgk-${h.moc}`,
      soBai: null,
    };
    let at = out.length;
    if (h.afterSoBai != null) {
      for (let i = out.length - 1; i >= 0; i--) {
        if (out[i].soBai === h.afterSoBai) {
          at = i + 1;
          break;
        }
      }
    }
    out.splice(at, 0, newRow);
  }
  return out;
}
