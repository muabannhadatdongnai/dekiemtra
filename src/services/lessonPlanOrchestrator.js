import { fetchMarkdownFromGitHub, fetchAdvancedBook } from "./githubService";
import { generateLessonPlanContent } from "./lessonPlanEngine";
import { isPreschoolGrade, computeActivityTimeline } from "@/data/lessonPlanTemplates";
import { findForeignLanguageConfig } from "@/data/foreignLanguageSubjects";
import { ADVANCED_BOOK_MARKER } from "@/data/constants";
import { getIntegration } from "@/data/lessonPlanIntegrations";
import { isUsableLessonPlanSampleSpec } from "@/data/lessonPlanSampleSchema";
import {
  getDiversityEntries,
  appendDiversityEntry,
  extractOpeningIdea,
  jaccardSimilarity,
  DIVERSITY_SIMILARITY_WARNING_THRESHOLD,
} from "./lessonPlanDiversityStore";

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
  lessonType = "bai_moi",
  sampleMode = "theo_chuong",
  sampleSpec = null,
  sampleReferenceText = null,
  lessonPlanStyle = null,
}) {
  const warnings = [];
  let sourceMarkdown = "";
  let chapterLabel = "";

  // Giống examOrchestrator.js: nếu chế độ dùng mẫu được chọn nhưng spec không đủ dùng (chưa
  // phân tích xong/lỗi phân tích lọt qua validate client) - tự động fallback về không dùng mẫu,
  // KHÔNG chặn cả lượt soạn giáo án chỉ vì phần mẫu bị thiếu.
  let effectiveSampleMode = sampleMode;
  let effectiveSampleSpec = sampleSpec;
  if (sampleMode !== "theo_chuong" && !isUsableLessonPlanSampleSpec(sampleSpec)) {
    effectiveSampleMode = "theo_chuong";
    effectiveSampleSpec = null;
    warnings.push(
      `Không có giáo án mẫu hợp lệ để áp dụng (chưa phân tích thành công hoặc mẫu không đủ thông ` +
        `tin) - hệ thống đã tự động soạn theo khung mặc định, bỏ qua mẫu cho lượt soạn này.`
    );
  }

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

  // GIAI ĐOẠN 10, Việc 3/7: lấy trước các "ý tưởng mở bài" đã lưu cho ĐÚNG tổ hợp khối+môn+bài
  // (có thể do giáo viên khác/phiên trước tạo) để chèn vào prompt giúp AI tự tránh trùng ngay từ
  // đầu. getDiversityEntries() KHÔNG BAO GIỜ throw (đã bọc try/catch trong store) nên không cần
  // try/catch ở đây - lỗi backend tối đa chỉ khiến existingOpeningIdeas rỗng, giáo án vẫn soạn
  // bình thường như trước khi có tính năng này.
  const diversityEntries = await getDiversityEntries({ subject, grade, tenBai });
  const existingOpeningIdeas = diversityEntries.map((e) => e.openingIdea).filter(Boolean);

  let lessonPlan, quotaExhausted, serverOverloaded, error;
  try {
    ({ lessonPlan, quotaExhausted, serverOverloaded, error } = await generateLessonPlanContent({
      tenBai,
      grade,
      subject,
      soTiet,
      noiDungCotLoi,
      sourceMarkdown,
      chapterLabel,
      integrations,
      lessonType,
      sampleMode: effectiveSampleMode,
      sampleSpec: effectiveSampleSpec,
      sampleReferenceText,
      lessonPlanStyle,
      existingOpeningIdeas,
    }));
  } catch (err) {
    // ⚠️ MỚI: chặn lỗi bất ngờ (JSON hỏng nhiều lần, lỗi mạng...) tại đây - KHÔNG để lọt nguyên
    // văn lên route.js/giao diện dưới dạng JSON thô khó hiểu với giáo viên.
    warnings.push(
      `Không thể soạn giáo án: ${err.message}. Vui lòng thử lại; nếu vẫn lỗi, hãy thử đổi ` +
        `bớt một vài "Tuỳ chọn nâng cao" hoặc rút gọn "Nội dung cốt lõi" rồi tạo lại.`
    );
    return { lessonPlan: null, timeline: [], warnings };
  }

  if (quotaExhausted) {
    warnings.push(
      `Không thể soạn giáo án do TẤT CẢ API key Gemini đã hết hạn mức hôm nay (${error?.message || ""}). ` +
        `Vui lòng thử lại sau hoặc bổ sung thêm API key.`
    );
    return { lessonPlan: null, timeline: [], warnings };
  }

  if (serverOverloaded) {
    // ⚠️ MỚI: đây chính là trường hợp trong ảnh chụp màn hình - lỗi 503 "high demand" từ Google,
    // KHÔNG phải do hết quota của bạn. Thông báo rõ để giáo viên biết chỉ cần chờ 1-2 phút và
    // bấm "Bắt đầu tạo bài dạy" lại, không cần thêm key hay chờ qua ngày hôm sau.
    warnings.push(
      `Máy chủ Gemini của Google đang quá tải tạm thời (nhu cầu tăng đột biến), không phải do ` +
        `hết hạn mức key của bạn. Vui lòng đợi khoảng 1-2 phút rồi bấm "Bắt đầu tạo bài dạy" lại.`
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

  // ⚠️ MỚI: nếu bài dạy có từ 2 tiết trở lên nhưng AI không gắn trường "tiet" (>1) cho bất kỳ bước
  // nào - có thể AI đã bỏ qua yêu cầu chia ranh giới tiết (xem buildMultiPeriodGuidance() trong
  // lessonPlanPromptTemplates.js) - cảnh báo nhẹ, KHÔNG chặn cả lượt soạn (giáo án vẫn dùng được,
  // chỉ là chưa tách rõ điểm dừng giữa các tiết như mong muốn).
  if (soTiet >= 2) {
    const hasPeriodTagging = (lessonPlan.hoatDong || []).some((a) =>
      (a.tienTrinh || []).some((s) => Number(s.tiet) > 1)
    );
    if (!hasPeriodTagging) {
      warnings.push(
        `Bài dạy khai báo ${soTiet} tiết nhưng AI chưa tách rõ ranh giới giữa các tiết trong nội dung ` +
          `- có thể thử tạo lại để có điểm dừng/giải lao rõ ràng giữa các tiết.`
      );
    }
  }

  // ⚠️ Phiên 36: truyền languageCode của môn ngoại ngữ (nếu có) để nhãn hoạt động trong Timeline
  // (VD "Khởi động"/"Warm-up") khớp đúng ngôn ngữ nội dung giáo án - xem getActivityLabels()
  // trong lessonPlanTemplates.js.
  const timelineLanguageCode = findForeignLanguageConfig(subject)?.languageCode || "vi";
  const timeline = integrations.includes("timeline")
    ? computeActivityTimeline(soTiet, grade, lessonType, timelineLanguageCode)
    : [];

  // GIAI ĐOẠN 10, Việc 3/7: sau khi sinh thành công - (a) nếu ý tưởng mở bài VẪN khá giống 1 ý
  // tưởng đã lưu trước đó (dù đã gợi ý AI tránh trong prompt) thì CẢNH BÁO cho giáo viên tự quyết
  // định có tạo lại hay không (KHÔNG tự ý chặn/sinh lại thay giáo viên - xem giải thích phạm vi đã
  // chốt ở đầu lessonPlanDiversityStore.js); (b) LUÔN lưu ý tưởng mở bài của lượt này vào ngân
  // hàng cho các lượt SAU (dù trùng hay không - lượt sau vẫn cần biết để tránh tiếp).
  const newOpeningIdea = extractOpeningIdea(lessonPlan);
  if (newOpeningIdea) {
    const maxSimilarity = existingOpeningIdeas.reduce(
      (max, old) => Math.max(max, jaccardSimilarity(old, newOpeningIdea)),
      0
    );
    if (maxSimilarity >= DIVERSITY_SIMILARITY_WARNING_THRESHOLD) {
      warnings.push(
        `Ý tưởng mở bài/khởi động của giáo án này khá giống 1 lượt soạn TRƯỚC ĐÓ cho ĐÚNG bài học ` +
          `này (dù hệ thống đã gợi ý AI tránh trùng) - nếu muốn khác biệt hơn, bạn có thể thử tạo lại.`
      );
    }
    // Không await chờ kết quả lưu ảnh hưởng tới trải nghiệm giáo viên - nhưng appendDiversityEntry()
    // đã tự nuốt mọi lỗi (xem store), nên await ở đây an toàn và đơn giản hơn "fire-and-forget".
    await appendDiversityEntry({
      subject,
      grade,
      tenBai,
      openingIdea: newOpeningIdea,
      styleId: lessonPlanStyle?.styleId || null,
    });
  }

  return { lessonPlan, timeline, warnings };
}
