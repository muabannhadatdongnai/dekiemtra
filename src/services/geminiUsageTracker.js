import fs from "fs/promises";
import path from "path";
import { isUpstashConfigured, upstashCommand } from "./upstashClient.js";

/**
 * geminiUsageTracker.js
 * Theo dõi số lượt gọi Gemini API THEO NGÀY (tổng + theo từng key + số lần hết hạn mức) để
 * hiển thị cảnh báo cho giáo viên/admin - trả lời câu hỏi "hôm nay đã dùng bao nhiêu, có key
 * nào sắp/đã hết hạn mức chưa" thay vì chỉ biết KHI ĐÃ hết (lúc teacher đang cần tạo đề gấp).
 *
 * ⚠️ KHÔNG hardcode con số hạn mức "chính xác" của Google (free tier RPD - Requests Per Day)
 * làm mốc so sánh phần trăm: hạn mức này Google từng âm thầm đổi (xem geminiKeyPool.js - đã
 * bị cắt 50-80% ngày 6-7/12/2025) và khác nhau theo model/gói. Thay vào đó:
 *   - Đếm số LƯỢT GỌI THẬT (đáng tin cậy 100%, không đoán).
 *   - Đếm số lần BỊ TỪ CHỐI do hết hạn mức thực tế (429/RESOURCE_EXHAUSTED) - đây là tín hiệu
 *     "cảnh báo" đáng tin hơn nhiều so với so sánh với 1 con số có thể đã lỗi thời.
 *   - CHỈ khi admin tự đặt GEMINI_DAILY_QUOTA_PER_KEY (biết chính xác gói mình đang dùng) mới
 *     hiện thêm thanh phần trăm ước tính - có ghi rõ đây là ước tính do admin tự khai báo.
 *
 * 2 backend giống hệt questionBankStore.js (Upstash Redis REST API / file JSON local fallback)
 * - xem giải thích chi tiết về giới hạn của từng backend trong questionBankStore.js, không lặp
 * lại ở đây. Bộ đếm dùng TTL/tự dọn theo NGÀY, không cần cron job dọn dẹp riêng.
 */

const LOCAL_USAGE_FILE = path.join(process.cwd(), ".data", "gemini-usage.json");
const RETENTION_DAYS = 14; // chỉ giữ lại dữ liệu 14 ngày gần nhất, tự dọn khi ghi

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD" theo giờ UTC của server
}

function maskKey(rawKey) {
  if (!rawKey || rawKey.length < 4) return "????";
  return `...${rawKey.slice(-4)}`;
}

// ================================ Backend Upstash ================================

async function upstashRecord({ date, maskedKey, outcome }) {
  const totalKey = `gemini_usage:${date}:total`;
  const perKeyKey = `gemini_usage:${date}:key:${maskedKey}`;
  const quotaErrKey = `gemini_usage:${date}:quota_errors`;

  await upstashCommand(["INCR", totalKey]);
  await upstashCommand(["EXPIRE", totalKey, String(RETENTION_DAYS * 86400)]);
  await upstashCommand(["INCR", perKeyKey]);
  await upstashCommand(["EXPIRE", perKeyKey, String(RETENTION_DAYS * 86400)]);

  if (outcome === "quota_exhausted") {
    await upstashCommand(["INCR", quotaErrKey]);
    await upstashCommand(["EXPIRE", quotaErrKey, String(RETENTION_DAYS * 86400)]);
  }
}

async function upstashReadSummary({ date, maskedKeys }) {
  const [total, quotaErrors, ...perKeyCounts] = await Promise.all([
    upstashCommand(["GET", `gemini_usage:${date}:total`]),
    upstashCommand(["GET", `gemini_usage:${date}:quota_errors`]),
    ...maskedKeys.map((k) => upstashCommand(["GET", `gemini_usage:${date}:key:${k}`])),
  ]);

  const perKey = {};
  maskedKeys.forEach((k, i) => {
    perKey[k] = Number(perKeyCounts[i]) || 0;
  });

  return { total: Number(total) || 0, quotaErrors: Number(quotaErrors) || 0, perKey };
}

// ============================= Backend file JSON local =============================

async function readLocalFile() {
  try {
    return JSON.parse(await fs.readFile(LOCAL_USAGE_FILE, "utf8"));
  } catch {
    return {};
  }
}

async function writeLocalFile(data) {
  await fs.mkdir(path.dirname(LOCAL_USAGE_FILE), { recursive: true });

  // Tự dọn dữ liệu quá cũ (>RETENTION_DAYS ngày) mỗi lần ghi - không cần cron riêng
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  for (const date of Object.keys(data)) {
    if (date < cutoffKey) delete data[date];
  }

  await fs.writeFile(LOCAL_USAGE_FILE, JSON.stringify(data), "utf8");
}

async function localRecord({ date, maskedKey, outcome }) {
  const data = await readLocalFile();
  if (!data[date]) data[date] = { total: 0, quotaErrors: 0, perKey: {} };

  data[date].total += 1;
  data[date].perKey[maskedKey] = (data[date].perKey[maskedKey] || 0) + 1;
  if (outcome === "quota_exhausted") data[date].quotaErrors += 1;

  await writeLocalFile(data);
}

async function localReadSummary({ date, maskedKeys }) {
  const data = await readLocalFile();
  const day = data[date] || { total: 0, quotaErrors: 0, perKey: {} };

  const perKey = {};
  maskedKeys.forEach((k) => {
    perKey[k] = day.perKey?.[k] || 0;
  });

  return { total: day.total || 0, quotaErrors: day.quotaErrors || 0, perKey };
}

// ================================== API công khai ==================================

/**
 * Ghi nhận 1 lượt gọi Gemini (gọi từ geminiKeyPool.js, cả khi thành công LẪN thất bại).
 * ⚠️ KHÔNG BAO GIỜ throw - lỗi ghi nhận thống kê không được làm hỏng việc tạo đề thật.
 * @param {string} rawKey - API key đã dùng (sẽ tự che bớt, chỉ lưu 4 ký tự cuối)
 * @param {"success"|"quota_exhausted"|"other_error"} outcome
 */
export async function recordGeminiCall({ rawKey, outcome }) {
  try {
    const date = todayKey();
    const maskedKey = maskKey(rawKey);
    if (isUpstashConfigured()) {
      await upstashRecord({ date, maskedKey, outcome });
    } else {
      await localRecord({ date, maskedKey, outcome });
    }
  } catch (err) {
    console.warn("[geminiUsageTracker] Không ghi được thống kê sử dụng, bỏ qua:", err.message);
  }
}

/**
 * Lấy tổng quan mức dùng HÔM NAY - dùng cho API /api/usage + widget cảnh báo trên UI.
 * ⚠️ KHÔNG BAO GIỜ throw - lỗi đọc thống kê trả về summary rỗng kèm cờ `unavailable`, để UI
 * hiển thị "chưa có dữ liệu" thay vì crash cả trang.
 * @param {string[]} maskedKeys - danh sách key ĐÃ CHE (lấy từ getMaskedKeyList() bên dưới)
 */
export async function getTodayUsageSummary(maskedKeys) {
  const date = todayKey();
  try {
    const summary = isUpstashConfigured()
      ? await upstashReadSummary({ date, maskedKeys })
      : await localReadSummary({ date, maskedKeys });

    return { date, unavailable: false, ...summary };
  } catch (err) {
    console.warn("[geminiUsageTracker] Không đọc được thống kê sử dụng:", err.message);
    return { date, unavailable: true, total: 0, quotaErrors: 0, perKey: {} };
  }
}

export { maskKey };
