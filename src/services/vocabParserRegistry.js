import { parseEnglishVocabulary } from "./vocabEnglishParser";
import { parseChineseVocabulary } from "./vocabChineseParser";

/**
 * vocabParserRegistry.js (Phiên 51)
 * Tra bộ đọc từ vựng theo MÔN. Mỗi ngôn ngữ 1 bộ đọc riêng (isolation); môn chưa có bộ đọc → trả null
 * để route báo "chưa hỗ trợ" (KHÔNG đoán cấu trúc). Tiếng Trung đã có từ Phiên 52 (vocabChineseParser.js); Tiếng Nhật: thêm ở phiên sau - chỉ cần
 * viết vocabJapaneseParser.js rồi khai báo 1 dòng ở đây.
 */
const PARSERS = {
  Tieng_Anh: parseEnglishVocabulary,
  Tieng_Trung: parseChineseVocabulary,
};

export function hasVocabParser(subject) {
  return Boolean(PARSERS[subject]);
}

export function parseVocabularyByLanguage(subject, markdown) {
  const parser = PARSERS[subject];
  return parser ? parser(markdown) : null;
}
