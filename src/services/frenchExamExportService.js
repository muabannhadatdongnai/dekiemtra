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
import { computeExamMatrix } from "./specificationBuilder";
import { computeSpecificationRowsFr } from "./frenchSpecificationBuilder";
import {
  buildFrenchSectionTitleParagraph,
  buildFrenchMatrixTable,
  buildFrenchSpecificationTable,
} from "./frenchSpecificationExportBuilders";

/**
 * frenchExamExportService.js
 * Bản TIẾNG PHÁP của englishExamExportService.js - xuất Word/PDF cho "Đề Kiểm tra" môn Tiếng Pháp
 * (Ngoại ngữ 2). Nhận THẲNG `content` ({ questions, teacherRubric }) đã được AI sinh trực tiếp
 * bằng tiếng Pháp. Các bản ngôn ngữ khác giữ NGUYÊN VẸN.
 *
 * Tiếng Pháp dùng bảng chữ Latinh - dùng THẲNG helper mặc định (Times New Roman đủ dùng).
 */

function metaLines(meta) {
  const lines = [];
  if (meta?.schoolName) lines.push(meta.schoolName);
  const line2 = [];
  if (meta?.subjectLabelEn) line2.push(`Matière : ${meta.subjectLabelEn}`);
  if (meta?.grade != null && meta.grade !== "") line2.push(`Niveau : ${meta.grade}`);
  if (meta?.className) line2.push(`Classe : ${meta.className}`);
  if (line2.length) lines.push(line2.join("   |   "));
  const line3 = [];
  if (meta?.duration) line3.push(`Durée : ${meta.duration} minutes`);
  if (meta?.academicYear) line3.push(`Année scolaire : ${meta.academicYear}`);
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
      if (q.correctAnswer) children.push(paragraph(`Réponse correcte : ${q.correctAnswer}`, { run: { bold: true } }));
      if (rubric?.detailedSolution) children.push(paragraph(`Solution : ${rubric.detailedSolution}`));
      if (rubric?.scoringGuide) children.push(paragraph(`Barème : ${rubric.scoringGuide}`));
    } else {
      children.push(new Paragraph({ text: "", spacing: { after: 120 } }));
    }
  });
  return children;
}

function buildFrontMatterElements({ questions, chaptersInfo, typeByLevel, includeMatrixAndSpec }) {
  const elements = [];
  if (!includeMatrixAndSpec || !chaptersInfo?.length) return elements;

  const matrix = computeExamMatrix(questions, chaptersInfo, typeByLevel);
  const specRows = computeSpecificationRowsFr(questions, chaptersInfo, typeByLevel);

  if (matrix.rows.length > 0) {
    elements.push(buildFrenchSectionTitleParagraph("GRILLE D'ÉVALUATION (MATRICE)"));
    elements.push(buildFrenchMatrixTable(matrix));
  }
  if (specRows.length > 0) {
    elements.push(new Paragraph({ text: "", pageBreakBefore: true }));
    elements.push(buildFrenchSectionTitleParagraph("SPÉCIFICATION DE L'ÉPREUVE"));
    elements.push(buildFrenchSpecificationTable(specRows));
  }
  return elements;
}

function buildDocxSections(examMeta, translatedContent, { includeAnswers, chaptersInfo, typeByLevel, includeMatrixAndSpec }) {
  const frontMatterElements = buildFrontMatterElements({
    questions: translatedContent?.questions,
    chaptersInfo,
    typeByLevel,
    includeMatrixAndSpec,
  });
  const hasFrontMatter = frontMatterElements.length > 0;

  const children = [
    ...frontMatterElements,
    new Paragraph({
      alignment: AlignmentType.CENTER,
      pageBreakBefore: hasFrontMatter,
      children: [textRun(examMeta?.title || "ÉVALUATION DE FRANÇAIS", { bold: true, size: 30 })],
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
    children.push(paragraph(`Objectif : ${examMeta.objective}`, { run: { italics: true } }));
  }

  children.push(heading(includeAnswers ? "CORRIGÉ" : "QUESTIONS"));
  children.push(
    ...buildQuestionParagraphs({
      questions: translatedContent?.questions,
      teacherRubric: translatedContent?.teacherRubric,
      includeAnswers,
    })
  );

  return children;
}

export function buildFrenchExamDocument(examMeta, translatedContent, { includeAnswers = false, ...rest } = {}) {
  return new Document({
    sections: [
      { properties: pageProperties, children: buildDocxSections(examMeta, translatedContent, { includeAnswers, ...rest }) },
    ],
  });
}

export async function buildFrenchExamDocxBlob(examMeta, translatedContent, opts) {
  return buildDocxBlob(buildFrenchExamDocument(examMeta, translatedContent, opts));
}

function fileBaseFor(examMeta) {
  return (examMeta?.title || "French-Test").trim().replace(/\s+/g, "-").slice(0, 60);
}

export async function exportFrenchExamToWord(
  examMeta,
  translatedContent,
  { chaptersInfo = [], typeByLevel = {}, includeMatrixAndSpec = true } = {}
) {
  const fileBase = fileBaseFor(examMeta);
  const hasRubric = translatedContent?.teacherRubric?.length > 0;

  await saveDocx(
    buildFrenchExamDocument(examMeta, translatedContent, {
      includeAnswers: false,
      chaptersInfo,
      typeByLevel,
      includeMatrixAndSpec: includeMatrixAndSpec && !hasRubric,
    }),
    `${fileBase}-FR-Student.docx`
  );

  if (hasRubric) {
    await saveDocx(
      buildFrenchExamDocument(examMeta, translatedContent, {
        includeAnswers: true,
        chaptersInfo,
        typeByLevel,
        includeMatrixAndSpec,
      }),
      `${fileBase}-FR-Teacher.docx`
    );
  }
}

function buildHtmlFrontMatter({ questions, chaptersInfo, typeByLevel, includeMatrixAndSpec }) {
  if (!includeMatrixAndSpec || !chaptersInfo?.length) return "";
  const matrix = computeExamMatrix(questions, chaptersInfo, typeByLevel);
  const specRows = computeSpecificationRowsFr(questions, chaptersInfo, typeByLevel);
  let html = "";
  if (matrix.rows.length > 0) {
    html += htmlHeading("Grille d'évaluation (matrice)");
    html += `<table><thead><tr><th>Chapitre/Thème</th>${matrix.levelKeys
      .map((lvl) => `<th>${lvl}</th>`)
      .join("")}<th>Total</th><th>Points</th></tr></thead><tbody>`;
    html += matrix.rows
      .map(
        (r) =>
          `<tr><td>${r.label}</td>${matrix.levelKeys
            .map((lvl) => `<td>${r.counts[lvl] || ""}</td>`)
            .join("")}<td>${r.rowCount}</td><td>${r.rowPoints}</td></tr>`
      )
      .join("");
    html += `</tbody></table>`;
  }
  if (specRows.length > 0) {
    html += htmlHeading("Spécification de l'épreuve");
    html += `<table><thead><tr><th>N°</th><th>Chapitre/Thème</th><th>Niveau</th><th>Type</th><th>Objectif d'apprentissage</th><th>Nombre</th><th>N° de question</th></tr></thead><tbody>`;
    html += specRows
      .map(
        (row) =>
          `<tr><td>${row.stt}</td><td>${row.chapterLabel}</td><td>${row.levelLabel}</td><td>${row.typeLabel}</td><td>${row.requirement}</td><td>${row.count}</td><td>${row.questionNumbers}</td></tr>`
      )
      .join("");
    html += `</tbody></table>`;
  }
  return html;
}

function buildHtmlBody(examMeta, translatedContent, { includeAnswers, chaptersInfo, typeByLevel, includeMatrixAndSpec }) {
  let html = buildHtmlFrontMatter({
    questions: translatedContent?.questions,
    chaptersInfo,
    typeByLevel,
    includeMatrixAndSpec,
  });
  html += `<h1>${examMeta?.title || "ÉVALUATION DE FRANÇAIS"}</h1>`;
  html += `<p class="doc-meta">${metaLines(examMeta).join("<br/>")}</p>`;
  if (examMeta?.objective) html += htmlParagraph(`Objectif : ${examMeta.objective}`);
  html += htmlHeading(includeAnswers ? "Corrigé" : "Questions");

  (translatedContent?.questions || []).forEach((q, idx) => {
    html += `<p><strong>Question ${idx + 1}.</strong> ${(q.content || "").replace(/\n/g, "<br/>")}</p>`;
    if (Array.isArray(q.options) && q.options.length) {
      html += `<ul>${q.options.map((o) => `<li>${o}</li>`).join("")}</ul>`;
    }
    if (includeAnswers) {
      const rubric = translatedContent?.teacherRubric?.[idx];
      if (q.correctAnswer) html += htmlParagraph(`Réponse correcte : ${q.correctAnswer}`);
      if (rubric?.detailedSolution) html += htmlParagraph(`Solution : ${rubric.detailedSolution}`);
      if (rubric?.scoringGuide) html += htmlParagraph(`Barème : ${rubric.scoringGuide}`);
    }
  });

  return html;
}

export function printFrenchExam(
  examMeta,
  translatedContent,
  { chaptersInfo = [], typeByLevel = {}, includeMatrixAndSpec = true } = {}
) {
  const includeAnswers = translatedContent?.teacherRubric?.length > 0;
  printHtmlDocument({
    title: examMeta?.title || "Évaluation de français",
    bodyHtml: buildHtmlBody(examMeta, translatedContent, {
      includeAnswers,
      chaptersInfo,
      typeByLevel,
      includeMatrixAndSpec,
    }),
  });
}
