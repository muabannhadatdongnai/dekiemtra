"use client";

import React, { useState } from "react";
import {
  LESSON_PLAN_COLUMN_MODES,
  computeMultiPeriodTimeline,
  normalizeActivitiesTiet,
  computeActivityStartTiets,
} from "@/data/lessonPlanTemplates";
import { getSubjectLabel } from "@/data/config";

const cellStyle = { border: "1px solid #94a3b8", padding: "6px 10px", verticalAlign: "top", fontSize: 13 };
const headCellStyle = { ...cellStyle, background: "#f1f5f9", fontWeight: 700, textAlign: "center" };

function ListBlock({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: 8 }}>
      <p style={{ fontWeight: 700, margin: "4px 0 2px" }}>{title}</p>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {items.map((it, i) => (
          <li key={i} style={{ fontSize: 13.5 }}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

// Ranh giới giữa 2 tiết học - chèn ngay TRƯỚC bước đầu tiên có "tiet" lớn hơn bước liền trước
// (trong CÙNG 1 hoạt động) - giáo viên phản ánh trước đây giáo án nhiều tiết bị gộp thành 1 mạch,
// không biết điểm dừng của tiết 1 ở đâu để chèn giải lao.
function PeriodBoundary({ tiet }) {
  return (
    <div
      style={{
        margin: "10px 0",
        padding: "5px 10px",
        textAlign: "center",
        fontWeight: 700,
        fontSize: 12.5,
        color: "#9A3412",
        background: "#FFF7ED",
        border: "1px dashed #FDBA74",
        borderRadius: 6,
      }}
    >
      ── Hết Tiết {tiet - 1} (nghỉ giải lao) — Chuyển sang Tiết {tiet} ──
    </div>
  );
}

function ActivityBlock({ activity, columnMode, minutes, startTiet }) {
  const steps = activity.tienTrinh || [];
  // startTiet: "tiết đang diễn ra" ngay trước khi hoạt động này bắt đầu (xem
  // computeActivityStartTiets() - lessonPlanTemplates.js) - dùng làm mốc so sánh ban đầu thay vì
  // null, để phát hiện được cả ranh giới tiết xảy ra NGAY Ở BƯỚC ĐẦU TIÊN của hoạt động (trước
  // đây mỗi hoạt động tự đếm lại từ đầu nên bị bỏ sót trường hợp này).
  let lastTiet = startTiet || null;

  return (
    <div style={{ marginBottom: 14, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, fontSize: 14.5, margin: "8px 0 2px" }}>
        {activity.ten}
        {minutes ? <span style={{ fontWeight: 400, color: "#64748b" }}> &nbsp;(~{minutes} phút)</span> : null}
      </p>
      {activity.mucTieu && <p style={{ fontStyle: "italic", fontSize: 13, margin: "0 0 6px" }}>Mục tiêu: {activity.mucTieu}</p>}

      {columnMode === LESSON_PLAN_COLUMN_MODES.TWO_COLUMN ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...headCellStyle, width: "60%" }}>Hoạt động của giáo viên và học sinh</th>
              <th style={{ ...headCellStyle, width: "40%" }}>Sản phẩm dự kiến</th>
            </tr>
          </thead>
          <tbody>
            {steps.map((s, i) => {
              const showBoundary = s.tiet && lastTiet && s.tiet > lastTiet;
              lastTiet = s.tiet || lastTiet;
              return (
                <React.Fragment key={i}>
                  {showBoundary && (
                    <tr key={`b-${i}`}>
                      <td colSpan={2} style={{ padding: 0, border: "none" }}>
                        <PeriodBoundary tiet={s.tiet} />
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ ...cellStyle, whiteSpace: "pre-line" }}>
                      <b>Bước {i + 1}:</b> {s.hoatDongGVHS}
                    </td>
                    <td style={{ ...cellStyle, whiteSpace: "pre-line" }}>{s.sanPhamDuKien}</td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div>
          {steps.map((s, i) => {
            const showBoundary = s.tiet && lastTiet && s.tiet > lastTiet;
            lastTiet = s.tiet || lastTiet;
            return (
              <div key={i}>
                {showBoundary && <PeriodBoundary tiet={s.tiet} />}
                <p style={{ fontSize: 13.5, margin: "0 0 6px", whiteSpace: "pre-line" }}>
                  <b>Bước {i + 1}:</b> {s.hoatDongGVHS}
                  {s.sanPhamDuKien ? (
                    <span style={{ color: "#475569" }}> — Sản phẩm dự kiến: {s.sanPhamDuKien}</span>
                  ) : null}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PhieuHocTapBlock({ phieu }) {
  if (!phieu?.tieuDe && !(phieu?.baiTap || []).length) return null;
  return (
    <div style={{ marginTop: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, textAlign: "center", fontSize: 14, margin: "10px 0 2px" }}>
        PHỤ LỤC: {phieu.tieuDe || "Phiếu học tập"}
      </p>
      {phieu.huongDan && (
        <p style={{ fontStyle: "italic", fontSize: 13, textAlign: "center", margin: "0 0 8px" }}>{phieu.huongDan}</p>
      )}
      <ol style={{ margin: 0, paddingLeft: 20 }}>
        {(phieu.baiTap || []).map((b, i) => (
          <li key={i} style={{ fontSize: 13.5, marginBottom: 12, whiteSpace: "pre-line" }}>
            {b}
            <div style={{ borderBottom: "1px dashed #94a3b8", height: 22, marginTop: 4 }} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function MindmapBlock({ mindmap }) {
  if (!mindmap?.chuDe) return null;
  return (
    <div style={{ marginTop: 12, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, margin: "8px 0 4px" }}>Sơ đồ tư duy: {mindmap.chuDe}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {(mindmap.nhanh || []).map((n, i) => (
          <div
            key={i}
            style={{
              border: "1.5px solid #7DBEE8",
              borderRadius: 10,
              background: "#EFF7FD",
              padding: "8px 10px",
              minWidth: 150,
            }}
          >
            <p style={{ fontWeight: 700, color: "#0C447C", margin: "0 0 4px", fontSize: 13 }}>{n.nhan}</p>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {(n.y || []).map((y, j) => (
                <li key={j} style={{ fontSize: 12.5 }}>{y}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function CungCoBlock({ questions }) {
  if (!questions || questions.length === 0) return null;
  return (
    <div style={{ marginTop: 10, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, margin: "8px 0 4px" }}>Củng cố - Bộ câu hỏi nhanh</p>
      <ol style={{ margin: 0, paddingLeft: 20 }}>
        {questions.map((q, i) => (
          <li key={i} style={{ fontSize: 13.5, marginBottom: 3 }}>
            {q.cauHoi} <span style={{ color: "#16794f", fontWeight: 600 }}>(Đáp án: {q.dapAn})</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Phụ lục "Tin nhắn gửi phụ huynh" - giáo viên cần COPY-PASTE ngay vào Zalo, nên có nút "Sao chép"
// riêng (dùng Clipboard API, có fallback execCommand cho trình duyệt/webview cũ). Nút này bọc
// trong className="no-print" để không xuất hiện khi in/xuất PDF (đúng quy ước đã dùng cho các nút
// hành động khác trong LessonPlanExportActions.jsx).
function TinNhanPhuHuynhBlock({ text }) {
  const [copied, setCopied] = useState(false);
  if (!text) return null;

  async function handleCopy() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Im lặng bỏ qua - giáo viên vẫn có thể tự bôi đen + Ctrl+C nếu trình duyệt chặn clipboard.
    }
  }

  return (
    <div style={{ marginTop: 16, breakInside: "avoid" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <p style={{ fontWeight: 700, margin: "8px 0 4px" }}>PHỤ LỤC: Tin nhắn gửi phụ huynh (Zalo)</p>
        <button
          type="button"
          onClick={handleCopy}
          className="no-print"
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 6,
            border: "1px solid #cbd5e1",
            background: copied ? "#dcfce7" : "#f8fafc",
            color: copied ? "#15803d" : "#334155",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? "✓ Đã sao chép" : "Sao chép"}
        </button>
      </div>
      <div
        style={{
          fontSize: 13.5,
          whiteSpace: "pre-line",
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          borderRadius: 8,
          padding: "10px 12px",
        }}
      >
        {text}
      </div>
    </div>
  );
}

// Phụ lục "Checklist đánh giá Năng lực - Phẩm chất" - bảng 4 cột (Tiêu chí | Tốt | Đạt | Cần cố
// gắng), mỗi hàng ứng với 1 tiêu chí đã liệt kê ở mục I.2/I.3 (yeuCauCanDat.nangLuc/phamChat).
// Đây là bảng RUBRIC để giáo viên tự đối chiếu khi quan sát học sinh trong tiết học (không phải
// danh sách theo tên học sinh cụ thể - hệ thống không có sẵn danh sách lớp để điền tự động).
function ChecklistNLPCBlock({ items }) {
  if (!items || items.length === 0) return null;
  const loaiLabel = { nang_luc: "Năng lực", pham_chat: "Phẩm chất" };
  return (
    <div style={{ marginTop: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, textAlign: "center", fontSize: 14, margin: "10px 0 2px" }}>
        PHỤ LỤC: Checklist đánh giá Năng lực - Phẩm chất
      </p>
      <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", margin: "0 0 8px" }}>
        (Theo tinh thần Thông tư 27/2020/TT-BGDĐT - giáo viên quan sát và đánh dấu trực tiếp trong tiết học)
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...headCellStyle, width: "28%" }}>Tiêu chí</th>
            <th style={{ ...headCellStyle, width: "24%" }}>Tốt</th>
            <th style={{ ...headCellStyle, width: "24%" }}>Đạt</th>
            <th style={{ ...headCellStyle, width: "24%" }}>Cần cố gắng</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td style={cellStyle}>
                {it.loai && loaiLabel[it.loai] ? (
                  <span style={{ display: "block", fontSize: 11, color: "#94a3b8" }}>{loaiLabel[it.loai]}</span>
                ) : null}
                <span style={{ fontWeight: 600 }}>{it.tieuChi}</span>
              </td>
              <td style={cellStyle}>{it.tot}</td>
              <td style={cellStyle}>{it.dat}</td>
              <td style={cellStyle}>{it.canCoGang}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Phụ lục "Bài tập phân hoá theo 3 mức độ" (Hỗ trợ / Đạt chuẩn / Nâng cao) - 3 cột đặt cạnh nhau
// để giáo viên nhìn thấy ngay sự khác biệt độ khó giữa 3 nhóm học sinh trong cùng 1 lớp, dùng
// để phát bài phù hợp cho từng nhóm ở tiết Luyện tập/Vận dụng hoặc làm bài tập về nhà phân hoá.
function BaiTapPhanHoaBlock({ data }) {
  const groups = [
    { key: "hoTro", label: "Mức 1 — Hỗ trợ", color: "#0369A1", bg: "#EFF6FF", border: "#93C5FD" },
    { key: "datChuan", label: "Mức 2 — Đạt chuẩn", color: "#15803D", bg: "#F0FDF4", border: "#86EFAC" },
    { key: "nangCao", label: "Mức 3 — Nâng cao", color: "#B45309", bg: "#FFFBEB", border: "#FCD34D" },
  ];
  const hasAny = groups.some((g) => (data?.[g.key] || []).length > 0);
  if (!hasAny) return null;
  return (
    <div style={{ marginTop: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, textAlign: "center", fontSize: 14, margin: "10px 0 8px" }}>
        PHỤ LỤC: Bài tập phân hoá theo 3 mức độ
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {groups.map((g) => {
          const items = data?.[g.key] || [];
          if (items.length === 0) return null;
          return (
            <div
              key={g.key}
              style={{
                flex: "1 1 220px",
                minWidth: 200,
                border: `1.5px solid ${g.border}`,
                background: g.bg,
                borderRadius: 8,
                padding: "8px 10px",
              }}
            >
              <p style={{ fontWeight: 700, color: g.color, fontSize: 13, margin: "0 0 6px" }}>{g.label}</p>
              <ol style={{ margin: 0, paddingLeft: 18 }}>
                {items.map((it, i) => (
                  <li key={i} style={{ fontSize: 12.5, marginBottom: 6, whiteSpace: "pre-line" }}>
                    {it}
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Phụ lục "Lời dẫn (Teacher Script)" - GIAI ĐOẠN 10, Việc 6/7. Bản xem trước web LUÔN hiển thị
// phụ lục này khi tích hợp bật (giống các phụ lục khác) - "cờ ẩn-hiện" chỉ áp dụng khi XUẤT WORD
// (xem includeTeacherScript trong LessonPlanExportActions.jsx/lessonPlanExportService.js), vì
// bản xem trước web không phải bản nộp Ban Giám hiệu nên không có rủi ro "sai form CV2345".
function LoiDanBlock({ items }) {
  const rows = (items || []).filter((it) => it?.loiDan);
  if (rows.length === 0) return null;
  return (
    <div style={{ marginTop: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, textAlign: "center", fontSize: 14, margin: "10px 0 2px" }}>
        PHỤ LỤC: Lời dẫn (Teacher Script)
      </p>
      <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", margin: "0 0 8px" }}>
        Câu dẫn dắt/chuyển ý mẫu cho từng hoạt động - phần THAM KHẢO, không thuộc khung mẫu CV2345
        chuẩn (mặc định KHÔNG kèm khi xuất Word, giáo viên tự bật ở nút "Tải Word" nếu muốn).
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((it, i) => (
          <div
            key={i}
            style={{
              background: "#FEFCE8",
              border: "1px solid #FDE68A",
              borderRadius: 8,
              padding: "8px 10px",
            }}
          >
            {it.hoatDong && (
              <p style={{ fontWeight: 700, fontSize: 12.5, margin: "0 0 2px", color: "#854D0E" }}>
                {it.hoatDong}
              </p>
            )}
            <p style={{ fontSize: 13.5, fontStyle: "italic", margin: 0 }}>&ldquo;{it.loiDan}&rdquo;</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Phụ lục "Dàn ý Slide" (Slide Outline) - GIAI ĐOẠN 10, Việc 7/7. Mỗi slide 1 thẻ đánh số, tiêu
// đề in đậm + danh sách gạch đầu dòng nội dung gợi ý - trình bày như 1 "storyboard" đơn giản để
// giáo viên nhìn lướt là hình dung được cấu trúc bộ slide trước khi tự dựng PowerPoint/Canva.
function SlideOutlineBlock({ slides }) {
  const rows = (slides || []).filter((s) => s?.tieuDe || (s?.noiDung || []).length);
  if (rows.length === 0) return null;
  return (
    <div style={{ marginTop: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, textAlign: "center", fontSize: 14, margin: "10px 0 2px" }}>
        PHỤ LỤC: Dàn ý Slide
      </p>
      <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", margin: "0 0 8px" }}>
        Dàn ý văn bản tham khảo để dựng PowerPoint/Canva - không phải file trình chiếu thật.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {rows.map((s, i) => (
          <div
            key={i}
            style={{
              flex: "1 1 220px",
              minWidth: 200,
              border: "1px solid #C7D2FE",
              background: "#EEF2FF",
              borderRadius: 8,
              padding: "8px 10px",
            }}
          >
            <p style={{ fontWeight: 700, fontSize: 12.5, margin: "0 0 4px", color: "#3730A3" }}>
              Slide {i + 1}: {s.tieuDe}
            </p>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {(s.noiDung || []).map((line, j) => (
                <li key={j} style={{ fontSize: 12, marginBottom: 2 }}>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LessonPlanPreview({ lessonPlan, timeline, meta }) {
  if (!lessonPlan) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400">
        Chưa có dữ liệu. Vui lòng điền thông tin bên trái.
      </div>
    );
  }

  const columnMode = meta?.columnMode || LESSON_PLAN_COLUMN_MODES.ONE_COLUMN;
  const minutesByKey = Object.fromEntries((timeline || []).map((t) => [t.key, t.minutes]));
  const activityKeyByIndex = ["khoi_dong", "kham_pha", "luyen_tap", "van_dung"];
  // Sửa lỗi "rối loạn dòng thời gian" (ranh giới "Hết Tiết..." bị chèn sai chỗ/chèn lặp khi bài
  // dạy nhiều tiết) - xem giải thích đầy đủ tại normalizeActivitiesTiet()/computeActivityStartTiets()
  // trong lessonPlanTemplates.js. Cả 2 hàm PHẢI dùng chung 1 mảng đã chuẩn hoá.
  const normalizedHoatDong = normalizeActivitiesTiet(lessonPlan.hoatDong);
  const activityStartTiets = computeActivityStartTiets(normalizedHoatDong);

  return (
    <div id="print-area">
      <div className="a4-page">
        <h1 style={{ textAlign: "center", fontWeight: 700, fontSize: 16, textTransform: "uppercase" }}>
          {lessonPlan.tenBai || meta?.tenBai}
        </h1>
        <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginBottom: 12 }}>
          {meta?.subject ? `Môn: ${getSubjectLabel(meta.subject)} — ` : ""}
          {meta?.grade === "MAM_NON" ? "Mầm non" : `Lớp ${meta?.grade}`} — Số tiết: {meta?.soTiet || 1}
          {meta?.circularLabel ? ` — Theo ${meta.circularLabel}` : ""}
        </p>

        <p style={{ fontWeight: 700, margin: "10px 0 2px" }}>I. YÊU CẦU CẦN ĐẠT</p>
        <ListBlock title="1. Kiến thức" items={lessonPlan.yeuCauCanDat?.kienThuc} />
        <ListBlock title="2. Năng lực" items={lessonPlan.yeuCauCanDat?.nangLuc} />
        <ListBlock title="3. Phẩm chất" items={lessonPlan.yeuCauCanDat?.phamChat} />

        <p style={{ fontWeight: 700, margin: "10px 0 2px" }}>II. ĐỒ DÙNG DẠY HỌC</p>
        <ListBlock title="Giáo viên" items={lessonPlan.doDungDayHoc?.giaoVien} />
        <ListBlock title="Học sinh" items={lessonPlan.doDungDayHoc?.hocSinh} />

        <p style={{ fontWeight: 700, margin: "10px 0 2px" }}>III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU</p>
        {meta?.soTiet > 1 && (
          <p style={{ fontSize: 12, color: "#9A3412", margin: "0 0 8px", fontStyle: "italic" }}>
            Gợi ý phân bổ theo tiết:{" "}
            {computeMultiPeriodTimeline(meta.soTiet, meta.grade, meta.lessonType)
              .map((p) => `Tiết ${p.period} (${p.totalMinutes}')`)
              .join(" — ")}
          </p>
        )}
        {normalizedHoatDong.map((a, i) => (
          <ActivityBlock
            key={i}
            activity={a}
            columnMode={columnMode}
            minutes={minutesByKey[activityKeyByIndex[i]]}
            startTiet={activityStartTiets[i]}
          />
        ))}

        {lessonPlan.tichHopNLS && (
          <p style={{ fontSize: 13.5, marginTop: 8 }}>
            <b>Tích hợp Năng lực số:</b> {lessonPlan.tichHopNLS}
          </p>
        )}
        {lessonPlan.tichHopGDQPAN && (
          <p style={{ fontSize: 13.5, marginTop: 8 }}>
            <b>Tích hợp GDQP&AN:</b> {lessonPlan.tichHopGDQPAN}
          </p>
        )}
        {lessonPlan.tichHopHSKT && (
          <p style={{ fontSize: 13.5, marginTop: 8 }}>
            <b>Điều chỉnh cho học sinh khuyết tật hoà nhập:</b> {lessonPlan.tichHopHSKT}
          </p>
        )}

        <CungCoBlock questions={lessonPlan.cungCoQuestions} />
        <MindmapBlock mindmap={lessonPlan.mindmap} />

        <p style={{ fontWeight: 700, margin: "14px 0 2px" }}>IV. ĐIỀU CHỈNH SAU BÀI DẠY</p>
        <p style={{ fontSize: 13, color: "#94a3b8" }}>(Giáo viên tự ghi chú sau khi dạy thực tế)</p>

        <PhieuHocTapBlock phieu={lessonPlan.phieuHocTap} />
        <BaiTapPhanHoaBlock data={lessonPlan.baiTapPhanHoa} />
        <ChecklistNLPCBlock items={lessonPlan.checklistNLPC} />
        <LoiDanBlock items={lessonPlan.loiDan} />
        <TinNhanPhuHuynhBlock text={lessonPlan.tinNhanPhuHuynh} />
        <SlideOutlineBlock slides={lessonPlan.slideOutline} />
      </div>
    </div>
  );
}
