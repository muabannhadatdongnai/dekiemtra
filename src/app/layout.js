import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata = {
  title: "Tạo đề kiểm tra tự động",
  description:
    "Nền tảng tạo đề kiểm tra chuẩn hóa tự động bằng AI cho giáo viên Toán từ Lớp 1 đến Lớp 12.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
