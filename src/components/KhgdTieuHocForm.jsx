"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Sparkles } from "lucide-react";
import { getSubjectsForGrade } from "@/data/config";
import { buildKhgdTieuHocBlueprint } from "@/data/khgdTieuHocBlueprint";
import { buildKhgdTieuHocResult } from "@/data/khgdTieuHocResult";
import { getEffectiveSession } from "@/services/authService";
import { fetchChaptersRequest, fetchLessonsRequest, generateKhgdTieuHocRequest } from "@/services/apiClient";

/**
 * KhgdTieuHocForm.jsx
 * Form nhập liệu tab "Khung KHGD - Tiểu học" (Phụ lục 2, CV2345/2021/BGDĐT-GDTH) - Lớp 1-5.
 * KHÁC KhgdForm.jsx (THCS/THPT): có thêm "Chủ đề/Mạch nội dung" + "Tiết PPCT" (tự tính cộng dồn
 * theo Số tiết, giáo viên sửa được), KHÔNG có Thiết bị dạy học/Địa điểm/SWD/NLS riêng, chỉ 1
 * công tắc lồng ghép DUY NHẤT ("Nội dung điều chỉnh cần thiết") - đúng mẫu thật đã đối chiếu.
 */

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";
const TIEU_HOC_GRADES = [1, 2, 3, 4, 5];

let rowIdCounter = 0;
function nextRowId() {
  rowIdCounter += 1;
  return `th-row-${Date.now()}-${rowIdCounter}`;
}

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

/** Tự tính lại "Tiết PPCT" = số cộng dồn theo "Số tiết" từng dòng, tính từ dòng 1. */
function recomputeTietPPCT(rows) {
  let running = 0;
  return rows.map((r) => {
    const soTiet = Number(r.soTiet) || 1;
    running += soTiet;
    return { ...r, tietPPCT: running };
  });
}

export default function KhgdTieuHocForm({ onGenerated }) {
  const [subject, setSubject] = useState("Tieng_Viet");
  const [grade, setGrade] = useState(2);
  const [volume, setVolume] = useState(1);

  const availableSubjects = getSubjectsForGrade(grade);
  useEffect(() => {
    if (!availableSubjects.some((s) => s.value === subject)) {
      setSubject(availableSubjects[0]?.value || "Tieng_Viet");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade]);

  const [truong, setTruong] = useState("");
  const [to, setTo] = useState("");
  const [giaoVien, setGiaoVien] = useState("");
  const [namHoc, setNamHoc] = useState("");
  const [enableDieuChinh, setEnableDieuChinh] = useState(true);

  const [availableChapters, setAvailableChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [chaptersError, setChaptersError] = useState("");
  const [loadingLessonsFor, setLoadingLessonsFor] = useState(null);

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadChapters() {
      setLoadingChapters(true);
      setChaptersError("");
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

  function makeEmptyRow(overrides = {}) {
    return { id: nextRowId(), chuDe: "", tenBai: "", tuan: "", soTiet: 1, tietPPCT: "", ...overrides };
  }

  function addLessonRow() {
    setLessons((prev) => recomputeTietPPCT([...prev, makeEmptyRow()]));
  }

  function removeLessonRow(id) {
    setLessons((prev) => recomputeTietPPCT(prev.filter((l) => l.id !== id)));
  }

  function updateLessonField(id, field, value) {
    setLessons((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, [field]: value } : l));
      return field === "soTiet" ? recomputeTietPPCT(next) : next;
    });
  }

  async function loadLessonsFromChapter(chapterId, chapterLabel) {
    setLoadingLessonsFor(chapterId);
    try {
      const data = await fetchLessonsRequest({ grade, subject, volume, chapter: chapterId });
      const found = data.lessons || [];
      if (found.length === 0) {
        setError(`Chương/Chủ đề "${chapterLabel}" chưa có gợi ý tên bài sẵn - vui lòng tự thêm dòng và gõ tay.`);
        return;
      }
      setError("");
      setLessons((prev) =>
        recomputeTietPPCT([...prev, ...found.map((l) => makeEmptyRow({ tenBai: l.tenBai || "", chuDe: chapterLabel }))])
      );
    } catch {
      setError(`Không tải được gợi ý tên bài cho "${chapterLabel}" - vui lòng tự thêm dòng và gõ tay.`);
    } finally {
      setLoadingLessonsFor(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validLessons = lessons.filter((l) => l.tenBai.trim());
    if (validLessons.length === 0) {
      setError("Vui lòng thêm ít nhất 1 bài học trước khi tạo.");
      return;
    }

    const session = getEffectiveSession();
    if (!session) {
      setError("Phiên đăng nhập đã hết, vui lòng tải lại trang và đăng nhập lại.");
      return;
    }

    setLoading(true);
    try {
      const blueprint = buildKhgdTieuHocBlueprint({
        subject,
        grade,
        truong,
        to,
        giaoVien,
        namHoc,
        enableDieuChinh,
        lessons: validLessons,
      });
      const data = await generateKhgdTieuHocRequest(blueprint);
      const meta = { subject, grade, truong, to, giaoVien, namHoc, enableDieuChinh };
      onGenerated(buildKhgdTieuHocResult(data, meta, validLessons));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">Môn / Lớp (Tiểu học)</p>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Môn học">
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass}>
              {availableSubjects.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Lớp">
            <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} className={inputClass}>
              {TIEU_HOC_GRADES.map((g) => (
                <option key={g} value={g}>
                  Lớp {g}
                </option>
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
        <p className="text-sm font-semibold text-slate-800">Thông tin đơn vị</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Trường">
            <input value={truong} onChange={(e) => setTruong(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Tổ chuyên môn">
            <input value={to} onChange={(e) => setTo(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Họ tên giáo viên">
            <input value={giaoVien} onChange={(e) => setGiaoVien(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Năm học" hint='VD: "2026-2027"'>
            <input value={namHoc} onChange={(e) => setNamHoc(e.target.value)} className={inputClass} placeholder="2026-2027" />
          </Field>
        </div>
      </div>

      <div className="space-y-3 border-b border-slate-100 pb-5">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={enableDieuChinh} onChange={(e) => setEnableDieuChinh(e.target.checked)} />
          Nhờ AI gợi ý "Nội dung điều chỉnh cần thiết" (lồng ghép KNS/GDĐP/BVMT/công dân số...) cho các bài phù hợp
        </label>
      </div>

      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">Bảng kế hoạch dạy học</p>

        {loadingChapters && (
          <p className="flex items-center gap-2 text-sm text-slate-400">
            <Loader2 size={14} className="animate-spin" /> Đang tải danh sách chương...
          </p>
        )}
        {chaptersError && <p className="text-sm text-red-600">{chaptersError}</p>}
        <div className="flex flex-wrap gap-2">
          {availableChapters.map((c) => (
            <button
              key={c.chapter}
              type="button"
              disabled={loadingLessonsFor !== null}
              onClick={() => loadLessonsFromChapter(c.chapter, c.label || `Chương ${c.chapter}`)}
              className="flex items-center gap-1 rounded-full border border-brand-300 bg-brand-50 px-3 py-1 text-xs text-brand-700 transition hover:bg-brand-100 disabled:opacity-50"
            >
              {loadingLessonsFor === c.chapter ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              {c.label || `Chương ${c.chapter}`}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Bấm 1 chương để nạp gợi ý tên bài, hoặc "+ Thêm dòng" để tự gõ. Cột "Tiết PPCT" tự tính
          cộng dồn theo "Số tiết" từng dòng - bạn có thể sửa tay nếu cần.
        </p>

        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full min-w-[820px] text-xs">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="w-24 p-2 text-left">Tuần</th>
                <th className="w-32 p-2 text-left">Chủ đề</th>
                <th className="p-2 text-left">Tên bài</th>
                <th className="w-16 p-2 text-left">Số tiết</th>
                <th className="w-20 p-2 text-left">Tiết PPCT</th>
                <th className="w-8 p-2"></th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((l) => (
                <tr key={l.id} className="border-t border-slate-100">
                  <td className="p-1">
                    <input value={l.tuan} onChange={(e) => updateLessonField(l.id, "tuan", e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1" placeholder="Tuần 1" />
                  </td>
                  <td className="p-1">
                    <input value={l.chuDe} onChange={(e) => updateLessonField(l.id, "chuDe", e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1" />
                  </td>
                  <td className="p-1">
                    <input value={l.tenBai} onChange={(e) => updateLessonField(l.id, "tenBai", e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1" placeholder="Tên bài học" />
                  </td>
                  <td className="p-1">
                    <input value={l.soTiet} onChange={(e) => updateLessonField(l.id, "soTiet", e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1" />
                  </td>
                  <td className="p-1">
                    <input value={l.tietPPCT} onChange={(e) => updateLessonField(l.id, "tietPPCT", e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1" />
                  </td>
                  <td className="p-1 text-center">
                    <button type="button" onClick={() => removeLessonRow(l.id)} title="Xoá dòng">
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addLessonRow}
          className="flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
        >
          <Plus size={14} /> Thêm dòng
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? "Đang soạn..." : "Tạo Khung KHGD Tiểu học"}
      </button>
    </form>
  );
}
