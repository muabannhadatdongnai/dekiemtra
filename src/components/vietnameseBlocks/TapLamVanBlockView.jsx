"use client";

/**
 * TapLamVanBlockView.jsx
 * Hiển thị RIÊNG cho khối "Tập làm văn" - đề bài + dàn ý gợi ý ngắn.
 */
export default function TapLamVanBlockView({ data }) {
  if (!data?.deBai) return null;

  return (
    <div style={{ marginBottom: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, margin: "10px 0 4px" }}>B. TẬP LÀM VĂN {data.theLoai ? `(${data.theLoai})` : ""}</p>
      <p style={{ fontSize: 13.5, fontWeight: 600, margin: "0 0 6px" }}>Đề bài: {data.deBai}</p>
      {Array.isArray(data.danYGoiY) && data.danYGoiY.length > 0 && (
        <>
          <p style={{ fontSize: 12.5, fontStyle: "italic", color: "#64748b", margin: "0 0 2px" }}>Gợi ý dàn ý:</p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {data.danYGoiY.map((y, i) => (
              <li key={i} style={{ fontSize: 12.5, fontStyle: "italic", color: "#64748b" }}>{y}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
