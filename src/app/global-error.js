"use client";

/**
 * global-error.js (Phiên 26)
 * Lưới an toàn CUỐI CÙNG theo quy ước Next.js App Router: `error.js` (file cùng thư mục) chỉ bắt
 * lỗi xảy ra TRONG `page.js` và con cháu của nó, KHÔNG bắt được lỗi xảy ra ngay tại `layout.js`
 * (rất hiếm khi xảy ra vì layout.js ở đây chỉ render <html>/<body> + import CSS, gần như không
 * có logic gì để lỗi - nhưng thêm lưới này gần như không tốn công, nên vẫn nên có).
 *
 * ⚠️ KHÁC BIỆT bắt buộc so với error.js: vì lỗi ở đây có nghĩa là chính layout.js (bao gồm thẻ
 * <html>/<body>) đã lỗi, Next.js YÊU CẦU file này phải tự render LẠI đầy đủ <html>/<body> - nếu
 * chỉ trả về 1 <div> như error.js thông thường sẽ ra trang trắng không có khung HTML hợp lệ.
 * Giữ UI TỐI GIẢN NHẤT có thể (không import chung CSS/component nào từ app - nếu chính hệ thống
 * import/build đó là nguyên nhân gây lỗi thì global-error.js cũng sẽ lỗi theo, mất tác dụng của
 * lưới an toàn cuối cùng này).
 */
export default function GlobalError({ error, reset }) {
  return (
    <html lang="vi">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            padding: 24,
          }}
        >
          <div
            style={{
              maxWidth: 420,
              textAlign: "center",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b" }}>
              Ứng dụng gặp lỗi nghiêm trọng
            </h1>
            <p style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>
              Rất tiếc, trang không thể tải được. Hãy thử tải lại; nếu vẫn lỗi, thầy/cô chụp lại
              màn hình này gửi lại giúp để kiểm tra.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                marginTop: 16,
                borderRadius: 8,
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Tải lại trang
            </button>
            {error?.message ? (
              <p
                style={{
                  marginTop: 12,
                  fontSize: 11,
                  color: "#94a3b8",
                  fontFamily: "monospace",
                  wordBreak: "break-word",
                  background: "#f1f5f9",
                  padding: 8,
                  borderRadius: 6,
                  textAlign: "left",
                }}
              >
                {error.message}
                {error?.digest ? ` (mã: ${error.digest})` : ""}
              </p>
            ) : null}
          </div>
        </div>
      </body>
    </html>
  );
}
