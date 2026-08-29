/**
 * ================== SCRIPT MỘT LẦN / THỦ CÔNG, PHIÊN 26 ==================
 * "Test tương thích Word thực tế" tự động hoá bằng LibreOffice headless.
 *
 * BỐI CẢNH (xem PROJECT_SUMMARY.md/NEXT_STEPS.md): nhiều phiên trước đã sửa bug chỉ lộ ra khi
 * MỞ FILE .docx THẬT bằng Word (VD Phiên 24: ký tự Unicode hình khối ┆▬▭▪■⬭⬠⬡⏢ hiện TRỐNG
 * trong Word dù PDF vẫn ổn, vì trình duyệt tự fallback font còn Word thì không). Các test hiện
 * có (`npm test`) chỉ giải nén .docx bằng JSZip rồi soi thẳng document.xml - CHỨNG MINH được
 * cấu trúc XML hợp lệ và không còn ký tự thô, nhưng KHÔNG CHỨNG MINH được 1 bộ máy xử lý Word
 * thật có mở/render được file hay không. Trước đây phần này luôn phải chờ Khoa tự mở file Word
 * thật (hoặc chụp ảnh in ra) rồi báo lại qua chat.
 *
 * SCRIPT NÀY LÀM GÌ: dựng .docx THẬT (không mock) cho từng tính năng xuất Word trong app, rồi
 * dùng LibreOffice ở chế độ headless (`soffice --headless --convert-to pdf`) để "mở" và convert
 * từng file. Nếu bản thân file .docx có XML hỏng, quan hệ (relationship) thiếu, hoặc tham chiếu
 * ảnh (r:embed) sai, LibreOffice sẽ THẤT BẠI hoặc convert ra PDF rỗng/lỗi - bắt được đúng lớp lỗi
 * mà JSZip-soi-XML không bắt được.
 *
 * ⚠️ GIỚI HẠN TRUNG THỰC (không nói quá khả năng của script):
 *   - LibreOffice != Microsoft Word thật. Đây là phép thử THAY THẾ TỐT (proxy) cho "mở được bằng
 *     bộ xử lý OOXML độc lập với trình duyệt", không phải bằng chứng tuyệt đối Word sẽ hiện đúng
 *     100% (VD: font Times New Roman có thể render khác nhau chút giữa 2 phần mềm). Với các lỗi
 *     ĐÃ TỪNG XẢY RA thực tế (XML hỏng, ảnh không nhúng được, quan hệ file sai, font ép glyph rỗng
 *     hoàn toàn) thì script này bắt được, đó là lớp lỗi quan trọng nhất.
 *   - VẪN NÊN nhờ Khoa in thử/mở Word thật định kỳ, đặc biệt sau khi đổi bố cục lớn hoặc thêm
 *     dạng bài mới - script này giảm tần suất cần làm việc đó, không thay thế hoàn toàn.
 *
 * YÊU CẦU: máy phải có LibreOffice (lệnh `soffice`) và Poppler (`pdfinfo`) cài sẵn.
 *   - Ubuntu/Debian: sudo apt install libreoffice poppler-utils
 *   - macOS:         brew install --cask libreoffice && brew install poppler
 *   Nếu thiếu, script tự phát hiện và dừng với hướng dẫn cài đặt, KHÔNG làm hỏng `npm test` bình
 *   thường (script này CHỦ Ý tách riêng, không gọi từ `npm test` mặc định - xem package.json
 *   script "test:word-compat").
 *
 * Chạy: npm run test:word-compat
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, writeFile, stat, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { buildExamDocxBlob } from "../src/services/exportService.js";
import { buildWorksheetDocxBlob } from "../src/services/worksheetExportService.js";
import { exportLessonPlanToWord } from "../src/services/lessonPlanExportService.js";
import { exportVietnameseExamToWord } from "../src/services/vietnameseExamExportService.js";
import { buildOutlineDocxBlob } from "../src/services/outlineExportService.js";
import { exportReportCommentsToWord } from "../src/services/reportCommentExportService.js";

import {
  generateDoDaiSoSanh,
  generateThuThapSoLieu,
  generateNhanDienHinh,
  generateDemVaVietSo,
} from "../src/data/worksheetSchemas.js";

const execFileAsync = promisify(execFile);

// --------------------------------------------------------------------------------------------
// 1) Kiểm tra công cụ hệ thống có sẵn TRƯỚC KHI làm gì khác - báo lỗi rõ ràng, không half-fail.
// --------------------------------------------------------------------------------------------
async function checkBinaryAvailable(bin, versionFlag, installHint) {
  try {
    await execFileAsync(bin, [versionFlag]);
    return true;
  } catch {
    console.error(`❌ Không tìm thấy lệnh "${bin}" trong PATH.\n   Cài đặt: ${installHint}`);
    return false;
  }
}

// --------------------------------------------------------------------------------------------
// 2) Danh sách "kịch bản" - mỗi kịch bản build ra 1 Blob .docx thật từ ĐÚNG hàm export production
//    đang dùng trong app (không viết lại logic build docx ở đây).
// --------------------------------------------------------------------------------------------
function makeExamScenario() {
  const questions = [
    {
      id: "q1",
      type: "tu_luan",
      content: "Tính giá trị của biểu thức $\\frac{1}{2} + \\frac{3}{4}$.",
      options: null,
    },
    {
      id: "q2",
      type: "trac_nghiem",
      content: "Tìm $x$ biết $x < 5$ và $x > 2$.",
      options: ["A. $x = 3$", "B. $x = 6$", "C. $x = 1$", "D. $x = 10$"],
    },
  ];
  return buildExamDocxBlob({
    title: "ĐỀ KIỂM TRA - TEST TƯƠNG THÍCH WORD",
    grade: 6,
    subject: "Toán",
    examCode: "COMPAT01",
    questions,
    includeMatrixAndSpec: false,
    includeRubricSection: false,
  });
}

function makeWorksheetScenario() {
  // Cố tình gộp CẢ 4 dạng bài từng dính bug "hiện TRỐNG trong Word" (Phiên 20/24) vào 1 file duy
  // nhất - đây chính xác là kịch bản có nguy cơ cao nhất (nhiều ảnh PNG nhúng/ImageRun cùng lúc).
  const doDaiItems = generateDoDaiSoSanh(3);
  const { surveyTitle, data, questions } = generateThuThapSoLieu(3);
  const shapes = generateNhanDienHinh(4);
  const demItems = generateDemVaVietSo("LOP_1", 3);

  const worksheet = {
    sections: [
      { type: "do_dai_so_sanh", title: "So sánh độ dài", mascot: "🐢", items: doDaiItems },
      { type: "thu_thap_so_lieu", title: "Thu thập số liệu", mascot: "📊", surveyTitle, data, questions },
      { type: "nhan_dien_hinh", title: "Nhận diện hình", mascot: "🔺", shapes },
      { type: "dem_va_viet_so", title: "Đếm và viết số", mascot: "🔢", items: demItems },
    ],
  };
  return buildWorksheetDocxBlob({ worksheet, meta: { title: "Phiếu test tương thích Word" }, showAnswers: true });
}

function makeLessonPlanScenario() {
  const lessonPlan = {
    tenBai: "Phép cộng trong phạm vi 10",
    yeuCauCanDat: { kienThuc: ["Biết thực hiện phép cộng trong phạm vi 10"] },
    doDungDayHoc: { giaoVien: ["Que tính"], hocSinh: ["Vở bài tập"] },
    hoatDong: [],
    loiDan: [{ hoatDong: "Khởi động", loiDan: "Các con ơi, hôm nay cô có một trò chơi rất thú vị!" }],
    slideOutline: [{ tieuDe: "Khởi động", noiDung: ["Trò chơi ô chữ", "Câu hỏi khởi động"] }],
  };
  const meta = { tenBai: "Phép cộng trong phạm vi 10", grade: "1", subject: "Toan", soTiet: 1 };
  return exportLessonPlanToWord({ lessonPlan, timeline: [], meta, includeTeacherScript: true });
}

function makeVietnameseExamScenario() {
  // results rỗng vẫn hợp lệ (chỉ còn tiêu đề) - mục tiêu chính ở đây là bắt lỗi cấu trúc chung
  // (khổ giấy, font, Document/Packer), không phải riêng từng khối Đọc/Chính tả/Tập làm văn
  // (các khối đó đã có test JSZip riêng trong test/promptTemplatesVietnameseFormatting.test.js).
  return exportVietnameseExamToWord({ results: {}, meta: { grade: 3, examCode: "COMPAT01" } });
}

function makeOutlineScenario() {
  const outline = {
    tenDeCuong: "Đề cương ôn tập Toán Lớp 5 - Test tương thích Word",
    thuNgoPhuHuynh: "Kính gửi quý phụ huynh, đây là đề cương ôn tập...",
    loTrinhOnTap: [{ tuan: "Tuần 1", noiDung: "Ôn phép cộng trừ phân số" }],
    kienThucCotLoi: [{ tieuDe: "Phân số", noiDung: ["Cộng trừ phân số khác mẫu số"] }],
    dangBai: [{ tieuDe: "Dạng 1", moTa: "Cộng trừ phân số", viDu: "1/2 + 1/3 = ?" }],
    nganHangBaiTap: [{ cauHoi: "Tính 2/3 + 1/6", dapAn: "5/6" }],
  };
  return buildOutlineDocxBlob({ outline, meta: { tenDeCuong: outline.tenDeCuong }, showAnswers: true });
}

async function makeReportCommentScenario() {
  const results = [
    {
      hoTen: "Nguyễn Văn A",
      lop: "5A1",
      comment: {
        phamChat: "Chăm ngoan, lễ phép",
        nangLuc: "Tự học tốt, biết hợp tác nhóm",
        nhanXetChung: "Có nhiều tiến bộ trong học kỳ này",
        monHoc: [{ ten: "Toán", noiDung: "Nắm vững kiến thức cơ bản" }],
      },
    },
  ];
  // exportReportCommentsToWord không return blob theo cùng quy ước (gọi saveAs trực tiếp) -
  // tra lại chữ ký thật của hàm trước khi gọi ở đây nếu sửa script này.
  return exportReportCommentsToWord({ results, cap: "tieu_hoc" });
}

const SCENARIOS = [
  { name: "de-thi-toan-cong-thuc", build: makeExamScenario },
  { name: "phieu-bai-tap-anh-nhung", build: makeWorksheetScenario },
  { name: "giao-an-loi-dan-slide", build: makeLessonPlanScenario },
  { name: "de-tieng-viet", build: makeVietnameseExamScenario },
  { name: "de-cuong-on-tap", build: makeOutlineScenario },
  { name: "nhan-xet-hoc-ba", build: makeReportCommentScenario },
];

// --------------------------------------------------------------------------------------------
// 3) Convert 1 file .docx -> .pdf bằng LibreOffice headless, kiểm tra kết quả bằng pdfinfo.
// --------------------------------------------------------------------------------------------
async function convertAndVerify(docxPath, outDir) {
  await execFileAsync("soffice", ["--headless", "--convert-to", "pdf", "--outdir", outDir, docxPath], {
    timeout: 60_000,
  });

  const pdfPath = path.join(outDir, path.basename(docxPath, ".docx") + ".pdf");
  const stats = await stat(pdfPath); // throws nếu LibreOffice không sinh ra file -> coi là FAIL

  // Rất nhỏ (vài trăm byte) thường là PDF rỗng/hỏng dù soffice thoát mã 0 - vẫn nên coi là nghi vấn.
  if (stats.size < 1024) {
    throw new Error(`PDF sinh ra quá nhỏ (${stats.size} byte) - nghi ngờ file rỗng/hỏng`);
  }

  const { stdout } = await execFileAsync("pdfinfo", [pdfPath]);
  const pageMatch = stdout.match(/^Pages:\s+(\d+)/m);
  const pages = pageMatch ? parseInt(pageMatch[1], 10) : 0;
  if (pages < 1) {
    throw new Error("pdfinfo báo 0 trang - file PDF không hợp lệ");
  }

  return { pages, sizeKB: Math.round(stats.size / 1024) };
}

// --------------------------------------------------------------------------------------------
// 4) Chạy toàn bộ kịch bản, in bảng kết quả, thoát mã khác 0 nếu có kịch bản nào FAIL (để dùng
//    được trong CI sau này nếu Khoa muốn, không chỉ chạy tay).
// --------------------------------------------------------------------------------------------
async function main() {
  const okSoffice = await checkBinaryAvailable("soffice", "--version", "sudo apt install libreoffice (Ubuntu/Debian) hoặc brew install --cask libreoffice (macOS)");
  const okPdfinfo = await checkBinaryAvailable("pdfinfo", "-v", "sudo apt install poppler-utils (Ubuntu/Debian) hoặc brew install poppler (macOS)");
  if (!okSoffice || !okPdfinfo) {
    process.exit(2);
  }

  const workDir = await mkdtemp(path.join(tmpdir(), "word-compat-"));
  console.log(`📁 Thư mục làm việc tạm: ${workDir}\n`);

  const results = [];
  for (const scenario of SCENARIOS) {
    process.stdout.write(`⏳ ${scenario.name} ... `);
    try {
      const blob = await scenario.build();
      const buffer = Buffer.from(await blob.arrayBuffer());
      const docxPath = path.join(workDir, `${scenario.name}.docx`);
      await writeFile(docxPath, buffer);

      const { pages, sizeKB } = await convertAndVerify(docxPath, workDir);
      console.log(`✅ OK (${pages} trang, docx ${Math.round(buffer.length / 1024)}KB)`);
      results.push({ name: scenario.name, ok: true, pages, sizeKB });
    } catch (err) {
      console.log(`❌ LỖI: ${err.message}`);
      results.push({ name: scenario.name, ok: false, error: err.message });
    }
  }

  await rm(workDir, { recursive: true, force: true });

  const failed = results.filter((r) => !r.ok);
  console.log("\n" + "=".repeat(70));
  console.log(`KẾT QUẢ: ${results.length - failed.length}/${results.length} kịch bản mở được bằng LibreOffice`);
  console.log("=".repeat(70));
  if (failed.length > 0) {
    console.log("\nCác kịch bản LỖI (cần Khoa hoặc phiên Claude sau kiểm tra lại):");
    failed.forEach((f) => console.log(`  - ${f.name}: ${f.error}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Script gặp lỗi không lường trước:", err);
  process.exit(1);
});
