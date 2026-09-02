import { generateContentWithFailover } from "./geminiKeyPool";
import {
  buildForeignLanguageTranslationPrompt,
  FOREIGN_LANGUAGE_TRANSLATE_MODEL,
} from "@/data/foreignLanguagePromptTemplates";

/**
 * foreignLanguageTranslationEngine.js
 * Lớp gọi AI DUY NHẤT cho tính năng "Bản ngoại ngữ" - cùng khuôn lessonPlanEngine.js/outlineEngine.js
 * (thử lại khi JSON lỗi, phân biệt hết hạn mức/quá tải tạm thời). KHÔNG biết gì về lessonPlan/
 * outline/exam cụ thể - chỉ nhận 1 object JSON bất kỳ + tên ngôn ngữ đích rồi trả object đã dịch
 * CÙNG CẤU TRÚC, nên dùng chung được cho cả 3 module hiện tại lẫn ngôn ngữ mới thêm sau này.
 */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// So khớp NÔNG (chỉ kiểm tra danh sách khoá cấp 1) để phát hiện sớm trường hợp AI trả JSON "gọn
// lại"/bỏ sót khoá (lỗi hay gặp khi object đầu vào lớn) - KHÔNG so sánh sâu từng giá trị (giá trị
// đương nhiên phải khác vì đã dịch), chỉ cần biết bộ khung có còn nguyên vẹn hay không.
function hasSameTopLevelKeys(original, translated) {
  if (!translated || typeof translated !== "object") return false;
  const originalKeys = Object.keys(original || {});
  const translatedKeys = new Set(Object.keys(translated));
  return originalKeys.every((k) => translatedKeys.has(k));
}

export async function translateContentToForeignLanguage({
  data,
  languageNameEn,
  contentKindLabel,
  maxRetries = 2,
}) {
  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    const prompt = buildForeignLanguageTranslationPrompt({ data, languageNameEn, contentKindLabel });

    try {
      const result = await generateContentWithFailover({
        model: FOREIGN_LANGUAGE_TRANSLATE_MODEL,
        contents: prompt,
        config: { temperature: 0.25, responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(result.text);
      if (!hasSameTopLevelKeys(data, parsed)) {
        throw new Error("Kết quả dịch bị thiếu khoá JSON so với bản gốc.");
      }
      return { translated: parsed, quotaExhausted: false };
    } catch (err) {
      lastError = err;
      if (err.allKeysExhausted) {
        return { translated: null, quotaExhausted: true, serverOverloaded: false, error: err };
      }
      if (err.allKeysOverloaded) {
        if (attempt === maxRetries) {
          return { translated: null, quotaExhausted: false, serverOverloaded: true, error: err };
        }
        await sleep(1200 * (attempt + 1));
      }
      attempt++;
    }
  }

  throw new Error(
    `Không thể dịch sang ${languageNameEn} sau ${maxRetries + 1} lần thử. Vui lòng thử lại sau ít phút. ` +
      `(Chi tiết kỹ thuật: ${lastError?.message?.slice(0, 200) || "không rõ nguyên nhân"})`
  );
}
