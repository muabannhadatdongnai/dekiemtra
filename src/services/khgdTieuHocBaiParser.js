import { normalizeTitle } from "./khgdTieuHocTiengVietParser";

/**
 * khgdTieuHocBaiParser.js  (Phiên 48b)
 * Bộ đọc CHUNG mức "Bài" cho các môn Tiểu học KHÔNG cần tách theo tiết (Toán, Đạo đức, Tự nhiên và
 * Xã hội... - xem OUTLINE_BUILDERS trong khgdTieuHocOutlineService.js): mỗi tiêu đề Markdown dạng
 * `## Bài 1: ÔN TẬP CÁC SỐ ĐẾN 100`, `## BÀI 2: EM YÊU QUÊ HƯƠNG (Trang 9)`, `### Bài 3: ...` (mọi cấp
 * từ ## đến ######, hoa/thường tuỳ ý) thành 1 dòng bảng. Đã đối chiếu 3 file thật (Toán, Đạo đức, Tự
 * nhiên và Xã hội Lớp 2 - KNTT) - cả 3 đều dùng `## Bài k: TÊN`.
 *
 * ⚠️ Markdown SGK KHÔNG ghi số tiết mỗi Bài (đó là dữ liệu của PPCT/Sách giáo viên, và đếm số mục
 * "Luyện tập"/"Khám phá" để đoán số tiết là KHÔNG đáng tin). Vì vậy mặc định 1 tiết/bài (giáo viên
 * sửa ở bảng, hoặc Hoan ghi sẵn vào tiêu đề Bài trong Markdown dạng `## Bài 1: ... (3 tiết)` - bộ
 * đọc tự nhận). KHÔNG có bảng con theo hoạt động: chưa có mẫu giáo viên cho các môn này (chỉ Tiếng
 * Việt đã có) nên không tự bịa cấu trúc.
 */

const RE_BAI = /^#{2,6}\s*B[ÀA]I\s+(\d+)\s*[:.\-–]\s*(.+?)\s*$/i;
const RE_TIET = /\(\s*(\d+)\s*tiết\s*\)/i;

/**
 * @param {string} markdown
 * @returns {Array<{ soBai: number, tenBai: string, soTiet: number|null }>}
 */
export function parseBaiHeadings(markdown) {
  const result = [];
  for (const line of String(markdown ?? "").normalize("NFC").split(/\r?\n/)) {
    const m = line.match(RE_BAI);
    if (!m) continue;
    const tiet = m[2].match(RE_TIET);
    const name = m[2].replace(RE_TIET, "").replace(/\(\s*trang[^)]*\)/i, "");
    const tenBai = normalizeTitle(name);
    if (!tenBai) continue;
    result.push({ soBai: Number(m[1]), tenBai, soTiet: tiet ? Number(tiet[1]) : null });
  }
  return result;
}

/**
 * @param {Array<{ soBai: number, tenBai: string, soTiet: number|null }>} baiList
 * @param {Array<{ soBai?: number|null, tenBai: string }>} [lessonIndex] - `chuong_{n}_bai.json`: tên
 *   bài trong đó ưu tiên hơn tên bóc từ Markdown (đã đúng chính tả/tên riêng người soạn chốt).
 * @returns {Array<{ tenBai: string, soTiet: number, nhomTiet: string }>}
 */
export function buildBaiRows(baiList, lessonIndex = []) {
  const nameBySoBai = new Map();
  for (const l of lessonIndex || []) {
    if (l && l.soBai != null && typeof l.tenBai === "string" && l.tenBai.trim()) nameBySoBai.set(Number(l.soBai), l.tenBai.trim());
  }
  return (baiList || []).map((b) => ({
    tenBai: `Bài ${b.soBai}: ${nameBySoBai.get(b.soBai) || b.tenBai}`,
    soTiet: b.soTiet && b.soTiet > 0 ? b.soTiet : 1,
    nhomTiet: "",
  }));
}
