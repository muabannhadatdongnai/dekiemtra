/**
 * apiClient.js
 * Gom toàn bộ lệnh gọi API phía client vào 1 nơi - component không tự gọi fetch() rải rác nữa.
 * Lợi ích khi mở rộng sau này: thêm endpoint mới (ví dụ /api/question-bank) chỉ cần thêm 1 hàm
 * ở đây, không phải sửa nhiều component; đổi cách xử lý lỗi/logging chỉ cần sửa handleResponse.
 *
 * ⚠️ CẬP NHẬT BẢO MẬT: mọi request tới route cần đăng nhập giờ gắn kèm header
 * "Authorization: Bearer <token>" (token lấy từ authService.getSession(), do /api/login cấp
 * sau khi verify đúng mật khẩu - xem authService.js + sessionToken.js). Trước đây các route
 * chỉ tin "username" gửi trong body, KHÔNG có gì ràng buộc là người gọi thực sự đã đăng nhập.
 */

import { getSession } from "./authService";

function authHeaders() {
  const session = getSession();
  return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
}

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Đã có lỗi xảy ra, vui lòng thử lại.");
  return data;
}

export async function loginRequest(username, password) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res);
}

export async function logoutRequest() {
  try {
    await fetch("/api/login", { method: "DELETE", headers: authHeaders() });
  } catch {
    // không quan trọng nếu lỗi - session phía client (localStorage) vẫn được xoá bình thường
  }
}

export async function fetchChaptersRequest({ grade, subject, volume }) {
  const res = await fetch(`/api/chapters?grade=${grade}&subject=${subject}&volume=${volume}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

/**
 * @param blueprint - xem cấu trúc "examBlueprint" trong src/data/examBlueprint.js
 */
export async function generateExamRequest(blueprint) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(blueprint),
  });
  return handleResponse(res);
}

export async function generateWorksheetRequest(payload) {
  const res = await fetch("/api/generate-worksheet", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/**
 * GIAI ĐOẠN 2: upload file phiếu bài tập mẫu (docx/pdf/ảnh) để phân tích phong cách - xem
 * worksheetSampleAnalyzer.js. Dùng FormData vì cần gửi file nhị phân, giống analyzeSampleExamRequest.
 */
export async function analyzeWorksheetSampleRequest({ username, file }) {
  const formData = new FormData();
  formData.set("username", username);
  formData.set("file", file);
  const res = await fetch("/api/analyze-worksheet-sample", {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  return handleResponse(res);
}

/**
 * C6: upload file đề mẫu (docx/pdf/ảnh) để phân tích phong cách - xem sampleExamAnalyzer.js.
 * Dùng FormData (không phải JSON) vì cần gửi file nhị phân. KHÔNG tự set "Content-Type" ở đây
 * - để trình duyệt tự thêm boundary đúng cho multipart/form-data.
 */
export async function analyzeSampleExamRequest({ username, file }) {
  const formData = new FormData();
  formData.set("username", username);
  formData.set("file", file);
  const res = await fetch("/api/analyze-sample", {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  return handleResponse(res);
}

/**
 * @param blueprint - xem cấu trúc "lessonPlanBlueprint" trong src/data/lessonPlanBlueprint.js
 */
export async function generateLessonPlanRequest(blueprint) {
  const res = await fetch("/api/generate-lesson-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(blueprint),
  });
  return handleResponse(res);
}

/** Thống kê mức dùng Gemini API hôm nay - xem UsageWidget.jsx */
export async function fetchUsageSummaryRequest() {
  const res = await fetch("/api/usage", { headers: authHeaders() });
  return handleResponse(res);
}
