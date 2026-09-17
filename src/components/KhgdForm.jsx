"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Sparkles } from "lucide-react";
import { getSubjectsForGrade } from "@/data/config";
import { getKhgdSubjectDefaults } from "@/data/khgdSubjectDefaults";
import { buildKhgdBlueprint } from "@/data/khgdBlueprint";
import { buildKhgdResult } from "@/data/khgdResult";
import { getEffectiveSession } from "@/services/authService";
import { fetchChaptersRequest, fetchLessonsRequest, generateKhgdRequest } from "@/services/apiClient";

/**
 * KhgdForm.jsx
 * Form nhập liệu tab "Khung KHGD" (Phụ lục III, CV 5512/BGDĐT-GDTrH) - đợt đầu triển khai cho
 * TOÀN BỘ môn học cấp THCS (Lớp 6-9, xem NEXT_STEPS.md).
 *
 * ⚠️ ĐÃ CHỐT VỚI NGƯỜI DÙNG (khác OutlineForm.jsx): "Số tiết" + "Thời điểm" (tuần) của MỖI bài
 * học do GIÁO VIÊN TỰ GÕ TAY, KHÔNG do AI/GitHub tính - vì mỗi trường/giáo viên phân phối chương
 * trình khác nhau. Tên bài CHỈ là GỢI Ý lấy từ kho GitHub (nút "Nạp gợi ý tên bài từ SGK"), giáo
 * viên có thể sửa/xoá/thêm dòng tuỳ ý trước khi bấm "Tạo Khung KHGD" - AI CHỈ soạn thêm 2 cột
 * SWD/NLS cho danh sách bài đã chốt (xem khgdOrchestrator.js), không đụng vào số tiết/tuần.
 */

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";
const THCS_GRADES = [6, 7, 8, 9];

const DEFAULT_KIEM_TRA = [
  { ten: "Giữa Học kỳ 1", thoiGian: "60 phút", thoiDiem: "", yeuCauCanDat: "", hinhThuc: "Viết (giấy)" },
  { ten: "Cuối Học kỳ 1", thoiGian: "60 phút", thoiDiem: "", yeuCauCanDat: "", hinhThuc: "Viết (giấy)" },
  { ten: "Giữa Học kỳ 2", thoiGian: "60 phút", thoiDiem: "", yeuCauCanDat: "", hinhThuc: "Viết (giấy)" },
  { ten: "Cuối Học kỳ 2", thoiGian: "60 phút", thoiDiem: "", yeuCauCanDat: "", hinhThuc: "Viết (giấy)" },
];

let rowIdCounter = 0;
function nextRowId() {
  rowIdCounter += 1;
  return `row-${Date.now()}-${rowIdCounter}`;
}

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

export default function KhgdForm({ onGenerated }) {
  const [subject, setSubject] = useState("Tieng_Anh");
  const [grade, setGrade] = useState(7);
  const [volume, setVolume] = useState(1);

  const availableSubjects = getSubjectsForGrade(grade);
  useEffect(() => {
    if (!availableSubjects.some((s) => s.value === subject)) {
      setSubject(availableSubjects[0]?.value || "Toan");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade]);

  const [truong, setTruong] = useState("");
  const [to, setTo] = useState("");
  const [giaoVien, setGiaoVien] = useState("");
  const [namHoc, setNamHoc] = useState("");

  const [enableSwd, setEnableSwd] = useState(true);
  const [enableNls, setEnableNls] = useState(true);

  const [availableChapters, setAvailableChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [chaptersError, setChaptersError] = useState("");
  const [loadingLessonsFor, setLoadingLessonsFor] = useState(null);

  const [lessons, setLessons] = useState([]);
  const [kiemTraDinhKy, setKiemTraDinhKy] = useState(DEFAULT_KIEM_TRA);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Tải danh sách chương khi Môn/Lớp/Tập đổi - GIỐNG OutlineForm.jsx, nhưng KHÔNG tự xoá bảng
  // bài học đã nhập (khác Outline: giáo viên có thể đã gõ tay nhiều dòng, đổi Tập không nên mất
  // dữ liệu đang nhập dở).
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
    const defaults = getKhgdSubjectDefaults(subject);
    return {
      id: nextRowId(),
      tenBai: "",
      chuong: "",
      soTiet: "",
      tuan: "",
      thietBi: defaults.device,
      diaDiem: defaults.location,
      ...overrides,
    };
  }

  function addLessonRow() {
    setLessons((prev) => [...prev, makeEmptyRow()]);
  }

  function removeLessonRow(id) {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  }

  function updateLessonField(id, field, value) {
    setLessons((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }

  /**
   * "Nạp gợi ý tên bài từ SGK": tái dùng /api/lessons (ĐÃ có sẵn cho LessonPlanForm.jsx) để lấy
   * tên bài + nội dung cốt lõi trong 1 chương, rồi thêm mỗi bài thành 1 DÒNG MỚI vào bảng - giáo
   * viên tự điền số tiết/tuần sau đó. Lỗi tải (chương chưa có phụ lục) KHÔNG chặn thao tác, đây
   * chỉ là gợi ý phụ trợ - cùng tinh thần LessonPlanForm.jsx.
   */
  async function loadLessonsFromChapter(chapterId, chapterLabel) {
    setLoadingLessonsFor(chapterId);
    try {
      const data = await fetchLessonsRequest({ grade, subject, volume, chapter: chapterId });
      const found = data.lessons || [];
      if (found.length === 0) {
        setError(`Chương/Bài "${chapterLabel}" chưa có gợi ý tên bài sẵn - vui lòng tự thêm dòng và gõ tay.`);
        return;
      }
      setError("");
      setLessons((prev) => [
        ...prev,
        ...found.map((l) => makeEmptyRow({ tenBai: l.tenBai || "", chuong: chapterLabel })),
      ]);
    } catch {
      setError(`Không tải được gợi ý tên bài cho "${chapterLabel}" - vui lòng tự thêm dòng và gõ tay.`);
    } finally {
      setLoadingLessonsFor(null);
    }
  }

  function updateKiemTraField(index, field, value) {
    setKiemTraDinhKy((prev) => prev.map((k, i) => (i === index ? { ...k, [field]: value } : k)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validLessons = lessons.filter((l) => l.tenBai.trim());
    if (validLessons.length === 0) {
      setError('Vui lòng thêm ít nhất 1 bài học (mục "Phân phối chương trình") trước khi tạo.');
      return;
    }

    const session = getEffectiveSession();
    if (!session) {
      setError("Phiên đăng nhập đã hết, vui lòng tải lại trang và đăng nhập lại.");
      return;
    }

    setLoading(true);
    try {
      const blueprint = buildKhgdBlueprint({
        subject,
        grade,
        truong,
        to,
        giaoVien,
        namHoc,
        enableSwd,
        enableNls,
        lessons: validLessons,
        kiemTraDinhKy,
      });
      const data = await generateKhgdRequest(blueprint);

      const meta = {
        subject,
        grade,
        truong,
        to,
        giaoVien,
        namHoc,
        enableSwd,
        enableNls,
        kiemTraDinhKy,
      };

      onGenerated(buildKhgdResult(data, meta, validLessons));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">Môn / Lớp (THCS)</p>
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
              {THCS_GRADES.map((g) => (
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
            <input value={truong} onChange={(e) => setTruong(e.target.value)} className={inputClass} placeholder="VD: THCS Phú Túc" />
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
        <p className="text-sm font-semibold text-slate-800">Lồng ghép nội dung (AI soạn)</p>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={enableSwd} onChange={(e) => setEnableSwd(e.target.checked)} />
          Lồng ghép giáo dục học sinh khuyết tật (SWD) cho mỗi bài
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={enableNls} onChange={(e) => setEnableNls(e.target.checked)} />
          Lồng ghép Biểu hiện Năng lực số (NLS) — AI tự chọn bài phù hợp, không phải bài nào cũng có
        </label>
      </div>

      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">1. Phân phối chương trình</p>

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
              title="Nạp gợi ý tên bài từ SGK vào bảng bên dưới"
            >
              {loadingLessonsFor === c.chapter ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Sparkles size={12} />
              )}
              {c.label || `Chương ${c.chapter}`}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Bấm 1 chương để nạp gợi ý tên bài vào bảng bên dưới, hoặc bấm "+ Thêm dòng" để tự gõ. Số
          tiết/Thời điểm/Thiết bị/Địa điểm LUÔN do giáo viên tự nhập/sửa.
        </p>

        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full min-w-[720px] text-xs">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-2 text-left">Bài học</th>
                <th className="w-16 p-2 text-left">Số tiết</th>
                <th className="w-24 p-2 text-left">Thời điểm</th>
                <th className="w-40 p-2 text-left">Thiết bị dạy học</th>
                <th className="w-32 p-2 text-left">Địa điểm</th>
                <th className="w-8 p-2"></th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((l) => (
                <tr key={l.id} className="border-t border-slate-100">
                  <td className="p-1">
                    <input
                      value={l.tenBai}
                      onChange={(e) => updateLessonField(l.id, "tenBai", e.target.value)}
                      className="w-full rounded border border-slate-200 px-2 py-1"
                      placeholder="Tên bài học"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      value={l.soTiet}
                      onChange={(e) => updateLessonField(l.id, "soTiet", e.target.value)}
                      className="w-full rounded border border-slate-200 px-2 py-1"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      value={l.tuan}
                      onChange={(e) => updateLessonField(l.id, "tuan", e.target.value)}
                      className="w-full rounded border border-slate-200 px-2 py-1"
                      placeholder="Tuần 1"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      value={l.thietBi}
                      onChange={(e) => updateLessonField(l.id, "thietBi", e.target.value)}
                      className="w-full rounded border border-slate-200 px-2 py-1"
                    />
                  </td>
                  <td className="p-1">
                    <input
                      value={l.diaDiem}
                      onChange={(e) => updateLessonField(l.id, "diaDiem", e.target.value)}
                      className="w-full rounded border border-slate-200 px-2 py-1"
                    />
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

      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">2. Kiểm tra, đánh giá định kỳ</p>
        {kiemTraDinhKy.map((k, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 rounded-md border border-slate-200 p-2">
            <input
              value={k.ten}
              onChange={(e) => updateKiemTraField(i, "ten", e.target.value)}
              className="col-span-2 rounded border border-slate-200 px-2 py-1 text-xs font-semibold"
            />
            <input
              value={k.thoiGian}
              onChange={(e) => updateKiemTraField(i, "thoiGian", e.target.value)}
              placeholder="Thời gian (VD: 60 phút)"
              className="rounded border border-slate-200 px-2 py-1 text-xs"
            />
            <input
              value={k.thoiDiem}
              onChange={(e) => updateKiemTraField(i, "thoiDiem", e.target.value)}
              placeholder="Thời điểm (VD: Tuần 9, Tiết 26,27)"
              className="rounded border border-slate-200 px-2 py-1 text-xs"
            />
            <input
              value={k.hinhThuc}
              onChange={(e) => updateKiemTraField(i, "hinhThuc", e.target.value)}
              placeholder="Hình thức"
              className="rounded border border-slate-200 px-2 py-1 text-xs"
            />
            <input
              value={k.yeuCauCanDat}
              onChange={(e) => updateKiemTraField(i, "yeuCauCanDat", e.target.value)}
              placeholder="Yêu cầu cần đạt"
              className="rounded border border-slate-200 px-2 py-1 text-xs"
            />
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? "Đang soạn SWD/NLS..." : "Tạo Khung KHGD"}
      </button>
    </form>
  );
}
