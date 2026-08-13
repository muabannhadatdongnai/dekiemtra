/**
 * vietnameseExamResult.js
 * Gộp toàn bộ dữ liệu sau khi tạo "Đề Tiếng Việt Tiểu học" thành 1 object DUY NHẤT - cùng triết lý
 * examResult.js/lessonPlanResult.js, tránh nhiều useState() rời rạc trong page.js.
 *
 * @typedef {Object} VietnameseExamResult
 * @property {Object} results - dữ liệu từng khối ĐÃ tạo thành công, dạng { [blockKey]: <dữ liệu
 *           riêng của khối đó> } - VD results.docTham = { nguLieu, cauHoi }. Khối chưa chọn/lỗi sẽ
 *           KHÔNG có mặt ở đây (không phải key -> null).
 * @property {Array<string>} warnings
 * @property {Object|null} meta - thông tin hiển thị (lớp, tên trường, mã đề...)
 */

export const EMPTY_VIETNAMESE_EXAM_RESULT = {
  results: {},
  warnings: [],
  meta: null,
};

export function buildVietnameseExamResult(apiResponse, meta) {
  return {
    results: apiResponse.results || {},
    warnings: apiResponse.warnings || [],
    meta,
  };
}
