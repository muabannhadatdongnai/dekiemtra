/**
 * reportCommentConfig.js
 * Dữ liệu cấu hình THUẦN (không gọi AI) cho tính năng "Nhận xét học bạ" - đúng vai trò
 * gradeProfiles.js/lessonPlanStyles.js: chỉ khai báo hằng số + hàm tra cứu, KHÔNG chứa logic
 * gọi Gemini (việc đó thuộc reportCommentEngine.js).
 *
 * BÀI TOÁN: giáo viên gõ ý thô về học sinh (thường là điểm cần cải thiện, đôi khi khá "thẳng
 * thắn" - "học dở", "hay nói chuyện"...) -> AI viết lại thành nhận xét học bạ ĐÚNG QUY ĐỊNH
 * (không dùng từ ngữ tiêu cực/quy chụp/so sánh học sinh - Thông tư 27/2020 bậc Tiểu học, Thông
 * tư 22/2021 bậc THCS/THPT) nhưng VẪN giữ chi tiết cụ thể của từng em (chống sáo rỗng hàng loạt).
 *
 * 3 CẤP HỌC - cấu trúc đánh giá khác nhau, KHÔNG dùng chung 1 khung:
 *  - Tiểu học (TT27/2020/TT-BGDĐT): đánh giá theo 3 mảng tách bạch - Phẩm chất / Năng lực / Môn học.
 *  - THCS + THPT (TT22/2021/TT-BGDĐT, sửa đổi bởi TT26/2020 cho phần cũ): đánh giá theo TỪNG MÔN
 *    (đi kèm điểm số) + 1 đoạn nhận xét chung về ý thức học tập, KHÔNG bị ràng buộc khung
 *    "phẩm chất/năng lực" tách riêng như tiểu học.
 */

// ---- 1. Cấp học ----------------------------------------------------------

export const REPORT_COMMENT_LEVELS = {
  TIEU_HOC: "tieu_hoc",
  THCS: "thcs",
  THPT: "thpt",
};

// structure: "3-phan" (Tiểu học - TT27) | "doan-van" (THCS/THPT - TT22)
export const REPORT_COMMENT_LEVEL_CONFIG = {
  [REPORT_COMMENT_LEVELS.TIEU_HOC]: {
    id: REPORT_COMMENT_LEVELS.TIEU_HOC,
    label: "Tiểu học",
    grades: [1, 2, 3, 4, 5],
    circularCode: "TT27/2020/TT-BGDĐT",
    circularLabel: "Bám sát Thông tư 27/2020/TT-BGDĐT",
    structure: "3-phan",
    description:
      "Đánh giá tách bạch 3 mảng: Phẩm chất, Năng lực (chung + đặc thù) và từng Môn học, " +
      "theo đúng khung Thông tư 27/2020/TT-BGDĐT (đánh giá học sinh tiểu học).",
  },
  [REPORT_COMMENT_LEVELS.THCS]: {
    id: REPORT_COMMENT_LEVELS.THCS,
    label: "THCS",
    grades: [6, 7, 8, 9],
    circularCode: "TT22/2021/TT-BGDĐT",
    circularLabel: "Bám sát Thông tư 22/2021/TT-BGDĐT",
    structure: "doan-van",
    description:
      "Nhận xét gọn theo từng môn học (đi kèm điểm số/mức đánh giá) và 1 đoạn nhận xét chung " +
      "về ý thức, thái độ học tập, theo Thông tư 22/2021/TT-BGDĐT (đánh giá học sinh THCS-THPT).",
  },
  [REPORT_COMMENT_LEVELS.THPT]: {
    id: REPORT_COMMENT_LEVELS.THPT,
    label: "THPT",
    grades: [10, 11, 12],
    circularCode: "TT22/2021/TT-BGDĐT",
    circularLabel: "Bám sát Thông tư 22/2021/TT-BGDĐT",
    structure: "doan-van",
    description:
      "Nhận xét gọn theo từng môn học (đi kèm điểm số/mức đánh giá) và 1 đoạn nhận xét chung " +
      "về ý thức, thái độ học tập, theo Thông tư 22/2021/TT-BGDĐT (đánh giá học sinh THCS-THPT).",
  },
};

export const REPORT_COMMENT_LEVEL_LIST = Object.values(REPORT_COMMENT_LEVEL_CONFIG);

export function getReportCommentLevelConfig(levelId) {
  return REPORT_COMMENT_LEVEL_CONFIG[levelId] || null;
}

export function getCircularLabelForLevel(levelId) {
  return getReportCommentLevelConfig(levelId)?.circularLabel || "";
}

// ---- 2. Năng lực + phẩm chất theo TT27 (chỉ dùng cho Tiểu học) -----------
// Đây là danh mục THAM KHẢO để AI tự chọn từ phù hợp nhất với ý giáo viên gõ - KHÔNG bắt buộc
// AI phải nhắc đủ tất cả (tránh nhận xét dài dòng, sáo rỗng, giống nhau hàng loạt).

export const NANG_LUC_CHUNG_TT27 = [
  "Tự chủ và tự học",
  "Giao tiếp và hợp tác",
  "Giải quyết vấn đề và sáng tạo",
];

export const PHAM_CHAT_TT27 = ["Yêu nước", "Nhân ái", "Chăm chỉ", "Trung thực", "Trách nhiệm"];

// ---- 3. Độ dài nhận xét ---------------------------------------------------

export const REPORT_COMMENT_LENGTHS = {
  NGAN: "ngan",
  VUA: "vua",
  CHI_TIET: "chi_tiet",
};

export const REPORT_COMMENT_LENGTH_CONFIG = {
  [REPORT_COMMENT_LENGTHS.NGAN]: {
    id: REPORT_COMMENT_LENGTHS.NGAN,
    label: "Ngắn gọn",
    hint: "1-2 câu mỗi mục, súc tích, đủ ý chính",
    guidance: "mỗi mục chỉ viết 1-2 câu ngắn gọn, đi thẳng vào trọng tâm",
  },
  [REPORT_COMMENT_LENGTHS.VUA]: {
    id: REPORT_COMMENT_LENGTHS.VUA,
    label: "Vừa phải",
    hint: "2-3 câu mỗi mục, cân bằng điểm mạnh và điều cần cố gắng",
    guidance: "mỗi mục viết khoảng 2-3 câu, nêu rõ điểm tích cực lẫn điều cần cải thiện",
  },
  [REPORT_COMMENT_LENGTHS.CHI_TIET]: {
    id: REPORT_COMMENT_LENGTHS.CHI_TIET,
    label: "Chi tiết",
    hint: "3-5 câu mỗi mục, có ví dụ/tình huống cụ thể, gợi ý hướng khắc phục",
    guidance:
      "mỗi mục viết 3-5 câu, có dẫn chứng/tình huống cụ thể của học sinh và gợi ý hướng cải thiện rõ ràng",
  },
};

export const REPORT_COMMENT_LENGTH_LIST = Object.values(REPORT_COMMENT_LENGTH_CONFIG);

export function getReportCommentLengthConfig(lengthId) {
  return (
    REPORT_COMMENT_LENGTH_CONFIG[lengthId] || REPORT_COMMENT_LENGTH_CONFIG[REPORT_COMMENT_LENGTHS.VUA]
  );
}

// ---- 4. Từ ngữ tiêu cực bị cấm (TT27 + TT22 đều tinh thần chung) ---------
// Dùng để (a) nhắc trong prompt AI né các từ này, (b) hậu kiểm nhẹ ở engine (cảnh báo nếu lọt).

export const BANNED_NEGATIVE_WORDS = [
  "yếu",
  "kém",
  "dốt",
  "ngu",
  "lười",
  "hư",
  "tệ",
  "chậm hiểu",
  "cá biệt",
  "vô kỷ luật",
  "hỗn láo",
  "bất trị",
  "vô lễ",
  "mất dạy",
  "ngỗ nghịch",
  "kém cỏi",
  "thiếu ý thức",
  "không có ý thức",
  "phá phách",
  "quậy phá",
];

// ---- 5. Chế độ nhập liệu ---------------------------------------------------

export const REPORT_COMMENT_INPUT_MODES = {
  SINGLE: "single",
  BULK: "bulk",
};

// ---- 6. Helper chọn cấp học theo khối lớp (dùng khi import từ file Excel) --

export function getLevelIdByGrade(grade) {
  const g = Number(grade);
  for (const level of REPORT_COMMENT_LEVEL_LIST) {
    if (level.grades.includes(g)) return level.id;
  }
  return null;
}

export function isValidLevelId(levelId) {
  return Boolean(REPORT_COMMENT_LEVEL_CONFIG[levelId]);
}

export function isValidLengthId(lengthId) {
  return Boolean(REPORT_COMMENT_LENGTH_CONFIG[lengthId]);
}
