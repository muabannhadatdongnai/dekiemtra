import { test } from "node:test";
import assert from "node:assert/strict";
import { generateSoThapPhanSoSanh, WORKSHEET_GRADES, EXERCISE_TYPES } from "../src/data/worksheetSchemas.js";
import { GRADE_ORDER, getSelectableCatalogFor } from "../src/data/worksheetExerciseCatalog.js";
import { formatSoThapPhan } from "../src/services/numberFormatUtils.js";

/**
 * worksheetLop5Dot1.test.js
 * MỞ RỘNG LỚP 5, ĐỢT 1 - mở khối Lớp 5 + dạng bài đầu tiên "So sánh số thập phân". Đáp án được
 * tính lại ĐỘC LẬP bằng phép so sánh chuỗi thập phân thủ công (không gọi lại hàm compare bên
 * trong generator) để thực sự bắt được lỗi logic, giống các bộ test Lớp 4 trước đó.
 */

function recomputeCompare(intA, decA, intB, decB) {
  const a = Number(`${intA}.${decA}`);
  const b = Number(`${intB}.${decB}`);
  // Dùng toFixed(2) trước khi so sánh để tránh sai số dấu phẩy động JS (VD 0.1+0.2 != 0.3),
  // vẫn là cách tính ĐỘC LẬP với logic bên trong generateSoThapPhanSoSanh().
  const fa = Number(a.toFixed(2));
  const fb = Number(b.toFixed(2));
  if (fa > fb) return ">";
  if (fa < fb) return "<";
  return "=";
}

test("WORKSHEET_GRADES.LOP_5 tồn tại và GRADE_ORDER đã có LOP_5 ở cuối", () => {
  assert.ok(WORKSHEET_GRADES.LOP_5, "thiếu WORKSHEET_GRADES.LOP_5");
  assert.equal(GRADE_ORDER[GRADE_ORDER.length - 1], "LOP_5");
});

test("EXERCISE_TYPES.SO_THAP_PHAN_SO_SANH tồn tại đúng giá trị", () => {
  assert.equal(EXERCISE_TYPES.SO_THAP_PHAN_SO_SANH, "so_thap_phan_so_sanh");
});

test("generateSoThapPhanSoSanh: đáp án luôn khớp khi tự tính lại độc lập", () => {
  for (let i = 0; i < 300; i++) {
    const items = generateSoThapPhanSoSanh(8);
    for (const it of items) {
      const recomputed = recomputeCompare(it.leftInt, it.leftDec, it.rightInt, it.rightDec);
      assert.equal(recomputed, it.answer, `sai đáp án: ${JSON.stringify(it)}`);
    }
  }
});

test("generateSoThapPhanSoSanh: trả đúng số lượng items, không trùng lặp cặp", () => {
  const items = generateSoThapPhanSoSanh(10);
  assert.equal(items.length, 10);
  const keys = items.map((it) => `${it.leftInt},${it.leftDec}_${it.rightInt},${it.rightDec}`);
  assert.equal(new Set(keys).size, keys.length, "có cặp số bị trùng lặp");
});

test("generateSoThapPhanSoSanh: phần thập phân luôn 1 hoặc 2 chữ số, phần nguyên trong 0-999", () => {
  const items = generateSoThapPhanSoSanh(50);
  for (const it of items) {
    assert.ok(it.leftDec.length === 1 || it.leftDec.length === 2);
    assert.ok(it.rightDec.length === 1 || it.rightDec.length === 2);
    assert.ok(it.leftInt >= 0 && it.leftInt <= 999);
    assert.ok(it.rightInt >= 0 && it.rightInt <= 999);
  }
});

test("so_thap_phan_so_sanh chỉ xuất hiện trong catalog Lớp 5, không lộ ra Lớp 1-4", () => {
  for (const grade of ["MAM_NON", "LOP_1", "LOP_2", "LOP_3", "LOP_4"]) {
    const catalog = getSelectableCatalogFor(grade, "TOAN");
    assert.ok(
      !catalog.some((item) => item.key === "so_thap_phan_so_sanh"),
      `dạng bài số thập phân không được lộ ra ở khối ${grade}`
    );
  }
  const lop5Catalog = getSelectableCatalogFor("LOP_5", "TOAN");
  assert.ok(lop5Catalog.some((item) => item.key === "so_thap_phan_so_sanh"));
});

test("formatSoThapPhan: giữ đúng số chữ số thập phân, không rút gọn số 0 cuối", () => {
  assert.equal(formatSoThapPhan(3.1, 2), "3,10");
  assert.equal(formatSoThapPhan(3.45, 2), "3,45");
  assert.equal(formatSoThapPhan(7, 1), "7,0");
  assert.equal(formatSoThapPhan(1234.5, 1), "1.234,5");
  assert.equal(formatSoThapPhan(-2.5, 1), "-2,5");
});
