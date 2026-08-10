import { generateColoringContentWithFailover } from "./coloringImageKeyPool.js";

/**
 * coloringPageGenerator.js
 * Nhận 1 ảnh gốc (nhân vật/ảnh gia đình phụ huynh upload) -> gọi Gemini image generation
 * model để "vẽ lại" thành 1 ảnh line-art (nét đen trắng, phong cách sách tô màu thiếu nhi)
 * giữ đúng bố cục và đặc điểm nhận diện của ảnh gốc, kèm gợi ý bảng màu (6-8 mã HEX) phù hợp
 * với ảnh gốc để in vào khung "Gợi ý màu" của trang tô màu.
 *
 * ⚠️ Model: dùng "gemini-2.5-flash-image" (Nano Banana) - hỗ trợ ảnh input + ảnh output
 * trong CÙNG 1 lượt gọi (image-to-image), đúng nhu cầu "vẽ lại thành nét đen trắng" thay vì
 * chỉ sinh ảnh mới từ text. Có thể đổi model qua biến env COLORING_IMAGE_MODEL nếu Google
 * phát hành model mới hơn sau này, KHÔNG cần sửa code.
 */

const DEFAULT_MODEL = process.env.COLORING_IMAGE_MODEL || "gemini-2.5-flash-image";

// Bảng màu dự phòng (dùng khi Gemini không trả được danh sách mã màu hợp lệ trong text response) -
// tông màu tươi sáng, thân thiện trẻ em, giống style "GỢI Ý MÀU" trong ảnh mẫu phụ huynh gửi.
const FALLBACK_PALETTE = [
  "#2E7D32", "#8BC34A", "#FFC107", "#FF9800",
  "#795548", "#9E9E9E", "#FFCCA6", "#4FC3F7",
];

const LINE_ART_PROMPT = `Bạn là họa sĩ minh họa sách tô màu cho trẻ em.
Dựa trên ảnh được cung cấp, hãy vẽ lại TOÀN BỘ ảnh thành 1 bức tranh tô màu (coloring page)
phong cách hoạt hình dễ thương cho trẻ em, chỉ gồm NÉT VIỀN ĐEN, KHÔNG tô màu, nền trắng.

Yêu cầu bắt buộc:
- Giữ đúng bố cục tổng thể, số lượng nhân vật/đối tượng chính và đặc điểm nhận diện dễ thương
  (kiểu tóc, trang phục, biểu cảm) như ảnh gốc, nhưng chuyển sang phong cách hoạt hình đơn giản,
  nét vẽ dày rõ ràng, dễ tô màu cho trẻ nhỏ.
- CHỈ dùng nét đen viền, không có mảng màu, không có bóng đổ, không tô xám.
- Nền đơn giản, dễ thương, phù hợp trẻ em (có thể thêm vài chi tiết trang trí nhỏ như mây, cỏ,
  hoa nếu hợp cảnh).
- Không thêm chữ, watermark, hay logo vào ảnh.
- Tỉ lệ khung ảnh dọc, phù hợp khổ giấy A4.

Sau khi tạo ảnh, hãy trả thêm 1 dòng text riêng bắt đầu bằng "PALETTE:" theo sau là 6 đến 8 mã
màu HEX (ví dụ PALETTE: #2E7D32,#8BC34A,#FFC107) là những màu phù hợp nhất để tô cho bức tranh
này (dựa theo màu sắc thật trong ảnh gốc), phân tách bằng dấu phẩy, không giải thích gì thêm.`;

function extractPaletteFromText(text) {
  if (!text) return null;
  const match = text.match(/PALETTE:\s*([#0-9a-fA-F,\s]+)/i);
  if (!match) return null;
  const hexes = match[1]
    .split(",")
    .map((h) => h.trim())
    .filter((h) => /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(h));
  return hexes.length >= 3 ? hexes.slice(0, 8) : null;
}

/**
 * @param {Object} params
 * @param {string} params.base64Image - ảnh gốc, base64 KHÔNG kèm tiền tố "data:image/...;base64,"
 * @param {string} params.mimeType - vd "image/jpeg" | "image/png"
 * @returns {Promise<{ lineArtBase64: string, lineArtMimeType: string, palette: string[] }>}
 */
export async function generateColoringLineArt({ base64Image, mimeType }) {
  if (!base64Image) {
    throw new Error("Thiếu ảnh gốc để tạo tranh tô màu.");
  }

  const response = await generateColoringContentWithFailover({
    model: DEFAULT_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: LINE_ART_PROMPT },
          { inlineData: { mimeType: mimeType || "image/jpeg", data: base64Image } },
        ],
      },
    ],
    config: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });

  const parts = response?.candidates?.[0]?.content?.parts || [];

  let lineArtBase64 = null;
  let lineArtMimeType = "image/png";
  let responseText = "";

  for (const part of parts) {
    if (part.inlineData?.data) {
      lineArtBase64 = part.inlineData.data;
      lineArtMimeType = part.inlineData.mimeType || "image/png";
    }
    if (part.text) {
      responseText += `${part.text}\n`;
    }
  }

  if (!lineArtBase64) {
    const err = new Error(
      "Gemini không trả về ảnh tô màu. Có thể ảnh gốc vi phạm chính sách an toàn nội dung, hoặc model đang quá tải - hãy thử lại với ảnh khác."
    );
    err.noImageReturned = true;
    throw err;
  }

  const palette = extractPaletteFromText(responseText) || FALLBACK_PALETTE;

  return { lineArtBase64, lineArtMimeType, palette };
}
