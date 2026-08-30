/**
 * subjectProfiles.js
 * Quy tắc riêng cho từng môn học khi sinh đề bằng AI.
 *
 * ⚠️ SỬA LỖI PHÁT HIỆN KHI TÁI CẤU TRÚC: trước đây prompt LUÔN nói AI là "chuyên gia ra đề
 * thi MÔN TOÁN" và hiển thị "Môn: Toan" (không dấu, đúng mã slug) dù đang tạo đề Tiếng Việt/
 * Tiếng Anh/Lịch sử - ảnh hưởng thật đến chất lượng đề 3 môn mới. Bản này định nghĩa vai trò
 * + quy tắc riêng cho từng môn, và dùng "label" (tên tiếng Việt có dấu) thay vì mã slug khi
 * hiển thị trong prompt.
 *
 * Thêm môn học mới: chỉ cần thêm 1 entry vào SUBJECT_PROFILES, không cần sửa promptTemplates.js.
 */

export const SUBJECT_PROFILES = {
  Toan: {
    label: "Toán",
    expertRole: "một chuyên gia ra đề thi môn Toán chuẩn Bộ Giáo dục Việt Nam",
    extraRules: `- Công thức Toán học phải viết bằng LaTeX, đặt trong dấu $...$ (inline) hoặc $$...$$ (block).
- SỐ LIỆU PHẢI "ĐẸP" VÀ PHÙ HỢP LỨA TUỔI: với Lớp 1-5, ưu tiên số nguyên hoặc phân số/thập phân
  hữu hạn, kết quả cuối cùng phải là số tròn, dễ kiểm tra (tránh số vô tỉ, thập phân vô hạn,
  phân số quá phức tạp). Với Lớp 6 trở lên có thể dùng căn thức/số vô tỉ nếu phù hợp chương trình,
  nhưng vẫn phải đảm bảo có lời giải "sạch", không sai số làm tròn khó chịu.`,
  },
  Tieng_Viet: {
    label: "Tiếng Việt",
    expertRole: "một chuyên gia ra đề thi môn Tiếng Việt / Ngữ văn chuẩn Bộ Giáo dục Việt Nam",
    extraRules: `- Với dạng đọc hiểu: PHẢI trích dẫn một đoạn văn/đoạn thơ NGẮN (nguyên văn hoặc phỏng sát theo
  tài liệu được cung cấp) ngay trong "content" TRƯỚC KHI đặt câu hỏi về đoạn đó, để học sinh có
  ngữ liệu để đọc và trả lời.
- Với câu hỏi từ vựng/ngữ pháp/chính tả: bám sát đúng quy tắc chính tả tiếng Việt hiện hành.
- Tránh dùng từ ngữ địa phương/phương ngữ gây khó hiểu, trừ khi bài học yêu cầu.`,
  },
  Tieng_Anh: {
    label: "Tiếng Anh",
    expertRole: "một chuyên gia ra đề thi môn Tiếng Anh chuẩn Bộ Giáo dục Việt Nam",
    extraRules: `- Đề bài và các phương án trả lời viết bằng tiếng Anh, trừ khi câu hỏi chủ đích kiểm tra dịch
  thuật (khi đó phần yêu cầu bằng tiếng Việt, đáp án vẫn bằng tiếng Anh).
- Từ vựng/cấu trúc ngữ pháp dùng trong câu hỏi phải phù hợp đúng trình độ của lớp được chỉ định,
  không dùng từ/thì phức tạp vượt chương trình.
- Với câu hỏi ngữ pháp, chỉ có DUY NHẤT 1 đáp án đúng chuẩn ngữ pháp.`,
  },
  Lich_Su: {
    label: "Lịch sử",
    expertRole: "một chuyên gia ra đề thi môn Lịch sử chuẩn Bộ Giáo dục Việt Nam",
    extraRules: `- Ưu tiên câu hỏi có mốc thời gian, sự kiện, nhân vật, địa danh lịch sử CỤ THỂ, chính xác theo
  đúng tài liệu được cung cấp - KHÔNG bịa thêm chi tiết lịch sử không có trong nguồn.
- Với câu hỏi trắc nghiệm, các phương án nhiễu (sai) phải là mốc thời gian/sự kiện CÓ THẬT nhưng
  không liên quan trực tiếp đến câu hỏi - không bịa sự kiện giả.
- Không đưa quan điểm chính trị gây tranh cãi ngoài phạm vi sách giáo khoa.`,
  },
  // ⚠️ Đạo đức và Khoa học chỉ dạy ở Tiểu học (xem giới hạn minGrade/maxGrade trong config.js) -
  // 2 quy tắc riêng dưới đây viết RIÊNG cho lứa tuổi Tiểu học, KHÔNG dùng chung khuôn với Lịch sử/
  // Tiếng Anh (vốn có thể dạy tới Lớp 12).
  Dao_Duc: {
    label: "Đạo đức",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Đạo đức bậc Tiểu học chuẩn chương trình Giáo dục " +
      "phổ thông 2018 của Việt Nam",
    extraRules: `- Đây là môn giáo dục PHẨM CHẤT (yêu nước, nhân ái, chăm chỉ, trung thực, trách nhiệm) và KỸ
  NĂNG ỨNG XỬ, KHÔNG phải môn kiến thức hàn lâm - TRÁNH tuyệt đối các câu hỏi kiểu học thuộc lòng
  định nghĩa/ghi nhớ máy móc.
- Ưu tiên dạng câu hỏi TÌNH HUỐNG cụ thể, gần gũi đời sống học sinh Tiểu học (ở nhà, ở trường, với
  bạn bè, nơi công cộng...): mô tả 1 tình huống ngắn rồi hỏi "Em sẽ làm gì/ứng xử thế nào là đúng"
  - với trắc nghiệm, chỉ có DUY NHẤT 1 phương án thể hiện đúng chuẩn mực đạo đức/hành vi phù hợp,
  các phương án còn lại phải là hành vi SAI rõ ràng (không mập mờ, gây tranh cãi giữa giáo viên).
- KHÔNG dùng công thức/số liệu/LaTeX. Ngôn ngữ ngắn gọn, gần gũi, đúng độ tuổi (Lớp 1-2 câu cực
  ngắn 1 tình huống đơn giản; Lớp 3-5 có thể có tình huống nhiều chi tiết hơn, bắt đầu phân biệt
  được các sắc thái đúng-sai gần giống nhau).
- Với câu tự luận, có thể yêu cầu học sinh nêu cách xử lý tình huống hoặc kể lại 1 việc đã làm thể
  hiện phẩm chất đang học - KHÔNG yêu cầu "định nghĩa" khái niệm đạo đức trừu tượng.`,
  },
  Khoa_Hoc: {
    label: "Khoa học",
    expertRole:
      "một chuyên gia ra đề thi môn Khoa học bậc Tiểu học (Lớp 4-5) chuẩn chương trình Giáo dục " +
      "phổ thông 2018 của Việt Nam",
    extraRules: `- Nội dung xoay quanh các chủ đề Khoa học Tiểu học: chất, năng lượng, thực vật và động vật, nấm,
  vi khuẩn, con người và sức khoẻ, sinh vật và môi trường - CHỈ dùng kiến thức có trong tài liệu
  được cung cấp, KHÔNG mở rộng sang kiến thức Vật lý/Hoá học/Sinh học bậc THCS trở lên (VD không
  dùng công thức hoá học, không tính toán vật lý bằng công thức).
- Ưu tiên câu hỏi gắn với QUAN SÁT/THÍ NGHIỆM/HIỆN TƯỢNG THỰC TẾ gần gũi (VD mô tả 1 hiện tượng
  rồi hỏi nguyên nhân/kết quả, hoặc mô tả các bước 1 thí nghiệm đơn giản trong SGK rồi hỏi về kết
  quả/giải thích) thay vì hỏi thuộc lòng định nghĩa suông.
- KHÔNG dùng công thức/ký hiệu hoá học/vật lý dạng LaTeX - trình bày bằng ngôn ngữ thông thường,
  phù hợp học sinh Lớp 4-5.
- Với câu hỏi về sức khoẻ/an toàn (VD phòng bệnh, an toàn thực phẩm, an toàn khi dùng điện), đảm
  bảo thông tin ĐÚNG kiến thức y tế/an toàn phổ thông, không đưa lời khuyên y tế chuyên sâu.`,
  },
};

/** Trả về profile môn học, mặc định về Toán nếu không tìm thấy (an toàn, không bao giờ throw). */
export function getSubjectProfile(subjectValue) {
  return SUBJECT_PROFILES[subjectValue] || SUBJECT_PROFILES.Toan;
}
