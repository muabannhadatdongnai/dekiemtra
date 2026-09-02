import { DIFFICULTY_LEVELS } from "@/data/promptTemplates";

/**
 * englishSpecificationBuilder.js
 * Bản TIẾNG ANH của specificationBuilder.js - dùng cho môn Tiếng Anh (Đề Kiểm tra) khi giáo viên
 * bật "Kèm Ma trận đề thi + Bản đặc tả" (chuẩn Thông tư 22). `computeExamMatrix()` bên
 * specificationBuilder.js đã TRUNG LẬP NGÔN NGỮ (chỉ tính số liệu theo chapterId/level, không gắn
 * nhãn tiếng Việt vào dữ liệu trả về) nên TÁI DÙNG NGUYÊN VẸN cho cả 2 ngôn ngữ - chỉ cần viết lại
 * `computeSpecificationRowsEn()` bên dưới vì bản gốc (computeSpecificationRows) có gắn CỨNG
 * `levelLabel`/`requirement` bằng tiếng Việt vào từng dòng.
 *
 * Đúng nguyên tắc "Isolation over DRY" của dự án: KHÔNG sửa specificationBuilder.js để nhận thêm
 * tham số ngôn ngữ (tránh rủi ro ảnh hưởng ngược lại mọi môn học khác đang hoạt động ổn định) -
 * thay vào đó viết 1 bản riêng chỉ áp dụng khi môn học nằm trong danh bạ foreignLanguageSubjects.js.
 */

const TYPE_ABBR_EN = { trac_nghiem: "MC", tu_luan: "Essay" };

// Nhãn tiếng Anh CHUẨN cho 4 mức độ Thông tư 22 (Nhận biết/Thông hiểu/Vận dụng/Vận dụng cao) -
// dùng đúng cách dịch phổ biến trong tài liệu song ngữ của Bộ GD&ĐT.
export const ENGLISH_DIFFICULTY_LABELS = {
  NHAN_BIET: "Knowledge",
  THONG_HIEU: "Comprehension",
  VAN_DUNG: "Application",
  VAN_DUNG_CAO: "Higher-order Application",
};

const SPEC_REQUIREMENT_TEMPLATES_EN = {
  NHAN_BIET: (chapterLabel) => `Recall basic concepts, formulas, and facts from ${chapterLabel}.`,
  THONG_HIEU: (chapterLabel) =>
    `Understand and apply ${chapterLabel} content with simple (1-2 step) reasoning.`,
  VAN_DUNG: (chapterLabel) =>
    `Combine multiple pieces of knowledge from ${chapterLabel} to solve a realistic situation.`,
  VAN_DUNG_CAO: (chapterLabel) =>
    `Apply ${chapterLabel} knowledge creatively to a complex problem (for high-achieving students).`,
};

/**
 * Đúng khuôn computeSpecificationRows() (specificationBuilder.js) - CHỈ khác nhãn/câu mô tả bằng
 * tiếng Anh. Số liệu (stt, count, questionNumbers) tính GIỐNG HỆT, vì dựa trên questions/chaptersInfo
 * đầu vào, không phụ thuộc ngôn ngữ.
 */
export function computeSpecificationRowsEn(questions, chaptersInfo, typeByLevel = {}) {
  const levelKeys = Object.keys(DIFFICULTY_LEVELS);
  const rows = [];
  let stt = 1;

  const questionsWithIndex = questions.map((q, idx) => ({ ...q, __no: idx + 1 }));

  chaptersInfo.forEach((chapter) => {
    levelKeys.forEach((lvl) => {
      const matched = questionsWithIndex.filter(
        (q) => q.chapterRef === chapter.chapterId && q.level === lvl
      );
      if (matched.length === 0) return;

      const type = typeByLevel[lvl] || "trac_nghiem";
      const requirementFn = SPEC_REQUIREMENT_TEMPLATES_EN[lvl];

      rows.push({
        stt: stt++,
        chapterLabel: chapter.label,
        levelLabel: ENGLISH_DIFFICULTY_LABELS[lvl] || lvl,
        typeLabel: TYPE_ABBR_EN[type] || "MC",
        requirement: requirementFn ? requirementFn(chapter.label) : "",
        count: matched.length,
        questionNumbers: matched.map((q) => q.__no).join(", "),
      });
    });
  });

  return rows;
}
