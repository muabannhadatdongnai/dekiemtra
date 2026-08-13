/**
 * loginRateLimiter.js
 * Chặn brute-force mật khẩu ở /api/login: quá nhiều lần sai liên tiếp theo IP trong 1 khoảng
 * thời gian -> tạm khoá.
 *
 * ⚠️ GIỚI HẠN (đọc trước khi dùng, giống tinh thần đã ghi trong sampleExamCache.js): đây là
 * bộ đếm TRONG BỘ NHỚ (module-level Map), KHÔNG phải Redis/KV. Trên Vercel serverless, mỗi
 * function instance có thể bị huỷ/tạo lại bất kỳ lúc nào, không chia sẻ bộ nhớ giữa các
 * instance -> đây là hàng phòng thủ "best-effort", KHÔNG phải chặn tuyệt đối 100%. Vẫn hữu
 * ích vì chặn được kiểu bot dò mật khẩu liên tục trong thời gian ngắn (rơi vào cùng 1 instance
 * "ấm"). Nếu cần chặn chắc chắn xuyên nhiều instance, cần chuyển sang Upstash Redis (free tier)
 * - xem ghi chú tương tự trong sampleExamCache.js.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 phút
const MAX_FAILED_ATTEMPTS = 8; // quá 8 lần sai trong 10 phút -> tạm khoá IP đó

const attemptsStore = new Map();

function isExpired(entry) {
  return Date.now() - entry.firstAttemptAt > WINDOW_MS;
}

export function isRateLimited(key) {
  const entry = attemptsStore.get(key);
  if (!entry) return false;
  if (isExpired(entry)) {
    attemptsStore.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILED_ATTEMPTS;
}

export function recordFailedAttempt(key) {
  const entry = attemptsStore.get(key);
  if (!entry || isExpired(entry)) {
    attemptsStore.set(key, { count: 1, firstAttemptAt: Date.now() });
    return;
  }
  entry.count += 1;
}

export function clearAttempts(key) {
  attemptsStore.delete(key);
}

/** Lấy định danh "khách" tốt nhất có thể từ request (IP) - dùng làm key rate-limit. */
export function getClientKey(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
