"use client";

/**
 * DocThanhTiengBlockView.jsx
 * Hiển thị RIÊNG cho khối "Đọc thành tiếng" - tĩnh, chỉ in tên bài + hướng dẫn giám thị.
 */
export default function DocThanhTiengBlockView({ data }) {
  if (!data?.tenBai) return null;

  return (
    <div style={{ marginBottom: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, margin: "10px 0 4px" }}>A. ĐỌC THÀNH TIẾNG</p>
      <p style={{ fontSize: 13.5, margin: "0 0 4px" }}>
        Bài: <strong>{data.tenBai}</strong>
      </p>
      <p style={{ fontSize: 12.5, fontStyle: "italic", color: "#64748b", margin: 0 }}>{data.huongDan}</p>
    </div>
  );
}
