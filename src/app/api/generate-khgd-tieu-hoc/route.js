import { NextResponse } from "next/server";
import { orchestrateKhgdTieuHocGeneration } from "@/services/khgdTieuHocOrchestrator";
import { requireAuth, requireWithinTeacherGenerateLimit } from "@/services/apiAuth";
import { clampKhgdTieuHocLessons } from "@/services/contentGenerationLimits";

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const limitError = await requireWithinTeacherGenerateLimit(auth.session.username);
    if (limitError) return limitError;

    const body = await request.json();
    const { subject = "Tieng_Viet", grade, lessons = [], enableDieuChinh = true } = body;

    if (!grade) {
      return NextResponse.json({ error: "Thiếu tham số: grade là bắt buộc." }, { status: 400 });
    }
    if (!Array.isArray(lessons) || lessons.length === 0) {
      return NextResponse.json(
        { error: 'Danh sách bài học ("lessons") không được rỗng - vui lòng thêm ít nhất 1 bài.' },
        { status: 400 }
      );
    }

    const { lessons: clampedLessons, wasClamped } = clampKhgdTieuHocLessons(lessons);
    const limitWarnings = [];
    if (wasClamped) {
      limitWarnings.push(
        `Số bài học đã nhập vượt trần cho phép trong 1 lượt tạo, hệ thống chỉ xử lý ${clampedLessons.length} ` +
          `bài đầu tiên. Vui lòng tạo thêm lượt khác cho các bài còn lại.`
      );
    }

    const { lessons: aiLessons, warnings } = await orchestrateKhgdTieuHocGeneration({
      subject,
      grade,
      lessons: clampedLessons,
      enableDieuChinh,
    });

    if (!aiLessons) {
      return NextResponse.json(
        { error: warnings[0] || "Không thể soạn nội dung Khung KHGD Tiểu học, vui lòng thử lại." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, lessons: aiLessons, warnings: [...limitWarnings, ...warnings] });
  } catch (err) {
    console.error("[/api/generate-khgd-tieu-hoc] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi soạn Khung KHGD Tiểu học." },
      { status: 500 }
    );
  }
}
