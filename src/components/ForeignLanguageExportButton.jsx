"use client";

import { useState } from "react";
import { FileDown, Printer, Loader2 } from "lucide-react";
import { findForeignLanguageConfig } from "@/data/foreignLanguageSubjects";
import { translateForeignLanguageRequest } from "@/services/apiClient";

/**
 * ForeignLanguageExportButton.jsx
 * Nút "Bản ngoại ngữ" DÙNG CHUNG cho cả 3 tab (Soạn Giáo Án/Đề Cương Ôn Tập/Đề Kiểm tra) - TỰ ẨN
 * hoàn toàn (return null) nếu môn học đang chọn không nằm trong danh bạ foreignLanguageSubjects.js
 * (hiện chỉ Tiếng Anh, mở rộng dễ dàng sau này) - không ảnh hưởng giao diện các môn khác.
 *
 * Không tự biết cách dựng file Word/PDF (mỗi tab có schema nội dung khác nhau) - chỉ lo phần DÙNG
 * CHUNG: gọi API dịch (/api/translate-foreign-language) + trạng thái loading/lỗi, rồi giao lại kết
 * quả đã dịch cho `onWord`/`onPdf` (do từng tab tự truyền vào, dùng đúng
 * englishLessonPlanExportService.js/englishOutlineExportService.js/englishExamExportService.js).
 *
 * @param subject - giá trị môn đang chọn (`meta.subject`, có thể là giá trị thô "Tieng_Anh" HOẶC
 *   nhãn "Tiếng Anh" tuỳ tab - xem findForeignLanguageConfig()).
 * @param contentKindLabel - mô tả ngắn loại tài liệu cho AI dịch (không hiển thị lên UI).
 * @param getData - () => object JSON tiếng Việt cần dịch (lessonPlan/outline/{questions,teacherRubric}).
 * @param onWord - async (translated, languageConfig) => void - xử lý xuất Word sau khi dịch xong.
 * @param onPdf - async (translated, languageConfig) => void - xử lý mở PDF sau khi dịch xong.
 * @param disabled - boolean, đồng bộ với điều kiện disabled của nút Word/PDF tiếng Việt cùng tab.
 */
export default function ForeignLanguageExportButton({ subject, contentKindLabel, getData, onWord, onPdf, disabled }) {
  const [loadingAction, setLoadingAction] = useState(null); // "word" | "pdf" | null
  const [error, setError] = useState("");

  const languageConfig = findForeignLanguageConfig(subject);
  if (!languageConfig) return null;

  async function runTranslateThen(action, handler) {
    if (!handler) return;
    setError("");
    setLoadingAction(action);
    try {
      const data = getData?.();
      if (!data) throw new Error("Chưa có nội dung để tạo bản ngoại ngữ - vui lòng tạo nội dung trước.");

      const res = await translateForeignLanguageRequest({ subject, contentKindLabel, data });
      await handler(res.translated, res.languageConfig || languageConfig);
    } catch (err) {
      setError(err.message || "Đã có lỗi xảy ra khi tạo bản ngoại ngữ.");
    } finally {
      setLoadingAction(null);
    }
  }

  const isBusy = Boolean(loadingAction);

  return (
    <div className="no-print flex flex-col gap-1">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => runTranslateThen("word", onWord)}
          disabled={disabled || isBusy}
          className="flex items-center gap-2 rounded-md border border-sky-300 bg-sky-50 px-3 py-2 text-sm text-sky-700 transition hover:bg-sky-100 disabled:opacity-50"
        >
          {loadingAction === "word" ? <Loader2 size={15} className="animate-spin" /> : <FileDown size={15} />}
          {languageConfig.buttonLabel} (Word)
        </button>
        <button
          type="button"
          onClick={() => runTranslateThen("pdf", onPdf)}
          disabled={disabled || isBusy}
          className="flex items-center gap-2 rounded-md border border-sky-300 bg-sky-50 px-3 py-2 text-sm text-sky-700 transition hover:bg-sky-100 disabled:opacity-50"
        >
          {loadingAction === "pdf" ? <Loader2 size={15} className="animate-spin" /> : <Printer size={15} />}
          {languageConfig.buttonLabel} (PDF)
        </button>
      </div>
      {loadingAction && <p className="text-xs text-slate-500">Đang dịch sang {languageConfig.languageNameEn}...</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
