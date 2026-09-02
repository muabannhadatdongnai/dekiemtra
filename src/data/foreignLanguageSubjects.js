/**
 * foreignLanguageSubjects.js
 * Danh bạ các MÔN NGOẠI NGỮ mà AI sinh nội dung TRỰC TIẾP bằng chính ngôn ngữ đó ngay từ lượt gọi
 * Gemini đầu tiên (KHÔNG còn sinh tiếng Việt rồi dịch lại như trước Phiên 35) - áp dụng cho 3 tab
 * Soạn Giáo Án / Đề Cương Ôn Tập / Đề Kiểm tra. Bản Word/PDF xuất ra CŨNG bằng ngôn ngữ đó luôn
 * (dùng englishLessonPlanExportService.js/englishOutlineExportService.js/englishExamExportService.js
 * làm bản DUY NHẤT, không còn bản tiếng Việt song song cho các môn này).
 *
 * ⚠️ Phiên 35 - ĐỔI KIẾN TRÚC: trước đây môn Tiếng Anh sinh tiếng Việt trước, giáo viên bấm nút
 * "🇬🇧 Bản tiếng Anh" mới gọi thêm 1 lượt Gemini dịch lại toàn bộ JSON sang tiếng Anh (xem lịch sử ở
 * PROJECT_SUMMARY.md Phiên 34). Nhược điểm: tốn gấp đôi lượt gọi Gemini (ảnh hưởng quota free tier),
 * và bản mặc định (tiếng Việt) không dùng được thật cho 1 tiết học tiếng Anh. Từ Phiên 35: khi môn
 * học nằm trong danh bạ này, prompt sinh nội dung (lessonPlanPromptTemplates.js/
 * outlinePromptTemplates.js/promptTemplates.js) tự chèn "chỉ thị ngôn ngữ" bên dưới NGAY LÚC SINH,
 * nên JSON trả về đã bằng đúng ngôn ngữ đó - không cần dịch lại, không cần nút riêng.
 *
 * ⚠️ THIẾT KẾ ĐỂ DỄ MỞ RỘNG (yêu cầu gốc: "còn có môn tiếng Trung, tiếng Pháp..."): TOÀN BỘ hệ
 * thống sinh nội dung (buildForeignLanguageOutputDirective bên dưới) + xuất file
 * (foreignLanguageDocBuilder.js, englishLessonPlanExportService.js/englishOutlineExportService.js/
 * englishExamExportService.js) đều đọc cấu hình ngôn ngữ từ ĐÚNG danh bạ này - KHÔNG hard-code chữ
 * "tiếng Anh"/"English" rải rác. Muốn thêm môn Tiếng Trung/Tiếng Pháp sau này, CHỈ cần:
 *   1. Thêm 1 entry mới vào mảng dưới đây (subjectValue khớp đúng giá trị trong SUBJECTS ở
 *      config.js, vd "Tieng_Trung"/"Tieng_Phap" nếu/khi các môn đó được thêm vào config.js).
 *   2. Nhân bản 1 bộ englishLessonPlanExportService.js/englishOutlineExportService.js/
 *      englishExamExportService.js (đổi tiêu đề tĩnh "LESSON PLAN"/"QUESTIONS"... sang ngôn ngữ
 *      mới) rồi tra theo `languageCode` ở nơi routing xuất file (xem LessonPlanExportActions.jsx/
 *      OutlineExportActions.jsx/ExportActions.jsx) - phần PROMPT (nội dung do AI sinh) KHÔNG cần
 *      sửa gì thêm, tự động áp dụng theo `languageNameEn` của entry mới.
 *
 * `docLabel`: nhãn in ở trang bìa tài liệu (VD "ENGLISH VERSION" - hiện chưa dùng vì trang bìa
 * dùng tiêu đề tĩnh trong từng english*ExportService.js, giữ lại field này cho ngôn ngữ mới sau
 * này nếu muốn in thêm dòng phụ đề). `buttonLabel`: hiện KHÔNG còn dùng cho nút riêng (đã bỏ nút
 * "Bản ngoại ngữ" từ Phiên 35), giữ lại phòng khi cần hiển thị nhãn nhận diện môn học ở UI khác.
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

/**
 * buildForeignLanguageOutputDirective(subjectValueOrLabel, { exemptJsonFields })
 * Trả về 1 đoạn chỉ thị chèn vào CUỐI phần "QUY TẮC RIÊNG CHO MÔN..." của cả 3 prompt (Soạn Giáo
 * Án/Đề Cương Ôn Tập/Đề Kiểm tra) khi môn học nằm trong danh bạ FOREIGN_LANGUAGE_SUBJECTS - ép AI
 * viết TOÀN BỘ giá trị text trong JSON trả về bằng đúng ngôn ngữ đó (không chỉ riêng đề bài/đáp án
 * như quy tắc cũ trong subjectProfiles.js), để bản Word/PDF xuất ra dùng được ngay, không cần dịch
 * lại. Trả về chuỗi RỖNG nếu môn học không phải ngoại ngữ - gọi an toàn ở MỌI prompt mà không cần
 * kiểm tra điều kiện trước (đúng khuôn buildForeignLanguageOutputDirective(subject) không cần if).
 *
 * @param exemptJsonFields - mảng tên field JSON (khớp đúng `jsonField` trong
 *   lessonPlanIntegrations.js, VD "tinNhanPhuHuynh") vẫn PHẢI giữ nguyên tiếng Việt dù cả tài liệu
 *   còn lại bằng ngoại ngữ - vì field đó dành cho người đọc tiếng Việt (phụ huynh), không phải học
 *   sinh/nội dung học thuật. Soạn Giáo Án truyền field này vào, Đề Cương Ôn Tập/Đề Kiểm tra không
 *   có phụ lục kiểu này nên truyền mảng rỗng.
 */
export function buildForeignLanguageOutputDirective(subjectValueOrLabel, { exemptJsonFields = [] } = {}) {
  const cfg = findForeignLanguageConfig(subjectValueOrLabel);
  if (!cfg) return "";

  const exemptNote = exemptJsonFields.length
    ? `\n- ⚠️ NGOẠI LỆ DUY NHẤT: (các) trường JSON ${exemptJsonFields
        .map((f) => `"${f}"`)
        .join(", ")} vẫn PHẢI viết bằng TIẾNG VIỆT như bình thường (nội dung này dành cho phụ
  huynh học sinh đọc trực tiếp, không phải ngữ liệu học thuật) - KHÔNG dịch/viết field này bằng
  ${cfg.languageNameEn}.`
    : "";

  return `
- ⚠️ MÔN HỌC NGOẠI NGỮ (${cfg.subjectLabelVi}) - CHỈ THỊ NGÔN NGỮ ĐẦU RA GHI ĐÈ LÊN MỌI QUY TẮC
  "Ngôn ngữ: Tiếng Việt" ở trên: TOÀN BỘ giá trị văn bản (text) ở MỌI trường JSON trả về - kể cả
  tiêu đề, mục tiêu, hướng dẫn, mô tả hoạt động, câu hỏi, phương án, đáp án, lời giải, nhận xét...
  - PHẢI viết bằng ${cfg.languageNameEn}, HOÀN TOÀN KHÔNG chen tiếng Việt vào (trừ đúng 1 ngoại lệ
  nêu bên dưới nếu có). Hãy tưởng tượng bạn đang soạn tài liệu này để dùng trực tiếp tại 1 trường
  học nói ${cfg.languageNameEn}, không phải viết cho người đọc tiếng Việt rồi chờ dịch lại.
- Số thập phân trong tài liệu ${cfg.languageNameEn} dùng DẤU CHẤM (.) theo đúng chuẩn quốc tế (VD
  "3.5"), KHÔNG dùng dấu phẩy kiểu Việt Nam - ghi đè lên quy tắc "số thập phân dùng dấu phẩy" nói
  chung ở trên (quy tắc đó chỉ áp dụng cho tài liệu tiếng Việt).${exemptNote}`;
}
