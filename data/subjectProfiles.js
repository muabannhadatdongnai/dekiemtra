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
};

/** Trả về profile môn học, mặc định về Toán nếu không tìm thấy (an toàn, không bao giờ throw). */
export function getSubjectProfile(subjectValue) {
  return SUBJECT_PROFILES[subjectValue] || SUBJECT_PROFILES.Toan;
}
