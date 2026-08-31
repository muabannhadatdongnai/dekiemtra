/**
 * config.js
 * Hằng số dùng chung toàn hệ thống - gom về 1 nơi để dễ mở rộng (thêm Lớp/Môn học mới chỉ cần
 * sửa ở đây, không phải lục tìm rải rác trong nhiều component).
 */

export const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * ⚠️ Danh sách môn Tiểu học (Lớp 1-5) chuẩn hoá theo ĐÚNG Thông tư 32/2018/TT-BGDĐT (chương trình
 * GDPT 2018 cấp Tiểu học: 10 môn học + 1 hoạt động giáo dục bắt buộc) và cách chia sách của bộ
 * Kết nối tri thức với cuộc sống (mỗi môn/phân môn = 1 đầu sách riêng):
 *
 *   Môn                      | Khối dạy    | Ghi chú
 *   ------------------------ | ----------- | ------------------------------------------------
 *   Tiếng Việt                | Lớp 1-5     |
 *   Toán                      | Lớp 1-5     |
 *   Đạo đức                   | Lớp 1-5     |
 *   Tiếng Anh (Ngoại ngữ 1)    | Lớp 1-5     | bắt buộc từ Lớp 3, tự chọn Lớp 1-2 -> không giới
 *                              |             |   hạn minGrade để vẫn chọn được ở Lớp 1-2 nếu trường
 *                              |             |   có dạy tự chọn.
 *   Tự nhiên và Xã hội         | Lớp 1-3     | tách thành Lịch sử và Địa lí + Khoa học từ Lớp 4.
 *   Lịch sử và Địa lí          | Lớp 4-5     | 1 môn gộp 2 phân môn (SGK Kết nối tri thức in
 *                              |             |   chung 1 cuốn) - KHÔNG dùng nhãn "Lịch sử" đơn lẻ
 *                              |             |   ở Tiểu học vì sai tên môn thật.
 *   Khoa học                   | Lớp 4-5     |
 *   Tin học                    | Lớp 3-5     | Kết nối tri thức in "Tin học" và "Công nghệ" thành
 *   Công nghệ                  | Lớp 3-5     |   2 đầu sách riêng dù chương trình gọi chung là
 *                              |             |   "Tin học và Công nghệ" - tách 2 môn để đúng với
 *                              |             |   cách giáo viên thực dạy/thực chấm theo từng sách.
 *
 * KHÔNG đưa vào hệ thống lần này: Giáo dục thể chất, Âm nhạc, Mĩ thuật, Hoạt động trải nghiệm -
 * các môn/hoạt động này đánh giá bằng NHẬN XÉT, không có bài kiểm tra định kỳ theo ma trận đề như
 * các môn trên, và có cấu trúc giáo án rất khác (thiên vận động/thực hành/trải nghiệm hơn là
 * chương-bài trong SGK) - cần thiết kế riêng nếu Hoan muốn mở rộng, không nên gộp chung khuôn.
 *
 * "Lịch sử" (không kèm "và Địa lí") giữ nguyên cho khối 6-12 (THCS/THPT, môn thật ở bậc đó) -
 * chỉ giới hạn minGrade: 6 để KHÔNG còn hiện nhầm ở Tiểu học (đã sửa vì Hoan báo dư thừa ở Lớp 1).
 *
 * 2 field TUỲ CHỌN `minGrade`/`maxGrade`: không khai báo = áp dụng MỌI khối (Toán/Tiếng Việt/
 * Tiếng Anh không cần giới hạn vì dạy xuyên suốt/tự chọn sớm).
 */
export const SUBJECTS = [
  { value: "Tieng_Viet", label: "Tiếng Việt" },
  { value: "Toan", label: "Toán" },
  { value: "Dao_Duc", label: "Đạo đức", minGrade: 1, maxGrade: 5 },
  { value: "Tieng_Anh", label: "Tiếng Anh" },
  { value: "Tu_Nhien_Xa_Hoi", label: "Tự nhiên và Xã hội", minGrade: 1, maxGrade: 3 },
  { value: "Lich_Su_Dia_Li", label: "Lịch sử và Địa lí", minGrade: 4, maxGrade: 5 },
  { value: "Khoa_Hoc", label: "Khoa học", minGrade: 4, maxGrade: 5 },
  { value: "Tin_Hoc", label: "Tin học", minGrade: 3, maxGrade: 5 },
  { value: "Cong_Nghe", label: "Công nghệ", minGrade: 3, maxGrade: 5 },
  { value: "Lich_Su", label: "Lịch sử", minGrade: 6 },
];

export function getSubjectLabel(value) {
  return SUBJECTS.find((s) => s.value === value)?.label || value;
}

/**
 * Trả về danh sách môn học PHÙ HỢP với khối lớp đang chọn (lọc theo minGrade/maxGrade nếu môn
 * có khai báo). Dùng ở dropdown "Môn học" của cả 3 tab (Soạn giáo án/Đề cương Ôn tập/Đề kiểm tra)
 * thay vì render thẳng SUBJECTS - tránh giáo viên chọn nhầm môn không tồn tại ở khối đó.
 *
 * `grade` có thể là số (1-12, luồng Đề kiểm tra/Đề cương) hoặc chuỗi đặc biệt (VD "MAM_NON" bên
 * Soạn giáo án) - trường hợp không parse được thành số, trả về nguyên SUBJECTS (không lọc), vì
 * các khối không phải số không thuộc phạm vi minGrade/maxGrade đang xét.
 */
export function getSubjectsForGrade(grade) {
  const gradeNum = Number(grade);
  if (!Number.isFinite(gradeNum)) return SUBJECTS;
  return SUBJECTS.filter((s) => {
    if (s.minGrade != null && gradeNum < s.minGrade) return false;
    if (s.maxGrade != null && gradeNum > s.maxGrade) return false;
    return true;
  });
}
