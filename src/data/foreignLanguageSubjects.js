/**
 * foreignLanguageSubjects.js
 * Danh bạ các MÔN NGOẠI NGỮ được phép xuất thêm 1 bộ Word/PDF HOÀN TOÀN bằng chính ngôn ngữ đó,
 * TÁCH BIỆT HẲN với bộ Word/PDF tiếng Việt gốc (vốn vẫn giữ nguyên không đổi) - áp dụng cho 3 tab
 * Soạn Giáo Án / Đề Cương Ôn Tập / Đề Kiểm tra.
 *
 * ⚠️ THIẾT KẾ ĐỂ DỄ MỞ RỘNG (yêu cầu gốc: "còn có môn tiếng Trung, tiếng Pháp..."): TOÀN BỘ hệ
 * thống dịch + xuất file (foreignLanguageTranslationEngine.js, foreignLanguageDocBuilder.js,
 * englishLessonPlanExportService.js/englishOutlineExportService.js/englishExamExportService.js,
 * ForeignLanguageExportButton.jsx) đều đọc cấu hình ngôn ngữ từ ĐÚNG danh bạ này - KHÔNG hard-code
 * chữ "tiếng Anh"/"English" rải rác. Muốn thêm môn Tiếng Trung/Tiếng Pháp sau này, CHỈ cần:
 *   1. Thêm 1 entry mới vào mảng dưới đây (subjectValue khớp đúng giá trị trong SUBJECTS ở
 *      config.js, vd "Tieng_Trung"/"Tieng_Phap" nếu/khi các môn đó được thêm vào config.js).
 *   2. KHÔNG cần sửa bất kỳ file service/component nào khác - toàn bộ luồng dịch (Gemini JSON
 *      dịch nguyên khối, giữ nguyên cấu trúc/khoá) và luồng xuất Word/PDF đều tổng quát theo
 *      languageNameEn/languageCode, không phụ thuộc ngôn ngữ cụ thể.
 *
 * `docLabel`: nhãn in ở trang bìa bản dịch (VD "ENGLISH VERSION"). `buttonLabel`: nhãn nút bấm
 * trên giao diện (có cờ quốc gia cho dễ nhận diện nhanh).
 */

export const FOREIGN_LANGUAGE_SUBJECTS = [
  {
    subjectValue: "Tieng_Anh",
    subjectLabelVi: "Tiếng Anh",
    languageCode: "en",
    languageNameEn: "English",
    docLabel: "ENGLISH VERSION",
    buttonLabel: "🇬🇧 Bản tiếng Anh",
  },
  // Chỗ mở rộng sau này, VD:
  // {
  //   subjectValue: "Tieng_Trung",
  //   subjectLabelVi: "Tiếng Trung",
  //   languageCode: "zh",
  //   languageNameEn: "Chinese (Simplified)",
  //   docLabel: "中文版本",
  //   buttonLabel: "🇨🇳 Bản tiếng Trung",
  // },
];

/**
 * Tra cứu cấu hình ngôn ngữ theo GIÁ TRỊ môn (vd "Tieng_Anh") HOẶC theo NHÃN tiếng Việt (vd
 * "Tiếng Anh") - vì 3 tab hiện lưu `meta.subject` khác định dạng nhau: Soạn giáo án/Đề cương Ôn
 * tập lưu giá trị thô, riêng Đề kiểm tra lưu sẵn nhãn hiển thị (xem ExamMatrixForm.jsx) - tra theo
 * cả 2 để 1 hàm dùng chung được cho cả 3 nơi, không phải sửa lại chỗ lưu meta cũ.
 */
export function findForeignLanguageConfig(subjectValueOrLabel) {
  if (!subjectValueOrLabel) return null;
  return (
    FOREIGN_LANGUAGE_SUBJECTS.find(
      (c) => c.subjectValue === subjectValueOrLabel || c.subjectLabelVi === subjectValueOrLabel
    ) || null
  );
}

export function supportsForeignLanguageExport(subjectValueOrLabel) {
  return Boolean(findForeignLanguageConfig(subjectValueOrLabel));
}
