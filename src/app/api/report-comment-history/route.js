import { NextResponse } from "next/server";
import { requireAuth } from "@/services/apiAuth";
import { getFullCommentHistory } from "@/services/reportCommentHistoryStore";

/**
 * GET /api/report-comment-history?hoTen=...&lop=...
 * Trả về toàn bộ lịch sử nhận xét đã lưu của 1 học sinh (mới nhất trước) - dùng cho
 * ReportCommentPreview.jsx hiển thị "so sánh với kỳ trước" nếu giáo viên muốn xem lại.
 */
export async function GET(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;
    const { username } = auth.session;

    const { searchParams } = new URL(request.url);
    const hoTen = searchParams.get("hoTen");
    const lop = searchParams.get("lop") || "";

    if (!hoTen) {
      return NextResponse.json({ error: "Thiếu tham số hoTen." }, { status: 400 });
    }

    const history = await getFullCommentHistory(username, hoTen, lop);
    return NextResponse.json({ success: true, history });
  } catch (err) {
    console.error("[/api/report-comment-history] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi lấy lịch sử nhận xét." },
      { status: 500 }
    );
  }
}
