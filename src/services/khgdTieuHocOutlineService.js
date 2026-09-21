import { extractChuDe, parseTiengVietChapter, buildTiengVietRows, normalizeTitle } from "./khgdTieuHocTiengVietParser";
import { applySgkReviewToRows } from "./khgdSgkReview";
import { parseBaiHeadings, buildBaiRows } from "./khgdTieuHocBaiParser";
import { parseUnit, buildUnitRows } from "./khgdTieuHocUnitParser";

/**
 * khgdTieuHocOutlineService.js  (Phiên 48b)
 * Từ nội dung Markdown 1 chương SGK (kho GitHub kiến thức) dựng "gợi ý" cho bảng Khung KHGD Tiểu
 * học: (1) tên Chủ đề đúng như SGK (thay vì "Chương 1"), (2) các dòng bảng.
 *
 * Mỗi môn có định dạng Markdown RIÊNG (đã đối chiếu 5 file thật: Tiếng Việt có 2 biến thể, Toán,
 * Tiếng Anh, Đạo đức, Tự nhiên và Xã hội - không file nào giống file nào) nên bộ đọc viết RIÊNG theo
 * môn (đúng nguyên tắc "isolation over DRY"):
 *   - Tiếng Việt: từng TIẾT (Đọc/Viết/Nói và nghe/...) - đã có mẫu giáo viên.
 *   - Tiếng Anh: từng Lesson của Unit.
 *   - Mọi môn còn lại (Toán, Đạo đức, Tự nhiên và Xã hội...): từng Bài - `## Bài k: ...`.
 * Thêm/đổi cách dựng của 1 môn = sửa 1 dòng trong OUTLINE_BUILDERS, KHÔNG ảnh hưởng môn khác.
 *
 * Thiết kế "an toàn khi thiếu": Markdown lạ định dạng (không thấy Bài/Lesson nào) → `rows: []`,
 * KHÔNG lỗi, để form quay về luồng cũ (nạp tên bài từ `chuong_{n}_bai.json`).
 */

const OUTLINE_BUILDERS = {
  Tieng_Viet: (markdown, lessonIndex) => buildTiengVietRows(parseTiengVietChapter(markdown), lessonIndex),
  Tieng_Anh: (markdown) => buildUnitRows(parseUnit(markdown)),
};

/** Mặc định cho mọi môn chưa có bộ đọc riêng: mỗi tiêu đề "Bài k: ..." = 1 dòng. */
function buildGenericRows(markdown, lessonIndex) {
  return buildBaiRows(parseBaiHeadings(markdown), lessonIndex);
}

/**
 * @param {{ subject: string, markdown: string, lessonIndex?: Array<{soBai?: number|null, tenBai: string}> }} args
 * @returns {{ chuDe: string|null, tuanTu: number|null, tuanDen: number|null, rows: Array<{tenBai: string, soTiet: number, nhomTiet: string, blockKey?: string, soBai?: number|null, tietChot?: boolean, loai?: string, nguon?: string, moc?: string}>, source: "markdown"|"none" }}
 */
export function buildKhgdTieuHocOutline({ subject, markdown, lessonIndex = [] }) {
  const chuDeInfo = extractChuDe(markdown);
  const builder = OUTLINE_BUILDERS[subject] || buildGenericRows;

  let rows = [];
  if (builder && markdown) {
    try {
      rows = builder(markdown, lessonIndex) || [];
      // Phiên 50: phần "Ôn tập/Đánh giá giữa/cuối học kì" CÓ TRONG SGK → thành dòng loai:"onTap" (ưu tiên hơn đề xuất tự động)
      if (rows.length > 0) rows = applySgkReviewToRows(rows, markdown, { normalizeTitle });
    } catch {
      rows = []; // Markdown lạ gây lỗi bóc tách → im lặng quay về luồng cũ, không cản giáo viên
    }
  }

  return {
    chuDe: chuDeInfo?.chuDe || null,
    tuanTu: chuDeInfo?.tuanTu ?? null,
    tuanDen: chuDeInfo?.tuanDen ?? null,
    rows,
    source: rows.length > 0 ? "markdown" : "none",
  };
}
