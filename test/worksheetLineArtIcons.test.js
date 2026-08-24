import { test } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import { buildWorksheetDocxBlob } from "../src/services/worksheetExportService.js";
import { generateDemVaVietSo, AVAILABLE_ICONS } from "../src/data/worksheetSchemas.js";
import { LINE_ART_ICONS } from "../src/data/lineArtIcons.js";
import { LINE_ART_ICON_PNG_BASE64 } from "../src/data/lineArtIconPngs.js";

/**
 * worksheetLineArtIcons.test.js
 * Sửa lỗi "Bài 3 icon màu khó phân biệt khi in đen trắng" (phản hồi giáo viên qua ảnh tham khảo,
 * hướng (A) đã chọn - xem NEXT_STEPS.md): thay 16 icon emoji màu bằng icon line-art (nét vẽ đen
 * trắng), dùng CHUNG 1 bộ SVG cho cả web (LineArtIcon component) và Word (PNG render sẵn từ CÙNG
 * SVG, nhúng bằng ImageRun).
 *
 * ⚠️ CẦN `npm install` TRƯỚC KHI CHẠY - test này build .docx THẬT (không mock), giải nén bằng
 * JSZip rồi soi thẳng document.xml + media, cùng tinh thần worksheetPhien17BugFix.test.js.
 */

test("kho icon line-art phủ ĐỦ 16/16 icon trong kho ICONS (không icon nào bị thiếu bản line-art)", () => {
  assert.equal(AVAILABLE_ICONS.length, 16, "kho ICONS đổi số lượng - cần cập nhật lại giả định của test này");
  for (const emoji of AVAILABLE_ICONS) {
    assert.ok(LINE_ART_ICONS[emoji], `thiếu icon line-art (web/SVG) cho ${emoji}`);
    assert.ok(LINE_ART_ICON_PNG_BASE64[emoji], `thiếu icon line-art (Word/PNG base64) cho ${emoji}`);
  }
});

test("Word 'Đếm và viết số' nhúng ẢNH PNG line-art (docx ImageRun), KHÔNG còn emoji màu thô trong document.xml", async () => {
  const items = generateDemVaVietSo("LOP_1", 4);
  const worksheet = { sections: [{ type: "dem_va_viet_so", title: "Đếm và viết số", mascot: "🔢", items }] };

  for (const showAnswers of [false, true]) {
    const blob = await buildWorksheetDocxBlob({ worksheet, meta: { title: "Test" }, showAnswers });
    const arrayBuffer = await blob.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    const documentXml = await zip.file("word/document.xml").async("string");

    // Icon emoji màu KHÔNG còn xuất hiện dạng text thô trong document.xml (đã thay bằng ảnh).
    for (const it of items) {
      assert.ok(
        !documentXml.includes(it.icon),
        `document.xml (showAnswers=${showAnswers}) vẫn còn icon emoji thô '${it.icon}' - lẽ ra phải là ảnh PNG`
      );
    }

    // docx dồn ẢNH TRÙNG BYTE THÀNH 1 file media dùng chung (dedupe theo nội dung buffer) - vì mọi
    // icon "🍎" trong cùng 1 item luôn dùng đúng 1 buffer PNG giống hệt nhau, KHÔNG kỳ vọng số file
    // /media = tổng it.count, chỉ kỳ vọng >= số icon KHÁC NHAU được dùng trong bài.
    const mediaFolder = zip.folder("word/media");
    const mediaFiles = mediaFolder ? Object.keys(mediaFolder.files).filter((f) => f.endsWith(".png")) : [];
    const distinctIconsUsed = new Set(items.map((it) => it.icon)).size;
    assert.ok(
      mediaFiles.length >= distinctIconsUsed,
      `document (showAnswers=${showAnswers}) thiếu ảnh: kỳ vọng >= ${distinctIconsUsed} icon khác nhau, có ${mediaFiles.length}`
    );

    // document.xml phải có ĐỦ số thẻ <w:drawing> = tổng it.count (mỗi icon đếm = 1 lần chèn ảnh,
    // dù nhiều icon có thể CÙNG trỏ tới 1 file media dùng chung - xem chú thích dedupe ở trên).
    const drawingCount = (documentXml.match(/<w:drawing>/g) || []).length;
    const expectedTotalIcons = items.reduce((sum, it) => sum + it.count, 0);
    assert.equal(
      drawingCount,
      expectedTotalIcons,
      `document.xml (showAnswers=${showAnswers}) có ${drawingCount} thẻ <w:drawing>, kỳ vọng ${expectedTotalIcons}`
    );
  }
});

test("Word 'Đếm và viết số' vẫn giữ đúng đáp số (đã ẩn khi showAnswers=false, hiện khi true)", async () => {
  const items = generateDemVaVietSo("LOP_1", 3);
  const worksheet = { sections: [{ type: "dem_va_viet_so", title: "Đếm và viết số", mascot: "🔢", items }] };

  const studentBlob = await buildWorksheetDocxBlob({ worksheet, meta: { title: "Test" }, showAnswers: false });
  const studentXml = await (await JSZip.loadAsync(await studentBlob.arrayBuffer())).file("word/document.xml").async("string");
  for (const it of items) {
    assert.ok(!studentXml.includes(`Số: ${it.answer}`), `bản Học sinh lộ đáp số ${it.answer}`);
  }

  const teacherBlob = await buildWorksheetDocxBlob({ worksheet, meta: { title: "Test" }, showAnswers: true });
  const teacherXml = await (await JSZip.loadAsync(await teacherBlob.arrayBuffer())).file("word/document.xml").async("string");
  for (const it of items) {
    assert.ok(teacherXml.includes(`Số: ${it.answer}`), `bản Giáo viên thiếu đáp số ${it.answer}`);
  }
});
