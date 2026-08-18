import fs from "fs/promises";
import path from "path";
import { isUpstashConfigured, upstashCommand } from "./upstashClient.js";

/**
 * sampleAnalyzeRateLimiter.js
 * ⚠️ RÀ SOÁT phát hiện: 3 route "phân tích file mẫu" (`/api/analyze-sample` - đề mẫu,
 * `/api/analyze-lesson-plan-sample` - giáo án mẫu, `/api/analyze-worksheet-sample` - phiếu mẫu)
 * đều gọi AI (qua *SampleAnalyzer.js` tương ứng) để trích spec phong cách từ file giáo viên
 * upload, nhưng KHÔNG hề có rate-limit - khác với 5 route `/api/generate*` đã có
 * `teacherGenerateRateLimiter.js`. Cùng loại rủi ro: 1 tài khoản hợp lệ (hoặc token bị lộ) có
 * thể spam upload liên tục, tốn quota Gemini của chủ dự án.
 *
 * ⚠️ CỐ Ý viết THÀNH FILE RIÊNG (không dùng chung key/quota với `teacherGenerateRateLimiter.js`)
 * dù kiến trúc 2 lớp (Burst + Daily) giống hệt - vì 2 nhóm route có bản chất khác nhau:
 *  - `/api/generate*`: hành động CHÍNH giáo viên chủ động bấm nhiều lần/ngày để tạo đề/giáo án
 *    thật, cần hạn mức cao (mặc định 40/ngày).
 *  - `/api/analyze-*`: hành động PHỤ (chỉ dùng khi giáo viên muốn bám theo phong cách 1 file mẫu
 *    có sẵn), mỗi file mẫu chỉ cần phân tích ĐÚNG 1 LẦN rồi được cache theo hash nội dung file
 *    (xem `sampleExamCache.js`/`lessonPlanSampleCache.js`/`worksheetSampleCache.js` - phân tích
 *    lại CÙNG 1 file không tốn thêm lượt AI) - nên cần hạn mức THẤP HƠN hẳn, và KHÔNG nên trừ vào
 *    hạn mức tạo nội dung chính nếu giáo viên lỡ thử nhiều file mẫu khác nhau trong 1 ngày.
 *
 * Cách dùng trong 1 route phân tích file mẫu:
 *   const auth = requireAuth(request);
 *   if (auth.error) return auth.error;
 *   const limitError = await requireWithinSampleAnalyzeLimit(auth.session.username);
 *   if (limitError) return limitError;
 */

// ============================== Lớp 1: Burst (trong bộ nhớ) ==============================

const BURST_WINDOW_MS = 60 * 1000; // 1 phút
const MAX_BURST_CALLS = 6; // quá 6 lượt phân tích file mẫu/phút (mọi loại analyze-* cộng dồn)

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

const LOCAL_USAGE_FILE = path.join(process.cwd(), ".data", "sample-analyze-usage.json");
const RETENTION_DAYS = 3; // chỉ cần giữ vài ngày gần nhất, giống teacherGenerateRateLimiter.js

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD" theo giờ UTC của server
}

export function getDailyLimit() {
  const raw = process.env.SAMPLE_ANALYZE_DAILY_LIMIT;
  const n = Number(raw);
  return raw && Number.isFinite(n) && n > 0 ? Math.floor(n) : 20; // mặc định thấp hơn hạn mức tạo nội dung chính (40)
}

async function upstashGetCount(username, date) {
  const value = await upstashCommand(["GET", `sample_analyze:${date}:${username}`]);
  return Number(value) || 0;
}

async function upstashIncrCount(username, date) {
  const key = `sample_analyze:${date}:${username}`;
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

  // Tự dọn dữ liệu quá cũ mỗi lần ghi - không cần cron riêng (giống teacherGenerateRateLimiter.js).
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

/** Số lượt phân tích file mẫu đã dùng HÔM NAY của 1 giáo viên - KHÔNG BAO GIỜ throw (lỗi đọc ->
 * coi như 0, ưu tiên không chặn nhầm giáo viên hợp lệ chỉ vì backend lưu trữ tạm thời lỗi). */
export async function getDailyCallCount(username) {
  try {
    const date = todayKey();
    return isUpstashConfigured() ? await upstashGetCount(username, date) : await localGetCount(username, date);
  } catch (err) {
    console.warn("[sampleAnalyzeRateLimiter] Không đọc được số lượt hôm nay, coi như 0:", err.message);
    return 0;
  }
}

/** Cộng thêm 1 lượt cho HÔM NAY - KHÔNG BAO GIỜ throw (lỗi ghi nhận không được làm hỏng lượt phân
 * tích thật của giáo viên). */
async function incrementDailyCallCount(username) {
  try {
    const date = todayKey();
    if (isUpstashConfigured()) {
      await upstashIncrCount(username, date);
    } else {
      await localIncrCount(username, date);
    }
  } catch (err) {
    console.warn("[sampleAnalyzeRateLimiter] Không ghi được lượt gọi hôm nay, bỏ qua:", err.message);
  }
}

// ============================== API tổng hợp dùng trong route ==============================

/**
 * Kiểm tra + (nếu hợp lệ) GHI NHẬN 1 lượt gọi API phân tích file mẫu cho `username`. Gọi hàm này
 * NGAY SAU `requireAuth()`, TRƯỚC khi làm việc tốn kém (đọc file, gọi Gemini...).
 * @returns {Promise<{allowed:boolean, reason:"burst"|"daily"|null, message:string|null, dailyLimit:number, dailyRemaining:number}>}
 */
export async function checkSampleAnalyzeLimit(username) {
  const dailyLimit = getDailyLimit();

  if (isBurstLimited(username)) {
    return {
      allowed: false,
      reason: "burst",
      message: "Bạn đang gửi yêu cầu phân tích file mẫu quá nhanh. Vui lòng đợi khoảng 1 phút rồi thử lại.",
      dailyLimit,
      dailyRemaining: Math.max(0, dailyLimit - (await getDailyCallCount(username))),
    };
  }

  const currentDaily = await getDailyCallCount(username);
  if (currentDaily >= dailyLimit) {
    return {
      allowed: false,
      reason: "daily",
      message: `Bạn đã đạt giới hạn ${dailyLimit} lượt phân tích file mẫu hôm nay. Hạn mức sẽ được làm mới vào ngày mai (theo giờ UTC). Lưu ý: đề/giáo án/phiếu tạo mới không bị ảnh hưởng bởi hạn mức này.`,
      dailyLimit,
      dailyRemaining: 0,
    };
  }

  recordBurstCall(username);
  await incrementDailyCallCount(username);

  return { allowed: true, reason: null, message: null, dailyLimit, dailyRemaining: dailyLimit - currentDaily - 1 };
}
