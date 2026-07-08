"use client";

/**
 * NumberTriangle.jsx
 * Render "Cây số / tam giác quan hệ" - tam giác 3 đỉnh (trên - trái - phải), 1 đỉnh bị ẩn
 * (hiển thị "?") để học sinh tìm dựa trên quan hệ top = left + right.
 */
export default function NumberTriangle({ top, left, right, hidden }) {
  const displayTop = hidden === "top" ? "?" : top;
  const displayLeft = hidden === "left" ? "?" : left;
  const displayRight = hidden === "right" ? "?" : right;

  return (
    <svg viewBox="0 0 200 150" width="180" height="135" style={{ margin: "6pt 0 6pt 20pt" }}>
      <polygon
        points="100,15 30,125 170,125"
        fill="none"
        stroke="#000"
        strokeWidth="1.5"
      />
      <text x="100" y="10" textAnchor="middle" fontSize="18" fontFamily="Times New Roman, Times, serif">
        {displayTop}
      </text>
      <text x="18" y="140" textAnchor="middle" fontSize="18" fontFamily="Times New Roman, Times, serif">
        {displayLeft}
      </text>
      <text x="182" y="140" textAnchor="middle" fontSize="18" fontFamily="Times New Roman, Times, serif">
        {displayRight}
      </text>
    </svg>
  );
}
