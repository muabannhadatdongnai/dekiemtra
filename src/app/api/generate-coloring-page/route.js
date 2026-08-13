import { NextResponse } from "next/server";
import { requireAuth, requireWithinTeacherGenerateLimit } from "@/services/apiAuth";
import { generateColoringLineArt } from "@/services/coloringPageGenerator";

// Giới hạn kích thước ảnh upload để tránh request quá nặng (5MB đủ dùng cho ảnh chụp điện thoại
// đã nén, và tránh vượt giới hạn payload của Vercel serverless functions).
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function POST(request) {
  try {
    const auth = requireAuth(request);
    if (auth.error) return auth.error;

    const limitError = await requireWithinTeacherGenerateLimit(auth.session.username);
    if (limitError) return limitError;

    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Thiếu ảnh gốc để tạo tranh tô màu." }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Ảnh quá lớn (tối đa 5MB). Vui lòng chọn ảnh nhỏ hơn hoặc nén lại." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type || "image/jpeg";

    const { lineArtBase64, lineArtMimeType, palette } = await generateColoringLineArt({
      base64Image,
      mimeType,
    });

    return NextResponse.json({
      success: true,
      lineArtImage: `data:${lineArtMimeType};base64,${lineArtBase64}`,
      originalImage: `data:${mimeType};base64,${base64Image}`,
      palette,
    });
  } catch (err) {
    console.error("[/api/generate-coloring-page] error:", err);

    let message = err.message || "Đã có lỗi xảy ra khi tạo tranh tô màu.";
    if (err.zeroFreeQuota) {
      message =
        "Model tạo ảnh hiện KHÔNG có hạn mức miễn phí cho API key này (không phải do dùng hết, mà là chưa từng được cấp - có thể do tên model bị Google chuyển sang bản preview khác, hoặc project chưa bật đúng tính năng). " +
        "Hãy vào https://aistudio.google.com/app/apikey để xem model nào đang hiển thị \"Free tier\" cho tài khoản này, rồi đặt tên model đó vào biến COLORING_IMAGE_MODEL trong .env.local.";
    } else if (err.allKeysExhausted) {
      message = "Tất cả API key tạo ảnh đã hết hạn mức miễn phí hôm nay. Vui lòng thử lại vào ngày mai hoặc thêm key mới.";
    } else if (err.allKeysOverloaded) {
      message = "Hệ thống tạo ảnh của Google đang quá tải tạm thời. Vui lòng thử lại sau vài phút.";
    }

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
