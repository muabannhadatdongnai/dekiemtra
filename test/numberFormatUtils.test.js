import { test } from "node:test";
import assert from "node:assert/strict";
import { formatSoTuNhien, formatSoTrongChuoi } from "../src/services/numberFormatUtils.js";

/**
 * numberFormatUtils.test.js
 * MỞ RỘNG LỚP 3, ĐỢT 3: hàm format số DÙNG CHUNG cho "Phiếu bài tập" (WorksheetPreview.jsx +
 * worksheetExportService.js) - xem NEXT_STEPS.md mục "Vấn đề kỹ thuật cần xử lý khi mở khối".
 * Quy tắc đã chốt: số tự nhiên từ 4 chữ số trở lên BẮT BUỘC có dấu chấm phân cách hàng nghìn.
 */

test("số dưới 1000 giữ nguyên, không thêm dấu chấm", () => {
  assert.equal(formatSoTuNhien(0), "0");
  assert.equal(formatSoTuNhien(7), "7");
  assert.equal(formatSoTuNhien(925), "925");
});

test("số từ 4 chữ số trở lên PHẢI có dấu chấm phân cách hàng nghìn", () => {
  assert.equal(formatSoTuNhien(1000), "1.000");
  assert.equal(formatSoTuNhien(14000), "14.000");
  assert.equal(formatSoTuNhien(63880), "63.880");
  assert.equal(formatSoTuNhien(93926), "93.926");
});

test("số 6 chữ số (gần trần maxNumber Lớp 3 = 100 000) vẫn đúng 2 dấu chấm", () => {
  assert.equal(formatSoTuNhien(100000), "100.000");
});

test("chấp nhận cả number lẫn string số làm đầu vào", () => {
  assert.equal(formatSoTuNhien("63880"), "63.880");
});

test("giá trị null/undefined trả về nguyên vẹn, không làm crash", () => {
  assert.equal(formatSoTuNhien(null), null);
  assert.equal(formatSoTuNhien(undefined), undefined);
});

test("formatSoTrongChuoi format ĐÚNG TỪNG số trong 1 biểu thức, giữ nguyên toán tử", () => {
  assert.equal(formatSoTrongChuoi("73428 + 19205"), "73.428 + 19.205");
  assert.equal(formatSoTrongChuoi("50000 - 20000"), "50.000 - 20.000");
});

test("formatSoTrongChuoi không đổi gì với chuỗi số nhỏ (dưới 1000)", () => {
  assert.equal(formatSoTrongChuoi("38 + 12"), "38 + 12");
});

test("formatSoTrongChuoi hoạt động đúng với chuỗi chỉ có 1 số đơn (giống formatSoTuNhien)", () => {
  assert.equal(formatSoTrongChuoi("63880"), "63.880");
});
