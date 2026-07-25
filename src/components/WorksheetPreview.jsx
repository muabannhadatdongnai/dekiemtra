"use client";

/**
 * WorksheetPreview.jsx
 * Xem trước "Phiếu bài tập" - khung màu bo góc, số thứ tự tròn màu, dùng emoji thay minh hoạ
 * nhân vật (miễn phí, không lo bản quyền, Word/trình duyệt đều render được).
 */

const BOX_COLORS = [
  { border: "#7DBEE8", badge: "#378ADD", title: "#0C447C", bg: "#EFF7FD" },
  { border: "#F2AE8E", badge: "#D85A30", title: "#712B13", bg: "#FDF3EE" },
  { border: "#B9D98A", badge: "#5F9A2E", title: "#33520F", bg: "#F4F9EC" },
  { border: "#E3AEDD", badge: "#B24CA8", title: "#5C1E56", bg: "#FBF1FA" },
  { border: "#F5CD79", badge: "#D99A1B", title: "#6B4C09", bg: "#FDF7E9" },
];

function ExerciseBox({ index, title, children }) {
  const c = BOX_COLORS[index % BOX_COLORS.length];
  return (
    <div
      style={{
        border: `2px solid ${c.border}`,
        background: c.bg,
        borderRadius: 12,
        padding: "10px 14px",
        marginBottom: 12,
        breakInside: "avoid",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: c.badge,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {index + 1}
        </span>
        <span style={{ fontWeight: 700, color: c.title, fontSize: 14 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

const blankBox = (
  <span
    style={{
      display: "inline-block",
      width: 34,
      height: 26,
      border: "1.5px solid #94A3B8",
      borderRadius: 5,
      verticalAlign: "middle",
    }}
  />
);

function TinhNhamSection({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px 16px", fontSize: 13 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {it.operandA} {it.operator} {it.operandB} = {blankBox}
        </div>
      ))}
    </div>
  );
}

function DemVaVietSoSection({ items }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      {items.map((it, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, letterSpacing: 3 }}>{Array(it.count).fill(it.icon).join(" ")}</div>
          <div style={{ marginTop: 4 }}>{blankBox}</div>
        </div>
      ))}
    </div>
  );
}

function SoSanhSection({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px 16px", fontSize: 13 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {it.left}
          <span style={{ display: "inline-block", width: 22, height: 22, border: "1.5px solid #94A3B8", borderRadius: "50%" }} />
          {it.right}
        </div>
      ))}
    </div>
  );
}

function DaySoSection({ items }) {
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, alignItems: "center" }}>
          {it.sequence.map((n, idx) => (
            <span key={idx}>{n === null ? blankBox : n}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function NoiPhepTinhSection({ data }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
      <div>
        {data.pairs.map((p, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            {p.expr} <span style={{ marginLeft: 6 }}>●</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "right" }}>
        {data.shuffledResults.map((r, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            ● <span style={{ marginLeft: 6 }}>{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NhanDienHinhSection({ shapes }) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 12 }}>
      {shapes.map((s, i) => (
        <span key={i}>{s}</span>
      ))}
    </div>
  );
}

function GiaiToanSection({ items }) {
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} style={{ marginBottom: 10, fontSize: 13 }}>
          <p style={{ marginBottom: 4 }}>{it.content}</p>
          <div style={{ border: "1px solid #cbd5e1", borderRadius: 4, height: 40 }} />
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
      <div className="a4-page">
        <h1 style={{ textAlign: "center", fontWeight: 700, fontSize: 20, marginBottom: 4 }}>
          {meta?.title || "BÀI TẬP TOÁN"}
        </h1>
        <p style={{ textAlign: "center", fontSize: 13, color: "#475569", marginBottom: 14 }}>
          Họ và tên: .......................................... &nbsp;&nbsp; Lớp: ..........
        </p>

        {worksheet.sections.map((section, i) => (
          <ExerciseBox key={i} index={i} title={section.title}>
            {section.type === "tinh_nham" && <TinhNhamSection items={section.items} />}
            {section.type === "dem_va_viet_so" && <DemVaVietSoSection items={section.items} />}
            {section.type === "so_sanh" && <SoSanhSection items={section.items} />}
            {section.type === "day_so" && <DaySoSection items={section.items} />}
            {section.type === "noi_phep_tinh" && <NoiPhepTinhSection data={section.data} />}
            {section.type === "nhan_dien_hinh" && <NhanDienHinhSection shapes={section.shapes} />}
            {section.type === "giai_toan" && <GiaiToanSection items={section.items} />}
          </ExerciseBox>
        ))}
      </div>
    </div>
  );
}
