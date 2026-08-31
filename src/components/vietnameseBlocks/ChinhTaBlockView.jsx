"use client";

const KIEU_BAI_LABEL = {
  nghe_viet: "Nghe – viết",
  nho_viet: "Nhớ – viết",
};

/**
 * ChinhTaBlockView.jsx
 * Hiển thị RIÊNG cho khối "Chính tả" - in nguyên văn đoạn giáo viên đã tự nhập.
 * `subLabel` ("1. Chính tả") do VietnameseExamPreview.jsx truyền vào từ danh bạ
 * vietnameseExamBlocks.js. Tiêu đề lớn "II. KIỂM TRA VIẾT" do VietnameseExamPreview.jsx tự in
 * riêng, không thuộc khối này.
 *
 * FIX (thiếu khoảng giấy để học sinh chép chính tả): trước đây đề chỉ in xong đoạn văn mẫu là hết,
 * không có dòng kẻ nào cho học sinh viết lại - học sinh phải tự lấy giấy khác. Thêm khung "kẻ
 * ngang" (`RuledLines`) ngay dưới đoạn văn mẫu, đúng khuôn GiaiToanSection ở WorksheetPreview.jsx
 * (repeating-linear-gradient vẽ dòng kẻ, không cần vẽ từng div rời). Số dòng ước lượng theo ĐỘ DÀI
 * đoạn chính tả (~50 ký tự/dòng viết tay cỡ chữ Tiểu học trên khổ A4) + 1 dòng dư, tối thiểu 4 dòng
 * - đoạn càng dài thì khung viết càng cao, không cố định 1 số dòng cho mọi đoạn.
 */
const RULED_LINE_HEIGHT = 26;
const RULED_LINE_COLOR = "#d9dde3";
const CHARS_PER_LINE_ESTIMATE = 50;
const MIN_CHINH_TA_LINES = 4;

function estimateChinhTaLineCount(noiDung) {
  const raw = Math.ceil((noiDung?.length || 0) / CHARS_PER_LINE_ESTIMATE) + 1;
  return Math.max(MIN_CHINH_TA_LINES, raw);
}

function RuledLines({ lineCount }) {
  const height = RULED_LINE_HEIGHT * lineCount;
  return (
    <div
      style={{
        marginTop: 8,
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

export default function ChinhTaBlockView({ data, subLabel }) {
  if (!data?.tenBai) return null;

  return (
    <div style={{ marginBottom: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, margin: "10px 0 4px" }}>
        {subLabel} ({KIEU_BAI_LABEL[data.kieuBai] || "Nghe – viết"})
      </p>
      <p style={{ fontSize: 13.5, margin: "0 0 4px" }}>
        Bài: <strong>{data.tenBai}</strong>
      </p>
      <p style={{ fontSize: 13.5, whiteSpace: "pre-wrap", margin: 0 }}>{data.noiDung}</p>
      <RuledLines lineCount={estimateChinhTaLineCount(data.noiDung)} />
    </div>
  );
}
