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
 */

export function buildVietnameseExamBlueprint({ grade, selectedBlocks = [], blockInputs = {} }) {
  return {
    grade,
    selectedBlocks,
    blockInputs,
  };
}
