"use client";

/**
 * ScratchGrid.jsx
 * Khung giấy kẻ ô trống để học sinh làm bài tính toán bằng tay - không chứa nội dung AI sinh ra,
 * thuần tuý là không gian layout.
 */
export default function ScratchGrid({ rows = 4, cols = 20 }) {
  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        margin: "8pt 0",
      }}
    >
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <td
                key={c}
                style={{
                  border: "0.5pt solid #999",
                  height: "20pt",
                  width: `${100 / cols}%`,
                }}
              ></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
