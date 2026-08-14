import { NextResponse } from "next/server";
import { requireAuth } from "@/services/apiAuth";
import { getConfiguredKeyCount, getMaskedKeyList } from "@/services/geminiKeyPool";
import { getTodayUsageSummary } from "@/services/geminiUsageTracker";
import { getActiveSessionCount } from "@/services/activeSessionCounter";

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
  // #9 (Nhóm D): số session đăng nhập còn hiệu lực - ẩn danh, không liên quan tới thống kê
  // Gemini ở trên, chỉ ghép chung 1 response cho gọn (UsageWidget.jsx đã gọi sẵn endpoint này).
  const activeSessions = await getActiveSessionCount();

  return NextResponse.json({
    ...summary,
    configuredKeyCount: getConfiguredKeyCount(),
    activeSessionCount: activeSessions.count,
    activeSessionCountUnavailable: activeSessions.unavailable,
  });
}
