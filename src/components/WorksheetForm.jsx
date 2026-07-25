"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { getSession } from "@/services/authService";
import { generateWorksheetRequest } from "@/services/apiClient";

const GRADES = [
  { value: "MAM_NON", label: "Mầm non (chuẩn bị vào lớp 1)" },
  { value: "LOP_1", label: "Lớp 1" },
  { value: "LOP_2", label: "Lớp 2" },
];

const EXERCISE_LABELS = {
  tinh_nham: "Tính nhẩm",
  dem_va_viet_so: "Đếm và viết số",
  so_sanh: "So sánh (>, <, =)",
  day_so: "Dãy số cách đều",
  noi_phep_tinh: "Nối phép tính với kết quả",
  giai_toan: "Giải toán có lời văn (dùng AI)",
  nhan_dien_hinh: "Nhận diện hình + tô màu",
};

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

export default function WorksheetForm({ onGenerated }) {
  const [grade, setGrade] = useState("LOP_1");
  const [title, setTitle] = useState("BÀI TẬP TOÁN");
  const [exerciseCounts, setExerciseCounts] = useState({
    tinh_nham: 6,
    dem_va_viet_so: 3,
    so_sanh: 6,
    day_so: 4,
    noi_phep_tinh: 5,
    giai_toan: 2,
    nhan_dien_hinh: 6,
  });
  const [includeAnswers, setIncludeAnswers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalSections = Object.values(exerciseCounts).filter((c) => c > 0).length;

  function updateCount(key, value) {
    setExerciseCounts((prev) => ({ ...prev, [key]: Math.max(0, Number(value) || 0) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (totalSections === 0) {
      setError("Chọn ít nhất 1 dạng bài tập.");
      return;
    }
    const session = getSession();
    if (!session) {
      setError("Phiên đăng nhập đã hết, vui lòng tải lại trang.");
      return;
    }

    setLoading(true);
    try {
      const data = await generateWorksheetRequest({
        username: session.username,
        grade,
        includeAnswers,
        exerciseCounts,
      });
      onGenerated({ worksheet: data, meta: { title } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Khối lớp</label>
        <select value={grade} onChange={(e) => setGrade(e.target.value)} className={inputClass}>
          {GRADES.map((g) => (
            <option key={g.value} value={g.value}>{g.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Tiêu đề phiếu</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Chọn dạng bài + số lượng</p>
        {Object.entries(EXERCISE_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
            <span className="text-sm text-slate-700">{label}</span>
            <input
              type="number"
              min={0}
              value={exerciseCounts[key]}
              onChange={(e) => updateCount(key, e.target.value)}
              className="w-16 rounded border border-slate-300 px-2 py-1 text-center text-sm"
            />
          </div>
        ))}
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={includeAnswers} onChange={(e) => setIncludeAnswers(e.target.checked)} />
        Kèm đáp số (cho bài giải toán có lời văn)
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? "Đang tạo phiếu..." : "🚀 TẠO PHIẾU BÀI TẬP"}
      </button>
    </form>
  );
}
