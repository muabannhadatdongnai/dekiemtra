import { NextResponse } from "next/server";
import { generateWorksheet } from "@/services/worksheetGenerator";
import { requireAuth, requireWithinTeacherGenerateLimit } from "@/services/apiAuth";
import {
  clampExerciseCounts,
  getWorksheetMaxPerExercise,
  getWorksheetMaxTotalExercises,
} from "@/services/contentGenerationLimits";

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const limitError = await requireWithinTeacherGenerateLimit(auth.session.username);
    if (limitError) return limitError;

    const body = await request.json();
    // ⚠️ "username" trong body KHÔNG dùng để xác thực nữa (client tự gửi gì cũng được).
    const {
      grade,
      includeAnswers = false,
      exerciseCounts,
      layoutId = null,
      previousLayoutId = null,
      sampleSpec = null,
      referenceContext = null,
      favoriteLayoutId = null,
      sgkVolume = null,
      sgkChapterId = null,
      subject = "TOAN",
    } = body;

    if (!grade || !exerciseCounts) {
      return NextResponse.json({ error: "Thiếu tham số: grade, exerciseCounts." }, { status: 400 });
    }

    // ⚠️ Trần tối đa số bài/lượt gọi (xem contentGenerationLimits.js) - chặn client gửi số
    // lượng bài tập bất thường lớn làm tốn quota Gemini 1 lượt gọi duy nhất.
    const { counts: clampedExerciseCounts, wasClamped } = clampExerciseCounts(exerciseCounts);
    const limitWarnings = wasClamped
      ? [
          `Số lượng bài tập đã nhập vượt trần cho phép mỗi lượt tạo phiếu, hệ thống đã tự động ` +
            `điều chỉnh về đúng giới hạn (tối đa ${getWorksheetMaxPerExercise()} bài/dạng, tổng tối đa ` +
            `${getWorksheetMaxTotalExercises()} bài/lượt tạo). Vui lòng tạo thêm 1 lượt khác nếu cần nhiều bài hơn.`,
        ]
      : [];

    const result = await generateWorksheet({
      grade,
      includeAnswers,
      exerciseCounts: clampedExerciseCounts,
      layoutId,
      previousLayoutId,
      sampleSpec,
      referenceContext,
      favoriteLayoutId,
      sgkVolume,
      sgkChapterId,
      subject,
    });
    return NextResponse.json({
      success: true,
      ...result,
      warnings: [...limitWarnings, ...(result.warnings || [])],
    });
  } catch (err) {
    console.error("[/api/generate-worksheet] error:", err);
    return NextResponse.json({ error: err.message || "Đã có lỗi xảy ra." }, { status: 500 });
  }
}
