import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata = {
  title: "Trợ lý soạn giáo án tiểu học - Tạo đề kiểm tra miễn phí",
  description:
    "Trợ lý soạn giáo án tiểu học bằng trí tuệ nhân tạo (AI) giúp thầy cô tạo kế hoạch bài dạy chuẩn theo các công văn của Bộ Giáo dục chỉ trong vài phút.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
