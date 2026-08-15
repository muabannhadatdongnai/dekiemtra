/**
 * outlineResult.js
 * Gộp toàn bộ dữ liệu sau khi tạo đề cương ôn tập thành 1 object DUY NHẤT - cùng triết lý
 * examResult.js/lessonPlanResult.js, tránh nhiều useState() rời rạc trong page.js.
 *
 * @typedef {Object} OutlineResult
 * @property {Object|null} outline - JSON đề cương AI trả về (kienThucCotLoi, dangBai,
 *   nganHangBaiTap, thuNgoPhuHuynh)
 * @property {Array<string>} warnings
 * @property {Object|null} meta - thông tin hiển thị (môn, lớp, phạm vi chương...)
 */

export const EMPTY_OUTLINE_RESULT = {
  outline: null,
  warnings: [],
  meta: null,
};

export function buildOutlineResult(apiResponse, meta) {
  return {
    outline: apiResponse.outline || null,
    warnings: apiResponse.warnings || [],
    meta: { ...meta, chapterLabel: apiResponse.chapterLabel || meta?.chapterLabel },
  };
}
