import { buildVocabEnrichPrompt, VOCAB_MODEL } from "./vocabPromptTemplates";
import { generateContentWithFailover } from "./geminiKeyPool";
import { normalizeWordType } from "./vocabEnglishParser";

/**
 * vocabEngine.js (Phiên 51)
 * Lớp gọi AI DUY NHẤT của tab "Soạn từ vựng": bổ sung IPA + loại từ + câu ví dụ còn thiếu. Khuôn giống
 * khgdEngine.js: chia lô, thử lại khi JSON hỏng, hết quota/quá tải thì báo lỗi rõ ràng.
 * AI CHỈ được điền trường đang trống - mọi giá trị đã có từ Markdown SGK được giữ NGUYÊN
 * (xem mergeEnrichment bên dưới, KHÔNG tin AI trả về trường đã có).
 */

export const VOCAB_AI_BATCH_SIZE = 60;
export const VOCAB_MAX_WORDS_PER_REQUEST = 300;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** IPA hợp lệ: có 2 dấu "/", không chứa chữ có dấu tiếng Việt, độ dài hợp lý. */
export function sanitizeIpa(raw) {
  let s = String(raw ?? "").trim().replace(/^`|`$/g, "");
  if (!s) return "";
  if (!s.startsWith("/")) s = `/${s}`;
  if (!s.endsWith("/") || s.length < 3) s = `${s}/`;
  s = s.replace(/\/{2,}/g, "/");
  if (s.length < 3 || s.length > 80) return "";
  if (/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(s)) return "";
  if (/[0-9_*]/.test(s)) return "";
  return s;
}

/** Câu ví dụ hợp lệ: tiếng Anh (không dấu tiếng Việt), 2-160 ký tự, bỏ ngoặc kép/markdown bao quanh. Không hợp lệ → "". */
export function sanitizeExample(raw) {
  const s = String(raw ?? "").replace(/[*_`]/g, "").replace(/^["'“”‘’\s]+|["'“”‘’\s]+$/g, "").replace(/\s+/g, " ").trim();
  if (s.length < 2 || s.length > 160) return "";
  if (/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(s)) return "";
  return s;
}

/**
 * Gộp kết quả AI vào danh sách từ gốc theo id. Chỉ điền trường còn TRỐNG và đã qua kiểm tra định dạng;
 * đánh dấu aiIpa/aiType/aiExample để giao diện tô vàng cho giáo viên rà lại.
 */
export function mergeEnrichment(words, aiItems) {
  const byId = new Map((aiItems || []).map((it) => [String(it.id), it]));
  return words.map((w) => {
    const ai = byId.get(String(w.id));
    if (!ai) return w;
    const next = { ...w };
    if (!w.ipa) {
      const ipa = sanitizeIpa(ai.ipa);
      if (ipa) { next.ipa = ipa; next.aiIpa = true; }
    }
    if (!w.type) {
      const type = normalizeWordType(ai.type);
      if (type) { next.type = type; next.aiType = true; }
    }
    if (!w.example) {
      const example = sanitizeExample(ai.example);
      if (example) { next.example = example; next.aiExample = true; }
    }
    return next;
  });
}

async function enrichBatch({ items, grade, maxRetries }) {
  let attempt = 0;
  let lastError = null;
  while (attempt <= maxRetries) {
    try {
      const result = await generateContentWithFailover({
        model: VOCAB_MODEL,
        contents: buildVocabEnrichPrompt({ items, grade }),
        config: { temperature: 0.2, responseMimeType: "application/json" },
      });
      const parsed = JSON.parse(result.text);
      if (!Array.isArray(parsed.items)) throw new Error('Thiếu mảng "items" trong JSON trả về.');
      return { items: parsed.items };
    } catch (err) {
      lastError = err;
      if (err.allKeysExhausted) return { items: null, quotaExhausted: true };
      if (err.allKeysOverloaded) {
        if (attempt === maxRetries) return { items: null, serverOverloaded: true };
        await sleep(1500 * (attempt + 1));
      }
      attempt += 1;
    }
  }
  throw new Error(
    `Không thể bổ sung phiên âm/loại từ sau ${maxRetries + 1} lần thử. Vui lòng thử lại sau ít phút. ` +
      `(Chi tiết kỹ thuật: ${lastError?.message?.slice(0, 200) || "không rõ nguyên nhân"})`
  );
}

/**
 * enrichEnglishVocab(words) → { words, quotaExhausted, serverOverloaded, filledIpa, filledType, filledExample }
 * words: [{ id, word, ipa, type, meaning, example }]. Chỉ gọi AI cho dòng THIẾU ipa, type hoặc example.
 */
export async function enrichEnglishVocab({ words, grade = null, maxRetries = 2 }) {
  const needing = words
    .filter((w) => !w.ipa || !w.type || !w.example)
    .map((w) => ({ id: w.id, word: w.word, meaning: w.meaning, needIpa: !w.ipa, needType: !w.type, needExample: !w.example }));
  if (!needing.length) return { words, filledIpa: 0, filledType: 0, filledExample: 0 };

  const aiItems = [];
  for (const batch of chunk(needing, VOCAB_AI_BATCH_SIZE)) {
    const res = await enrichBatch({ items: batch, grade, maxRetries });
    if (!res.items) return { words, quotaExhausted: Boolean(res.quotaExhausted), serverOverloaded: Boolean(res.serverOverloaded), filledIpa: 0, filledType: 0, filledExample: 0 };
    aiItems.push(...res.items);
  }
  const merged = mergeEnrichment(words, aiItems);
  return {
    words: merged,
    filledIpa: merged.filter((w, i) => w.aiIpa && !words[i].aiIpa).length,
    filledType: merged.filter((w, i) => w.aiType && !words[i].aiType).length,
    filledExample: merged.filter((w, i) => w.aiExample && !words[i].aiExample).length,
  };
}
