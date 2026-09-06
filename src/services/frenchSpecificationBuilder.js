import { DIFFICULTY_LEVELS } from "@/data/promptTemplates";

/**
 * frenchSpecificationBuilder.js
 * Bản TIẾNG PHÁP của specificationBuilder.js - dùng cho môn Tiếng Pháp (Ngoại ngữ 2, Đề Kiểm tra)
 * khi giáo viên bật "Kèm Ma trận đề thi + Bản đặc tả" (chuẩn Thông tư 22). Nhân bản đúng khuôn
 * englishSpecificationBuilder.js - `computeExamMatrix()` bên specificationBuilder.js TRUNG LẬP
 * NGÔN NGỮ nên TÁI DÙNG NGUYÊN VẸN, chỉ viết lại `computeSpecificationRowsFr()` bên dưới.
 *
 * Tiếng Pháp dùng bảng chữ Latinh (có dấu phụ) - "Times New Roman" hiển thị đầy đủ, KHÔNG cần
 * `eastAsia` như bản tiếng Trung/Nhật.
 */

const TYPE_ABBR_FR = { trac_nghiem: "QCM", tu_luan: "Rédaction" };

// Nhãn tiếng Pháp chuẩn cho 4 mức độ Thông tư 22 (Nhận biết/Thông hiểu/Vận dụng/Vận dụng cao).
export const FRENCH_DIFFICULTY_LABELS = {
  NHAN_BIET: "Connaissance",
  THONG_HIEU: "Compréhension",
  VAN_DUNG: "Application",
  VAN_DUNG_CAO: "Application avancée",
};

const SPEC_REQUIREMENT_TEMPLATES_FR = {
  NHAN_BIET: (chapterLabel) => `Se souvenir des concepts, formules et faits de base de ${chapterLabel}.`,
  THONG_HIEU: (chapterLabel) =>
    `Comprendre et appliquer le contenu de ${chapterLabel} avec un raisonnement simple (1 à 2 étapes).`,
  VAN_DUNG: (chapterLabel) =>
    `Combiner plusieurs connaissances de ${chapterLabel} pour résoudre une situation réaliste.`,
  VAN_DUNG_CAO: (chapterLabel) =>
    `Appliquer les connaissances de ${chapterLabel} de manière créative à un problème complexe (pour les élèves les plus avancés).`,
};

/** Đúng khuôn computeSpecificationRowsEn() - CHỈ khác nhãn/câu mô tả bằng tiếng Pháp. */
export function computeSpecificationRowsFr(questions, chaptersInfo, typeByLevel = {}) {
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
      const requirementFn = SPEC_REQUIREMENT_TEMPLATES_FR[lvl];

      rows.push({
        stt: stt++,
        chapterLabel: chapter.label,
        levelLabel: FRENCH_DIFFICULTY_LABELS[lvl] || lvl,
        typeLabel: TYPE_ABBR_FR[type] || "QCM",
        requirement: requirementFn ? requirementFn(chapter.label) : "",
        count: matched.length,
        questionNumbers: matched.map((q) => q.__no).join(", "),
      });
    });
  });

  return rows;
}
