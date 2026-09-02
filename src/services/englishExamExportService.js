import { Document, Paragraph, AlignmentType } from "docx";
import {
  pageProperties,
  heading,
  paragraph,
  textRun,
  saveDocx,
  buildDocxBlob,
  printHtmlDocument,
  htmlHeading,
  htmlParagraph,
} from "./foreignLanguageDocBuilder";

/**
 * englishExamExportService.js
 * Xuất Word/PDF bằng TIẾNG ANH cho "Đề Kiểm tra" môn Tiếng Anh - nhận `translatedContent`
 * ĐÃ ĐƯỢC DỊCH, giữ nguyên cấu trúc { questions: [...], teacherRubric: [...] } như bản gốc
 * (xem promptTemplates.js) - ghép theo VỊ TRÍ (positional pairing), đúng nguyên tắc đã áp dụng ở
 * geminiEngine.js (pairAndFilterDuplicates). Bản gốc tiếng Việt (exportService.js) giữ NGUYÊN VẸN.
 */

function metaLines(meta) {
  const lines = [];
  if (meta?.schoolName) lines.push(meta.schoolName);
  const line2 = [];
  if (meta?.subjectLabelEn) line2.push(`Subject: ${meta.subjectLabelEn}`);
  if (meta?.grade != null && meta.grade !== "") line2.push(`Grade: ${meta.grade}`);
  if (meta?.className) line2.push(`Class: ${meta.className}`);
  if (line2.length) lines.push(line2.join("   |   "));
  const line3 = [];
  if (meta?.duration) line3.push(`Time: ${meta.duration} minutes`);
  if (meta?.academicYear) line3.push(`School year: ${meta.academicYear}`);
  if (line3.length) lines.push(line3.join("   |   "));
  return lines;
}

function buildQuestionParagraphs({ questions, teacherRubric, includeAnswers }) {
  const children = [];
  (questions || []).forEach((q, idx) => {
    children.push(paragraph(`Question ${idx + 1}. ${q.content || ""}`, { run: { bold: true } }));
    if (Array.isArray(q.options) && q.options.length) {
      children.push(...q.options.map((opt) => paragraph(opt)));
    }
    if (includeAnswers) {
      const rubric = teacherRubric?.[idx];
      if (q.correctAnswer) children.push(paragraph(`Correct answer: ${q.correctAnswer}`, { run: { bold: true } }));
      if (rubric?.detailedSolution) children.push(paragraph(`Solution: ${rubric.detailedSolution}`));
      if (rubric?.scoringGuide) children.push(paragraph(`Scoring guide: ${rubric.scoringGuide}`));
    } else {
      children.push(new Paragraph({ text: "", spacing: { after: 120 } }));
    }
  });
  return children;
}

function buildDocxSections(examMeta, translatedContent, { includeAnswers }) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [textRun(examMeta?.title || "ENGLISH TEST", { bold: true, size: 30 })],
      spacing: { after: 60 },
    }),
    ...metaLines(examMeta).map(
      (l) =>
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [textRun(l, { italics: true, size: 22 })],
          spacing: { after: 40 },
        })
    ),
    new Paragraph({ text: "", spacing: { after: 120 } }),
  ];

  if (examMeta?.objective) {
    children.push(paragraph(`Objective: ${examMeta.objective}`, { run: { italics: true } }));
  }

  children.push(heading(includeAnswers ? "ANSWER KEY" : "QUESTIONS"));
  children.push(
    ...buildQuestionParagraphs({
      questions: translatedContent?.questions,
      teacherRubric: translatedContent?.teacherRubric,
      includeAnswers,
    })
  );

  return children;
}

export function buildEnglishExamDocument(examMeta, translatedContent, { includeAnswers = false } = {}) {
  return new Document({
    sections: [{ properties: pageProperties, children: buildDocxSections(examMeta, translatedContent, { includeAnswers }) }],
  });
}

export async function buildEnglishExamDocxBlob(examMeta, translatedContent, opts) {
  return buildDocxBlob(buildEnglishExamDocument(examMeta, translatedContent, opts));
}

function fileBaseFor(examMeta) {
  return (examMeta?.title || "English-Test").trim().replace(/\s+/g, "-").slice(0, 60);
}

/**
 * Đúng khuôn exportBothVersions() bản tiếng Việt: nếu có teacherRubric thì xuất ĐỒNG THỜI 2 file
 * (bản Học sinh sạch + bản Giáo viên có đáp án); nếu không có rubric (includeAnswers=false lúc
 * tạo đề) thì chỉ xuất 1 file câu hỏi.
 */
export async function exportEnglishExamToWord(examMeta, translatedContent) {
  const fileBase = fileBaseFor(examMeta);
  const hasRubric = translatedContent?.teacherRubric?.length > 0;

  await saveDocx(
    buildEnglishExamDocument(examMeta, translatedContent, { includeAnswers: false }),
    `${fileBase}-EN-Student.docx`
  );

  if (hasRubric) {
    await saveDocx(
      buildEnglishExamDocument(examMeta, translatedContent, { includeAnswers: true }),
      `${fileBase}-EN-Teacher.docx`
    );
  }
}

function buildHtmlBody(examMeta, translatedContent, { includeAnswers }) {
  let html = `<h1>${examMeta?.title || "ENGLISH TEST"}</h1>`;
  html += `<p class="doc-meta">${metaLines(examMeta).join("<br/>")}</p>`;
  if (examMeta?.objective) html += htmlParagraph(`Objective: ${examMeta.objective}`);
  html += htmlHeading(includeAnswers ? "Answer Key" : "Questions");

  (translatedContent?.questions || []).forEach((q, idx) => {
    html += `<p><strong>Question ${idx + 1}.</strong> ${(q.content || "").replace(/\n/g, "<br/>")}</p>`;
    if (Array.isArray(q.options) && q.options.length) {
      html += `<ul>${q.options.map((o) => `<li>${o}</li>`).join("")}</ul>`;
    }
    if (includeAnswers) {
      const rubric = translatedContent?.teacherRubric?.[idx];
      if (q.correctAnswer) html += htmlParagraph(`Correct answer: ${q.correctAnswer}`);
      if (rubric?.detailedSolution) html += htmlParagraph(`Solution: ${rubric.detailedSolution}`);
      if (rubric?.scoringGuide) html += htmlParagraph(`Scoring guide: ${rubric.scoringGuide}`);
    }
  });

  return html;
}

export function printEnglishExam(examMeta, translatedContent) {
  const includeAnswers = translatedContent?.teacherRubric?.length > 0;
  printHtmlDocument({
    title: examMeta?.title || "English Test",
    bodyHtml: buildHtmlBody(examMeta, translatedContent, { includeAnswers }),
  });
}
