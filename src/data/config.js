/**
 * config.js
 * Hằng số dùng chung toàn hệ thống - gom về 1 nơi để dễ mở rộng (thêm Lớp/Môn học mới chỉ cần
 * sửa ở đây, không phải lục tìm rải rác trong nhiều component).
 */

export const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

/**
 * ⚠️ PHIÊN mở rộng Đạo đức/Khoa học: thêm 2 field TUỲ CHỌN `minGrade`/`maxGrade` vào từng môn -
 * để lọc đúng môn học theo khối lớp thật (không phải môn nào cũng dạy xuyên suốt Lớp 1-12).
 * KHÔNG khai báo 2 field này = áp dụng MỌI khối (giữ NGUYÊN hành vi cũ cho Toán/Tiếng Việt/
 * Tiếng Anh/Lịch sử - không phá vỡ luồng đang chạy ổn định, kể cả khi Lịch sử hiện đang hiển thị
 * cả ở khối 1-3 dù thực tế chương trình chỉ dạy từ Lớp 4 - việc đó nằm NGOÀI phạm vi lần sửa này).
 *
 * Căn cứ đúng chương trình GDPT 2018 (bộ Kết nối tri thức):
 * - Đạo đức: môn độc lập xuyên suốt Lớp 1 -> Lớp 5.
 * - Khoa học: CHỈ tách thành môn riêng ở Lớp 4-5. Lớp 1-3 nội dung tương đương nằm trong môn
 *   "Tự nhiên và Xã hội" (môn KHÁC, chưa có trong hệ thống - không tự ý gộp chung để tránh sai
 *   kiến thức chương trình).
 */
export const SUBJECTS = [
  { value: "Toan", label: "Toán" },
  { value: "Tieng_Viet", label: "Tiếng Việt" },
  { value: "Tieng_Anh", label: "Tiếng Anh" },
  { value: "Lich_Su", label: "Lịch sử" },
  { value: "Dao_Duc", label: "Đạo đức", minGrade: 1, maxGrade: 5 },
  { value: "Khoa_Hoc", label: "Khoa học", minGrade: 4, maxGrade: 5 },
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
