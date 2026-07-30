"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { SUBJECTS } from "@/data/config";
import {
  LESSON_PLAN_GRADES,
  COLUMN_MODE_OPTIONS,
  LESSON_PLAN_COLUMN_MODES,
  isPreschoolGrade,
  getCircularForGrade,
} from "@/data/lessonPlanTemplates";
import { listIntegrations } from "@/data/lessonPlanIntegrations";
import { buildLessonPlanBlueprint } from "@/data/lessonPlanBlueprint";
import { buildLessonPlanResult } from "@/data/lessonPlanResult";
import { fetchChaptersRequest, generateLessonPlanRequest } from "@/services/apiClient";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

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

export default function LessonPlanForm({ onGenerated }) {
  const [tenBai, setTenBai] = useState("");
  const [subject, setSubject] = useState("Toan");
  const [grade, setGrade] = useState(1);
  const [volume, setVolume] = useState(1);
  const [soTiet, setSoTiet] = useState(2);
  const [columnMode, setColumnMode] = useState(LESSON_PLAN_COLUMN_MODES.ONE_COLUMN);
  const [noiDungCotLoi, setNoiDungCotLoi] = useState("");
  const [selectedIntegrations, setSelectedIntegrations] = useState(["khoiDongSoiNoi", "phuongPhapTichCuc", "cungCo"]);

  const [availableChapters, setAvailableChapters] = useState([]);
  const [chapterId, setChapterId] = useState("");
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [chaptersError, setChaptersError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const preschool = isPreschoolGrade(grade);
  const circular = getCircularForGrade(grade);

  // Tự động tải danh sách bài/chương SGK khi Môn/Lớp/Tập đổi - bỏ qua với Mầm non (không có SGK theo chương)
  useEffect(() => {
    if (preschool) {
      setAvailableChapters([]);
      setChapterId("");
      return;
    }
    let cancelled = false;
    async function loadChapters() {
      setLoadingChapters(true);
      setChaptersError("");
      setChapterId("");
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
  }, [grade, subject, volume, preschool]);

  function toggleIntegration(key) {
    setSelectedIntegrations((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!tenBai.trim()) {
      setError("Vui lòng nhập Tên bài soạn.");
      return;
    }
    if (!noiDungCotLoi.trim()) {
      setError("Vui lòng nhập Nội dung cốt lõi.");
      return;
    }

    const blueprint = buildLessonPlanBlueprint({
      tenBai,
      subject: preschool ? null : subject,
      grade,
      volume,
      chapterId: preschool ? null : chapterId || null,
      soTiet,
      columnMode,
      noiDungCotLoi,
      integrations: selectedIntegrations,
    });

    setLoading(true);
    try {
      const data = await generateLessonPlanRequest(blueprint);
      onGenerated(
        buildLessonPlanResult(data, {
          tenBai,
          grade,
          subject: preschool ? null : subject,
          soTiet,
          columnMode,
          circularLabel: circular?.label || "Khung Kế hoạch hoạt động Mầm non",
        })
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Tên bài soạn" required>
        <input
          value={tenBai}
          onChange={(e) => setTenBai(e.target.value)}
          placeholder="VD: Bài 15 - Sự nở vì nhiệt của chất rắn"
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Lớp">
          <select
            value={grade}
            onChange={(e) => {
              const v = e.target.value;
              setGrade(v === "MAM_NON" ? v : Number(v));
            }}
            className={inputClass}
          >
            {LESSON_PLAN_GRADES.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Số tiết">
          <input
            type="number"
            min={1}
            value={soTiet}
            onChange={(e) => setSoTiet(Math.max(1, Number(e.target.value) || 1))}
            className={inputClass}
          />
        </Field>
      </div>

      {!preschool && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Môn học">
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass}>
              {SUBJECTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
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
      )}

      {!preschool && (
        <Field label="Bài/Chương trong SGK (tuỳ chọn)">
          <select
            value={chapterId}
            onChange={(e) => setChapterId(e.target.value)}
            className={inputClass}
            disabled={loadingChapters}
          >
            <option value="">
              {loadingChapters ? "Đang tải danh sách..." : "-- Không liên kết SGK (chỉ dùng Nội dung cốt lõi) --"}
            </option>
            {availableChapters.map((c) => (
              <option key={c.chapter} value={c.chapter}>
                {c.isAdvancedBook ? "Sách nâng cao (toàn bộ)" : `Chương/Bài ${c.chapter}`}
              </option>
            ))}
          </select>
          {chaptersError && <p className="mt-1 text-xs text-red-600">{chaptersError}</p>}
        </Field>
      )}

      <Field label="Số cột kế hoạch bài dạy">
        <select value={columnMode} onChange={(e) => setColumnMode(e.target.value)} className={inputClass}>
          {COLUMN_MODE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </Field>

      <Field label="Nội dung cốt lõi" required>
        <textarea
          value={noiDungCotLoi}
          onChange={(e) => setNoiDungCotLoi(e.target.value)}
          placeholder="Nhập các mục chính hoặc kiến thức trọng tâm..."
          rows={4}
          className={inputClass}
        />
      </Field>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tuỳ chọn nâng cao</p>
        <div className="grid grid-cols-2 gap-2">
          {listIntegrations().map((i) => {
            const checked = selectedIntegrations.includes(i.key);
            return (
              <label
                key={i.key}
                className={`flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition ${
                  checked ? "border-brand-400 bg-brand-50" : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <input type="checkbox" checked={checked} onChange={() => toggleIntegration(i.key)} className="mt-0.5" />
                <span>
                  <span className="block font-medium text-slate-800">{i.label}</span>
                  <span className="block text-xs text-slate-500">{i.description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? "Đang soạn giáo án..." : "🌙 BẮT ĐẦU TẠO BÀI DẠY"}
      </button>
    </form>
  );
}
