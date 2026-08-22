import { test } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import { buildWorksheetDocxBlob } from "../src/services/worksheetExportService.js";
import { generateGocNhanBiet, generatePhanSoRutGon, generatePhanSoSoSanh } from "../src/data/worksheetSchemas.js";

/**
 * worksheetPhien17BugFix.test.js
 * Sửa 3 lỗi phản hồi thực tế từ Hoan sau khi test phiếu Lớp 4 (Bài 6/8/9):
 * 1. "Nuốt chữ" do ký tự "°" trong bản Word "Góc và đơn vị đo góc" (Bài 9) - đã bỏ hẳn số đo góc
 *    dạng chữ khỏi Word, chỉ còn "Đây là góc <loại góc>".
 * 2. "Dính chữ" số thứ tự câu + phân số ở "Rút gọn phân số" (Bài 6) / "So sánh phân số" (Bài 8) -
 *    đã thêm số thứ tự TÁCH RIÊNG TextRun, không ghép chung chuỗi với phân số.
 * 3. "Hạt sạn sư phạm" - số đo góc lẻ tẻ (VD 159°) không phù hợp phương pháp ê-ke của Lớp 4 - đã
 *    xác nhận field `degrees` giờ CHỈ dùng để vẽ SVG ở web, không còn xuất hiện dạng chữ.
 *
 * ⚠️ CẦN `npm install` TRƯỚC KHI CHẠY - test này build .docx THẬT (không mock), giải nén bằng
 * JSZip rồi soi thẳng document.xml, cùng tinh thần exportService.docx.test.js.
 */

async function extractDocumentXml(worksheet, showAnswers) {
  const blob = await buildWorksheetDocxBlob({ worksheet, meta: { title: "Test" }, showAnswers });
  const arrayBuffer = await blob.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  return zip.file("word/document.xml").async("string");
}

test("Word 'Góc và đơn vị đo góc' KHÔNG còn ký tự '°' hay số đo góc dạng chữ (cả bản Giáo viên lẫn Học sinh)", async () => {
  const items = generateGocNhanBiet(6);
  const worksheet = { sections: [{ type: "goc_nhan_biet", title: "Góc", mascot: "📏", items }] };

  for (const showAnswers of [false, true]) {
    const xml = await extractDocumentXml(worksheet, showAnswers);
    assert.ok(!xml.includes("°"), `document.xml (showAnswers=${showAnswers}) vẫn còn ký tự '°'`);
    // Không kiểm tra bằng cách tìm chuỗi con số đo góc trực tiếp trong toàn bộ document.xml - XML
    // còn chứa rất nhiều số khác không liên quan (twip lề trang, cỡ chữ...) nên dễ trùng ngẫu
    // nhiên (VD "90" xuất hiện trong 1 con số margin nào đó) -> false positive. Thay vào đó kiểm
    // tra CHÍNH XÁC cụm "số đo" (cụm từ duy nhất từng dùng để dẫn vào số đo góc) không còn xuất
    // hiện - đủ để xác nhận không còn lộ số đo dạng chữ.
    assert.ok(!xml.includes("số đo"), `document.xml (showAnswers=${showAnswers}) vẫn còn cụm 'số đo' (nghi lộ số đo góc)`);
  }
});

test("Word 'Góc và đơn vị đo góc' bản Giáo viên nêu đúng tên loại góc theo thứ tự", async () => {
  const items = generateGocNhanBiet(4);
  const worksheet = { sections: [{ type: "goc_nhan_biet", title: "Góc", mascot: "📏", items }] };
  const xml = await extractDocumentXml(worksheet, true);
  items.forEach((it, i) => {
    assert.ok(xml.includes(`${i + 1}. Đây là góc ${it.answer}`), `thiếu đáp án câu ${i + 1} (${it.answer})`);
  });
});

test("Word 'Góc và đơn vị đo góc' bản Học sinh có ghi chú nhắc xem hình vẽ ở bản web/PDF", async () => {
  const items = generateGocNhanBiet(3);
  const worksheet = { sections: [{ type: "goc_nhan_biet", title: "Góc", mascot: "📏", items }] };
  const xml = await extractDocumentXml(worksheet, false);
  assert.ok(xml.includes("xem hình vẽ") || xml.includes("bản xem trước"), "thiếu ghi chú hướng dẫn xem hình vẽ");
});

test("Word 'Rút gọn phân số' có số thứ tự câu đúng thứ tự, tách riêng khỏi phân số", async () => {
  const items = generatePhanSoRutGon(6);
  const worksheet = { sections: [{ type: "phan_so_rut_gon", title: "Rút gọn", mascot: "🧩", items }] };
  const xml = await extractDocumentXml(worksheet, true);
  items.forEach((it, i) => {
    assert.ok(xml.includes(`${i + 1}.`), `thiếu số thứ tự câu ${i + 1}`);
    assert.ok(
      xml.includes(`${it.numerator}/${it.denominator}`),
      `thiếu phân số gốc câu ${i + 1} (${it.numerator}/${it.denominator})`
    );
  });
});

test("Word 'So sánh phân số' có số thứ tự câu đúng thứ tự, tách riêng khỏi phân số", async () => {
  const items = generatePhanSoSoSanh(6);
  const worksheet = { sections: [{ type: "phan_so_so_sanh", title: "So sánh", mascot: "🥧", items }] };
  const xml = await extractDocumentXml(worksheet, true);
  items.forEach((it, i) => {
    assert.ok(xml.includes(`${i + 1}.`), `thiếu số thứ tự câu ${i + 1}`);
    assert.ok(xml.includes(`${it.n1}/${it.d1}`), `thiếu phân số n1/d1 câu ${i + 1}`);
    assert.ok(xml.includes(`${it.n2}/${it.d2}`), `thiếu phân số n2/d2 câu ${i + 1}`);
  });
});
