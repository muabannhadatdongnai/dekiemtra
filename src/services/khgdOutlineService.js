/**
 * khgdOutlineService.js  (Phiên 49)
 * Từ nội dung Markdown 1 chương SGK (kho GitHub kiến thức) dựng 2 thứ cho tab "Khung KHGD"
 * THCS/THPT (Phụ lục III, CV 5512):
 *   (1) các DÒNG BÀI HỌC gợi ý (tên bài đúng như Markdown/PPCT) - thay cho việc chỉ đọc phụ lục
 *       `chuong_{n}_bai.json` (trước Phiên 49: thiếu file .json thì form báo "chưa có gợi ý", dù
 *       đã có sẵn Markdown đầy đủ - giáo viên phản hồi "chưa tự lấy nội dung trong Markdown");
 *   (2) `noiDung` - đoạn TRÍCH NGẮN từ chính Markdown của từng bài, gửi kèm lên AI để phần SWD/NLS
 *       bám sát nội dung SGK thật của bài (từ vựng, ngữ pháp, khái niệm, kỹ năng...) thay vì viết
 *       chung chung chỉ dựa vào tên bài. Nguyên tắc chốt với Hoan: LUÔN ƯU TIÊN nội dung Markdown.
 *
 * ⚠️ File RIÊNG với khgdTieuHocOutlineService.js (Tiểu học) - đúng "isolation over DRY": mẫu Phụ lục
 * III (THCS/THPT) và Phụ lục 2 (Tiểu học) khác hẳn nhau, các tiện ích nhỏ (làm sạch dòng, viết hoa
 * đầu câu) được viết lại ở đây thay vì import chéo giữa 2 tab.
 *
 * ⚠️ KHÔNG dùng AI ở tầng này - bóc tách cấu trúc thuần code (tái lập được, không tốn quota Gemini).
 *
 * Mỗi môn có định dạng Markdown RIÊNG (đã đối chiếu file thật Tiếng Anh 7 + Toán 7):
 *   - Tiếng Anh (Global Success): mỗi Unit 1 file, các phần `### 1. GETTING STARTED (Trang 8 - 9)`...
 *     → 7 dòng/Unit đúng PPCT giáo viên đang dùng ("Unit 1. Hobbies - Getting started",
 *     "... - Looking back & Project" - Looking back và Project GỘP 1 dòng như PPCT thật).
 *   - Ngữ văn (Kết nối tri thức): mỗi Bài 1 file (`# BÀI 1: TÊN`), tách theo HOẠT ĐỘNG: Giới thiệu bài học +
 *     Tri thức Ngữ văn (1 dòng), mỗi văn bản đọc hiểu 1 dòng, Thực hành tiếng Việt, Viết, Nói và nghe, Củng cố.
 *   - Mọi môn còn lại (Toán, KHTN...): mỗi tiêu đề `## BÀI 1: TÊN` = 1 dòng.
 * Thêm/đổi cách dựng của 1 môn = sửa 1 dòng trong OUTLINE_BUILDERS, KHÔNG ảnh hưởng môn khác.
 *
 * Thiết kế "an toàn khi thiếu": Markdown lạ định dạng (không thấy Bài/Section nào) → `rows: []`,
 * KHÔNG lỗi, để form quay về luồng cũ (`_bai.json`) rồi tới gõ tay.
 */

import { applySgkReviewToRows } from "./khgdSgkReview";

/** Trần số ký tự trích cho mỗi bài (đủ để AI thấy các mục + ý chính, không làm phình prompt). */
export const KHGD_NOI_DUNG_MAX_CHARS = 1100;

// ---------------------------------------------------------------------------------------------
// Tiện ích chuỗi
// ---------------------------------------------------------------------------------------------

/** Bỏ dấu trích dẫn kiểu NotebookLM: " [4]", " [4, 9]". */
function stripCitations(s) {
  return String(s ?? "").replace(/\s*\[\s*\d+(?:\s*,\s*\d+)*\s*\]/g, "");
}

/** Bỏ ký hiệu in đậm/nghiêng/code Markdown (GIỮ NGUYÊN công thức $...$ để AI đọc được). */
function stripEmphasis(s) {
  return String(s ?? "").replace(/\*+/g, "").replace(/__+/g, "").replace(/`/g, "");
}

function squash(s) {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

function isAllCaps(s) {
  return s === s.toLocaleUpperCase("vi") && s !== s.toLocaleLowerCase("vi");
}

/** Tên riêng phổ biến bị hạ thường khi đổi IN HOA → dạng câu ("TIẾNG VIỆT" → "Tiếng Việt"). */
function restoreProperNouns(s) {
  return s.replace(/việt nam/g, "Việt Nam").replace(/tiếng việt/g, "tiếng Việt").replace(/ngữ văn/g, "Ngữ văn");
}

function sentenceCase(s) {
  const lower = restoreProperNouns(s.toLocaleLowerCase("vi"));
  const head = lower.charAt(0).toLocaleUpperCase("vi") + lower.slice(1);
  // Viết hoa lại chữ đầu sau dấu kết câu/hai chấm ("THỨ TỰ THỰC HIỆN. QUY TẮC" → "Thứ tự thực hiện. Quy tắc")
  return head.replace(/([.!?:]\s+)(\p{L})/gu, (_, sep, ch) => sep + ch.toLocaleUpperCase("vi"));
}

/**
 * Chuẩn hoá tiêu đề: bỏ Markdown/trích dẫn/"(Trang n)"; nếu IN HOA TOÀN BỘ thì đổi về dạng câu
 * ("TẬP HỢP CÁC SỐ HỮU TỈ" → "Tập hợp các số hữu tỉ"); phần trong ngoặc đơn được giữ nguyên.
 * Tên riêng in hoa toàn bộ sẽ mất viết hoa - tên trong `chuong_{n}_bai.json` (nếu có) được ưu tiên.
 */
export function normalizeHeading(raw) {
  let s = squash(stripEmphasis(stripCitations(raw)));
  s = s.replace(/\(\s*trang[^)]*\)/gi, "").trim();
  if (!s) return "";

  const parens = [];
  const masked = s.replace(/\([^)]*\)/g, (m) => {
    parens.push(m);
    return `\u0000${parens.length - 1}\u0000`;
  });
  const restore = (t) => t.replace(/\u0000(\d+)\u0000/g, (_, i) => parens[Number(i)]);

  return squash(restore(isAllCaps(masked.replace(/\u0000\d+\u0000/g, "")) ? sentenceCase(masked) : masked));
}

/** Dòng nội dung 1 gạch đầu dòng đã làm sạch; "" nếu là dòng cần bỏ (bảng, kẻ ngang, công thức dài). */
function cleanContentLine(rawLine) {
  const line = String(rawLine ?? "").replace(/\s+$/, "");
  const t = line.trim();
  if (!t) return "";
  if (t.startsWith("|")) return ""; // bảng (từ vựng, mục lục...) - xử lý riêng khi cần
  if (/^-{3,}$/.test(t) || /^={3,}$/.test(t)) return "";

  // Công thức hiển thị $$...$$: chỉ giữ công thức NGẮN (quy tắc/định nghĩa cốt lõi), bỏ lời giải dài
  if (t.startsWith("$$")) {
    const inner = tidyMath(t.replace(/^\$\$/, "").replace(/\$\$$/, "").trim());
    if (!inner || inner.length > 90) return "";
    return squash(inner.includes("\\") ? `$${inner}$` : inner);
  }

  return squash(
    tidyMath(stripEmphasis(stripCitations(t.replace(/^#{1,6}\s*/, "").replace(/^[*\-+>]\s+/, ""))))
  );
}

/** Gọn hoá vài lệnh LaTeX chỉ tốn ký tự mà không thêm nghĩa: \text{Lũy thừa} → Lũy thừa, \rightarrow → →. */
function tidyMath(s) {
  return String(s ?? "")
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\\(?:rightarrow|Rightarrow)/g, "→")
    .replace(/\\(?:quad|qquad)/g, " ");
}

/**
 * Ghép đoạn trích của 1 bài: dòng "Các mục" (tiêu đề mục con - luôn giữ để AI thấy đủ dàn ý bài) +
 * các dòng nội dung + dòng phụ (footer, VD từ vựng chính của Unit) rồi CẮT theo `maxChars` ở ranh
 * giới dòng. Footer được GIỮ CHỖ trước nên không bị cắt mất.
 */
export function composeNoiDung({ titles = [], bodyLines = [], footer = "", maxChars = KHGD_NOI_DUNG_MAX_CHARS }) {
  const out = [];
  let used = 0;
  const reserve = footer ? footer.length + 1 : 0;
  const budget = Math.max(0, maxChars - reserve);

  const tryPush = (line) => {
    const cost = line.length + (out.length ? 1 : 0);
    if (used + cost > budget) return false;
    out.push(line);
    used += cost;
    return true;
  };

  const cleanTitles = titles.map((t) => squash(t)).filter(Boolean);
  if (cleanTitles.length > 0) {
    const head = `Các mục: ${cleanTitles.join("; ")}`;
    tryPush(head.length > budget ? head.slice(0, Math.max(0, budget - 1)).replace(/\s+\S*$/, "") + "…" : head);
  }

  const seen = new Set();
  for (const raw of bodyLines) {
    const line = squash(raw);
    if (!line || seen.has(line)) continue;
    seen.add(line);
    if (!tryPush(`- ${line}`)) {
      // Dòng không vừa: nếu còn đủ chỗ thì CẮT ở ranh giới từ (đoạn tóm tắt dài của Ngữ văn vẫn góp được ý
      // chính, thay vì bị bỏ cả đoạn); các dòng sau bỏ hẳn.
      const room = budget - used - 4; // trừ "\n- " và dấu "…"
      if (room > 80) tryPush(`- ${line.slice(0, room).replace(/\s+\S*$/, "")}…`);
      break;
    }
  }

  if (footer) out.push(footer);
  return out.join("\n");
}

// ---------------------------------------------------------------------------------------------
// Nhãn chương
// ---------------------------------------------------------------------------------------------

function firstHeading1(lines) {
  const h = lines.find((l) => /^#\s+\S/.test(l));
  return h ? stripCitations(h.replace(/^#\s+/, "")).trim() : null;
}

/**
 * Nhãn chương lấy từ tiêu đề # đầu tiên: `# CHƯƠNG I: SỐ HỮU TỈ` → "Chương I: Số hữu tỉ".
 * `# BÀI 1: BẦU TRỜI TUỔI THƠ` (Ngữ văn) → "Bài 1: Bầu trời tuổi thơ".
 * Với Tiếng Anh (`# ... - Unit 1: Hobbies (Sở thích)`) → "Unit 1. Hobbies". Không nhận ra → null.
 */
export function extractChuongLabel(markdown) {
  const lines = String(markdown ?? "").normalize("NFC").split(/\r?\n/);
  const h1 = firstHeading1(lines);
  if (!h1) return null;

  const unit = parseUnitLabel(h1);
  if (unit) return unit;

  const m = h1.match(/^(CH[ƯU][ƠO]NG|CHỦ ĐỀ|CHỦ ĐIỂM|PHẦN|B[ÀA]I)\s+([IVXLC\d]+)\s*[:.\-–]\s*(.+)$/i);
  if (!m) return null;
  const kind = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
  const name = normalizeHeading(m[3]);
  return name ? `${kind} ${m[2].toUpperCase()}: ${name}` : null;
}

/** `Tiếng Anh 7 Global Success - Unit 1: Hobbies (Sở thích)` hoặc `Unit 1. Hobbies` → "Unit 1. Hobbies". */
function parseUnitLabel(h1) {
  const m = String(h1 ?? "").match(/Unit\s*(\d+)\s*[:.\-–]\s*(.+?)\s*(?:\([^)]*\))?\s*$/i);
  if (!m) return null;
  const name = squash(stripEmphasis(m[2]));
  return name ? `Unit ${m[1]}. ${name}` : null;
}

// ---------------------------------------------------------------------------------------------
// Tiếng Anh (Global Success): 1 Unit / file, các phần Getting started ... Project
// ---------------------------------------------------------------------------------------------

const RE_EN_SECTION = /^###\s*\d+\.\s*(.+?)\s*$/;

/** "A CLOSER LOOK 1 (Trang 10)" → "A closer look 1"; "GETTING STARTED" → "Getting started". */
function englishSectionName(raw) {
  const s = squash(stripEmphasis(stripCitations(raw)).replace(/\(\s*trang[^)]*\)/gi, ""));
  if (!s) return "";
  return isAllCaps(s) ? s.charAt(0) + s.slice(1).toLowerCase() : s;
}

/** Từ vựng chính của Unit (cột "Từ vựng" của bảng Glossary), tối đa `limit` từ. */
function extractGlossaryHeadwords(lines, limit = 12) {
  const words = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t.startsWith("|")) continue;
    const cells = t.split("|").map((c) => c.trim());
    const first = squash(stripEmphasis(cells[1] || ""));
    if (!first || /^[:\-\s]+$/.test(first) || /^từ vựng$/i.test(first)) continue;
    words.push(first);
    if (words.length >= limit) break;
  }
  return words;
}

function parseEnglishSections(lines) {
  const sections = [];
  let cur = null;
  for (const line of lines) {
    const mSec = line.match(RE_EN_SECTION);
    if (mSec) {
      cur = { title: englishSectionName(mSec[1]), lines: [] };
      if (cur.title) sections.push(cur);
      else cur = null;
      continue;
    }
    // Hết phạm vi phần khi gặp tiêu đề cấp 1-2 (VD "## III. DANH MỤC TỪ VỰNG")
    if (/^#{1,2}\s+\S/.test(line)) {
      cur = null;
      continue;
    }
    if (cur) cur.lines.push(line);
  }
  return sections;
}

function buildEnglishRows(markdown) {
  const lines = String(markdown ?? "").normalize("NFC").split(/\r?\n/);
  const unitLabel = parseUnitLabel(firstHeading1(lines));
  if (!unitLabel) return [];

  const sections = parseEnglishSections(lines);
  if (sections.length === 0) return [];

  const glossary = extractGlossaryHeadwords(lines);
  const footer = glossary.length > 0 ? `Từ vựng chính của Unit: ${glossary.join(", ")}.` : "";

  // Looking back + Project → 1 dòng "Looking back & Project" (đúng PPCT Tiếng Anh giáo viên đang dùng)
  const merged = [];
  for (const sec of sections) {
    const key = sec.title.toLowerCase();
    const prev = merged[merged.length - 1];
    if (key === "project" && prev && prev.title.toLowerCase() === "looking back") {
      prev.title = "Looking back & Project";
      prev.lines = [...prev.lines, ...sec.lines];
    } else {
      merged.push({ title: sec.title, lines: [...sec.lines] });
    }
  }

  return merged.map((sec) => ({
    tenBai: `${unitLabel} - ${sec.title}`,
    noiDung: composeNoiDung({
      bodyLines: sec.lines.map(cleanContentLine),
      footer,
    }),
    // Phiên 50: mỗi dòng Unit = 1 tiết đúng PPCT giáo viên đang dùng → CHỐT số tiết (không chia lại theo quỹ tiết);
    // cả Unit là 1 khối (ôn tập/kiểm tra chỉ chèn GIỮA 2 Unit).
    soTiet: 1,
    tietChot: true,
    blockKey: "unit",
    soBai: null,
  }));
}

// ---------------------------------------------------------------------------------------------
// Mọi môn còn lại: mỗi "BÀI k: TÊN" 1 dòng
// ---------------------------------------------------------------------------------------------

const RE_BAI = /^(#{1,6})\s*B[ÀA]I\s+(\d+)\s*[:.\-–]?\s*(.+?)\s*$/i;
const RE_ANY_HEADING = /^(#{1,6})\s+\S/;

function buildBaiRows(markdown, lessonIndex = []) {
  const lines = String(markdown ?? "").normalize("NFC").split(/\r?\n/);

  const nameBySoBai = new Map();
  for (const l of lessonIndex || []) {
    if (l && l.soBai != null && typeof l.tenBai === "string" && l.tenBai.trim()) {
      nameBySoBai.set(Number(l.soBai), l.tenBai.trim());
    }
  }

  /** @type {Array<{ soBai: number, ten: string, level: number, titles: string[], body: string[] }>} */
  const bai = [];
  let cur = null;

  for (const rawLine of lines) {
    const line = stripCitations(rawLine);
    const mBai = line.match(RE_BAI);
    if (mBai) {
      const ten = normalizeHeading(mBai[3]);
      cur = ten ? { soBai: Number(mBai[2]), ten, level: mBai[1].length, titles: [], body: [] } : null;
      if (cur) bai.push(cur);
      continue;
    }

    const mHead = line.match(RE_ANY_HEADING);
    if (mHead) {
      const level = mHead[1].length;
      // Tiêu đề CÙNG hoặc CAO HƠN cấp của Bài (VD "## TỔNG HỢP CÁC DẠNG BÀI TẬP") → hết phạm vi bài
      if (!cur || level <= cur.level) {
        cur = null;
        continue;
      }
      cur.titles.push(normalizeHeading(line.replace(/^#{1,6}\s*/, "").replace(/^\d+\.\s*/, "")));
      continue;
    }

    if (cur) {
      const text = cleanContentLine(line);
      if (text) cur.body.push(text);
    }
  }

  return bai.map((b) => ({
    tenBai: `Bài ${b.soBai}. ${nameBySoBai.get(b.soBai) || b.ten}`,
    noiDung: composeNoiDung({ titles: b.titles, bodyLines: b.body }),
    // Phiên 50: Markdown KHÔNG ghi số tiết mỗi Bài → để form chia theo quỹ tiết học kì (khgdSchedule.js)
    blockKey: `bai${b.soBai}`,
    soBai: b.soBai,
  }));
}

// ---------------------------------------------------------------------------------------------
// Ngữ văn (Kết nối tri thức): mỗi Bài 1 file, các phần I-VII → nhiều dòng PPCT/Bài
// ---------------------------------------------------------------------------------------------
// Định dạng thật (Ngữ văn 7, Bài 1): `# BÀI 1: TÊN` → `## I. GIỚI THIỆU CHUNG...` `## II. TRI THỨC NGỮ VĂN`
// `## III. ĐỌC HIỂU CÁC VĂN BẢN` (mỗi `### k. Văn bản k: Tên (Tác giả)` gồm `#### a./b./c.`) `## IV. THỰC HÀNH
// TIẾNG VIỆT` `## V. THỰC HÀNH VIẾT: ...` `## VI. THỰC HÀNH NÓI VÀ NGHE: ...` `## VII. CỦNG CỐ VÀ MỞ RỘNG`.
// PPCT Ngữ văn liệt kê theo HOẠT ĐỘNG trong Bài (không phải 1 dòng/Bài) nên tách: Giới thiệu bài học + Tri
// thức Ngữ văn (gộp 1 dòng), mỗi văn bản đọc hiểu 1 dòng, rồi Thực hành tiếng Việt / Viết / Nói và nghe /
// Củng cố. Tên dòng lấy TỪ TIÊU ĐỀ Markdown (không tự đặt), giáo viên vẫn sửa được trong bảng.

const NGU_VAN_MAX_CHARS = 1600;
const NGU_VAN_INTRO_MAX_CHARS = 2000; // = KHGD_NOI_DUNG_HARD_MAX_CHARS (contentGenerationLimits.js): server cắt ở mức này // đoạn tóm tắt văn bản dài hơn Toán/Tiếng Anh nên nới trần trích

/** Bỏ dấu tiếng Việt + về chữ thường - dùng để nhận diện loại phần bằng từ khoá, không phụ thuộc dấu. */
function foldVN(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();
}

function headingLevel(line) {
  const m = String(line ?? "").match(/^(#{1,6})\s+\S/);
  return m ? m[1].length : 0;
}

/** Tách các dòng thành các phần theo tiêu đề đúng cấp `level` (dòng trước tiêu đề đầu tiên bị bỏ - VD câu trích dẫn đầu bài). */
function splitByLevel(lines, level) {
  const parts = [];
  let cur = null;
  for (const line of lines) {
    if (headingLevel(line) === level) {
      cur = { titleRaw: line.replace(/^#+\s*/, ""), lines: [] };
      parts.push(cur);
    } else if (cur) {
      cur.lines.push(line);
    }
  }
  return parts;
}

/** Bảng Markdown → các dòng chữ ("A — B — C"): bảng "Củng cố và mở rộng" chứa đề tài/nhân vật/thông điệp từng văn bản. */
function expandTables(lines) {
  const out = [];
  let headerSeen = false;
  for (const raw of lines) {
    const t = String(raw ?? "").trim();
    if (!t.startsWith("|")) {
      headerSeen = false;
      out.push(raw);
      continue;
    }
    const cells = t.split("|").slice(1, -1).map((c) => squash(stripEmphasis(stripCitations(c))));
    if (cells.length === 0 || cells.every((c) => /^:?-{2,}:?$/.test(c) || c === "")) continue; // dòng phân cách
    out.push(headerSeen ? `* ${cells.filter(Boolean).join(" — ")}` : `* Bảng gồm các cột: ${cells.filter(Boolean).join(" — ")}`);
    headerSeen = true;
  }
  return out;
}

/** "1. Văn bản 1: Bầy chim chìa vôi (Nguyễn Quang Thiều)" → "Văn bản 1: Bầy chim chìa vôi" (bỏ số thứ tự + phần tác giả/trích). */
function nguVanTextName(raw) {
  const s = stripEmphasis(stripCitations(raw))
    .replace(/^(?:\d+|[a-z])\.\s+/i, "")
    .replace(/\s*\([^)]*\)/g, "");
  return normalizeHeading(s);
}

/** Tên phần: bỏ số La Mã đầu, "Thực hành viết:" → "Viết:", "Thực hành nói và nghe:" → "Nói và nghe:". */
function nguVanSectionName(raw) {
  let s = normalizeHeading(String(raw ?? "").replace(/^[IVXLC]+\.\s*/, ""));
  s = s.replace(/^Thực hành viết:/i, "Viết:").replace(/^Thực hành nói và nghe:/i, "Nói và nghe:");
  return s.charAt(0).toLocaleUpperCase("vi") + s.slice(1);
}

/** Dòng nội dung của 1 phần; `withLabels`: giữ tiêu đề con (a. Thông tin chung...) làm nhãn "Thông tin chung:". */
function nguVanBodyLines(lines, { withLabels }) {
  const out = [];
  for (const line of expandTables(lines)) {
    if (headingLevel(line) > 0) {
      if (withLabels) {
        const label = nguVanTextName(line.replace(/^#+\s*/, ""));
        if (label) out.push(label.endsWith(":") ? label : `${label}:`);
      }
      continue;
    }
    const text = cleanContentLine(line);
    if (text) out.push(text);
  }
  return out;
}

function buildNguVanRows(markdown) {
  const lines = String(markdown ?? "").normalize("NFC").split(/\r?\n/);

  const baiHeads = [];
  lines.forEach((ln, i) => {
    const m = stripCitations(ln).match(RE_BAI);
    if (m) {
      const ten = normalizeHeading(m[3]);
      if (ten) baiHeads.push({ i, level: m[1].length, soBai: Number(m[2]), ten });
    }
  });
  if (baiHeads.length === 0) return [];

  const rows = [];
  baiHeads.forEach((b, k) => {
    const rowsBefore = rows.length;
    const end = k + 1 < baiHeads.length ? baiHeads[k + 1].i : lines.length;
    const prefix = `Bài ${b.soBai}. ${b.ten} - `;
    const sections = splitByLevel(lines.slice(b.i + 1, end), b.level + 1);

    for (let si = 0; si < sections.length; si++) {
      const sec = sections[si];
      const fold = foldVN(sec.titleRaw);
      const next = sections[si + 1];

      // Giới thiệu bài học + Tri thức Ngữ văn → 1 dòng (đúng cách PPCT Ngữ văn thường gộp)
      if (fold.includes("gioi thieu") && next && foldVN(next.titleRaw).includes("tri thuc")) {
        const introSubs = splitByLevel(sec.lines, b.level + 2);
        const triThucSubs = splitByLevel(next.lines, b.level + 2);
        // Thứ tự ưu tiên khi cắt trần ký tự: TRI THỨC NGỮ VĂN (nội dung chính của tiết này) → YÊU CẦU CẦN ĐẠT →
        // đoạn dẫn nhập (văn kể chuyện, ít giá trị cho việc soạn mục tiêu/SWD nhất nên đặt cuối, cắt trước).
        const isYeuCau = (x) => foldVN(x.titleRaw).includes("yeu cau");
        const bodyLines = [
          // giữ nhãn tiêu đề con (Đề tài và chi tiết:/Tính cách nhân vật:...) vì các gạch đầu dòng bên dưới là định nghĩa
          // "Là những đặc điểm riêng..." không có chủ ngữ nếu thiếu nhãn
          ...nguVanBodyLines(next.lines, { withLabels: true }),
          ...introSubs.filter(isYeuCau).flatMap((x) => nguVanBodyLines(x.lines, { withLabels: false })),
          ...introSubs.filter((x) => !isYeuCau(x)).flatMap((x) => nguVanBodyLines(x.lines, { withLabels: false })),
        ];
        rows.push({
          tenBai: `${prefix}Giới thiệu bài học và ${nguVanSectionName(next.titleRaw)}`,
          noiDung: composeNoiDung({
            titles: [...introSubs, ...triThucSubs].map((x) => nguVanTextName(x.titleRaw)),
            bodyLines,
            maxChars: NGU_VAN_INTRO_MAX_CHARS, // hàng GỘP 2 phần nên được nới trần hơn
          }),
        });
        si++; // đã dùng luôn phần "Tri thức"
        continue;
      }

      // Đọc hiểu các văn bản → mỗi văn bản 1 dòng
      if (fold.includes("doc hieu")) {
        const texts = splitByLevel(sec.lines, b.level + 2);
        if (texts.length > 0) {
          for (const t of texts) {
            rows.push({
              tenBai: `${prefix}${nguVanTextName(t.titleRaw)}`,
              noiDung: composeNoiDung({ bodyLines: nguVanBodyLines(t.lines, { withLabels: true }), maxChars: NGU_VAN_MAX_CHARS }),
            });
          }
          continue;
        }
      }

      const subs = splitByLevel(sec.lines, b.level + 2);
      rows.push({
        tenBai: `${prefix}${nguVanSectionName(sec.titleRaw)}`,
        noiDung: composeNoiDung({
          titles: subs.length >= 2 ? subs.map((x) => nguVanTextName(x.titleRaw)) : [],
          bodyLines: nguVanBodyLines(sec.lines, { withLabels: false }),
          maxChars: NGU_VAN_MAX_CHARS,
        }),
      });
    }
    // Phiên 50: gắn khối/số Bài cho MỌI dòng vừa dựng của Bài này (mọi hoạt động của 1 Bài không bị tách khi chèn ôn tập/kiểm tra)
    for (let i = rowsBefore; i < rows.length; i++) {
      rows[i].blockKey = `bai${b.soBai}`;
      rows[i].soBai = b.soBai;
    }
  });
  return rows;
}

// ---------------------------------------------------------------------------------------------
// API chính
// ---------------------------------------------------------------------------------------------

const OUTLINE_BUILDERS = {
  Tieng_Anh: (markdown) => buildEnglishRows(markdown),
  Ngu_Van: (markdown) => buildNguVanRows(markdown),
};

/**
 * @param {{ subject: string, markdown: string, lessonIndex?: Array<{soBai?: number|null, tenBai: string}> }} args
 * @returns {{ chuong: string|null, rows: Array<{tenBai: string, noiDung: string}>, source: "markdown"|"none" }}
 */
export function buildKhgdOutline({ subject, markdown, lessonIndex = [] }) {
  const md = String(markdown ?? "");
  const chuong = md ? extractChuongLabel(md) : null;
  const specific = OUTLINE_BUILDERS[subject];

  let rows = [];
  if (md) {
    try {
      rows = specific ? specific(md, lessonIndex) || [] : [];
      // Bộ đọc riêng không nhận ra định dạng → thử bộ đọc "Bài" chung trước khi bỏ cuộc
      if (rows.length === 0) rows = buildBaiRows(md, lessonIndex);
    } catch {
      rows = []; // Markdown lạ gây lỗi bóc tách → im lặng quay về luồng cũ, không cản giáo viên
    }
  }

  // Phiên 50: phần "Ôn tập/Đánh giá giữa/cuối học kì" CÓ TRONG SGK → dòng loai:"onTap" (ưu tiên hơn đề xuất tự động)
  if (rows.length > 0) {
    try {
      rows = applySgkReviewToRows(rows, md, { normalizeTitle: normalizeHeading });
    } catch {
      /* không cản luồng gợi ý */
    }
  }

  return { chuong, rows, source: rows.length > 0 ? "markdown" : "none" };
}
