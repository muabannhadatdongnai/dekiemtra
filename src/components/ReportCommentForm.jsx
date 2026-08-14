"use client";

import { useState } from "react";
import { Loader2, Sparkles, Upload, Download, Plus, Trash2, User, Users } from "lucide-react";
import {
  REPORT_COMMENT_LEVEL_LIST,
  REPORT_COMMENT_LENGTH_LIST,
  REPORT_COMMENT_LENGTHS,
  REPORT_COMMENT_INPUT_MODES,
  getReportCommentLevelConfig,
} from "@/data/reportCommentConfig";
import {
  generateReportCommentRequest,
  parseReportCommentBulkRequest,
  downloadReportCommentTemplateRequest,
} from "@/services/apiClient";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";
const textareaClass = `${inputClass} min-h-[70px] resize-y`;

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
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

  const [student, setStudent] = useState(emptySingleStudent());

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
      const data = await generateReportCommentRequest({ cap, doDai, hocSinh });
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
              <Field label="Phẩm chất (ý thô)" hint="VD: chưa tự giác dọn dẹp, hay quên đồ dùng...">
                <textarea
                  className={textareaClass}
                  value={student.ghiChuPhamChat}
                  onChange={(e) => setStudent((s) => ({ ...s, ghiChuPhamChat: e.target.value }))}
                />
              </Field>
              <Field label="Năng lực (ý thô)" hint="VD: ngại phát biểu, làm việc nhóm còn thụ động...">
                <textarea
                  className={textareaClass}
                  value={student.ghiChuNangLuc}
                  onChange={(e) => setStudent((s) => ({ ...s, ghiChuNangLuc: e.target.value }))}
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
            </Field>
          )}

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Môn học (ý thô)</label>
              <button
                type="button"
                onClick={addSubject}
                className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                <Plus size={13} /> Thêm môn
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
