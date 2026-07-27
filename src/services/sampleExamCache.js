import crypto from "crypto";

/**
 * sampleExamCache.js
 * C5 (Phần B - đề mẫu): lưu lại sampleExamSpec đã phân tích 1 lần, tái sử dụng cho các lần tạo
 * đề sau (theo giáo viên + theo file mẫu) - tránh phân tích lại tốn token AI.
 *
 * ⚠️ GIỚI HẠN QUAN TRỌNG (đọc trước khi dùng): đây là cache TRONG BỘ NHỚ (module-level Map),
 * KHÔNG phải Redis/KV/DB. Trên Vercel serverless, mỗi function instance có thể bị huỷ và tạo
 * lại BẤT KỲ LÚC NÀO (đặc biệt sau vài phút không có request, hoặc khi scale ra nhiều instance
 * song song) - bộ nhớ instance cũ MẤT HOÀN TOÀN, không chia sẻ được giữa các instance khác nhau.
 * Vì vậy cache này CHỈ có tác dụng "best-effort" trong phạm vi 1 instance đang "ấm" (vd nhiều
 * lần bấm "Tạo đề" liên tiếp trong vài phút của CÙNG 1 giáo viên, cùng rơi vào cùng 1 instance) -
 * KHÔNG đảm bảo cache "sống" qua cold start, KHÔNG dùng để lưu trữ lâu dài.
 * Đây là đánh đổi CHỦ Ý để giữ đúng tinh thần "$0 chi phí" của dự án (không thêm Redis/KV trả
 * phí) - xem mục D1 trong ROADMAP_TIEP_THEO.md nếu sau này muốn nâng cấp lên lưu trữ bền vững
 * thật (khi đó nên làm chung với "ngân hàng câu hỏi lưu trữ xuyên suốt" bằng CÙNG 1 cơ chế lưu
 * trữ, thay vì xây riêng 2 lần).
 *
 * KEY CACHE: hash nội dung file (SHA-256), không dùng tên file - vì giáo viên có thể đổi tên
 * file mà nội dung giữ nguyên (vẫn nên cache hit), hoặc dùng lại tên file cũ cho nội dung MỚI
 * (không được phép cache hit nhầm) - hash nội dung là định danh chính xác duy nhất, tên file
 * chỉ mang tính tham khảo. Vẫn giữ scope theo "username" như B2 đã chốt (theo giáo viên + theo
 * file mẫu) - cách ly cache giữa các giáo viên khác nhau dù 2 người lỡ upload 2 file trùng hệt
 * nội dung, tránh gây nhầm lẫn khó hiểu ("sao tôi chưa từng phân tích mà đã có sẵn spec?").
 */

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h - phong cách đề mẫu gần như không đổi trong ngày,
// nhưng vẫn đặt hạn để cache không "sống mãi" gây khó hiểu nếu giáo viên thực sự muốn phân tích lại.

// Module-level Map - xem giới hạn "best-effort" ở JSDoc trên đầu file.
const cacheStore = new Map();

function buildCacheKey(username, buffer) {
  const hash = crypto.createHash("sha256").update(buffer).digest("hex");
  return `${username}::${hash}`;
}

/**
 * @returns {{ spec: Object, extractionMethod: string } | null} - null nếu cache miss/hết hạn.
 */
export function getCachedSampleExamSpec(username, buffer) {
  const key = buildCacheKey(username, buffer);
  const entry = cacheStore.get(key);
  if (!entry) return null;

  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    cacheStore.delete(key); // dọn luôn entry hết hạn khi phát hiện, không chờ job dọn riêng
    return null;
  }

  return { spec: entry.spec, extractionMethod: entry.extractionMethod };
}

export function setCachedSampleExamSpec(username, buffer, { spec, extractionMethod }) {
  const key = buildCacheKey(username, buffer);
  cacheStore.set(key, { spec, extractionMethod, cachedAt: Date.now() });
}

/** Chỉ dùng cho test/debug - đếm số entry đang có trong cache của instance hiện tại. */
export function getCacheSize() {
  return cacheStore.size;
}

/** Chỉ dùng cho test - xoá sạch cache (KHÔNG gọi trong luồng thực tế). */
export function __clearCacheForTest() {
  cacheStore.clear();
}
