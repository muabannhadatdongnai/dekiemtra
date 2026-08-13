import { DIFFICULTY_LEVELS } from "@/data/promptTemplates";
import { computeScores } from "./scoringUtils";

/**
 * specificationBuilder.js
 * Tính "Ma trận đề thi" và "Bản đặc tả" (chuẩn Thông tư 22) HOÀN TOÀN từ danh sách câu hỏi
 * đã được tạo (mỗi câu đã có sẵn "chapterRef" + "level" từ Giai đoạn 1) - KHÔNG gọi thêm AI,
 * không tốn thêm credit.
 *
 * ⚠️ Ma trận dùng số liệu THỰC TẾ (từ questions đã tạo), không phải số liệu YÊU CẦU ban đầu -
 * nếu AI tạo thiếu 1 vài câu ở chương nào đó (xem "warnings"), Ma trận sẽ phản ánh đúng thực tế
 * đã giao cho học sinh, không phải con số lý tưởng ban đầu.
 */

const TYPE_ABBR = { trac_nghiem: "TN", tu_luan: "TL" };

/** Văn bản "Yêu cầu cần đạt" cho Bản đặc tả - viết theo giọng mô tả năng lực học sinh (không phải hướng dẫn AI). */
const SPEC_REQUIREMENT_TEMPLATES = {
  NHAN_BIET: (chapterLabel) =>
    `Nhận biết được các khái niệm, công thức, dữ liệu cơ bản thuộc ${chapterLabel}.`,
  THONG_HIEU: (chapterLabel) =>
    `Hiểu và vận dụng đơn giản (1-2 bước biến đổi) kiến thức thuộc ${chapterLabel}.`,
  VAN_DUNG: (chapterLabel) =>
    `Vận dụng kết hợp nhiều kiến thức, giải quyết tình huống thực tế liên quan ${chapterLabel}.`,
  VAN_DUNG_CAO: (chapterLabel) =>
    `Vận dụng sáng tạo, phân hoá học sinh giỏi với bài toán phức tạp thuộc ${chapterLabel}.`,
};

/**
 * Tính Ma trận đề thi: mỗi hàng là 1 chương, mỗi cột là 1 mức độ (kèm loại TN/TL cố định theo
 * mức độ đó), có cột Điểm (tự tính theo trọng số độ khó, tổng luôn = 10) và dòng/cột Tổng.
 */
export function computeExamMatrix(questions, chaptersInfo, typeByLevel = {}) {
  const levelKeys = Object.keys(DIFFICULTY_LEVELS);
  // Tính điểm cục bộ CHỈ để phục vụ Ma trận (không gắn vào bản đề học sinh) - xem scoringUtils.js
  const scored = computeScores(questions);

  const rows = chaptersInfo.map((chapter) => {
    const counts = {};
    const points = {};
    levelKeys.forEach((lvl) => {
      const matched = scored.filter((q) => q.chapterRef === chapter.chapterId && q.level === lvl);
      counts[lvl] = matched.length;
      points[lvl] = Math.round(matched.reduce((sum, q) => sum + (q.score || 0), 0) * 100) / 100;
    });
    const rowCount = Object.values(counts).reduce((a, b) => a + b, 0);
    const rowPoints = Math.round(Object.values(points).reduce((a, b) => a + b, 0) * 100) / 100;
    return { chapterId: chapter.chapterId, label: chapter.label, counts, points, rowCount, rowPoints };
  });

  const columnCountTotals = {};
  const columnPointTotals = {};
  levelKeys.forEach((lvl) => {
    columnCountTotals[lvl] = rows.reduce((sum, r) => sum + r.counts[lvl], 0);
    columnPointTotals[lvl] = Math.round(rows.reduce((sum, r) => sum + r.points[lvl], 0) * 100) / 100;
  });

  const grandCount = Object.values(columnCountTotals).reduce((a, b) => a + b, 0);
  const grandPoints = Math.round(Object.values(columnPointTotals).reduce((a, b) => a + b, 0) * 100) / 100;

  return {
    levelKeys,
    typeByLevel,
    rows,
    columnCountTotals,
    columnPointTotals,
    grandCount,
    grandPoints,
  };
}

/**
 * Sinh Bản đặc tả: 1 dòng cho mỗi (chương, mức độ) thực sự có câu hỏi (count > 0), kèm số thứ
 * tự câu tương ứng trong đề gốc (theo thứ tự trước khi đảo mã đề).
 */
export function computeSpecificationRows(questions, chaptersInfo, typeByLevel = {}) {
  const levelKeys = Object.keys(DIFFICULTY_LEVELS);
  const rows = [];
  let stt = 1;

  const questionsWithIndex = questions.map((q, idx) => ({ ...q, __no: idx + 1 }));

  chaptersInfo.forEach((chapter) => {
    levelKeys.forEach((lvl) => {
      const matched = questionsWithIndex.filter(
        (q) => q.chapterRef === chapter.chapterId && q.level === lvl
      );
      if (matched.length === 0) return;

      const level = DIFFICULTY_LEVELS[lvl];
      const type = typeByLevel[lvl] || "trac_nghiem";
      const requirementFn = SPEC_REQUIREMENT_TEMPLATES[lvl];

      rows.push({
        stt: stt++,
        chapterLabel: chapter.label,
        levelLabel: level.label,
        typeLabel: TYPE_ABBR[type] || "TN",
        requirement: requirementFn ? requirementFn(chapter.label) : level.description,
        count: matched.length,
        questionNumbers: matched.map((q) => q.__no).join(", "),
      });
    });
  });

  return rows;
}
