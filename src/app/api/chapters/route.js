import { NextResponse } from "next/server";
import { listChapters } from "@/services/githubService";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const grade = searchParams.get("grade");
  const subject = searchParams.get("subject") || "Toan";
  const volume = searchParams.get("volume") || "1";

  if (!grade) {
    return NextResponse.json({ error: "Thiếu tham số grade." }, { status: 400 });
  }

  try {
    const chapters = await listChapters({ grade, subject, volume });
    return NextResponse.json({ chapters });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
