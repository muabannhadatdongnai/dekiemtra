import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generateTiSoPhanTram,
  generateHinhTamGiacHinhThang,
  generateHinhTron,
  generateTheTichHopLapPhuong,
  generateDoiDonViTheTich,
  generateDienTichXqTp,
  generateSoDoThoiGian,
  generateVanTocQuangDuongThoiGian,
  generatePhepChiaCoDu,
  generateSoThapPhanChiaNangCao,
  EXERCISE_TYPES,
} from "../src/data/worksheetSchemas.js";
import { getSelectableCatalogFor } from "../src/data/worksheetExerciseCatalog.js";

/**
 * worksheetLop5Dot4.test.js
 * MỞ RỘNG LỚP 5, ĐỢT 4 - 10 dạng bài còn lại: tỉ số phần trăm; hình tam giác/hình thang/hình
 * tròn; thể tích + đơn vị đo thể tích; diện tích xung quanh/toàn phần; số đo thời gian; vận
 * tốc-quãng đường-thời gian; chia có dư/chia thập phân nâng cao.
 * Đáp án được kiểm chứng ĐỘC LẬP bằng công thức toán học thông thường (không gọi lại logic quy
 * đổi số nguyên bên trong generator), giống cách các file test Lớp 5 Đợt 1-3 đã làm.
 */

const NEW_KEYS = [
  "ti_so_phan_tram",
  "hinh_tam_giac_hinh_thang",
  "hinh_tron",
  "the_tich_hhcn_lp",
  "doi_don_vi_the_tich",
  "dien_tich_xq_tp",
  "so_do_thoi_gian",
  "van_toc_quang_duong_thoi_gian",
  "phep_chia_co_du",
  "so_thap_phan_chia_nang_cao",
];

test("EXERCISE_TYPES chứa đủ 10 dạng bài mới của Đợt 4", () => {
  assert.equal(EXERCISE_TYPES.TI_SO_PHAN_TRAM, "ti_so_phan_tram");
  assert.equal(EXERCISE_TYPES.HINH_TAM_GIAC_HINH_THANG, "hinh_tam_giac_hinh_thang");
  assert.equal(EXERCISE_TYPES.HINH_TRON, "hinh_tron");
  assert.equal(EXERCISE_TYPES.THE_TICH_HHCN_LP, "the_tich_hhcn_lp");
  assert.equal(EXERCISE_TYPES.DOI_DON_VI_THE_TICH, "doi_don_vi_the_tich");
  assert.equal(EXERCISE_TYPES.DIEN_TICH_XQ_TP, "dien_tich_xq_tp");
  assert.equal(EXERCISE_TYPES.SO_DO_THOI_GIAN, "so_do_thoi_gian");
  assert.equal(EXERCISE_TYPES.VAN_TOC_QUANG_DUONG_THOI_GIAN, "van_toc_quang_duong_thoi_gian");
  assert.equal(EXERCISE_TYPES.PHEP_CHIA_CO_DU, "phep_chia_co_du");
  assert.equal(EXERCISE_TYPES.SO_THAP_PHAN_CHIA_NANG_CAO, "so_thap_phan_chia_nang_cao");
});

test("cả 10 dạng bài mới chỉ xuất hiện trong catalog Lớp 5, không lộ ra Lớp 1-4", () => {
  for (const grade of ["MAM_NON", "LOP_1", "LOP_2", "LOP_3", "LOP_4"]) {
    const catalog = getSelectableCatalogFor(grade, "TOAN");
    for (const key of NEW_KEYS) {
      assert.ok(!catalog.some((item) => item.key === key), `"${key}" lộ ra ở khối ${grade}`);
    }
  }
  const lop5Catalog = getSelectableCatalogFor("LOP_5", "TOAN");
  for (const key of NEW_KEYS) {
    assert.ok(lop5Catalog.some((item) => item.key === key), `"${key}" không xuất hiện ở Lớp 5`);
  }
});

// ===== Tỉ số phần trăm =====
test("generateTiSoPhanTram: cả 3 dạng con đều tính đúng công thức, luôn ra số nguyên", () => {
  for (let i = 0; i < 100; i++) {
    const items = generateTiSoPhanTram(9);
    for (const it of items) {
      if (it.subKind === "ti_so") {
        assert.ok(Number.isInteger(it.a) && Number.isInteger(it.b));
        assert.equal(it.answer, (it.a * 100) / it.b, `sai tỉ số %: ${JSON.stringify(it)}`);
      } else if (it.subKind === "gia_tri") {
        assert.equal(it.answer, (it.n * it.percent) / 100, `sai giá trị %: ${JSON.stringify(it)}`);
        assert.ok(Number.isInteger(it.answer));
      } else {
        assert.equal(it.subKind, "tim_so");
        assert.equal(it.value, (it.answer * it.percent) / 100, `sai "tìm số": ${JSON.stringify(it)}`);
        assert.ok(Number.isInteger(it.answer));
      }
    }
  }
});

// [QUY TẮC SƯ PHẠM TOÁN LỚP 5 BẮT BUỘC - ĐA DẠNG HÓA TỈ SỐ PHẦN TRĂM] không được lặp lại cùng 1 tỉ
// lệ % ở 2 câu liên tiếp (xem pickPercent() trong worksheetSchemas.js).
test("generateTiSoPhanTram: không có 2 câu liên tiếp cùng lặp 1 tỉ lệ phần trăm", () => {
  const getPercent = (it) => (it.subKind === "ti_so" ? it.answer : it.percent);
  for (let i = 0; i < 100; i++) {
    const items = generateTiSoPhanTram(9);
    for (let j = 1; j < items.length; j++) {
      assert.notEqual(
        getPercent(items[j]),
        getPercent(items[j - 1]),
        `2 câu liên tiếp cùng lặp tỉ lệ %: ${JSON.stringify(items[j - 1])} / ${JSON.stringify(items[j])}`
      );
    }
  }
});

test("generateTiSoPhanTram: xuất hiện cả 3 dạng con trong nhiều lần sinh", () => {
  const items = [];
  for (let i = 0; i < 30; i++) items.push(...generateTiSoPhanTram(9));
  for (const subKind of ["ti_so", "gia_tri", "tim_so"]) {
    assert.ok(items.some((it) => it.subKind === subKind), `không thấy dạng con "${subKind}"`);
  }
});

// ===== Hình tam giác / hình thang =====
test("generateHinhTamGiacHinhThang: diện tích/chu vi luôn đúng công thức và là số nguyên", () => {
  for (let i = 0; i < 100; i++) {
    const items = generateHinhTamGiacHinhThang(6);
    for (const it of items) {
      if (it.subKind === "tam_giac_dien_tich") {
        assert.equal(it.answer, (it.a * it.h) / 2);
        assert.ok(Number.isInteger(it.answer), `diện tích tam giác không nguyên: ${JSON.stringify(it)}`);
      } else if (it.subKind === "hinh_thang_dien_tich") {
        assert.equal(it.answer, ((it.a + it.b) * it.h) / 2);
        assert.ok(Number.isInteger(it.answer), `diện tích hình thang không nguyên: ${JSON.stringify(it)}`);
        assert.ok(it.a > it.b, "đáy lớn phải lớn hơn đáy bé");
      } else {
        assert.equal(it.subKind, "tam_giac_chu_vi");
        assert.equal(it.answer, it.s1 + it.s2 + it.s3);
      }
    }
  }
});

// ===== Hình tròn =====
test("generateHinhTron: chu vi/diện tích tính đúng bằng π=3,14 quy đổi số nguyên", () => {
  for (let i = 0; i < 100; i++) {
    const items = generateHinhTron(6);
    for (const it of items) {
      const r = it.given === "ban_kinh" ? it.value : it.value / 2;
      assert.equal(r, it.r, `bán kính suy ra sai: ${JSON.stringify(it)}`);
      const intVal = it.metric === "chu_vi" ? r * 2 : r * r;
      const expectedCents = intVal * 314;
      const actualCents = it.answerInt * 100 + Number((it.answerDec || "0").padEnd(2, "0"));
      assert.equal(actualCents, expectedCents, `sai kết quả nhân π: ${JSON.stringify(it)}`);
      if (it.given === "duong_kinh") assert.equal(it.value % 2, 0, "đường kính phải là số chẵn");
    }
  }
});

// ===== Thể tích HHCN / lập phương =====
test("generateTheTichHopLapPhuong: thể tích tính đúng công thức", () => {
  for (let i = 0; i < 100; i++) {
    const items = generateTheTichHopLapPhuong(6);
    for (const it of items) {
      if (it.subKind === "hhcn") {
        assert.equal(it.answer, it.a * it.b * it.c);
      } else {
        assert.equal(it.subKind, "lap_phuong");
        assert.equal(it.answer, it.a ** 3);
      }
    }
  }
});

// ===== Đổi đơn vị đo thể tích =====
test("generateDoiDonViTheTich: quy đổi luôn đúng tỉ lệ 1000, chia hết tuyệt đối", () => {
  for (let i = 0; i < 100; i++) {
    const items = generateDoiDonViTheTich(6);
    for (const it of items) {
      // Không giả định unit nào là "lớn" (m³/dm³/cm³ đều có thể là 1 trong 2 vai trò tuỳ cặp) -
      // chỉ kiểm tra quan hệ tỉ lệ 1000 đúng chiều nào đó giữa value và answer.
      const forwardMatches = it.answer === it.value * 1000;
      const backwardMatches = it.value === it.answer * 1000;
      assert.ok(forwardMatches || backwardMatches, `sai tỉ lệ 1000: ${JSON.stringify(it)}`);
    }
  }
});

// ===== Diện tích xung quanh / toàn phần =====
// [QUY TẮC SƯ PHẠM TOÁN LỚP 5 BẮT BUỘC - GIỚI HẠN HÌNH HỌC KHÔNG GIAN] CHỈ 2 hình HHCN/lập
// phương - CẤM TUYỆT ĐỐI hình trụ/hình cầu (không thuộc chương trình Toán 5, xem worksheetSchemas.js).
test("generateDienTichXqTp: đúng công thức cho cả 2 hình (HHCN/lập phương), KHÔNG BAO GIỜ sinh hình trụ", () => {
  for (let i = 0; i < 100; i++) {
    const items = generateDienTichXqTp(9);
    for (const it of items) {
      assert.ok(["hhcn", "lap_phuong"].includes(it.shape), `dạng bài lộ hình bị cấm (VD hình trụ): ${JSON.stringify(it)}`);
      if (it.shape === "hhcn") {
        const sxq = (it.a + it.b) * 2 * it.c;
        const expected = it.metric === "xq" ? sxq : sxq + 2 * it.a * it.b;
        assert.equal(it.answer, expected, `sai HHCN: ${JSON.stringify(it)}`);
      } else {
        const expected = it.metric === "xq" ? it.a * it.a * 4 : it.a * it.a * 6;
        assert.equal(it.answer, expected, `sai lập phương: ${JSON.stringify(it)}`);
      }
    }
  }
});

// ===== Số đo thời gian =====
test("generateSoDoThoiGian: cộng/trừ giờ-phút đúng, phép trừ không bao giờ âm", () => {
  for (let i = 0; i < 200; i++) {
    const items = generateSoDoThoiGian(6);
    for (const it of items) {
      const leftTotal = it.leftH * 60 + it.leftM;
      const rightTotal = it.rightH * 60 + it.rightM;
      const answerTotal = it.answerH * 60 + it.answerM;
      if (it.operator === "+") {
        assert.equal(answerTotal, leftTotal + rightTotal, `sai cộng thời gian: ${JSON.stringify(it)}`);
      } else {
        assert.ok(leftTotal >= rightTotal, `số bị trừ nhỏ hơn số trừ: ${JSON.stringify(it)}`);
        assert.equal(answerTotal, leftTotal - rightTotal, `sai trừ thời gian: ${JSON.stringify(it)}`);
      }
      assert.ok(it.answerM >= 0 && it.answerM < 60, `phút đáp án ngoài phạm vi: ${JSON.stringify(it)}`);
    }
  }
});

// ===== Vận tốc - quãng đường - thời gian =====
test("generateVanTocQuangDuongThoiGian: v × t = s luôn đúng, thời gian luôn là số nguyên", () => {
  for (let i = 0; i < 200; i++) {
    const items = generateVanTocQuangDuongThoiGian(6);
    for (const it of items) {
      assert.equal(it.s, it.v * it.t, `sai công thức s=v×t: ${JSON.stringify(it)}`);
      assert.ok(["v", "s", "t"].includes(it.ask));
      assert.ok(Number.isInteger(it.t) && it.t > 0);
    }
  }
});

// ===== Phép chia có dư =====
test("generatePhepChiaCoDu: luôn có số dư > 0 (không chia hết), thương/dư tính đúng", () => {
  for (let i = 0; i < 200; i++) {
    const items = generatePhepChiaCoDu(6);
    for (const it of items) {
      assert.equal(it.answerQuotient, Math.floor(it.dividend / it.divisor));
      assert.equal(it.answerRemainder, it.dividend % it.divisor);
      assert.ok(it.answerRemainder > 0, `phép chia không có dư: ${JSON.stringify(it)}`);
      assert.ok(it.answerRemainder < it.divisor, `số dư >= số chia: ${JSON.stringify(it)}`);
    }
  }
});

// ===== Chia số thập phân nâng cao =====
function toNum(intPart, decPart) {
  return Number(`${intPart}.${decPart || "0"}`);
}
function roundTo(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

test("generateSoThapPhanChiaNangCao: đáp án luôn khớp khi tự tính lại độc lập, chia hết tuyệt đối", () => {
  for (let i = 0; i < 300; i++) {
    const items = generateSoThapPhanChiaNangCao(8);
    for (const it of items) {
      assert.equal(it.operator, "÷");
      const dividend = toNum(it.leftInt, it.leftDec);
      const divisor = toNum(it.rightInt, it.rightDec);
      const expectedQuotient = roundTo(dividend / divisor, it.answerDec.length);
      const actualQuotient = toNum(it.answerInt, it.answerDec);
      assert.equal(actualQuotient, expectedQuotient, `sai đáp án chia nâng cao: ${JSON.stringify(it)}`);
    }
  }
});

test("generateSoThapPhanChiaNangCao: có cả 2 dạng con (chia ra thương thập phân + chia thập phân cho thập phân)", () => {
  const items = [];
  for (let i = 0; i < 30; i++) items.push(...generateSoThapPhanChiaNangCao(10));
  assert.ok(
    items.some((it) => it.leftDec === "" && it.rightDec === ""),
    "không thấy trường hợp số tự nhiên chia số tự nhiên ra thương thập phân"
  );
  assert.ok(
    items.some((it) => it.leftDec !== "" && it.rightDec !== ""),
    "không thấy trường hợp chia số thập phân cho số thập phân"
  );
});

test("mọi generator Đợt 4 trả đúng số lượng items theo count yêu cầu", () => {
  assert.equal(generateTiSoPhanTram(7).length, 7);
  assert.equal(generateHinhTamGiacHinhThang(4).length, 4);
  assert.equal(generateHinhTron(5).length, 5);
  assert.equal(generateTheTichHopLapPhuong(4).length, 4);
  assert.equal(generateDoiDonViTheTich(6).length, 6);
  assert.equal(generateDienTichXqTp(5).length, 5);
  assert.equal(generateSoDoThoiGian(6).length, 6);
  assert.equal(generateVanTocQuangDuongThoiGian(5).length, 5);
  assert.equal(generatePhepChiaCoDu(6).length, 6);
  assert.equal(generateSoThapPhanChiaNangCao(6).length, 6);
});
