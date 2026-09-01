/**
 * lessonPlanTemplates.js
 * "Bản thiết kế khung" cho module Soạn giáo án (Kế hoạch bài dạy) - tách riêng khỏi
 * examBlueprint.js/gradeProfiles.js (vốn chỉ phục vụ luồng Đề kiểm tra) để 2 tính năng có thể
 * phát triển/độ vỡ độc lập, đúng yêu cầu "tách module cho tiện chỉnh sửa/mở rộng".
 *
 * ⚠️ PHẠM VI HIỆN TẠI (cập nhật Phiên 33): Mầm non -> Lớp 12 (Tiểu học + THCS + THPT) - ĐẦY ĐỦ.
 * THPT (Lớp 10-12) không cần đổi kiến trúc gì so với THCS: `getCircularForGrade()`/
 * `getMinutesPerLesson()` bên dưới vốn đã viết theo điều kiện "gradeNum >= 6" (không phải liệt kê
 * cứng từng khối) nên tự động đúng cho Lớp 10-12 khi chỉ cần thêm entry vào LESSON_PLAN_GRADES
 * (CV5512 vốn ghi rõ "cấp THCS/THPT" ngay từ đầu, xem LESSON_PLAN_CIRCULARS.CV5512).
 *
 * ⚠️ BỘ SÁCH: theo quyết định của người dùng, hệ thống hiện CHỈ dùng 1 bộ sách duy nhất (kho
 * Markdown SGK không phân biệt bộ sách) - trường "Bộ sách" ở UI (nếu có) chỉ mang tính GHI CHÚ
 * hiển thị trong văn bản giáo án xuất ra, KHÔNG ảnh hưởng đường dẫn gọi githubService.js. Nếu
 * sau này cần đa bộ sách thật, chỉ cần sửa buildKnowledgePath() trong githubService.js để thêm
 * 1 cấp thư mục theo bộ sách, mọi chỗ khác không phải đổi.
 */

import { INTEGRATION_KEYS } from "./lessonPlanIntegrations";

export const LESSON_PLAN_GRADES = [
  { value: "MAM_NON", label: "Mầm non", isPreschool: true },
  { value: 1, label: "Lớp 1", isPreschool: false },
  { value: 2, label: "Lớp 2", isPreschool: false },
  { value: 3, label: "Lớp 3", isPreschool: false },
  { value: 4, label: "Lớp 4", isPreschool: false },
  { value: 5, label: "Lớp 5", isPreschool: false },
  // ================== THCS (Lớp 6-9) - Giai đoạn 32 ==================
  { value: 6, label: "Lớp 6", isPreschool: false },
  { value: 7, label: "Lớp 7", isPreschool: false },
  { value: 8, label: "Lớp 8", isPreschool: false },
  { value: 9, label: "Lớp 9", isPreschool: false },
  // ================== THPT (Lớp 10-12) - Phiên 33 ==================
  { value: 10, label: "Lớp 10", isPreschool: false },
  { value: 11, label: "Lớp 11", isPreschool: false },
  { value: 12, label: "Lớp 12", isPreschool: false },
];

export function getLessonPlanGradeMeta(grade) {
  return LESSON_PLAN_GRADES.find((g) => g.value === grade) || LESSON_PLAN_GRADES[1];
}

export function isPreschoolGrade(grade) {
  return grade === "MAM_NON";
}

/** 2 công văn mẫu KHBD hiện hành - chọn tự động theo cấp học, giáo viên có thể ghi đè ở UI sau này.
 *
 * `getCircularForGrade()` bên dưới chọn CV5512 cho MỌI khối Lớp 6 trở lên (gradeNum >= 6, không
 * liệt kê cứng từng khối) - nên đã tự đúng luôn cho THPT (Lớp 10-12, Phiên 33) khi thêm entry vào
 * LESSON_PLAN_GRADES ở trên, KHÔNG cần sửa hàm này. Schema JSON/cấu trúc 4 hoạt động (Khởi động -
 * Hình thành kiến thức mới - Luyện tập - Vận dụng) DÙNG CHUNG cho cả CV2345 lẫn CV5512 (Mục III
 * của cả 2 công văn cùng chung tinh thần 4 hoạt động này, KHÔNG cần schema JSON riêng theo cấp) -
 * chỉ khác ở TÊN CÔNG VĂN hiển thị trong prompt/văn bản xuất ra (tự động lấy `circular.label`, xem
 * lessonPlanPromptTemplates.js) và số phút/tiết (xem getMinutesPerLesson() - THCS/THPT đều 45
 * phút/tiết, khác 35-40' Tiểu học).
 */
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
    comingSoon: false,
  },
};

/** Mầm non không theo CV2345/5512 (không phải "kế hoạch bài dạy" mà là "kế hoạch hoạt động"),
 *  nên trả về null - lessonPlanPromptTemplates.js sẽ dùng khung riêng đơn giản hơn cho trường hợp
 *  này. Lớp 6 trở lên áp dụng CV5512 (THCS/THPT), Lớp 1-5 vẫn CV2345 (Tiểu học). */
export function getCircularForGrade(grade) {
  if (isPreschoolGrade(grade)) return null;
  const gradeNum = Number(grade);
  if (Number.isFinite(gradeNum) && gradeNum >= 6) return LESSON_PLAN_CIRCULARS.CV5512;
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

/**
 * Trả về STANDARD_ACTIVITIES nhưng đã đổi tên hoạt động "kham_pha" theo "loại bài" đã chọn, và
 * đổi tên hoạt động "van_dung" thành "[Vận dụng - Tích hợp STEM]" nếu tích hợp STEM đang được bật
 * (integrations: string[] các INTEGRATION_KEYS đang chọn - mặc định [] để KHÔNG phá vỡ các nơi gọi
 * hàm này mà không liên quan tới tích hợp, ví dụ computeMultiPeriodTimeline/computeActivityTimeline).
 */
export function getActivityLabels(lessonType, integrations = []) {
  const meta = getLessonTypeMeta(lessonType);
  const stemOn = integrations.includes(INTEGRATION_KEYS.TICH_HOP_STEM);
  return STANDARD_ACTIVITIES.map((a) => {
    if (a.key === "kham_pha") return { ...a, label: meta.activityLabel };
    if (a.key === "van_dung" && stemOn) return { ...a, label: "[Vận dụng - Tích hợp STEM]" };
    return a;
  });
}

/** Số phút/tiết theo cấp học (tham khảo khung giờ phổ biến - giáo viên có thể tự đổi ở UI sau).
 *  THCS/THPT (Lớp 6 trở lên) là 45 phút/tiết theo quy định phổ biến (khác 35-40' Tiểu học). */
export function getMinutesPerLesson(grade) {
  if (isPreschoolGrade(grade)) return 30;
  if (grade === 1 || grade === 2) return 35;
  if (grade === 3 || grade === 4 || grade === 5) return 40;
  return 45; // Lớp 6-12 (THCS/THPT)
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

/**
 * normalizeActivitiesTiet(hoatDong)
 * KHẮC PHỤC lỗi "rối loạn dòng thời gian" (giáo viên phản ánh: bản Word/preview hiển thị "Hết
 * Tiết 1" tới HAI LẦN, mạch kịch bản bị đứt gãy). Nguyên nhân gốc: Mục III LUÔN trình bày theo
 * 4 khối HOẠT ĐỘNG cố định (Khởi động -> Hệ thống hoá -> Luyện tập -> Vận dụng - đúng khung
 * CV2345), KHÔNG trình bày theo tiết; ranh giới tiết được đánh dấu NGAY BÊN TRONG từng hoạt động
 * qua trường "tiet" ở mỗi bước. Nhưng AI soạn "tienTrinh" của từng hoạt động có phần ĐỘC LẬP với
 * nhau, nên có thể gán "tiet" một hoạt động đứng SAU (vd Luyện tập) nhỏ hơn hoạt động đứng NGAY
 * TRƯỚC nó (vd Hệ thống hoá đã sang Tiết 2, nhưng Luyện tập lại bắt đầu lại từ Tiết 1) -> khi
 * trình bày tuyến tính, ranh giới "Hết Tiết..." bị chèn sai chỗ hoặc chèn lặp.
 *
 * Hàm này duyệt TOÀN BỘ các bước theo ĐÚNG thứ tự sẽ hiển thị (đúng thứ tự "hoatDong" -> đúng thứ
 * tự "tienTrinh" trong từng hoạt động) và ép "tiet" của bước sau KHÔNG BAO GIỜ nhỏ hơn bước ngay
 * trước đó trong cùng dòng thời gian (chỉ sửa khi AI bị "lùi thời gian", giữ nguyên nếu AI đã gán
 * đúng thứ tự không giảm). Đây là lớp bảo vệ THUẦN CODE, không phụ thuộc AI có tuân thủ đúng
 * hướng dẫn hay không (xem thêm buildMultiPeriodGuidance() bên lessonPlanPromptTemplates.js -
 * phần hướng dẫn AI vẫn giữ để giảm khả năng phải "vá" bằng hàm này).
 *
 * Trả về BẢN SAO của mảng "hoatDong" (không sửa trực tiếp dữ liệu gốc) để LessonPlanPreview.jsx
 * (bản xem trước web) và lessonPlanExportService.js (bản xuất Word) DÙNG CHUNG 1 nguồn chân lý
 * duy nhất, tránh 2 nơi hiển thị lệch nhau.
 */
export function normalizeActivitiesTiet(hoatDong) {
  let lastTiet = 1;
  return (hoatDong || []).map((activity) => {
    const steps = (activity.tienTrinh || []).map((step) => {
      if (step == null || typeof step.tiet !== "number" || step.tiet <= 0) return step; // giáo án 1 tiết: không có trường "tiet", giữ nguyên
      const fixedTiet = Math.max(step.tiet, lastTiet);
      lastTiet = fixedTiet;
      return fixedTiet === step.tiet ? step : { ...step, tiet: fixedTiet };
    });
    return { ...activity, tienTrinh: steps };
  });
}

/**
 * computeActivityStartTiets(normalizedHoatDong)
 * Tính "tiết đang diễn ra" NGAY TRƯỚC KHI hoạt động thứ i bắt đầu (dùng làm mốc lastTiet ban đầu
 * khi trình bày hoạt động đó), thay vì mỗi hoạt động luôn bắt đầu đếm lại từ null/1 một cách độc
 * lập (cách cũ khiến ranh giới tiết xảy ra ĐÚNG vào bước đầu tiên của 1 hoạt động - ví dụ Hệ
 * thống hoá cả khối đã ở Tiết 2 nhưng Khởi động ngay trước nó kết thúc ở Tiết 1 - bị BỎ SÓT,
 * không có dòng "Hết Tiết..." nào được chèn). PHẢI dùng cùng 1 mảng đã qua normalizeActivitiesTiet()
 * ở trên để nhất quán.
 * @returns {number[]} startTiet cho từng hoạt động, cùng độ dài với normalizedHoatDong.
 */
export function computeActivityStartTiets(normalizedHoatDong) {
  let runningTiet = 1;
  return (normalizedHoatDong || []).map((activity) => {
    const startTiet = runningTiet;
    const steps = activity.tienTrinh || [];
    for (let i = steps.length - 1; i >= 0; i--) {
      if (typeof steps[i]?.tiet === "number") {
        runningTiet = steps[i].tiet;
        break;
      }
    }
    return startTiet;
  });
}
