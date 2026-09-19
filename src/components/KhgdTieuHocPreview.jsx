"use client";

import { getSubjectLabel } from "@/data/config";

const cellStyle = (align = "left") => ({ border: "1px solid #94a3b8", padding: "4px 6px", fontSize: 11, textAlign: align });
const headerCellStyle = { ...cellStyle("center"), fontWeight: 700, background: "#e5e7eb" };

/**
 * KhgdTieuHocPreview.jsx
 * Bản xem trước tab "Khung KHGD - Tiểu học". Tái dùng class `.khgd-a4-page` (globals.css, khổ A4
 * ngang) - CÙNG lý do KHÔNG dùng id="print-area" như KhgdPreview.jsx (THCS/THPT), xem giải thích
 * ở đó.
 */
export default function KhgdTieuHocPreview({ lessons, meta }) {
  if (!lessons) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400">
        Chưa có dữ liệu. Vui lòng điền thông tin bên trái.
      </div>
    );
  }

  return (
    <div className="khgd-a4-page">
      {meta?.truong && <p style={{ margin: 0, fontWeight: 700 }}>TRƯỜNG: {meta.truong.toUpperCase()}</p>}
      {meta?.to && <p style={{ margin: 0, fontWeight: 700 }}>TỔ: {meta.to.toUpperCase()}</p>}
      {meta?.giaoVien && <p style={{ margin: "0 0 12px" }}>Họ và tên giáo viên: {meta.giaoVien}</p>}

      <h1 style={{ textAlign: "center", fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>
        KẾ HOẠCH DẠY HỌC CÁC MÔN HỌC, HOẠT ĐỘNG GIÁO DỤC LỚP {meta?.grade} - MÔN:{" "}
        {getSubjectLabel(meta?.subject)?.toUpperCase()}
      </h1>
      <p style={{ textAlign: "center", fontStyle: "italic", fontSize: 12, margin: "0 0 14px" }}>
        CT GDPT 2018{meta?.namHoc ? ` - Năm học ${meta.namHoc}` : ""}
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={headerCellStyle}>Tuần, tháng</th>
            <th style={headerCellStyle}>Chủ đề/Mạch nội dung</th>
            <th style={headerCellStyle}>Tên bài</th>
            <th style={headerCellStyle}>Tiết học/Thời lượng</th>
            <th style={headerCellStyle}>Tiết PPCT</th>
            <th style={headerCellStyle}>Nội dung điều chỉnh cần thiết (nếu có)</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((l, i) => (
            <tr key={l.id || i} style={{ verticalAlign: "top" }}>
              <td style={cellStyle("center")}>{l.tuan}</td>
              <td style={cellStyle()}>{l.chuDe}</td>
              <td style={{ ...cellStyle(), fontWeight: 700 }}>{l.tenBai}</td>
              <td style={cellStyle("center")}>{l.soTiet}</td>
              <td style={cellStyle("center")}>{l.tietPPCT}</td>
              <td style={cellStyle()}>{l.dieuChinh}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40, fontSize: 12 }}>
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
