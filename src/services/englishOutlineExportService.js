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
 * englishOutlineExportService.js
 * Xuất Word/PDF bằng TIẾNG ANH cho "Đề Cương Ôn Tập" môn Tiếng Anh - nhận object `outline` ĐÃ ĐƯỢC
 * DỊCH (cùng khoá bản gốc: tenDeCuong, kienThucCotLoi, dangBai, nganHangBaiTap, loTrinhOnTap,
 * thuNgoPhuHuynh - xem outlinePromptTemplates.js). Bản gốc tiếng Việt (outlineExportService.js)
 * giữ NGUYÊN VẸN, không đụng tới.
 *
 * ⚠️ Khác 1 điểm có chủ đích so với bản tiếng Việt gốc: bản tiếng Anh xuất GỘP 1 FILE DUY NHẤT
 * (không tách 2 bản Học sinh/GV-PH) vì đây là bản "đọc/đối chiếu song ngữ" phụ, giáo viên vẫn dùng
 * 2 bản tiếng Việt gốc để phát cho học sinh/phụ huynh như trước - phù hợp đúng yêu cầu "toàn bộ
 * nội dung chuyển sang tiếng Anh" (đầy đủ, không cần tách quyền xem đáp án).
 */

const LEVEL_LABEL_EN = {
  coBan: "Basic",
  nangCao: "Advanced",
  vanDungCao: "Challenge",
};

function metaLine(meta) {
  const parts = [];
  if (meta?.subjectLabelEn) parts.push(`Subject: ${meta.subjectLabelEn}`);
  if (meta?.grade != null && meta.grade !== "") parts.push(`Grade: ${meta.grade}`);
  return parts.join("   |   ");
}

function buildDocxSections(outline, meta) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [textRun("STUDY OUTLINE", { bold: true, size: 32 })],
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
    children.push(heading("I. CORE KNOWLEDGE"));
    outline.kienThucCotLoi.forEach((item) => {
      children.push(paragraph(item.tieuMuc, { run: { bold: true } }));
      children.push(paragraph(item.noiDung));
    });
  }

  if (outline?.dangBai?.length) {
    children.push(heading("II. QUESTION TYPES & SAMPLE SOLUTIONS"));
    outline.dangBai.forEach((d, idx) => {
      children.push(heading(`${idx + 1}. ${d.tenDang || ""}`, 2));
      if (d.luuY) children.push(paragraph(`Note: ${d.luuY}`, { run: { italics: true } }));
      if (d.baiMauDe) children.push(paragraph(`Sample: ${d.baiMauDe}`));
      if (d.baiMauLoiGiai) children.push(paragraph(`Solution: ${d.baiMauLoiGiai}`));
      if (d.canhBaoBayLoi) children.push(paragraph(`⚠️ Common mistake: ${d.canhBaoBayLoi}`));
    });
  }

  if (outline?.nganHangBaiTap && typeof outline.nganHangBaiTap === "object") {
    children.push(heading("III. PRACTICE BANK"));
    OUTLINE_LEVEL_ORDER.forEach((level) => {
      const items = outline.nganHangBaiTap[level];
      if (!items?.length) return;
      children.push(heading(LEVEL_LABEL_EN[level] || level, 2));
      items.forEach((it, i) => {
        children.push(paragraph(`${i + 1}. ${it.de || ""}`));
        if (it.dapAn) children.push(paragraph(`   Answer: ${it.dapAn}`, { run: { italics: true } }));
      });
    });
  }

  if (outline?.loTrinhOnTap?.length) {
    children.push(heading("IV. STUDY SCHEDULE"));
    children.push(
      ...bulletList(outline.loTrinhOnTap.map((d) => `${d.ngay ? `${d.ngay}: ` : ""}${d.nhiemVu || ""}`))
    );
  }

  if (outline?.thuNgoPhuHuynh) {
    children.push(heading("V. A NOTE TO PARENTS"));
    children.push(paragraph(outline.thuNgoPhuHuynh));
  }

  return children;
}

export function buildEnglishOutlineDocument(outline, meta) {
  return new Document({
    sections: [{ properties: pageProperties, children: buildDocxSections(outline, meta) }],
  });
}

export async function buildEnglishOutlineDocxBlob(outline, meta) {
  return buildDocxBlob(buildEnglishOutlineDocument(outline, meta));
}

export async function exportEnglishOutlineToWord(outline, meta) {
  const fileBase = (outline?.tenDeCuong || "Study-Outline").trim().replace(/\s+/g, "-").slice(0, 60);
  await saveDocx(buildEnglishOutlineDocument(outline, meta), `Study-Outline-EN-${fileBase}.docx`);
}

function buildHtmlBody(outline, meta) {
  let html = `<h1>STUDY OUTLINE</h1><p class="doc-meta"><strong>${outline?.tenDeCuong || ""}</strong><br/>${metaLine(
    meta
  )}</p>`;

  if (outline?.kienThucCotLoi?.length) {
    html += htmlHeading("I. Core Knowledge");
    outline.kienThucCotLoi.forEach((item) => {
      html += `<p><strong>${item.tieuMuc || ""}</strong></p>` + htmlParagraph(item.noiDung);
    });
  }

  if (outline?.dangBai?.length) {
    html += htmlHeading("II. Question Types & Sample Solutions");
    outline.dangBai.forEach((d, idx) => {
      html += htmlHeading(`${idx + 1}. ${d.tenDang || ""}`, 3);
      if (d.luuY) html += htmlParagraph(`Note: ${d.luuY}`);
      if (d.baiMauDe) html += htmlParagraph(`Sample: ${d.baiMauDe}`);
      if (d.baiMauLoiGiai) html += htmlParagraph(`Solution: ${d.baiMauLoiGiai}`);
      if (d.canhBaoBayLoi) html += htmlParagraph(`⚠️ Common mistake: ${d.canhBaoBayLoi}`);
    });
  }

  if (outline?.nganHangBaiTap && typeof outline.nganHangBaiTap === "object") {
    html += htmlHeading("III. Practice Bank");
    OUTLINE_LEVEL_ORDER.forEach((level) => {
      const items = outline.nganHangBaiTap[level];
      if (!items?.length) return;
      html += htmlHeading(LEVEL_LABEL_EN[level] || level, 3);
      html += htmlBulletList(items.map((it) => `${it.de || ""}${it.dapAn ? ` — Answer: ${it.dapAn}` : ""}`));
    });
  }

  if (outline?.loTrinhOnTap?.length) {
    html += htmlHeading("IV. Study Schedule");
    html += htmlBulletList(outline.loTrinhOnTap.map((d) => `${d.ngay ? `${d.ngay}: ` : ""}${d.nhiemVu || ""}`));
  }

  if (outline?.thuNgoPhuHuynh) {
    html += htmlHeading("V. A Note to Parents");
    html += htmlParagraph(outline.thuNgoPhuHuynh);
  }

  return html;
}

export function printEnglishOutline(outline, meta) {
  printHtmlDocument({ title: `Study Outline - ${outline?.tenDeCuong || ""}`, bodyHtml: buildHtmlBody(outline, meta) });
}
