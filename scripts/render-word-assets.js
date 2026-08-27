/**
 * ================== SCRIPT MỘT LẦN (không chạy trong runtime app), PHIÊN 24 ==================
 * Sinh 2 file tài sản Word (ảnh PNG base64) để THAY THẾ hoàn toàn các ký tự Unicode ép font
 * Times New Roman đang bị hiện TRỐNG trong Word (glyph không có trong font đó dù PDF vẫn ổn nhờ
 * trình duyệt tự fallback font - xem NEXT_STEPS.md Phiên 24):
 *
 *   1) src/data/shapeIconPngs.js  - 11 icon hình học line-art (thay SHAPE_GLYPHS: ⬭ ⬠ ⬡ ⏢...)
 *      dùng cho "Nhận diện hình", KÍCH THƯỚC CỐ ĐỊNH, y hệt cơ chế icon Bài 3 (lineArtIconPngs.js).
 *   2) src/data/barTilePng.js     - 1 ảnh "thanh" xám đặc DUY NHẤT, KÉO GIÃN CHIỀU RỘNG lúc nhúng
 *      (transformation.width trong ImageRun) để biểu diễn độ dài/số lượng bất kỳ - thay
 *      LENGTH_KIND_GLYPHS ("┆▬▭▪" lặp lại) ở Bài 7 và "■".repeat() ở biểu đồ cột "Thu thập số
 *      liệu". Ảnh là 1 pixel-block nên co giãn không méo (solid color, không hoạ tiết).
 *
 * Chạy: npm install --no-save @resvg/resvg-js
 *       node scripts/render-word-assets.js
 */
const fs = require("fs");
const path = require("path");
const { Resvg } = require("@resvg/resvg-js");
const { SHAPE_ICON_DEFS } = require("./shapeIconDefs.js");

function svgToPngBase64(svgInner, viewBox, widthPx) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${svgInner}</svg>`;
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: widthPx } });
  return resvg.render().asPng().toString("base64");
}

// ---- 1) Icon hình học (Nhận diện hình) ----
const shapeEntries = Object.entries(SHAPE_ICON_DEFS).map(([name, svgInner]) => {
  const base64 = svgToPngBase64(svgInner, "0 0 100 100", 96);
  return `  ${JSON.stringify(name)}: ${JSON.stringify(base64)},`;
});
const shapeFile = `// Tự động sinh bởi scripts/render-word-assets.js - KHÔNG sửa tay, sửa ở scripts/shapeIconDefs.js
// rồi chạy lại script. Thay SHAPE_GLYPHS (ký tự Unicode hiếm, trống trong Word) - xem
// worksheetExportService.js, mục "Nhận diện hình" (Phiên 24).
export const SHAPE_ICON_PNG_BASE64 = {
${shapeEntries.join("\n")}
};
`;
fs.writeFileSync(path.join(__dirname, "../src/data/shapeIconPngs.js"), shapeFile);

// ---- 2) Thanh xám đặc (co giãn) cho Bài 7 + biểu đồ cột ----
// Viewbox vuông đơn giản để tránh biến dạng khi Resvg raster hoá ở base width nhỏ; docx ImageRun
// sẽ tự set transformation.width/height khác nhau lúc nhúng (không phụ thuộc tỉ lệ ảnh gốc).
const barSvgInner = `<rect x="0" y="0" width="100" height="100" fill="#1F2937"/>`;
const barBase64 = svgToPngBase64(barSvgInner, "0 0 100 100", 40);
const barFile = `// Tự động sinh bởi scripts/render-word-assets.js - KHÔNG sửa tay.
// 1 ảnh thanh xám đặc DUY NHẤT, kéo giãn transformation.width/height lúc nhúng ImageRun để biểu
// diễn độ dài (Bài 7 "so sánh độ dài") hoặc số lượng (biểu đồ cột "Thu thập số liệu") bất kỳ -
// thay ký tự Unicode lặp lại (┆▬▭▪■) từng bị hiện TRỐNG trong Word do thiếu glyph font (Phiên 24).
export const BAR_TILE_PNG_BASE64 = ${JSON.stringify(barBase64)};
`;
fs.writeFileSync(path.join(__dirname, "../src/data/barTilePng.js"), barFile);

console.log(`Đã tạo ${shapeEntries.length} icon hình học + 1 thanh xám kéo giãn.`);
