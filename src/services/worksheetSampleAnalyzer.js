import { generateContentWithFailover } from "./geminiKeyPool";
import { FREE_TIER_MODEL } from "@/data/promptTemplates";
import { sanitizeWorksheetSampleSpec } from "@/data/worksheetSampleSchema";
import { tryExtractPlainText, isImageFile, isPdfFile } from "./fileTextExtractors";

/**
 * worksheetSampleAnalyzer.js
 * ================== GIAI ĐOẠN 2 ==================
 * Đọc 1 file "phiếu bài tập mẫu" (ảnh chụp/PDF/docx) giáo viên upload, GỌI AI ĐÚNG 1 LẦN DUY
 * NHẤT (giống hệt tinh thần sampleExamAnalyzer.js của đề kiểm tra) để trích:
 *  1. `spec` - phong cách trình bày (số cột gợi ý, không khí màu sắc, dạng bài xuất hiện, chủ
 *     đề nội dung) -> dùng để chọn/thiên vị layout trong worksheetLayoutTemplates.js.
 *  2. `referenceContext` - đoạn text trích thô (CHỈ khi trích được bằng docx-text/pdf-text,
 *     KHÔNG dùng AI) -> dùng làm ngữ cảnh tham khảo khi AI soạn "giải toán có lời văn" mới, để
 *     bám sát chủ đề/từ vựng tài liệu giáo viên đang dùng. Với ảnh chụp/PDF scan (không trích
 *     được text đáng tin cậy), field này = null - dùng field `themeHints` trong spec (do AI đọc
 *     bằng vision) thay thế, vẫn có được "hương vị" chủ đề dù không có nguyên văn.
 *
 * priority="analyze" (xem geminiKeyPool.js): retry nhẹ, fail nhanh, tự nhường quota cho luồng
 * tạo phiếu chính (bắt buộc) - giống hệt cách sampleExamAnalyzer.js xử lý.
 */

const MAX_REFERENCE_CONTEXT_LENGTH = 4000; // đủ ngữ cảnh, không làm phình prompt tạo bài toán

function buildAnalysisInstruction() {
  return `Bạn là chuyên gia thiết kế phiếu bài tập Tiểu học Việt Nam. Quan sát PHONG CÁCH TRÌNH BÀY
của phiếu bài tập mẫu được cung cấp bên dưới (văn bản hoặc file đính kèm):
- suggestedColumns: phiếu trình bày theo 1 cột hay 2 cột? (số nguyên 1 hoặc 2, đoán nếu không chắc)
- moodKeywords: mô tả NGẮN GỌN (tối đa 1 câu) không khí màu sắc/trang trí: nhiều màu sắc vui nhộn,
  hay đơn giản tối giản, hay theo 1 chủ đề xuyên suốt...
- exerciseTypeHints: tối đa 6 TAG NGẮN (2-4 chữ) mô tả các DẠNG bài xuất hiện (VD "đặt tính rồi tính",
  "so sánh số", "điền từ", "nối từ", "giải toán có lời văn") - KHÔNG chép câu hỏi cụ thể
- themeHints: mô tả NGẮN GỌN (tối đa 1 câu) chủ đề nội dung/nhân vật minh hoạ xuất hiện (VD "chủ đề
  con vật và mùa thu", "chủ đề đồ dùng học tập") - CHỈ mô tả chủ đề, KHÔNG chép nguyên văn câu hỏi
- subjectGuess: "TOAN" hay "TIENG_VIET"?

⚠️ TUYỆT ĐỐI KHÔNG chép lại nguyên văn bất kỳ câu hỏi, số liệu, hay đáp án cụ thể nào từ phiếu mẫu -
CHỈ mô tả PHONG CÁCH ở mức khái quát. Đầu ra CHỈ trả về JSON hợp lệ theo đúng schema sau, không
kèm giải thích, không markdown code fence:
{
  "suggestedColumns": 1 | 2,
  "moodKeywords": "<string ngắn>",
  "exerciseTypeHints": ["<tag ngắn>", ...],
  "themeHints": "<string ngắn>",
  "subjectGuess": "TOAN" | "TIENG_VIET"
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
 * @param {string} fileName - tên file gốc
 * @returns {Promise<{ spec: Object, referenceContext: string|null, extractionMethod: string }>}
 */
export async function analyzeWorksheetSample({ buffer, mimeType, fileName }) {
  const instruction = buildAnalysisInstruction();
  const { text, method } = await tryExtractPlainText({ buffer, mimeType, fileName });

  let contents;
  let referenceContext = null;

  if (method === "docx-text" || method === "pdf-text") {
    contents = `${instruction}\n\nVĂN BẢN PHIẾU MẪU (trích từ file):\n${text}`;
    // Giữ lại đoạn trích THÔ (không qua AI) làm ngữ cảnh cho bước sinh "giải toán có lời văn"
    // sau này - cắt bớt để không làm phình prompt tạo bài toán quá mức cần thiết.
    referenceContext = text.slice(0, MAX_REFERENCE_CONTEXT_LENGTH);
  } else if (method === "vision-needed" && isPdfFile(mimeType, fileName)) {
    contents = [
      {
        role: "user",
        parts: [
          { text: instruction },
          { inlineData: { mimeType: "application/pdf", data: buffer.toString("base64") } },
        ],
      },
    ];
  } else if (method === "vision-needed" && isImageFile(mimeType)) {
    contents = [
      {
        role: "user",
        parts: [{ text: instruction }, { inlineData: { mimeType, data: buffer.toString("base64") } }],
      },
    ];
  } else {
    throw new Error(`Định dạng file không được hỗ trợ để phân tích phiếu mẫu: ${mimeType || fileName}`);
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
  const spec = sanitizeWorksheetSampleSpec(parsed);

  return { spec, referenceContext, extractionMethod: method === "vision-needed" ? (isPdfFile(mimeType, fileName) ? "pdf-vision" : "image-vision") : method };
}
