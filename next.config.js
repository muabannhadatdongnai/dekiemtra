/** @type {import('next').NextConfig} */

/**
 * ⚠️ RÀ SOÁT BẢO MẬT (xem PROJECT_SUMMARY.md, mục "chưa thêm security headers cơ bản vào
 * next.config.js"): trước đây KHÔNG có header bảo mật nào ngoài mặc định của Next.js -> trình
 * duyệt không được yêu cầu áp dụng các hàng phòng thủ cơ bản (chống clickjacking, chống trình
 * duyệt tự đoán MIME type, hạn chế thông tin rò rỉ qua Referer...). Đây là các header ÍT RỦI RO
 * NHẤT (không đổi hành vi app, không cần cấu hình domain/CSP phức tạp dễ gây lỗi) nên áp dụng
 * ngay; CSP (Content-Security-Policy) CHƯA thêm ở đây vì cần liệt kê chính xác mọi domain script/
 * style/font đang dùng (Google Fonts nếu có, ảnh SGK từ raw.githubusercontent.com, gọi API Gemini
 * phía server nên không cần connect-src client...) - thêm CSP sai dễ chặn nhầm chính app đang
 * chạy, nên để dành 1 lượt riêng có thời gian test kỹ trên nhiều trang thay vì làm vội ở đây.
 */
const securityHeaders = [
  // Chặn trang bị nhúng vào <iframe> ở domain khác (chống clickjacking) - app này không có lý
  // do gì cần cho phép nhúng iframe từ nơi khác.
  { key: "X-Frame-Options", value: "DENY" },
  // Chặn trình duyệt tự "đoán" MIME type khác với Content-Type server trả về (chống 1 số kiểu
  // tấn công lợi dụng file upload bị hiểu nhầm thành script/HTML).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Không gửi Referer đầy đủ (có thể chứa token/thông tin nhạy cảm trong URL) khi điều hướng
  // sang domain khác - vẫn gửi origin khi cùng an toàn (https->https) để không phá analytics cơ bản.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Tắt hẳn các API trình duyệt không dùng tới (camera/microphone/geolocation) - giảm bề mặt
  // tấn công nếu có lỗ hổng XSS nào đó cố lợi dụng các API này.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Chặn trình duyệt cũ bật lại bộ lọc XSS kiểu cũ theo cách gây lỗi bảo mật ngược (khuyến nghị
  // hiện tại của OWASP là "0" thay vì "1; mode=block" - trình duyệt hiện đại đã bỏ tính năng này).
  { key: "X-XSS-Protection", value: "0" },
];

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ hostname: "raw.githubusercontent.com" }],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
