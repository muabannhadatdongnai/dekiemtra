import { exportEnglishLessonPlanToWord, printEnglishLessonPlan } from "./englishLessonPlanExportService";
import { exportEnglishOutlineToWord, printEnglishOutline } from "./englishOutlineExportService";
import { exportEnglishExamToWord, printEnglishExam } from "./englishExamExportService";

import { exportChineseLessonPlanToWord, printChineseLessonPlan } from "./chineseLessonPlanExportService";
import { exportChineseOutlineToWord, printChineseOutline } from "./chineseOutlineExportService";
import { exportChineseExamToWord, printChineseExam } from "./chineseExamExportService";

import { exportJapaneseLessonPlanToWord, printJapaneseLessonPlan } from "./japaneseLessonPlanExportService";
import { exportJapaneseOutlineToWord, printJapaneseOutline } from "./japaneseOutlineExportService";
import { exportJapaneseExamToWord, printJapaneseExam } from "./japaneseExamExportService";

import { exportFrenchLessonPlanToWord, printFrenchLessonPlan } from "./frenchLessonPlanExportService";
import { exportFrenchOutlineToWord, printFrenchOutline } from "./frenchOutlineExportService";
import { exportFrenchExamToWord, printFrenchExam } from "./frenchExamExportService";

/**
 * foreignLanguageExportRegistry.js — Phiên 40 (Ngoại ngữ 2).
 * Tra bảng `languageCode` (khớp `FOREIGN_LANGUAGE_SUBJECTS[].languageCode` -
 * foreignLanguageSubjects.js) -> đúng bộ hàm xuất Word/PDF của ngôn ngữ đó, cho cả 3 tab (Soạn
 * Giáo Án/Đề Cương Ôn Tập/Đề Kiểm tra).
 *
 * Lý do có file này: trước Phiên 40, LessonPlanExportActions.jsx/OutlineExportActions.jsx/
 * ExportActions.jsx gọi CỨNG englishLessonPlanExportService.js/englishOutlineExportService.js/
 * englishExamExportService.js bất kể `languageCode` gì - khiến bấm "Tải Word" cho Tiếng
 * Trung/Nhật/Pháp xuất NHẦM sang khuôn tiếng Anh (xem NEXT_STEPS.md mục "Ngoại ngữ 2" trước Phiên
 * 40). Thay vì rải if/else theo languageCode ở CẢ 3 component (dễ quên cập nhật đồng bộ khi thêm
 * ngôn ngữ mới), tập trung bảng tra vào 1 nơi DUY NHẤT.
 *
 * ⚠️ File này CHỈ là 1 bảng tra cứu (registry/lookup) - KHÔNG chứa logic dựng docx/HTML nào. Từng
 * hàm build/export/print thật sự vẫn nằm tách biệt hoàn toàn ở english-, chinese-, japanese- và
 * french-ExportService.js tương ứng (đúng nguyên tắc Isolation over DRY - Hoan chọn Hướng A ở Phiên 40:
 * chấp nhận trùng lặp code dựng tài liệu giữa các ngôn ngữ, đổi lại sửa 1 ngôn ngữ không ảnh hưởng
 * ngôn ngữ khác). Thêm ngôn ngữ mới sau này: nhân bản 5 file dịch vụ (LessonPlan/Outline/Exam +
 * SpecificationBuilder + SpecificationExportBuilders) rồi thêm 1 entry vào bảng dưới đây - KHÔNG
 * cần sửa gì ở LessonPlanExportActions.jsx/OutlineExportActions.jsx/ExportActions.jsx.
 */
const FOREIGN_LANGUAGE_EXPORTERS = {
  en: {
    lessonPlan: { exportToWord: exportEnglishLessonPlanToWord, print: printEnglishLessonPlan },
    outline: { exportToWord: exportEnglishOutlineToWord, print: printEnglishOutline },
    exam: { exportToWord: exportEnglishExamToWord, print: printEnglishExam },
  },
  zh: {
    lessonPlan: { exportToWord: exportChineseLessonPlanToWord, print: printChineseLessonPlan },
    outline: { exportToWord: exportChineseOutlineToWord, print: printChineseOutline },
    exam: { exportToWord: exportChineseExamToWord, print: printChineseExam },
  },
  ja: {
    lessonPlan: { exportToWord: exportJapaneseLessonPlanToWord, print: printJapaneseLessonPlan },
    outline: { exportToWord: exportJapaneseOutlineToWord, print: printJapaneseOutline },
    exam: { exportToWord: exportJapaneseExamToWord, print: printJapaneseExam },
  },
  fr: {
    lessonPlan: { exportToWord: exportFrenchLessonPlanToWord, print: printFrenchLessonPlan },
    outline: { exportToWord: exportFrenchOutlineToWord, print: printFrenchOutline },
    exam: { exportToWord: exportFrenchExamToWord, print: printFrenchExam },
  },
};

/**
 * getForeignLanguageExporters(languageCode, docType)
 * @param docType - "lessonPlan" | "outline" | "exam"
 * @returns { exportToWord, print } hoặc `null` nếu languageCode không có trong bảng (component gọi
 *   nơi này PHẢI tự kiểm tra `null` trước khi gọi - xem findForeignLanguageConfig() ở
 *   foreignLanguageSubjects.js để lấy `languageCode` từ `meta.subject` trước).
 */
export function getForeignLanguageExporters(languageCode, docType) {
  return FOREIGN_LANGUAGE_EXPORTERS[languageCode]?.[docType] || null;
}
