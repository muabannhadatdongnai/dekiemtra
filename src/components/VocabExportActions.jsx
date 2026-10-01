"use client";

import { useState } from "react";
import { FileDown, Loader2, Sparkles } from "lucide-react";
import { exportVocabToWord } from "@/services/vocabExportService";
import { enrichVocabRequest } from "@/services/apiClient";

/**
 * VocabExportActions.jsx (Phiên 51 - tab "Soạn từ vựng")
 * 2 nút: "AI bổ sung phiên âm/loại từ" (chỉ điền ô còn TRỐNG, ô do AI điền được tô vàng để rà lại) và
 * "Tải Word (A4 dọc)". KHÔNG có "In/Tải PDF" - tab này không dùng id="print-area" (cùng lý do tab Khung KHGD).
 */
export default function VocabExportActions({ result, onResultChange }) {
  const [enriching, setEnriching] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const words = result?.words || [];
  const missing = words.filter((w) => w.word?.trim() && (!w.ipa?.trim() || !w.type?.trim())).length;
  const disabled = !words.length;

  async function handleEnrich() {
    setError("");
    setMessage("");
    setEnriching(true);
    try {
      const data = await enrichVocabRequest({
        subject: result.meta?.subject || "Tieng_Anh",
        words: words.map(({ id, word, ipa, type, meaning }) => ({ id, word, ipa, type, meaning })),
      });
      const byId = new Map((data.words || []).map((w) => [String(w.id), w]));
      // Chỉ nhận ô còn TRỐNG ở máy khách (giáo viên có thể vừa gõ tay trong lúc chờ) - không ghi đè.
      const merged = words.map((w) => {
        const ai = byId.get(String(w.id));
        if (!ai) return w;
        const next = { ...w };
        if (!w.ipa?.trim() && ai.ipa) { next.ipa = ai.ipa; next.aiIpa = true; }
        if (!w.type?.trim() && ai.type) { next.type = ai.type; next.aiType = true; }
        return next;
      });
      onResultChange({ ...result, words: merged });
      setMessage(`AI đã điền ${data.filledIpa || 0} phiên âm và ${data.filledType || 0} loại từ (tô vàng) - vui lòng rà lại trước khi in.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnriching(false);
    }
  }

  return (
    <div className="no-print space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleEnrich}
          disabled={disabled || enriching || missing === 0}
          className="flex items-center gap-2 rounded-md border border-brand-600 bg-white px-3 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50 disabled:opacity-50"
        >
          {enriching ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          AI bổ sung phiên âm/loại từ{missing > 0 ? ` (${missing} từ thiếu)` : ""}
        </button>
        <button
          onClick={() => exportVocabToWord({ header: result.header, words, grammar: result.grammar, meta: result.meta })}
          disabled={disabled}
          className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          <FileDown size={15} /> Tải Word (A4 dọc)
        </button>
      </div>
      {message && <p className="rounded-md bg-amber-50 p-2 text-xs text-amber-800">{message}</p>}
      {error && <p className="rounded-md bg-red-50 p-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
