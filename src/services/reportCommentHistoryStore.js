import fs from "fs/promises";
import path from "path";
import { isUpstashConfigured, upstashCommand } from "./upstashClient.js";

/**
 * reportCommentHistoryStore.js
 * Lưu nhận xét học bạ CÁC KỲ TRƯỚC theo TỪNG HỌC SINH của TỪNG GIÁO VIÊN, để AI tham chiếu khi
 * tạo nhận xét kỳ mới (ghi nhận sự tiến bộ, không lặp câu chữ y hệt kỳ trước - đúng tinh thần
 * "đánh giá vì sự tiến bộ của học sinh" của TT27/2020).
 *
 * Kiến trúc 2-backend GIỐNG HỆT teacherPreferenceStore.js/questionBankStore.js (Upstash Redis
 * khi có cấu hình, fallback file JSON local khi chưa cấu hình). Khác với teacherPreferenceStore
 * (1 giá trị/giáo viên), ở đây là 1 DANH SÁCH các kỳ theo TỪNG HỌC SINH -> dùng RPUSH/LRANGE
 * (giống questionBankStore.js) thay vì GET/SET đơn giản.
 *
 * ⚠️ Học sinh KHÔNG có "mã số" ổn định trong hệ thống này (chưa có bảng danh sách lớp riêng) -
 * định danh học sinh bằng cặp (họ tên đã chuẩn hoá + lớp). Nếu giáo viên đổi lớp cho học sinh
 * giữa 2 lần lưu, lịch sử sẽ TÁCH RA (coi như học sinh khác) - đây là đánh đổi CHẤP NHẬN ĐƯỢC vì
 * đơn giản hoá đáng kể, và họ tên+lớp hiếm khi trùng giữa 2 học sinh khác nhau trong cùng 1 giáo
 * viên phụ trách.
 *
 * Mọi lỗi backend đều bị NUỐT LẠI (try/catch + console.warn), KHÔNG throw ra ngoài - tạo nhận
 * xét vẫn phải chạy được dù không đọc/lưu được lịch sử (giống triết lý các store khác).
 */

const LOCAL_DATA_DIR = path.join(process.cwd(), ".data", "report-comment-history");
const MAX_HISTORY_PER_STUDENT = 6; // giữ tối đa 6 kỳ gần nhất/học sinh, đủ dùng, tránh phình dữ liệu

function sanitizeKeyPart(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}]+/gu, "_");
}

function studentKey(hoTen, lop) {
  return `${sanitizeKeyPart(hoTen)}__${sanitizeKeyPart(lop)}`;
}

function historyKey(username, hoTen, lop) {
  return `report_comment_history:${sanitizeKeyPart(username)}:${studentKey(hoTen, lop)}`;
}

async function localFilePath(username, hoTen, lop) {
  await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
  const fileName = `${sanitizeKeyPart(username)}__${studentKey(hoTen, lop)}.json`;
  return path.join(LOCAL_DATA_DIR, fileName);
}

let hasWarnedLocalFallback = false;
function warnLocalFallbackOnce() {
  if (hasWarnedLocalFallback) return;
  hasWarnedLocalFallback = true;
  console.warn(
    "[reportCommentHistoryStore] ⚠️ Chưa cấu hình Upstash - đang dùng file JSON local " +
      "(.data/report-comment-history/). KHÔNG bền vững trên Vercel serverless."
  );
}

/** Gộp nhận xét đã tạo (dạng object theo cấu trúc từng cấp) thành 1 đoạn text NGẮN GỌN để làm
 * ngữ cảnh "kỳ trước" cho lần sau - KHÔNG lưu nguyên JSON (đỡ tốn token khi đưa lại vào prompt,
 * và cũng dễ đọc hơn nếu sau này hiển thị "lịch sử" cho giáo viên xem trực tiếp). */
export function summarizeCommentForHistory(comment) {
  if (!comment) return "";
  const parts = [];
  if (comment.phamChat) parts.push(`Phẩm chất: ${comment.phamChat}`);
  if (comment.nangLuc) parts.push(`Năng lực: ${comment.nangLuc}`);
  if (comment.nhanXetChung) parts.push(`Nhận xét chung: ${comment.nhanXetChung}`);
  if (Array.isArray(comment.monHoc)) {
    for (const m of comment.monHoc) {
      if (m?.ten && m?.noiDung) parts.push(`${m.ten}: ${m.noiDung}`);
    }
  }
  return parts.join("\n");
}

/** @returns {Promise<string|null>} text nhận xét gần nhất đã lưu cho học sinh này, null nếu
 * chưa có lịch sử / lỗi đọc. */
export async function getPreviousComment(username, hoTen, lop) {
  try {
    const useUpstash = isUpstashConfigured();
    if (!useUpstash) warnLocalFallbackOnce();

    let entries = [];
    if (useUpstash) {
      const raw = await upstashCommand(["LRANGE", historyKey(username, hoTen, lop), -1, -1]);
      entries = Array.isArray(raw) ? raw : [];
    } else {
      const raw = await fs.readFile(await localFilePath(username, hoTen, lop), "utf8").catch(() => null);
      const parsed = raw ? JSON.parse(raw) : [];
      entries = Array.isArray(parsed) ? parsed.slice(-1) : [];
    }
    if (!entries.length) return null;
    const last = typeof entries[0] === "string" ? JSON.parse(entries[0]) : entries[0];
    return last?.text || null;
  } catch (err) {
    console.warn("[reportCommentHistoryStore] Lỗi đọc lịch sử, bỏ qua:", err.message);
    return null;
  }
}

/** Lấy TOÀN BỘ lịch sử (mới nhất trước) - dùng cho màn hình "so sánh với kỳ trước" nếu cần hiển
 * thị nhiều hơn 1 kỳ trong tương lai. */
export async function getFullCommentHistory(username, hoTen, lop) {
  try {
    const useUpstash = isUpstashConfigured();
    let entries = [];
    if (useUpstash) {
      const raw = await upstashCommand(["LRANGE", historyKey(username, hoTen, lop), 0, -1]);
      entries = Array.isArray(raw) ? raw : [];
    } else {
      const raw = await fs.readFile(await localFilePath(username, hoTen, lop), "utf8").catch(() => null);
      entries = raw ? JSON.parse(raw) : [];
    }
    return entries
      .map((e) => (typeof e === "string" ? JSON.parse(e) : e))
      .filter(Boolean)
      .reverse();
  } catch (err) {
    console.warn("[reportCommentHistoryStore] Lỗi đọc toàn bộ lịch sử, bỏ qua:", err.message);
    return [];
  }
}

/** Lưu 1 nhận xét MỚI vào cuối danh sách lịch sử của học sinh (KHÔNG ghi đè các kỳ trước). Tự
 * cắt bớt danh sách về MAX_HISTORY_PER_STUDENT bản ghi gần nhất. */
export async function saveReportCommentHistory(username, { hoTen, lop, comment, kyHoc = null }) {
  try {
    const text = summarizeCommentForHistory(comment);
    if (!text) return false;

    const entry = JSON.stringify({ text, kyHoc, savedAt: Date.now() });
    const useUpstash = isUpstashConfigured();

    if (useUpstash) {
      const key = historyKey(username, hoTen, lop);
      await upstashCommand(["RPUSH", key, entry]);
      await upstashCommand(["LTRIM", key, -MAX_HISTORY_PER_STUDENT, -1]);
    } else {
      const filePath = await localFilePath(username, hoTen, lop);
      const raw = await fs.readFile(filePath, "utf8").catch(() => null);
      const existing = raw ? JSON.parse(raw) : [];
      const updated = [...existing, entry].slice(-MAX_HISTORY_PER_STUDENT);
      await fs.writeFile(filePath, JSON.stringify(updated), "utf8");
    }
    return true;
  } catch (err) {
    console.warn("[reportCommentHistoryStore] Lỗi lưu lịch sử, bỏ qua:", err.message);
    return false;
  }
}
