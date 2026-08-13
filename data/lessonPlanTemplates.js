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

/** Khung 4 hoạt động chuẩn CV2345 - Mục III "Các hoạt động dạy học chủ yếu".
 *  maxMinutes: trần thời lượng HỢP LÝ cho 1 LẦN xuất hiện của hoạt động này trong 1 tiết học -
 *  dùng để tránh tình trạng "Khởi động 11 phút" (trò chơi kích hoạt kéo quá dài, dễ cháy giáo án)
 *  do giáo viên phản ánh - xem computeMultiPeriodTimeline() bên dưới. */
export const STANDARD_ACTIVITIES = [
  { key: "khoi_dong", label: "Khởi động", defaultMinutes: 5, maxMinutes: 7 },
  { key: "kham_pha", label: "Khám phá (Hình thành kiến thức mới)", defaultMinutes: 15 },
  { key: "luyen_tap", label: "Luyện tập", defaultMinutes: 10 },
  { key: "van_dung", label: "Vận dụng", defaultMinutes: 5, maxMinutes: 12 },
];

/**
 * "Loại bài" - giáo viên chọn để hoạt động thứ 2 (mặc định "Khám phá - Hình thành kiến thức mới")
 * đổi tên đúng bản chất sư phạm khi bài dạy KHÔNG hình thành kiến thức mới (VD "Ôn tập số tự
 * nhiên" ở Toán lớp 5 - kiến thức các em đã học từ lớp 4). Trước đây hệ thống LUÔN gắn cứng tên
 * "Khám phá" cho mọi bài, kể cả bài ôn tập/luyện tập - giáo viên phản ánh đây là điểm chưa chuẩn
 * xác về mặt sư phạm.
 */
export const LESSON_TYPES = [
  {
    value: "bai_moi",
    label: "Bài mới",
    hint: "Hình thành kiến thức mới",
    activityLabel: "Khám phá (Hình thành kiến thức mới)",
  },
  {
    value: "on_tap",
    label: "Ôn tập / Luyện tập",
    hint: "Hệ thống hoá kiến thức đã học",
    activityLabel: "Hệ thống hoá kiến thức",
  },
  {
    value: "thuc_hanh",
    label: "Thực hành / Trải nghiệm",
    hint: "Vận dụng thực tế, ít lý thuyết mới",
    activityLabel: "Thực hành - Luyện tập",
  },
];

export function getLessonTypeMeta(lessonType) {
  return LESSON_TYPES.find((t) => t.value === lessonType) || LESSON_TYPES[0];
}

/** Trả về STANDARD_ACTIVITIES nhưng đã đổi tên hoạt động "kham_pha" theo "loại bài" đã chọn. */
export function getActivityLabels(lessonType) {
  const meta = getLessonTypeMeta(lessonType);
  return STANDARD_ACTIVITIES.map((a) =>
    a.key === "kham_pha" ? { ...a, label: meta.activityLabel } : a
  );
}

/** Số phút/tiết theo cấp học (tham khảo khung giờ phổ biến - giáo viên có thể tự đổi ở UI sau). */
export function getMinutesPerLesson(grade) {
  if (isPreschoolGrade(grade)) return 30;
  if (grade === 1 || grade === 2) return 35;
  return 40; // Lớp 3-5
}

/**
 * Chia totalMinutes cho danh sách { key, weight } theo đúng TỈ LỆ trọng số, đảm bảo TỔNG các
 * "minutes" trả về LUÔN BẰNG CHÍNH XÁC totalMinutes (thuật toán "largest remainder" - làm tròn
 * xuống trước, rồi cộng thêm 1 phút cho các mục có phần dư lớn nhất cho tới khi đủ).
 *
 * ⚠️ Đây là bản sửa lỗi giáo viên phản ánh: bản cũ dùng Math.round() ĐỘC LẬP cho từng hoạt động
 * (VD 11.43 -> 11, 34.28 -> 34, 22.86 -> 23, 11.43 -> 11), khiến tổng 11+34+23+11 = 79 phút dù
 * khai báo 2 tiết x 40 phút = 80 phút - lệch 1 phút do làm tròn rời rạc. Với largest-remainder,
 * tổng luôn khớp con số khai báo.
 */
function distributeMinutesExact(totalMinutes, items) {
  const weightSum = items.reduce((s, i) => s + i.weight, 0) || 1;
  const withRemainder = items.map((i) => {
    const exact = (i.weight / weightSum) * totalMinutes;
    const minutes = Math.floor(exact);
    return { key: i.key, minutes, remainder: exact - minutes };
  });
  let missing = totalMinutes - withRemainder.reduce((s, i) => s + i.minutes, 0);
  const byRemainderDesc = [...withRemainder].sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; missing > 0 && i < byRemainderDesc.length; i++, missing--) {
    byRemainderDesc[i].minutes += 1;
  }
  return withRemainder.map((i) => ({ key: i.key, minutes: i.minutes }));
}

/**
 * Tính phân bổ thời gian THEO TỪNG TIẾT HỌC RIÊNG BIỆT (mỗi tiết tự chia đủ đúng số phút/tiết
 * của khối lớp - xem getMinutesPerLesson) - THUẦN CODE, không dùng AI.
 *
 * Khắc phục 2 vấn đề giáo viên phản ánh khi bài dạy có từ 2 tiết trở lên:
 * 1. "Thiếu ranh giới giữa các tiết": mỗi tiết là 1 đơn vị tính TÁCH BIỆT (không còn gộp chung 1
 *    mạch 79-80 phút), có điểm dừng rõ ràng để giáo viên biết hết tiết ở đâu, chèn giải lao.
 * 2. Chỉ tiết đầu tiên có "Khởi động" đầy đủ; các tiết SAU đó chỉ có "Khởi động lại" ngắn gọn
 *    (trò chơi nhỏ nhắc lại, KHÔNG lặp lại y hệt khởi động chính) - và trần maxMinutes áp cho MỖI
 *    LẦN xuất hiện, không bị "phình to" theo tổng số tiết như thuật toán cũ.
 * 3. Hoạt động "Khám phá"/"Hệ thống hoá kiến thức" chỉ đặt ở tiết đầu tiên; "Vận dụng" chỉ đặt ở
 *    tiết cuối cùng (đúng tinh thần ví dụ giáo viên đề xuất: Tiết 1 thiên về hình thành/hệ thống
 *    hoá + luyện tập phần đầu, Tiết cuối thiên về luyện tập phần sau + vận dụng/tổng kết).
 *
 * @returns {Array<{period:number, totalMinutes:number, segments:Array<{key,label,minutes}>}>}
 */
export function computeMultiPeriodTimeline(soTiet = 1, grade, lessonType = "bai_moi") {
  const activities = getActivityLabels(lessonType);
  const labelByKey = Object.fromEntries(activities.map((a) => [a.key, a.label]));
  const capByKey = Object.fromEntries(activities.map((a) => [a.key, a.maxMinutes || null]));
  const minutesPerPeriod = getMinutesPerLesson(grade);
  const totalPeriods = Math.max(1, Math.round(soTiet) || 1);

  const periods = [];
  for (let period = 1; period <= totalPeriods; period++) {
    const isFirst = period === 1;
    const isLast = period === totalPeriods;

    const parts = [
      { key: "khoi_dong", weight: isFirst ? 5 : 3, label: isFirst ? labelByKey.khoi_dong : "Khởi động lại" },
      { key: "luyen_tap", weight: 10, label: labelByKey.luyen_tap },
    ];
    if (isFirst) parts.push({ key: "kham_pha", weight: 12, label: labelByKey.kham_pha });
    if (isLast) parts.push({ key: "van_dung", weight: 6, label: labelByKey.van_dung });

    let distributed = distributeMinutesExact(minutesPerPeriod, parts);

    // Ép trần (cap) cho từng lần xuất hiện của Khởi động/Vận dụng - phần dư dồn sang Luyện tập
    // (hoặc Khám phá nếu Luyện tập không đủ "chỗ chứa"), đảm bảo TỔNG vẫn khớp đúng số phút/tiết.
    let overflow = 0;
    distributed = distributed.map((d) => {
      const cap = capByKey[d.key];
      if (cap && d.minutes > cap) {
        overflow += d.minutes - cap;
        return { ...d, minutes: cap };
      }
      return d;
    });
    if (overflow > 0) {
      const sink =
        distributed.find((d) => d.key === "luyen_tap") || distributed.find((d) => d.key === "kham_pha");
      if (sink) sink.minutes += overflow;
    }

    periods.push({
      period,
      totalMinutes: minutesPerPeriod,
      segments: distributed.map((d) => ({
        key: d.key,
        label: parts.find((p) => p.key === d.key).label,
        minutes: d.minutes,
      })),
    });
  }
  return periods;
}

/**
 * Tính "Timeline" TỔNG HỢP theo 4 hoạt động chuẩn (khoi_dong/kham_pha/luyen_tap/van_dung) - dùng
 * cho những nơi hiển thị/xuất bản CHỈ theo 4 khối hoạt động lớn (không tách theo từng tiết), ví
 * dụ nhãn "(~X phút)" cạnh tên mỗi hoạt động trong LessonPlanPreview.jsx/lessonPlanExportService.js.
 * Cộng dồn từ computeMultiPeriodTimeline() nên TỔNG LUÔN KHỚP CHÍNH XÁC số tiết x số phút/tiết
 * khai báo - đây chính là lỗi giáo viên phản ánh (79 phút thay vì 80 phút) đã được sửa tại đây.
 */
export function computeActivityTimeline(soTiet = 1, grade, lessonType = "bai_moi") {
  const periods = computeMultiPeriodTimeline(soTiet, grade, lessonType);
  const totals = {};
  periods.forEach((p) => p.segments.forEach((s) => {
    totals[s.key] = (totals[s.key] || 0) + s.minutes;
  }));
  const activities = getActivityLabels(lessonType);
  return activities.filter((a) => a.key in totals).map((a) => ({ key: a.key, label: a.label, minutes: totals[a.key] }));
}
