/**
 * lessonPlanBlueprint.js
 * "Bản thiết kế" đầu vào gửi lên /api/generate-lesson-plan - cùng triết lý examBlueprint.js:
 * 1 nơi duy nhất định nghĩa input, tránh lệch giữa LessonPlanForm.jsx (client) và route.js (server).
 *
 * @typedef {Object} LessonPlanBlueprint
 * @property {string} tenBai - Tên bài soạn
 * @property {string} subject - mã môn học, xem src/data/config.js -> SUBJECTS (bỏ qua nếu Mầm non)
 * @property {number|"MAM_NON"} grade - xem lessonPlanTemplates.js -> LESSON_PLAN_GRADES
 * @property {number} [volume] - 1 | 2 (bỏ qua nếu Mầm non)
 * @property {string} [chapterId] - mã chương/bài lấy từ kho SGK Markdown (bỏ qua nếu Mầm non)
 * @property {number} soTiet
 * @property {"one_column"|"two_column"} columnMode
 * @property {string} noiDungCotLoi - giáo viên tự gõ ý chính/kiến thức trọng tâm
 * @property {string[]} integrations - danh sách key bật trong lessonPlanIntegrations.js
 * @property {"theo_chuong"|"theo_mau"|"ket_hop"} [sampleMode] - "theo_chuong" (mặc định, không
 *   dùng giáo án mẫu) | "theo_mau" (ưu tiên bám sát cách trình bày mẫu) | "ket_hop" (áp dụng cách
 *   trình bày mẫu nhưng vẫn ưu tiên SGK cho nội dung) - xem lessonPlanSampleSchema.js
 * @property {Object|null} [sampleSpec] - spec cấu trúc/trình bày đã phân tích từ file mẫu (null
 *   nếu sampleMode = "theo_chuong")
 * @property {string|null} [sampleReferenceText] - đoạn trích văn bản mẫu (nếu trích được bằng
 *   docx-text/pdf-text), chỉ dùng khi sampleMode = "theo_mau"
 */

export function buildLessonPlanBlueprint({
  tenBai,
  subject,
  grade,
  volume = 1,
  chapterId,
  soTiet = 1,
  columnMode = "one_column",
  noiDungCotLoi = "",
  integrations = [],
  sampleMode = "theo_chuong",
  sampleSpec = null,
  sampleReferenceText = null,
}) {
  return {
    tenBai,
    subject,
    grade,
    volume,
    chapterId,
    soTiet,
    columnMode,
    noiDungCotLoi,
    integrations,
    sampleMode,
    sampleSpec,
    sampleReferenceText,
  };
}
