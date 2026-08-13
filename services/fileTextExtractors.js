/**
 * fileTextExtractors.js
 * Trích text THÔ từ file docx/pdf bằng thư viện đọc file (KHÔNG dùng AI, không tốn token) -
 * logic giống hệt phần trích xuất trong services/sampleExamAnalyzer.js (đề kiểm tra), tách
 * riêng ra đây để worksheetSampleAnalyzer.js (Giai đoạn 2) dùng lại được mà KHÔNG phải sửa
 * sampleExamAnalyzer.js đang chạy ổn định (giảm rủi ro regression cho luồng đề kiểm tra).
 */

const MIN_TEXT_LENGTH_FOR_TEXT_MODE = 40; // trích được quá ít chữ -> khả năng PDF scan, nên dùng vision

export async function extractTextFromDocx(buffer) {
  const mammoth = (await import("mammoth")).default;
  const result = await mammoth.extractRawText({ buffer });
  return (result.value || "").trim();
}

export async function extractTextFromPdf(buffer) {
  // ⚠️ Né bug pdf-parse@1.1.1 khi load qua dynamic import() - xem giải thích chi tiết trong
  // sampleExamAnalyzer.js (extractTextFromPdf gốc). Import thẳng lib/pdf-parse.js, bỏ qua
  // đoạn code debug tự đọc file test nội bộ ở index.js.
  const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
  const result = await pdfParse(buffer);
  return (result.text || "").trim();
}

export function isDocxFile(mimeType, fileName) {
  return mimeType?.includes("wordprocessingml") || mimeType === "application/msword" || /\.docx?$/i.test(fileName || "");
}

export function isPdfFile(mimeType, fileName) {
  return mimeType === "application/pdf" || /\.pdf$/i.test(fileName || "");
}

export function isImageFile(mimeType) {
  return Boolean(mimeType?.startsWith("image/"));
}

/**
 * Thử trích text KHÔNG dùng AI (docx/pdf-text). Trả về `{ text, method }`; `text` rỗng và
 * `method: "vision-needed"` nếu là ảnh, PDF dạng scan, hoặc định dạng không hỗ trợ trích thô -
 * bên gọi tự quyết định có chuyển sang đọc bằng AI (vision, tốn 1 lượt gọi) hay không.
 */
export async function tryExtractPlainText({ buffer, mimeType, fileName }) {
  if (isDocxFile(mimeType, fileName)) {
    return { text: await extractTextFromDocx(buffer), method: "docx-text" };
  }
  if (isPdfFile(mimeType, fileName)) {
    let text = "";
    try {
      text = await extractTextFromPdf(buffer);
    } catch (err) {
      console.warn("[fileTextExtractors] pdf-parse lỗi, chuyển sang vision:", err.message);
    }
    if (text.length >= MIN_TEXT_LENGTH_FOR_TEXT_MODE) return { text, method: "pdf-text" };
    return { text: "", method: "vision-needed" }; // khả năng PDF scan
  }
  if (isImageFile(mimeType)) return { text: "", method: "vision-needed" };
  return { text: "", method: "unsupported" };
}
