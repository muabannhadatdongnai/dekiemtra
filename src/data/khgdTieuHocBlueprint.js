/**
 * khgdTieuHocBlueprint.js
 * "Bản thiết kế" đầu vào gửi lên /api/generate-khgd-tieu-hoc — file RIÊNG hoàn toàn với
 * khgdBlueprint.js (THCS/THPT), đúng nguyên tắc "mỗi cấp 1 router riêng" đã thống nhất từ đầu.
 *
 * ⚠️ Mẫu Tiểu học (Phụ lục 2, Công văn 2345/2021/BGDĐT-GDTH) - đối chiếu file mẫu THẬT
 * "KHDH CÁC MÔN LỚP 2-KNTT" giáo viên gửi (Phiên 47) - KHÁC HẲN Phụ lục III (THCS/THPT):
 *   - KHÔNG có cột Thiết bị dạy học/Địa điểm dạy học/SWD/NLS riêng (đã hỏi lại người dùng, chốt
 *     GIỮ ĐÚNG mẫu thật, không tự thêm cột không có trong nguồn).
 *   - CÓ thêm "Chủ đề/Mạch nội dung" (1 chủ đề gộp nhiều bài/nhiều tuần) mà THCS không có.
 *   - Chỉ 1 cột gộp "Nội dung điều chỉnh cần thiết (nếu có)" cho MỌI loại lồng ghép (KNS/GDĐP/
 *     GDBVMT/TTĐĐ HCM/GD kĩ năng công dân số/Quyền con người/GDQPAN/liên môn...) - KHÔNG tách
 *     SWD/NLS như THCS.
 *   - KHÔNG có bảng "Kiểm tra, đánh giá định kỳ" (Tiểu học đánh giá theo Thông tư 27, khác hẳn
 *     cách kiểm tra viết/vấn đáp định kỳ của THCS/THPT - chưa có mẫu thật nên KHÔNG làm ở đây).
 *
 * @typedef {Object} KhgdTieuHocLessonInput
 * @property {string} id
 * @property {string} chuDe - "Chủ đề/Mạch nội dung" (VD: "Em lớn lên từng ngày")
 * @property {string} tenBai - VD: "Đọc: Bài 1: Tôi là học sinh lớp 2-Tiết 1"
 * @property {string} tuan - "Tuần, tháng" (giáo viên tự nhập, VD: "Tuần 1")
 * @property {number|string} soTiet - "Tiết học/Thời lượng" mô tả (giáo viên tự nhập, VD: "1")
 * @property {number|string} tietPPCT - Tiết theo PPCT chạy suốt năm (auto-tính ở form, sửa được)
 *
 * @typedef {Object} KhgdTieuHocBlueprint
 * @property {string} subject
 * @property {number} grade - 1-5
 * @property {string} truong
 * @property {string} to
 * @property {string} giaoVien
 * @property {string} namHoc
 * @property {boolean} enableDieuChinh - có nhờ AI soạn cột "Nội dung điều chỉnh cần thiết" không
 * @property {KhgdTieuHocLessonInput[]} lessons
 */

export function buildKhgdTieuHocBlueprint({
  subject,
  grade,
  truong = "",
  to = "",
  giaoVien = "",
  namHoc = "",
  enableDieuChinh = true,
  lessons = [],
}) {
  return { subject, grade, truong, to, giaoVien, namHoc, enableDieuChinh, lessons };
}
