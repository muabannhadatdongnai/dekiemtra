import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { isUpstashConfigured, upstashCommand } from "./upstashClient.js";

/**
 * activeSessionCounter.js
 * #9 (Nhóm D): đếm số session ĐĂNG NHẬP còn hiệu lực (chưa hết hạn) - CHỈ để hiển thị 1 con số
 * tổng quan (vd "3 phiên đang hoạt động") cho admin, KHÔNG liên quan tới việc lưu trữ dữ liệu học
 * sinh/lịch sử nhận xét học bạ (xem mục "⚠️ Cần bạn quyết định" trong NEXT_STEPS.md - #9 độc lập
 * hoàn toàn với quyết định đó).
 *
 * ẨN DANH TUYỆT ĐỐI: mỗi lượt đăng nhập chỉ ghi 1 ID NGẪU NHIÊN (crypto.randomUUID(), không liên
 * hệ gì tới username/fullName/role) kèm thời điểm hết hạn - KHÔNG lưu ai đăng nhập, đăng nhập lúc
 * nào, từ đâu. Không có lịch sử: mỗi ID tự "biến mất" khỏi bộ đếm khi hết hạn, không cần cron dọn
 * dẹp riêng.
 *
 * Kỹ thuật đếm "tập hợp có hạn dùng theo từng phần tử" trong Redis: Redis không hỗ trợ TTL cho
 * từng phần tử trong 1 SET, nên dùng SORTED SET (ZSET) với "điểm" (score) = thời điểm hết hạn
 * (epoch ms) của từng session. Muốn đếm số session CÒN hiệu lực: xoá hết phần tử có score < now
 * (ZREMRANGEBYSCORE) rồi đếm phần tử còn lại (ZCARD) - 2 lệnh, không cần TTL riêng cho zset (tự
 * rỗng dần khi không còn ai đăng nhập, không phình vô hạn vì luôn dọn trước khi đếm).
 *
 * 2 backend giống hệt geminiUsageTracker.js/teacherGenerateRateLimiter.js (Upstash Redis REST
 * API / file JSON local fallback trong ".data/") - không lặp lại giải thích ưu/nhược điểm ở đây.
 */

const ZSET_KEY = "active_sessions_zset";
const LOCAL_FILE = path.join(process.cwd(), ".data", "active-sessions.json");

// ================================ Backend Upstash ================================

async function upstashRecord(expiresAt) {
  const id = crypto.randomUUID();
  await upstashCommand(["ZADD", ZSET_KEY, String(expiresAt), id]);
}

async function upstashCount() {
  const now = Date.now();
  // Dọn phần tử hết hạn trước, rồi mới đếm - đảm bảo con số trả về luôn là "còn hiệu lực NGAY
  // LÚC NÀY", không tính nhầm session đã hết hạn nhưng chưa bị dọn.
  await upstashCommand(["ZREMRANGEBYSCORE", ZSET_KEY, "-inf", String(now)]);
  const count = await upstashCommand(["ZCARD", ZSET_KEY]);
  return Number(count) || 0;
}

// ============================= Backend file JSON local =============================

async function readLocalFile() {
  try {
    const raw = JSON.parse(await fs.readFile(LOCAL_FILE, "utf8"));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

async function writeLocalFile(entries) {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(entries), "utf8");
}

async function localRecord(expiresAt) {
  const entries = await readLocalFile();
  const now = Date.now();
  const stillValid = entries.filter((e) => e.expiresAt > now); // dọn cũ luôn khi ghi mới
  stillValid.push({ id: crypto.randomUUID(), expiresAt });
  await writeLocalFile(stillValid);
}

async function localCount() {
  const entries = await readLocalFile();
  const now = Date.now();
  const stillValid = entries.filter((e) => e.expiresAt > now);
  if (stillValid.length !== entries.length) {
    await writeLocalFile(stillValid); // tiện dọn luôn file khi có phần tử hết hạn
  }
  return stillValid.length;
}

// ================================== API công khai ==================================

/**
 * Ghi nhận 1 session mới vừa đăng nhập thành công. Gọi từ /api/login SAU KHI tạo token thành
 * công (createSessionToken) - dùng ĐÚNG `expiresAt` mà token đó đã có, để bộ đếm khớp với hạn
 * dùng thật của token (xem sessionToken.js - SESSION_TTL_MS).
 * ⚠️ KHÔNG BAO GIỜ throw - lỗi ghi nhận thống kê không được làm hỏng luồng đăng nhập thật.
 */
export async function recordActiveSession(expiresAt) {
  try {
    if (isUpstashConfigured()) {
      await upstashRecord(expiresAt);
    } else {
      await localRecord(expiresAt);
    }
  } catch (err) {
    console.warn("[activeSessionCounter] Không ghi được session mới, bỏ qua:", err.message);
  }
}

/**
 * Số session ĐĂNG NHẬP còn hiệu lực NGAY LÚC NÀY - dùng cho /api/usage + UsageWidget.jsx.
 * ⚠️ KHÔNG BAO GIỜ throw - lỗi đọc trả về 0 kèm cờ `unavailable`, để UI ẩn số liệu thay vì crash.
 */
export async function getActiveSessionCount() {
  try {
    const count = isUpstashConfigured() ? await upstashCount() : await localCount();
    return { count, unavailable: false };
  } catch (err) {
    console.warn("[activeSessionCounter] Không đếm được session, bỏ qua:", err.message);
    return { count: 0, unavailable: true };
  }
}
