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
 * ================== GIÁM SÁT HẠN MỨC UPSTASH FREE TIER (Phiên 26) ==================
 * BỐI CẢNH: mọi module gọi upstashCommand() (7 file trong src/services/) đều tự try/catch +
 * console.warn RIÊNG LẺ rồi fallback êm (không throw ra ngoài) - đúng chủ đích để 1 sự cố lưu
 * trữ không bao giờ làm sập tính năng chính (tạo đề/phiếu vẫn phải chạy được). NHƯNG hệ quả là
 * nếu vượt hạn mức free tier (Upstash trả lỗi dạng "ERR max daily request limit exceeded..."),
 * TOÀN BỘ tính năng phụ trợ (ngân hàng câu hỏi tránh trùng, lịch sử nhận xét học bạ, đếm phiên
 * đang hoạt động, chống spam...) sẽ âm thầm ngừng hoạt động mà KHÔNG CÓ TÍN HIỆU RÕ RÀNG nào để
 * Khoa biết cần nâng cấp/theo dõi, vì mỗi module chỉ warn RIÊNG của nó, dễ trôi giữa hàng nghìn
 * dòng log khác của Vercel.
 *
 * GIẢI PHÁP: gộp việc log vào ĐÚNG 1 điểm chung (upstashCommand, nơi mọi lệnh đều đi qua) thay
 * vì sửa từng module gọi nó - không phá vỡ hành vi "fallback êm" hiện có (KHÔNG throw thêm gì
 * mới, chỉ console.error/console.warn để lộ tín hiệu trong log server):
 *   1) Mọi lỗi Upstash đều được gắn 1 tiền tố CỐ ĐỊNH, dễ tìm bằng Ctrl+F/grep trong Vercel Logs:
 *        "[UPSTASH_ERROR]"       - lỗi bất kỳ (mạng, cú pháp lệnh, hết hạn mức...)
 *        "[UPSTASH_QUOTA?]"      - thêm dòng riêng khi nghi ngờ ĐÃ VƯỢT HẠN MỨC (dựa theo đúng
 *                                  câu chữ Upstash trả về khi vượt free tier, xem docs Upstash
 *                                  "max daily request limit exceeded"), kèm gợi ý hành động.
 *   2) Đếm cộng dồn (RESET mỗi khi server khởi động lại/cold start - đây LÀ hạn chế đã biết của
 *      cách đếm trong bộ nhớ tiến trình, KHÔNG phải bộ đếm bền vững chính xác 100% qua nhiều
 *      lần deploy - nhưng đủ dùng làm "chuông báo" định kỳ, không cần thêm hạ tầng gì mới) và
 *      IN 1 DÒNG TÓM TẮT SỨC KHOẺ mỗi UPSTASH_HEALTH_LOG_EVERY lệnh (mặc định 200) - Khoa chỉ
 *      cần định kỳ mở Vercel Logs, tìm "[UPSTASH_HEALTH]" để biết tỉ lệ lỗi gần đây mà không
 *      cần soi từng dòng log riêng lẻ.
 * KHÔNG đổi bất kỳ hành vi throw/catch nào đang có ở các module gọi hàm này.
 */
const UPSTASH_HEALTH_LOG_EVERY = 200;
const upstashHealthCounters = { calls: 0, errors: 0 };

function logUpstashHealthIfDue() {
  if (upstashHealthCounters.calls % UPSTASH_HEALTH_LOG_EVERY !== 0) return;
  console.log(
    `[UPSTASH_HEALTH] ${upstashHealthCounters.calls} lệnh, ${upstashHealthCounters.errors} lỗi ` +
      `kể từ lần khởi động server này (bộ đếm reset khi cold start - chỉ mang tính tham khảo định kỳ).`
  );
}

/**
 * Gọi 1 lệnh Redis qua Upstash REST API - dạng POST body JSON array, vd:
 *   upstashCommand(["INCR", "my-counter"])
 *   upstashCommand(["RPUSH", "my-list", "item1", "item2"])
 * Không cần URL-encode gì cả (khác với dạng path /SET/key/value) - an toàn với mọi ký tự đặc
 * biệt trong value (tiếng Việt có dấu, JSON lồng nhau...).
 */
export async function upstashCommand(command) {
  upstashHealthCounters.calls += 1;
  const redisVerb = Array.isArray(command) ? command[0] : "?"; // chỉ log TÊN lệnh (INCR/RPUSH...),
  // KHÔNG log key/value đầy đủ - tránh lộ dữ liệu học sinh (họ tên, nhận xét...) vào log server.

  let res;
  try {
    res = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
    });
  } catch (networkErr) {
    upstashHealthCounters.errors += 1;
    console.error(`[UPSTASH_ERROR] Lệnh "${redisVerb}" thất bại (lỗi mạng): ${networkErr.message}`);
    logUpstashHealthIfDue();
    throw networkErr;
  }

  const data = await res.json();
  if (data.error) {
    upstashHealthCounters.errors += 1;
    console.error(`[UPSTASH_ERROR] Lệnh "${redisVerb}" thất bại: ${data.error}`);
    // Câu chữ này khớp NGUYÊN VĂN với thông báo Upstash trả về khi vượt hạn mức free tier (xem
    // docs.upstash.com/redis/troubleshooting/max_daily_request_limit) - chỉ log thêm 1 dòng
    // CẢNH BÁO RÕ RÀNG hơn, không đổi logic throw bên dưới.
    if (/limit exceeded|quota/i.test(data.error)) {
      console.error(
        `[UPSTASH_QUOTA?] Nghi ngờ ĐÃ VƯỢT hạn mức Upstash free tier - kiểm tra Dashboard Upstash ` +
          `(mục Usage/Billing) để xác nhận. Nếu đúng, mọi tính năng phụ trợ (ngân hàng câu hỏi, ` +
          `lịch sử nhận xét, đếm phiên hoạt động...) đang fallback êm, KHÔNG báo lỗi cho giáo viên.`
      );
    }
    logUpstashHealthIfDue();
    throw new Error(`Upstash lỗi: ${data.error}`);
  }

  logUpstashHealthIfDue();
  return data.result;
}
