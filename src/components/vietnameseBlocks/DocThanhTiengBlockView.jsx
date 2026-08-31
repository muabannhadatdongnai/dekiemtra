"use client";

/**
 * DocThanhTiengBlockView.jsx
 * Hiển thị RIÊNG cho khối "Đọc thành tiếng" - tĩnh, chỉ in tên bài + hướng dẫn giám thị.
 * `subLabel` ("1. Đọc thành tiếng") do VietnameseExamPreview.jsx truyền vào - lấy từ danh bạ
 * vietnameseExamBlocks.js, KHÔNG hard-code ở đây (xem comment fix đánh số trong file danh bạ).
 * Tiêu đề lớn "I. KIỂM TRA ĐỌC" do VietnameseExamPreview.jsx tự in riêng, không thuộc khối này.
 */
export default function DocThanhTiengBlockView({ data, subLabel }) {
  if (!data?.tenBai) return null;

  return (
    <div style={{ marginBottom: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, margin: "10px 0 4px" }}>{subLabel}</p>
      <p style={{ fontSize: 13.5, margin: "0 0 4px" }}>
        Bài: <strong>{data.tenBai}</strong>
      </p>
      <p style={{ fontSize: 12.5, fontStyle: "italic", color: "#64748b", margin: 0 }}>{data.huongDan}</p>
    </div>
  );
}
