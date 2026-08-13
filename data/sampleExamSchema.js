/**
 * sampleExamSchema.js
 * C4 (Phần B - đề mẫu): định nghĩa "spec phong cách" trích xuất từ đề mẫu giáo viên upload.
 *
 * ⚠️ NGUYÊN TẮC QUAN TRỌNG (vừa kỹ thuật vừa bản quyền): spec này CHỈ mô tả PHONG CÁCH đề mẫu
 * (số câu/mức độ, độ dài câu hỏi, cách hành văn, cách trình bày) - TUYỆT ĐỐI KHÔNG lưu nội dung
 * bài toán cụ thể của đề mẫu (số liệu, đề bài, đáp án nguyên văn...). Đề mẫu thường do NXB/giáo
 * viên khác biên soạn, có thể có bản quyền - hệ thống chỉ "học phong cách" để áp dụng khi soạn đề
 * MỚI, không sao chép nội dung gốc. Đây cũng là lý do mọi chuỗi tự do trong spec đều bị giới hạn
 * độ dài (MAX_FREE_TEXT_LENGTH) - một đoạn mô tả phong cách hợp lệ luôn ngắn, nếu AI trả về
 * đoạn dài bất thường nhiều khả năng nó đã lỡ chép nguyên văn nội dung đề mẫu.
 *
 * Nguyên tắc thiết kế giống visualSchemas.js: "AI CHỈ sinh số liệu/mô tả, code tự validate" -
 * KHÔNG bao giờ tin tưởng mù quáng JSON do AI trả về, xem sanitizeSampleExamSpec() bên dưới.
 */

export const DIFFICULTY_KEYS = ["NHAN_BIET", "THONG_HIEU", "VAN_DUNG", "VAN_DUNG_CAO"];

export const QUESTION_LENGTH_OPTIONS = ["ngan", "trung_binh", "dai"];

const MAX_FREE_TEXT_LENGTH = 500; // chặn spec phình to / lỡ dính nội dung gốc của đề mẫu

export const EMPTY_SAMPLE_EXAM_SPEC = {
  totalQuestions: null,
  questionTypeBreakdown: { trac_nghiem: null, tu_luan: null },
  difficultyBreakdown: { NHAN_BIET: null, THONG_HIEU: null, VAN_DUNG: null, VAN_DUNG_CAO: null },
  averageQuestionLength: null, // "ngan" | "trung_binh" | "dai"
  writingStyle: "", // cách hành văn, cách đặt câu hỏi, xưng hô...
  presentationNotes: "", // cách trình bày: đánh số, format đáp án, có bảng/hình minh hoạ...
};

function clampText(value) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_FREE_TEXT_LENGTH);
}

function clampNonNegativeIntOrNull(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}

/**
 * "Làm sạch" spec do AI trả về - field lạ bị bỏ qua, field thiếu/sai kiểu được điền giá trị
 * rỗng an toàn, chuỗi tự do bị giới hạn độ dài. Không bao giờ throw - luôn trả về 1 object
 * hợp lệ theo đúng shape của EMPTY_SAMPLE_EXAM_SPEC dù input có "bẩn" đến đâu.
 */
export function sanitizeSampleExamSpec(raw) {
  if (!raw || typeof raw !== "object") return { ...EMPTY_SAMPLE_EXAM_SPEC };

  return {
    totalQuestions: clampNonNegativeIntOrNull(raw.totalQuestions),
    questionTypeBreakdown: {
      trac_nghiem: clampNonNegativeIntOrNull(raw.questionTypeBreakdown?.trac_nghiem),
      tu_luan: clampNonNegativeIntOrNull(raw.questionTypeBreakdown?.tu_luan),
    },
    difficultyBreakdown: DIFFICULTY_KEYS.reduce((acc, key) => {
      acc[key] = clampNonNegativeIntOrNull(raw.difficultyBreakdown?.[key]);
      return acc;
    }, {}),
    averageQuestionLength: QUESTION_LENGTH_OPTIONS.includes(raw.averageQuestionLength)
      ? raw.averageQuestionLength
      : null,
    writingStyle: clampText(raw.writingStyle),
    presentationNotes: clampText(raw.presentationNotes),
  };
}

/** Spec "rỗng" (mọi field null/"") có được coi là hữu ích để dùng hay không - dùng để quyết
 * định có nên áp dụng vào luồng tạo đề hay tự động fallback bỏ qua đề mẫu (xem examOrchestrator.js
 * ở C6). Coi là hữu ích nếu ít nhất có writingStyle HOẶC totalQuestions. */
export function isUsableSampleExamSpec(spec) {
  return Boolean(spec?.writingStyle || spec?.presentationNotes || spec?.totalQuestions);
}
