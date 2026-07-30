import { fetchMarkdownFromGitHub, fetchAdvancedBook } from "./githubService";
import { generateLessonPlanContent } from "./lessonPlanEngine";
import { isPreschoolGrade, computeActivityTimeline } from "@/data/lessonPlanTemplates";
import { ADVANCED_BOOK_MARKER } from "@/data/constants";
import { getIntegration } from "@/data/lessonPlanIntegrations";

/**
 * lessonPlanOrchestrator.js
 * Tương đương examOrchestrator.js: lớp điều phối đứng giữa route.js và lessonPlanEngine.js.
 * - Tải Markdown SGK (TÁI DÙNG githubService.js y hệt luồng đề thi) nếu KHÔNG phải Mầm non.
 * - Gọi AI soạn nội dung giáo án.
 * - Tính Timeline THUẦN CODE (không dùng AI - xem computeActivityTimeline).
 * - Lỗi tải SGK KHÔNG làm hỏng cả lượt soạn: rơi về cảnh báo + vẫn soạn dựa trên "Nội dung cốt
 *   lõi" giáo viên gõ tay (an toàn hơn là chặn đứng toàn bộ tính năng chỉ vì 1 file .md thiếu).
 */
export async function orchestrateLessonPlanGeneration({
  tenBai,
  grade,
  subject,
  volume = 1,
  chapterId,
  soTiet = 1,
  noiDungCotLoi = "",
  integrations = [],
}) {
  const warnings = [];
  let sourceMarkdown = "";
  let chapterLabel = "";

  if (!isPreschoolGrade(grade) && chapterId) {
    try {
      sourceMarkdown =
        chapterId === ADVANCED_BOOK_MARKER
          ? await fetchAdvancedBook(grade, subject)
          : await fetchMarkdownFromGitHub(grade, subject, volume, chapterId);
      chapterLabel = chapterId === ADVANCED_BOOK_MARKER ? "Sách nâng cao (toàn bộ)" : `Chương/Bài ${chapterId}`;
    } catch (err) {
      warnings.push(
        `Không tải được tài liệu SGK cho bài đã chọn (${err.message}) - hệ thống vẫn soạn giáo án ` +
          `dựa trên "Nội dung cốt lõi" bạn đã nhập, nhưng có thể kém bám sát SGK hơn bình thường.`
      );
    }
  }

  const { lessonPlan, quotaExhausted, error } = await generateLessonPlanContent({
    tenBai,
    grade,
    subject,
    soTiet,
    noiDungCotLoi,
    sourceMarkdown,
    chapterLabel,
    integrations,
  });

  if (quotaExhausted) {
    warnings.push(
      `Không thể soạn giáo án do TẤT CẢ API key Gemini đã hết hạn mức hôm nay (${error?.message || ""}). ` +
        `Vui lòng thử lại sau hoặc bổ sung thêm API key.`
    );
    return { lessonPlan: null, timeline: [], warnings };
  }

  // Cảnh báo nhẹ nếu 1 tích hợp yêu cầu field riêng nhưng AI không trả về (không chặn cả giáo án).
  integrations.forEach((key) => {
    const integration = getIntegration(key);
    if (integration?.jsonField && !(integration.jsonField in lessonPlan)) {
      warnings.push(
        `Tuỳ chọn "${integration.label}${integration.description ? " - " + integration.description : ""}" ` +
          `đã bật nhưng AI không trả về đủ nội dung tương ứng - có thể thử tạo lại.`
      );
    }
  });

  const timeline = integrations.includes("timeline") ? computeActivityTimeline(soTiet, grade) : [];

  return { lessonPlan, timeline, warnings };
}
