import { NextResponse } from "next/server";
import { getWorksheetPreference, setWorksheetPreference } from "@/services/teacherPreferenceStore";
import { requireAuth } from "@/services/apiAuth";

/**
 * /api/worksheet-preference
 * GET: lấy tuỳ chọn đã lưu của giáo viên hiện tại (theo token đăng nhập, không tin username
 * client tự gửi - giống nguyên tắc đã áp dụng ở /api/analyze-sample). Gồm layout yêu thích
 * (favoriteLayoutId, đã có từ trước) VÀ "công thức đề" theo từng khối lớp (favoriteExerciseCounts,
 * GIAI ĐOẠN 3 MỚI).
 * POST: lưu MỘT PHẦN tuỳ chọn - body có thể gửi `favoriteLayoutId` (VD giáo viên bấm "⭐ Lưu bố
 * cục này"), và/hoặc `gradeExerciseCounts: { grade, counts }` (VD bấm "⭐ Lưu công thức đề cho
 * khối này"). Gửi phần nào thì chỉ phần đó được cập nhật - xem teacherPreferenceStore.js.
 */

const VALID_GRADES = ["MAM_NON", "LOP_1", "LOP_2"];

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
  const { favoriteLayoutId, gradeExerciseCounts } = body;

  if (favoriteLayoutId !== undefined && favoriteLayoutId !== null && typeof favoriteLayoutId !== "string") {
    return NextResponse.json({ error: "favoriteLayoutId phải là string hoặc null." }, { status: 400 });
  }

  if (gradeExerciseCounts !== undefined) {
    const { grade, counts } = gradeExerciseCounts || {};
    if (!VALID_GRADES.includes(grade)) {
      return NextResponse.json({ error: `grade không hợp lệ, phải là 1 trong: ${VALID_GRADES.join(", ")}` }, { status: 400 });
    }
    if (typeof counts !== "object" || counts === null || Array.isArray(counts)) {
      return NextResponse.json({ error: "counts phải là object { key: số lượng }." }, { status: 400 });
    }
    // Chỉ giữ lại giá trị số không âm - phòng thân dữ liệu bậy từ client (không tin client tuyệt đối).
    const sanitizedCounts = Object.fromEntries(
      Object.entries(counts)
        .filter(([, v]) => typeof v === "number" && v >= 0)
        .map(([k, v]) => [k, Math.floor(v)])
    );
    body.gradeExerciseCounts = { grade, counts: sanitizedCounts };
  }

  const saved = await setWorksheetPreference(auth.session.username, {
    favoriteLayoutId,
    gradeExerciseCounts: body.gradeExerciseCounts,
  });
  return NextResponse.json({ success: saved });
}
