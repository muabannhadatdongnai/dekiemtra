"use client";

import { LESSON_PLAN_COLUMN_MODES } from "@/data/lessonPlanTemplates";
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

function ActivityBlock({ activity, columnMode, minutes }) {
  const steps = activity.tienTrinh || [];
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
            {steps.map((s, i) => (
              <tr key={i}>
                <td style={cellStyle}>{s.hoatDongGVHS}</td>
                <td style={cellStyle}>{s.sanPhamDuKien}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          {steps.map((s, i) => (
            <p key={i} style={{ fontSize: 13.5, margin: "0 0 6px" }}>
              {s.hoatDongGVHS}
              {s.sanPhamDuKien ? (
                <span style={{ color: "#475569" }}> — Sản phẩm dự kiến: {s.sanPhamDuKien}</span>
              ) : null}
            </p>
          ))}
        </div>
      )}
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
        {(lessonPlan.hoatDong || []).map((a, i) => (
          <ActivityBlock key={i} activity={a} columnMode={columnMode} minutes={minutesByKey[activityKeyByIndex[i]]} />
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
      </div>
    </div>
  );
}
