"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Sparkles, CalendarClock } from "lucide-react";
import { getSubjectsForGrade } from "@/data/config";
import { buildKhgdTieuHocBlueprint } from "@/data/khgdTieuHocBlueprint";
import { buildKhgdTieuHocResult } from "@/data/khgdTieuHocResult";
import { getEffectiveSession } from "@/services/authService";
import { planYear, formatScheduleSummary, parseTietPerWeek, normalizeHocKi, recomputeTuanTiet } from "@/services/khgdSchedule";
import { buildTieuHocSchedulePolicy, getTieuHocDefaultTietPerWeek } from "@/services/khgdTieuHocSchedulePolicy";
import {
  fetchChaptersRequest,
  fetchLessonsRequest,
  fetchKhgdTieuHocOutlineRequest,
  generateKhgdTieuHocRequest,
} from "@/services/apiClient";

/**
 * KhgdTieuHocForm.jsx
 * Form nhập liệu tab "Khung KHGD - Tiểu học" (Phụ lục 2, CV2345/2021/BGDĐT-GDTH) - Lớp 1-5.
 * KHÁC KhgdForm.jsx (THCS/THPT): có thêm "Chủ đề/Mạch nội dung" + "Tuần"/"Ghi chú" (2 cột này TỰ
 * ĐỘNG tính theo "Số tiết/tuần" giáo viên khai báo - xem recomputeTietPPCT(), sửa ở Phiên 48 sau
 * khi giáo viên test thật phát hiện cột "Tuần" bị bỏ trống hoàn toàn vì trước đó phải gõ tay),
 * KHÔNG có Thiết bị dạy học/Địa điểm/SWD/NLS riêng, chỉ 1 công tắc lồng ghép DUY NHẤT ("Nội dung
 * điều chỉnh cần thiết") - đúng mẫu thật đã đối chiếu.
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

/** Tự tính lại "Tuần" + "Ghi chú" (Tiết PPCT, chạy suốt năm) theo "Số tiết" từng dòng + "Số tiết/tuần" giáo
 * viên khai báo. Phiên 50: tính RIÊNG từng học kì (`hocKi` của dòng - Tập 1 = HK I, Tập 2 = HK II): HK II bắt đầu từ
 * Tuần 19 / tiết 18×tiết/tuần+1 (trước đây Tập 2 cũng bắt đầu từ Tuần 1). Chưa khai báo số tiết/tuần → KHÔNG đoán
 * (giữ nguyên ô Tuần/Ghi chú) - trước đây mặc định cứng 10 tiết/tuần, sai với mọi môn ngoài Tiếng Việt Lớp 2.
 * Giáo viên vẫn sửa tay được từng ô nếu auto-tính chưa đúng thực tế lớp mình. */
function recomputeTietPPCT(rows, tietPerWeek) {
  return recomputeTuanTiet(rows, tietPerWeek);
}

const isReviewRow = (l) => l.loai === "onTap" || l.loai === "kiemTra";

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
  const [tietPerWeek, setTietPerWeek] = useState(() => {
    const d = getTieuHocDefaultTietPerWeek("Tieng_Viet", 2);
    return d != null ? String(d) : "";
  });
  const [planInfo, setPlanInfo] = useState(null); // { lines: string[], warnings: string[] } sau khi bấm "Tự tính số tiết..."

  // Đổi Môn/Lớp → gợi ý số tiết/tuần theo bảng đã có căn cứ; môn/khối chưa có căn cứ → để TRỐNG cho giáo viên tự nhập
  useEffect(() => {
    const d = getTieuHocDefaultTietPerWeek(subject, grade);
    setTietPerWeek(d != null ? String(d) : "");
    setPlanInfo(null);
  }, [subject, grade]);

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
    return {
      id: nextRowId(),
      chuDe: "",
      tenBai: "",
      tuan: "",
      soTiet: 1,
      tietPPCT: "",
      nhomTiet: "",
      // Phiên 50 - dữ liệu xếp lịch: học kì (theo Tập), chương nguồn, khối Bài, số tiết đã chốt?, loại dòng
      hocKi: volume,
      chuongId: "",
      blockKey: "",
      tietChot: false,
      loai: "baiHoc",
      ...overrides,
    };
  }

  function addLessonRow() {
    setLessons((prev) => recomputeTietPPCT([...prev, makeEmptyRow()], tietPerWeek));
  }

  function removeLessonRow(id) {
    setLessons((prev) => recomputeTietPPCT(prev.filter((l) => l.id !== id), tietPerWeek));
  }

  function updateLessonField(id, field, value) {
    setLessons((prev) => {
      // Giáo viên tự sửa "Số tiết" → coi là ĐÃ CHỐT: lần "Tự tính số tiết" sau không chia lại dòng này
      const next = prev.map((l) => (l.id === id ? { ...l, [field]: value, ...(field === "soTiet" ? { soTietSuaTay: true } : {}) } : l));
      return field === "soTiet" ? recomputeTietPPCT(next, tietPerWeek) : next;
    });
  }

  /** Đổi "Số tiết/tuần" -> tính lại Tuần/Ghi chú cho TOÀN BỘ bảng (ghi đè sửa tay trước đó, xem
   * giải thích trong recomputeTietPPCT()). */
  function handleTietPerWeekChange(value) {
    setTietPerWeek(value);
    setPlanInfo(null);
    setLessons((prev) => recomputeTietPPCT(prev, value));
  }

  /**
   * Nạp gợi ý của 1 chương (Phiên 48b). Ưu tiên đọc TRỰC TIẾP Markdown SGK (/api/khgd-tieu-hoc-outline):
   * lấy "Chủ đề" đúng tên trong SGK (thay vì "Chương n") và - với môn đã có bộ đọc riêng (hiện Tiếng
   * Việt) - các dòng theo tiết. Không có rows (môn chưa hỗ trợ / Markdown lạ / lỗi mạng) → quay về
   * luồng cũ nạp tên bài từ `chuong_{n}_bai.json`, chỉ khác là Chủ đề vẫn ưu tiên tên lấy từ Markdown.
   */
  async function loadLessonsFromChapter(chapterId, chapterLabel) {
    setLoadingLessonsFor(chapterId);
    try {
      let outline = null;
      try {
        outline = await fetchKhgdTieuHocOutlineRequest({ grade, subject, volume, chapter: chapterId });
      } catch {
        outline = null; // gợi ý phụ trợ - lỗi thì âm thầm quay về luồng cũ
      }
      const chuDe = outline?.chuDe || chapterLabel;

      if (outline?.rows?.length > 0) {
        setError("");
        setLessons((prev) =>
          recomputeTietPPCT(
            [
              ...prev,
              ...outline.rows.map((r) =>
                makeEmptyRow({
                  tenBai: r.tenBai || "",
                  // Dòng ôn tập/đánh giá lấy từ SGK không thuộc Chủ đề nào
                  chuDe: r.loai === "onTap" ? "" : chuDe,
                  soTiet: r.soTiet || 1,
                  // Khoá nhóm phải khác nhau giữa các chương (cùng "b1-1" có thể lặp ở chương khác)
                  nhomTiet: r.nhomTiet ? `${chapterId}:${r.nhomTiet}` : "",
                  chuongId: chapterId,
                  blockKey: r.blockKey ? `${chapterId}:${r.blockKey}` : "",
                  soBai: r.soBai ?? null,
                  tietChot: r.tietChot === true,
                  loai: r.loai || "baiHoc",
                  nguon: r.nguon || undefined,
                  moc: r.moc || undefined,
                  coKiemTra: r.coKiemTra || undefined,
                })
              ),
            ],
            tietPerWeek
          )
        );
        return;
      }

      const data = await fetchLessonsRequest({ grade, subject, volume, chapter: chapterId });
      const found = data.lessons || [];
      if (found.length === 0) {
        setError(`Chương/Chủ đề "${chapterLabel}" chưa có gợi ý tên bài sẵn - vui lòng tự thêm dòng và gõ tay.`);
        return;
      }
      setError("");
      setLessons((prev) =>
        recomputeTietPPCT(
          [...prev, ...found.map((l) => makeEmptyRow({ tenBai: l.tenBai || "", chuDe, chuongId: chapterId, blockKey: `${chapterId}:${l.soBai ?? l.tenBai}` }))],
          tietPerWeek
        )
      );
    } catch {
      setError(`Không tải được gợi ý tên bài cho "${chapterLabel}" - vui lòng tự thêm dòng và gõ tay.`);
    } finally {
      setLoadingLessonsFor(null);
    }
  }

  /**
   * "Tự tính số tiết & xếp Ôn tập/Kiểm tra định kì" (Phiên 50). Chạy theo TỪNG HỌC KÌ (Tập 1 = HK I, Tập 2 = HK II):
   * quỹ tiết = số tiết/tuần × 18 (HK I) hoặc 17 (HK II) tuần; bài chưa chốt số tiết được chia đều phần quỹ còn lại;
   * dòng ôn tập/đánh giá có trong Markdown SGK được giữ, chưa có thì ĐỀ XUẤT thêm (viền vàng, sửa/xoá được). Bấm lại
   * nhiều lần cho cùng kết quả (đề xuất cũ được thay); số tiết giáo viên tự sửa được giữ nguyên.
   */
  function handleAutoSchedule() {
    setError("");
    const tpw = parseTietPerWeek(tietPerWeek);
    if (!tpw) {
      setError("Vui lòng nhập \"Số tiết/tuần\" của môn (theo kế hoạch giáo dục nhà trường) trước khi tự tính số tiết.");
      return;
    }
    const usable = lessons.filter((l) => l.tenBai.trim());
    if (usable.length === 0) {
      setError("Chưa có bài học nào trong bảng - hãy bấm 1 chương để nạp gợi ý từ SGK trước.");
      return;
    }

    const result = planYear({
      rows: usable,
      tietPerWeek: tpw,
      policyFor: () => buildTieuHocSchedulePolicy({ subject, grade }),
      makeId: nextRowId,
    });
    setLessons(result.rows);

    // Cảnh báo chưa nạp đủ chương của Tập đang chọn (số tiết mỗi bài sẽ bị phóng đại nếu thiếu chương)
    const warnings = [...result.warnings];
    const inVolume = result.rows.filter((l) => normalizeHocKi(l.hocKi) === normalizeHocKi(volume) && l.chuongId);
    if (availableChapters.length > 0 && inVolume.length > 0) {
      const loaded = new Set(inVolume.map((l) => l.chuongId));
      const missing = availableChapters.filter((c) => !loaded.has(c.chapter));
      if (missing.length > 0) {
        warnings.push(
          `Tập ${volume}: mới nạp ${availableChapters.length - missing.length}/${availableChapters.length} chương (chưa nạp: ${missing
            .map((c) => c.label || `Chương ${c.chapter}`)
            .join(", ")}). Nạp đủ chương rồi bấm tính lại để số tiết mỗi bài chính xác.`
        );
      }
    }
    setPlanInfo({ lines: [1, 2].filter((hk) => result.summaries[hk]).map((hk) => formatScheduleSummary(result.summaries[hk])), warnings });
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
      // Dòng Ôn tập/Kiểm tra KHÔNG gửi AI (không cần "Nội dung điều chỉnh", tiết kiệm quota) - vẫn có mặt trong bảng kết quả
      const aiLessons = validLessons.filter((l) => !isReviewRow(l));
      const data =
        aiLessons.length > 0
          ? await generateKhgdTieuHocRequest({ ...blueprint, lessons: aiLessons })
          : { lessons: [], warnings: [] };
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
        <Field
          label="Số tiết/tuần (để tự tính cột Tuần + Ghi chú + quỹ tiết học kì)"
          hint="Theo kế hoạch giáo dục nhà trường (VD Tiếng Việt Lớp 2 KNTT: 10 tiết/tuần). Chỉ điền sẵn những môn/khối đã có căn cứ - môn khác vui lòng tự nhập. Đổi số này sẽ tính lại Tuần/Ghi chú cho TOÀN BỘ bảng."
        >
          <input
            type="number"
            min={0.5}
            step="any"
            value={tietPerWeek}
            onChange={(e) => handleTietPerWeekChange(e.target.value)}
            className={`${inputClass} max-w-[140px]`}
            placeholder="VD: 5"
          />
        </Field>
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
          Bấm 1 chương để nạp gợi ý từ sách giáo khoa (Chủ đề lấy đúng tên trong SGK). Môn Tiếng Việt nạp
          sẵn từng tiết (Đọc/Viết/Nói và nghe/Luyện từ và câu...), Tiếng Anh nạp từng Lesson, các môn còn
          lại nạp từng Bài. Nạp ĐỦ các chương của Tập (Tập 1 = Học kì I, Tập 2 = Học kì II) rồi bấm nút
          &quot;Tự tính số tiết&quot; bên dưới. Hoặc bấm &quot;+ Thêm dòng&quot; để tự gõ. Cột &quot;Tuần&quot; và
          &quot;Ghi chú&quot; TỰ ĐỘNG tính theo &quot;Số tiết/tuần&quot; - bạn vẫn sửa tay được.
        </p>

        <div className="space-y-2 rounded-md border border-amber-200 bg-amber-50 p-3">
          <button
            type="button"
            onClick={handleAutoSchedule}
            className="flex items-center gap-1 rounded-md border border-amber-400 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
          >
            <CalendarClock size={14} /> Tự tính số tiết &amp; xếp Ôn tập / Kiểm tra định kì
          </button>
          <p className="text-xs text-amber-900">
            Quỹ tiết mỗi học kì = số tiết/tuần × 18 tuần (HK I) hoặc 17 tuần (HK II). Bài chưa có số tiết được chia
            đều phần quỹ còn lại. Ôn tập/Đánh giá có trong SGK được giữ nguyên; nếu SGK không có, hệ thống ĐỀ XUẤT
            thêm (dòng viền vàng) - giữa kì khoảng Tuần 9 (HK I) / Tuần 27 (HK II), cuối kì ở cuối học kì; bài kiểm
            tra định kì chỉ thêm cho môn có bài kiểm tra theo Thông tư 27/2020 (Tiếng Việt, Toán, Ngoại ngữ 1, Lịch sử
            và Địa lí, Khoa học, Tin học và Công nghệ - Lớp 4-5 thêm giữa kì Tiếng Việt và Toán). Số tiết đề xuất chỉ
            là gợi ý, bạn sửa/xoá được; số tiết bạn đã tự sửa sẽ được giữ nguyên khi tính lại.
          </p>
          {planInfo && (
            <div className="space-y-1 text-xs">
              {planInfo.lines.map((line, i) => (
                <p key={i} className="font-medium text-slate-800">
                  {line}
                </p>
              ))}
              {planInfo.warnings.map((w, i) => (
                <p key={`w${i}`} className="text-red-600">
                  ⚠️ {w}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full min-w-[820px] text-xs">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="w-20 p-2 text-left">Tuần</th>
                <th className="w-32 p-2 text-left">Chủ đề</th>
                <th className="p-2 text-left">Tên bài</th>
                <th className="w-16 p-2 text-left">Số tiết</th>
                <th className="w-16 p-2 text-left">Ghi chú</th>
                <th className="w-8 p-2"></th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((l) => (
                <tr key={l.id} className={`border-t border-slate-100 ${l.deXuat ? "bg-amber-50 outline outline-1 -outline-offset-1 outline-amber-300" : ""}`}>
                  <td className="p-1">
                    <input value={l.tuan} onChange={(e) => updateLessonField(l.id, "tuan", e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1" placeholder="Tuần 1" />
                  </td>
                  <td className="p-1">
                    <input value={l.chuDe} onChange={(e) => updateLessonField(l.id, "chuDe", e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1" />
                  </td>
                  <td className="p-1">
                    <input value={l.tenBai} onChange={(e) => updateLessonField(l.id, "tenBai", e.target.value)} className="w-full rounded border border-slate-200 px-2 py-1" placeholder="Tên bài học" />
                    {l.deXuat && <p className="mt-1 text-[11px] text-amber-700">Đề xuất theo khung thời gian năm học - sửa hoặc xoá nếu nhà trường bố trí khác</p>}
                    {!l.deXuat && l.nguon === "sgk" && <p className="mt-1 text-[11px] text-emerald-700">Lấy từ SGK (Markdown)</p>}
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
