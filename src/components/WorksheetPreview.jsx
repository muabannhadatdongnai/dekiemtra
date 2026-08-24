"use client";

import { useState, useEffect } from "react";
import { getSectionVisualTheme, getDefaultLayout } from "@/data/worksheetLayoutTemplates";
// MỞ RỘNG LỚP 3, ĐỢT 2: nhãn 3 mức "Chắc chắn/Có thể/Không thể" dùng chung với generator
// (worksheetSchemas.js) - tránh khai lại danh sách nhãn 2 nơi có thể lệch nhau.
import { PROBABILITY_LEVEL_LABELS } from "@/data/worksheetSchemas";
// MỞ RỘNG LỚP 3, ĐỢT 3: format số kiểu Việt Nam (dấu chấm phân cách hàng nghìn) DÙNG CHUNG với
// worksheetExportService.js - xem numberFormatUtils.js.
import { formatSoTuNhien, formatSoTrongChuoi, formatSoThapPhan } from "@/services/numberFormatUtils";
// ================== SỬA LỖI "Bài 3 icon màu khó phân biệt khi in đen trắng" ==================
// Icon emoji màu -> icon line-art (nét vẽ đen trắng), dùng chung 1 bộ SVG với bản Word (xem
// lineArtIconPngs.js + scripts/render-line-art-icons.js) - xem chi tiết ở LineArtIcon bên dưới.
import { getLineArtIcon } from "@/data/lineArtIcons";

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
        padding: "14px 16px 14px",
        margin: "24px 0 14px",
        boxShadow: `0 3px 0 ${accent}66`,
        breakInside: "avoid",
      }}
    >
      {/*
       * ================== GIAI ĐOẠN F3 (sửa lỗi nhãn tiêu đề đè lên ô) ==================
       * TRƯỚC ĐÂY nhãn dùng `position: absolute` + `whiteSpace: "nowrap"`: tiêu đề dài không
       * bao giờ xuống dòng (tràn tự do ra ngoài khung) - VÀ vì absolute nên kể cả sau khi cho
       * phép wrap, nhãn cao lên vẫn có thể đè lên nội dung bên dưới.
       *
       * ================== GIAI ĐOẠN F4 (sửa lỗi MẤT CHỮ khi ngắt trang PDF) ==================
       * Bản sửa F3 đổi sang flow bình thường + `margin-top` ÂM (-18px) để kéo nhãn nổi lên đè
       * viền trên, dựa vào `margin-top: 24px` của CHÍNH khung ngoài để chừa đủ chỗ cho phần nhãn
       * nhô lên. Lỗi giáo viên chụp ảnh gửi (khung "4" bị cắt mất chữ ở đầu trang 2 khi "In/Tải
       * PDF"): "Tải PDF" ở app này = `window.print()` (xem exportService.js) - và theo ĐÚNG chuẩn
       * CSS in ấn, khi 1 khối bắt đầu ngay ĐẦU TRANG MỚI (breakInside:"avoid" đẩy cả khung này
       * xuống trang 2 vì không đủ chỗ ở cuối trang 1), trình duyệt LUÔN collapse margin-top của
       * nó về 0 - "khoảng chừa" 24px không còn tồn tại ở đầu trang mới, khiến phần nhãn nhô lên
       * -18px (vốn trông chờ vào 24px đó) bị đúng MÉP TRÊN CÙNG của trang cắt mất - đúng hiện
       * tượng "mất chữ" trong ảnh (chỉ mất khi khung rơi vào đầu 1 trang, không phải lỗi luôn tái
       * hiện, nên trước đó không phát hiện qua xem trên màn hình - `window.print()` mới lộ ra).
       *
       * Giải pháp ĐÚNG: nhãn không còn nhô ra NGOÀI viền khung nữa (bỏ hẳn margin-top âm) - nằm
       * TRỌN VẸN bên trong padding-top của khung (đổi từ 0 sang 14px để có chỗ chứa nhãn), tức
       * nhãn không còn phụ thuộc vào margin của khung ngoài (nay không bị mất khi margin bị
       * collapse ở đầu trang) - đổi hình dạng viền nhãn "borderRadius: 18" (bo tròn đều, kiểu
       * "thẻ dán") thay vì để nhô ra ngoài, vẫn giữ được cảm giác "nhãn nổi bật" qua màu nền/viền
       * trắng/đổ bóng, chỉ khác là không còn đè lên viền khung ngoài nữa - ĐÁNH ĐỔI CHỦ Ý và AN
       * TOÀN hơn nhiều so với việc dựa vào hành vi margin-collapse-tại-ranh-giới-trang vốn không
       * ổn định giữa các trình duyệt/khi in.
       */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
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
//
// MỞ RỘNG LỚP 3, ĐỢT 3: rộng thêm 42 -> 64 - từ khi mở khối Lớp 3 (số đến 100 000, xem
// worksheetSchemas.js), đáp án có thể dài tới 5-6 ký tự kể cả dấu chấm phân cách hàng nghìn (VD
// "19.000") - ô 42px cũ chỉ vừa 2-3 ký tự, học sinh viết số lớn sẽ bị tràn ra ngoài (đúng phản
// hồi thực tế ở "Trạm 8" - đổi đơn vị đo). Giữ NGUYÊN 1 kích thước DUY NHẤT cho mọi dạng bài
// (không tách riêng theo dạng bài) để không lệch cỡ ô giữa các khối trên cùng 1 phiếu.
const blankBox = (accent = "#94A3B8", minWidth = 64) => (
  <span
    style={{
      display: "inline-block",
      minWidth,
      height: 32,
      padding: "0 4px",
      border: `1.5px solid ${accent}`,
      borderRadius: 6,
      background: "#fff",
      verticalAlign: "middle",
    }}
  />
);

/**
 * [QUY TẮC SƯ PHẠM TOÁN LỚP 5 BẮT BUỘC - TỪ KHOÁ ĐẶT TÍNH] Khung ô ly ("[GRID_5_DONG]") dùng thay
 * cho `blankBox()` một hàng ngang bất cứ khi nào đề bài yêu cầu "Đặt tính rồi tính" - học sinh cần
 * ĐẶT phép tính hàng dọc (chia dài, nhân nhiều chữ số, cộng/trừ thẳng cột dấu phẩy...) chứ không
 * thể viết vừa vào 1 ô trống ngắn cuối dòng ngang. `rows` mặc định 5 dòng ô ly (đúng độ cao thường
 * dùng để đặt tính 1 phép chia/nhân/cộng/trừ số thập phân của Lớp 5) - đủ chỗ nháp mà không chiếm
 * quá nhiều diện tích trang in. Dùng CHUNG cho mọi dạng bài "đặt tính rồi tính" (cộng/trừ/nhân/chia
 * số thập phân, phép chia có dư) - KHÔNG viết lại riêng từng dạng bài.
 */
function GridOLy({ accent = "#94A3B8", rows = 5, cellSize = 17, minWidth = 150 }) {
  return (
    <div
      style={{
        minWidth,
        width: "100%",
        height: rows * cellSize,
        backgroundColor: "#fff",
        backgroundImage:
          `linear-gradient(to right, ${accent}55 1px, transparent 1px), ` +
          `linear-gradient(to bottom, ${accent}55 1px, transparent 1px)`,
        backgroundSize: `${cellSize}px ${cellSize}px`,
        border: `1.5px solid ${accent}`,
        borderRadius: 6,
      }}
    />
  );
}

// MỞ RỘNG LỚP 3, ĐỢT 3: 3 cột -> 2 cột (giáo viên phản ánh 3 cột dồn quá chật, nhất là từ khi
// Lớp 3 có phép tính số tròn nghìn/chục nghìn dài hơn hẳn Lớp 1-2) - 2 cột cho bài + ô đáp án
// rộng rãi hơn, đỡ tràn khi số dài (63.880 + 20.000 = ...).
function TinhNhamSection({ items, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px 20px", fontSize: 15 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {formatSoTuNhien(it.operandA)} {it.operator} {formatSoTuNhien(it.operandB)} = {blankBox(accent)}
        </div>
      ))}
    </div>
  );
}

/**
 * Icon LINE-ART (nét vẽ đen trắng) - THAY cho emoji màu (🍎🦋🚀...) vốn khó phân biệt khi máy in
 * tự chuyển emoji màu sang thang xám (phản hồi giáo viên qua ảnh tham khảo, xem NEXT_STEPS.md
 * mục "Bài 3"). Vẫn tra cứu bằng chính emoji làm key (không đổi cấu trúc dữ liệu generator) - xem
 * kho đầy đủ + cách tạo lại ở src/data/lineArtIcons.js.
 * Có fallback về emoji gốc nếu 1 icon nào đó chưa có bản line-art tương ứng (an toàn khi mở rộng
 * kho ICONS sau này mà quên vẽ icon mới).
 */
function LineArtIcon({ emoji, size = 26 }) {
  const def = getLineArtIcon(emoji);
  if (!def) return <span style={{ fontSize: size }}>{emoji}</span>;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={{ display: "inline-block", flexShrink: 0 }}
      role="img"
      aria-label={def.name}
      dangerouslySetInnerHTML={{ __html: def.svgInner }}
    />
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
            maxWidth: 220,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4 }}>
            {Array.from({ length: it.count }).map((_, idx) => (
              <LineArtIcon key={idx} emoji={it.icon} size={26} />
            ))}
          </div>
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
          {formatSoTrongChuoi(it.left)}
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
          {formatSoTrongChuoi(it.right)}
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
            <span key={idx}>{n === null ? blankBox(accent) : formatSoTuNhien(n)}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * ================== GIAI ĐOẠN F (dạng bài "Tách - Gộp") ==================
 * Sơ đồ number-bond: 1 ô TỔNG ("whole") ở trên, nối bằng 2 đường chéo xuống 2 ô THÀNH PHẦN
 * ("part1"/"part2") ở dưới - đúng bố cục quen thuộc trong SGK Toán Lớp 1. Vẽ bằng CSS thuần
 * (position absolute + transform rotate cho 2 đường chéo) thay vì SVG/thư viện ngoài, theo đúng
 * phong cách các section khác trong file này (inline style, không phụ thuộc gì thêm).
 * `renderSlot()` hiển thị số thật hoặc blankBox() tuỳ đúng ô đang bị ẩn (it.hideSlot).
 */
function TachGopDiagram({ item, accent }) {
  const { whole, part1, part2, hideSlot } = item;
  const boxStyle = {
    position: "absolute",
    width: 46,
    height: 38,
    border: `2px solid ${accent}`,
    borderRadius: 10,
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17,
    fontWeight: 700,
    color: accent,
  };
  const renderSlot = (value, slot) => (hideSlot === slot ? blankBox(accent) : value);
  // Toạ độ container 132x108: ô tổng (whole) tâm (66,34) ở trên; ô phần1 (part1) tâm (23,70) ở
  // dưới-trái; ô phần2 (part2) tâm (109,70) ở dưới-phải (khớp đúng vị trí boxStyle bên dưới).
  // 2 đường chéo là 1 thanh ngang mỏng xoay quanh ĐẦU TRÁI (transformOrigin "left center") đặt
  // tại đúng tâm ô tổng - góc xoay tính bằng lượng giác từ vector (tâm ô tổng -> tâm ô thành
  // phần) để đường luôn chỉ THẲNG vào đúng tâm ô bên dưới bất kể sau này đổi kích thước.
  return (
    <div style={{ position: "relative", width: 132, height: 108 }}>
      <div
        style={{
          position: "absolute",
          top: 33,
          left: 66,
          width: 56,
          height: 2,
          background: accent,
          transform: "rotate(140deg)", // hướng xuống-trái, vào tâm ô part1 (23,70)
          transformOrigin: "left center",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 33,
          left: 66,
          width: 56,
          height: 2,
          background: accent,
          transform: "rotate(40deg)", // hướng xuống-phải, vào tâm ô part2 (109,70)
          transformOrigin: "left center",
        }}
      />
      <div style={{ ...boxStyle, top: 0, left: 43 }}>{renderSlot(whole, "whole")}</div>
      <div style={{ ...boxStyle, bottom: 0, left: 0 }}>{renderSlot(part1, "part1")}</div>
      <div style={{ ...boxStyle, bottom: 0, right: 0 }}>{renderSlot(part2, "part2")}</div>
    </div>
  );
}

function TachGopSection({ items, accent }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "flex-start" }}>
      {items.map((it, i) => (
        <TachGopDiagram key={i} item={it} accent={accent} />
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
            <span style={{ marginRight: 10 }}>
              {it.numbers.map((n) => `${formatSoTuNhien(n)}${unitSuffix}`).join(" ;  ")}
            </span>
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
            {formatSoTrongChuoi(p.expr)} <span style={{ marginLeft: 6, color: accent, fontWeight: 700 }}>●</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "right" }}>
        {data.shuffledResults.map((r, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <span style={{ marginRight: 6, color: accent, fontWeight: 700 }}>●</span> {formatSoTuNhien(r)}
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
/**
 * ================== MỞ RỘNG LỚP 3, ĐỢT 2 ==================
 * Thêm tham số `minute` (mặc định 0) - khi minute=0, hourAngle/minuteAngle tính ra giống HỆT bản
 * cũ (Lớp 1, giờ đúng) nên KHÔNG đổi hành vi hiện có, chỉ mở rộng để vẽ được cả kim phút lệch
 * theo từng vạch 5 phút (Lớp 3, xem generateXemDongHoGioPhut() trong worksheetSchemas.js).
 */
function ClockFace({ hour, minute = 0, size = 88 }) {
  const cx = 50;
  const cy = 50;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const pointAt = (angleDeg, r) => ({
    x: cx + r * Math.cos(toRad(angleDeg)),
    y: cy + r * Math.sin(toRad(angleDeg)),
  });
  // Kim giờ lệch thêm theo phút (0.5 độ/phút) - đúng cách đồng hồ thật di chuyển kim giờ dần dần
  // giữa 2 số, không đứng khựng lại đúng số khi phút khác 0.
  const hourAngle = (hour % 12) * 30 + minute * 0.5 - 90;
  const minuteAngle = minute * 6 - 90;
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
 * ================== MỞ RỘNG LỚP 3, ĐỢT 2 ==================
 * "Xem đồng hồ (giờ, phút)" - khác XemDongHoGioDungSection ở 2 điểm: (1) ClockFace nhận thêm
 * `minute` để kim phút lệch đúng vị trí; (2) CÓ 2 ô trống (giờ VÀ phút), không chỉ 1 ô như bản
 * giờ đúng Lớp 1.
 */
function XemDongHoGioPhutSection({ items, accent }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <ClockFace hour={it.hour} minute={it.minute} />
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            {blankBox(accent)} <span>giờ</span> {blankBox(accent)} <span>phút</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ================== MỞ RỘNG LỚP 3, ĐỢT 2 ==================
 * "Chu vi, diện tích hình chữ nhật - hình vuông" - mỗi câu là 1 đoạn văn ngắn tả hình + số đo,
 * kèm 1 ô trống để điền kết quả. Đơn vị diện tích hiển thị "cm²" (ký tự Unicode superscript có
 * sẵn, không cần thư viện) - khác chu vi chỉ "cm" thường.
 */
function ChuViDienTichSection({ items, accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 15 }}>
      {items.map((it, i) => {
        const desc =
          it.shape === "vuong"
            ? `Hình vuông có cạnh ${it.side} ${it.unit}.`
            : `Hình chữ nhật có chiều dài ${it.length} ${it.unit}, chiều rộng ${it.width} ${it.unit}.`;
        const ask = it.metric === "chu_vi" ? "Tính chu vi hình đó." : "Tính diện tích hình đó.";
        const resultUnit = it.metric === "dien_tich" ? `${it.unit}²` : it.unit;
        return (
          <div key={i}>
            <div>
              {i + 1}. {desc} {ask}
            </div>
            <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
              Bài giải: {blankBox(accent)} {resultUnit}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * ================== MỞ RỘNG LỚP 3, ĐỢT 2 ==================
 * "Đổi đơn vị đo" - lưới 2 cột giống TinhNhamSection, nhưng vế trái/phải là "số + đơn vị" thay vì
 * phép tính (không tái dùng thẳng được TinhNhamSection vì thiếu chỗ hiển thị đơn vị).
 *
 * ================== MỞ RỘNG LỚP 3, ĐỢT 3 (phản hồi "Trạm 8") ==================
 * TRƯỚC ĐÂY 3 cột: giá trị đổi có thể tới 5 chữ số (VD 14000 ml, 20000 m) làm ô đáp án 3-cột bị
 * chật, số lớn tràn ra ngoài ô khi in. Đổi xuống 2 cột (giống TinhNhamSection) để mỗi dòng có
 * nhiều bề rộng hơn, ô đáp án (blankBox) rộng và thoáng hơn hẳn.
 */
function DoiDonViSection({ items, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px 20px", fontSize: 15 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {formatSoTuNhien(it.value)} {it.fromUnit} = {blankBox(accent)} {it.toUnit}
        </div>
      ))}
    </div>
  );
}

/**
 * ================== MỞ RỘNG LỚP 4, ĐỢT 1 (SỬA PHIÊN 17 - phản hồi thực tế) ==================
 * "Rút gọn phân số" - hiển thị dạng chữ "tử/mẫu" (xem giải thích trong generatePhanSoRutGon(),
 * worksheetSchemas.js) - CHỦ Ý chưa dựng layout phân số nằm ngang có gạch ngang ở đợt này.
 * Số thứ tự câu ("1.") giờ nằm trong 1 <span> RIÊNG có margin-right cố định (thay vì dựa vào 1 ký
 * tự khoảng trắng "nằm trơ trọi" giữa các node JSX) - tránh vài công cụ in/xuất PDF gộp nhầm số
 * thứ tự với số đầu tiên của phân số ngay sau nó (VD "1." dính "8/10" thành "1.8 8/10").
 */
function PhanSoRutGonSection({ items, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px 20px", fontSize: 16 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ marginRight: 8, fontWeight: 700, color: accent }}>{i + 1}.</span>
          <span>
            {it.numerator}/{it.denominator} = {blankBox(accent)}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * ================== MỞ RỘNG LỚP 4, ĐỢT 2 ==================
 * "Biểu thức chữ" - hiển thị biểu thức + "khi a = X", 1 ô trống cho kết quả.
 */
function BieuThucChuSection({ items, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px 20px", fontSize: 16 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span>
            {i + 1}. {it.expression} (khi <strong>a = {it.aValue}</strong>) =
          </span>
          {blankBox(accent)}
        </div>
      ))}
    </div>
  );
}

/**
 * ================== MỞ RỘNG LỚP 4, ĐỢT 2 (SỬA PHIÊN 17 - phản hồi thực tế) ==================
 * "So sánh phân số" - hiển thị dạng chữ "tử/mẫu" (cùng cách "Rút gọn phân số" Đợt 1), 1 ô trống
 * để điền dấu >, <, =. Số thứ tự câu tách RIÊNG <span> - cùng lý do đã sửa ở PhanSoRutGonSection
 * bên trên (tránh dính số thứ tự vào phân số khi in/xuất PDF).
 */
function PhanSoSoSanhSection({ items, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px 20px", fontSize: 16 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ marginRight: 8, fontWeight: 700, color: accent }}>{i + 1}.</span>
          <span>
            {it.n1}/{it.d1} {blankBox(accent, 28)} {it.n2}/{it.d2}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * ================== MỞ RỘNG LỚP 5, ĐỢT 1 ==================
 * "So sánh số thập phân" - cùng bố cục lưới 2 cột như PhanSoSoSanhSection (nhất quán với các dạng
 * "so sánh, điền dấu" đã có), chỉ khác nội dung hiển thị (số thập phân dùng dấu phẩy kiểu Việt
 * Nam qua formatSoThapPhan, không phải phân số). Số chữ số thập phân giữ ĐÚNG như dữ liệu gốc
 * (leftDec.length/rightDec.length) - không ép cố định 2 chữ số, vì đây chính là trọng tâm bài học
 * (học sinh cần thấy "3,5" và "3,45" khác độ dài, không phải luôn 2 chữ số như nhau).
 */
function SoThapPhanSoSanhSection({ items, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px 20px", fontSize: 16 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {i + 1}. {formatSoThapPhan(Number(`${it.leftInt}.${it.leftDec}`), it.leftDec.length)}{" "}
          {blankBox(accent, 28)} {formatSoThapPhan(Number(`${it.rightInt}.${it.rightDec}`), it.rightDec.length)}
        </div>
      ))}
    </div>
  );
}

/**
 * ================== MỞ RỘNG LỚP 5, ĐỢT 2 ==================
 * "Cộng, trừ số thập phân" - cùng bố cục lưới 2 cột dạng "a op b = ___" như TinhNhamSection (các
 * dạng bài số tự nhiên), chỉ khác nội dung hiển thị dùng formatSoThapPhan với đúng số chữ số thập
 * phân gốc của TỪNG toán hạng (leftDec.length/rightDec.length) - giữ hiển thị "3,4 + 5,72" đúng
 * như đề bài gốc (KHÔNG ép cùng số chữ số thập phân trước khi hiển thị, vì SGK Toán 5 KNTT dạy
 * học sinh tự nhận ra cần thêm số 0 khi đặt tính, không phải đề bài đã làm sẵn việc đó).
 */
function SoThapPhanCongTruSection({ items, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px 20px", fontSize: 16 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div>
            {i + 1}. {formatSoThapPhan(Number(`${it.leftInt}.${it.leftDec}`), it.leftDec.length)} {it.operator}{" "}
            {formatSoThapPhan(Number(`${it.rightInt}.${it.rightDec}`), it.rightDec.length)}
          </div>
          <GridOLy accent={accent} />
        </div>
      ))}
    </div>
  );
}

/**
 * ================== MỞ RỘNG LỚP 5, ĐỢT 3 ==================
 * "Nhân số thập phân" + "Chia số thập phân cho số tự nhiên" - DÙNG CHUNG 1 component vì 2 dạng
 * bài có CÙNG HÌNH DẠNG dữ liệu (leftInt/leftDec/rightInt/rightDec/operator/answerInt/answerDec)
 * như "Cộng, trừ số thập phân" ở Đợt 2 - chỉ khác operator ("×"/"÷") và cách sinh số. Tránh viết
 * lặp lại y hệt SoThapPhanCongTruSection, đúng nguyên tắc tái dùng component đã áp dụng xuyên
 * suốt dự án (VD TinhNhamSection dùng chung cho nhiều dạng bài số tự nhiên).
 */
function SoThapPhanNhanChiaSection({ items, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px 20px", fontSize: 16 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div>
            {i + 1}. {formatSoThapPhan(Number(`${it.leftInt}.${it.leftDec || "0"}`), it.leftDec.length)} {it.operator}{" "}
            {formatSoThapPhan(Number(`${it.rightInt}.${it.rightDec || "0"}`), it.rightDec.length)}
          </div>
          <GridOLy accent={accent} />
        </div>
      ))}
    </div>
  );
}

/**
 * ================== MỞ RỘNG LỚP 5, ĐỢT 4 ==================
 * Component DÙNG CHUNG cho các dạng bài "giải toán có lời + 1 ô trống điền đáp số" (tỉ số phần
 * trăm, tam giác/hình thang, hình tròn, thể tích, diện tích xq/tp, vận tốc-quãng đường-thời gian)
 * - cùng bố cục "mô tả đề bài -> Bài giải: ___ đơn vị" như ChuViDienTichSection (Lớp 3), chỉ khác
 * mỗi dạng tự build câu văn riêng qua hàm `describe(it)` truyền vào (tránh viết lặp lại 6 component
 * gần như y hệt nhau, đúng nguyên tắc tái dùng đã áp dụng cho SoThapPhanNhanChiaSection ở Đợt 3).
 */
function WordProblemBlankSection({ items, accent, describe }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 15 }}>
      {items.map((it, i) => {
        const { text, unit } = describe(it);
        return (
          <div key={i}>
            <div>
              {i + 1}. {text}
            </div>
            <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
              Bài giải: {blankBox(accent)} {unit}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** "Tỉ số phần trăm" - 3 dạng con (xem generateTiSoPhanTram(), worksheetSchemas.js). */
function TiSoPhanTramSection({ items, accent }) {
  return (
    <WordProblemBlankSection
      items={items}
      accent={accent}
      describe={(it) => {
        if (it.subKind === "ti_so") {
          return { text: `Tìm tỉ số phần trăm của ${formatSoTuNhien(it.a)} và ${formatSoTuNhien(it.b)}.`, unit: "%" };
        }
        if (it.subKind === "gia_tri") {
          return { text: `Tìm ${it.percent}% của ${formatSoTuNhien(it.n)}.`, unit: "" };
        }
        return { text: `Tìm một số biết ${it.percent}% của số đó là ${formatSoTuNhien(it.value)}.`, unit: "" };
      }}
    />
  );
}

/** "Diện tích hình tam giác, hình thang" - 3 dạng con (xem generateHinhTamGiacHinhThang()). */
function HinhTamGiacHinhThangSection({ items, accent }) {
  return (
    <WordProblemBlankSection
      items={items}
      accent={accent}
      describe={(it) => {
        if (it.subKind === "tam_giac_dien_tich") {
          return {
            text: `Hình tam giác có đáy ${it.a} cm và chiều cao ${it.h} cm. Tính diện tích hình tam giác đó.`,
            unit: "cm²",
          };
        }
        if (it.subKind === "hinh_thang_dien_tich") {
          return {
            text: `Hình thang có đáy lớn ${it.a} cm, đáy bé ${it.b} cm và chiều cao ${it.h} cm. Tính diện tích hình thang đó.`,
            unit: "cm²",
          };
        }
        return {
          text: `Hình tam giác có 3 cạnh lần lượt là ${it.s1} cm, ${it.s2} cm và ${it.s3} cm. Tính chu vi hình tam giác đó.`,
          unit: "cm",
        };
      }}
    />
  );
}

/** "Chu vi, diện tích hình tròn" - dùng π ≈ 3,14 (xem generateHinhTron()). */
function HinhTronSection({ items, accent }) {
  return (
    <WordProblemBlankSection
      items={items}
      accent={accent}
      describe={(it) => {
        const givenText = it.given === "ban_kinh" ? `bán kính ${it.value} cm` : `đường kính ${it.value} cm`;
        const ask = it.metric === "chu_vi" ? "Tính chu vi hình tròn đó." : "Tính diện tích hình tròn đó.";
        return {
          text: `Hình tròn có ${givenText}. ${ask}`,
          unit: it.metric === "chu_vi" ? "cm" : "cm²",
        };
      }}
    />
  );
}

/** "Thể tích hình hộp chữ nhật, hình lập phương" (xem generateTheTichHopLapPhuong()). */
function TheTichHhcnLpSection({ items, accent }) {
  return (
    <WordProblemBlankSection
      items={items}
      accent={accent}
      describe={(it) => {
        if (it.subKind === "hhcn") {
          return {
            text: `Hình hộp chữ nhật có chiều dài ${it.a} cm, chiều rộng ${it.b} cm và chiều cao ${it.c} cm. Tính thể tích hình đó.`,
            unit: "cm³",
          };
        }
        return { text: `Hình lập phương có cạnh ${it.a} cm. Tính thể tích hình đó.`, unit: "cm³" };
      }}
    />
  );
}

/** "Diện tích xung quanh, diện tích toàn phần" (xem generateDienTichXqTp()). */
function DienTichXqTpSection({ items, accent }) {
  return (
    <WordProblemBlankSection
      items={items}
      accent={accent}
      describe={(it) => {
        const metricText = it.metric === "xq" ? "diện tích xung quanh" : "diện tích toàn phần";
        if (it.shape === "hhcn") {
          return {
            text: `Hình hộp chữ nhật có chiều dài ${it.a} cm, chiều rộng ${it.b} cm và chiều cao ${it.c} cm. Tính ${metricText} hình đó.`,
            unit: "cm²",
          };
        }
        // CHỈ 2 hình HHCN/lập phương (xem generateDienTichXqTp() - QUY TẮC SƯ PHẠM: cấm hình trụ).
        return { text: `Hình lập phương có cạnh ${it.a} cm. Tính ${metricText} hình đó.`, unit: "cm²" };
      }}
    />
  );
}

/** "Vận tốc, quãng đường, thời gian" (xem generateVanTocQuangDuongThoiGian()). */
function VanTocQuangDuongThoiGianSection({ items, accent }) {
  return (
    <WordProblemBlankSection
      items={items}
      accent={accent}
      describe={(it) => {
        if (it.ask === "v") {
          return {
            text: `Một xe đi được quãng đường ${it.s} km trong ${it.t} giờ. Tính vận tốc của xe đó.`,
            unit: "km/giờ",
          };
        }
        if (it.ask === "s") {
          return {
            text: `Một xe đi với vận tốc ${it.v} km/giờ trong ${it.t} giờ. Tính quãng đường xe đó đi được.`,
            unit: "km",
          };
        }
        return {
          text: `Một xe đi với vận tốc ${it.v} km/giờ, đi được quãng đường ${it.s} km. Hỏi xe đó đi hết bao nhiêu thời gian?`,
          unit: "giờ",
        };
      }}
    />
  );
}

/**
 * "Đổi đơn vị đo thể tích" - hiển thị dạng "value fromUnit = ___ toUnit" giống hệt DoiDonViSection
 * (Lớp 3) nhưng generator RIÊNG cho đơn vị thể tích (xem generateDoiDonViTheTich()) - tái dùng
 * THẲNG component DoiDonViSection đã có sẵn (không viết lại) vì đúng CÙNG hình dạng dữ liệu
 * (value/fromUnit/toUnit).
 */

/**
 * "Cộng, trừ số đo thời gian" - 2 ô trống (giờ VÀ phút) khác các dạng "1 phép tính = 1 ô trống" đã
 * có, nên cần component riêng. formatTimeHM() ẩn "0 giờ"/"0 phút" khi giá trị đó bằng 0 cho tự
 * nhiên (VD "45 phút" thay vì "0 giờ 45 phút").
 */
function formatTimeHM(h, m) {
  if (h > 0 && m > 0) return `${h} giờ ${m} phút`;
  if (h > 0) return `${h} giờ`;
  return `${m} phút`;
}
function SoDoThoiGianSection({ items, accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 15 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {i + 1}. {formatTimeHM(it.leftH, it.leftM)} {it.operator} {formatTimeHM(it.rightH, it.rightM)} ={" "}
          {blankBox(accent, 44)} giờ {blankBox(accent, 44)} phút
        </div>
      ))}
    </div>
  );
}

/**
 * "Phép chia có dư" - xem generatePhepChiaCoDu(). Đề bài "Đặt tính rồi tính" nên hiển thị khung ô
 * ly (GridOLy) để học sinh tự đặt phép chia dài hàng dọc, thay vì 1 dòng ngang "= ô trống (dư ô
 * trống)" quá chật (KHÔNG đủ chỗ đặt tính - đã sửa lỗi thực tế phản hồi ở Trạm 6).
 */
function PhepChiaCoDuSection({ items, accent }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px 20px", fontSize: 16 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div>
            {i + 1}. {formatSoTuNhien(it.dividend)} : {it.divisor}
          </div>
          <GridOLy accent={accent} />
        </div>
      ))}
    </div>
  );
}

/**
 * ================== MỞ RỘNG LỚP 4, ĐỢT 2 ==================
 * "Góc và đơn vị đo góc" - vẽ 2 tia chung gốc bằng SVG theo đúng số đo góc (degrees), học sinh
 * tự nhìn hình rồi gọi tên loại góc (không hiện số đo bằng chữ để tránh học sinh chỉ dựa vào số
 * mà không cần quan sát hình - đúng tinh thần "nhận biết trực quan" của SGK Toán 4 KNTT).
 */
function AngleFigure({ degrees, size = 100 }) {
  const cx = 15;
  const cy = 85;
  const toRad = (deg) => (deg * Math.PI) / 180;
  // Tia thứ nhất luôn nằm ngang (0°), tia thứ hai lệch lên trên đúng "degrees" độ.
  const rayLen = 68;
  const p1 = { x: cx + rayLen, y: cy };
  const p2 = {
    x: cx + rayLen * Math.cos(toRad(degrees)),
    y: cy - rayLen * Math.sin(toRad(degrees)),
  };
  // Vẽ cung nhỏ đánh dấu góc giữa 2 tia.
  const arcR = 20;
  const arcStart = { x: cx + arcR, y: cy };
  const arcEnd = {
    x: cx + arcR * Math.cos(toRad(degrees)),
    y: cy - arcR * Math.sin(toRad(degrees)),
  };
  const largeArc = degrees > 180 ? 1 : 0;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <line x1={cx} y1={cy} x2={p1.x} y2={p1.y} stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={p2.x} y2={p2.y} stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <path
        d={`M ${arcStart.x} ${arcStart.y} A ${arcR} ${arcR} 0 ${largeArc} 0 ${arcEnd.x} ${arcEnd.y}`}
        fill="none"
        stroke="#f97316"
        strokeWidth="2"
      />
      <circle cx={cx} cy={cy} r="2.5" fill="#334155" />
    </svg>
  );
}

function GocNhanBietSection({ items, accent }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <AngleFigure degrees={it.degrees} />
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            {i + 1}. Góc {blankBox(accent, 60)}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ================== MỞ RỘNG LỚP 3, ĐỢT 2 ==================
 * "Tiền Việt Nam" - liệt kê các tờ tiền + số lượng bằng chữ (dễ đọc hơn hiện hình ảnh tờ tiền
 * thật - tránh vấn đề bản quyền hình ảnh tiền tệ), học sinh tính tổng.
 */
function TienVietNamSection({ items, accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 15 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div>
            {i + 1}. Em có {it.bills.map((b) => `${b.quantity} tờ ${formatSoTuNhien(b.denomination)} đồng`).join(" và ")}.
            Hỏi em có tất cả bao nhiêu tiền?
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            Trả lời: {blankBox(accent)} đồng
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ================== MỞ RỘNG LỚP 3, ĐỢT 2 ==================
 * "Khả năng xảy ra của một sự kiện" - 3 nhãn (Chắc chắn/Có thể/Không thể) hiển thị dạng khung bo
 * tròn để học sinh khoanh tay vào đáp án đúng khi in ra giấy - LUÔN hiện cả 3 lựa chọn TRẮNG
 * (không tô sẵn đáp án đúng), giống mọi section khác trong file này (bản xem trước web LUÔN là
 * bản học sinh, đáp án bản giáo viên chỉ có ở export Word - xem worksheetExportService.js).
 */
function KhaNangXayRaSection({ items, accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 15 }}>
      {items.map((it, i) => (
        <div key={i}>
          <div>
            {i + 1}. {it.text}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
            {Object.values(PROBABILITY_LEVEL_LABELS).map((label) => (
              <span
                key={label}
                style={{
                  border: `1.5px solid ${accent}`,
                  borderRadius: 999,
                  padding: "3px 12px",
                  background: "#fff",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ================== MỞ RỘNG LỚP 3, ĐỢT 3 ==================
 * "Thu thập, phân loại số liệu" - biểu đồ cột NGANG đơn giản (mỗi hàng: nhãn + thanh màu dài
 * theo tỉ lệ giá trị/giá trị lớn nhất + số liệu) rồi danh sách câu hỏi rút ra từ CÙNG 1 bảng đó.
 * Dùng thanh ngang (không phải cột dọc) vì dễ canh chỉnh chiều rộng bằng % trong flexbox hơn
 * chiều cao, và vẫn đọc trực quan không kém biểu đồ cột dọc thường thấy trong SGK.
 */
function ThuThapSoLieuSection({ surveyTitle, data, questions, accent }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 15 }}>
      <div style={{ fontWeight: 600 }}>{surveyTitle}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 90, flexShrink: 0, textAlign: "right" }}>{d.label}</div>
            <div
              style={{
                background: accent,
                opacity: 0.75,
                height: 20,
                borderRadius: 4,
                width: `${(d.value / maxValue) * 70}%`,
                minWidth: 20,
              }}
            />
            <div style={{ fontWeight: 600 }}>{d.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {questions.map((q, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span>
              {i + 1}. {q.text}
            </span>
            {blankBox(accent)}
          </div>
        ))}
      </div>
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
      {section.type === "tach_gop" && <TachGopSection items={section.items} accent={t.border} />}
      {section.type === "dem_va_viet_so" && <DemVaVietSoSection items={section.items} accent={t.border} />}
      {section.type === "so_sanh" && <SoSanhSection items={section.items} accent={t.border} />}
      {section.type === "day_so" && <DaySoSection items={section.items} accent={t.border} />}
      {section.type === "sap_xep_thu_tu" && <SapXepThuTuSection items={section.items} accent={t.border} />}
      {section.type === "noi_phep_tinh" && <NoiPhepTinhSection data={section.data} accent={t.border} />}
      {section.type === "do_dai_so_sanh" && <DoDaiSoSanhSection items={section.items} accent={t.border} />}
      {section.type === "do_dai_sap_xep" && <SapXepThuTuSection items={section.items} accent={t.border} />}
      {section.type === "xem_dong_ho_gio_dung" && <XemDongHoGioDungSection items={section.items} accent={t.border} />}
      {section.type === "xem_dong_ho_gio_phut" && <XemDongHoGioPhutSection items={section.items} accent={t.border} />}
      {section.type === "chu_vi_dien_tich" && <ChuViDienTichSection items={section.items} accent={t.border} />}
      {section.type === "doi_don_vi_do" && <DoiDonViSection items={section.items} accent={t.border} />}
      {section.type === "phan_so_rut_gon" && <PhanSoRutGonSection items={section.items} accent={t.border} />}
      {section.type === "bieu_thuc_chu" && <BieuThucChuSection items={section.items} accent={t.border} />}
      {section.type === "phan_so_so_sanh" && <PhanSoSoSanhSection items={section.items} accent={t.border} />}
      {section.type === "so_thap_phan_so_sanh" && <SoThapPhanSoSanhSection items={section.items} accent={t.border} />}
      {section.type === "so_thap_phan_cong_tru" && <SoThapPhanCongTruSection items={section.items} accent={t.border} />}
      {(section.type === "so_thap_phan_nhan" ||
        section.type === "so_thap_phan_chia" ||
        section.type === "so_thap_phan_chia_nang_cao") && (
        <SoThapPhanNhanChiaSection items={section.items} accent={t.border} />
      )}
      {section.type === "ti_so_phan_tram" && <TiSoPhanTramSection items={section.items} accent={t.border} />}
      {section.type === "hinh_tam_giac_hinh_thang" && (
        <HinhTamGiacHinhThangSection items={section.items} accent={t.border} />
      )}
      {section.type === "hinh_tron" && <HinhTronSection items={section.items} accent={t.border} />}
      {section.type === "the_tich_hhcn_lp" && <TheTichHhcnLpSection items={section.items} accent={t.border} />}
      {section.type === "doi_don_vi_the_tich" && <DoiDonViSection items={section.items} accent={t.border} />}
      {section.type === "dien_tich_xq_tp" && <DienTichXqTpSection items={section.items} accent={t.border} />}
      {section.type === "so_do_thoi_gian" && <SoDoThoiGianSection items={section.items} accent={t.border} />}
      {section.type === "van_toc_quang_duong_thoi_gian" && (
        <VanTocQuangDuongThoiGianSection items={section.items} accent={t.border} />
      )}
      {section.type === "phep_chia_co_du" && <PhepChiaCoDuSection items={section.items} accent={t.border} />}
      {section.type === "goc_nhan_biet" && <GocNhanBietSection items={section.items} accent={t.border} />}
      {section.type === "tien_viet_nam" && <TienVietNamSection items={section.items} accent={t.border} />}
      {section.type === "kha_nang_xay_ra" && <KhaNangXayRaSection items={section.items} accent={t.border} />}
      {section.type === "thu_thap_so_lieu" && (
        <ThuThapSoLieuSection surveyTitle={section.surveyTitle} data={section.data} questions={section.questions} accent={t.border} />
      )}
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
