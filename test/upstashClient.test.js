import { test } from "node:test";
import assert from "node:assert/strict";

/**
 * upstashClient.test.js (Phiên 26)
 * Test cho phần "giám sát hạn mức Upstash free tier" mới thêm vào upstashCommand() - xem
 * comment đầy đủ trong upstashClient.js. KHÔNG test lại logic Redis thật (không có DB Upstash
 * thật trong môi trường test) - chỉ mock global.fetch để kiểm tra ĐÚNG 2 điều quan trọng nhất:
 *   1) Hành vi throw/trả kết quả KHÔNG bị đổi so với trước (không phá tính năng thật).
 *   2) Log cảnh báo đúng tiền tố "[UPSTASH_ERROR]"/"[UPSTASH_QUOTA?]" xuất hiện đúng lúc, để
 *      Khoa có thể grep log Vercel tìm những tiền tố này.
 *
 * ⚠️ Mỗi test PHẢI đặt lại process.env + global.fetch + require lại module bằng dynamic import
 * với query string ngẫu nhiên (`?t=...`) - vì bộ đếm sức khoẻ (upstashHealthCounters) là biến
 * module-level DÙNG CHUNG cho cả tiến trình, nếu import 1 lần rồi tái sử dụng ở nhiều test thì
 * bộ đếm test sau sẽ cộng dồn từ test trước, dẫn tới test time bị "ăn theo" nhau.
 */

async function freshUpstashClient() {
  process.env.UPSTASH_REDIS_REST_URL = "https://fake-upstash.example.com";
  process.env.UPSTASH_REDIS_REST_TOKEN = "fake-token";
  // Query string ngẫu nhiên ép Node coi đây là module MỚI (bộ đếm module-level reset về 0),
  // không bị cache lại module đã import từ lần chạy test trước trong cùng tiến trình.
  return import(`../src/services/upstashClient.js?t=${Date.now()}-${Math.random()}`);
}

function captureConsole() {
  const logs = { log: [], error: [] };
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args) => logs.log.push(args.join(" "));
  console.error = (...args) => logs.error.push(args.join(" "));
  return {
    logs,
    restore() {
      console.log = originalLog;
      console.error = originalError;
    },
  };
}

test("upstashCommand: thành công -> trả về data.result, KHÔNG log lỗi gì", async () => {
  const { upstashCommand } = await freshUpstashClient();
  const originalFetch = global.fetch;
  global.fetch = async () => ({ json: async () => ({ result: "OK" }) });
  const capture = captureConsole();

  try {
    const result = await upstashCommand(["GET", "some-key"]);
    assert.equal(result, "OK");
    assert.equal(capture.logs.error.length, 0, "không được log lỗi khi thành công");
  } finally {
    global.fetch = originalFetch;
    capture.restore();
  }
});

test("upstashCommand: lỗi thường -> vẫn throw NGUYÊN VĂN như trước + log '[UPSTASH_ERROR]'", async () => {
  const { upstashCommand } = await freshUpstashClient();
  const originalFetch = global.fetch;
  global.fetch = async () => ({ json: async () => ({ error: "WRONGPASS invalid password" }) });
  const capture = captureConsole();

  try {
    await assert.rejects(() => upstashCommand(["INCR", "k"]), /Upstash lỗi: WRONGPASS invalid password/);
    assert.ok(
      capture.logs.error.some((l) => l.includes("[UPSTASH_ERROR]") && l.includes("WRONGPASS")),
      "thiếu log [UPSTASH_ERROR] đúng nội dung lỗi"
    );
    assert.ok(
      !capture.logs.error.some((l) => l.includes("[UPSTASH_QUOTA?]")),
      "lỗi thường (không liên quan hạn mức) KHÔNG được log cảnh báo [UPSTASH_QUOTA?]"
    );
  } finally {
    global.fetch = originalFetch;
    capture.restore();
  }
});

test("upstashCommand: lỗi vượt hạn mức free tier -> log THÊM cảnh báo '[UPSTASH_QUOTA?]'", async () => {
  const { upstashCommand } = await freshUpstashClient();
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    json: async () => ({ error: "ERR max daily request limit exceeded. Limit: 10000, Usage: 10000." }),
  });
  const capture = captureConsole();

  try {
    await assert.rejects(() => upstashCommand(["INCR", "k"]));
    assert.ok(
      capture.logs.error.some((l) => l.includes("[UPSTASH_QUOTA?]")),
      "vượt hạn mức nhưng KHÔNG thấy log cảnh báo [UPSTASH_QUOTA?] - Khoa sẽ không biết cần kiểm tra Dashboard"
    );
  } finally {
    global.fetch = originalFetch;
    capture.restore();
  }
});

test("upstashCommand: lỗi mạng (fetch throw) -> vẫn throw ra ngoài + log '[UPSTASH_ERROR]'", async () => {
  const { upstashCommand } = await freshUpstashClient();
  const originalFetch = global.fetch;
  global.fetch = async () => {
    throw new Error("network timeout");
  };
  const capture = captureConsole();

  try {
    await assert.rejects(() => upstashCommand(["INCR", "k"]), /network timeout/);
    assert.ok(
      capture.logs.error.some((l) => l.includes("[UPSTASH_ERROR]") && l.includes("network timeout")),
      "lỗi mạng cũng phải được log qua [UPSTASH_ERROR], không được nuốt im lặng ở tầng này"
    );
  } finally {
    global.fetch = originalFetch;
    capture.restore();
  }
});

test("upstashCommand: log '[UPSTASH_HEALTH]' tóm tắt đúng mỗi 200 lệnh (không phải mỗi lệnh)", async () => {
  const { upstashCommand } = await freshUpstashClient();
  const originalFetch = global.fetch;
  global.fetch = async () => ({ json: async () => ({ result: "OK" }) });
  const capture = captureConsole();

  try {
    for (let i = 0; i < 199; i++) {
      // eslint-disable-next-line no-await-in-loop
      await upstashCommand(["GET", `k${i}`]);
    }
    assert.equal(
      capture.logs.log.filter((l) => l.includes("[UPSTASH_HEALTH]")).length,
      0,
      "chưa đủ 200 lệnh thì KHÔNG được log tóm tắt sức khoẻ (tránh spam log)"
    );

    await upstashCommand(["GET", "k199"]); // lệnh thứ 200
    const healthLogs = capture.logs.log.filter((l) => l.includes("[UPSTASH_HEALTH]"));
    assert.equal(healthLogs.length, 1, "đúng lệnh thứ 200 phải có 1 dòng log tóm tắt sức khoẻ");
    assert.ok(healthLogs[0].includes("200 lệnh"), "dòng tóm tắt phải nêu đúng tổng số lệnh");
  } finally {
    global.fetch = originalFetch;
    capture.restore();
  }
});
