import { NextResponse } from "next/server";
import users from "@/data/users.json";
import { fetchChaptersSeparately } from "@/services/githubService";
import { generateFullExam } from "@/services/geminiEngine";

/**
 * ⚠️ GIAI ĐOẠN 1 - MA TRẬN THEO CHƯƠNG:
 * Thay vì "chapters" (string[]) + "matrix" phẳng (tổng số câu theo mức độ, không phân biệt
 * chương), giờ nhận "chapterMatrix": { [chapterId]: { NHAN_BIET, THONG_HIEU, VAN_DUNG, VAN_DUNG_CAO } }
 * - cho phép giáo viên kiểm soát chính xác số câu ở TỪNG chương, TỪNG mức độ.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      username, // gửi kèm từ localStorage session phía client để xác thực nhẹ (không dùng JWT)
      grade,
      subject = "Toan",
      volume = 1,
      chapterMatrix, // { [chapterId]: { NHAN_BIET, THONG_HIEU, VAN_DUNG, VAN_DUNG_CAO } }
      typeByLevel = {}, // { NHAN_BIET: "trac_nghiem"|"tu_luan", ... } - RIÊNG cho từng mức độ
      includeAnswers = false, // mặc định KHÔNG tạo đáp án để tiết kiệm credit AI
      useVisualQuestions = false, // câu hỏi trực quan (đặt tính, sơ đồ, hình đếm...) - đặc trưng Tiểu học
      existingQuestions = [],
    } = body;

    if (!username || !users[username]) {
      return NextResponse.json({ error: "Vui lòng đăng nhập lại." }, { status: 401 });
    }

    const chapterIds = Object.keys(chapterMatrix || {});
    if (!grade || chapterIds.length === 0) {
      return NextResponse.json(
        { error: "Thiếu tham số: grade và chapterMatrix (ít nhất 1 chương) là bắt buộc." },
        { status: 400 }
      );
    }

    // Tải nội dung RIÊNG từng chương (không gộp chung 1 blob) để AI phân bổ đúng số câu/chương
    const chaptersInfo = await fetchChaptersSeparately({ grade, subject, volume, chapters: chapterIds });

    const { questions, teacherRubric, warnings } = await generateFullExam({
      grade,
      subject,
      chaptersInfo,
      chapterMatrix,
      typeByLevel,
      includeAnswers,
      useVisualQuestions,
      existingQuestions,
    });

    return NextResponse.json({
      success: true,
      totalQuestions: questions.length,
      questions,
      teacherRubric,
      chaptersInfo: chaptersInfo.map((c) => ({ chapterId: c.chapterId, label: c.label })), // không trả markdown đầy đủ về client (nặng, không cần)
      typeByLevel, // cần để dựng Ma trận đề thi + Bản đặc tả (Giai đoạn 2)
      warnings, // liệt kê chính xác chương + mức độ nào bị thiếu câu
    });
  } catch (err) {
    console.error("[/api/generate] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi tạo đề." },
      { status: 500 }
    );
  }
}
