/**
 * worksheetSchemas.js
 * "Phiếu bài tập" (Mầm non - Lớp 2) - khác với đề kiểm tra: đa số dạng bài KHÔNG cần AI,
 * code tự sinh số ngẫu nhiên đúng phạm vi từng khối lớp - rẻ hơn, nhanh hơn, không lo AI tính sai.
 * Chỉ dùng AI cho "giải toán có lời văn" (cần biến hoá ngôn ngữ tự nhiên).
 */

// ================== MỞ RỘNG LỚP 3 (Đợt 1) ==================
// maxNumber=100000 khớp đúng nội dung "Các số đến 100 000" (chủ đề 11-12, SGK Toán 3 Kết nối tri
// thức - đã tra cứu thực tế qua PPCT + giải SGK, KHÔNG suy đoán). QUAN TRỌNG: các dạng bài
// "kỹ năng chung" dùng thẳng maxNumber này cho MỌI phép tính (generateSoSanh, generateSapXepThuTu,
// generateDaySo...) là ĐÚNG về mặt nội dung (so sánh/sắp xếp số trong phạm vi 100 000 chính là bài
// học thật của Lớp 3) - CHỈ RIÊNG "tính nhẩm" (generateTinhNham) và "nối phép tính" cần xử lý
// RIÊNG bên dưới, vì "nhẩm" 2 số ngẫu nhiên bất kỳ trong phạm vi 100 000 (VD 73 428 + 19 205)
// không còn là "nhẩm" nữa mà là đặt tính cột dọc - không đúng bản chất dạng bài.
// ================== MỞ RỘNG LỚP 4 (Đợt 1) ==================
// maxNumber=1000000 khớp đúng nội dung "Các số đến 1 000 000" (SGK Toán 4 Kết nối tri thức, xem
// NEXT_STEPS.md phần catalog Lớp 4-5 đã tra cứu). Cùng nguyên tắc như Lớp 3: các dạng bài "kỹ
// năng chung" (so_sanh, sap_xep_thu_tu, day_so...) dùng thẳng maxNumber này là ĐÚNG nội dung;
// riêng "tính nhẩm"/"nối phép tính" cần nhánh xử lý riêng bên dưới (giống lý do đã giải thích ở
// Lớp 3) để không biến "nhẩm" thành đặt tính cột dọc với số quá lớn.
// ================== MỞ RỘNG LỚP 5 (Đợt 1) ==================
// maxNumber giữ = LOP_4 (1 000 000) vì Lớp 5 KHÔNG mở rộng thêm phạm vi số TỰ NHIÊN (SGK Toán 5
// KNTT tập trung vào SỐ THẬP PHÂN, không dạy số tự nhiên lớn hơn Lớp 4) - xem NEXT_STEPS.md mục
// "Vấn đề kỹ thuật cần giải quyết TRƯỚC khi code Lớp 5". Các dạng bài số thập phân dùng generator
// RIÊNG (generateSoThapPhanSoSanh...), KHÔNG dùng maxNumber này.
export const WORKSHEET_GRADES = {
  MAM_NON: { key: "MAM_NON", label: "Mầm non (chuẩn bị vào lớp 1)", maxNumber: 10 },
  LOP_1: { key: "LOP_1", label: "Lớp 1", maxNumber: 20 },
  LOP_2: { key: "LOP_2", label: "Lớp 2", maxNumber: 100 },
  LOP_3: { key: "LOP_3", label: "Lớp 3", maxNumber: 100000 },
  LOP_4: { key: "LOP_4", label: "Lớp 4", maxNumber: 1000000 },
  LOP_5: { key: "LOP_5", label: "Lớp 5", maxNumber: 1000000 },
};

export const EXERCISE_TYPES = {
  TINH_NHAM: "tinh_nham",
  DEM_VA_VIET_SO: "dem_va_viet_so",
  SO_SANH: "so_sanh",
  DAY_SO: "day_so",
  NOI_PHEP_TINH: "noi_phep_tinh",
  GIAI_TOAN: "giai_toan", // duy nhất cần AI
  NHAN_DIEN_HINH: "nhan_dien_hinh",
  SAP_XEP_THU_TU: "sap_xep_thu_tu", // GIAI ĐOẠN 2
  DEM_HINH_UNG_DUNG: "dem_hinh_ung_dung", // GIAI ĐOẠN 2 - hoạt động ứng dụng đi kèm NHAN_DIEN_HINH
  TACH_GOP: "tach_gop", // GIAI ĐOẠN F - sơ đồ Tách - Gộp (number bond), riêng Lớp 1
  THU_THAP_SO_LIEU: "thu_thap_so_lieu", // MỞ RỘNG LỚP 3, ĐỢT 3 - thống kê: bảng số liệu + câu hỏi
  SO_THAP_PHAN_SO_SANH: "so_thap_phan_so_sanh", // MỞ RỘNG LỚP 5, ĐỢT 1 - so sánh số thập phân
  SO_THAP_PHAN_CONG_TRU: "so_thap_phan_cong_tru", // MỞ RỘNG LỚP 5, ĐỢT 2 - cộng/trừ số thập phân
  SO_THAP_PHAN_NHAN: "so_thap_phan_nhan", // MỞ RỘNG LỚP 5, ĐỢT 3 - nhân số thập phân
  SO_THAP_PHAN_CHIA: "so_thap_phan_chia", // MỞ RỘNG LỚP 5, ĐỢT 3 - chia số thập phân cho số tự nhiên
  // ================== MỞ RỘNG LỚP 5, ĐỢT 4 ==================
  TI_SO_PHAN_TRAM: "ti_so_phan_tram", // Tỉ số phần trăm (3 dạng: tìm tỉ số %, tìm giá trị %, tìm số biết %)
  HINH_TAM_GIAC_HINH_THANG: "hinh_tam_giac_hinh_thang", // Diện tích tam giác/hình thang (+ chu vi tam giác)
  HINH_TRON: "hinh_tron", // Chu vi, diện tích hình tròn (dùng π ≈ 3,14)
  THE_TICH_HHCN_LP: "the_tich_hhcn_lp", // Thể tích hình hộp chữ nhật, hình lập phương
  DOI_DON_VI_THE_TICH: "doi_don_vi_the_tich", // Đổi đơn vị đo thể tích (m³/dm³/cm³)
  DIEN_TICH_XQ_TP: "dien_tich_xq_tp", // Diện tích xung quanh/toàn phần HHCN/lập phương/trụ
  SO_DO_THOI_GIAN: "so_do_thoi_gian", // Cộng, trừ số đo thời gian (giờ, phút)
  VAN_TOC_QUANG_DUONG_THOI_GIAN: "van_toc_quang_duong_thoi_gian", // Toán chuyển động đều
  PHEP_CHIA_CO_DU: "phep_chia_co_du", // Chia số tự nhiên có dư (ôn tập nâng cao)
  SO_THAP_PHAN_CHIA_NANG_CAO: "so_thap_phan_chia_nang_cao", // Chia thập phân cho thập phân / chia ra thương thập phân
};

// ================== GIAI ĐOẠN 9 (mở rộng kho icon đếm số - mục 2) ==================
// TRƯỚC ĐÂY chỉ 7 icon cố định -> generateDemVaVietSo() (slice ngẫu nhiên) hay trùng lặp icon
// giữa các lần tạo phiếu. Mở rộng lên 16 icon, đa dạng chủ đề (trái cây, con vật, đồ vật, đồ ăn).
const ICONS = [
  "🍎", "⭐", "🚗", "🐥", "🌻", "🦋", "🥕",
  "🐟", "🎈", "🍭", "🚀", "🐢", "🧸", "🍪", "🌸", "🐝",
];

// ================== GIAI ĐOẠN 9 (sửa lỗi "Nhận diện hình"/"Đếm hình" luôn lặp y hệt) ==================
// TRƯỚC ĐÂY kho có ĐÚNG 6 hình, trùng khớp defaultCount=6 -> slice(0,6) trên mảng 6 phần tử luôn
// lấy hết cả mảng, random chỉ đảo thứ tự chứ không đổi nội dung. Mở rộng lên 14 hình + đổi
// defaultCount xuống 5 (xem worksheetExerciseCatalog.js) để LUÔN có phần hình "vắng mặt", tạo
// khác biệt thật giữa các lần tạo phiếu.
// GIAI ĐOẠN F2: bỏ "Hình bán nguyệt"/"Hình mũi tên"/"Hình đám mây" khỏi kho - giáo viên phản ánh
// đây là những hình "ngớ ngẩn", không phù hợp với bối cảnh nhận diện hình học cơ bản (mũi tên
// không phải hình học, bán nguyệt/đám mây dễ gây nhầm lẫn cho học sinh nhỏ tuổi). Còn lại 11 hình.
const SHAPES = [
  "Hình tròn",
  "Hình vuông",
  "Hình tam giác",
  "Hình chữ nhật",
  "Hình ngôi sao",
  "Hình trái tim",
  "Hình thoi",
  "Hình ê-líp",
  "Hình ngũ giác",
  "Hình lục giác",
  "Hình thang",
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

/**
 * Tính nhẩm: phép + hoặc - đơn giản, kết quả để trống cho học sinh điền.
 *
 * ================== MỞ RỘNG LỚP 3 (Đợt 1) ==================
 * Lớp 3 dùng nhánh RIÊNG: cả 2 số hạng đều là SỐ TRÒN (chục/trăm/nghìn, tuỳ độ lớn) - đúng bản
 * chất "tính nhẩm" thật (VD 500 + 300, 4000 - 1500), khác hẳn Mầm non/Lớp 1/Lớp 2 (số bất kỳ,
 * phạm vi đủ nhỏ để nhẩm trực tiếp không cần số tròn).
 */
export function generateTinhNham(grade, count = 6) {
  const max = WORKSHEET_GRADES[grade].maxNumber;
  const items = [];
  for (let i = 0; i < count; i++) {
    const operator = Math.random() < 0.5 ? "+" : "-";
    let a, b;
    if (grade === "LOP_3" || grade === "LOP_4") {
      // ĐÃ SỬA (test thực tế phát hiện lỗi): cách cũ (số bất kỳ x bước tròn) vẫn ra được kiểu
      // "49620 - 5050" - đúng là "tròn chục" về mặt kỹ thuật nhưng KHÔNG dễ nhẩm. Cách đúng: chọn
      // 1 HÀNG (chục/trăm/nghìn/chục nghìn) làm "đơn vị nhẩm", rồi số = (1 chữ số có nghĩa, tối đa
      // 2) × hàng đó - đúng khuôn "3000 + 4000", "50 000 - 20 000" quen thuộc trong SGK.
      // MỞ RỘNG LỚP 4: thêm hàng "100 000" vào kho (max Lớp 4 = 1 000 000) - vẫn cùng công thức,
      // chỉ filter theo `max` nên KHÔNG cần nhánh riêng cho Lớp 4.
      const magnitudePool = [10, 100, 1000, 10000, 100000].filter((m) => m <= max);
      const magnitude = pick(magnitudePool.length ? magnitudePool : [10]);
      const maxCoeff = Math.min(99, Math.floor(max / magnitude));
      if (operator === "+") {
        const coeffA = randInt(1, Math.max(1, maxCoeff - 1));
        a = coeffA * magnitude;
        // ĐÃ SỬA: cap coeffB bằng maxCoeff (không chỉ bằng phần còn lại của `max`) - nếu không,
        // coeffB có thể vọt lên 3 chữ số (VD 508) dù coeffA chỉ 2 chữ số, phá vỡ tính "dễ nhẩm".
        const coeffBLimit = Math.min(maxCoeff, Math.max(1, Math.floor((max - a) / magnitude)));
        const coeffB = randInt(1, coeffBLimit);
        b = coeffB * magnitude;
      } else {
        const coeffA = randInt(2, maxCoeff);
        a = coeffA * magnitude;
        const coeffB = randInt(1, Math.max(1, Math.floor(a / magnitude) - 1));
        b = coeffB * magnitude;
      }
    } else if (operator === "+") {
      a = randInt(1, max - 1);
      b = randInt(1, max - a);
    } else {
      a = randInt(2, max);
      b = randInt(1, a - 1);
    }
    items.push({ operandA: a, operandB: b, operator, answer: operator === "+" ? a + b : a - b });
  }
  return items;
}

/** Đếm và viết số: hiện N icon, học sinh đếm và viết số vào ô trống. */
export function generateDemVaVietSo(grade, count = 4) {
  const max = Math.min(WORKSHEET_GRADES[grade].maxNumber, 12); // đếm quá 12 icon sẽ rối mắt
  const items = [];
  const usedIcons = [...ICONS].sort(() => Math.random() - 0.5).slice(0, count);
  for (const icon of usedIcons) {
    items.push({ icon, count: randInt(2, max), answer: undefined }); // answer = count (đã biết)
  }
  return items.map((it) => ({ ...it, answer: it.count }));
}

/** So sánh: 2 số hoặc 2 phép tính đơn giản, điền dấu >, <, =. */
export function generateSoSanh(grade, count = 6) {
  const max = WORKSHEET_GRADES[grade].maxNumber;
  const items = [];
  for (let i = 0; i < count; i++) {
    const useExpr = grade !== "MAM_NON" && Math.random() < 0.4;
    const left = useExpr ? buildSimpleExpr(max) : { display: String(randInt(0, max)), value: 0 };
    if (!useExpr) left.value = Number(left.display);
    const right = useExpr && Math.random() < 0.5 ? buildSimpleExpr(max) : { display: String(randInt(0, max)), value: 0 };
    if (right.value === 0 && !right.display.includes("+") && !right.display.includes("-")) {
      right.value = Number(right.display);
    }
    const answer = left.value > right.value ? ">" : left.value < right.value ? "<" : "=";
    items.push({ left: left.display, right: right.display, answer });
  }
  return items;
}

function buildSimpleExpr(max) {
  const a = randInt(1, max - 1);
  const b = randInt(1, max - a);
  return { display: `${a} + ${b}`, value: a + b };
}

/**
 * Dãy số cách đều: 1 vài số bị ẩn, học sinh điền theo quy luật (bước +1, +2, -1...).
 *
 * ================== GIAI ĐOẠN F (phân cấp độ khó theo khối lớp) ==================
 * TRƯỚC ĐÂY Lớp 1 dùng chung `steps = [1, 2]` với Lớp 2 (Lớp 2 dùng `[1, 2, 5, 10]`) - giáo
 * viên phản ánh ĐẾM CÁCH 2 (VD 18,16,14,12,__,8) là kỹ năng QUÁ KHÓ với Lớp 1 (SGK Lớp 1 mọi bộ
 * sách hiện hành đều CHỈ dạy đếm cách 1, và đếm cách 10/tròn chục ở cuối năm khi mở rộng phạm vi
 * số - đếm cách 2/5 mới xuất hiện từ Lớp 2). Giờ tách riêng độ khó từng khối:
 *   - Mầm non: CHỈ cách 1 (giữ nguyên).
 *   - Lớp 1: ƯU TIÊN cách 1 (80% số lần), THỈNH THOẢNG cách 10/tròn chục (20%) - dùng mảng có
 *     trọng số [1,1,1,1,10] thay vì random đều 50/50 như kiểu pick(steps) cũ.
 *   - Lớp 2: cách 1/2/5/10 (giữ nguyên, đây là khối MỚI được học cách 2/cách 5 theo đúng SGK).
 * Vì maxNumber Lớp 1 chỉ 20 (xem WORKSHEET_GRADES), 1 dãy CÁCH 10 dài 6 số (như cách 1/2) sẽ
 * không đủ chỗ chứa (0,10,20,30... vượt quá 20) - nên khi rơi trúng step=10 (chỉ áp dụng khi
 * max=20, tức Lớp 1), rút DÃY NGẮN LẠI còn 3 số (VD 0-10-20) thay vì cố ép 6 số như bình thường,
 * vẫn đúng khái niệm "đếm tròn chục" mà không tạo ra dãy vô lý ngoài phạm vi số đã học.
 */
export function generateDaySo(grade, count = 4) {
  const max = WORKSHEET_GRADES[grade].maxNumber;
  const items = [];
  // MỞ RỘNG LỚP 3: bước nhảy lớn hơn hẳn (10/100/1000) - khớp phạm vi số đến 100 000, bước 1/2/5
  // của Lớp 2 sẽ tạo dãy vô nghĩa (gần như không đổi) khi phóng lên phạm vi này.
  const steps =
    grade === "MAM_NON"
      ? [1]
      : grade === "LOP_1"
      ? [1, 1, 1, 1, 10]
      : grade === "LOP_3"
      ? [10, 100, 1000]
      : grade === "LOP_4" // MỞ RỘNG LỚP 4: bước nhảy lớn hơn, khớp phạm vi số đến 1 000 000
      ? [1000, 10000, 100000]
      : [1, 2, 5, 10];
  for (let i = 0; i < count; i++) {
    const step = pick(steps) * (Math.random() < 0.3 ? -1 : 1);

    // TRƯỜNG HỢP ĐẶC BIỆT "cách 10/tròn chục" trong phạm vi hẹp (Lớp 1, max=20): công thức tính
    // khoảng bắt đầu bên dưới (dùng cho cách 1/2/5 vốn có nhiều lựa chọn start) giả định dãy 6 số
    // luôn vừa trong [1, max] - với step 10 và max chỉ 20, dãy 6 số cách 10 dài tới 50 đơn vị,
    // KHÔNG BAO GIỜ vừa (dù chỉ 6 số, số cuối đã vượt 20 rất xa). Giải pháp: liệt kê ĐÚNG các số
    // tròn chục có sẵn trong phạm vi [0, max] (VD max=20 -> đúng 3 số: 0, 10, 20) làm CẢ dãy luôn
    // (không random start/length nữa vì lựa chọn đã hết sức hẹp), ẩn số Ở GIỮA.
    if (Math.abs(step) === 10 && max < 10 * 5) {
      const roundValues = [];
      for (let v = 0; v <= max; v += 10) roundValues.push(v);
      if (roundValues.length < 3) {
        // Phạm vi số quá nhỏ để có đủ 3 số tròn chục (VD Mầm non max=10) - rơi về step 1 an toàn
        // thay vì tạo dãy cụt lủn không có ý nghĩa luyện tập.
        items.push(...generateDaySo(grade, 1));
        continue;
      }
      const sequence = step > 0 ? roundValues : [...roundValues].reverse();
      const hideIndex = 1;
      const answer = sequence[hideIndex];
      const display = sequence.map((n, idx) => (idx === hideIndex ? null : n));
      items.push({ sequence: display, hideIndex, answer, step });
      continue;
    }

    const length = 6;
    const start = step > 0 ? randInt(1, Math.max(1, max - step * (length - 1))) : randInt(step * (length - 1) * -1 + 1, max);
    const sequence = Array.from({ length }, (_, idx) => start + step * idx);
    const hideIndex = randInt(1, length - 2); // không ẩn số đầu/cuối để còn suy luận quy luật
    const answer = sequence[hideIndex];
    const display = sequence.map((n, idx) => (idx === hideIndex ? null : n));
    items.push({ sequence: display, hideIndex, answer, step });
  }
  return items;
}

/**
 * Nối phép tính với kết quả đúng - vế trái là phép tính, vế phải là kết quả bị xáo trộn.
 *
 * ================== MỞ RỘNG LỚP 3 (Đợt 1) ==================
 * CHỦ Ý cap max = 1000 (không dùng thẳng maxNumber = 100 000) - dạng bài này để học sinh NHẨM
 * NHANH rồi nối, phép cộng/trừ 2 số 5 chữ số không còn "nhẩm" được nữa (cùng lý do với
 * generateTinhNham() ở trên). 1000 vẫn đủ thử thách hơn Lớp 2 (max=100) mà còn nhẩm được.
 *
 * MỞ RỘNG LỚP 4: cap riêng 10 000 (cao hơn Lớp 3 nhưng vẫn nhẩm được, không dùng thẳng
 * maxNumber=1 000 000 - cùng lý do đã giải thích ở trên).
 */
export function generateNoiPhepTinh(grade, count = 5) {
  const max = grade === "LOP_3" ? 1000 : grade === "LOP_4" ? 10000 : WORKSHEET_GRADES[grade].maxNumber;
  const pairs = [];
  const usedResults = new Set();
  for (let i = 0; i < count; i++) {
    let a, b, operator, result;
    do {
      operator = Math.random() < 0.5 ? "+" : "-";
      if (operator === "+") {
        a = randInt(1, max - 1);
        b = randInt(1, max - a);
        result = a + b;
      } else {
        a = randInt(2, max);
        b = randInt(1, a - 1);
        result = a - b;
      }
    } while (usedResults.has(result));
    usedResults.add(result);
    pairs.push({ expr: `${a} ${operator} ${b}`, result });
  }
  const shuffledResults = [...pairs.map((p) => p.result)].sort(() => Math.random() - 0.5);
  return { pairs, shuffledResults };
}

/**
 * ================== MỞ RỘNG LỚP 3, ĐỢT 1 (dạng bài MỚI) ==================
 * "Nhân, chia trong bảng" - đúng chủ đề 2 "Bảng nhân, bảng chia" (SGK Toán 3 Kết nối tri thức,
 * đã tra cứu thực tế). Bảng cửu chương 2-9, cả 2 chiều: PHÉP NHÂN (a × b, a,b trong 2-9) và PHÉP
 * CHIA HẾT tương ứng (dựng NGƯỢC từ 1 phép nhân vừa random để đảm bảo luôn chia hết, không bao
 * giờ ra số dư - đúng mức độ "bảng chia" cơ bản, chưa học phép chia có dư ở dạng bài này).
 *
 * TÁI DÙNG NGUYÊN dạng dữ liệu {operandA, operandB, operator, answer} của generateTinhNham() ở
 * trên - để dùng lại được TinhNhamSection (web)/buildTinhNhamParagraphs (Word) mà KHÔNG cần viết
 * component mới, giống đúng cách "do_dai_sap_xep" tái dùng "sap_xep_thu_tu" hay "cac_ngay_trong_tuan"
 * tái dùng "day_so" đã làm trước đó trong file này.
 */
/**
 * ================== SỬA LỖI (Phiên 14) ==================
 * TRƯỚC ĐÂY không có bước loại trùng - random độc lập từng dòng nên hoàn toàn có thể ra 2 dòng
 * giống hệt nhau (VD "2 × 2 = ?" xuất hiện 2 lần liền kề, giáo viên phản ánh thực tế). SỬA: thêm
 * `used` Set + vòng lặp while có `guard` chống lặp vô hạn - ĐÚNG khuôn đã áp dụng cho các generator
 * khác trong file này (generatePhanSoSoSanh, generateGocNhanBiet...). Dedupe key dùng ĐÚNG bộ 3
 * (operandA, operator, operandB) hiển thị ra đề - không dedupe theo `answer` vì nhiều phép tính
 * khác nhau có thể ra cùng kết quả (VD "2×6" và "3×4" đều = 12, vẫn là 2 câu hỏi hợp lệ khác nhau).
 */
export function generateNhanChiaBang(count = 6) {
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 30) {
    guard++;
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const product = a * b;
    const isDivision = Math.random() < 0.5;
    const item = isDivision
      ? { operandA: product, operandB: a, operator: "÷", answer: b }
      : { operandA: a, operandB: b, operator: "×", answer: product };
    const dedupeKey = `${item.operandA}${item.operator}${item.operandB}`;
    if (used.has(dedupeKey)) continue;
    used.add(dedupeKey);
    items.push(item);
  }
  return items;
}

/**
 * ================== GIAI ĐOẠN F (thêm dạng bài "Tách - Gộp") ==================
 * Sơ đồ Tách - Gộp (number bond / part-whole model): 1 số TỔNG ("whole") được tách thành 2 số
 * THÀNH PHẦN ("part1"/"part2") sao cho part1 + part2 = whole - đây là dạng bài xuất hiện trong
 * MỌI bộ SGK Toán Lớp 1 hiện hành (Kết nối tri thức, Chân trời sáng tạo, Cánh diều...) ngay từ
 * chương đầu, giúp học sinh hiểu bản chất phép cộng/trừ qua mối quan hệ tổng-thành phần, TRƯỚC
 * khi làm quen ký hiệu +/-. Trước đây "dekiemtra" CHƯA có dạng bài này dù rất phổ biến trong SGK
 * thực tế - giáo viên phản ánh trực tiếp.
 *
 * Giới hạn cap=10: dù Lớp 1 học số tới 20, sơ đồ tách-gộp trong SGK gần như CHỈ dùng phạm vi 0-10
 * (nền tảng trước khi mở rộng qua phép cộng/trừ có nhớ) - dùng nguyên maxNumber=20 sẽ tạo bài
 * lệch xa thực tế giảng dạy.
 *
 * `hideSlot` random ĐỀU cả 3 khả năng ẩn (không chỉ ẩn part2 như ví dụ giáo viên đưa) để bài
 * phong phú hơn: ẩn part1 hoặc part2 (kỹ năng "TÁCH" - cho tổng, tìm 1 phần) hoặc ẩn whole (kỹ
 * năng "GỘP" - cho 2 phần, tìm tổng) - cả 2 chiều đều cần thiết theo đúng tên gọi "Tách - Gộp".
 */
export function generateTachGop(grade, count = 4) {
  const cap = Math.min(WORKSHEET_GRADES[grade].maxNumber, 10);
  const items = [];
  for (let i = 0; i < count; i++) {
    const whole = randInt(2, cap); // tối thiểu 2 để luôn tách được thành 2 phần dương (>=1 mỗi phần)
    const part1 = randInt(1, whole - 1);
    const part2 = whole - part1;
    const hideSlot = pick(["part1", "part2", "whole"]);
    items.push({ whole, part1, part2, hideSlot });
  }
  return items;
}

/** Nhận diện hình - chọn ngẫu nhiên 1 tập con hình cơ bản để học sinh gọi tên + tô màu.
 * GIAI ĐOẠN 9: `count` giờ LUÔN nhỏ hơn kích thước kho (mặc định 5/14, xem defaultCount trong
 * worksheetExerciseCatalog.js) nên slice() không còn khả năng lấy trọn cả kho như bug cũ - vẫn
 * chốt Math.min ở đây để an toàn tuyệt đối dù giáo viên tự gõ số lớn hơn kho vào ô số lượng. */
export function generateNhanDienHinh(count = 5) {
  const safeCount = Math.min(count, SHAPES.length);
  return [...SHAPES].sort(() => Math.random() - 0.5).slice(0, safeCount);
}

/**
 * ================== GIAI ĐOẠN 2 (đa dạng hoá dạng hoạt động) ==================
 * Sắp xếp thứ tự: mỗi bộ gồm 3 số phân biệt trong phạm vi của khối, hiển thị xáo trộn,
 * học sinh viết lại theo thứ tự. Đổi chiều bé->lớn / lớn->bé NGẪU NHIÊN theo từng bộ (không
 * cố định 1 chiều suốt phiếu) để bớt đơn điệu - khớp tinh thần bài mẫu "Sắp xếp các số đo độ
 * dài theo thứ tự từ bé đến lớn" trong phiếu lớp 2 giáo viên gửi làm nguồn cảm hứng ban đầu.
 */
/**
 * ================== GIAI ĐOẠN 2 ==================
 * Sắp xếp thứ tự bé→lớn hoặc lớn→bé.
 *
 * ================== SỬA LỖI (Phiên 14) ==================
 * TRƯỚC ĐÂY: `direction` được random RIÊNG cho TỪNG dòng trong vòng lặp (VD dòng 1 ra "desc" dùng
 * dấu ">", dòng 2-3 ra "asc" dùng dấu "<") - trong khi `worksheetGenerator.js` chỉ hiện DUY NHẤT 1
 * câu lệnh đầu bài cố định "...từ bé đến lớn" cho cả section, gây lệch giữa đề bài và bài làm thật
 * (giáo viên phản ánh: đề bảo "bé đến lớn" nhưng có dòng lại yêu cầu ngầm "lớn đến bé" qua dấu >).
 * SỬA: random `direction` DUY NHẤT 1 LẦN cho CẢ section (mọi dòng dùng chung 1 hướng sắp xếp) -
 * khớp đúng bản chất "1 dạng bài = 1 yêu cầu duy nhất" của phiếu bài tập. Trả thêm field
 * `direction` ở cấp ngoài cùng (không chỉ trong từng phần tử `sets`) để `worksheetGenerator.js` có
 * thể tự chọn ĐÚNG câu lệnh khớp hướng đã random - xem `pickSapXepInstructionText()` bên dưới.
 */
export function generateSapXepThuTu(grade, count = 3) {
  const max = WORKSHEET_GRADES[grade].maxNumber;
  const direction = Math.random() < 0.5 ? "asc" : "desc";
  const sets = [];
  for (let i = 0; i < count; i++) {
    const numbers = new Set();
    while (numbers.size < 3) numbers.add(randInt(0, max));
    const ascending = [...numbers].sort((a, b) => a - b);
    const sortedAnswer = direction === "asc" ? ascending : [...ascending].reverse();
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    sets.push({ numbers: shuffled, sortedAnswer, direction });
  }
  return sets;
}

/**
 * ================== GIAI ĐOẠN 2 (sửa bug "Nhận diện hình" đứng trơ trọi) ==================
 * Đếm hình theo yêu cầu - hoạt động ỨNG DỤNG luôn đi kèm BẮT BUỘC ngay sau "Nhận diện hình"
 * (xem worksheetGenerator.js - không phải dạng bài giáo viên tự bật/tắt riêng, vì mục đích là
 * đảm bảo "Nhận diện hình" không bao giờ đứng một mình chỉ để liệt kê + tô màu như trước).
 *
 * QUAN TRỌNG: nhận `shapes` là CHÍNH danh sách hình đã chọn cho "Nhận diện hình" (không tự
 * chọn hình khác) - để 2 khối bài liên kết với nhau (hình bé vừa gọi tên/tô màu ở trên, giờ
 * đếm lại đúng những hình đó trong 1 "khay hình" trộn lẫn), không phải 2 hoạt động rời rạc.
 *
 * ================== GIAI ĐOẠN 9 (thêm hình gây nhiễu trong khay đếm) ==================
 * Khoảng 50% số lần tạo phiếu, trộn thêm 1-2 hình KHÔNG nằm trong `shapes` (lấy từ phần còn lại
 * của kho SHAPES) vào khay - CHỈ xuất hiện trong khay, KHÔNG có câu hỏi "Có bao nhiêu Hình X?"
 * tương ứng (không tính vào questions/answer) - giúp học sinh phải thực sự phân biệt đúng hình
 * cần đếm thay vì đếm máy móc mọi thứ có trong khay.
 */
export function generateDemHinhUngDung(shapes, count = 3) {
  const targets = [...shapes].sort(() => Math.random() - 0.5).slice(0, Math.min(count, shapes.length));
  const tray = shapes.map((shape) => ({ shape, qty: randInt(2, 5) }));

  const distractorPool = SHAPES.filter((s) => !shapes.includes(s));
  if (distractorPool.length > 0 && Math.random() < 0.5) {
    const distractorCount = randInt(1, Math.min(2, distractorPool.length));
    const distractors = [...distractorPool].sort(() => Math.random() - 0.5).slice(0, distractorCount);
    for (const shape of distractors) {
      tray.push({ shape, qty: randInt(1, 3) });
    }
  }

  const trayIcons = tray.flatMap(({ shape, qty }) => Array(qty).fill(shape)).sort(() => Math.random() - 0.5);
  const questions = targets.map((shape) => ({
    shape,
    answer: tray.find((t) => t.shape === shape)?.qty ?? 0,
  }));
  return { trayIcons, questions };
}

/** Danh sách icon dùng chung (để component render dùng lại, tránh lệch giữa các hàm sinh). */
export const AVAILABLE_ICONS = ICONS;

/**
 * ================== GIAI ĐOẠN 9, BƯỚC 2 (Tầng B - catalog theo chủ đề SGK) ==================
 * Trước đây catalog chỉ có các dạng bài "kỹ năng chung" (tính nhẩm, so sánh...) không bám theo
 * MẠCH NỘI DUNG thật của SGK (đo lường, tiền tệ, thời gian...) - xem PROJECT_SUMMARY.md mục 0.5
 * để rõ bối cảnh. Bước 2 bắt đầu với 2 chủ đề Lớp 1 (đơn giản hơn, làm trước theo yêu cầu giáo
 * viên): "Độ dài" và "Thời gian" - đúng 2 mạch nội dung Lớp 1 có trong chương trình GDPT 2018
 * (Lớp 1 CHƯA học "Tiền Việt Nam" hay "chu vi hình", những chủ đề đó dành cho Lớp 2 - làm ở lượt
 * sau). Toàn bộ vẫn sinh THUẦN BẰNG CODE (không cần AI), giữ đúng triết lý "rẻ, nhanh, không lo
 * AI tính sai" của cả file này.
 */

// ===== Chủ đề "Độ dài" =====

/** Tên gọi các "băng giấy"/đoạn thẳng minh hoạ cho bài so sánh độ dài - dùng chữ cái để không
 * lẫn với số đo (khác hẳn phong cách "Băng A/Băng B" khô khan, gần với cách gọi trong SGK thật:
 * "băng giấy màu xanh/băng giấy màu đỏ" v.v.) */
const LENGTH_BAND_NAMES = [
  ["băng giấy xanh", "băng giấy đỏ"],
  ["băng giấy vàng", "băng giấy tím"],
  ["sợi dây xanh", "sợi dây cam"],
  ["cây bút chì xanh", "cây bút chì đỏ"],
  ["que tính xanh", "que tính vàng"],
];

/** So sánh độ dài 2 "băng giấy" (có ghi sẵn số đo cm) - điền dấu >, <, =. Phạm vi 3-20cm khớp
 * đúng phạm vi số Lớp 1 đã học (WORKSHEET_GRADES.LOP_1.maxNumber = 20). */
export function generateDoDaiSoSanh(count = 4) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const [nameA, nameB] = pick(LENGTH_BAND_NAMES);
    const cmA = randInt(3, 20);
    // Khoảng 20% số câu ra kết quả BẰNG NHAU (cmB = cmA) - còn lại random độc lập, để không lúc
    // nào cũng có dấu > hoặc < (đa dạng cả 3 loại dấu như bài "so_sanh" gốc).
    const cmB = Math.random() < 0.2 ? cmA : randInt(3, 20);
    const answer = cmA === cmB ? "=" : cmA > cmB ? ">" : "<";
    items.push({ nameA, cmA, nameB, cmB, answer });
  }
  return items;
}

/** Sắp xếp 3 "băng giấy" theo thứ tự độ dài (bé -> lớn hoặc lớn -> bé) - CÙNG khuôn dữ liệu với
 * generateSapXepThuTu() (numbers/sortedAnswer/direction) để tái dùng được nguyên xi
 * SapXepThuTuSection (web) / buildSapXepThuTuParagraphs (Word) mà KHÔNG cần viết component mới -
 * chỉ khác đơn vị hiển thị là "cm" đi kèm mỗi số (xử lý ở tầng hiển thị, xem WorksheetPreview.jsx/
 * worksheetExportService.js). */
/**
 * ================== SỬA LỖI (Phiên 14, cùng lý do generateSapXepThuTu) ==================
 * Random `direction` DUY NHẤT 1 lần cho cả section, không random riêng từng dòng - tránh lệch với
 * câu lệnh đầu bài cố định.
 */
export function generateDoDaiSapXep(count = 3) {
  const direction = Math.random() < 0.5 ? "asc" : "desc";
  const sets = [];
  for (let i = 0; i < count; i++) {
    const cmSet = new Set();
    while (cmSet.size < 3) cmSet.add(randInt(3, 30));
    const ascending = [...cmSet].sort((a, b) => a - b);
    const sortedAnswer = direction === "asc" ? ascending : [...ascending].reverse();
    const shuffled = [...cmSet].sort(() => Math.random() - 0.5);
    sets.push({ numbers: shuffled, sortedAnswer, direction, unit: "cm" });
  }
  return sets;
}

// ===== Chủ đề "Thời gian" =====

/** Xem đồng hồ - CHỈ giờ đúng (phút luôn chỉ số 12) - đúng mức độ chương trình Lớp 1 ("Thời
 * gian, giờ và lịch" chỉ dạy giờ đúng, giờ-phút để dành Lớp 2). `count` giờ PHÂN BIỆT lấy từ
 * 1-12 (xáo trộn rồi cắt, giống generateNhanDienHinh) - tránh lặp y hệt 1 giờ nhiều lần trong
 * cùng 1 phiếu khi count <= 12. */
export function generateXemDongHoGioDung(count = 4) {
  const allHours = Array.from({ length: 12 }, (_, i) => i + 1);
  const shuffled = [...allHours].sort(() => Math.random() - 0.5);
  if (count <= shuffled.length) return shuffled.slice(0, count).map((hour) => ({ hour }));
  // count > 12 (hiếm khi giáo viên cần nhiều vậy) - lặp lại sau khi hết 1 vòng, vẫn an toàn.
  const hours = [...shuffled];
  while (hours.length < count) hours.push(...[...allHours].sort(() => Math.random() - 0.5));
  return hours.slice(0, count).map((hour) => ({ hour }));
}

export const DAYS_OF_WEEK = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

/** Điền (các) ngày còn thiếu trong 1 đoạn liên tiếp của tuần - CÙNG khuôn dữ liệu với
 * generateDaySo() (sequence có null = chỗ trống, answer = giá trị đúng) để tái dùng được
 * DaySoSection/buildDaySoParagraphs, chỉ khác sequence chứa TÊN NGÀY (string) thay vì SỐ. Chỉ hỗ
 * trợ ẩn ĐÚNG 1 vị trí/câu (khác generateDaySo cho phép nhiều cấu hình) vì chuỗi 7 ngày trong
 * tuần ngắn, ẩn nhiều vị trí cùng lúc dễ làm bài mất hết đầu mối suy luận thứ tự. */
export function generateCacNgayTrongTuan(count = 3) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const length = randInt(4, 6); // đoạn liên tiếp dài 4-6 ngày (không wrap qua Chủ Nhật -> Thứ Hai, giữ đơn giản)
    const maxStart = DAYS_OF_WEEK.length - length;
    const start = randInt(0, maxStart);
    const sequence = DAYS_OF_WEEK.slice(start, start + length);
    const hideIndex = randInt(1, length - 2); // không ẩn ngày đầu/cuối - còn đầu mối suy luận
    const answer = sequence[hideIndex];
    const display = sequence.map((d, idx) => (idx === hideIndex ? null : d));
    items.push({ sequence: display, hideIndex, answer });
  }
  return items;
}

/**
 * ================== MỞ RỘNG LỚP 3, ĐỢT 2 ==================
 * 5 dạng bài MỚI bám đúng mạch nội dung SGK Toán 3 Kết nối tri thức (đã tra cứu thực tế qua PPCT
 * + giải SGK, xem NEXT_STEPS.md): "Chu vi/diện tích hình chữ nhật-hình vuông", "Đổi đơn vị đo",
 * "Xem đồng hồ (giờ, phút)", "Tiền Việt Nam", "Khả năng xảy ra của một sự kiện". Tất cả vẫn sinh
 * THUẦN BẰNG CODE (không cần AI), giữ đúng triết lý cả file.
 */

// ===== Chủ đề "Chu vi, diện tích hình chữ nhật - hình vuông" =====

/**
 * Mỗi câu: 1 hình (vuông hoặc chữ nhật) với số đo cho sẵn, yêu cầu tính CHU VI hoặc DIỆN TÍCH
 * (random, không cố định 1 loại suốt phiếu - đúng cách SGK trộn cả 2 dạng câu hỏi). Phạm vi số đo
 * 3-20cm để phép nhân/cộng ra kết quả vẫn nằm trong khả năng tính tay của học sinh Lớp 3 (không
 * vượt quá xa phạm vi bảng cửu chương khi tính diện tích).
 */
export function generateChuViDienTich(count = 4) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const isSquare = Math.random() < 0.5;
    const metric = Math.random() < 0.5 ? "chu_vi" : "dien_tich";
    if (isSquare) {
      const side = randInt(3, 20);
      const answer = metric === "chu_vi" ? side * 4 : side * side;
      items.push({ shape: "vuong", side, metric, answer, unit: "cm" });
    } else {
      const length = randInt(4, 20);
      const width = randInt(2, length - 1); // rộng luôn NHỎ HƠN dài, đúng định nghĩa hình chữ nhật
      const answer = metric === "chu_vi" ? (length + width) * 2 : length * width;
      items.push({ shape: "hcn", length, width, metric, answer, unit: "cm" });
    }
  }
  return items;
}

// ===== Chủ đề "Đổi đơn vị đo" (độ dài / khối lượng / dung tích) =====

/**
 * Mỗi "cặp đơn vị" gồm đơn vị LỚN + đơn vị NHỎ + tỉ lệ quy đổi - CHỈ liệt kê các cặp LIỀN KỀ
 * (hoặc cách 1 bậc, VD m-cm) THẬT SỰ xuất hiện trong SGK Lớp 3 (chương "Đơn vị đo độ dài",
 * "Đơn vị đo khối lượng, dung tích") - KHÔNG liệt kê mọi cặp có thể (VD km-mm) vì SGK không dạy
 * quy đổi cách xa như vậy ở Lớp 3.
 */
const LENGTH_UNIT_PAIRS = [
  { big: "km", small: "m", ratio: 1000 },
  { big: "m", small: "dm", ratio: 10 },
  { big: "m", small: "cm", ratio: 100 },
  { big: "dm", small: "cm", ratio: 10 },
  { big: "cm", small: "mm", ratio: 10 },
];
const MASS_UNIT_PAIRS = [{ big: "kg", small: "g", ratio: 1000 }];
const VOLUME_UNIT_PAIRS = [{ big: "l", small: "ml", ratio: 1000 }];

/**
 * Random 1 cặp đơn vị + 1 chiều đổi (lớn->nhỏ hoặc nhỏ->lớn). Chiều "nhỏ->lớn" LUÔN dựng ngược từ
 * 1 bội số nguyên của tỉ lệ quy đổi - đảm bảo chia hết tuyệt đối, không bao giờ ra số thập phân
 * (Lớp 3 CHƯA học số thập phân).
 */
export function generateDoiDonVi(count = 5) {
  const allPairs = [
    ...LENGTH_UNIT_PAIRS.map((p) => ({ ...p, category: "length" })),
    ...MASS_UNIT_PAIRS.map((p) => ({ ...p, category: "mass" })),
    ...VOLUME_UNIT_PAIRS.map((p) => ({ ...p, category: "volume" })),
  ];
  const items = [];
  for (let i = 0; i < count; i++) {
    const pair = pick(allPairs);
    const bigToSmall = Math.random() < 0.5;
    if (bigToSmall) {
      const value = randInt(1, 20);
      items.push({ value, fromUnit: pair.big, toUnit: pair.small, answer: value * pair.ratio });
    } else {
      const multiplier = randInt(1, 20);
      items.push({ value: multiplier * pair.ratio, fromUnit: pair.small, toUnit: pair.big, answer: multiplier });
    }
  }
  return items;
}

// ===== Chủ đề "Thời gian" (mở rộng Lớp 3: giờ VÀ phút, khác Lớp 1 chỉ giờ đúng) =====

/**
 * Phút LUÔN là bội số của 5 (0,5,10,...,55) - đúng mức đọc đồng hồ Lớp 3 (kim phút chỉ vào các
 * vạch chia 5 phút, CHƯA yêu cầu đọc chính xác từng phút lẻ). Tránh lặp y hệt 1 thời điểm nhiều
 * lần trong cùng phiếu (so sánh cả giờ LẪN phút, khác generateXemDongHoGioDung chỉ so giờ).
 */
export function generateXemDongHoGioPhut(count = 4) {
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 20) {
    guard++;
    const hour = randInt(1, 12);
    const minute = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
    const keyStr = `${hour}:${minute}`;
    if (used.has(keyStr)) continue;
    used.add(keyStr);
    items.push({ hour, minute });
  }
  return items;
}

// ===== Chủ đề "Tiền Việt Nam" =====

/** Mệnh giá tiền giấy phổ biến, khớp đúng nội dung "Tiền Việt Nam" SGK Toán 3. */
const MONEY_DENOMINATIONS = [1000, 2000, 5000, 10000, 20000, 50000, 100000];

/**
 * Mỗi câu: 2-3 loại tờ tiền khác nhau kèm số lượng, học sinh tính TỔNG số tiền - đúng bài tập
 * "đếm tiền" điển hình (VD "2 tờ 10 000đ và 3 tờ 5 000đ, hỏi tất cả bao nhiêu tiền?").
 */
export function generateTienVietNam(count = 4) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const numTypes = randInt(2, 3);
    const denoms = [...MONEY_DENOMINATIONS].sort(() => Math.random() - 0.5).slice(0, numTypes);
    const bills = denoms.map((denomination) => ({ denomination, quantity: randInt(1, 5) }));
    const answer = bills.reduce((sum, b) => sum + b.denomination * b.quantity, 0);
    items.push({ bills, answer });
  }
  return items;
}

// ===== Chủ đề "Thống kê, xác suất" (Khả năng xảy ra của một sự kiện) =====

/**
 * Ngân hàng câu phát biểu PHÂN LOẠI SẴN theo mức độ chắc chắn - đây là dạng bài "định tính" (chọn
 * nhãn đúng cho 1 phát biểu), KHÔNG tính toán được bằng công thức nên phải dùng ngân hàng câu có
 * sẵn (khác các dạng bài số học khác trong file này), nhưng vẫn sinh THUẦN BẰNG CODE (chỉ random
 * chọn tập con, không gọi AI) - đúng khái niệm 3 mức "Chắc chắn / Có thể / Không thể xảy ra" dạy
 * ở chủ đề "Một số yếu tố thống kê, xác suất" SGK Toán 3 Kết nối tri thức.
 */
export const PROBABILITY_LEVEL_LABELS = {
  chac_chan: "Chắc chắn",
  co_the: "Có thể",
  khong_the: "Không thể",
};

const PROBABILITY_STATEMENT_BANK = [
  { text: "Mặt Trời mọc ở hướng Đông.", level: "chac_chan" },
  { text: "Một năm có 12 tháng.", level: "chac_chan" },
  { text: "Một tuần có 7 ngày.", level: "chac_chan" },
  { text: "Nước sôi ở nhiệt độ 100°C khi đun ở áp suất bình thường.", level: "chac_chan" },
  { text: "Hôm nay là Chủ Nhật thì ngày mai là Thứ Hai.", level: "chac_chan" },
  { text: "Ngày mai trời sẽ có nắng.", level: "co_the" },
  { text: "Khi tung một đồng xu, mặt ngửa sẽ xuất hiện.", level: "co_the" },
  { text: "Bạn Lan sẽ được điểm 10 trong bài kiểm tra tới.", level: "co_the" },
  { text: "Ngày mai em sẽ gặp một người bạn mới.", level: "co_the" },
  { text: "Đội bóng của lớp em sẽ thắng trận đấu sắp tới.", level: "co_the" },
  { text: "Con gà mái đẻ ra trứng vịt.", level: "khong_the" },
  { text: "Con mèo tự biết bay như chim.", level: "khong_the" },
  { text: "Hòn đá tự đứng dậy và biết nói chuyện.", level: "khong_the" },
  { text: "Con cá sống được trên cạn mà không cần nước.", level: "khong_the" },
  { text: "Con voi nhỏ hơn con kiến.", level: "khong_the" },
];

export function generateKhaNangXayRa(count = 5) {
  const shuffled = [...PROBABILITY_STATEMENT_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ===== Chủ đề "Thu thập, phân loại, kiểm đếm số liệu" (Lớp 3, Đợt 3) =====

/**
 * Ngân hàng chủ đề khảo sát "yêu thích" - đúng dạng bài quen thuộc SGK Toán 3 KNTT chủ đề
 * "Một số yếu tố thống kê" (bảng số liệu/biểu đồ tranh đơn giản về sở thích của các bạn học
 * sinh). `noun` dùng cho câu hỏi dạng "<noun> nào được nhiều bạn yêu thích nhất?" - viết hoa
 * chữ cái đầu sẵn để chèn thẳng vào đầu câu.
 */
const DATA_SURVEY_TOPIC_BANK = [
  { theme: "loại trái cây", noun: "Loại quả", categories: ["Cam", "Xoài", "Chuối", "Táo", "Nho"] },
  { theme: "màu sắc", noun: "Màu", categories: ["Đỏ", "Xanh", "Vàng", "Tím", "Hồng"] },
  { theme: "con vật nuôi", noun: "Con vật", categories: ["Chó", "Mèo", "Cá", "Chim", "Thỏ"] },
  { theme: "môn thể thao", noun: "Môn thể thao", categories: ["Bóng đá", "Bóng rổ", "Cầu lông", "Bơi", "Bóng bàn"] },
  { theme: "môn học", noun: "Môn học", categories: ["Toán", "Tiếng Việt", "Mĩ thuật", "Âm nhạc", "Thể dục"] },
];

/**
 * 1 phiếu = 1 bảng/biểu đồ số liệu DUY NHẤT (đúng thực tế: khảo sát 1 chủ đề rồi hỏi nhiều câu
 * dựa trên CÙNG 1 bảng đó) kèm `count` câu hỏi rút ra từ bảng đó - khác các dạng bài khác trong
 * file này (mỗi "item" độc lập), nên trả về 1 object { title, data, questions } thay vì mảng
 * items rời rạc. `data`: mảng {label, value} - value random 3-15, ĐẢM BẢO max/min duy nhất
 * (không trùng) để câu hỏi "nhiều nhất/ít nhất" luôn có 1 đáp án rõ ràng, không gây tranh cãi.
 */
export function generateThuThapSoLieu(count = 4) {
  const topic = pick(DATA_SURVEY_TOPIC_BANK);
  const numCats = randInt(4, Math.min(5, topic.categories.length));
  const shuffledCats = [...topic.categories].sort(() => Math.random() - 0.5).slice(0, numCats);

  // Đảm bảo giá trị lớn nhất và nhỏ nhất duy nhất (không có 2 mục cùng bằng max/min) - random lại
  // toàn bộ (thay vì chỉnh từng phần tử, dễ vô tình tạo ra hoà mới) tới khi thoả điều kiện.
  let values;
  let guard = 0;
  do {
    values = shuffledCats.map(() => randInt(3, 15));
    guard++;
  } while (
    guard < 50 &&
    (values.filter((v) => v === Math.max(...values)).length > 1 || values.filter((v) => v === Math.min(...values)).length > 1)
  );

  const data = shuffledCats.map((label, i) => ({ label, value: values[i] }));
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const maxItem = data.reduce((a, b) => (b.value > a.value ? b : a));
  const minItem = data.reduce((a, b) => (b.value < a.value ? b : a));

  const pool = [
    ...data.map((d) => ({
      text: `Có bao nhiêu bạn yêu thích ${d.label}?`,
      answer: `${d.value} bạn`,
    })),
    { text: `${topic.noun} nào được nhiều bạn yêu thích nhất?`, answer: maxItem.label },
    { text: `${topic.noun} nào được ít bạn yêu thích nhất?`, answer: minItem.label },
    { text: "Có tất cả bao nhiêu bạn tham gia khảo sát?", answer: `${total} bạn` },
  ];
  if (data.length >= 2) {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const a = sorted[0];
    const b = sorted[sorted.length - 1];
    if (a.value !== b.value) {
      pool.push({
        text: `Số bạn yêu thích ${a.label} nhiều hơn số bạn yêu thích ${b.label} bao nhiêu bạn?`,
        answer: `${a.value - b.value} bạn`,
      });
    }
  }

  const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
  const questions = shuffledPool.slice(0, Math.min(count, shuffledPool.length));

  return {
    title: `Kết quả khảo sát về ${topic.theme} yêu thích của các bạn học sinh lớp 3A`,
    data,
    questions,
  };
}

// ================== MỞ RỘNG LỚP 4, ĐỢT 1 ==================
// "Rút gọn phân số" - đúng mạch "Phân số" trong SGK Toán 4 Kết nối tri thức (xem NEXT_STEPS.md).
// Cách sinh: chọn 1 phân số TỐI GIẢN có sẵn trong kho (mẫu số 2-9), rồi nhân cả tử/mẫu với 1 hệ
// số ngẫu nhiên (2-6) để ra phân số CHƯA tối giản đề bài - đáp án chính là phân số gốc trong kho.
// Hiển thị dạng chữ "tử/mẫu" (không vẽ phân số nằm ngang có gạch ngang) - giống cách dự án đã xử
// lý "Xem đồng hồ giờ, phút" ở bản Word (dùng text vì không cần độ chi tiết đồ hoạ, xem
// NEXT_STEPS.md Lớp 3 Đợt 2) - tránh phải dựng thêm layout phân số phức tạp ở cả web lẫn Word
// ngay từ đợt đầu tiên mở Lớp 4.
const SIMPLE_FRACTIONS = [
  [1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5],
  [1, 6], [5, 6], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
  [1, 8], [3, 8], [5, 8], [7, 8], [1, 9], [2, 9], [4, 9], [5, 9], [7, 9], [8, 9],
];

export function generatePhanSoRutGon(count = 6) {
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 20) {
    guard++;
    const [ansNum, ansDen] = pick(SIMPLE_FRACTIONS);
    const k = randInt(2, 6);
    const numerator = ansNum * k;
    const denominator = ansDen * k;
    const dedupeKey = `${numerator}/${denominator}`;
    if (used.has(dedupeKey)) continue;
    used.add(dedupeKey);
    items.push({ numerator, denominator, answerNumerator: ansNum, answerDenominator: ansDen });
  }
  return items;
}

// ================== MỞ RỘNG LỚP 4, ĐỢT 2 ==================
// "Biểu thức chữ" - đúng mạch "Biểu thức có chứa chữ" trong SGK Toán 4 KNTT (làm quen ẩn số:
// cho biết giá trị của chữ, tính giá trị biểu thức). Dùng ĐÚNG 1 chữ "a" (SGK Toán 4 luôn giới
// thiệu bằng 1 chữ trước, chưa ghép nhiều chữ - "a + b" là nội dung sau, để dành đợt sau nếu
// cần) - biểu thức gồm 2 bước tính (+/-/×) với 1 số ĐÃ CHO SẴN, học sinh thay a = giá trị rồi
// tính ra kết quả. Số liệu chọn nhỏ để vẫn tính nhẩm được (không cần đặt tính cột dọc).
function buildBieuThucChuExpression() {
  const a = randInt(2, 20);
  // Chọn ngẫu nhiên 1 hoặc 2 bước tính để đa dạng độ khó, luôn giữ số liệu đủ nhỏ để nhẩm được
  // và luôn trừ ra không âm (phù hợp học sinh Lớp 4, chưa học số âm).
  const steps = Math.random() < 0.5 ? 1 : 2;
  const parts = ["a"];
  let value = a;
  for (let i = 0; i < steps; i++) {
    // ĐÃ SỬA (sanity-check phát hiện lỗi): khi `value` tạm thời về 0 giữa 2 bước tính, nhánh trừ
    // cũ vẫn ép b tối thiểu = 1 (dùng max(1, ...)) -> trừ tiếp ra số ÂM (VD "a - 6 - 1" khi a=6).
    // Sửa: LOẠI hẳn phép trừ khỏi lựa chọn khi value <= 0 (không còn gì để trừ nữa).
    const availableOps = value > 0 ? ["+", "-", "×"] : ["+", "×"];
    const op = pick(availableOps);
    if (op === "×") {
      const b = randInt(2, 5);
      parts.push(`× ${b}`);
      value = value * b;
    } else if (op === "+") {
      const b = randInt(1, 30);
      parts.push(`+ ${b}`);
      value = value + b;
    } else {
      // trừ: b nằm trong [1, value] (value chắc chắn > 0 ở đây) - không bao giờ ra kết quả âm.
      const b = randInt(1, Math.min(20, value));
      parts.push(`- ${b}`);
      value = value - b;
    }
  }
  return { expression: parts.join(" "), aValue: a, answer: value };
}

export function generateBieuThucChu(count = 6) {
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 20) {
    guard++;
    const item = buildBieuThucChuExpression();
    const dedupeKey = `${item.expression}|${item.aValue}`;
    if (used.has(dedupeKey)) continue;
    used.add(dedupeKey);
    items.push(item);
  }
  return items;
}

// ================== MỞ RỘNG LỚP 4, ĐỢT 2 ==================
// "So sánh phân số" - khác "Rút gọn phân số" (đã có Đợt 1): ở đây cho 2 phân số CÙNG MẪU SỐ hoặc
// CÙNG TỬ SỐ (2 cách so sánh cơ bản nhất dạy trước quy đồng tổng quát trong SGK Toán 4 KNTT),
// học sinh điền dấu >, <, =. Tính đáp án bằng so sánh chéo (a/b vs c/d <=> a*d vs c*b) để ĐÚNG
// toán học trong MỌI trường hợp, không chỉ riêng 2 nhánh cùng mẫu/cùng tử.
function compareFractions(n1, d1, n2, d2) {
  const left = n1 * d2;
  const right = n2 * d1;
  if (left > right) return ">";
  if (left < right) return "<";
  return "=";
}

export function generatePhanSoSoSanh(count = 6) {
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 20) {
    guard++;
    const sameDenominator = Math.random() < 0.5;
    let n1, d1, n2, d2;
    if (sameDenominator) {
      d1 = d2 = randInt(3, 12);
      n1 = randInt(1, d1 - 1);
      n2 = randInt(1, d1 - 1);
    } else {
      n1 = n2 = randInt(1, 8);
      d1 = randInt(n1 + 1, n1 + 8);
      d2 = randInt(n1 + 1, n1 + 8);
    }
    const dedupeKey = `${n1}/${d1}_${n2}/${d2}`;
    if (used.has(dedupeKey)) continue;
    used.add(dedupeKey);
    items.push({ n1, d1, n2, d2, answer: compareFractions(n1, d1, n2, d2) });
  }
  return items;
}

// ================== MỞ RỘNG LỚP 4, ĐỢT 2 ==================
// "Góc và đơn vị đo góc" - đúng mạch "Góc nhọn, góc tù, góc bẹt" trong SGK Toán 4 KNTT. Chỉ yêu
// cầu NHẬN BIẾT/PHÂN LOẠI góc theo số đo cho sẵn (không yêu cầu tự đo bằng thước đo góc - việc đo
// tay thật cần dụng cụ vật lý, không phù hợp với phiếu bài tập tạo tự động) - đúng mức độ "làm
// quen" của Lớp 4, chưa sang tính toán góc phức tạp hơn (dành cho Lớp 5 nếu cần). Số đo random
// nhưng LOẠI TRỪ các mốc dễ gây tranh cãi khi làm tròn hiển thị (VD né quá sát 90/180).
const ANGLE_TYPES = [
  { type: "nhọn", min: 10, max: 85 }, // 0 < góc nhọn < 90
  { type: "vuông", fixed: 90 },
  { type: "tù", min: 95, max: 175 }, // 90 < góc tù < 180
  { type: "bẹt", fixed: 180 },
];

export function generateGocNhanBiet(count = 6) {
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 20) {
    guard++;
    const kind = pick(ANGLE_TYPES);
    const degrees = kind.fixed ?? randInt(kind.min, kind.max);
    if (used.has(degrees)) continue;
    used.add(degrees);
    items.push({ degrees, answer: kind.type });
  }
  return items;
}

// ================== MỞ RỘNG LỚP 5, ĐỢT 1 ==================
// "So sánh số thập phân" - dạng bài ĐẦU TIÊN của Lớp 5, mở đầu mảng số thập phân (xem
// NEXT_STEPS.md mục "Trạng thái Lớp 5"). KHÔNG dùng thẳng WORKSHEET_GRADES.LOP_5.maxNumber (đó là
// số TỰ NHIÊN) - sinh riêng phần nguyên (0-999, đủ nhỏ để học sinh không bị rối bởi số quá lớn khi
// đang tập trung vào phần thập phân) + phần thập phân (1 hoặc 2 chữ số, ngẫu nhiên mỗi số) rồi
// GHÉP CHUỖI thủ công (không cộng number, vì phép cộng number thập phân trong JS bị sai số nhị
// phân, VD 0.1+0.2 !== 0.3 - ghép chuỗi tránh hoàn toàn rủi ro này).
// Cố ý cho 1 tỉ lệ các cặp có SỐ CHỮ SỐ THẬP PHÂN KHÁC NHAU (VD "3,5" vs "3,45") - đúng trọng tâm
// SGK Toán 5 KNTT (học sinh hay nhầm "3,5 < 3,45" vì đếm chữ số thay vì hiểu giá trị hàng), so với
// so sánh 2 số CÙNG số chữ số thập phân (dễ hơn, chỉ cần so sánh như số tự nhiên).
function randomDecimalPart(digits) {
  // Số 0 ở cuối (VD "05") vẫn hợp lệ về mặt thập phân nhưng hiếm gặp trong đề - né để đề tự nhiên hơn.
  const min = digits === 1 ? 1 : 10;
  const max = digits === 1 ? 9 : 99;
  return String(randInt(min, max));
}

function compareDecimalStrings(intA, decA, intB, decB) {
  const a = Number(`${intA}.${decA}`);
  const b = Number(`${intB}.${decB}`);
  // So sánh bằng cách quy về CÙNG số chữ số thập phân (thêm số 0 vào cuối chuỗi ngắn hơn) rồi so
  // sánh như số nguyên - tránh hoàn toàn sai số dấu phẩy động của phép so sánh Number trực tiếp
  // (an toàn hơn vì mọi giá trị ở đây đều có tối đa 2 chữ số thập phân, không có phần vô hạn).
  const width = Math.max(decA.length, decB.length);
  const normA = Number(intA) * 10 ** width + Number(decA.padEnd(width, "0"));
  const normB = Number(intB) * 10 ** width + Number(decB.padEnd(width, "0"));
  if (normA > normB) return ">";
  if (normA < normB) return "<";
  return "=";
}

export function generateSoThapPhanSoSanh(count = 6) {
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 20) {
    guard++;
    const intA = randInt(0, 999);
    const intB = Math.random() < 0.5 ? intA : randInt(0, 999); // 1 nửa số cặp cùng phần nguyên - buộc học sinh so sánh phần thập phân
    const digitsA = Math.random() < 0.5 ? 1 : 2;
    // ~40% số cặp CỐ Ý lệch số chữ số thập phân (VD 1 số 1 chữ số, 1 số 2 chữ số) - đúng trọng tâm bài học nêu trên.
    const digitsB = Math.random() < 0.4 ? (digitsA === 1 ? 2 : 1) : digitsA;
    const decA = randomDecimalPart(digitsA);
    const decB = randomDecimalPart(digitsB);
    const dedupeKey = `${intA},${decA}_${intB},${decB}`;
    if (used.has(dedupeKey)) continue;
    used.add(dedupeKey);
    items.push({
      leftInt: intA,
      leftDec: decA,
      rightInt: intB,
      rightDec: decB,
      answer: compareDecimalStrings(intA, decA, intB, decB),
    });
  }
  return items;
}

// ================== MỞ RỘNG LỚP 5, ĐỢT 2 ==================
// "Phép cộng, trừ số thập phân" - dạng bài thứ 2 của mảng số thập phân (sau "so sánh" ở Đợt 1).
// Cố ý cho phép 2 số có SỐ CHỮ SỐ THẬP PHÂN KHÁC NHAU (VD "3,4 + 5,72") - đúng nội dung SGK Toán 5
// KNTT dạy học sinh "viết thêm 0 vào tận cùng bên phải phần thập phân" để 2 số cùng số chữ số
// trước khi cộng/trừ theo cột dọc. Toàn bộ phép tính quy về SỐ NGUYÊN (nhân 10^width) trước khi
// cộng/trừ rồi mới quy đổi ngược lại - tránh HOÀN TOÀN sai số dấu phẩy động JS (cùng nguyên tắc
// "ghép chuỗi/quy đổi số nguyên" như generateSoThapPhanSoSanh() ở Đợt 1), không cộng/trừ trực tiếp
// trên kiểu Number thập phân.
// Phép trừ: LUÔN đảm bảo số bị trừ >= số trừ (Lớp 5 chưa học số thập phân âm) - nếu random ra
// ngược thì tự hoán đổi 2 toán hạng (đỡ lãng phí vòng lặp so với loại bỏ rồi random lại), né riêng
// trường hợp 2 số bằng nhau (kết quả 0, ít giá trị luyện tập cộng/trừ có nhớ).
function decimalToNormalized(intPart, decPart, width) {
  return Number(intPart) * 10 ** width + Number(decPart.padEnd(width, "0"));
}

function normalizedToDecimal(normalized, width) {
  const intPart = Math.floor(normalized / 10 ** width);
  const decPart = String(normalized % 10 ** width).padStart(width, "0");
  return { intPart, decPart };
}

export function generateSoThapPhanCongTru(count = 6) {
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 20) {
    guard++;
    const operator = Math.random() < 0.5 ? "+" : "-";
    let intA = randInt(0, 99);
    let intB = randInt(0, 99);
    const digitsA = Math.random() < 0.5 ? 1 : 2;
    // ~35% số cặp CỐ Ý lệch số chữ số thập phân - đúng trọng tâm bài học nêu trên (thấp hơn tỉ lệ
    // 40% của "so sánh" ở Đợt 1 vì cộng/trừ có nhớ vốn đã khó hơn so sánh, tránh dồn 2 độ khó cùng lúc).
    const digitsB = Math.random() < 0.35 ? (digitsA === 1 ? 2 : 1) : digitsA;
    let decA = randomDecimalPart(digitsA);
    let decB = randomDecimalPart(digitsB);
    const width = Math.max(decA.length, decB.length);
    let normA = decimalToNormalized(intA, decA, width);
    let normB = decimalToNormalized(intB, decB, width);
    if (operator === "-" && normA < normB) {
      [intA, intB] = [intB, intA];
      [decA, decB] = [decB, decA];
      [normA, normB] = [normB, normA];
    }
    if (operator === "-" && normA === normB) continue;
    const dedupeKey = `${operator}_${intA},${decA}_${intB},${decB}`;
    if (used.has(dedupeKey)) continue;
    used.add(dedupeKey);
    const resultNorm = operator === "+" ? normA + normB : normA - normB;
    const { intPart: answerInt, decPart: answerDec } = normalizedToDecimal(resultNorm, width);
    items.push({
      leftInt: intA,
      leftDec: decA,
      rightInt: intB,
      rightDec: decB,
      operator,
      answerInt,
      answerDec,
    });
  }
  return items;
}

// ================== MỞ RỘNG LỚP 5, ĐỢT 3 ==================
// "Nhân số thập phân" - dạng bài thứ 3 của mảng số thập phân (sau so sánh Đợt 1, cộng/trừ Đợt 2).
// Trộn 2 mức độ: NHÂN VỚI SỐ TỰ NHIÊN (~65%, mức cơ bản SGK dạy trước, thừa số tự nhiên nhỏ 2-9
// kiểu "bảng nhân" để tích không quá lớn khi tính tay) và NHÂN 2 SỐ THẬP PHÂN VỚI NHAU (~35%, mức
// nâng cao hơn - số chữ số thập phân của TÍCH = TỔNG số chữ số thập phân của 2 thừa số, đúng quy
// tắc SGK Toán 5 KNTT "đếm tổng số chữ số ở phần thập phân của 2 thừa số rồi đếm từ phải sang").
// TÁI DÙNG decimalToNormalized()/normalizedToDecimal() đã viết ở Đợt 2 nhưng cho MỤC ĐÍCH KHÁC:
// ở Đợt 2 dùng 1 width CHUNG để quy 2 số về cùng hàng trước khi cộng/trừ; ở đây mỗi thừa số dùng
// ĐÚNG width RIÊNG của nó (decA.length/decB.length, không ép chung) để lấy số nguyên biểu diễn
// chính xác thừa số đó, rồi NHÂN 2 số nguyên với nhau - width của KẾT QUẢ là TỔNG 2 width, đúng
// bản chất phép nhân thập phân. Vẫn quy hết về số nguyên trước khi tính nên tránh HOÀN TOÀN sai
// số dấu phẩy động JS.
// Số tự nhiên biểu diễn qua decDigits=0 (chuỗi rỗng "") - decimalToNormalized(intB, "", 0) cho ra
// đúng intB (Number("") === 0 trong JS) - formatSoThapPhan() cũng tự hiểu decimals=0 là số nguyên,
// không có dấu phẩy (xem numberFormatUtils.js).
export function generateSoThapPhanNhan(count = 6) {
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 20) {
    guard++;
    const isVsNaturalNumber = Math.random() < 0.65;
    const intA = randInt(0, 49);
    const digitsA = Math.random() < 0.6 ? 1 : 2;
    const decA = randomDecimalPart(digitsA);

    let intB, decB;
    if (isVsNaturalNumber) {
      intB = randInt(2, 9); // thừa số tự nhiên nhỏ (mức "bảng nhân") - tránh tích quá lớn khó tính tay
      decB = "";
    } else {
      intB = randInt(0, 20); // int phần thập phân thứ 2 nhỏ hơn để tích không quá lớn
      const digitsB = Math.random() < 0.7 ? 1 : 2;
      decB = randomDecimalPart(digitsB);
    }

    const normA = decimalToNormalized(intA, decA, decA.length);
    const normB = decimalToNormalized(intB, decB, decB.length);
    const width = decA.length + decB.length;
    const resultNorm = normA * normB;
    const { intPart: answerInt, decPart: answerDec } = normalizedToDecimal(resultNorm, width);

    const dedupeKey = `${intA},${decA}x${intB},${decB}`;
    if (used.has(dedupeKey)) continue;
    used.add(dedupeKey);
    items.push({
      leftInt: intA,
      leftDec: decA,
      rightInt: intB,
      rightDec: decB,
      operator: "×",
      answerInt,
      answerDec,
    });
  }
  return items;
}

// ================== MỞ RỘNG LỚP 5, ĐỢT 3 ==================
// "Chia số thập phân cho số tự nhiên" - PHIÊN BẢN "chia hết tuyệt đối" (không dư). SGK Toán 5
// KNTT còn có "chia số tự nhiên cho số tự nhiên ra thương thập phân" và "chia số thập phân cho số
// thập phân" - CHƯA làm ở đợt này, để dành đợt sau (xem NEXT_STEPS.md).
// Sinh NGƯỢC: chọn THƯƠNG (kết quả) "đẹp" trước rồi NHÂN LÊN ra SỐ BỊ CHIA - đảm bảo chia hết
// tuyệt đối 100%, không cần thử-sai hay có rủi ro làm tròn. Cùng nguyên tắc "sinh ngược từ đáp án"
// mà generateNhanChiaBang() (Lớp 3) đã dùng cho phép chia hết số tự nhiên trong bảng cửu chương.
export function generateSoThapPhanChia(count = 6) {
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 20) {
    guard++;
    const divisor = randInt(2, 9);
    const quotientInt = randInt(0, 49);
    const digits = Math.random() < 0.6 ? 1 : 2;
    const quotientDec = randomDecimalPart(digits);

    const quotientNorm = decimalToNormalized(quotientInt, quotientDec, quotientDec.length);
    const dividendNorm = quotientNorm * divisor;
    const { intPart: dividendInt, decPart: dividendDec } = normalizedToDecimal(dividendNorm, quotientDec.length);

    const dedupeKey = `${dividendInt},${dividendDec}:${divisor}`;
    if (used.has(dedupeKey)) continue;
    used.add(dedupeKey);
    items.push({
      leftInt: dividendInt,
      leftDec: dividendDec,
      rightInt: divisor,
      rightDec: "",
      operator: "÷",
      answerInt: quotientInt,
      answerDec: quotientDec,
    });
  }
  return items;
}

// ================== MỞ RỘNG LỚP 5, ĐỢT 4 ==================
// 7 chủ đề còn lại của Lớp 5 (xem NEXT_STEPS.md mục "Còn lại cho Lớp 5"): tỉ số phần trăm; hình
// tam giác/hình thang/hình tròn; thể tích + đơn vị đo thể tích; diện tích xung quanh/toàn phần;
// số đo thời gian; vận tốc-quãng đường-thời gian; chia có dư/chia thập phân cho thập phân nâng
// cao. Tách thành 10 dạng bài riêng biệt (đúng nguyên tắc isolation xuyên suốt dự án) thay vì gộp
// chung 1 dạng "hình học Lớp 5" mơ hồ - dễ bật/tắt riêng từng dạng cho giáo viên.
//
// Nhóm "văn bản có lời + 1 ô trống điền đáp số" (tỉ số phần trăm, tam giác/hình thang, hình tròn,
// thể tích, diện tích xq/tp, vận tốc) CHỦ Ý không tính sẵn "answer" hiển thị (giống
// ChuViDienTichSection của Lớp 3 - phiếu bài tập không có đáp án in kèm) nhưng VẪN trả về field
// answer/đủ dữ kiện để viết test xác nhận công thức đúng (test coverage as gate).

/**
 * "Tỉ số phần trăm" - 3 dạng con trộn ngẫu nhiên, đúng 3 dạng toán SGK Toán 5 KNTT dạy liên tiếp:
 * (1) tìm tỉ số % của 2 số, (2) tìm giá trị % của 1 số, (3) tìm 1 số biết giá trị % của nó.
 * Sinh NGƯỢC từ % "đẹp" (bội số của 5) để luôn ra số nguyên tuyệt đối, không cần làm tròn %.
 */
export function generateTiSoPhanTram(count = 6) {
  const PERCENTS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80];
  // CHỦ Ý chỉ dùng bội số của 20 (không phải bội số của 10/tuỳ ý) - đảm bảo b*p LUÔN chia hết 100
  // với MỌI p là bội số của 5 trong PERCENTS ở trên (b=20k -> b*p/100 = k*p/5, mà p luôn chia hết
  // 5 nên k*p/5 luôn nguyên). ĐÃ SỬA lỗi thực tế (test phát hiện): trước đây có lẫn vài giá trị
  // KHÔNG phải bội số của 20 (VD 50, 150) -> có tổ hợp (b=150, p=75) ra kết quả .5 không nguyên.
  const NICE_MULTIPLES_OF_20 = [20, 40, 60, 80, 100, 120, 160, 200, 240, 300];
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 30) {
    guard++;
    const subKind = pick(["ti_so", "gia_tri", "tim_so"]);
    if (subKind === "ti_so") {
      const b = pick(NICE_MULTIPLES_OF_20);
      const p = pick(PERCENTS);
      const a = (b * p) / 100;
      const dedupeKey = `ti_so_${a}_${b}`;
      if (used.has(dedupeKey)) continue;
      used.add(dedupeKey);
      items.push({ subKind, a, b, answer: p });
    } else if (subKind === "gia_tri") {
      const n = pick(NICE_MULTIPLES_OF_20);
      const p = pick(PERCENTS);
      const value = (n * p) / 100;
      const dedupeKey = `gia_tri_${p}_${n}`;
      if (used.has(dedupeKey)) continue;
      used.add(dedupeKey);
      items.push({ subKind, percent: p, n, answer: value });
    } else {
      const n = pick(NICE_MULTIPLES_OF_20);
      const p = pick(PERCENTS);
      const value = (n * p) / 100;
      const dedupeKey = `tim_so_${p}_${value}`;
      if (used.has(dedupeKey)) continue;
      used.add(dedupeKey);
      items.push({ subKind, percent: p, value, answer: n });
    }
  }
  return items;
}

/**
 * "Diện tích hình tam giác, hình thang" - trộn 3 dạng: diện tích tam giác (~45%), diện tích hình
 * thang (~45%), chu vi tam giác (~10%, chỉ để ôn - trọng tâm SGK Toán 5 KNTT vẫn là DIỆN TÍCH).
 * Chủ động chọn đáy/chiều cao sao cho tích LUÔN CHẴN (a*h hoặc (a+b)*h chia hết 2) - tránh diện
 * tích ra số thập phân (nội dung "diện tích tam giác/hình thang" ở SGK Toán 5 KNTT dùng số đo
 * nguyên, chưa trộn số thập phân ở dạng bài NÀY - số thập phân đã có 4 dạng bài riêng ở Đợt 1-3).
 */
export function generateHinhTamGiacHinhThang(count = 6) {
  const items = [];
  let guard = 0;
  while (items.length < count && guard < count * 30) {
    guard++;
    const roll = Math.random();
    if (roll < 0.45) {
      const a = randInt(4, 30);
      let h = randInt(4, 20);
      if ((a * h) % 2 !== 0) h += 1; // ép tích chẵn - đảm bảo diện tích luôn là số nguyên
      items.push({ subKind: "tam_giac_dien_tich", a, h, answer: (a * h) / 2 });
    } else if (roll < 0.9) {
      const b = randInt(4, 20); // đáy bé
      const a = b + randInt(2, 15); // đáy lớn > đáy bé
      let h = randInt(4, 20);
      if (((a + b) * h) % 2 !== 0) h += 1;
      items.push({ subKind: "hinh_thang_dien_tich", a, b, h, answer: ((a + b) * h) / 2 });
    } else {
      const s1 = randInt(5, 25);
      const s2 = randInt(5, 25);
      const s3 = randInt(5, 25);
      items.push({ subKind: "tam_giac_chu_vi", s1, s2, s3, answer: s1 + s2 + s3 });
    }
  }
  return items;
}

/**
 * Nhân 1 số nguyên với π ≈ 3,14 (quy tắc SGK Toán 5 KNTT), giữ nguyên bằng số nguyên (nhân với
 * 314 rồi chia 100) - tránh HOÀN TOÀN sai số dấu phẩy động JS, cùng nguyên tắc "quy đổi số nguyên"
 * đã dùng xuyên suốt các dạng bài số thập phân ở Đợt 1-3. Tự rút gọn số 0 vô nghĩa cuối phần thập
 * phân (VD 31,40 -> "31,4") giống cách sách giáo khoa thường trình bày đáp số.
 */
function piTimesToDecimal(intValue) {
  const cents = intValue * 314;
  const intPart = Math.floor(cents / 100);
  const rem = cents % 100;
  if (rem === 0) return { intPart, decPart: "" };
  if (rem % 10 === 0) return { intPart, decPart: String(rem / 10) };
  return { intPart, decPart: String(rem).padStart(2, "0") };
}

/**
 * "Chu vi, diện tích hình tròn" - cho SẴN bán kính (~55%) hoặc đường kính (~45%, luôn số CHẴN để
 * bán kính suy ra là số nguyên), hỏi chu vi hoặc diện tích. Dùng piTimesToDecimal() ở trên để tính
 * đúng đáp số (không hiển thị trong phiếu, chỉ phục vụ test) mà không sai số dấu phẩy động.
 */
export function generateHinhTron(count = 6) {
  const items = [];
  let guard = 0;
  while (items.length < count && guard < count * 30) {
    guard++;
    const given = Math.random() < 0.55 ? "ban_kinh" : "duong_kinh";
    const r = randInt(2, 20);
    const value = given === "ban_kinh" ? r : r * 2;
    const metric = Math.random() < 0.5 ? "chu_vi" : "dien_tich";
    const intVal = metric === "chu_vi" ? r * 2 : r * r;
    const { intPart, decPart } = piTimesToDecimal(intVal);
    items.push({ given, value, r, metric, answerInt: intPart, answerDec: decPart });
  }
  return items;
}

/**
 * "Thể tích hình hộp chữ nhật, hình lập phương" - trộn ~50/50, số đo nhỏ (3-15 cm) để tích không
 * quá lớn, đúng phạm vi luyện tập của SGK Toán 5 KNTT (V = dài × rộng × cao / cạnh³).
 */
export function generateTheTichHopLapPhuong(count = 6) {
  const items = [];
  let guard = 0;
  while (items.length < count && guard < count * 30) {
    guard++;
    if (Math.random() < 0.5) {
      const a = randInt(3, 15);
      const b = randInt(3, 15);
      const c = randInt(3, 15);
      items.push({ subKind: "hhcn", a, b, c, answer: a * b * c });
    } else {
      const a = randInt(3, 15);
      items.push({ subKind: "lap_phuong", a, answer: a * a * a });
    }
  }
  return items;
}

// "Đổi đơn vị đo thể tích" - CHỈ 2 cặp m³-dm³-cm³ (tỉ lệ 1000, đúng nội dung SGK Toán 5 KNTT
// "Bảng đơn vị đo thể tích"). Tách RIÊNG khỏi VOLUME_UNIT_PAIRS (Lớp 3, đơn vị "l/ml" - dung tích
// KHÁC thể tích) - đúng nguyên tắc isolation, không tái dùng generateDoiDonVi() của Lớp 3.
const VOLUME_UNIT_PAIRS_THE_TICH = [
  { big: "m³", small: "dm³", ratio: 1000 },
  { big: "dm³", small: "cm³", ratio: 1000 },
];

export function generateDoiDonViTheTich(count = 5) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const pair = pick(VOLUME_UNIT_PAIRS_THE_TICH);
    const bigToSmall = Math.random() < 0.5;
    if (bigToSmall) {
      const value = randInt(1, 20);
      items.push({ value, fromUnit: pair.big, toUnit: pair.small, answer: value * pair.ratio });
    } else {
      const multiplier = randInt(1, 20);
      items.push({ value: multiplier * pair.ratio, fromUnit: pair.small, toUnit: pair.big, answer: multiplier });
    }
  }
  return items;
}

/**
 * "Diện tích xung quanh, diện tích toàn phần" - trộn 3 hình (HHCN/lập phương/hình trụ), mỗi hình
 * random hỏi xq hoặc tp. Hình trụ dùng piTimesToDecimal() như "hình tròn" ở trên (Sxq = π×2×r×h,
 * Stp = Sxq + π×2×r²) - tính theo TỔNG số nguyên trước khi nhân π 1 LẦN DUY NHẤT để tránh cộng dồn
 * sai số làm tròn giữa 2 lần nhân π riêng lẻ.
 */
export function generateDienTichXqTp(count = 6) {
  const items = [];
  let guard = 0;
  while (items.length < count && guard < count * 30) {
    guard++;
    const shape = pick(["hhcn", "lap_phuong", "hinh_tru"]);
    const metric = Math.random() < 0.5 ? "xq" : "tp";
    if (shape === "hhcn") {
      const a = randInt(3, 15);
      const b = randInt(3, 15);
      const c = randInt(3, 15);
      const sxq = (a + b) * 2 * c;
      const answer = metric === "xq" ? sxq : sxq + 2 * a * b;
      items.push({ shape, a, b, c, metric, answer });
    } else if (shape === "lap_phuong") {
      const a = randInt(3, 15);
      const sxq = a * a * 4;
      const answer = metric === "xq" ? sxq : a * a * 6;
      items.push({ shape, a, metric, answer });
    } else {
      const r = randInt(2, 10);
      const h = randInt(3, 15);
      const xqIntVal = 2 * r * h; // Sxq = π × (2 × r × h)
      const tpIntVal = xqIntVal + 2 * r * r; // Stp = π × (2rh + 2r²) - nhân π 1 lần cho cả tổng
      const intVal = metric === "xq" ? xqIntVal : tpIntVal;
      const { intPart, decPart } = piTimesToDecimal(intVal);
      items.push({ shape, r, h, metric, answerInt: intPart, answerDec: decPart });
    }
  }
  return items;
}

/**
 * Gộp 2 số giờ/phút về tổng số phút, và ngược lại - dùng chung cho "cộng, trừ số đo thời gian".
 */
function timeToMinutes(h, m) {
  return h * 60 + m;
}
function minutesToTime(totalMinutes) {
  return { h: Math.floor(totalMinutes / 60), m: totalMinutes % 60 };
}

/**
 * "Cộng, trừ số đo thời gian" - giờ/phút (CHƯA làm giây - để dành đợt sau nếu cần). Phép trừ LUÔN
 * đảm bảo số bị trừ >= số trừ (tự hoán đổi nếu random ngược, cùng nguyên tắc đã dùng cho phép trừ
 * số thập phân ở Đợt 2) - Lớp 5 chưa học số đo thời gian âm.
 */
export function generateSoDoThoiGian(count = 6) {
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 20) {
    guard++;
    const operator = Math.random() < 0.5 ? "+" : "-";
    let leftH = randInt(0, 8);
    let leftM = randInt(0, 59);
    let rightH = randInt(0, 8);
    let rightM = randInt(0, 59);
    if (leftH === 0 && leftM === 0) leftM = randInt(1, 59);
    if (rightH === 0 && rightM === 0) rightM = randInt(1, 59);
    let leftTotal = timeToMinutes(leftH, leftM);
    let rightTotal = timeToMinutes(rightH, rightM);
    if (operator === "-" && leftTotal < rightTotal) {
      [leftH, rightH] = [rightH, leftH];
      [leftM, rightM] = [rightM, leftM];
      [leftTotal, rightTotal] = [rightTotal, leftTotal];
    }
    if (operator === "-" && leftTotal === rightTotal) continue;
    const dedupeKey = `${operator}_${leftH}:${leftM}_${rightH}:${rightM}`;
    if (used.has(dedupeKey)) continue;
    used.add(dedupeKey);
    const resultTotal = operator === "+" ? leftTotal + rightTotal : leftTotal - rightTotal;
    const { h: answerH, m: answerM } = minutesToTime(resultTotal);
    items.push({ leftH, leftM, rightH, rightM, operator, answerH, answerM });
  }
  return items;
}

/**
 * "Vận tốc, quãng đường, thời gian" - toán chuyển động đều v = s : t. Sinh NGƯỢC từ v (km/giờ,
 * "đẹp") và t (giờ, số nguyên nhỏ) rồi NHÂN ra s - đảm bảo s luôn chia hết cho v (khi hỏi ngược lại
 * t từ v và s), không bao giờ ra số thập phân (Lớp 5 học vận tốc/quãng đường/thời gian với số tự
 * nhiên trước, số thập phân/phân số để dành mức nâng cao hơn).
 */
export function generateVanTocQuangDuongThoiGian(count = 6) {
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 20) {
    guard++;
    const v = randInt(4, 60);
    const t = randInt(2, 6);
    const s = v * t;
    const ask = pick(["v", "s", "t"]);
    const dedupeKey = `${ask}_${v}_${s}_${t}`;
    if (used.has(dedupeKey)) continue;
    used.add(dedupeKey);
    items.push({ ask, v, s, t });
  }
  return items;
}

/**
 * "Phép chia có dư" - ôn tập nâng cao (số bị chia lớn hơn hẳn phạm vi "bảng chia" đã luyện ở Lớp
 * 3), CỐ Ý luôn có dư (loại bỏ trường hợp chia hết) - đúng trọng tâm "có dư" của dạng bài này.
 */
export function generatePhepChiaCoDu(count = 6) {
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 20) {
    guard++;
    const divisor = randInt(2, 9);
    let dividend = randInt(100, 9999);
    if (dividend % divisor === 0) dividend += randInt(1, divisor - 1);
    const dedupeKey = `${dividend}:${divisor}`;
    if (used.has(dedupeKey)) continue;
    used.add(dedupeKey);
    items.push({
      dividend,
      divisor,
      answerQuotient: Math.floor(dividend / divisor),
      answerRemainder: dividend % divisor,
    });
  }
  return items;
}

/**
 * "Chia số thập phân (nâng cao)" - mảng còn thiếu của Đợt 3 (chỉ mới làm "chia số thập phân cho
 * số tự nhiên, chia hết"): trộn (1) chia số TỰ NHIÊN cho số TỰ NHIÊN ra THƯƠNG THẬP PHÂN (~40%) và
 * (2) chia số THẬP PHÂN cho số THẬP PHÂN (~60%, khó hơn). TÁI DÙNG decimalToNormalized()/
 * normalizedToDecimal() đã viết ở Đợt 2-3 - sinh NGƯỢC từ thương "đẹp" × số chia = số bị chia
 * (giống hệt nguyên tắc generateSoThapPhanNhan() ở Đợt 3, chỉ đổi vai trò hiển thị: phép NHÂN lúc
 * sinh trở thành phép CHIA lúc hiển thị đề bài) - đảm bảo chia hết tuyệt đối 100%, không có dư.
 */
export function generateSoThapPhanChiaNangCao(count = 6) {
  const items = [];
  const used = new Set();
  let guard = 0;
  while (items.length < count && guard < count * 20) {
    guard++;
    const isNaturalDivision = Math.random() < 0.4;
    if (isNaturalDivision) {
      const divisor = randInt(2, 9);
      const quotientInt = randInt(1, 49);
      const digits = Math.random() < 0.6 ? 1 : 2;
      const quotientDec = randomDecimalPart(digits);
      const quotientNorm = decimalToNormalized(quotientInt, quotientDec, quotientDec.length);
      const dividendNorm = quotientNorm * divisor;
      const dividend = dividendNorm / 10 ** quotientDec.length;
      if (!Number.isInteger(dividend)) continue; // an toàn - không nên xảy ra vì quotientNorm luôn nguyên
      const dedupeKey = `nat_${dividend}:${divisor}`;
      if (used.has(dedupeKey)) continue;
      used.add(dedupeKey);
      items.push({
        leftInt: dividend,
        leftDec: "",
        rightInt: divisor,
        rightDec: "",
        operator: "÷",
        answerInt: quotientInt,
        answerDec: quotientDec,
      });
    } else {
      const divisorInt = randInt(1, 20);
      const divisorDec = randomDecimalPart(1);
      if (divisorInt === 0 && divisorDec === "0") continue; // né số chia gần 0
      const quotientInt = randInt(0, 30);
      const quotientDigits = Math.random() < 0.6 ? 1 : 2;
      const quotientDec = randomDecimalPart(quotientDigits);

      const normDivisor = decimalToNormalized(divisorInt, divisorDec, divisorDec.length);
      const normQuotient = decimalToNormalized(quotientInt, quotientDec, quotientDec.length);
      const width = divisorDec.length + quotientDec.length;
      const dividendNorm = normDivisor * normQuotient;
      const { intPart: dividendInt, decPart: dividendDec } = normalizedToDecimal(dividendNorm, width);

      const dedupeKey = `dec_${dividendInt},${dividendDec}:${divisorInt},${divisorDec}`;
      if (used.has(dedupeKey)) continue;
      used.add(dedupeKey);
      items.push({
        leftInt: dividendInt,
        leftDec: dividendDec,
        rightInt: divisorInt,
        rightDec: divisorDec,
        operator: "÷",
        answerInt: quotientInt,
        answerDec: quotientDec,
      });
    }
  }
  return items;
}

