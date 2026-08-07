"use client";

/**
 * DocThamBlockView.jsx
 * Hiển thị RIÊNG cho khối "Đọc thầm" - đúng khuôn components/visuals/*.jsx: 1 file/1 khối, không
 * biết và không cần biết các khối khác trông ra sao. Nhận thẳng `data` (= results.docTham, xem
 * services/vietnameseBlocks/docThamBlock.js) - không nhận cả object `results` đầy đủ.
 */
export default function DocThamBlockView({ data }) {
  if (!data?.nguLieu) return null;
  const { nguLieu, cauHoi = [] } = data;

  return (
    <div style={{ marginBottom: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, margin: "10px 0 4px" }}>A. ĐỌC THẦM</p>
      {nguLieu.tieuDe && (
        <p style={{ textAlign: "center", fontWeight: 700, fontSize: 14, margin: "4px 0" }}>{nguLieu.tieuDe}</p>
      )}
      <p
        style={{
          fontSize: 13.5,
          whiteSpace: "pre-wrap",
          fontStyle: nguLieu.theLoai === "tho" ? "italic" : "normal",
          textAlign: nguLieu.theLoai === "tho" ? "center" : "left",
          margin: "0 0 10px",
        }}
      >
        {nguLieu.noiDung}
      </p>

      <p style={{ fontWeight: 600, margin: "6px 0 4px" }}>Câu hỏi:</p>
      <ol style={{ margin: 0, paddingLeft: 20 }}>
        {cauHoi.map((q, i) => (
          <li key={i} style={{ fontSize: 13.5, marginBottom: 8 }}>
            <p style={{ margin: "0 0 3px" }}>{q.cauHoi}</p>
            {q.loai === "trac_nghiem" && Array.isArray(q.luaChon) && q.luaChon.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 12px" }}>
                {q.luaChon.map((opt, j) => (
                  <span key={j} style={{ fontSize: 13 }}>{opt}</span>
                ))}
              </div>
            ) : (
              <div style={{ borderBottom: "1px dotted #94a3b8", height: 18, marginTop: 2 }} />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
