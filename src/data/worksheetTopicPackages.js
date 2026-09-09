/**
 * worksheetTopicPackages.js
 * ================== GIAI ĐOẠN 9, BƯỚC 2 (Tầng B - catalog theo chủ đề SGK) ==================
 * Trước Bước 2, giáo viên phải tự chọn RỜI RẠC từng dạng bài trong catalog (worksheetExerciseCatalog.js)
 * - không có khái niệm "gói" tương ứng với 1 mạch nội dung SGK cụ thể (VD phiếu mẫu cô Hồng Đây:
 * toàn bộ 5 mục đều xoay quanh ĐÚNG 1 chủ đề "Đổi đơn vị đo độ dài"). File này định nghĩa các
 * "gói chủ đề" - bấm 1 nút là bật NGAY cả nhóm dạng bài liên quan, thay vì phải tự nhớ bật từng ô.
 *
 * ⚠️ PHẠM VI: Lớp 1 (2 gói: "Độ dài", "Thời gian") + Lớp 3 (4 gói, thêm ĐỢT 3 - xem log bên dưới).
 * Lớp 1 CHƯA học "Tiền Việt Nam" hay "chu vi hình", những chủ đề đó dành cho Lớp 2 trở lên.
 *
 * LƯU Ý: các dạng bài trong `exerciseKeys` PHẢI đã có trong WORKSHEET_EXERCISE_CATALOG (đúng
 * key) VÀ đã có generator thật trong worksheetSchemas.js - file này CHỈ gom nhóm, không tự định
 * nghĩa dạng bài mới.
 */

export const WORKSHEET_TOPIC_PACKAGES = [
  {
    id: "lop1_do_dai",
    grade: "LOP_1",
    subject: "TOAN",
    label: "Độ dài",
    icon: "📏",
    description: "So sánh và sắp xếp độ dài - đúng mạch \"Độ dài và đo độ dài\" trong SGK Lớp 1.",
    exerciseKeys: ["do_dai_so_sanh", "do_dai_sap_xep"],
  },
  {
    id: "lop1_thoi_gian",
    grade: "LOP_1",
    subject: "TOAN",
    label: "Thời gian",
    icon: "⏰",
    description: "Xem đồng hồ giờ đúng và các ngày trong tuần - đúng mạch \"Thời gian, giờ và lịch\" trong SGK Lớp 1.",
    exerciseKeys: ["xem_dong_ho_gio_dung", "cac_ngay_trong_tuan"],
  },
  // ================== MỞ RỘNG LỚP 3, ĐỢT 3 ==================
  // 4 gói cho Lớp 3, gom theo ĐÚNG thứ tự mạch nội dung xuất hiện trong PPCT SGK Toán 3 KNTT
  // (số học -> hình học/đo lường -> thời gian/tiền tệ -> thống kê & xác suất). CHỈ gom các dạng
  // bài "độc quyền" Lớp 3 (minGrade=maxGrade=LOP_3 trong catalog) - không gom "tính nhẩm"/"so
  // sánh"/... vì các dạng đó dùng chung nhiều khối lớp, không thuộc riêng 1 mạch nội dung Lớp 3.
  {
    id: "lop3_nhan_chia",
    grade: "LOP_3",
    subject: "TOAN",
    label: "Nhân, chia trong bảng",
    icon: "🧮",
    description: "Nhân, chia trong phạm vi bảng cửu chương - đúng mạch \"Bảng nhân, bảng chia\" trong SGK Toán 3.",
    exerciseKeys: ["nhan_chia_bang"],
  },
  {
    id: "lop3_hinh_hoc_do_luong",
    grade: "LOP_3",
    subject: "TOAN",
    label: "Hình học & Đơn vị đo",
    icon: "📐",
    description: "Chu vi, diện tích hình vuông/chữ nhật và đổi đơn vị đo độ dài, khối lượng, dung tích - đúng mạch \"Hình học và đo lường\" SGK Toán 3.",
    exerciseKeys: ["chu_vi_dien_tich", "doi_don_vi_do"],
  },
  {
    id: "lop3_thoi_gian_tien_te",
    grade: "LOP_3",
    subject: "TOAN",
    label: "Thời gian & Tiền tệ",
    icon: "🕒",
    description: "Xem đồng hồ giờ, phút và tính tổng tiền Việt Nam - đúng mạch \"Thời gian và tiền Việt Nam\" SGK Toán 3.",
    exerciseKeys: ["xem_dong_ho_gio_phut", "tien_viet_nam"],
  },
  {
    id: "lop3_thong_ke_xac_suat",
    grade: "LOP_3",
    subject: "TOAN",
    label: "Thống kê & Xác suất",
    icon: "📊",
    description: "Thu thập, phân loại số liệu và khả năng xảy ra của một sự kiện - đúng mạch \"Một số yếu tố thống kê, xác suất\" SGK Toán 3.",
    exerciseKeys: ["thu_thap_so_lieu", "kha_nang_xay_ra"],
  },
  // ================== MỞ RỘNG LỚP 4-5, PHIÊN 42 ==================
  // Phản hồi Hoan (Phiên 41): "khung chọn bài trông cứng nhắc, không linh động" - đúng nguyên
  // nhân là Lớp 4/5 TRƯỚC ĐÂY chưa có gói chủ đề nào (chỉ Lớp 1/3 có), giáo viên phải tự bật rời
  // rạc từng dòng. Bổ sung theo ĐÚNG thứ tự mạch nội dung PPCT SGK Toán 4-5 KNTT, cùng nguyên tắc
  // Lớp 3: chỉ gom dạng bài "độc quyền" 1-2 khối này (không gom so_sanh/day_so... dùng chung nhiều
  // khối). Gói "Ôn tập số tự nhiên" dùng CHUNG cho cả 2 khối vì đúng là Bài 1 mở đầu SGK của CẢ
  // Lớp 4 lẫn Lớp 5 (xem generateCauTaoSo(), worksheetSchemas.js - đối chiếu PDF mẫu Hoan gửi).
  {
    id: "lop4_on_tap_so_tu_nhien",
    grade: "LOP_4",
    subject: "TOAN",
    label: "Ôn tập số tự nhiên",
    icon: "🔢",
    description: "Đọc, viết số theo cấu tạo hàng và trắc nghiệm A/B/C/D - đúng mạch \"Ôn tập và bổ sung\" (Bài 1) mở đầu SGK Toán 4.",
    exerciseKeys: ["cau_tao_so", "trac_nghiem_so_tu_nhien"],
  },
  {
    id: "lop4_phan_so",
    grade: "LOP_4",
    subject: "TOAN",
    label: "Phân số",
    icon: "🍕",
    description: "Rút gọn và so sánh phân số - đúng mạch \"Phân số\" SGK Toán 4.",
    exerciseKeys: ["phan_so_rut_gon", "phan_so_so_sanh"],
  },
  {
    id: "lop4_bieu_thuc_va_hinh_hoc",
    grade: "LOP_4",
    subject: "TOAN",
    label: "Biểu thức chữ & Góc",
    icon: "📐",
    description: "Biểu thức có chứa chữ và nhận biết các loại góc - 2 mạch nội dung riêng của SGK Toán 4, gom chung 1 gói vì đều là kiến thức MỚI (chưa dạy ở Lớp 3).",
    exerciseKeys: ["bieu_thuc_chu", "goc_nhan_biet"],
  },
  {
    id: "lop5_on_tap_so_tu_nhien",
    grade: "LOP_5",
    subject: "TOAN",
    label: "Ôn tập số tự nhiên",
    icon: "🔢",
    description: "Đọc, viết số theo cấu tạo hàng (mở rộng tới hàng chục triệu) và trắc nghiệm A/B/C/D - đúng mạch \"Ôn tập và bổ sung\" (Bài 1) mở đầu SGK Toán 5.",
    exerciseKeys: ["cau_tao_so", "trac_nghiem_so_tu_nhien"],
  },
  {
    id: "lop5_so_thap_phan",
    grade: "LOP_5",
    subject: "TOAN",
    label: "Số thập phân",
    icon: "🔟",
    description: "So sánh, cộng, trừ, nhân, chia số thập phân (kể cả chia nâng cao và chia có dư) - đúng mạch \"Số thập phân\" SGK Toán 5.",
    exerciseKeys: [
      "so_thap_phan_so_sanh",
      "so_thap_phan_cong_tru",
      "so_thap_phan_nhan",
      "so_thap_phan_chia",
      "so_thap_phan_chia_nang_cao",
      "phep_chia_co_du",
    ],
  },
  {
    id: "lop5_ti_so_phan_tram",
    grade: "LOP_5",
    subject: "TOAN",
    label: "Tỉ số phần trăm",
    icon: "💯",
    description: "Tìm tỉ số phần trăm, tìm giá trị phần trăm của một số - đúng mạch \"Tỉ số. Tỉ số phần trăm\" SGK Toán 5.",
    exerciseKeys: ["ti_so_phan_tram"],
  },
  {
    id: "lop5_hinh_hoc_phang",
    grade: "LOP_5",
    subject: "TOAN",
    label: "Hình học phẳng",
    icon: "📐",
    description: "Diện tích hình tam giác, hình thang và hình tròn - đúng mạch \"Hình tam giác. Hình thang. Hình tròn\" SGK Toán 5.",
    exerciseKeys: ["hinh_tam_giac_hinh_thang", "hinh_tron"],
  },
  {
    id: "lop5_hinh_khong_gian",
    grade: "LOP_5",
    subject: "TOAN",
    label: "Hình học không gian",
    icon: "📦",
    description: "Thể tích hình hộp chữ nhật/lập phương, đổi đơn vị đo thể tích và diện tích xung quanh/toàn phần - đúng mạch \"Hình hộp chữ nhật. Hình lập phương\" SGK Toán 5.",
    exerciseKeys: ["the_tich_hhcn_lp", "doi_don_vi_the_tich", "dien_tich_xq_tp"],
  },
  {
    id: "lop5_van_toc_thoi_gian",
    grade: "LOP_5",
    subject: "TOAN",
    label: "Vận tốc & Số đo thời gian",
    icon: "🚗",
    description: "Cộng trừ số đo thời gian và toán chuyển động đều (vận tốc, quãng đường, thời gian) - đúng mạch \"Chuyển động đều\" SGK Toán 5.",
    exerciseKeys: ["so_do_thoi_gian", "van_toc_quang_duong_thoi_gian"],
  },
];

/** Lấy toàn bộ gói chủ đề khả dụng cho 1 khối lớp + môn học. */
export function getTopicPackagesFor(grade, subject = "TOAN") {
  return WORKSHEET_TOPIC_PACKAGES.filter((t) => t.grade === grade && t.subject === subject);
}

/** Tra cứu 1 gói theo id - dùng khi giáo viên bấm áp dụng. */
export function getTopicPackageById(id) {
  return WORKSHEET_TOPIC_PACKAGES.find((t) => t.id === id) || null;
}
