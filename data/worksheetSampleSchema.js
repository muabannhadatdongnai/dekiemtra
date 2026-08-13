/**
 * worksheetSampleSchema.js
 * ================== GIAI ĐOẠN 2 (đã có) + GIAI ĐOẠN 4 MỚI (content-aware theo mẫu thật) ==================
 * Định nghĩa "spec phong cách" trích xuất từ 1 PHIẾU BÀI TẬP MẪU do giáo viên upload (ảnh chụp/
 * PDF/docx) - đúng tình huống bạn gửi 5 ảnh mẫu ở đầu cuộc trò chuyện.
 *
 * ⚠️ NGUYÊN TẮC GIỐNG HỆT sampleExamSchema.js (đề kiểm tra): spec CHỈ mô tả PHONG CÁCH ở mức
 * khái quát (số cột, không khí màu sắc, các dạng bài xuất hiện, chủ đề nội dung) - TUYỆT ĐỐI
 * KHÔNG lưu lại nguyên văn câu hỏi/số liệu của phiếu mẫu (có thể có bản quyền của người soạn
 * gốc). Mọi chuỗi tự do đều giới hạn độ dài để chặn AI lỡ chép nguyên văn.
 *
 * GIAI ĐOẠN 4 MỚI: TRƯỚC ĐÂY `exerciseTypeHints` chỉ là 6 TAG TỰ DO (VD "đặt tính rồi tính") -
 * KHÔNG map được vào catalog thật nên chỉ hiện cho giáo viên ĐỌC THAM KHẢO, không tự động áp
 * dụng được vào phiếu sinh ra (đây CHÍNH LÀ lý do giáo viên phản ánh "chỉ bắt chước layout/màu
 * sắc mà không bám theo đề mẫu thật"). Thêm `detectedExercises` - DANH SÁCH CÓ CẤU TRÚC, mỗi
 * phần tử là { key, approxCount } với `key` CHỈ ĐƯỢC PHÉP là 1 trong các key thật của
 * worksheetExerciseCatalog.js (validate ở sanitize bên dưới, KHÔNG tin AI trả về key bịa), giữ
 * ĐÚNG THỨ TỰ xuất hiện trong phiếu mẫu -> worksheetGenerator.js dùng thứ tự này để sắp xếp các
 * khối bài, và WorksheetForm.jsx dùng approxCount để gợi ý điền sẵn số lượng câu.
 */

import { WORKSHEET_EXERCISE_CATALOG } from "./worksheetExerciseCatalog";

export const SUBJECT_GUESSES = ["TOAN", "TIENG_VIET"];

const MAX_FREE_TEXT_LENGTH = 300;
const MAX_HINTS = 6;
const MAX_HINT_LENGTH = 40;
const MAX_DETECTED_EXERCISES = 8;
const MIN_APPROX_COUNT = 1;
const MAX_APPROX_COUNT = 15;
const DEFAULT_APPROX_COUNT = 4;

// Chỉ chấp nhận key thuộc dạng bài ĐÃ CÓ generator thật và KHÔNG PHẢI hoạt động tự động ẩn (VD
// "dem_hinh_ung_dung" - AI không cần biết tới, worksheetGenerator.js tự lo phần đó).
const VALID_DETECTED_KEYS = new Set(
  WORKSHEET_EXERCISE_CATALOG.filter((item) => item.source !== "planned" && !item.hiddenFromForm).map((item) => item.key)
);

export const EMPTY_WORKSHEET_SAMPLE_SPEC = {
  suggestedColumns: null, // 1 | 2 | null (null = không xác định được)
  moodKeywords: "", // không khí chung: "vui nhộn, nhiều màu sắc" / "đơn giản, ít trang trí"...
  exerciseTypeHints: [], // các dạng bài QUAN SÁT THẤY, chỉ là TAG ngắn, không phải câu hỏi thật
  // (GIỮ LẠI để hiện text tham khảo cho giáo viên đọc - xem detectedExercises bên dưới mới là
  // phần THỰC SỰ dùng để tự động điền cấu trúc phiếu)
  themeHints: "", // chủ đề nội dung/nhân vật minh hoạ (VD "chủ đề động vật, mùa thu") - để gợi ý
  // mascot/ngữ cảnh bài toán mới, KHÔNG phải chép đề bài gốc
  subjectGuess: null, // "TOAN" | "TIENG_VIET" | null
  detectedExercises: [], // GIAI ĐOẠN 4 MỚI: [{ key, approxCount }], ĐÚNG thứ tự xuất hiện trong mẫu
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

/** GIAI ĐOẠN 4 MỚI: làm sạch detectedExercises - loại bỏ key không nằm trong catalog thật (chặn
 * AI "bịa" key không tồn tại), loại trùng lặp (giữ lần xuất hiện ĐẦU TIÊN để giữ đúng thứ tự),
 * ép approxCount về số nguyên hợp lý (1-15, mặc định 4 nếu AI không cho số hoặc cho số vô lý). */
function clampDetectedExercises(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const out = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const key = String(raw.key || "").trim();
    if (!VALID_DETECTED_KEYS.has(key) || seen.has(key)) continue;
    seen.add(key);
    const approxCount = Math.round(Number(raw.approxCount));
    out.push({
      key,
      approxCount: Number.isFinite(approxCount)
        ? Math.min(Math.max(approxCount, MIN_APPROX_COUNT), MAX_APPROX_COUNT)
        : DEFAULT_APPROX_COUNT,
    });
    if (out.length >= MAX_DETECTED_EXERCISES) break;
  }
  return out;
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
    detectedExercises: clampDetectedExercises(raw.detectedExercises),
  };
}

/** Có đủ thông tin hữu ích để áp dụng vào luồng tạo phiếu hay không (nếu không, bỏ qua thay vì
 * "ép" theo 1 spec gần như rỗng). */
export function isUsableWorksheetSampleSpec(spec) {
  return Boolean(
    spec?.moodKeywords ||
      spec?.themeHints ||
      spec?.exerciseTypeHints?.length ||
      spec?.suggestedColumns ||
      spec?.detectedExercises?.length
  );
}
