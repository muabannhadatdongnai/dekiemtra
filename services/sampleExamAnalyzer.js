import { generateContentWithFailover } from "./geminiKeyPool";
import { FREE_TIER_MODEL } from "@/data/promptTemplates";
import { sanitizeSampleExamSpec } from "@/data/sampleExamSchema";

/**
 * sampleExamAnalyzer.js
 * C4 (Phần B - đề mẫu): đọc file đề mẫu giáo viên upload (docx/pdf/ảnh), trích text TRƯỚC bằng
 * thư viện đọc file (KHÔNG dùng AI, không tốn token) khi có thể, CHỈ gọi Gemini ĐÚNG 1 LẦN DUY
 * NHẤT để phân tích phong cách - dùng priority="analyze" (xem geminiKeyPool.js): retry nhẹ, fail
 * nhanh, tự nhường quota cho luồng tạo đề chính (là luồng bắt buộc).
 *
 * ⚠️ CHƯA NỐI vào luồng tạo đề chính ở bước này (đó là việc của C6) - file này CHỈ export 1 hàm
 * `analyzeSampleExam()` để test ĐỘC LẬP qua route /api/analyze-sample trước, xác nhận spec trả
 * về có đúng ý hay không rồi mới tin tưởng đưa vào luồng chính.
 *
 * 3 chiến lược trích xuất tuỳ loại file:
 *  - docx: mammoth.extractRawText() - trích text thuần, MIỄN PHÍ, không gọi AI.
 *  - pdf dạng văn bản (không phải scan): pdf-parse - cũng MIỄN PHÍ.
 *  - pdf dạng scan/ảnh (pdf-parse trích ra quá ít chữ) HOẶC file ảnh (jpg/png...): không có cách
 *    nào đọc được nội dung mà không dùng AI (cần OCR/vision) - gửi thẳng file cho Gemini đọc bằng
 *    inlineData, kết hợp LUÔN việc "đọc" và "phân tích phong cách" trong CÙNG 1 lượt gọi AI duy
 *    nhất (không tốn thêm 1 lượt OCR riêng rồi mới phân tích riêng).
 */

const MIN_TEXT_LENGTH_FOR_TEXT_MODE = 40; // trích được quá ít chữ -> khả năng PDF scan, chuyển sang vision

function buildAnalysisInstruction() {
  return `Bạn là chuyên gia phân tích đề kiểm tra. Phân tích PHONG CÁCH của đề mẫu được cung cấp bên dưới (văn bản hoặc file đính kèm):
- Tổng số câu hỏi, số câu trắc nghiệm / tự luận (ước lượng nếu không đếm được chính xác)
- Số câu theo từng mức độ: Nhận biết / Thông hiểu / Vận dụng / Vận dụng cao (ước lượng dựa trên độ khó cảm nhận nếu đề không ghi rõ)
- Độ dài trung bình của câu hỏi: "ngan" | "trung_binh" | "dai"
- writingStyle: mô tả NGẮN GỌN (tối đa 2 câu) cách hành văn, cách đặt câu hỏi, xưng hô
- presentationNotes: mô tả NGẮN GỌN (tối đa 2 câu) cách trình bày - cách đánh số, format đáp án, có bảng/hình minh hoạ hay không

⚠️ TUYỆT ĐỐI KHÔNG chép lại nguyên văn bất kỳ đề bài, số liệu, hay đáp án cụ thể nào từ đề mẫu -
CHỈ mô tả PHONG CÁCH ở mức khái quát. Đầu ra CHỈ trả về JSON hợp lệ theo đúng schema sau, không
kèm giải thích, không markdown code fence:
{
  "totalQuestions": <number>,
  "questionTypeBreakdown": { "trac_nghiem": <number>, "tu_luan": <number> },
  "difficultyBreakdown": { "NHAN_BIET": <number>, "THONG_HIEU": <number>, "VAN_DUNG": <number>, "VAN_DUNG_CAO": <number> },
  "averageQuestionLength": "ngan" | "trung_binh" | "dai",
  "writingStyle": "<string ngắn>",
  "presentationNotes": "<string ngắn>"
}`;
}

async function extractTextFromDocx(buffer) {
  const mammoth = (await import("mammoth")).default;
  const result = await mammoth.extractRawText({ buffer });
  return (result.value || "").trim();
}

async function extractTextFromPdf(buffer) {
  // ⚠️ BUG THẬT CỦA pdf-parse@1.1.1 (đã test và xác nhận): index.js của package có đoạn code
  // "isDebugMode = !module.parent" - khi module này được load qua dynamic import() (như ở đây)
  // thay vì require() thông thường, module.parent thường là null/undefined, khiến gói tưởng
  // đang chạy ở "chế độ debug" và tự ý đọc 1 file PDF TEST NỘI BỘ của chính nó
  // (./test/data/05-versions-space.pdf) thay vì buffer mình truyền vào - gây lỗi
  // "ENOENT: no such file" vì file test đó không tồn tại ngoài package.
  // Cách né: import THẲNG vào file lõi lib/pdf-parse.js, bỏ qua đoạn debug ở index.js.
  const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
  const result = await pdfParse(buffer);
  return (result.text || "").trim();
}

function isDocxFile(mimeType, fileName) {
  return (
    mimeType?.includes("wordprocessingml") ||
    mimeType === "application/msword" ||
    /\.docx?$/i.test(fileName || "")
  );
}

function isPdfFile(mimeType, fileName) {
  return mimeType === "application/pdf" || /\.pdf$/i.test(fileName || "");
}

function isImageFile(mimeType) {
  return Boolean(mimeType?.startsWith("image/"));
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
 * @returns {Promise<{ spec: import("@/data/sampleExamSchema").EMPTY_SAMPLE_EXAM_SPEC, extractionMethod: string }>}
 */
export async function analyzeSampleExam({ buffer, mimeType, fileName }) {
  const instruction = buildAnalysisInstruction();

  let contents;
  let extractionMethod;

  if (isDocxFile(mimeType, fileName)) {
    const text = await extractTextFromDocx(buffer);
    extractionMethod = "docx-text";
    contents = `${instruction}\n\nVĂN BẢN ĐỀ MẪU (trích từ file .docx):\n${text}`;
  } else if (isPdfFile(mimeType, fileName)) {
    let text = "";
    try {
      text = await extractTextFromPdf(buffer);
    } catch (err) {
      console.warn("[sampleExamAnalyzer] pdf-parse lỗi, chuyển sang đọc bằng AI (vision):", err.message);
    }

    if (text.length >= MIN_TEXT_LENGTH_FOR_TEXT_MODE) {
      extractionMethod = "pdf-text";
      contents = `${instruction}\n\nVĂN BẢN ĐỀ MẪU (trích từ file .pdf):\n${text}`;
    } else {
      // PDF dạng scan/ảnh - pdf-parse không trích được chữ -> để AI tự đọc trực tiếp (vision)
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
    }
  } else if (isImageFile(mimeType)) {
    extractionMethod = "image-vision";
    contents = [
      {
        role: "user",
        parts: [{ text: instruction }, { inlineData: { mimeType, data: buffer.toString("base64") } }],
      },
    ];
  } else {
    throw new Error(`Định dạng file không được hỗ trợ để phân tích đề mẫu: ${mimeType || fileName}`);
  }

  const response = await generateContentWithFailover(
    {
      model: FREE_TIER_MODEL,
      contents,
      config: { temperature: 0.2, responseMimeType: "application/json" },
    },
    { priority: "analyze" }
  );

  const parsed = parseJsonResponse(response.text);
  const spec = sanitizeSampleExamSpec(parsed);

  return { spec, extractionMethod };
}
