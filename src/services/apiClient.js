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

/** GIAI ĐOẠN 3: lấy/lưu layout phiếu bài tập yêu thích của giáo viên hiện tại. */
export async function getWorksheetPreferenceRequest() {
  const res = await fetch("/api/worksheet-preference", { headers: authHeaders() });
  return handleResponse(res);
}

/** GIAI ĐOẠN 3 MỚI: payload linh hoạt - có thể gửi { favoriteLayoutId } (như trước), hoặc
 * { gradeExerciseCounts: { grade, counts } } (lưu công thức đề), hoặc cả 2 cùng lúc. */
export async function saveWorksheetPreferenceRequest(payload) {
  const res = await fetch("/api/worksheet-preference", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/** GIAI ĐOẠN 10, Việc 2/7: lấy/lưu "Phong cách soạn giáo án" đã lưu của giáo viên hiện tại - xem
 * lessonPlanStyles.js + teacherPreferenceStore.js. Tách HOÀN TOÀN với 2 hàm preference bên trên
 * (khác endpoint, khác dữ liệu) - phần Phiếu bài tập không liên quan gì tới phần Giáo án. */
export async function getLessonPlanPreferenceRequest() {
  const res = await fetch("/api/lesson-plan-preference", { headers: authHeaders() });
  return handleResponse(res);
}

/** payload: { styleId, customStyleText } - gửi styleId=null để "Bỏ chọn" phong cách đã lưu. */
export async function saveLessonPlanPreferenceRequest(payload) {
  const res = await fetch("/api/lesson-plan-preference", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
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

/** Phân tích giáo án mẫu (docx/pdf/ảnh) - dùng cho tính năng "Bám sát mẫu"/"Kết hợp mẫu + SGK". */
export async function analyzeLessonPlanSampleRequest({ username, file }) {
  const formData = new FormData();
  formData.set("username", username);
  formData.set("file", file);
  const res = await fetch("/api/analyze-lesson-plan-sample", {
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

/**
 * @param blueprint - xem cấu trúc "VietnameseExamBlueprint" trong src/data/vietnameseExamBlueprint.js
 */
export async function generateVietnameseExamRequest(blueprint) {
  const res = await fetch("/api/generate-vietnamese-exam", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(blueprint),
  });
  return handleResponse(res);
}

/**
 * @param blueprint - xem cấu trúc "OutlineBlueprint" trong src/data/outlineBlueprint.js
 */
export async function generateOutlineRequest(blueprint) {
  const res = await fetch("/api/generate-outline", {
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

/**
 * TÍNH NĂNG "Nhận xét học bạ" - xem reportCommentConfig.js/reportCommentEngine.js.
 * @param payload { cap, doDai, hocSinh: [...], xungHo?, goiHocSinh?, tone?, coGoiYPhuHuynh? }
 * xungHo/goiHocSinh/tone/coGoiYPhuHuynh áp dụng CHUNG cho cả lượt tạo (xem reportCommentConfig.js).
 * hocSinh có thể là mảng 1 phần tử (gõ tay) hoặc nhiều phần tử (hàng loạt) - route xử lý chung.
 */
export async function generateReportCommentRequest(payload) {
  const res = await fetch("/api/generate-report-comment", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/** Lấy toàn bộ lịch sử nhận xét đã lưu (mới nhất trước) của 1 học sinh. */
export async function getReportCommentHistoryRequest({ hoTen, lop }) {
  const params = new URLSearchParams({ hoTen, lop: lop || "" });
  const res = await fetch(`/api/report-comment-history?${params.toString()}`, { headers: authHeaders() });
  return handleResponse(res);
}

/** Upload file Excel/Word danh sách học sinh hàng loạt -> danh sách học sinh + ghi chú thô. */
export async function parseReportCommentBulkRequest({ file, cap }) {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("cap", cap);
  const res = await fetch("/api/parse-report-comment-bulk", {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  return handleResponse(res);
}

/** Tải file Excel mẫu để điền danh sách học sinh hàng loạt - trả về Blob (không phải JSON, nên
 * KHÔNG dùng handleResponse()). Component tự tạo link tải xuống từ Blob này. */
export async function downloadReportCommentTemplateRequest(cap) {
  const params = new URLSearchParams({ cap });
  const res = await fetch(`/api/report-comment-template?${params.toString()}`, { headers: authHeaders() });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Không tải được file mẫu, vui lòng thử lại.");
  }
  return res.blob();
}
