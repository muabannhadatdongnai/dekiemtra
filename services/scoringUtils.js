/**
 * scoringUtils.js
 * Tự động phân bổ điểm số cho từng câu hỏi theo trọng số độ khó, đảm bảo tổng điểm luôn = 10 —
 * đúng thông lệ chấm điểm của giáo viên Việt Nam (mỗi câu phải có điểm rõ ràng, không được
 * để giáo viên tự cộng nhẩm hay đoán barem).
 *
 * Trọng số mặc định (câu khó hơn -> điểm cao hơn). Có thể chỉnh lại nếu trường bạn có quy định khác.
 */
const LEVEL_WEIGHTS = {
  NHAN_BIET: 1,
  THONG_HIEU: 1.5,
  VAN_DUNG: 2.5,
  VAN_DUNG_CAO: 3.5,
};

/**
 * Gán trường `score` cho từng câu hỏi (đơn vị: điểm, làm tròn 0.25) sao cho tổng = totalPoints.
 * Phần dư do làm tròn được cộng/trừ vào câu cuối cùng để đảm bảo tổng chính xác tuyệt đối.
 */
export function computeScores(questions, totalPoints = 10) {
  if (!questions.length) return questions;

  const weights = questions.map((q) => LEVEL_WEIGHTS[q.level] ?? 1);
  const sumWeights = weights.reduce((a, b) => a + b, 0);

  const rawScores = weights.map((w) => (w / sumWeights) * totalPoints);
  const roundedScores = rawScores.map((v) => Math.round(v * 4) / 4); // làm tròn tới 0.25

  const currentTotal = roundedScores.reduce((a, b) => a + b, 0);
  const drift = Math.round((totalPoints - currentTotal) * 100) / 100;
  roundedScores[roundedScores.length - 1] = Math.round((roundedScores[roundedScores.length - 1] + drift) * 100) / 100;

  return questions.map((q, i) => ({ ...q, score: roundedScores[i] }));
}

/** Tổng điểm thực tế của 1 danh sách câu hỏi (dùng để hiển thị "Tổng: X điểm" và tự kiểm tra). */
export function sumScores(questions) {
  return Math.round(questions.reduce((a, q) => a + (q.score || 0), 0) * 100) / 100;
}
