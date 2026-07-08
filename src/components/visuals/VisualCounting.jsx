"use client";

const ICON_MAP = {
  star: "★",
  circle: "●",
  square: "■",
};

/**
 * VisualCounting.jsx
 * Render hình đếm trực quan (ngôi sao/tròn/vuông) xếp theo từng hàng đúng như đề bài gốc,
 * dùng minh hoạ khái niệm phân số (VD: khoanh 1/4 số ngôi sao).
 */
export default function VisualCounting({ rows, icon = "star" }) {
  const symbol = ICON_MAP[icon] || ICON_MAP.star;

  return (
    <div style={{ margin: "8pt 0 8pt 20pt", textAlign: "center" }}>
      {rows.map((count, rowIndex) => (
        <div key={rowIndex} style={{ fontSize: "20pt", letterSpacing: "6pt", lineHeight: 1.6 }}>
          {Array(count).fill(symbol).join(" ")}
        </div>
      ))}
    </div>
  );
}
