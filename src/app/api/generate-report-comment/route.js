import { NextResponse } from "next/server";
import { requireAuth, requireWithinTeacherGenerateLimit } from "@/services/apiAuth";
import { isValidLevelId, isValidLengthId, REPORT_COMMENT_LENGTHS } from "@/data/reportCommentConfig";
import { generateReportCommentContent, generateBulkReportComments } from "@/services/reportCommentEngine";
import { getPreviousComment, saveReportCommentHistory } from "@/services/reportCommentHistoryStore";

/**
 * /api/generate-report-comment
 * Nhận { cap, doDai, hocSinh: [...] } - hocSinh có thể là 1 hoặc nhiều phần tử (luồng gõ tay 1
 * học sinh và luồng hàng loạt dùng CHUNG 1 route, đơn giản hoá phía client - xem
 * ReportCommentForm.jsx). Mỗi phần tử: { hoTen, lop, ghiChuPhamChat?, ghiChuNangLuc?, monHocList?,
 * nhanXetChungTho? }.
 *
 * Luôn tự đọc "nhận xét kỳ trước" từ reportCommentHistoryStore.js theo (username, hoTen, lop) -
 * KHÔNG tin client gửi previousComment lên (tránh giả mạo lịch sử), và LUÔN lưu lại kết quả mới
 * vào lịch sử sau khi tạo thành công (để lần sau tự động có ngữ cảnh "tiến bộ").
 */

const MAX_STUDENTS_PER_REQUEST = 60; // trần an toàn 1 lượt hàng loạt - đủ dùng cho 1-2 lớp

function sanitizeMonHocList(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m) => m && typeof m === "object" && m.ten)
    .slice(0, 10)
    .map((m) => ({ ten: String(m.ten).slice(0, 60), ghiChu: String(m.ghiChu || "").slice(0, 1000) }));
}

function sanitizeStudent(raw) {
  if (!raw || typeof raw !== "object") return null;
  const hoTen = String(raw.hoTen || "").trim().slice(0, 100);
  if (!hoTen) return null;
  return {
    hoTen,
    lop: String(raw.lop || "").trim().slice(0, 30),
    ghiChuPhamChat: String(raw.ghiChuPhamChat || "").slice(0, 1000),
    ghiChuNangLuc: String(raw.ghiChuNangLuc || "").slice(0, 1000),
    nhanXetChungTho: String(raw.nhanXetChungTho || "").slice(0, 1000),
    monHocList: sanitizeMonHocList(raw.monHocList),
  };
}

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;
    const { username } = auth.session;

    const limitError = await requireWithinTeacherGenerateLimit(username);
    if (limitError) return limitError;

    const body = await request.json();
    const cap = body.cap;
    const doDai = isValidLengthId(body.doDai) ? body.doDai : REPORT_COMMENT_LENGTHS.VUA;

    if (!isValidLevelId(cap)) {
      return NextResponse.json({ error: "Cấp học không hợp lệ." }, { status: 400 });
    }

    const rawStudents = Array.isArray(body.hocSinh) ? body.hocSinh : [];
    const students = rawStudents.map(sanitizeStudent).filter(Boolean);

    if (students.length === 0) {
      return NextResponse.json({ error: "Thiếu thông tin học sinh." }, { status: 400 });
    }
    if (students.length > MAX_STUDENTS_PER_REQUEST) {
      return NextResponse.json(
        { error: `Chỉ hỗ trợ tối đa ${MAX_STUDENTS_PER_REQUEST} học sinh/lượt, vui lòng chia nhỏ file.` },
        { status: 400 }
      );
    }

    // Tự đọc lịch sử kỳ trước cho từng học sinh (không tin client) - chạy song song vì đây chỉ
    // là đọc dữ liệu nhẹ, không tốn quota AI.
    const withHistory = await Promise.all(
      students.map(async (s) => ({
        ...s,
        previousComment: await getPreviousComment(username, s.hoTen, s.lop),
      }))
    );

    if (withHistory.length === 1) {
      const s = withHistory[0];
      const { comment, quotaExhausted, serverOverloaded } = await generateReportCommentContent({
        cap,
        doDai,
        hoTen: s.hoTen,
        lop: s.lop,
        ghiChuPhamChat: s.ghiChuPhamChat,
        ghiChuNangLuc: s.ghiChuNangLuc,
        monHocList: s.monHocList,
        nhanXetChungTho: s.nhanXetChungTho,
        previousComment: s.previousComment,
      });

      if (quotaExhausted) {
        return NextResponse.json(
          { error: "Đã hết hạn mức gọi AI hôm nay, vui lòng thử lại sau." },
          { status: 429 }
        );
      }
      if (serverOverloaded) {
        return NextResponse.json(
          { error: "Máy chủ AI đang quá tải, vui lòng thử lại sau ít phút." },
          { status: 503 }
        );
      }

      await saveReportCommentHistory(username, { hoTen: s.hoTen, lop: s.lop, comment });

      return NextResponse.json({
        success: true,
        results: [{ hoTen: s.hoTen, lop: s.lop, comment, error: null }],
      });
    }

    const results = await generateBulkReportComments({ cap, doDai, students: withHistory });

    // Lưu lịch sử cho những học sinh tạo THÀNH CÔNG (không lưu học sinh bị lỗi).
    await Promise.all(
      results
        .filter((r) => r.comment)
        .map((r) => saveReportCommentHistory(username, { hoTen: r.hoTen, lop: r.lop, comment: r.comment }))
    );

    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error("[/api/generate-report-comment] error:", err);
    return NextResponse.json(
      { error: err.message || "Đã có lỗi xảy ra khi tạo nhận xét học bạ." },
      { status: 500 }
    );
  }
}
