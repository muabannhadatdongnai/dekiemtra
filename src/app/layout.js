import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata = {
  title: "Trợ lý AI cho Giáo viên - Soạn Giáo Án Miễn phí",
  description:
    "Trợ lý AI giúp giáo viên tiểu học soạn Kế hoạch bài dạy (giáo án) nhanh chóng theo chuẩn chương trình mới, Công văn 2345/BGDĐT hoặc Công văn 5512, tự động lên ý tưởng mục tiêu, hoạt động học tập, câu hỏi và tích hợp năng lực số chỉ trong vài phút",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
