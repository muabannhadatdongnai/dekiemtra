"use client";

import { useState } from "react";
import { FileDown, Printer } from "lucide-react";
import { exportLessonPlanToWord } from "@/services/lessonPlanExportService";
import { exportToPDF } from "@/services/exportService";
import { getForeignLanguageExporters } from "@/services/foreignLanguageExportRegistry";
import { findForeignLanguageConfig } from "@/data/foreignLanguageSubjects";

// GIAI ĐOẠN 10, Việc 6/7 - "cờ ẩn-hiện" phụ lục Lời dẫn khi xuất Word (KE_HOACH_GIAI_DOAN_10.md
// mục 2, đề xuất #2): mặc định TẮT (unchecked) để nút "Tải Word" luôn xuất ra "Bản nộp chuẩn"
// KHÔNG có phụ lục lời dẫn - đúng tinh thần AN TOÀN khi nộp Ban Giám hiệu (giáo viên phải CHỦ
// ĐỘNG tick mới có "Bản đầy đủ có lời dẫn"). Chỉ hiển thị checkbox này khi giáo án THẬT SỰ có dữ
// liệu "loiDan" (tích hợp "Lời dẫn" đã được bật lúc soạn) - không làm rối giao diện khi không có.
//
// ⚠️ Phiên 35: BỎ nút "🇬🇧 Bản tiếng Anh" riêng (ForeignLanguageExportButton.jsx - đã xoá) - khi
// môn học nằm trong danh bạ foreignLanguageSubjects.js, nút "Tải Word"/"In PDF" DUY NHẤT ở dưới tự
// động xuất bằng đúng ngôn ngữ đó (AI đã sinh nội dung trực tiếp bằng ngôn ngữ này từ
// lessonPlanPromptTemplates.js, không cần dịch lại) - xem PROJECT_SUMMARY.md Phiên 35.
//
// ⚠️ Phiên 36: englishLessonPlanExportService.js giờ hỗ trợ ĐỦ các tích hợp (Checklist NL-PC,
// STEM, Timeline, Bài tập phân hoá, Phiếu học tập, Lời dẫn, Slide Outline) - nên checkbox "Kèm phụ
// lục Lời dẫn" giờ hiển thị cho CẢ môn ngoại ngữ (trước đây bị ẩn hẳn qua điều kiện
// `!foreignLanguageConfig`), và `includeTeacherScript` được truyền xuống
// exportEnglishLessonPlanToWord()/printEnglishLessonPlan() giống hệt luồng tiếng Việt.
//
// ⚠️ Phiên 40: TRƯỚC ĐÂY gọi CỨNG exportEnglishLessonPlanToWord()/printEnglishLessonPlan() bất kể
// `languageCode` gì (viết từ Phiên 35 khi mới có 1 ngôn ngữ) - khiến Tiếng Trung/Nhật/Pháp xuất
// NHẦM sang khuôn tiếng Anh. Giờ tra theo `foreignLanguageConfig.languageCode` qua
// getForeignLanguageExporters() (foreignLanguageExportRegistry.js) để gọi đúng bộ hàm của từng
// ngôn ngữ - xem PROJECT_SUMMARY.md Phiên 40.
//
// ⚠️ FIX (Phiên 41) - trước đây khi `foreignLanguageConfig` tồn tại (môn nằm trong danh bạ Ngoại
// ngữ) NHƯNG `getForeignLanguageExporters()` trả về `null` (VD: có ai đó thêm 1 ngôn ngữ mới vào
// foreignLanguageSubjects.js nhưng QUÊN thêm entry tương ứng vào foreignLanguageExportRegistry.js -
// 2 file tách biệt, rất dễ quên đồng bộ), code CŨ âm thầm rơi xuống `exportLessonPlanToWord()` (bản
// tiếng Việt) - khiến giáo viên nhận nhầm file xuất theo khuôn/nhãn tiếng Việt cho nội dung ĐÃ được
// AI sinh bằng ngoại ngữ, mà KHÔNG có bất kỳ cảnh báo nào. Giờ coi đây là lỗi cấu hình THẬT SỰ: vô
// hiệu hoá 2 nút xuất + hiện cảnh báo rõ ràng, KHÔNG fallback êm xuôi.
export default function LessonPlanExportActions({ lessonPlan, timeline, meta }) {
  const [includeTeacherScript, setIncludeTeacherScript] = useState(false);
  const disabled = !lessonPlan;
  const hasTeacherScript = Boolean(lessonPlan?.loiDan?.length);
  const foreignLanguageConfig = findForeignLanguageConfig(meta?.subject);
  const exporters = foreignLanguageConfig
    ? getForeignLanguageExporters(foreignLanguageConfig.languageCode, "lessonPlan")
    : null;
  // Môn học CÓ trong danh bạ Ngoại ngữ nhưng KHÔNG có bộ hàm xuất tương ứng trong registry - lỗi
  // cấu hình (thiếu đồng bộ 2 file), không phải trường hợp bình thường "môn tiếng Việt".
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
      exporters.exportToWord(
        lessonPlan,
        {
          tenBai: meta?.tenBai,
          grade: meta?.grade,
          soTiet: meta?.soTiet,
          subjectLabelEn: foreignLanguageConfig.languageNameEn,
          columnMode: meta?.columnMode,
          lessonType: meta?.lessonType,
          timeline,
        },
        { includeTeacherScript }
      );
      return;
    }
    exportLessonPlanToWord({ lessonPlan, timeline, meta, includeTeacherScript });
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
      exporters.print(
        lessonPlan,
        {
          tenBai: meta?.tenBai,
          grade: meta?.grade,
          soTiet: meta?.soTiet,
          subjectLabelEn: foreignLanguageConfig.languageNameEn,
          columnMode: meta?.columnMode,
          lessonType: meta?.lessonType,
          timeline,
        },
        { includeTeacherScript }
      );
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
      {hasTeacherScript && (
        <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={includeTeacherScript}
            onChange={(e) => setIncludeTeacherScript(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Kèm phụ lục Lời dẫn khi tải Word (Bản đầy đủ - không dùng để nộp Ban Giám hiệu)
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleWord}
          disabled={disabled || exporterMisconfigured}
          className="flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          <FileDown size={15} /> Tải Word
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
