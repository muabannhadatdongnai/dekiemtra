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
 * chineseOutlineExportService.js
 * Bản TIẾNG TRUNG của englishOutlineExportService.js - xuất Word/PDF cho "Đề Cương Ôn Tập" môn
 * Tiếng Trung (Ngoại ngữ 2). Nhận object `outline` đã được AI sinh trực tiếp bằng tiếng Trung
 * (cùng khoá bản gốc: tenDeCuong, kienThucCotLoi, dangBai, nganHangBaiTap, loTrinhOnTap,
 * thuNgoPhuHuynh - xem outlinePromptTemplates.js). Bản gốc tiếng Việt (outlineExportService.js) và
 * bản tiếng Anh (englishOutlineExportService.js) giữ NGUYÊN VẸN, không đụng tới.
 *
 * ⚠️ Phụ lục "Thư ngỏ gửi Phụ huynh" (`outline.thuNgoPhuHuynh`) LUÔN được AI viết bằng TIẾNG VIỆT
 * dù đề cương còn lại bằng tiếng Trung - đúng khuôn đã áp dụng cho bản tiếng Anh.
 *
 * ⚠️ FONT: dùng createLanguageHelpers() (foreignLanguageDocBuilder.js) với `eastAsia: "SimSun"` vì
 * "Times New Roman" không có glyph chữ Hán - xem chineseLessonPlanExportService.js để biết lý do
 * đầy đủ.
 */

const FONT_ZH = { ascii: "Times New Roman", hAnsi: "Times New Roman", cs: "Times New Roman", eastAsia: "SimSun" };
const PRINT_FONT_FAMILY_ZH = '"SimSun", "Microsoft YaHei", "PingFang SC", "Times New Roman", serif';

const { textRun, paragraph, heading, bulletList } = createLanguageHelpers(FONT_ZH);

const LEVEL_LABEL_ZH = {
  coBan: "基础",
  nangCao: "提高",
  vanDungCao: "拓展",
};

function metaLine(meta) {
  const parts = [];
  if (meta?.subjectLabelEn) parts.push(`科目：${meta.subjectLabelEn}`);
  if (meta?.grade != null && meta.grade !== "") parts.push(`年级：${meta.grade}`);
  return parts.join("   |   ");
}

function buildDocxSections(outline, meta) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [textRun("复习提纲", { bold: true, size: 32 })],
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
    children.push(heading("一、核心知识"));
    outline.kienThucCotLoi.forEach((item) => {
      children.push(paragraph(item.tieuMuc, { run: { bold: true } }));
      children.push(paragraph(item.noiDung));
    });
  }

  if (outline?.dangBai?.length) {
    children.push(heading("二、题型与示例解析"));
    outline.dangBai.forEach((d, idx) => {
      children.push(heading(`${idx + 1}. ${d.tenDang || ""}`, 2));
      if (d.luuY) children.push(paragraph(`注意：${d.luuY}`, { run: { italics: true } }));
      if (d.baiMauDe) children.push(paragraph(`例题：${d.baiMauDe}`));
      if (d.baiMauLoiGiai) children.push(paragraph(`解析：${d.baiMauLoiGiai}`));
      if (d.canhBaoBayLoi) children.push(paragraph(`⚠️ 常见错误：${d.canhBaoBayLoi}`));
    });
  }

  if (outline?.nganHangBaiTap && typeof outline.nganHangBaiTap === "object") {
    children.push(heading("三、练习题库"));
    OUTLINE_LEVEL_ORDER.forEach((level) => {
      const items = outline.nganHangBaiTap[level];
      if (!items?.length) return;
      children.push(heading(LEVEL_LABEL_ZH[level] || level, 2));
      items.forEach((it, i) => {
        children.push(paragraph(`${i + 1}. ${it.de || ""}`));
        if (it.dapAn) children.push(paragraph(`   答案：${it.dapAn}`, { run: { italics: true } }));
      });
    });
  }

  if (outline?.loTrinhOnTap?.length) {
    children.push(heading("四、复习计划"));
    children.push(
      ...bulletList(outline.loTrinhOnTap.map((d) => `${d.ngay ? `${d.ngay}：` : ""}${d.nhiemVu || ""}`))
    );
  }

  if (outline?.thuNgoPhuHuynh) {
    children.push(heading("五、致家长的话"));
    children.push(paragraph(outline.thuNgoPhuHuynh));
  }

  return children;
}

export function buildChineseOutlineDocument(outline, meta) {
  return new Document({
    sections: [{ properties: pageProperties, children: buildDocxSections(outline, meta) }],
  });
}

export async function buildChineseOutlineDocxBlob(outline, meta) {
  return buildDocxBlob(buildChineseOutlineDocument(outline, meta));
}

export async function exportChineseOutlineToWord(outline, meta) {
  const fileBase = (outline?.tenDeCuong || "Study-Outline").trim().replace(/\s+/g, "-").slice(0, 60);
  await saveDocx(buildChineseOutlineDocument(outline, meta), `Study-Outline-ZH-${fileBase}.docx`);
}

function buildHtmlBody(outline, meta) {
  let html = `<h1>复习提纲</h1><p class="doc-meta"><strong>${outline?.tenDeCuong || ""}</strong><br/>${metaLine(
    meta
  )}</p>`;

  if (outline?.kienThucCotLoi?.length) {
    html += htmlHeading("一、核心知识");
    outline.kienThucCotLoi.forEach((item) => {
      html += `<p><strong>${item.tieuMuc || ""}</strong></p>` + htmlParagraph(item.noiDung);
    });
  }

  if (outline?.dangBai?.length) {
    html += htmlHeading("二、题型与示例解析");
    outline.dangBai.forEach((d, idx) => {
      html += htmlHeading(`${idx + 1}. ${d.tenDang || ""}`, 3);
      if (d.luuY) html += htmlParagraph(`注意：${d.luuY}`);
      if (d.baiMauDe) html += htmlParagraph(`例题：${d.baiMauDe}`);
      if (d.baiMauLoiGiai) html += htmlParagraph(`解析：${d.baiMauLoiGiai}`);
      if (d.canhBaoBayLoi) html += htmlParagraph(`⚠️ 常见错误：${d.canhBaoBayLoi}`);
    });
  }

  if (outline?.nganHangBaiTap && typeof outline.nganHangBaiTap === "object") {
    html += htmlHeading("三、练习题库");
    OUTLINE_LEVEL_ORDER.forEach((level) => {
      const items = outline.nganHangBaiTap[level];
      if (!items?.length) return;
      html += htmlHeading(LEVEL_LABEL_ZH[level] || level, 3);
      html += htmlBulletList(items.map((it) => `${it.de || ""}${it.dapAn ? ` — 答案：${it.dapAn}` : ""}`));
    });
  }

  if (outline?.loTrinhOnTap?.length) {
    html += htmlHeading("四、复习计划");
    html += htmlBulletList(outline.loTrinhOnTap.map((d) => `${d.ngay ? `${d.ngay}：` : ""}${d.nhiemVu || ""}`));
  }

  if (outline?.thuNgoPhuHuynh) {
    html += htmlHeading("五、致家长的话");
    html += htmlParagraph(outline.thuNgoPhuHuynh);
  }

  return html;
}

export function printChineseOutline(outline, meta) {
  printHtmlDocument({
    title: `复习提纲 - ${outline?.tenDeCuong || ""}`,
    bodyHtml: buildHtmlBody(outline, meta),
    fontFamily: PRINT_FONT_FAMILY_ZH,
  });
}
