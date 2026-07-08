import { GoogleGenAI } from "@google/genai";

/**
 * geminiKeyPool.js
 * Hỗ trợ NHIỀU API key Gemini (từ nhiều tài khoản Google khác nhau) để tăng hạn mức miễn phí
 * tổng cộng - hữu ích vì Google đã âm thầm cắt giảm 50-80% hạn mức free tier từ 6-7/12/2025.
 *
 * ⚠️ CHỖ CẦN THAY ĐỔI: đặt trong .env.local (hoặc Vercel Environment Variables):
 *   GEMINI_API_KEYS=key_thu_1,key_thu_2,key_thu_3
 * (phân tách bằng dấu phẩy, không có khoảng trắng thừa - vẫn tương thích ngược nếu bạn
 * chỉ đặt 1 key duy nhất qua biến GEMINI_API_KEY như trước đây).
 *
 * CHIẾN LƯỢC: mỗi lần gọi API, thử các key theo THỨ TỰ NGẪU NHIÊN (đổi mới mỗi lần) - key
 * nào gặp lỗi hết hạn mức (429/RESOURCE_EXHAUSTED) hoặc lỗi xác thực (403/key sai) thì lập
 * tức chuyển sang key kế tiếp TRONG CÙNG 1 LẦN GỌI, người dùng không thấy gián đoạn.
 * KHÔNG lưu trạng thái ở đâu cả (không cần Redis/KV trả phí) - phù hợp Vercel serverless,
 * nơi mỗi request có thể chạy trên 1 instance khác nhau nên không giữ được bộ nhớ dùng chung.
 */

function parseApiKeys() {
  const multi = process.env.GEMINI_API_KEYS; // ưu tiên biến nhiều key
  const single = process.env.GEMINI_API_KEY; // tương thích ngược với cấu hình cũ (1 key)
  const raw = multi || single || "";
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

const API_KEYS = parseApiKeys();

if (API_KEYS.length === 0) {
  console.warn(
    "[geminiKeyPool] Chưa cấu hình GEMINI_API_KEYS (hoặc GEMINI_API_KEY) trong .env.local."
  );
}

// Tạo sẵn 1 client GoogleGenAI cho mỗi key, tái sử dụng giữa các lần gọi (không tạo lại mỗi request)
const clients = API_KEYS.map((key) => ({ key, client: new GoogleGenAI({ apiKey: key }) }));

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Nhận diện lỗi "hết hạn mức" hoặc "key không hợp lệ" - đáng để thử key khác. */
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
    text.includes("api_key_invalid")
  );
}

/**
 * Gọi Gemini generateContent, tự động thử qua các API key đã cấu hình theo thứ tự ngẫu nhiên.
 * Ném lỗi CUỐI CÙNG ra ngoài nếu tất cả key đều thất bại, hoặc gặp lỗi KHÔNG liên quan đến
 * quota/key (ví dụ model không tồn tại) - trường hợp đó thử key khác cũng vô ích nên dừng ngay.
 */
export async function generateContentWithFailover(params) {
  if (clients.length === 0) {
    throw new Error(
      "Chưa cấu hình GEMINI_API_KEYS hoặc GEMINI_API_KEY trong .env.local / Vercel Environment Variables."
    );
  }

  const order = shuffle(clients);
  let lastError;

  for (let i = 0; i < order.length; i++) {
    try {
      return await order[i].client.models.generateContent(params);
    } catch (err) {
      lastError = err;
      const isLastKey = i === order.length - 1;
      const maskedKey = `...${order[i].key.slice(-4)}`;

      if (!isRetryableWithOtherKey(err)) {
        // Lỗi không liên quan quota/key (vd model bị shutdown, request sai định dạng)
        // -> thử key khác cũng sẽ lỗi y hệt, ném lỗi ra ngay để không tốn thời gian.
        throw err;
      }

      if (isLastKey) {
        throw err; // đã thử hết toàn bộ key, không còn lựa chọn nào khác
      }

      console.warn(
        `[geminiKeyPool] Key ${maskedKey} hết hạn mức hoặc lỗi xác thực, chuyển sang key khác... (${err.message?.slice(0, 100)})`
      );
    }
  }

  throw lastError;
}

/** Số lượng key đang cấu hình - dùng để hiển thị chẩn đoán nếu cần. */
export function getConfiguredKeyCount() {
  return API_KEYS.length;
}
