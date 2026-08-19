import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  ShadingType,
  TabStopType,
  ImageRun,
  convertMillimetersToTwip,
} from "docx";
import { saveAs } from "file-saver";
import { getSectionVisualTheme, getDefaultLayout } from "@/data/worksheetLayoutTemplates";
import { PAGE_A4_MM, PAGE_MARGIN_MM } from "@/data/constants";
// MỞ RỘNG LỚP 3, ĐỢT 2: nhãn 3 mức "Chắc chắn/Có thể/Không thể" dùng chung với generator/preview
// (worksheetSchemas.js) - tránh khai lại danh sách nhãn 3 nơi có thể lệch nhau.
import { PROBABILITY_LEVEL_LABELS } from "@/data/worksheetSchemas";
// MỞ RỘNG LỚP 3, ĐỢT 3: format số kiểu Việt Nam DÙNG CHUNG với WorksheetPreview.jsx (web) - xem
// numberFormatUtils.js.
import { formatSoTuNhien, formatSoTrongChuoi } from "./numberFormatUtils";

/**
 * worksheetExportService.js
 * Xuất Word (.docx) cho "Phiếu bài tập" (Mầm non - Lớp 2).
 *
 * Khác với exportService.js (đề kiểm tra):
 * - KHÔNG cần pipeline LaTeX -> MathML -> OMML: phiếu bài tập chỉ có số nguyên đơn giản,
 *   không có công thức Toán phức tạp cần Equation OOXML.
 * - Word KHÔNG hỗ trợ border-radius (bo góc) như CSS trong WorksheetPreview.jsx, nên mỗi
 *   "khung màu" được mô phỏng bằng NHIỀU Paragraph liên tiếp CÙNG chung {shading, border}
 *   (không dùng Table lồng Table) - Word tự động gộp các paragraph liền kề có border giống
 *   hệt nhau thành 1 khung liền mạch. Cách này an toàn hơn nest Table: nest Table trong docx
 *   dễ bị nền trắng của bảng con đè lên màu nền của bảng cha, đúng loại lỗi mà dự án đã từng
 *   gặp phải với các thành phần Word khác (xem mục 5 PROJECT_SUMMARY.md).
 * - Chỉ paragraph ĐẦU của khung mới có border-top, chỉ paragraph CUỐI mới có border-bottom -
 *   nếu để border-bottom/top ở tất cả sẽ tạo ra các đường kẻ ngang thừa giữa các dòng.
 *
 * ================== GIAI ĐOẠN 1 (chống lặp khuôn) ==================
 * Màu + mascot của từng khối giờ lấy từ getSectionVisualTheme() trong worksheetLayoutTemplates.js
 * - NGUỒN DUY NHẤT dùng chung với WorksheetPreview.jsx (bản xem trước web). Không còn định
 *   nghĩa BOX_THEMES riêng ở đây nữa nên KHÔNG còn rủi ro "sửa 1 nơi quên nơi kia" như trước.
 * - Word không hỗ trợ layout nhiều cột đáng tin cậy cho các khung có border/shading phức tạp
 *   (dễ vỡ khung khi Word tự ngắt cột giữa chừng 1 khối), nên bản Word CHỦ Ý giữ 1 cột dọc dù
 *   bản web có thể hiển thị 2 cột - đổi lại, kiểu viền khung (border style) vẫn biến hoá theo
 *   layout.frameStyle để bản in ra giấy cũng không bị rập khuôn.
 */

/**
 * ================== GIAI ĐOẠN 9, PHÁT HIỆN MỚI (sửa lỗi "layout xô lệch" ở mục Nối) ==================
 * Trước đây dùng `TabStopPosition.MAX` (hằng số CỨNG 9026 twip ~ 15.93cm của docx.js, tính theo
 * khổ giấy/lề MẶC ĐỊNH của thư viện) để đẩy cột đáp án "Nối phép tính"/"Nối từ" sát lề phải.
 * Nhưng khổ giấy + lề THẬT của phiếu là A4 (210mm) với lề trái/phải 18mm (PAGE_A4_MM/
 * PAGE_MARGIN_MM ở trên) -> vùng chữ thật rộng ~174mm (~9853 twip), RỘNG HƠN 9026 twip khoảng
 * 8mm -> cột đáp án bên phải bị dừng SỚM, lơ lửng cách viền khung phải ~8mm thay vì áp sát như
 * bản web (dùng CSS flex `justify-content: space-between` đẩy đúng sát mép) - đúng loại lỗi
 * "xô lệch" giáo viên phản ánh (chỉ lộ ra ở BẢN HỌC SINH - showAnswers=false - vì bản giáo viên
 * không dùng tab-stop, in thẳng "biểu thức = kết quả" trên 1 dòng). Sửa: tự tính đúng vị trí tab
 * dừng phải theo CHÍNH khổ giấy/lề đang dùng, không phụ thuộc hằng số mặc định của thư viện.
 */
const CONTENT_WIDTH_TWIP = convertMillimetersToTwip(
  PAGE_A4_MM.width - PAGE_MARGIN_MM.left - PAGE_MARGIN_MM.right
);

const FRAME_BORDER_STYLE = {
  dotted_border_thick_card: BorderStyle.SINGLE,
  soft_rounded_border: BorderStyle.SINGLE,
  notebook_lines: BorderStyle.DASHED,
  adventure_border: BorderStyle.DASHED,
};

function getTheme(layout, section, index) {
  const t = getSectionVisualTheme(layout, section, index);
  // docx cần mã hex KHÔNG có dấu "#"
  return {
    border: t.border.replace("#", ""),
    badge: t.badge.replace("#", ""),
    title: t.title.replace("#", ""),
    bg: t.bg.replace("#", ""),
    mascot: t.mascot,
  };
}

const CIRCLED_DIGITS = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

const FONT = "Times New Roman";
const BLANK = "................";      // chỗ trống cho học sinh điền số
const BLANK_CIRCLE = "○";              // chỗ trống cho học sinh điền dấu >, <, =
const WRITING_LINE = "..............................................................";

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// =========================== NỘI DUNG TỪNG DẠNG BÀI (trả về mảng "Paragraph options") ===========================

// MỞ RỘNG LỚP 3, ĐỢT 3: 3 -> 2 mỗi hàng (khớp đổi 3 cột -> 2 cột bên WorksheetPreview.jsx) - số
// tròn nghìn/chục nghìn của Lớp 3 dài hơn hẳn, 3 cụm/hàng dễ bị dồn/tràn dòng khi in.
function buildTinhNhamParagraphs(items, showAnswers) {
  return chunkArray(items, 2).map((row) => ({
    children: row.flatMap((it, idx) => {
      const text = `${formatSoTuNhien(it.operandA)} ${it.operator} ${formatSoTuNhien(it.operandB)} = ${
        showAnswers ? formatSoTuNhien(it.answer) : BLANK
      }`;
      const run = new TextRun({ text, font: FONT, size: 24 });
      return idx < row.length - 1 ? [run, new TextRun({ text: "      ", font: FONT, size: 24 })] : [run];
    }),
    spacing: { after: 100 },
  }));
}

function buildDemVaVietSoParagraphs(items, showAnswers) {
  return items.map((it) => ({
    children: [
      new TextRun({ text: Array(it.count).fill(it.icon).join("  ") + "   ", size: 26 }),
      new TextRun({ text: `→  Số: ${showAnswers ? it.answer : BLANK}`, font: FONT, size: 24 }),
    ],
    spacing: { after: 120 },
  }));
}

function buildSoSanhParagraphs(items, showAnswers) {
  return chunkArray(items, 2).map((row) => ({
    children: row.flatMap((it, idx) => {
      const text = `${formatSoTrongChuoi(it.left)}   ${showAnswers ? it.answer : BLANK_CIRCLE}   ${formatSoTrongChuoi(
        it.right
      )}`;
      const run = new TextRun({ text, font: FONT, size: 24 });
      return idx < row.length - 1 ? [run, new TextRun({ text: "      ", font: FONT, size: 24 })] : [run];
    }),
    spacing: { after: 100 },
  }));
}

function buildDaySoParagraphs(items, showAnswers) {
  return items.map((it) => ({
    children: [
      new TextRun({
        text: it.sequence
          .map((n) => (n === null ? (showAnswers ? formatSoTuNhien(it.answer) : BLANK) : formatSoTuNhien(n)))
          .join(",   "),
        font: FONT,
        size: 24,
      }),
    ],
    spacing: { after: 120 },
  }));
}

// GIAI ĐOẠN F: "Tách - Gộp" (number bond) - Word không hỗ trợ vẽ sơ đồ 2 nhánh chéo dễ dàng như
// SVG bên WorksheetPreview.jsx, nên biểu diễn dưới dạng phép cộng ngang "phần 1 + phần 2 = tổng"
// (đúng NGHĨA của sơ đồ tách-gộp, chỉ khác cách trình bày trực quan) - theo ĐÚNG tinh thần
// BLANK/BLANK_CIRCLE đã dùng cho các dạng bài khác trong file này (text-based, không phải hình vẽ).
function buildTachGopParagraphs(items, showAnswers) {
  return items.map((it) => {
    const w = showAnswers || it.hideSlot !== "whole" ? it.whole : BLANK;
    const p1 = showAnswers || it.hideSlot !== "part1" ? it.part1 : BLANK;
    const p2 = showAnswers || it.hideSlot !== "part2" ? it.part2 : BLANK;
    return {
      children: [new TextRun({ text: `${p1}   +   ${p2}   =   ${w}`, font: FONT, size: 24 })],
      spacing: { after: 140 },
    };
  });
}

/**
 * ================== GIAI ĐOẠN 2 (đa dạng hoá dạng hoạt động) ==================
 * Sắp xếp thứ tự: in 3 số xáo trộn -> mũi tên -> kết quả (đã sắp xếp nếu showAnswers, ngược
 * lại chỗ trống ngăn cách bởi dấu < hoặc > tương ứng chiều sắp xếp của bộ đó).
 *
 * ================== GIAI ĐOẠN 9, BƯỚC 2 (tái dùng cho chủ đề "Độ dài", Lớp 1) ==================
 * `it.unit` ("cm") nếu có sẽ in kèm ngay sau mỗi số - khớp đúng hành vi SapXepThuTuSection bên
 * WorksheetPreview.jsx (web). Dữ liệu CŨ không có `unit` -> giữ nguyên hành vi cũ, không đổi.
 */
function buildSapXepThuTuParagraphs(items, showAnswers) {
  return items.map((it) => {
    const symbol = it.direction === "asc" ? " < " : " > ";
    const unitSuffix = it.unit ? ` ${it.unit}` : "";
    const numbersText = it.numbers.map((n) => `${formatSoTuNhien(n)}${unitSuffix}`).join(" ;  ");
    const resultText = showAnswers
      ? it.sortedAnswer.map((n) => formatSoTuNhien(n)).join(symbol)
      : it.sortedAnswer.map(() => BLANK).join(symbol);
    return {
      children: [new TextRun({ text: `${numbersText}   ➜   ${resultText}`, font: FONT, size: 24 })],
      spacing: { after: 120 },
    };
  });
}

/**
 * ================== GIAI ĐOẠN 9, BƯỚC 2 (chủ đề "Độ dài", Lớp 1) ==================
 * Word không vẽ được thanh màu tỉ lệ như bản web (ClockFace/DoDaiSoSanhSection dùng SVG) - giữ
 * đúng tinh thần bài tập bằng văn bản thuần: liệt kê rõ tên + số đo mỗi băng giấy, sau đó đến
 * chỗ trống/dấu so sánh đúng.
 */
function buildDoDaiSoSanhParagraphs(items, showAnswers) {
  return items.map((it) => ({
    children: [
      new TextRun({
        text: `${it.nameA}: ${it.cmA} cm   ${showAnswers ? it.answer : BLANK_CIRCLE}   ${it.nameB}: ${it.cmB} cm`,
        font: FONT,
        size: 24,
      }),
    ],
    spacing: { after: 120 },
  }));
}

/**
 * ================== GIAI ĐOẠN 9, BƯỚC 2 (chủ đề "Thời gian", Lớp 1) ==================
 * Word không vẽ được SVG mặt đồng hồ có kim - dùng ĐÚNG emoji Unicode "đồng hồ chỉ giờ" (mỗi
 * emoji ứng với ĐÚNG 1 giờ tròn, sẵn có trong bảng mã Unicode 🕐-🕛) thay vì tự vẽ - vừa đơn
 * giản vừa chính xác 100% (không có sai số vẽ tay như hình).
 */
const CLOCK_EMOJI_BY_HOUR = {
  1: "🕐", 2: "🕑", 3: "🕒", 4: "🕓", 5: "🕔", 6: "🕕",
  7: "🕖", 8: "🕗", 9: "🕘", 10: "🕙", 11: "🕚", 12: "🕛",
};

function buildXemDongHoGioDungParagraphs(items, showAnswers) {
  return chunkArray(items, 4).map((row) => ({
    children: row.flatMap((it, idx) => {
      const text = `${CLOCK_EMOJI_BY_HOUR[it.hour] || "🕐"}  ${showAnswers ? `${it.hour} giờ` : `${BLANK} giờ`}`;
      const run = new TextRun({ text, font: FONT, size: 30 });
      return idx < row.length - 1 ? [run, new TextRun({ text: "      ", font: FONT, size: 24 })] : [run];
    }),
    spacing: { after: 140 },
  }));
}

/**
 * ================== MỞ RỘNG LỚP 3, ĐỢT 2 ==================
 * "Xem đồng hồ (giờ, phút)" - KHÔNG dùng emoji đồng hồ (chỉ hỗ trợ giờ tròn/giờ rưỡi trong bảng
 * mã Unicode, không đủ độ chi tiết cho phút bội số 5 tuỳ ý) - dùng text thuần "Đồng hồ chỉ: ..."
 * Bản xem trước web (WorksheetPreview.jsx) VẪN vẽ mặt đồng hồ chính xác bằng SVG (dùng cho "Tải
 * PDF" qua window.print()) - Word chỉ là bản tải xuống PHỤ, chấp nhận giảm độ trực quan ở đây.
 */
function buildXemDongHoGioPhutParagraphs(items, showAnswers) {
  return items.map((it, i) => ({
    children: [
      new TextRun({
        text: `${i + 1}. Đồng hồ chỉ: ${showAnswers ? `${it.hour} giờ ${it.minute} phút` : `${BLANK} giờ ${BLANK} phút`}`,
        font: FONT,
        size: 24,
      }),
    ],
    spacing: { after: 120 },
  }));
}

/** "Chu vi, diện tích hình chữ nhật - hình vuông" - đoạn văn tả hình + câu hỏi + chỗ trống. */
function buildChuViDienTichParagraphs(items, showAnswers) {
  return items.map((it, i) => {
    const desc =
      it.shape === "vuong"
        ? `Hình vuông có cạnh ${it.side} ${it.unit}.`
        : `Hình chữ nhật có chiều dài ${it.length} ${it.unit}, chiều rộng ${it.width} ${it.unit}.`;
    const ask = it.metric === "chu_vi" ? "Tính chu vi hình đó." : "Tính diện tích hình đó.";
    const resultUnit = it.metric === "dien_tich" ? `${it.unit}2` : it.unit; // Word font thường không có superscript "²" ổn định - dùng "cm2"
    return {
      children: [
        new TextRun({
          text: `${i + 1}. ${desc} ${ask}  Bài giải: ${showAnswers ? `${it.answer} ${resultUnit}` : `${BLANK} ${resultUnit}`}`,
          font: FONT,
          size: 24,
        }),
      ],
      spacing: { after: 140 },
    };
  });
}

/**
 * "Đổi đơn vị đo" - lưới 2 cột giống buildTinhNhamParagraphs, "số + đơn vị" thay vì phép tính.
 * MỞ RỘNG LỚP 3, ĐỢT 3 (phản hồi "Trạm 8"): 3 -> 2 mỗi hàng, khớp đổi bên WorksheetPreview.jsx -
 * giá trị đổi có thể tới 5 chữ số (14.000 ml...), 3 cụm/hàng quá chật khi in.
 */
function buildDoiDonViParagraphs(items, showAnswers) {
  return chunkArray(items, 2).map((row) => ({
    children: row.flatMap((it, idx) => {
      const text = `${formatSoTuNhien(it.value)} ${it.fromUnit} = ${
        showAnswers ? formatSoTuNhien(it.answer) : BLANK
      } ${it.toUnit}`;
      const run = new TextRun({ text, font: FONT, size: 24 });
      return idx < row.length - 1 ? [run, new TextRun({ text: "      ", font: FONT, size: 24 })] : [run];
    }),
    spacing: { after: 100 },
  }));
}

/** "Tiền Việt Nam" - liệt kê tờ tiền bằng chữ, tính tổng. */
function buildTienVietNamParagraphs(items, showAnswers) {
  return items.map((it, i) => ({
    children: [
      new TextRun({
        text: `${i + 1}. Em có ${it.bills
          .map((b) => `${b.quantity} tờ ${formatSoTuNhien(b.denomination)} đồng`)
          .join(" và ")}. Hỏi em có tất cả bao nhiêu tiền?  Trả lời: ${
          showAnswers ? `${formatSoTuNhien(it.answer)} đồng` : `${BLANK} đồng`
        }`,
        font: FONT,
        size: 24,
      }),
    ],
    spacing: { after: 140 },
  }));
}

/**
 * "Khả năng xảy ra của một sự kiện" - bản giáo viên (showAnswers=true) IN HOA nhãn đúng để dễ
 * nhận ra ngay (docx.js dựng bold dễ hơn màu nền như web) - bản học sinh liệt kê nguyên 3 nhãn.
 */
function buildKhaNangXayRaParagraphs(items, showAnswers) {
  return items.map((it, i) => {
    const optionsText = Object.entries(PROBABILITY_LEVEL_LABELS)
      .map(([key, label]) => (showAnswers && key === it.level ? `[${label}]` : label))
      .join("   /   ");
    return {
      children: [
        new TextRun({ text: `${i + 1}. ${it.text}`, font: FONT, size: 24 }),
        new TextRun({ text: `      ${optionsText}`, font: FONT, size: 24, bold: showAnswers }),
      ],
      spacing: { after: 140 },
    };
  });
}

/**
 * ================== MỞ RỘNG LỚP 3, ĐỢT 3 ==================
 * "Thu thập, phân loại số liệu" - Word không dựng được thanh màu tỉ lệ như CSS bên web, nên
 * biểu diễn bảng số liệu bằng ký tự khối "■" lặp lại theo đúng số lượng (dễ đọc bằng mắt hệt
 * biểu đồ cột, không cần vẽ hình) - liệt kê ngay dưới tiêu đề khảo sát, sau đó là câu hỏi.
 */
function buildThuThapSoLieuParagraphs(surveyTitle, data, questions, showAnswers) {
  const titlePara = {
    children: [new TextRun({ text: surveyTitle, font: FONT, size: 24, bold: true })],
    spacing: { after: 100 },
  };
  const dataParas = data.map((d) => ({
    children: [
      new TextRun({ text: `${d.label}: `, font: FONT, size: 24 }),
      new TextRun({ text: "■".repeat(d.value), font: FONT, size: 24 }),
      new TextRun({ text: `  (${d.value})`, font: FONT, size: 24 }),
    ],
    spacing: { after: 60 },
  }));
  const questionParas = questions.map((q, i) => ({
    children: [
      new TextRun({
        text: `${i + 1}. ${q.text}  Trả lời: ${showAnswers ? q.answer : BLANK}`,
        font: FONT,
        size: 24,
      }),
    ],
    spacing: { after: 140, before: i === 0 ? 120 : 0 },
  }));
  return [titlePara, ...dataParas, ...questionParas];
}

/**
 * ================== GIAI ĐOẠN 9, BƯỚC 2 (chủ đề "Thời gian", Lớp 1) ==================
 * Điền ngày còn thiếu - nối bằng " — " giống bản web (CacNgayTrongTuanSection), thay dấu phẩy
 * bằng gạch ngang để rõ đây là 1 CHUỖI liên tiếp có thứ tự, không phải danh sách rời rạc.
 */
function buildCacNgayTrongTuanParagraphs(items, showAnswers) {
  return items.map((it) => ({
    children: [
      new TextRun({
        text: it.sequence.map((d) => (d === null ? (showAnswers ? it.answer : BLANK) : d)).join("  —  "),
        font: FONT,
        size: 24,
      }),
    ],
    spacing: { after: 120 },
  }));
}

/**
 * "Nối phép tính": Word không vẽ được đường nối tay như trên phiếu in - giữ đúng tinh thần
 * bài tập (học sinh tự nối bằng bút khi in ra giấy), dùng tab-stop RIGHT để đẩy cột kết quả
 * xáo trộn ra sát lề phải, mô phỏng bố cục 2 cột trái/phải giống WorksheetPreview.jsx.
 * Bản giáo viên (showAnswers=true) in thẳng luôn cặp đã ghép đúng, không cần đoán.
 */
function buildNoiPhepTinhParagraphs(data, showAnswers) {
  if (showAnswers) {
    return data.pairs.map((p) => ({
      children: [new TextRun({ text: `${formatSoTrongChuoi(p.expr)} = ${formatSoTuNhien(p.result)}`, font: FONT, size: 24 })],
      spacing: { after: 100 },
    }));
  }

  return data.pairs.map((p, i) => ({
    children: [
      new TextRun({ text: `${formatSoTrongChuoi(p.expr)}   ●`, font: FONT, size: 24 }),
      new TextRun({ text: "\t", font: FONT, size: 24 }),
      new TextRun({ text: `●   ${formatSoTuNhien(data.shuffledResults[i])}`, font: FONT, size: 24 }),
    ],
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH_TWIP }],
    spacing: { after: 100 },
  }));
}

// Ký tự Unicode dạng VIỀN NÉT (không tô đặc) đứng trước tên hình, để bản Word cũng gợi ý
// hình dáng cho bé tô màu, chứ không chỉ có chữ - khớp tên với SHAPES trong worksheetSchemas.js.
// GIAI ĐOẠN 9: mở rộng theo đúng kho SHAPES mới (14 hình) trong worksheetSchemas.js - hình nào
// chưa map (không nên xảy ra) sẽ fallback về "○" như cũ.
const SHAPE_GLYPHS = {
  "Hình tròn": "○",
  "Hình vuông": "□",
  "Hình tam giác": "△",
  "Hình chữ nhật": "▭",
  "Hình ngôi sao": "☆",
  "Hình trái tim": "♡",
  "Hình thoi": "◇",
  "Hình ê-líp": "⬭",
  "Hình ngũ giác": "⬠",
  "Hình lục giác": "⬡",
  "Hình thang": "⏢",
};

function buildNhanDienHinhParagraphs(shapes) {
  return [
    {
      children: [
        new TextRun({
          text: shapes.map((s) => `${SHAPE_GLYPHS[s] || "○"} ${s}`).join("      "),
          font: FONT,
          size: 28,
        }),
      ],
      spacing: { after: 100 },
    },
  ];
}

/**
 * ================== GIAI ĐOẠN 2 (hoạt động ứng dụng tự động đi kèm Nhận diện hình) ==================
 * "Khay hình" trộn lẫn in bằng glyph Unicode (tái dùng SHAPE_GLYPHS - Word không vẽ SVG được
 * như bản web), tiếp theo là các câu hỏi "Có bao nhiêu Hình X?" kèm chỗ trống hoặc đáp số.
 */
function buildDemHinhUngDungParagraphs(data, showAnswers) {
  const trayLine = {
    children: [
      new TextRun({
        text: data.trayIcons.map((s) => SHAPE_GLYPHS[s] || "○").join("  "),
        font: FONT,
        size: 30,
      }),
    ],
    spacing: { after: 100 },
  };
  const questionLines = data.questions.map((q) => ({
    children: [
      new TextRun({
        text: `❓ Có bao nhiêu ${q.shape}?   ${showAnswers ? q.answer : BLANK}`,
        font: FONT,
        size: 24,
      }),
    ],
    spacing: { after: 80 },
  }));
  return [trayLine, ...questionLines];
}

// GIAI ĐOẠN F2 (ý b) - đồng bộ với GIAI_TOAN_LINE_COUNT bên WorksheetPreview.jsx: trước đây chỉ
// in 1 dòng chấm chấm cho mỗi bài "Giải toán có lời văn", không đủ chỗ viết lời giải + phép tính
// + đáp số. Giờ in nhiều dòng chấm chấm liên tiếp (mặc định 4 dòng) để khớp khung nhiều dòng bên
// bản xem trước web.
const GIAI_TOAN_LINE_COUNT = 4;

function buildGiaiToanParagraphs(items, showAnswers) {
  return items.flatMap((it) => {
    const writingLines = Array.from({ length: GIAI_TOAN_LINE_COUNT }, (_, i) => ({
      children: [new TextRun({ text: WRITING_LINE, font: FONT, size: 24 })],
      spacing: { after: i === GIAI_TOAN_LINE_COUNT - 1 ? (showAnswers && it.answer ? 60 : 120) : 100 },
    }));
    const paras = [
      {
        children: [new TextRun({ text: it.content, font: FONT, size: 24 })],
        spacing: { after: 60 },
      },
      ...writingLines,
    ];
    if (showAnswers && it.answer) {
      paras.push({
        children: [new TextRun({ text: `Đáp số: ${it.answer}`, bold: true, italics: true, font: FONT, size: 24 })],
        spacing: { after: 120 },
      });
    }
    return paras;
  });
}

/**
 * ================== GIAI ĐOẠN 6 (mở rộng sang Tiếng Việt) ==================
 * "Khoanh từ chỉ hoạt động / đặc điểm" - showAnswers=false chỉ in câu (học sinh tự khoanh khi
 * làm bài in trên giấy); showAnswers=true (bản giáo viên) in kèm từ đáp án + loại từ.
 */
function buildKhoanhTuLoaiParagraphs(items, showAnswers) {
  return items.map((it, i) => {
    const wordTypeLabel = it.wordType === "hoat_dong" ? "chỉ hoạt động" : "chỉ đặc điểm";
    const text = showAnswers ? `${i + 1}. ${it.sentence}   (Đáp án: "${it.targetWord}" - từ ${wordTypeLabel})` : `${i + 1}. ${it.sentence}`;
    return {
      children: [new TextRun({ text, font: FONT, size: 24 })],
      spacing: { after: 100 },
    };
  });
}

/** "Nối từ với nhóm thích hợp" - CÙNG kỹ thuật tabStop 2-cột như buildNoiPhepTinhParagraphs()
 * (chỉ khác nội dung là CHỮ thay vì SỐ). showAnswers=true in thẳng cặp đã ghép đúng. */
function buildNoiTuNhomParagraphs(data, showAnswers) {
  if (showAnswers) {
    return data.pairs.map((p) => ({
      children: [new TextRun({ text: `${p.left} - ${p.right}`, font: FONT, size: 24 })],
      spacing: { after: 100 },
    }));
  }
  return data.pairs.map((p, i) => ({
    children: [
      new TextRun({ text: `${p.left}   ●`, font: FONT, size: 24 }),
      new TextRun({ text: "\t", font: FONT, size: 24 }),
      new TextRun({ text: `●   ${data.shuffledRight[i]}`, font: FONT, size: 24 }),
    ],
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH_TWIP }],
    spacing: { after: 100 },
  }));
}

/** "Điền từ thích hợp vào chỗ trống" - dòng đầu in ngân hàng từ (đóng khung bằng dấu ngoặc cho
 * dễ phân biệt), các câu bên dưới giữ nguyên "___" nếu KHÔNG showAnswers, thay bằng đáp án nếu có. */
function buildDienTuChoSanParagraphs(data, showAnswers) {
  const bankLine = {
    children: [new TextRun({ text: `Ngân hàng từ: ${data.wordBank.join(" - ")}`, bold: true, font: FONT, size: 24 })],
    spacing: { after: 120 },
  };
  const sentenceLines = data.sentences.map((s, i) => ({
    children: [
      new TextRun({
        text: `${i + 1}. ${showAnswers ? s.template.replace("___", s.answer) : s.template}`,
        font: FONT,
        size: 24,
      }),
    ],
    spacing: { after: 100 },
  }));
  return [bankLine, ...sentenceLines];
}

/** "Đặt câu theo mẫu" - mẫu + ví dụ + 1 dòng kẻ trống để viết (KHÔNG có showAnswers - không có
 * đáp án cố định, học sinh tự sáng tạo câu riêng theo mẫu). */
function buildDatCauTheoMauParagraphs(items) {
  return items.flatMap((it, i) => [
    {
      children: [
        new TextRun({ text: `${i + 1}. Mẫu: `, bold: true, font: FONT, size: 24 }),
        new TextRun({ text: it.pattern, bold: true, font: FONT, size: 24 }),
      ],
      spacing: { after: 40 },
    },
    {
      children: [new TextRun({ text: `VD: ${it.example}`, italics: true, font: FONT, size: 22 })],
      spacing: { after: 60 },
    },
    {
      children: [new TextRun({ text: WRITING_LINE, font: FONT, size: 24 })],
      spacing: { after: 140 },
    },
  ]);
}

// =========================== GHÉP 1 "KHUNG MÀU" (header + nội dung) ===========================

function buildSectionContentOptions(section, showAnswers) {
  switch (section.type) {
    case "tinh_nham":
      return buildTinhNhamParagraphs(section.items, showAnswers);
    case "tach_gop":
      return buildTachGopParagraphs(section.items, showAnswers);
    case "dem_va_viet_so":
      return buildDemVaVietSoParagraphs(section.items, showAnswers);
    case "so_sanh":
      return buildSoSanhParagraphs(section.items, showAnswers);
    case "day_so":
      return buildDaySoParagraphs(section.items, showAnswers);
    case "sap_xep_thu_tu":
      return buildSapXepThuTuParagraphs(section.items, showAnswers);
    case "noi_phep_tinh":
      return buildNoiPhepTinhParagraphs(section.data, showAnswers);
    case "do_dai_so_sanh":
      return buildDoDaiSoSanhParagraphs(section.items, showAnswers);
    case "do_dai_sap_xep":
      return buildSapXepThuTuParagraphs(section.items, showAnswers);
    case "xem_dong_ho_gio_dung":
      return buildXemDongHoGioDungParagraphs(section.items, showAnswers);
    case "xem_dong_ho_gio_phut":
      return buildXemDongHoGioPhutParagraphs(section.items, showAnswers);
    case "chu_vi_dien_tich":
      return buildChuViDienTichParagraphs(section.items, showAnswers);
    case "doi_don_vi_do":
      return buildDoiDonViParagraphs(section.items, showAnswers);
    case "tien_viet_nam":
      return buildTienVietNamParagraphs(section.items, showAnswers);
    case "kha_nang_xay_ra":
      return buildKhaNangXayRaParagraphs(section.items, showAnswers);
    case "thu_thap_so_lieu":
      return buildThuThapSoLieuParagraphs(section.surveyTitle, section.data, section.questions, showAnswers);
    case "cac_ngay_trong_tuan":
      return buildCacNgayTrongTuanParagraphs(section.items, showAnswers);
    case "nhan_dien_hinh":
      return buildNhanDienHinhParagraphs(section.shapes);
    case "dem_hinh_ung_dung":
      return buildDemHinhUngDungParagraphs(section.data, showAnswers);
    case "giai_toan":
      return buildGiaiToanParagraphs(section.items, showAnswers);
    case "khoanh_tu_loai":
      return buildKhoanhTuLoaiParagraphs(section.items, showAnswers);
    case "noi_tu_nhom":
      return buildNoiTuNhomParagraphs(section.data, showAnswers);
    case "dien_tu_cho_san":
      return buildDienTuChoSanParagraphs(section.data, showAnswers);
    case "dat_cau_theo_mau":
      return buildDatCauTheoMauParagraphs(section.items);
    default:
      return [];
  }
}

/**
 * Gộp mảng "Paragraph options" thành Paragraph thật, chỉ gắn border-top cho cái ĐẦU và
 * border-bottom cho cái CUỐI (xem giải thích ở đầu file) - toàn bộ đều có shading + border
 * trái/phải giống nhau để Word render liền thành 1 khung.
 */
function applyBoxStyling(rawOptions, colors, frameStyle) {
  const borderType = FRAME_BORDER_STYLE[frameStyle] || BorderStyle.SINGLE;
  const shading = { fill: colors.bg, type: ShadingType.CLEAR, color: "auto" };
  const side = { style: borderType, size: 6, color: colors.border, space: 6 };

  return rawOptions.map((opts, i) => {
    const border = { left: side, right: side };
    if (i === 0) border.top = side;
    if (i === rawOptions.length - 1) border.bottom = side;
    return new Paragraph({ ...opts, shading, border });
  });
}

/** "#2F80ED" -> "2F80ED" (docx yêu cầu mã màu KHÔNG có dấu #, khác CSS). */
function hexNoHash(hex) {
  return (hex || "").replace(/^#/, "");
}

function buildSectionParagraphs(section, index, showAnswers, layout) {
  const colors = getTheme(layout, section, index);
  const badge = CIRCLED_DIGITS[index] ?? `(${index + 1})`;

  // ================== GIAI ĐOẠN 9, PHÁT HIỆN MỚI (sửa "icon nhỏ") ==================
  // Trước đây số thứ tự chỉ là CHỮ THƯỜNG cùng cỡ/cùng dòng với tiêu đề (size 26 = 13pt, không
  // có gì làm nó nổi bật) - khác hẳn bản Web (ExerciseBox trong WorksheetPreview.jsx) có hẳn 1
  // "huy hiệu" hình tròn nền màu đậm, chữ trắng, đổ bóng. Word không vẽ được hình tròn/box-shadow,
  // nhưng CÓ hỗ trợ tô nền cho RIÊNG 1 run chữ (run-level shading, khác shading của cả khung) ->
  // dùng để mô phỏng 1 "viên thuốc" (pill) nền đậm cùng màu badge của khối, chữ trắng, cỡ chữ
  // TO HƠN hẳn (32 thay vì 26) - để nó thực sự nổi bật như 1 icon/huy hiệu, không lẫn vào chữ.
  const badgePill = new TextRun({
    text: ` ${badge} `,
    bold: true,
    color: "FFFFFF",
    font: FONT,
    size: 32,
    shading: { fill: hexNoHash(colors.badge), type: ShadingType.CLEAR, color: "auto" },
  });
  // Mascot (emoji) tách RIÊNG khỏi run có rFonts="Times New Roman" - Times New Roman không có
  // glyph màu cho emoji, để Word tự chọn font thay thế theo đúng hành vi mặc định (giống các chỗ
  // khác trong file này đã in emoji thuần không gán font, VD buildDemVaVietSoParagraphs) thay vì
  // ép chung 1 rFonts với chữ số/badge - tránh lệch baseline giữa glyph màu và chữ thường.
  const mascotRun = new TextRun({ text: `  ${colors.mascot}  `, size: 30 });

  const headerOptions = {
    children: [
      badgePill,
      mascotRun,
      new TextRun({ text: section.title, bold: true, color: colors.title, font: FONT, size: 26 }),
    ],
    spacing: { before: 100, after: 120 },
  };

  const contentOptions = buildSectionContentOptions(section, showAnswers);
  const boxed = applyBoxStyling([headerOptions, ...contentOptions], colors, layout?.frameStyle);

  // Khoảng trống SAU khung, không border - tách các khung với nhau
  const spacer = new Paragraph({ text: "", spacing: { after: 200 } });

  return [...boxed, spacer];
}

// =========================== DỰNG TÀI LIỆU HOÀN CHỈNH ===========================

function buildHeaderParagraphs(title) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: title || "BÀI TẬP TOÁN", bold: true, size: 32, font: FONT })],
      spacing: { after: 80 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Họ và tên: ..................................................................   Lớp: ..............",
          font: FONT,
          size: 24,
        }),
      ],
      spacing: { after: 240 },
    }),
  ];
}

/**
 * ================== GIAI ĐOẠN 4 ==================
 * Footer "Tự đánh giá / Nhận xét của thầy cô / Ghi nhớ" - bản Word đơn giản hơn bản web (không
 * dàn 3 cột cạnh nhau vì Word không có CSS grid đáng tin cậy cho khối có border như đã giải
 * thích ở đầu file), thay bằng 3 đoạn nối tiếp có viền riêng, vẫn đủ chỗ để học sinh tự đánh
 * dấu và giáo viên viết tay nhận xét khi in ra giấy.
 */
function buildFooterParagraphs() {
  const side = { style: BorderStyle.DASHED, size: 4, color: "94A3B8", space: 6 };
  const border = { top: side, bottom: side, left: side, right: side };

  return [
    new Paragraph({ text: "", spacing: { before: 200 } }),
    new Paragraph({
      border,
      children: [new TextRun({ text: "⭐ TỰ ĐÁNH GIÁ:  Học chăm ⭐⭐⭐   Làm tốt ⭐⭐⭐   Cố gắng hơn ⭐⭐⭐", font: FONT, size: 21 })],
      spacing: { before: 80, after: 80 },
    }),
    new Paragraph({
      border,
      children: [new TextRun({ text: "💬 NHẬN XÉT CỦA THẦY/CÔ: .................................................................................", font: FONT, size: 21 })],
      spacing: { before: 80, after: 80 },
    }),
    new Paragraph({
      border,
      children: [new TextRun({ text: "📌 GHI NHỚ: Ôn lại kiến thức ✔️  Làm bài cẩn thận ✔️  Kiểm tra kết quả ✔️", font: FONT, size: 21 })],
      spacing: { before: 80, after: 200 },
    }),
  ];
}

/** data:URL (base64) -> Uint8Array, KHÔNG dùng Buffer (API Node.js) vì file này chạy ở browser -
 * atob() có sẵn ở cả 2 môi trường (browser native, Node.js >= 16). */
function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(",")[1] || "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * QR "chấm nhanh" cho đáp số bài giải toán - CHỈ chèn vào bản GIÁO VIÊN (showAnswers=true),
 * không chèn vào bản học sinh (tránh lộ đáp số ngay trên phiếu học sinh đang làm bài).
 */
async function buildAnswerQrParagraphs(answerKeyText) {
  if (!answerKeyText) return [];
  try {
    const QRCode = (await import("qrcode")).default;
    const dataUrl = await QRCode.toDataURL(answerKeyText, { width: 96, margin: 1 });
    const bytes = dataUrlToUint8Array(dataUrl);
    return [
      new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new ImageRun({ type: "png", data: bytes, transformation: { width: 96, height: 96 } }),
        ],
      }),
      new Paragraph({
        children: [new TextRun({ text: "📱 Mã QR đáp số bài giải toán (chỉ có ở bản Giáo viên)", italics: true, size: 18, font: FONT })],
        spacing: { after: 160 },
      }),
    ];
  } catch (err) {
    console.warn("[worksheetExportService] Không sinh được QR đáp số, bỏ qua:", err.message);
    return [];
  }
}

/** Dựng Blob .docx - hàm lõi dùng chung, KHÔNG tự tải file (không gọi saveAs), giống quy ước
 * exportService.js. Export (dù bình thường chỉ dùng nội bộ) để có thể tự verify bằng script gọi
 * hàm trực tiếp + giải nén .docx thật soi XML - cùng tinh thần buildLessonPlanDocxSections() bên
 * module giáo án (xem PROJECT_SUMMARY.md, giai đoạn 8). */
export async function buildWorksheetDocxBlob({ worksheet, meta = {}, showAnswers = false }) {
  const layout = worksheet?.layout || getDefaultLayout();
  const headerParagraphs = buildHeaderParagraphs(meta.title);
  const sectionParagraphs = (worksheet?.sections || []).flatMap((section, i) =>
    buildSectionParagraphs(section, i, showAnswers, layout)
  );
  const qrParagraphs = showAnswers ? await buildAnswerQrParagraphs(worksheet?.answerKeyText) : [];
  const footerParagraphs = buildFooterParagraphs();

  // ================== GIAI ĐOẠN 1 (sửa lỗi layout/in ấn) ==================
  // Cùng bug với exportService.js: properties:{} rỗng -> docx.js dùng mặc định khổ Letter
  // (8.5x11 inch), KHÔNG PHẢI A4. Đây là nguyên nhân THẬT của "margin không full khổ A4" ở
  // phiếu bài tập. Dùng chung PAGE_A4_MM/PAGE_MARGIN_MM từ constants.js để khớp với đề kiểm
  // tra và giáo án - 3 loại tài liệu xuất ra đều cùng 1 khổ giấy, không lệch nhau nữa.
  const pageProperties = {
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

  const doc = new Document({
    sections: [
      {
        properties: pageProperties,
        children: [...headerParagraphs, ...sectionParagraphs, ...qrParagraphs, ...footerParagraphs],
      },
    ],
  });

  // ⚠️ Giống exportService.js: chạy phía browser nên PHẢI dùng Packer.toBlob(), KHÔNG dùng
  // toBuffer() (API Node.js) - dùng nhầm sẽ tạo file .docx hỏng, Word không mở được.
  return Packer.toBlob(doc);
}

function slugifyTitle(title) {
  return (title || "Phieu-bai-tap").trim().replace(/\s+/g, "-");
}

/** Xuất 1 file .docx duy nhất - bản "sạch" cho học sinh (mặc định, dùng khi bấm nút xuất Word thường). */
export async function exportWorksheetToWord({ worksheet, meta }) {
  const blob = await buildWorksheetDocxBlob({ worksheet, meta, showAnswers: false });
  saveAs(blob, `${slugifyTitle(meta?.title)}.docx`);
}

/**
 * Xuất ĐỒNG THỜI 2 file từ CÙNG 1 dữ liệu đã tạo (không sinh lại), giống Giai đoạn 3 của
 * đề kiểm tra (exportBothVersions trong exportService.js):
 *   - Bản học sinh: các ô trống (BLANK/BLANK_CIRCLE/WRITING_LINE) để điền tay.
 *   - Bản giáo viên: điền sẵn đáp án (riêng "giải toán có lời văn" chỉ có đáp số nếu giáo
 *     viên đã bật "Kèm đáp số" lúc tạo phiếu - nếu không, dòng đáp số được bỏ qua thay vì
 *     hiện "undefined").
 */
export async function exportWorksheetBothVersions({ worksheet, meta }) {
  const fileBase = slugifyTitle(meta?.title);

  const studentBlob = await buildWorksheetDocxBlob({ worksheet, meta, showAnswers: false });
  saveAs(studentBlob, `${fileBase}-HocSinh.docx`);

  const teacherBlob = await buildWorksheetDocxBlob({ worksheet, meta, showAnswers: true });
  saveAs(teacherBlob, `${fileBase}-GiaoVien.docx`);
}
