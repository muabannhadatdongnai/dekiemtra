"use client";

import { getSubjectLabel } from "@/data/config";

/**
 * KhgdPreview.jsx
 * Bản xem trước (web) tab "Khung KHGD" (Phụ lục III) - khổ A4 NGANG (.khgd-a4-page, xem
 * globals.css). CỐ Ý KHÔNG dùng id="print-area" (xem giải thích trong globals.css) - tab này
 * chỉ hỗ trợ "Tải Word" (đã đúng khổ ngang, sẵn sàng in), KHÔNG có nút "In/Tải PDF" trực tiếp từ
 * trình duyệt như Đề kiểm tra/Phiếu bài tập.
 */

function LessonRow({ lesson, index, enableSwd, enableNls }) {
  return (
    <tr style={{ verticalAlign: "top" }}>
      <td style={cellStyle("center")}>{index + 1}</td>
      <td style={{ ...cellStyle(), fontWeight: 700 }}>{lesson.tenBai}</td>
      <td style={cellStyle("center")}>{lesson.soTiet}</td>
      <td style={cellStyle("center")}>{lesson.tuan}</td>
      <td style={cellStyle()}>{lesson.thietBi}</td>
      <td style={cellStyle()}>{lesson.diaDiem}</td>
      {enableSwd && (
        <td style={cellStyle()}>
          {lesson.swd?.length > 0 ? (
            <>
              <div style={{ fontWeight: 700 }}>SWD:</div>
              <ul style={{ margin: "2px 0 0", paddingLeft: 16 }}>
                {lesson.swd.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </>
          ) : (
            ""
          )}
        </td>
      )}
      {enableNls && <td style={cellStyle()}>{lesson.nls || ""}</td>}
    </tr>
  );
}

// Cỡ chữ 14pt theo quy định Bộ GD&ĐT (Phiên 49) - cùng cỡ với file Word xuất ra.
const FONT_SIZE_PT = "14pt";

const cellStyle = (align = "left") => ({
  border: "1px solid #94a3b8",
  padding: "4px 6px",
  fontSize: FONT_SIZE_PT,
  textAlign: align,
});

const headerCellStyle = {
  ...cellStyle("center"),
  fontWeight: 700,
  background: "#e5e7eb",
};

export default function KhgdPreview({ lessons, kiemTraDinhKy, meta }) {
  if (!lessons) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400">
        Chưa có dữ liệu. Vui lòng điền thông tin bên trái.
      </div>
    );
  }

  const enableSwd = !!meta?.enableSwd;
  const enableNls = !!meta?.enableNls;

  return (
    <div className="khgd-a4-page">
      {meta?.truong && <p style={{ margin: 0, fontWeight: 700 }}>TRƯỜNG: {meta.truong.toUpperCase()}</p>}
      {meta?.to && <p style={{ margin: 0, fontWeight: 700 }}>TỔ: {meta.to.toUpperCase()}</p>}
      {meta?.giaoVien && <p style={{ margin: "0 0 12px" }}>Họ và tên giáo viên: {meta.giaoVien}</p>}

      <h1 style={{ textAlign: "center", fontWeight: 700, fontSize: FONT_SIZE_PT, margin: "0 0 4px" }}>
        KẾ HOẠCH GIÁO DỤC CỦA GIÁO VIÊN
      </h1>
      <p style={{ textAlign: "center", fontWeight: 700, fontSize: FONT_SIZE_PT, margin: "0 0 14px" }}>
        MÔN HỌC/HOẠT ĐỘNG GIÁO DỤC {getSubjectLabel(meta?.subject)?.toUpperCase()}, LỚP {meta?.grade}
        {meta?.namHoc ? ` (Năm học ${meta.namHoc})` : ""}
      </p>

      <p style={{ fontWeight: 700, margin: "10px 0 4px" }}>II. Kế hoạch dạy học</p>
      <p style={{ fontWeight: 700, fontStyle: "italic", margin: "0 0 6px" }}>1. Phân phối chương trình</p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={headerCellStyle}>STT</th>
            <th style={headerCellStyle}>Bài học</th>
            <th style={headerCellStyle}>Số tiết</th>
            <th style={headerCellStyle}>Thời điểm</th>
            <th style={headerCellStyle}>Thiết bị dạy học</th>
            <th style={headerCellStyle}>Địa điểm dạy học</th>
            {enableSwd && <th style={headerCellStyle}>Nội dung lồng ghép (SWD)</th>}
            {enableNls && <th style={headerCellStyle}>Biểu hiện Năng lực số</th>}
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson, i) => (
            <LessonRow key={lesson.id || i} lesson={lesson} index={i} enableSwd={enableSwd} enableNls={enableNls} />
          ))}
        </tbody>
      </table>

      <p style={{ fontWeight: 700, fontStyle: "italic", margin: "16px 0 6px" }}>2. Kiểm tra, đánh giá định kỳ</p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={headerCellStyle}>Bài kiểm tra, đánh giá</th>
            <th style={headerCellStyle}>Thời gian</th>
            <th style={headerCellStyle}>Thời điểm</th>
            <th style={headerCellStyle}>Yêu cầu cần đạt</th>
            <th style={headerCellStyle}>Hình thức</th>
          </tr>
        </thead>
        <tbody>
          {(kiemTraDinhKy || []).map((k, i) => (
            <tr key={i}>
              <td style={{ ...cellStyle(), fontWeight: 700 }}>{k.ten}</td>
              <td style={cellStyle("center")}>{k.thoiGian}</td>
              <td style={cellStyle()}>{k.thoiDiem}</td>
              <td style={cellStyle()}>{k.yeuCauCanDat}</td>
              <td style={cellStyle()}>{k.hinhThuc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, fontSize: FONT_SIZE_PT }}>
        <div style={{ textAlign: "center", width: "45%" }}>
          <p style={{ fontWeight: 700, margin: 0 }}>TỔ TRƯỞNG</p>
          <p style={{ margin: 0 }}>(Ký và ghi rõ họ tên)</p>
        </div>
        <div style={{ textAlign: "center", width: "45%" }}>
          <p style={{ fontWeight: 700, margin: 0 }}>GIÁO VIÊN</p>
          <p style={{ margin: 0 }}>(Ký và ghi rõ họ tên)</p>
          <p style={{ marginTop: 40 }}>{meta?.giaoVien}</p>
        </div>
      </div>
    </div>
  );
}
