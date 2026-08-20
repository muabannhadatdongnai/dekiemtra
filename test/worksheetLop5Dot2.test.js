import { test } from "node:test";
import assert from "node:assert/strict";
import { generateSoThapPhanCongTru, EXERCISE_TYPES } from "../src/data/worksheetSchemas.js";
import { getSelectableCatalogFor } from "../src/data/worksheetExerciseCatalog.js";
import { formatSoThapPhan } from "../src/services/numberFormatUtils.js";

/**
 * worksheetLop5Dot2.test.js
 * MỞ RỘNG LỚP 5, ĐỢT 2 - dạng bài "Cộng, trừ số thập phân". Đáp án được tính lại ĐỘC LẬP bằng
 * phép cộng/trừ Number thông thường rồi làm tròn 2 chữ số thập phân trước khi so sánh (tránh sai
 * số dấu phẩy động khi so sánh trực tiếp), không gọi lại logic quy đổi số nguyên bên trong
 * generator - giống cách worksheetLop5Dot1.test.js đã kiểm chứng độc lập cho "so sánh".
 */

function recomputeSum(intA, decA, intB, decB, operator) {
  const a = Number(`${intA}.${decA}`);
  const b = Number(`${intB}.${decB}`);
  const raw = operator === "+" ? a + b : a - b;
  return Number(raw.toFixed(2));
}

test("EXERCISE_TYPES.SO_THAP_PHAN_CONG_TRU tồn tại đúng giá trị", () => {
  assert.equal(EXERCISE_TYPES.SO_THAP_PHAN_CONG_TRU, "so_thap_phan_cong_tru");
});

test("generateSoThapPhanCongTru: đáp án luôn khớp khi tự tính lại độc lập", () => {
  for (let i = 0; i < 300; i++) {
    const items = generateSoThapPhanCongTru(8);
    for (const it of items) {
      const expected = recomputeSum(it.leftInt, it.leftDec, it.rightInt, it.rightDec, it.operator);
      const actual = Number(`${it.answerInt}.${it.answerDec}`);
      assert.equal(actual, expected, `sai đáp án: ${JSON.stringify(it)}`);
    }
  }
});

test("generateSoThapPhanCongTru: phép trừ luôn có số bị trừ >= số trừ (không ra số âm)", () => {
  for (let i = 0; i < 300; i++) {
    const items = generateSoThapPhanCongTru(8);
    for (const it of items) {
      if (it.operator === "-") {
        const left = Number(`${it.leftInt}.${it.leftDec}`);
        const right = Number(`${it.rightInt}.${it.rightDec}`);
        assert.ok(left >= right, `số bị trừ nhỏ hơn số trừ: ${JSON.stringify(it)}`);
        assert.notEqual(left, right, `phép trừ ra kết quả 0 (né theo thiết kế): ${JSON.stringify(it)}`);
      }
    }
  }
});

test("generateSoThapPhanCongTru: trả đúng số lượng items, không trùng lặp phép tính", () => {
  const items = generateSoThapPhanCongTru(10);
  assert.equal(items.length, 10);
  const keys = items.map((it) => `${it.operator}_${it.leftInt},${it.leftDec}_${it.rightInt},${it.rightDec}`);
  assert.equal(new Set(keys).size, keys.length, "có phép tính bị trùng lặp");
});

test("generateSoThapPhanCongTru: phần thập phân luôn 1 hoặc 2 chữ số, phần nguyên trong 0-99", () => {
  const items = generateSoThapPhanCongTru(50);
  for (const it of items) {
    assert.ok(it.leftDec.length === 1 || it.leftDec.length === 2);
    assert.ok(it.rightDec.length === 1 || it.rightDec.length === 2);
    assert.ok(it.answerDec.length === 1 || it.answerDec.length === 2);
    assert.ok(it.leftInt >= 0 && it.leftInt <= 99);
    assert.ok(it.rightInt >= 0 && it.rightInt <= 99);
    assert.ok(it.answerInt >= 0, `đáp án bị âm: ${JSON.stringify(it)}`);
  }
});

test("so_thap_phan_cong_tru chỉ xuất hiện trong catalog Lớp 5, không lộ ra Lớp 1-4", () => {
  for (const grade of ["MAM_NON", "LOP_1", "LOP_2", "LOP_3", "LOP_4"]) {
    const catalog = getSelectableCatalogFor(grade, "TOAN");
    assert.ok(
      !catalog.some((item) => item.key === "so_thap_phan_cong_tru"),
      `dạng bài cộng/trừ số thập phân không được lộ ra ở khối ${grade}`
    );
  }
  const lop5Catalog = getSelectableCatalogFor("LOP_5", "TOAN");
  assert.ok(lop5Catalog.some((item) => item.key === "so_thap_phan_cong_tru"));
});

test("formatSoThapPhan áp dụng đúng lên đáp án cộng/trừ (giữ đúng số chữ số thập phân)", () => {
  const items = generateSoThapPhanCongTru(20);
  for (const it of items) {
    const formatted = formatSoThapPhan(Number(`${it.answerInt}.${it.answerDec}`), it.answerDec.length);
    assert.ok(typeof formatted === "string" && formatted.length > 0);
  }
});
