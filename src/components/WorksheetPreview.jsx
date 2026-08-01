"use client";

import { getSectionVisualTheme, getDefaultLayout } from "@/data/worksheetLayoutTemplates";

/**
 * WorksheetPreview.jsx
 * Xem trước "Phiếu bài tập" (Mầm non - Lớp 2).
 *
 * ================== GIAI ĐOẠN 1 (chống lặp khuôn) ==================
 * Trước đây CHỈ CÓ 1 bố cục cố định (khung viền chấm, 4 góc ☀️🌈✏️⭐ cố định, 1 màu/1 mascot
 * cố định vĩnh viễn theo section.type qua BOX_THEMES hard-code) -> mọi phiếu nhìn gần như
 * giống hệt nhau, đúng vấn đề giáo viên phản ánh.
 *
 * Giờ đây phiếu đọc field `worksheet.layout` (do worksheetGenerator.js gắn ngẫu nhiên, xem
 * src/data/worksheetLayoutTemplates.js) để quyết định: số cột, kiểu khung ngoài, kiểu tiêu đề,
 * bộ icon góc trang trí, và màu/mascot của TỪNG khối bài tập (qua getSectionVisualTheme() -
 * NGUỒN DUY NHẤT dùng chung với worksheetExportService.js, không còn định nghĩa riêng 2 nơi).
 */

function getTheme(layout, section, index) {
  return getSectionVisualTheme(layout, section, index);
}

// ===== Kiểu khung ngoài (frameStyle) - áp dụng lên .worksheet-inner =====
const FRAME_STYLES = {
  dotted_border_thick_card: { border: "3px dashed #bcd6ee", borderRadius: 24 },
  soft_rounded_border: { border: "3px solid #d8e6f5", borderRadius: 34 },
  notebook_lines: {
    border: "2px solid #dcd0b8",
    borderRadius: 12,
    backgroundImage: "repeating-linear-gradient(#fffefb 0 27px, #eadfc7 27px 28px)",
  },
  adventure_border: { border: "4px dashed #ffcf7a", borderRadius: 28 },
};

function ExerciseBox({ index, type, title, mascot, accent, badge, badgeDark, titleColor, bg, cardStyle, children }) {
  if (cardStyle === "minimal_box") {
    // Khung tối giản: không nhãn dán nổi, tiêu đề nằm ngay trong khung, ít trang trí hơn -
    // dành cho layout "notebook_style" (giáo viên muốn phiếu bớt "vui nhộn" hơn).
    return (
      <div
        style={{
          border: `2px solid ${accent}`,
          borderRadius: 10,
          padding: "12px 16px",
          margin: "16px 0",
          breakInside: "avoid",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, color: titleColor, fontWeight: 700 }}>
          <span>{index + 1}.</span>
          <span>{mascot}</span>
          <span>{title}</span>
        </div>
        {children}
      </div>
    );
  }

  if (cardStyle === "step_journey" || cardStyle === "game_station") {
    // Số thứ tự lớn kiểu "chặng"/"trạm" đứng riêng bên trái, khung nội dung bên phải.
    const isStation = cardStyle === "game_station";
    return (
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 12,
          margin: "20px 0",
          breakInside: "avoid",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: isStation ? 56 : 44,
            borderRadius: isStation ? 14 : "50%",
            background: badge,
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: isStation ? 12 : 15,
            boxShadow: `0 3px 0 ${badgeDark}`,
            padding: isStation ? "6px 2px" : 0,
          }}
        >
          {isStation && <span style={{ fontSize: 9, opacity: 0.85 }}>TRẠM</span>}
          <span style={{ fontSize: isStation ? 18 : 16 }}>{index + 1}</span>
          <span style={{ fontSize: 16 }}>{mascot}</span>
        </div>
        <div
          style={{
            flex: 1,
            border: `2.5px solid ${accent}`,
            background: bg,
            borderRadius: 16,
            padding: "10px 14px",
          }}
        >
          <div style={{ fontWeight: 700, color: titleColor, marginBottom: 6 }}>{title}</div>
          <div style={{ color: titleColor }}>{children}</div>
        </div>
      </div>
    );
  }

  // Mặc định: "rounded_dotted" - nhãn dán nổi khối (kiểu ban đầu của dự án).
  return (
    <div
      style={{
        position: "relative",
        border: `3px solid ${accent}`,
        background: bg,
        borderRadius: 18,
        padding: "20px 16px 14px",
        margin: "24px 0 14px",
        boxShadow: `0 3px 0 ${accent}66`,
        breakInside: "avoid",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -18,
          left: 16,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: badge,
          color: "#fff",
          padding: "6px 16px 6px 10px",
          borderRadius: 999,
          border: "2.5px solid #ffffff",
          boxShadow: `0 3px 0 ${badgeDark}, 0 4px 8px rgba(0,0,0,.18)`,
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
            color: titleColor,
            fontWeight: 800,
          }}
        >
          {index + 1}
        </span>
        <span style={{ fontSize: 16 }}>{mascot}</span>
        <span>{title}</span>
      </div>
      <div style={{ marginTop: 8, color: titleColor }}>{children}</div>
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

// Hình vẽ viền nét (outline, không tô sẵn) để bé tự tô màu - khớp tên với SHAPES trong
// src/data/worksheetSchemas.js. Nếu sinh ra tên hình lạ (chưa map), fallback về hình tròn.
function ShapeIcon({ name, accent }) {
  const common = { fill: "#ffffff", stroke: accent, strokeWidth: 3, strokeLinejoin: "round" };
  let shape;
  switch (name) {
    case "Hình vuông":
      shape = <rect x="8" y="8" width="40" height="40" rx="4" {...common} />;
      break;
    case "Hình chữ nhật":
      shape = <rect x="3" y="14" width="50" height="28" rx="4" {...common} />;
      break;
    case "Hình tam giác":
      shape = <polygon points="28,6 51,48 5,48" {...common} />;
      break;
    case "Hình ngôi sao":
      shape = (
        <polygon
          points="28,4 34.5,20.5 52,22 38,33.5 42.5,51 28,41 13.5,51 18,33.5 4,22 21.5,20.5"
          {...common}
        />
      );
      break;
    case "Hình trái tim":
      shape = (
        <path
          d="M28 48C28 48 6 34 6 19C6 11 12 6 19 6C23.5 6 27 8.5 28 12C29 8.5 32.5 6 37 6C44 6 50 11 50 19C50 34 28 48 28 48Z"
          {...common}
        />
      );
      break;
    case "Hình tròn":
    default:
      shape = <circle cx="28" cy="28" r="22" {...common} />;
  }
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
      {shape}
    </svg>
  );
}

function NhanDienHinhSection({ shapes, accent }) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
      {shapes.map((s, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            background: "#fff",
            border: `1.5px dashed ${accent}`,
            borderRadius: 14,
            padding: "10px 12px 8px",
            minWidth: 84,
          }}
        >
          <ShapeIcon name={s} accent={accent} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>{s}</span>
        </div>
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

  // Phiếu tạo trước Giai đoạn 0 sẽ không có field "layout" -> dùng layout mặc định để vẫn
  // hiển thị đúng, không vỡ giao diện với dữ liệu cũ.
  const layout = worksheet.layout || getDefaultLayout();
  const frame = FRAME_STYLES[layout.frameStyle] || FRAME_STYLES.dotted_border_thick_card;
  const corners = layout.cornerDecor?.length === 4 ? layout.cornerDecor : ["☀️", "🌈", "✏️", "⭐"];
  const isRibbonHeader = layout.headerStyle === "ribbon_corner";
  const isUnderlineHeader = layout.headerStyle === "simple_underline";

  return (
    <div id="print-area">
      <div className="a4-page worksheet-page">
        {/* Khung thẻ trắng dày (mat) bao ngoài */}
        <div className="worksheet-outer">
          {/* Viền trang trí bên trong (kiểu viền thay đổi theo layout.frameStyle) + 4 góc */}
          <div className="worksheet-inner" style={frame}>
            <span className="worksheet-corner tl" aria-hidden="true">{corners[0]}</span>
            <span className="worksheet-corner tr" aria-hidden="true">{corners[1]}</span>
            <span className="worksheet-corner bl" aria-hidden="true">{corners[2]}</span>
            <span className="worksheet-corner br" aria-hidden="true">{corners[3]}</span>

            <div style={{ textAlign: isRibbonHeader ? "left" : "center" }}>
              {isUnderlineHeader ? (
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: layout.palette.title,
                    borderBottom: `3px solid ${layout.palette.border}`,
                    paddingBottom: 4,
                  }}
                >
                  {meta?.title || "BÀI TẬP TOÁN"}
                </span>
              ) : (
                <span
                  className="worksheet-title-badge"
                  style={
                    isRibbonHeader
                      ? { borderRadius: "6px 20px 6px 20px", background: `linear-gradient(180deg, ${layout.palette.bg}, ${layout.palette.border}55)`, color: layout.palette.title }
                      : undefined
                  }
                >
                  {meta?.title || "BÀI TẬP TOÁN"}
                </span>
              )}
              {!isUnderlineHeader && !isRibbonHeader && <div className="worksheet-rainbow" />}
            </div>

            <div style={{ textAlign: "center", marginBottom: 18, marginTop: isUnderlineHeader ? 14 : 0 }}>
              <span className="worksheet-info-pill">
                📝 Họ và tên: .......................................... &nbsp;&nbsp; 🏫 Lớp: .......... &nbsp;&nbsp; 📅 Ngày: ..........
              </span>
            </div>

            <div
              style={
                layout.columns === 2
                  ? { columnCount: 2, columnGap: 22 }
                  : undefined
              }
            >
              {worksheet.sections.map((section, i) => {
                const t = getTheme(layout, section, i);
                return (
                  <ExerciseBox
                    key={i}
                    index={i}
                    type={section.type}
                    title={section.title}
                    mascot={t.mascot}
                    accent={t.border}
                    bg={t.bg}
                    badge={t.badge}
                    badgeDark={t.badgeDark}
                    titleColor={t.title}
                    cardStyle={layout.sectionCardStyle}
                  >
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
    </div>
  );
}
