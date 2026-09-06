import { Document, Paragraph, AlignmentType } from "docx";
import {
  pageProperties,
  saveDocx,
  buildDocxBlob,
  printHtmlDocument,
  htmlHeading,
  htmlParagraph,
  createLanguageHelpers,
} from "./foreignLanguageDocBuilder";
import { computeExamMatrix } from "./specificationBuilder";
import { computeSpecificationRowsJa } from "./japaneseSpecificationBuilder";
import {
  buildJapaneseSectionTitleParagraph,
  buildJapaneseMatrixTable,
  buildJapaneseSpecificationTable,
} from "./japaneseSpecificationExportBuilders";

/**
 * japaneseExamExportService.js
 * Bản TIẾNG NHẬT của englishExamExportService.js/chineseExamExportService.js - xuất Word/PDF cho
 * "Đề Kiểm tra" môn Tiếng Nhật (Ngoại ngữ 2). Nhận THẲNG `content` ({ questions, teacherRubric })
 * đã được AI sinh trực tiếp bằng tiếng Nhật. Các bản ngôn ngữ khác giữ NGUYÊN VẸN.
 *
 * ⚠️ FONT: dùng createLanguageHelpers() với `eastAsia: "MS Mincho"`.
 */

const FONT_JA = { ascii: "Times New Roman", hAnsi: "Times New Roman", cs: "Times New Roman", eastAsia: "MS Mincho" };
const PRINT_FONT_FAMILY_JA = '"MS Mincho", "Yu Mincho", "Hiragino Mincho ProN", "Times New Roman", serif';

const { textRun, paragraph, heading } = createLanguageHelpers(FONT_JA);

function metaLines(meta) {
  const lines = [];
  if (meta?.schoolName) lines.push(meta.schoolName);
  const line2 = [];
  if (meta?.subjectLabelEn) line2.push(`教科：${meta.subjectLabelEn}`);
  if (meta?.grade != null && meta.grade !== "") line2.push(`学年：${meta.grade}`);
  if (meta?.className) line2.push(`クラス：${meta.className}`);
  if (line2.length) lines.push(line2.join("   |   "));
  const line3 = [];
  if (meta?.duration) line3.push(`時間：${meta.duration}分`);
  if (meta?.academicYear) line3.push(`年度：${meta.academicYear}`);
  if (line3.length) lines.push(line3.join("   |   "));
  return lines;
}

function buildQuestionParagraphs({ questions, teacherRubric, includeAnswers }) {
  const children = [];
  (questions || []).forEach((q, idx) => {
    children.push(paragraph(`問${idx + 1}。${q.content || ""}`, { run: { bold: true } }));
    if (Array.isArray(q.options) && q.options.length) {
      children.push(...q.options.map((opt) => paragraph(opt)));
    }
    if (includeAnswers) {
      const rubric = teacherRubric?.[idx];
      if (q.correctAnswer) children.push(paragraph(`正解：${q.correctAnswer}`, { run: { bold: true } }));
      if (rubric?.detailedSolution) children.push(paragraph(`解説：${rubric.detailedSolution}`));
      if (rubric?.scoringGuide) children.push(paragraph(`採点基準：${rubric.scoringGuide}`));
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
  const specRows = computeSpecificationRowsJa(questions, chaptersInfo, typeByLevel);

  if (matrix.rows.length > 0) {
    elements.push(buildJapaneseSectionTitleParagraph("出題範囲表（マトリクス）"));
    elements.push(buildJapaneseMatrixTable(matrix));
  }
  if (specRows.length > 0) {
    elements.push(new Paragraph({ text: "", pageBreakBefore: true }));
    elements.push(buildJapaneseSectionTitleParagraph("出題仕様書"));
    elements.push(buildJapaneseSpecificationTable(specRows));
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
      children: [textRun(examMeta?.title || "日本語テスト", { bold: true, size: 30 })],
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
    children.push(paragraph(`目標：${examMeta.objective}`, { run: { italics: true } }));
  }

  children.push(heading(includeAnswers ? "解答" : "問題"));
  children.push(
    ...buildQuestionParagraphs({
      questions: translatedContent?.questions,
      teacherRubric: translatedContent?.teacherRubric,
      includeAnswers,
    })
  );

  return children;
}

export function buildJapaneseExamDocument(examMeta, translatedContent, { includeAnswers = false, ...rest } = {}) {
  return new Document({
    sections: [
      { properties: pageProperties, children: buildDocxSections(examMeta, translatedContent, { includeAnswers, ...rest }) },
    ],
  });
}

export async function buildJapaneseExamDocxBlob(examMeta, translatedContent, opts) {
  return buildDocxBlob(buildJapaneseExamDocument(examMeta, translatedContent, opts));
}

function fileBaseFor(examMeta) {
  return (examMeta?.title || "Japanese-Test").trim().replace(/\s+/g, "-").slice(0, 60);
}

export async function exportJapaneseExamToWord(
  examMeta,
  translatedContent,
  { chaptersInfo = [], typeByLevel = {}, includeMatrixAndSpec = true } = {}
) {
  const fileBase = fileBaseFor(examMeta);
  const hasRubric = translatedContent?.teacherRubric?.length > 0;

  await saveDocx(
    buildJapaneseExamDocument(examMeta, translatedContent, {
      includeAnswers: false,
      chaptersInfo,
      typeByLevel,
      includeMatrixAndSpec: includeMatrixAndSpec && !hasRubric,
    }),
    `${fileBase}-JA-Student.docx`
  );

  if (hasRubric) {
    await saveDocx(
      buildJapaneseExamDocument(examMeta, translatedContent, {
        includeAnswers: true,
        chaptersInfo,
        typeByLevel,
        includeMatrixAndSpec,
      }),
      `${fileBase}-JA-Teacher.docx`
    );
  }
}

function buildHtmlFrontMatter({ questions, chaptersInfo, typeByLevel, includeMatrixAndSpec }) {
  if (!includeMatrixAndSpec || !chaptersInfo?.length) return "";
  const matrix = computeExamMatrix(questions, chaptersInfo, typeByLevel);
  const specRows = computeSpecificationRowsJa(questions, chaptersInfo, typeByLevel);
  let html = "";
  if (matrix.rows.length > 0) {
    html += htmlHeading("出題範囲表（マトリクス）");
    html += `<table><thead><tr><th>単元/テーマ</th>${matrix.levelKeys
      .map((lvl) => `<th>${lvl}</th>`)
      .join("")}<th>合計</th><th>配点</th></tr></thead><tbody>`;
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
    html += htmlHeading("出題仕様書");
    html += `<table><thead><tr><th>番号</th><th>単元/テーマ</th><th>難易度</th><th>形式</th><th>学習到達目標</th><th>問題数</th><th>問題番号</th></tr></thead><tbody>`;
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
  html += `<h1>${examMeta?.title || "日本語テスト"}</h1>`;
  html += `<p class="doc-meta">${metaLines(examMeta).join("<br/>")}</p>`;
  if (examMeta?.objective) html += htmlParagraph(`目標：${examMeta.objective}`);
  html += htmlHeading(includeAnswers ? "解答" : "問題");

  (translatedContent?.questions || []).forEach((q, idx) => {
    html += `<p><strong>問${idx + 1}。</strong>${(q.content || "").replace(/\n/g, "<br/>")}</p>`;
    if (Array.isArray(q.options) && q.options.length) {
      html += `<ul>${q.options.map((o) => `<li>${o}</li>`).join("")}</ul>`;
    }
    if (includeAnswers) {
      const rubric = translatedContent?.teacherRubric?.[idx];
      if (q.correctAnswer) html += htmlParagraph(`正解：${q.correctAnswer}`);
      if (rubric?.detailedSolution) html += htmlParagraph(`解説：${rubric.detailedSolution}`);
      if (rubric?.scoringGuide) html += htmlParagraph(`採点基準：${rubric.scoringGuide}`);
    }
  });

  return html;
}

export function printJapaneseExam(
  examMeta,
  translatedContent,
  { chaptersInfo = [], typeByLevel = {}, includeMatrixAndSpec = true } = {}
) {
  const includeAnswers = translatedContent?.teacherRubric?.length > 0;
  printHtmlDocument({
    title: examMeta?.title || "日本語テスト",
    bodyHtml: buildHtmlBody(examMeta, translatedContent, {
      includeAnswers,
      chaptersInfo,
      typeByLevel,
      includeMatrixAndSpec,
    }),
    fontFamily: PRINT_FONT_FAMILY_JA,
  });
}
