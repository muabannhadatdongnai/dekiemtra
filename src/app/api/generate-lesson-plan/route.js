import { NextResponse } from "next/server";
import { orchestrateLessonPlanGeneration } from "@/services/lessonPlanOrchestrator";
import { requireAuth } from "@/services/apiAuth";

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
      sampleMode = "theo_chuong",
      sampleSpec = null,
      sampleReferenceText = null,
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
      sampleMode,
      sampleSpec,
      sampleReferenceText,
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
