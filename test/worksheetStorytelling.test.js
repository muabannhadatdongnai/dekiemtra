import { test } from "node:test";
import assert from "node:assert/strict";
import { pickStorytellingTheme, buildWordProblemPrompt } from "../src/services/worksheetGenerator.js";

/**
 * worksheetStorytelling.test.js
 * GIAI ĐOẠN F (mục deferred "storytelling theo theme" trong PROJECT_SUMMARY.md): giáo viên chủ
 * động bật để các bài "giải toán có lời văn" dùng CHUNG 1 chủ đề/nhân vật xuyên suốt (kiểu 1 câu
 * chuyện nhiều tập), thay vì mặc định mỗi bài 1 chủ đề ngẫu nhiên riêng biệt.
 */

test("pickStorytellingTheme: giữ nguyên chủ đề giáo viên tự gõ (không random đè lên)", () => {
  const theme = pickStorytellingTheme("bạn Bống đi chợ Tết cùng bà");
  assert.equal(theme, "bạn Bống đi chợ Tết cùng bà");
});

test("pickStorytellingTheme: tự cắt khoảng trắng thừa 2 đầu", () => {
  const theme = pickStorytellingTheme("   bạn Bống đi chợ Tết cùng bà   ");
  assert.equal(theme, "bạn Bống đi chợ Tết cùng bà");
});

test("pickStorytellingTheme: bỏ trống/chỉ có khoảng trắng -> tự random ra 1 chuỗi khác rỗng", () => {
  for (const input of [undefined, null, "", "   "]) {
    const theme = pickStorytellingTheme(input);
    assert.equal(typeof theme, "string");
    assert.ok(theme.trim().length > 0, `input=${JSON.stringify(input)} phải random ra chủ đề không rỗng`);
  }
});

test("buildWordProblemPrompt: có storytellingTheme -> prompt yêu cầu DÙNG CHUNG 1 chủ đề, không liệt kê N chủ đề rời rạc", () => {
  const prompt = buildWordProblemPrompt({
    gradeLabel: "Lớp 1",
    maxNumber: 10,
    count: 3,
    includeAnswers: false,
    referenceContext: null,
    themes: [],
    storytellingTheme: "bạn Bống đi chợ Tết cùng bà",
  });
  assert.match(prompt, /CHUNG 1 chủ đề\/nhân vật xuyên suốt/, "phải nêu rõ yêu cầu dùng chung 1 chủ đề");
  assert.match(prompt, /bạn Bống đi chợ Tết cùng bà/, "phải chèn đúng chủ đề giáo viên chọn vào prompt");
  assert.doesNotMatch(prompt, /CHỦ ĐỀ đã được chọn NGẪU NHIÊN SẴN/, "không được lẫn nhánh prompt cũ (N chủ đề rời rạc)");
});

test("buildWordProblemPrompt: KHÔNG có storytellingTheme -> giữ đúng hành vi cũ (N chủ đề riêng theo thứ tự)", () => {
  const prompt = buildWordProblemPrompt({
    gradeLabel: "Lớp 1",
    maxNumber: 10,
    count: 2,
    includeAnswers: false,
    referenceContext: null,
    themes: ["chủ đề A", "chủ đề B"],
    storytellingTheme: null,
  });
  assert.match(prompt, /CHỦ ĐỀ đã được chọn NGẪU NHIÊN SẴN/, "phải giữ nguyên nhánh prompt cũ khi không bật storytelling");
  assert.match(prompt, /1\. chủ đề A/);
  assert.match(prompt, /2\. chủ đề B/);
  assert.doesNotMatch(prompt, /CHUNG 1 chủ đề\/nhân vật xuyên suốt/, "không được lẫn nhánh prompt storytelling");
});
