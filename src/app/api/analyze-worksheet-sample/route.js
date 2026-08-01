import { NextResponse } from "next/server";
import { analyzeWorksheetSample } from "@/services/worksheetSampleAnalyzer";
import { getCachedWorksheetSampleSpec, setCachedWorksheetSampleSpec } from "@/services/worksheetSampleCache";
import { requireAuth } from "@/services/apiAuth";

/**
 * /api/analyze-worksheet-sample
 * ================== GIAI ĐOẠN 2 ==================
 * Nhận file phiếu bài tập mẫu giáo viên upload (docx/pdf/ảnh), gọi worksheetSampleAnalyzer.js,
 * trả về spec phong cách + ngữ cảnh tham khảo (nếu trích được). Kiến trúc route giống hệt
 * /api/analyze-sample (đề kiểm tra): kiểm tra cache TRƯỚC theo (username + hash nội dung file),
 * cache hit -> trả ngay, không tốn thêm lượt AI.
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
      return NextResponse.json({ error: "Thiếu file phiếu mẫu (field 'file')." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File quá lớn (tối đa 10MB)." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const cached = getCachedWorksheetSampleSpec(username, buffer);
    if (cached) {
      return NextResponse.json({ success: true, ...cached, fromCache: true });
    }

    const { spec, referenceContext, extractionMethod } = await analyzeWorksheetSample({
      buffer,
      mimeType: file.type,
      fileName: file.name,
    });

    setCachedWorksheetSampleSpec(username, buffer, { spec, referenceContext, extractionMethod });

    return NextResponse.json({ success: true, spec, referenceContext, extractionMethod, fromCache: false });
  } catch (err) {
    console.error("[/api/analyze-worksheet-sample] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi phân tích phiếu mẫu." },
      { status: 500 }
    );
  }
}
