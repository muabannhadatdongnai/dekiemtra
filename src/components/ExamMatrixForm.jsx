"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, Upload, CheckCircle2, XCircle } from "lucide-react";
import { DIFFICULTY_LEVELS } from "@/data/promptTemplates";
import { getEffectiveSession } from "@/services/authService";
import { GRADES, getSubjectLabel, getSubjectsForGrade, MODULE_KEYS } from "@/data/config";
import { buildExamBlueprint } from "@/data/examBlueprint";
import { buildExamResult } from "@/data/examResult";
import { fetchChaptersRequest, generateExamRequest, analyzeSampleExamRequest } from "@/services/apiClient";

const LEVEL_SHORT_LABEL = {
  NHAN_BIET: "Nhận biết (Dễ)",
  THONG_HIEU: "Thông hiểu (TB)",
  VAN_DUNG: "Vận dụng (Khó)",
  VAN_DUNG_CAO: "Vận dụng cao (Rất khó)",
};

const EMPTY_ROW = { NHAN_BIET: 0, THONG_HIEU: 0, VAN_DUNG: 0, VAN_DUNG_CAO: 0 };

// C6 (Phần B - đề mẫu): 3 chế độ, khớp với sampleMode phía server (examOrchestrator.js)
const SAMPLE_MODES = [
  { value: "theo_chuong", label: "Theo chương", hint: "Mặc định - không dùng đề mẫu" },
  { value: "theo_de_mau", label: "Theo đề mẫu", hint: "Ưu tiên bám sát phong cách đề mẫu" },
  { value: "ket_hop", label: "Kết hợp cả 2", hint: "Cân bằng đề mẫu + quy tắc chuẩn" },
];

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
  // Giai đoạn 1 (mở rộng): "Mục tiêu" - dòng chữ mở đầu đề (VD: "Kiểm tra kĩ năng đọc hiểu...").
  // Giáo viên tự gõ, để trống nếu không cần - KHÔNG gửi lên AI (chỉ dùng để in đầu đề khi xem
  // trước/xuất Word, xem A4LivePreview.jsx + exportService.js), tránh AI tự bịa sai giọng văn
  // hành chính của nhà trường.
  const [examObjective, setExamObjective] = useState("");

  // ============ Chọn kiến thức ============
  const [subject, setSubject] = useState("Toan");
  const [grade, setGrade] = useState(5);
  const [volume, setVolume] = useState(1);

  // Đạo đức/Khoa học chỉ dạy 1 số khối (xem minGrade/maxGrade trong config.js) - danh sách môn
  // hiển thị ở dropdown phải lọc lại mỗi khi đổi Lớp, tránh giáo viên chọn nhầm môn không tồn tại
  // ở khối đó (VD Khoa học không có ở Lớp 1-3).
  const availableSubjects = getSubjectsForGrade(grade, MODULE_KEYS.EXAM);
  useEffect(() => {
    if (!availableSubjects.some((s) => s.value === subject)) {
      setSubject(availableSubjects[0]?.value || "Toan");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade]);

  const [availableChapters, setAvailableChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [chaptersError, setChaptersError] = useState("");
  // Giai đoạn 1 (mở rộng): "Nội dung kiến thức" - gõ tay tên bài/chủ đề trọng tâm, SONG SONG với
  // việc chọn Chương từ kho SGK ở dưới (không bắt buộc, không thay thế chapterMatrix). Có gửi
  // lên AI (xem buildKnowledgeContentGuidance trong promptTemplates.js).
  const [knowledgeContent, setKnowledgeContent] = useState("");

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
  // ================== GIAI ĐOẠN 32 (mở rộng THCS) ==================
  // TRƯỚC ĐÂY checkbox này LUÔN hiện, giáo viên phải TỰ NHỚ tắt khi ra đề Lớp 6 trở lên (chỉ có
  // dòng ghi chú nhắc). Từ khi THCS trở thành lựa chọn Lớp phổ biến (không còn là trường hợp hiếm
  // gặp), tự động TẮT + ẨN hẳn checkbox khi grade > 5 - không dựa vào giáo viên tự nhớ nữa.
  useEffect(() => {
    if (Number(grade) > 5 && useVisualQuestions) setUseVisualQuestions(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade]);
  // Giai đoạn 1 (mở rộng): "Yêu cầu bổ sung" - dặn dò riêng cho AI (VD: "cần 1 câu liên hệ thực
  // tế"), chèn vào cuối prompt (xem buildExtraRequirementsGuidance trong promptTemplates.js).
  const [extraRequirements, setExtraRequirements] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============ C6: Đề mẫu (tuỳ chọn) ============
  const [sampleMode, setSampleMode] = useState("theo_chuong");
  const [sampleFile, setSampleFile] = useState(null);
  const [sampleSpec, setSampleSpec] = useState(null);
  const [sampleFromCache, setSampleFromCache] = useState(false);
  const [analyzingSample, setAnalyzingSample] = useState(false);
  const [sampleError, setSampleError] = useState("");

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

  // C6: phân tích đề mẫu ngay khi giáo viên chọn file - KHÔNG chờ đến lúc bấm "Tạo đề" mới báo
  // lỗi, để giáo viên biết ngay file có phân tích được hay không (đúng tinh thần C4: xem trước
  // spec phong cách trả về có đúng ý không).
  async function handleSampleFileChange(e) {
    const file = e.target.files?.[0] || null;
    setSampleFile(file);
    setSampleSpec(null);
    setSampleError("");
    if (!file) return;

    const session = getEffectiveSession();
    if (!session) {
      setSampleError("Phiên đăng nhập đã hết, vui lòng tải lại trang và đăng nhập lại.");
      return;
    }

    setAnalyzingSample(true);
    try {
      const data = await analyzeSampleExamRequest({ username: session.username, file });
      setSampleSpec(data.spec);
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

    if (chapterIds.length === 0) {
      setError("Vui lòng chọn ít nhất 1 Chương/Bài học.");
      return;
    }
    if (totalQuestions === 0) {
      setError("Tổng số câu hỏi phải lớn hơn 0 (điền số câu vào ma trận bên dưới).");
      return;
    }
    // C6: chặn sớm phía client nếu chọn chế độ cần đề mẫu nhưng chưa phân tích xong - đỡ phải
    // chờ round-trip lên server rồi mới biết (server vẫn tự fallback an toàn nếu lọt qua, xem
    // examOrchestrator.js, nhưng báo lỗi ngay ở đây giúp giáo viên hiểu rõ hơn là cần làm gì).
    if (sampleMode !== "theo_chuong" && !sampleSpec) {
      setError(
        analyzingSample
          ? "Đang phân tích đề mẫu, vui lòng đợi xong rồi bấm Tạo đề lại."
          : "Vui lòng upload đề mẫu và chờ phân tích xong, hoặc chuyển về chế độ \"Theo chương\"."
      );
      return;
    }

    const session = getEffectiveSession();
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
      const blueprint = buildExamBlueprint({
        username: session.username,
        grade,
        subject,
        volume,
        chapterMatrix: nonEmptyChapterMatrix,
        typeByLevel,
        includeAnswers,
        useVisualQuestions,
        sampleMode,
        sampleExamSpec: sampleMode !== "theo_chuong" ? sampleSpec : null,
        knowledgeContent,
        extraRequirements,
      });
      const data = await generateExamRequest(blueprint);

      const meta = {
        schoolName,
        className,
        duration,
        academicYear,
        title: examTitle,
        subject: getSubjectLabel(subject),
        grade,
        examCode: Math.floor(100 + Math.random() * 900),
        // Giai đoạn 1 (mở rộng): "Mục tiêu" - chỉ hiển thị, KHÔNG đi qua blueprint/AI (xem khai
        // báo state examObjective phía trên).
        objective: examObjective,
      };

      onGenerated(buildExamResult(data, meta));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // #6 (Nhóm D): cảnh báo (KHÔNG auto-sync) khi số đầu tiên gõ trong "Tên lớp" khác "Lớp" đang
  // chọn ở dưới - VD gõ "Tên lớp" = "6A1" nhưng "Lớp" đang chọn là Lớp 5 -> dễ là gõ nhầm/quên đổi
  // khi copy từ đề cũ. Dò số bất kỳ trong chuỗi (không bắt buộc phải đứng đầu tuyệt đối) để chịu
  // được cả kiểu gõ "Lớp 6A1".
  const classNameNumberMatch = className.match(/\d+/);
  const classNameNumber = classNameNumberMatch ? Number(classNameNumberMatch[0]) : null;
  const classGradeMismatch = classNameNumber !== null && classNameNumber !== grade;

  // Phiên 33 (THPT): placeholder "Tên trường" đổi theo cấp học đang chọn, tránh gợi ý sai
  // "Trường THCS ..." khi giáo viên đang soạn đề cho Lớp 10-12.
  const schoolNamePlaceholder =
    grade >= 10 ? "Trường THPT ..." : grade >= 6 ? "Trường THCS ..." : "Trường Tiểu học ...";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ============ THÔNG TIN CHUNG ============ */}
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">Thông tin chung</p>
        <Field label="Tên trường">
          <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className={inputClass} placeholder={schoolNamePlaceholder} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tên lớp">
            <input value={className} onChange={(e) => setClassName(e.target.value)} className={inputClass} placeholder="5A1" />
            {classGradeMismatch && (
              <p className="mt-1 text-xs text-amber-600">
                ⚠️ Số trong "Tên lớp" ({classNameNumber}) khác "Lớp" đang chọn (Lớp {grade}) ở mục Chọn kiến thức bên dưới - kiểm tra lại nếu không cố ý.
              </p>
            )}
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
        <Field label="Mục tiêu (tuỳ chọn - dòng chữ mở đầu đề, in nguyên văn khi xem trước/xuất Word)">
          <textarea
            value={examObjective}
            onChange={(e) => setExamObjective(e.target.value)}
            className={inputClass}
            rows={2}
            placeholder='VD: "Kiểm tra kĩ năng đọc hiểu văn bản. Kiểm tra kĩ năng viết đoạn văn tả cảnh."'
          />
          <p className="mt-1 text-xs text-slate-500">
            Do bạn tự gõ, AI KHÔNG được yêu cầu tạo ra dòng này - để tránh sai giọng văn hành chính của trường.
          </p>
        </Field>
      </div>

      {/* ============ CHỌN KIẾN THỨC ============ */}
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">Chọn kiến thức</p>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Môn học">
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass}>
              {availableSubjects.map((s) => (
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

        <Field label="Nội dung kiến thức (tuỳ chọn - gõ tay tên bài/chủ đề trọng tâm cần nhấn mạnh)">
          <textarea
            value={knowledgeContent}
            onChange={(e) => setKnowledgeContent(e.target.value)}
            className={inputClass}
            rows={2}
            placeholder='VD: "Tập trung vào phép chia có dư và bài toán có lời văn liên quan"'
          />
          <p className="mt-1 text-xs text-slate-500">
            Không thay thế việc chọn Chương ở dưới - chỉ giúp AI biết nên nhấn mạnh phần nào trong các chương đã chọn.
          </p>
        </Field>

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

      {/* ============ C6: ĐỀ MẪU (TUỲ CHỌN) ============ */}
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <p className="text-sm font-semibold text-slate-800">Đề mẫu (tuỳ chọn)</p>
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
                name="sampleMode"
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
              <span>{sampleFile ? sampleFile.name : "Chọn file đề mẫu (.docx, .pdf, hoặc ảnh chụp)"}</span>
              <input
                type="file"
                accept=".docx,.pdf,image/*"
                onChange={handleSampleFileChange}
                className="sr-only"
              />
            </label>

            {analyzingSample && (
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 size={13} className="animate-spin" /> Đang phân tích phong cách đề mẫu...
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
                  {sampleSpec.writingStyle && <p>Hành văn: {sampleSpec.writingStyle}</p>}
                  {sampleSpec.presentationNotes && <p>Trình bày: {sampleSpec.presentationNotes}</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============ TUỲ CHỌN ĐÁP ÁN & CÂU HỎI TRỰC QUAN ============ */}
      <Field label="Yêu cầu bổ sung (tuỳ chọn - dặn dò riêng cho AI, áp dụng cho toàn bộ đề)">
        <textarea
          value={extraRequirements}
          onChange={(e) => setExtraRequirements(e.target.value)}
          className={inputClass}
          rows={2}
          placeholder='VD: "Cần ít nhất 1 câu liên hệ thực tế mỗi mức độ"'
        />
      </Field>

      {Number(grade) <= 5 && (
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
              credit đáng kể.
            </span>
          </span>
        </label>
      )}

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
