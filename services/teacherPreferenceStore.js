import fs from "fs/promises";
import path from "path";
import { isUpstashConfigured, upstashCommand } from "./upstashClient.js";

/**
 * teacherPreferenceStore.js
 * ================== GIAI ĐOẠN 3 (nội bộ, đã có từ trước) + GIAI ĐOẠN 3 MỚI (bên ngoài) ==================
 * Lưu "phong cách yêu thích" của TỪNG GIÁO VIÊN, BỀN VỮNG xuyên suốt nhiều lần đăng nhập:
 *   - `favoriteLayoutId` (đã có từ trước): layout phiếu bài tập hay dùng nhất.
 *   - `favoriteExerciseCounts` (MỚI): "công thức đề" - tổ hợp dạng bài + số lượng câu, LƯU
 *     RIÊNG THEO TỪNG KHỐI LỚP (vì dạng bài khả dụng khác nhau theo khối - xem
 *     worksheetExerciseCatalog.js). VD giáo viên hay ra đề Lớp 1 với công thức "6 tính nhẩm + 4
 *     so sánh + 2 giải toán" thì lần sau mở form lên, khối Lớp 1 sẽ tự điền sẵn đúng công thức
 *     đó thay vì defaultCount chung chung trong catalog.
 *
 * ================== GIAI ĐOẠN 10, Việc 2/7 (MỚI - module Soạn giáo án) ==================
 * Thêm phần lưu "Phong cách soạn giáo án" (xem lessonPlanStyles.js), NẰM RIÊNG hoàn toàn với phần
 * Phiếu bài tập ở trên (khác Redis key/khác file JSON local: `teacher_pref:lessonplan:*` thay vì
 * `teacher_pref:worksheet:*`) - tránh mọi rủi ro 2 tính năng đè/lẫn dữ liệu của nhau, dù chỉ 1
 * giáo viên dùng cả 2 module. Xem getLessonPlanPreference()/setLessonPlanPreference() ở cuối file.
 *
 * Kiến trúc 2-backend GIỐNG HỆT questionBankStore.js (Upstash Redis khi có cấu hình, fallback
 * file JSON local khi chưa cấu hình - chỉ dùng để test ở máy cá nhân) - tái sử dụng đúng khuôn
 * đã kiểm định thay vì phát minh lại cách lưu trữ khác. Khác biệt duy nhất: đây là 1 GIÁ TRỊ
 * DUY NHẤT theo mỗi giáo viên (dùng Redis GET/SET) thay vì 1 DANH SÁCH (RPUSH/LRANGE như
 * question bank) - nên đơn giản hơn.
 *
 * Mọi lỗi backend đều bị NUỐT LẠI (try/catch + console.warn), KHÔNG throw ra ngoài - tạo phiếu
 * vẫn phải chạy được dù không đọc/lưu được tuỳ chọn (giống triết lý các store khác trong dự án).
 */

const LOCAL_DATA_DIR = path.join(process.cwd(), ".data", "teacher-preference");

function sanitizeKeyPart(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "_");
}

function prefKey(username) {
  return `teacher_pref:worksheet:${sanitizeKeyPart(username)}`;
}

async function localFilePath(username) {
  await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });
  return path.join(LOCAL_DATA_DIR, `${sanitizeKeyPart(username)}.json`);
}

let hasWarnedLocalFallback = false;
function warnLocalFallbackOnce() {
  if (hasWarnedLocalFallback) return;
  hasWarnedLocalFallback = true;
  console.warn(
    "[teacherPreferenceStore] ⚠️ Chưa cấu hình Upstash - đang dùng file JSON local " +
      "(.data/teacher-preference/). KHÔNG bền vững trên Vercel serverless."
  );
}

/**
 * ================== GIAI ĐOẠN 6 (tương thích ngược) ==================
 * TRƯỚC Giai đoạn 6, `favoriteExerciseCounts[grade]` là counts PHẲNG (VD { tinh_nham: 6, ... })
 * vì lúc đó chỉ có 1 môn (Toán). Giờ lồng thêm 1 cấp theo subject (VD { TOAN: { tinh_nham: 6 } })
 * để 2 môn không ghi đè nhau (xem setWorksheetPreference bên dưới). Dữ liệu ĐÃ LƯU TỪ TRƯỚC (nếu
 * app đã có giáo viên dùng qua Giai đoạn 3) vẫn ở dạng PHẲNG trong Redis/file - hàm này tự nhận
 * diện và "nâng cấp" ngay khi đọc (coi dữ liệu phẳng cũ là của môn "TOAN", vì trước đây chỉ có
 * môn đó), KHÔNG cần chạy script migrate riêng, KHÔNG làm mất dữ liệu giáo viên đã lưu.
 */
function migrateFavoriteExerciseCounts(raw) {
  if (!raw || typeof raw !== "object") return {};
  const migrated = {};
  for (const [grade, value] of Object.entries(raw)) {
    if (!value || typeof value !== "object") continue;
    const looksAlreadyNested = "TOAN" in value || "TIENG_VIET" in value;
    migrated[grade] = looksAlreadyNested ? value : { TOAN: value };
  }
  return migrated;
}

/** @returns {Promise<{ favoriteLayoutId: string|null, favoriteExerciseCounts: Object<string,Object> } | null>}
 * null nếu chưa lưu gì / lỗi. favoriteExerciseCounts luôn là object (rỗng {} nếu chưa lưu gì),
 * KHÔNG BAO GIỜ null, để phía gọi khỏi phải tự kiểm tra optional-chain nhiều lớp. Dạng trả về:
 * { [grade]: { [subject]: {key: count} } } (đã tự động migrate dữ liệu cũ nếu cần, xem
 * migrateFavoriteExerciseCounts() ở trên). */
export async function getWorksheetPreference(username) {
  try {
    const useUpstash = isUpstashConfigured();
    if (!useUpstash) warnLocalFallbackOnce();

    const raw = useUpstash
      ? await upstashCommand(["GET", prefKey(username)])
      : await fs
          .readFile(await localFilePath(username), "utf8")
          .catch(() => null);

    if (!raw) return null;
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return {
      favoriteLayoutId: parsed?.favoriteLayoutId || null,
      favoriteExerciseCounts: migrateFavoriteExerciseCounts(parsed?.favoriteExerciseCounts),
    };
  } catch (err) {
    console.warn("[teacherPreferenceStore] Lỗi đọc tuỳ chọn, bỏ qua:", err.message);
    return null;
  }
}

/**
 * GIAI ĐOẠN 3 MỚI: nhận UPDATE MỘT PHẦN (không phải toàn bộ preference) rồi tự đọc-gộp-ghi lại,
 * để lưu "công thức đề" cho 1 khối lớp KHÔNG xoá mất favoriteLayoutId hay công thức của khối
 * lớp khác đã lưu trước đó.
 * @param updates { favoriteLayoutId?: string|null, gradeExerciseCounts?: { grade: string, subject: string, counts: Object } }
 */
export async function setWorksheetPreference(username, updates) {
  try {
    const useUpstash = isUpstashConfigured();
    const existing = (await getWorksheetPreference(username)) || { favoriteLayoutId: null, favoriteExerciseCounts: {} };

    const merged = {
      favoriteLayoutId:
        updates.favoriteLayoutId !== undefined ? updates.favoriteLayoutId : existing.favoriteLayoutId,
      favoriteExerciseCounts: { ...existing.favoriteExerciseCounts },
      updatedAt: Date.now(),
    };
    // GIAI ĐOẠN 6: lồng thêm 1 cấp theo MÔN (subject) bên trong mỗi khối lớp - TRƯỚC Giai đoạn 6
    // chỉ có 1 môn (Toán) nên `favoriteExerciseCounts[grade]` LÀ counts luôn; giờ có 2 môn với
    // key hoàn toàn khác nhau (VD "tinh_nham" vs "khoanh_tu_loai"), lưu chung 1 cấp sẽ khiến lưu
    // công thức Tiếng Việt XOÁ MẤT công thức Toán đã lưu trước đó cho CÙNG khối lớp - phải tách
    // riêng theo subject để 2 môn không đè lên nhau.
    if (updates.gradeExerciseCounts?.grade && updates.gradeExerciseCounts?.subject) {
      const { grade, subject, counts } = updates.gradeExerciseCounts;
      merged.favoriteExerciseCounts[grade] = {
        ...(existing.favoriteExerciseCounts?.[grade] || {}),
        [subject]: counts,
      };
    }

    const payload = JSON.stringify(merged);
    if (useUpstash) {
      await upstashCommand(["SET", prefKey(username), payload]);
    } else {
      await fs.writeFile(await localFilePath(username), payload, "utf8");
    }
    return true;
  } catch (err) {
    console.warn("[teacherPreferenceStore] Lỗi lưu tuỳ chọn, bỏ qua:", err.message);
    return false;
  }
}

// ================== GIAI ĐOẠN 10, Việc 2/7 (MỚI) - "Phong cách soạn giáo án" ==================
// Namespace HOÀN TOÀN RIÊNG với phần Phiếu bài tập ở trên (key khác, thư mục file local khác) -
// xem giải thích đầy đủ ở JSDoc đầu file.

const LESSON_PLAN_LOCAL_DATA_DIR = path.join(process.cwd(), ".data", "teacher-preference-lessonplan");

function lessonPlanPrefKey(username) {
  return `teacher_pref:lessonplan:${sanitizeKeyPart(username)}`;
}

async function lessonPlanLocalFilePath(username) {
  await fs.mkdir(LESSON_PLAN_LOCAL_DATA_DIR, { recursive: true });
  return path.join(LESSON_PLAN_LOCAL_DATA_DIR, `${sanitizeKeyPart(username)}.json`);
}

let hasWarnedLessonPlanLocalFallback = false;
function warnLessonPlanLocalFallbackOnce() {
  if (hasWarnedLessonPlanLocalFallback) return;
  hasWarnedLessonPlanLocalFallback = true;
  console.warn(
    "[teacherPreferenceStore] ⚠️ Chưa cấu hình Upstash - đang dùng file JSON local " +
      "(.data/teacher-preference-lessonplan/) cho phong cách giáo án. KHÔNG bền vững trên Vercel serverless."
  );
}

/** @returns {Promise<{ styleId: string|null, customStyleText: string|null } | null>}
 * null nếu chưa lưu gì / lỗi đọc. Có lưu rồi thì styleId luôn là 1 trong 4 giá trị của
 * LESSON_PLAN_STYLE_IDS (lessonPlanStyles.js), customStyleText chỉ khác null khi styleId="tu_do". */
export async function getLessonPlanPreference(username) {
  try {
    const useUpstash = isUpstashConfigured();
    if (!useUpstash) warnLessonPlanLocalFallbackOnce();

    const raw = useUpstash
      ? await upstashCommand(["GET", lessonPlanPrefKey(username)])
      : await fs
          .readFile(await lessonPlanLocalFilePath(username), "utf8")
          .catch(() => null);

    if (!raw) return null;
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return {
      styleId: parsed?.styleId || null,
      customStyleText: parsed?.customStyleText || null,
    };
  } catch (err) {
    console.warn("[teacherPreferenceStore] Lỗi đọc phong cách giáo án, bỏ qua:", err.message);
    return null;
  }
}

/**
 * Lưu (GHI ĐÈ TOÀN BỘ, không phải cập nhật 1 phần như setWorksheetPreference() - vì phong cách
 * giáo án chỉ có 2 trường luôn đi cùng nhau, không có khái niệm "cập nhật riêng lẻ" như layout
 * yêu thích/công thức đề bên Phiếu bài tập).
 * @param updates { styleId: string|null, customStyleText?: string|null }
 * styleId=null nghĩa là giáo viên chủ động "Bỏ chọn" phong cách đã lưu trước đó.
 */
export async function setLessonPlanPreference(username, updates) {
  try {
    const useUpstash = isUpstashConfigured();
    const merged = {
      styleId: updates?.styleId || null,
      customStyleText: updates?.styleId ? updates?.customStyleText || null : null,
      updatedAt: Date.now(),
    };

    const payload = JSON.stringify(merged);
    if (useUpstash) {
      await upstashCommand(["SET", lessonPlanPrefKey(username), payload]);
    } else {
      await fs.writeFile(await lessonPlanLocalFilePath(username), payload, "utf8");
    }
    return true;
  } catch (err) {
    console.warn("[teacherPreferenceStore] Lỗi lưu phong cách giáo án, bỏ qua:", err.message);
    return false;
  }
}
