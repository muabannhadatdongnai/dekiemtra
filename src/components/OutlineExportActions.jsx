"use client";

import { FileDown, Printer } from "lucide-react";
import { exportOutlineBothVersions } from "@/services/outlineExportService";
import { exportToPDF } from "@/services/exportService";
import { getForeignLanguageExporters } from "@/services/foreignLanguageExportRegistry";
import { findForeignLanguageConfig } from "@/data/foreignLanguageSubjects";

/**
 * OutlineExportActions.jsx (Bước 2 / Nhóm B)
 * Đúng khuôn WorksheetExportActions.jsx: LUÔN xuất đồng thời 2 file Word (Học sinh + GV-PH) vì
 * đề cương ôn tập luôn có đủ đáp án tin cậy (AI trả cùng lúc "dapAn"/"baiMauLoiGiai" cho MỌI bài,
 * không có nhánh phụ thuộc tuỳ chọn nào như "Kèm đáp số" ở Phiếu bài tập) - không cần checkbox.
 *
 * ⚠️ Phiên 35: BỎ nút "🇬🇧 Bản tiếng Anh" riêng (ForeignLanguageExportButton.jsx - đã xoá) - khi
 * môn học nằm trong danh bạ foreignLanguageSubjects.js, nút "Tải Word"/"In PDF" DUY NHẤT ở dưới tự
 * động xuất 1 file DUY NHẤT bằng đúng ngôn ngữ đó (xem docstring englishOutlineExportService.js
 * lý do chỉ 1 file thay vì 2).
 *
 * ⚠️ Phiên 40: tra hàm xuất theo `foreignLanguageConfig.languageCode` qua
 * getForeignLanguageExporters() (foreignLanguageExportRegistry.js) thay vì gọi cứng
 * exportEnglishOutlineToWord()/printEnglishOutline() - để Tiếng Trung/Nhật/Pháp xuất đúng ngôn ngữ
 * của môn học thay vì luôn rơi về tiếng Anh.
 *
 * ⚠️ FIX (Phiên 41) - cùng lỗi/sửa như LessonPlanExportActions.jsx: trước đây nếu
 * `foreignLanguageConfig` tồn tại nhưng registry THIẾU entry (lỗi cấu hình - quên đồng bộ 2 file),
 * code cũ âm thầm fallback về `exportOutlineBothVersions()` (bản tiếng Việt). Giờ vô hiệu hoá nút +
 * cảnh báo rõ ràng thay vì xuất nhầm khuôn ngôn ngữ.
 */
export default function OutlineExportActions({ outline, meta }) {
  const disabled = !outline?.kienThucCotLoi?.length;
  const foreignLanguageConfig = findForeignLanguageConfig(meta?.subject);
  const exporters = foreignLanguageConfig
    ? getForeignLanguageExporters(foreignLanguageConfig.languageCode, "outline")
    : null;
  const exporterMisconfigured = Boolean(foreignLanguageConfig) && !exporters;

  function handleWord() {
    if (exporterMisconfigured) {
      window.alert(
        `Lỗi cấu hình: chưa có bộ hàm xuất Word cho ngôn ngữ "${foreignLanguageConfig.languageCode}". ` +
          "Vui lòng báo cho người phát triển (thiếu entry trong foreignLanguageExportRegistry.js)."
      );
      return;
    }
    if (exporters) {
      exporters.exportToWord(outline, { grade: meta?.grade, subjectLabelEn: foreignLanguageConfig.languageNameEn });
      return;
    }
    exportOutlineBothVersions({ outline, meta });
  }

  function handlePdf() {
    if (exporterMisconfigured) {
      window.alert(
        `Lỗi cấu hình: chưa có bộ hàm in/xuất PDF cho ngôn ngữ "${foreignLanguageConfig.languageCode}". ` +
          "Vui lòng báo cho người phát triển (thiếu entry trong foreignLanguageExportRegistry.js)."
      );
      return;
    }
    if (exporters) {
      exporters.print(outline, { grade: meta?.grade, subjectLabelEn: foreignLanguageConfig.languageNameEn });
      return;
    }
    exportToPDF();
  }

  return (
    <div className="no-print flex flex-col gap-2">
      {exporterMisconfigured && (
        <p className="text-sm font-medium text-red-600">
          ⚠️ Lỗi cấu hình: chưa hỗ trợ xuất file cho ngôn ngữ này (thiếu entry trong registry) - đã
          tắt tạm 2 nút xuất bên dưới để tránh xuất nhầm khuôn tiếng Việt. Vui lòng báo lỗi.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleWord}
          disabled={disabled || exporterMisconfigured}
          className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          <FileDown size={15} />
          {foreignLanguageConfig ? "Tải Word" : "Tải Word (2 file: Học sinh + GV-Phụ huynh)"}
        </button>
        <button
          onClick={handlePdf}
          disabled={disabled || exporterMisconfigured}
          className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <Printer size={15} /> In / Tải PDF
        </button>
      </div>
    </div>
  );
}
