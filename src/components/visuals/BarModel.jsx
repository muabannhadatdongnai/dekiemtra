"use client";

/**
 * BarModel.jsx
 * Render "Sơ đồ đoạn thẳng" so sánh hơn-kém giữa 2 đại lượng, kiểu Singapore Math bar model.
 * barA (đã biết) vẽ dài hơn barB (ẩn số) đúng theo differenceValue, có ngoặc đánh dấu phần
 * chênh lệch và dấu "?" cho đại lượng cần tìm.
 */
export default function BarModel({ barA, barB, differenceValue, unit }) {
  const fullWidth = 340;
  // Tỉ lệ trực quan: barB ngắn hơn barA theo đúng tỷ lệ differenceValue/barA.value (giới hạn hợp lý để dễ nhìn)
  const ratio = Math.max(0.35, 1 - differenceValue / barA.value);
  const barBWidth = fullWidth * ratio;
  const barHeight = 26;

  return (
    <svg
      viewBox={`0 0 ${fullWidth + 60} 110`}
      width={fullWidth + 60}
      height="110"
      style={{ margin: "8pt 0 8pt 10pt", fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Bar A - đã biết */}
      <rect x="10" y="10" width={fullWidth} height={barHeight} fill="none" stroke="#000" strokeWidth="1.5" />
      <text x={10 + fullWidth / 2} y="10" textAnchor="middle" fontSize="12" dy="-4">
        {barA.value} {unit}
      </text>
      <text x={10 + fullWidth / 2} y={10 + barHeight / 2 + 4} textAnchor="middle" fontSize="12">
        {barA.label}
      </text>

      {/* Ngoặc đánh dấu phần chênh lệch ở cuối bar A */}
      <line x1={10 + barBWidth} y1="10" x2={10 + barBWidth} y2={10 + barHeight + 12} stroke="#666" strokeWidth="1" strokeDasharray="3,2" />
      <text x={10 + (barBWidth + fullWidth) / 2} y={10 + barHeight + 24} textAnchor="middle" fontSize="11" fill="#444">
        {differenceValue} {unit}
      </text>

      {/* Bar B - ẩn số */}
      <rect x="10" y={10 + barHeight + 30} width={barBWidth} height={barHeight} fill="none" stroke="#000" strokeWidth="1.5" />
      <text x={10 + barBWidth / 2} y={10 + barHeight + 30 + barHeight / 2 + 4} textAnchor="middle" fontSize="12">
        {barB.label}
      </text>
      <text x={10 + barBWidth / 2} y={10 + barHeight + 30 - 4} textAnchor="middle" fontSize="12" fontWeight="bold">
        ?
      </text>
    </svg>
  );
}
