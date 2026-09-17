import { buildKhgdPrompt, KHGD_MODEL } from "./khgdPromptTemplates";
import { generateContentWithFailover } from "./geminiKeyPool";

/**
 * khgdEngine.js
 * Lớp gọi AI DUY NHẤT cho tab "Khung KHGD" - đúng khuôn outlineEngine.js/lessonPlanEngine.js.
 * maxRetries: thử lại nếu AI trả JSON lỗi/thiếu bài - KHÔNG throw ngay, giáo viên không nên mất
 * cả lượt tạo chỉ vì 1 lần AI trả JSON hỏng.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateKhgdContent({ subject, grade, lessons, enableSwd, enableNls, maxRetries = 2 }) {
  // Nếu giáo viên tắt CẢ 2 công tắc lồng ghép, không cần gọi AI - trả về ngay danh sách rỗng
  // (KhgdResult.buildKhgdResult() sẽ tự điền swd:[]/nls:"" cho mọi dòng).
  if (!enableSwd && !enableNls) {
    return { lessons: lessons.map((l) => ({ id: l.id, swd: [], nls: "" })), quotaExhausted: false };
  }

  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    const prompt = buildKhgdPrompt({ subject, grade, lessons, enableSwd, enableNls });

    try {
      const result = await generateContentWithFailover({
        model: KHGD_MODEL,
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
    `Không thể soạn nội dung lồng ghép (SWD/NLS) sau ${maxRetries + 1} lần thử. Vui lòng thử lại sau ` +
      `ít phút. (Chi tiết kỹ thuật: ${lastError?.message?.slice(0, 200) || "không rõ nguyên nhân"})`
  );
}
