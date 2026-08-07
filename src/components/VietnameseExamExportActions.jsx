"use client";

import { FileDown, Printer } from "lucide-react";
import { exportVietnameseExamToWord } from "@/services/vietnameseExamExportService";
import { exportToPDF } from "@/services/exportService";

export default function VietnameseExamExportActions({ results, meta }) {
  const disabled = !results || Object.keys(results).length === 0;

  function handleWord() {
    exportVietnameseExamToWord({ results, meta });
  }

  return (
    <div className="no-print flex flex-wrap gap-2">
      <button
        onClick={handleWord}
        disabled={disabled}
        className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
      >
        <FileDown size={15} /> Tải Word
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
