import { getSubjectProfile } from "@/data/subjectProfiles";

/**
 * khgdTieuHocPromptTemplates.js
 * Dựng prompt AI cho tab "Khung KHGD - Tiểu học" - CHỈ soạn 1 trường DUY NHẤT: "dieuChinh" (Nội
 * dung điều chỉnh cần thiết, nếu có) cho mỗi bài - KHÁC khgdPromptTemplates.js (THCS/THPT) vốn
 * soạn 2 trường riêng "swd"/"nls". Mẫu Tiểu học GỘP mọi loại lồng ghép (GD kỹ năng sống, giáo dục
 * địa phương, bảo vệ môi trường, tư tưởng đạo đức HCM, kĩ năng công dân số, quyền con người,
 * quốc phòng an ninh, tích hợp liên môn...) vào CHUNG 1 cột - xem ví dụ thật trong file mẫu
 * "KHDH CÁC MÔN LỚP 2-KNTT" giáo viên gửi (Phiên 47).
 */

export const KHGD_TIEU_HOC_MODEL = "gemini-3.5-flash";

function buildLessonListBlock(lessons) {
  return lessons
    .map((l, i) => `${i + 1}. [id="${l.id}"] Chủ đề "${l.chuDe || "-"}" - Bài "${l.tenBai}"`)
    .join("\n");
}

export function buildKhgdTieuHocPrompt({ subject, grade, lessons }) {
  const subjectProfile = getSubjectProfile(subject);

  return `
BẠN LÀ ${subjectProfile.expertRole.toUpperCase()}, ĐANG HỖ TRỢ GIÁO VIÊN TIỂU HỌC HOÀN THIỆN "KẾ
HOẠCH DẠY HỌC CÁC MÔN HỌC, HOẠT ĐỘNG GIÁO DỤC" (Phụ lục 2, Công văn 2345/2021/BGDĐT-GDTH) - CỘT
"NỘI DUNG ĐIỀU CHỈNH CẦN THIẾT (NẾU CÓ)" cho danh sách bài học dưới đây.

THÔNG TIN CHUNG: Môn ${subjectProfile.label} - Lớp ${grade}.

⚠️ QUAN TRỌNG: bạn KHÔNG được đổi/đoán lại tên bài, chủ đề, tuần, số tiết - CHỈ soạn đúng 1
trường "dieuChinh" cho MỖI bài. Danh sách bài học:
${buildLessonListBlock(lessons)}

YÊU CẦU CHO TRƯỜNG "dieuChinh" (1 CÂU NGẮN, hoặc CHUỖI RỖNG nếu bài không cần lồng ghép gì thêm -
PHẦN LỚN các bài KHÔNG cần, chỉ những bài THỰC SỰ phù hợp mới có nội dung, ước tính khoảng 1 bài
có nội dung trên mỗi 5-8 bài liên tiếp, đúng tỉ lệ thường gặp trong thực tế):
- Nếu phù hợp, chọn ĐÚNG 1 LOẠI lồng ghép sát với nội dung/chủ đề bài học đó, viết theo mẫu câu
  văn phong hành chính giáo dục Việt Nam, ví dụ (không sao chép nguyên văn, chỉ mô phỏng văn
  phong): "GD KNS: Biết quý trọng và sử dụng thời gian hợp lí.", "Tích hợp GDĐP: Giới thiệu nét
  văn hoá/phong tục địa phương liên quan chủ đề bài học.", "GD BVMT: Giáo dục ý thức bảo vệ môi
  trường/động vật.", "Tích hợp TTĐĐ HCM: ...", "GD kĩ năng công dân số: Hướng dẫn học sinh tìm
  kiếm thông tin/dữ liệu đơn giản trong môi trường số liên quan chủ đề bài học.", "Tích hợp Quyền
  con người: ...", "GDQPAN: ..." (chỉ dùng khi bài học THỰC SỰ liên quan chủ quyền/quốc phòng).
- Các loại lồng ghép trên là VÍ DỤ THAM KHẢO PHỔ BIẾN, không bắt buộc dùng đúng nhãn này - hãy
  chọn loại lồng ghép PHÙ HỢP NHẤT với nội dung bài, hoặc để trống nếu không có gì phù hợp.
- KHÔNG gán lồng ghép GƯỢNG ÉP cho bài không liên quan.
- Các dòng có hậu tố "- Tiết 2" (hoặc "- Tiết 3"...) là TIẾT TIẾP THEO của cùng 1 hoạt động ở dòng
  "- Tiết 1" ngay phía trên (VD "Đọc: Bài 1: ... - Tiết 1", "Đọc: Bài 1: ... - Tiết 2"). Nếu hoạt
  động đó cần lồng ghép, CHỈ ghi ở dòng "- Tiết 1" và để CHUỖI RỖNG ở các dòng "- Tiết" tiếp theo -
  không lặp lại cùng 1 nội dung ở nhiều dòng của cùng 1 hoạt động.

ĐỊNH DẠNG JSON TRẢ VỀ (BẮT BUỘC, không kèm giải thích/markdown ngoài JSON):
{ "lessons": [ { "id": "(chép lại ĐÚNG id)", "dieuChinh": "..." } ] }
Mảng "lessons" PHẢI có ĐỦ ${lessons.length} phần tử, ĐÚNG THỨ TỰ và ĐÚNG "id" như danh sách trên.
`;
}
