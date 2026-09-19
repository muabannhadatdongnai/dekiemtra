"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import ExamMatrixForm from "@/components/ExamMatrixForm";
import A4LivePreview from "@/components/A4LivePreview";
import ExportActions from "@/components/ExportActions";
import WorksheetForm from "@/components/WorksheetForm";
import WorksheetPreview from "@/components/WorksheetPreview";
import WorksheetExportActions from "@/components/WorksheetExportActions";
import LessonPlanForm from "@/components/LessonPlanForm";
import LessonPlanPreview from "@/components/LessonPlanPreview";
import LessonPlanExportActions from "@/components/LessonPlanExportActions";
import VietnameseExamForm from "@/components/VietnameseExamForm";
import VietnameseExamPreview from "@/components/VietnameseExamPreview";
import VietnameseExamExportActions from "@/components/VietnameseExamExportActions";
import ReportCommentForm from "@/components/ReportCommentForm";
import ReportCommentPreview from "@/components/ReportCommentPreview";
import ReportCommentExportActions from "@/components/ReportCommentExportActions";
import OutlineForm from "@/components/OutlineForm";
import OutlinePreview from "@/components/OutlinePreview";
import OutlineExportActions from "@/components/OutlineExportActions";
import KhgdForm from "@/components/KhgdForm";
import KhgdPreview from "@/components/KhgdPreview";
import KhgdExportActions from "@/components/KhgdExportActions";
import KhgdTieuHocForm from "@/components/KhgdTieuHocForm";
import KhgdTieuHocPreview from "@/components/KhgdTieuHocPreview";
import KhgdTieuHocExportActions from "@/components/KhgdTieuHocExportActions";
import HelpGuideView from "@/components/HelpGuideView";
import { getSession, clearSession, DISABLE_LOGIN, TEST_SESSION as TEST_USER } from "@/services/authService";
import { EMPTY_EXAM_RESULT } from "@/data/examResult";
import { EMPTY_LESSON_PLAN_RESULT } from "@/data/lessonPlanResult";
import { EMPTY_VIETNAMESE_EXAM_RESULT } from "@/data/vietnameseExamResult";
import { EMPTY_OUTLINE_RESULT } from "@/data/outlineResult";
import { EMPTY_KHGD_RESULT } from "@/data/khgdResult";
import { EMPTY_KHGD_TIEU_HOC_RESULT } from "@/data/khgdTieuHocResult";

// A2/A3/Giai đoạn 2/Bước 2 (Nhóm B): 6 chế độ làm việc "tạo nội dung" - "lessonPlan" (Soạn giáo
// án, Mầm non - Lớp 5), "worksheet" (Phiếu bài tập, Mầm non - Lớp 2), "vietnameseExam" (Đề Tiếng
// Việt Tiểu học, Lớp 1-5), "outline" (Đề cương Ôn tập, xem NEXT_STEPS.md Bước 2/Nhóm B), "exam"
// (Đề kiểm tra, Lớp 1-12), và "reportComment" (Nhận xét học bạ, Lớp 1-12). Thứ tự 6 tab đầu (nút
// bấm bên dưới) đã chốt đúng thứ tự khai báo ở đây. Chỉ 1 trong 6 được mount tại 1 thời điểm vì CẢ
// 6 chế độ đều dùng chung id="print-area" (CSS in ấn @media print chọn theo id) - mount nhiều hơn
// 1 cùng lúc sẽ vi phạm id trùng lặp và có thể in nhầm nội dung. "reportComment" xuất Word/Excel
// là chính (danh sách nhiều học sinh dạng thẻ, sửa trực tiếp trên màn hình), NHƯNG từ Bước 1 Việc
// #8 cũng có thêm "Tải PDF (bản phụ huynh)" - xem ReportCommentPdfView.jsx (khung in riêng, ẩn màn
// hình, chỉ hiện khi in) - vẫn theo đúng khuôn 1-mode-tại-1-thời-điểm ở trên.
//
// "help" (Hướng dẫn sử dụng, MỚI): KHÁC BẢN CHẤT với 6 mode trên - không gọi AI, không có Form
// nhập liệu, không tham gia in ấn (không dùng id="print-area"), chỉ hiển thị nội dung tài liệu
// tĩnh lấy từ src/data/helpGuideContent.js (xem HelpGuideView.jsx). Vì vậy render TOÀN CHIỀU RỘNG
// thay vì đặt trong layout 2 cột <aside>/<section> như 6 mode kia - xem nhánh điều kiện ở phần
// render bên dưới (đặt ngoài <div className="grid ...">, không phải 1 nhánh trong ternary cũ).
const MODES = {
  LESSON_PLAN: "lessonPlan",
  WORKSHEET: "worksheet",
  VIETNAMESE_EXAM: "vietnameseExam",
  OUTLINE: "outline",
  EXAM: "exam",
  REPORT_COMMENT: "reportComment",
  // "khgd" (MỚI): tab "Khung KHGD" - soạn Phụ lục III (CV 5512/BGDĐT-GDTrH, "Khung Kế hoạch giáo
  // dục của giáo viên"), đợt đầu áp dụng cho TOÀN BỘ môn học cấp THCS - xem NEXT_STEPS.md. KHÁC
  // 6 mode "tạo nội dung" còn lại: KHÔNG dùng chung id="print-area" (chỉ hỗ trợ "Tải Word", xem
  // giải thích trong globals.css/KhgdPreview.jsx), nên không vi phạm nguyên tắc "1 print-area tại
  // 1 thời điểm" dù mount cùng lúc với layout 2 cột như các mode kia.
  KHGD: "khgd",
  // "khgdTieuHoc" (MỚI, Phiên 47): tab RIÊNG cho Tiểu học - Phụ lục 2, CV2345/2021/BGDĐT-GDTH,
  // KHÁC HẲN cấu trúc "khgd" (Phụ lục III, CV5512, THCS/THPT) - xem khgdTieuHocBlueprint.js.
  // Tách tab riêng đúng nguyên tắc "mỗi cấp 1 router riêng" đã thống nhất từ đầu, KHÔNG nhét
  // chung vào tab "khgd" dù cùng chủ đề "Khung KHGD".
  KHGD_TIEU_HOC: "khgdTieuHoc",
  HELP: "help",
};

// Tính năng "Nhận xét học bạ" (xem tom-tat-tinh-nang-nhan-xet-hoc-ba.md): mỗi lượt tạo trả về
// { cap, doDai, results: [{hoTen, lop, comment, error}] } - KHÔNG dùng chung khuôn với
// EMPTY_*_RESULT các mode khác vì dữ liệu là DANH SÁCH nhiều học sinh, không phải 1 đề/giáo án.
const EMPTY_REPORT_COMMENT_RESULT = { cap: null, doDai: null, results: [] };

// ================== MỞ RỘNG LỚP 3, ĐỢT 3 ("tắt đăng nhập để test") ==================
// Cùng 1 biến với src/services/apiAuth.js (xem giải thích đầy đủ ở đó) - khi bật, bỏ qua hẳn màn
// hình đăng nhập, tự gán 1 "phiên test" cố định để giáo viên vào thẳng trang chính.
// ================== CẬP NHẬT (mở public mặc định) ==================
// Mặc định (không đặt biến này) giờ là CÔNG KHAI (không đăng nhập) - đổi theo yêu cầu mới nhất.
// Muốn bật lại đăng nhập sau này: đặt NEXT_PUBLIC_DISABLE_LOGIN=false rồi deploy lại - KHÔNG cần
// sửa code. Xem giải thích đầy đủ trong src/services/apiAuth.js.
// ĐÃ CHUYỂN: DISABLE_LOGIN/TEST_USER giờ định nghĩa DUY NHẤT 1 nơi trong authService.js (đổi tên
// thành TEST_SESSION ở đó, alias lại "TEST_USER" khi import để không phải sửa các chỗ dùng bên
// dưới) - tránh định nghĩa lặp lại ở nhiều file dễ lệch nhau (đã từng là nguyên nhân gây lỗi
// "Phiên đăng nhập đã hết" sai trong chế độ public, xem chú thích trong authService.js).

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [checkedSession, setCheckedSession] = useState(false);

  // ⚠️ GIAI ĐOẠN 4: gộp toàn bộ dữ liệu kết quả tạo đề (câu hỏi, rubric, thông tin chương,
  // cảnh báo, meta hiển thị) thành 1 object DUY NHẤT thay vì 6 useState() rời rạc trước đây -
  // xem cấu trúc "ExamResult" trong src/data/examResult.js. Thêm trường mới sau này (ví dụ
  // ngân hàng câu hỏi) chỉ cần sửa examResult.js, không phải rà lại từng useState() ở đây.
  const [examResult, setExamResult] = useState(EMPTY_EXAM_RESULT);

  // Tạo 4 Mã Đề (A, B, C, D) - xáo trộn front-end, không gọi lại AI
  const [variants, setVariants] = useState([]);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);

  // A2/A3: chế độ đang chọn + dữ liệu Phiếu bài tập/Giáo án (độc lập với examResult, giữ 3 luồng tách biệt)
  // Mặc định khi vào web là "Soạn giáo án" (MODES.LESSON_PLAN) - đây là tab vị trí 1, theo yêu cầu
  // người dùng (trước đó lỡ để mặc định là MODES.EXAM dù tab EXAM không còn ở vị trí đầu).
  const [mode, setMode] = useState(MODES.LESSON_PLAN);
  const [worksheetResult, setWorksheetResult] = useState(null); // { worksheet, meta } | null
  // "Tối ưu in đen trắng" (Phiên 23) - công tắc HIỂN THỊ/XUẤT FILE thuần tuý, KHÔNG thuộc dữ liệu
  // worksheetResult (không cần tạo lại phiếu khi bật/tắt) - dùng chung cho cả WorksheetPreview
  // (web + "In/Tải PDF") và WorksheetExportActions (nút "Tải Word"), xem comment chi tiết ở 2 file đó.
  const [worksheetBwMode, setWorksheetBwMode] = useState(false);
  const [lessonPlanResult, setLessonPlanResult] = useState(EMPTY_LESSON_PLAN_RESULT);
  const [vietnameseExamResult, setVietnameseExamResult] = useState(EMPTY_VIETNAMESE_EXAM_RESULT);
  const [reportCommentResult, setReportCommentResult] = useState(EMPTY_REPORT_COMMENT_RESULT);
  const [outlineResult, setOutlineResult] = useState(EMPTY_OUTLINE_RESULT);
  const [khgdResult, setKhgdResult] = useState(EMPTY_KHGD_RESULT);
  const [khgdTieuHocResult, setKhgdTieuHocResult] = useState(EMPTY_KHGD_TIEU_HOC_RESULT);

  // Khôi phục session từ localStorage khi tải lại trang
  useEffect(() => {
    setUser(DISABLE_LOGIN ? TEST_USER : getSession());
    setCheckedSession(true);
  }, []);

  function handleLogout() {
    clearSession();
    setUser(DISABLE_LOGIN ? TEST_USER : null); // chế độ test: đăng xuất xong vẫn ở lại trang chính, không bắt đăng nhập lại
    setExamResult(EMPTY_EXAM_RESULT);
    setVariants([]);
    setActiveVariantIndex(0);
    setWorksheetResult(null);
    setLessonPlanResult(EMPTY_LESSON_PLAN_RESULT);
    setVietnameseExamResult(EMPTY_VIETNAMESE_EXAM_RESULT);
    setReportCommentResult(EMPTY_REPORT_COMMENT_RESULT);
    setOutlineResult(EMPTY_OUTLINE_RESULT);
    setKhgdResult(EMPTY_KHGD_RESULT);
    setKhgdTieuHocResult(EMPTY_KHGD_TIEU_HOC_RESULT);
    setMode(MODES.LESSON_PLAN);
  }

  function handleGenerated(result) {
    setExamResult(result);
    setVariants([]);
    setActiveVariantIndex(0);
  }

  function handleVariantsGenerated(newVariants) {
    setVariants(newVariants);
    setActiveVariantIndex(0);
  }

  function handleWorksheetGenerated(result) {
    setWorksheetResult(result);
  }

  function handleLessonPlanGenerated(result) {
    setLessonPlanResult(result);
  }

  function handleVietnameseExamGenerated(result) {
    setVietnameseExamResult(result);
  }

  function handleReportCommentGenerated(result) {
    setReportCommentResult(result);
  }

  function handleOutlineGenerated(result) {
    setOutlineResult(result);
  }

  function handleKhgdGenerated(result) {
    setKhgdResult(result);
  }

  function handleKhgdTieuHocGenerated(result) {
    setKhgdTieuHocResult(result);
  }

  const { questions, teacherRubric, chaptersInfo, typeByLevel, warnings, meta } = examResult;

  // Câu hỏi đang hiển thị trong khung xem trước: mã đề đang chọn (nếu đã tạo 4 mã) hoặc đề gốc
  const displayedQuestions = variants.length ? variants[activeVariantIndex].questions : questions;
  const displayedExamCode = variants.length ? variants[activeVariantIndex].examCode : meta?.examCode;

  if (!checkedSession) return null; // tránh nhấp nháy trước khi đọc xong localStorage

  if (!user) {
    return <LoginForm onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* A2: Tab chuyển đổi "Đề kiểm tra" <-> "Phiếu bài tập". no-print vì chỉ là điều khiển,
            không liên quan nội dung in ra. */}
        <div className="no-print mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode(MODES.LESSON_PLAN)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              mode === MODES.LESSON_PLAN
                ? "bg-brand-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            📘 Soạn giáo án
          </button>
          <button
            type="button"
            onClick={() => setMode(MODES.WORKSHEET)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              mode === MODES.WORKSHEET
                ? "bg-brand-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            🧮 Phiếu bài tập
          </button>
          <button
            type="button"
            onClick={() => setMode(MODES.VIETNAMESE_EXAM)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              mode === MODES.VIETNAMESE_EXAM
                ? "bg-brand-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            📖 Đề Tiếng Việt Tiểu học
          </button>
          <button
            type="button"
            onClick={() => setMode(MODES.OUTLINE)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              mode === MODES.OUTLINE
                ? "bg-brand-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            🧭 Đề cương Ôn tập
          </button>
          <button
            type="button"
            onClick={() => setMode(MODES.EXAM)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              mode === MODES.EXAM
                ? "bg-brand-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            📝 Đề kiểm tra
          </button>
          <button
            type="button"
            onClick={() => setMode(MODES.REPORT_COMMENT)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              mode === MODES.REPORT_COMMENT
                ? "bg-brand-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            🗒️ Nhận xét học bạ
          </button>
          <button
            type="button"
            onClick={() => setMode(MODES.KHGD)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              mode === MODES.KHGD
                ? "bg-brand-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            🗂️ Khung KHGD
          </button>
          <button
            type="button"
            onClick={() => setMode(MODES.KHGD_TIEU_HOC)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              mode === MODES.KHGD_TIEU_HOC
                ? "bg-brand-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            🧒 Khung KHGD (Tiểu học)
          </button>
          <button
            type="button"
            onClick={() => setMode(MODES.HELP)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              mode === MODES.HELP
                ? "bg-brand-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            📚 Hướng dẫn sử dụng
          </button>
        </div>

        {/* Tab "Hướng dẫn sử dụng": KHÔNG dùng layout 2 cột (không có Form/AI/in ấn) - render
            toàn chiều rộng, tách hẳn khỏi khối grid bên dưới của 6 mode tạo nội dung. */}
        {mode === MODES.HELP ? (
          <HelpGuideView />
        ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
          <aside className="no-print h-fit rounded-xl border border-slate-200 bg-white p-5">
            {mode === MODES.EXAM && <ExamMatrixForm onGenerated={handleGenerated} />}
            {mode === MODES.WORKSHEET && <WorksheetForm onGenerated={handleWorksheetGenerated} />}
            {mode === MODES.LESSON_PLAN && <LessonPlanForm onGenerated={handleLessonPlanGenerated} />}
            {mode === MODES.VIETNAMESE_EXAM && <VietnameseExamForm onGenerated={handleVietnameseExamGenerated} />}
            {mode === MODES.OUTLINE && <OutlineForm onGenerated={handleOutlineGenerated} />}
            {mode === MODES.KHGD && <KhgdForm onGenerated={handleKhgdGenerated} />}
            {mode === MODES.KHGD_TIEU_HOC && <KhgdTieuHocForm onGenerated={handleKhgdTieuHocGenerated} />}
            {mode === MODES.REPORT_COMMENT && <ReportCommentForm onGenerated={handleReportCommentGenerated} />}
          </aside>

          {mode === MODES.EXAM ? (
            <section className="space-y-4">
              {warnings.length > 0 && (
                <div className="no-print rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                  <p className="mb-1 font-semibold">⚠️ Lưu ý:</p>
                  <ul className="list-disc space-y-0.5 pl-5">
                    {warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
              <ExportActions
                examMeta={meta}
                questions={questions}
                teacherRubric={teacherRubric}
                chaptersInfo={chaptersInfo}
                typeByLevel={typeByLevel}
                variants={variants}
                activeVariantIndex={activeVariantIndex}
                onVariantsGenerated={handleVariantsGenerated}
                onSelectVariant={setActiveVariantIndex}
              />
              <div className="overflow-auto rounded-xl bg-slate-100 p-4">
                <A4LivePreview
                  examMeta={{ ...meta, examCode: displayedExamCode }}
                  questions={displayedQuestions}
                  teacherRubric={teacherRubric}
                  chaptersInfo={chaptersInfo}
                  typeByLevel={typeByLevel}
                />
              </div>
            </section>
          ) : mode === MODES.WORKSHEET ? (
            <section className="space-y-4">
              <WorksheetExportActions
                worksheet={worksheetResult?.worksheet}
                meta={worksheetResult?.meta}
                bwMode={worksheetBwMode}
                onToggleBwMode={setWorksheetBwMode}
              />
              <div className="overflow-auto rounded-xl bg-slate-100 p-4">
                <WorksheetPreview worksheet={worksheetResult?.worksheet} meta={worksheetResult?.meta} bwMode={worksheetBwMode} />
              </div>
            </section>
          ) : mode === MODES.LESSON_PLAN ? (
            <section className="space-y-4">
              {lessonPlanResult.warnings.length > 0 && (
                <div className="no-print rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                  <p className="mb-1 font-semibold">⚠️ Lưu ý:</p>
                  <ul className="list-disc space-y-0.5 pl-5">
                    {lessonPlanResult.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
              <LessonPlanExportActions
                lessonPlan={lessonPlanResult.lessonPlan}
                timeline={lessonPlanResult.timeline}
                meta={lessonPlanResult.meta}
              />
              <div className="overflow-auto rounded-xl bg-slate-100 p-4">
                <LessonPlanPreview
                  lessonPlan={lessonPlanResult.lessonPlan}
                  timeline={lessonPlanResult.timeline}
                  meta={lessonPlanResult.meta}
                />
              </div>
            </section>
          ) : mode === MODES.VIETNAMESE_EXAM ? (
            <section className="space-y-4">
              {vietnameseExamResult.warnings.length > 0 && (
                <div className="no-print rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                  <p className="mb-1 font-semibold">⚠️ Lưu ý:</p>
                  <ul className="list-disc space-y-0.5 pl-5">
                    {vietnameseExamResult.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
              <VietnameseExamExportActions results={vietnameseExamResult.results} meta={vietnameseExamResult.meta} />
              <div className="overflow-auto rounded-xl bg-slate-100 p-4">
                <VietnameseExamPreview results={vietnameseExamResult.results} meta={vietnameseExamResult.meta} />
              </div>
            </section>
          ) : mode === MODES.OUTLINE ? (
            <section className="space-y-4">
              {outlineResult.warnings.length > 0 && (
                <div className="no-print rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                  <p className="mb-1 font-semibold">⚠️ Lưu ý:</p>
                  <ul className="list-disc space-y-0.5 pl-5">
                    {outlineResult.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
              <OutlineExportActions outline={outlineResult.outline} meta={outlineResult.meta} />
              <div className="overflow-auto rounded-xl bg-slate-100 p-4">
                <OutlinePreview outline={outlineResult.outline} meta={outlineResult.meta} />
              </div>
            </section>
          ) : mode === MODES.KHGD ? (
            <section className="space-y-4">
              {khgdResult.warnings.length > 0 && (
                <div className="no-print rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                  <p className="mb-1 font-semibold">⚠️ Lưu ý:</p>
                  <ul className="list-disc space-y-0.5 pl-5">
                    {khgdResult.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
              <KhgdExportActions
                lessons={khgdResult.lessons}
                kiemTraDinhKy={khgdResult.kiemTraDinhKy}
                meta={khgdResult.meta}
              />
              <div className="overflow-auto rounded-xl bg-slate-100 p-4">
                <KhgdPreview
                  lessons={khgdResult.lessons}
                  kiemTraDinhKy={khgdResult.kiemTraDinhKy}
                  meta={khgdResult.meta}
                />
              </div>
            </section>
          ) : mode === MODES.KHGD_TIEU_HOC ? (
            <section className="space-y-4">
              {khgdTieuHocResult.warnings.length > 0 && (
                <div className="no-print rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                  <p className="mb-1 font-semibold">⚠️ Lưu ý:</p>
                  <ul className="list-disc space-y-0.5 pl-5">
                    {khgdTieuHocResult.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
              <KhgdTieuHocExportActions lessons={khgdTieuHocResult.lessons} meta={khgdTieuHocResult.meta} />
              <div className="overflow-auto rounded-xl bg-slate-100 p-4">
                <KhgdTieuHocPreview lessons={khgdTieuHocResult.lessons} meta={khgdTieuHocResult.meta} />
              </div>
            </section>
          ) : (
            <section className="space-y-4">
              <ReportCommentExportActions cap={reportCommentResult.cap} results={reportCommentResult.results} />
              <div className="overflow-auto rounded-xl bg-slate-100 p-4">
                <ReportCommentPreview
                  cap={reportCommentResult.cap}
                  results={reportCommentResult.results}
                  onResultsChange={(results) => setReportCommentResult((r) => ({ ...r, results }))}
                />
              </div>
            </section>
          )}
        </div>
        )}
      </main>
    </div>
  );
}
