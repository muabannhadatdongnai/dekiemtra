"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { DIFFICULTY_LEVELS } from "@/data/promptTemplates";
import { getSession } from "@/services/authService";

const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);
const SUBJECTS = [
  { value: "Toan", label: "Toán" },
  { value: "Tieng_Viet", label: "Tiếng Việt" },
  { value: "Tieng_Anh", label: "Tiếng Anh" },
  { value: "Lich_Su", label: "Lịch sử" },
];

const LEVEL_SHORT_LABEL = {
  NHAN_BIET: "Nhận biết (Dễ)",
  THONG_HIEU: "Thông hiểu (TB)",
  VAN_DUNG: "Vận dụng (Khó)",
  VAN_DUNG_CAO: "Vận dụng cao (Rất khó)",
};

const EMPTY_ROW = { NHAN_BIET: 0, THONG_HIEU: 0, VAN_DUNG: 0, VAN_DUNG_CAO: 0 };

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
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [chaptersError, setChaptersError] = useState("");

  // ============ Dạng câu hỏi (RIÊNG cho từng mức độ) ============
  // Mặc định theo thông lệ đề Toán VN: Nhận biết/Thông hiểu = trắc nghiệm, Vận dụng/Vận dụng cao = tự luận
  const [typeByLevel, setTypeByLevel] = useState({
    NHAN_BIET: "trac_nghiem",
    THONG_HIEU: "trac_nghiem",
    VAN_DUNG: "tu_luan",
    VAN_DUNG_CAO: "tu_luan",
  });

  // ⚠️ GIAI ĐOẠN 1 - MA TRẬN THEO CHƯƠNG: mỗi chương được chọn có 1 hàng riêng trong ma trận,
  // với số câu RIÊNG cho từng mức độ - không còn "tổng số câu" chung chung không rõ chương nào.
  // chapterMatrix: { [chapterId]: { NHAN_BIET, THONG_HIEU, VAN_DUNG, VAN_DUNG_CAO } }
  const [chapterMatrix, setChapterMatrix] = useState({});

  // Mặc định KHÔNG tạo đáp án/lời giải - tiết kiệm credit AI đáng kể. Giáo viên tự bật khi cần.
  const [includeAnswers, setIncludeAnswers] = useState(false);
  // Câu hỏi trực quan (đặt tính, tam giác số, sơ đồ đoạn thẳng, hình đếm) - đặc trưng Tiểu học,
  // mặc định BẬT vì phần lớn giáo viên dùng hệ thống này dạy Lớp 1-5.
  const [useVisualQuestions, setUseVisualQuestions] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const chapterIds = Object.keys(chapterMatrix);
  const columnTotals = Object.keys(DIFFICULTY_LEVELS).reduce((acc, lvl) => {
    acc[lvl] = chapterIds.reduce((sum, cId) => sum + (chapterMatrix[cId]?.[lvl] || 0), 0);
    return acc;
  }, {});
  const totalQuestions = Object.values(columnTotals).reduce((a, b) => a + b, 0);

  // Tự động tải danh sách chương khi Môn/Lớp/Tập thay đổi, reset ma trận vì chương đã đổi
  useEffect(() => {
    let cancelled = false;
    async function loadChapters() {
      setLoadingChapters(true);
      setChaptersError("");
      setChapterMatrix({});
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

  function toggleChapter(chapterId) {
    setChapterMatrix((prev) => {
      const next = { ...prev };
      if (next[chapterId]) {
        delete next[chapterId];
      } else {
        next[chapterId] = { ...EMPTY_ROW };
      }
      return next;
    });
  }

  function updateCell(chapterId, level, value) {
    const n = Math.max(0, Number(value) || 0);
    setChapterMatrix((prev) => ({
      ...prev,
      [chapterId]: { ...prev[chapterId], [level]: n },
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (chapterIds.length === 0) {
      setError("Vui lòng chọn ít nhất 1 Chương/Bài học.");
      return;
    }
    if (totalQuestions === 0) {
      setError("Tổng số câu hỏi phải lớn hơn 0 (điền số câu vào ma trận bên dưới).");
      return;
    }

    const session = getSession();
    if (!session) {
      setError("Phiên đăng nhập đã hết, vui lòng tải lại trang và đăng nhập lại.");
      return;
    }

    // Chỉ gửi các chương thực sự có câu hỏi (bỏ chương chọn nhầm nhưng để trống toàn bộ ma trận)
    const nonEmptyChapterMatrix = Object.fromEntries(
      Object.entries(chapterMatrix).filter(
        ([, row]) => Object.values(row).reduce((a, b) => a + b, 0) > 0
      )
    );

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
          chapterMatrix: nonEmptyChapterMatrix,
          typeByLevel,
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

        <Field label="Chương / Bài học (bấm để thêm vào ma trận bên dưới)">
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
              const selected = Boolean(chapterMatrix[c.chapter]);
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

      {/* ============ MA TRẬN THEO CHƯƠNG × MỨC ĐỘ ============ */}
      <div className="space-y-2 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">Ma trận số câu (theo Chương × Mức độ)</p>
        {chapterIds.length === 0 ? (
          <p className="text-sm text-slate-400">
            Chọn ít nhất 1 chương ở trên để bắt đầu điền ma trận.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-xs">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 px-2 py-2 text-left font-medium text-slate-600">
                    Chương
                  </th>
                  {Object.values(DIFFICULTY_LEVELS).map((level) => (
                    <th key={level.key} className="border-b border-slate-200 px-2 py-2 text-center font-medium text-slate-600">
                      <div>{LEVEL_SHORT_LABEL[level.key]}</div>
                      <select
                        value={typeByLevel[level.key]}
                        onChange={(e) => setTypeByLevel((m) => ({ ...m, [level.key]: e.target.value }))}
                        className="mt-1 rounded border border-slate-300 px-1 py-0.5 text-[11px]"
                      >
                        <option value="trac_nghiem">Trắc nghiệm</option>
                        <option value="tu_luan">Tự luận</option>
                      </select>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chapterIds.map((cId) => {
                  const chapterMeta = availableChapters.find((c) => c.chapter === cId);
                  const rowLabel = chapterMeta?.isAdvancedBook ? "📘 Sách nâng cao" : `Chương ${cId}`;
                  return (
                    <tr key={cId}>
                      <td className="border-b border-slate-100 px-2 py-1.5 font-medium text-slate-700">{rowLabel}</td>
                      {Object.keys(DIFFICULTY_LEVELS).map((lvl) => (
                        <td key={lvl} className="border-b border-slate-100 px-2 py-1.5 text-center">
                          <input
                            type="number"
                            min={0}
                            value={chapterMatrix[cId][lvl]}
                            onChange={(e) => updateCell(cId, lvl, e.target.value)}
                            className="w-14 rounded border border-slate-300 px-1 py-1 text-center"
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td className="px-2 py-1.5 font-semibold text-slate-700">Tổng theo mức độ</td>
                  {Object.keys(DIFFICULTY_LEVELS).map((lvl) => (
                    <td key={lvl} className="px-2 py-1.5 text-center font-semibold text-slate-700">
                      {columnTotals[lvl]}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        )}
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
