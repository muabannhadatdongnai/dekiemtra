"use client";

/**
 * TapLamVanBlockView.jsx
 * Hiển thị RIÊNG cho khối "Tập làm văn" - đề bài + dàn ý gợi ý ngắn.
 * `subLabel` ("2. Tập làm văn") do VietnameseExamPreview.jsx truyền vào từ danh bạ
 * vietnameseExamBlocks.js. Tiêu đề lớn "II. KIỂM TRA VIẾT" do VietnameseExamPreview.jsx tự in
 * riêng, không thuộc khối này.
 *
 * FIX (thiếu giấy để viết bài văn): trước đây đề chỉ in đề bài + dàn ý gợi ý rồi hết trang, không
 * còn chỗ nào để học sinh viết cả bài văn. Thêm khung "kẻ ngang" cố định theo khối (giống
 * ChinhTaBlockView.jsx) - khác Chính tả ở chỗ số dòng KHÔNG tính theo độ dài 1 đoạn có sẵn (Tập làm
 * văn không có "đáp án mẫu" để đo độ dài) mà lấy 1 mức cố định theo Lớp - Lớp 1-2 viết đoạn ngắn,
 * Lớp 3-5 viết cả bài văn nhiều đoạn nên cần khung dài hơn hẳn.
 */
const RULED_LINE_HEIGHT = 26;
const RULED_LINE_COLOR = "#d9dde3";
const TAP_LAM_VAN_LINE_COUNT_BY_GRADE = { 1: 10, 2: 12, 3: 16, 4: 18, 5: 20 };
const DEFAULT_TAP_LAM_VAN_LINE_COUNT = 18;

function RuledLines({ lineCount }) {
  const height = RULED_LINE_HEIGHT * lineCount;
  return (
    <div
      style={{
        marginTop: 10,
        height,
        border: "1.5px dashed #94a3b8",
        borderRadius: 6,
        background: `repeating-linear-gradient(to bottom, transparent 0, transparent ${
          RULED_LINE_HEIGHT - 1
        }px, ${RULED_LINE_COLOR} ${RULED_LINE_HEIGHT - 1}px, ${RULED_LINE_COLOR} ${RULED_LINE_HEIGHT}px)`,
        backgroundColor: "#fff",
      }}
    />
  );
}

export default function TapLamVanBlockView({ data, subLabel, grade }) {
  if (!data?.deBai) return null;
  const lineCount = TAP_LAM_VAN_LINE_COUNT_BY_GRADE[Number(grade)] || DEFAULT_TAP_LAM_VAN_LINE_COUNT;

  return (
    <div style={{ marginBottom: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, margin: "10px 0 4px" }}>
        {subLabel} {data.theLoai ? `(${data.theLoai})` : ""}
      </p>
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
      <RuledLines lineCount={lineCount} />
    </div>
  );
}
