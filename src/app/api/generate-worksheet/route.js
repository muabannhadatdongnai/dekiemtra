import { NextResponse } from "next/server";
import { generateWorksheet } from "@/services/worksheetGenerator";
import { requireAuth } from "@/services/apiAuth";

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

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

    const result = await generateWorksheet({
      grade,
      includeAnswers,
      exerciseCounts,
      layoutId,
      previousLayoutId,
      sampleSpec,
      referenceContext,
      favoriteLayoutId,
      sgkVolume,
      sgkChapterId,
      subject,
    });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[/api/generate-worksheet] error:", err);
    return NextResponse.json({ error: err.message || "Đã có lỗi xảy ra." }, { status: 500 });
  }
}
