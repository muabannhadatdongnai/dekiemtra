/**
 * githubService.js
 * Đọc trực tiếp file Markdown từ GitHub Raw API — KHÔNG dùng Vector DB, tiết kiệm 100% chi phí.
 *
 * ⚠️ CHỖ CẦN THAY ĐỔI: Đặt URL repo kiến thức của bạn trong biến môi trường (.env.local):
 *   GITHUB_KNOWLEDGE_REPO=USERNAME/REPO
 *   GITHUB_BRANCH=main
 *
 * Cấu trúc thư mục BẮT BUỘC trong repo kiến thức:
 *   sach_giao_khoa/lop_{grade}/{subject}_t{volume}/chuong_{chapter}.md
 *
 * Ví dụ thực tế:
 *   sach_giao_khoa/lop_6/toan_t2/chuong_3.md
 *   -> https://raw.githubusercontent.com/USERNAME/REPO/main/sach_giao_khoa/lop_6/toan_t2/chuong_3.md
 *
 * SÁCH NÂNG CAO (dành cho học sinh giỏi, KHÔNG chia chương, dùng chung cả năm - không
 * phụ thuộc Tập 1/2) đặt tại:
 *   sach_giao_khoa/lop_{grade}/{subject}_nang_cao.md
 * Ví dụ: sach_giao_khoa/lop_5/toan_nang_cao.md
 */

import { ADVANCED_BOOK_MARKER } from "@/data/constants";

const REPO = process.env.GITHUB_KNOWLEDGE_REPO; // "owner/repo" - THAY TẠI .env.local
const BRANCH = process.env.GITHUB_BRANCH || "main";
const TOKEN = process.env.GITHUB_TOKEN; // optional, tăng rate-limit khi liệt kê thư mục

function buildRawHeaders() {
  const headers = {};
  if (TOKEN) headers.Authorization = `token ${TOKEN}`;
  return headers;
}

function buildApiHeaders() {
  return {
    Accept: "application/vnd.github+json",
    ...(TOKEN ? { Authorization: `token ${TOKEN}` } : {}),
  };
}

function slugSubject(subject) {
  // "Toán" -> "toan" | "Ngữ văn" -> "ngu_van" (tuỳ kho kiến thức của bạn đặt tên thế nào,
  // chỉnh lại hàm này nếu quy ước file khác với mặc định)
  return subject
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

/**
 * Xây dựng đường dẫn file .md theo đúng chuẩn:
 * sach_giao_khoa/lop_{grade}/{subject}_t{volume}/chuong_{chapter}.md
 */
function buildKnowledgePath({ grade, subject, volume, chapter }) {
  const subjectSlug = slugSubject(subject);
  return `sach_giao_khoa/lop_${grade}/${subjectSlug}_t${volume}/chuong_${chapter}.md`;
}

/** Đường dẫn sách nâng cao: sach_giao_khoa/lop_{grade}/{subject}_nang_cao.md (không có Tập, không có chương). */
function buildAdvancedBookPath({ grade, subject }) {
  const subjectSlug = slugSubject(subject);
  return `sach_giao_khoa/lop_${grade}/${subjectSlug}_nang_cao.md`;
}

/**
 * Hàm chính theo đúng yêu cầu: fetchMarkdownFromGitHub(grade, subject, volume, chapter)
 * Tải nội dung Markdown của 1 chương -> dùng làm "Context" gửi cho Gemini.
 */
export async function fetchMarkdownFromGitHub(grade, subject, volume, chapter) {
  if (!REPO) {
    throw new Error(
      "Chưa cấu hình GITHUB_KNOWLEDGE_REPO trong .env.local (dạng USERNAME/REPO)."
    );
  }

  const path = buildKnowledgePath({ grade, subject, volume, chapter });
  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`;

  const res = await fetch(url, { headers: buildRawHeaders(), cache: "no-store" });
  if (!res.ok) {
    throw new Error(
      `Không thể tải tài liệu tại "${path}" (HTTP ${res.status}). ` +
        `Kiểm tra lại cấu trúc repo kiến thức hoặc tên chương/tập đã nhập.`
    );
  }
  return res.text();
}

/** Tải nguyên văn file sách nâng cao (không chia chương) cho 1 Lớp + Môn. */
export async function fetchAdvancedBook(grade, subject) {
  if (!REPO) {
    throw new Error(
      "Chưa cấu hình GITHUB_KNOWLEDGE_REPO trong .env.local (dạng USERNAME/REPO)."
    );
  }

  const path = buildAdvancedBookPath({ grade, subject });
  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`;

  const res = await fetch(url, { headers: buildRawHeaders(), cache: "no-store" });
  if (!res.ok) {
    throw new Error(
      `Không thể tải sách nâng cao tại "${path}" (HTTP ${res.status}). ` +
        `Kiểm tra lại tên file (phải đặt đúng "${slugSubject(subject)}_nang_cao.md", nằm ngay trong lop_${grade}/).`
    );
  }
  return res.text();
}

/** Kiểm tra sách nâng cao có tồn tại không (dùng GitHub Contents API, chỉ cần biết có/không). */
async function checkAdvancedBookExists({ grade, subject }) {
  if (!REPO) return false;
  const path = buildAdvancedBookPath({ grade, subject });
  const url = `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`;
  try {
    const res = await fetch(url, { headers: buildApiHeaders(), cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Liệt kê các chương (file .md) có sẵn cho 1 Lớp + Môn + Tập, dùng GitHub Contents API
 * để đổ vào Select Box "Chọn Chương/Bài học" trên UI. Nếu có sách nâng cao cho Lớp + Môn
 * này, thêm 1 mục đặc biệt "Sách nâng cao (toàn bộ)" vào cuối danh sách.
 */
export async function listChapters({ grade, subject, volume }) {
  if (!REPO) {
    throw new Error(
      "Chưa cấu hình GITHUB_KNOWLEDGE_REPO trong .env.local (dạng USERNAME/REPO)."
    );
  }

  const subjectSlug = slugSubject(subject);
  const dirPath = `sach_giao_khoa/lop_${grade}/${subjectSlug}_t${volume}`;
  const url = `https://api.github.com/repos/${REPO}/contents/${dirPath}?ref=${BRANCH}`;

  const res = await fetch(url, { headers: buildApiHeaders(), cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Không thể liệt kê thư mục "${dirPath}" (HTTP ${res.status}).`);
  }

  const files = await res.json();
  const chapters = files
    .filter((f) => f.type === "file" && f.name.endsWith(".md"))
    .map((f) => {
      const chapterMatch = f.name.match(/chuong_(.+)\.md$/);
      return {
        chapter: chapterMatch ? chapterMatch[1] : f.name.replace(/\.md$/, ""),
        fileName: f.name,
        downloadUrl: f.download_url,
        isAdvancedBook: false,
      };
    });

  const hasAdvancedBook = await checkAdvancedBookExists({ grade, subject });
  if (hasAdvancedBook) {
    chapters.push({
      chapter: ADVANCED_BOOK_MARKER,
      fileName: `${subjectSlug}_nang_cao.md`,
      isAdvancedBook: true,
    });
  }

  return chapters;
}

/**
 * Đường dẫn file phụ lục bài học (JSON) của 1 chương - liệt kê từng "Bài" trong chương đó kèm
 * "nội dung cốt lõi" (tóm tắt mục tiêu bài học, trích/diễn giải từ Sách giáo viên) để gợi ý cho
 * giáo viên khi soạn giáo án, KHÔNG bắt buộc phải có - nếu chưa tạo file này, tính năng gợi ý bài
 * chỉ đơn giản là không hiện gợi ý gì (ô "Tên bài soạn" vẫn gõ tay bình thường như trước).
 */
function buildLessonIndexPath({ grade, subject, volume, chapter }) {
  const subjectSlug = slugSubject(subject);
  return `sach_giao_khoa/lop_${grade}/${subjectSlug}_t${volume}/chuong_${chapter}_bai.json`;
}

/**
 * Tải phụ lục bài học (mảng { soBai, tenBai, noiDungCotLoi }) của 1 chương, dùng để gợi ý khi
 * giáo viên chọn Lớp + Môn + Chương rồi gõ "Bài ..." trong LessonPlanForm.jsx.
 *
 * Ví dụ nội dung file (đặt tại sach_giao_khoa/lop_5/toan_t1/chuong_1_bai.json):
 * [
 *   { "soBai": 1, "tenBai": "Ôn tập các số đến 100 000", "noiDungCotLoi": "Ôn đọc, viết, so sánh và
 *     sắp xếp các số trong phạm vi 100 000; nhận biết hàng và giá trị theo hàng." },
 *   { "soBai": 2, "tenBai": "Ôn tập phép cộng, phép trừ", "noiDungCotLoi": "Củng cố kỹ thuật tính
 *     cộng/trừ (có nhớ) trong phạm vi các số đã học; giải toán có lời văn liên quan." }
 * ]
 *
 * Không có file (chương chưa nhập phụ lục) hoặc lỗi mạng -> trả về [] (im lặng, KHÔNG throw) vì
 * đây là tính năng gợi ý phụ trợ, không phải luồng chính - thiếu phụ lục không được cản trở giáo
 * viên soạn giáo án bình thường bằng cách gõ tay Tên bài soạn.
 */
export async function fetchLessonIndex({ grade, subject, volume, chapter }) {
  if (!REPO || !chapter || chapter === ADVANCED_BOOK_MARKER) return [];

  const path = buildLessonIndexPath({ grade, subject, volume, chapter });
  const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`;

  try {
    const res = await fetch(url, { headers: buildRawHeaders(), cache: "no-store" });
    if (!res.ok) return [];
    const lessons = await res.json();
    if (!Array.isArray(lessons)) return [];
    return lessons
      .filter((l) => l && typeof l.tenBai === "string" && l.tenBai.trim())
      .map((l) => ({
        soBai: l.soBai ?? null,
        tenBai: l.tenBai.trim(),
        noiDungCotLoi: typeof l.noiDungCotLoi === "string" ? l.noiDungCotLoi.trim() : "",
      }));
  } catch {
    return [];
  }
}


/**
 * Ghép nhiều chương (và/hoặc sách nâng cao) lại thành 1 nguồn tài liệu tổng hợp cho đề
 * kiểm tra bao quát nhiều chủ đề (ví dụ đề kiểm tra giữa kỳ / cuối kỳ chọn nhiều chương cùng lúc).
 * (Giữ lại để tương thích ngược - không dùng trong luồng Ma trận theo Chương mới.)
 */
export async function fetchMultipleChapters({ grade, subject, volume, chapters }) {
  const contents = await Promise.all(
    chapters.map((chapter) => {
      if (chapter === ADVANCED_BOOK_MARKER) {
        return fetchAdvancedBook(grade, subject).then((md) => ({
          heading: "Sách nâng cao (toàn bộ - dành cho học sinh giỏi)",
          md,
        }));
      }
      return fetchMarkdownFromGitHub(grade, subject, volume, chapter).then((md) => ({
        heading: `Chương ${chapter}`,
        md,
      }));
    })
  );
  return contents.map((c) => `## ${c.heading}\n\n${c.md}`).join("\n\n---\n\n");
}

/**
 * Tải NỘI DUNG RIÊNG của từng chương (không gộp chung thành 1 blob) - dùng cho luồng
 * "Ma trận theo Chương": mỗi chương cần nội dung markdown riêng để AI sinh đúng số câu
 * yêu cầu cho TỪNG chương, và để Bản đặc tả biết chính xác câu nào thuộc chương nào.
 * Trả về mảng [{ chapterId, label, markdown }].
 */
export async function fetchChaptersSeparately({ grade, subject, volume, chapters }) {
  return Promise.all(
    chapters.map(async (chapter) => {
      if (chapter === ADVANCED_BOOK_MARKER) {
        const markdown = await fetchAdvancedBook(grade, subject);
        return {
          chapterId: chapter,
          label: "Sách nâng cao (toàn bộ)",
          markdown,
        };
      }
      const markdown = await fetchMarkdownFromGitHub(grade, subject, volume, chapter);
      return {
        chapterId: chapter,
        label: `Chương ${chapter}`,
        markdown,
      };
    })
  );
}
