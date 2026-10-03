/**
 * vocabLessonSuggest.js (Phiên 51d - tab "Soạn từ vựng")
 * Biến phụ lục bài học `chuong_{n}_bai.json` (cùng file Soạn giáo án/Khung KHGD đang dùng) thành GỢI Ý cho
 * phần đầu bản soạn: ô "Bài học" (VD "Getting started") và ô "Trang SGK" (VD "8, 9"). Hàm thuần (không mạng/DOM).
 *
 * Mỗi phần tử trong JSON: { soBai?, tenBai, noiDungCotLoi?, trang? }.
 *  - "trang" (MỚI, tuỳ chọn): số trang SGK của bài - chuỗi "8, 9" / "8-9", số 8, hoặc mảng [8, 9].
 *    Chấp nhận thêm tên khoá "soTrang", "trangSGK". Cũng đọc được trang ghi trong tên bài: "Getting started (trang 8-9)".
 *  - KHÔNG có trang trong dữ liệu → để trống ô Trang, TUYỆT ĐỐI không đoán số trang.
 */

/** Chuẩn hoá trang về chuỗi hiển thị "8, 9" / "8-9". Rỗng/không hợp lệ → "". */
export function normalizePages(raw) {
  if (raw === null || raw === undefined) return "";
  if (Array.isArray(raw)) return raw.map((x) => normalizePages(x)).filter(Boolean).join(", ");
  const s = String(raw).replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
  return /^\d+(?:\s*[-,]\s*\d+)*$/.test(s) ? s.replace(/\s*,\s*/g, ", ").replace(/\s*-\s*/g, "-") : "";
}

const PAGE_IN_NAME = /\s*[([]\s*(?:trang|tr\.?|page|pages|p\.?|pp\.?)\s*([\d\s,\-–—]+)[)\]]\s*$/i;

/** "Getting started (trang 8-9)" → { name: "Getting started", trang: "8-9" }. */
export function extractPagesFromName(tenBai) {
  const text = String(tenBai ?? "").trim();
  const m = text.match(PAGE_IN_NAME);
  if (!m) return { name: text, trang: "" };
  return { name: text.replace(PAGE_IN_NAME, "").trim(), trang: normalizePages(m[1]) };
}

/**
 * Tên bài trong phụ lục thường có dạng "Unit 1. Hobbies - Getting started" → lấy phần tên bài học sau dấu " - ".
 * Không có " - " thì bỏ tiền tố "Unit N." / "Bài N:" nếu có.
 */
export function lessonNameForHeader(tenBai) {
  const { name } = extractPagesFromName(tenBai);
  const dash = name.split(/\s+[-–—]\s+/);
  if (dash.length > 1) return dash[dash.length - 1].trim();
  return name.replace(/^(?:unit|bài|lesson)\s*\d+\s*[.:)-]\s*/i, "").trim() || name;
}

/** Danh sách phụ lục (đã lọc từ fetchLessonIndex) → [{ key, label, baiHoc, trang }] để hiện thành nút gợi ý. */
export function buildLessonSuggestions(lessons = []) {
  const out = [];
  const seen = new Set();
  for (const l of lessons || []) {
    if (!l || typeof l.tenBai !== "string" || !l.tenBai.trim()) continue;
    const fromName = extractPagesFromName(l.tenBai);
    const baiHoc = lessonNameForHeader(l.tenBai);
    const trang = normalizePages(l.trang) || fromName.trang;
    const key = `${baiHoc}|${trang}`.toLowerCase();
    if (!baiHoc || seen.has(key)) continue;
    seen.add(key);
    out.push({ key, label: fromName.name, baiHoc, trang });
  }
  return out;
}
