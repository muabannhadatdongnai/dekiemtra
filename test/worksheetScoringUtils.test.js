import { test } from "node:test";
import assert from "node:assert/strict";
import { computeScores, sumScores } from "../src/services/scoringUtils.js";

/**
 * worksheetScoringUtils.test.js
 * SỬA LỖI (phát hiện qua rà soát chủ động, không phải phản hồi giáo viên): với đề nhiều câu
 * (VD 12 câu), phần dư làm tròn (drift) trước đây bị dồn HẾT vào câu CUỐI CÙNG bất kể câu đó vốn
 * chỉ đáng bao nhiêu điểm - có thể kéo điểm câu đó xuống 0 hoặc ÂM (VD "-0.25 điểm"), vô lý trên
 * 1 đề kiểm tra thật. Test này dùng FUZZ (nhiều nghìn tổ hợp ngẫu nhiên số câu + mức độ) để bắt
 * lại đúng loại lỗi đã tìm thấy, thay vì chỉ test 1-2 case cố định dễ bỏ sót biên.
 */

const LEVELS = ["NHAN_BIET", "THONG_HIEU", "VAN_DUNG", "VAN_DUNG_CAO"];

function randomQuestions(n) {
  return Array.from({ length: n }, () => ({ level: LEVELS[Math.floor(Math.random() * LEVELS.length)] }));
}

test("computeScores: KHÔNG câu nào bị điểm 0 hoặc âm, dù đề có nhiều câu (fuzz 3000 tổ hợp)", () => {
  for (let t = 0; t < 3000; t++) {
    const n = 1 + Math.floor(Math.random() * 25); // 1-25 câu, vượt xa số câu thực tế 1 đề (~4-15)
    const questions = randomQuestions(n);
    const scored = computeScores(questions, 10);
    for (const q of scored) {
      assert.ok(q.score >= 0.25, `câu có điểm ${q.score} (< sàn 0.25đ) với đề ${n} câu - levels=${questions.map((x) => x.level).join(",")}`);
    }
  }
});

test("computeScores: tổng điểm luôn CHÍNH XÁC = totalPoints (fuzz 3000 tổ hợp)", () => {
  for (let t = 0; t < 3000; t++) {
    const n = 1 + Math.floor(Math.random() * 25);
    const questions = randomQuestions(n);
    const scored = computeScores(questions, 10);
    const total = scored.reduce((a, q) => a + q.score, 0);
    assert.ok(Math.abs(total - 10) < 1e-6, `tổng = ${total}, kỳ vọng 10 (n=${n})`);
    assert.equal(sumScores(scored), 10);
  }
});

test("computeScores: mọi điểm đều là bội số của 0.25 (đúng barem quen thuộc của giáo viên)", () => {
  for (let t = 0; t < 1000; t++) {
    const n = 1 + Math.floor(Math.random() * 25);
    const questions = randomQuestions(n);
    const scored = computeScores(questions, 10);
    for (const q of scored) {
      const steps = q.score * 4;
      assert.ok(Math.abs(steps - Math.round(steps)) < 1e-9, `điểm ${q.score} không phải bội số 0.25`);
    }
  }
});

test("computeScores: câu độ khó cao hơn luôn được điểm >= câu độ khó thấp hơn (cùng 1 đề đồng nhất mức độ dễ so sánh)", () => {
  const questions = [{ level: "NHAN_BIET" }, { level: "THONG_HIEU" }, { level: "VAN_DUNG" }, { level: "VAN_DUNG_CAO" }];
  const scored = computeScores(questions, 10);
  const [nb, th, vd, vdc] = scored.map((q) => q.score);
  assert.ok(nb <= th && th <= vd && vd <= vdc, `thứ tự điểm theo độ khó bị đảo: ${scored.map((q) => q.score)}`);
});

test("computeScores: trường hợp biên trước đây gây lỗi (12 câu, lệch mức độ) - tổng vẫn đúng, không câu nào <= 0", () => {
  const questions = [
    "THONG_HIEU", "VAN_DUNG_CAO", "VAN_DUNG", "NHAN_BIET", "THONG_HIEU", "VAN_DUNG_CAO",
    "THONG_HIEU", "VAN_DUNG_CAO", "VAN_DUNG", "NHAN_BIET", "NHAN_BIET", "NHAN_BIET",
  ].map((level) => ({ level }));
  const scored = computeScores(questions, 10);
  assert.equal(sumScores(scored), 10);
  for (const q of scored) assert.ok(q.score >= 0.25, `điểm ${q.score} không hợp lệ`);
});

test("computeScores: 1 câu duy nhất nhận trọn totalPoints", () => {
  const scored = computeScores([{ level: "NHAN_BIET" }], 10);
  assert.equal(scored[0].score, 10);
});
