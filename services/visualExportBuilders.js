import { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, VerticalAlign } from "docx";

/**
 * visualExportBuilders.js
 * Vẽ các dạng câu hỏi trực quan (đặt tính, tam giác, sơ đồ đoạn thẳng, hình đếm) trong file
 * Word bằng Table của docx.js (không có API vẽ hình tự do như SVG trên web, nên dùng Table
 * làm lưới/khung xấp xỉ trực quan - đủ rõ ràng để in và làm bài, dù không đẹp bằng bản web).
 */

const THIN_BORDER = { style: BorderStyle.SINGLE, size: 2, color: "999999" };
const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const NO_BORDERS_SET = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };

function cell({ text, width, bold = false, borderBottom = false, align = AlignmentType.CENTER, size = 26 }) {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    borders: borderBottom
      ? { ...NO_BORDERS_SET, bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" } }
      : NO_BORDERS_SET,
    children: [
      new Paragraph({
        alignment: align,
        children: [new TextRun({ text: String(text ?? ""), bold, size, font: "Times New Roman" })],
      }),
    ],
  });
}

/** "Đặt tính rồi tính" - lưới ô vuông thẳng cột, cột đầu dành cho dấu phép tính. */
export function buildVerticalArithmeticTable({ operandA, operandB, operator }) {
  const opSymbol = operator === "x" ? "×" : operator === ":" ? "÷" : operator;
  const strA = String(operandA);
  const strB = String(operandB);
  const width = Math.max(strA.length, strB.length) + 1;
  const rowA = strA.padStart(width, " ").split("");
  const rowB = strB.padStart(width, " ").split("");
  const colWidth = Math.floor(60 / (width + 1));

  const buildDigitRow = (digits, opCellText, withBorderBottom) => {
    const cells = [cell({ text: opCellText, width: colWidth, bold: true })];
    digits.forEach((d) => cells.push(cell({ text: d.trim(), width: colWidth, borderBottom: withBorderBottom })));
    return new TableRow({ children: cells });
  };

  return new Table({
    width: { size: 40, type: WidthType.PERCENTAGE },
    rows: [
      buildDigitRow(rowA, "", false),
      buildDigitRow(rowB, opSymbol, true),
      buildDigitRow(Array(width).fill(""), "", false),
    ],
  });
}

/** "Cây số / tam giác quan hệ" - xấp xỉ bằng bảng 2 hàng (đỉnh trên / 2 đỉnh dưới). */
export function buildNumberTriangleTable({ top, left, right, hidden }) {
  const displayTop = hidden === "top" ? "?" : top;
  const displayLeft = hidden === "left" ? "?" : left;
  const displayRight = hidden === "right" ? "?" : right;

  return new Table({
    width: { size: 30, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          cell({ text: "", width: 33 }),
          cell({ text: displayTop, width: 34, bold: true }),
          cell({ text: "", width: 33 }),
        ],
      }),
      new TableRow({
        children: [
          cell({ text: displayLeft, width: 33, bold: true }),
          cell({ text: "△", width: 34 }),
          cell({ text: displayRight, width: 33, bold: true }),
        ],
      }),
    ],
  });
}

/** "Sơ đồ đoạn thẳng" - xấp xỉ bằng 2 hàng Table có độ rộng tỉ lệ với giá trị. */
export function buildBarModelTable({ barA, barB, differenceValue, unit }) {
  const ratio = Math.max(35, Math.round((1 - differenceValue / barA.value) * 100));

  const barRow = (label, value, widthPercent, showQuestionMark) =>
    new TableRow({
      children: [
        new TableCell({
          width: { size: widthPercent, type: WidthType.PERCENTAGE },
          borders: {
            top: THIN_BORDER,
            bottom: THIN_BORDER,
            left: THIN_BORDER,
            right: THIN_BORDER,
          },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: showQuestionMark ? `${label}: ?` : `${label}: ${value} ${unit}`,
                  size: 24,
                  font: "Times New Roman",
                }),
              ],
            }),
          ],
        }),
        // Cell trống lấp đầy phần còn lại của dòng để độ rộng cột trên phản ánh đúng tỉ lệ
        ...(widthPercent < 100
          ? [
              new TableCell({
                width: { size: 100 - widthPercent, type: WidthType.PERCENTAGE },
                borders: NO_BORDERS_SET,
                children: [new Paragraph("")],
              }),
            ]
          : []),
      ],
    });

  return {
    table: new Table({
      width: { size: 90, type: WidthType.PERCENTAGE },
      rows: [barRow(barA.label, barA.value, 100, false), barRow(barB.label, null, ratio, true)],
    }),
    captionText: `Chênh lệch: ${differenceValue} ${unit}`,
  };
}

/** "Hình đếm trực quan" - các hàng ký tự Unicode (★/●/■) lặp lại theo đúng số lượng từng hàng. */
export function buildVisualCountingParagraphs({ rows, icon = "star" }) {
  const symbolMap = { star: "★", circle: "●", square: "■" };
  const symbol = symbolMap[icon] || symbolMap.star;

  return rows.map(
    (count) =>
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: Array(count).fill(symbol).join("   "),
            size: 32,
            font: "Times New Roman",
          }),
        ],
        spacing: { after: 60 },
      })
  );
}

/** Khung kẻ ô nháp - bảng trống nhiều dòng/cột để học sinh làm bài tính toán bằng tay. */
export function buildScratchGridTable(rowsCount = 4, colsCount = 20) {
  const colWidth = Math.floor(100 / colsCount);
  const rows = Array.from({ length: rowsCount }).map(
    () =>
      new TableRow({
        children: Array.from({ length: colsCount }).map(
          () =>
            new TableCell({
              width: { size: colWidth, type: WidthType.PERCENTAGE },
              borders: {
                top: THIN_BORDER,
                bottom: THIN_BORDER,
                left: THIN_BORDER,
                right: THIN_BORDER,
              },
              children: [new Paragraph("")],
              margins: { top: 20, bottom: 20 },
            })
        ),
      })
  );

  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows });
}
