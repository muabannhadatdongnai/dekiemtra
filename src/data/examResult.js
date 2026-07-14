/**
 * examResult.js
 * Cấu trúc dữ liệu KẾT QUẢ sau khi tạo đề - gộp toàn bộ dữ liệu liên quan (câu hỏi, rubric,
 * thông tin chương, cảnh báo, thông tin hiển thị...) thành 1 object DUY NHẤT, thay vì nhiều
 * useState() rời rạc trong page.js. Thêm trường mới sau này (ví dụ "questionBankId" khi có
 * ngân hàng câu hỏi lưu trữ) chỉ cần thêm vào đây.
 *
 * @typedef {Object} ExamResult
 * @property {Array} questions
 * @property {Array} teacherRubric
 * @property {Array<{chapterId:string,label:string}>} chaptersInfo
 * @property {Object<string,string>} typeByLevel
 * @property {Array<string>} warnings
 * @property {Object|null} meta - thông tin hiển thị (tên trường, lớp, mã đề, tiêu đề...)
 */

export const EMPTY_EXAM_RESULT = {
  questions: [],
  teacherRubric: [],
  chaptersInfo: [],
  typeByLevel: {},
  warnings: [],
  meta: null,
};

export function buildExamResult(apiResponse, meta) {
  return {
    questions: apiResponse.questions || [],
    teacherRubric: apiResponse.teacherRubric || [],
    chaptersInfo: apiResponse.chaptersInfo || [],
    typeByLevel: apiResponse.typeByLevel || {},
    warnings: apiResponse.warnings || [],
    meta,
  };
}
