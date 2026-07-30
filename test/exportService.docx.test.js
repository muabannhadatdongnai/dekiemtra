import { test } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import { buildExamDocxBlob } from "../src/services/exportService.js";

/**
 * exportService.docx.test.js
 * ⚠️ CẦN `npm install` TRƯỚC KHI CHẠY - test này dùng thật "docx", "temml", "mathml2omml",
 * "jszip" (không mock) để bắt đúng lỗi tích hợp thật, không chỉ lỗi logic thuần. Đây chính
 * xác là kịch bản đã lọt 2 bug Word liên tiếp trước đây: PHẢI test phân số VÀ bất đẳng thức
 * TRONG CÙNG 1 lần tạo file, không test riêng lẻ từng loại (xem PROJECT_SUMMARY.md mục 5).
 *
 * Chạy: node --test test/exportService.docx.test.js
 */

function makeQuestion({ id, content, options = null, visualType, visualData }) {
  return { id, content, options, visualType, visualData, type: options ? "trac_nghiem" : "tu_luan" };
}

test("tạo file .docx với CẢ phân số LẪN bất đẳng thức cùng lúc - không được hỏng file", async () => {
  const questions = [
    makeQuestion({
      id: "q1",
      content: "Tính giá trị của biểu thức $\\frac{1}{2} + \\frac{3}{4}$.",
    }),
    makeQuestion({
      id: "q2",
      content: "Tìm $x$ biết $x < 5$ và $x > 2$.",
      options: ["A. $x = 3$", "B. $x = 6$", "C. $x = 1$", "D. $x = 10$"],
    }),
    makeQuestion({
      id: "q3",
      content: "So sánh $a \\leq b$ khi biết $a \\ne b$ và $a \\& b$ đều dương.", // ép cả dấu &
    }),
  ];

  const blob = await buildExamDocxBlob({
    title: "ĐỀ KIỂM TRA - TEST TỰ ĐỘNG",
    grade: 6,
    subject: "Toán",
    examCode: "TEST01",
    questions,
    includeMatrixAndSpec: false,
    includeRubricSection: false,
  });

  assert.ok(blob, "buildExamDocxBlob không trả về gì");

  // File .docx thực chất là 1 file ZIP - phải load được bằng JSZip, không throw
  const arrayBuffer = await blob.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  assert.ok(zip.file("word/document.xml"), "thiếu word/document.xml - file .docx không hợp lệ");

  const xml = await zip.file("word/document.xml").async("string");

  // Không được còn sót placeholder chưa thay (MATHEQN...) - nghĩa là bước chèn OMML thất bại
  assert.ok(!xml.includes("MATHEQN"), "còn sót placeholder công thức chưa được chèn OMML thật");

  // ⚠️ Kiểm tra CHÍNH XÁC lỗi đã xảy ra 2 lần trước đây: mọi nội dung bên trong <m:t>...</m:t>
  // KHÔNG được chứa ký tự '<' hoặc '>' thô (phải là &lt;/&gt; đã escape), nếu không XML sẽ hỏng
  // và Word báo lỗi không mở được file.
  const mtNodeMatches = [...xml.matchAll(/<m:t(?:\s[^>]*)?>([\s\S]*?)<\/m:t>/g)];
  assert.ok(mtNodeMatches.length > 0, "không tìm thấy node <m:t> nào - công thức có được convert không?");
  for (const match of mtNodeMatches) {
    const content = match[1];
    assert.ok(!content.includes("<"), `node <m:t> chứa dấu '<' chưa escape: "${content}"`);
    assert.ok(!content.includes(">"), `node <m:t> chứa dấu '>' chưa escape: "${content}"`);
  }

  // Thẻ <m:type .../> (đánh dấu kiểu phân số) phải còn nguyên vẹn, không bị regex escape
  // "ăn nhầm" (đây chính xác là bug thứ 2 đã xảy ra) - đề có phân số 1/2 nên chắc chắn phải có.
  assert.ok(xml.includes("m:type"), "thiếu thẻ <m:type> - phân số có được convert đúng dạng OOXML không?");
});

test("đề KHÔNG có công thức LaTeX nào vẫn xuất file bình thường (không có <m:t> nào cũng không lỗi)", async () => {
  const questions = [makeQuestion({ id: "q1", content: "Đây là câu hỏi thuần text, không có công thức." })];

  const blob = await buildExamDocxBlob({
    grade: 6,
    subject: "Ngữ văn",
    examCode: "TEST02",
    questions,
    includeMatrixAndSpec: false,
    includeRubricSection: false,
  });

  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  const xml = await zip.file("word/document.xml").async("string");
  assert.ok(xml.includes("Đây là câu hỏi thuần text"));
});
