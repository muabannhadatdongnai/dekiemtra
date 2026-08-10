"use client";

import { useEffect, useRef, useState } from "react";
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
import ColoringPageForm from "@/components/ColoringPageForm";
import ColoringPagePreview from "@/components/ColoringPagePreview";
import ColoringExportActions from "@/components/ColoringExportActions";
import UsageWidget from "@/components/UsageWidget";
import { getSession, clearSession } from "@/services/authService";
import { EMPTY_EXAM_RESULT } from "@/data/examResult";
import { EMPTY_LESSON_PLAN_RESULT } from "@/data/lessonPlanResult";
import { EMPTY_VIETNAMESE_EXAM_RESULT } from "@/data/vietnameseExamResult";

// A2/A3/Giai đoạn 2: 5 chế độ làm việc - "exam" (Đề kiểm tra, Lớp 1-12), "worksheet" (Phiếu bài
// tập, Mầm non - Lớp 2), "lessonPlan" (Soạn giáo án, Mầm non - Lớp 5), "vietnameseExam" (Đề
// Tiếng Việt Tiểu học, Lớp 1-5 - xem PROJECT_SUMMARY.md Phần B) và "coloring" (Tập tô màu cho
// phụ huynh - tạo tranh line-art từ ảnh gia đình/nhân vật upload, dùng Gemini image generation
// riêng, KHÔNG dùng chung API key với 4 mode kia - xem coloringImageKeyPool.js). Chỉ 1 trong 5
// được mount tại 1 thời điểm vì cả 5 đều dùng chung id="print-area" (CSS in ấn @media print chọn
// theo id) - mount nhiều hơn 1 cùng lúc sẽ vi phạm id trùng lặp và có thể in nhầm nội dung.
const MODES = {
  EXAM: "exam",
  WORKSHEET: "worksheet",
  LESSON_PLAN: "lessonPlan",
  VIETNAMESE_EXAM: "vietnameseExam",
  COLORING: "coloring",
};

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
  const [mode, setMode] = useState(MODES.EXAM);
  const [worksheetResult, setWorksheetResult] = useState(null); // { worksheet, meta } | null
  const [lessonPlanResult, setLessonPlanResult] = useState(EMPTY_LESSON_PLAN_RESULT);
  const [vietnameseExamResult, setVietnameseExamResult] = useState(EMPTY_VIETNAMESE_EXAM_RESULT);

  // Tab "Tập tô màu": lineArtImage/originalImage là data URL base64 trả về từ
  // /api/generate-coloring-page, palette là mảng mã HEX gợi ý. null khi chưa tạo tranh nào.
  const [coloringResult, setColoringResult] = useState(null);
  // Ref trỏ vào khung .a4-page thật đang hiển thị - dùng để html2canvas chụp xuất PNG
  // (xem ColoringExportActions.jsx), KHÔNG dựng lại layout lần 2 bằng canvas thủ công.
  const coloringPageRef = useRef(null);

  // Khôi phục session từ localStorage khi tải lại trang
  useEffect(() => {
    setUser(getSession());
    setCheckedSession(true);
  }, []);

  function handleLogout() {
    clearSession();
    setUser(null);
    setExamResult(EMPTY_EXAM_RESULT);
    setVariants([]);
    setActiveVariantIndex(0);
    setWorksheetResult(null);
    setLessonPlanResult(EMPTY_LESSON_PLAN_RESULT);
    setVietnameseExamResult(EMPTY_VIETNAMESE_EXAM_RESULT);
    setColoringResult(null);
    setMode(MODES.EXAM);
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
        <div className="no-print mb-4 flex gap-2">
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
            onClick={() => setMode(MODES.COLORING)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              mode === MODES.COLORING
                ? "bg-brand-600 text-white"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            🎨 Tập tô màu
          </button>
        </div>

        {/* Split-screen: Trái 40% (Bảng điều khiển) - Phải 60% (Xem trước A4) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
          <aside className="no-print h-fit rounded-xl border border-slate-200 bg-white p-5">
            {mode === MODES.EXAM && <ExamMatrixForm onGenerated={handleGenerated} />}
            {mode === MODES.WORKSHEET && <WorksheetForm onGenerated={handleWorksheetGenerated} />}
            {mode === MODES.LESSON_PLAN && <LessonPlanForm onGenerated={handleLessonPlanGenerated} />}
            {mode === MODES.VIETNAMESE_EXAM && <VietnameseExamForm onGenerated={handleVietnameseExamGenerated} />}
            {mode === MODES.COLORING && <ColoringPageForm onGenerated={setColoringResult} />}
            {mode !== MODES.COLORING && (
              <div className="mt-4">
                <UsageWidget />
              </div>
            )}
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
              <WorksheetExportActions worksheet={worksheetResult?.worksheet} meta={worksheetResult?.meta} />
              <div className="overflow-auto rounded-xl bg-slate-100 p-4">
                <WorksheetPreview worksheet={worksheetResult?.worksheet} meta={worksheetResult?.meta} />
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
          ) : (
            <section className="space-y-4">
              <ColoringExportActions pageRef={coloringPageRef} disabled={!coloringResult} />
              <div className="overflow-auto rounded-xl bg-slate-100 p-4">
                <ColoringPagePreview
                  ref={coloringPageRef}
                  lineArtImage={coloringResult?.lineArtImage}
                  originalImage={coloringResult?.originalImage}
                  palette={coloringResult?.palette}
                  title={coloringResult?.title}
                  subtitle={coloringResult?.subtitle}
                />
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
