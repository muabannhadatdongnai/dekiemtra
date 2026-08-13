import { NextResponse } from "next/server";
import { fetchChaptersSeparately } from "@/services/githubService";
import { orchestrateExamGeneration } from "@/services/examOrchestrator";
import { requireAuth, requireWithinTeacherGenerateLimit } from "@/services/apiAuth";
import {
  clampChapterMatrix,
  getExamMaxPerCell,
  getExamMaxTotalQuestions,
} from "@/services/contentGenerationLimits";

/**
 * ⚠️ GIAI ĐOẠN 1 - MA TRẬN THEO CHƯƠNG:
 * Thay vì "chapters" (string[]) + "matrix" phẳng (tổng số câu theo mức độ, không phân biệt
 * chương), giờ nhận "chapterMatrix": { [chapterId]: { NHAN_BIET, THONG_HIEU, VAN_DUNG, VAN_DUNG_CAO } }
 * - cho phép giáo viên kiểm soát chính xác số câu ở TỪNG chương, TỪNG mức độ.
 */
export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const limitError = await requireWithinTeacherGenerateLimit(auth.session.username);
    if (limitError) return limitError;

    const body = await request.json();
    const {
      // ⚠️ KHÔNG dùng "username" từ body để xác thực (đó là lỗi bảo mật trước đây - client tự
      // gửi gì cũng được, không có gì ràng buộc). Danh tính thật lấy từ auth.session.username
      // (đã verify chữ ký token) - xem services/apiAuth.js.
      grade,
      subject = "Toan",
      volume = 1,
      chapterMatrix, // { [chapterId]: { NHAN_BIET, THONG_HIEU, VAN_DUNG, VAN_DUNG_CAO } }
      typeByLevel = {}, // { NHAN_BIET: "trac_nghiem"|"tu_luan", ... } - RIÊNG cho từng mức độ
      includeAnswers = false, // mặc định KHÔNG tạo đáp án để tiết kiệm credit AI
      useVisualQuestions = false, // câu hỏi trực quan (đặt tính, sơ đồ, hình đếm...) - đặc trưng Tiểu học
      existingQuestions = [],
      sampleMode = "theo_chuong", // C6: "theo_chuong" | "theo_de_mau" | "ket_hop"
      sampleExamSpec = null, // C6: spec phong cách đã phân tích ở /api/analyze-sample (C4/C5)
      knowledgeContent = "", // Giai đoạn 1 (mở rộng): "Nội dung kiến thức" giáo viên gõ tay
      extraRequirements = "", // Giai đoạn 1 (mở rộng): "Yêu cầu bổ sung" giáo viên gõ tay
    } = body;

    const chapterIds = Object.keys(chapterMatrix || {});
    if (!grade || chapterIds.length === 0) {
      return NextResponse.json(
        { error: "Thiếu tham số: grade và chapterMatrix (ít nhất 1 chương) là bắt buộc." },
        { status: 400 }
      );
    }

    // ⚠️ Trần tối đa số câu/lượt gọi (xem contentGenerationLimits.js) - chặn client gửi số câu
    // bất thường lớn (cố ý hoặc gõ nhầm) làm tốn quota Gemini/GitHub 1 lượt gọi duy nhất.
    const { matrix: clampedChapterMatrix, wasClamped } = clampChapterMatrix(chapterMatrix);
    const limitWarnings = wasClamped
      ? [
          `Số câu hỏi đã nhập vượt trần cho phép mỗi lượt tạo đề, hệ thống đã tự động điều chỉnh về ` +
            `đúng giới hạn (tối đa ${getExamMaxPerCell()} câu/ô, tổng tối đa ${getExamMaxTotalQuestions()} ` +
            `câu/lượt tạo). Vui lòng tạo thêm 1 lượt khác nếu cần nhiều câu hơn.`,
        ]
      : [];

    // Tải nội dung RIÊNG từng chương (không gộp chung 1 blob) để AI phân bổ đúng số câu/chương
    const chaptersInfo = await fetchChaptersSeparately({ grade, subject, volume, chapters: chapterIds });

    const { questions, teacherRubric, warnings } = await orchestrateExamGeneration({
      grade,
      subject,
      chaptersInfo,
      chapterMatrix: clampedChapterMatrix,
      typeByLevel,
      includeAnswers,
      useVisualQuestions,
      existingQuestions,
      sampleMode,
      sampleExamSpec,
      knowledgeContent,
      extraRequirements,
    });

    return NextResponse.json({
      success: true,
      totalQuestions: questions.length,
      questions,
      teacherRubric,
      chaptersInfo: chaptersInfo.map((c) => ({ chapterId: c.chapterId, label: c.label })), // không trả markdown đầy đủ về client (nặng, không cần)
      typeByLevel, // cần để dựng Ma trận đề thi + Bản đặc tả (Giai đoạn 2)
      warnings: [...limitWarnings, ...warnings], // liệt kê chính xác chương + mức độ nào bị thiếu câu
    });
  } catch (err) {
    console.error("[/api/generate] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi tạo đề." },
      { status: 500 }
    );
  }
}
