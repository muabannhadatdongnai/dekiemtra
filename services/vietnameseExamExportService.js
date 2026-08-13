import { Document, Packer, Paragraph, TextRun, AlignmentType, convertMillimetersToTwip } from "docx";
import { saveAs } from "file-saver";
import { listBlocks, BLOCK_KEYS } from "@/data/vietnameseExamBlocks";
import { buildDocThamDocxParagraphs } from "./vietnameseBlocks/docThamExport";
import { buildDocThanhTiengDocxParagraphs } from "./vietnameseBlocks/docThanhTiengExport";
import { buildChinhTaDocxParagraphs } from "./vietnameseBlocks/chinhTaExport";
import { buildTapLamVanDocxParagraphs } from "./vietnameseBlocks/tapLamVanExport";
import { PAGE_A4_MM, PAGE_MARGIN_MM } from "@/data/constants";

/**
 * vietnameseExamExportService.js
 * "Người điều phối" xuất Word cho mode thứ 4 "📖 Đề Tiếng Việt Tiểu học" - đúng khuôn
 * vietnameseExamOrchestrator.js/VietnameseExamPreview.jsx: duyệt danh bạ theo đúng thứ tự, với
 * khối nào có dữ liệu thì gọi đúng builder riêng của khối đó (BLOCK_EXPORTERS), rồi nối các mảng
 * Paragraph lại. KHÔNG tự viết logic render nội dung khối ở đây.
 *
 * Dùng chung PAGE_A4_MM/PAGE_MARGIN_MM từ constants.js để khớp khổ giấy với exportService.js/
 * lessonPlanExportService.js/worksheetExportService.js (tránh bug khổ Letter mặc định đã từng gặp).
 */

const FONT = "Times New Roman";

const BLOCK_EXPORTERS = {
  [BLOCK_KEYS.DOC_THAM]: buildDocThamDocxParagraphs,
  [BLOCK_KEYS.DOC_THANH_TIENG]: buildDocThanhTiengDocxParagraphs,
  [BLOCK_KEYS.CHINH_TA]: buildChinhTaDocxParagraphs,
  [BLOCK_KEYS.TAP_LAM_VAN]: buildTapLamVanDocxParagraphs,
};

const VIETNAMESE_EXAM_PAGE_PROPERTIES = {
  page: {
    size: {
      width: convertMillimetersToTwip(PAGE_A4_MM.width),
      height: convertMillimetersToTwip(PAGE_A4_MM.height),
    },
    margin: {
      top: convertMillimetersToTwip(PAGE_MARGIN_MM.top),
      bottom: convertMillimetersToTwip(PAGE_MARGIN_MM.bottom),
      left: convertMillimetersToTwip(PAGE_MARGIN_MM.left),
      right: convertMillimetersToTwip(PAGE_MARGIN_MM.right),
    },
  },
};

export function buildVietnameseExamDocxSections({ results, meta }) {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "ĐỀ KIỂM TRA MÔN TIẾNG VIỆT", bold: true, size: 30, font: FONT }),
      ],
      spacing: { after: 60 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Lớp ${meta?.grade || ""}${meta?.examCode ? ` — Mã đề: ${meta.examCode}` : ""}`,
          italics: true,
          size: 22,
          font: FONT,
        }),
      ],
      spacing: { after: 200 },
    }),
  ];

  listBlocks().forEach((blockDef) => {
    const data = results?.[blockDef.key];
    const buildParagraphs = BLOCK_EXPORTERS[blockDef.key];
    if (!data || !buildParagraphs) return;
    children.push(...buildParagraphs(data));
  });

  return children;
}

export async function exportVietnameseExamToWord({ results, meta }) {
  const children = buildVietnameseExamDocxSections({ results, meta });
  const doc = new Document({ sections: [{ properties: VIETNAMESE_EXAM_PAGE_PROPERTIES, children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `De-Tieng-Viet-Lop${meta?.grade || ""}.docx`);
}
