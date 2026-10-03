"use client";

import { FileDown, Loader2, Sparkles } from "lucide-react";
import { exportVocabToWord } from "@/services/vocabExportService";
import { runVocabEnrich, countMissing } from "@/services/vocabEnrichClient";

/**
 * VocabExportActions.jsx (Phiên 51b - tab "Soạn từ vựng")
 * Phiên âm/loại từ giờ được AI điền TỰ ĐỘNG lúc bấm "Tạo bản soạn" (xem VocabForm.jsx). Nút ở đây còn lại
 * để "Bổ sung lại" (AI lỗi/hết lượt, hoặc sau khi giáo viên thêm từ mới) - chỉ điền ô còn TRỐNG, ô do AI
 * điền được tô vàng để rà lại. Trạng thái (đang chạy/thông báo/lỗi) nằm trong result.enrich.
 * KHÔNG có "In/Tải PDF" - tab này không dùng id="print-area" (cùng lý do tab Khung KHGD).
 */
export default function VocabExportActions({ result, onResultChange }) {
  const words = result?.words || [];
  const missing = countMissing(words);
  const enrich = result?.enrich || {};
  const loading = Boolean(enrich.loading);
  const disabled = !words.length;

  function handleEnrich() {
    runVocabEnrich({
      sheetId: result.sheetId,
      subject: result.meta?.subject || "Tieng_Anh",
      words,
      grade: result.meta?.grade ?? null,
      setResult: onResultChange,
    });
  }

  return (
    <div className="no-print space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleEnrich}
          disabled={disabled || loading || missing === 0}
          className="flex items-center gap-2 rounded-md border border-brand-600 bg-white px-3 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50 disabled:opacity-50"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {loading ? "AI đang điền phiên âm/loại từ/ví dụ..." : missing > 0 ? `Bổ sung lại phiên âm/loại từ/ví dụ (${missing} từ thiếu)` : "Phiên âm/loại từ/ví dụ đã đủ"}
        </button>
        <button
          onClick={() => exportVocabToWord({ header: result.header, words, grammar: result.grammar, meta: result.meta })}
          disabled={disabled}
          className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          <FileDown size={15} /> Tải Word (A4 dọc)
        </button>
      </div>
      {enrich.message && <p className="rounded-md bg-amber-50 p-2 text-xs text-amber-800">{enrich.message}</p>}
      {enrich.error && <p className="rounded-md bg-red-50 p-2 text-xs text-red-700">{enrich.error}</p>}
    </div>
  );
}
