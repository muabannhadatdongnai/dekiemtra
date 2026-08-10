"use client";

import { useState, useEffect, useMemo } from "react";
import { Loader2, Sparkles, Upload, CheckCircle2, XCircle, RefreshCw, Star, Save, ClipboardCheck } from "lucide-react";
import { getSession } from "@/services/authService";
import {
  generateWorksheetRequest,
  analyzeWorksheetSampleRequest,
  getWorksheetPreferenceRequest,
  saveWorksheetPreferenceRequest,
  fetchChaptersRequest,
} from "@/services/apiClient";
// GIAI ĐOẠN 2: import trực tiếp từ module DỮ LIỆU thuần (không phải worksheetGenerator.js -
// file đó có import geminiKeyPool.js đọc biến môi trường phía server, KHÔNG an toàn để import
// vào component "use client"). getSelectableCatalogFor() đã tự lọc bỏ "planned" (chưa có
// generator thật) và "hiddenFromForm" (hoạt động tự động, không phải ô chọn riêng - VD
// "dem_hinh_ung_dung" luôn tự kèm theo "nhan_dien_hinh", xem worksheetGenerator.js).
import { getSelectableCatalogFor } from "@/data/worksheetExerciseCatalog";
// GIAI ĐOẠN 9: logic thuần (áp dụng/đảo cấu trúc phiếu mẫu) tách riêng để tự verify được bằng
// script gọi hàm trực tiếp (xem worksheetSampleStructureUtils.js).
import { defaultCountsFor, applyDetectedExercisesToCounts } from "@/services/worksheetSampleStructureUtils";
// GIAI ĐOẠN 5: mapping khối lớp phiếu bài tập -> số lớp SGK (chỉ LOP_1/LOP_2, Mầm non không có
// SGK theo chương) - module dữ liệu thuần, an toàn phía client giống worksheetExerciseCatalog.js.
import { WORKSHEET_GRADE_TO_SGK_GRADE } from "@/data/constants";
// ================== GIAI ĐOẠN 9, BƯỚC 2 (Tầng B - catalog theo chủ đề SGK) ==================
// Module dữ liệu thuần (không import gì từ worksheetGenerator.js) - an toàn phía client giống
// worksheetExerciseCatalog.js. Xem worksheetTopicPackages.js để rõ danh sách gói + dạng bài liên
// quan; xem PROJECT_SUMMARY.md mục "Bước 2" để rõ phạm vi (đợt này CHỈ có Lớp 1).
import { getTopicPackagesFor } from "@/data/worksheetTopicPackages";

const GRADES = [
  { value: "MAM_NON", label: "Mầm non (chuẩn bị vào lớp 1)" },
  { value: "LOP_1", label: "Lớp 1" },
  { value: "LOP_2", label: "Lớp 2" },
];

const inputClass = "w-full rounded-md border border-slate-300 px-3 py-2 text-sm";

// ================== GIAI ĐOẠN 6 (mở rộng sang Tiếng Việt) ==================
// Chỉ 2 môn thực sự có generator (source khác "planned") trong worksheetExerciseCatalog.js -
// KHÔNG tái dùng nguyên SUBJECTS trong config.js (có cả Tiếng Anh/Lịch sử, dành cho luồng Đề thi
// khác, chưa có generator cho Phiếu bài tập).
const WORKSHEET_SUBJECTS = [
  { value: "TOAN", label: "Toán" },
  { value: "TIENG_VIET", label: "Tiếng Việt" },
];
const DEFAULT_TITLE_BY_SUBJECT = { TOAN: "BÀI TẬP TOÁN", TIENG_VIET: "BÀI TẬP TIẾNG VIỆT" };

export default function WorksheetForm({ onGenerated }) {
  const [grade, setGrade] = useState("LOP_1");
  const [subject, setSubject] = useState("TOAN");
  const [title, setTitle] = useState(DEFAULT_TITLE_BY_SUBJECT.TOAN);
  // GIAI ĐOẠN 2: khởi tạo từ catalog (defaultCount của từng dạng bài) thay vì object hard-code
  // cố định - thêm/bớt dạng bài trong worksheetExerciseCatalog.js giờ không cần sửa file này.
  const [exerciseCounts, setExerciseCounts] = useState(() => defaultCountsFor("LOP_1", "TOAN"));
  const [includeAnswers, setIncludeAnswers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================== GIAI ĐOẠN 2: phiếu mẫu tham khảo ==================
  const [sampleFile, setSampleFile] = useState(null);
  const [sampleSpec, setSampleSpec] = useState(null);
  const [sampleReferenceContext, setSampleReferenceContext] = useState(null);
  const [sampleFromCache, setSampleFromCache] = useState(false);
  const [analyzingSample, setAnalyzingSample] = useState(false);
  const [sampleError, setSampleError] = useState("");
  // ================== GIAI ĐOẠN 9 (tự động áp dụng cấu trúc phiếu mẫu) ==================
  // TRƯỚC ĐÂY detectedExercises chỉ áp dụng khi giáo viên TỰ BẤM 1 nút phụ - nếu quên bấm, phiếu
  // vẫn sinh theo exerciseCounts mặc định cũ, không liên quan gì đến mẫu vừa tải lên (đúng điều
  // giáo viên phản ánh "hệ thống phớt lờ mẫu tôi đưa vào"). Giờ áp dụng NGAY sau khi phân tích
  // xong (ghi đè hẳn, không cộng dồn), kèm banner rõ ràng + nút đảo lại nếu giáo viên muốn.
  const [sampleStructureApplied, setSampleStructureApplied] = useState(false);
  const [preSampleExerciseCounts, setPreSampleExerciseCounts] = useState(null); // snapshot để đảo lại
  const [lastLayoutId, setLastLayoutId] = useState(null); // để tránh random trùng layout 2 lần liên tiếp

  // ================== GIAI ĐOẠN 3: tiện lợi giáo viên ==================
  const [favoriteLayoutId, setFavoriteLayoutId] = useState(null); // đã lưu từ trước, tải khi mở form
  const [hasGenerated, setHasGenerated] = useState(false); // đã tạo phiếu ít nhất 1 lần -> hiện thêm 2 nút tiện lợi
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [favoriteSavedNotice, setFavoriteSavedNotice] = useState("");

  // ================== GIAI ĐOẠN 3 MỚI: "công thức đề" theo từng khối lớp ==================
  // Khác favoriteLayoutId (1 giá trị, áp dụng mọi khối) - đây là 1 OBJECT theo khối lớp, vì
  // dạng bài khả dụng khác nhau theo khối (VD công thức Lớp 1 không thể áp y nguyên cho Lớp 2).
  const [favoriteExerciseCounts, setFavoriteExerciseCounts] = useState({}); // { [grade]: {key: count} }
  const [savingFormula, setSavingFormula] = useState(false);
  const [formulaSavedNotice, setFormulaSavedNotice] = useState("");

  // ================== GIAI ĐOẠN 5 (liên kết SGK markdown) ==================
  const [sgkVolume, setSgkVolume] = useState(1);
  const [sgkChapterId, setSgkChapterId] = useState("");
  const [availableChapters, setAvailableChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [chaptersError, setChaptersError] = useState("");
  const [generateWarnings, setGenerateWarnings] = useState([]);

  const hasSgkForGrade = Boolean(WORKSHEET_GRADE_TO_SGK_GRADE[grade]); // false cho Mầm non

  // Tự động tải danh sách bài/chương SGK khi khối lớp/Tập/Môn đổi - TÁI DÙNG đúng API/pattern đã
  // có ở LessonPlanForm.jsx (fetchChaptersRequest -> /api/chapters, dùng chung cho Giáo án + Đề
  // thi + giờ thêm Phiếu bài tập). Bỏ qua với Mầm non (không có SGK theo chương).
  useEffect(() => {
    if (!hasSgkForGrade) {
      setAvailableChapters([]);
      setSgkChapterId("");
      return;
    }
    let cancelled = false;
    async function loadChapters() {
      setLoadingChapters(true);
      setChaptersError("");
      setSgkChapterId("");
      try {
        // GIAI ĐOẠN 6: subject SGK dùng đúng giá trị đã có trong config.js (SUBJECTS) - "Toan"
        // hay "Tieng_Viet" - KHÔNG hard-code "Toan" như trước Giai đoạn 6.
        const sgkSubject = subject === "TIENG_VIET" ? "Tieng_Viet" : "Toan";
        const data = await fetchChaptersRequest({ grade: WORKSHEET_GRADE_TO_SGK_GRADE[grade], subject: sgkSubject, volume: sgkVolume });
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
  }, [grade, subject, sgkVolume, hasSgkForGrade]);

  const totalSections = Object.values(exerciseCounts).filter((c) => c > 0).length;

  // GIAI ĐOẠN 2 (theo khối lớp) + GIAI ĐOẠN 6 (theo môn học): danh sách dạng bài hiện đúng theo
  // CẢ khối lớp LẪN môn - catalog có minGrade/maxGrade riêng từng dạng, và giờ có cả 2 môn
  // (TOAN/TIENG_VIET) với key hoàn toàn khác nhau.
  const visibleExercises = useMemo(() => getSelectableCatalogFor(grade, subject), [grade, subject]);

  // ================== GIAI ĐOẠN 9, BƯỚC 2 (Tầng B - catalog theo chủ đề SGK) ==================
  // Danh sách "gói chủ đề" khả dụng cho ĐÚNG khối lớp/môn đang chọn - rỗng ([]) với hầu hết tổ
  // hợp (đợt này CHỈ có 2 gói cho Lớp 1/Toán, xem worksheetTopicPackages.js), UI bên dưới tự ẩn
  // khi rỗng nên không cần điều kiện hasSgkForGrade riêng.
  const topicPackages = useMemo(() => getTopicPackagesFor(grade, subject), [grade, subject]);

  /** Bấm 1 "gói chủ đề" -> BẬT (đặt = defaultCount) toàn bộ dạng bài trong gói đó - CỘNG DỒN vào
   * lựa chọn hiện tại (KHÔNG ghi đè/xoá các dạng bài khác đang chọn, khác hẳn cơ chế "Áp dụng cấu
   * trúc từ phiếu mẫu" ở mục phiếu mẫu tham khảo bên dưới). Lý do chọn CỘNG DỒN thay vì GHI ĐÈ:
   * phiếu mẫu upload là tín hiệu CHẮC CHẮN "đây là cấu trúc thật giáo viên đang dùng" nên ghi đè
   * hợp lý; còn bấm 1 gói chủ đề chỉ là "tôi muốn thêm phần này vào phiếu" - ghi đè sẽ xoá mất
   * lựa chọn giáo viên đã tự chỉnh trước đó, gây bất ngờ khó chịu hơn là hữu ích. */
  function applyTopicPackage(topic) {
    setExerciseCounts((prev) => {
      const next = { ...prev };
      for (const key of topic.exerciseKeys) {
        const catalogItem = visibleExercises.find((item) => item.key === key);
        if (catalogItem) next[key] = catalogItem.defaultCount ?? 1;
      }
      return next;
    });
  }

  // Đổi khối lớp HOẶC môn học -> đồng bộ lại exerciseCounts: giữ số đã nhập cho dạng bài vẫn còn
  // hiện, dùng defaultCount cho dạng bài MỚI xuất hiện, bỏ dạng bài không còn phù hợp. LƯU Ý:
  // TRƯỚC Giai đoạn 6, effect này chỉ phụ thuộc [grade] - thiếu subject trong deps sẽ khiến đổi
  // môn học KHÔNG đồng bộ lại danh sách (bug tiềm ẩn nếu thêm subject mà quên sửa chỗ này).
  useEffect(() => {
    setExerciseCounts((prev) => {
      const next = {};
      for (const item of visibleExercises) {
        next[item.key] = prev[item.key] ?? item.defaultCount ?? 0;
      }
      return next;
    });
    // Đổi môn học -> đặt lại tiêu đề mặc định theo môn, NHƯNG chỉ khi giáo viên CHƯA tự sửa tiêu
    // đề (còn đúng 1 trong 2 giá trị mặc định) - tránh ghi đè tiêu đề giáo viên đã tự đặt riêng.
    setTitle((prevTitle) =>
      Object.values(DEFAULT_TITLE_BY_SUBJECT).includes(prevTitle) ? DEFAULT_TITLE_BY_SUBJECT[subject] : prevTitle
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, subject]);

  // Tải layout yêu thích đã lưu (nếu có) ngay khi mở form - không chặn giáo viên thao tác gì
  // cả, chỉ để sẵn favoriteLayoutId cho lần tạo phiếu đầu tiên đã có thể thiên vị theo sở thích.
  useEffect(() => {
    (async () => {
      try {
        const data = await getWorksheetPreferenceRequest();
        setFavoriteLayoutId(data?.preference?.favoriteLayoutId || null);
        setFavoriteExerciseCounts(data?.preference?.favoriteExerciseCounts || {});
      } catch {
        // Im lặng bỏ qua - không có tuỳ chọn đã lưu cũng không sao, tạo phiếu vẫn chạy bình thường.
      }
    })();
  }, []);

  // Công thức đề đã lưu cho ĐÚNG khối lớp + môn học đang chọn (nếu có) - dùng để hiện banner gợi
  // ý và cho nút "Dùng công thức đã lưu". GIAI ĐOẠN 6: lồng thêm cấp subject - trước đây
  // `favoriteExerciseCounts[grade]` LÀ counts luôn (chỉ 1 môn); giờ phải qua thêm 1 cấp
  // `[subject]` vì 2 môn có key hoàn toàn khác nhau, không được lẫn vào nhau.
  const savedFormulaForGrade = favoriteExerciseCounts[grade]?.[subject];
  const hasSavedFormulaForGrade = Boolean(savedFormulaForGrade && Object.keys(savedFormulaForGrade).length > 0);

  /** Áp công thức đề đã lưu (cho khối lớp + môn hiện tại) vào form - giáo viên chủ động bấm,
   * KHÔNG tự động âm thầm ghi đè để tránh mất công giáo viên vừa chỉnh tay xong lại bị thay đổi. */
  function applySavedFormula() {
    if (!savedFormulaForGrade) return;
    setExerciseCounts(() => {
      const next = {};
      for (const item of visibleExercises) {
        next[item.key] = savedFormulaForGrade[item.key] ?? item.defaultCount ?? 0;
      }
      return next;
    });
  }

  /** "⭐ Lưu công thức đề này" - lưu ĐÚNG tổ hợp dạng bài + số lượng hiện tại cho khối lớp + môn
   * đang chọn. Không cần đã tạo phiếu trước đó (khác nút "Lưu bố cục" - cái đó cần lastLayoutId). */
  async function handleSaveFormula() {
    setSavingFormula(true);
    setFormulaSavedNotice("");
    try {
      await saveWorksheetPreferenceRequest({ gradeExerciseCounts: { grade, subject, counts: exerciseCounts } });
      setFavoriteExerciseCounts((prev) => ({
        ...prev,
        [grade]: { ...(prev[grade] || {}), [subject]: exerciseCounts },
      }));
      setFormulaSavedNotice("Đã lưu công thức đề cho khối này! Lần sau mở lại khối này sẽ có gợi ý dùng lại.");
    } catch (err) {
      setFormulaSavedNotice(`Lỗi khi lưu: ${err.message}`);
    } finally {
      setSavingFormula(false);
    }
  }

  function updateCount(key, value) {
    setExerciseCounts((prev) => ({ ...prev, [key]: Math.max(0, Number(value) || 0) }));
  }

  // Phân tích ngay khi giáo viên chọn file - không đợi đến lúc bấm "Tạo phiếu" mới báo lỗi,
  // giống hệt cách ExamMatrixForm.jsx xử lý đề mẫu.
  async function handleSampleFileChange(e) {
    const file = e.target.files?.[0] || null;
    setSampleFile(file);
    setSampleSpec(null);
    setSampleReferenceContext(null);
    setSampleError("");
    setSampleStructureApplied(false);
    setPreSampleExerciseCounts(null);
    if (!file) return;

    const session = getSession();
    if (!session) {
      setSampleError("Phiên đăng nhập đã hết, vui lòng tải lại trang.");
      return;
    }

    setAnalyzingSample(true);
    try {
      const data = await analyzeWorksheetSampleRequest({ username: session.username, file });
      setSampleSpec(data.spec);
      setSampleReferenceContext(data.referenceContext || null);
      setSampleFromCache(Boolean(data.fromCache));
      // GIAI ĐOẠN 9: tự động áp dụng NGAY nếu phân tích ra được cấu trúc hữu ích - không còn chờ
      // giáo viên bấm nút phụ. Lưu snapshot exerciseCounts HIỆN TẠI (trước khi ghi đè) để có thể
      // đảo lại đúng như cũ nếu giáo viên bấm "Dùng cấu hình mặc định thay vào đó".
      if (data.spec?.detectedExercises?.length > 0) {
        setExerciseCounts((prevCounts) => {
          setPreSampleExerciseCounts(prevCounts);
          return applyDetectedExercisesToCounts(data.spec, visibleExercises);
        });
        setSampleStructureApplied(true);
      }
    } catch (err) {
      setSampleError(err.message);
    } finally {
      setAnalyzingSample(false);
    }
  }

  function clearSample() {
    setSampleFile(null);
    setSampleSpec(null);
    setSampleReferenceContext(null);
    setSampleError("");
    // Bỏ mẫu -> nếu vừa tự động áp dụng cấu trúc mẫu, đảo lại đúng cấu hình trước đó để tránh
    // giáo viên bối rối vì số liệu trên form không còn liên quan đến file vừa bỏ đi.
    if (sampleStructureApplied && preSampleExerciseCounts) {
      setExerciseCounts(preSampleExerciseCounts);
    }
    setSampleStructureApplied(false);
    setPreSampleExerciseCounts(null);
  }

  // Hàm sinh phiếu DÙNG CHUNG cho cả submit form lần đầu VÀ nút "🔄 Tạo phiên bản khác" - cùng
  // 1 bộ tham số (grade/exerciseCounts/sampleSpec giữ nguyên), chỉ khác ở chỗ previousLayoutId
  // luôn được cập nhật nên layout/số liệu/bài toán mới sẽ khác lần trước (xem worksheetGenerator.js:
  // code-sinh luôn random số liệu mỗi lần gọi, AI-sinh bài toán cũng luôn ra nội dung mới).
  async function generate() {
    setError("");
    if (totalSections === 0) {
      setError("Chọn ít nhất 1 dạng bài tập.");
      return;
    }
    const session = getSession();
    if (!session) {
      setError("Phiên đăng nhập đã hết, vui lòng tải lại trang.");
      return;
    }

    setLoading(true);
    try {
      const data = await generateWorksheetRequest({
        username: session.username,
        grade,
        subject,
        includeAnswers,
        exerciseCounts,
        previousLayoutId: lastLayoutId,
        sampleSpec,
        referenceContext: sampleReferenceContext,
        favoriteLayoutId,
        sgkVolume,
        sgkChapterId: sgkChapterId || null,
      });
      setLastLayoutId(data?.layout?.id || null);
      setHasGenerated(true);
      setFavoriteSavedNotice("");
      setGenerateWarnings(data?.warnings || []);
      onGenerated({ worksheet: data, meta: { title } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    generate();
  }

  /** GIAI ĐOẠN 9: nút "Áp dụng lại cấu trúc từ phiếu mẫu" - dùng khi giáo viên đã bấm "Dùng cấu
   * hình mặc định thay vào đó" trước đó nhưng đổi ý muốn quay lại đúng cấu trúc mẫu. Hành vi y
   * hệt lúc tự động áp dụng lần đầu (THAY THẾ hoàn toàn, không cộng dồn). */
  function reapplySampleStructure() {
    if (!sampleSpec?.detectedExercises?.length) return;
    setExerciseCounts((prevCounts) => {
      setPreSampleExerciseCounts(prevCounts);
      return applyDetectedExercisesToCounts(sampleSpec, visibleExercises);
    });
    setSampleStructureApplied(true);
  }

  /** GIAI ĐOẠN 9: "Dùng cấu hình mặc định thay vào đó" - đảo lại đúng exerciseCounts TRƯỚC khi hệ
   * thống tự động áp dụng cấu trúc mẫu (snapshot lưu trong preSampleExerciseCounts). Nếu vì lý do
   * nào đó không có snapshot (VD dữ liệu cũ), fallback về defaultCount chuẩn của catalog. */
  function revertToDefaultStructure() {
    setExerciseCounts(preSampleExerciseCounts || defaultCountsFor(grade, subject));
    setSampleStructureApplied(false);
  }

  // "⭐ Lưu bố cục này làm yêu thích" - lưu layoutId của phiếu VỪA tạo (lastLayoutId), để những
  // lần tạo phiếu sau (kể cả sau khi đóng app, đăng nhập lại) có ~45% cơ hội ưu tiên dùng lại
  // đúng bố cục này (xem pickLayoutWithPreference() trong worksheetLayoutTemplates.js).
  async function handleSaveFavorite() {
    if (!lastLayoutId) return;
    setSavingFavorite(true);
    setFavoriteSavedNotice("");
    try {
      await saveWorksheetPreferenceRequest({ favoriteLayoutId: lastLayoutId });
      setFavoriteLayoutId(lastLayoutId);
      setFavoriteSavedNotice("Đã lưu! Các lần tạo phiếu sau sẽ ưu tiên bố cục này.");
    } catch (err) {
      setFavoriteSavedNotice(`Lỗi khi lưu: ${err.message}`);
    } finally {
      setSavingFavorite(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Khối lớp</label>
          <select value={grade} onChange={(e) => setGrade(e.target.value)} className={inputClass}>
            {GRADES.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>
        {/* ================== GIAI ĐOẠN 6 (mở rộng sang Tiếng Việt) ==================
            Chọn môn quyết định TOÀN BỘ danh sách dạng bài bên dưới (visibleExercises), thứ tự
            mặc định, và tiêu đề gợi ý (DEFAULT_TITLE_BY_SUBJECT) - đổi môn coi như "làm mới"
            phần chọn dạng bài, giống hệt hành vi đổi khối lớp. */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Môn học</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass}>
            {WORKSHEET_SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Tiêu đề phiếu</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
      </div>

      {/* ================== GIAI ĐOẠN 5 (liên kết SGK markdown) ==================
          Chỉ hiện cho LOP_1/LOP_2 (Mầm non không có SGK theo chương chính thức, giống cách
          LessonPlanForm.jsx ẩn phần này với "isPreschoolGrade"). Chọn 1 chương -> nội dung
          chương đó được ưu tiên CAO NHẤT làm ngữ cảnh cho "giải toán có lời văn" (xem
          worksheetGenerator.js: resolveSgkChapterContext, cao hơn cả file mẫu upload). */}
      {hasSgkForGrade && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Tập</label>
            <select value={sgkVolume} onChange={(e) => setSgkVolume(Number(e.target.value))} className={inputClass}>
              <option value={1}>Tập 1</option>
              <option value={2}>Tập 2</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Bài/Chương SGK (tuỳ chọn)</label>
            <select
              value={sgkChapterId}
              onChange={(e) => setSgkChapterId(e.target.value)}
              className={inputClass}
              disabled={loadingChapters}
            >
              <option value="">
                {loadingChapters ? "Đang tải danh sách..." : "-- Không liên kết SGK --"}
              </option>
              {availableChapters.map((c) => (
                <option key={c.chapter} value={c.chapter}>
                  {c.isAdvancedBook ? "Sách nâng cao (toàn bộ)" : `Chương/Bài ${c.chapter}`}
                </option>
              ))}
            </select>
            {chaptersError && <p className="mt-1 text-xs text-red-600">{chaptersError}</p>}
          </div>
        </div>
      )}

      {/* ================== GIAI ĐOẠN 9, BƯỚC 2 (Tầng B - catalog theo chủ đề SGK) ==================
          "Gói chủ đề" - bấm 1 nút bật NGAY cả nhóm dạng bài liên quan (VD "Thời gian" = xem đồng
          hồ + các ngày trong tuần) thay vì phải tự nhớ bật rời rạc từng ô bên dưới. CHỈ hiện khi
          có gói khả dụng cho đúng khối lớp/môn đang chọn (đợt này CHỈ có Lớp 1/Toán - xem
          worksheetTopicPackages.js). CỘNG DỒN vào lựa chọn hiện tại, không xoá lựa chọn cũ (xem
          applyTopicPackage() ở trên). */}
      {topicPackages.length > 0 && (
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Chủ đề SGK (tuỳ chọn) - bấm để bật nhanh cả nhóm dạng bài liên quan
          </label>
          <div className="flex flex-wrap gap-2">
            {topicPackages.map((topic) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => applyTopicPackage(topic)}
                title={topic.description}
                className="rounded-full border border-teal-300 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800 hover:bg-teal-100"
              >
                {topic.icon} {topic.label}
              </button>
            ))}
          </div>
        </div>
      )}


      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">Chọn dạng bài + số lượng</p>
          {/* GIAI ĐOẠN 3 MỚI: gợi ý dùng lại công thức đề đã lưu cho ĐÚNG khối lớp này - không tự
              động áp, giáo viên chủ động bấm để tránh mất công vừa chỉnh tay xong. */}
          {hasSavedFormulaForGrade && (
            <button
              type="button"
              onClick={applySavedFormula}
              className="flex items-center gap-1 text-xs font-medium text-brand-700 underline decoration-dotted"
              title="Điền lại đúng tổ hợp dạng bài + số lượng đã lưu trước đó cho khối này"
            >
              <ClipboardCheck size={13} /> Dùng công thức đã lưu
            </button>
          )}
        </div>
        {visibleExercises.map(({ key, label, source }) => (
          <div key={key} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
            <span className="text-sm text-slate-700">
              {label}
              {source === "ai" && <span className="text-slate-400"> (dùng AI)</span>}
            </span>
            <input
              type="number"
              min={0}
              value={exerciseCounts[key] ?? 0}
              onChange={(e) => updateCount(key, e.target.value)}
              className="w-16 rounded border border-slate-300 px-2 py-1 text-center text-sm"
            />
          </div>
        ))}
        {/* GIAI ĐOẠN 3 MỚI: lưu ĐÚNG tổ hợp hiện tại làm "công thức đề" cho khối lớp này - không
            cần đã tạo phiếu trước đó, khác nút "Lưu bố cục" (yêu cầu lastLayoutId). */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            disabled={savingFormula || totalSections === 0}
            onClick={handleSaveFormula}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 underline decoration-dotted hover:text-slate-700 disabled:opacity-50"
            title="Lưu tổ hợp dạng bài + số lượng hiện tại làm công thức đề mặc định cho khối này"
          >
            {savingFormula ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Lưu công thức đề này cho {GRADES.find((g) => g.value === grade)?.label}
          </button>
        </div>
        {formulaSavedNotice && <p className="text-xs text-slate-500">{formulaSavedNotice}</p>}
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={includeAnswers} onChange={(e) => setIncludeAnswers(e.target.checked)} />
        Kèm đáp số (cho bài giải toán có lời văn)
      </label>

      <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-semibold text-slate-800">
          Phiếu mẫu tham khảo <span className="font-normal text-slate-500">(không bắt buộc)</span>
        </p>
        <p className="text-xs text-slate-500">
          Upload 1 phiếu bài tập giáo viên thấy đẹp (ảnh chụp, PDF, hoặc Word) - hệ thống sẽ ưu tiên chọn
          bố cục gần giống phong cách đó, và dùng chủ đề trong tài liệu làm ngữ cảnh cho bài toán có lời văn.
        </p>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <Upload size={15} />
          <span>{sampleFile ? sampleFile.name : "Chọn file phiếu mẫu (.docx, .pdf, hoặc ảnh chụp)"}</span>
          <input type="file" accept=".docx,.pdf,image/*" onChange={handleSampleFileChange} className="sr-only" />
        </label>

        {analyzingSample && (
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 size={13} className="animate-spin" /> Đang phân tích phong cách phiếu mẫu...
          </p>
        )}

        {sampleError && (
          <p className="flex items-start gap-2 text-xs text-red-600">
            <XCircle size={13} className="mt-0.5 shrink-0" /> {sampleError}
          </p>
        )}

        {sampleSpec && !analyzingSample && (
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 text-xs text-emerald-700">
              <CheckCircle2 size={13} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">
                  Đã phân tích xong{sampleFromCache ? " (lấy từ cache, không tốn thêm lượt AI)" : ""}.
                </p>
                {sampleSpec.moodKeywords && <p>Phong cách: {sampleSpec.moodKeywords}</p>}
                {sampleSpec.themeHints && <p>Chủ đề: {sampleSpec.themeHints}</p>}
                {sampleSpec.exerciseTypeHints?.length > 0 && (
                  <p>Dạng bài quan sát thấy: {sampleSpec.exerciseTypeHints.join(", ")}</p>
                )}
                {/* ================== GIAI ĐOẠN 9 (tự động áp dụng cấu trúc phiếu mẫu) ==================
                    TRƯỚC ĐÂY detectedExercises chỉ áp dụng khi giáo viên TỰ BẤM 1 nút phụ - quên
                    bấm thì phiếu vẫn sinh theo cấu hình cũ, không liên quan gì mẫu vừa tải lên.
                    Giờ áp dụng NGAY (xem handleSampleFileChange), banner dưới đây chỉ để THÔNG
                    BÁO đã áp dụng + cho phép đảo lại, không còn là hành động giáo viên PHẢI nhớ
                    bấm mới có tác dụng. */}
                {sampleSpec.detectedExercises?.length > 0 && sampleStructureApplied && (
                  <p className="mt-1 flex items-center gap-1 font-medium text-emerald-800">
                    <ClipboardCheck size={13} /> Đã áp dụng cấu trúc từ phiếu mẫu ({sampleSpec.detectedExercises.length} dạng bài).{" "}
                    <button
                      type="button"
                      onClick={revertToDefaultStructure}
                      className="underline decoration-dotted"
                      title="Đảo lại số lượng câu về cấu hình trước khi áp dụng mẫu"
                    >
                      Dùng cấu hình mặc định thay vào đó
                    </button>
                  </p>
                )}
                {sampleSpec.detectedExercises?.length > 0 && !sampleStructureApplied && (
                  <button
                    type="button"
                    onClick={reapplySampleStructure}
                    className="mt-1 flex items-center gap-1 font-medium text-emerald-800 underline decoration-dotted"
                    title="Điền lại số lượng câu theo đúng cấu trúc quan sát được từ phiếu mẫu"
                  >
                    <ClipboardCheck size={13} /> Áp dụng lại cấu trúc từ phiếu mẫu ({sampleSpec.detectedExercises.length} dạng bài)
                  </button>
                )}
              </div>
            </div>
            <button type="button" onClick={clearSample} className="shrink-0 text-xs text-slate-400 underline">
              Bỏ chọn
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {/* GIAI ĐOẠN 5: cảnh báo "mềm" (không phải lỗi chặn đứng) - VD tải SGK thất bại nhưng phiếu
          vẫn được tạo bình thường dựa trên lựa chọn khác. Màu vàng để phân biệt với error đỏ. */}
      {generateWarnings.length > 0 && (
        <div className="space-y-1 rounded-md border border-amber-200 bg-amber-50 p-2">
          {generateWarnings.map((w, i) => (
            <p key={i} className="text-xs text-amber-700">
              ⚠️ {w}
            </p>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? "Đang tạo phiếu..." : "🚀 TẠO PHIẾU BÀI TẬP"}
      </button>

      {/* ================== GIAI ĐOẠN 3: tiện lợi sau khi đã có ít nhất 1 phiếu ================== */}
      {hasGenerated && (
        <div className="space-y-2 border-t border-slate-200 pt-3">
          <div className="flex gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={generate}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-brand-600 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50 disabled:opacity-60"
              title="Giữ nguyên cấu hình (khối lớp, dạng bài, phiếu mẫu), đổi số liệu/bố cục/mascot sang phiên bản khác"
            >
              <RefreshCw size={15} /> Tạo phiên bản khác
            </button>
            <button
              type="button"
              disabled={savingFavorite || favoriteLayoutId === lastLayoutId}
              onClick={handleSaveFavorite}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-amber-400 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50 disabled:opacity-60"
              title="Lưu bố cục vừa dùng làm mặc định ưu tiên cho các lần tạo phiếu sau"
            >
              <Star size={15} className={favoriteLayoutId === lastLayoutId ? "fill-amber-400" : ""} />
              {favoriteLayoutId === lastLayoutId ? "Đã lưu làm yêu thích" : "Lưu bố cục này"}
            </button>
          </div>
          {favoriteSavedNotice && <p className="text-xs text-slate-500">{favoriteSavedNotice}</p>}
        </div>
      )}
    </form>
  );
}
