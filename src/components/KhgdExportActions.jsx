"use client";

import { FileDown } from "lucide-react";
import { exportKhgdToWord } from "@/services/khgdExportService";

/**
 * KhgdExportActions.jsx
 * CHỈ có 1 nút "Tải Word" (khác OutlineExportActions.jsx có thêm "In/Tải PDF") - tab này KHÔNG
 * dùng id="print-area" (xem giải thích trong globals.css/KhgdPreview.jsx: khổ A4 NGANG cần 1
 * cơ chế @page riêng chưa làm ở phiên này), nên bản Word (đã đúng khổ ngang, sẵn sàng in) là
 * cách DUY NHẤT để giáo viên có file mang đi in ở phiên này.
 */
export default function KhgdExportActions({ lessons, kiemTraDinhKy, meta }) {
  const disabled = !lessons?.length;

  function handleWord() {
    exportKhgdToWord({ lessons, kiemTraDinhKy, meta });
  }

  return (
    <div className="no-print flex flex-wrap gap-2">
      <button
        onClick={handleWord}
        disabled={disabled}
        className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        <FileDown size={15} /> Tải Word (khổ A4 ngang)
      </button>
    </div>
  );
}
