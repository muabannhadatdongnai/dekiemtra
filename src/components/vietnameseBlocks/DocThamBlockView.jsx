"use client";

/**
 * DocThamBlockView.jsx
 * Hiển thị RIÊNG cho khối "Đọc thầm" - đúng khuôn components/visuals/*.jsx: 1 file/1 khối, không
 * biết và không cần biết các khối khác trông ra sao. Nhận thẳng `data` (= results.docTham, xem
 * services/vietnameseBlocks/docThamBlock.js) - không nhận cả object `results` đầy đủ.
 * `subLabel` ("2. Đọc hiểu") do VietnameseExamPreview.jsx truyền vào từ danh bạ
 * vietnameseExamBlocks.js - xem comment fix đánh số trong file danh bạ đó. Tiêu đề lớn
 * "I. KIỂM TRA ĐỌC" do VietnameseExamPreview.jsx tự in riêng, không thuộc khối này.
 */
// FIX (khoảng trống câu tự luận): trước đây câu hỏi KHÔNG phải trắc nghiệm chỉ có 1 dòng chấm cao
// 18px - quá ngắn để học sinh viết câu trả lời đầy đủ, nhất là câu vận dụng cuối bài (kiểu "rút ra
// bài học gì") thường cần 2-3 câu. Đổi sang 3 dòng kẻ chấm cho MỌI câu không phải trắc nghiệm - số
// dòng cần thiết là quy tắc trình bày CỐ ĐỊNH, không phụ thuộc nội dung AI sinh ra, nên xử lý tất
// định ở tầng hiển thị đáng tin cậy hơn là nhờ AI tự chèn đúng mã đánh dấu vào JSON mỗi lần.
const ESSAY_ANSWER_LINE_COUNT = 3;

function EssayAnswerLines() {
  return (
    <div style={{ marginTop: 2 }}>
      {Array.from({ length: ESSAY_ANSWER_LINE_COUNT }).map((_, i) => (
        <div key={i} style={{ borderBottom: "1px dotted #94a3b8", height: 18 }} />
      ))}
    </div>
  );
}

export default function DocThamBlockView({ data, subLabel }) {
  if (!data?.nguLieu) return null;
  const { nguLieu, cauHoi = [] } = data;

  return (
    <div style={{ marginBottom: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, margin: "10px 0 4px" }}>{subLabel}</p>
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
              <EssayAnswerLines />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
