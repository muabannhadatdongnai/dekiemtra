// Nguồn vẽ 11 icon hình học line-art (outline đen trắng), thay cho SHAPE_GLYPHS (ký tự Unicode
// hiếm như ⬭ ⬠ ⬡ ⏢ không có trong font Times New Roman -> hiện trống trong Word, xem NEXT_STEPS.md
// Phiên 24). Cùng phong cách với ICON_DEFS (lineArtIconDefs.js): viewBox 0 0 100 100, stroke đen
// #1a1a1a, stroke-width 5, fill "none" - dùng CHUNG script render-word-assets.js để rasterize.
// Key khớp ĐÚNG tên trong SHAPES (worksheetSchemas.js) và SHAPE_GLYPHS cũ (worksheetExportService.js).

const S = 'stroke="#1a1a1a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"';

const SHAPE_ICON_DEFS = {
  "Hình tròn": `<circle cx="50" cy="50" r="36" ${S}/>`,
  "Hình vuông": `<rect x="16" y="16" width="68" height="68" ${S}/>`,
  "Hình tam giác": `<path ${S} d="M50 14L88 82H12z"/>`,
  "Hình chữ nhật": `<rect x="10" y="26" width="80" height="48" ${S}/>`,
  "Hình ngôi sao": `<path ${S} d="M50 10l11 24 26 3-19 18 5 26-23-13-23 13 5-26-19-18 26-3z"/>`,
  "Hình trái tim": `<path ${S} d="M50 84C20 62 8 44 8 28 8 14 20 6 32 10c8 3 14 9 18 15 4-6 10-12 18-15 12-4 24 4 24 18 0 16-12 34-42 56z"/>`,
  "Hình thoi": `<path ${S} d="M50 10L86 50 50 90 14 50z"/>`,
  "Hình ê-líp": `<ellipse cx="50" cy="50" rx="40" ry="26" ${S}/>`,
  "Hình ngũ giác": `<path ${S} d="M50 8L90 38 74 88H26L10 38z"/>`,
  "Hình lục giác": `<path ${S} d="M28 12H72L92 50 72 88H28L8 50z"/>`,
  "Hình thang": `<path ${S} d="M22 78L32 22H68L78 78z"/>`,
};

module.exports = { SHAPE_ICON_DEFS };
