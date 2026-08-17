/**
 * worksheetExerciseCatalog.js
 * ================== GIAI ĐOẠN 0 - NỀN TẢNG (bước 1/2) ==================
 * Trước đây mỗi "dạng bài" (exercise type) bị RẢI RÁC và GẮN CỨNG ở 3 nơi khác nhau:
 *   - worksheetSchemas.js   -> EXERCISE_TYPES (chỉ có key, không có metadata gì khác)
 *   - WorksheetForm.jsx     -> EXERCISE_LABELS (label hiển thị, hard-code trùng lặp key)
 *   - WorksheetPreview.jsx  -> BOX_THEMES (1 type = 1 màu + 1 mascot CỐ ĐỊNH vĩnh viễn)
 * Hệ quả: muốn đổi/thêm 1 dạng bài phải sửa 3 file; và vì mascot/màu gắn cứng theo type nên
 * phiếu nào cũng y hệt phiếu trước (đúng vấn đề "lặp khuôn" giáo viên phản ánh).
 *
 * File này gộp tất cả metadata của 1 "dạng bài" vào ĐÚNG 1 nơi (module hoá), gồm cả những
 * trường mà Giai đoạn 1 (chống lặp khuôn) và Giai đoạn 2 (upload tài liệu tham khảo) sẽ cần,
 * để không phải sửa lại schema lần nữa:
 *   - source: "code" (sinh bằng thuật toán, rẻ & không lo AI tính sai) hay "ai" (cần AI vì cần
 *     biến hoá ngôn ngữ) hay "planned" (đã thiết kế, generator sẽ làm ở giai đoạn sau)
 *   - instructionVariants: NHIỀU cách diễn đạt câu lệnh cho cùng 1 dạng bài (thay vì 1 câu cố
 *     định) -> chỉ riêng việc random câu lệnh đã giảm đáng kể cảm giác "phiếu nào cũng giống nhau"
 *   - mascotPool / colorThemeTags: NHIỀU lựa chọn thay vì 1 mascot/màu cố định vĩnh viễn theo type
 *   - skillGroup: dùng để nhóm bài theo layout (VD layout "trạm học tập" cần biết bài nào cùng
 *     nhóm kỹ năng để xếp gần nhau)
 *   - minGradeIndex/maxGradeIndex: SO SÁNH được (không phải liệt kê chuỗi "LOP_1","LOP_2" như cũ)
 *     để dễ mở rộng thêm khối lớp sau này (VD Lớp 3) mà không phải sửa từng dạng bài.
 */

// Thứ tự khối lớp CÓ THỨ HẠNG (để so sánh min/max) - mở rộng thêm khối lớp mới chỉ cần thêm
// vào cuối mảng này, KHÔNG cần sửa lại từng exercise trong catalog.
export const GRADE_ORDER = ["MAM_NON", "LOP_1", "LOP_2"];

export function gradeIndex(grade) {
  const idx = GRADE_ORDER.indexOf(grade);
  return idx === -1 ? 0 : idx;
}

export function isGradeInRange(grade, minGrade, maxGrade) {
  const g = gradeIndex(grade);
  return g >= gradeIndex(minGrade) && g <= gradeIndex(maxGrade);
}

/**
 * MÔN HỌC hỗ trợ (mở rộng cho Giai đoạn 2 - hiện Tiếng Việt mới ở mức "planned", chưa có
 * generator thật, nhưng đã có chỗ đứng trong catalog để cắm vào sau mà không đảo lại cấu trúc).
 */
export const WORKSHEET_SUBJECTS = {
  TOAN: { key: "TOAN", label: "Toán" },
  TIENG_VIET: { key: "TIENG_VIET", label: "Tiếng Việt" },
};

/**
 * CATALOG CHÍNH - mỗi phần tử là 1 "block bài tập" độc lập, tự mô tả đầy đủ về mình.
 * ⚠️ key PHẢI khớp với dữ liệu cũ (tinh_nham, dem_va_viet_so...) để KHÔNG phá vỡ
 * worksheetSchemas.js / dữ liệu đã lưu (questionBankStore.js nếu có tham chiếu).
 */
export const WORKSHEET_EXERCISE_CATALOG = [
  {
    key: "tinh_nham",
    subject: "TOAN",
    label: "Tính nhẩm",
    skillGroup: "so_hoc",
    source: "code",
    minGrade: "MAM_NON",
    maxGrade: "LOP_2",
    defaultCount: 6,
    instructionVariants: [
      "Tính nhẩm.",
      "Em hãy tính nhẩm thật nhanh nhé!",
      "Nhẩm tính rồi điền kết quả vào ô trống.",
      "Ai tính nhanh hơn nào? Điền kết quả nhé!",
    ],
    mascotPool: ["🧮", "🐿️", "🦊", "🐢"],
    colorThemeTags: ["blue", "teal", "orange"],
  },
  {
    // GIAI ĐOẠN F: dạng bài MỚI theo phản ánh giáo viên - sơ đồ "Tách - Gộp" (number bond), dạng
    // bài xuất hiện trong MỌI bộ SGK Toán Lớp 1 hiện hành (xem comment đầy đủ tại
    // generateTachGop() trong worksheetSchemas.js). Chỉ áp dụng ĐÚNG Lớp 1 (minGrade=maxGrade=
    // "LOP_1") - đây là khái niệm được dạy chính thức ở giai đoạn này, Mầm non còn quá sớm cho
    // mối quan hệ tổng-thành phần trừu tượng, Lớp 2 thường đã chuyển hẳn sang ký hiệu +/- thay vì
    // sơ đồ tách-gộp.
    key: "tach_gop",
    subject: "TOAN",
    label: "Tách - Gộp số",
    skillGroup: "so_hoc",
    source: "code",
    minGrade: "LOP_1",
    maxGrade: "LOP_1",
    defaultCount: 4,
    instructionVariants: [
      "Điền số còn thiếu vào sơ đồ tách - gộp.",
      "Số nào còn thiếu? Em hãy điền vào chỗ trống nhé!",
      "Hoàn thành sơ đồ tách - gộp số sau.",
    ],
    mascotPool: ["🧩", "🔗", "🐝", "🐣"],
    colorThemeTags: ["purple", "orange", "teal"],
  },
  {
    key: "dem_va_viet_so",
    subject: "TOAN",
    label: "Đếm và viết số",
    skillGroup: "nhan_biet_so",
    source: "code",
    minGrade: "MAM_NON",
    maxGrade: "LOP_1",
    defaultCount: 3,
    instructionVariants: [
      "Đếm và viết số thích hợp vào ô trống.",
      "Em hãy đếm số lượng rồi viết số vào ô trống.",
      "Đếm thật kỹ rồi ghi số em đếm được nhé!",
    ],
    mascotPool: ["🐥", "🐛", "🐝", "🐞"],
    colorThemeTags: ["yellow", "green", "pink"],
  },
  {
    key: "so_sanh",
    subject: "TOAN",
    label: "So sánh (>, <, =)",
    skillGroup: "so_hoc",
    source: "code",
    minGrade: "MAM_NON",
    maxGrade: "LOP_2",
    defaultCount: 6,
    instructionVariants: [
      "So sánh. Điền dấu >, <, = thích hợp.",
      "Điền dấu >, <, = vào chỗ trống cho đúng nhé!",
      "So sánh thật kỹ rồi điền dấu thích hợp.",
    ],
    mascotPool: ["🦁", "🐰", "🐯", "🦉"],
    colorThemeTags: ["pink", "purple", "red"],
  },
  {
    key: "day_so",
    subject: "TOAN",
    label: "Dãy số cách đều",
    skillGroup: "quy_luat",
    source: "code",
    minGrade: "MAM_NON",
    maxGrade: "LOP_2",
    defaultCount: 4,
    instructionVariants: [
      "Viết số thích hợp vào ô trống.",
      "Điền số còn thiếu vào dãy số sau.",
      "Tìm quy luật rồi điền số thích hợp nhé!",
    ],
    mascotPool: ["🐒", "🐘", "🦒", "🐨"],
    colorThemeTags: ["green", "brown", "blue"],
  },
  {
    key: "sap_xep_thu_tu",
    subject: "TOAN",
    label: "Sắp xếp thứ tự (bé → lớn)",
    skillGroup: "nhan_biet_so",
    source: "code",
    minGrade: "MAM_NON",
    maxGrade: "LOP_2",
    // GIAI ĐOẠN 2: dạng bài MỚI, lấp khoảng trống skillGroup "nhan_biet_so" trước đây chỉ có
    // duy nhất "dem_va_viet_so" - đa dạng hoá cách hỏi về cùng nhóm kỹ năng nhận biết số.
    defaultCount: 3,
    instructionVariants: [
      "Sắp xếp các số theo thứ tự từ bé đến lớn.",
      "Viết lại 3 số sau theo đúng thứ tự nhé!",
      "Em hãy sắp xếp các số theo thứ tự.",
    ],
    mascotPool: ["📏", "🔢", "🐌", "🦔"],
    colorThemeTags: ["teal", "brown", "blue"],
  },
  {
    key: "noi_phep_tinh",
    subject: "TOAN",
    label: "Nối phép tính với kết quả",
    skillGroup: "so_hoc",
    source: "code",
    minGrade: "LOP_1",
    maxGrade: "LOP_2",
    defaultCount: 5,
    instructionVariants: [
      "Nối phép tính với kết quả đúng.",
      "Em hãy nối mỗi phép tính với đáp số đúng của nó.",
      "Nối thật nhanh và thật đúng nhé!",
    ],
    mascotPool: ["🦖", "🐙", "🐳", "🦈"],
    colorThemeTags: ["teal", "blue", "purple"],
  },
  {
    key: "nhan_dien_hinh",
    subject: "TOAN",
    label: "Nhận diện hình + tô màu",
    skillGroup: "hinh_hoc",
    source: "code",
    minGrade: "MAM_NON",
    maxGrade: "LOP_2",
    // ================== GIAI ĐOẠN 9 (sửa lỗi luôn lặp y hệt) ==================
    // Kho hình đã mở rộng lên 14 (xem worksheetSchemas.js) - defaultCount giờ CHỦ Ý nhỏ hơn hẳn
    // kích thước kho (5/14, không phải 6/6 như trước) để mỗi lần tạo phiếu luôn có hình "vắng
    // mặt" khác nhau, tạo khác biệt thật giữa các lần thay vì chỉ đảo thứ tự.
    defaultCount: 5,
    instructionVariants: [
      "Bé nhận biết hình và tô màu.",
      "Gọi tên các hình rồi tô màu thật đẹp nhé!",
      "Em hãy nhận diện và tô màu cho từng hình.",
    ],
    mascotPool: ["🎨", "🖍️", "🦄", "🌈"],
    colorThemeTags: ["purple", "pink", "yellow"],
  },
  {
    key: "dem_hinh_ung_dung",
    subject: "TOAN",
    label: "Đếm hình theo yêu cầu",
    skillGroup: "hinh_hoc",
    source: "code",
    minGrade: "MAM_NON",
    maxGrade: "LOP_2",
    // ================== GIAI ĐOẠN 2 (sửa bug "Nhận diện hình" đứng trơ trọi) ==================
    // hiddenFromForm: true -> KHÔNG hiện thành 1 ô chọn riêng trong WorksheetForm.jsx. Giáo
    // viên không cần tự nhớ bật thêm - hễ chọn "Nhận diện hình" (count > 0) thì
    // worksheetGenerator.js TỰ ĐỘNG kèm theo khối này ngay sau, dùng CHUNG danh sách hình đã
    // chọn. Đây là cách "bắt buộc đi kèm" (không phải tuỳ chọn giáo viên có thể quên bật).
    hiddenFromForm: true,
    instructionVariants: [
      "Đếm xem có bao nhiêu hình mỗi loại rồi viết số vào ô trống.",
      "Quan sát khay hình bên dưới và đếm theo yêu cầu nhé!",
      "Đếm thật kỹ từng loại hình trong khay rồi ghi số nhé!",
    ],
    mascotPool: ["🔍", "🧮", "🐿️"],
    colorThemeTags: ["purple", "yellow", "teal"],
  },
  {
    key: "giai_toan",
    subject: "TOAN",
    label: "Giải toán có lời văn",
    skillGroup: "van_dung",
    source: "ai", // duy nhất cần AI vì cần biến hoá ngôn ngữ tự nhiên
    minGrade: "LOP_1",
    maxGrade: "LOP_2",
    defaultCount: 2,
    instructionVariants: ["Giải bài toán.", "Em hãy đọc kỹ đề rồi giải bài toán sau.", "Cùng giải bài toán nhé!"],
    mascotPool: ["📖", "🐝", "🌻", "🍚"],
    colorThemeTags: ["orange", "brown", "green"],
  },

  // ================== GIAI ĐOẠN 9, BƯỚC 2 (Tầng B - chủ đề "Độ dài"/"Thời gian", Lớp 1) ========
  // 4 dạng bài MỚI, bám theo đúng mạch nội dung SGK Lớp 1 (chương trình GDPT 2018: "Độ dài và đo
  // độ dài", "Thời gian, giờ và lịch") thay vì chỉ luyện "kỹ năng chung" như các dạng phía trên.
  // CHỦ Ý giới hạn minGrade=maxGrade="LOP_1" (không mở rộng sang Lớp 2) - Lớp 2 có nội dung đo
  // lường/thời gian PHỨC TẠP HƠN hẳn (đổi đơn vị dm/m/km, giờ-phút, tiền Việt Nam...), cần dạng
  // bài + generator RIÊNG, sẽ làm ở 1 lượt Bước 2 kế tiếp - không dùng chung 4 dạng đơn giản này
  // cho Lớp 2 để tránh vừa sai đối tượng vừa gây rối khi phân biệt "chủ đề" nào giáo viên đang
  // chọn (xem worksheetTopicPackages.js - đúng 1 "gói" ứng với đúng 1 khối lớp).
  {
    key: "do_dai_so_sanh",
    subject: "TOAN",
    label: "So sánh độ dài (băng giấy)",
    skillGroup: "do_luong",
    source: "code",
    minGrade: "LOP_1",
    maxGrade: "LOP_1",
    defaultCount: 4,
    instructionVariants: [
      "So sánh độ dài rồi điền dấu >, <, = thích hợp.",
      "Quan sát số đo rồi so sánh thật kỹ nhé!",
      "Em hãy so sánh độ dài hai băng giấy.",
    ],
    mascotPool: ["📏", "🎗️", "🧵"],
    colorThemeTags: ["teal", "blue", "green"],
  },
  {
    key: "do_dai_sap_xep",
    subject: "TOAN",
    label: "Sắp xếp độ dài theo thứ tự",
    skillGroup: "do_luong",
    source: "code",
    minGrade: "LOP_1",
    maxGrade: "LOP_1",
    defaultCount: 3,
    instructionVariants: [
      "Sắp xếp độ dài các băng giấy theo thứ tự.",
      "Em hãy sắp xếp các số đo sau theo đúng thứ tự.",
      "Quan sát rồi sắp xếp từ ngắn đến dài (hoặc ngược lại) nhé!",
    ],
    mascotPool: ["📏", "🐌", "🦔"],
    colorThemeTags: ["brown", "teal", "blue"],
  },
  {
    key: "xem_dong_ho_gio_dung",
    subject: "TOAN",
    label: "Xem đồng hồ (giờ đúng)",
    skillGroup: "thoi_gian",
    source: "code",
    minGrade: "LOP_1",
    maxGrade: "LOP_1",
    defaultCount: 4,
    instructionVariants: [
      "Xem đồng hồ rồi viết giờ thích hợp vào chỗ trống.",
      "Đồng hồ chỉ mấy giờ? Em hãy viết vào chỗ trống nhé!",
      "Quan sát kim đồng hồ rồi ghi lại đúng giờ.",
    ],
    mascotPool: ["⏰", "🐰", "🦉"],
    colorThemeTags: ["orange", "yellow", "purple"],
  },
  {
    key: "cac_ngay_trong_tuan",
    subject: "TOAN",
    label: "Các ngày trong tuần",
    skillGroup: "thoi_gian",
    source: "code",
    minGrade: "LOP_1",
    maxGrade: "LOP_1",
    defaultCount: 3,
    instructionVariants: [
      "Điền tên ngày còn thiếu vào chỗ trống.",
      "Em hãy điền đúng thứ trong tuần vào chỗ trống.",
      "Quan sát rồi điền tên ngày còn thiếu nhé!",
    ],
    mascotPool: ["📅", "🐥", "🌤️"],
    colorThemeTags: ["blue", "yellow", "green"],
  },

  // ===== Tiếng Việt - GIAI ĐOẠN 6 (bên ngoài): generator thật đã có (cần AI vì đây là ngôn
  // ngữ - từ vựng/câu văn, không tính toán được bằng code như các dạng Toán). Trước đây chỉ
  // khai báo "chỗ đứng" (source:"planned") để schema layout/mascot dùng chung được ngay - giờ
  // đã có generator thật trong worksheetGenerator.js (generateKhoanhTuLoai/generateNoiTuNhom/
  // generateDienTuChoSan/generateDatCauTheoMau), đổi source -> "ai".
  {
    key: "khoanh_tu_loai",
    subject: "TIENG_VIET",
    label: "Khoanh từ chỉ hoạt động / đặc điểm",
    skillGroup: "tu_vung",
    source: "ai",
    minGrade: "LOP_1",
    maxGrade: "LOP_2",
    defaultCount: 5,
    instructionVariants: ["Khoanh tròn vào từ chỉ hoạt động.", "Khoanh tròn vào từ chỉ đặc điểm."],
    mascotPool: ["📚", "✏️", "🔍"],
    colorThemeTags: ["blue", "green"],
  },
  {
    key: "noi_tu_nhom",
    subject: "TIENG_VIET",
    label: "Nối từ với nhóm thích hợp",
    skillGroup: "tu_vung",
    source: "ai",
    minGrade: "LOP_1",
    maxGrade: "LOP_2",
    defaultCount: 5,
    instructionVariants: ["Nối từ chỉ hoạt động với nhóm thích hợp.", "Nối sự vật với đặc điểm thích hợp."],
    mascotPool: ["🔗", "🧩"],
    colorThemeTags: ["green", "purple"],
  },
  {
    key: "dien_tu_cho_san",
    subject: "TIENG_VIET",
    label: "Điền từ thích hợp vào chỗ trống",
    skillGroup: "ngu_phap",
    source: "ai",
    minGrade: "LOP_1",
    maxGrade: "LOP_2",
    defaultCount: 5,
    instructionVariants: ["Điền từ thích hợp vào chỗ trống."],
    mascotPool: ["✍️", "📝"],
    colorThemeTags: ["blue", "orange"],
  },
  {
    key: "dat_cau_theo_mau",
    subject: "TIENG_VIET",
    label: "Đặt câu theo mẫu",
    skillGroup: "sang_tao",
    source: "ai",
    minGrade: "LOP_2",
    maxGrade: "LOP_2",
    defaultCount: 2,
    instructionVariants: ["Đặt 2 câu theo mẫu Ai/Con gì + làm gì.", "Đặt 2 câu theo mẫu Ai/cái gì/con gì + thế nào."],
    mascotPool: ["💡", "🖊️"],
    colorThemeTags: ["purple", "pink"],
  },
];

/** Lấy toàn bộ block phù hợp với 1 khối lớp + môn học cụ thể. */
export function getCatalogFor(grade, subject = "TOAN") {
  return WORKSHEET_EXERCISE_CATALOG.filter(
    (item) => item.subject === subject && isGradeInRange(grade, item.minGrade, item.maxGrade)
  );
}

/** Lấy 1 block theo key - dùng để tra cứu metadata (label, mascotPool, instructionVariants...) */
export function getCatalogItem(key) {
  return WORKSHEET_EXERCISE_CATALOG.find((item) => item.key === key) || null;
}

/** Chỉ những dạng bài ĐÃ CÓ generator thật (code hoặc ai) - "planned" bị loại vì chưa chạy được. */
export function getImplementedCatalogFor(grade, subject = "TOAN") {
  return getCatalogFor(grade, subject).filter((item) => item.source !== "planned");
}

/**
 * ================== GIAI ĐOẠN 2 ==================
 * Như getImplementedCatalogFor(), nhưng loại thêm các block hiddenFromForm:true (VD
 * "dem_hinh_ung_dung" - luôn tự động đi kèm "nhan_dien_hinh", KHÔNG phải ô chọn riêng cho giáo
 * viên). Đây là danh sách ĐÚNG để WorksheetForm.jsx render checkbox - dùng hàm này thay vì
 * getImplementedCatalogFor() trực tiếp để không vô tình hiện các block "ẩn, tự động".
 */
export function getSelectableCatalogFor(grade, subject = "TOAN") {
  return getImplementedCatalogFor(grade, subject).filter((item) => !item.hiddenFromForm);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Random 1 câu lệnh trong instructionVariants của 1 dạng bài - nền tảng chống lặp câu chữ. */
export function pickInstructionVariant(key) {
  const item = getCatalogItem(key);
  if (!item || !item.instructionVariants?.length) return "";
  return pick(item.instructionVariants);
}

/** Random 1 mascot trong mascotPool của 1 dạng bài - nền tảng chống lặp linh vật cố định. */
export function pickMascot(key) {
  const item = getCatalogItem(key);
  if (!item || !item.mascotPool?.length) return "⭐";
  return pick(item.mascotPool);
}
