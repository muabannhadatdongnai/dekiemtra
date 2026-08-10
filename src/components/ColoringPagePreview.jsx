"use client";

import { forwardRef } from "react";

// Vài màu rainbow cố định để tô từng chữ trong tiêu đề (giống style "TÔ MÀU THẬT VUI" nhiều
// màu trong ảnh mẫu phụ huynh gửi) - lặp vòng nếu tiêu đề dài hơn số màu.
const TITLE_COLORS = ["#e63946", "#f4a300", "#2a9d8f", "#3b82f6", "#8b5cf6", "#ec4899"];

function ColoredTitle({ title }) {
  const words = title.split(" ").filter(Boolean);
  return (
    <h1 className="flex flex-wrap justify-center gap-x-3 text-4xl font-extrabold tracking-wide" style={{ fontFamily: '"Comic Sans MS", "Baloo 2", cursive, sans-serif' }}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            color: TITLE_COLORS[i % TITLE_COLORS.length],
            WebkitTextStroke: "1.5px rgba(0,0,0,0.15)",
          }}
        >
          {word}
        </span>
      ))}
    </h1>
  );
}

/**
 * ColoringPagePreview.jsx
 * `ref` trỏ vào chính khung .a4-page (KHÔNG phải wrapper ngoài) - dùng để:
 *  - PDF: window.print() (CSS @media print có sẵn nhắm #print-area, xem globals.css)
 *  - PNG: html2canvas(ref.current) chụp đúng khung này (xem ColoringExportActions.jsx)
 */
const ColoringPagePreview = forwardRef(function ColoringPagePreview(
  { lineArtImage, originalImage, palette, title, subtitle },
  ref
) {
  const hasContent = Boolean(lineArtImage);

  return (
    <div id="print-area">
      <div
        ref={ref}
        className="a4-page mx-auto bg-white"
        style={{ fontFamily: "Arial, sans-serif", padding: "14mm 12mm" }}
      >
        {!hasContent ? (
          <div className="flex h-[250mm] flex-col items-center justify-center gap-3 text-center text-slate-400">
            <p className="text-lg font-medium">Chưa có tranh tô màu nào</p>
            <p className="text-sm">Chọn 1 ảnh ở khung bên trái rồi bấm &quot;Tạo tranh tô màu&quot;.</p>
          </div>
        ) : (
          <>
            {/* ===== Tiêu đề ===== */}
            <div className="mb-4 text-center">
              <ColoredTitle title={title} />
              <div className="mt-2 inline-block rounded-full border-2 border-amber-300 bg-amber-50 px-5 py-1.5 text-base font-semibold text-amber-700">
                {subtitle} 💛
              </div>
            </div>

            {/* ===== Nội dung chính: line-art lớn (trái) + ảnh mẫu + bảng màu (phải) ===== */}
            <div className="flex gap-4">
              <div className="flex-[3] rounded-xl border-2 border-slate-200 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lineArtImage}
                  alt="Tranh tô màu"
                  className="w-full rounded-lg object-contain"
                  crossOrigin="anonymous"
                />
              </div>

              <div className="flex flex-[1.1] flex-col gap-4">
                <div className="rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 p-2 text-center">
                  <p className="mb-2 inline-block rounded-full bg-sky-600 px-3 py-1 text-xs font-bold text-white">
                    ẢNH MẪU
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={originalImage}
                    alt="Ảnh mẫu gốc"
                    className="w-full rounded-lg object-contain"
                    crossOrigin="anonymous"
                  />
                </div>

                <div className="rounded-xl border-2 border-dashed border-pink-300 bg-pink-50 p-3">
                  <p className="mb-3 text-center text-xs font-bold text-pink-600">GỢI Ý MÀU:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {(palette || []).map((hex, i) => (
                      <span
                        key={i}
                        title={hex}
                        className="aspect-square rounded-full border border-black/10 shadow-sm"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default ColoringPagePreview;
