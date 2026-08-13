/**
 * worksheetTopicPackages.js
 * ================== GIAI ĐOẠN 9, BƯỚC 2 (Tầng B - catalog theo chủ đề SGK) ==================
 * Trước Bước 2, giáo viên phải tự chọn RỜI RẠC từng dạng bài trong catalog (worksheetExerciseCatalog.js)
 * - không có khái niệm "gói" tương ứng với 1 mạch nội dung SGK cụ thể (VD phiếu mẫu cô Hồng Đây:
 * toàn bộ 5 mục đều xoay quanh ĐÚNG 1 chủ đề "Đổi đơn vị đo độ dài"). File này định nghĩa các
 * "gói chủ đề" - bấm 1 nút là bật NGAY cả nhóm dạng bài liên quan, thay vì phải tự nhớ bật từng ô.
 *
 * ⚠️ PHẠM VI ĐỢT NÀY: chỉ có 2 gói cho LỚP 1 ("Độ dài", "Thời gian") - đúng 2 mạch nội dung Lớp 1
 * có trong chương trình GDPT 2018 (Lớp 1 CHƯA học "Tiền Việt Nam" hay "chu vi hình", những chủ đề
 * đó dành cho Lớp 2 - sẽ làm ở lượt Bước 2 kế tiếp, xem PROJECT_SUMMARY.md).
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
];

/** Lấy toàn bộ gói chủ đề khả dụng cho 1 khối lớp + môn học. */
export function getTopicPackagesFor(grade, subject = "TOAN") {
  return WORKSHEET_TOPIC_PACKAGES.filter((t) => t.grade === grade && t.subject === subject);
}

/** Tra cứu 1 gói theo id - dùng khi giáo viên bấm áp dụng. */
export function getTopicPackageById(id) {
  return WORKSHEET_TOPIC_PACKAGES.find((t) => t.id === id) || null;
}
