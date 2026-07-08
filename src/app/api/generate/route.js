import { NextResponse } from "next/server";
import users from "@/data/users.json";
import { fetchMultipleChapters } from "@/services/githubService";
import { generateFullExam } from "@/services/geminiEngine";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      username, // gửi kèm từ localStorage session phía client để xác thực nhẹ (không dùng JWT)
      grade,
      subject = "Toan",
      volume = 1,
      chapters, // string[]
      typeByLevel = {}, // { NHAN_BIET: "trac_nghiem"|"tu_luan", ... } - RIÊNG cho từng mức độ
      matrix, // { NHAN_BIET, THONG_HIEU, VAN_DUNG, VAN_DUNG_CAO }
      includeAnswers = false, // mặc định KHÔNG tạo đáp án để tiết kiệm credit AI
      useVisualQuestions = false, // câu hỏi trực quan (đặt tính, sơ đồ, hình đếm...) - đặc trưng Tiểu học
      existingQuestions = [],
    } = body;

    if (!username || !users[username]) {
      return NextResponse.json({ error: "Vui lòng đăng nhập lại." }, { status: 401 });
    }

    if (!grade || !chapters?.length || !matrix) {
      return NextResponse.json(
        { error: "Thiếu tham số: grade, chapters, matrix là bắt buộc." },
        { status: 400 }
      );
    }

    const sourceMarkdown = await fetchMultipleChapters({ grade, subject, volume, chapters });

    const { questions, teacherRubric, warnings } = await generateFullExam({
      grade,
      subject,
      chapter: chapters.join(", "),
      sourceMarkdown,
      matrix,
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
      warnings, // các mức độ bị thiếu câu do trùng lặp/lỗi API - giáo viên cần biết để bổ sung
    });
  } catch (err) {
    console.error("[/api/generate] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi tạo đề." },
      { status: 500 }
    );
  }
}
