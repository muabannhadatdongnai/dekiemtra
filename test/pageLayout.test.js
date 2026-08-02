// Xác nhận PAGE_A4_MM/PAGE_MARGIN_MM (constants.js) sinh đúng số twips A4 chuẩn khi qua
// convertMillimetersToTwip() của docx.js - chống tái phát bug "properties:{} rỗng -> khổ
// Letter mặc định" đã sửa ở Giai đoạn 1 (xem constants.js, exportService.js,
// worksheetExportService.js, lessonPlanExportService.js).
//
// Chạy: node --test test/pageLayout.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { convertMillimetersToTwip } from "docx";
import { PAGE_A4_MM, PAGE_MARGIN_MM } from "../src/data/constants.js";

// Khổ A4 chuẩn tính bằng twips (1 inch = 1440 twips, 1 inch = 25.4mm): 210mm ≈ 11906 twips,
// 297mm ≈ 16838 twips - đây là 2 con số quen thuộc trong mọi template Word A4.
test("PAGE_A4_MM sinh đúng số twips A4 chuẩn (không lệch sang khổ Letter)", () => {
  const widthTwip = convertMillimetersToTwip(PAGE_A4_MM.width);
  const heightTwip = convertMillimetersToTwip(PAGE_A4_MM.height);

  assert.ok(Math.abs(widthTwip - 11906) <= 2, `width twips = ${widthTwip}, kỳ vọng ~11906`);
  assert.ok(Math.abs(heightTwip - 16838) <= 2, `height twips = ${heightTwip}, kỳ vọng ~16838`);

  // Khổ Letter mặc định của docx.js là 12240 x 15840 twips - test này phải KHÔNG khớp Letter,
  // để chắc chắn ta không vô tình quay lại giá trị mặc định cũ.
  assert.notEqual(widthTwip, 12240);
  assert.notEqual(heightTwip, 15840);
});

test("PAGE_MARGIN_MM khớp giữa 4 cạnh trên/dưới và trái/phải (đối xứng, dễ kiểm tra khi in thử)", () => {
  assert.equal(PAGE_MARGIN_MM.top, PAGE_MARGIN_MM.bottom);
  assert.equal(PAGE_MARGIN_MM.left, PAGE_MARGIN_MM.right);
});

test("margin không vượt quá 1/4 chiều rộng trang (tránh margin nuốt hết nội dung)", () => {
  const marginTwip = convertMillimetersToTwip(PAGE_MARGIN_MM.left + PAGE_MARGIN_MM.right);
  const widthTwip = convertMillimetersToTwip(PAGE_A4_MM.width);
  assert.ok(marginTwip < widthTwip / 2, "tổng margin trái+phải phải nhỏ hơn nửa chiều rộng trang");
});
