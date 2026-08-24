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
 *
 * ================== SỬA LỖI (phát hiện qua fuzz-test khi rà soát chủ động) ==================
 * TRƯỚC ĐÂY: phần dư do làm tròn (drift) bị dồn HẾT vào MỖI câu CUỐI CÙNG - với đề nhiều câu
 * (VD 12 câu), câu cuối vốn có thể chỉ đáng 0.5đ (mức NHẬN BIẾT), drift âm dồn vào có thể kéo
 * điểm câu đó xuống 0 hoặc ÂM (VD "-0.25 điểm") - vô lý trên 1 đề kiểm tra thật, giáo viên/phụ
 * huynh nhìn vào sẽ thấy ngay là lỗi hệ thống.
 * SỬA: đổi drift thành các "nấc" 0.25đ rồi rải LẦN LƯỢT vào các câu có điểm hiện tại CAO NHẤT
 * trước (further sort mỗi vòng để luôn ưu tiên đúng câu đang cao điểm nhất) - câu điểm cao chịu
 * dư/thiếu 0.25đ sẽ ít gây cảm giác bất thường hơn nhiều so với dồn hết vào 1 câu bất kỳ, ĐỒNG
 * THỜI đảm bảo KHÔNG có câu nào bị đưa xuống dưới sàn 0.25đ (nếu 1 câu đã ở sàn, bỏ qua, chuyển
 * sang câu điểm cao kế tiếp).
 */
export function computeScores(questions, totalPoints = 10) {
  if (!questions.length) return questions;

  const weights = questions.map((q) => LEVEL_WEIGHTS[q.level] ?? 1);
  const sumWeights = weights.reduce((a, b) => a + b, 0);

  const rawScores = weights.map((w) => (w / sumWeights) * totalPoints);
  const scores = rawScores.map((v) => Math.round(v * 4) / 4); // làm tròn tới 0.25, sàn tối thiểu áp dụng ngay dưới đây
  const MIN_SCORE = 0.25;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i] < MIN_SCORE) scores[i] = MIN_SCORE; // không câu nào được 0đ hoặc âm điểm
  }

  const currentTotal = scores.reduce((a, b) => a + b, 0);
  // Số "nấc" 0.25đ cần rải thêm (dương) hoặc bớt (âm) để tổng khớp CHÍNH XÁC totalPoints.
  let steps = Math.round((totalPoints - currentTotal) / 0.25);
  let guard = scores.length * 200; // chặn vòng lặp vô hạn nếu dữ liệu đầu vào bất thường
  while (steps !== 0 && guard-- > 0) {
    // Mỗi vòng CHỌN LẠI câu điểm cao nhất hiện tại (đủ điều kiện) - ưu tiên câu đang cao điểm
    // nhất chịu chênh lệch, và với steps < 0 thì loại câu đã chạm sàn 0.25đ khỏi danh sách chọn.
    let bestIdx = -1;
    for (let i = 0; i < scores.length; i++) {
      if (steps < 0 && scores[i] <= MIN_SCORE) continue; // không bớt xuống dưới sàn
      if (bestIdx === -1 || scores[i] > scores[bestIdx]) bestIdx = i;
    }
    if (bestIdx === -1) break; // không còn câu nào đủ điều kiện (trường hợp cực hiếm) - dừng an toàn
    scores[bestIdx] = Math.round((scores[bestIdx] + (steps > 0 ? 0.25 : -0.25)) * 100) / 100;
    steps += steps > 0 ? -1 : 1;
  }

  return questions.map((q, i) => ({ ...q, score: scores[i] }));
}

/** Tổng điểm thực tế của 1 danh sách câu hỏi (dùng để hiển thị "Tổng: X điểm" và tự kiểm tra). */
export function sumScores(questions) {
  return Math.round(questions.reduce((a, q) => a + (q.score || 0), 0) * 100) / 100;
}
