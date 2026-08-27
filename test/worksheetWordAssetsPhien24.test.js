import { test } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import { buildWorksheetDocxBlob } from "../src/services/worksheetExportService.js";
import { generateDoDaiSoSanh, generateThuThapSoLieu, generateNhanDienHinh, SHAPES } from "../src/data/worksheetSchemas.js";
import { SHAPE_ICON_PNG_BASE64 } from "../src/data/shapeIconPngs.js";
import { BAR_TILE_PNG_BASE64 } from "../src/data/barTilePng.js";

/**
 * worksheetWordAssetsPhien24.test.js
 * Sửa lỗi "ký tự Unicode hình khối (┆▬▭▪■⬭⬠⬡⏢) hiện TRỐNG trong Word" (phản hồi giáo viên qua
 * file Word thực tế - Bài 7 "so sánh độ dài" không nhìn ra line-art dù PDF vẫn ổn, xem
 * NEXT_STEPS.md Phiên 24). Cùng tinh thần worksheetLineArtIcons.test.js: build .docx THẬT,
 * giải nén bằng JSZip, soi thẳng document.xml + media.
 *
 * ⚠️ CẦN `npm install` TRƯỚC KHI CHẠY.
 */

async function docxXml(worksheet, showAnswers = false) {
  const blob = await buildWorksheetDocxBlob({ worksheet, meta: { title: "Test" }, showAnswers });
  const arrayBuffer = await blob.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  return { zip, xml: await zip.file("word/document.xml").async("string") };
}

test("kho icon hình học line-art phủ ĐỦ 11/11 hình trong SHAPES", () => {
  assert.equal(SHAPES.length, 11, "kho SHAPES đổi số lượng - cần cập nhật lại giả định của test này");
  for (const s of SHAPES) {
    assert.ok(SHAPE_ICON_PNG_BASE64[s], `thiếu icon line-art (Word/PNG) cho hình "${s}"`);
  }
});

test("Bài 7 'so sánh độ dài': Word nhúng ẢNH thanh xám (ImageRun), KHÔNG còn ký tự ┆▬▭▪ thô", async () => {
  const items = generateDoDaiSoSanh(4);
  const worksheet = { sections: [{ type: "do_dai_so_sanh", title: "So sánh độ dài", mascot: "🐢", items }] };

  const { xml, zip } = await docxXml(worksheet);
  for (const glyph of ["┆", "▬", "▭", "▪"]) {
    assert.ok(!xml.includes(glyph), `document.xml vẫn còn ký tự Unicode thô '${glyph}' - lẽ ra phải là ảnh`);
  }
  // Mỗi câu có 2 thanh (A và B) -> ít nhất 2 * số câu thẻ <w:drawing>.
  const drawingCount = (xml.match(/<w:drawing>/g) || []).length;
  assert.ok(drawingCount >= items.length * 2, `chỉ có ${drawingCount} <w:drawing>, kỳ vọng >= ${items.length * 2}`);
  const mediaFiles = Object.keys(zip.folder("word/media")?.files || {}).filter((f) => f.endsWith(".png"));
  assert.ok(mediaFiles.length >= 1, "thiếu ảnh PNG thanh đo trong word/media");
});

test("'Thu thập số liệu' (biểu đồ cột): Word nhúng ẢNH thanh xám, KHÔNG còn ký tự ■ thô", async () => {
  const { surveyTitle, data, questions } = generateThuThapSoLieu(4);
  const worksheet = { sections: [{ type: "thu_thap_so_lieu", title: "Thu thập số liệu", mascot: "📊", surveyTitle, data, questions }] };

  const { xml } = await docxXml(worksheet);
  assert.ok(!xml.includes("■"), "document.xml vẫn còn ký tự '■' thô - lẽ ra phải là ảnh");
  const drawingCount = (xml.match(/<w:drawing>/g) || []).length;
  assert.ok(drawingCount >= data.length, `chỉ có ${drawingCount} <w:drawing>, kỳ vọng >= ${data.length} (1 thanh/mục)`);
});

test("'Nhận diện hình': Word nhúng ẢNH line-art từng hình, KHÔNG còn ký tự ⬭⬠⬡⏢ thô", async () => {
  const shapes = generateNhanDienHinh(6);
  const worksheet = { sections: [{ type: "nhan_dien_hinh", title: "Nhận diện hình", mascot: "🔺", shapes }] };

  const { xml, zip } = await docxXml(worksheet);
  for (const glyph of ["⬭", "⬠", "⬡", "⏢"]) {
    assert.ok(!xml.includes(glyph), `document.xml vẫn còn ký tự Unicode thô '${glyph}'`);
  }
  const drawingCount = (xml.match(/<w:drawing>/g) || []).length;
  assert.equal(drawingCount, shapes.length, `document.xml có ${drawingCount} <w:drawing>, kỳ vọng đúng ${shapes.length} (1 ảnh/hình)`);
  const distinctShapesUsed = new Set(shapes).size;
  const mediaFiles = Object.keys(zip.folder("word/media")?.files || {}).filter((f) => f.endsWith(".png"));
  assert.ok(mediaFiles.length >= distinctShapesUsed, `thiếu ảnh: kỳ vọng >= ${distinctShapesUsed} hình khác nhau, có ${mediaFiles.length}`);
});

test("BAR_TILE_PNG_BASE64 và SHAPE_ICON_PNG_BASE64 là base64 hợp lệ, giải mã ra được buffer khác rỗng", () => {
  assert.ok(BAR_TILE_PNG_BASE64.length > 0, "BAR_TILE_PNG_BASE64 rỗng");
  const barBuf = Buffer.from(BAR_TILE_PNG_BASE64, "base64");
  assert.ok(barBuf.length > 0, "BAR_TILE_PNG_BASE64 giải mã ra buffer rỗng");
  assert.equal(barBuf[0], 0x89, "BAR_TILE_PNG_BASE64 không phải PNG hợp lệ (thiếu magic byte)");

  for (const [name, base64] of Object.entries(SHAPE_ICON_PNG_BASE64)) {
    const buf = Buffer.from(base64, "base64");
    assert.ok(buf.length > 0, `icon "${name}" giải mã ra buffer rỗng`);
    assert.equal(buf[0], 0x89, `icon "${name}" không phải PNG hợp lệ`);
  }
});
