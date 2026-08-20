import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generateBieuThucChu,
  generatePhanSoSoSanh,
  generateGocNhanBiet,
} from "../src/data/worksheetSchemas.js";

/**
 * worksheetLop4Dot2.test.js
 * MỞ RỘNG LỚP 4, ĐỢT 2 - 3 dạng bài mới: "Biểu thức chữ", "So sánh phân số", "Góc và đơn vị đo
 * góc". Tính lại đáp án bằng 1 cách ĐỘC LẬP với generator (không gọi lại chính hàm đang test) để
 * thực sự bắt được lỗi logic, giống cách worksheetTachGop.test.js đã làm.
 */

function evalBieuThucChu(expression, aValue) {
  const tokens = expression.split(" ");
  let val = aValue;
  for (let j = 1; j < tokens.length; j += 2) {
    const op = tokens[j];
    const num = Number(tokens[j + 1]);
    if (op === "+") val += num;
    else if (op === "-") val -= num;
    else if (op === "×") val *= num;
    else throw new Error(`toán tử lạ: ${op}`);
  }
  return val;
}

test("generateBieuThucChu: đáp án luôn khớp khi tự tính lại biểu thức", () => {
  for (let i = 0; i < 300; i++) {
    const items = generateBieuThucChu(6);
    for (const it of items) {
      const recomputed = evalBieuThucChu(it.expression, it.aValue);
      assert.equal(recomputed, it.answer, `sai đáp án: ${JSON.stringify(it)}`);
    }
  }
});

test("generateBieuThucChu: kết quả không bao giờ âm (Lớp 4 chưa học số âm)", () => {
  for (let i = 0; i < 300; i++) {
    const items = generateBieuThucChu(6);
    for (const it of items) {
      assert.ok(it.answer >= 0, `kết quả âm: ${JSON.stringify(it)}`);
    }
  }
});

test("generateBieuThucChu: expression luôn bắt đầu bằng 'a'", () => {
  const items = generateBieuThucChu(6);
  for (const it of items) {
    assert.ok(it.expression.startsWith("a"), `expression không bắt đầu bằng a: ${it.expression}`);
  }
});

test("generateBieuThucChu: sinh đúng số lượng item yêu cầu", () => {
  const items = generateBieuThucChu(5);
  assert.equal(items.length, 5);
});

test("generatePhanSoSoSanh: dấu so sánh luôn khớp khi so chéo n1*d2 vs n2*d1", () => {
  for (let i = 0; i < 300; i++) {
    const items = generatePhanSoSoSanh(6);
    for (const it of items) {
      const left = it.n1 * it.d2;
      const right = it.n2 * it.d1;
      const expected = left > right ? ">" : left < right ? "<" : "=";
      assert.equal(it.answer, expected, `sai dấu so sánh: ${JSON.stringify(it)}`);
    }
  }
});

test("generatePhanSoSoSanh: mọi phân số đều có tử < mẫu (phân số thực sự) và tử/mẫu dương", () => {
  for (let i = 0; i < 300; i++) {
    const items = generatePhanSoSoSanh(6);
    for (const it of items) {
      assert.ok(it.n1 > 0 && it.d1 > 0 && it.n2 > 0 && it.d2 > 0, `số liệu không dương: ${JSON.stringify(it)}`);
      assert.ok(it.n1 < it.d1, `n1 >= d1: ${JSON.stringify(it)}`);
      assert.ok(it.n2 < it.d2, `n2 >= d2: ${JSON.stringify(it)}`);
    }
  }
});

test("generatePhanSoSoSanh: sinh đúng số lượng item yêu cầu", () => {
  const items = generatePhanSoSoSanh(4);
  assert.equal(items.length, 4);
});

test("generateGocNhanBiet: phân loại đúng theo khoảng số đo (nhọn <90, vuông =90, tù 90-180, bẹt =180)", () => {
  for (let i = 0; i < 300; i++) {
    const items = generateGocNhanBiet(6);
    for (const it of items) {
      let expected;
      if (it.degrees === 90) expected = "vuông";
      else if (it.degrees === 180) expected = "bẹt";
      else if (it.degrees > 0 && it.degrees < 90) expected = "nhọn";
      else if (it.degrees > 90 && it.degrees < 180) expected = "tù";
      else throw new Error(`số đo góc ngoài phạm vi 0-180: ${it.degrees}`);
      assert.equal(it.answer, expected, `phân loại sai: ${JSON.stringify(it)}`);
    }
  }
});

test("generateGocNhanBiet: sinh đúng số lượng item yêu cầu", () => {
  const items = generateGocNhanBiet(6);
  assert.equal(items.length, 6);
});

test("generateGocNhanBiet: qua đủ nhiều lần lặp, ra đủ cả 4 loại góc (không thiên lệch hoàn toàn về 1 phía)", () => {
  const seen = new Set();
  for (let i = 0; i < 100; i++) {
    const items = generateGocNhanBiet(6);
    for (const it of items) seen.add(it.answer);
  }
  assert.equal(seen.size, 4, `chỉ thấy các loại góc: ${[...seen].join(", ")}`);
});
