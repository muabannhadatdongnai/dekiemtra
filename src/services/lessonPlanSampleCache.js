import crypto from "crypto";

/**
 * lessonPlanSampleCache.js
 * Lưu lại lessonPlanSampleSpec đã phân tích 1 lần, tái sử dụng cho các lần soạn giáo án sau
 * (theo giáo viên + theo file mẫu) - tránh phân tích lại tốn token AI. Y HỆT kiến trúc/giới hạn
 * của sampleExamCache.js (đề kiểm tra) - xem JSDoc đầy đủ ở đó để hiểu rõ đánh đổi "cache trong
 * bộ nhớ, best-effort, không sống qua cold start" (giữ đúng tinh thần $0 chi phí của dự án).
 */

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

const cacheStore = new Map();

function buildCacheKey(username, buffer) {
  const hash = crypto.createHash("sha256").update(buffer).digest("hex");
  return `${username}::${hash}`;
}

/** @returns {{ spec: Object, referenceText: string|null, extractionMethod: string } | null} */
export function getCachedLessonPlanSampleSpec(username, buffer) {
  const key = buildCacheKey(username, buffer);
  const entry = cacheStore.get(key);
  if (!entry) return null;

  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    cacheStore.delete(key);
    return null;
  }

  return { spec: entry.spec, referenceText: entry.referenceText, extractionMethod: entry.extractionMethod };
}

export function setCachedLessonPlanSampleSpec(username, buffer, { spec, referenceText, extractionMethod }) {
  const key = buildCacheKey(username, buffer);
  cacheStore.set(key, { spec, referenceText, extractionMethod, cachedAt: Date.now() });
}

/** Chỉ dùng cho test/debug. */
export function getCacheSize() {
  return cacheStore.size;
}

/** Chỉ dùng cho test - xoá sạch cache (KHÔNG gọi trong luồng thực tế). */
export function __clearCacheForTest() {
  cacheStore.clear();
}
