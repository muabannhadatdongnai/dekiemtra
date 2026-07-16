import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import temml from "temml";
import { mml2omml } from "mathml2omml";
import { parseLatexSegments } from "./latexUtils";
import { computeExamMatrix, computeSpecificationRows } from "./specificationBuilder";
import {
  buildSectionTitleParagraph,
  buildMatrixTable,
  buildSpecificationTable,
} from "./specificationExportBuilders";
import {
  buildVerticalArithmeticTable,
  buildNumberTriangleTable,
  buildBarModelTable,
  buildVisualCountingParagraphs,
  buildScratchGridTable,
} from "./visualExportBuilders";

/**
 * exportService.js
 * - "Tạo 4 Mã Đề (A,B,C,D)": xáo trộn câu hỏi trắc nghiệm từ đề GỐC, KHÔNG gọi lại AI API
 *   -> tiết kiệm chi phí Gemini tối đa.
 * - Xuất Word (.docx): công thức Toán là Equation OOXML thật (không phải ảnh/text thô).
 *   Pipeline: LaTeX --(temml)--> MathML --(mathml2omml)--> OMML --(chèn thẳng vào
 *   word/document.xml bằng JSZip sau khi Packer dựng file)--> .docx hoàn chỉnh.
 * - Phần "Đáp án & Thang điểm (Rubric)" luôn ngắt sang trang mới ở cuối tài liệu.
 * - Xuất PDF: CSS @media print (window.print()), tận dụng KaTeX đã render sẵn trên preview.
 */

// =========================== ĐẢO MÃ ĐỀ (A/B/C/D) ===========================

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Xáo trộn 1 đề: đảo thứ tự câu hỏi trắc nghiệm + đảo thứ tự đáp án A/B/C/D, giữ đúng correctAnswer. */
function shuffleSingleExam(questions, { shuffleOptions = true } = {}) {
  return shuffleArray(questions).map((q) => {
    // Chỉ đảo đáp án cho câu trắc nghiệm; câu tự luận giữ nguyên nội dung
    if (!shuffleOptions || !q.options || q.options.length === 0) return q;

    const letters = ["A", "B", "C", "D"];
    const optionTexts = q.options.map((opt) => opt.replace(/^[A-D]\.\s*/, ""));
    const shuffledTexts = shuffleArray(optionTexts);
    const newOptions = shuffledTexts.map((text, i) => `${letters[i]}. ${text}`);

    // ⚠️ correctAnswer có thể KHÔNG tồn tại (khi tạo đề với tuỳ chọn "không tạo đáp án") -
    // vẫn đảo options bình thường, chỉ bỏ qua việc theo dõi đáp án đúng nếu không có.
    let newCorrectAnswer = q.correctAnswer;
    if (q.correctAnswer) {
      const correctIndex = letters.indexOf(q.correctAnswer);
      const correctText = optionTexts[correctIndex];
      newCorrectAnswer = letters[shuffledTexts.indexOf(correctText)];
    }

    return { ...q, options: newOptions, correctAnswer: newCorrectAnswer };
  });
}

/**
 * Tạo 4 mã đề A, B, C, D từ 1 đề gốc bằng cách xáo trộn Front-end (không gọi lại Gemini).
 * Trả về: [{ code: "A", examCode: "482A", questions: [...] }, ...]
 */
export function generateFourExamVariants(originalQuestions) {
  const baseCode = Math.floor(100 + Math.random() * 900);
  const labels = ["A", "B", "C", "D"];

  return labels.map((label) => ({
    code: label,
    examCode: `${baseCode}${label}`,
    questions: shuffleSingleExam(originalQuestions),
  }));
}

/** Giữ tương thích: đảo 1 mã đề đơn (dùng cho nút "Đảo mã đề" đơn giản nếu cần). */
export function shuffleExamCode(questions, options) {
  const shuffled = shuffleSingleExam(questions, options);
  const examCode = Math.floor(100 + Math.random() * 900);
  return { examCode, questions: shuffled };
}

// ===================== LATEX -> MATHML -> OMML PIPELINE =====================

let placeholderCounter = 0;
function nextPlaceholderId() {
  placeholderCounter += 1;
  return `MATHEQN${Date.now().toString(36)}${placeholderCounter}`;
}

/**
 * ⚠️ SỬA LỖI THƯ VIỆN mathml2omml: thư viện này giải mã ĐÚNG các entity MathML như &lt;/&gt;/&amp;
 * thành ký tự thật (<, >, &), nhưng lại QUÊN escape lại khi xuất ra chuỗi XML OMML - khiến bất kỳ
 * công thức nào chứa bất đẳng thức (<, >) hoặc dấu & đều tạo ra XML KHÔNG HỢP LỆ, làm hỏng toàn bộ
 * file .docx (Word báo lỗi không mở được file). Hàm này escape lại ĐÚNG các ký tự đặc biệt, nhưng
 * CHỈ trong phần nội dung text bên trong thẻ <m:t>...</m:t> - không đụng đến cấu trúc thẻ XML.
 */
function escapeMathTextNodes(ommlString) {
  // ⚠️ QUAN TRỌNG: "(?:\\s[^>]*)?" đảm bảo chỉ khớp ĐÚNG thẻ <m:t> (text node), KHÔNG khớp
  // nhầm các thẻ khác có tên bắt đầu bằng "m:t" như <m:type .../> (dấu phân số) - lỗi cũ khiến
  // <m:type m:val="bar"/> bị coi nhầm là thẻ mở <m:t...>, làm hỏng toàn bộ cấu trúc XML phía sau.
  return ommlString.replace(/(<m:t(?:\s[^>]*)?>)([\s\S]*?)(<\/m:t>)/g, (match, openTag, content, closeTag) => {
    const escaped = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return openTag + escaped + closeTag;
  });
}

function latexToOMML(latex, display) {
  try {
    const mathml = temml.renderToString(latex, { displayMode: display });
    const omml = escapeMathTextNodes(mml2omml(mathml));
    if (display) {
      return `<m:oMathPara><m:oMathParaPr><m:jc m:val="center"/></m:oMathParaPr>${omml}</m:oMathPara>`;
    }
    return omml;
  } catch (err) {
    console.warn("[exportService] Lỗi convert LaTeX -> OMML:", latex, err.message);
    return null;
  }
}

function buildRunsWithMathPlaceholders(text, { bold = false, italics = false, size = 26 } = {}) {
  const segments = parseLatexSegments(text);
  const runs = [];
  const equations = {};

  for (const seg of segments) {
    if (seg.type === "text") {
      if (seg.content === "") continue;
      runs.push(new TextRun({ text: seg.content, font: "Times New Roman", size, bold, italics }));
      continue;
    }

    const omml = latexToOMML(seg.content, seg.display);
    if (!omml) {
      runs.push(new TextRun({ text: `$${seg.content}$`, font: "Cambria Math", size: 26 }));
      continue;
    }

    const placeholderId = nextPlaceholderId();
    equations[placeholderId] = omml;
    runs.push(new TextRun({ text: placeholderId, font: "Times New Roman", size: 26 }));
  }

  return { runs, equations };
}

const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

/**
 * Xếp 4 đáp án A/B/C/D thành lưới 2x2 (A B / C D) bằng Table không viền, thay vì xếp
 * dọc từng dòng - tiết kiệm giấy đáng kể, đúng cách trình bày phổ biến của đề thi VN.
 */
function buildOptionsTable(options, equationsAcc) {
  const rows = [];
  for (let i = 0; i < options.length; i += 2) {
    const pair = options.slice(i, i + 2);
    const cells = pair.map((opt) => {
      const { runs, equations } = buildRunsWithMathPlaceholders(opt);
      Object.assign(equationsAcc, equations);
      return new TableCell({
        children: [new Paragraph({ children: runs })],
        width: { size: 50, type: WidthType.PERCENTAGE },
        borders: NO_BORDERS,
        margins: { top: 40, bottom: 40, left: 100, right: 100 },
      });
    });
    if (cells.length === 1) {
      cells.push(
        new TableCell({
          children: [new Paragraph("")],
          width: { size: 50, type: WidthType.PERCENTAGE },
          borders: NO_BORDERS,
        })
      );
    }
    rows.push(new TableRow({ children: cells }));
  }
  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows, borders: NO_BORDERS });
}

function buildQuestionParagraphs(question, index, equationsAcc) {
  const label = new TextRun({
    text: `Câu ${index + 1}: `,
    bold: true,
    font: "Times New Roman",
    size: 26,
  });

  const { runs: contentRuns, equations: contentEq } = buildRunsWithMathPlaceholders(question.content);
  Object.assign(equationsAcc, contentEq);

  const elements = [new Paragraph({ children: [label, ...contentRuns], spacing: { after: 100 } })];

  // ============ Câu hỏi trực quan (đặt tính, tam giác, sơ đồ, hình đếm) ============
  if (question.visualType && question.visualData) {
    switch (question.visualType) {
      case "vertical_arithmetic":
        elements.push(buildVerticalArithmeticTable(question.visualData));
        elements.push(new Paragraph({ text: "", spacing: { after: 80 } }));
        break;
      case "number_triangle":
        elements.push(buildNumberTriangleTable(question.visualData));
        elements.push(new Paragraph({ text: "", spacing: { after: 80 } }));
        break;
      case "bar_model": {
        const { table, captionText } = buildBarModelTable(question.visualData);
        elements.push(table);
        elements.push(
          new Paragraph({
            children: [new TextRun({ text: captionText, italics: true, size: 22, font: "Times New Roman" })],
            spacing: { before: 40, after: 80 },
          })
        );
        break;
      }
      case "visual_counting":
        elements.push(...buildVisualCountingParagraphs(question.visualData));
        break;
      default:
        break;
    }
  }

  if (question.options?.length) {
    elements.push(buildOptionsTable(question.options, equationsAcc));
    elements.push(new Paragraph({ text: "", spacing: { after: 100 } })); // đệm khoảng cách sau bảng
  }

  // ============ Khung kẻ ô nháp ============
  // ⚠️ KHÔNG chỉ dựa vào AI (needsScratchSpace) - tự động thêm cho MỌI câu tự luận, trừ khi
  // đã có sẵn chỗ tính toán riêng (vertical_arithmetic đã có hàng trống để đặt tính).
  const autoScratchForEssay =
    question.type === "tu_luan" && question.visualType !== "vertical_arithmetic";
  if (question.needsScratchSpace || autoScratchForEssay) {
    elements.push(buildScratchGridTable());
    elements.push(new Paragraph({ text: "", spacing: { after: 100 } }));
  }

  return elements;
}

function buildRubricParagraphs(teacherRubric, questions, equationsAcc) {
  const idToIndex = new Map(questions.map((q, i) => [q.id, i + 1]));

  const paragraphs = [
    new Paragraph({
      pageBreakBefore: true,
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "ĐÁP ÁN & LỜI GIẢI", bold: true, size: 28, font: "Times New Roman" }),
      ],
      spacing: { after: 200 },
    }),
  ];

  teacherRubric.forEach((r) => {
    const qNumber = idToIndex.get(r.questionId) ?? "?";

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Câu ${qNumber} - Đáp án: ${r.correctAnswer}`,
            bold: true,
            font: "Times New Roman",
            size: 26,
          }),
        ],
        spacing: { before: 120 },
      })
    );

    if (r.detailedSolution) {
      const { runs, equations } = buildRunsWithMathPlaceholders(r.detailedSolution);
      Object.assign(equationsAcc, equations);
      paragraphs.push(new Paragraph({ children: runs, spacing: { after: 40 } }));
    }

    if (r.scoringGuide) {
      const { runs, equations } = buildRunsWithMathPlaceholders(`Thang điểm: ${r.scoringGuide}`, {
        italics: true,
        size: 24,
      });
      Object.assign(equationsAcc, equations);
      paragraphs.push(new Paragraph({ children: runs, spacing: { after: 40 } }));
    }
  });

  return paragraphs;
}

/**
 * ⚠️ Nhận vào BLOB (không phải Buffer) - Packer.toBuffer() chỉ dành cho Node.js, còn code
 * này chạy phía browser (client-side export) nên PHẢI dùng Packer.toBlob(). Dùng nhầm
 * toBuffer() ở browser từng khiến file .docx tải về bị hỏng, Word không mở được.
 *
 * Blob được chuyển thành ArrayBuffer trước khi đưa vào JSZip để đảm bảo tương thích
 * tuyệt đối (JSZip nhận diện Blob không nhất quán giữa các môi trường/bundler khác nhau,
 * còn ArrayBuffer thì luôn được hỗ trợ).
 */
async function injectEquationsIntoDocx(docxBlob, equations) {
  const ids = Object.keys(equations);
  if (ids.length === 0) return docxBlob;

  const arrayBuffer = await docxBlob.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const docXmlPath = "word/document.xml";
  let xml = await zip.file(docXmlPath).async("string");

  for (const id of ids) {
    const runRegex = new RegExp(`<w:r>(?:(?!</w:r>)[\\s\\S])*?${id}[\\s\\S]*?</w:r>`);
    xml = xml.replace(runRegex, equations[id]);
  }

  zip.file(docXmlPath, xml);
  return zip.generateAsync({ type: "blob" });
}

/**
 * Dựng Blob .docx cho đề thi - hàm lõi dùng chung, KHÔNG tự tải file (không gọi saveAs).
 * @param includeRubricSection - true: kèm trang Đáp án & Lời giải ở cuối (bản giáo viên).
 *                                 false: bản sạch cho học sinh (dù có teacherRubric cũng bỏ qua).
 */
async function buildExamDocxBlob({
  title = "ĐỀ KIỂM TRA",
  schoolName = "",
  className = "",
  grade,
  subject = "Toán",
  examCode,
  duration = "45 phút",
  academicYear = "",
  questions,
  teacherRubric = [],
  chaptersInfo = [],
  typeByLevel = {},
  includeMatrixAndSpec = true,
  includeRubricSection = true,
}) {
  const equations = {};

  // ============ Giai đoạn 2: Ma trận đề thi + Bản đặc tả (mỗi văn bản 1 trang riêng, đứng TRƯỚC đề) ============
  const frontMatterElements = [];
  if (includeMatrixAndSpec && chaptersInfo.length > 0) {
    const matrix = computeExamMatrix(questions, chaptersInfo, typeByLevel);
    const specRows = computeSpecificationRows(questions, chaptersInfo, typeByLevel);

    if (matrix.rows.length > 0) {
      frontMatterElements.push(buildSectionTitleParagraph("MA TRẬN ĐỀ KIỂM TRA"));
      frontMatterElements.push(buildMatrixTable(matrix));
    }
    if (specRows.length > 0) {
      frontMatterElements.push(new Paragraph({ text: "", pageBreakBefore: true }));
      frontMatterElements.push(buildSectionTitleParagraph("BẢN ĐẶC TẢ ĐỀ KIỂM TRA"));
      frontMatterElements.push(buildSpecificationTable(specRows));
    }
  }
  const hasFrontMatter = frontMatterElements.length > 0;

  const headerParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      pageBreakBefore: hasFrontMatter, // ngắt sang trang riêng cho đề thi nếu có Ma trận/Đặc tả phía trước
      children: [new TextRun({ text: title, bold: true, size: 32, font: "Times New Roman" })],
    }),
    ...(schoolName
      ? [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `Trường: ${schoolName}`, bold: true, size: 24, font: "Times New Roman" }),
            ],
            spacing: { before: 60 },
          }),
        ]
      : []),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Năm học: ${academicYear || "................"}   |   Môn: ${subject} - Lớp ${grade}   |   Thời gian: ${duration}   |   Mã đề: ${examCode}`,
          italics: true,
          size: 24,
          font: "Times New Roman",
        }),
      ],
      spacing: { before: 100, after: 150 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Họ và tên: .............................................................   Lớp: ${className || "........"}`,
          font: "Times New Roman",
          size: 24,
        }),
      ],
      spacing: { after: 300 },
    }),
  ];

  const questionParagraphs = questions.flatMap((q, i) => buildQuestionParagraphs(q, i, equations));

  const sections = [
    { properties: {}, children: [...frontMatterElements, ...headerParagraphs, ...questionParagraphs] },
  ];

  if (includeRubricSection && teacherRubric?.length) {
    sections[0].children.push(...buildRubricParagraphs(teacherRubric, questions, equations));
  }

  const doc = new Document({ sections });

  // Bước 1: dựng file .docx "thô" với placeholder text cho mỗi công thức
  // ⚠️ PHẢI dùng toBlob() ở đây vì hàm này chạy trong browser - toBuffer() là API Node.js,
  // dùng nhầm sẽ tạo ra file .docx bị hỏng (tải về được nhưng Word không mở nổi).
  const rawBlob = await Packer.toBlob(doc);

  // Bước 2: hậu xử lý XML, thay placeholder bằng OMML thật (Equation có thể sửa trong Word)
  return injectEquationsIntoDocx(rawBlob, equations);
}

/**
 * Tạo và tải 1 file .docx duy nhất (hành vi cũ, giữ tương thích ngược) - kèm trang Đáp án &
 * Lời giải ở cuối nếu có teacherRubric.
 */
export async function exportToWord(params) {
  const blob = await buildExamDocxBlob({ ...params, includeRubricSection: true });
  saveAs(blob, `De-thi-${params.subject}-Lop${params.grade}-Ma${params.examCode}.docx`);
}

/**
 * ⚠️ GIAI ĐOẠN 3 - XUẤT TRỌN BỘ 1 LẦN: tải ĐỒNG THỜI 2 file từ CÙNG 1 dữ liệu đã tạo, không
 * gọi lại AI:
 *   - Bản học sinh: Ma trận + Đặc tả (tuỳ chọn) + Đề - SẠCH, không đáp án, không rubric.
 *   - Bản giáo viên: giống bản học sinh + kèm trang Đáp án & Lời giải ở cuối.
 * Chỉ tạo bản giáo viên nếu thực sự có teacherRubric (tức đã bật "Tạo đáp án" khi tạo đề).
 */
export async function exportBothVersions(params) {
  const fileBase = `De-thi-${params.subject}-Lop${params.grade}-Ma${params.examCode}`;
  const hasRubric = params.teacherRubric?.length > 0;

  const studentBlob = await buildExamDocxBlob({ ...params, includeRubricSection: false });
  saveAs(studentBlob, `${fileBase}-HocSinh.docx`);

  if (hasRubric) {
    const teacherBlob = await buildExamDocxBlob({ ...params, includeRubricSection: true });
    saveAs(teacherBlob, `${fileBase}-GiaoVien.docx`);
  }
}

/**
 * Xuất PDF: window.print() trên vùng #print-area (CSS @media print đã ngắt trang rubric,
 * đã render KaTeX sẵn trong A4LivePreview).
 */
export function exportToPDF() {
  window.print();
}
