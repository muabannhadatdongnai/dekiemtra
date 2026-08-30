import { test } from "node:test";
import assert from "node:assert/strict";
import { getSelectableCatalogFor, WORKSHEET_EXERCISE_CATALOG } from "../src/data/worksheetExerciseCatalog.js";
import { capitalizeFirstLetter, buildVietnameseGradeConstraintBlock } from "../src/services/worksheetGenerator.js";

/**
 * worksheetTiengVietLop1Fix.test.js
 * PHIÊN 29 - sửa 3 lỗi sư phạm phản hồi qua phiếu Tiếng Việt Lớp 1 in thật (bài tập
 * "Khoanh từ chỉ hoạt động/đặc điểm" và "Nối từ với nhóm thích hợp" dùng thuật ngữ ngữ pháp
 * Lớp 2-3, câu văn "Điền từ vào chỗ trống" quá dài so với trình độ đọc Lớp 1, và thiếu viết hoa
 * đầu câu). Xem chi tiết trong worksheetExerciseCatalog.js + worksheetGenerator.js mục "PHIÊN 29".
 */

test("khoanh_tu_loai và noi_tu_nhom KHÔNG còn xuất hiện ở catalog Lớp 1 (thuật ngữ ngữ pháp là kiến thức Lớp 2-3)", () => {
  const lop1Catalog = getSelectableCatalogFor("LOP_1", "TIENG_VIET");
  assert.ok(
    !lop1Catalog.some((item) => item.key === "khoanh_tu_loai"),
    "khoanh_tu_loai vẫn còn lộ ra ở Lớp 1"
  );
  assert.ok(
    !lop1Catalog.some((item) => item.key === "noi_tu_nhom"),
    "noi_tu_nhom vẫn còn lộ ra ở Lớp 1"
  );
});

test("khoanh_tu_loai và noi_tu_nhom vẫn còn ở catalog Lớp 2 (không xoá nhầm tính năng)", () => {
  const lop2Catalog = getSelectableCatalogFor("LOP_2", "TIENG_VIET");
  assert.ok(lop2Catalog.some((item) => item.key === "khoanh_tu_loai"), "thiếu khoanh_tu_loai ở Lớp 2");
  assert.ok(lop2Catalog.some((item) => item.key === "noi_tu_nhom"), "thiếu noi_tu_nhom ở Lớp 2");
});

test("noi_tu_nhom KHÔNG còn nhãn đề bài sai (cam kết 'từ chỉ hoạt động') vì generator không ràng buộc loại từ", () => {
  const entry = WORKSHEET_EXERCISE_CATALOG.find((item) => item.key === "noi_tu_nhom");
  assert.ok(entry, "thiếu entry noi_tu_nhom trong catalog");
  for (const variant of entry.instructionVariants) {
    assert.ok(!variant.includes("từ chỉ hoạt động"), `variant vẫn còn nhãn sai: "${variant}"`);
  }
});

test("dien_tu_cho_san vẫn còn ở Lớp 1 (dạng bài phù hợp, chỉ cần ràng buộc câu ngắn hơn qua prompt)", () => {
  const lop1Catalog = getSelectableCatalogFor("LOP_1", "TIENG_VIET");
  assert.ok(lop1Catalog.some((item) => item.key === "dien_tu_cho_san"), "thiếu dien_tu_cho_san ở Lớp 1");
});

test("buildVietnameseGradeConstraintBlock: rỗng cho khối khác Lớp 1, có nội dung ràng buộc cho Lớp 1", () => {
  assert.equal(buildVietnameseGradeConstraintBlock("LOP_2"), "");
  assert.equal(buildVietnameseGradeConstraintBlock("MAM_NON"), "");
  const lop1Block = buildVietnameseGradeConstraintBlock("LOP_1");
  assert.ok(lop1Block.includes("CẤM"), "thiếu quy tắc cấm thuật ngữ ngữ pháp");
  assert.ok(lop1Block.includes("viết hoa"), "thiếu quy tắc viết hoa đầu câu");
});

test("capitalizeFirstLetter: viết hoa đúng ký tự đầu tiên, giữ nguyên phần còn lại", () => {
  assert.equal(capitalizeFirstLetter("bố sửa lại chiếc xe đạp."), "Bố sửa lại chiếc xe đạp.");
  assert.equal(capitalizeFirstLetter("ăn cơm chưa?"), "Ăn cơm chưa?");
  assert.equal(capitalizeFirstLetter("Đã viết hoa sẵn."), "Đã viết hoa sẵn.");
  assert.equal(capitalizeFirstLetter(""), "");
  assert.equal(capitalizeFirstLetter(null), null);
  assert.equal(capitalizeFirstLetter("___ sửa xe."), "___ sửa xe."); // chỗ trống ở đầu, không phải chữ cái - giữ nguyên hợp lý
});
