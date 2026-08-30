/**
 * vietnameseExamBlueprint.js
 * "Bản thiết kế" đầu vào gửi lên /api/generate-vietnamese-exam - cùng triết lý examBlueprint.js/
 * lessonPlanBlueprint.js: 1 nơi duy nhất định nghĩa input, tránh lệch giữa VietnameseExamForm.jsx
 * (client) và route.js (server).
 *
 * @typedef {Object} VietnameseExamBlueprint
 * @property {number} grade - Lớp 1-5 (mode này CHỈ áp dụng Tiểu học, xem PROJECT_SUMMARY.md mục A.3)
 * @property {string[]} selectedBlocks - danh sách key khối đã bật, xem src/data/vietnameseExamBlocks.js
 * @property {Object} blockInputs - input riêng của từng khối, dạng { [blockKey]: {...} }.
 *           VD khối "docTham": { chuDe: string, soCauHoi: number }.
 * @property {number} [sgkVolume] - PHIÊN 30 (tuỳ chọn) Tập SGK Tiếng Việt đã chọn để gợi ý Tên bài
 *           + trích chương làm ngữ liệu tham khảo cho khối "Đọc thầm" - xem
 *           vietnameseExamOrchestrator.js (resolveVietnameseSgkReferenceContext()).
 * @property {string} [sgkChapterId] - PHIÊN 30 (tuỳ chọn) Chương/Bài SGK Tiếng Việt đã chọn, đi
 *           kèm sgkVolume ở trên.
 */

export function buildVietnameseExamBlueprint({ grade, selectedBlocks = [], blockInputs = {}, sgkVolume = null, sgkChapterId = null }) {
  return {
    grade,
    selectedBlocks,
    blockInputs,
    sgkVolume,
    sgkChapterId,
  };
}
