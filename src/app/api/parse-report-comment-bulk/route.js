import { NextResponse } from "next/server";
import { requireAuth } from "@/services/apiAuth";
import { isValidLevelId } from "@/data/reportCommentConfig";
import { parseReportCommentBulkFile } from "@/services/reportCommentBulkParser";

/**
 * POST /api/parse-report-comment-bulk
 * multipart/form-data: { file, cap }. Đọc file Excel/Word giáo viên upload (không gọi AI, không
 * tốn quota) -> danh sách học sinh + ghi chú thô, để ReportCommentForm.jsx hiển thị lại cho giáo
 * viên xem/sửa TRƯỚC khi bấm "Tạo nhận xét hàng loạt" (gọi /api/generate-report-comment).
 */

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const formData = await request.formData();
    const file = formData.get("file");
    const cap = formData.get("cap");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Thiếu file (field 'file')." }, { status: 400 });
    }
    if (!isValidLevelId(cap)) {
      return NextResponse.json({ error: "Cấp học không hợp lệ." }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "File quá lớn (tối đa 10MB)." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const students = await parseReportCommentBulkFile({
      buffer,
      mimeType: file.type,
      fileName: file.name,
      cap,
    });

    return NextResponse.json({ success: true, students });
  } catch (err) {
    console.error("[/api/parse-report-comment-bulk] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi đọc file danh sách học sinh." },
      { status: 500 }
    );
  }
}
