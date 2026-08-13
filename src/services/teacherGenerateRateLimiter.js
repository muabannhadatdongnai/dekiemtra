import fs from "fs/promises";
import path from "path";
import { isUpstashConfigured, upstashCommand } from "./upstashClient.js";

/**
 * teacherGenerateRateLimiter.js
 * ⚠️ RÀ SOÁT BẢO MẬT (xem PROJECT_SUMMARY.md, mục "chưa có rate-limit/giới hạn quota theo giáo
 * viên ở các endpoint sinh nội dung (chỉ /api/login có)"): `loginRateLimiter.js` chỉ chặn brute-
 * force MẬT KHẨU (theo IP) - SAU KHI đã đăng nhập, 1 tài khoản giáo viên hợp lệ (hoặc token bị
 * lộ) có thể gọi `/api/generate*` LIÊN TỤC không giới hạn, tốn quota Gemini/GitHub của chủ dự án
 * (đúng loại rủi ro mà `geminiUsageTracker.js` chỉ ĐO ĐƯỢC chứ không CHẶN được).
 *
 * 2 lớp chặn, ĐỘC LẬP với nhau (vượt 1 trong 2 là bị từ chối):
 *   1. "Burst" - quá nhiều lượt gọi trong 1 CỬA SỔ NGẮN (vd. spam click nút "Tạo đề" liên tục,
 *      hoặc script gọi lặp). Đếm TRONG BỘ NHỚ (module-level Map), giống HỆT tinh thần
 *      `loginRateLimiter.js` - "best-effort", KHÔNG chia sẻ giữa các serverless instance khác
 *      nhau trên Vercel, nhưng vẫn hữu ích vì chặn được đúng kiểu spam dồn dập rơi vào 1 instance
 *      "ấm" (xem giải thích đầy đủ trong loginRateLimiter.js, không lặp lại ở đây).
 *   2. "Daily" - trần lượt sinh nội dung MỖI NGÀY theo TỪNG GIÁO VIÊN (username đã xác thực qua
 *      token - xem apiAuth.js, KHÔNG bao giờ tin username client tự gửi). Bền vững XUYÊN SUỐT
 *      nhiều instance/nhiều lần deploy - dùng đúng 2 backend đã có sẵn trong dự án
 *      (Upstash Redis REST API / file JSON local `.data/`), giống hệt kiến trúc
 *      `geminiUsageTracker.js` (đọc kỹ comment ở đó để hiểu rõ ưu/nhược điểm từng backend, không
 *      lặp lại ở đây).
 *
 * Cách dùng trong 1 route sinh nội dung:
 *   const auth = requireAuth(request);
 *   if (auth.error) return auth.error;
 *   const limitError = await requireWithinTeacherGenerateLimit(auth.session.username);
 *   if (limitError) return limitError;
 */

// ============================== Lớp 1: Burst (trong bộ nhớ) ==============================

const BURST_WINDOW_MS = 60 * 1000; // 1 phút
const MAX_BURST_CALLS = 6; // quá 6 lượt gọi API sinh nội dung/phút (mọi loại cộng dồn) -> chặn tạm

const burstStore = new Map();

function isBurstExpired(entry) {
  return Date.now() - entry.windowStartAt > BURST_WINDOW_MS;
}

export function isBurstLimited(username) {
  const entry = burstStore.get(username);
  if (!entry) return false;
  if (isBurstExpired(entry)) {
    burstStore.delete(username);
    return false;
  }
  return entry.count >= MAX_BURST_CALLS;
}

export function recordBurstCall(username) {
  const entry = burstStore.get(username);
  if (!entry || isBurstExpired(entry)) {
    burstStore.set(username, { count: 1, windowStartAt: Date.now() });
    return;
  }
  entry.count += 1;
}

/** Chỉ dùng trong test tự động để dọn sạch state giữa các test case độc lập. */
export function __resetBurstStoreForTests() {
  burstStore.clear();
}

// ============================== Lớp 2: Daily (bền vững) ==============================

const LOCAL_USAGE_FILE = path.join(process.cwd(), ".data", "teacher-generate-usage.json");
const RETENTION_DAYS = 3; // chỉ cần giữ vài ngày gần nhất (khác geminiUsageTracker - đây không
// phục vụ thống kê lịch sử, chỉ để so trần "hôm nay")

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD" theo giờ UTC của server
}

export function getDailyLimit() {
  const raw = process.env.TEACHER_DAILY_GENERATE_LIMIT;
  const n = Number(raw);
  return raw && Number.isFinite(n) && n > 0 ? Math.floor(n) : 40;
}

async function upstashGetCount(username, date) {
  const value = await upstashCommand(["GET", `teacher_gen:${date}:${username}`]);
  return Number(value) || 0;
}

async function upstashIncrCount(username, date) {
  const key = `teacher_gen:${date}:${username}`;
  const newValue = await upstashCommand(["INCR", key]);
  await upstashCommand(["EXPIRE", key, String(RETENTION_DAYS * 86400)]);
  return Number(newValue) || 0;
}

async function readLocalFile() {
  try {
    return JSON.parse(await fs.readFile(LOCAL_USAGE_FILE, "utf8"));
  } catch {
    return {};
  }
}

async function writeLocalFile(data) {
  await fs.mkdir(path.dirname(LOCAL_USAGE_FILE), { recursive: true });

  // Tự dọn dữ liệu quá cũ mỗi lần ghi - không cần cron riêng (giống geminiUsageTracker.js).
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  for (const date of Object.keys(data)) {
    if (date < cutoffKey) delete data[date];
  }

  await fs.writeFile(LOCAL_USAGE_FILE, JSON.stringify(data), "utf8");
}

async function localGetCount(username, date) {
  const data = await readLocalFile();
  return data[date]?.[username] || 0;
}

async function localIncrCount(username, date) {
  const data = await readLocalFile();
  if (!data[date]) data[date] = {};
  data[date][username] = (data[date][username] || 0) + 1;
  await writeLocalFile(data);
  return data[date][username];
}

/** Số lượt đã dùng HÔM NAY của 1 giáo viên - KHÔNG BAO GIỜ throw (lỗi đọc -> coi như 0, ưu tiên
 * không chặn nhầm giáo viên hợp lệ chỉ vì backend lưu trữ tạm thời lỗi). */
export async function getDailyCallCount(username) {
  try {
    const date = todayKey();
    return isUpstashConfigured() ? await upstashGetCount(username, date) : await localGetCount(username, date);
  } catch (err) {
    console.warn("[teacherGenerateRateLimiter] Không đọc được số lượt hôm nay, coi như 0:", err.message);
    return 0;
  }
}

/** Cộng thêm 1 lượt cho HÔM NAY - KHÔNG BAO GIỜ throw (lỗi ghi nhận không được làm hỏng lượt sinh
 * nội dung thật của giáo viên). */
async function incrementDailyCallCount(username) {
  try {
    const date = todayKey();
    if (isUpstashConfigured()) {
      await upstashIncrCount(username, date);
    } else {
      await localIncrCount(username, date);
    }
  } catch (err) {
    console.warn("[teacherGenerateRateLimiter] Không ghi được lượt gọi hôm nay, bỏ qua:", err.message);
  }
}

// ============================== API tổng hợp dùng trong route ==============================

/**
 * Kiểm tra + (nếu hợp lệ) GHI NHẬN 1 lượt gọi API sinh nội dung cho `username`. Gọi hàm này
 * NGAY SAU `requireAuth()`, TRƯỚC khi làm việc tốn kém (gọi Gemini, tải SGK từ GitHub...).
 * @returns {Promise<{allowed:boolean, reason:"burst"|"daily"|null, message:string|null, dailyLimit:number, dailyRemaining:number}>}
 */
export async function checkTeacherGenerateLimit(username) {
  const dailyLimit = getDailyLimit();

  if (isBurstLimited(username)) {
    return {
      allowed: false,
      reason: "burst",
      message: "Bạn đang gửi yêu cầu tạo nội dung quá nhanh. Vui lòng đợi khoảng 1 phút rồi thử lại.",
      dailyLimit,
      dailyRemaining: Math.max(0, dailyLimit - (await getDailyCallCount(username))),
    };
  }

  const currentDaily = await getDailyCallCount(username);
  if (currentDaily >= dailyLimit) {
    return {
      allowed: false,
      reason: "daily",
      message: `Bạn đã đạt giới hạn ${dailyLimit} lượt sinh nội dung AI hôm nay. Hạn mức sẽ được làm mới vào ngày mai (theo giờ UTC).`,
      dailyLimit,
      dailyRemaining: 0,
    };
  }

  recordBurstCall(username);
  await incrementDailyCallCount(username);

  return { allowed: true, reason: null, message: null, dailyLimit, dailyRemaining: dailyLimit - currentDaily - 1 };
}
