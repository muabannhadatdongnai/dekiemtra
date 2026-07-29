import { NextResponse } from "next/server";
import { analyzeSampleExam } from "@/services/sampleExamAnalyzer";
import { getCachedSampleExamSpec, setCachedSampleExamSpec } from "@/services/sampleExamCache";
import { requireAuth } from "@/services/apiAuth";

/**
 * /api/analyze-sample
 * C4 (Phần B - đề mẫu): route ĐỘC LẬP nhận file đề mẫu giáo viên upload (docx/pdf/ảnh), gọi
 * sampleExamAnalyzer.js, trả về spec phong cách.
 *
 * ⚠️ CHƯA nối vào luồng tạo đề chính (/api/generate) ở bước này - đây CHỈ là bước test riêng:
 * upload file mẫu -> xem spec phong cách trả về có đúng ý không, trước khi tin tưởng đưa vào
 * luồng chính (C6).
 *
 * C5: đã nối sampleExamCache.js - kiểm tra cache TRƯỚC khi gọi AI, theo (username + hash nội
 * dung file). Cache hit -> trả về ngay, KHÔNG gọi analyzeSampleExam (không tốn thêm 1 lượt AI).
 * Response luôn có field `fromCache` để dễ xác nhận hành vi này khi test (đúng yêu cầu C5:
 * "phân tích lại 1 file mẫu đã cache có bị gọi AI lần 2 không").
 */

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB - đủ cho ảnh chụp/scan chất lượng cao

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;
    // ⚠️ Dùng username đã verify qua token (auth.session.username) để scoping cache - KHÔNG
    // dùng formData.get("username") do client tự gửi (có thể giả mạo tên người khác để dò
    // cache của họ).
    const { username } = auth.session;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Thiếu file đề mẫu (field 'file')." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File quá lớn (tối đa 10MB)." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const cached = getCachedSampleExamSpec(username, buffer);
    if (cached) {
      return NextResponse.json({ success: true, ...cached, fromCache: true });
    }

    const { spec, extractionMethod } = await analyzeSampleExam({
      buffer,
      mimeType: file.type,
      fileName: file.name,
    });

    setCachedSampleExamSpec(username, buffer, { spec, extractionMethod });

    return NextResponse.json({ success: true, spec, extractionMethod, fromCache: false });
  } catch (err) {
    console.error("[/api/analyze-sample] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi phân tích đề mẫu." },
      { status: 500 }
    );
  }
}
