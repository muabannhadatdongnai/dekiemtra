"use client";

import { useState } from "react";
import { Copy, Check, AlertTriangle, BadgeCheck } from "lucide-react";
import { getReportCommentLevelConfig } from "@/data/reportCommentConfig";

const textareaClass =
  "w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed focus:border-brand-400 focus:outline-none";

function EditableField({ label, value, onChange }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <textarea className={textareaClass} rows={2} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function StudentCard({ result, onEdit }) {
  const [copied, setCopied] = useState(false);

  if (result.error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-red-700">
          <AlertTriangle size={15} /> {result.hoTen} {result.lop && `- Lớp ${result.lop}`}
        </p>
        <p className="mt-1 text-xs text-red-600">{result.error}</p>
      </div>
    );
  }

  const { comment } = result;
  const isTieuHoc = comment.phamChat !== undefined;

  async function handleCopy() {
    const lines = [`${result.hoTen}${result.lop ? ` - Lớp ${result.lop}` : ""}`];
    if (comment.phamChat) lines.push(`Phẩm chất: ${comment.phamChat}`);
    if (comment.nangLuc) lines.push(`Năng lực: ${comment.nangLuc}`);
    if (comment.nhanXetChung) lines.push(`Nhận xét chung: ${comment.nhanXetChung}`);
    (comment.monHoc || []).forEach((m) => m?.ten && m?.noiDung && lines.push(`${m.ten}: ${m.noiDung}`));
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
        <p className="text-sm font-bold text-slate-800">
          {result.hoTen} {result.lop && <span className="font-normal text-slate-500">- Lớp {result.lop}</span>}
        </p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
        >
          {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
          {copied ? "Đã sao chép" : "Sao chép"}
        </button>
      </div>

      <div className="space-y-3 p-4">
        {isTieuHoc ? (
          <>
            <EditableField
              label="Phẩm chất"
              value={comment.phamChat}
              onChange={(v) => onEdit({ ...comment, phamChat: v })}
            />
            <EditableField
              label="Năng lực"
              value={comment.nangLuc}
              onChange={(v) => onEdit({ ...comment, nangLuc: v })}
            />
          </>
        ) : (
          <EditableField
            label="Nhận xét chung"
            value={comment.nhanXetChung}
            onChange={(v) => onEdit({ ...comment, nhanXetChung: v })}
          />
        )}

        {(comment.monHoc || []).map((m, idx) => (
          <EditableField
            key={idx}
            label={m.ten}
            value={m.noiDung}
            onChange={(v) => {
              const monHoc = [...comment.monHoc];
              monHoc[idx] = { ...monHoc[idx], noiDung: v };
              onEdit({ ...comment, monHoc });
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ReportCommentPreview({ cap, results, onResultsChange }) {
  const levelConfig = getReportCommentLevelConfig(cap);

  if (!results || results.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">
        Chưa có nhận xét nào - điền thông tin học sinh ở bên trái rồi bấm "Tạo nhận xét học bạ".
      </div>
    );
  }

  function handleEdit(idx, newComment) {
    const updated = [...results];
    updated[idx] = { ...updated[idx], comment: newComment };
    onResultsChange?.(updated);
  }

  return (
    <div className="space-y-4">
      {levelConfig && (
        <div className="flex w-fit items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          <BadgeCheck size={14} /> {levelConfig.circularLabel}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {results.map((r, idx) => (
          <StudentCard key={`${r.hoTen}-${idx}`} result={r} onEdit={(c) => handleEdit(idx, c)} />
        ))}
      </div>
    </div>
  );
}
