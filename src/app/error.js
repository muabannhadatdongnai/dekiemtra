"use client";

/**
 * error.js (Phiên 26)
 * Error Boundary theo đúng quy ước Next.js App Router: Next TỰ ĐỘNG bọc component này quanh
 * `page.js` (và mọi component con của nó) - bắt được MỌI lỗi render bất ngờ xảy ra TRONG lúc
 * dùng app (VD: 1 component preview lỗi giữa buổi dạy vì dữ liệu AI trả về thiếu trường nào đó
 * chưa lường trước, lỗi parse JSON, v.v.) và hiện màn hình này THAY VÌ màn hình TRẮNG hoàn toàn
 * không rõ nguyên nhân - vốn là trải nghiệm tệ nhất cho giáo viên đang dùng app giữa giờ dạy.
 *
 * ⚠️ PHẠM VI: file này CHỈ bắt lỗi RENDER phía React (throw trong quá trình render/effect của
 * cây component `page.js`). KHÔNG bắt được:
 *   - Lỗi xảy ra TRONG chính layout.js (xem global-error.js - Next yêu cầu 2 file TÁCH RIÊNG,
 *     không thể dùng chung 1 file cho cả 2 phạm vi).
 *   - Lỗi bất đồng bộ ngoài luồng render (VD throw bên trong setTimeout/event handler không
 *     được React quản lý) - đây là giới hạn CHUNG của React Error Boundary, không phải thiếu sót
 *     riêng của file này.
 *   - Lỗi gọi API (fetch tới /api/generate-...) đã có xử lý riêng bằng try/catch + hiện thông
 *     báo lỗi ngay trong form (xem các component *Form.jsx) - file này KHÔNG thay thế phần đó.
 *
 * Bắt buộc phải là Client Component ("use client") và nhận đúng 2 prop error/reset theo API
 * của Next.js - không tự thêm cách gọi khác.
 */
export default function ErrorBoundary({ error, reset }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-2xl">
          ⚠️
        </div>
        <h1 className="text-lg font-semibold text-slate-800">Đã xảy ra lỗi ngoài dự kiến</h1>
        <p className="mt-2 text-sm text-slate-600">
          Rất tiếc, có gì đó vừa lỗi ở phần đang hiển thị. Dữ liệu thầy/cô đã nhập ở form thường
          KHÔNG bị mất — hãy thử bấm nút bên dưới trước khi tải lại toàn bộ trang.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Thử lại
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Tải lại toàn bộ trang
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Nếu lỗi lặp lại, thầy/cô chụp lại màn hình này (có cả phần bên dưới nếu thấy) gửi lại
          giúp để kiểm tra nhé.
        </p>
        {error?.message ? (
          <p className="mt-2 break-words rounded bg-slate-100 p-2 text-left font-mono text-[11px] text-slate-500">
            {error.message}
            {error?.digest ? ` (mã: ${error.digest})` : ""}
          </p>
        ) : null}
      </div>
    </div>
  );
}
