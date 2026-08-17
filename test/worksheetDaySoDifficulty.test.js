import { test } from "node:test";
import assert from "node:assert/strict";
import { generateDaySo, WORKSHEET_GRADES } from "../src/data/worksheetSchemas.js";

/**
 * worksheetDaySoDifficulty.test.js
 * GIAI ĐOẠN F (phản hồi giáo viên): đếm cách 2 quá khó với Lớp 1 (SGK hiện hành chỉ dạy đếm
 * cách 1, và cách 10/tròn chục ở mức mở rộng) - đếm cách 2/cách 5 chỉ nên xuất hiện từ Lớp 2.
 */

function fullSequence(item) {
  return item.sequence.map((n, idx) => (idx === item.hideIndex ? item.answer : n));
}

test("generateDaySo Lớp 1: KHÔNG BAO GIỜ ra step cách 2/5 (chỉ cách 1 hoặc cách 10)", () => {
  for (let i = 0; i < 100; i++) {
    const items = generateDaySo("LOP_1", 4);
    for (const item of items) {
      const abs = Math.abs(item.step);
      assert.ok(abs === 1 || abs === 10, `step không hợp lệ cho Lớp 1: ${item.step}`);
    }
  }
});

test("generateDaySo Lớp 1: mọi số trong dãy (kể cả đáp án) đều nằm trong phạm vi 0-20", () => {
  const max = WORKSHEET_GRADES.LOP_1.maxNumber;
  for (let i = 0; i < 100; i++) {
    const items = generateDaySo("LOP_1", 4);
    for (const item of items) {
      for (const n of fullSequence(item)) {
        assert.ok(n >= 0 && n <= max, `số ${n} vượt phạm vi Lớp 1 (0-${max})`);
      }
    }
  }
});

test("generateDaySo Mầm non: chỉ đếm cách 1 (giữ nguyên hành vi cũ)", () => {
  for (let i = 0; i < 30; i++) {
    const items = generateDaySo("MAM_NON", 4);
    for (const item of items) {
      assert.equal(Math.abs(item.step), 1);
    }
  }
});

test("generateDaySo Lớp 2: vẫn cho phép cách 1/2/5/10 (giữ nguyên hành vi cũ)", () => {
  const seenSteps = new Set();
  for (let i = 0; i < 200; i++) {
    const items = generateDaySo("LOP_2", 4);
    for (const item of items) seenSteps.add(Math.abs(item.step));
  }
  // Đủ số lần lặp để xác suất ra đủ cả 4 mức cách gần như chắc chắn - không assert cứng ra đủ 4
  // (tránh test không ổn định), chỉ assert không có step nào lạ ngoài tập cho phép.
  for (const s of seenSteps) {
    assert.ok([1, 2, 5, 10].includes(s), `step lạ cho Lớp 2: ${s}`);
  }
});
