"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import ExamMatrixForm from "@/components/ExamMatrixForm";
import A4LivePreview from "@/components/A4LivePreview";
import ExportActions from "@/components/ExportActions";
import { getSession, clearSession } from "@/services/authService";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [checkedSession, setCheckedSession] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [teacherRubric, setTeacherRubric] = useState([]);
  const [examMeta, setExamMeta] = useState(null);
  const [warnings, setWarnings] = useState([]);

  // Tạo 4 Mã Đề (A, B, C, D) - xáo trộn front-end, không gọi lại AI
  const [variants, setVariants] = useState([]);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);

  // Khôi phục session từ localStorage khi tải lại trang
  useEffect(() => {
    setUser(getSession());
    setCheckedSession(true);
  }, []);

  function handleLogout() {
    clearSession();
    setUser(null);
    setQuestions([]);
    setTeacherRubric([]);
    setExamMeta(null);
    setVariants([]);
    setWarnings([]);
  }

  function handleGenerated(data) {
    setQuestions(data.questions);
    setTeacherRubric(data.teacherRubric || []);
    setExamMeta(data.meta);
    setVariants([]);
    setActiveVariantIndex(0);
    setWarnings(data.warnings || []);
  }

  function handleVariantsGenerated(newVariants) {
    setVariants(newVariants);
    setActiveVariantIndex(0);
  }

  // Câu hỏi đang hiển thị trong khung xem trước: mã đề đang chọn (nếu đã tạo 4 mã) hoặc đề gốc
  const displayedQuestions = variants.length ? variants[activeVariantIndex].questions : questions;
  const displayedExamCode = variants.length ? variants[activeVariantIndex].examCode : examMeta?.examCode;

  if (!checkedSession) return null; // tránh nhấp nháy trước khi đọc xong localStorage

  if (!user) {
    return <LoginForm onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Split-screen: Trái 40% (Bảng điều khiển) - Phải 60% (Xem trước A4) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr]">
          <aside className="no-print h-fit rounded-xl border border-slate-200 bg-white p-5">
            <ExamMatrixForm onGenerated={handleGenerated} />
          </aside>

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
              examMeta={examMeta}
              questions={questions}
              teacherRubric={teacherRubric}
              variants={variants}
              activeVariantIndex={activeVariantIndex}
              onVariantsGenerated={handleVariantsGenerated}
              onSelectVariant={setActiveVariantIndex}
            />
            <div className="overflow-auto rounded-xl bg-slate-100 p-4">
              <A4LivePreview
                examMeta={{ ...examMeta, examCode: displayedExamCode }}
                questions={displayedQuestions}
                teacherRubric={teacherRubric}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
