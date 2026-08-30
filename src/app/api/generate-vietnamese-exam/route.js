import { NextResponse } from "next/server";
import { orchestrateVietnameseExamGeneration } from "@/services/vietnameseExamOrchestrator";
import { requireAuth, requireWithinTeacherGenerateLimit } from "@/services/apiAuth";

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const limitError = await requireWithinTeacherGenerateLimit(auth.session.username);
    if (limitError) return limitError;

    const body = await request.json();
    const { grade, selectedBlocks = [], blockInputs = {}, sgkVolume = null, sgkChapterId = null } = body;

    if (!grade || !Array.isArray(selectedBlocks) || selectedBlocks.length === 0) {
      return NextResponse.json(
        { error: "Thiếu tham số: grade và ít nhất 1 khối trong selectedBlocks là bắt buộc." },
        { status: 400 }
      );
    }

    const { results, warnings, quotaExhausted, serverOverloaded } =
      await orchestrateVietnameseExamGeneration({ grade, selectedBlocks, blockInputs, sgkVolume, sgkChapterId });

    if (Object.keys(results).length === 0) {
      // Không khối nào tạo thành công - phân biệt rõ nguyên nhân giống lessonPlanOrchestrator.js,
      // tránh giáo viên nhầm "hết quota" khi thực ra chỉ là Google đang quá tải tạm thời.
      const message =
        warnings[0] ||
        (quotaExhausted
          ? "Đã hết hạn mức Gemini hôm nay, vui lòng thử lại sau."
          : serverOverloaded
            ? "Máy chủ Gemini đang quá tải tạm thời, vui lòng thử lại sau 1-2 phút."
            : "Không thể tạo được khối nào, vui lòng thử lại.");
      return NextResponse.json({ error: message }, { status: 502 });
    }

    return NextResponse.json({ success: true, results, warnings });
  } catch (err) {
    console.error("[/api/generate-vietnamese-exam] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi tạo Đề Tiếng Việt Tiểu học." },
      { status: 500 }
    );
  }
}
