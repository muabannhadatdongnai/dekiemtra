import { buildVocabChineseEnrichPrompt, VOCAB_ZH_MODEL, VOCAB_ZH_TYPE_CHOICES } from "./vocabChinesePromptTemplates";
import { generateContentWithFailover } from "./geminiKeyPool";

/**
 * vocabChineseEngine.js (Phiên 52)
 * Lớp gọi AI của bản soạn Tiếng Trung: bổ sung pinyin / âm Hán Việt / từ loại / câu ví dụ còn thiếu.
 * Khuôn giống vocabEngine.js (chia lô, thử lại khi JSON hỏng, hết quota/quá tải báo rõ) nhưng ĐỘC LẬP.
 * AI CHỈ được điền trường đang TRỐNG, mọi giá trị đã có từ Markdown được giữ NGUYÊN (mergeChineseEnrichment).
 */

export const VOCAB_ZH_AI_BATCH_SIZE = 40; // nhỏ hơn bản Anh vì mỗi từ phải sinh thêm câu ví dụ + pinyin câu
export const VOCAB_ZH_MAX_WORDS_PER_REQUEST = 200;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const CJK = /[㐀-鿿]/;
const VI_ONLY = /[ăâêôơưđạảãấầẩẫậắằẳẵặẹẻẽếềểễệịỉĩọỏõốồổỗộớờởỡợụủũứừửữựỳỵỷỹ]/i;

/** Pinyin hợp lệ: chữ Latin + nguyên âm có dấu thanh Pinyin (ā á ǎ à ...), ü, khoảng trắng, ' và -. Không CJK/số/dấu Việt. */
export function sanitizePinyin(raw) {
  const s = String(raw ?? "").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
  if (!s || s.length > 80) return "";
  if (CJK.test(s) || /[0-9]/.test(s)) return "";
  if (!/^[A-Za-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüÜ\s'’\-·,.?!/]+$/.test(s)) return "";
  return s;
}

/** Âm Hán Việt hợp lệ: chữ Việt thường + dấu cách, ≤ 50 ký tự, không CJK/số. */
export function sanitizeHanViet(raw) {
  const s = String(raw ?? "").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  if (!s || s.length > 50) return "";
  if (CJK.test(s) || /[0-9]/.test(s) || !/^[a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ\s]+$/i.test(s)) return "";
  return s;
}

export function normalizeAiChineseType(raw) {
  const s = String(raw ?? "").trim().toLowerCase();
  return VOCAB_ZH_TYPE_CHOICES.find((t) => t.toLowerCase() === s) || "";
}

/** Câu ví dụ hợp lệ: có chữ Hán, 2-40 ký tự, không chữ Việt. Pinyin câu (nếu hợp lệ) nối xuống dòng dưới. */
export function sanitizeChineseExample(raw, rawPinyin = "") {
  const s = String(raw ?? "").replace(/[*_`"“”]/g, "").replace(/\s+/g, "").trim();
  if (!s || s.length > 40 || !CJK.test(s) || VI_ONLY.test(s) || /[A-Za-z]{4,}/.test(s)) return "";
  const py = sanitizePinyin(rawPinyin);
  return py ? `${s}\n${py}` : s;
}

/** Ví dụ phải chứa từ (dạng đầu tiên nếu từ có "/" hoặc "( )"), tránh AI viết câu không liên quan. */
function exampleContainsWord(example, word) {
  const first = String(word ?? "").split(/\s*[\/／(（]\s*/)[0].trim();
  return !first || example.includes(first);
}

export function mergeChineseEnrichment(words, aiItems) {
  const byId = new Map((aiItems || []).map((it) => [String(it.id), it]));
  return words.map((w) => {
    const ai = byId.get(String(w.id));
    if (!ai) return w;
    const next = { ...w };
    if (!w.pinyin) {
      const v = sanitizePinyin(ai.pinyin);
      if (v) { next.pinyin = v; next.aiPinyin = true; }
    }
    if (!w.hanViet) {
      const v = sanitizeHanViet(ai.hanViet);
      if (v) { next.hanViet = v; next.aiHanViet = true; }
    }
    if (!w.type) {
      const v = normalizeAiChineseType(ai.type);
      if (v) { next.type = v; next.aiType = true; }
    }
    if (!w.example) {
      const v = sanitizeChineseExample(ai.example, ai.examplePinyin);
      if (v && exampleContainsWord(v, w.word)) { next.example = v; next.aiExample = true; }
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
        model: VOCAB_ZH_MODEL,
        contents: buildVocabChineseEnrichPrompt({ items, grade }),
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
    `Không thể bổ sung pinyin/âm Hán Việt/ví dụ sau ${maxRetries + 1} lần thử. Vui lòng thử lại sau ít phút. ` +
      `(Chi tiết kỹ thuật: ${lastError?.message?.slice(0, 200) || "không rõ nguyên nhân"})`
  );
}

const countFilled = (merged, before, flag) => merged.filter((w, i) => w[flag] && !before[i][flag]).length;

/**
 * enrichChineseVocab → { words, quotaExhausted, serverOverloaded, filledPinyin, filledHanViet, filledType, filledExample }
 * words: [{ id, word, pinyin, hanViet, type, meaning, example }]. Chỉ gọi AI cho dòng THIẾU ít nhất 1 trường.
 */
export async function enrichChineseVocab({ words, grade = null, maxRetries = 2 }) {
  const zero = { filledPinyin: 0, filledHanViet: 0, filledType: 0, filledExample: 0 };
  const needing = words
    .filter((w) => !w.pinyin || !w.hanViet || !w.type || !w.example)
    .map((w) => ({ id: w.id, word: w.word, meaning: w.meaning, needPinyin: !w.pinyin, needHanViet: !w.hanViet, needType: !w.type, needExample: !w.example }));
  if (!needing.length) return { words, ...zero };

  const aiItems = [];
  for (const batch of chunk(needing, VOCAB_ZH_AI_BATCH_SIZE)) {
    const res = await enrichBatch({ items: batch, grade, maxRetries });
    if (!res.items) return { words, quotaExhausted: Boolean(res.quotaExhausted), serverOverloaded: Boolean(res.serverOverloaded), ...zero };
    aiItems.push(...res.items);
  }
  const merged = mergeChineseEnrichment(words, aiItems);
  return {
    words: merged,
    filledPinyin: countFilled(merged, words, "aiPinyin"),
    filledHanViet: countFilled(merged, words, "aiHanViet"),
    filledType: countFilled(merged, words, "aiType"),
    filledExample: countFilled(merged, words, "aiExample"),
  };
}
