/**
 * ================== SCRIPT MỘT LẦN (không chạy trong runtime app), PHIÊN 42 ==================
 * Sinh src/data/clockFacePngs.js - 12 ảnh PNG mặt đồng hồ (giờ tròn 1-12, kim phút luôn chỉ 12) -
 * THAY EMOJI UNICODE "🕐-🕛" đang dùng ở buildXemDongHoGioDungParagraphs() trong
 * worksheetExportService.js (Bài "Xem đồng hồ", Bài 12 trong phiếu Lớp 1 - giáo viên phản ánh
 * KHÔNG THẤY RÕ KIM ĐỒNG HỒ khi mở file .docx thật bằng Microsoft Word, dù PDF/preview web vẫn
 * ổn - đúng dạng lỗi "phụ thuộc font/glyph máy người dùng" mà quy ước dự án đã cấm dùng cho hình
 * vẽ trong Word, xem README.md/NEXT_STEPS.md mục "Xuất Word - không dùng ký tự Unicode hiếm").
 *
 * Hình học rasterize Ở ĐÂY PHẢI khớp CHÍNH XÁC component ClockFace() trong
 * src/components/WorksheetPreview.jsx (bản xem trước web) để giáo viên thấy ảnh Word và ảnh web
 * là 1 - chỉ khác mỗi phút LUÔN = 0 (đúng đúng mức Lớp 1 "giờ đúng", xem generateXemDongHoGioDung()
 * trong worksheetSchemas.js) nên kim giờ luôn đứng ĐÚNG số, không lệch dần như bản Lớp 3 (phút).
 *
 * Chạy: npm install --no-save @resvg/resvg-js
 *       node scripts/render-clock-face-pngs.js
 */
const fs = require("fs");
const path = require("path");
const { Resvg } = require("@resvg/resvg-js");

const cx = 50;
const cy = 50;
const toRad = (deg) => (deg * Math.PI) / 180;
const pointAt = (angleDeg, r) => ({
  x: cx + r * Math.cos(toRad(angleDeg)),
  y: cy + r * Math.sin(toRad(angleDeg)),
});

function clockFaceSvgInner(hour) {
  const minute = 0; // "giờ đúng" - kim phút luôn chỉ số 12, đúng ClockFace(hour, minute=0)
  const hourAngle = (hour % 12) * 30 + minute * 0.5 - 90;
  const minuteAngle = minute * 6 - 90;
  const hourTip = pointAt(hourAngle, 19);
  const minuteTip = pointAt(minuteAngle, 30);
  const numbers = Array.from({ length: 12 }, (_, idx) => {
    const n = idx + 1;
    const { x, y } = pointAt((n % 12) * 30 - 90, 34);
    return { n, x, y };
  });
  const numberTexts = numbers
    .map(
      ({ n, x, y }) =>
        `<text x="${x}" y="${y + 3.5}" font-size="10" text-anchor="middle" fill="#334155" font-family="Times New Roman, sans-serif" font-weight="700">${n}</text>`
    )
    .join("");
  return `
    <circle cx="${cx}" cy="${cy}" r="42" fill="#fff" stroke="#334155" stroke-width="3"/>
    ${numberTexts}
    <line x1="${cx}" y1="${cy}" x2="${hourTip.x}" y2="${hourTip.y}" stroke="#334155" stroke-width="4.5" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${minuteTip.x}" y2="${minuteTip.y}" stroke="#334155" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="3" fill="#334155"/>
  `;
}

function svgToPngBase64(svgInner, widthPx) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${svgInner}</svg>`;
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: widthPx } });
  return resvg.render().asPng().toString("base64");
}

// 96px - đủ lớn để in rõ kim + số trên giấy A4 (khớp cỡ ClockFace mặc định size=88 bên web).
const entries = Array.from({ length: 12 }, (_, idx) => {
  const hour = idx + 1;
  const base64 = svgToPngBase64(clockFaceSvgInner(hour), 96);
  return `  ${hour}: ${JSON.stringify(base64)},`;
});

const file = `// Tự động sinh bởi scripts/render-clock-face-pngs.js - KHÔNG sửa tay, sửa hình học ở chính
// script này (phải khớp ClockFace() trong src/components/WorksheetPreview.jsx) rồi chạy lại.
// Thay thế CLOCK_EMOJI_BY_HOUR (ký tự Unicode "🕐-🕛" phụ thuộc font emoji máy người dùng, có thể
// hiện kim mờ/khó thấy trong Word thật dù PDF vẫn ổn) - xem worksheetExportService.js, mục
// "Xem đồng hồ (giờ đúng)" (Phiên 42, phản hồi giáo viên qua file .docx thật).
export const CLOCK_FACE_PNG_BY_HOUR = {
${entries.join("\n")}
};
`;
fs.writeFileSync(path.join(__dirname, "../src/data/clockFacePngs.js"), file);

console.log(`Đã tạo ${entries.length} ảnh mặt đồng hồ (giờ 1-12).`);
