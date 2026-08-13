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
 * @property {"bai_moi"|"on_tap"|"thuc_hanh"} [lessonType] - "loại bài" - xem LESSON_TYPES trong
 *   lessonPlanTemplates.js, ảnh hưởng tên gọi hoạt động "Khám phá" (VD đổi thành "Hệ thống hoá
 *   kiến thức" khi là bài ôn tập, thay vì luôn gắn cứng "Khám phá" cho MỌI bài như trước đây)
 * @property {"theo_chuong"|"theo_mau"|"ket_hop"} [sampleMode] - "theo_chuong" (mặc định, không
 *   dùng giáo án mẫu) | "theo_mau" (ưu tiên bám sát cách trình bày mẫu) | "ket_hop" (áp dụng cách
 *   trình bày mẫu nhưng vẫn ưu tiên SGK cho nội dung) - xem lessonPlanSampleSchema.js
 * @property {Object|null} [sampleSpec] - spec cấu trúc/trình bày đã phân tích từ file mẫu (null
 *   nếu sampleMode = "theo_chuong")
 * @property {string|null} [sampleReferenceText] - đoạn trích văn bản mẫu (nếu trích được bằng
 *   docx-text/pdf-text), chỉ dùng khi sampleMode = "theo_mau"
 * @property {{styleId: string, customStyleText: string|null}|null} [lessonPlanStyle] - "Phong
 *   cách soạn giáo án" GIAI ĐOẠN 10 (xem lessonPlanStyles.js) - null nếu giáo viên không chọn.
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
  lessonType = "bai_moi",
  sampleMode = "theo_chuong",
  sampleSpec = null,
  sampleReferenceText = null,
  lessonPlanStyle = null,
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
    lessonType,
    sampleMode,
    sampleSpec,
    sampleReferenceText,
    lessonPlanStyle,
  };
}
