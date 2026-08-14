/**
 * reportCommentBulkParser.js
 * Đọc file giáo viên upload (Excel theo mẫu hệ thống cung cấp, hoặc Word đơn giản) thành danh
 * sách học sinh + ghi chú thô, để đưa vào generateBulkReportComments() (reportCommentEngine.js).
 *
 * Excel là ĐƯỜNG CHÍNH (khớp mẫu tải về từ buildReportCommentTemplateWorkbook() bên dưới) - cột
 * cố định, dễ parse chắc chắn. Word chỉ hỗ trợ ĐỊNH DẠNG ĐƠN GIẢN (mỗi học sinh 1 khối, ngăn cách
 * bằng dòng "---"), dùng mammoth để trích text thô rồi tự tách theo dòng - KHÔNG cố gắng đọc mọi
 * định dạng Word tuỳ ý (rủi ro sai sót cao hơn lợi ích, giáo viên nên dùng Excel).
 */

import { REPORT_COMMENT_LEVEL_CONFIG, getReportCommentLevelConfig } from "@/data/reportCommentConfig";

const MAX_SUBJECT_SLOTS = 5;

// Thứ tự cột trong file mẫu Excel - PHẢI khớp buildReportCommentTemplateWorkbook() bên dưới.
const BASE_HEADERS = ["Họ và tên", "Lớp"];
const TIEU_HOC_EXTRA_HEADERS = ["Phẩm chất (ý thô)", "Năng lực (ý thô)"];
const THCS_THPT_EXTRA_HEADERS = ["Nhận xét chung (ý thô)"];

function subjectHeaders(slot) {
  return [`Môn học ${slot} - Tên môn`, `Môn học ${slot} - Ghi chú thô`];
}

function buildHeaderRow(cap) {
  const levelConfig = getReportCommentLevelConfig(cap);
  const isTieuHoc = levelConfig?.structure === "3-phan";
  const headers = [...BASE_HEADERS, ...(isTieuHoc ? TIEU_HOC_EXTRA_HEADERS : THCS_THPT_EXTRA_HEADERS)];
  for (let i = 1; i <= MAX_SUBJECT_SLOTS; i++) headers.push(...subjectHeaders(i));
  return headers;
}

// ---- 1. Sinh file Excel mẫu để giáo viên tải về ---------------------------

export async function buildReportCommentTemplateWorkbook(cap) {
  const XLSX = await import("xlsx");
  const levelConfig = getReportCommentLevelConfig(cap) || REPORT_COMMENT_LEVEL_CONFIG.tieu_hoc;
  const isTieuHoc = levelConfig.structure === "3-phan";
  const headers = buildHeaderRow(levelConfig.id);

  const sampleRow = isTieuHoc
    ? [
        "Nguyễn Văn A",
        String(levelConfig.grades[0]) + "A",
        "Chưa tự giác dọn dẹp, hay quên đồ dùng học tập",
        "Ngại phát biểu, làm việc nhóm còn thụ động",
        "Toán",
        "Tính toán còn nhầm lẫn phép trừ có nhớ, cần luyện thêm",
        "Tiếng Việt",
        "Đọc còn chậm, viết chính tả hay sai dấu thanh",
      ]
    : [
        "Nguyễn Văn A",
        String(levelConfig.grades[0]) + "A1",
        "Hay nói chuyện riêng trong giờ, chưa tập trung",
        "Toán",
        "Làm bài tập về nhà chưa đầy đủ, hổng kiến thức chương 1",
        "Ngữ văn",
        "Viết đoạn văn còn lan man, chưa đúng trọng tâm đề bài",
      ];
  // Đệm cho đủ số cột (các slot môn học còn lại để trống)
  while (sampleRow.length < headers.length) sampleRow.push("");

  // Ghi chú hướng dẫn: để Ở CỘT RIÊNG SAU CÙNG (không phải cột "Họ và tên") - nếu để ở cột A như
  // trước đây, parseReportCommentExcel() sẽ hiểu NHẦM đây là 1 học sinh có tên là cả câu ghi chú
  // (vì cột "Họ và tên" không rỗng). Để cột A rỗng thì rowToStudent() tự bỏ qua dòng này.
  const noteRow = new Array(headers.length).fill("");
  noteRow.push(
    "👈 Xoá dòng mẫu (dòng 2) trước khi điền. Để trống ô nào không có ý thì bỏ qua, không bắt buộc điền hết."
  );

  const sheetData = [headers, sampleRow, noteRow];
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet["!cols"] = headers.map((h) => ({ wch: Math.max(18, h.length + 2) }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách học sinh");

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

// ---- 2. Đọc file Excel giáo viên đã điền -----------------------------------

function rowToStudent(row, headers, isTieuHoc) {
  const get = (label) => {
    const idx = headers.indexOf(label);
    if (idx === -1) return "";
    const v = row[idx];
    return v === undefined || v === null ? "" : String(v).trim();
  };

  const hoTen = get("Họ và tên");
  const lop = get("Lớp");
  if (!hoTen) return null; // dòng trống/dòng ghi chú -> bỏ qua

  const monHocList = [];
  for (let i = 1; i <= MAX_SUBJECT_SLOTS; i++) {
    const ten = get(`Môn học ${i} - Tên môn`);
    const ghiChu = get(`Môn học ${i} - Ghi chú thô`);
    if (ten) monHocList.push({ ten, ghiChu });
  }

  const student = { hoTen, lop, monHocList };
  if (isTieuHoc) {
    student.ghiChuPhamChat = get("Phẩm chất (ý thô)");
    student.ghiChuNangLuc = get("Năng lực (ý thô)");
  } else {
    student.nhanXetChungTho = get("Nhận xét chung (ý thô)");
  }
  return student;
}

export async function parseReportCommentExcel(buffer, cap) {
  const XLSX = await import("xlsx");
  const levelConfig = getReportCommentLevelConfig(cap);
  const isTieuHoc = levelConfig?.structure === "3-phan";

  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("File Excel không có sheet nào.");

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => String(h || "").trim());
  const students = [];
  for (let i = 1; i < rows.length; i++) {
    const student = rowToStudent(rows[i], headers, isTieuHoc);
    if (student) students.push(student);
  }

  if (students.length === 0) {
    throw new Error("Không tìm thấy học sinh nào trong file - kiểm tra lại cột 'Họ và tên' đã điền chưa.");
  }
  return students;
}

// ---- 3. Đọc file Word đơn giản (định dạng khối, ngăn cách bằng "---") -----
// Mỗi khối 1 học sinh, mỗi dòng dạng "Nhãn: nội dung". Nhãn nhận diện (không phân biệt hoa
// thường, có thể thiếu dấu): Họ tên, Lớp, Phẩm chất, Năng lực, Nhận xét chung, và "Môn <tên>"
// (VD "Môn Toán: tính nhầm phép trừ...") cho từng môn học.

function normalizeLabel(label) {
  return label
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function parseWordBlock(block, isTieuHoc) {
  const lines = block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;

  const student = { hoTen: "", lop: "", monHocList: [] };
  if (isTieuHoc) {
    student.ghiChuPhamChat = "";
    student.ghiChuNangLuc = "";
  } else {
    student.nhanXetChungTho = "";
  }

  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const rawLabel = line.slice(0, idx);
    const value = line.slice(idx + 1).trim();
    const label = normalizeLabel(rawLabel);

    if (label.includes("ho ten") || label.includes("ten hoc sinh") || label === "ten") {
      student.hoTen = value;
    } else if (label === "lop") {
      student.lop = value;
    } else if (label.includes("pham chat") && isTieuHoc) {
      student.ghiChuPhamChat = value;
    } else if (label.includes("nang luc") && isTieuHoc) {
      student.ghiChuNangLuc = value;
    } else if (label.includes("nhan xet chung") && !isTieuHoc) {
      student.nhanXetChungTho = value;
    } else if (label.startsWith("mon ")) {
      const tenMon = rawLabel.trim().replace(/^m[oô]n\s+/i, "");
      if (tenMon) student.monHocList.push({ ten: tenMon, ghiChu: value });
    }
  }

  return student.hoTen ? student : null;
}

export async function parseReportCommentWord(buffer, cap) {
  const mammoth = (await import("mammoth")).default;
  const levelConfig = getReportCommentLevelConfig(cap);
  const isTieuHoc = levelConfig?.structure === "3-phan";

  const result = await mammoth.extractRawText({ buffer });
  const text = (result.value || "").trim();
  if (!text) throw new Error("Không đọc được nội dung từ file Word.");

  const blocks = text.split(/\n\s*-{3,}\s*\n|\n\s*_{3,}\s*\n/); // ngăn cách bằng dòng --- hoặc ___
  const students = blocks.map((b) => parseWordBlock(b, isTieuHoc)).filter(Boolean);

  if (students.length === 0) {
    throw new Error(
      "Không tìm thấy học sinh nào - file Word cần theo định dạng mỗi học sinh 1 khối, ngăn cách " +
        "bằng dòng '---', mỗi dòng dạng 'Nhãn: nội dung' (VD 'Họ tên: Nguyễn Văn A'). Khuyến nghị " +
        "dùng file mẫu Excel để đảm bảo chính xác."
    );
  }
  return students;
}

export async function parseReportCommentBulkFile({ buffer, mimeType, fileName, cap }) {
  const isExcel =
    mimeType?.includes("spreadsheetml") ||
    mimeType === "application/vnd.ms-excel" ||
    /\.xlsx?$/i.test(fileName || "");
  const isWord =
    mimeType?.includes("wordprocessingml") || mimeType === "application/msword" || /\.docx?$/i.test(fileName || "");

  if (isExcel) return parseReportCommentExcel(buffer, cap);
  if (isWord) return parseReportCommentWord(buffer, cap);
  throw new Error("Định dạng file không được hỗ trợ - vui lòng dùng file Excel (.xlsx) hoặc Word (.docx).");
}
