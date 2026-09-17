/**
 * khgdSubjectDefaults.js
 * Dữ liệu MẶC ĐỊNH riêng cho tab "Khung KHGD" (Phụ lục III, CV 5512/BGDĐT-GDTrH) - KHÔNG dùng
 * chung với subjectProfiles.js (vốn chỉ có "label" + "expertRole" phục vụ prompt AI ở Đề kiểm
 * tra/Giáo án/Đề cương). Ở đây mỗi môn (áp dụng cho THCS, Lớp 6-9) cần thêm 2 gợi ý CHỈ ĐỂ ĐIỀN
 * SẴN vào form (giáo viên luôn sửa được, không bắt buộc): "Thiết bị dạy học" và "Địa điểm dạy
 * học" - đúng nguyên tắc "mỗi môn 1 entry riêng, dễ chỉnh sửa" đã thống nhất, KHÔNG dùng 1 hàm
 * sinh chung để giữ mỗi môn độc lập, sửa môn này không ảnh hưởng môn khác.
 *
 * ⚠️ Đây CHỈ là gợi ý mở đầu (pre-fill) cho từng dòng bài học mới thêm vào bảng PPCT ở
 * KhgdForm.jsx - KHÔNG gửi lên AI, KHÔNG ảnh hưởng nội dung SWD/NLS do AI sinh.
 */

export const KHGD_DEFAULT_DEVICE = "Sách giáo khoa, máy chiếu/tivi, phiếu học tập";
export const KHGD_DEFAULT_LOCATION = "Phòng học";

// value phải khớp đúng SUBJECTS trong config.js - phạm vi đợt đầu: TOÀN BỘ môn THCS (Lớp 6-9).
export const KHGD_SUBJECT_DEFAULTS = {
  Toan: {
    device: "SGK, máy chiếu/tivi, thước kẻ, compa, bảng phụ",
    location: "Phòng học",
  },
  Ngu_Van: {
    device: "SGK, máy chiếu/tivi, tranh ảnh minh hoạ, phiếu học tập",
    location: "Phòng học",
  },
  Tieng_Anh: {
    device: "Cassette, CDs, sách mềm (software), máy chiếu/tivi",
    location: "Phòng học",
  },
  Tieng_Trung: { device: "Cassette, CDs, sách mềm (software), máy chiếu/tivi", location: "Phòng học" },
  Tieng_Nhat: { device: "Cassette, CDs, sách mềm (software), máy chiếu/tivi", location: "Phòng học" },
  Tieng_Phap: { device: "Cassette, CDs, sách mềm (software), máy chiếu/tivi", location: "Phòng học" },
  Khoa_Hoc_Tu_Nhien: {
    device: "SGK, dụng cụ thí nghiệm, máy chiếu/tivi, phiếu học tập",
    location: "Phòng học/Phòng thí nghiệm",
  },
  Lich_Su_Dia_Li: {
    device: "SGK, lược đồ/bản đồ, máy chiếu/tivi, tư liệu lịch sử",
    location: "Phòng học",
  },
  Giao_Duc_Cong_Dan: {
    device: "SGK, máy chiếu/tivi, tình huống/video minh hoạ",
    location: "Phòng học",
  },
  Tin_Hoc: {
    device: "Máy tính/phòng máy, máy chiếu/tivi, phần mềm học tập",
    location: "Phòng máy tính",
  },
  Cong_Nghe: {
    device: "SGK, dụng cụ/mô hình thực hành, máy chiếu/tivi",
    location: "Phòng học/Phòng thực hành",
  },
  Giao_Duc_The_Chat: {
    device: "Dụng cụ thể thao (bóng, còi, đồng hồ bấm giờ...)",
    location: "Sân tập thể dục",
  },
  Am_Nhac: {
    device: "Nhạc cụ, loa/đài, máy chiếu/tivi, file nhạc mẫu",
    location: "Phòng học Âm nhạc",
  },
  My_Thuat: {
    device: "Dụng cụ vẽ/tạo hình, tranh mẫu, máy chiếu/tivi",
    location: "Phòng học Mĩ thuật",
  },
  Hoat_Dong_Trai_Nghiem_Huong_Nghiep: {
    device: "SGK, dụng cụ hoạt động nhóm, máy chiếu/tivi",
    location: "Phòng học/Sân trường",
  },
  Noi_Dung_Giao_Duc_Dia_Phuong: {
    device: "Tài liệu giáo dục địa phương, máy chiếu/tivi, tư liệu thực tế",
    location: "Phòng học",
  },
};

/** @returns {{device: string, location: string}} - fallback về mặc định chung nếu môn chưa có entry riêng. */
export function getKhgdSubjectDefaults(subjectValue) {
  return (
    KHGD_SUBJECT_DEFAULTS[subjectValue] || { device: KHGD_DEFAULT_DEVICE, location: KHGD_DEFAULT_LOCATION }
  );
}
