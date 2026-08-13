/**
 * upstashClient.js
 * Logic gọi Upstash Redis REST API DÙNG CHUNG cho mọi module cần lưu trữ bền vững
 * (questionBankStore.js, geminiUsageTracker.js...) - tránh lặp lại cùng 1 đoạn fetch() ở
 * nhiều nơi. Dùng fetch() thuần, KHÔNG cần cài package "@upstash/redis" (giữ tinh thần "$0
 * chi phí, ít phụ thuộc"). Cấu hình bằng 2 biến môi trường:
 *   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 * (xem hướng dẫn lấy 2 giá trị này trong .env.local.example)
 */

export function isUpstashConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/**
 * Gọi 1 lệnh Redis qua Upstash REST API - dạng POST body JSON array, vd:
 *   upstashCommand(["INCR", "my-counter"])
 *   upstashCommand(["RPUSH", "my-list", "item1", "item2"])
 * Không cần URL-encode gì cả (khác với dạng path /SET/key/value) - an toàn với mọi ký tự đặc
 * biệt trong value (tiếng Việt có dấu, JSON lồng nhau...).
 */
export async function upstashCommand(command) {
  const res = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  const data = await res.json();
  if (data.error) throw new Error(`Upstash lỗi: ${data.error}`);
  return data.result;
}
