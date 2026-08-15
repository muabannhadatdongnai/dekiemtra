import { fetchChaptersSeparately } from "./githubService";
import { generateOutlineContent } from "./outlineEngine";

/**
 * outlineOrchestrator.js
 * Tương đương lessonPlanOrchestrator.js: lớp điều phối đứng giữa route.js và outlineEngine.js.
 * - Tải Markdown SGK cho TOÀN BỘ chương đã chọn (TÁI DÙNG fetchChaptersSeparately() sẵn có trong
 *   githubService.js - dùng để đề kiểm tra "Ma trận theo Chương" đọc riêng nội dung từng chương;
 *   ở đây gộp lại thành 1 khối vì đề cương không cần tách riêng số bài theo từng chương).
 * - Lỗi tải 1/nhiều chương KHÔNG làm hỏng cả lượt soạn: bỏ qua chương lỗi, vẫn soạn dựa trên các
 *   chương tải được (an toàn hơn chặn đứng toàn bộ chỉ vì 1 chương thiếu) - nếu KHÔNG chương nào
 *   tải được, vẫn tiếp tục (AI dựa vào kiến thức chuẩn chương trình, giống lessonPlanOrchestrator
 *   khi không có sourceMarkdown).
 */
export async function orchestrateOutlineGeneration({
  subject,
  grade,
  volume = 1,
  chapterIds = [],
  exerciseCounts,
  yeuCauDacBiet = "",
}) {
  const warnings = [];
  let sourceMarkdown = "";
  let chapterLabel = "";

  if (chapterIds.length > 0) {
    const settled = await Promise.allSettled(
      chapterIds.map((chapterId) => fetchChaptersSeparately({ grade, subject, volume, chapters: [chapterId] }))
    );

    const loaded = [];
    settled.forEach((result, i) => {
      if (result.status === "fulfilled") {
        loaded.push(result.value[0]);
      } else {
        warnings.push(
          `Không tải được tài liệu SGK cho chương/bài "${chapterIds[i]}" (${result.reason?.message || "lỗi không rõ"}) ` +
            `- đề cương vẫn được soạn dựa trên các chương còn lại (nếu có).`
        );
      }
    });

    if (loaded.length > 0) {
      sourceMarkdown = loaded.map((c) => `## ${c.label}\n\n${c.markdown}`).join("\n\n---\n\n");
      chapterLabel = loaded.map((c) => c.label).join(", ");
    }
  }

  let outline, quotaExhausted, serverOverloaded, error;
  try {
    ({ outline, quotaExhausted, serverOverloaded, error } = await generateOutlineContent({
      subject,
      grade,
      volume,
      chapterLabel,
      sourceMarkdown,
      exerciseCounts,
      yeuCauDacBiet,
    }));
  } catch (err) {
    warnings.push(
      `Không thể soạn đề cương ôn tập: ${err.message}. Vui lòng thử lại; nếu vẫn lỗi, hãy thử ` +
        `chọn ít chương hơn hoặc rút gọn "Yêu cầu đặc biệt" rồi tạo lại.`
    );
    return { outline: null, warnings };
  }

  if (quotaExhausted) {
    warnings.push(
      `Không thể soạn đề cương do TẤT CẢ API key Gemini đã hết hạn mức hôm nay (${error?.message || ""}). ` +
        `Vui lòng thử lại sau hoặc bổ sung thêm API key.`
    );
    return { outline: null, warnings };
  }

  if (serverOverloaded) {
    warnings.push(
      `Máy chủ Gemini của Google đang quá tải tạm thời (nhu cầu tăng đột biến), không phải do ` +
        `hết hạn mức key của bạn. Vui lòng đợi khoảng 1-2 phút rồi bấm "Tạo đề cương" lại.`
    );
    return { outline: null, warnings };
  }

  return { outline, warnings, chapterLabel };
}
