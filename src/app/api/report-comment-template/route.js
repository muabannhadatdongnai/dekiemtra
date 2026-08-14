import { NextResponse } from "next/server";
import { requireAuth } from "@/services/apiAuth";
import { isValidLevelId } from "@/data/reportCommentConfig";
import { buildReportCommentTemplateWorkbook } from "@/services/reportCommentBulkParser";

/**
 * GET /api/report-comment-template?cap=tieu_hoc|thcs|thpt
 * Trả về file Excel mẫu (binary) để giáo viên tải về, điền danh sách học sinh, rồi upload lại
 * qua /api/parse-report-comment-bulk. Cột khác nhau theo cấp học (xem reportCommentBulkParser.js).
 */
export async function GET(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const cap = searchParams.get("cap");
    if (!isValidLevelId(cap)) {
      return NextResponse.json({ error: "Cấp học không hợp lệ." }, { status: 400 });
    }

    const buffer = await buildReportCommentTemplateWorkbook(cap);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="mau-danh-sach-hoc-sinh-${cap}.xlsx"`,
      },
    });
  } catch (err) {
    console.error("[/api/report-comment-template] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi tạo file mẫu." },
      { status: 500 }
    );
  }
}
