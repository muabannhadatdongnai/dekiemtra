import { NextResponse } from "next/server";
import users from "@/data/users.json";
import { analyzeSampleExam } from "@/services/sampleExamAnalyzer";

/**
 * /api/analyze-sample
 * C4 (Phần B - đề mẫu): route ĐỘC LẬP nhận file đề mẫu giáo viên upload (docx/pdf/ảnh), gọi
 * sampleExamAnalyzer.js, trả về spec phong cách.
 *
 * ⚠️ CHƯA nối vào luồng tạo đề chính (/api/generate) ở bước này - đây CHỈ là bước test riêng:
 * upload file mẫu -> xem spec phong cách trả về có đúng ý không, trước khi tin tưởng đưa vào
 * luồng chính (C6). sampleExamCache.js (C5) cũng CHƯA tồn tại - mỗi lần gọi route này ĐỀU phân
 * tích lại từ đầu (tốn 1 lượt AI priority="analyze" mỗi lần), đây là điều CHỦ Ý để dễ test độc
 * lập, sẽ được nối cache ở C5.
 */

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB - đủ cho ảnh chụp/scan chất lượng cao

export async function POST(request) {
  try {
    const formData = await request.formData();
    const username = formData.get("username");
    const file = formData.get("file");

    if (!username || !users[username]) {
      return NextResponse.json({ error: "Vui lòng đăng nhập lại." }, { status: 401 });
    }
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Thiếu file đề mẫu (field 'file')." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File quá lớn (tối đa 10MB)." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const { spec, extractionMethod } = await analyzeSampleExam({
      buffer,
      mimeType: file.type,
      fileName: file.name,
    });

    return NextResponse.json({ success: true, spec, extractionMethod });
  } catch (err) {
    console.error("[/api/analyze-sample] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi phân tích đề mẫu." },
      { status: 500 }
    );
  }
}
