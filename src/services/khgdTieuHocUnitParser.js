import { extractChuDe } from "./khgdTieuHocTiengVietParser";

/**
 * khgdTieuHocUnitParser.js  (Phiên 48b)
 * Bộ đọc riêng cho TIẾNG ANH Tiểu học. Markdown thật (đã đối chiếu 1 file): tiêu đề
 * `# Unit 1: At My Birthday Party (Chủ đề 1: Tại bữa tiệc sinh nhật của tớ)`, rồi `### Lesson 1`,
 * `### Lesson 2`, `### Lesson 3`; mỗi Lesson gồm các "Hoạt động n: ..." (Listen and repeat, Point and
 * say...). Mỗi Lesson thành 1 dòng bảng "Unit 1: At My Birthday Party - Lesson 1".
 *
 * ⚠️ 2 giả định (Markdown KHÔNG nói rõ): (1) 1 Lesson = 1 tiết - mặc định, ghi `### Lesson 1 (2 tiết)`
 * trong Markdown để đổi, hoặc sửa tay ở bảng; (2) "Chủ đề" là tiêu đề Unit tiếng Anh (bản tiếng Việt
 * trong ngoặc bị bỏ, vì cột Chủ đề hẹp). Chưa có mẫu KHGD Tiếng Anh Tiểu học của giáo viên để đối chiếu.
 */

const RE_LESSON = /^#{2,6}\s*Lesson\s+(\d+)\b(.*)$/i;
const RE_TIET = /\(\s*(\d+)\s*tiết\s*\)/i;

/**
 * @param {string} markdown
 * @returns {{ unit: string|null, lessons: Array<{ so: number, soTiet: number|null }> }}
 */
export function parseUnit(markdown) {
  const unit = extractChuDe(markdown)?.chuDe || null;
  const lessons = [];
  for (const line of String(markdown ?? "").normalize("NFC").split(/\r?\n/)) {
    const m = line.match(RE_LESSON);
    if (!m) continue;
    const tiet = m[2].match(RE_TIET);
    lessons.push({ so: Number(m[1]), soTiet: tiet ? Number(tiet[1]) : null });
  }
  return { unit, lessons };
}

/**
 * @returns {Array<{ tenBai: string, soTiet: number, nhomTiet: string }>} - rỗng nếu thiếu Unit hoặc Lesson
 */
export function buildUnitRows(parsed) {
  if (!parsed?.unit || !parsed.lessons?.length) return [];
  return parsed.lessons.map((l) => ({
    tenBai: `${parsed.unit} - Lesson ${l.so}`,
    soTiet: l.soTiet && l.soTiet > 0 ? l.soTiet : 1,
    nhomTiet: "",
    // Phiên 50: cả Unit là 1 khối; số tiết CHỈ coi là đã chốt khi Markdown ghi `(N tiết)` (mặc định 1 tiết/Lesson là giả định)
    blockKey: "unit",
    soBai: null,
    tietChot: !!(l.soTiet && l.soTiet > 0),
  }));
}
