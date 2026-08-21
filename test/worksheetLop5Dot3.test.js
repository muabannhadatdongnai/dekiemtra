import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generateSoThapPhanNhan,
  generateSoThapPhanChia,
  EXERCISE_TYPES,
} from "../src/data/worksheetSchemas.js";
import { getSelectableCatalogFor } from "../src/data/worksheetExerciseCatalog.js";
import { formatSoThapPhan } from "../src/services/numberFormatUtils.js";

/**
 * worksheetLop5Dot3.test.js
 * MỞ RỘNG LỚP 5, ĐỢT 3 - "Nhân số thập phân" + "Chia số thập phân cho số tự nhiên". Đáp án được
 * tính lại ĐỘC LẬP bằng phép nhân/chia Number thông thường (làm tròn để tránh sai số dấu phẩy
 * động khi so sánh trực tiếp), không gọi lại logic quy đổi số nguyên bên trong generator - giống
 * cách worksheetLop5Dot1/Dot2.test.js đã kiểm chứng độc lập cho so sánh/cộng-trừ.
 */

function toNum(intPart, decPart) {
  return Number(`${intPart}.${decPart || "0"}`);
}

// Làm tròn đến `decimals` chữ số để né sai số dấu phẩy động khi so sánh (KHÔNG dùng để tính lại
// bên trong generator, chỉ dùng ở lớp kiểm thử độc lập này).
function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

test("EXERCISE_TYPES.SO_THAP_PHAN_NHAN và SO_THAP_PHAN_CHIA tồn tại đúng giá trị", () => {
  assert.equal(EXERCISE_TYPES.SO_THAP_PHAN_NHAN, "so_thap_phan_nhan");
  assert.equal(EXERCISE_TYPES.SO_THAP_PHAN_CHIA, "so_thap_phan_chia");
});

test("generateSoThapPhanNhan: đáp án luôn khớp khi tự tính lại độc lập bằng phép nhân thường", () => {
  for (let i = 0; i < 300; i++) {
    const items = generateSoThapPhanNhan(8);
    for (const it of items) {
      assert.equal(it.operator, "×");
      const expectedDigits = it.leftDec.length + it.rightDec.length;
      const expected = roundTo(toNum(it.leftInt, it.leftDec) * toNum(it.rightInt, it.rightDec), expectedDigits);
      const actual = toNum(it.answerInt, it.answerDec);
      assert.equal(actual, expected, `sai đáp án nhân: ${JSON.stringify(it)}`);
      // số chữ số thập phân của đáp án phải đúng bằng TỔNG số chữ số thập phân 2 thừa số
      assert.equal(it.answerDec.length, expectedDigits, `sai số chữ số thập phân của tích: ${JSON.stringify(it)}`);
    }
  }
});

test("generateSoThapPhanNhan: có cả trường hợp nhân với số tự nhiên (rightDec rỗng) và nhân 2 số thập phân", () => {
  const items = [];
  for (let i = 0; i < 20; i++) items.push(...generateSoThapPhanNhan(10));
  assert.ok(items.some((it) => it.rightDec === ""), "không thấy trường hợp nhân với số tự nhiên");
  assert.ok(items.some((it) => it.rightDec !== ""), "không thấy trường hợp nhân 2 số thập phân");
});

test("generateSoThapPhanChia: đáp án luôn khớp khi tự tính lại độc lập bằng phép chia thường (chia hết tuyệt đối)", () => {
  for (let i = 0; i < 300; i++) {
    const items = generateSoThapPhanChia(8);
    for (const it of items) {
      assert.equal(it.operator, "÷");
      assert.equal(it.rightDec, "", "số chia phải là số tự nhiên (rightDec rỗng)");
      const dividend = toNum(it.leftInt, it.leftDec);
      const divisor = it.rightInt;
      const expectedQuotient = roundTo(dividend / divisor, it.answerDec.length);
      const actualQuotient = toNum(it.answerInt, it.answerDec);
      assert.equal(actualQuotient, expectedQuotient, `sai đáp án chia: ${JSON.stringify(it)}`);
      // chia hết tuyệt đối: dividend phải chia hết cho divisor khi quy về số nguyên (không dư)
      const scale = 10 ** it.leftDec.length;
      const dividendAsInt = Math.round(dividend * scale);
      assert.equal(dividendAsInt % divisor, 0, `phép chia không hết: ${JSON.stringify(it)}`);
    }
  }
});

test("generateSoThapPhanChia: số chia (rightInt) luôn trong khoảng 2-9, không chia cho 0 hoặc 1", () => {
  const items = generateSoThapPhanChia(50);
  for (const it of items) {
    assert.ok(it.rightInt >= 2 && it.rightInt <= 9, `số chia ngoài khoảng cho phép: ${JSON.stringify(it)}`);
  }
});

test("generateSoThapPhanNhan/Chia: trả đúng số lượng items, không trùng lặp phép tính", () => {
  const nhanItems = generateSoThapPhanNhan(10);
  assert.equal(nhanItems.length, 10);
  const nhanKeys = nhanItems.map((it) => `${it.leftInt},${it.leftDec}x${it.rightInt},${it.rightDec}`);
  assert.equal(new Set(nhanKeys).size, nhanKeys.length, "có phép nhân bị trùng lặp");

  const chiaItems = generateSoThapPhanChia(10);
  assert.equal(chiaItems.length, 10);
  const chiaKeys = chiaItems.map((it) => `${it.leftInt},${it.leftDec}:${it.rightInt}`);
  assert.equal(new Set(chiaKeys).size, chiaKeys.length, "có phép chia bị trùng lặp");
});

test("so_thap_phan_nhan và so_thap_phan_chia chỉ xuất hiện trong catalog Lớp 5, không lộ ra Lớp 1-4", () => {
  for (const grade of ["MAM_NON", "LOP_1", "LOP_2", "LOP_3", "LOP_4"]) {
    const catalog = getSelectableCatalogFor(grade, "TOAN");
    assert.ok(!catalog.some((item) => item.key === "so_thap_phan_nhan"), `nhân số thập phân lộ ra ở khối ${grade}`);
    assert.ok(!catalog.some((item) => item.key === "so_thap_phan_chia"), `chia số thập phân lộ ra ở khối ${grade}`);
  }
  const lop5Catalog = getSelectableCatalogFor("LOP_5", "TOAN");
  assert.ok(lop5Catalog.some((item) => item.key === "so_thap_phan_nhan"));
  assert.ok(lop5Catalog.some((item) => item.key === "so_thap_phan_chia"));
});

test("formatSoThapPhan áp dụng đúng lên đáp án nhân/chia, kể cả khi toán hạng là số tự nhiên (decimals=0)", () => {
  const nhanItems = generateSoThapPhanNhan(20);
  for (const it of nhanItems) {
    const rightFormatted = formatSoThapPhan(toNum(it.rightInt, it.rightDec), it.rightDec.length);
    if (it.rightDec === "") {
      assert.ok(!rightFormatted.includes(","), `số tự nhiên không được có dấu phẩy: ${rightFormatted}`);
    }
    const answerFormatted = formatSoThapPhan(toNum(it.answerInt, it.answerDec), it.answerDec.length);
    assert.ok(typeof answerFormatted === "string" && answerFormatted.length > 0);
  }
});
