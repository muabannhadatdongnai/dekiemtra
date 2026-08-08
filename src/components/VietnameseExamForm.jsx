"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { listBlocks, BLOCK_KEYS } from "@/data/vietnameseExamBlocks";
import { buildVietnameseExamBlueprint } from "@/data/vietnameseExamBlueprint";
import { buildVietnameseExamResult } from "@/data/vietnameseExamResult";
import { generateVietnameseExamRequest } from "@/services/apiClient";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";
const GRADES = [1, 2, 3, 4, 5];

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

/**
 * VietnameseExamForm.jsx
 * Form cho mode thứ 4 "📖 Đề Tiếng Việt Tiểu học" - dựng khung theo đúng khuôn ExamMatrixForm.jsx/
 * WorksheetForm.jsx/LessonPlanForm.jsx (state cục bộ + build blueprint + gọi apiClient + trả kết
 * quả về page.js qua onGenerated). Danh sách khối đọc TRỰC TIẾP từ danh bạ (vietnameseExamBlocks.js)
 * - thêm khối mới ở đó, KHÔNG cần sửa danh sách checkbox ở file này để nó xuất hiện trên form (chỉ
 * cần đổi `implemented: true` để checkbox hết bị vô hiệu hoá) - phần input riêng của từng khối
 * (VD 2 ô của "Đọc thầm" bên dưới) vẫn cần thêm thủ công vì mỗi khối có hình dạng input khác nhau.
 *
 * Giai đoạn 2: ĐỦ CẢ 4/4 khối đã có input riêng (Đọc thầm + Tập làm văn cần AI; Đọc thành tiếng +
 * Chính tả tĩnh, giáo viên tự gõ). Mặc định tick sẵn cả 4 vì đây là cấu trúc đề Tiếng Việt Tiểu
 * học đầy đủ thật (A. Đọc + B. Viết) - giáo viên bỏ tick khối nào không cần.
 */
export default function VietnameseExamForm({ onGenerated }) {
  const [grade, setGrade] = useState(5);
  const [selectedBlocks, setSelectedBlocks] = useState([
    BLOCK_KEYS.DOC_THANH_TIENG,
    BLOCK_KEYS.DOC_THAM,
    BLOCK_KEYS.CHINH_TA,
    BLOCK_KEYS.TAP_LAM_VAN,
  ]);

  // Input riêng của từng khối - mỗi khối tự có state riêng ở đây rồi gộp vào blockInputs lúc
  // submit, không đụng tới state của khối khác (đúng nguyên tắc "A sai thì sửa A, không đụng B").
  const [docThamChuDe, setDocThamChuDe] = useState("");
  const [docThamSoCauHoi, setDocThamSoCauHoi] = useState(8);

  const [docThanhTiengTenBai, setDocThanhTiengTenBai] = useState("");

  const [chinhTaTenBai, setChinhTaTenBai] = useState("");
  const [chinhTaNoiDung, setChinhTaNoiDung] = useState("");
  const [chinhTaKieuBai, setChinhTaKieuBai] = useState("nghe_viet");

  const [tapLamVanTheLoai, setTapLamVanTheLoai] = useState("");
  const [tapLamVanChuDe, setTapLamVanChuDe] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const blocks = listBlocks();

  function toggleBlock(blockDef) {
    if (!blockDef.implemented) return; // khối chưa triển khai - không cho bật
    setSelectedBlocks((prev) =>
      prev.includes(blockDef.key) ? prev.filter((k) => k !== blockDef.key) : [...prev, blockDef.key]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (selectedBlocks.length === 0) {
      setError("Vui lòng chọn ít nhất 1 khối.");
      return;
    }
    if (selectedBlocks.includes(BLOCK_KEYS.DOC_THANH_TIENG) && !docThanhTiengTenBai.trim()) {
      setError('Vui lòng nhập "Tên bài tập đọc" cho khối Đọc thành tiếng (hoặc bỏ tick khối này).');
      return;
    }
    if (selectedBlocks.includes(BLOCK_KEYS.CHINH_TA) && (!chinhTaTenBai.trim() || !chinhTaNoiDung.trim())) {
      setError('Vui lòng nhập đủ "Tên bài" và "Nội dung đoạn chính tả" (hoặc bỏ tick khối Chính tả).');
      return;
    }

    const blockInputs = {};
    if (selectedBlocks.includes(BLOCK_KEYS.DOC_THAM)) {
      blockInputs[BLOCK_KEYS.DOC_THAM] = { chuDe: docThamChuDe, soCauHoi: docThamSoCauHoi };
    }
    if (selectedBlocks.includes(BLOCK_KEYS.DOC_THANH_TIENG)) {
      blockInputs[BLOCK_KEYS.DOC_THANH_TIENG] = { tenBai: docThanhTiengTenBai };
    }
    if (selectedBlocks.includes(BLOCK_KEYS.CHINH_TA)) {
      blockInputs[BLOCK_KEYS.CHINH_TA] = {
        tenBai: chinhTaTenBai,
        noiDung: chinhTaNoiDung,
        kieuBai: chinhTaKieuBai,
      };
    }
    if (selectedBlocks.includes(BLOCK_KEYS.TAP_LAM_VAN)) {
      blockInputs[BLOCK_KEYS.TAP_LAM_VAN] = { theLoaiGoiY: tapLamVanTheLoai, chuDe: tapLamVanChuDe };
    }

    const blueprint = buildVietnameseExamBlueprint({ grade, selectedBlocks, blockInputs });

    setLoading(true);
    try {
      const data = await generateVietnameseExamRequest(blueprint);
      onGenerated(buildVietnameseExamResult(data, { grade, examCode: Math.floor(100 + Math.random() * 900) }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Lớp">
        <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} className={inputClass}>
          {GRADES.map((g) => (
            <option key={g} value={g}>Lớp {g}</option>
          ))}
        </select>
      </Field>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Các khối trong đề</p>
        <div className="space-y-2">
          {blocks.map((b) => {
            const checked = selectedBlocks.includes(b.key);
            return (
              <label
                key={b.key}
                className={`flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition ${
                  !b.implemented
                    ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                    : checked
                      ? "border-brand-400 bg-brand-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={!b.implemented}
                  onChange={() => toggleBlock(b)}
                  className="mt-0.5"
                />
                <span>
                  <span className="block font-medium text-slate-800">
                    {b.section} — {b.label} {!b.implemented && <em className="text-slate-400">(sắp có)</em>}
                  </span>
                  <span className="block text-xs text-slate-500">{b.description}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {selectedBlocks.includes(BLOCK_KEYS.DOC_THANH_TIENG) && (
        <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Khối "Đọc thành tiếng"</p>
          <Field label="Tên bài tập đọc (trích từ SGK)" required>
            <input
              value={docThanhTiengTenBai}
              onChange={(e) => setDocThanhTiengTenBai(e.target.value)}
              placeholder='VD: "Cây gạo ngoài bến sông"'
              className={inputClass}
            />
          </Field>
        </div>
      )}

      {selectedBlocks.includes(BLOCK_KEYS.DOC_THAM) && (
        <div className="space-y-3 rounded-md border border-brand-200 bg-brand-50/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Khối "Đọc thầm"</p>
          <Field label="Chủ đề (tuỳ chọn - để trống để AI tự chọn)">
            <input
              value={docThamChuDe}
              onChange={(e) => setDocThamChuDe(e.target.value)}
              placeholder='VD: "Tình bạn", "Quê hương"...'
              className={inputClass}
            />
          </Field>
          <Field label="Số câu hỏi (7-10)">
            <input
              type="number"
              min={7}
              max={10}
              value={docThamSoCauHoi}
              onChange={(e) => setDocThamSoCauHoi(Math.min(10, Math.max(7, Number(e.target.value) || 8)))}
              className={inputClass}
            />
          </Field>
        </div>
      )}

      {selectedBlocks.includes(BLOCK_KEYS.CHINH_TA) && (
        <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Khối "Chính tả"</p>
          <Field label="Kiểu bài">
            <select value={chinhTaKieuBai} onChange={(e) => setChinhTaKieuBai(e.target.value)} className={inputClass}>
              <option value="nghe_viet">Nghe – viết</option>
              <option value="nho_viet">Nhớ – viết</option>
            </select>
          </Field>
          <Field label="Tên bài/đoạn trích" required>
            <input
              value={chinhTaTenBai}
              onChange={(e) => setChinhTaTenBai(e.target.value)}
              placeholder='VD: "Cây gạo ngoài bến sông" (đoạn 2)'
              className={inputClass}
            />
          </Field>
          <Field label="Nội dung đoạn chính tả (tự gõ/dán nguyên văn từ SGK)" required>
            <textarea
              value={chinhTaNoiDung}
              onChange={(e) => setChinhTaNoiDung(e.target.value)}
              rows={4}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate-500">
              Hệ thống KHÔNG dùng AI để viết đoạn này - bạn cần tự nhập đúng nguyên văn từ SGK để đảm bảo đúng mục đích bài chính tả.
            </p>
          </Field>
        </div>
      )}

      {selectedBlocks.includes(BLOCK_KEYS.TAP_LAM_VAN) && (
        <div className="space-y-3 rounded-md border border-brand-200 bg-brand-50/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Khối "Tập làm văn"</p>
          <Field label="Thể loại (tuỳ chọn - để trống để AI tự chọn)">
            <select value={tapLamVanTheLoai} onChange={(e) => setTapLamVanTheLoai(e.target.value)} className={inputClass}>
              <option value="">Tự chọn (AI quyết định)</option>
              <option value="ta_canh">Tả cảnh</option>
              <option value="ta_nguoi">Tả người</option>
              <option value="ke_chuyen">Kể chuyện</option>
              <option value="viet_thu">Viết thư</option>
            </select>
          </Field>
          <Field label="Chủ đề (tuỳ chọn - để trống để AI tự chọn)">
            <input
              value={tapLamVanChuDe}
              onChange={(e) => setTapLamVanChuDe(e.target.value)}
              placeholder='VD: "Tả cây cối trong sân trường"'
              className={inputClass}
            />
          </Field>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? "Đang tạo đề..." : "📖 TẠO ĐỀ TIẾNG VIỆT"}
      </button>
    </form>
  );
}
