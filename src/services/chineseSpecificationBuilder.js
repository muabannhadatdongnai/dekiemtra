import { DIFFICULTY_LEVELS } from "@/data/promptTemplates";

/**
 * chineseSpecificationBuilder.js
 * Bản TIẾNG TRUNG của specificationBuilder.js - dùng cho môn Tiếng Trung (Ngoại ngữ 2, Đề Kiểm
 * tra) khi giáo viên bật "Kèm Ma trận đề thi + Bản đặc tả" (chuẩn Thông tư 22). Nhân bản đúng
 * khuôn englishSpecificationBuilder.js (Phiên 35) - `computeExamMatrix()` bên
 * specificationBuilder.js đã TRUNG LẬP NGÔN NGỮ (chỉ tính số liệu theo chapterId/level) nên TÁI
 * DÙNG NGUYÊN VẸN cho mọi ngôn ngữ - chỉ cần viết lại `computeSpecificationRowsZh()` bên dưới.
 *
 * Đúng nguyên tắc "Isolation over DRY" của dự án: KHÔNG sửa specificationBuilder.js để nhận thêm
 * tham số ngôn ngữ - viết riêng bản này, chỉ áp dụng khi môn học là Tiếng Trung.
 */

const TYPE_ABBR_ZH = { trac_nghiem: "选择题", tu_luan: "论述题" };

// Nhãn tiếng Trung (giản thể) chuẩn cho 4 mức độ Thông tư 22 (Nhận biết/Thông hiểu/Vận dụng/Vận
// dụng cao) - dùng thuật ngữ sư phạm phổ biến trong tài liệu kiểm tra đánh giá song ngữ.
export const CHINESE_DIFFICULTY_LABELS = {
  NHAN_BIET: "识记",
  THONG_HIEU: "理解",
  VAN_DUNG: "应用",
  VAN_DUNG_CAO: "高阶应用",
};

const SPEC_REQUIREMENT_TEMPLATES_ZH = {
  NHAN_BIET: (chapterLabel) => `识记${chapterLabel}中的基本概念、公式和事实。`,
  THONG_HIEU: (chapterLabel) => `理解并运用${chapterLabel}的内容，进行简单（1-2 步）推理。`,
  VAN_DUNG: (chapterLabel) => `综合运用${chapterLabel}的多项知识解决实际情境问题。`,
  VAN_DUNG_CAO: (chapterLabel) => `创造性地运用${chapterLabel}的知识解决复杂问题（适合学习优秀的学生）。`,
};

/**
 * Đúng khuôn computeSpecificationRowsEn() (englishSpecificationBuilder.js) - CHỈ khác nhãn/câu mô
 * tả bằng tiếng Trung. Số liệu (stt, count, questionNumbers) tính GIỐNG HỆT.
 */
export function computeSpecificationRowsZh(questions, chaptersInfo, typeByLevel = {}) {
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
      const requirementFn = SPEC_REQUIREMENT_TEMPLATES_ZH[lvl];

      rows.push({
        stt: stt++,
        chapterLabel: chapter.label,
        levelLabel: CHINESE_DIFFICULTY_LABELS[lvl] || lvl,
        typeLabel: TYPE_ABBR_ZH[type] || "选择题",
        requirement: requirementFn ? requirementFn(chapter.label) : "",
        count: matched.length,
        questionNumbers: matched.map((q) => q.__no).join(", "),
      });
    });
  });

  return rows;
}
