import { Document, Paragraph, AlignmentType } from "docx";
import { OUTLINE_LEVEL_ORDER } from "@/data/outlineTemplates";
import {
  pageProperties,
  saveDocx,
  buildDocxBlob,
  printHtmlDocument,
  htmlHeading,
  htmlParagraph,
  htmlBulletList,
  createLanguageHelpers,
} from "./foreignLanguageDocBuilder";

/**
 * japaneseOutlineExportService.js
 * Bản TIẾNG NHẬT của englishOutlineExportService.js/chineseOutlineExportService.js - xuất
 * Word/PDF cho "Đề Cương Ôn Tập" môn Tiếng Nhật (Ngoại ngữ 2). Nhận object `outline` đã được AI
 * sinh trực tiếp bằng tiếng Nhật (cùng khoá bản gốc: tenDeCuong, kienThucCotLoi, dangBai,
 * nganHangBaiTap, loTrinhOnTap, thuNgoPhuHuynh). Các bản ngôn ngữ khác giữ NGUYÊN VẸN.
 *
 * ⚠️ Phụ lục "Thư ngỏ gửi Phụ huynh" (`outline.thuNgoPhuHuynh`) LUÔN được AI viết bằng TIẾNG VIỆT
 * dù đề cương còn lại bằng tiếng Nhật - đúng khuôn đã áp dụng cho các bản ngôn ngữ khác.
 *
 * ⚠️ FONT: dùng createLanguageHelpers() với `eastAsia: "MS Mincho"`.
 */

const FONT_JA = { ascii: "Times New Roman", hAnsi: "Times New Roman", cs: "Times New Roman", eastAsia: "MS Mincho" };
const PRINT_FONT_FAMILY_JA = '"MS Mincho", "Yu Mincho", "Hiragino Mincho ProN", "Times New Roman", serif';

const { textRun, paragraph, heading, bulletList } = createLanguageHelpers(FONT_JA);

const LEVEL_LABEL_JA = {
  coBan: "基礎",
  nangCao: "発展",
  vanDungCao: "応用（挑戦）",
};

function metaLine(meta) {
  const parts = [];
  if (meta?.subjectLabelEn) parts.push(`教科：${meta.subjectLabelEn}`);
  if (meta?.grade != null && meta.grade !== "") parts.push(`学年：${meta.grade}`);
  return parts.join("   |   ");
}

function buildDocxSections(outline, meta) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [textRun("復習まとめ", { bold: true, size: 32 })],
      spacing: { after: 80 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [textRun(outline?.tenDeCuong || "", { bold: true, size: 26 })],
      spacing: { after: 60 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [textRun(metaLine(meta), { italics: true, size: 22 })],
      spacing: { after: 200 },
    }),
  ];

  if (outline?.kienThucCotLoi?.length) {
    children.push(heading("一、基礎知識"));
    outline.kienThucCotLoi.forEach((item) => {
      children.push(paragraph(item.tieuMuc, { run: { bold: true } }));
      children.push(paragraph(item.noiDung));
    });
  }

  if (outline?.dangBai?.length) {
    children.push(heading("二、問題タイプと解答例"));
    outline.dangBai.forEach((d, idx) => {
      children.push(heading(`${idx + 1}. ${d.tenDang || ""}`, 2));
      if (d.luuY) children.push(paragraph(`注意：${d.luuY}`, { run: { italics: true } }));
      if (d.baiMauDe) children.push(paragraph(`例題：${d.baiMauDe}`));
      if (d.baiMauLoiGiai) children.push(paragraph(`解説：${d.baiMauLoiGiai}`));
      if (d.canhBaoBayLoi) children.push(paragraph(`⚠️ よくある間違い：${d.canhBaoBayLoi}`));
    });
  }

  if (outline?.nganHangBaiTap && typeof outline.nganHangBaiTap === "object") {
    children.push(heading("三、演習問題集"));
    OUTLINE_LEVEL_ORDER.forEach((level) => {
      const items = outline.nganHangBaiTap[level];
      if (!items?.length) return;
      children.push(heading(LEVEL_LABEL_JA[level] || level, 2));
      items.forEach((it, i) => {
        children.push(paragraph(`${i + 1}. ${it.de || ""}`));
        if (it.dapAn) children.push(paragraph(`   答え：${it.dapAn}`, { run: { italics: true } }));
      });
    });
  }

  if (outline?.loTrinhOnTap?.length) {
    children.push(heading("四、学習スケジュール"));
    children.push(
      ...bulletList(outline.loTrinhOnTap.map((d) => `${d.ngay ? `${d.ngay}：` : ""}${d.nhiemVu || ""}`))
    );
  }

  if (outline?.thuNgoPhuHuynh) {
    children.push(heading("五、保護者の皆様へ"));
    children.push(paragraph(outline.thuNgoPhuHuynh));
  }

  return children;
}

export function buildJapaneseOutlineDocument(outline, meta) {
  return new Document({
    sections: [{ properties: pageProperties, children: buildDocxSections(outline, meta) }],
  });
}

export async function buildJapaneseOutlineDocxBlob(outline, meta) {
  return buildDocxBlob(buildJapaneseOutlineDocument(outline, meta));
}

export async function exportJapaneseOutlineToWord(outline, meta) {
  const fileBase = (outline?.tenDeCuong || "Study-Outline").trim().replace(/\s+/g, "-").slice(0, 60);
  await saveDocx(buildJapaneseOutlineDocument(outline, meta), `Study-Outline-JA-${fileBase}.docx`);
}

function buildHtmlBody(outline, meta) {
  let html = `<h1>復習まとめ</h1><p class="doc-meta"><strong>${outline?.tenDeCuong || ""}</strong><br/>${metaLine(
    meta
  )}</p>`;

  if (outline?.kienThucCotLoi?.length) {
    html += htmlHeading("一、基礎知識");
    outline.kienThucCotLoi.forEach((item) => {
      html += `<p><strong>${item.tieuMuc || ""}</strong></p>` + htmlParagraph(item.noiDung);
    });
  }

  if (outline?.dangBai?.length) {
    html += htmlHeading("二、問題タイプと解答例");
    outline.dangBai.forEach((d, idx) => {
      html += htmlHeading(`${idx + 1}. ${d.tenDang || ""}`, 3);
      if (d.luuY) html += htmlParagraph(`注意：${d.luuY}`);
      if (d.baiMauDe) html += htmlParagraph(`例題：${d.baiMauDe}`);
      if (d.baiMauLoiGiai) html += htmlParagraph(`解説：${d.baiMauLoiGiai}`);
      if (d.canhBaoBayLoi) html += htmlParagraph(`⚠️ よくある間違い：${d.canhBaoBayLoi}`);
    });
  }

  if (outline?.nganHangBaiTap && typeof outline.nganHangBaiTap === "object") {
    html += htmlHeading("三、演習問題集");
    OUTLINE_LEVEL_ORDER.forEach((level) => {
      const items = outline.nganHangBaiTap[level];
      if (!items?.length) return;
      html += htmlHeading(LEVEL_LABEL_JA[level] || level, 3);
      html += htmlBulletList(items.map((it) => `${it.de || ""}${it.dapAn ? ` — 答え：${it.dapAn}` : ""}`));
    });
  }

  if (outline?.loTrinhOnTap?.length) {
    html += htmlHeading("四、学習スケジュール");
    html += htmlBulletList(outline.loTrinhOnTap.map((d) => `${d.ngay ? `${d.ngay}：` : ""}${d.nhiemVu || ""}`));
  }

  if (outline?.thuNgoPhuHuynh) {
    html += htmlHeading("五、保護者の皆様へ");
    html += htmlParagraph(outline.thuNgoPhuHuynh);
  }

  return html;
}

export function printJapaneseOutline(outline, meta) {
  printHtmlDocument({
    title: `復習まとめ - ${outline?.tenDeCuong || ""}`,
    bodyHtml: buildHtmlBody(outline, meta),
    fontFamily: PRINT_FONT_FAMILY_JA,
  });
}
