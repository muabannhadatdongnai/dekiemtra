import { NextResponse } from "next/server";
import { requireAuth } from "@/services/apiAuth";
import { getConfiguredKeyCount, getMaskedKeyList } from "@/services/geminiKeyPool";
import { getTodayUsageSummary } from "@/services/geminiUsageTracker";

/**
 * GET /api/usage
 * Trả về thống kê lượt gọi Gemini API HÔM NAY - dùng cho widget cảnh báo quota trên UI
 * (xem src/components/UsageWidget.jsx). Yêu cầu đăng nhập (giống mọi route khác) - không mở
 * thêm quyền admin riêng vì đây là nhóm giáo viên nhỏ, tin cậy, không có nhiều tầng phân
 * quyền cần thiết ở quy mô hiện tại của dự án.
 */
export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) return auth.error;

  const maskedKeys = getMaskedKeyList();
  const summary = await getTodayUsageSummary(maskedKeys);

  return NextResponse.json({
    ...summary,
    configuredKeyCount: getConfiguredKeyCount(),
  });
}
