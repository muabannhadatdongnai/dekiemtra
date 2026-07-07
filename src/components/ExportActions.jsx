"use client";

import { FileDown, Printer, Shuffle } from "lucide-react";
import { exportToWord, exportToPDF, generateFourExamVariants } from "@/services/exportService";

export default function ExportActions({
  examMeta,
  questions,
  teacherRubric,
  variants,
  activeVariantIndex,
  onVariantsGenerated,
  onSelectVariant,
}) {
  const disabled = !questions?.length;

  function handleGenerateVariants() {
    const originalQuestions = variants?.length ? variants[activeVariantIndex].questions : questions;
    const newVariants = generateFourExamVariants(originalQuestions);
    onVariantsGenerated(newVariants);
  }

  function handleWord() {
    const active = variants?.length ? variants[activeVariantIndex] : { examCode: examMeta?.examCode, questions };
    exportToWord({
      title: examMeta?.title,
      schoolName: examMeta?.schoolName,
      className: examMeta?.className,
      grade: examMeta?.grade,
      subject: examMeta?.subject,
      examCode: active.examCode,
      duration: examMeta?.duration,
      academicYear: examMeta?.academicYear,
      questions: active.questions,
      teacherRubric,
    });
  }

  return (
    <div className="no-print space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleGenerateVariants}
          disabled={disabled}
          className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <Shuffle size={15} /> Tạo 4 Mã Đề (A, B, C, D)
        </button>
        <button
          onClick={handleWord}
          disabled={disabled}
          className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <FileDown size={15} /> Tải Word (.docx)
        </button>
        <button
          onClick={exportToPDF}
          disabled={disabled}
          className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          <Printer size={15} /> In / Tải PDF
        </button>
      </div>

      {variants?.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Xem trước mã đề:</span>
          {variants.map((v, i) => (
            <button
              key={v.code}
              type="button"
              onClick={() => onSelectVariant(i)}
              className={`rounded-md border px-3 py-1 text-xs font-medium transition ${
                i === activeVariantIndex
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Mã {v.examCode}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
