import { test } from "node:test";
import assert from "node:assert/strict";
import { generateThuThapSoLieu } from "../src/data/worksheetSchemas.js";

/**
 * worksheetThuThapSoLieu.test.js
 * MỞ RỘNG LỚP 3, ĐỢT 3 (dạng bài "Thu thập, phân loại số liệu" - xem generateThuThapSoLieu()
 * trong worksheetSchemas.js để hiểu bối cảnh đầy đủ: 1 bảng số liệu DUY NHẤT + nhiều câu hỏi).
 */

test("generateThuThapSoLieu: trả về đúng số lượng câu hỏi yêu cầu (hoặc ít hơn nếu pool không đủ)", () => {
  for (let i = 0; i < 200; i++) {
    const survey = generateThuThapSoLieu(4);
    assert.ok(survey.questions.length <= 4);
    assert.ok(survey.questions.length >= 1);
  }
});

test("generateThuThapSoLieu: data có 4-5 mục, mỗi mục value trong phạm vi 3-15", () => {
  for (let i = 0; i < 200; i++) {
    const survey = generateThuThapSoLieu(4);
    assert.ok(survey.data.length >= 4 && survey.data.length <= 5, `số mục lạ: ${survey.data.length}`);
    for (const d of survey.data) {
      assert.ok(d.value >= 3 && d.value <= 15, `value ngoài phạm vi: ${JSON.stringify(d)}`);
      assert.ok(typeof d.label === "string" && d.label.length > 0);
    }
  }
});

test("generateThuThapSoLieu: giá trị lớn nhất và nhỏ nhất luôn duy nhất (không hoà)", () => {
  for (let i = 0; i < 200; i++) {
    const survey = generateThuThapSoLieu(4);
    const values = survey.data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    assert.equal(values.filter((v) => v === max).length, 1, `nhiều hơn 1 giá trị max: ${values}`);
    assert.equal(values.filter((v) => v === min).length, 1, `nhiều hơn 1 giá trị min: ${values}`);
  }
});

test("generateThuThapSoLieu: mỗi câu hỏi có text và answer khác rỗng", () => {
  for (let i = 0; i < 100; i++) {
    const survey = generateThuThapSoLieu(4);
    for (const q of survey.questions) {
      assert.ok(typeof q.text === "string" && q.text.length > 0);
      assert.ok(typeof q.answer === "string" && q.answer.length > 0);
    }
  }
});

test("generateThuThapSoLieu: surveyTitle luôn là chuỗi không rỗng", () => {
  const survey = generateThuThapSoLieu(4);
  assert.ok(typeof survey.title === "string" && survey.title.length > 0);
});

test("generateThuThapSoLieu: count nhỏ hơn (VD 2) vẫn hoạt động, không lỗi", () => {
  for (let i = 0; i < 50; i++) {
    const survey = generateThuThapSoLieu(2);
    assert.ok(survey.questions.length <= 2 && survey.questions.length >= 1);
  }
});
