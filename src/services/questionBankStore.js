import fs from "fs/promises";
import path from "path";

/**
 * questionBankStore.js
 * Ngân hàng câu hỏi BỀN VỮNG, lưu XUYÊN SUỐT nhiều lần tạo đề (khác với chống trùng trong
 * geminiEngine.js chỉ có tác dụng TRONG 1 lần tạo). Mục tiêu: giáo viên tạo đề Chương 3 - Lớp
 * 6 hôm nay, tuần sau tạo lại Chương 3 - Lớp 6 lần nữa -> KHÔNG ra trùng ý tưởng câu hỏi với
 * lần trước, dù đã tắt trình duyệt/đóng app/deploy lại (khác với existingQuestions truyền từ
 * client - cái đó chỉ nhớ trong phiên làm việc hiện tại).
 *
 * ⚠️ 2 BACKEND, tự động chọn theo cấu hình:
 *
 * 1) UPSTASH REDIS (khuyến nghị cho production/Vercel) - free tier đủ dùng cho vài trăm lượt
 *    tạo đề/tháng. Gọi thẳng REST API bằng fetch() thuần, KHÔNG cần cài package @upstash/redis
 *    (giữ tinh thần "$0 chi phí, ít phụ thuộc"). Cấu hình bằng 2 biến môi trường:
 *      UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 *    (Vercel có tích hợp sẵn Upstash trong Marketplace - thêm 1 click là tự điền 2 biến này.)
 *    Tạo tài khoản free tại https://upstash.com
 *
 * 2) FILE JSON LOCAL (fallback khi CHƯA cấu hình Upstash) - ghi vào .data/question-bank/ ở
 *    ổ đĩa cục bộ. ⚠️ CHỈ hoạt động đúng khi chạy `npm run dev` / self-host có ổ đĩa bền
 *    (VPS, Docker có volume) - KHÔNG hoạt động đúng trên Vercel serverless (mỗi request có
 *    thể rơi vào instance khác, filesystem là /tmp tạm thời, dữ liệu MẤT sau khi instance bị
 *    huỷ). Dùng backend này để TEST TÍNH NĂNG ở máy cá nhân trước khi cấu hình Upstash thật -
 *    không nên coi là giải pháp lưu trữ thật cho production trên Vercel.
 *
 * Mọi lỗi backend (mạng lỗi, Upstash quá hạn mức free tier, ổ đĩa không ghi được...) đều được
 * NUỐT LẠI (try/catch + console.warn), KHÔNG BAO GIỜ throw ra ngoài - tạo đề vẫn phải chạy
 * được dù ngân hàng câu hỏi tạm thời không truy cập được (giống triết lý "luồng phụ lỗi không
 * được làm hỏng luồng chính" đã áp dụng cho sampleExamCache.js / analyze-sample).
 */

const MAX_ENTRIES_PER_KEY = 300; // giới hạn số câu lưu / (môn+lớp+chương) - tránh phình to vô hạn
const LOCAL_DATA_DIR = path.join(process.cwd(), ".data", "question-bank");

function sanitizeKeyPart(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "_");
}

function bankKey({ subject, grade, chapterId }) {
  return `qbank:${sanitizeKeyPart(subject)}:${sanitizeKeyPart(grade)}:${sanitizeKeyPart(chapterId)}`;
}

function isUpstashConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/** Gọi 1 lệnh Redis qua Upstash REST API (dạng POST body JSON array - không cần URL-encode). */
async function upstashCommand(command) {
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

async function upstashAppend(key, items) {
  if (items.length === 0) return;
  // RPUSH nhiều item 1 lần, sau đó LTRIM để chỉ giữ lại MAX_ENTRIES_PER_KEY item gần nhất
  await upstashCommand(["RPUSH", key, ...items]);
  await upstashCommand(["LTRIM", key, String(-MAX_ENTRIES_PER_KEY), "-1"]);
}

async function upstashReadAll(key) {
  const raw = await upstashCommand(["LRANGE", key, "0", "-1"]);
  return Array.isArray(raw) ? raw : [];
}

async function localFilePath(key) {
  await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
  return path.join(LOCAL_DATA_DIR, `${sanitizeKeyPart(key)}.json`);
}

async function localAppend(key, items) {
  if (items.length === 0) return;
  const filePath = await localFilePath(key);
  let current = [];
  try {
    current = JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    current = []; // file chưa tồn tại hoặc hỏng -> coi như rỗng
  }
  const updated = [...current, ...items].slice(-MAX_ENTRIES_PER_KEY);
  await fs.writeFile(filePath, JSON.stringify(updated), "utf8");
}

async function localReadAll(key) {
  const filePath = await localFilePath(key);
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return [];
  }
}

let hasWarnedLocalFallback = false;
function warnLocalFallbackOnce() {
  if (hasWarnedLocalFallback) return;
  hasWarnedLocalFallback = true;
  console.warn(
    "[questionBankStore] ⚠️ Chưa cấu hình UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN - " +
      "đang dùng file JSON local (.data/question-bank/). Cách này KHÔNG bền vững trên Vercel " +
      "serverless (dữ liệu có thể mất khi instance bị huỷ). Xem hướng dẫn cấu hình Upstash " +
      "trong .env.local.example."
  );
}

/**
 * Lấy toàn bộ câu hỏi đã lưu trước đây cho danh sách chương (dùng để chống trùng XUYÊN SUỐT
 * nhiều lần tạo, không chỉ trong phiên hiện tại).
 * @returns {Promise<string[]>} mảng nội dung câu hỏi (content) - KHÔNG BAO GIỜ throw, lỗi -> [].
 */
export async function getBankEntries({ subject, grade, chapterIds }) {
  try {
    const useUpstash = isUpstashConfigured();
    if (!useUpstash) warnLocalFallbackOnce();

    const results = await Promise.all(
      chapterIds.map(async (chapterId) => {
        const key = bankKey({ subject, grade, chapterId });
        const raw = useUpstash ? await upstashReadAll(key) : await localReadAll(key);
        return raw
          .map((item) => {
            try {
              return typeof item === "string" ? JSON.parse(item) : item;
            } catch {
              return null;
            }
          })
          .filter(Boolean)
          .map((item) => item.content)
          .filter(Boolean);
      })
    );

    return results.flat();
  } catch (err) {
    console.warn("[questionBankStore] Không đọc được ngân hàng câu hỏi, bỏ qua:", err.message);
    return [];
  }
}

/**
 * Lưu các câu hỏi VỪA tạo (đã qua chống trùng) vào ngân hàng bền vững, nhóm theo chương
 * (question.chapterRef). Gọi SAU KHI tạo đề thành công - lỗi ở đây KHÔNG được làm hỏng kết
 * quả trả về giáo viên (đã bọc try/catch, chỉ console.warn khi lỗi).
 */
export async function appendBankEntries({ subject, grade, questions }) {
  try {
    const byChapter = new Map();
    for (const q of questions) {
      if (!q.chapterRef || !q.content) continue;
      if (!byChapter.has(q.chapterRef)) byChapter.set(q.chapterRef, []);
      byChapter.get(q.chapterRef).push(
        JSON.stringify({
          content: q.content,
          level: q.level,
          type: q.type,
          addedAt: Date.now(),
        })
      );
    }

    const useUpstash = isUpstashConfigured();
    await Promise.all(
      [...byChapter.entries()].map(([chapterId, items]) => {
        const key = bankKey({ subject, grade, chapterId });
        return useUpstash ? upstashAppend(key, items) : localAppend(key, items);
      })
    );
  } catch (err) {
    console.warn("[questionBankStore] Không lưu được vào ngân hàng câu hỏi, bỏ qua:", err.message);
  }
}
