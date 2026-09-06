import { DIFFICULTY_LEVELS } from "@/data/promptTemplates";

/**
 * japaneseSpecificationBuilder.js
 * Bản TIẾNG NHẬT của specificationBuilder.js - dùng cho môn Tiếng Nhật (Ngoại ngữ 2, Đề Kiểm tra)
 * khi giáo viên bật "Kèm Ma trận đề thi + Bản đặc tả" (chuẩn Thông tư 22). Nhân bản đúng khuôn
 * englishSpecificationBuilder.js/chineseSpecificationBuilder.js - `computeExamMatrix()` bên
 * specificationBuilder.js TRUNG LẬP NGÔN NGỮ nên TÁI DÙNG NGUYÊN VẸN, chỉ viết lại
 * `computeSpecificationRowsJa()` bên dưới.
 */

const TYPE_ABBR_JA = { trac_nghiem: "選択式", tu_luan: "記述式" };

// Nhãn tiếng Nhật chuẩn cho 4 mức độ Thông tư 22 (Nhận biết/Thông hiểu/Vận dụng/Vận dụng cao).
export const JAPANESE_DIFFICULTY_LABELS = {
  NHAN_BIET: "知識・理解",
  THONG_HIEU: "理解",
  VAN_DUNG: "応用",
  VAN_DUNG_CAO: "発展的応用",
};

const SPEC_REQUIREMENT_TEMPLATES_JA = {
  NHAN_BIET: (chapterLabel) => `${chapterLabel}の基本的な概念・公式・事実を覚えている。`,
  THONG_HIEU: (chapterLabel) => `${chapterLabel}の内容を理解し、簡単な（1〜2段階の）推論で応用できる。`,
  VAN_DUNG: (chapterLabel) => `${chapterLabel}の複数の知識を組み合わせて、現実的な場面の問題を解決できる。`,
  VAN_DUNG_CAO: (chapterLabel) => `${chapterLabel}の知識を創造的に応用し、複雑な問題を解決できる（学力上位の生徒向け）。`,
};

/** Đúng khuôn computeSpecificationRowsEn()/computeSpecificationRowsZh() - chỉ khác nhãn tiếng Nhật. */
export function computeSpecificationRowsJa(questions, chaptersInfo, typeByLevel = {}) {
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
      const requirementFn = SPEC_REQUIREMENT_TEMPLATES_JA[lvl];

      rows.push({
        stt: stt++,
        chapterLabel: chapter.label,
        levelLabel: JAPANESE_DIFFICULTY_LABELS[lvl] || lvl,
        typeLabel: TYPE_ABBR_JA[type] || "選択式",
        requirement: requirementFn ? requirementFn(chapter.label) : "",
        count: matched.length,
        questionNumbers: matched.map((q) => q.__no).join(", "),
      });
    });
  });

  return rows;
}
