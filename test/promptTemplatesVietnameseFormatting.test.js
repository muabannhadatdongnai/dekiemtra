import { test } from "node:test";
import assert from "node:assert/strict";
import { buildExamPrompt } from "../src/data/promptTemplates.js";

/**
 * promptTemplatesVietnameseFormatting.test.js
 * Mở rộng quy tắc số thập phân/đơn vị đo kiểu Việt Nam (đã áp dụng cho "Đề cương Ôn tập" - xem
 * outlinePromptTemplates.test.js) sang "Đề kiểm tra" (buildExamPrompt trong promptTemplates.js).
 * ⚠️ KHÔNG mở rộng sang "Phiếu bài tập" (worksheetGenerator.js): đã rà soát, tính năng này chỉ hỗ
 * trợ Lớp 1-2 (xem worksheetExerciseCatalog.js, maxGrade cao nhất là "LOP_2") - chương trình Toán
 * Lớp 1-2 CHƯA dạy số thập phân lẫn đơn vị diện tích có số mũ, nên quy tắc này không áp dụng được
 * (thêm vào chỉ gây nhiễu prompt không cần thiết).
 */

function sampleExamPrompt(overrides = {}) {
  return buildExamPrompt({
    grade: 5,
    subject: "Toán",
    chaptersBreakdown: [{ chapterId: "c1", label: "Chương 1", markdown: "Nội dung mẫu", count: 2 }],
    difficulty: "NHAN_BIET",
    questionType: "trac_nghiem",
    includeAnswers: false,
    ...overrides,
  });
}

test('buildExamPrompt: BẮT BUỘC yêu cầu dùng dấu PHẨY (,) cho số thập phân, cấm dấu chấm (.)', () => {
  const prompt = sampleExamPrompt();
  assert.match(prompt, /DẤU PHẨY/, "phải có quy tắc bắt buộc dùng dấu phẩy cho số thập phân");
  assert.match(prompt, /15,6/, "phải có ví dụ cụ thể minh hoạ đúng định dạng");
  assert.match(prompt, /TUYỆT ĐỐI KHÔNG viết \"15\.6\"/, "phải nêu rõ cấm viết kiểu dấu chấm quốc tế");
});

test('buildExamPrompt: có hướng dẫn riêng viết số thập phân trong LaTeX bằng "{,}" để tránh lỗi giãn cách', () => {
  const prompt = sampleExamPrompt();
  assert.match(prompt, /15\{,\}6/, 'phải có ví dụ minh hoạ cú pháp "{,}" trong LaTeX');
  assert.match(prompt, /LaTeX/, "phải nhắc rõ đây là quy tắc riêng cho công thức LaTeX");
});

test('buildExamPrompt: yêu cầu dùng ký hiệu số mũ trên (km², m²) ở phần text thường, KHÔNG áp dụng trong LaTeX', () => {
  const prompt = sampleExamPrompt();
  assert.match(prompt, /km²/, "phải có ví dụ ký hiệu số mũ trên cho km vuông");
  assert.match(prompt, /KHÔNG viết \"km2\"/, "phải nêu rõ cấm viết số thường ngay sau chữ cái đơn vị");
});

test("buildExamPrompt: quy tắc định dạng số/đơn vị áp dụng cho MỌI môn học, không chỉ Toán", () => {
  const promptToan = sampleExamPrompt({ subject: "Toán" });
  const promptLichSu = sampleExamPrompt({ subject: "Lich_Su" });
  assert.match(promptToan, /DẤU PHẨY/);
  assert.match(promptLichSu, /DẤU PHẨY/);
});
