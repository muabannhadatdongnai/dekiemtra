import { NextResponse } from "next/server";
import { orchestrateKhgdGeneration } from "@/services/khgdOrchestrator";
import { requireAuth, requireWithinTeacherGenerateLimit } from "@/services/apiAuth";
import { clampKhgdLessons, sanitizeKhgdLessons } from "@/services/contentGenerationLimits";

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
      lessons = [],
      enableSwd = true,
      enableNls = true,
      kiemTraDinhKy = [],
    } = body;

    if (!grade) {
      return NextResponse.json({ error: "Thiếu tham số: grade là bắt buộc." }, { status: 400 });
    }
    if (!Array.isArray(lessons) || lessons.length === 0) {
      return NextResponse.json(
        { error: 'Danh sách bài học ("lessons") không được rỗng - vui lòng thêm ít nhất 1 bài.' },
        { status: 400 }
      );
    }

    // ⚠️ Trần tối đa số bài học/lượt (xem contentGenerationLimits.js) - cùng nguyên tắc "không
    // tin dữ liệu client" đã áp dụng cho chapterMatrix/exerciseCounts ở các tab khác.
    const { lessons: clampedLessons, wasClamped } = clampKhgdLessons(lessons);
    const limitWarnings = [];
    if (wasClamped) {
      limitWarnings.push(
        `Số bài học đã nhập vượt trần cho phép trong 1 lượt tạo, hệ thống chỉ xử lý ${clampedLessons.length} ` +
          `bài đầu tiên. Vui lòng tạo thêm lượt khác cho các bài còn lại.`
      );
    }

    // Phiên 49: mỗi bài có thể kèm `noiDung` (đoạn trích Markdown SGK do form gắn vào) → chèn vào prompt
    // AI nên PHẢI ép kiểu + cắt độ dài (client không đáng tin), sau bước clamp số bài.
    const { lessons: aiLessons, warnings } = await orchestrateKhgdGeneration({
      subject,
      grade,
      lessons: sanitizeKhgdLessons(clampedLessons),
      enableSwd,
      enableNls,
    });

    if (!aiLessons) {
      return NextResponse.json(
        { error: warnings[0] || "Không thể soạn nội dung Khung KHGD, vui lòng thử lại." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      lessons: aiLessons,
      kiemTraDinhKy,
      warnings: [...limitWarnings, ...warnings],
    });
  } catch (err) {
    console.error("[/api/generate-khgd] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi soạn Khung KHGD." },
      { status: 500 }
    );
  }
}
