"use client";

import { useState } from "react";
import { Loader2, Sparkles, Upload, CheckCircle2, XCircle } from "lucide-react";
import { getSession } from "@/services/authService";
import { generateWorksheetRequest, analyzeWorksheetSampleRequest } from "@/services/apiClient";

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

  // ================== GIAI ĐOẠN 2: phiếu mẫu tham khảo ==================
  const [sampleFile, setSampleFile] = useState(null);
  const [sampleSpec, setSampleSpec] = useState(null);
  const [sampleReferenceContext, setSampleReferenceContext] = useState(null);
  const [sampleFromCache, setSampleFromCache] = useState(false);
  const [analyzingSample, setAnalyzingSample] = useState(false);
  const [sampleError, setSampleError] = useState("");
  const [lastLayoutId, setLastLayoutId] = useState(null); // để tránh random trùng layout 2 lần liên tiếp

  const totalSections = Object.values(exerciseCounts).filter((c) => c > 0).length;

  function updateCount(key, value) {
    setExerciseCounts((prev) => ({ ...prev, [key]: Math.max(0, Number(value) || 0) }));
  }

  // Phân tích ngay khi giáo viên chọn file - không đợi đến lúc bấm "Tạo phiếu" mới báo lỗi,
  // giống hệt cách ExamMatrixForm.jsx xử lý đề mẫu.
  async function handleSampleFileChange(e) {
    const file = e.target.files?.[0] || null;
    setSampleFile(file);
    setSampleSpec(null);
    setSampleReferenceContext(null);
    setSampleError("");
    if (!file) return;

    const session = getSession();
    if (!session) {
      setSampleError("Phiên đăng nhập đã hết, vui lòng tải lại trang.");
      return;
    }

    setAnalyzingSample(true);
    try {
      const data = await analyzeWorksheetSampleRequest({ username: session.username, file });
      setSampleSpec(data.spec);
      setSampleReferenceContext(data.referenceContext || null);
      setSampleFromCache(Boolean(data.fromCache));
    } catch (err) {
      setSampleError(err.message);
    } finally {
      setAnalyzingSample(false);
    }
  }

  function clearSample() {
    setSampleFile(null);
    setSampleSpec(null);
    setSampleReferenceContext(null);
    setSampleError("");
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
        previousLayoutId: lastLayoutId,
        sampleSpec,
        referenceContext: sampleReferenceContext,
      });
      setLastLayoutId(data?.layout?.id || null);
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

      <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-semibold text-slate-800">
          Phiếu mẫu tham khảo <span className="font-normal text-slate-500">(không bắt buộc)</span>
        </p>
        <p className="text-xs text-slate-500">
          Upload 1 phiếu bài tập giáo viên thấy đẹp (ảnh chụp, PDF, hoặc Word) - hệ thống sẽ ưu tiên chọn
          bố cục gần giống phong cách đó, và dùng chủ đề trong tài liệu làm ngữ cảnh cho bài toán có lời văn.
        </p>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <Upload size={15} />
          <span>{sampleFile ? sampleFile.name : "Chọn file phiếu mẫu (.docx, .pdf, hoặc ảnh chụp)"}</span>
          <input type="file" accept=".docx,.pdf,image/*" onChange={handleSampleFileChange} className="sr-only" />
        </label>

        {analyzingSample && (
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 size={13} className="animate-spin" /> Đang phân tích phong cách phiếu mẫu...
          </p>
        )}

        {sampleError && (
          <p className="flex items-start gap-2 text-xs text-red-600">
            <XCircle size={13} className="mt-0.5 shrink-0" /> {sampleError}
          </p>
        )}

        {sampleSpec && !analyzingSample && (
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 text-xs text-emerald-700">
              <CheckCircle2 size={13} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">
                  Đã phân tích xong{sampleFromCache ? " (lấy từ cache, không tốn thêm lượt AI)" : ""}.
                </p>
                {sampleSpec.moodKeywords && <p>Phong cách: {sampleSpec.moodKeywords}</p>}
                {sampleSpec.themeHints && <p>Chủ đề: {sampleSpec.themeHints}</p>}
                {sampleSpec.exerciseTypeHints?.length > 0 && (
                  <p>Dạng bài quan sát thấy: {sampleSpec.exerciseTypeHints.join(", ")}</p>
                )}
              </div>
            </div>
            <button type="button" onClick={clearSample} className="shrink-0 text-xs text-slate-400 underline">
              Bỏ chọn
            </button>
          </div>
        )}
      </div>

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
