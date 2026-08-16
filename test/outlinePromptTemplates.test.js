import { test } from "node:test";
import assert from "node:assert/strict";
import { buildOutlinePrompt } from "../src/data/outlinePromptTemplates.js";

/**
 * outlinePromptTemplates.test.js
 * Khoá lại 2 lỗi giáo viên phản ánh khi dùng tính năng "Đề cương Ôn tập":
 * 1. AI viết số thập phân theo chuẩn quốc tế (dấu chấm, VD "15.6") thay vì chuẩn Việt Nam (dấu
 *    phẩy, VD "15,6") - học sinh có thể bị trừ điểm khi áp dụng vào bài thi thực tế.
 * 2. Đơn vị đo có số mũ (km2, m2...) viết số thường thay vì ký hiệu số mũ trên (km², m²).
 */

function samplePrompt(overrides = {}) {
  return buildOutlinePrompt({
    subject: "Toan",
    grade: 5,
    volume: 1,
    chapterLabel: "Chương 1, 2, 3",
    sourceMarkdown: "",
    exerciseCounts: { co_ban: 2, nang_cao: 2, van_dung_cao: 1 },
    yeuCauDacBiet: "",
    soNgayOnTap: 7,
    ...overrides,
  });
}

test('buildOutlinePrompt: BẮT BUỘC yêu cầu dùng dấu PHẨY (,) cho số thập phân, cấm dấu chấm (.)', () => {
  const prompt = samplePrompt();
  assert.match(prompt, /DẤU PHẨY/, "phải có quy tắc bắt buộc dùng dấu phẩy cho số thập phân");
  assert.match(prompt, /15,6/, "phải có ví dụ cụ thể minh hoạ đúng định dạng");
  assert.match(prompt, /TUYỆT ĐỐI KHÔNG viết "15\.6"/, "phải nêu rõ cấm viết kiểu dấu chấm quốc tế");
});

test('buildOutlinePrompt: yêu cầu dùng ký hiệu số mũ trên (km², m²) thay vì số thường (km2, m2)', () => {
  const prompt = samplePrompt();
  assert.match(prompt, /km²/, "phải có ví dụ ký hiệu số mũ trên cho km vuông");
  assert.match(prompt, /KHÔNG viết "km2"/, "phải nêu rõ cấm viết số thường ngay sau chữ cái đơn vị");
});
