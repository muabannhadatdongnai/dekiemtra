"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { listBlocks, BLOCK_KEYS } from "@/data/vietnameseExamBlocks";
import { buildVietnameseExamBlueprint } from "@/data/vietnameseExamBlueprint";
import { buildVietnameseExamResult } from "@/data/vietnameseExamResult";
import { fetchChaptersRequest, fetchLessonsRequest, generateVietnameseExamRequest } from "@/services/apiClient";
import { ADVANCED_BOOK_MARKER } from "@/data/constants";

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";
const GRADES = [1, 2, 3, 4, 5];
const SGK_SUBJECT = "Tieng_Viet"; // mode này chỉ có 1 môn duy nhất, không cần chọn Môn như LessonPlanForm

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

// Nhãn hiển thị gợi ý "Bài X - Tên bài" (giống hệt lessonLabel() trong LessonPlanForm.jsx) - dùng
// chung cho MỌI ô "Tên bài" có gợi ý ở form này (Đọc thành tiếng/Chính tả).
function lessonLabel(l) {
  return l.soBai != null ? `Bài ${l.soBai} - ${l.tenBai}` : l.tenBai;
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
 *
 * ================== PHIÊN 30 (liên kết SGK Tiếng Việt - gợi ý Tên bài + trích ngữ liệu) ==================
 * Khoa phản ánh: đã đưa file markdown (chuong_{n}.md) + phụ lục "Bài" (chuong_{n}_bai.json, CÙNG
 * schema { soBai, tenBai, noiDungCotLoi } đã dùng cho LessonPlanForm.jsx) vào kho GitHub kiến thức
 * cho môn Tiếng Việt, nhưng form này CHƯA đọc dữ liệu đó - giáo viên vẫn phải tự gõ tay hoàn toàn.
 *
 * Thêm 1 khối "Liên kết SGK Tiếng Việt (tuỳ chọn)" TÁI DÙNG đúng /api/chapters + /api/lessons đã
 * có sẵn (2 route này vốn đã tổng quát theo Môn, không hard-code "Toan" - chỉ cần truyền
 * subject="Tieng_Viet"). Khi giáo viên chọn 1 Chương:
 * - Khối "Đọc thành tiếng" + "Chính tả": ô "Tên bài" có gợi ý (datalist) từ phụ lục, và khi khớp
 *   đúng 1 bài, hiện "mô tả đoạn văn" (noiDungCotLoi) làm gợi nhớ nội dung - KHÔNG tự điền thẳng
 *   vào ô nội dung chính tả (đúng nguyên tắc CỐ Ý giữ nguyên ở chinhTaBlock.js: giáo viên PHẢI tự
 *   gõ/dán nguyên văn thật từ SGK, hệ thống không bịa hộ để tránh sai lệch/vi phạm bản quyền).
 * - Khối "Đọc thầm": KHÔNG có ô Tên bài, nhưng có nút "Dùng mô tả gợi ý làm chủ đề" (điền
 *   docThamChuDe từ noiDungCotLoi của 1 bài trong phụ lục) + gửi kèm sgkVolume/sgkChapterId lên
 *   server để orchestrator tự trích nguyên văn markdown chương làm "referenceContext" cho AI VIẾT
 *   MỚI ngữ liệu (không copy nguyên văn - xem vietnameseExamOrchestrator.js + docThamBlock.js).
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

  // ============ PHIÊN 30: liên kết SGK Tiếng Việt (tuỳ chọn) ============
  const [sgkVolume, setSgkVolume] = useState(1);
  const [availableChapters, setAvailableChapters] = useState([]);
  const [sgkChapterId, setSgkChapterId] = useState("");
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [chaptersError, setChaptersError] = useState("");
  const [availableLessons, setAvailableLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const blocks = listBlocks();

  // Tự động tải danh sách Chương SGK Tiếng Việt khi Lớp/Tập đổi - giống hệt pattern đã có ở
  // LessonPlanForm.jsx/WorksheetForm.jsx, chỉ khác subject LUÔN cố định "Tieng_Viet".
  useEffect(() => {
    let cancelled = false;
    async function loadChapters() {
      setLoadingChapters(true);
      setChaptersError("");
      setSgkChapterId("");
      try {
        const data = await fetchChaptersRequest({ grade, subject: SGK_SUBJECT, volume: sgkVolume });
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
  }, [grade, sgkVolume]);

  // Tải phụ lục "Bài" (gợi ý Tên bài + mô tả đoạn văn) của Chương vừa chọn - bỏ qua với "Sách nâng
  // cao" (không chia theo bài, giống LessonPlanForm.jsx).
  useEffect(() => {
    if (!sgkChapterId || sgkChapterId === ADVANCED_BOOK_MARKER) {
      setAvailableLessons([]);
      return;
    }
    let cancelled = false;
    async function loadLessons() {
      setLoadingLessons(true);
      try {
        const data = await fetchLessonsRequest({ grade, subject: SGK_SUBJECT, volume: sgkVolume, chapter: sgkChapterId });
        if (!cancelled) setAvailableLessons(data.lessons || []);
      } catch {
        // Im lặng bỏ qua - đây là gợi ý phụ trợ, không cản trở tạo đề nếu tải lỗi.
        if (!cancelled) setAvailableLessons([]);
      } finally {
        if (!cancelled) setLoadingLessons(false);
      }
    }
    loadLessons();
    return () => {
      cancelled = true;
    };
  }, [grade, sgkVolume, sgkChapterId]);

  // Khớp gợi ý đang chọn với ô "Tên bài" hiện tại của TỪNG khối - để hiện "mô tả đoạn văn" gợi ý
  // (noiDungCotLoi) đúng bài giáo viên đã gõ/chọn.
  const matchedDocThanhTiengLesson = availableLessons.find((l) => lessonLabel(l) === docThanhTiengTenBai.trim());
  const matchedChinhTaLesson = availableLessons.find((l) => lessonLabel(l) === chinhTaTenBai.trim());

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

    const blueprint = buildVietnameseExamBlueprint({
      grade,
      selectedBlocks,
      blockInputs,
      sgkVolume,
      sgkChapterId: sgkChapterId || null,
    });

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

      {/* ============ PHIÊN 30: Liên kết SGK Tiếng Việt (tuỳ chọn) ============ */}
      <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Liên kết SGK Tiếng Việt (tuỳ chọn) — gợi ý Tên bài + trích ngữ liệu
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tập">
            <select value={sgkVolume} onChange={(e) => setSgkVolume(Number(e.target.value))} className={inputClass}>
              <option value={1}>Tập 1</option>
              <option value={2}>Tập 2</option>
            </select>
          </Field>
          <Field label="Chương/Bài">
            <select
              value={sgkChapterId}
              onChange={(e) => setSgkChapterId(e.target.value)}
              className={inputClass}
              disabled={loadingChapters || availableChapters.length === 0}
            >
              <option value="">— Không chọn —</option>
              {availableChapters.map((c) => (
                <option key={c.chapter} value={c.chapter}>
                  {c.isAdvancedBook ? "Sách nâng cao (toàn bộ)" : `Chương/Bài ${c.chapter}`}
                </option>
              ))}
            </select>
          </Field>
        </div>
        {loadingChapters && <p className="text-xs text-slate-400">Đang tải danh sách chương...</p>}
        {chaptersError && <p className="text-xs text-amber-600">Chưa tải được danh sách chương ({chaptersError}) - vẫn có thể tạo đề bằng cách gõ tay bình thường.</p>}
        {sgkChapterId && loadingLessons && <p className="text-xs text-slate-400">Đang tải gợi ý bài học...</p>}
        <p className="text-xs text-slate-500">
          Chọn 1 Chương để gợi ý "Tên bài" (khối Đọc thành tiếng/Chính tả) và trích ngữ liệu tham
          khảo cho khối Đọc thầm. Chưa có dữ liệu cho Chương nào thì chỉ đơn giản là không hiện gợi
          ý gì - vẫn gõ tay bình thường như trước.
        </p>
      </div>

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
                    {b.subLabel} {!b.implemented && <em className="text-slate-400">(sắp có)</em>}
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
              list="doc-thanh-tieng-ten-bai-goi-y"
              autoComplete="off"
            />
            {availableLessons.length > 0 && (
              <datalist id="doc-thanh-tieng-ten-bai-goi-y">
                {availableLessons.map((l) => (
                  <option key={lessonLabel(l)} value={lessonLabel(l)} />
                ))}
              </datalist>
            )}
            {matchedDocThanhTiengLesson?.noiDungCotLoi && (
              <p className="mt-1 rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">
                📘 Mô tả đoạn văn (theo SGK): {matchedDocThanhTiengLesson.noiDungCotLoi}
              </p>
            )}
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
            {availableLessons.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {availableLessons
                  .filter((l) => l.noiDungCotLoi)
                  .map((l) => (
                    <button
                      key={lessonLabel(l)}
                      type="button"
                      onClick={() => setDocThamChuDe(l.noiDungCotLoi)}
                      className="rounded-full border border-blue-200 bg-white px-2 py-0.5 text-xs text-blue-700 hover:bg-blue-50"
                      title={l.noiDungCotLoi}
                    >
                      Dùng mô tả "{lessonLabel(l)}" →
                    </button>
                  ))}
              </div>
            )}
            {sgkChapterId && (
              <p className="mt-1 text-xs text-slate-500">
                Đã chọn Chương/Bài SGK - AI sẽ dùng nội dung chương này làm tài liệu tham khảo (chỉ
                lấy cảm hứng từ vựng/chủ đề, KHÔNG chép nguyên văn) khi tự viết ngữ liệu mới.
              </p>
            )}
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
              list="chinh-ta-ten-bai-goi-y"
              autoComplete="off"
            />
            {availableLessons.length > 0 && (
              <datalist id="chinh-ta-ten-bai-goi-y">
                {availableLessons.map((l) => (
                  <option key={lessonLabel(l)} value={lessonLabel(l)} />
                ))}
              </datalist>
            )}
            {matchedChinhTaLesson?.noiDungCotLoi && (
              <p className="mt-1 rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">
                📘 Mô tả đoạn văn (theo SGK): {matchedChinhTaLesson.noiDungCotLoi} - dùng để gợi nhớ
                đúng đoạn cần chép, ô bên dưới vẫn cần tự gõ/dán NGUYÊN VĂN thật.
              </p>
            )}
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
