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

/** @returns {Promise<{ favoriteLayoutId: string|null, favoriteExerciseCounts: Object<string,Object> } | null>}
 * null nếu chưa lưu gì / lỗi. favoriteExerciseCounts luôn là object (rỗng {} nếu chưa lưu gì),
 * KHÔNG BAO GIỜ null, để phía gọi khỏi phải tự kiểm tra optional-chain nhiều lớp. */
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
      favoriteExerciseCounts: parsed?.favoriteExerciseCounts || {},
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
 * @param updates { favoriteLayoutId?: string|null, gradeExerciseCounts?: { grade: string, counts: Object } }
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
    if (updates.gradeExerciseCounts?.grade) {
      merged.favoriteExerciseCounts[updates.gradeExerciseCounts.grade] = updates.gradeExerciseCounts.counts;
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
