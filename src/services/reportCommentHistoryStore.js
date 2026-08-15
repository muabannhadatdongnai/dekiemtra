import fs from "fs/promises";
import path from "path";
import { isUpstashConfigured, upstashCommand } from "./upstashClient.js";

/**
 * reportCommentHistoryStore.js
 * Lưu TẠM nhận xét học bạ theo TỪNG HỌC SINH của TỪNG GIÁO VIÊN, để AI tham chiếu khi tạo nhận
 * xét mới trong CÙNG 1 phiên chấm (tránh lặp câu chữ y hệt nếu giáo viên tạo lại/sửa nhiều lần
 * cho cùng 1 học sinh) - đúng tinh thần "đánh giá vì sự tiến bộ của học sinh" của TT27/2020.
 *
 * ⚠️ QUYẾT ĐỊNH ĐÃ CHỐT (phiên 6, thay cho ghi chú "cần bạn quyết định" ở NEXT_STEPS.md): ưu
 * tiên XOÁ SỚM - dữ liệu tự xoá trong vòng TỐI ĐA 1 GIỜ kể từ lần lưu ĐẦU TIÊN của mỗi học sinh.
 * Đánh đổi CHẤP NHẬN: KHÔNG còn tính năng "so sánh với kỳ trước" (các kỳ cách nhau hàng tháng,
 * xa hơn 1 giờ rất nhiều) - vì vậy KHÔNG cần chuẩn hoá giá trị "Lớp" giữa 2 lần nhập (VD "1A" vs
 * "Lớp 1A") như hướng còn lại từng cân nhắc, vì lịch sử tách theo lớp-nhập-không-nhất-quán không
 * còn quan trọng khi dữ liệu đã tự xoá trong vòng 1 giờ. Việc này giảm rủi ro lưu dữ liệu học
 * sinh lâu dài, đổi lại AI chỉ "nhớ" trong cùng 1 đợt chấm bài liên tục.
 *
 * Kiến trúc 2-backend GIỐNG HỆT teacherPreferenceStore.js/questionBankStore.js (Upstash Redis
 * khi có cấu hình, fallback file JSON local khi chưa cấu hình). Khác với teacherPreferenceStore
 * (1 giá trị/giáo viên), ở đây là 1 DANH SÁCH các lần lưu theo TỪNG HỌC SINH -> dùng RPUSH/LRANGE
 * (giống questionBankStore.js) thay vì GET/SET đơn giản.
 *
 * Cơ chế xoá sớm (2 lớp, để chắc chắn KHÔNG lộ dữ liệu quá 1 giờ dù lớp nào lỡ không chạy đúng):
 *   1. Upstash: đặt EXPIRE 3600 giây cho key NGAY LẦN RPUSH ĐẦU TIÊN (TTL chưa từng được đặt) -
 *      để Redis TỰ xoá hẳn key sau tối đa 1 giờ kể từ lần lưu đầu, không phụ thuộc app có gọi lại
 *      hay không. KHÔNG gia hạn lại TTL ở các lần RPUSH sau (nếu gia hạn, key có thể sống mãi nếu
 *      giáo viên liên tục sửa/tạo lại - trái với "tối đa 1 giờ").
 *   2. Cả Upstash lẫn file JSON local: LỌC bỏ mọi bản ghi có savedAt quá 1 giờ MỖI KHI đọc/ghi -
 *      lớp phòng hờ, đề phòng TTL chưa kịp xoá (VD Upstash TTL tính theo giây, có thể trễ vài
 *      giây) hoặc trường hợp local (dev, không có TTL thật ở cấp file).
 *
 * ⚠️ Học sinh KHÔNG có "mã số" ổn định trong hệ thống này (chưa có bảng danh sách lớp riêng) -
 * định danh học sinh bằng cặp (họ tên đã chuẩn hoá + lớp). Nếu giáo viên đổi lớp cho học sinh
 * giữa 2 lần lưu, lịch sử sẽ TÁCH RA (coi như học sinh khác) - chấp nhận được, và với TTL 1 giờ
 * thì ảnh hưởng của việc tách này gần như không đáng kể.
 *
 * Mọi lỗi backend đều bị NUỐT LẠI (try/catch + console.warn), KHÔNG throw ra ngoài - tạo nhận
 * xét vẫn phải chạy được dù không đọc/lưu được lịch sử (giống triết lý các store khác).
 */

const LOCAL_DATA_DIR = path.join(process.cwd(), ".data", "report-comment-history");
const MAX_HISTORY_PER_STUDENT = 6; // giữ tối đa 6 lần gần nhất/học sinh TRONG CỬA SỔ 1 GIỜ, đủ dùng
const MAX_HISTORY_AGE_MS = 60 * 60 * 1000; // 1 giờ - xem giải thích quyết định ở đầu file

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

/** Bỏ các bản ghi đã quá MAX_HISTORY_AGE_MS - lớp lọc phòng hờ dùng chung cho cả 2 backend, xem
 * giải thích "cơ chế xoá sớm (2 lớp)" ở đầu file. */
function filterFreshEntries(parsedEntries) {
  const cutoff = Date.now() - MAX_HISTORY_AGE_MS;
  return parsedEntries.filter((e) => e && typeof e.savedAt === "number" && e.savedAt >= cutoff);
}

/** Gộp nhận xét đã tạo (dạng object theo cấu trúc từng cấp) thành 1 đoạn text NGẮN GỌN để làm
 * ngữ cảnh tham chiếu cho lần lưu sau TRONG CÙNG PHIÊN - KHÔNG lưu nguyên JSON (đỡ tốn token khi
 * đưa lại vào prompt, và cũng dễ đọc hơn nếu sau này hiển thị "lịch sử" cho giáo viên xem trực
 * tiếp). */
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

/** @returns {Promise<string|null>} text nhận xét gần nhất đã lưu cho học sinh này TRONG VÒNG 1
 * GIỜ QUA, null nếu chưa có / đã hết hạn / lỗi đọc. */
export async function getPreviousComment(username, hoTen, lop) {
  try {
    const useUpstash = isUpstashConfigured();
    if (!useUpstash) warnLocalFallbackOnce();

    let rawEntries = [];
    if (useUpstash) {
      const raw = await upstashCommand(["LRANGE", historyKey(username, hoTen, lop), 0, -1]);
      rawEntries = Array.isArray(raw) ? raw : [];
    } else {
      const raw = await fs.readFile(await localFilePath(username, hoTen, lop), "utf8").catch(() => null);
      const parsed = raw ? JSON.parse(raw) : [];
      rawEntries = Array.isArray(parsed) ? parsed : [];
    }
    const parsed = rawEntries.map((e) => (typeof e === "string" ? JSON.parse(e) : e)).filter(Boolean);
    const fresh = filterFreshEntries(parsed);
    if (!fresh.length) return null;
    return fresh[fresh.length - 1]?.text || null;
  } catch (err) {
    console.warn("[reportCommentHistoryStore] Lỗi đọc lịch sử, bỏ qua:", err.message);
    return null;
  }
}

/** Lấy TOÀN BỘ lịch sử CÒN TRONG HẠN (mới nhất trước) - dùng cho màn hình xem lại các lần lưu
 * gần đây nhất TRONG CÙNG 1 GIỜ (KHÔNG phải "so sánh kỳ trước" - tính năng đó đã bỏ, xem quyết
 * định ở đầu file). */
export async function getFullCommentHistory(username, hoTen, lop) {
  try {
    const useUpstash = isUpstashConfigured();
    let rawEntries = [];
    if (useUpstash) {
      const raw = await upstashCommand(["LRANGE", historyKey(username, hoTen, lop), 0, -1]);
      rawEntries = Array.isArray(raw) ? raw : [];
    } else {
      const raw = await fs.readFile(await localFilePath(username, hoTen, lop), "utf8").catch(() => null);
      rawEntries = raw ? JSON.parse(raw) : [];
    }
    const parsed = rawEntries.map((e) => (typeof e === "string" ? JSON.parse(e) : e)).filter(Boolean);
    return filterFreshEntries(parsed).reverse();
  } catch (err) {
    console.warn("[reportCommentHistoryStore] Lỗi đọc toàn bộ lịch sử, bỏ qua:", err.message);
    return [];
  }
}

/** Lưu 1 nhận xét MỚI vào cuối danh sách lịch sử của học sinh (KHÔNG ghi đè các lần trước đó
 * trong cùng cửa sổ 1 giờ). Tự cắt bớt danh sách về MAX_HISTORY_PER_STUDENT bản ghi gần nhất VÀ
 * bỏ các bản ghi đã quá hạn. */
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
      // Chỉ đặt TTL ở LẦN ĐẦU (key chưa từng có expire) - KHÔNG gia hạn lại ở các lần lưu sau,
      // để đảm bảo đúng "tối đa 1 giờ" kể từ lần lưu đầu tiên (xem giải thích ở đầu file).
      const ttl = await upstashCommand(["TTL", key]);
      if (ttl === -1) {
        await upstashCommand(["EXPIRE", key, 3600]);
      }
    } else {
      const filePath = await localFilePath(username, hoTen, lop);
      const raw = await fs.readFile(filePath, "utf8").catch(() => null);
      const existingRaw = raw ? JSON.parse(raw) : [];
      const existingParsed = existingRaw.map((e) => (typeof e === "string" ? JSON.parse(e) : e)).filter(Boolean);
      const freshExisting = filterFreshEntries(existingParsed).map((e) => JSON.stringify(e));
      const updated = [...freshExisting, entry].slice(-MAX_HISTORY_PER_STUDENT);
      await fs.writeFile(filePath, JSON.stringify(updated), "utf8");
    }
    return true;
  } catch (err) {
    console.warn("[reportCommentHistoryStore] Lỗi lưu lịch sử, bỏ qua:", err.message);
    return false;
  }
}
