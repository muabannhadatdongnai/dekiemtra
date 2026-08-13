/**
 * examBlueprint.js
 * "Bản thiết kế" đề thi - cấu trúc dữ liệu ĐẦU VÀO gửi lên /api/generate.
 * Đây là tài liệu tham chiếu + hàm dựng an toàn (JS thuần không có type thật), giúp thêm
 * trường mới sau này (ví dụ "difficulty preset", "questionBankMode"...) không bị quên đồng bộ
 * giữa ExamMatrixForm (client) và route.js (server) - chỉ cần sửa 1 chỗ này.
 *
 * ⚠️ C1 (Phần B - Ý 1): KHÔNG thêm field "gradeProfile" vào blueprint này - trường "grade" sẵn có
 * đã đủ để tầng sinh đề tự tra cứu profile qua getGradeProfile(grade) trong gradeProfiles.js
 * (xem cách dùng trong promptTemplates.js). Giữ blueprint tối giản, tránh trùng lặp nguồn dữ liệu
 * (nếu thêm field riêng, dễ bị lệch nếu sau này đổi logic profile mà quên đồng bộ 2 nơi).
 *
 * @typedef {Object} ExamBlueprint
 * @property {string} username
 * @property {number} grade - 1-12, dùng để tra cứu cả subjectProfile lẫn gradeProfile phía server
 * @property {string} subject - mã môn học, xem src/data/config.js -> SUBJECTS
 * @property {number} volume - 1 | 2
 * @property {Object<string, {NHAN_BIET:number, THONG_HIEU:number, VAN_DUNG:number, VAN_DUNG_CAO:number}>} chapterMatrix
 *           Ma trận theo Chương (Giai đoạn 1) - key là chapterId
 * @property {Object<string, "trac_nghiem"|"tu_luan">} typeByLevel - loại câu hỏi riêng từng mức độ
 * @property {boolean} includeAnswers - có tạo đáp án + lời giải hay không (ảnh hưởng credit AI)
 * @property {boolean} useVisualQuestions - cho phép câu hỏi trực quan (đặt tính, sơ đồ...)
 * @property {"theo_chuong"|"theo_de_mau"|"ket_hop"} [sampleMode] - C6: chế độ dùng đề mẫu,
 *           mặc định "theo_chuong" (hành vi cũ, không đổi nếu không truyền)
 * @property {Object|null} [sampleExamSpec] - C6: spec phong cách đã phân tích từ /api/analyze-sample
 *           (xem src/data/sampleExamSchema.js) - null nếu chưa có/không dùng đề mẫu
 * @property {string} [knowledgeContent] - Giai đoạn 1 (mở rộng): "Nội dung kiến thức" giáo viên
 *           gõ tay (tên bài/chủ đề trọng tâm cần nhấn mạnh) - SONG SONG với việc chọn Chương từ
 *           kho SGK (chapterMatrix vẫn LUÔN bắt buộc như cũ, trường này KHÔNG thay thế chapterMatrix,
 *           chỉ bổ sung thêm ngữ cảnh cho AI khi soạn câu hỏi trong các chương đã chọn). Rỗng nếu
 *           giáo viên không điền gì (hành vi cũ, không đổi).
 * @property {string} [extraRequirements] - Giai đoạn 1 (mở rộng): "Yêu cầu bổ sung" - dặn dò riêng
 *           cho AI (vd "cần 1 câu liên hệ thực tế"), chèn vào cuối prompt. Rỗng nếu không điền.
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
  sampleMode = "theo_chuong",
  sampleExamSpec = null,
  knowledgeContent = "",
  extraRequirements = "",
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
    sampleMode,
    sampleExamSpec,
    knowledgeContent,
    extraRequirements,
  };
}
