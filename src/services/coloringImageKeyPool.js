import { GoogleGenAI } from "@google/genai";

/**
 * coloringImageKeyPool.js
 * Key pool Gemini RIÊNG cho tính năng "Tập tô màu" - KHÔNG dùng chung biến env với
 * geminiKeyPool.js (phần đề thi/phiếu bài tập/giáo án). Lý do tách riêng: tạo ảnh (image
 * generation) và tạo văn bản (text generation) là 2 loại hạn mức free tier KHÁC NHAU trên
 * Google AI Studio, dùng chung 1 pool key sẽ khiến 2 tính năng tranh nhau hạn mức không cần
 * thiết - ví dụ phụ huynh tạo tranh tô màu hàng loạt có thể vô tình làm giáo viên tạo đề thi
 * bị hết hạn mức, dù đây là 2 nhóm người dùng và 2 mục đích hoàn toàn khác nhau.
 *
 * ⚠️ CHỖ CẦN CẤU HÌNH: đặt trong .env.local (hoặc Vercel Environment Variables):
 *   COLORING_GEMINI_API_KEYS=key_thu_1,key_thu_2,key_thu_3
 * (phân tách bằng dấu phẩy, không khoảng trắng thừa; có thể dùng LẠI các key cũ trong
 * GEMINI_API_KEYS nếu muốn, nhưng khuyến nghị tạo key MỚI từ tài khoản Google khác để có
 * hạn mức free độc lập - xem https://aistudio.google.com/app/apikey).
 * Tương thích ngược: nếu chỉ có 1 key thì dùng COLORING_GEMINI_API_KEY.
 *
 * Chiến lược xoay tua/failover giống hệt geminiKeyPool.js (thử ngẫu nhiên, key nào lỗi
 * quota/xác thực/quá tải thì tự chuyển key kế tiếp trong cùng 1 lần gọi).
 */

function parseApiKeys() {
  const multi = process.env.COLORING_GEMINI_API_KEYS;
  const single = process.env.COLORING_GEMINI_API_KEY;
  const raw = multi || single || "";
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

const API_KEYS = parseApiKeys();

if (API_KEYS.length === 0) {
  console.warn(
    "[coloringImageKeyPool] Chưa cấu hình COLORING_GEMINI_API_KEYS (hoặc COLORING_GEMINI_API_KEY) trong .env.local."
  );
}

const clients = API_KEYS.map((key) => ({ key, client: new GoogleGenAI({ apiKey: key }) }));

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function isTransientServerError(err) {
  const status = err?.status ?? err?.code ?? err?.response?.status;
  const text = `${err?.message || ""} ${err?.toString?.() || ""}`.toLowerCase();
  return (
    status === 503 ||
    status === 500 ||
    status === 504 ||
    text.includes("503") ||
    text.includes("unavailable") ||
    text.includes("overloaded") ||
    text.includes("high demand") ||
    text.includes("internal error") ||
    text.includes("deadline exceeded") ||
    text.includes("timeout")
  );
}

function isRetryableWithOtherKey(err) {
  const status = err?.status ?? err?.code ?? err?.response?.status;
  const text = `${err?.message || ""} ${err?.toString?.() || ""}`.toLowerCase();
  return (
    status === 429 ||
    status === 403 ||
    text.includes("429") ||
    text.includes("resource_exhausted") ||
    text.includes("quota") ||
    text.includes("rate limit") ||
    text.includes("permission_denied") ||
    text.includes("api key not valid") ||
    text.includes("api_key_invalid") ||
    isTransientServerError(err)
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function maskKey(key) {
  if (!key || key.length < 4) return "****";
  return `...${key.slice(-4)}`;
}

/**
 * Gọi Gemini generateContent (model tạo ảnh) tự động thử qua các key đã cấu hình theo thứ
 * tự ngẫu nhiên, thử HẾT toàn bộ key trong pool trước khi báo lỗi (tương đương
 * priority="generate" của geminiKeyPool.js - tạo ảnh tô màu là luồng chính, không có
 * phương án dự phòng nào khác).
 */
export async function generateColoringContentWithFailover(params) {
  if (clients.length === 0) {
    throw new Error(
      "Chưa cấu hình COLORING_GEMINI_API_KEYS hoặc COLORING_GEMINI_API_KEY trong .env.local / Vercel Environment Variables."
    );
  }

  const order = shuffle(clients);
  let lastError;
  let quotaFailureCount = 0;
  let overloadFailureCount = 0;

  for (let i = 0; i < order.length; i++) {
    try {
      return await order[i].client.models.generateContent(params);
    } catch (err) {
      lastError = err;
      const overloaded = isTransientServerError(err);
      const isQuota =
        err?.status === 429 ||
        `${err?.message || ""}`.toLowerCase().includes("quota") ||
        `${err?.message || ""}`.toLowerCase().includes("resource_exhausted");
      if (isQuota) quotaFailureCount++;
      if (overloaded) overloadFailureCount++;

      const isLastAttempt = i === order.length - 1;

      if (!isRetryableWithOtherKey(err)) {
        throw err;
      }

      if (isLastAttempt) {
        if (quotaFailureCount === order.length) err.allKeysExhausted = true;
        if (overloadFailureCount === order.length) err.allKeysOverloaded = true;
        // ⚠️ "limit: 0" trong thông báo lỗi Google KHÁC hẳn "đã dùng hết quota trong ngày" -
        // nghĩa là model này CHƯA TỪNG được cấp hạn mức free tier nào cho key/project đó (vd
        // tên model bị resolve sang biến thể preview chưa mở free tier, hoặc project chưa bật
        // đúng API) - báo sai thành "hết hạn mức hôm nay" sẽ khiến người dùng chờ qua ngày mai
        // vô ích, không bao giờ hết lỗi vì bản chất không phải do dùng hết.
        if (/limit["\s:]*0\b/i.test(`${err?.message || ""}`)) {
          err.zeroFreeQuota = true;
        }
        throw err;
      }

      if (overloaded) {
        const backoffMs = 800 * (i + 1) + Math.floor(Math.random() * 400);
        await sleep(backoffMs);
      }

      console.warn(
        `[coloringImageKeyPool] Key ${maskKey(order[i].key)} lỗi (quota/xác thực/quá tải), chuyển key khác... ` +
          `(${err.message?.slice(0, 100)})`
      );
    }
  }

  throw lastError;
}

export function getConfiguredColoringKeyCount() {
  return API_KEYS.length;
}
