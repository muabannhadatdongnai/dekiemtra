/**
 * khgdBlueprint.js
 * "Bản thiết kế" đầu vào gửi lên /api/generate-khgd - cùng triết lý outlineBlueprint.js: 1 nơi
 * duy nhất định nghĩa input, tránh lệch giữa KhgdForm.jsx (client) và route.js (server).
 *
 * ⚠️ Phiên 50: form CÓ nút "Tự tính số tiết & đề xuất Ôn tập/Kiểm tra" (khgdSchedule.js) - tính ở CLIENT rồi giáo
 * viên sửa được; dòng loai:"onTap"/"kiemTra" KHÔNG gửi lên server (chỉ dòng bài học cần SWD/NLS). Server vẫn KHÔNG tính số tiết.
 *
 * ⚠️ KHÁC outlineBlueprint.js ở 1 điểm quan trọng: "Số tiết" mỗi bài KHÔNG do AI/GitHub tính -
 * giáo viên tự gõ tay (đã chốt với người dùng, xem NEXT_STEPS.md) - vì vậy "lessons" gửi lên đã
 * là danh sách ĐẦY ĐỦ do giáo viên tự biên tập trên KhgdForm.jsx (tên bài GỢI Ý từ kho GitHub,
 * số tiết/tuần/thiết bị/địa điểm giáo viên tự nhập/sửa) - server CHỈ còn việc gọi AI viết thêm
 * đoạn "SWD"/"NLS" cho từng bài (nếu bật), KHÔNG tính toán lại số tiết/tuần.
 *
 * @typedef {Object} KhgdLessonInput
 * @property {string} id - id tạm ở client (dùng để khớp lại kết quả AI trả về đúng dòng)
 * @property {string} tenBai - tên bài học (giáo viên tự gõ hoặc gợi ý từ kho GitHub)
 * @property {string} chuong - tên chương/chủ đề chứa bài này (hiển thị tham khảo, không bắt buộc)
 * @property {number|string} soTiet - số tiết (giáo viên tự nhập)
 * @property {string} tuan - "Thời điểm" (VD: "Tuần 1", "55" - giáo viên tự nhập, không chuẩn hoá)
 * @property {string} thietBi - Thiết bị dạy học (đã điền sẵn theo môn, giáo viên có thể sửa)
 * @property {string} diaDiem - Địa điểm dạy học (đã điền sẵn theo môn, giáo viên có thể sửa)
 * @property {string} [noiDung] - (Phiên 49) đoạn TRÍCH từ Markdown SGK của bài (do form gắn vào khi nạp
 *   gợi ý từ kho GitHub - xem khgdOutlineService.js); AI BẮT BUỘC bám vào đây để viết SWD/NLS chi tiết.
 *   Bài gõ tay/không có Markdown → rỗng, AI chỉ dựa vào tên bài. Server luôn cắt độ dài (sanitizeKhgdLessons).
 *
 * @typedef {Object} KhgdKiemTraMoc
 * @property {string} ten - VD: "Giữa Học kỳ 1"
 * @property {string} thoiGian - VD: "60 phút"
 * @property {string} thoiDiem - VD: "Tuần 9, Tiết 26,27"
 * @property {string} yeuCauCanDat - giáo viên tự gõ (không bắt buộc)
 * @property {string} hinhThuc - VD: "Viết (giấy)", "Vấn đáp"
 *
 * @typedef {Object} KhgdBlueprint
 * @property {string} subject
 * @property {number} grade
 * @property {string} truong
 * @property {string} to
 * @property {string} giaoVien
 * @property {string} namHoc
 * @property {boolean} enableSwd - có lồng ghép nội dung khuyết tật (SWD) hay không
 * @property {boolean} enableNls - có lồng ghép Biểu hiện Năng lực số (NLS) hay không
 * @property {KhgdLessonInput[]} lessons
 * @property {KhgdKiemTraMoc[]} kiemTraDinhKy
 */

export function buildKhgdBlueprint({
  subject,
  grade,
  truong = "",
  to = "",
  giaoVien = "",
  namHoc = "",
  enableSwd = true,
  enableNls = true,
  lessons = [],
  kiemTraDinhKy = [],
}) {
  return {
    subject,
    grade,
    truong,
    to,
    giaoVien,
    namHoc,
    enableSwd,
    enableNls,
    lessons,
    kiemTraDinhKy,
  };
}
