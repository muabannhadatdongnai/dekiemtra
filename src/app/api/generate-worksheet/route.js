import { NextResponse } from "next/server";
import users from "@/data/users.json";
import { generateWorksheet } from "@/services/worksheetGenerator";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, grade, includeAnswers = false, exerciseCounts } = body;

    if (!username || !users[username]) {
      return NextResponse.json({ error: "Vui lòng đăng nhập lại." }, { status: 401 });
    }
    if (!grade || !exerciseCounts) {
      return NextResponse.json({ error: "Thiếu tham số: grade, exerciseCounts." }, { status: 400 });
    }

    const result = await generateWorksheet({ grade, includeAnswers, exerciseCounts });
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("[/api/generate-worksheet] error:", err);
    return NextResponse.json({ error: err.message || "Đã có lỗi xảy ra." }, { status: 500 });
  }
}
