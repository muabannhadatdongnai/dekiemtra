import { NextResponse } from "next/server";
import { getWorksheetPreference, setWorksheetPreference } from "@/services/teacherPreferenceStore";
import { requireAuth } from "@/services/apiAuth";

/**
 * /api/worksheet-preference
 * ================== GIAI ĐOẠN 3 ==================
 * GET: lấy layout yêu thích đã lưu của giáo viên hiện tại (theo token đăng nhập, không tin
 * username client tự gửi - giống nguyên tắc đã áp dụng ở /api/analyze-sample).
 * POST: lưu lại layout yêu thích mới (VD giáo viên bấm "⭐ Lưu bố cục này làm mặc định").
 */

export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) return auth.error;

  const pref = await getWorksheetPreference(auth.session.username);
  return NextResponse.json({ success: true, preference: pref });
}

export async function POST(request) {
  const auth = requireAuth(request);
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => ({}));
  const { favoriteLayoutId } = body;

  if (favoriteLayoutId !== null && typeof favoriteLayoutId !== "string") {
    return NextResponse.json({ error: "favoriteLayoutId phải là string hoặc null." }, { status: 400 });
  }

  const saved = await setWorksheetPreference(auth.session.username, { favoriteLayoutId });
  return NextResponse.json({ success: saved });
}
