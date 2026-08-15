"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { SUBJECTS, GRADES } from "@/data/config";
import {
  OUTLINE_LEVEL_ORDER,
  OUTLINE_LEVEL_LABELS,
  DEFAULT_OUTLINE_EXERCISE_COUNTS,
  DEFAULT_OUTLINE_STUDY_DAYS,
  OUTLINE_SEMESTER_SHORTCUTS,
  splitChaptersBySemester,
} from "@/data/outlineTemplates";
import { buildOutlineBlueprint } from "@/data/outlineBlueprint";
import { buildOutlineResult } from "@/data/outlineResult";
import { getSession } from "@/services/authService";
import { fetchChaptersRequest, generateOutlineRequest } from "@/services/apiClient";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

function Field({ label, required, children, hint }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default function OutlineForm({ onGenerated }) {
  const [subject, setSubject] = useState("Toan");
  const [grade, setGrade] = useState(5);
  const [volume, setVolume] = useState(1);

  const [availableChapters, setAvailableChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [chaptersError, setChaptersError] = useState("");
  const [selectedChapterIds, setSelectedChapterIds] = useState([]);

  const [exerciseCounts, setExerciseCounts] = useState(DEFAULT_OUTLINE_EXERCISE_COUNTS);
  const [yeuCauDacBiet, setYeuCauDacBiet] = useState("");
  const [soNgayOnTap, setSoNgayOnTap] = useState(DEFAULT_OUTLINE_STUDY_DAYS);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Tự động tải danh sách bài/chương SGK khi Môn/Lớp/Tập đổi - reset lựa chọn vì chương đã đổi,
  // đúng hành vi ExamMatrixForm.jsx (Chọn kiến thức).
  useEffect(() => {
    let cancelled = false;
    async function loadChapters() {
      setLoadingChapters(true);
      setChaptersError("");
      setSelectedChapterIds([]);
      try {
        const data = await fetchChaptersRequest({ grade, subject, volume });
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
    setSelectedChapterIds((prev) =>
      prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]
    );
  }

  // "Phạm vi theo Học kỳ": bấm 1 nút để tự động chọn NHÓM chương tương ứng (xem giải thích quy
  // ước chia đôi TẠM THỜI trong outlineTemplates.js) - giáo viên vẫn có thể chỉnh tay sau đó.
  function applySemesterShortcut(semesterValue) {
    const split = splitChaptersBySemester(availableChapters);
    setSelectedChapterIds(split[semesterValue] || []);
  }

  function updateExerciseCount(level, value) {
    const n = Math.max(0, Number(value) || 0);
    setExerciseCounts((prev) => ({ ...prev, [level]: n }));
  }

  const totalExercises = OUTLINE_LEVEL_ORDER.reduce((sum, lv) => sum + (exerciseCounts[lv] || 0), 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (selectedChapterIds.length === 0) {
      setError('Vui lòng chọn ít nhất 1 Chương/Bài học ở mục "Phạm vi ôn tập".');
      return;
    }
    if (totalExercises === 0) {
      setError("Tổng số bài trong Ngân hàng bài tập phải lớn hơn 0.");
      return;
    }

    const session = getSession();
    if (!session) {
      setError("Phiên đăng nhập đã hết, vui lòng tải lại trang và đăng nhập lại.");
      return;
    }

    setLoading(true);
    try {
      const blueprint = buildOutlineBlueprint({
        subject,
        grade,
        volume,
        chapterIds: selectedChapterIds,
        exerciseCounts,
        yeuCauDacBiet,
        soNgayOnTap,
      });
      const data = await generateOutlineRequest(blueprint);

      const meta = {
        subject,
        grade,
        volume,
        chapterLabel: data.chapterLabel || "",
      };

      onGenerated(buildOutlineResult(data, meta));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">Môn / Lớp</p>
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
      </div>

      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">Phạm vi ôn tập</p>
        <div className="flex flex-wrap gap-2">
          {OUTLINE_SEMESTER_SHORTCUTS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => applySemesterShortcut(s.value)}
              disabled={loadingChapters || availableChapters.length === 0}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              📌 {s.label}
            </button>
          ))}
        </div>

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
            const selected = selectedChapterIds.includes(c.chapter);
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
        <p className="text-xs text-slate-500">
          Có thể chọn NHIỀU chương cùng lúc (ôn tập giữa/cuối kỳ) - AI sẽ gộp kiến thức của tất cả
          chương đã chọn vào cùng 1 đề cương.
        </p>
      </div>

      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">
          Ngân hàng bài tập 3 mức (Tổng: {totalExercises} bài)
        </p>
        <div className="grid grid-cols-3 gap-3">
          {OUTLINE_LEVEL_ORDER.map((level) => (
            <Field key={level} label={OUTLINE_LEVEL_LABELS[level]}>
              <input
                type="number"
                min={0}
                value={exerciseCounts[level]}
                onChange={(e) => updateExerciseCount(level, e.target.value)}
                className={inputClass}
              />
            </Field>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-b border-slate-100 pb-5">
        <Field
          label="Lộ trình Ôn tập — số ngày muốn ôn"
          hint='AI sẽ chia toàn bộ nội dung đề cương thành checklist nhiệm vụ theo từng ngày (VD: "Ngày 1: Đọc lý thuyết + làm 3 bài Mức Cơ bản"), tăng dần độ khó qua các ngày.'
        >
          <input
            type="number"
            min={1}
            value={soNgayOnTap}
            onChange={(e) => setSoNgayOnTap(Math.max(1, Number(e.target.value) || 1))}
            className={`${inputClass} max-w-[140px]`}
          />
        </Field>
      </div>

      <div className="space-y-3">
        <Field
          label="Yêu cầu đặc biệt (tuỳ chọn)"
          hint='VD: "Nhấn mạnh dạng toán có lời văn" hoặc "Thêm mẹo ghi nhớ bảng cửu chương".'
        >
          <textarea
            value={yeuCauDacBiet}
            onChange={(e) => setYeuCauDacBiet(e.target.value)}
            className={inputClass}
            rows={3}
          />
        </Field>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? "Đang soạn đề cương..." : "Tạo đề cương ôn tập"}
      </button>
    </form>
  );
}
