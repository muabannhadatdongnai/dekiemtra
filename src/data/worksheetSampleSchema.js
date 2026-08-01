/**
 * worksheetSampleSchema.js
 * ================== GIAI ĐOẠN 2 ==================
 * Định nghĩa "spec phong cách" trích xuất từ 1 PHIẾU BÀI TẬP MẪU do giáo viên upload (ảnh chụp/
 * PDF/docx) - đúng tình huống bạn gửi 5 ảnh mẫu ở đầu cuộc trò chuyện.
 *
 * ⚠️ NGUYÊN TẮC GIỐNG HỆT sampleExamSchema.js (đề kiểm tra): spec CHỈ mô tả PHONG CÁCH ở mức
 * khái quát (số cột, không khí màu sắc, các dạng bài xuất hiện, chủ đề nội dung) - TUYỆT ĐỐI
 * KHÔNG lưu lại nguyên văn câu hỏi/số liệu của phiếu mẫu (có thể có bản quyền của người soạn
 * gốc). Mọi chuỗi tự do đều giới hạn độ dài để chặn AI lỡ chép nguyên văn.
 */

export const SUBJECT_GUESSES = ["TOAN", "TIENG_VIET"];

const MAX_FREE_TEXT_LENGTH = 300;
const MAX_HINTS = 6;
const MAX_HINT_LENGTH = 40;

export const EMPTY_WORKSHEET_SAMPLE_SPEC = {
  suggestedColumns: null, // 1 | 2 | null (null = không xác định được)
  moodKeywords: "", // không khí chung: "vui nhộn, nhiều màu sắc" / "đơn giản, ít trang trí"...
  exerciseTypeHints: [], // các dạng bài QUAN SÁT THẤY, chỉ là TAG ngắn, không phải câu hỏi thật
  themeHints: "", // chủ đề nội dung/nhân vật minh hoạ (VD "chủ đề động vật, mùa thu") - để gợi ý
  // mascot/ngữ cảnh bài toán mới, KHÔNG phải chép đề bài gốc
  subjectGuess: null, // "TOAN" | "TIENG_VIET" | null
};

function clampText(value, maxLen = MAX_FREE_TEXT_LENGTH) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

function clampHints(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v) => typeof v === "string" && v.trim())
    .slice(0, MAX_HINTS)
    .map((v) => v.trim().slice(0, MAX_HINT_LENGTH));
}

/** "Làm sạch" spec do AI trả về - không bao giờ throw, luôn trả 1 object hợp lệ (giống
 * sanitizeSampleExamSpec() trong sampleExamSchema.js). */
export function sanitizeWorksheetSampleSpec(raw) {
  if (!raw || typeof raw !== "object") return { ...EMPTY_WORKSHEET_SAMPLE_SPEC };

  const columns = Number(raw.suggestedColumns);

  return {
    suggestedColumns: columns === 1 || columns === 2 ? columns : null,
    moodKeywords: clampText(raw.moodKeywords),
    exerciseTypeHints: clampHints(raw.exerciseTypeHints),
    themeHints: clampText(raw.themeHints),
    subjectGuess: SUBJECT_GUESSES.includes(raw.subjectGuess) ? raw.subjectGuess : null,
  };
}

/** Có đủ thông tin hữu ích để áp dụng vào luồng tạo phiếu hay không (nếu không, bỏ qua thay vì
 * "ép" theo 1 spec gần như rỗng). */
export function isUsableWorksheetSampleSpec(spec) {
  return Boolean(spec?.moodKeywords || spec?.themeHints || spec?.exerciseTypeHints?.length || spec?.suggestedColumns);
}
