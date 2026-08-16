"use client";

import { useState, useEffect } from "react";
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
        border: `3px solid ${accent}`,
        background: bg,
        borderRadius: 18,
        padding: "0 16px 14px",
        margin: "24px 0 14px",
        boxShadow: `0 3px 0 ${accent}66`,
        breakInside: "avoid",
      }}
    >
      {/*
       * ================== GIAI ĐOẠN F3 (sửa lỗi nhãn tiêu đề đè lên ô) ==================
       * TRƯỚC ĐÂY nhãn dùng `position: absolute` + `whiteSpace: "nowrap"`: tiêu đề dài không
       * bao giờ xuống dòng (tràn tự do ra ngoài khung, đặc biệt nặng ở bố cục 2 cột cũ - nay đã
       * bỏ hẳn, xem GIAI ĐOẠN F3 phía trên) - VÀ vì absolute nên kể cả sau khi cho phép wrap,
       * nhãn cao lên vẫn có thể đè lên nội dung bên dưới (vốn nằm ở vị trí cố định `marginTop`).
       *
       * Giờ đổi sang flow bình thường (bỏ absolute) + margin-top ÂM để kéo nhãn nổi lên đè viền
       * trên (giữ đúng hiệu ứng thị giác "nhãn dán nổi khối" ban đầu), nhưng vì nằm trong flow
       * nên nội dung `children` phía dưới LUÔN được đẩy xuống đúng bằng chiều cao thật của nhãn -
       * nhãn dài 1 dòng hay 2 dòng đều không thể đè lên ô làm bài nữa.
       */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
          marginTop: -18,
          marginBottom: 10,
          background: badge,
          color: "#fff",
          padding: "6px 16px 6px 10px",
          borderRadius: 18,
          border: "2.5px solid #ffffff",
          boxShadow: `0 3px 0 ${badgeDark}, 0 4px 8px rgba(0,0,0,.18)`,
          fontFamily: "'Baloo 2', 'Segoe UI', sans-serif",
          fontWeight: 700,
          fontSize: 16,
          whiteSpace: "normal",
          wordBreak: "break-word",
          width: "fit-content",
          maxWidth: "100%",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            flexShrink: 0,
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "rgba(255,255,255,.9)",
            fontSize: 14,
            color: titleColor,
            fontWeight: 800,
            marginTop: 1,
          }}
        >
          {index + 1}
        </span>
        <span style={{ fontSize: 20, flexShrink: 0 }}>{mascot}</span>
        <span>{title}</span>
      </div>
      <div style={{ color: titleColor }}>{children}</div>
    </div>
  );
}

// GIAI ĐOẠN F3 (tăng cỡ ô làm bài): 34x26 quá nhỏ so với khổ A4 thật khi in - học sinh khó viết
// số vào trong. Bỏ 2 cột giải phóng bề rộng trang (trước đây mỗi cột chỉ 47%) nên có đủ chỗ tăng
// kích thước ô mà không lo tràn dòng.
const blankBox = (accent = "#94A3B8") => (
  <span
    style={{
      display: "inline-block",
      width: 42,
      height: 32,
      border: `1.5px solid ${accent}`,
      borderRadius: 6,
      background: "#fff",
      verticalAlign: "middle",
    }}
  />
);

function TinhNhamSection({ items, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px 16px", fontSize: 15 }}>
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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 16px", fontSize: 15 }}>
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
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 15, alignItems: "center" }}>
          {it.sequence.map((n, idx) => (
            <span key={idx}>{n === null ? blankBox(accent) : n}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * ================== GIAI ĐOẠN 2 (đa dạng hoá dạng hoạt động) ==================
 * Sắp xếp thứ tự: hiển thị 3 số xáo trộn -> mũi tên -> 3 ô trống cách nhau bởi dấu < hoặc >
 * (tuỳ it.direction), mô phỏng đúng bố cục "30 cm < ⬜ < ⬜" trong phiếu mẫu lớp 2.
 *
 * ================== GIAI ĐOẠN 9, BƯỚC 2 (tái dùng cho chủ đề "Độ dài", Lớp 1) ==================
 * generateDoDaiSapXep() trả về CÙNG khuôn dữ liệu (numbers/sortedAnswer/direction) + thêm field
 * `unit` ("cm") - nếu có, hiển thị kèm đơn vị ngay sau mỗi số để rõ đây là số đo độ dài, không
 * đổi gì với dữ liệu CŨ (sap_xep_thu_tu số trần trụi, không có `unit` -> giữ nguyên hành vi cũ).
 */
function SapXepThuTuSection({ items, accent }) {
  const symbol = (direction) => (direction === "asc" ? "<" : ">");
  return (
    <div>
      {items.map((it, i) => {
        const unitSuffix = it.unit ? ` ${it.unit}` : "";
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 15 }}>
            <span style={{ marginRight: 10 }}>{it.numbers.map((n) => `${n}${unitSuffix}`).join(" ;  ")}</span>
            <span style={{ color: accent, fontWeight: 700 }}>➜</span>
            {it.sortedAnswer.map((_, idx) => (
              <span key={idx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {blankBox(accent)}
                {idx < it.sortedAnswer.length - 1 && <span style={{ color: accent, fontWeight: 700 }}>{symbol(it.direction)}</span>}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function NoiPhepTinhSection({ data, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
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

/**
 * ================== GIAI ĐOẠN 9, BƯỚC 2 (chủ đề "Độ dài", Lớp 1) ==================
 * So sánh độ dài 2 "băng giấy" đã ghi sẵn số đo (cm) - vẽ 1 thanh màu có ĐỘ RỘNG tỉ lệ thô với
 * số cm (chỉ mang tính minh hoạ trực quan, KHÔNG cần đúng tỉ lệ vật lý tuyệt đối vì đây là bài
 * tập đọc-so sánh số đo đã cho sẵn, không phải bài tự đo bằng thước thật trên giấy in - tránh
 * rủi ro sai lệch khi in/PDF không giữ đúng tỉ lệ mm mong muốn) + nhãn số đo bên cạnh.
 */
function DoDaiSoSanhSection({ items, accent }) {
  const maxCm = 20; // đúng phạm vi randInt(3,20) trong generateDoDaiSoSanh()
  const barWidth = (cm) => 40 + (cm / maxCm) * 90; // px, chỉ mang tính minh hoạ tỉ lệ thô
  const bar = (label, cm) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: barWidth(cm),
          height: 14,
          borderRadius: 7,
          background: accent,
          opacity: 0.75,
          flexShrink: 0,
        }}
      />
      <span style={{ whiteSpace: "nowrap" }}>
        {label}: <strong>{cm} cm</strong>
      </span>
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 13 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {bar(it.nameA, it.cmA)}
          {bar(it.nameB, it.cmB)}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
            <span>{it.nameA}</span>
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
            <span>{it.nameB}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ================== GIAI ĐOẠN 9, BƯỚC 2 (chủ đề "Thời gian", Lớp 1) ==================
 * Mặt đồng hồ SVG đơn giản (đủ 12 số, kim giờ + kim phút) - tính toán vị trí bằng lượng giác
 * NGAY TẠI thời điểm render theo `hour` truyền vào (không hardcode toạ độ như ShapeIcon, vì mỗi
 * đồng hồ cần 1 góc kim khác nhau tuỳ dữ liệu, không phải hữu hạn hình cố định). "Giờ đúng"
 * (đúng mức độ chương trình Lớp 1) -> kim phút LUÔN chỉ đúng số 12.
 */
function ClockFace({ hour, size = 88 }) {
  const cx = 50;
  const cy = 50;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const pointAt = (angleDeg, r) => ({
    x: cx + r * Math.cos(toRad(angleDeg)),
    y: cy + r * Math.sin(toRad(angleDeg)),
  });
  const hourAngle = ((hour % 12) * 30) - 90;
  const minuteAngle = -90; // giờ đúng -> kim phút luôn chỉ số 12
  const hourTip = pointAt(hourAngle, 19);
  const minuteTip = pointAt(minuteAngle, 30);
  const numbers = Array.from({ length: 12 }, (_, idx) => {
    const n = idx + 1;
    const { x, y } = pointAt((n % 12) * 30 - 90, 34);
    return { n, x, y };
  });
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <circle cx={cx} cy={cy} r={42} fill="#fff" stroke="#334155" strokeWidth="3" />
      {numbers.map(({ n, x, y }) => (
        <text key={n} x={x} y={y + 3.5} fontSize="10" textAnchor="middle" fill="#334155" fontFamily="Baloo 2, sans-serif" fontWeight="700">
          {n}
        </text>
      ))}
      <line x1={cx} y1={cy} x2={hourTip.x} y2={hourTip.y} stroke="#334155" strokeWidth="4.5" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={minuteTip.x} y2={minuteTip.y} stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="3" fill="#334155" />
    </svg>
  );
}

function XemDongHoGioDungSection({ items, accent }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <ClockFace hour={it.hour} />
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            {blankBox(accent)} <span>giờ</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ================== GIAI ĐOẠN 9, BƯỚC 2 (chủ đề "Thời gian", Lớp 1) ==================
 * Điền tên ngày còn thiếu trong 1 đoạn liên tiếp của tuần - CÙNG khuôn dữ liệu với DaySoSection
 * (sequence có null = chỗ trống) nhưng nối bằng " — " thay vì dấu phẩy (tên ngày dài hơn số, dấu
 * phẩy dễ đọc nhầm là 1 danh sách rời rạc thay vì 1 CHUỖI có thứ tự liên tiếp).
 */
function CacNgayTrongTuanSection({ items, accent }) {
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12, fontSize: 13, alignItems: "center" }}>
          {it.sequence.map((d, idx) => (
            <span key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {d === null ? (
                <span
                  style={{
                    display: "inline-block",
                    minWidth: 76,
                    height: 26,
                    border: `1.5px solid ${accent}`,
                    borderRadius: 6,
                    background: "#fff",
                  }}
                />
              ) : (
                <strong>{d}</strong>
              )}
              {idx < it.sequence.length - 1 && <span style={{ color: accent }}>—</span>}
            </span>
          ))}
        </div>
      ))}
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
    case "Hình thoi":
      shape = <polygon points="28,4 52,28 28,52 4,28" {...common} />;
      break;
    case "Hình ê-líp":
      shape = <ellipse cx="28" cy="28" rx="25" ry="16" {...common} />;
      break;
    case "Hình ngũ giác":
      shape = <polygon points="28,4 50.8,20.6 42.1,47.4 13.9,47.4 5.2,20.6" {...common} />;
      break;
    case "Hình lục giác":
      shape = <polygon points="52,28 40,48.8 16,48.8 4,28 16,7.2 40,7.2" {...common} />;
      break;
    case "Hình thang":
      shape = <polygon points="18,10 38,10 50,46 6,46" {...common} />;
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

/**
 * ================== GIAI ĐOẠN 2 (hoạt động ứng dụng tự động đi kèm Nhận diện hình) ==================
 * "Khay hình" trộn lẫn (trayIcons, đã được worksheetSchemas.js xáo trộn sẵn) hiển thị bằng
 * ShapeIcon nhỏ hơn NhanDienHinhSection (không cần tên chữ, chỉ cần nhận diện hình dáng), tiếp
 * theo là các câu hỏi "Có bao nhiêu Hình X?" với ô trống để điền số - CHÍNH LÀ phần "có gì
 * khác" mà giáo viên phản ánh còn thiếu ở "Nhận diện hình" bản cũ.
 */
function DemHinhUngDungSection({ data, accent }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          padding: "8px 10px",
          background: "#fff",
          border: `1.5px dashed ${accent}`,
          borderRadius: 12,
          marginBottom: 10,
        }}
      >
        {data.trayIcons.map((s, i) => (
          <span key={i} style={{ transform: "scale(0.6)", transformOrigin: "center" }}>
            <ShapeIcon name={s} accent={accent} />
          </span>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 15 }}>
        {data.questions.map((q, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>❓ Có bao nhiêu <strong>{q.shape}</strong>?</span>
            {blankBox(accent)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ================== GIAI ĐOẠN 4 ==================
 * QR "chấm nhanh" - mã hoá đáp số các bài giải toán có lời văn vào 1 mã QR, phụ huynh/học sinh
 * quét để tự đối chiếu kết quả (không cần giáo viên soạn riêng 1 tờ đáp án). Sinh QR PHÍA
 * CLIENT (thư viện "qrcode" chạy được cả trong trình duyệt) để không tốn round-trip server;
 * chỉ áp dụng cho bài giải toán vì đây là dạng DUY NHẤT có đáp số dạng câu chữ tự do do AI sinh
 * (các dạng code-sinh khác đáp số tính trực tiếp từ số liệu in sẵn trên phiếu, không cần QR).
 */
function AnswerQrCode({ text, accent }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    import("qrcode")
      .then((QRCode) => QRCode.toDataURL(text, { width: 96, margin: 1, color: { dark: accent } }))
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        // Lỗi sinh QR (hiếm khi xảy ra) - im lặng bỏ qua, KHÔNG làm hỏng phần còn lại của phiếu.
      });
    return () => {
      cancelled = true;
    };
  }, [text, accent]);

  if (!dataUrl) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="Mã QR đáp số" width={72} height={72} style={{ borderRadius: 6 }} />
      <span style={{ fontSize: 12, color: "#64748b" }}>
        📱 Quét mã QR để xem đáp số (phụ huynh/học sinh tự đối chiếu)
      </span>
    </div>
  );
}

/**
 * ================== GIAI ĐOẠN 4 ==================
 * Footer "Tự đánh giá / Nhận xét của thầy cô / Ghi nhớ" - đúng tinh thần 5 phiếu mẫu giáo viên
 * gửi làm nguồn cảm hứng ban đầu, giúp phiếu có chỗ cho học sinh tự phản hồi và giáo viên ghi
 * nhận xét, thay vì chỉ dừng lại ở phần bài tập thuần tuý.
 */
function WorksheetFooter({ palette }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.3fr 1fr",
        gap: 12,
        marginTop: 24,
        fontSize: 12,
      }}
    >
      <div style={{ border: `2px dashed ${palette.border}`, borderRadius: 12, padding: "10px 12px", textAlign: "center" }}>
        <p style={{ fontWeight: 700, color: palette.title, marginBottom: 6 }}>⭐ TỰ ĐÁNH GIÁ</p>
        <p>Học chăm ⭐⭐⭐</p>
        <p>Làm tốt ⭐⭐⭐</p>
        <p>Cố gắng hơn ⭐⭐⭐</p>
      </div>
      <div style={{ border: `2px dashed ${palette.border}`, borderRadius: 12, padding: "10px 12px" }}>
        <p style={{ fontWeight: 700, color: palette.title, marginBottom: 6, textAlign: "center" }}>
          💬 NHẬN XÉT CỦA THẦY/CÔ
        </p>
        <div style={{ borderBottom: "1px dotted #cbd5e1", height: 18 }} />
        <div style={{ borderBottom: "1px dotted #cbd5e1", height: 18 }} />
      </div>
      <div style={{ border: `2px dashed ${palette.border}`, borderRadius: 12, padding: "10px 12px" }}>
        <p style={{ fontWeight: 700, color: palette.title, marginBottom: 6, textAlign: "center" }}>📌 GHI NHỚ</p>
        <p>✔️ Ôn lại kiến thức</p>
        <p>✔️ Làm bài cẩn thận</p>
        <p>✔️ Kiểm tra kết quả</p>
      </div>
    </div>
  );
}

// GIAI ĐOẠN F2 (ý b): trước đây chỉ có 1 ô trống cao 42px cho "Giải toán có lời văn" - không đủ
// chỗ viết lời giải + phép tính + đáp số (thường cần 3-4 dòng). Đổi sang khung "ô ly" nhiều dòng
// kẻ ngang (giống vở kẻ ngang học sinh tiểu học hay dùng) thay vì 1 khối trống trơn, để học sinh
// biết rõ viết được mấy dòng và giữ chữ thẳng hàng. LINE_HEIGHT/LINE_COUNT tính theo px cố định
// (không phụ thuộc khổ giấy) vì đây chỉ là các dòng kẻ ngang đơn giản, khác bài toán "vừa khổ A4"
// của blankBox ở F3.
const GIAI_TOAN_LINE_HEIGHT = 26;
const GIAI_TOAN_LINE_COUNT = 4;

function GiaiToanSection({ items, accent }) {
  const boxHeight = GIAI_TOAN_LINE_HEIGHT * GIAI_TOAN_LINE_COUNT;
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} style={{ marginBottom: 14, fontSize: 15 }}>
          <p style={{ marginBottom: 6 }}>{it.content}</p>
          <div
            style={{
              border: `1.5px dashed ${accent}`,
              borderRadius: 6,
              height: boxHeight,
              background: `repeating-linear-gradient(to bottom, transparent 0, transparent ${
                GIAI_TOAN_LINE_HEIGHT - 1
              }px, #d9dde3 ${GIAI_TOAN_LINE_HEIGHT - 1}px, #d9dde3 ${GIAI_TOAN_LINE_HEIGHT}px)`,
              backgroundColor: "#fff",
            }}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * ================== GIAI ĐOẠN 6 (mở rộng sang Tiếng Việt) ==================
 * "Khoanh từ chỉ hoạt động / đặc điểm" - chỉ hiện câu văn (KHÔNG lộ targetWord - học sinh tự
 * khoanh trên bản in, đáp án nằm trong QR "chấm nhanh" nếu includeAnswers, xem
 * worksheetGenerator.js answerKeyParts).
 */
function KhoanhTuLoaiSection({ items, accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 15 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: 8 }}>
          <span style={{ color: accent, fontWeight: 700 }}>{i + 1}.</span>
          <span>{it.sentence}</span>
        </div>
      ))}
    </div>
  );
}

/** "Nối từ với nhóm thích hợp" - CÙNG bố cục 2 cột-nối như NoiPhepTinhSection (quen thuộc với
 * học sinh), chỉ khác nội dung là CHỮ thay vì SỐ. */
function NoiTuNhomSection({ data, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
      <div>
        {data.pairs.map((p, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            {p.left} <span style={{ marginLeft: 6, color: accent, fontWeight: 700 }}>●</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "right" }}>
        {data.shuffledRight.map((r, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <span style={{ marginRight: 6, color: accent, fontWeight: 700 }}>●</span> {r}
          </div>
        ))}
      </div>
    </div>
  );
}

/** "Điền từ thích hợp vào chỗ trống" - ngân hàng từ dạng "chip" ở trên (đúng kiểu mẫu in sẵn
 * thường thấy), câu có "___" thay bằng khoảng trống viền chấm bên dưới. */
function DienTuChoSanSection({ data, accent }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          padding: "8px 10px",
          background: "#fff",
          border: `1.5px dashed ${accent}`,
          borderRadius: 12,
          marginBottom: 10,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {data.wordBank.map((w, i) => (
          <span key={i} style={{ padding: "2px 10px", border: `1px solid ${accent}`, borderRadius: 999, color: accent }}>
            {w}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 15 }}>
        {data.sentences.map((s, i) => {
          const parts = s.template.split("___");
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
              <span style={{ color: accent, fontWeight: 700, marginRight: 4 }}>{i + 1}.</span>
              <span>{parts[0]}</span>
              <span style={{ display: "inline-block", minWidth: 60, borderBottom: `2px dotted ${accent}`, height: 18 }} />
              <span>{parts[1]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** "Đặt câu theo mẫu" - mẫu câu (đậm) + ví dụ (chữ nghiêng, nhạt màu) + 1 dòng kẻ trống để học
 * sinh tự viết câu riêng (KHÔNG có đáp án cố định - xem worksheetGenerator.js, không đẩy vào
 * answerKeyParts). */
function DatCauTheoMauSection({ items, accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 15 }}>
      {items.map((it, i) => (
        <div key={i}>
          <p style={{ marginBottom: 2 }}>
            <span style={{ color: accent, fontWeight: 700 }}>{i + 1}. Mẫu: </span>
            <strong>{it.pattern}</strong>
          </p>
          <p style={{ marginBottom: 6, fontStyle: "italic", color: "#64748b" }}>VD: {it.example}</p>
          <div style={{ borderBottom: `1.5px dashed ${accent}`, height: 24 }} />
        </div>
      ))}
    </div>
  );
}

/** Render 1 ExerciseBox hoàn chỉnh theo section.type - tách riêng thành component để dùng
 * chung được ở cả nhánh 1 cột và 2 cột (GIAI ĐOẠN 9), tránh lặp lại y hệt 1 khối JSX dài 2 lần. */
function RenderedExerciseBox({ section, index, layout }) {
  const t = getTheme(layout, section, index);
  return (
    <ExerciseBox
      index={index}
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
      {section.type === "dem_va_viet_so" && <DemVaVietSoSection items={section.items} accent={t.border} />}
      {section.type === "so_sanh" && <SoSanhSection items={section.items} accent={t.border} />}
      {section.type === "day_so" && <DaySoSection items={section.items} accent={t.border} />}
      {section.type === "sap_xep_thu_tu" && <SapXepThuTuSection items={section.items} accent={t.border} />}
      {section.type === "noi_phep_tinh" && <NoiPhepTinhSection data={section.data} accent={t.border} />}
      {section.type === "do_dai_so_sanh" && <DoDaiSoSanhSection items={section.items} accent={t.border} />}
      {section.type === "do_dai_sap_xep" && <SapXepThuTuSection items={section.items} accent={t.border} />}
      {section.type === "xem_dong_ho_gio_dung" && <XemDongHoGioDungSection items={section.items} accent={t.border} />}
      {section.type === "cac_ngay_trong_tuan" && <CacNgayTrongTuanSection items={section.items} accent={t.border} />}
      {section.type === "nhan_dien_hinh" && <NhanDienHinhSection shapes={section.shapes} accent={t.border} />}
      {section.type === "dem_hinh_ung_dung" && <DemHinhUngDungSection data={section.data} accent={t.border} />}
      {section.type === "giai_toan" && <GiaiToanSection items={section.items} accent={t.border} />}
      {section.type === "khoanh_tu_loai" && <KhoanhTuLoaiSection items={section.items} accent={t.border} />}
      {section.type === "noi_tu_nhom" && <NoiTuNhomSection data={section.data} accent={t.border} />}
      {section.type === "dien_tu_cho_san" && <DienTuChoSanSection data={section.data} accent={t.border} />}
      {section.type === "dat_cau_theo_mau" && <DatCauTheoMauSection items={section.items} accent={t.border} />}
    </ExerciseBox>
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

            {/*
             * ================== GIAI ĐOẠN F3 (bỏ hẳn bố cục 2 cột) ==================
             * Lịch sử: multicol -> flex -> float (xem NEXT_STEPS.md/PROJECT_SUMMARY.md), mỗi lần
             * chỉ sửa được lỗi ngắt trang khi in nhưng để lộ lỗi khác. Lỗi mới nhất giáo viên gửi
             * ảnh chụp: ở bố cục 2 cột (mỗi cột chỉ 47% bề rộng trang), nhãn tiêu đề dài của
             * ExerciseBox (`whiteSpace: nowrap`) tràn ra ngoài khung và bị cắt bởi `overflow:
             * hidden` của khối bọc 2 cột float. Quyết định CHỐT: bỏ hẳn bố cục 2 cột, luôn hiển
             * thị 1 cột duy nhất (an toàn hơn, chấp nhận phiếu dài hơn) - không còn cần kỹ thuật
             * chia cột (multicol/flex/float) nào nữa nên không còn rủi ro ngắt trang/tràn khung
             * kiểu này tái diễn. `layout.columns` (nếu dữ liệu cũ còn field này) không còn được
             * đọc ở đây nữa.
             */}
            <div>
              {worksheet.sections.map((section, i) => (
                <RenderedExerciseBox key={i} section={section} index={i} layout={layout} />
              ))}
            </div>

            {worksheet.answerKeyText && <AnswerQrCode text={worksheet.answerKeyText} accent={layout.palette.border} />}

            <WorksheetFooter palette={layout.palette} />
          </div>
        </div>
      </div>
    </div>
  );
}
