"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { listBlocks, BLOCK_KEYS } from "@/data/vietnameseExamBlocks";
import { buildVietnameseExamBlueprint } from "@/data/vietnameseExamBlueprint";
import { buildVietnameseExamResult } from "@/data/vietnameseExamResult";
import { generateVietnameseExamRequest } from "@/services/apiClient";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";
const GRADES = [1, 2, 3, 4, 5];

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

/**
 * VietnameseExamForm.jsx
 * Form cho mode thứ 4 "📖 Đề Tiếng Việt Tiểu học" - dựng khung theo đúng khuôn ExamMatrixForm.jsx/
 * WorksheetForm.jsx/LessonPlanForm.jsx (state cục bộ + build blueprint + gọi apiClient + trả kết
 * quả về page.js qua onGenerated). Danh sách khối đọc TRỰC TIẾP từ danh bạ (vietnameseExamBlocks.js)
 * - thêm khối mới ở đó, KHÔNG cần sửa file này để nó xuất hiện trên form (chỉ cần đổi
 * `implemented: true` để checkbox hết bị vô hiệu hoá).
 *
 * Giai đoạn 2 (đang làm): chỉ khối "Đọc thầm" có input riêng (Chủ đề + Số câu hỏi) vì đây là khối
 * DUY NHẤT đã triển khai xong. 3 khối còn lại hiển thị mờ + nhãn "Sắp có" để giáo viên biết cấu
 * trúc đề đầy đủ sẽ có gì, không gây hiểu nhầm là hệ thống thiếu sót.
 */
export default function VietnameseExamForm({ onGenerated }) {
  const [grade, setGrade] = useState(5);
  const [selectedBlocks, setSelectedBlocks] = useState([BLOCK_KEYS.DOC_THAM]);

  // Input riêng của khối "Đọc thầm" - khi có khối thứ 2/3/4 sau này, mỗi khối tự thêm state riêng
  // ở đây rồi gộp vào blockInputs lúc submit, không đụng tới state của khối khác.
  const [docThamChuDe, setDocThamChuDe] = useState("");
  const [docThamSoCauHoi, setDocThamSoCauHoi] = useState(8);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const blocks = listBlocks();

  function toggleBlock(blockDef) {
    if (!blockDef.implemented) return; // khối chưa triển khai - không cho bật
    setSelectedBlocks((prev) =>
      prev.includes(blockDef.key) ? prev.filter((k) => k !== blockDef.key) : [...prev, blockDef.key]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (selectedBlocks.length === 0) {
      setError("Vui lòng chọn ít nhất 1 khối.");
      return;
    }

    const blockInputs = {};
    if (selectedBlocks.includes(BLOCK_KEYS.DOC_THAM)) {
      blockInputs[BLOCK_KEYS.DOC_THAM] = {
        chuDe: docThamChuDe,
        soCauHoi: docThamSoCauHoi,
      };
    }

    const blueprint = buildVietnameseExamBlueprint({ grade, selectedBlocks, blockInputs });

    setLoading(true);
    try {
      const data = await generateVietnameseExamRequest(blueprint);
      onGenerated(buildVietnameseExamResult(data, { grade, examCode: Math.floor(100 + Math.random() * 900) }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Lớp">
        <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} className={inputClass}>
          {GRADES.map((g) => (
            <option key={g} value={g}>Lớp {g}</option>
          ))}
        </select>
      </Field>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Các khối trong đề</p>
        <div className="space-y-2">
          {blocks.map((b) => {
            const checked = selectedBlocks.includes(b.key);
            return (
              <label
                key={b.key}
                className={`flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition ${
                  !b.implemented
                    ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                    : checked
                      ? "border-brand-400 bg-brand-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={!b.implemented}
                  onChange={() => toggleBlock(b)}
                  className="mt-0.5"
                />
                <span>
                  <span className="block font-medium text-slate-800">
                    {b.section} — {b.label} {!b.implemented && <em className="text-slate-400">(sắp có)</em>}
                  </span>
                  <span className="block text-xs text-slate-500">{b.description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {selectedBlocks.includes(BLOCK_KEYS.DOC_THAM) && (
        <div className="space-y-3 rounded-md border border-brand-200 bg-brand-50/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Khối "Đọc thầm"</p>
          <Field label="Chủ đề (tuỳ chọn - để trống để AI tự chọn)">
            <input
              value={docThamChuDe}
              onChange={(e) => setDocThamChuDe(e.target.value)}
              placeholder='VD: "Tình bạn", "Quê hương"...'
              className={inputClass}
            />
          </Field>
          <Field label="Số câu hỏi (7-10)">
            <input
              type="number"
              min={7}
              max={10}
              value={docThamSoCauHoi}
              onChange={(e) => setDocThamSoCauHoi(Math.min(10, Math.max(7, Number(e.target.value) || 8)))}
              className={inputClass}
            />
          </Field>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? "Đang tạo đề..." : "📖 TẠO ĐỀ TIẾNG VIỆT"}
      </button>
    </form>
  );
}
