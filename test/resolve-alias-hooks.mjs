// Module resolution hook chỉ dùng khi CHẠY TEST bằng `node --test` trực tiếp.
// Next.js/webpack tự hiểu alias "@/..." -> "src/..." nhờ jsconfig.json khi build app thật,
// nhưng Node chạy file trần (node --test) không biết alias này, nên cần hook thủ công ở đây.
// Không đụng gì tới code production (exportService.js vẫn giữ nguyên "@/data/constants").
const ALIAS_PREFIX = "@/";
const SRC_BASE_URL = new URL("../src/", import.meta.url);

// Gói UMD/CJS "file-saver" không có named export mà Node ESM hiểu được (chỉ chạy tốt qua
// bundler). saveAs() chỉ dùng ở trình duyệt để tải file - không liên quan gì tới logic đang
// test (buildExamDocxBlob chỉ trả về buffer) -> thay bằng shim nội bộ, không mock bất cứ gì
// thuộc logic thật đang được kiểm tra.
const TEST_ONLY_SHIMS = {
  "file-saver": new URL("./shims/file-saver.mjs", import.meta.url).href,
};

export async function resolve(specifier, context, nextResolve) {
  if (TEST_ONLY_SHIMS[specifier]) {
    return nextResolve(TEST_ONLY_SHIMS[specifier], context);
  }

  // Bước 1: đổi "@/..." -> URL thật trong src/ (alias mà Next.js/jsconfig.json hiểu,
  // nhưng Node ESM thuần không biết gì về nó).
  const rewritten = specifier.startsWith(ALIAS_PREFIX)
    ? new URL(specifier.slice(ALIAS_PREFIX.length), SRC_BASE_URL).href
    : specifier;

  // Bước 2: Next.js/webpack cho phép import tương đối BỎ ĐUÔI FILE (".js"), toàn bộ code
  // trong src/ đang viết theo kiểu đó. Node ESM thuần thì bắt buộc phải có đuôi rõ ràng.
  // Thử resolve bình thường trước; nếu thiếu file mới thử lại với ".js" phía sau — cách này
  // không cần biết trước specifier nào có/thiếu đuôi, an toàn với mọi kiểu import trong repo.
  try {
    return await nextResolve(rewritten, context);
  } catch (err) {
    if (err?.code === "ERR_MODULE_NOT_FOUND" && !/\.[a-zA-Z0-9]+$/.test(rewritten)) {
      return nextResolve(`${rewritten}.js`, context);
    }
    throw err;
  }
}
