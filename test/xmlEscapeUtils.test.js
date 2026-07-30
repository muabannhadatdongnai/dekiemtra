import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeMathTextNodes } from "../src/services/xmlEscapeUtils.js";

/**
 * xmlEscapeUtils.test.js
 * Test cho đúng đoạn logic đã phá hỏng file .docx 2 LẦN LIÊN TIẾP (xem PROJECT_SUMMARY.md
 * mục 5). Module này KHÔNG phụ thuộc "docx"/"temml"/"mathml2omml" nên test chạy được ngay cả
 * khi chưa `npm install` gì cả - chạy bằng: `node --test test/xmlEscapeUtils.test.js`
 */

test("escape < > & bên trong <m:t> (bất đẳng thức, không phá XML)", () => {
  const input = "<m:t>x < 5 & y > 2</m:t>";
  const output = escapeMathTextNodes(input);
  assert.equal(output, "<m:t>x &lt; 5 &amp; y &gt; 2</m:t>");
});

test("KHÔNG được khớp nhầm <m:type .../> thành <m:t> - đây chính xác là bug đã xảy ra", () => {
  // Kịch bản thật đã gây lỗi: OMML của 1 phân số có <m:type m:val="bar"/> đứng NGAY TRƯỚC
  // 1 <m:t> chứa bất đẳng thức. Regex cũ (thiếu ranh giới rõ ràng) từng coi "m:type" là mở
  // đầu của "m:t..." rồi ăn lan sang tận </m:t> tiếp theo, phá toàn bộ cấu trúc XML phía sau.
  const input =
    '<m:f><m:fPr><m:type m:val="bar"/></m:fPr><m:num><m:r><m:t>1</m:t></m:r></m:num>' +
    "<m:den><m:r><m:t>2</m:t></m:r></m:den></m:f><m:r><m:t>x < 3</m:t></m:r>";

  const output = escapeMathTextNodes(input);

  // Thẻ <m:type .../> phải giữ NGUYÊN VẸN, không bị đụng vào
  assert.ok(output.includes('<m:type m:val="bar"/>'), "thẻ <m:type> bị biến dạng - bug đã tái phát!");
  // Nội dung 2 số trong phân số không đổi (không có ký tự cần escape)
  assert.ok(output.includes("<m:t>1</m:t>"));
  assert.ok(output.includes("<m:t>2</m:t>"));
  // Bất đẳng thức ở cuối phải được escape đúng
  assert.ok(output.includes("<m:t>x &lt; 3</m:t>"));
});

test("thẻ <m:t> có thuộc tính (vd xml:space=\"preserve\") vẫn được nhận diện đúng", () => {
  const input = '<m:t xml:space="preserve">a < b</m:t>';
  const output = escapeMathTextNodes(input);
  assert.equal(output, '<m:t xml:space="preserve">a &lt; b</m:t>');
});

test("nhiều <m:t> trong cùng 1 chuỗi đều được escape, không dừng ở node đầu tiên", () => {
  const input = "<m:t>a < b</m:t><m:t>c > d</m:t>";
  const output = escapeMathTextNodes(input);
  assert.equal(output, "<m:t>a &lt; b</m:t><m:t>c &gt; d</m:t>");
});

test("nội dung không có ký tự đặc biệt thì giữ nguyên", () => {
  const input = "<m:t>x + y = z</m:t>";
  assert.equal(escapeMathTextNodes(input), input);
});

test("chuỗi rỗng hoặc không chứa <m:t> nào thì trả về nguyên vẹn", () => {
  assert.equal(escapeMathTextNodes(""), "");
  assert.equal(escapeMathTextNodes("<m:r><m:rPr/></m:r>"), "<m:r><m:rPr/></m:r>");
});

test("<m:t> rỗng không gây lỗi", () => {
  assert.equal(escapeMathTextNodes("<m:t></m:t>"), "<m:t></m:t>");
});
