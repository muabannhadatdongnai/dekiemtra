/**
 * apiClient.js
 * Gom toàn bộ lệnh gọi API phía client vào 1 nơi - component không tự gọi fetch() rải rác nữa.
 * Lợi ích khi mở rộng sau này: thêm endpoint mới (ví dụ /api/question-bank) chỉ cần thêm 1 hàm
 * ở đây, không phải sửa nhiều component; đổi cách xử lý lỗi/logging chỉ cần sửa handleResponse.
 */

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
    await fetch("/api/login", { method: "DELETE" });
  } catch {
    // không quan trọng nếu lỗi - session phía client (localStorage) vẫn được xoá bình thường
  }
}

export async function fetchChaptersRequest({ grade, subject, volume }) {
  const res = await fetch(`/api/chapters?grade=${grade}&subject=${subject}&volume=${volume}`);
  return handleResponse(res);
}

/**
 * @param blueprint - xem cấu trúc "examBlueprint" trong src/data/examBlueprint.js
 */
export async function generateExamRequest(blueprint) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blueprint),
  });
  return handleResponse(res);
}
