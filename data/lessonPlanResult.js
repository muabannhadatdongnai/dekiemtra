/**
 * lessonPlanResult.js
 * Gộp toàn bộ dữ liệu sau khi tạo giáo án thành 1 object DUY NHẤT - cùng triết lý examResult.js,
 * tránh nhiều useState() rời rạc trong page.js khi thêm mode "Soạn giáo án".
 *
 * @typedef {Object} LessonPlanResult
 * @property {Object|null} lessonPlan - JSON giáo án AI trả về (yeuCauCanDat, doDungDayHoc, hoatDong...)
 * @property {Array<{key,label,minutes}>} timeline - tính thuần code, xem lessonPlanTemplates.js
 * @property {Array<string>} warnings
 * @property {Object|null} meta - thông tin hiển thị (tên bài, lớp, môn, số cột, công văn áp dụng...)
 */

export const EMPTY_LESSON_PLAN_RESULT = {
  lessonPlan: null,
  timeline: [],
  warnings: [],
  meta: null,
};

export function buildLessonPlanResult(apiResponse, meta) {
  return {
    lessonPlan: apiResponse.lessonPlan || null,
    timeline: apiResponse.timeline || [],
    warnings: apiResponse.warnings || [],
    meta,
  };
}
