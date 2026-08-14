"use client";

import { useState } from "react";
import { Loader2, Sparkles, Upload, Download, Plus, Trash2, User, Users, AlertTriangle } from "lucide-react";
import {
  REPORT_COMMENT_LEVEL_LIST,
  REPORT_COMMENT_LENGTH_LIST,
  REPORT_COMMENT_LENGTHS,
  REPORT_COMMENT_INPUT_MODES,
  TEACHER_PRONOUN_LIST,
  TEACHER_PRONOUNS,
  STUDENT_PRONOUN_LIST,
  REPORT_COMMENT_TONE_LIST,
  REPORT_COMMENT_TONES,
  getReportCommentLevelConfig,
  getDefaultStudentPronoun,
  QUICK_TAGS_PHAM_CHAT,
  QUICK_TAGS_NANG_LUC,
  QUICK_TAGS_NHAN_XET_CHUNG,
  QUICK_TAGS_MON_HOC,
  containsSubjectName,
} from "@/data/reportCommentConfig";
import {
  generateReportCommentRequest,
  parseReportCommentBulkRequest,
  downloadReportCommentTemplateRequest,
} from "@/services/apiClient";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";
const textareaClass = `${inputClass} min-h-[70px] resize-y`;

// Nhãn + chú thích: cỡ chữ to hơn, đậm/màu rõ ràng hơn text-xs/slate-500 mặc định trước đây - phản
// hồi thực tế là giáo viên lớn tuổi khó đọc chữ nhỏ, nhạt màu (đặc biệt phần "hint" giải thích).
const fieldLabelClass = "mb-1 block text-sm font-bold tracking-wide text-slate-800";
const fieldHintClass = "mt-1 text-sm font-medium leading-snug text-slate-600";

function Field({ label, hint, warning, children }) {
  return (
    <div>
      <label className={fieldLabelClass}>{label}</label>
      {children}
      {hint && <p className={fieldHintClass}>{hint}</p>}
      {warning && (
        <p className="mt-1 flex items-start gap-1 text-sm font-semibold text-amber-700">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {warning}
        </p>
      )}
    </div>
  );
}

/** Từ khóa nhanh (Quick-tags): bấm để nối cụm từ vào ô nhập, không cần tự gõ - đúng phản hồi
 * thực tế "thao tác click luôn nhanh hơn gõ bàn phím". */
function QuickTags({ tags, onPick }) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onPick(tag)}
          className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
        >
          + {tag}
        </button>
      ))}
    </div>
  );
}

function appendTag(current, tag) {
  const trimmed = (current || "").trim();
  if (!trimmed) return tag;
  if (trimmed.toLowerCase().includes(tag.toLowerCase())) return trimmed; // tránh trùng lặp
  return `${trimmed}, ${tag}`;
}

function emptySubject() {
  return { ten: "", ghiChu: "" };
}

function emptySingleStudent() {
  return {
    hoTen: "",
    lop: "",
    ghiChuPhamChat: "",
    ghiChuNangLuc: "",
    nhanXetChungTho: "",
    monHocList: [emptySubject()],
  };
}

export default function ReportCommentForm({ onGenerated }) {
  const [cap, setCap] = useState(REPORT_COMMENT_LEVEL_LIST[0].id);
  const [doDai, setDoDai] = useState(REPORT_COMMENT_LENGTHS.VUA);
  const [inputMode, setInputMode] = useState(REPORT_COMMENT_INPUT_MODES.SINGLE);

  const [xungHo, setXungHo] = useState(TEACHER_PRONOUNS.CO);
  const [goiHocSinh, setGoiHocSinh] = useState(null); // null = tự suy theo cấp học (Tiểu học -> con, còn lại -> em)
  const [tone, setTone] = useState(REPORT_COMMENT_TONES.KHICH_LE);
  const [coGoiYPhuHuynh, setCoGoiYPhuHuynh] = useState(false);

  const [student, setStudent] = useState(emptySingleStudent());
  const [activeSubjectIdx, setActiveSubjectIdx] = useState(0);

  const [bulkFile, setBulkFile] = useState(null);
  const [bulkStudents, setBulkStudents] = useState(null); // null = chưa đọc file
  const [bulkParsing, setBulkParsing] = useState(false);
  const [bulkError, setBulkError] = useState("");
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const levelConfig = getReportCommentLevelConfig(cap);
  const isTieuHoc = levelConfig?.structure === "3-phan";

  function handleCapChange(newCap) {
    setCap(newCap);
    setBulkStudents(null);
    setBulkFile(null);
    setBulkError("");
  }

  function updateSubject(idx, field, value) {
    setStudent((s) => {
      const monHocList = [...s.monHocList];
      monHocList[idx] = { ...monHocList[idx], [field]: value };
      return { ...s, monHocList };
    });
  }

  function addSubject() {
    setStudent((s) => ({ ...s, monHocList: [...s.monHocList, emptySubject()] }));
  }

  function removeSubject(idx) {
    setStudent((s) => ({ ...s, monHocList: s.monHocList.filter((_, i) => i !== idx) }));
  }

  async function handleDownloadTemplate() {
    setDownloadingTemplate(true);
    setBulkError("");
    try {
      const blob = await downloadReportCommentTemplateRequest(cap);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mau-danh-sach-hoc-sinh-${cap}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setBulkError(err.message);
    } finally {
      setDownloadingTemplate(false);
    }
  }

  async function handleBulkFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkFile(file);
    setBulkStudents(null);
    setBulkError("");
    setBulkParsing(true);
    try {
      const data = await parseReportCommentBulkRequest({ file, cap });
      setBulkStudents(data.students);
    } catch (err) {
      setBulkError(err.message);
    } finally {
      setBulkParsing(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    let hocSinh;
    if (inputMode === REPORT_COMMENT_INPUT_MODES.SINGLE) {
      if (!student.hoTen.trim()) {
        setError("Vui lòng nhập họ tên học sinh.");
        return;
      }
      hocSinh = [{ ...student, monHocList: student.monHocList.filter((m) => m.ten.trim()) }];
    } else {
      if (!bulkStudents || bulkStudents.length === 0) {
        setError("Vui lòng tải lên file danh sách học sinh trước.");
        return;
      }
      hocSinh = bulkStudents;
    }

    setLoading(true);
    try {
      const data = await generateReportCommentRequest({ cap, doDai, hocSinh, xungHo, goiHocSinh, tone, coGoiYPhuHuynh });
      onGenerated?.({ cap, doDai, results: data.results });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Cấp học">
        <div className="grid grid-cols-3 gap-2">
          {REPORT_COMMENT_LEVEL_LIST.map((lv) => (
            <button
              key={lv.id}
              type="button"
              onClick={() => handleCapChange(lv.id)}
              className={`rounded-md border px-2 py-2 text-sm font-medium transition ${
                cap === lv.id
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {lv.label}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-slate-400">{levelConfig?.circularLabel}</p>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Giáo viên xưng">
          <select
            className={inputClass}
            value={xungHo}
            onChange={(e) => setXungHo(e.target.value)}
          >
            {TEACHER_PRONOUN_LIST.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Gọi học sinh là">
          <select
            className={inputClass}
            value={goiHocSinh || getDefaultStudentPronoun(cap)}
            onChange={(e) => setGoiHocSinh(e.target.value)}
          >
            {STUDENT_PRONOUN_LIST.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Giọng điệu nhận xét">
        <div className="grid grid-cols-3 gap-2">
          {REPORT_COMMENT_TONE_LIST.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTone(t.id)}
              title={t.hint}
              className={`rounded-md border px-2 py-2 text-sm font-medium transition ${
                tone === t.id
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className={fieldHintClass}>{REPORT_COMMENT_TONE_LIST.find((t) => t.id === tone)?.hint}</p>
      </Field>

      <label className="flex cursor-pointer items-start gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4"
          checked={coGoiYPhuHuynh}
          onChange={(e) => setCoGoiYPhuHuynh(e.target.checked)}
        />
        <span>
          <span className="block text-sm font-bold text-slate-800">Thêm gợi ý đồng hành cho phụ huynh</span>
          <span className="block text-sm text-slate-600">
            Ở cuối mỗi mục nhận xét, AI sẽ thêm 1 câu gợi ý cụ thể phụ huynh nên làm gì ở nhà để
            đồng hành cùng con.
          </span>
        </span>
      </label>

      <Field label="Độ dài nhận xét">
        <div className="grid grid-cols-3 gap-2">
          {REPORT_COMMENT_LENGTH_LIST.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setDoDai(l.id)}
              className={`rounded-md border px-2 py-2 text-xs font-medium transition ${
                doDai === l.id
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
              }`}
              title={l.hint}
            >
              {l.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setInputMode(REPORT_COMMENT_INPUT_MODES.SINGLE)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            inputMode === REPORT_COMMENT_INPUT_MODES.SINGLE
              ? "bg-brand-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <User size={14} /> 1 học sinh
        </button>
        <button
          type="button"
          onClick={() => setInputMode(REPORT_COMMENT_INPUT_MODES.BULK)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            inputMode === REPORT_COMMENT_INPUT_MODES.BULK
              ? "bg-brand-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Users size={14} /> Hàng loạt (Excel)
        </button>
      </div>

      {inputMode === REPORT_COMMENT_INPUT_MODES.SINGLE ? (
        <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Họ và tên">
              <input
                className={inputClass}
                value={student.hoTen}
                onChange={(e) => setStudent((s) => ({ ...s, hoTen: e.target.value }))}
                placeholder="Nguyễn Văn A"
              />
            </Field>
            <Field label="Lớp">
              <input
                className={inputClass}
                value={student.lop}
                onChange={(e) => setStudent((s) => ({ ...s, lop: e.target.value }))}
                placeholder={`VD ${levelConfig?.grades?.[0] || ""}A`}
              />
            </Field>
          </div>

          {isTieuHoc ? (
            <>
              <Field
                label="Phẩm chất (ý thô)"
                hint='Chỉ ghi biểu hiện đạo đức/thái độ (VD: chưa tự giác dọn dẹp, hay quên đồ dùng...) - KHÔNG ghi kết quả học tập theo môn, phần đó nhập ở mục "Môn học" bên dưới.'
                warning={
                  containsSubjectName(student.ghiChuPhamChat)
                    ? 'Hình như bạn đang nhắc tới một môn học ở đây - kết quả học tập theo môn nên ghi ở mục "Môn học" bên dưới để AI không nhầm lẫn.'
                    : null
                }
              >
                <textarea
                  className={textareaClass}
                  value={student.ghiChuPhamChat}
                  onChange={(e) => setStudent((s) => ({ ...s, ghiChuPhamChat: e.target.value }))}
                />
                <QuickTags
                  tags={QUICK_TAGS_PHAM_CHAT}
                  onPick={(tag) =>
                    setStudent((s) => ({ ...s, ghiChuPhamChat: appendTag(s.ghiChuPhamChat, tag) }))
                  }
                />
              </Field>
              <Field
                label="Năng lực (ý thô)"
                hint="VD: ngại phát biểu, làm việc nhóm còn thụ động..."
                warning={
                  containsSubjectName(student.ghiChuNangLuc)
                    ? 'Hình như bạn đang nhắc tới một môn học ở đây - kết quả học tập theo môn nên ghi ở mục "Môn học" bên dưới để AI không nhầm lẫn.'
                    : null
                }
              >
                <textarea
                  className={textareaClass}
                  value={student.ghiChuNangLuc}
                  onChange={(e) => setStudent((s) => ({ ...s, ghiChuNangLuc: e.target.value }))}
                />
                <QuickTags
                  tags={QUICK_TAGS_NANG_LUC}
                  onPick={(tag) => setStudent((s) => ({ ...s, ghiChuNangLuc: appendTag(s.ghiChuNangLuc, tag) }))}
                />
              </Field>
            </>
          ) : (
            <Field label="Nhận xét chung (ý thô)" hint="VD: hay nói chuyện riêng, chưa tập trung...">
              <textarea
                className={textareaClass}
                value={student.nhanXetChungTho}
                onChange={(e) => setStudent((s) => ({ ...s, nhanXetChungTho: e.target.value }))}
              />
              <QuickTags
                tags={QUICK_TAGS_NHAN_XET_CHUNG}
                onPick={(tag) =>
                  setStudent((s) => ({ ...s, nhanXetChungTho: appendTag(s.nhanXetChungTho, tag) }))
                }
              />
            </Field>
          )}

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className={fieldLabelClass}>Môn học (ý thô)</label>
              <button
                type="button"
                onClick={addSubject}
                className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                <Plus size={14} /> Thêm môn
              </button>
            </div>
            <div className="space-y-2">
              {student.monHocList.map((m, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    className={`${inputClass} w-28`}
                    placeholder="Tên môn"
                    value={m.ten}
                    onChange={(e) => updateSubject(idx, "ten", e.target.value)}
                  />
                  <input
                    className={inputClass}
                    placeholder='VD: "Học dở, làm toán sai bét"'
                    value={m.ghiChu}
                    onFocus={() => setActiveSubjectIdx(idx)}
                    onChange={(e) => updateSubject(idx, "ghiChu", e.target.value)}
                  />
                  {student.monHocList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubject(idx)}
                      className="shrink-0 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-1.5 text-sm font-medium text-slate-600">
              Từ khóa nhanh cho môn{" "}
              <span className="font-bold text-slate-800">
                {student.monHocList[activeSubjectIdx]?.ten || `#${activeSubjectIdx + 1}`}
              </span>{" "}
              (bấm vào ô ghi chú của môn muốn thêm rồi chọn):
            </p>
            <QuickTags
              tags={QUICK_TAGS_MON_HOC}
              onPick={(tag) => {
                const idx = Math.min(activeSubjectIdx, student.monHocList.length - 1);
                updateSubject(idx, "ghiChu", appendTag(student.monHocList[idx]?.ghiChu, tag));
              }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            disabled={downloadingTemplate}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {downloadingTemplate ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            Tải file Excel mẫu ({levelConfig?.label})
          </button>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-slate-300 bg-white px-3 py-4 text-sm text-slate-500 hover:border-brand-400">
            <Upload size={18} />
            {bulkFile ? bulkFile.name : "Tải lên file Excel/Word đã điền"}
            <input type="file" accept=".xlsx,.xls,.docx,.doc" className="hidden" onChange={handleBulkFileChange} />
          </label>

          {bulkParsing && (
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <Loader2 size={13} className="animate-spin" /> Đang đọc file...
            </p>
          )}
          {bulkError && <p className="text-xs text-red-600">{bulkError}</p>}
          {bulkStudents && (
            <p className="text-xs font-medium text-emerald-600">
              ✓ Đã đọc được {bulkStudents.length} học sinh: {bulkStudents.map((s) => s.hoTen).join(", ")}
            </p>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? "Đang tạo nhận xét..." : "Tạo nhận xét học bạ"}
      </button>
    </form>
  );
}
