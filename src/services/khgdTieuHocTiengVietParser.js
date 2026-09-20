/**
 * khgdTieuHocTiengVietParser.js  (Phiên 48b)
 * Đọc file Markdown SGK Tiếng Việt Tiểu học trong kho GitHub kiến thức (chuong_{n}.md) để dựng
 * bảng "Khung KHGD - Tiểu học" CHI TIẾT THEO TIẾT giống bản mẫu giáo viên (Đọc/Viết/Nói và
 * nghe/Luyện từ và câu/Viết đoạn văn) thay vì chỉ 1 dòng/bài như trước.
 *
 * ⚠️ KHÔNG dùng AI ở tầng này: đây là bóc tách CẤU TRÚC (deterministic, tái lập được, không tốn
 * quota Gemini). AI (nếu dùng) chỉ nên viết cột "Nội dung điều chỉnh" - xem NEXT_STEPS.md.
 *
 * ⚠️ 2 BIẾN THỂ ĐỊNH DẠNG ĐÃ GẶP trong file thật của cùng 1 môn (Tiếng Việt Lớp 2, KNTT) - do
 * người soạn tạo file ở các lần khác nhau nên KHÔNG đồng nhất, parser phải chịu được cả hai:
 *   Biến thể A (chuong_1.md):  ### TUẦN n: ...  /  #### Bài k: Tên (Trang N)  /  hoạt động là mục
 *       danh sách cấp 1  `*   **1. Đọc: "Tên"**`, `**2. Viết**`, `**3. Nói và nghe: "..."**`,
 *       `**3. Luyện tập**` (con: *Từ ngữ & Câu*, *Viết đoạn văn*), `**4. Đọc mở rộng**`;
 *       có dấu trích dẫn [4], [9] rải rác; có bảng MỤC LỤC.
 *   Biến thể B (chuong_2.md):  ## TUẦN n  /  ### BÀI k: TÊN IN HOA  /  hoạt động là tiêu đề
 *       `#### I. HOẠT ĐỘNG ĐỌC`, `II. HOẠT ĐỘNG VIẾT`, `II. HOẠT ĐỘNG VIẾT & LUYỆN TỪ VÀ CÂU` (con:
 *       `##### 1. Nghe - viết`, `2. Luyện từ và câu`, `3. Luyện viết đoạn văn ...`),
 *       `III. HOẠT ĐỘNG NÓI VÀ NGHE: KỂ CHUYỆN "..."`, `III. HOẠT ĐỘNG ĐỌC MỞ RỘNG`; không có [n].
 * → Vì vậy KHÔNG dựa vào MỨC tiêu đề (#/##/###) mà dựa vào TỪ KHOÁ ("Bài k:", "Tuần k", "Đọc",
 *   "Viết", "Nói và nghe"...). Nếu gặp biến thể thứ 3 không nhận ra, `bai` rỗng → caller quay về
 *   luồng cũ (nạp tên bài từ `_bai.json`), KHÔNG lỗi.
 *
 * Số tiết KHÔNG có trong Markdown - lấy từ bảng quy tắc TIENG_VIET_TIET_RULES bên dưới (đối chiếu
 * bản mẫu giáo viên Tuần 1-2 Tiếng Việt Lớp 2 và cả 8 Bài của chuong_1.md/chuong_2.md: mỗi tuần
 * đúng 10 tiết = Bài lẻ 4 tiết + Bài chẵn 6 tiết).
 */

/** Số tiết mặc định cho từng loại hoạt động (Tiếng Việt Tiểu học, KNTT). Giáo viên sửa được ở bảng. */
export const TIENG_VIET_TIET_RULES = {
  doc: 2, // Đọc: Tiết 1 + Tiết 2
  viet: 1, // Viết chữ hoa HOẶC Nghe - viết
  noiNghe: 1, // Nói và nghe / Kể chuyện
  luyenTuVaCau: 1, // Luyện từ và câu
  vietDoan: 2, // Viết đoạn văn (Tiết 1 + Tiết 2)
  docMoRong: 0, // Đọc mở rộng: KHÔNG chiếm tiết riêng trên PPCT (mẫu giáo viên ghi chú vào dòng Viết đoạn văn)
};

// ---------------------------------------------------------------------------------------------
// Tiện ích chuỗi
// ---------------------------------------------------------------------------------------------

/** Bỏ dấu trích dẫn kiểu NotebookLM: " [4]", " [4, 9]". */
function stripCitations(s) {
  return String(s ?? "").replace(/\s*\[\s*\d+(?:\s*,\s*\d+)*\s*\]/g, "");
}

/** Bỏ ký hiệu in đậm/nghiêng Markdown. */
function stripMarkdown(s) {
  return String(s ?? "").replace(/\*+/g, "").replace(/__+/g, "");
}

function clean(s) {
  return stripMarkdown(stripCitations(s)).replace(/\s+/g, " ").trim();
}

/** Bỏ dấu tiếng Việt + hạ chữ thường - dùng để so khớp từ khoá không phụ thuộc dấu/hoa thường. */
export function fold(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function isAllCaps(s) {
  return s === s.toLocaleUpperCase("vi") && s !== s.toLocaleLowerCase("vi");
}

function sentenceCase(s) {
  const lower = s.toLocaleLowerCase("vi");
  return lower.charAt(0).toLocaleUpperCase("vi") + lower.slice(1);
}

/**
 * Chuẩn hoá tiêu đề: bỏ dấu ngoặc kép/Markdown/trích dẫn; nếu IN HOA TOÀN BỘ (VD "CÔ GIÁO LỚP EM",
 * `KỂ CHUYỆN "CẬU BÉ HAM HỌC"`) thì đổi về dạng câu, xử lý riêng từng đoạn trong/ngoài ngoặc kép
 * → "Kể chuyện Cậu bé ham học". (Tên riêng in hoa toàn bộ sẽ mất viết hoa - ưu tiên tên trong
 * `chuong_{n}_bai.json` khi có, xem buildTiengVietRows.)
 */
export function normalizeTitle(raw) {
  const s = clean(raw);
  if (!s) return "";
  if (!isAllCaps(s)) return s.replace(/["“”]/g, "").replace(/\s+/g, " ").trim();
  return s
    .split(/["“”]/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(sentenceCase)
    .join(" ");
}

// ---------------------------------------------------------------------------------------------
// Chủ đề
// ---------------------------------------------------------------------------------------------

/**
 * Lấy "Chủ đề" từ tiêu đề # đầu tiên dạng `# CHỦ ĐỀ 1: EM LỚN LÊN TỪNG NGÀY (TUẦN 1 - TUẦN 4) [4]`.
 * Nếu đoạn mở đầu có tên chủ đề in đậm đúng chữ hoa/thường (`Chủ đề **"Em lớn lên từng ngày"**`)
 * và khớp với tiêu đề thì dùng bản đó (giữ đúng tên riêng); ngược lại đổi tiêu đề về dạng câu.
 * Trả về null nếu không có tiêu đề dạng "CHỦ ĐỀ/CHỦ ĐIỂM n: ..." (VD môn khác dùng "Chương").
 * @returns {{ chuDe: string, so: number|null, tuanTu: number|null, tuanDen: number|null } | null}
 */
export function extractChuDe(markdown) {
  const lines = String(markdown ?? "").normalize("NFC").split(/\r?\n/);
  const h1Index = lines.findIndex((l) => /^#\s+\S/.test(l));
  if (h1Index === -1) return null;

  const h1 = stripCitations(lines[h1Index].replace(/^#\s+/, "")).trim();
  const m = h1.match(/^CH[ỦU]\s*ĐỀ\s*(\d+)?\s*[:.\-–]\s*(.+)$/i) || h1.match(/^CH[ỦU]\s*ĐI[ỂE]M\s*(\d+)?\s*[:.\-–]\s*(.+)$/i);
  if (!m) return null;

  let namePart = m[2];
  const weeks = namePart.match(/\(\s*tuần\s*(\d+)\s*[-–]\s*tuần\s*(\d+)\s*\)/i);
  namePart = namePart.replace(/\(\s*tuần[^)]*\)/i, "").trim();
  const fromHeading = normalizeTitle(namePart);
  if (!fromHeading) return null;

  let chuDe = fromHeading;
  const intro = lines.slice(h1Index + 1, h1Index + 12).join(" ");
  const bold = intro.match(/Chủ đề\s*\*\*\s*["“]([^"”]+)["”]\s*\*\*/i);
  if (bold && fold(clean(bold[1])) === fold(fromHeading)) {
    chuDe = clean(bold[1]);
  }

  return {
    chuDe,
    so: m[1] ? Number(m[1]) : null,
    tuanTu: weeks ? Number(weeks[1]) : null,
    tuanDen: weeks ? Number(weeks[2]) : null,
  };
}

// ---------------------------------------------------------------------------------------------
// Phân loại hoạt động
// ---------------------------------------------------------------------------------------------

/** Phân loại tiêu đề hoạt động cấp 1 (đã bỏ "I."/"1." và "HOẠT ĐỘNG"). */
function classifyActivity(title) {
  const t = fold(title);
  if (t.includes("doc mo rong")) return "docMoRong";
  if (t.includes("noi va nghe")) return "noiNghe";
  if (/^doc\b/.test(t)) return "doc";
  if (t.includes("viet") && t.includes("luyen")) return "vietLuyen"; // "VIẾT & LUYỆN TỪ VÀ CÂU"/"VIẾT & LUYỆN TẬP"
  if (/^luyen\b/.test(t)) return "luyenTap"; // biến thể A: "Luyện tập" (con: Từ ngữ & Câu, Viết đoạn văn)
  if (/^viet\b/.test(t)) return "viet";
  return "khac";
}

/** Phân loại mục con đánh số của "VIẾT & LUYỆN ..." (biến thể B). */
function classifySubItem(title) {
  const t = fold(title);
  if (/nghe\s*-?\s*viet/.test(t)) return "ngheViet";
  if (/(luyen tu|luyen tap tu|tu va cau|tu ngu)/.test(t)) return "luyenTuVaCau";
  return "vietDoan"; // "Luyện viết đoạn văn ...", "Lập danh sách học sinh", "Viết đoạn văn ngắn tả ..."
}

/** Dựng nhãn "Chữ hoa D"/"Chữ hoa Ă, Â" từ giá trị `Chữ hoa **D** (cỡ vừa và cỡ nhỏ).` */
function chuHoaLabel(rawValue) {
  let v = clean(rawValue).replace(/\([^)]*\)/g, "").replace(/[.\s]+$/, "").trim();
  v = v.replace(/^chữ\s*hoa\s*/i, "").trim();
  if (/^[\p{Lu}](?:\s*(?:,|và)\s*[\p{Lu}])*$/u.test(v)) {
    return `Chữ hoa ${v.split(/\s*(?:,|và)\s*/).join(", ")}`;
  }
  return v; // VD "Ôn tập viết hoa tên riêng của người"
}

/** Lấy mệnh đề đầu của mô tả dài: bỏ ngoặc đơn, cắt ở dấu chấm đầu tiên. */
function firstClause(rawValue) {
  const v = clean(rawValue).replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
  const cut = v.split(/\.\s|\.$/)[0];
  return cut.replace(/[.\s]+$/, "").trim();
}

// ---------------------------------------------------------------------------------------------
// Phân tích chương
// ---------------------------------------------------------------------------------------------

const RE_BAI = /^(#{2,6})\s*B[ÀA]I\s+(\d+)\s*[:.\-–]\s*(.+?)\s*$/i;
const RE_TUAN = /^#{2,6}\s*TU[ẦA]N\s+(\d+)/i;
const RE_ROMAN_ACTIVITY = /^#{3,6}\s*(?:I|II|III|IV|V|VI)\.\s*(?:HOẠT ĐỘNG\s*)?(.+)$/i;
const RE_TOP_ITEM = /^\*\s{1,4}\*\*\s*\d+\.\s*(.+?)\*\*/; // `*   **1. Đọc: "..."**` (không thụt lề)
const RE_NUMBERED_SUBHEADING = /^#{5,6}\s*\d+\.\s*(.+)$/;
const RE_KEY_VALUE = /^\s*\*\s+\*{1,2}([^*]+?)\*{1,2}\s*:\s*(.*)$/; // `    *   *Viết chữ hoa*: **A**` hoặc `*   **Luyện viết chữ hoa**: ...`

/**
 * @typedef {Object} TiengVietActivity
 * @property {"doc"|"viet"|"noiNghe"|"luyenTuVaCau"|"vietDoan"|"docMoRong"} loai
 * @property {string} ten - nhãn hiển thị sau tiền tố (VD "Chữ hoa A", "Những ngày hè của em"); "" nếu không có
 * @property {"chuHoa"|"ngheViet"} [kieu] - chỉ với loai "viet"
 * @property {string} [moTa] - mô tả thô trong Markdown (dùng làm ngữ cảnh cho AI ở bước sau)
 *
 * @typedef {Object} TiengVietBai
 * @property {number} soBai
 * @property {string} tenBai
 * @property {number|null} tuan - số tuần theo tiêu đề TUẦN trong Markdown (chỉ để tham khảo)
 * @property {TiengVietActivity[]} hoatDong
 */

/**
 * @param {string} markdown
 * @returns {{ chuDe: ReturnType<typeof extractChuDe>, bai: TiengVietBai[] }}
 */
export function parseTiengVietChapter(markdown) {
  const lines = String(markdown ?? "").normalize("NFC").split(/\r?\n/);
  const chuDe = extractChuDe(markdown);
  /** @type {TiengVietBai[]} */
  const bai = [];
  let cur = null;
  let curTuan = null;
  /** hoạt động cấp 1 đang mở: { type, title, keyValues: [{key,value}], subItems: [{title, moTa}], lines: [] } */
  let act = null;

  function closeActivity() {
    if (cur && act) finalizeActivity(cur, act);
    act = null;
  }

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");
    if (!line.trim()) continue;
    if (line.trim().startsWith("|") || /^-{3,}$/.test(line.trim())) continue; // bảng (mục lục, thời khoá biểu...) và dòng kẻ ---

    const stripped = stripCitations(line);

    const mTuan = stripped.match(RE_TUAN);
    if (mTuan) {
      closeActivity();
      cur = null;
      curTuan = Number(mTuan[1]);
      continue;
    }

    const mBai = stripped.match(RE_BAI);
    if (mBai) {
      closeActivity();
      const tenRaw = mBai[3].replace(/\(\s*trang[^)]*\)/i, "");
      cur = { soBai: Number(mBai[2]), tenBai: normalizeTitle(tenRaw), tuan: curTuan, hoatDong: [] };
      bai.push(cur);
      continue;
    }

    // Tiêu đề cấp ≤3 không phải Bài/Tuần (VD "## TỔNG KẾT CHỦ ĐỀ 1", "## MỤC LỤC") → hết phạm vi bài
    const mHeading = stripped.match(/^(#{1,6})\s+(.*)$/);
    if (mHeading && mHeading[1].length <= 3) {
      closeActivity();
      cur = null;
      continue;
    }
    if (!cur) continue;

    // Hoạt động cấp 1 - biến thể B: tiêu đề "I. HOẠT ĐỘNG ĐỌC"
    const mRoman = stripped.match(RE_ROMAN_ACTIVITY);
    if (mRoman) {
      closeActivity();
      const title = clean(mRoman[1]);
      act = { type: classifyActivity(title), title, keyValues: [], subItems: [], text: [] };
      continue;
    }

    // Hoạt động cấp 1 - biến thể A: mục danh sách in đậm "**1. Đọc: ...**"
    const mTop = stripped.match(RE_TOP_ITEM);
    if (mTop) {
      closeActivity();
      const title = clean(mTop[1]);
      act = { type: classifyActivity(title), title, keyValues: [], subItems: [], text: [] };
      continue;
    }

    if (!act) continue;

    const mSub = stripped.match(RE_NUMBERED_SUBHEADING);
    if (mSub) {
      act.subItems.push({ title: clean(mSub[1]), moTa: "" });
      continue;
    }

    const mKv = stripped.match(RE_KEY_VALUE);
    if (mKv) {
      act.keyValues.push({ key: clean(mKv[1]), value: clean(mKv[2]) });
    }
    const textLine = clean(stripped.replace(/^\s*[*>]\s*/, ""));
    if (textLine) {
      act.text.push(textLine);
      const lastSub = act.subItems[act.subItems.length - 1];
      if (lastSub && !lastSub.moTa) lastSub.moTa = textLine;
    }
  }
  closeActivity();

  return { chuDe, bai };
}

/** Chuyển 1 hoạt động cấp 1 thô thành các TiengVietActivity chuẩn hoá và đẩy vào `bai`. */
function finalizeActivity(bai, act) {
  const findKv = (re) => act.keyValues.find((kv) => re.test(fold(kv.key)));

  switch (act.type) {
    case "doc":
      bai.hoatDong.push({ loai: "doc", ten: "", moTa: act.text.slice(0, 2).join(" ") });
      break;

    case "noiNghe": {
      const colon = act.title.indexOf(":");
      const after = colon >= 0 ? act.title.slice(colon + 1) : "";
      bai.hoatDong.push({ loai: "noiNghe", ten: normalizeTitle(after), moTa: act.text.slice(0, 2).join(" ") });
      break;
    }

    case "viet": {
      const chuHoa = findKv(/chu hoa|viet hoa/);
      const ngheViet = findKv(/nghe\s*-?\s*viet/);
      if (chuHoa) {
        bai.hoatDong.push({ loai: "viet", kieu: "chuHoa", ten: chuHoaLabel(chuHoa.value) });
      } else if (ngheViet) {
        bai.hoatDong.push({ loai: "viet", kieu: "ngheViet", ten: "" });
      } else if (act.text.some((t) => /nghe\s*-?\s*viết/i.test(t))) {
        bai.hoatDong.push({ loai: "viet", kieu: "ngheViet", ten: "" });
      } else {
        bai.hoatDong.push({ loai: "viet", kieu: "chuHoa", ten: "" });
      }
      break;
    }

    case "vietLuyen": {
      if (act.subItems.length === 0) {
        bai.hoatDong.push({ loai: "viet", kieu: "ngheViet", ten: "" });
        break;
      }
      for (const sub of act.subItems) {
        const kind = classifySubItem(sub.title);
        if (kind === "ngheViet") bai.hoatDong.push({ loai: "viet", kieu: "ngheViet", ten: "" });
        else if (kind === "luyenTuVaCau") bai.hoatDong.push({ loai: "luyenTuVaCau", ten: "", moTa: sub.moTa });
        else bai.hoatDong.push({ loai: "vietDoan", ten: normalizeTitle(sub.title), moTa: sub.moTa });
      }
      break;
    }

    case "luyenTap": {
      const tuCau = findKv(/tu ngu|tu va cau/);
      const doan = findKv(/viet doan|doan van/);
      if (tuCau) bai.hoatDong.push({ loai: "luyenTuVaCau", ten: "", moTa: tuCau.value });
      if (doan) {
        bai.hoatDong.push({ loai: "vietDoan", ten: firstClause(doan.value) || "Viết đoạn văn", moTa: doan.value });
      }
      break;
    }

    case "docMoRong":
      bai.hoatDong.push({ loai: "docMoRong", ten: "", moTa: act.text.slice(0, 2).join(" ") });
      break;

    default:
      break;
  }
}

// ---------------------------------------------------------------------------------------------
// Dựng các dòng bảng (mỗi TIẾT 1 dòng, đúng bản mẫu giáo viên)
// ---------------------------------------------------------------------------------------------

/**
 * @param {{ chuDe: any, bai: TiengVietBai[] }} parsed - kết quả parseTiengVietChapter
 * @param {Array<{ soBai?: number|null, tenBai: string }>} [lessonIndex] - nội dung `chuong_{n}_bai.json`;
 *   tên bài trong đó ưu tiên hơn tên bóc từ Markdown (đúng chính tả/tên riêng người soạn đã chốt).
 * @returns {Array<{ tenBai: string, soTiet: number, nhomTiet: string }>} - `nhomTiet` != "" khi nhiều
 *   dòng cùng thuộc 1 hoạt động (VD Đọc Tiết 1 + Tiết 2) → cột "Tiết học/Thời lượng" gộp ô "2 tiết".
 */
export function buildTiengVietRows(parsed, lessonIndex = []) {
  const nameBySoBai = new Map();
  for (const l of lessonIndex || []) {
    if (l && l.soBai != null && typeof l.tenBai === "string" && l.tenBai.trim()) nameBySoBai.set(Number(l.soBai), l.tenBai.trim());
  }

  const rows = [];
  for (const bai of parsed?.bai || []) {
    const tenBai = nameBySoBai.get(bai.soBai) || bai.tenBai;
    const groupBase = `b${bai.soBai}`;
    let groupIndex = 0;

    /** Thêm 1 hoạt động chiếm `tiet` tiết: 1 tiết → 1 dòng; nhiều tiết → mỗi tiết 1 dòng "… - Tiết k". */
    const pushActivity = (label, tiet) => {
      if (tiet <= 1) {
        rows.push({ tenBai: label, soTiet: 1, nhomTiet: "" });
        return;
      }
      groupIndex += 1;
      const key = `${groupBase}-${groupIndex}`;
      for (let k = 1; k <= tiet; k++) rows.push({ tenBai: `${label} - Tiết ${k}`, soTiet: 1, nhomTiet: key });
    };

    let produced = 0;
    for (const a of bai.hoatDong) {
      const tiet = TIENG_VIET_TIET_RULES[a.loai] ?? 1;
      if (tiet === 0) continue;

      if (a.loai === "doc") {
        pushActivity(`Đọc: Bài ${bai.soBai}: ${tenBai}`, tiet);
      } else if (a.loai === "viet") {
        if (a.kieu === "ngheViet") pushActivity(`Viết: Nghe - viết: ${tenBai}`, tiet);
        else pushActivity(a.ten ? `Viết: ${a.ten}` : "Viết", tiet);
      } else if (a.loai === "noiNghe") {
        pushActivity(a.ten ? `Nói và nghe: ${a.ten}` : "Nói và nghe", tiet);
      } else if (a.loai === "luyenTuVaCau") {
        pushActivity("Luyện từ và câu", tiet);
      } else if (a.loai === "vietDoan") {
        pushActivity(a.ten || "Viết đoạn văn", tiet);
      } else {
        continue;
      }
      produced += 1;
    }

    // Bài không nhận ra hoạt động nào → vẫn giữ 1 dòng để giáo viên không mất bài
    if (produced === 0) rows.push({ tenBai: `Bài ${bai.soBai}: ${tenBai}`, soTiet: 1, nhomTiet: "" });
  }
  return rows;
}
