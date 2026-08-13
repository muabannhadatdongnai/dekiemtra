import crypto from "crypto";

/**
 * sessionToken.js
 * ⚠️ SỬA LỖI BẢO MẬT NGHIÊM TRỌNG: trước đây các API route (generate, generate-worksheet,
 * analyze-sample) "xác thực" bằng cách kiểm tra `users[username]` có tồn tại hay không -
 * KHÔNG có gì ràng buộc rằng người gọi API thực sự đã đăng nhập đúng mật khẩu. Bất kỳ ai
 * cũng có thể gọi thẳng POST /api/generate với { "username": "admin" } (đoán tên đăng nhập,
 * không cần mật khẩu) và tốn quota Gemini/GitHub của chủ dự án.
 *
 * Cách sửa: /api/login cấp 1 TOKEN đã ký (HMAC-SHA256) sau khi verify đúng mật khẩu. Token
 * này client lưu lại và gửi kèm mọi request sau đó qua header "Authorization: Bearer <token>".
 * Server verify CHỮ KÝ + HẠN DÙNG của token - không cần lưu token ở đâu cả (stateless), vẫn
 * chạy tốt trên Vercel serverless (mỗi request có thể rơi vào instance khác nhau, không cần
 * bộ nhớ dùng chung) - giữ đúng tinh thần "$0 chi phí, không cần Redis/KV" của dự án.
 *
 * Đây KHÔNG phải JWT chuẩn (không cần thêm thư viện `jsonwebtoken`) nhưng dùng đúng nguyên lý
 * cốt lõi: payload + chữ ký HMAC bằng secret chỉ server biết -> client không thể tự tạo hoặc
 * sửa token (đổi role "teacher" thành "admin" chẳng hạn) mà không bị phát hiện do sai chữ ký.
 *
 * ⚠️ CHỖ CẦN THAY ĐỔI: đặt SESSION_SECRET trong .env.local (Vercel Environment Variables) -
 * 1 chuỗi ngẫu nhiên dài, bí mật, KHÔNG commit lên Git. Tạo bằng lệnh:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 tiếng - đủ 1 buổi dạy, hết hạn thì đăng nhập lại

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // Không throw cứng để tránh sập toàn bộ app nếu quên set biến môi trường lúc dev,
    // nhưng CẢNH BÁO RÕ vì đây là lỗi cấu hình nghiêm trọng nếu xảy ra ở production.
    console.warn(
      "[sessionToken] ⚠️ CHƯA CẤU HÌNH SESSION_SECRET trong .env.local / Vercel Environment " +
        "Variables - đang dùng secret mặc định KHÔNG AN TOÀN. Đặt SESSION_SECRET trước khi " +
        "triển khai thật."
    );
  }
  return secret || "dev-only-insecure-secret-DO-NOT-USE-IN-PRODUCTION";
}

function sign(payloadB64) {
  return crypto.createHmac("sha256", getSecret()).update(payloadB64).digest("base64url");
}

/**
 * Tạo token cho 1 phiên đăng nhập thành công.
 * @returns {{ token: string, expiresAt: number }}
 */
export function createSessionToken(user) {
  const now = Date.now();
  const payload = {
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    iat: now,
    exp: now + SESSION_TTL_MS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(payloadB64);
  return { token: `${payloadB64}.${signature}`, expiresAt: payload.exp };
}

/**
 * Verify token: đúng chữ ký + chưa hết hạn.
 * @returns {{username:string, fullName:string, role:string, iat:number, exp:number} | null}
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;

  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expectedSignature = sign(payloadB64);
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  // So sánh bằng timingSafeEqual (không dùng ===) để tránh timing attack. Bắt buộc 2 buffer
  // cùng độ dài trước khi so sánh, nếu không timingSafeEqual sẽ throw.
  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (!payload?.exp || Date.now() > payload.exp) return null; // hết hạn
  return payload;
}
