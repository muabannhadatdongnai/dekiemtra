import { NextResponse } from "next/server";
import { orchestrateLessonPlanGeneration } from "@/services/lessonPlanOrchestrator";
import { requireAuth } from "@/services/apiAuth";
import { LESSON_PLAN_STYLE_IDS, CUSTOM_STYLE_MAX_LENGTH } from "@/data/lessonPlanStyles";

const VALID_STYLE_IDS = Object.values(LESSON_PLAN_STYLE_IDS);

/** Không tin dữ liệu client tuyệt đối (đúng nguyên tắc đã áp dụng ở /api/worksheet-preference):
 * styleId phải nằm trong 4 giá trị hợp lệ (3 preset + "tu_do") hoặc null/không gửi; customStyleText
 * PHẢI bị cắt về đúng CUSTOM_STYLE_MAX_LENGTH (150 ký tự) dù client đã giới hạn ở input - phòng
 * trường hợp gọi thẳng API bỏ qua UI. Trả về null nếu styleId không hợp lệ (coi như không chọn gì,
 * KHÔNG chặn cả lượt soạn giáo án chỉ vì 1 trường tuỳ chọn sai định dạng). */
function sanitizeLessonPlanStyle(raw) {
  if (!raw || typeof raw !== "object") return null;
  const { styleId, customStyleText } = raw;
  if (!styleId || !VALID_STYLE_IDS.includes(styleId)) return null;
  if (styleId === LESSON_PLAN_STYLE_IDS.TU_DO) {
    const trimmed = String(customStyleText || "").trim().slice(0, CUSTOM_STYLE_MAX_LENGTH);
    return trimmed ? { styleId, customStyleText: trimmed } : null;
  }
  return { styleId, customStyleText: null };
}

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    const {
      tenBai,
      grade,
      subject = "Toan",
      volume = 1,
      chapterId = null,
      soTiet = 1,
      noiDungCotLoi = "",
      integrations = [],
      lessonType = "bai_moi",
      sampleMode = "theo_chuong",
      sampleSpec = null,
      sampleReferenceText = null,
      lessonPlanStyle = null,
    } = body;

    if (!tenBai || !grade) {
      return NextResponse.json(
        { error: "Thiếu tham số: tenBai và grade là bắt buộc." },
        { status: 400 }
      );
    }

    const { lessonPlan, timeline, warnings } = await orchestrateLessonPlanGeneration({
      tenBai,
      grade,
      subject,
      volume,
      chapterId,
      soTiet,
      noiDungCotLoi,
      integrations,
      lessonType,
      sampleMode,
      sampleSpec,
      sampleReferenceText,
      lessonPlanStyle: sanitizeLessonPlanStyle(lessonPlanStyle),
    });

    if (!lessonPlan) {
      return NextResponse.json(
        { error: warnings[0] || "Không thể soạn giáo án, vui lòng thử lại." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, lessonPlan, timeline, warnings });
  } catch (err) {
    console.error("[/api/generate-lesson-plan] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi soạn giáo án." },
      { status: 500 }
    );
  }
}
