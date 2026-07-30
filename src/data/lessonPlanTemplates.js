/**
 * lessonPlanTemplates.js
 * "Bản thiết kế khung" cho module Soạn giáo án (Kế hoạch bài dạy) - tách riêng khỏi
 * examBlueprint.js/gradeProfiles.js (vốn chỉ phục vụ luồng Đề kiểm tra) để 2 tính năng có thể
 * phát triển/độ vỡ độc lập, đúng yêu cầu "tách module cho tiện chỉnh sửa/mở rộng".
 *
 * ⚠️ PHẠM VI HIỆN TẠI (đã chốt với người dùng): chỉ Mầm non -> Lớp 5. Lớp 6-12 (THCS/THPT,
 * Công văn 5512) để SẴN CHỖ CẮM (xem LESSON_PLAN_CIRCULARS.CV5512, comingSoon:true) nhưng
 * CHƯA implement prompt/export riêng - khi làm tiếp chỉ cần bổ sung entry + template, không
 * đổi kiến trúc.
 *
 * ⚠️ BỘ SÁCH: theo quyết định của người dùng, hệ thống hiện CHỈ dùng 1 bộ sách duy nhất (kho
 * Markdown SGK không phân biệt bộ sách) - trường "Bộ sách" ở UI (nếu có) chỉ mang tính GHI CHÚ
 * hiển thị trong văn bản giáo án xuất ra, KHÔNG ảnh hưởng đường dẫn gọi githubService.js. Nếu
 * sau này cần đa bộ sách thật, chỉ cần sửa buildKnowledgePath() trong githubService.js để thêm
 * 1 cấp thư mục theo bộ sách, mọi chỗ khác không phải đổi.
 */

export const LESSON_PLAN_GRADES = [
  { value: "MAM_NON", label: "Mầm non", isPreschool: true },
  { value: 1, label: "Lớp 1", isPreschool: false },
  { value: 2, label: "Lớp 2", isPreschool: false },
  { value: 3, label: "Lớp 3", isPreschool: false },
  { value: 4, label: "Lớp 4", isPreschool: false },
  { value: 5, label: "Lớp 5", isPreschool: false },
];

export function getLessonPlanGradeMeta(grade) {
  return LESSON_PLAN_GRADES.find((g) => g.value === grade) || LESSON_PLAN_GRADES[1];
}

export function isPreschoolGrade(grade) {
  return grade === "MAM_NON";
}

/** 2 công văn mẫu KHBD hiện hành - chọn tự động theo cấp học, giáo viên có thể ghi đè ở UI sau này. */
export const LESSON_PLAN_CIRCULARS = {
  CV2345: {
    code: "2345",
    label: "Công văn 2345/BGDĐT-GDTH (cấp Tiểu học)",
    appliesTo: "TIEU_HOC",
    comingSoon: false,
  },
  CV5512: {
    code: "5512",
    label: "Công văn 5512/BGDĐT-GDTrH (cấp THCS/THPT)",
    appliesTo: "THCS_THPT",
    comingSoon: true, // roadmap Lớp 6-12, chưa implement prompt/export
  },
};

/** Mầm non không theo CV2345/5512 (không phải "kế hoạch bài dạy" mà là "kế hoạch hoạt động"),
 *  nên trả về null - lessonPlanPromptTemplates.js sẽ dùng khung riêng đơn giản hơn cho trường hợp này. */
export function getCircularForGrade(grade) {
  if (isPreschoolGrade(grade)) return null;
  return LESSON_PLAN_CIRCULARS.CV2345;
}

export const LESSON_PLAN_COLUMN_MODES = {
  ONE_COLUMN: "one_column",
  TWO_COLUMN: "two_column",
};

export const COLUMN_MODE_OPTIONS = [
  { value: LESSON_PLAN_COLUMN_MODES.ONE_COLUMN, label: "1 cột (Mặc định)" },
  {
    value: LESSON_PLAN_COLUMN_MODES.TWO_COLUMN,
    label: "2 cột (Hoạt động & Sản phẩm dự kiến)",
  },
];

/** Khung 4 hoạt động chuẩn CV2345 - Mục III "Các hoạt động dạy học chủ yếu". */
export const STANDARD_ACTIVITIES = [
  { key: "khoi_dong", label: "Khởi động", defaultMinutes: 5 },
  { key: "kham_pha", label: "Khám phá (Hình thành kiến thức mới)", defaultMinutes: 15 },
  { key: "luyen_tap", label: "Luyện tập", defaultMinutes: 10 },
  { key: "van_dung", label: "Vận dụng", defaultMinutes: 5 },
];

/** Số phút/tiết theo cấp học (tham khảo khung giờ phổ biến - giáo viên có thể tự đổi ở UI sau). */
export function getMinutesPerLesson(grade) {
  if (isPreschoolGrade(grade)) return 30;
  if (grade === 1 || grade === 2) return 35;
  return 40; // Lớp 3-5
}

/**
 * Tính "Timeline" (phân bổ phút cho từng hoạt động) THUẦN CODE, không dùng AI - đúng nguyên
 * tắc cốt lõi của dự án ("AI chỉ sinh nội dung, code tự tính số liệu"). Chia theo trọng số mặc
 * định của STANDARD_ACTIVITIES, nhân với số tiết thực dạy.
 */
export function computeActivityTimeline(soTiet = 1, grade) {
  const totalMinutes = getMinutesPerLesson(grade) * Math.max(1, soTiet);
  const weightSum = STANDARD_ACTIVITIES.reduce((s, a) => s + a.defaultMinutes, 0);
  return STANDARD_ACTIVITIES.map((a) => ({
    key: a.key,
    label: a.label,
    minutes: Math.round((a.defaultMinutes / weightSum) * totalMinutes),
  }));
}
