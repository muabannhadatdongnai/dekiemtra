"use client";

/**
 * BarModel.jsx
 * Render "Sơ đồ đoạn thẳng" so sánh hơn-kém giữa 2 đại lượng, kiểu Singapore Math bar model.
 * barA (đã biết) vẽ dài hơn barB (ẩn số) đúng theo differenceValue, có ngoặc đánh dấu phần
 * chênh lệch và dấu "?" cho đại lượng cần tìm.
 *
 * ⚠️ Đã sửa lỗi chữ bị cắt mất nửa trên: trước đây nhãn giá trị phía trên bar A được đặt quá
 * sát mép trên của viewBox (y gần 0), khiến phần dấu (ầ, ể...) và đỉnh chữ bị SVG cắt bỏ.
 * Bản này chừa đủ khoảng trắng (topMargin) phía trên trước khi vẽ bar đầu tiên, và tăng
 * font-size để dễ đọc hơn khi in.
 */
export default function BarModel({ barA, barB, differenceValue, unit }) {
  const fullWidth = 340;
  const ratio = Math.max(0.35, 1 - differenceValue / barA.value);
  const barBWidth = fullWidth * ratio;

  const barHeight = 30;
  const fontSizeValue = 15;
  const fontSizeInside = 14;
  const fontSizeDiff = 13;

  const topMargin = 22; // đủ chỗ cho nhãn giá trị phía trên bar A, không bị cắt
  const gapBetweenBars = 46; // khoảng trống giữa 2 bar, chứa ngoặc + nhãn chênh lệch
  const bottomMargin = 14;

  const barA_y = topMargin;
  const barA_labelY = barA_y - 8; // nhãn giá trị phía trên bar A
  const barA_insideY = barA_y + barHeight / 2 + 5;

  const bracketTopY = barA_y;
  const bracketBottomY = barA_y + barHeight + gapBetweenBars - 10;
  // ⚠️ ĐÃ SỬA LỖI: nhãn chênh lệch trước đây đặt ở giữa khoảng [barBWidth, fullWidth], nhưng bar A
  // luôn trải dài HẾT fullWidth bất kể barB ngắn hơn bao nhiêu -> nhãn bị lọt vào TRONG hình chữ
  // nhật của bar A (đặc biệt rõ khi chênh lệch nhỏ so với giá trị bar A, ví dụ 20/105). Giờ đặt
  // hẳn ra ngoài, ngay sau mép phải của bar A.
  const diffLabelX = 10 + fullWidth + 8;
  const diffLabelY = (bracketTopY + bracketBottomY) / 2 + 4;

  const barB_y = barA_y + barHeight + gapBetweenBars;
  const barB_labelY = barB_y - 8; // dấu "?" phía trên bar B
  const barB_insideY = barB_y + barHeight / 2 + 5;

  const totalHeight = barB_y + barHeight + bottomMargin;
  const totalWidth = fullWidth + 70;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      width={totalWidth}
      height={totalHeight}
      style={{ margin: "8pt 0 8pt 10pt", fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* Bar A - đã biết */}
      <rect x="10" y={barA_y} width={fullWidth} height={barHeight} fill="none" stroke="#000" strokeWidth="1.5" />
      <text x={10 + fullWidth / 2} y={barA_labelY} textAnchor="middle" fontSize={fontSizeValue}>
        {barA.value} {unit}
      </text>
      <text x={10 + fullWidth / 2} y={barA_insideY} textAnchor="middle" fontSize={fontSizeInside}>
        {barA.label}
      </text>

      {/* Ngoặc đánh dấu phần chênh lệch, thẳng hàng với mép cuối của bar B */}
      <line
        x1={10 + barBWidth}
        y1={bracketTopY}
        x2={10 + barBWidth}
        y2={bracketBottomY}
        stroke="#666"
        strokeWidth="1"
        strokeDasharray="3,2"
      />
      <text x={diffLabelX} y={diffLabelY} textAnchor="start" fontSize={fontSizeDiff} fill="#444">
        {differenceValue} {unit}
      </text>

      {/* Bar B - ẩn số */}
      <rect x="10" y={barB_y} width={barBWidth} height={barHeight} fill="none" stroke="#000" strokeWidth="1.5" />
      <text x={10 + barBWidth / 2} y={barB_labelY} textAnchor="middle" fontSize={fontSizeValue} fontWeight="bold">
        ?
      </text>
      <text x={10 + barBWidth / 2} y={barB_insideY} textAnchor="middle" fontSize={fontSizeInside}>
        {barB.label}
      </text>
    </svg>
  );
}
