import crypto from "crypto";

/**
 * worksheetSampleCache.js
 * ================== GIAI ĐOẠN 2 ==================
 * Lưu lại spec phiếu mẫu đã phân tích 1 lần, tái sử dụng cho các lần tạo phiếu sau (theo giáo
 * viên + theo file mẫu) - tránh phân tích lại tốn token AI. Copy đúng khuôn `sampleExamCache.js`
 * (đề kiểm tra), tách namespace riêng để 2 luồng không lẫn cache của nhau.
 *
 * ⚠️ Cùng giới hạn "best-effort" như sampleExamCache.js: cache TRONG BỘ NHỚ (module-level Map),
 * KHÔNG sống được qua cold start của Vercel serverless, KHÔNG dùng để lưu trữ lâu dài.
 */

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

const cacheStore = new Map();

function buildCacheKey(username, buffer) {
  const hash = crypto.createHash("sha256").update(buffer).digest("hex");
  return `${username}::worksheet-sample::${hash}`;
}

/** @returns {{ spec: Object, referenceContext: string|null, extractionMethod: string } | null} */
export function getCachedWorksheetSampleSpec(username, buffer) {
  const key = buildCacheKey(username, buffer);
  const entry = cacheStore.get(key);
  if (!entry) return null;

  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    cacheStore.delete(key);
    return null;
  }

  return { spec: entry.spec, referenceContext: entry.referenceContext, extractionMethod: entry.extractionMethod };
}

export function setCachedWorksheetSampleSpec(username, buffer, { spec, referenceContext, extractionMethod }) {
  const key = buildCacheKey(username, buffer);
  cacheStore.set(key, { spec, referenceContext, extractionMethod, cachedAt: Date.now() });
}

/** Chỉ dùng cho test - xoá sạch cache (KHÔNG gọi trong luồng thực tế). */
export function __clearWorksheetSampleCacheForTest() {
  cacheStore.clear();
}
