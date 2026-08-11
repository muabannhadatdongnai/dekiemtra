import { NextResponse } from "next/server";
import { getLessonPlanPreference, setLessonPlanPreference } from "@/services/teacherPreferenceStore";
import { requireAuth } from "@/services/apiAuth";
import { LESSON_PLAN_STYLE_IDS, CUSTOM_STYLE_MAX_LENGTH } from "@/data/lessonPlanStyles";

/**
 * /api/lesson-plan-preference
 * GIAI ĐOẠN 10, Việc 2/7 - "Phong cách soạn giáo án" (xem KE_HOACH_GIAI_DOAN_10.md mục 4).
 * GET: lấy phong cách đã lưu của giáo viên hiện tại (theo token đăng nhập, không tin username
 * client tự gửi - đúng nguyên tắc đã áp dụng ở /api/worksheet-preference).
 * POST: lưu (ghi đè) phong cách - body { styleId, customStyleText }. Gửi styleId=null để "Bỏ chọn"
 * phong cách đã lưu trước đó (quay về không dùng phong cách nào).
 */

const VALID_STYLE_IDS = Object.values(LESSON_PLAN_STYLE_IDS);

export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) return auth.error;

  const preference = await getLessonPlanPreference(auth.session.username);
  return NextResponse.json({ success: true, preference });
}

export async function POST(request) {
  const auth = requireAuth(request);
  if (auth.error) return auth.error;

  const body = await request.json().catch(() => ({}));
  const { styleId, customStyleText } = body;

  if (styleId !== undefined && styleId !== null && !VALID_STYLE_IDS.includes(styleId)) {
    return NextResponse.json(
      { error: `styleId không hợp lệ, phải là 1 trong: ${VALID_STYLE_IDS.join(", ")}, hoặc null.` },
      { status: 400 }
    );
  }
  if (customStyleText !== undefined && customStyleText !== null && typeof customStyleText !== "string") {
    return NextResponse.json({ error: "customStyleText phải là string hoặc null." }, { status: 400 });
  }

  // Không tin độ dài client tự giới hạn (input HTML maxLength có thể bị bỏ qua nếu gọi thẳng API)
  // - cắt phòng thân về đúng CUSTOM_STYLE_MAX_LENGTH đã chốt (~150 ký tự).
  const sanitizedCustomText =
    typeof customStyleText === "string" ? customStyleText.trim().slice(0, CUSTOM_STYLE_MAX_LENGTH) : null;

  const saved = await setLessonPlanPreference(auth.session.username, {
    styleId: styleId || null,
    customStyleText: sanitizedCustomText,
  });
  return NextResponse.json({ success: saved });
}
