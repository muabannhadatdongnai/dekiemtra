/**
 * examBlueprint.js
 * "Bản thiết kế" đề thi - cấu trúc dữ liệu ĐẦU VÀO gửi lên /api/generate.
 * Đây là tài liệu tham chiếu + hàm dựng an toàn (JS thuần không có type thật), giúp thêm
 * trường mới sau này (ví dụ "difficulty preset", "questionBankMode"...) không bị quên đồng bộ
 * giữa ExamMatrixForm (client) và route.js (server) - chỉ cần sửa 1 chỗ này.
 *
 * @typedef {Object} ExamBlueprint
 * @property {string} username
 * @property {number} grade - 1-12
 * @property {string} subject - mã môn học, xem src/data/config.js -> SUBJECTS
 * @property {number} volume - 1 | 2
 * @property {Object<string, {NHAN_BIET:number, THONG_HIEU:number, VAN_DUNG:number, VAN_DUNG_CAO:number}>} chapterMatrix
 *           Ma trận theo Chương (Giai đoạn 1) - key là chapterId
 * @property {Object<string, "trac_nghiem"|"tu_luan">} typeByLevel - loại câu hỏi riêng từng mức độ
 * @property {boolean} includeAnswers - có tạo đáp án + lời giải hay không (ảnh hưởng credit AI)
 * @property {boolean} useVisualQuestions - cho phép câu hỏi trực quan (đặt tính, sơ đồ...)
 */

export function buildExamBlueprint({
  username,
  grade,
  subject,
  volume,
  chapterMatrix,
  typeByLevel,
  includeAnswers,
  useVisualQuestions,
}) {
  return {
    username,
    grade,
    subject,
    volume,
    chapterMatrix,
    typeByLevel,
    includeAnswers,
    useVisualQuestions,
  };
}
