"use client";

import { FileDown, Printer } from "lucide-react";
import { exportWorksheetBothVersions } from "@/services/worksheetExportService";
import { exportToPDF } from "@/services/exportService";

/**
 * WorksheetExportActions.jsx
 * Tương tự ExportActions.jsx (đề kiểm tra) nhưng đơn giản hơn: Phiếu bài tập LUÔN có đáp án
 * tin cậy cho các dạng bài sinh bằng code (tinh_nham, so_sanh, day_so...) bất kể giáo viên có
 * bật "Kèm đáp số" lúc tạo hay không (chỉ dạng "giải toán có lời văn" phụ thuộc tuỳ chọn đó) -
 * nên LUÔN xuất đồng thời 2 file (Học sinh + Giáo viên), không cần điều kiện như bên đề kiểm tra.
 */
export default function WorksheetExportActions({ worksheet, meta }) {
  const disabled = !worksheet?.sections?.length;

  function handleWord() {
    exportWorksheetBothVersions({ worksheet, meta });
  }

  return (
    <div className="no-print flex flex-wrap gap-2">
      <button
        onClick={handleWord}
        disabled={disabled}
        className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        <FileDown size={15} />
        Tải Word (2 file: Học sinh + Giáo viên)
      </button>
      <button
        onClick={exportToPDF}
        disabled={disabled}
        className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        <Printer size={15} /> In / Tải PDF
      </button>
    </div>
  );
}
