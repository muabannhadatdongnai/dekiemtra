import { buildLessonPlanPrompt, LESSON_PLAN_MODEL } from "@/data/lessonPlanPromptTemplates";
import { generateContentWithFailover } from "./geminiKeyPool";

/**
 * lessonPlanEngine.js
 * Lớp gọi AI DUY NHẤT cho module Soạn giáo án - tương đương geminiEngine.js bên đề thi, nhưng
 * đơn giản hơn nhiều (không cần 3 lớp chống trùng như câu hỏi thi, vì mỗi giáo án là 1 bài học
 * CỤ THỂ, không có khái niệm "sinh nhiều câu tránh trùng ý tưởng").
 *
 * maxRetries: thử lại nếu AI trả JSON lỗi hoặc thiếu "hoatDong" - KHÔNG throw ngay, giáo viên
 * không nên mất cả lượt soạn chỉ vì 1 lần AI trả JSON hỏng.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateLessonPlanContent({
  tenBai,
  grade,
  subject,
  soTiet,
  noiDungCotLoi,
  sourceMarkdown,
  chapterLabel,
  integrations,
  maxRetries = 2,
}) {
  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    const prompt = buildLessonPlanPrompt({
      tenBai,
      grade,
      subject,
      soTiet,
      noiDungCotLoi,
      sourceMarkdown,
      chapterLabel,
      integrations,
    });

    try {
      const result = await generateContentWithFailover({
        model: LESSON_PLAN_MODEL,
        contents: prompt,
        config: { temperature: 0.6, responseMimeType: "application/json" },
      });

      const parsed = JSON.parse(result.text);
      if (!Array.isArray(parsed.hoatDong) || parsed.hoatDong.length === 0) {
        throw new Error("Thiếu mục hoạt động dạy học trong JSON trả về.");
      }
      return { lessonPlan: parsed, quotaExhausted: false };
    } catch (err) {
      lastError = err;
      if (err.allKeysExhausted) {
        return { lessonPlan: null, quotaExhausted: true, serverOverloaded: false, error: err };
      }
      // ⚠️ MỚI: phân biệt "quá tải tạm thời phía Google" (503/UNAVAILABLE) với các lỗi khác
      // (JSON hỏng, thiếu hoatDong...). Trường hợp quá tải: KHÔNG dội lại ngay lập tức - chờ
      // theo backoff tăng dần rồi mới thử lại, tăng cơ hội thành công thay vì lặp lại đúng
      // lỗi cũ 3 lần liên tiếp trong tích tắc (đây là nguyên nhân giáo viên thấy lỗi JSON thô).
      if (err.allKeysOverloaded) {
        if (attempt === maxRetries) {
          return { lessonPlan: null, quotaExhausted: false, serverOverloaded: true, error: err };
        }
        await sleep(1500 * (attempt + 1));
      }
      attempt++;
    }
  }

  throw new Error(
    `Không thể soạn giáo án sau ${maxRetries + 1} lần thử. Vui lòng thử lại sau ít phút. ` +
      `(Chi tiết kỹ thuật: ${lastError?.message?.slice(0, 200) || "không rõ nguyên nhân"})`
  );
}
