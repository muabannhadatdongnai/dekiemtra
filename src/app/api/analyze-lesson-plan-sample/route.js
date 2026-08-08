import { NextResponse } from "next/server";
import { analyzeLessonPlanSample } from "@/services/lessonPlanSampleAnalyzer";
import { getCachedLessonPlanSampleSpec, setCachedLessonPlanSampleSpec } from "@/services/lessonPlanSampleCache";
import { requireAuth } from "@/services/apiAuth";

/**
 * /api/analyze-lesson-plan-sample
 * Route nhận file giáo án mẫu giáo viên upload (docx/pdf/ảnh), gọi lessonPlanSampleAnalyzer.js,
 * trả về spec cấu trúc/trình bày. Cùng khuôn với /api/analyze-sample (đề kiểm tra) và
 * /api/analyze-worksheet-sample (phiếu bài tập) - kiểm tra cache TRƯỚC (theo username + hash nội
 * dung file), cache hit thì trả về ngay, không gọi AI lần 2.
 */

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;
    const { username } = auth.session;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Thiếu file giáo án mẫu (field 'file')." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File quá lớn (tối đa 10MB)." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const cached = getCachedLessonPlanSampleSpec(username, buffer);
    if (cached) {
      return NextResponse.json({ success: true, ...cached, fromCache: true });
    }

    const { spec, referenceText, extractionMethod } = await analyzeLessonPlanSample({
      buffer,
      mimeType: file.type,
      fileName: file.name,
    });

    setCachedLessonPlanSampleSpec(username, buffer, { spec, referenceText, extractionMethod });

    return NextResponse.json({ success: true, spec, referenceText, extractionMethod, fromCache: false });
  } catch (err) {
    console.error("[/api/analyze-lesson-plan-sample] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi phân tích giáo án mẫu." },
      { status: 500 }
    );
  }
}
