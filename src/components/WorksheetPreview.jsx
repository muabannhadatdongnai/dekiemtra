"use client";

/**
 * WorksheetPreview.jsx
 * Xem trước "Phiếu bài tập" (Mầm non - Lớp 2) - phong cách trang trí sinh động, bắt mắt:
 * khung thẻ trắng dày + viền chấm bo tròn bên trong, 4 góc hoạt hình (☀️🌈✏️⭐), tiêu đề dạng
 * "badge" nổi khối, mỗi khối bài 1 màu + 1 linh vật riêng (đồng bộ với BOX_THEMES bên dưới).
 *
 * ⚠️ Màu/khối ở đây PHẢI đồng bộ với BOX_THEMES trong worksheetExportService.js (bản Word) -
 * đổi màu/linh vật ở 1 nơi thì nhớ đổi cả nơi kia.
 */

// Mỗi DẠNG BÀI (section.type) có 1 màu chủ đạo + 1 linh vật riêng, gắn cố định theo type
// (không theo index) để 1 dạng bài luôn cùng màu dù phiếu chọn dạng nào, thứ tự ra sao.
const BOX_THEMES = {
  tinh_nham: {
    border: "#5B9BD5",
    bg: "#EAF4FF",
    badge: "#2F80ED",
    badgeDark: "#1B62C4",
    title: "#124070",
    mascot: "🧮",
  },
  noi_phep_tinh: {
    border: "#2FBFA0",
    bg: "#E6FBF6",
    badge: "#14A085",
    badgeDark: "#0E7C68",
    title: "#0B5C4B",
    mascot: "🦖",
  },
  so_sanh: {
    border: "#F191C1",
    bg: "#FFF0F7",
    badge: "#E85CA0",
    badgeDark: "#C13E80",
    title: "#8E2F63",
    mascot: "🐰",
  },
  day_so: {
    border: "#B48CE0",
    bg: "#F5EEFF",
    badge: "#9455D3",
    badgeDark: "#7635B5",
    title: "#5A2E8C",
    mascot: "🌸",
  },
  giai_toan: {
    border: "#FFAA5C",
    bg: "#FFF3E6",
    badge: "#FF8C32",
    badgeDark: "#E06E12",
    title: "#A85A12",
    mascot: "🐻",
  },
  dem_va_viet_so: {
    border: "#8BC97A",
    bg: "#F0FAEC",
    badge: "#5FA83C",
    badgeDark: "#478229",
    title: "#2E5E1A",
    mascot: "🎒",
  },
  nhan_dien_hinh: {
    border: "#FFD166",
    bg: "#FFFAEA",
    badge: "#E8A800",
    badgeDark: "#B98300",
    title: "#7A5900",
    mascot: "⭐",
  },
};
const FALLBACK_THEMES = Object.values(BOX_THEMES);
function getTheme(type, index) {
  return BOX_THEMES[type] || FALLBACK_THEMES[index % FALLBACK_THEMES.length];
}

function ExerciseBox({ index, type, title, children }) {
  const t = getTheme(type, index);
  return (
    <div
      style={{
        position: "relative",
        border: `3px solid ${t.border}`,
        background: t.bg,
        borderRadius: 18,
        padding: "20px 16px 14px",
        margin: "24px 0 14px",
        boxShadow: `0 3px 0 ${t.border}66`,
        breakInside: "avoid",
      }}
    >
      {/* Tiêu đề dạng nhãn dán lồi ra khỏi mép trên của khối, kèm linh vật riêng của dạng bài */}
      <div
        style={{
          position: "absolute",
          top: -18,
          left: 16,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: t.badge,
          color: "#fff",
          padding: "6px 16px 6px 10px",
          borderRadius: 999,
          border: "2.5px solid #ffffff",
          boxShadow: `0 3px 0 ${t.badgeDark}, 0 4px 8px rgba(0,0,0,.18)`,
          fontFamily: "'Baloo 2', 'Segoe UI', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "rgba(255,255,255,.9)",
            fontSize: 13,
            color: t.title,
            fontWeight: 800,
          }}
        >
          {index + 1}
        </span>
        <span style={{ fontSize: 16 }}>{t.mascot}</span>
        <span>{title}</span>
      </div>
      <div style={{ marginTop: 8, color: t.title }}>{children}</div>
    </div>
  );
}

const blankBox = (accent = "#94A3B8") => (
  <span
    style={{
      display: "inline-block",
      width: 34,
      height: 26,
      border: `1.5px solid ${accent}`,
      borderRadius: 6,
      background: "#fff",
      verticalAlign: "middle",
    }}
  />
);

function TinhNhamSection({ items, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px 16px", fontSize: 14 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {it.operandA} {it.operator} {it.operandB} = {blankBox(accent)}
        </div>
      ))}
    </div>
  );
}

function DemVaVietSoSection({ items, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 10 }}>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            textAlign: "center",
            background: "#fff",
            border: `1.5px dashed ${accent}`,
            borderRadius: 12,
            padding: "8px 12px",
          }}
        >
          <div style={{ fontSize: 20, letterSpacing: 3 }}>{Array(it.count).fill(it.icon).join(" ")}</div>
          <div style={{ marginTop: 6 }}>{blankBox(accent)}</div>
        </div>
      ))}
    </div>
  );
}

function SoSanhSection({ items, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 16px", fontSize: 14 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {it.left}
          <span
            style={{
              display: "inline-block",
              width: 24,
              height: 24,
              border: `1.5px solid ${accent}`,
              borderRadius: "50%",
              background: "#fff",
            }}
          />
          {it.right}
        </div>
      ))}
    </div>
  );
}

function DaySoSection({ items, accent }) {
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 14, alignItems: "center" }}>
          {it.sequence.map((n, idx) => (
            <span key={idx}>{n === null ? blankBox(accent) : n}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function NoiPhepTinhSection({ data, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
      <div>
        {data.pairs.map((p, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            {p.expr} <span style={{ marginLeft: 6, color: accent, fontWeight: 700 }}>●</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "right" }}>
        {data.shuffledResults.map((r, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <span style={{ marginRight: 6, color: accent, fontWeight: 700 }}>●</span> {r}
          </div>
        ))}
      </div>
    </div>
  );
}

function NhanDienHinhSection({ shapes, accent }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 13 }}>
      {shapes.map((s, i) => (
        <span
          key={i}
          style={{
            background: "#fff",
            border: `1.5px solid ${accent}`,
            borderRadius: 999,
            padding: "5px 12px",
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function GiaiToanSection({ items, accent }) {
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} style={{ marginBottom: 12, fontSize: 14 }}>
          <p style={{ marginBottom: 6 }}>{it.content}</p>
          <div style={{ border: `1.5px dashed ${accent}`, borderRadius: 6, height: 42, background: "#fff" }} />
        </div>
      ))}
    </div>
  );
}

export default function WorksheetPreview({ worksheet, meta }) {
  if (!worksheet?.sections?.length) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-400">
        Phiếu bài tập sẽ hiển thị tại đây sau khi tạo.
      </div>
    );
  }

  return (
    <div id="print-area">
      <div className="a4-page worksheet-page">
        {/* Khung thẻ trắng dày (mat) bao ngoài */}
        <div className="worksheet-outer">
          {/* Viền chấm/gạch bo tròn bên trong + 4 góc trang trí */}
          <div className="worksheet-inner">
            <span className="worksheet-corner tl" aria-hidden="true">☀️</span>
            <span className="worksheet-corner tr" aria-hidden="true">🌈</span>
            <span className="worksheet-corner bl" aria-hidden="true">✏️</span>
            <span className="worksheet-corner br" aria-hidden="true">⭐</span>

            <div style={{ textAlign: "center" }}>
              <span className="worksheet-title-badge">{meta?.title || "BÀI TẬP TOÁN"}</span>
              <div className="worksheet-rainbow" />
            </div>

            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <span className="worksheet-info-pill">
                📝 Họ và tên: .......................................... &nbsp;&nbsp; 🏫 Lớp: .......... &nbsp;&nbsp; 📅 Ngày: ..........
              </span>
            </div>

            {worksheet.sections.map((section, i) => {
              const t = getTheme(section.type, i);
              return (
                <ExerciseBox key={i} index={i} type={section.type} title={section.title}>
                  {section.type === "tinh_nham" && <TinhNhamSection items={section.items} accent={t.border} />}
                  {section.type === "dem_va_viet_so" && (
                    <DemVaVietSoSection items={section.items} accent={t.border} />
                  )}
                  {section.type === "so_sanh" && <SoSanhSection items={section.items} accent={t.border} />}
                  {section.type === "day_so" && <DaySoSection items={section.items} accent={t.border} />}
                  {section.type === "noi_phep_tinh" && <NoiPhepTinhSection data={section.data} accent={t.border} />}
                  {section.type === "nhan_dien_hinh" && (
                    <NhanDienHinhSection shapes={section.shapes} accent={t.border} />
                  )}
                  {section.type === "giai_toan" && <GiaiToanSection items={section.items} accent={t.border} />}
                </ExerciseBox>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
