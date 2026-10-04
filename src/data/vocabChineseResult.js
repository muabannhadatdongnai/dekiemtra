/**
 * vocabChineseResult.js (Phiên 52 - tab "Soạn từ vựng", Tiếng Trung)
 * Khuôn kết quả của bản soạn Tiếng Trung. CÙNG khung với vocabResult.js (header/words/grammar/warnings/meta,
 * để page.js + VocabPreview + VocabExportActions dùng chung) nhưng mỗi từ có trường riêng:
 *   { id, word (Chữ Hán), pinyin, hanViet, type, meaning, example, aiPinyin?, aiHanViet?, aiType?, aiExample? }
 * Dòng tiêu đề in bằng TIẾNG VIỆT (Tuần / Chủ đề / Tiết - Bài học - Trang), khác bản tiếng Anh (WEEK/UNIT/PERIOD).
 */

import { buildChineseGrammarTables, baiTitleForHeader } from "@/services/vocabChineseParser";
import { EMPTY_VOCAB_RESULT, nextVocabId, stripSectionLetter } from "@/data/vocabResult";

export const ZH_META = { subject: "Tieng_Trung", subjectLabel: "Tiếng Trung", languageCode: "zh", grade: null };

/** "TUẦN 3" / "CHỦ ĐỀ 1: CỘNG ĐỒNG ..." / "TIẾT 4: BÀI 1: ... (TRANG 8, 9)". */
export function buildChineseTitleLines(header = {}) {
  const lines = [];
  if (header.tuan?.trim()) lines.push(header.tuan.trim().toUpperCase());
  if (header.unit?.trim()) lines.push(header.unit.trim().toUpperCase());
  const parts = [];
  if (header.tiet?.trim()) parts.push(header.tiet.trim().toUpperCase());
  const bai = stripSectionLetter(baiTitleForHeader(header.baiHoc));
  if (bai) parts.push(bai.toUpperCase());
  let periodLine = parts.join(": ");
  if (header.trang?.trim()) periodLine += `${periodLine ? " " : ""}(TRANG ${header.trang.trim()})`;
  if (periodLine) lines.push(periodLine);
  return lines;
}

export function blankChineseWord() {
  return { id: nextVocabId("w"), word: "", pinyin: "", hanViet: "", type: "", meaning: "", example: "" };
}

/** Dựng kết quả từ nhóm từ vựng/ngữ pháp Tiếng Trung giáo viên đã chọn trên form. */
export function buildChineseVocabResult({ header, vocabGroups = [], grammarGroups = [], meta, warnings = [] }) {
  const words = [];
  const seen = new Set();
  for (const g of vocabGroups) {
    for (const w of g.words || []) {
      const key = `${String(w.word || "").trim()}|${String(w.pinyin || "").trim().toLowerCase()}`;
      if (!String(w.word || "").trim() || seen.has(key)) continue; // cùng từ ở nhiều nhóm → chỉ giữ 1 dòng
      seen.add(key);
      words.push({
        id: nextVocabId("w"),
        word: w.word,
        pinyin: w.pinyin || "",
        hanViet: w.hanViet || "",
        type: w.type || "",
        meaning: w.meaning || "",
        example: w.example || "",
      });
    }
  }
  const grammar = grammarGroups.flatMap((g) => buildChineseGrammarTables(g));
  return {
    ...EMPTY_VOCAB_RESULT,
    sheetId: nextVocabId("s"),
    header: { ...EMPTY_VOCAB_RESULT.header, ...header },
    words,
    grammar,
    warnings,
    meta: { ...ZH_META, ...meta },
  };
}
