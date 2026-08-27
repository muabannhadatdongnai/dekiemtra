// ============================================================================================
// VÍ DỤ MẪU — Phụ lục "Bài" cho tính năng gợi ý Tên bài soạn + Nội dung cốt lõi (Phiên 25)
// ============================================================================================
// File này CHỈ để tham khảo cấu trúc, KHÔNG được app đọc trực tiếp (không nằm trong thư mục
// sach_giao_khoa/). Để tính năng gợi ý hoạt động thật, copy phần JSON bên dưới (bỏ phần comment
// này) thành 1 file JSON riêng, đặt ĐÚNG đường dẫn sau trong KHO GITHUB KIẾN THỨC của bạn
// (biến GITHUB_KNOWLEDGE_REPO trong .env.local), CẠNH file chương .md đã có sẵn:
//
//   sach_giao_khoa/lop_{lớp}/{môn}_t{tập}/chuong_{n}_bai.json
//
// Ví dụ cho Toán Lớp 5, Tập 1, Chương 1 (cạnh file chuong_1.md đã có):
//   sach_giao_khoa/lop_5/toan_t1/chuong_1_bai.json
//
// QUY TẮC:
// - Mỗi phần tử: { "soBai": số (tuỳ chọn), "tenBai": bắt buộc, "noiDungCotLoi": tuỳ chọn }
// - "noiDungCotLoi" nên là 2-3 câu tóm tắt mục tiêu/kiến thức trọng tâm của bài, lấy/diễn giải từ
//   Sách giáo viên - đây là nội dung sẽ tự điền vào ô "Nội dung cốt lõi" khi giáo viên chọn bài.
// - Chương chưa có file này -> tính năng gợi ý đơn giản là không hiện gì, KHÔNG lỗi, giáo viên
//   vẫn soạn bình thường bằng cách gõ tay như trước (không bắt buộc phải làm phụ lục cho MỌI
//   chương ngay từ đầu - có thể làm dần theo chương hay dùng nhiều nhất trước).
//
// Nội dung cốt lõi bên dưới CHỈ MANG TÍNH MINH HOẠ CẤU TRÚC - dangkhoa cần thay bằng nội dung
// chính xác lấy từ Sách giáo viên thật trước khi đưa vào dùng thật cho giáo viên.

const VI_DU_CHUONG_1_BAI_JSON = [
  {
    soBai: 1,
    tenBai: "Ôn tập các số đến 100 000",
    noiDungCotLoi:
      "Ôn tập đọc, viết, so sánh và sắp xếp các số trong phạm vi 100 000. Nhận biết hàng và giá trị của chữ số theo hàng.",
  },
  {
    soBai: 2,
    tenBai: "Ôn tập phép cộng, phép trừ",
    noiDungCotLoi:
      "Củng cố kỹ thuật tính cộng, trừ (có nhớ) trong phạm vi các số đã học. Vận dụng giải toán có lời văn liên quan đến cộng, trừ.",
  },
  {
    soBai: 3,
    tenBai: "Ôn tập phép nhân, phép chia",
    noiDungCotLoi:
      "Củng cố bảng nhân, bảng chia đã học; kỹ thuật nhân/chia số có nhiều chữ số cho số có 1 chữ số. Vận dụng vào giải toán thực tế.",
  },
];

module.exports = { VI_DU_CHUONG_1_BAI_JSON };
