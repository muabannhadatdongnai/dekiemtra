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
 *   - Mọi môn còn lại (Toán, Ngữ văn, KHTN...): mỗi tiêu đề `## BÀI 1: TÊN` = 1 dòng.
 * Thêm/đổi cách dựng của 1 môn = sửa 1 dòng trong OUTLINE_BUILDERS, KHÔNG ảnh hưởng môn khác.
 *
 * Thiết kế "an toàn khi thiếu": Markdown lạ định dạng (không thấy Bài/Section nào) → `rows: []`,
 * KHÔNG lỗi, để form quay về luồng cũ (`_bai.json`) rồi tới gõ tay.
 */

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

function sentenceCase(s) {
  const lower = s.toLocaleLowerCase("vi");
  const head = lower.charAt(0).toLocaleUpperCase("vi") + lower.slice(1);
  // Viết hoa lại chữ đầu sau dấu kết câu ("THỨ TỰ THỰC HIỆN. QUY TẮC" → "Thứ tự thực hiện. Quy tắc")
  return head.replace(/([.!?]\s+)(\p{L})/gu, (_, sep, ch) => sep + ch.toLocaleUpperCase("vi"));
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
      // dòng đầu tiên quá dài → cắt ở ranh giới từ để vẫn có ít nội dung; các dòng sau bỏ hẳn
      if (out.length <= 1) {
        const room = budget - used - 4;
        if (room > 40) tryPush(`- ${line.slice(0, room).replace(/\s+\S*$/, "")}…`);
      }
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
 * Với Tiếng Anh (`# ... - Unit 1: Hobbies (Sở thích)`) → "Unit 1. Hobbies". Không nhận ra → null.
 */
export function extractChuongLabel(markdown) {
  const lines = String(markdown ?? "").normalize("NFC").split(/\r?\n/);
  const h1 = firstHeading1(lines);
  if (!h1) return null;

  const unit = parseUnitLabel(h1);
  if (unit) return unit;

  const m = h1.match(/^(CH[ƯU][ƠO]NG|CHỦ ĐỀ|CHỦ ĐIỂM|PHẦN)\s+([IVXLC\d]+)\s*[:.\-–]\s*(.+)$/i);
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
  }));
}

// ---------------------------------------------------------------------------------------------
// API chính
// ---------------------------------------------------------------------------------------------

const OUTLINE_BUILDERS = {
  Tieng_Anh: (markdown) => buildEnglishRows(markdown),
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

  return { chuong, rows, source: rows.length > 0 ? "markdown" : "none" };
}
