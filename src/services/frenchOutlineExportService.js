import { Document, Paragraph, AlignmentType } from "docx";
import { OUTLINE_LEVEL_ORDER } from "@/data/outlineTemplates";
import {
  pageProperties,
  heading,
  paragraph,
  bulletList,
  textRun,
  saveDocx,
  buildDocxBlob,
  printHtmlDocument,
  htmlHeading,
  htmlParagraph,
  htmlBulletList,
} from "./foreignLanguageDocBuilder";

/**
 * frenchOutlineExportService.js
 * Bản TIẾNG PHÁP của englishOutlineExportService.js - xuất Word/PDF cho "Đề Cương Ôn Tập" môn
 * Tiếng Pháp (Ngoại ngữ 2). Nhận object `outline` đã được AI sinh trực tiếp bằng tiếng Pháp (cùng
 * khoá bản gốc: tenDeCuong, kienThucCotLoi, dangBai, nganHangBaiTap, loTrinhOnTap,
 * thuNgoPhuHuynh). Các bản ngôn ngữ khác giữ NGUYÊN VẸN.
 *
 * ⚠️ Phụ lục "Thư ngỏ gửi Phụ huynh" (`outline.thuNgoPhuHuynh`) LUÔN được AI viết bằng TIẾNG VIỆT
 * dù đề cương còn lại bằng tiếng Pháp - đúng khuôn đã áp dụng cho các bản ngôn ngữ khác.
 *
 * Tiếng Pháp dùng bảng chữ Latinh - dùng THẲNG helper mặc định (Times New Roman đủ dùng), không
 * cần createLanguageHelpers()/eastAsia như bản tiếng Trung/Nhật.
 */

const LEVEL_LABEL_FR = {
  coBan: "Basique",
  nangCao: "Avancé",
  vanDungCao: "Défi",
};

function metaLine(meta) {
  const parts = [];
  if (meta?.subjectLabelEn) parts.push(`Matière : ${meta.subjectLabelEn}`);
  if (meta?.grade != null && meta.grade !== "") parts.push(`Niveau : ${meta.grade}`);
  return parts.join("   |   ");
}

function buildDocxSections(outline, meta) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [textRun("FICHE DE RÉVISION", { bold: true, size: 32 })],
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
    children.push(heading("I. CONNAISSANCES ESSENTIELLES"));
    outline.kienThucCotLoi.forEach((item) => {
      children.push(paragraph(item.tieuMuc, { run: { bold: true } }));
      children.push(paragraph(item.noiDung));
    });
  }

  if (outline?.dangBai?.length) {
    children.push(heading("II. TYPES DE QUESTIONS ET EXEMPLES DE SOLUTIONS"));
    outline.dangBai.forEach((d, idx) => {
      children.push(heading(`${idx + 1}. ${d.tenDang || ""}`, 2));
      if (d.luuY) children.push(paragraph(`Remarque : ${d.luuY}`, { run: { italics: true } }));
      if (d.baiMauDe) children.push(paragraph(`Exemple : ${d.baiMauDe}`));
      if (d.baiMauLoiGiai) children.push(paragraph(`Solution : ${d.baiMauLoiGiai}`));
      if (d.canhBaoBayLoi) children.push(paragraph(`⚠️ Erreur fréquente : ${d.canhBaoBayLoi}`));
    });
  }

  if (outline?.nganHangBaiTap && typeof outline.nganHangBaiTap === "object") {
    children.push(heading("III. BANQUE D'EXERCICES"));
    OUTLINE_LEVEL_ORDER.forEach((level) => {
      const items = outline.nganHangBaiTap[level];
      if (!items?.length) return;
      children.push(heading(LEVEL_LABEL_FR[level] || level, 2));
      items.forEach((it, i) => {
        children.push(paragraph(`${i + 1}. ${it.de || ""}`));
        if (it.dapAn) children.push(paragraph(`   Réponse : ${it.dapAn}`, { run: { italics: true } }));
      });
    });
  }

  if (outline?.loTrinhOnTap?.length) {
    children.push(heading("IV. CALENDRIER DE RÉVISION"));
    children.push(
      ...bulletList(outline.loTrinhOnTap.map((d) => `${d.ngay ? `${d.ngay} : ` : ""}${d.nhiemVu || ""}`))
    );
  }

  if (outline?.thuNgoPhuHuynh) {
    children.push(heading("V. MOT AUX PARENTS"));
    children.push(paragraph(outline.thuNgoPhuHuynh));
  }

  return children;
}

export function buildFrenchOutlineDocument(outline, meta) {
  return new Document({
    sections: [{ properties: pageProperties, children: buildDocxSections(outline, meta) }],
  });
}

export async function buildFrenchOutlineDocxBlob(outline, meta) {
  return buildDocxBlob(buildFrenchOutlineDocument(outline, meta));
}

export async function exportFrenchOutlineToWord(outline, meta) {
  const fileBase = (outline?.tenDeCuong || "Study-Outline").trim().replace(/\s+/g, "-").slice(0, 60);
  await saveDocx(buildFrenchOutlineDocument(outline, meta), `Study-Outline-FR-${fileBase}.docx`);
}

function buildHtmlBody(outline, meta) {
  let html = `<h1>FICHE DE RÉVISION</h1><p class="doc-meta"><strong>${outline?.tenDeCuong || ""}</strong><br/>${metaLine(
    meta
  )}</p>`;

  if (outline?.kienThucCotLoi?.length) {
    html += htmlHeading("I. Connaissances essentielles");
    outline.kienThucCotLoi.forEach((item) => {
      html += `<p><strong>${item.tieuMuc || ""}</strong></p>` + htmlParagraph(item.noiDung);
    });
  }

  if (outline?.dangBai?.length) {
    html += htmlHeading("II. Types de questions et exemples de solutions");
    outline.dangBai.forEach((d, idx) => {
      html += htmlHeading(`${idx + 1}. ${d.tenDang || ""}`, 3);
      if (d.luuY) html += htmlParagraph(`Remarque : ${d.luuY}`);
      if (d.baiMauDe) html += htmlParagraph(`Exemple : ${d.baiMauDe}`);
      if (d.baiMauLoiGiai) html += htmlParagraph(`Solution : ${d.baiMauLoiGiai}`);
      if (d.canhBaoBayLoi) html += htmlParagraph(`⚠️ Erreur fréquente : ${d.canhBaoBayLoi}`);
    });
  }

  if (outline?.nganHangBaiTap && typeof outline.nganHangBaiTap === "object") {
    html += htmlHeading("III. Banque d'exercices");
    OUTLINE_LEVEL_ORDER.forEach((level) => {
      const items = outline.nganHangBaiTap[level];
      if (!items?.length) return;
      html += htmlHeading(LEVEL_LABEL_FR[level] || level, 3);
      html += htmlBulletList(items.map((it) => `${it.de || ""}${it.dapAn ? ` — Réponse : ${it.dapAn}` : ""}`));
    });
  }

  if (outline?.loTrinhOnTap?.length) {
    html += htmlHeading("IV. Calendrier de révision");
    html += htmlBulletList(outline.loTrinhOnTap.map((d) => `${d.ngay ? `${d.ngay} : ` : ""}${d.nhiemVu || ""}`));
  }

  if (outline?.thuNgoPhuHuynh) {
    html += htmlHeading("V. Mot aux parents");
    html += htmlParagraph(outline.thuNgoPhuHuynh);
  }

  return html;
}

export function printFrenchOutline(outline, meta) {
  printHtmlDocument({ title: `Fiche de révision - ${outline?.tenDeCuong || ""}`, bodyHtml: buildHtmlBody(outline, meta) });
}
