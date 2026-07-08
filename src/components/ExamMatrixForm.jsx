"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, Loader2, Sparkles } from "lucide-react";
import { DIFFICULTY_LEVELS } from "@/data/promptTemplates";
import { getSession } from "@/services/authService";

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);
const SUBJECTS = [
  { value: "Toan", label: "Toán" },
  { value: "Tieng_Viet", label: "Tiếng Việt" },
  { value: "Tieng_Anh", label: "Tiếng Anh" },
  { value: "Lich_Su", label: "Lịch sử" },
];

function Stepper({ label, sub, value, onChange, type, onTypeChange }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
      </div>
      <div className="flex items-center gap-3">
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1 text-xs"
        >
          <option value="trac_nghiem">Trắc nghiệm</option>
          <option value="tu_luan">Tự luận</option>
        </select>
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"
        >
          <Minus size={14} />
        </button>
        <span className="w-6 text-center text-sm font-semibold">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

export default function ExamMatrixForm({ onGenerated }) {
  // ============ Thông tin chung ============
  const [schoolName, setSchoolName] = useState("");
  const [className, setClassName] = useState("");
  const [duration, setDuration] = useState("45 phút");
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [examTitle, setExamTitle] = useState("Phiếu kiểm tra cuối học kì I");

  // ============ Chọn kiến thức ============
  const [subject, setSubject] = useState("Toan");
  const [grade, setGrade] = useState(5);
  const [volume, setVolume] = useState(1);
  const [availableChapters, setAvailableChapters] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [chaptersError, setChaptersError] = useState("");

  // ============ Dạng câu hỏi (RIÊNG cho từng mức độ) & ma trận ============
  // Mặc định theo thông lệ đề Toán VN: Nhận biết/Thông hiểu = trắc nghiệm, Vận dụng/Vận dụng cao = tự luận
  const [typeByLevel, setTypeByLevel] = useState({
    NHAN_BIET: "trac_nghiem",
    THONG_HIEU: "trac_nghiem",
    VAN_DUNG: "tu_luan",
    VAN_DUNG_CAO: "tu_luan",
  });
  const [matrix, setMatrix] = useState({
    NHAN_BIET: 5,
    THONG_HIEU: 6,
    VAN_DUNG: 1,
    VAN_DUNG_CAO: 1,
  });
  // Mặc định KHÔNG tạo đáp án/lời giải - tiết kiệm credit AI đáng kể. Giáo viên tự bật khi cần.
  const [includeAnswers, setIncludeAnswers] = useState(false);
  // Câu hỏi trực quan (đặt tính, tam giác số, sơ đồ đoạn thẳng, hình đếm) - đặc trưng Tiểu học,
  // mặc định BẬT vì phần lớn giáo viên dùng hệ thống này dạy Lớp 1-5.
  const [useVisualQuestions, setUseVisualQuestions] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalQuestions = Object.values(matrix).reduce((a, b) => a + b, 0);

  // Tự động tải danh sách chương khi Môn/Lớp/Tập thay đổi (đổ vào Select Box)
  useEffect(() => {
    let cancelled = false;
    async function loadChapters() {
      setLoadingChapters(true);
      setChaptersError("");
      setSelectedChapters([]);
      try {
        const res = await fetch(`/api/chapters?grade=${grade}&subject=${subject}&volume=${volume}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Không tải được danh sách chương.");
        if (!cancelled) setAvailableChapters(data.chapters || []);
      } catch (err) {
        if (!cancelled) {
          setChaptersError(err.message);
          setAvailableChapters([]);
        }
      } finally {
        if (!cancelled) setLoadingChapters(false);
      }
    }
    loadChapters();
    return () => {
      cancelled = true;
    };
  }, [grade, subject, volume]);

  function toggleChapter(chapter) {
    setSelectedChapters((prev) =>
      prev.includes(chapter) ? prev.filter((c) => c !== chapter) : [...prev, chapter]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (selectedChapters.length === 0) {
      setError("Vui lòng chọn ít nhất 1 Chương/Bài học.");
      return;
    }
    if (totalQuestions === 0) {
      setError("Tổng số câu hỏi phải lớn hơn 0.");
      return;
    }

    const session = getSession();
    if (!session) {
      setError("Phiên đăng nhập đã hết, vui lòng tải lại trang và đăng nhập lại.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: session.username,
          grade,
          subject,
          volume,
          chapters: selectedChapters,
          typeByLevel,
          matrix,
          includeAnswers,
          useVisualQuestions,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tạo đề thất bại.");

      onGenerated({
        ...data,
        meta: {
          schoolName,
          className,
          duration,
          academicYear,
          title: examTitle,
          subject: SUBJECTS.find((s) => s.value === subject)?.label || subject,
          grade,
          examCode: Math.floor(100 + Math.random() * 900),
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ============ THÔNG TIN CHUNG ============ */}
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">Thông tin chung</p>
        <Field label="Tên trường">
          <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className={inputClass} placeholder="Trường THCS ..." />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tên lớp">
            <input value={className} onChange={(e) => setClassName(e.target.value)} className={inputClass} placeholder="6A1" />
          </Field>
          <Field label="Thời gian làm bài">
            <input value={duration} onChange={(e) => setDuration(e.target.value)} className={inputClass} placeholder="45 phút" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Năm học">
            <input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} className={inputClass} placeholder="2025-2026" />
          </Field>
          <Field label="Tên bài kiểm tra">
            <input value={examTitle} onChange={(e) => setExamTitle(e.target.value)} className={inputClass} />
          </Field>
        </div>
      </div>

      {/* ============ CHỌN KIẾN THỨC ============ */}
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">Chọn kiến thức</p>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Môn học">
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass}>
              {SUBJECTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Lớp">
            <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} className={inputClass}>
              {GRADES.map((g) => (
                <option key={g} value={g}>Lớp {g}</option>
              ))}
            </select>
          </Field>
          <Field label="Tập">
            <select value={volume} onChange={(e) => setVolume(Number(e.target.value))} className={inputClass}>
              <option value={1}>Tập 1</option>
              <option value={2}>Tập 2</option>
            </select>
          </Field>
        </div>

        <Field label="Chương / Bài học">
          {loadingChapters && (
            <p className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 size={14} className="animate-spin" /> Đang tải danh sách chương...
            </p>
          )}
          {chaptersError && <p className="text-sm text-red-600">{chaptersError}</p>}
          {!loadingChapters && !chaptersError && availableChapters.length === 0 && (
            <p className="text-sm text-slate-400">
              Chưa có chương nào — kiểm tra lại cấu hình GITHUB_KNOWLEDGE_REPO và cấu trúc thư mục.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {availableChapters.map((c) => {
              const isAdvanced = c.isAdvancedBook;
              const selected = selectedChapters.includes(c.chapter);
              return (
                <button
                  key={c.chapter}
                  type="button"
                  onClick={() => toggleChapter(c.chapter)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    selected
                      ? isAdvanced
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-brand-600 bg-brand-50 text-brand-700"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                  title={isAdvanced ? "Lấy nguyên văn cả cuốn sách nâng cao, không chia chương" : undefined}
                >
                  {isAdvanced ? "📘 Sách nâng cao (toàn bộ)" : `Chương ${c.chapter}`}
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      {/* ============ MA TRẬN CÂU HỎI ============ */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-800">Ma trận số câu theo mức độ</p>
        {Object.values(DIFFICULTY_LEVELS).map((level) => (
          <Stepper
            key={level.key}
            label={`${level.label}${level.label === "Nhận biết" ? " (Dễ)" : level.label === "Thông hiểu" ? " (Trung bình)" : level.label === "Vận dụng" ? " (Khó)" : " (Rất khó)"}`}
            value={matrix[level.key]}
            onChange={(v) => setMatrix((m) => ({ ...m, [level.key]: v }))}
            type={typeByLevel[level.key]}
            onTypeChange={(t) => setTypeByLevel((m) => ({ ...m, [level.key]: t }))}
          />
        ))}
        <p className="pt-1 text-sm text-slate-600">
          Tổng số câu: <span className="font-semibold">{totalQuestions}</span>
        </p>
      </div>

      {/* ============ TUỲ CHỌN ĐÁP ÁN & CÂU HỎI TRỰC QUAN ============ */}
      <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 px-4 py-3">
        <input
          type="checkbox"
          checked={useVisualQuestions}
          onChange={(e) => setUseVisualQuestions(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          <span className="block text-sm font-medium text-slate-800">
            Cho phép câu hỏi trực quan (đặt tính, sơ đồ, hình đếm...)
          </span>
          <span className="block text-xs text-slate-500">
            Phù hợp Tiểu học (Lớp 1-5): đặt tính rồi tính, cây số/tam giác quan hệ, sơ đồ đoạn thẳng,
            hình đếm minh hoạ phân số. AI chỉ sinh số liệu, hệ thống tự vẽ hình - không tốn thêm
            credit đáng kể. Tắt nếu ra đề cho Lớp 6 trở lên.
          </span>
        </span>
      </label>

      <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-slate-200 px-4 py-3">
        <input
          type="checkbox"
          checked={includeAnswers}
          onChange={(e) => setIncludeAnswers(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          <span className="block text-sm font-medium text-slate-800">
            Tạo đáp án + lời giải chi tiết
          </span>
          <span className="block text-xs text-slate-500">
            Mặc định TẮT để tiết kiệm credit AI. Bật lên nếu cần đáp án đúng và lời giải để chấm bài
            (đề vẫn tạo bình thường khi tắt, chỉ là không kèm đáp án).
          </span>
        </span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? "Đang tạo đề..." : "🚀 TẠO ĐỀ THI NGAY"}
      </button>
    </form>
  );
}
