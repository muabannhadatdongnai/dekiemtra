import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { getReportCommentLevelConfig } from "@/data/reportCommentConfig";

/**
 * reportCommentExportService.js
 * Xuất Word (.docx, mỗi học sinh 1 mục, sao chép/in dễ dàng) và Excel (.xlsx, mỗi học sinh 1
 * dòng, tiện dán vào phần mềm học bạ khác) cho danh sách nhận xét ĐÃ TẠO - đúng khuôn
 * lessonPlanExportService.js (dùng thư viện "docx"), thêm nhánh Excel bằng "xlsx" (SheetJS).
 *
 * @param results [{ hoTen, lop, comment, error }] - comment theo cấu trúc từng cấp (xem
 * reportCommentPromptTemplates.js). Bỏ qua các phần tử có error/không có comment.
 */

const FONT = "Times New Roman";

function textRun(text, opts = {}) {
  return new TextRun({ text: String(text ?? ""), font: FONT, size: 24, ...opts });
}

function paragraph(text, opts = {}) {
  return new Paragraph({ children: [textRun(text, opts.run)], spacing: { after: 120 }, ...opts.paragraph });
}

function studentHeading(hoTen, lop) {
  return new Paragraph({
    children: [textRun(`${hoTen}${lop ? ` - Lớp ${lop}` : ""}`, { bold: true, size: 28 })],
    spacing: { before: 300, after: 150 },
  });
}

function commentToParagraphs(comment) {
  const paras = [];
  if (comment.phamChat) paras.push(paragraph(`Phẩm chất: ${comment.phamChat}`));
  if (comment.nangLuc) paras.push(paragraph(`Năng lực: ${comment.nangLuc}`));
  if (comment.nhanXetChung) paras.push(paragraph(`Nhận xét chung: ${comment.nhanXetChung}`));
  if (Array.isArray(comment.monHoc)) {
    for (const m of comment.monHoc) {
      if (m?.ten && m?.noiDung) {
        paras.push(paragraph(`${m.ten}: ${m.noiDung}`));
      }
    }
  }
  return paras;
}

export async function exportReportCommentsToWord({ results, cap }) {
  const levelConfig = getReportCommentLevelConfig(cap);
  const valid = (results || []).filter((r) => r.comment);

  const titlePara = new Paragraph({
    children: [textRun("NHẬN XÉT HỌC BẠ", { bold: true, size: 32 })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  });
  const subtitlePara = new Paragraph({
    children: [textRun(levelConfig?.circularLabel || "", { italics: true, size: 22 })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  });

  const body = [titlePara, subtitlePara];
  valid.forEach((r) => {
    body.push(studentHeading(r.hoTen, r.lop));
    body.push(...commentToParagraphs(r.comment));
  });

  const doc = new Document({
    sections: [{ properties: {}, children: body }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `nhan-xet-hoc-ba-${cap}.docx`);
}

export async function exportReportCommentsToExcel({ results, cap }) {
  const XLSX = await import("xlsx");
  const valid = (results || []).filter((r) => r.comment);

  const rows = valid.map((r) => {
    const row = { "Họ và tên": r.hoTen, Lớp: r.lop };
    if (r.comment.phamChat !== undefined) row["Phẩm chất"] = r.comment.phamChat;
    if (r.comment.nangLuc !== undefined) row["Năng lực"] = r.comment.nangLuc;
    if (r.comment.nhanXetChung !== undefined) row["Nhận xét chung"] = r.comment.nhanXetChung;
    if (Array.isArray(r.comment.monHoc)) {
      for (const m of r.comment.monHoc) {
        if (m?.ten) row[m.ten] = m.noiDung || "";
      }
    }
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Nhận xét học bạ");
  const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, `nhan-xet-hoc-ba-${cap}.xlsx`);
}

// Nhãn "thân thiện" cho PDF gửi phụ huynh - KHÁC nhãn kỹ thuật dùng trong Word/Excel ở trên
// (VD "Nhận xét chung" thay vì tách phần "cấu trúc" giáo viên quen dùng), vì người đọc PDF này
// là PHỤ HUYNH, không phải giáo viên lưu hồ sơ.
const PARENT_FRIENDLY_FIELD_LABELS = {
  phamChat: "Về phẩm chất",
  nangLuc: "Về năng lực",
  nhanXetChung: "Nhận xét chung",
};

/**
 * buildParentFriendlyReportSections
 * Dựng dữ liệu ĐÃ CHUẨN HOÁ (không phải Paragraph của "docx") cho bản PDF "thân thiện phụ
 * huynh" (Bước 1, Việc #8) - văn phong THƯ NGỎ gửi thẳng phụ huynh, khác hẳn Word/Excel ở trên
 * (những bản đó dành cho GIÁO VIÊN lưu hồ sơ/nộp trường). Component ReportCommentPdfView.jsx chỉ
 * việc map mảng trả về ra JSX + CSS in ấn riêng (xem globals.css, nhóm ".report-pdf-*") - hàm
 * này KHÔNG biết gì về React/CSS, chỉ chuẩn bị dữ liệu, nên test được bằng Node thuần.
 *
 * ⚠️ CÓ CHỦ ĐÍCH tách ĐỘC LẬP khỏi outlineExportService.js (Nhóm B, "Đề cương Ôn tập" - cũng có
 * 1 hàm style PDF thân thiện phụ huynh riêng theo NEXT_STEPS.md) dù cùng chung mục tiêu "PDF thân
 * thiện phụ huynh": 2 tính năng có đối tượng nội dung và bố cục khác hẳn nhau (nhận xét học bạ
 * theo từng học sinh, ngắn gọn >< đề cương ôn tập theo môn/lớp, dài, nhiều mục) - gộp chung sẽ
 * phải rẽ nhánh if/else liên tục, dễ sửa nhầm bên này ảnh hưởng bên kia.
 *
 * @returns [{ hoTen, lop, circularLabel, items: [{ label, text }] }] - CHỈ gồm học sinh đã có
 * comment hợp lệ (bỏ qua phần tử lỗi/`error`, giống buildAllCommentsPlainText).
 */
export function buildParentFriendlyReportSections({ results, cap }) {
  const levelConfig = getReportCommentLevelConfig(cap);
  const valid = (results || []).filter((r) => r.comment);

  return valid.map((r) => {
    const c = r.comment;
    const items = [];
    if (c.phamChat) items.push({ label: PARENT_FRIENDLY_FIELD_LABELS.phamChat, text: c.phamChat });
    if (c.nangLuc) items.push({ label: PARENT_FRIENDLY_FIELD_LABELS.nangLuc, text: c.nangLuc });
    if (c.nhanXetChung) items.push({ label: PARENT_FRIENDLY_FIELD_LABELS.nhanXetChung, text: c.nhanXetChung });
    if (Array.isArray(c.monHoc)) {
      for (const m of c.monHoc) {
        if (m?.ten && m?.noiDung) items.push({ label: `Môn ${m.ten}`, text: m.noiDung });
      }
    }
    return {
      hoTen: r.hoTen,
      lop: r.lop || "",
      circularLabel: levelConfig?.circularLabel || "",
      items,
    };
  });
}

/** Gộp toàn bộ nhận xét thành 1 chuỗi text để "Sao chép tất cả" (dùng navigator.clipboard). */
export function buildAllCommentsPlainText({ results }) {
  const valid = (results || []).filter((r) => r.comment);
  return valid
    .map((r) => {
      const lines = [`${r.hoTen}${r.lop ? ` - Lớp ${r.lop}` : ""}`];
      const c = r.comment;
      if (c.phamChat) lines.push(`Phẩm chất: ${c.phamChat}`);
      if (c.nangLuc) lines.push(`Năng lực: ${c.nangLuc}`);
      if (c.nhanXetChung) lines.push(`Nhận xét chung: ${c.nhanXetChung}`);
      if (Array.isArray(c.monHoc)) {
        for (const m of c.monHoc) {
          if (m?.ten && m?.noiDung) lines.push(`${m.ten}: ${m.noiDung}`);
        }
      }
      return lines.join("\n");
    })
    .join("\n\n---\n\n");
}
