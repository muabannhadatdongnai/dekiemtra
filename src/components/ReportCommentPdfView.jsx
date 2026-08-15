"use client";

import { buildParentFriendlyReportSections } from "@/services/reportCommentExportService";

/**
 * ReportCommentPdfView.jsx
 * Khung IN "thân thiện phụ huynh" cho Nhận xét học bạ (Bước 1, Việc #8) - CHỈ hiện khi in/xuất
 * PDF (window.print(), nút "Tải PDF" ở ReportCommentExportActions.jsx), ẩn hoàn toàn trên màn
 * hình vì bản xem/sửa chính vẫn là danh sách thẻ ở ReportCommentPreview.jsx.
 *
 * Dùng chung id="print-area" với các mode khác (Đề kiểm tra/Phiếu bài tập/Giáo án/Đề Tiếng Việt)
 * - AN TOÀN vì page.js chỉ mount 1 mode tại 1 thời điểm (xem chú thích MODES trong page.js).
 *
 * Style riêng (nhóm ".report-pdf-*" trong globals.css) KHÔNG dùng lại ".a4-page"/".gdt-*" (khung
 * "chuẩn Bộ GD&ĐT" của Đề kiểm tra) vì đây là thư ngỏ gửi phụ huynh - văn phong ấm áp hơn, không
 * cần khung viền nghiêm túc kiểu biểu mẫu hành chính.
 */
export default function ReportCommentPdfView({ results, cap }) {
  const sections = buildParentFriendlyReportSections({ results, cap });

  if (!sections.length) return null;

  return (
    <div id="print-area" className="report-pdf-only">
      {sections.map((s, i) => (
        <div key={`${s.hoTen}-${i}`} className={`report-pdf-page${i > 0 ? " report-pdf-page-break" : ""}`}>
          <p className="report-pdf-title">Phiếu nhận xét gửi Phụ huynh</p>
          <p className="report-pdf-greeting">
            Kính gửi Quý Phụ huynh em <strong>{s.hoTen}</strong>
            {s.lop ? ` — Lớp ${s.lop}` : ""},
          </p>
          <p className="report-pdf-intro">
            Nhà trường xin gửi đến Quý Phụ huynh một số nhận xét về quá trình học tập, rèn luyện
            của con trong thời gian qua:
          </p>

          {s.items.map((it, j) => (
            <div key={j} className="report-pdf-item">
              <p className="report-pdf-item-label">{it.label}</p>
              <p className="report-pdf-item-text">{it.text}</p>
            </div>
          ))}

          <p className="report-pdf-closing">
            Rất mong Quý Phụ huynh tiếp tục quan tâm, động viên con trong thời gian tới. Trân
            trọng cảm ơn!
          </p>
          {s.circularLabel && <p className="report-pdf-footnote">{s.circularLabel}</p>}
        </div>
      ))}
    </div>
  );
}
