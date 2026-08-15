"use client";

import { getSubjectLabel } from "@/data/config";
import { OUTLINE_LEVEL_ORDER, OUTLINE_LEVEL_LABELS } from "@/data/outlineTemplates";

const LEVEL_COLORS = {
  coBan: { border: "#86EFAC", bg: "#F0FDF4", text: "#166534" },
  nangCao: { border: "#FDE68A", bg: "#FFFBEB", text: "#92400E" },
  vanDungCao: { border: "#FCA5A5", bg: "#FEF2F2", text: "#991B1B" },
};

function KienThucCotLoiBlock({ items }) {
  if (!items?.length) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontWeight: 700, fontSize: 15, margin: "10px 0 6px" }}>
        I. KIẾN THỨC CỐT LÕI
      </p>
      {items.map((it, i) => (
        <div key={i} style={{ marginBottom: 6 }}>
          <p style={{ fontWeight: 700, fontSize: 13.5, margin: 0 }}>{it.tieuMuc}</p>
          <p style={{ fontSize: 13, margin: "2px 0 0", whiteSpace: "pre-line" }}>{it.noiDung}</p>
        </div>
      ))}
    </div>
  );
}

function DangBaiBlock({ items }) {
  if (!items?.length) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontWeight: 700, fontSize: 15, margin: "10px 0 6px" }}>
        II. DẠNG BÀI + BÀI MẪU
      </p>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            marginBottom: 10,
            padding: "8px 10px",
            border: "1px solid #C7D2FE",
            borderRadius: 8,
            background: "#EEF2FF",
            breakInside: "avoid",
          }}
        >
          <p style={{ fontWeight: 700, fontSize: 13.5, margin: "0 0 2px", color: "#3730A3" }}>{it.tenDang}</p>
          {it.luuY && (
            <p style={{ fontSize: 12.5, fontStyle: "italic", margin: "0 0 6px", color: "#4338CA" }}>
              💡 {it.luuY}
            </p>
          )}
          {it.baiMauDe && (
            <p style={{ fontSize: 13, margin: "0 0 2px", whiteSpace: "pre-line" }}>
              <b>Bài mẫu:</b> {it.baiMauDe}
            </p>
          )}
          {it.baiMauLoiGiai && (
            <p style={{ fontSize: 13, margin: 0, whiteSpace: "pre-line" }}>
              <b>Lời giải:</b> {it.baiMauLoiGiai}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function NganHangBaiTapBlock({ nganHangBaiTap }) {
  if (!nganHangBaiTap) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontWeight: 700, fontSize: 15, margin: "10px 0 6px" }}>
        III. NGÂN HÀNG BÀI TẬP (3 MỨC ĐỘ)
      </p>
      {OUTLINE_LEVEL_ORDER.map((level) => {
        const items = nganHangBaiTap[level] || [];
        if (items.length === 0) return null;
        const colors = LEVEL_COLORS[level];
        return (
          <div key={level} style={{ marginBottom: 10 }}>
            <p style={{ fontWeight: 700, fontSize: 13.5, margin: "0 0 4px", color: colors.text }}>
              {OUTLINE_LEVEL_LABELS[level]}
            </p>
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              {items.map((ex, i) => (
                <li key={i} style={{ marginBottom: 6, breakInside: "avoid" }}>
                  <span style={{ fontSize: 13 }}>{ex.de}</span>
                  {ex.dapAn && (
                    <div
                      style={{
                        marginTop: 2,
                        padding: "3px 8px",
                        display: "inline-block",
                        border: `1px solid ${colors.border}`,
                        background: colors.bg,
                        borderRadius: 6,
                        fontSize: 12,
                        color: colors.text,
                      }}
                    >
                      Đáp án: {ex.dapAn}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

export default function OutlinePreview({ outline, meta }) {
  if (!outline) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400">
        Chưa có dữ liệu. Vui lòng điền thông tin bên trái.
      </div>
    );
  }

  return (
    <div id="print-area">
      <div className="a4-page">
        <h1 style={{ textAlign: "center", fontWeight: 700, fontSize: 16, textTransform: "uppercase" }}>
          {outline.tenDeCuong}
        </h1>
        <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginBottom: 12 }}>
          {meta?.subject ? `Môn: ${getSubjectLabel(meta.subject)} — ` : ""}
          Lớp {meta?.grade}
          {meta?.chapterLabel ? ` — Phạm vi: ${meta.chapterLabel}` : ""}
        </p>

        <KienThucCotLoiBlock items={outline.kienThucCotLoi} />
        <DangBaiBlock items={outline.dangBai} />
        <NganHangBaiTapBlock nganHangBaiTap={outline.nganHangBaiTap} />

        {outline.thuNgoPhuHuynh && (
          <div
            style={{
              marginTop: 16,
              padding: "10px 12px",
              border: "1px dashed #FBBF24",
              background: "#FFFBEB",
              borderRadius: 8,
              breakInside: "avoid",
            }}
          >
            <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 4px", color: "#B45309" }}>
              💌 Thư ngỏ gửi Phụ huynh
            </p>
            <p style={{ fontSize: 13, margin: 0, whiteSpace: "pre-line" }}>{outline.thuNgoPhuHuynh}</p>
          </div>
        )}
      </div>
    </div>
  );
}
