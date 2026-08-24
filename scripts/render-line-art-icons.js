/**
 * ================== SCRIPT MỘT LẦN (không chạy trong runtime app) ==================
 * Tạo lại 2 file:
 *   - src/data/lineArtIcons.js     (SVG dùng cho web)
 *   - src/data/lineArtIconPngs.js  (PNG base64 dùng cho Word/docx)
 * từ nguồn vẽ DUY NHẤT ở scripts/lineArtIconDefs.js (16 icon line-art, khớp kho ICONS trong
 * worksheetSchemas.js theo emoji key).
 *
 * Chạy: npm install --no-save @resvg/resvg-js  (rasterizer, KHÔNG thêm vào package.json chính -
 * chỉ cần lúc chạy script này, tránh kéo dependency native vào bundle production/Vercel)
 *       node scripts/render-line-art-icons.js
 */
const fs = require("fs");
const path = require("path");
const { Resvg } = require("@resvg/resvg-js");
const { ICON_DEFS } = require("./lineArtIconDefs.js");

const webEntries = [];
const pngEntries = [];

for (const [emoji, def] of Object.entries(ICON_DEFS)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${def.svg}</svg>`;
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 96 } });
  const png = resvg.render().asPng();
  webEntries.push(`  ${JSON.stringify(emoji)}: { name: ${JSON.stringify(def.name)}, svgInner: ${JSON.stringify(def.svg)} },`);
  pngEntries.push(`  ${JSON.stringify(emoji)}: ${JSON.stringify(png.toString("base64"))},`);
}

const webFile = `// Tự động sinh bởi scripts/render-line-art-icons.js - KHÔNG sửa tay, sửa ở scripts/lineArtIconDefs.js rồi chạy lại script.
export const LINE_ART_ICONS = {
${webEntries.join("\n")}
};

export function getLineArtIcon(emoji) {
  return LINE_ART_ICONS[emoji] || null;
}
`;

const pngFile = `// Tự động sinh bởi scripts/render-line-art-icons.js - KHÔNG sửa tay, sửa ở scripts/lineArtIconDefs.js rồi chạy lại script.
export const LINE_ART_ICON_PNG_BASE64 = {
${pngEntries.join("\n")}
};
`;

fs.writeFileSync(path.join(__dirname, "../src/data/lineArtIcons.js"), webFile);
fs.writeFileSync(path.join(__dirname, "../src/data/lineArtIconPngs.js"), pngFile);
console.log(`Đã tạo lại ${webEntries.length} icon line-art.`);
