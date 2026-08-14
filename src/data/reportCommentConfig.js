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

// ---- 4b. Đại từ nhân xưng (giáo viên xưng / gọi học sinh) ------------------
// Ý tưởng: AI mặc định trước đây LUÔN xưng "Cô" và gọi học sinh là "con" - sai với giáo viên Nam
// và không hợp với cách gọi phổ biến ở THCS/THPT ("em"/"trò"). Cho giáo viên tự chọn.

export const TEACHER_PRONOUNS = {
  CO: "co",
  THAY: "thay",
};

export const TEACHER_PRONOUN_CONFIG = {
  [TEACHER_PRONOUNS.CO]: { id: TEACHER_PRONOUNS.CO, label: "Cô", word: "Cô" },
  [TEACHER_PRONOUNS.THAY]: { id: TEACHER_PRONOUNS.THAY, label: "Thầy", word: "Thầy" },
};

export const TEACHER_PRONOUN_LIST = Object.values(TEACHER_PRONOUN_CONFIG);

export const STUDENT_PRONOUNS = {
  CON: "con",
  EM: "em",
  TRO: "tro",
};

export const STUDENT_PRONOUN_CONFIG = {
  [STUDENT_PRONOUNS.CON]: { id: STUDENT_PRONOUNS.CON, label: "Con", word: "con" },
  [STUDENT_PRONOUNS.EM]: { id: STUDENT_PRONOUNS.EM, label: "Em", word: "em" },
  [STUDENT_PRONOUNS.TRO]: { id: STUDENT_PRONOUNS.TRO, label: "Trò", word: "trò" },
};

export const STUDENT_PRONOUN_LIST = Object.values(STUDENT_PRONOUN_CONFIG);

export function isValidTeacherPronoun(id) {
  return Boolean(TEACHER_PRONOUN_CONFIG[id]);
}

export function isValidStudentPronoun(id) {
  return Boolean(STUDENT_PRONOUN_CONFIG[id]);
}

/** Cách gọi học sinh mặc định theo cấp học: Tiểu học -> "con", THCS/THPT -> "em". */
export function getDefaultStudentPronoun(levelId) {
  return levelId === REPORT_COMMENT_LEVELS.TIEU_HOC ? STUDENT_PRONOUNS.CON : STUDENT_PRONOUNS.EM;
}

// ---- 4c. Giọng điệu nhận xét (Tone of voice) -------------------------------

export const REPORT_COMMENT_TONES = {
  KHICH_LE: "khich_le",
  NGHIEM_TUC: "nghiem_tuc",
  TU_HAO: "tu_hao",
};

export const REPORT_COMMENT_TONE_CONFIG = {
  [REPORT_COMMENT_TONES.KHICH_LE]: {
    id: REPORT_COMMENT_TONES.KHICH_LE,
    label: "Khích lệ, ấm áp",
    hint: "Mặc định - dành cho học sinh đại trà",
    guidance:
      "Giọng điệu KHÍCH LỆ, ẤM ÁP, nhẹ nhàng động viên - phù hợp với đa số học sinh, cân bằng " +
      "giữa ghi nhận cố gắng và góp ý nhẹ nhàng.",
  },
  [REPORT_COMMENT_TONES.NGHIEM_TUC]: {
    id: REPORT_COMMENT_TONES.NGHIEM_TUC,
    label: "Nghiêm túc, thẳng thắn",
    hint: "Dành cho học sinh cần cải thiện mạnh",
    guidance:
      "Giọng điệu NGHIÊM TÚC, THẲNG THẮN hơn (nhưng vẫn LỊCH SỰ, KHÔNG xúc phạm, KHÔNG dùng từ " +
      "ngữ tiêu cực/quy chụp) - nêu rõ, cụ thể, không né tránh mức độ nghiêm trọng của vấn đề cần " +
      "cải thiện, để phụ huynh nhận thấy rõ tính cấp thiết cần phối hợp uốn nắn.",
  },
  [REPORT_COMMENT_TONES.TU_HAO]: {
    id: REPORT_COMMENT_TONES.TU_HAO,
    label: "Khen ngợi, tự hào",
    hint: "Dành cho học sinh xuất sắc",
    guidance:
      "Giọng điệu KHEN NGỢI, TỰ HÀO, đề cao thành tích và sự tiến bộ - nhấn mạnh điểm nổi bật, " +
      "truyền cảm hứng, dùng lời lẽ trân trọng thành quả của học sinh.",
  },
};

export const REPORT_COMMENT_TONE_LIST = Object.values(REPORT_COMMENT_TONE_CONFIG);

export function getReportCommentToneConfig(toneId) {
  return REPORT_COMMENT_TONE_CONFIG[toneId] || REPORT_COMMENT_TONE_CONFIG[REPORT_COMMENT_TONES.KHICH_LE];
}

export function isValidToneId(toneId) {
  return Boolean(REPORT_COMMENT_TONE_CONFIG[toneId]);
}

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

// ---- 7. Từ khóa nhanh (Quick-tags) ----------------------------------------
// Danh sách gợi ý để giáo viên bấm chọn thay vì tự gõ - đúng Ý tưởng 2 (Quick-tags) trong phản
// hồi test thực tế: thao tác click nhanh hơn gõ bàn phím, đặc biệt hữu ích trên điện thoại.
// Đây CHỈ là danh sách cụm từ THÔ (chưa qua AI "dịch") - khi bấm sẽ được nối vào ô nhập liệu,
// AI vẫn sẽ viết lại theo đúng chuẩn mực khi tạo nhận xét như các ý thô gõ tay khác.

export const QUICK_TAGS_PHAM_CHAT = [
  "Lễ phép, ngoan ngoãn",
  "Hay quên đồ dùng học tập",
  "Chưa tự giác dọn dẹp",
  "Thật thà, trung thực",
  "Biết giúp đỡ bạn bè",
  "Chưa giữ gìn sách vở cẩn thận",
  "Đi học đúng giờ",
  "Còn hay nói chuyện riêng",
];

export const QUICK_TAGS_NANG_LUC = [
  "Tiếp thu nhanh",
  "Hay mất tập trung",
  "Ngại phát biểu",
  "Làm việc nhóm còn thụ động",
  "Tự giác hoàn thành bài tập",
  "Trình bày chưa mạch lạc",
  "Sáng tạo trong cách giải quyết vấn đề",
  "Cần nhắc nhở nhiều lần",
];

export const QUICK_TAGS_NHAN_XET_CHUNG = [
  "Có ý thức học tập tốt",
  "Hay nói chuyện riêng trong giờ",
  "Chưa tập trung nghe giảng",
  "Tích cực xây dựng bài",
  "Chưa làm đủ bài tập về nhà",
  "Hòa đồng với bạn bè",
  "Cần nhắc nhở về giờ giấc",
  "Có tinh thần cầu tiến",
];

export const QUICK_TAGS_MON_HOC = [
  "Tiếp thu nhanh",
  "Tính toán còn sai nhiều",
  "Chữ viết chưa đẹp",
  "Đọc chậm",
  "Làm bài cẩn thận",
  "Chưa hoàn thành bài tập",
  "Có tiến bộ rõ rệt",
  "Cần luyện tập thêm",
];

// ---- 8. Tên môn học phổ biến ------------------------------------------------
// Dùng để CẢNH BÁO NHẸ ở UI khi giáo viên lỡ gõ tên môn học/kết quả học tập vào ô Phẩm chất
// hoặc Năng lực (2 ô này chỉ nên ghi biểu hiện đạo đức/kỹ năng, KHÔNG ghi kết quả học tập theo
// môn - phần đó đã có mục "Môn học" riêng) - đúng "Hạt sạn" #2 phát hiện khi test thực tế.

export const COMMON_SUBJECT_NAMES = [
  "toán",
  "tiếng việt",
  "ngữ văn",
  "tiếng anh",
  "khoa học",
  "lịch sử",
  "địa lý",
  "địa lí",
  "vật lý",
  "vật lí",
  "hóa học",
  "sinh học",
  "gdcd",
  "giáo dục công dân",
  "tin học",
  "thể dục",
  "mỹ thuật",
  "âm nhạc",
  "công nghệ",
];

/** Trả về true nếu văn bản có nhắc tới tên môn học phổ biến (dùng để cảnh báo nhẹ ở UI). */
export function containsSubjectName(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return COMMON_SUBJECT_NAMES.some((name) => lower.includes(name));
}
