import { test } from "node:test";
import assert from "node:assert/strict";
import { generateTachGop } from "../src/data/worksheetSchemas.js";

/**
 * worksheetTachGop.test.js
 * GIAI ĐOẠN F (tích hợp dạng bài "Tách - Gộp" theo phản ánh giáo viên - xem generateTachGop()
 * trong worksheetSchemas.js để hiểu bối cảnh đầy đủ).
 */

test("generateTachGop: part1 + part2 luôn bằng whole", () => {
  for (let i = 0; i < 200; i++) {
    const items = generateTachGop("LOP_1", 4);
    for (const it of items) {
      assert.equal(it.part1 + it.part2, it.whole, `sai tổng: ${JSON.stringify(it)}`);
    }
  }
});

test("generateTachGop: whole nằm trong phạm vi 2-10 (đúng phạm vi SGK dạy tách-gộp)", () => {
  for (let i = 0; i < 200; i++) {
    const items = generateTachGop("LOP_1", 4);
    for (const it of items) {
      assert.ok(it.whole >= 2 && it.whole <= 10, `whole ngoài phạm vi: ${it.whole}`);
    }
  }
});

test("generateTachGop: mỗi phần (part1/part2) luôn >= 1 (không có phần bằng 0)", () => {
  for (let i = 0; i < 200; i++) {
    const items = generateTachGop("LOP_1", 4);
    for (const it of items) {
      assert.ok(it.part1 >= 1, `part1 < 1: ${JSON.stringify(it)}`);
      assert.ok(it.part2 >= 1, `part2 < 1: ${JSON.stringify(it)}`);
    }
  }
});

test("generateTachGop: hideSlot luôn là 1 trong 3 giá trị hợp lệ", () => {
  for (let i = 0; i < 200; i++) {
    const items = generateTachGop("LOP_1", 4);
    for (const it of items) {
      assert.ok(["whole", "part1", "part2"].includes(it.hideSlot), `hideSlot lạ: ${it.hideSlot}`);
    }
  }
});

test("generateTachGop: sinh đúng số lượng item yêu cầu", () => {
  const items = generateTachGop("LOP_1", 6);
  assert.equal(items.length, 6);
});

test("generateTachGop: qua đủ nhiều lần lặp, ra đủ cả 3 kiểu hideSlot (không thiên lệch hoàn toàn về 1 phía)", () => {
  const seen = new Set();
  for (let i = 0; i < 100; i++) {
    const items = generateTachGop("LOP_1", 4);
    for (const it of items) seen.add(it.hideSlot);
  }
  assert.equal(seen.size, 3, `chỉ thấy các hideSlot: ${[...seen].join(", ")}`);
});
