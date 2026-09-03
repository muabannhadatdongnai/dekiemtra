"use client";

import React, { useState } from "react";
import {
  LESSON_PLAN_COLUMN_MODES,
  computeMultiPeriodTimeline,
  normalizeActivitiesTiet,
  computeActivityStartTiets,
} from "@/data/lessonPlanTemplates";
import { getSubjectLabel } from "@/data/config";
import { findForeignLanguageConfig } from "@/data/foreignLanguageSubjects";

const cellStyle = { border: "1px solid #94a3b8", padding: "6px 10px", verticalAlign: "top", fontSize: 13 };
const headCellStyle = { ...cellStyle, background: "#f1f5f9", fontWeight: 700, textAlign: "center" };

// ⚠️ Phiên 36: bản xem trước web (component này) trước đây LUÔN hiển thị nhãn/tiêu đề bằng TIẾNG
// VIỆT bất kể môn học - kể cả khi giáo án được sinh HOÀN TOÀN bằng tiếng Anh (môn nằm trong danh
// bạ foreignLanguageSubjects.js) - đây là nguồn "hạt sạn tiếng Việt" chính trên trình duyệt web mà
// giáo viên phản ánh (nội dung bài học đã đúng tiếng Anh, nhưng KHUNG/NHÃN xung quanh vẫn tiếng
// Việt, ví dụ "I. YÊU CẦU CẦN ĐẠT" thay vì "I. LEARNING OBJECTIVES"). Từ Phiên 36, mọi nhãn/tiêu đề
// TĨNH (không phải nội dung do AI sinh) được lấy từ LABELS_VI/LABELS_EN bên dưới, chọn theo
// `findForeignLanguageConfig(meta?.subject)`. Hiện chỉ có "en" - ngôn ngữ khác chưa có bản dịch sẽ
// tự rơi về LABELS_VI an toàn (xem pickLabels()).
const LABELS_VI = {
  noDataHint: "Chưa có dữ liệu. Vui lòng điền thông tin bên trái.",
  subjectPrefix: "Môn: ",
  preschool: "Mầm non",
  gradePrefix: "Lớp ",
  periodsPrefix: " — Số tiết: ",
  circularPrefix: " — Theo ",
  sectionI: "I. YÊU CẦU CẦN ĐẠT",
  knowledge: "1. Kiến thức",
  competencies: "2. Năng lực",
  qualities: "3. Phẩm chất",
  sectionII: "II. ĐỒ DÙNG DẠY HỌC",
  teacher: "Giáo viên",
  student: "Học sinh",
  sectionIII: "III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU",
  timeAllocationPrefix: "Gợi ý phân bổ theo tiết: ",
  periodLabel: "Tiết",
  minutesSuffix: " phút",
  objectivePrefix: "Mục tiêu: ",
  twoColHeaderActivity: "Hoạt động của giáo viên và học sinh",
  twoColHeaderOutcome: "Sản phẩm dự kiến",
  stepPrefix: "Bước",
  outcomePrefix: "Sản phẩm dự kiến: ",
  periodBoundary: (tiet) => `── Hết Tiết ${tiet - 1} (nghỉ giải lao) — Chuyển sang Tiết ${tiet} ──`,
  digitalIntegration: "Tích hợp Năng lực số:",
  gdqpanFallback: "Tích hợp GDQP&AN",
  hsktIntegration: "Điều chỉnh cho học sinh khuyết tật hoà nhập:",
  consolidationTitle: "Củng cố - Bộ câu hỏi nhanh",
  answerPrefix: "Đáp án: ",
  mindmapPrefix: "Sơ đồ tư duy: ",
  sectionIV: "IV. ĐIỀU CHỈNH SAU BÀI DẠY",
  sectionIVHint: "(Giáo viên tự ghi chú sau khi dạy thực tế)",
  phieuTitle: "Phiếu học tập",
  appendixPrefix: "PHỤ LỤC: ",
  stemTitle: "Hướng dẫn STEM",
  stemHint: "Học sinh hoàn thiện sản phẩm ở nhà - giáo viên có thể in/gửi phụ huynh mục này.",
  stemMaterials: "Vật liệu cần chuẩn bị",
  stemSteps: "Các bước thực hiện",
  stemCriteria: "Tiêu chí đánh giá",
  checklistTitle: "Checklist đánh giá Năng lực - Phẩm chất",
  checklistHint: "(Theo tinh thần Thông tư 27/2020/TT-BGDĐT - giáo viên quan sát và đánh dấu trực tiếp trong tiết học)",
  checklistCriteria: "Tiêu chí",
  checklistGood: "Tốt",
  checklistSatisfactory: "Đạt",
  checklistNeedsWork: "Cần cố gắng",
  loaiNangLuc: "Năng lực",
  loaiPhamChat: "Phẩm chất",
  phanHoaTitle: "Bài tập phân hoá theo 3 mức độ",
  phanHoaGroups: [
    { key: "hoTro", label: "Mức 1 — Hỗ trợ", color: "#0369A1", bg: "#EFF6FF", border: "#93C5FD" },
    { key: "datChuan", label: "Mức 2 — Đạt chuẩn", color: "#15803D", bg: "#F0FDF4", border: "#86EFAC" },
    { key: "nangCao", label: "Mức 3 — Nâng cao", color: "#B45309", bg: "#FFFBEB", border: "#FCD34D" },
  ],
  loiDanTitle: "Lời dẫn (Teacher Script)",
  loiDanHint:
    "Câu dẫn dắt/chuyển ý mẫu cho từng hoạt động - phần THAM KHẢO, không thuộc khung mẫu CV2345 chuẩn (mặc định KHÔNG kèm khi xuất Word, giáo viên tự bật ở nút \"Tải Word\" nếu muốn).",
  slideOutlineTitle: "Dàn ý Slide",
  slideOutlineHint: "Dàn ý văn bản tham khảo để dựng PowerPoint/Canva - không phải file trình chiếu thật.",
  slideLabel: "Slide",
  hocLieuTitle: "Gợi ý thiết kế Học liệu (Từ khoá tạo ảnh AI)",
  hocLieuHint: "Copy từ khoá bên dưới, dán vào Canva/ChatGPT/Gemini... để tự tạo Flashcard minh hoạ cho bài học.",
  copyButton: "Sao chép",
  copyButtonDone: "✓ Đã sao chép",
  tinNhanTitle: "PHỤ LỤC: Tin nhắn gửi phụ huynh (Zalo)",
};

const LABELS_EN = {
  ...LABELS_VI,
  subjectPrefix: "Subject: ",
  preschool: "Preschool",
  gradePrefix: "Grade ",
  periodsPrefix: " — Periods: ",
  circularPrefix: " — Per ",
  sectionI: "I. LEARNING OBJECTIVES",
  knowledge: "1. Knowledge",
  competencies: "2. Competencies",
  qualities: "3. Qualities",
  sectionII: "II. TEACHING AIDS",
  teacher: "Teacher",
  student: "Student",
  sectionIII: "III. LEARNING ACTIVITIES",
  timeAllocationPrefix: "Suggested time allocation by period: ",
  periodLabel: "Period",
  minutesSuffix: " min",
  objectivePrefix: "Objective: ",
  twoColHeaderActivity: "Teacher & Student Activities",
  twoColHeaderOutcome: "Expected Outcome",
  stepPrefix: "Step",
  outcomePrefix: "Expected outcome: ",
  periodBoundary: (tiet) => `── End of Period ${tiet - 1} (break) — Move to Period ${tiet} ──`,
  digitalIntegration: "Digital Competency Integration:",
  gdqpanFallback: "Integration",
  hsktIntegration: "Accommodations for Students with Disabilities:",
  consolidationTitle: "Consolidation - Quick Questions",
  answerPrefix: "Answer: ",
  mindmapPrefix: "Mind Map: ",
  sectionIV: "IV. POST-LESSON ADJUSTMENTS",
  sectionIVHint: "(Teacher's notes after the actual lesson)",
  phieuTitle: "Student Worksheet",
  appendixPrefix: "APPENDIX: ",
  stemTitle: "STEM Guide",
  stemHint: "Students complete the product at home - teachers may print/send this section to parents.",
  stemMaterials: "Materials Needed",
  stemSteps: "Steps",
  stemCriteria: "Assessment Criteria",
  checklistTitle: "Competency - Quality Assessment Checklist",
  checklistHint: "(Teachers observe and mark directly during the lesson.)",
  checklistCriteria: "Criteria",
  checklistGood: "Good",
  checklistSatisfactory: "Satisfactory",
  checklistNeedsWork: "Needs Improvement",
  loaiNangLuc: "Competency",
  loaiPhamChat: "Quality",
  phanHoaTitle: "Differentiated Exercises (3 Levels)",
  phanHoaGroups: [
    { key: "hoTro", label: "Level 1 — Support", color: "#0369A1", bg: "#EFF6FF", border: "#93C5FD" },
    { key: "datChuan", label: "Level 2 — On-level", color: "#15803D", bg: "#F0FDF4", border: "#86EFAC" },
    { key: "nangCao", label: "Level 3 — Advanced", color: "#B45309", bg: "#FFFBEB", border: "#FCD34D" },
  ],
  loiDanTitle: "Teacher Script",
  loiDanHint: "Suggested transition lines for each activity - REFERENCE ONLY (not included in the Word file unless the teacher enables it).",
  slideOutlineTitle: "Slide Outline",
  slideOutlineHint: "Text outline to help build PowerPoint/Canva slides - not an actual slide file.",
  slideLabel: "Slide",
  hocLieuTitle: "Suggested Visual Material Prompts",
  hocLieuHint: "Copy the prompts below into Canva/ChatGPT/Gemini... to generate flashcards for this lesson.",
  copyButton: "Copy",
  copyButtonDone: "✓ Copied",
  // ⚠️ "Tin nhắn gửi phụ huynh" LUÔN giữ tiêu đề + nội dung TIẾNG VIỆT dù giáo án còn lại bằng
  // tiếng Anh (xem exemptJsonFields ở buildForeignLanguageOutputDirective - foreignLanguageSubjects.js,
  // và docstring đầu englishLessonPlanExportService.js) - KHÔNG dịch tiêu đề này.
  tinNhanTitle: "PHỤ LỤC: Tin nhắn gửi phụ huynh (Zalo)",
};

function pickLabels(languageCode) {
  if (languageCode === "en") return LABELS_EN;
  return LABELS_VI;
}

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
function PeriodBoundary({ tiet, L }) {
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
      {L.periodBoundary(tiet)}
    </div>
  );
}

function ActivityBlock({ activity, columnMode, minutes, startTiet, L }) {
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
        {minutes ? <span style={{ fontWeight: 400, color: "#64748b" }}> &nbsp;(~{minutes}{L.minutesSuffix})</span> : null}
      </p>
      {activity.mucTieu && <p style={{ fontStyle: "italic", fontSize: 13, margin: "0 0 6px" }}>{L.objectivePrefix}{activity.mucTieu}</p>}

      {columnMode === LESSON_PLAN_COLUMN_MODES.TWO_COLUMN ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...headCellStyle, width: "60%" }}>{L.twoColHeaderActivity}</th>
              <th style={{ ...headCellStyle, width: "40%" }}>{L.twoColHeaderOutcome}</th>
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
                        <PeriodBoundary tiet={s.tiet} L={L} />
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ ...cellStyle, whiteSpace: "pre-line" }}>
                      <b>{L.stepPrefix} {i + 1}:</b> {s.hoatDongGVHS}
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
                {showBoundary && <PeriodBoundary tiet={s.tiet} L={L} />}
                <p style={{ fontSize: 13.5, margin: "0 0 6px", whiteSpace: "pre-line" }}>
                  <b>{L.stepPrefix} {i + 1}:</b> {s.hoatDongGVHS}
                  {s.sanPhamDuKien ? (
                    <span style={{ color: "#475569" }}> — {L.outcomePrefix}{s.sanPhamDuKien}</span>
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

function PhieuHocTapBlock({ phieu, L }) {
  if (!phieu?.tieuDe && !(phieu?.baiTap || []).length) return null;
  return (
    <div style={{ marginTop: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, textAlign: "center", fontSize: 14, margin: "10px 0 2px" }}>
        {L.appendixPrefix}{phieu.tieuDe || L.phieuTitle}
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

// Phụ lục "STEM" - đúng pattern PhieuHocTapBlock ở trên, nhưng thêm cột "Vật liệu" (checklist chuẩn
// bị) và "Tiêu chí đánh giá" bên cạnh danh sách các bước - giáo viên in/gửi phụ huynh dùng ngay để
// hướng dẫn con hoàn thiện sản phẩm ở nhà (xem buildPromptFragment() của TICH_HOP_STEM trong
// lessonPlanIntegrations.js).
function StemActivityBlock({ data, L }) {
  if (!data?.tenSanPham && !(data?.cacBuoc || []).length) return null;
  const vatLieu = data?.vatLieu || [];
  const cacBuoc = data?.cacBuoc || [];
  const tieuChi = data?.tieuChiDanhGia || [];
  return (
    <div style={{ marginTop: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, textAlign: "center", fontSize: 14, margin: "10px 0 2px" }}>
        {L.appendixPrefix}{L.stemTitle}{data?.tenSanPham ? ` — ${data.tenSanPham}` : ""}
      </p>
      <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", margin: "0 0 8px" }}>{L.stemHint}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {vatLieu.length > 0 && (
          <div style={{ flex: "1 1 180px", minWidth: 160 }}>
            <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 4px", color: "#0F766E" }}>{L.stemMaterials}</p>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {vatLieu.map((v, i) => (
                <li key={i} style={{ fontSize: 12.5, marginBottom: 2 }}>{v}</li>
              ))}
            </ul>
          </div>
        )}
        {cacBuoc.length > 0 && (
          <div style={{ flex: "2 1 260px", minWidth: 220 }}>
            <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 4px", color: "#0F766E" }}>{L.stemSteps}</p>
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              {cacBuoc.map((b, i) => (
                <li key={i} style={{ fontSize: 12.5, marginBottom: 4, whiteSpace: "pre-line" }}>{b}</li>
              ))}
            </ol>
          </div>
        )}
        {tieuChi.length > 0 && (
          <div style={{ flex: "1 1 180px", minWidth: 160 }}>
            <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 4px", color: "#0F766E" }}>{L.stemCriteria}</p>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {tieuChi.map((t, i) => (
                <li key={i} style={{ fontSize: 12.5, marginBottom: 2 }}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function MindmapBlock({ mindmap, L }) {
  if (!mindmap?.chuDe) return null;
  return (
    <div style={{ marginTop: 12, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, margin: "8px 0 4px" }}>{L.mindmapPrefix}{mindmap.chuDe}</p>
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

function CungCoBlock({ questions, L }) {
  if (!questions || questions.length === 0) return null;
  return (
    <div style={{ marginTop: 10, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, margin: "8px 0 4px" }}>{L.consolidationTitle}</p>
      <ol style={{ margin: 0, paddingLeft: 20 }}>
        {questions.map((q, i) => (
          <li key={i} style={{ fontSize: 13.5, marginBottom: 3 }}>
            {q.cauHoi} <span style={{ color: "#16794f", fontWeight: 600 }}>({L.answerPrefix}{q.dapAn})</span>
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
// ⚠️ LUÔN giữ tiêu đề + nội dung TIẾNG VIỆT dù giáo án còn lại bằng ngôn ngữ khác - xem L.tinNhanTitle.
function TinNhanPhuHuynhBlock({ text, L }) {
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
        <p style={{ fontWeight: 700, margin: "8px 0 4px" }}>{L.tinNhanTitle}</p>
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
          {copied ? L.copyButtonDone : L.copyButton}
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
function ChecklistNLPCBlock({ items, L }) {
  if (!items || items.length === 0) return null;
  const loaiLabel = { nang_luc: L.loaiNangLuc, pham_chat: L.loaiPhamChat };
  return (
    <div style={{ marginTop: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, textAlign: "center", fontSize: 14, margin: "10px 0 2px" }}>
        {L.appendixPrefix}{L.checklistTitle}
      </p>
      <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", margin: "0 0 8px" }}>{L.checklistHint}</p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...headCellStyle, width: "28%" }}>{L.checklistCriteria}</th>
            <th style={{ ...headCellStyle, width: "24%" }}>{L.checklistGood}</th>
            <th style={{ ...headCellStyle, width: "24%" }}>{L.checklistSatisfactory}</th>
            <th style={{ ...headCellStyle, width: "24%" }}>{L.checklistNeedsWork}</th>
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

// Phụ lục "Bài tập phân hoá theo 3 mức độ" (Hỗ trợ / Đạt chuẩn / Nâng cao) - XẾP DỌC, mỗi mức
// chiếm TRỌN chiều rộng trang (KHÔNG dùng bảng/lưới 3 cột cạnh nhau) - trước đây dùng flex 3 cột
// ngang, trên khổ A4 mỗi cột chỉ còn ~200px khiến chữ bị ép rất khó đọc (phản ánh thực tế của
// giáo viên). Đúng QUY TẮC TRÌNH BÀY PHỤ LỤC đã chốt: liệt kê tuần tự theo tiêu đề "Mức 1 - Hỗ
// trợ", xuống dòng ghi bài tập, rồi "Mức 2 - Đạt chuẩn"...
function BaiTapPhanHoaBlock({ data, L }) {
  const groups = L.phanHoaGroups;
  const hasAny = groups.some((g) => (data?.[g.key] || []).length > 0);
  if (!hasAny) return null;
  return (
    <div style={{ marginTop: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, textAlign: "center", fontSize: 14, margin: "10px 0 8px" }}>
        {L.appendixPrefix}{L.phanHoaTitle}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {groups.map((g) => {
          const items = data?.[g.key] || [];
          if (items.length === 0) return null;
          return (
            <div
              key={g.key}
              style={{
                border: `1.5px solid ${g.border}`,
                background: g.bg,
                borderRadius: 8,
                padding: "8px 10px",
              }}
            >
              <p style={{ fontWeight: 700, color: g.color, fontSize: 13, margin: "0 0 6px" }}>{g.label}</p>
              <ol style={{ margin: 0, paddingLeft: 18 }}>
                {items.map((it, i) => (
                  <li key={i} style={{ fontSize: 13, marginBottom: 6, whiteSpace: "pre-line" }}>
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
function LoiDanBlock({ items, L }) {
  const rows = (items || []).filter((it) => it?.loiDan);
  if (rows.length === 0) return null;
  return (
    <div style={{ marginTop: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, textAlign: "center", fontSize: 14, margin: "10px 0 2px" }}>
        {L.appendixPrefix}{L.loiDanTitle}
      </p>
      <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", margin: "0 0 8px" }}>{L.loiDanHint}</p>
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
function SlideOutlineBlock({ slides, L }) {
  const rows = (slides || []).filter((s) => s?.tieuDe || (s?.noiDung || []).length);
  if (rows.length === 0) return null;
  return (
    <div style={{ marginTop: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, textAlign: "center", fontSize: 14, margin: "10px 0 2px" }}>
        {L.appendixPrefix}{L.slideOutlineTitle}
      </p>
      <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", margin: "0 0 8px" }}>{L.slideOutlineHint}</p>
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
              {L.slideLabel} {i + 1}: {s.tieuDe}
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

// Phụ lục "Gợi ý thiết kế Học liệu" - tự động xuất hiện ở giáo án Lớp 1-3 (xem
// buildVisualHocLieuGuidance() trong lessonPlanPromptTemplates.js): 3 từ khoá tiếng Việt để giáo
// viên copy-dán thẳng vào công cụ tạo ảnh AI (Canva/ChatGPT/Gemini) tự tạo Flashcard minh hoạ.
function HocLieuHinhAnhBlock({ goiY, L }) {
  const items = (goiY || []).filter(Boolean);
  if (items.length === 0) return null;
  return (
    <div style={{ marginTop: 16, breakInside: "avoid" }}>
      <p style={{ fontWeight: 700, textAlign: "center", fontSize: 14, margin: "10px 0 2px" }}>
        {L.appendixPrefix}{L.hocLieuTitle}
      </p>
      <p style={{ fontSize: 12, color: "#64748b", textAlign: "center", margin: "0 0 8px" }}>{L.hocLieuHint}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((tuKhoa, i) => (
          <div
            key={i}
            style={{
              background: "#F0FDF4",
              border: "1px solid #BBF7D0",
              borderRadius: 8,
              padding: "8px 10px",
            }}
          >
            <p style={{ fontSize: 13.5, fontStyle: "italic", margin: 0, color: "#166534" }}>
              {i + 1}. &ldquo;{tuKhoa}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LessonPlanPreview({ lessonPlan, timeline, meta }) {
  // ⚠️ Phiên 36: xác định môn ngoại ngữ NGAY ĐẦU component - "Chưa có dữ liệu" bên dưới vẫn giữ
  // tiếng Việt vì đây là hướng dẫn thao tác UI cho GIÁO VIÊN, không phải nội dung giáo án.
  const foreignLanguageConfig = findForeignLanguageConfig(meta?.subject);
  const L = pickLabels(foreignLanguageConfig?.languageCode);

  if (!lessonPlan) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-400">
        {LABELS_VI.noDataHint}
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
          {meta?.subject ? `${L.subjectPrefix}${getSubjectLabel(meta.subject)} — ` : ""}
          {meta?.grade === "MAM_NON" ? L.preschool : `${L.gradePrefix}${meta?.grade}`}
          {L.periodsPrefix}{meta?.soTiet || 1}
          {meta?.circularLabel ? `${L.circularPrefix}${meta.circularLabel}` : ""}
        </p>

        <p style={{ fontWeight: 700, margin: "10px 0 2px" }}>{L.sectionI}</p>
        <ListBlock title={L.knowledge} items={lessonPlan.yeuCauCanDat?.kienThuc} />
        <ListBlock title={L.competencies} items={lessonPlan.yeuCauCanDat?.nangLuc} />
        <ListBlock title={L.qualities} items={lessonPlan.yeuCauCanDat?.phamChat} />

        <p style={{ fontWeight: 700, margin: "10px 0 2px" }}>{L.sectionII}</p>
        <ListBlock title={L.teacher} items={lessonPlan.doDungDayHoc?.giaoVien} />
        <ListBlock title={L.student} items={lessonPlan.doDungDayHoc?.hocSinh} />

        <p style={{ fontWeight: 700, margin: "10px 0 2px" }}>{L.sectionIII}</p>
        {meta?.soTiet > 1 && (
          <p style={{ fontSize: 12, color: "#9A3412", margin: "0 0 8px", fontStyle: "italic" }}>
            {L.timeAllocationPrefix}
            {computeMultiPeriodTimeline(meta.soTiet, meta.grade, meta.lessonType, foreignLanguageConfig?.languageCode)
              .map((p) => `${L.periodLabel} ${p.period} (${p.totalMinutes}')`)
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
            L={L}
          />
        ))}

        {lessonPlan.tichHopNLS && (
          <p style={{ fontSize: 13.5, marginTop: 8 }}>
            <b>{L.digitalIntegration}</b> {lessonPlan.tichHopNLS}
          </p>
        )}
        {lessonPlan.tichHopGDQPAN && (
          <p style={{ fontSize: 13.5, marginTop: 8 }}>
            {/* Nhãn ĐỘNG theo hướng AI thực tế đã chọn (xem tichHopGDQPANNhan trong
                lessonPlanIntegrations.js) - không hardcode nhãn cố định nữa vì nội dung có
                thể là Đạo đức/Kỹ năng sống/Quyền trẻ em khi bài học không liên kết logic với GDQP&AN,
                và với môn ngoại ngữ, chỉ thị ngôn ngữ đã yêu cầu AI trả về nhãn này đúng ngôn ngữ đích. */}
            <b>{lessonPlan.tichHopGDQPANNhan || L.gdqpanFallback}:</b> {lessonPlan.tichHopGDQPAN}
          </p>
        )}
        {lessonPlan.tichHopHSKT && (
          <p style={{ fontSize: 13.5, marginTop: 8 }}>
            <b>{L.hsktIntegration}</b> {lessonPlan.tichHopHSKT}
          </p>
        )}

        <CungCoBlock questions={lessonPlan.cungCoQuestions} L={L} />
        <MindmapBlock mindmap={lessonPlan.mindmap} L={L} />

        <p style={{ fontWeight: 700, margin: "14px 0 2px" }}>{L.sectionIV}</p>
        <p style={{ fontSize: 13, color: "#94a3b8" }}>{L.sectionIVHint}</p>

        <PhieuHocTapBlock phieu={lessonPlan.phieuHocTap} L={L} />
        <StemActivityBlock data={lessonPlan.stemActivity} L={L} />
        <BaiTapPhanHoaBlock data={lessonPlan.baiTapPhanHoa} L={L} />
        <ChecklistNLPCBlock items={lessonPlan.checklistNLPC} L={L} />
        <LoiDanBlock items={lessonPlan.loiDan} L={L} />
        <TinNhanPhuHuynhBlock text={lessonPlan.tinNhanPhuHuynh} L={L} />
        <SlideOutlineBlock slides={lessonPlan.slideOutline} L={L} />
        <HocLieuHinhAnhBlock goiY={lessonPlan.goiYHocLieuHinhAnh} L={L} />
      </div>
    </div>
  );
}
