"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, Upload, CheckCircle2, XCircle } from "lucide-react";
import { SUBJECTS } from "@/data/config";
import {
  LESSON_PLAN_GRADES,
  COLUMN_MODE_OPTIONS,
  LESSON_PLAN_COLUMN_MODES,
  LESSON_TYPES,
  isPreschoolGrade,
  getCircularForGrade,
} from "@/data/lessonPlanTemplates";
import { listIntegrations } from "@/data/lessonPlanIntegrations";
import { buildLessonPlanBlueprint } from "@/data/lessonPlanBlueprint";
import { buildLessonPlanResult } from "@/data/lessonPlanResult";
import { getSession } from "@/services/authService";
import {
  fetchChaptersRequest,
  generateLessonPlanRequest,
  analyzeLessonPlanSampleRequest,
} from "@/services/apiClient";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

// Khớp sampleMode phía server (lessonPlanOrchestrator.js/lessonPlanPromptTemplates.js).
const SAMPLE_MODES = [
  { value: "theo_chuong", label: "Không dùng mẫu", hint: "Mặc định - soạn theo khung chuẩn" },
  { value: "theo_mau", label: "Bám sát mẫu", hint: "Ưu tiên cách trình bày của giáo án mẫu" },
  { value: "ket_hop", label: "Kết hợp mẫu + SGK", hint: "Trình bày theo mẫu, nội dung bám SGK" },
];

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
  const [lessonType, setLessonType] = useState("bai_moi");
  const [noiDungCotLoi, setNoiDungCotLoi] = useState("");
  const [selectedIntegrations, setSelectedIntegrations] = useState([
    "khoiDongSoiNoi",
    "phuongPhapTichCuc",
    "cungCo",
    "phieuHocTap",
  ]);

  const [sampleMode, setSampleMode] = useState("theo_chuong");
  const [sampleFile, setSampleFile] = useState(null);
  const [sampleSpec, setSampleSpec] = useState(null);
  const [sampleReferenceText, setSampleReferenceText] = useState(null);
  const [sampleFromCache, setSampleFromCache] = useState(false);
  const [analyzingSample, setAnalyzingSample] = useState(false);
  const [sampleError, setSampleError] = useState("");

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

  // Phân tích giáo án mẫu ngay khi giáo viên chọn file - cùng tinh thần handleSampleFileChange()
  // bên ExamMatrixForm.jsx: báo lỗi/kết quả ngay, không chờ tới lúc bấm "Tạo bài dạy".
  async function handleSampleFileChange(e) {
    const file = e.target.files?.[0] || null;
    setSampleFile(file);
    setSampleSpec(null);
    setSampleReferenceText(null);
    setSampleError("");
    if (!file) return;

    const session = getSession();
    if (!session) {
      setSampleError("Phiên đăng nhập đã hết, vui lòng tải lại trang và đăng nhập lại.");
      return;
    }

    setAnalyzingSample(true);
    try {
      const data = await analyzeLessonPlanSampleRequest({ username: session.username, file });
      setSampleSpec(data.spec);
      setSampleReferenceText(data.referenceText || null);
      setSampleFromCache(Boolean(data.fromCache));
    } catch (err) {
      setSampleError(err.message);
    } finally {
      setAnalyzingSample(false);
    }
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
    if (sampleMode !== "theo_chuong" && !sampleSpec) {
      setError(
        analyzingSample
          ? "Đang phân tích giáo án mẫu, vui lòng đợi xong rồi bấm Tạo bài dạy lại."
          : "Vui lòng upload giáo án mẫu và chờ phân tích xong, hoặc chuyển về \"Không dùng mẫu\"."
      );
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
      lessonType: preschool ? "bai_moi" : lessonType,
      sampleMode,
      sampleSpec: sampleMode !== "theo_chuong" ? sampleSpec : null,
      sampleReferenceText: sampleMode === "theo_mau" ? sampleReferenceText : null,
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
          lessonType: preschool ? "bai_moi" : lessonType,
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

      <div className="grid grid-cols-2 gap-3">
        <Field label="Số cột kế hoạch bài dạy">
          <select value={columnMode} onChange={(e) => setColumnMode(e.target.value)} className={inputClass}>
            {COLUMN_MODE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
        {!preschool && (
          <Field label="Loại bài">
            <select value={lessonType} onChange={(e) => setLessonType(e.target.value)} className={inputClass}>
              {LESSON_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">
              {LESSON_TYPES.find((t) => t.value === lessonType)?.hint}
              {" — hoạt động thứ 2 sẽ đổi tên thành \""}
              {LESSON_TYPES.find((t) => t.value === lessonType)?.activityLabel}
              {"\" cho đúng bản chất bài dạy."}
            </p>
          </Field>
        )}
      </div>

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

      {/* ============ GIÁO ÁN MẪU (TUỲ CHỌN) ============ */}
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Giáo án mẫu (tuỳ chọn)</p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_MODES.map((m) => (
            <label
              key={m.value}
              className={`cursor-pointer rounded-md border px-3 py-2 text-xs transition ${
                sampleMode === m.value
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="lessonPlanSampleMode"
                value={m.value}
                checked={sampleMode === m.value}
                onChange={(e) => setSampleMode(e.target.value)}
                className="sr-only"
              />
              <span className="block font-medium">{m.label}</span>
              <span className="block text-slate-500">{m.hint}</span>
            </label>
          ))}
        </div>

        {sampleMode !== "theo_chuong" && (
          <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <Upload size={15} />
              <span>{sampleFile ? sampleFile.name : "Chọn file giáo án mẫu (.docx, .pdf, hoặc ảnh chụp)"}</span>
              <input
                type="file"
                accept=".docx,.pdf,image/*"
                onChange={handleSampleFileChange}
                className="sr-only"
              />
            </label>

            {analyzingSample && (
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 size={13} className="animate-spin" /> Đang phân tích cách trình bày giáo án mẫu...
              </p>
            )}

            {sampleError && (
              <p className="flex items-start gap-2 text-xs text-red-600">
                <XCircle size={13} className="mt-0.5 shrink-0" /> {sampleError}
              </p>
            )}

            {sampleSpec && !analyzingSample && (
              <div className="flex items-start gap-2 text-xs text-emerald-700">
                <CheckCircle2 size={13} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">
                    Đã phân tích xong{sampleFromCache ? " (lấy từ cache, không tốn thêm lượt AI)" : ""}.
                  </p>
                  {sampleSpec.sectionHeadings?.length > 0 && (
                    <p>Đề mục: {sampleSpec.sectionHeadings.join(" → ")}</p>
                  )}
                  {sampleSpec.presentationNotes && <p>Trình bày: {sampleSpec.presentationNotes}</p>}
                </div>
              </div>
            )}
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
        {loading ? "Đang soạn giáo án..." : "🌙 BẮT ĐẦU TẠO BÀI DẠY"}
      </button>
    </form>
  );
}
