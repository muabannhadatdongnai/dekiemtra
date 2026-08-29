import { test } from "node:test";
import assert from "node:assert/strict";
import JSZip from "jszip";
import {
  getSectionVisualTheme,
  getLayoutById,
  BW_PALETTE,
  COLOR_PALETTES,
} from "../src/data/worksheetLayoutTemplates.js";
import { generateWorksheet } from "../src/services/worksheetGenerator.js";
import { buildWorksheetDocxBlob } from "../src/services/worksheetExportService.js";

/**
 * worksheetPrintModeBw.test.js
 * "Tối ưu in đen trắng" (`bwMode`, phủ TOÀN BỘ phiếu, không riêng icon Bài 3) - đã được code từ
 * trước (BW_PALETTE + getSectionVisualTheme trong worksheetLayoutTemplates.js, prop `bwMode`
 * xuyên suốt WorksheetPreview.jsx / worksheetExportService.js / WorksheetExportActions.jsx /
 * page.js) nhưng CHƯA hề có test tự động. File này lấp khoảng trống, không viết lại logic.
 */

test("getSectionVisualTheme(bwMode=true) LUÔN trả về BW_PALETTE, bất kể layout/index nào", () => {
  const layout = getLayoutById("classic_2col_dotted");
  for (let index = 0; index < 8; index++) {
    const theme = getSectionVisualTheme(layout, { mascot: "🍎" }, index, true);
    assert.equal(theme.border, BW_PALETTE.border);
    assert.equal(theme.bg, BW_PALETTE.bg);
    assert.equal(theme.badge, BW_PALETTE.badge);
    assert.equal(theme.badgeDark, BW_PALETTE.badgeDark);
    assert.equal(theme.title, BW_PALETTE.title);
    assert.equal(theme.mascot, "🍎", "vẫn giữ nguyên mascot của section, chỉ đổi màu");
  }
});

test("getSectionVisualTheme(bwMode=false) KHÔNG bị ảnh hưởng - vẫn xoay vòng palette màu như cũ", () => {
  const layout = getLayoutById("classic_2col_dotted");
  const seenPaletteBadges = new Set();
  for (let index = 0; index < layout.colorPaletteIds.length; index++) {
    const theme = getSectionVisualTheme(layout, { mascot: "⭐" }, index, false);
    assert.notEqual(theme.border, BW_PALETTE.border);
    seenPaletteBadges.add(theme.badge);
  }
  // Với layout có nhiều colorPaletteIds khác nhau, các khối liền kề phải khác màu (xoay vòng).
  assert.ok(seenPaletteBadges.size > 1, "các khối không xoay vòng màu khi bwMode tắt");
});

test("getSectionVisualTheme mặc định bwMode=false khi không truyền tham số (không đổi hành vi cũ)", () => {
  const layout = getLayoutById("classic_2col_dotted");
  const theme = getSectionVisualTheme(layout, { mascot: "⭐" }, 0);
  assert.notEqual(theme.border, BW_PALETTE.border);
});

test("buildWorksheetDocxBlob(bwMode=true) xuất file Word hợp lệ, chỉ dùng màu đen/trắng, không còn hex màu gốc nào", async () => {
  const worksheet = await generateWorksheet({
    grade: "LOP_3",
    subject: "TOAN",
    exerciseCounts: { tinh_nham: 3, so_sanh: 3, thu_thap_so_lieu: 3, kha_nang_xay_ra: 3 },
  });
  assert.ok(worksheet.sections.length >= 4, "cần nhiều khối để kiểm tra xoay vòng màu bị tắt hẳn");

  const blob = await buildWorksheetDocxBlob({ worksheet, meta: { title: "TEST BW" }, showAnswers: true, bwMode: true });
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  assert.ok(zip.file("word/document.xml"), "file .docx không hợp lệ - thiếu document.xml");
  const xml = await zip.file("word/document.xml").async("string");

  // Không được còn sót bất kỳ hex màu nào của COLOR_PALETTES gốc (badge dùng phổ biến nhất -
  // hexNoHash bỏ dấu # trước khi ghi vào XML).
  for (const [id, palette] of Object.entries(COLOR_PALETTES)) {
    const badgeHex = palette.badge.replace(/^#/, "");
    assert.ok(!xml.includes(badgeHex), `còn sót màu badge "${badgeHex}" của bảng màu "${id}" dù đã bật bwMode`);
  }

  // Phải xuất hiện màu đen/xám đậm của BW_PALETTE (ít nhất màu badge).
  const bwBadgeHex = BW_PALETTE.badge.replace(/^#/, "");
  assert.ok(xml.includes(bwBadgeHex), "không thấy màu đen/xám của BW_PALETTE trong Word");
});

test("buildWorksheetDocxBlob(bwMode=false, mặc định) vẫn dùng màu như trước - không bị đổi hành vi khi thêm tính năng bwMode", async () => {
  const worksheet = await generateWorksheet({
    grade: "LOP_3",
    subject: "TOAN",
    exerciseCounts: { tinh_nham: 3 },
  });
  const blobDefault = await buildWorksheetDocxBlob({ worksheet, meta: { title: "TEST" }, showAnswers: true });
  const blobExplicitFalse = await buildWorksheetDocxBlob({ worksheet, meta: { title: "TEST" }, showAnswers: true, bwMode: false });
  const zip1 = await JSZip.loadAsync(await blobDefault.arrayBuffer());
  const zip2 = await JSZip.loadAsync(await blobExplicitFalse.arrayBuffer());
  const xml1 = await zip1.file("word/document.xml").async("string");
  const xml2 = await zip2.file("word/document.xml").async("string");
  // Không thể so sánh y hệt do QR/section ngẫu nhiên hoá layout độc lập mỗi lần build, nhưng cả
  // 2 đều KHÔNG được chứa màu BW_PALETTE (đen tuyệt đối làm màu badge là dấu hiệu bwMode bật).
  const bwBadgeHex = BW_PALETTE.badge.replace(/^#/, "");
  assert.ok(!xml1.includes(`fill="${bwBadgeHex}"`), "bwMode mặc định KHÔNG được tự bật");
  assert.ok(!xml2.includes(`fill="${bwBadgeHex}"`), "bwMode=false KHÔNG được bật màu đen/trắng");
});
