"use client";

const KIEU_BAI_LABEL = {
  nghe_viet: "Nghe – viết",
  nho_viet: "Nhớ – viết",
};

/**
 * ChinhTaBlockView.jsx
 * Hiển thị RIÊNG cho khối "Chính tả" - in nguyên văn đoạn giáo viên đã tự nhập.
 */
export default function ChinhTaBlockView({ data }) {
  if (!data?.tenBai) return null;

  return (
    <div style={{ marginBottom: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, margin: "10px 0 4px" }}>B. CHÍNH TẢ ({KIEU_BAI_LABEL[data.kieuBai] || "Nghe – viết"})</p>
      <p style={{ fontSize: 13.5, margin: "0 0 4px" }}>
        Bài: <strong>{data.tenBai}</strong>
      </p>
      <p style={{ fontSize: 13.5, whiteSpace: "pre-wrap", margin: 0 }}>{data.noiDung}</p>
    </div>
  );
}
