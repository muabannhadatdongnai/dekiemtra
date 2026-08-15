import { NextResponse } from "next/server";
import { orchestrateOutlineGeneration } from "@/services/outlineOrchestrator";
import { requireAuth, requireWithinTeacherGenerateLimit } from "@/services/apiAuth";
import { clampOutlineExerciseCounts, clampOutlineStudyDays } from "@/services/contentGenerationLimits";
import { DEFAULT_OUTLINE_EXERCISE_COUNTS, DEFAULT_OUTLINE_STUDY_DAYS } from "@/data/outlineTemplates";

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const limitError = await requireWithinTeacherGenerateLimit(auth.session.username);
    if (limitError) return limitError;

    const body = await request.json();
    const {
      subject = "Toan",
      grade,
      volume = 1,
      chapterIds = [],
      exerciseCounts = DEFAULT_OUTLINE_EXERCISE_COUNTS,
      yeuCauDacBiet = "",
      soNgayOnTap = DEFAULT_OUTLINE_STUDY_DAYS,
    } = body;

    if (!grade) {
      return NextResponse.json({ error: "Thiếu tham số: grade là bắt buộc." }, { status: 400 });
    }

    // ⚠️ Trần tối đa số bài/mỗi mức + tổng số bài (xem contentGenerationLimits.js) - cùng nguyên
    // tắc "không tin dữ liệu client" đã áp dụng cho chapterMatrix/exerciseCounts/soTiet. Số ngày
    // ôn tập (Bước 3/Nhóm E, giáo viên tự nhập) cũng cần clamp cùng lý do.
    const { counts: clampedExerciseCounts, wasClamped } = clampOutlineExerciseCounts(exerciseCounts);
    const clampedSoNgayOnTap = clampOutlineStudyDays(soNgayOnTap);
    const limitWarnings = [];
    if (wasClamped) {
      limitWarnings.push(`Số bài/mức đã nhập vượt trần cho phép, hệ thống đã tự động điều chỉnh về mức tối đa.`);
    }
    if (clampedSoNgayOnTap !== Math.max(1, Number(soNgayOnTap) || 1)) {
      limitWarnings.push(`Số ngày ôn tập đã nhập vượt trần cho phép, hệ thống đã tự động điều chỉnh về mức tối đa.`);
    }

    const { outline, warnings, chapterLabel } = await orchestrateOutlineGeneration({
      subject,
      grade,
      volume,
      chapterIds: Array.isArray(chapterIds) ? chapterIds : [],
      exerciseCounts: clampedExerciseCounts,
      yeuCauDacBiet,
      soNgayOnTap: clampedSoNgayOnTap,
    });

    if (!outline) {
      return NextResponse.json(
        { error: warnings[0] || "Không thể soạn đề cương ôn tập, vui lòng thử lại." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      outline,
      chapterLabel,
      warnings: [...limitWarnings, ...warnings],
    });
  } catch (err) {
    console.error("[/api/generate-outline] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi soạn đề cương ôn tập." },
      { status: 500 }
    );
  }
}
