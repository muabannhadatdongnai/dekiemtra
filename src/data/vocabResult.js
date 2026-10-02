/**
 * vocabResult.js (Phiên 51 - tab "Soạn từ vựng")
 * Khuôn dữ liệu kết quả của tab "Soạn từ vựng": 1 BẢN SOẠN = 1 tiết (Period) gồm phần đầu + bảng
 * từ vựng + bảng ngữ pháp, đúng mẫu giáo viên đang dùng (Week / Unit / Period, A. Vocabulary, B. Grammar).
 * Giống khgdResult.js: gộp thành 1 object DUY NHẤT để page.js chỉ giữ 1 useState.
 */

export const EMPTY_VOCAB_RESULT = {
  // sheetId: định danh bản soạn hiện tại - để kết quả AI về trễ KHÔNG ghi nhầm vào bản soạn mới hơn
  sheetId: "",
  // enrich: trạng thái bước AI bổ sung phiên âm/loại từ { loading, message, error } (xem vocabEnrichClient.js)
  enrich: { loading: false, message: "", error: "" },
  header: {
    tuan: "", // "WEEK 3"
    unit: "", // "UNIT 2: MY HOUSE"
    tiet: "", // "PERIOD 8"
    baiHoc: "", // "GETTING STARTED"
    trang: "", // "16, 17"
  },
  // [{ id, word, ipa, type, meaning, aiIpa?, aiType? }] - aiIpa/aiType = true khi do AI bổ sung (cần rà lại)
  words: [],
  // [{ id, left, right }] - bảng ngữ pháp dạng tự do (Cấu trúc | Giải thích/Ví dụ)
  grammar: [],
  warnings: [],
  meta: { subject: "Tieng_Anh", subjectLabel: "Tiếng Anh", languageCode: "en", grade: null },
};

let idCounter = 0;
export function nextVocabId(prefix = "w") {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

/** "WEEK 3" / "UNIT 2: MY HOUSE" / "PERIOD 8: GETTING STARTED (PAGE 16, 17)" - dòng tiêu đề in trên cùng. */
export function buildVocabTitleLines(header = {}) {
  const lines = [];
  if (header.tuan?.trim()) lines.push(header.tuan.trim().toUpperCase());
  if (header.unit?.trim()) lines.push(header.unit.trim().toUpperCase());
  const periodParts = [];
  if (header.tiet?.trim()) periodParts.push(header.tiet.trim().toUpperCase());
  if (header.baiHoc?.trim()) periodParts.push(header.baiHoc.trim().toUpperCase());
  let periodLine = periodParts.join(": ");
  if (header.trang?.trim()) periodLine += `${periodLine ? " " : ""}(PAGE ${header.trang.trim()})`;
  if (periodLine) lines.push(periodLine);
  return lines;
}

/** Dựng kết quả từ nhóm từ vựng/ngữ pháp giáo viên đã chọn trên form. */
export function buildVocabResult({ header, vocabGroups = [], grammarGroups = [], meta, warnings = [] }) {
  const words = [];
  const seen = new Set();
  for (const g of vocabGroups) {
    for (const w of g.words || []) {
      const key = String(w.word || "").trim().toLowerCase();
      if (!key || seen.has(key)) continue; // cùng từ xuất hiện ở nhiều nhóm → chỉ giữ 1 dòng
      seen.add(key);
      words.push({ id: nextVocabId("w"), word: w.word, ipa: w.ipa || "", type: w.type || "", meaning: w.meaning || "" });
    }
  }
  const grammar = [];
  for (const g of grammarGroups) {
    for (const r of g.rows || []) grammar.push({ id: nextVocabId("g"), left: r.left || "", right: r.right || "" });
  }
  return { ...EMPTY_VOCAB_RESULT, sheetId: nextVocabId("s"), header: { ...EMPTY_VOCAB_RESULT.header, ...header }, words, grammar, warnings, meta: { ...EMPTY_VOCAB_RESULT.meta, ...meta } };
}
