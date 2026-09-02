"use client";

import { FileDown, Printer } from "lucide-react";
import { exportOutlineBothVersions } from "@/services/outlineExportService";
import { exportToPDF } from "@/services/exportService";
import ForeignLanguageExportButton from "./ForeignLanguageExportButton";
import { exportEnglishOutlineToWord, printEnglishOutline } from "@/services/englishOutlineExportService";

/**
 * OutlineExportActions.jsx (Bước 2 / Nhóm B)
 * Đúng khuôn WorksheetExportActions.jsx: LUÔN xuất đồng thời 2 file Word (Học sinh + GV-PH) vì
 * đề cương ôn tập luôn có đủ đáp án tin cậy (AI trả cùng lúc "dapAn"/"baiMauLoiGiai" cho MỌI bài,
 * không có nhánh phụ thuộc tuỳ chọn nào như "Kèm đáp số" ở Phiếu bài tập) - không cần checkbox.
 */
export default function OutlineExportActions({ outline, meta }) {
  const disabled = !outline?.kienThucCotLoi?.length;

  function handleWord() {
    exportOutlineBothVersions({ outline, meta });
  }

  return (
    <div className="no-print flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleWord}
          disabled={disabled}
          className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          <FileDown size={15} />
          Tải Word (2 file: Học sinh + GV-Phụ huynh)
        </button>
        <button
          onClick={exportToPDF}
          disabled={disabled}
          className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <Printer size={15} /> In / Tải PDF
        </button>
      </div>

      {/* "Bản ngoại ngữ" (hiện chỉ Tiếng Anh) - TỰ ẨN nếu môn học không hỗ trợ, xem
          foreignLanguageSubjects.js. 2 file Word tiếng Việt ở trên giữ NGUYÊN VẸN, không đổi. */}
      <ForeignLanguageExportButton
        subject={meta?.subject}
        contentKindLabel="a study outline (đề cương ôn tập)"
        getData={() => outline}
        disabled={disabled}
        onWord={(translated, languageConfig) =>
          exportEnglishOutlineToWord(translated, { grade: meta?.grade, subjectLabelEn: languageConfig.languageNameEn })
        }
        onPdf={(translated, languageConfig) =>
          printEnglishOutline(translated, { grade: meta?.grade, subjectLabelEn: languageConfig.languageNameEn })
        }
      />
    </div>
  );
}
