import { extractChuDe, parseTiengVietChapter, buildTiengVietRows } from "./khgdTieuHocTiengVietParser";

/**
 * khgdTieuHocOutlineService.js  (Phiên 48b)
 * Từ nội dung Markdown 1 chương SGK (kho GitHub kiến thức) dựng "gợi ý" cho bảng Khung KHGD Tiểu
 * học: (1) tên Chủ đề đúng như SGK (thay vì "Chương 1"), (2) với môn ĐÃ có bộ đọc riêng (hiện
 * CHỈ Tiếng Việt) - các dòng theo tiết đúng bản mẫu giáo viên.
 *
 * Thiết kế "an toàn khi thiếu": môn chưa có bộ đọc / Markdown khác định dạng → `rows: []` (KHÔNG
 * lỗi) để form quay về luồng cũ (nạp tên bài từ `chuong_{n}_bai.json`). Mỗi môn có định dạng
 * Markdown riêng nên bộ đọc viết RIÊNG theo môn (đúng nguyên tắc "isolation over DRY") - thêm môn
 * mới = viết thêm 1 parser + 1 dòng trong OUTLINE_BUILDERS, KHÔNG sửa các môn khác.
 */

const OUTLINE_BUILDERS = {
  Tieng_Viet: (markdown, lessonIndex) => {
    const parsed = parseTiengVietChapter(markdown);
    return buildTiengVietRows(parsed, lessonIndex);
  },
};

/**
 * @param {{ subject: string, markdown: string, lessonIndex?: Array<{soBai?: number|null, tenBai: string}> }} args
 * @returns {{ chuDe: string|null, tuanTu: number|null, tuanDen: number|null, rows: Array<{tenBai: string, soTiet: number, nhomTiet: string}>, source: "markdown"|"none" }}
 */
export function buildKhgdTieuHocOutline({ subject, markdown, lessonIndex = [] }) {
  const chuDeInfo = extractChuDe(markdown);
  const builder = OUTLINE_BUILDERS[subject];

  let rows = [];
  if (builder && markdown) {
    try {
      rows = builder(markdown, lessonIndex) || [];
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

export function supportsKhgdTieuHocRows(subject) {
  return Boolean(OUTLINE_BUILDERS[subject]);
}
