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
];

/** Lấy toàn bộ gói chủ đề khả dụng cho 1 khối lớp + môn học. */
export function getTopicPackagesFor(grade, subject = "TOAN") {
  return WORKSHEET_TOPIC_PACKAGES.filter((t) => t.grade === grade && t.subject === subject);
}

/** Tra cứu 1 gói theo id - dùng khi giáo viên bấm áp dụng. */
export function getTopicPackageById(id) {
  return WORKSHEET_TOPIC_PACKAGES.find((t) => t.id === id) || null;
}
