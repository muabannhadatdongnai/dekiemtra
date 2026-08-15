"use client";

import { useState } from "react";
import { FileDown, FileSpreadsheet, Printer, Copy, Check } from "lucide-react";
import {
  exportReportCommentsToWord,
  exportReportCommentsToExcel,
  buildAllCommentsPlainText,
} from "@/services/reportCommentExportService";

export default function ReportCommentExportActions({ cap, results }) {
  const [copied, setCopied] = useState(false);
  const hasValidResults = (results || []).some((r) => r.comment);
  const disabled = !hasValidResults;

  async function handleCopyAll() {
    const text = buildAllCommentsPlainText({ results });
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // "Tải PDF" ở đây = window.print() trên khung riêng ReportCommentPdfView.jsx (id="print-area",
  // luôn được mount kèm ReportCommentPreview.jsx nhưng ẩn màn hình) - đúng khuôn exportToPDF()
  // trong exportService.js (Đề kiểm tra), KHÔNG cần thêm thư viện tạo PDF nào (Bước 1, Việc #8).
  function handleDownloadPdf() {
    window.print();
  }

  return (
    <div className="no-print flex flex-wrap gap-2">
      <button
        onClick={() => exportReportCommentsToWord({ results, cap })}
        disabled={disabled}
        className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        <FileDown size={15} /> Tải Word
      </button>
      <button
        onClick={() => exportReportCommentsToExcel({ results, cap })}
        disabled={disabled}
        className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        <FileSpreadsheet size={15} /> Tải Excel
      </button>
      <button
        onClick={handleDownloadPdf}
        disabled={disabled}
        className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        <Printer size={15} /> Tải PDF (bản phụ huynh)
      </button>
      <button
        onClick={handleCopyAll}
        disabled={disabled}
        className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
        {copied ? "Đã sao chép" : "Sao chép tất cả"}
      </button>
    </div>
  );
}
