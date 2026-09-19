"use client";

import { FileDown } from "lucide-react";
import { exportKhgdTieuHocToWord } from "@/services/khgdTieuHocExportService";

export default function KhgdTieuHocExportActions({ lessons, meta }) {
  const disabled = !lessons?.length;

  return (
    <div className="no-print flex flex-wrap gap-2">
      <button
        onClick={() => exportKhgdTieuHocToWord({ lessons, meta })}
        disabled={disabled}
        className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        <FileDown size={15} /> Tải Word (khổ A4 ngang)
      </button>
    </div>
  );
}
