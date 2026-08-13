import fs from "fs/promises";
import path from "path";
import { isUpstashConfigured, upstashCommand } from "./upstashClient.js";

/**
 * lessonPlanDiversityStore.js
 * GIAI ĐOẠN 10, Việc 3/7 - "Cơ chế chống trùng liên giáo viên/liên phiên" (xem
 * KE_HOACH_GIAI_DOAN_10.md mục 3 + mục 5 Việc 3). Vấn đề đã xác minh bằng cách đọc code thật
 * (không suy đoán): `lessonPlanEngine.js` trước Việc này HOÀN TOÀN không có cơ chế chống trùng
 * nào (kể cả trong 1 giáo viên tự tạo lại), khác hẳn `geminiEngine.js` (đề kiểm tra) đã có "3 lớp
 * chống trùng" - nhưng lớp đó CHỈ hoạt động trong phạm vi 1 lượt gọi (existingQuestions truyền
 * vào), không có khái niệm so sánh LIÊN GIÁO VIÊN/LIÊN PHIÊN như ở đây.
 *
 * ⚠️ PHẠM VI ĐÃ CHỐT (tránh hiểu nhầm là bản sao 3-lớp chống trùng của đề kiểm tra):
 * - CHỈ lưu/so sánh "Ý TƯỞNG MỞ BÀI" (nội dung hoạt động ĐẦU TIÊN trong "hoatDong" - luôn là
 *   "Khởi động"/tương đương Mầm non theo đúng cấu trúc chuẩn) - KHÔNG lưu toàn bộ giáo án (nặng,
 *   không cần thiết - giáo án còn chịu ràng buộc bởi nội dung SGK cụ thể của từng bài nên tự nhiên
 *   đã khác nhau ở phần kiến thức, chỉ phần "mở bài/trò chơi/ví dụ" mới dễ hội tụ giống nhau).
 * - KHÔNG có vòng lặp "sinh lại nếu trùng" như geminiEngine.js (batch nhiều câu hỏi/lượt nên retry
 *   rẻ) - ở đây MỖI GIÁO ÁN CHỈ SINH 1 LẦN/LƯỢT GỌI, retry tự động sẽ tốn thêm 1 lượt gọi AI mỗi
 *   khi phát hiện giống - ĐỔI LẠI: (a) CHÈN GỢI Ý VÀO PROMPT để AI tự tránh trùng ngay từ đầu
 *   (Lớp Prompt-level, xem lessonPlanPromptTemplates.js), và (b) sau khi sinh xong, NẾU vẫn giống
 *   thì CẢNH BÁO (warning) cho giáo viên tự quyết định có tạo lại hay không - KHÔNG tự ý chặn/sinh
 *   lại thay giáo viên.
 *
 * Khoá lưu trữ theo tổ hợp KHỐI + MÔN + BÀI (KHÔNG có "trường") - đúng kết luận đã chốt ở mục 3
 * kế hoạch: `users.json` giáo viên không có field "trường", và 2 giáo viên khác trường dạy cùng
 * bài SGK cũng NÊN tránh trùng ý tưởng mở bài như nhau, nên không cần phân biệt trường làm gì.
 *
 * Kiến trúc 2-backend TÁI DÙNG ĐÚNG khuôn questionBankStore.js (Upstash Redis + fallback file
 * JSON local) - xem giải thích chi tiết ở đó, không lặp lại ở đây. Mọi lỗi backend đều bị NUỐT
 * LẠI, KHÔNG throw ra ngoài - soạn giáo án vẫn phải chạy được dù không đọc/lưu được ngân hàng.
 */

const MAX_ENTRIES_PER_KEY = 60; // giáo án generate ít lượt hơn câu hỏi nhiều -> giới hạn nhỏ hơn question bank là hợp lý
const MAX_OPENING_IDEA_LENGTH = 400; // đủ để AI "cảm" được ý tưởng cũ, không lưu quá dài tốn dung lượng free tier
const LOCAL_DATA_DIR = path.join(process.cwd(), ".data", "lesson-plan-diversity");

// ĐÃ CHỐT: ngưỡng Jaccard similarity để CẢNH BÁO (KHÔNG chặn) - dùng chung công thức n-gram với
// geminiEngine.js nhưng ngưỡng tách riêng vì bản chất văn bản khác nhau (ý tưởng mở bài là đoạn
// mô tả hoạt động, không phải câu hỏi ngắn) - 0.5 là mức "khá giống", đủ nhạy mà không báo động giả.
export const DIVERSITY_SIMILARITY_WARNING_THRESHOLD = 0.5;

function sanitizeKeyPart(value) {
  const cleaned = String(value ?? "").replace(/[^a-zA-Z0-9_-]/g, "_");
  return cleaned || "_";
}

/** Chuẩn hoá tên bài để so khớp tổ hợp - bỏ dấu, hạ chữ thường, gộp khoảng trắng - vì "tenBai" là
 * text tự do giáo viên gõ, 2 giáo viên có thể gõ hơi khác nhau cho CÙNG 1 bài (thừa khoảng trắng,
 * hoa/thường khác nhau...). KHÔNG dùng để hiển thị, chỉ để làm khoá lưu trữ ổn định. */
function normalizeLessonTitle(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function diversityKey({ subject, grade, tenBai }) {
  const normalizedTitle = normalizeLessonTitle(tenBai);
  return `lp_diversity:${sanitizeKeyPart(subject || "mamnon")}:${sanitizeKeyPart(grade)}:${sanitizeKeyPart(normalizedTitle)}`;
}

function ngrams(text, n = 3) {
  const words = normalizeLessonTitle(text).split(" ").filter(Boolean);
  const grams = new Set();
  for (let i = 0; i <= words.length - n; i++) grams.add(words.slice(i, i + n).join(" "));
  return grams;
}

/** Jaccard similarity trên n-gram (n=3) - CÙNG công thức với geminiEngine.js (đề kiểm tra), viết
 * lại độc lập ở đây thay vì import chéo sang module đề kiểm tra - giữ 2 domain (giáo án/đề kiểm
 * tra) tách biệt hoàn toàn, đúng tinh thần "namespace riêng" đã áp dụng xuyên suốt dự án. */
export function jaccardSimilarity(a, b) {
  const setA = ngrams(a);
  const setB = ngrams(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const gram of setA) if (setB.has(gram)) intersection++;
  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

/**
 * Trích "ý tưởng mở bài" từ 1 giáo án ĐÃ SINH - LUÔN lấy hoạt động ĐẦU TIÊN trong "hoatDong"
 * (theo đúng cấu trúc 4 hoạt động chuẩn CV2345, hoạt động đầu tiên luôn là "Khởi động"; với Mầm
 * non AI được hướng dẫn đặt tên phù hợp khác nhưng VẪN LUÔN đứng ở vị trí đầu tiên) - lấy vị trí
 * thay vì so tên nhãn để không phụ thuộc AI đặt tên đúng chữ "Khởi động" hay không.
 * @returns {string} "" nếu không trích được gì (an toàn, không throw).
 */
export function extractOpeningIdea(lessonPlan) {
  try {
    const first = lessonPlan?.hoatDong?.[0];
    if (!first) return "";
    const text = (first.tienTrinh || [])
      .map((step) => step?.hoatDongGVHS || "")
      .filter(Boolean)
      .join(" ");
    return text.trim().slice(0, MAX_OPENING_IDEA_LENGTH);
  } catch {
    return "";
  }
}

async function upstashAppend(key, item) {
  await upstashCommand(["RPUSH", key, item]);
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

async function localAppend(key, item) {
  const filePath = await localFilePath(key);
  let current = [];
  try {
    current = JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    current = [];
  }
  const updated = [...current, item].slice(-MAX_ENTRIES_PER_KEY);
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
    "[lessonPlanDiversityStore] ⚠️ Chưa cấu hình Upstash - đang dùng file JSON local " +
      "(.data/lesson-plan-diversity/) cho chống trùng liên giáo viên. KHÔNG bền vững trên Vercel serverless."
  );
}

/**
 * Lấy toàn bộ "ý tưởng mở bài" đã lưu trước đây cho ĐÚNG tổ hợp khối+môn+bài (có thể do giáo viên
 * KHÁC tạo, hoặc chính giáo viên này tạo ở PHIÊN TRƯỚC - không phân biệt).
 * @returns {Promise<{openingIdea: string, styleId: string|null, addedAt: number}[]>} KHÔNG BAO GIỜ throw, lỗi -> [].
 */
export async function getDiversityEntries({ subject, grade, tenBai }) {
  try {
    const useUpstash = isUpstashConfigured();
    if (!useUpstash) warnLocalFallbackOnce();

    const key = diversityKey({ subject, grade, tenBai });
    const raw = useUpstash ? await upstashReadAll(key) : await localReadAll(key);
    return raw
      .map((item) => {
        try {
          return typeof item === "string" ? JSON.parse(item) : item;
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch (err) {
    console.warn("[lessonPlanDiversityStore] Không đọc được ngân hàng đa dạng, bỏ qua:", err.message);
    return [];
  }
}

/**
 * Lưu 1 ý tưởng mở bài VỪA sinh vào ngân hàng bền vững, gắn kèm phong cách đã dùng (nếu có) để
 * sau này có thể phân tích/mở rộng. Gọi SAU KHI tạo giáo án thành công - lỗi ở đây KHÔNG được làm
 * hỏng kết quả trả về giáo viên.
 */
export async function appendDiversityEntry({ subject, grade, tenBai, openingIdea, styleId = null }) {
  try {
    if (!openingIdea) return;
    const useUpstash = isUpstashConfigured();
    const key = diversityKey({ subject, grade, tenBai });
    const item = JSON.stringify({ openingIdea, styleId: styleId || null, addedAt: Date.now() });
    if (useUpstash) await upstashAppend(key, item);
    else await localAppend(key, item);
  } catch (err) {
    console.warn("[lessonPlanDiversityStore] Không lưu được vào ngân hàng đa dạng, bỏ qua:", err.message);
  }
}
