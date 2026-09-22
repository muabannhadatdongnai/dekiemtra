"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Sparkles, BookOpen, CalendarClock } from "lucide-react";
import { getSubjectsForGrade } from "@/data/config";
import { getKhgdSubjectDefaults } from "@/data/khgdSubjectDefaults";
import { buildKhgdBlueprint } from "@/data/khgdBlueprint";
import { buildKhgdResult } from "@/data/khgdResult";
import { getEffectiveSession } from "@/services/authService";
import { planYear, formatScheduleSummary, parseTietPerWeek, normalizeHocKi } from "@/services/khgdSchedule";
import {
  buildKhgdSchedulePolicy,
  getKhgdDefaultTietPerWeek,
  getKhgdKiemTraMinutes,
  applyScheduleToKiemTra,
  KHGD_NHAN_XET_SUBJECTS,
} from "@/services/khgdSchedulePolicy";
import {
  fetchChaptersRequest,
  fetchKhgdOutlineRequest,
  fetchLessonsRequest,
  generateKhgdRequest,
} from "@/services/apiClient";

/**
 * KhgdForm.jsx
 * Form nhập liệu tab "Khung KHGD" (Phụ lục III, CV 5512/BGDĐT-GDTrH) - áp dụng cho TOÀN BỘ môn
 * học cấp THCS + THPT (Lớp 6-12, mở rộng THPT ở Phiên 46 - xem khgdSubjectDefaults.js). KHÔNG áp
 * dụng cho Tiểu học (dùng mẫu khác hẳn theo CV2345/2021).
 *
 * ⚠️ Phiên 50 ĐỔI QUYẾT ĐỊNH CŨ ("Số tiết/Thời điểm do giáo viên tự gõ hoàn toàn"): sau phản hồi của Hoan ("chưa
 * thấy tự tính số tiết, chưa có đề xuất ôn tập/kiểm tra giữa kỳ, cuối kỳ") form có nút "Tự tính số tiết & đề xuất
 * Ôn tập/Kiểm tra" (khgdSchedule.js): quỹ tiết học kì = số tiết/tuần × 18 (HK I) hoặc 17 (HK II) tuần, bài chưa
 * có số tiết được chia đều phần quỹ còn lại, dòng Ôn tập/Kiểm tra được ĐỀ XUẤT (hoặc lấy từ Markdown SGK nếu có),
 * bảng "Kiểm tra, đánh giá định kỳ" tự điền Thời điểm/Thời gian/Yêu cầu cần đạt. MỌI con số đều chỉ là gợi ý -
 * giáo viên vẫn sửa/xoá/thêm dòng tuỳ ý (số tiết đã tự sửa được giữ nguyên khi tính lại). Tên bài là GỢI Ý lấy từ
 * kho GitHub (nút "Nạp gợi ý tên bài từ SGK"); AI CHỈ soạn thêm 2 cột SWD/NLS cho các dòng BÀI HỌC (không cho dòng
 * Ôn tập/Kiểm tra), không đụng vào số tiết/tuần.
 *
 * ⚠️ Phiên 49 - LUÔN ƯU TIÊN NỘI DUNG MARKDOWN CỦA BỘ MÔN: nút nạp chương giờ ĐỌC THẲNG file Markdown
 * SGK (/api/khgd-outline → khgdOutlineService.js) để lấy tên bài + `noiDung` (đoạn trích của từng bài,
 * gửi kèm lên AI để SWD/NLS bám sát nội dung thật, không chung chung). Thứ tự ưu tiên: (1) Markdown,
 * (2) phụ lục `chuong_{n}_bai.json` (dùng `noiDungCotLoi` làm `noiDung`), (3) giáo viên gõ tay.
 */

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";
// Phiên 46: mở rộng THCS+THPT (Lớp 6-12) - CV5512/BGDĐT-GDTrH áp dụng chung cho GDTrH (2 cấp),
// nên Phụ lục III KHÔNG đổi cấu trúc giữa THCS/THPT, chỉ cần mở dải khối. Tiểu học KHÔNG nằm
// trong dải này (dùng mẫu khác hẳn theo CV2345/2021, xem khgdSubjectDefaults.js).
const KHGD_GRADES = [6, 7, 8, 9, 10, 11, 12];

const isReviewRow = (l) => l.loai === "onTap" || l.loai === "kiemTra";

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

  // Phiên 50 - xếp lịch: số tiết/tuần (gợi ý sẵn CHỈ cho môn đã có căn cứ, còn lại để trống) + thời gian bài kiểm tra
  const [tietPerWeek, setTietPerWeek] = useState(() => {
    const d = getKhgdDefaultTietPerWeek("Tieng_Anh", 7);
    return d != null ? String(d) : "";
  });
  const [kiemTraMinutes, setKiemTraMinutes] = useState(() => String(getKhgdKiemTraMinutes(getKhgdDefaultTietPerWeek("Tieng_Anh", 7), "Tieng_Anh")));
  const [planInfo, setPlanInfo] = useState(null); // { lines: string[], warnings: string[] }

  const [availableChapters, setAvailableChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [chaptersError, setChaptersError] = useState("");
  const [loadingLessonsFor, setLoadingLessonsFor] = useState(null);

  const [lessons, setLessons] = useState([]);
  const [kiemTraDinhKy, setKiemTraDinhKy] = useState(DEFAULT_KIEM_TRA);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Đổi Môn/Lớp → gợi ý lại số tiết/tuần + thời gian kiểm tra (Thông tư 22/2021: môn ≤ 70 tiết/năm 45 phút, > 70 tiết/năm 60-90 phút)
  useEffect(() => {
    const d = getKhgdDefaultTietPerWeek(subject, grade);
    setTietPerWeek(d != null ? String(d) : "");
    setKiemTraMinutes(String(getKhgdKiemTraMinutes(d, subject)));
    setPlanInfo(null);
  }, [subject, grade]);

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
      noiDung: "", // đoạn trích Markdown SGK của bài (Phiên 49) - rỗng với dòng gõ tay
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
    setLessons((prev) => [...prev, makeEmptyRow()]);
  }

  function removeLessonRow(id) {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  }

  function updateLessonField(id, field, value) {
    // Giáo viên tự sửa "Số tiết" → coi là ĐÃ CHỐT: lần "Tự tính số tiết" sau không chia lại dòng này
    setLessons((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value, ...(field === "soTiet" ? { soTietSuaTay: true } : {}) } : l)));
  }

  /**
   * "Nạp gợi ý từ SGK" (Phiên 49): ƯU TIÊN đọc TRỰC TIẾP Markdown chương (/api/khgd-outline) → mỗi bài
   * thành 1 DÒNG MỚI kèm `noiDung` (trích từ Markdown, gửi lên AI khi tạo). Không nhận ra định dạng
   * Markdown/lỗi mạng → quay về luồng cũ /api/lessons (`chuong_{n}_bai.json`, dùng `noiDungCotLoi`
   * làm `noiDung`). Số tiết/tuần giáo viên tự điền sau. Lỗi tải KHÔNG chặn thao tác - chỉ là gợi ý phụ trợ.
   */
  async function loadLessonsFromChapter(chapterId, chapterLabel) {
    setLoadingLessonsFor(chapterId);
    try {
      let outline = null;
      try {
        outline = await fetchKhgdOutlineRequest({ grade, subject, volume, chapter: chapterId });
      } catch {
        outline = null; // gợi ý phụ trợ - lỗi thì âm thầm quay về luồng cũ
      }
      const chuong = outline?.chuong || chapterLabel;

      if (outline?.rows?.length > 0) {
        setError("");
        setLessons((prev) => [
          ...prev,
          ...outline.rows.map((r) =>
            makeEmptyRow({
              tenBai: r.tenBai || "",
              chuong: r.loai === "onTap" ? "" : chuong,
              noiDung: r.noiDung || "",
              soTiet: r.soTiet != null ? r.soTiet : "", // Tiếng Anh: 1 dòng = 1 tiết (đã chốt); môn khác để trống → tự chia theo quỹ tiết
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
        ]);
        return;
      }

      const data = await fetchLessonsRequest({ grade, subject, volume, chapter: chapterId });
      const found = data.lessons || [];
      if (found.length === 0) {
        setError(`Chương/Bài "${chapterLabel}" chưa có gợi ý tên bài sẵn - vui lòng tự thêm dòng và gõ tay.`);
        return;
      }
      setError("");
      setLessons((prev) => [
        ...prev,
        ...found.map((l) =>
          makeEmptyRow({ tenBai: l.tenBai || "", chuong, noiDung: l.noiDungCotLoi || "", chuongId: chapterId, blockKey: `${chapterId}:${l.soBai ?? l.tenBai}` })
        ),
      ]);
    } catch {
      setError(`Không tải được gợi ý tên bài cho "${chapterLabel}" - vui lòng tự thêm dòng và gõ tay.`);
    } finally {
      setLoadingLessonsFor(null);
    }
  }

  /**
   * "Tự tính số tiết & đề xuất Ôn tập/Kiểm tra" (Phiên 50) - xem khgdSchedule.js. Chạy theo TỪNG HỌC KÌ (Tập 1 = HK I,
   * Tập 2 = HK II); bấm lại nhiều lần cho cùng kết quả; số tiết đã tự sửa được giữ nguyên.
   */
  function handleAutoSchedule() {
    setError("");
    const tpw = parseTietPerWeek(tietPerWeek);
    if (!tpw) {
      setError('Vui lòng nhập "Số tiết/tuần" của môn (theo kế hoạch giáo dục nhà trường) trước khi tự tính số tiết.');
      return;
    }
    const usable = lessons.filter((l) => l.tenBai.trim());
    if (usable.length === 0) {
      setError("Chưa có bài học nào trong bảng - hãy bấm 1 chương để nạp gợi ý từ SGK trước.");
      return;
    }
    const minutes = Number(kiemTraMinutes) > 0 ? Number(kiemTraMinutes) : getKhgdKiemTraMinutes(tpw, subject);

    const result = planYear({
      rows: usable,
      tietPerWeek: tpw,
      policyFor: () => buildKhgdSchedulePolicy({ subject, tietPerWeek: tpw, minutes }),
      makeId: nextRowId,
    });
    setLessons(result.rows);
    setKiemTraDinhKy((prev) => applyScheduleToKiemTra(prev, result.summaries, { minutes, nhanXet: KHGD_NHAN_XET_SUBJECTS.has(subject) }));

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
      // Dòng Ôn tập/Kiểm tra KHÔNG gửi AI (không cần SWD/NLS, tiết kiệm quota) - vẫn có mặt trong bảng kết quả
      const aiLessons = validLessons.filter((l) => !isReviewRow(l));
      const blueprint = buildKhgdBlueprint({
        subject,
        grade,
        truong,
        to,
        giaoVien,
        namHoc,
        enableSwd,
        enableNls,
        lessons: aiLessons,
        kiemTraDinhKy,
      });
      const data = aiLessons.length > 0 ? await generateKhgdRequest(blueprint) : { lessons: [], kiemTraDinhKy, warnings: [] };

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
        <p className="text-sm font-semibold text-slate-800">Môn / Lớp (THCS + THPT)</p>
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
              {KHGD_GRADES.map((g) => (
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
              title="Nạp tên bài + nội dung từ Markdown SGK vào bảng bên dưới"
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
          Bấm 1 chương để nạp tên bài vào bảng bên dưới - hệ thống đọc thẳng file Markdown SGK của môn
          và giữ lại nội dung từng bài để AI soạn SWD/NLS bám sát sách (dòng có biểu tượng sách). Hoặc bấm
          &quot;+ Thêm dòng&quot; để tự gõ (dòng gõ tay không có nội dung SGK nên AI chỉ dựa vào tên bài). Nạp ĐỦ các
          chương của Tập (Tập 1 = Học kì 1, Tập 2 = Học kì 2) rồi bấm nút &quot;Tự tính số tiết&quot; bên dưới; Thiết
          bị/Địa điểm do bạn nhập/sửa.
        </p>

        <div className="space-y-2 rounded-md border border-amber-200 bg-amber-50 p-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Số tiết/tuần của môn" hint="Theo KHGD nhà trường. Chỉ điền sẵn môn đã có căn cứ (CT GDPT 2018) - môn khác vui lòng tự nhập.">
              <input
                type="number"
                min={0.5}
                step="any"
                value={tietPerWeek}
                onChange={(e) => {
                  setTietPerWeek(e.target.value);
                  setKiemTraMinutes(String(getKhgdKiemTraMinutes(e.target.value, subject)));
                  setPlanInfo(null);
                }}
                className={inputClass}
                placeholder="VD: 4"
              />
            </Field>
            <Field label="Thời gian bài kiểm tra định kì (phút)" hint="Thông tư 22/2021: môn ≤ 70 tiết/năm 45 phút; > 70 tiết/năm 60-90 phút. 45 phút = 1 tiết, 60-90 phút = 2 tiết.">
              <input type="number" min={15} step={5} value={kiemTraMinutes} onChange={(e) => setKiemTraMinutes(e.target.value)} className={inputClass} />
            </Field>
          </div>
          <button
            type="button"
            onClick={handleAutoSchedule}
            className="flex items-center gap-1 rounded-md border border-amber-400 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
          >
            <CalendarClock size={14} /> Tự tính số tiết &amp; đề xuất Ôn tập / Kiểm tra giữa kỳ, cuối kỳ
          </button>
          <p className="text-xs text-amber-900">
            Quỹ tiết mỗi học kì = số tiết/tuần × 18 tuần (Học kì 1) hoặc 17 tuần (Học kì 2). Bài chưa có số tiết được
            chia đều phần quỹ còn lại sau khi trừ ôn tập/kiểm tra. Ôn tập trong SGK được giữ nguyên; nếu SGK không có,
            hệ thống ĐỀ XUẤT thêm (dòng viền vàng): giữa kì khoảng Tuần 9 (HK1) / Tuần 27 (HK2), cuối kì ở cuối học kì,
            mỗi mốc có 1 bài kiểm tra định kì theo Thông tư 22/2021; bảng &quot;Kiểm tra, đánh giá định kỳ&quot; bên dưới
            tự điền Thời điểm/Yêu cầu cần đạt. Mọi con số chỉ là gợi ý - bạn sửa/xoá được; số tiết bạn đã tự sửa được giữ
            nguyên khi tính lại.
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
          <table className="w-full min-w-[720px] text-xs">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-2 text-left">Bài học</th>
                <th className="w-16 p-2 text-left">Số tiết</th>
                <th className="w-28 p-2 text-left">Thời điểm</th>
                <th className="w-40 p-2 text-left">Thiết bị dạy học</th>
                <th className="w-32 p-2 text-left">Địa điểm</th>
                <th className="w-8 p-2"></th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((l) => (
                <tr key={l.id} className={`border-t border-slate-100 ${l.deXuat ? "bg-amber-50 outline outline-1 -outline-offset-1 outline-amber-300" : ""}`}>
                  <td className="p-1">
                    <input
                      value={l.tenBai}
                      onChange={(e) => updateLessonField(l.id, "tenBai", e.target.value)}
                      className="w-full rounded border border-slate-200 px-2 py-1"
                      placeholder="Tên bài học"
                    />
                    {l.deXuat && (
                      <p className="mt-1 text-[11px] text-amber-700">Đề xuất theo khung thời gian năm học - sửa hoặc xoá nếu nhà trường bố trí khác</p>
                    )}
                    {!l.deXuat && l.nguon === "sgk" && <p className="mt-1 text-[11px] text-emerald-700">Lấy từ SGK (Markdown)</p>}
                    {l.noiDung && !isReviewRow(l) && (
                      <p
                        className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700"
                        title={l.noiDung.slice(0, 400)}
                      >
                        <BookOpen size={11} /> Đã nạp nội dung SGK - AI sẽ bám theo
                      </p>
                    )}
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
        <p className="text-xs text-slate-500">
          Sau khi bấm &quot;Tự tính số tiết&quot;, Thời gian/Thời điểm (Tuần, Tiết PPCT)/Yêu cầu cần đạt (từ bài nào đến bài
          nào) được điền sẵn theo học kì đã xếp; ô bạn đã tự gõ sẽ được giữ nguyên.
        </p>
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
