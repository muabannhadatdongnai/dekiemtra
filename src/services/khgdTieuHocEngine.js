import { buildKhgdTieuHocPrompt, KHGD_TIEU_HOC_MODEL } from "./khgdTieuHocPromptTemplates";
import { generateContentWithFailover } from "./geminiKeyPool";

/**
 * khgdTieuHocEngine.js
 * Lớp gọi AI DUY NHẤT cho tab "Khung KHGD - Tiểu học" - cùng khuôn khgdEngine.js (THCS/THPT),
 * CHỈ khác schema trả về (1 trường "dieuChinh" thay vì "swd"/"nls").
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateKhgdTieuHocContent({ subject, grade, lessons, enableDieuChinh, maxRetries = 2 }) {
  if (!enableDieuChinh) {
    return { lessons: lessons.map((l) => ({ id: l.id, dieuChinh: "" })), quotaExhausted: false };
  }

  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    const prompt = buildKhgdTieuHocPrompt({ subject, grade, lessons });

    try {
      const result = await generateContentWithFailover({
        model: KHGD_TIEU_HOC_MODEL,
        contents: prompt,
        config: { temperature: 0.6, responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(result.text);
      if (!Array.isArray(parsed.lessons) || parsed.lessons.length === 0) {
        throw new Error('Thiếu mảng "lessons" trong JSON trả về.');
      }
      return { lessons: parsed.lessons, quotaExhausted: false };
    } catch (err) {
      lastError = err;
      if (err.allKeysExhausted) {
        return { lessons: null, quotaExhausted: true, serverOverloaded: false, error: err };
      }
      if (err.allKeysOverloaded) {
        if (attempt === maxRetries) {
          return { lessons: null, quotaExhausted: false, serverOverloaded: true, error: err };
        }
        await sleep(1500 * (attempt + 1));
      }
      attempt++;
    }
  }

  throw new Error(
    `Không thể soạn "Nội dung điều chỉnh" sau ${maxRetries + 1} lần thử. Vui lòng thử lại sau ít ` +
      `phút. (Chi tiết kỹ thuật: ${lastError?.message?.slice(0, 200) || "không rõ nguyên nhân"})`
  );
}
