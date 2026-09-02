/**
 * foreignLanguagePromptTemplates.js
 * Prompt DUY NHẤT cho tính năng "Bản ngoại ngữ" (Soạn Giáo Án / Đề Cương Ôn Tập / Đề Kiểm tra môn
 * Tiếng Anh, mở rộng được cho Tiếng Trung/Tiếng Pháp sau này - xem foreignLanguageSubjects.js).
 *
 * ⚠️ QUYẾT ĐỊNH KIẾN TRÚC: dịch NGUYÊN KHỐI JSON (toàn bộ object nội dung đã tạo bằng tiếng Việt)
 * sang ngôn ngữ đích, GIỮ NGUYÊN cấu trúc/khoá JSON - KHÔNG tạo lại nội dung từ đầu bằng 1 lượt gọi
 * AI mới. Lý do: (1) đơn giản hơn NHIỀU so với viết lại toàn bộ buildLessonPlanPrompt/
 * buildOutlinePrompt/buildExamPrompt theo hướng "sinh thẳng bằng tiếng Anh" (vốn đã rất phức tạp,
 * gắn chặt với Thông tư/Công văn tiếng Việt); (2) đảm bảo bản tiếng Anh và bản tiếng Việt LUÔN
 * khớp nội dung 1-1 (cùng 1 giáo án, chỉ khác ngôn ngữ trình bày) - giáo viên có thể đối chiếu
 * song song 2 bản; (3) hàm dịch này HOÀN TOÀN không phụ thuộc schema cụ thể của lessonPlan/outline/
 * exam - tự động khớp mọi field mới thêm sau này (VD "goiYHocLieuHinhAnh" ở Phiên 28), không cần
 * sửa prompt dịch mỗi khi schema module khác đổi.
 */

export const FOREIGN_LANGUAGE_TRANSLATE_MODEL = "gemini-3.5-flash"; // đồng bộ FREE_TIER_MODEL

export function buildForeignLanguageTranslationPrompt({ data, languageNameEn, contentKindLabel }) {
  return `Bạn là một biên dịch viên giáo dục chuyên nghiệp, dịch tài liệu sư phạm từ tiếng Việt sang ${languageNameEn}.

NHIỆM VỤ: dịch object JSON dưới đây (là "${contentKindLabel}") sang ${languageNameEn}, rồi trả về ĐÚNG 1 object JSON kết quả.

QUY TẮC BẮT BUỘC:
1. GIỮ NGUYÊN 100% cấu trúc JSON: đúng từng khoá (key) như bản gốc, đúng thứ tự, đúng số phần tử
   trong mọi mảng (array), đúng số cấp lồng nhau (nested object/array). TUYỆT ĐỐI KHÔNG thêm/bớt/
   đổi tên bất kỳ khoá nào.
2. CHỈ dịch các GIÁ TRỊ CHUỖI (string) đang viết bằng tiếng Việt sang ${languageNameEn}, văn phong
   tự nhiên, đúng thuật ngữ sư phạm/học thuật, PHÙ HỢP để giáo viên/học sinh đọc trực tiếp (không
   dịch máy móc từng từ).
3. KHÔNG dịch: số (number), boolean, null, mã định danh ngắn dạng code (vd "A"/"B"/"C"/"D" trong
   đáp án trắc nghiệm, "Ngày 1"/"Tiết 2" có thể dịch nếu là câu văn nhưng giữ nguyên số).
4. Nếu 1 giá trị chuỗi ĐÃ SẴN bằng ${languageNameEn} hoặc là thuật ngữ/danh từ riêng không nên dịch
   (từ vựng ${languageNameEn} đang dạy, câu ví dụ ${languageNameEn}, công thức LaTeX trong \`$...$\`/
   \`\\(...\\)\`/\`\\[...\\]\`, ký hiệu Toán/Hoá/Lý), GIỮ NGUYÊN VĂN, không thay đổi.
5. Đây là tài liệu dạy MÔN HỌC "${languageNameEn}" cho học sinh Việt Nam, nên phần nội dung
   ${languageNameEn} thật sự đang dạy (từ vựng, mẫu câu, ngữ pháp, bài đọc...) phải chính xác,
   tự nhiên như người bản ngữ viết.
6. CHỈ trả về JSON hợp lệ, KHÔNG kèm \`\`\`json, KHÔNG kèm lời dẫn/giải thích, KHÔNG thiếu khoá nào so
   với JSON đầu vào.

JSON ĐẦU VÀO:
${JSON.stringify(data)}`;
}
