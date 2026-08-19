import { NextResponse } from "next/server";
import { verifySessionToken } from "./sessionToken";
import { checkTeacherGenerateLimit } from "./teacherGenerateRateLimiter";
import { checkSampleAnalyzeLimit } from "./sampleAnalyzeRateLimiter";

/**
 * apiAuth.js
 * Dùng ở ĐẦU mỗi API route cần đăng nhập (generate, generate-worksheet, analyze-sample,
 * chapters). Đọc token từ header "Authorization: Bearer <token>", verify chữ ký + hạn dùng.
 *
 * ⚠️ NGUYÊN TẮC QUAN TRỌNG: KHÔNG bao giờ tin "username" do client tự gửi trong body/formData
 * (đây chính là lỗi bảo mật trước đây). Username xác thực LUÔN lấy từ `auth.session.username`
 * (đã verify qua token) - route KHÔNG được đọc lại `body.username` để quyết định danh tính.
 *
 * Cách dùng trong 1 route:
 *   export async function POST(request) {
 *     const auth = requireAuth(request);
 *     if (auth.error) return auth.error;       // đã là NextResponse 401, trả về luôn
 *     const { username, role } = auth.session;  // danh tính đã được xác thực thật sự
 *     ...
 *   }
 *
 * ================== MỞ RỘNG LỚP 3, ĐỢT 3 ("tắt đăng nhập để test") ==================
 * Hoan yêu cầu: khi truy cập trang, KHÔNG cần đăng nhập, để giáo viên tiện test. CHỦ Ý làm bằng
 * 1 biến môi trường (`NEXT_PUBLIC_DISABLE_LOGIN=true`) thay vì xoá hẳn cơ chế đăng nhập:
 *   - Mặc định (không đặt biến này, hoặc đặt khác "true") -> hành vi CŨ, không đổi gì - production
 *     thật (Vercel) vẫn yêu cầu đăng nhập như trước, không vô tình mở public.
 *   - Chỉ khi ai đó CHỦ Ý bật biến này (VD trong `.env.local` lúc test ở máy cá nhân) thì
 *     `requireAuth()` mới bỏ qua việc verify token, trả thẳng về 1 "session giả" cố định.
 * Dùng tiền tố NEXT_PUBLIC_ (dù đây là code CHẠY Ở SERVER) để CÙNG 1 biến vừa tắt được màn hình
 * đăng nhập ở client (xem src/app/page.js) vừa tắt được kiểm tra token ở server - biến
 * NEXT_PUBLIC_ vẫn đọc được bình thường qua `process.env` ở phía server, không cần khai 2 biến
 * riêng rồi lo 2 nơi lệch nhau (bật 1 nơi quên bật nơi kia).
 * Session giả dùng CỐ ĐỊNH 1 username ("giao_vien_test") - rate limit (teacherGenerateRateLimiter.js)
 * và các store theo username (lessonPlanDiversityStore.js, teacherPreferenceStore.js...) vẫn hoạt
 * động bình thường, chỉ là mọi lượt test đều tính chung vào 1 "giáo viên" duy nhất.
 */
const DISABLE_LOGIN = process.env.NEXT_PUBLIC_DISABLE_LOGIN === "true";
const TEST_SESSION = { username: "giao_vien_test", fullName: "Giáo viên (chế độ test)", role: "teacher" };

export function requireAuth(request) {
  if (DISABLE_LOGIN) {
    return { session: TEST_SESSION, error: null };
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;

  const session = verifySessionToken(token);
  if (!session) {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại." },
        { status: 401 }
      ),
    };
  }

  return { session, error: null };
}

/**
 * Dùng NGAY SAU `requireAuth()` ở ĐẦU mỗi route sinh nội dung AI (`/api/generate*`) - TRƯỚC khi
 * làm việc tốn kém (gọi Gemini, tải SGK từ GitHub...). Xem giải thích đầy đủ 2 lớp chặn (burst +
 * trần theo ngày) trong `teacherGenerateRateLimiter.js`.
 *
 * Cách dùng:
 *   const auth = requireAuth(request);
 *   if (auth.error) return auth.error;
 *   const limitError = await requireWithinTeacherGenerateLimit(auth.session.username);
 *   if (limitError) return limitError;
 *
 * @returns {Promise<import("next/server").NextResponse | null>} null nếu còn trong hạn mức
 * (và ĐÃ ghi nhận lượt gọi này), NextResponse lỗi 429 nếu vượt hạn mức.
 */
export async function requireWithinTeacherGenerateLimit(username) {
  const result = await checkTeacherGenerateLimit(username);
  if (result.allowed) return null;

  return NextResponse.json(
    { error: result.message, rateLimited: true, reason: result.reason, dailyLimit: result.dailyLimit },
    { status: 429 }
  );
}

/**
 * Dùng NGAY SAU `requireAuth()` ở ĐẦU cả 3 route phân tích file mẫu (`/api/analyze-sample`,
 * `/api/analyze-lesson-plan-sample`, `/api/analyze-worksheet-sample`) - TRƯỚC khi đọc file/gọi
 * Gemini. Dùng hạn mức RIÊNG (`sampleAnalyzeRateLimiter.js`), KHÔNG chung với hạn mức sinh nội
 * dung chính (`requireWithinTeacherGenerateLimit`) - xem giải thích lý do tách trong
 * `sampleAnalyzeRateLimiter.js`.
 *
 * Cách dùng:
 *   const auth = requireAuth(request);
 *   if (auth.error) return auth.error;
 *   const limitError = await requireWithinSampleAnalyzeLimit(auth.session.username);
 *   if (limitError) return limitError;
 *
 * @returns {Promise<import("next/server").NextResponse | null>} null nếu còn trong hạn mức
 * (và ĐÃ ghi nhận lượt gọi này), NextResponse lỗi 429 nếu vượt hạn mức.
 */
export async function requireWithinSampleAnalyzeLimit(username) {
  const result = await checkSampleAnalyzeLimit(username);
  if (result.allowed) return null;

  return NextResponse.json(
    { error: result.message, rateLimited: true, reason: result.reason, dailyLimit: result.dailyLimit },
    { status: 429 }
  );
}
