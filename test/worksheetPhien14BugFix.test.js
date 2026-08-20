import { test } from "node:test";
import assert from "node:assert/strict";
import { generateSapXepThuTu, generateDoDaiSapXep, generateNhanChiaBang } from "../src/data/worksheetSchemas.js";

/**
 * worksheetPhien14BugFix.test.js
 * Sửa 2 lỗi thực tế giáo viên phản ánh khi test phiếu Lớp 3:
 * 1. "Sắp xếp thứ tự": đề bài cố định "từ bé đến lớn" nhưng 1 dòng lại ra chiều "lớn đến bé" (dấu
 *    >) do direction random RIÊNG từng dòng - SỬA: cả section chỉ 1 hướng duy nhất.
 * 2. "Nhân chia trong bảng": không loại trùng, có thể ra 2 dòng giống hệt nhau (VD "2 × 2 = ?"
 *    2 lần liền kề) - SỬA: thêm dedupe.
 */

test("generateSapXepThuTu: mọi dòng trong CÙNG 1 lần gọi luôn dùng CHUNG 1 hướng sắp xếp", () => {
  for (let i = 0; i < 100; i++) {
    const sets = generateSapXepThuTu("LOP_3", 5);
    const directions = new Set(sets.map((s) => s.direction));
    assert.equal(directions.size, 1, `các dòng lệch hướng nhau: ${JSON.stringify(sets.map((s) => s.direction))}`);
  }
});

test("generateSapXepThuTu: sortedAnswer luôn khớp đúng hướng đã khai báo (tự sắp xếp lại độc lập để kiểm tra)", () => {
  for (let i = 0; i < 100; i++) {
    const sets = generateSapXepThuTu("LOP_3", 4);
    for (const s of sets) {
      const expected = [...s.numbers].sort((a, b) => (s.direction === "asc" ? a - b : b - a));
      assert.deepEqual(s.sortedAnswer, expected, `sai thứ tự: ${JSON.stringify(s)}`);
    }
  }
});

test("generateDoDaiSapXep: mọi dòng trong CÙNG 1 lần gọi luôn dùng CHUNG 1 hướng sắp xếp", () => {
  for (let i = 0; i < 100; i++) {
    const sets = generateDoDaiSapXep(5);
    const directions = new Set(sets.map((s) => s.direction));
    assert.equal(directions.size, 1);
  }
});

test("generateNhanChiaBang: không có 2 dòng trùng lặp hoàn toàn (cùng phép tính, cùng toán hạng)", () => {
  for (let i = 0; i < 200; i++) {
    const items = generateNhanChiaBang(8);
    const keys = items.map((it) => `${it.operandA}${it.operator}${it.operandB}`);
    assert.equal(new Set(keys).size, keys.length, `có phép tính trùng lặp: ${JSON.stringify(items)}`);
  }
});

test("generateNhanChiaBang: đáp án luôn đúng toán học (nhân đúng tích, chia hết không dư)", () => {
  const items = generateNhanChiaBang(8);
  for (const it of items) {
    if (it.operator === "×") {
      assert.equal(it.operandA * it.operandB, it.answer);
    } else {
      assert.equal(it.answer * it.operandB, it.operandA, `phép chia không hết: ${JSON.stringify(it)}`);
    }
  }
});
