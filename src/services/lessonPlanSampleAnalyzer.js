import { generateContentWithFailover } from "./geminiKeyPool";
import { LESSON_PLAN_MODEL } from "@/data/lessonPlanPromptTemplates";
import { sanitizeLessonPlanSampleSpec, NUMBERING_STYLES } from "@/data/lessonPlanSampleSchema";
import { tryExtractPlainText, isImageFile, isPdfFile } from "./fileTextExtractors";

/**
 * lessonPlanSampleAnalyzer.js
 * Đọc 1 file "giáo án mẫu" (docx/pdf/ảnh chụp) giáo viên upload, GỌI AI ĐÚNG 1 LẦN DUY NHẤT
 * (đúng tinh thần sampleExamAnalyzer.js/worksheetSampleAnalyzer.js) để trích:
 *  1. `spec` - cấu trúc/cách trình bày (thứ tự đề mục, kiểu đánh số, có bảng 2 cột hay không,
 *     thông tin phần đầu trang) -> dùng để định hình CÁCH TRÌNH BÀY giáo án mới.
 *  2. `referenceText` - đoạn text trích thô (CHỈ khi trích được bằng docx-text/pdf-text, KHÔNG
 *     tốn AI) -> dùng làm ngữ cảnh THAM KHẢO CÁCH HÀNH VĂN khi chế độ "Kết hợp mẫu + SGK" được
 *     chọn (lessonPlanPromptTemplates.js tự giới hạn cách dùng, không copy nguyên văn nội dung
 *     bài học cụ thể của mẫu vào bài mới). Với ảnh chụp/PDF scan, field này = null.
 *
 * priority="analyze" (xem geminiKeyPool.js): retry nhẹ, fail nhanh, tự nhường quota cho luồng
 * soạn giáo án chính (bắt buộc) - giống hệt cách sampleExamAnalyzer.js xử lý.
 */

const MAX_REFERENCE_TEXT_LENGTH = 3000; // đủ ngữ cảnh cách hành văn/cấu trúc, không làm phình prompt chính

function buildAnalysisInstruction() {
  return `Bạn là chuyên gia phân tích giáo án (kế hoạch bài dạy) Việt Nam. Quan sát CẤU TRÚC/CÁCH TRÌNH
BÀY của giáo án mẫu được cung cấp bên dưới (văn bản hoặc file đính kèm) - TUYỆT ĐỐI KHÔNG mô tả
hay chép lại nội dung bài học CỤ THỂ (tên bài, kiến thức, câu hỏi...) của giáo án mẫu, CHỈ mô tả
cách trình bày ở mức khái quát:
- sectionHeadings: liệt kê ĐÚNG THỨ TỰ các đề mục lớn xuất hiện trong giáo án mẫu (VD "I. Mục tiêu",
  "II. Đồ dùng dạy học", "III. Các hoạt động dạy học chủ yếu", "IV. Điều chỉnh sau bài dạy"...),
  tối đa 10 mục, chỉ lấy TÊN MỤC, không lấy nội dung bên trong.
- numberingStyle: cách đánh số các bước trong hoạt động dạy học, CHỌN ĐÚNG 1 trong 4 giá trị sau:
  "buoc_so_va_abcd" (có cả "Bước 1/2/3..." VÀ tiểu mục "a)/b)/c)..."), "chi_buoc_so" (chỉ có
  "Bước 1/2/3...", không có a)/b)/c)), "chi_gach_dau_dong" (chỉ dùng gạch đầu dòng, không đánh số
  bước), "khong_ro" (không xác định được/mẫu không có cấu trúc bước rõ ràng).
- useTwoColumnTable: true nếu phần "Các hoạt động dạy học" trình bày dạng BẢNG 2 cột (Hoạt động
  GV-HS / Sản phẩm dự kiến), false nếu trình bày liền mạch 1 cột, không xác định thì để null.
- headerInfoHints: mô tả NGẮN GỌN (tối đa 1 câu) các thông tin xuất hiện ở phần đầu trang (VD
  "có ô Trường/Tổ/Giáo viên/Ngày dạy ở góc trên", "chỉ có tên bài và môn học")
- presentationNotes: mô tả NGẮN GỌN (tối đa 1-2 câu) các đặc điểm trình bày khác đáng chú ý (in
  đậm/nghiêng tiêu đề mục, mức độ chi tiết diễn đạt, có khung/viền hay không...)

⚠️ TUYỆT ĐỐI KHÔNG chép lại nguyên văn bất kỳ nội dung bài học, câu hỏi, hay kiến thức cụ thể nào
từ giáo án mẫu - CHỈ mô tả CẤU TRÚC/CÁCH TRÌNH BÀY ở mức khái quát. Đầu ra CHỈ trả về JSON hợp lệ
theo đúng schema sau, không kèm giải thích, không markdown code fence:
{
  "sectionHeadings": ["...", "..."],
  "numberingStyle": ${NUMBERING_STYLES.map((s) => `"${s}"`).join(" | ")},
  "useTwoColumnTable": true | false | null,
  "headerInfoHints": "<string ngắn>",
  "presentationNotes": "<string ngắn>"
}`;
}

function parseJsonResponse(text) {
  if (!text) return null;
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

/**
 * @param {Buffer} buffer - nội dung file thô
 * @param {string} mimeType - MIME type file upload (từ FormData)
 * @param {string} fileName - tên file gốc (dùng làm phương án dự phòng nếu mimeType không rõ ràng)
 * @returns {Promise<{ spec: Object, referenceText: string|null, extractionMethod: string }>}
 */
export async function analyzeLessonPlanSample({ buffer, mimeType, fileName }) {
  const instruction = buildAnalysisInstruction();

  const extracted = await tryExtractPlainText({ buffer, mimeType, fileName });
  let contents;
  let extractionMethod = extracted.method;
  let referenceText = null;

  if (extracted.method === "docx-text" || extracted.method === "pdf-text") {
    contents = `${instruction}\n\nVĂN BẢN GIÁO ÁN MẪU (trích từ file):\n${extracted.text}`;
    referenceText = extracted.text.slice(0, MAX_REFERENCE_TEXT_LENGTH);
  } else if (extracted.method === "vision-needed") {
    if (isPdfFile(mimeType, fileName)) {
      extractionMethod = "pdf-vision";
      contents = [
        {
          role: "user",
          parts: [
            { text: instruction },
            { inlineData: { mimeType: "application/pdf", data: buffer.toString("base64") } },
          ],
        },
      ];
    } else if (isImageFile(mimeType)) {
      extractionMethod = "image-vision";
      contents = [
        {
          role: "user",
          parts: [{ text: instruction }, { inlineData: { mimeType, data: buffer.toString("base64") } }],
        },
      ];
    } else {
      throw new Error(`Định dạng file không được hỗ trợ để phân tích giáo án mẫu: ${mimeType || fileName}`);
    }
  } else {
    throw new Error(`Định dạng file không được hỗ trợ để phân tích giáo án mẫu: ${mimeType || fileName}`);
  }

  const response = await generateContentWithFailover(
    {
      model: LESSON_PLAN_MODEL,
      contents,
      config: { temperature: 0.2, responseMimeType: "application/json" },
    },
    { priority: "analyze" }
  );

  const parsed = parseJsonResponse(response.text);
  const spec = sanitizeLessonPlanSampleSpec(parsed);

  return { spec, referenceText, extractionMethod };
}
