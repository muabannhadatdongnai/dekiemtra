// Shim CHỈ dùng khi chạy `node --test`. Thư viện "file-saver" thật là UMD/CJS không khai báo
// named export theo cách Node ESM hiểu được (chỉ chạy tốt qua bundler như webpack/Next.js).
// saveAs() vốn chỉ có tác dụng trong trình duyệt (kích hoạt tải file) - không liên quan gì tới
// logic đang được test (buildExamDocxBlob chỉ cần trả về đúng buffer .docx), nên thay bằng
// no-op ở đây là an toàn, không che giấu lỗi thật nào của pipeline xuất Word.
export function saveAs() {
  // no-op trong môi trường test
}

export default { saveAs };
