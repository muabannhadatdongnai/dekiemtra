/**
 * outlineBlueprint.js
 * "Bản thiết kế" đầu vào gửi lên /api/generate-outline - cùng triết lý examBlueprint.js/
 * lessonPlanBlueprint.js: 1 nơi duy nhất định nghĩa input, tránh lệch giữa OutlineForm.jsx
 * (client) và route.js (server).
 *
 * @typedef {Object} OutlineBlueprint
 * @property {string} subject - mã môn học, xem src/data/config.js -> SUBJECTS
 * @property {number} grade - Lớp 1-12
 * @property {number} [volume] - 1 | 2
 * @property {string[]} chapterIds - các chương/bài đã chọn từ kho SGK (có thể nhiều chương)
 * @property {{coBan:number, nangCao:number, vanDungCao:number}} exerciseCounts - số bài/mức,
 *   xem OUTLINE_LEVELS trong outlineTemplates.js
 * @property {string} [yeuCauDacBiet] - giáo viên tự gõ yêu cầu riêng cho lượt soạn này
 */

export function buildOutlineBlueprint({
  subject,
  grade,
  volume = 1,
  chapterIds = [],
  exerciseCounts,
  yeuCauDacBiet = "",
}) {
  return {
    subject,
    grade,
    volume,
    chapterIds,
    exerciseCounts,
    yeuCauDacBiet,
  };
}
