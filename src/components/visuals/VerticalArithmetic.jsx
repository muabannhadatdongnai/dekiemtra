"use client";

/**
 * VerticalArithmetic.jsx
 * Render "Đặt tính rồi tính" - lưới ô vuông thẳng hàng theo hàng đơn vị/chục/trăm,
 * để trống hàng kết quả cho học sinh tự tính bằng tay (không hiển thị đáp án).
 * Cột đầu tiên (bên trái) dành riêng cho dấu phép tính, không đè lên chữ số.
 */
export default function VerticalArithmetic({ operandA, operandB, operator }) {
  const opSymbol = operator === "x" ? "×" : operator === ":" ? "÷" : operator;

  const strA = String(operandA);
  const strB = String(operandB);
  const width = Math.max(strA.length, strB.length) + 1; // dự phòng kết quả dài hơn 1 chữ số

  const rowA = strA.padStart(width, " ").split("");
  const rowB = strB.padStart(width, " ").split("");
  const blankRow = Array(width).fill("");

  const cellStyle = {
    width: "20pt",
    height: "22pt",
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: "13pt",
    fontFamily: "'Times New Roman', Times, serif",
  };
  const opCellStyle = { ...cellStyle, width: "16pt" };

  return (
    <table style={{ borderCollapse: "collapse", margin: "6pt 0 6pt 20pt" }}>
      <tbody>
        <tr>
          <td style={opCellStyle}></td>
          {rowA.map((d, i) => (
            <td key={i} style={cellStyle}>
              {d}
            </td>
          ))}
        </tr>
        <tr>
          <td style={opCellStyle}>{opSymbol}</td>
          {rowB.map((d, i) => (
            <td key={i} style={{ ...cellStyle, borderBottom: "1.5pt solid #000" }}>
              {d}
            </td>
          ))}
        </tr>
        <tr>
          <td style={opCellStyle}></td>
          {blankRow.map((_, i) => (
            <td key={i} style={cellStyle}></td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
