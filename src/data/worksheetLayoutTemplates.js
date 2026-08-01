/**
 * worksheetLayoutTemplates.js
 * ================== GIAI ĐOẠN 0 - NỀN TẢNG (bước 2/2) ==================
 * Trước đây CHỈ CÓ 1 bố cục phiếu duy nhất, hard-code thẳng trong WorksheetPreview.jsx / .docx
 * export (khung thẻ trắng viền chấm, 2 cột, góc trang trí ☀️🌈✏️⭐ cố định) -> đúng như 5 ảnh
 * mẫu bạn gửi, mọi phiếu "Toán lớp 2" gần như giống hệt nhau về hình thức.
 *
 * File này định nghĩa bố cục dưới dạng CONFIG (JSON thuần, không phải code cứng) để:
 *   1. Có THỂ chọn ngẫu nhiên/luân phiên giữa nhiều bố cục (Giai đoạn 1 sẽ dùng).
 *   2. Component render (WorksheetPreview.jsx, worksheetExportService.js) chỉ cần ĐỌC config,
 *      không phải viết lại JSX/docx-code mỗi khi thêm 1 bố cục mới.
 *   3. Sau này cho phép AI phân tích ảnh phiếu mẫu giáo viên upload (Giai đoạn 2) rồi MAP
 *      sang 1 layoutTemplate gần giống nhất, thay vì phải "vẽ" lại từ đầu bằng AI (rủi ro
 *      lỗi bố cục/tràn trang) - vẫn dùng khung đã kiểm định, chỉ đổi phần chọn theme.
 *
 * Mỗi layout gồm:
 *  - id, name: định danh + tên hiển thị (cho giáo viên chọn thủ công nếu muốn, thay vì để AI tự chọn)
 *  - columns: số cột chia bài tập trong trang (1 hoặc 2) - ảnh hưởng cách sections được xếp
 *  - frameStyle: kiểu khung trang trí (khác nhau về viền, góc trang trí, độ "rộn ràng")
 *  - headerStyle: kiểu khối tiêu đề (banner cong, badge nổi khối, ruy-băng chéo góc...)
 *  - cornerDecorSets: NHIỀU bộ icon góc trang trí để chọn xoay vòng (không chỉ ☀️🌈✏️⭐ cố định)
 *  - colorPaletteIds: các bảng màu PHÙ HỢP với layout này (tham chiếu COLOR_PALETTES bên dưới)
 *  - sectionCardStyle: kiểu khung từng khối bài tập (bo tròn viền chấm / viền liền nét đôi /
 *    dạng "thẻ trạm" có số thứ tự nổi bật kiểu học liệu game hoá)
 */

export const COLOR_PALETTES = {
  blue: { border: "#5B9BD5", bg: "#EAF4FF", badge: "#2F80ED", badgeDark: "#1B62C4", title: "#124070" },
  teal: { border: "#2FBFA0", bg: "#E6FBF6", badge: "#14A085", badgeDark: "#0E7C68", title: "#0B5C4B" },
  pink: { border: "#F191C1", bg: "#FFF0F7", badge: "#E85CA0", badgeDark: "#C13E80", title: "#8E2F63" },
  green: { border: "#7CC576", bg: "#F0FBEE", badge: "#4CAF50", badgeDark: "#357A38", title: "#265C29" },
  purple: { border: "#B39CE0", bg: "#F3EEFF", badge: "#8B5FD6", badgeDark: "#6A3FB5", title: "#4A2A85" },
  orange: { border: "#F5B266", bg: "#FFF5E9", badge: "#E8892C", badgeDark: "#C16E1A", title: "#8A4A0E" },
  yellow: { border: "#F0D060", bg: "#FFFBE8", badge: "#DBAE1F", badgeDark: "#B08A12", title: "#7A5C0C" },
  brown: { border: "#C79A6B", bg: "#FBF3E9", badge: "#A9784A", badgeDark: "#835C36", title: "#5A3E22" },
  red: { border: "#E88585", bg: "#FFEFEF", badge: "#D9534F", badgeDark: "#B03B38", title: "#7A2624" },
};

// Nhiều bộ icon góc trang trí thay vì 1 bộ cố định - xoay vòng theo layout được chọn.
export const CORNER_DECOR_SETS = [
  ["☀️", "🌈", "✏️", "⭐"],
  ["🎈", "🦋", "📚", "🌟"],
  ["🚀", "🪐", "✨", "🌙"],
  ["🍎", "🌻", "🐝", "🍀"],
  ["🎨", "🖍️", "🧸", "🎁"],
  ["🐬", "🐚", "🌊", "⛵"],
];

export const WORKSHEET_LAYOUT_TEMPLATES = [
  {
    id: "classic_2col_dotted",
    name: "Cổ điển 2 cột - viền chấm bo tròn",
    description: "Bố cục hiện có: khung thẻ trắng dày, viền chấm bo tròn, 2 cột song song.",
    columns: 2,
    frameStyle: "dotted_border_thick_card",
    headerStyle: "badge_banner",
    sectionCardStyle: "rounded_dotted",
    colorPaletteIds: ["blue", "teal", "pink", "green", "purple", "orange"],
  },
  {
    id: "single_column_journey",
    name: "1 cột - hành trình từng chặng",
    description:
      "Các dạng bài xếp dọc 1 cột, mỗi khối như 1 \"chặng\" trong hành trình (có số thứ tự lớn kiểu bước đi), phù hợp phiếu ít mục hoặc Mầm non/Lớp 1 cần rõ ràng, không rối mắt.",
    columns: 1,
    frameStyle: "soft_rounded_border",
    headerStyle: "ribbon_corner",
    sectionCardStyle: "step_journey",
    colorPaletteIds: ["yellow", "orange", "green", "blue"],
  },
  {
    id: "learning_stations",
    name: "2 cột - trạm học tập (game hoá)",
    description:
      "Mỗi khối bài tập là 1 \"trạm\" có huy hiệu số thứ tự nổi bật kiểu trò chơi, khuyến khích học sinh \"vượt trạm\" - phù hợp Lớp 2 nhiều dạng bài.",
    columns: 2,
    frameStyle: "dotted_border_thick_card",
    headerStyle: "badge_banner",
    sectionCardStyle: "game_station",
    colorPaletteIds: ["blue", "purple", "teal", "red"],
  },
  {
    id: "notebook_style",
    name: "1 cột - phong cách sổ tay viết tay",
    description:
      "Khung tối giản hơn, giống trang sổ tay có lề kẻ dòng nhẹ, ít icon trang trí hơn - phù hợp giáo viên muốn phiếu \"nghiêm túc\" hơn thay vì quá nhiều hình vui nhộn.",
    columns: 1,
    frameStyle: "notebook_lines",
    headerStyle: "simple_underline",
    sectionCardStyle: "minimal_box",
    colorPaletteIds: ["brown", "blue", "green"],
  },
  {
    id: "adventure_map",
    name: "2 cột - bản đồ phiêu lưu",
    description:
      "Nền trang trí dạng bản đồ/đảo phiêu lưu, mascot chính dẫn dắt xuyên suốt phiếu (không đổi mascot giữa chừng) - tạo cảm giác 1 câu chuyện liền mạch thay vì các khối rời rạc.",
    columns: 2,
    frameStyle: "adventure_border",
    headerStyle: "badge_banner",
    sectionCardStyle: "rounded_dotted",
    colorPaletteIds: ["teal", "orange", "green", "purple"],
  },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Chọn ngẫu nhiên 1 layout, ƯU TIÊN tránh trùng với layout vừa dùng lần gần nhất
 * (excludeId) - đây chính là cơ chế "chống lặp khuôn 2 lần liên tiếp" mà Giai đoạn 1 sẽ gọi.
 * Do hệ thống stateless (Vercel serverless, không lưu session giữa các lần) nên excludeId
 * cần được client truyền lên (VD lưu layoutId lần tạo trước trong state của form) - đã chừa
 * sẵn tham số này ở Giai đoạn 0 để Giai đoạn 1 không phải sửa lại chữ ký hàm.
 */
export function pickRandomLayout(excludeId = null) {
  const pool = excludeId
    ? WORKSHEET_LAYOUT_TEMPLATES.filter((l) => l.id !== excludeId)
    : WORKSHEET_LAYOUT_TEMPLATES;
  const layout = pick(pool.length ? pool : WORKSHEET_LAYOUT_TEMPLATES);
  const paletteId = pick(layout.colorPaletteIds);
  const cornerDecor = pick(CORNER_DECOR_SETS);
  return {
    ...layout,
    palette: COLOR_PALETTES[paletteId],
    paletteId,
    cornerDecor,
  };
}

/** Lấy 1 layout cụ thể theo id (dùng khi giáo viên tự chọn thay vì để random). */
export function getLayoutById(id, paletteId = null) {
  const layout = WORKSHEET_LAYOUT_TEMPLATES.find((l) => l.id === id);
  if (!layout) return null;
  const resolvedPaletteId = paletteId && layout.colorPaletteIds.includes(paletteId) ? paletteId : pick(layout.colorPaletteIds);
  return {
    ...layout,
    palette: COLOR_PALETTES[resolvedPaletteId],
    paletteId: resolvedPaletteId,
    cornerDecor: pick(CORNER_DECOR_SETS),
  };
}

export function listLayouts() {
  return WORKSHEET_LAYOUT_TEMPLATES.map(({ id, name, description, columns }) => ({ id, name, description, columns }));
}

/**
 * ================== GIAI ĐOẠN 1 ==================
 * Trả về màu + mascot CỦA 1 KHỐI BÀI TẬP CỤ THỂ, tính từ layout đã chọn + dữ liệu section
 * (section.mascot do worksheetExerciseCatalog.js gán ngẫu nhiên ở Giai đoạn 0).
 *
 * ⚠️ ĐÂY LÀ NGUỒN DUY NHẤT cho việc phối màu/mascot từng khối - CẢ WorksheetPreview.jsx (web)
 * VÀ worksheetExportService.js (Word) đều gọi đúng hàm này thay vì tự định nghĩa BOX_THEMES
 * riêng như trước đây (từng phải comment nhắc nhau "đổi 1 nơi nhớ đổi nơi kia" - nay không
 * còn 2 nơi để mà lệch nữa).
 *
 * Cách phối: xoay vòng qua các colorPaletteIds của layout theo INDEX của khối (0,1,2,3...) -
 * đảm bảo 2 khối liền kề không trùng màu (miễn layout có >= 2 màu, đúng như thiết kế mọi
 * layout trong WORKSHEET_LAYOUT_TEMPLATES). Mascot lấy từ chính section (đã random ở G0),
 * KHÔNG còn gắn cứng 1 mascot/1 màu duy nhất vĩnh viễn theo section.type như bản cũ.
 */
export function getSectionVisualTheme(layout, section, index) {
  const paletteIds = layout?.colorPaletteIds?.length ? layout.colorPaletteIds : Object.keys(COLOR_PALETTES);
  const paletteId = paletteIds[index % paletteIds.length];
  const palette = COLOR_PALETTES[paletteId] || COLOR_PALETTES.blue;
  return {
    ...palette,
    mascot: section?.mascot || "⭐",
  };
}

/** Fallback khi CHƯA có layout (VD dữ liệu cũ tạo trước Giai đoạn 0, chưa có field layout) -
 * dùng layout đầu tiên trong thư viện làm mặc định để 2 file luôn có dữ liệu hợp lệ để vẽ. */
export function getDefaultLayout() {
  return getLayoutById(WORKSHEET_LAYOUT_TEMPLATES[0].id);
}

/**
 * ================== GIAI ĐOẠN 2 ==================
 * Ánh xạ spec đã phân tích từ phiếu mẫu (worksheetSampleSchema.js) sang 1 layout GẦN GIỐNG NHẤT
 * trong thư viện đã kiểm định, thay vì để AI "vẽ" bố cục mới từ đầu (rủi ro lỗi tràn trang/vỡ
 * layout - đúng lý do đã nêu ở JSDoc đầu file). Đây là cách phối hợp AN TOÀN giữa "học phong
 * cách từ tài liệu giáo viên" và "chỉ dùng khuôn đã kiểm định": AI chỉ SUY LUẬN đặc điểm phong
 * cách (qua worksheetSampleAnalyzer.js), việc CHỌN LAYOUT THẬT vẫn do CODE quyết định theo quy
 * tắc rõ ràng bên dưới - không có chỗ cho AI tự "sáng tác" bố cục có thể vỡ khi in.
 *
 * Quy tắc chấm điểm đơn giản: mỗi layout được cộng điểm nếu khớp columns/mood; layout điểm cao
 * nhất được chọn. Có DAO ĐỘNG NGẪU NHIÊN NHẸ giữa các layout đồng điểm để không rơi vào đúng 1
 * layout mỗi lần có sample giống nhau (vẫn giữ tinh thần chống lặp khuôn của Giai đoạn 1).
 */
/**
 * ================== GIAI ĐOẠN 3 ==================
 * Thiên vị CÓ XÁC SUẤT theo layout yêu thích đã lưu của giáo viên (teacherPreferenceStore.js) -
 * CHỦ Ý không ép cứng luôn dùng đúng 1 layout yêu thích, vì như vậy sẽ lại quay về đúng vấn đề
 * "lặp khuôn" mà Giai đoạn 1 vừa giải quyết. Thay vào đó: PREFERENCE_WEIGHT (mặc định 45%) cơ
 * hội dùng đúng layout yêu thích, phần còn lại vẫn random như bình thường - vừa chiều được sở
 * thích, vừa giữ được sự đa dạng.
 */
const PREFERENCE_WEIGHT = 0.45;

export function pickLayoutWithPreference(favoriteLayoutId, previousLayoutId = null) {
  if (!favoriteLayoutId || favoriteLayoutId === previousLayoutId) {
    // Không có yêu thích, hoặc yêu thích trùng đúng layout vừa dùng -> random bình thường để
    // không lặp lại 2 lần liên tiếp.
    return pickRandomLayout(previousLayoutId);
  }
  if (Math.random() < PREFERENCE_WEIGHT) {
    return getLayoutById(favoriteLayoutId) || pickRandomLayout(previousLayoutId);
  }
  return pickRandomLayout(previousLayoutId);
}

export function pickLayoutFromSampleSpec(spec, previousLayoutId = null) {
  if (!spec) return pickRandomLayout(previousLayoutId);

  const mood = (spec.moodKeywords || "").toLowerCase();
  const wantsMinimal = /đơn giản|tối giản|nghiêm túc|ít trang trí/.test(mood);
  const wantsPlayful = /vui nhộn|nhiều màu|rực rỡ|sinh động/.test(mood);

  const scored = WORKSHEET_LAYOUT_TEMPLATES.map((layout) => {
    let score = 0;
    if (spec.suggestedColumns && layout.columns === spec.suggestedColumns) score += 3;
    if (wantsMinimal && layout.id === "notebook_style") score += 2;
    if (wantsPlayful && (layout.id === "learning_stations" || layout.id === "adventure_map")) score += 2;
    if (layout.id === previousLayoutId) score -= 5; // vẫn ưu tiên tránh lặp lại layout vừa dùng
    return { layout, score };
  });

  const maxScore = Math.max(...scored.map((s) => s.score));
  const topCandidates = scored.filter((s) => s.score === maxScore).map((s) => s.layout);
  const chosen = pick(topCandidates);

  const paletteId = pick(chosen.colorPaletteIds);
  return { ...chosen, palette: COLOR_PALETTES[paletteId], paletteId, cornerDecor: pick(CORNER_DECOR_SETS) };
}
