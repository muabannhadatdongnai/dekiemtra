/**
 * config.js
 * Hằng số dùng chung toàn hệ thống - gom về 1 nơi để dễ mở rộng (thêm Lớp/Môn học mới chỉ cần
 * sửa ở đây, không phải lục tìm rải rác trong nhiều component).
 */

export const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

export const SUBJECTS = [
  { value: "Toan", label: "Toán" },
  { value: "Tieng_Viet", label: "Tiếng Việt" },
  { value: "Tieng_Anh", label: "Tiếng Anh" },
  { value: "Lich_Su", label: "Lịch sử" },
];

export function getSubjectLabel(value) {
  return SUBJECTS.find((s) => s.value === value)?.label || value;
}
