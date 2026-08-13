/**
 * worksheetSampleStructureUtils.js
 * ================== GIAI ĐOẠN 9 (tự động áp dụng cấu trúc phiếu mẫu) ==================
 * Logic THUẦN (không phụ thuộc React/state) tách riêng từ WorksheetForm.jsx để có thể tự verify
 * bằng script gọi hàm trực tiếp - WorksheetForm.jsx là file .jsx (có cú pháp JSX ở phần return)
 * nên KHÔNG thể import thẳng vào 1 script Node thường để test, phải tách phần logic thuần ra 1
 * module .js riêng như thế này.
 */

import { getSelectableCatalogFor } from "@/data/worksheetExerciseCatalog";

/** Số lượng mặc định (theo catalog) cho từng dạng bài khả dụng ở khối lớp + môn học. */
export function defaultCountsFor(grade, subject) {
  return Object.fromEntries(getSelectableCatalogFor(grade, subject).map((item) => [item.key, item.defaultCount ?? 0]));
}

/**
 * Tính object exerciseCounts MỚI theo đúng cấu trúc `spec.detectedExercises` của phiếu mẫu -
 * THAY THẾ hoàn toàn (reset các dạng bài khác về 0), chỉ áp cho key hiện có trong
 * `visibleExercises` (đúng khối lớp/môn đang chọn) - dạng bài mẫu có nhưng khối lớp hiện tại
 * không hỗ trợ thì bỏ qua (an toàn, không lỗi).
 */
export function applyDetectedExercisesToCounts(spec, visibleExercises) {
  const visibleKeys = new Set(visibleExercises.map((item) => item.key));
  const next = {};
  for (const item of visibleExercises) next[item.key] = 0;
  for (const d of spec?.detectedExercises || []) {
    if (visibleKeys.has(d.key)) next[d.key] = d.approxCount;
  }
  return next;
}
