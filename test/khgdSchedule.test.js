import { test } from "node:test";
import assert from "node:assert/strict";
import {
  KHGD_SEMESTER_WEEKS,
  semesterCapacity,
  semesterStartTiet,
  semesterFirstWeek,
  weekOfTiet,
  weekLabel,
  tietListLabel,
  spreadEvenly,
  parseTietPerWeek,
  planSemester,
  planYear,
  formatScheduleSummary,
  recomputeTuanTiet,
} from "@/services/khgdSchedule";
import {
  buildTieuHocSchedulePolicy,
  getTieuHocKiemTraTiet,
  getTieuHocDefaultTietPerWeek,
} from "@/services/khgdTieuHocSchedulePolicy";
import {
  buildKhgdSchedulePolicy,
  getKhgdDefaultTietPerWeek,
  getKhgdKiemTraMinutes,
  kiemTraTietFromMinutes,
  parseKiemTraName,
  applyScheduleToKiemTra,
} from "@/services/khgdSchedulePolicy";
import { classifyReviewTitle, extractUnnumberedReviewHeadings, applySgkReviewToRows } from "@/services/khgdSgkReview";
import { buildKhgdTieuHocOutline } from "@/services/khgdTieuHocOutlineService";
import { buildKhgdOutline } from "@/services/khgdOutlineService";
import { Packer } from "docx";
import JSZip from "jszip";
import { buildKhgdTieuHocDocument } from "@/services/khgdTieuHocExportService";
import { buildKhgdDocument } from "@/services/khgdExportService";
import { assertValidParagraphNesting } from "./wordSchemaAssertions.js";

/**
 * khgdSchedule.test.js  (Phiên 50)
 * Xếp lịch Khung KHGD: quỹ tiết học kì (HK I 18 tuần + HK II 17 tuần), chia số tiết cho bài chưa chốt,
 * chèn Ôn tập/Kiểm tra định kì giữa kì (~Tuần 9/27) + cuối kì, phần ôn tập lấy ĐÚNG từ Markdown SGK khi có.
 */

let idCounter = 0;
const makeId = () => `t-${++idCounter}`;

/** Tiếng Việt Lớp 2 kiểu Tập 1: Bài lẻ 4 tiết + Bài chẵn 6 tiết (mỗi tuần 10 tiết) - mỗi tiết 1 dòng, đã chốt. */
function tiengVietRows(nBai = 32) {
  const rows = [];
  for (let b = 1; b <= nBai; b++) {
    const tiet = b % 2 === 1 ? 4 : 6;
    for (let k = 1; k <= tiet; k++) rows.push({ id: `b${b}-${k}`, tenBai: `Bài ${b} - Tiết ${k}`, soTiet: 1, tietChot: true, blockKey: `b${b}`, soBai: b, hocKi: 1 });
  }
  return rows;
}

function unlockedRows(n, prefix = "Bài") {
  return Array.from({ length: n }, (_, i) => ({ id: `u${i + 1}`, tenBai: `${prefix} ${i + 1}`, soTiet: "", blockKey: `bai${i + 1}`, soBai: i + 1, hocKi: 1 }));
}

const sum = (rows) => rows.reduce((s, r) => s + Number(r.soTiet), 0);

// ---------------------------------------------------------------------------------------------
// Khung thời gian
// ---------------------------------------------------------------------------------------------

test("Khung năm học: HK I 18 tuần + HK II 17 tuần = 35 tuần; HK II bắt đầu Tuần 19", () => {
  assert.equal(KHGD_SEMESTER_WEEKS[1] + KHGD_SEMESTER_WEEKS[2], 35);
  assert.equal(semesterFirstWeek(1), 1);
  assert.equal(semesterFirstWeek(2), 19);
  assert.equal(semesterCapacity(10, 1), 180);
  assert.equal(semesterCapacity(10, 2), 170);
  assert.equal(semesterCapacity(4, 1), 72);
  assert.equal(semesterCapacity("1,5", 1), 27); // môn 1,5 tiết/tuần
  assert.equal(semesterCapacity("", 1), 0);
  assert.equal(semesterStartTiet(10, 2), 180); // HK II bắt đầu từ tiết 181
  assert.equal(weekOfTiet(181, 10), 19);
  assert.equal(weekOfTiet(180, 10), 18);
  assert.equal(weekLabel(9, 9), "Tuần 9");
  assert.equal(weekLabel(17, 18), "Tuần 17-18");
  assert.equal(tietListLabel(26, 27), "26,27");
  assert.equal(tietListLabel(33, 33), "33");
  assert.equal(tietListLabel(10, 13), "10-13");
  assert.equal(parseTietPerWeek("abc"), null);
  assert.equal(parseTietPerWeek(0), null);
});

test("spreadEvenly: tổng đúng, dàn đều, mỗi phần ≥ floor", () => {
  const a = spreadEvenly(62, 8);
  assert.equal(a.reduce((s, x) => s + x, 0), 62);
  assert.ok(a.every((x) => x === 7 || x === 8));
  assert.deepEqual(spreadEvenly(5, 5), [1, 1, 1, 1, 1]);
  assert.deepEqual(spreadEvenly(0, 3), [0, 0, 0]);
});

// ---------------------------------------------------------------------------------------------
// Tiểu học - Tiếng Việt Lớp 2 (mọi tiết đã chốt): quỹ còn lại = ôn tập
// ---------------------------------------------------------------------------------------------

test("Tiếng Việt Lớp 2 HK I: 160 tiết bài mới + ôn tập/kiểm tra lấp đủ quỹ 180 tiết, giữa kì ~Tuần 9, cuối kì Tuần 17-18", () => {
  const policy = buildTieuHocSchedulePolicy({ subject: "Tieng_Viet", grade: 2 });
  const { rows, summary, warnings } = planSemester({ rows: tiengVietRows(), hocKi: 1, tietPerWeek: 10, policy, makeId });

  assert.deepEqual(warnings, []);
  assert.equal(summary.capacity, 180);
  assert.equal(summary.lessonTiet, 160);
  assert.equal(summary.onTapTiet + summary.kiemTraTiet, 20);
  assert.equal(summary.totalTiet, 180);
  assert.equal(summary.leftover, 0);
  assert.equal(summary.lastWeek, 18);

  const onTap = rows.filter((r) => r.loai === "onTap");
  const kt = rows.filter((r) => r.loai === "kiemTra");
  assert.equal(onTap.length, 2);
  assert.equal(kt.length, 1, "Lớp 2 chỉ có bài kiểm tra cuối kì (Thông tư 27 Điều 7.1b) - không có giữa kì");
  assert.equal(kt[0].tenBai, "Kiểm tra định kì cuối học kì I");
  assert.equal(onTap[0].tenBai, "Ôn tập và đánh giá giữa học kì I", "Lớp 2 giữa kì không có bài kiểm tra viết → 'Ôn tập và đánh giá' (Thông tư 27 vẫn đánh giá định kì giữa kì)");
  assert.equal(onTap[1].tenBai, "Ôn tập cuối học kì I");
  assert.equal(onTap[0].tuan, "Tuần 9", "khối ôn tập giữa kì đứng đúng Tuần 9 (sau 8 tuần = 80 tiết = Bài 16)");
  assert.equal(onTap[1].tuan, "Tuần 17-18");
  assert.equal(kt[0].tuan, "Tuần 18");
  assert.ok(rows.every((r) => r.deXuat === true || r.tietChot === true), "tiết bài học không bị chia lại");

  // Không tách 1 Bài: dòng liền trước khối giữa kì là tiết cuối của 1 Bài, dòng liền sau là tiết 1 của Bài kế
  const iMid = rows.indexOf(onTap[0]);
  assert.equal(rows[iMid - 1].tenBai, "Bài 16 - Tiết 6");
  assert.equal(rows[iMid + 1].tenBai, "Bài 17 - Tiết 1");

  // Tiết PPCT liên tục 1..180, không trùng/không hở
  let expected = 1;
  for (const r of rows) {
    const t = Number(r.soTiet);
    const label = String(r.tietPPCT);
    const [a, b] = label.includes("-") ? label.split("-").map(Number) : [Number(label), Number(label)];
    assert.equal(a, expected, `${r.tenBai}: tiết bắt đầu`);
    assert.equal(b, expected + t - 1);
    expected += t;
  }
  assert.equal(expected - 1, 180);
});

test("Khi SGK CÓ 'Ôn tập và đánh giá cuối học kì' (Markdown): dùng dòng SGK, không đề xuất thêm ôn tập/kiểm tra cuối kì", () => {
  const policy = buildTieuHocSchedulePolicy({ subject: "Tieng_Viet", grade: 2 });
  const input = [
    ...tiengVietRows(),
    { id: "sgk-cuoi", tenBai: "Ôn tập và đánh giá cuối học kì 1", soTiet: 1, loai: "onTap", nguon: "sgk", moc: "cuoi", coKiemTra: true, blockKey: "sgk-cuoi", hocKi: 1 },
  ];
  const { rows, summary } = planSemester({ rows: input, hocKi: 1, tietPerWeek: 10, policy, makeId });

  const sgk = rows.find((r) => r.id === "sgk-cuoi");
  assert.equal(sgk.nguon, "sgk");
  assert.equal(sgk.soTiet, 10, "SGK chưa ghi tiết → nhận phần quỹ còn lại chia cho ôn tập");
  assert.equal(rows.filter((r) => r.loai === "kiemTra").length, 0, "SGK đã gồm phần đánh giá → không thêm dòng kiểm tra riêng");
  const proposals = rows.filter((r) => r.deXuat);
  assert.equal(proposals.length, 1, "chỉ còn đề xuất ôn tập giữa kì (SGK không có)");
  assert.equal(proposals[0].soTiet, 10);
  assert.equal(proposals[0].tuan, "Tuần 9");
  assert.equal(summary.totalTiet, 180);
  assert.equal(sgk.tuan, "Tuần 18");
});

test("Khi SGK CÓ CẢ giữa kì lẫn cuối kì: không đề xuất dòng nào, chỉ chia lại số tiết theo quỹ", () => {
  const policy = buildTieuHocSchedulePolicy({ subject: "Dao_Duc", grade: 2 });
  const rows0 = [
    ...unlockedRows(8, "Bài").slice(0, 4),
    { id: "sgk-giua", tenBai: "Ôn tập giữa học kì 1", loai: "onTap", nguon: "sgk", moc: "giua", blockKey: "sgk-giua", hocKi: 1, soTiet: 1 },
    ...unlockedRows(8, "Bài").slice(4),
    { id: "sgk-cuoi", tenBai: "Ôn tập cuối học kì 1", loai: "onTap", nguon: "sgk", moc: "cuoi", blockKey: "sgk-cuoi", hocKi: 1, soTiet: 1 },
  ];
  const { rows } = planSemester({ rows: rows0, hocKi: 1, tietPerWeek: 1, policy, makeId });
  assert.equal(rows.filter((r) => r.deXuat).length, 0);
  assert.equal(rows.length, rows0.length);
  assert.equal(sum(rows), 18, "Đạo đức 1 tiết/tuần × 18 tuần");
});

// ---------------------------------------------------------------------------------------------
// THCS/THPT - bài chưa chốt tiết: chia theo quỹ; kiểm tra 60 phút = 2 tiết
// ---------------------------------------------------------------------------------------------

test("THCS Toán (4 tiết/tuần) HK I: chia đủ quỹ 72 tiết, kiểm tra 60 phút = 2 tiết, giữa kì ~Tuần 9", () => {
  const policy = buildKhgdSchedulePolicy({ subject: "Toan", tietPerWeek: 4, minutes: 60 });
  const { rows, summary, warnings } = planSemester({ rows: unlockedRows(20), hocKi: 1, tietPerWeek: 4, policy, makeId });

  assert.deepEqual(warnings, []);
  assert.equal(summary.capacity, 72);
  assert.equal(summary.totalTiet, 72);
  assert.equal(summary.leftover, 0);
  assert.equal(summary.kiemTraTiet, 4, "2 bài kiểm tra × 2 tiết");
  assert.equal(summary.onTapTiet, 6, "giữa kì ½ tuần = 2 tiết + cuối kì 1 tuần = 4 tiết");
  assert.equal(summary.lessonTiet, 62);

  const lessons = rows.filter((r) => !r.loai || r.loai === "baiHoc");
  assert.equal(lessons.length, 20);
  assert.ok(lessons.every((r) => r.soTiet === 3 || r.soTiet === 4), "chia đều 3-4 tiết/bài (62 tiết / 20 bài)");

  const names = rows.map((r) => r.tenBai);
  assert.deepEqual(names.slice(names.indexOf("Ôn tập giữa Học kỳ 1"), names.indexOf("Ôn tập giữa Học kỳ 1") + 2), ["Ôn tập giữa Học kỳ 1", "Kiểm tra giữa Học kỳ 1"]);
  assert.equal(names[names.length - 1], "Kiểm tra cuối Học kỳ 1");

  const giua = summary.milestones.giua;
  assert.equal(giua.tuan, "Tuần 9");
  assert.match(giua.tiet, /^3\d,3\d$/, "2 tiết kiểm tra giữa kì nằm quanh tiết 32-36");
  assert.deepEqual(giua.coverage, { from: "Bài 1", to: "Bài 10" });
  const cuoi = summary.milestones.cuoi;
  assert.deepEqual(cuoi.coverage, { from: "Bài 11", to: "Bài 20" });
  assert.equal(cuoi.tuan, "Tuần 18");
});

test("THCS môn ≤ 70 tiết/năm (1 tiết/tuần): kiểm tra 45 phút = 1 tiết, không dư thừa ôn tập giữa kì", () => {
  assert.equal(getKhgdKiemTraMinutes(1, "Giao_Duc_Cong_Dan"), 45);
  assert.equal(getKhgdKiemTraMinutes(2, "Cong_Nghe"), 45, "70 tiết/năm vẫn là 45 phút (quy định: từ 70 tiết trở xuống)");
  assert.equal(getKhgdKiemTraMinutes(3, "Tieng_Anh"), 60);
  assert.equal(getKhgdKiemTraMinutes(4, "Toan"), 60);
  assert.equal(kiemTraTietFromMinutes(45), 1);
  assert.equal(kiemTraTietFromMinutes(60), 2);
  assert.equal(kiemTraTietFromMinutes(90), 2);

  const policy = buildKhgdSchedulePolicy({ subject: "Giao_Duc_Cong_Dan", tietPerWeek: 1, minutes: 45 });
  const { rows, summary } = planSemester({ rows: unlockedRows(6), hocKi: 1, tietPerWeek: 1, policy, makeId });
  assert.equal(summary.capacity, 18);
  assert.equal(summary.totalTiet, 18);
  assert.equal(rows.filter((r) => r.loai === "kiemTra").every((r) => r.soTiet === 1), true);
  assert.equal(rows.filter((r) => r.tenBai === "Ôn tập giữa Học kỳ 1").length, 0, "1 tiết/tuần: ½ tuần làm tròn xuống = 0 → bỏ qua");
  assert.ok(rows.some((r) => r.tenBai === "Ôn tập cuối Học kỳ 1"));
});

test("Môn đánh giá bằng nhận xét (GDTC...): dòng 'Đánh giá', không phải 'Kiểm tra' viết", () => {
  const policy = buildKhgdSchedulePolicy({ subject: "Giao_Duc_The_Chat", tietPerWeek: 2, minutes: 45 });
  const { rows } = planSemester({ rows: unlockedRows(6), hocKi: 1, tietPerWeek: 2, policy, makeId });
  assert.ok(rows.some((r) => r.tenBai === "Đánh giá giữa Học kỳ 1"));
  assert.ok(!rows.some((r) => r.tenBai.startsWith("Kiểm tra")));
});

test("Tiếng Anh (mọi dòng đã chốt 1 tiết): quỹ 54 tiết (3 tiết/tuần) = 42 tiết bài + phần còn lại cho ôn tập/kiểm tra", () => {
  const policy = buildKhgdSchedulePolicy({ subject: "Tieng_Anh", tietPerWeek: 3, minutes: 60 });
  const rows0 = [];
  for (let u = 1; u <= 6; u++) for (let l = 1; l <= 7; l++) rows0.push({ id: `u${u}l${l}`, tenBai: `Unit ${u} - ${l}`, soTiet: 1, tietChot: true, blockKey: `c${u}:unit`, hocKi: 1 });
  const { rows, summary } = planSemester({ rows: rows0, hocKi: 1, tietPerWeek: 3, policy, makeId });
  assert.equal(summary.capacity, 54);
  assert.equal(summary.lessonTiet, 42);
  assert.equal(summary.totalTiet, 54);
  assert.equal(summary.kiemTraTiet, 4);
  assert.equal(summary.onTapTiet, 8);
  // giữa kì chèn giữa 2 Unit (không cắt ngang 1 Unit)
  const iMid = rows.findIndex((r) => r.loai === "onTap" && r.moc === "giua");
  assert.notEqual(rows[iMid - 1].blockKey, rows[iMid + 2].blockKey);
});

// ---------------------------------------------------------------------------------------------
// Tính chất chung
// ---------------------------------------------------------------------------------------------

test("Chạy lại nhiều lần cho CÙNG kết quả (dòng đề xuất cũ được thay, không nhân đôi)", () => {
  const policy = buildKhgdSchedulePolicy({ subject: "Toan", tietPerWeek: 4, minutes: 60 });
  const first = planSemester({ rows: unlockedRows(8), hocKi: 1, tietPerWeek: 4, policy, makeId });
  const second = planSemester({ rows: first.rows, hocKi: 1, tietPerWeek: 4, policy, makeId });
  const strip = (rs) => rs.map(({ id, ...rest }) => rest);
  assert.deepEqual(strip(second.rows), strip(first.rows));
  assert.equal(second.rows.filter((r) => r.deXuat).length, 4);
});

test("Giáo viên tự sửa số tiết một dòng → dòng đó được GIỮ NGUYÊN, phần còn lại tính lại", () => {
  const policy = buildKhgdSchedulePolicy({ subject: "Toan", tietPerWeek: 4, minutes: 60 });
  const rows0 = unlockedRows(8);
  rows0[0] = { ...rows0[0], soTiet: 12, soTietSuaTay: true };
  const { rows, summary } = planSemester({ rows: rows0, hocKi: 1, tietPerWeek: 4, policy, makeId });
  assert.equal(rows.find((r) => r.id === "u1").soTiet, 12);
  assert.equal(summary.totalTiet, 72, "tổng vẫn đúng quỹ tiết");
});

test("Dòng ôn tập đề xuất mà giáo viên đã sửa số tiết được giữ, không sinh dòng đề xuất trùng mốc đó", () => {
  const policy = buildKhgdSchedulePolicy({ subject: "Toan", tietPerWeek: 4, minutes: 60 });
  const first = planSemester({ rows: unlockedRows(8), hocKi: 1, tietPerWeek: 4, policy, makeId });
  const edited = first.rows.map((r) => (r.loai === "onTap" && r.moc === "cuoi" ? { ...r, soTiet: 6, soTietSuaTay: true } : r));
  const second = planSemester({ rows: edited, hocKi: 1, tietPerWeek: 4, policy, makeId });
  const cuoiOnTap = second.rows.filter((r) => r.loai === "onTap" && r.moc === "cuoi");
  assert.equal(cuoiOnTap.length, 1);
  assert.equal(cuoiOnTap[0].soTiet, 6);
  assert.equal(second.summary.totalTiet, 72);
});

test("Học kì II: Tuần bắt đầu từ 19, Tiết PPCT nối tiếp học kì I, giữa kì ~Tuần 27, kết thúc ≤ Tuần 35", () => {
  const policy = buildKhgdSchedulePolicy({ subject: "Toan", tietPerWeek: 4, minutes: 60 });
  const rows0 = unlockedRows(20).map((r) => ({ ...r, hocKi: 2 }));
  const { rows, summary } = planSemester({ rows: rows0, hocKi: 2, tietPerWeek: 4, policy, makeId });
  assert.equal(summary.capacity, 68);
  assert.equal(rows[0].tuan.startsWith("Tuần 19"), true);
  assert.equal(String(rows[0].tietPPCT).startsWith("73"), true, "HK II bắt đầu từ tiết 73 = 18 tuần × 4 tiết + 1");
  assert.match(summary.milestones.giua.tuan, /^Tuần (26-27|27)$/, "giữa kì HK II ≈ Tuần 27");
  assert.equal(summary.lastWeek, 35);
  assert.equal(summary.totalTiet, 68);
});

test("planYear: nhóm theo hocKi, HK I trước HK II, tổng hợp cảnh báo", () => {
  const policyFor = () => buildKhgdSchedulePolicy({ subject: "Toan", tietPerWeek: 4, minutes: 60 });
  const rows0 = [...unlockedRows(4).map((r) => ({ ...r, id: `b-${r.id}`, hocKi: 2 })), ...unlockedRows(4)];
  const { rows, summaries } = planYear({ rows: rows0, tietPerWeek: 4, policyFor, makeId });
  assert.deepEqual(Object.keys(summaries), ["1", "2"]);
  const firstHk2 = rows.findIndex((r) => r.hocKi === 2);
  assert.ok(rows.slice(0, firstHk2).every((r) => r.hocKi === 1));
  assert.match(formatScheduleSummary(summaries[1]), /^Học kì I: quỹ 72 tiết \(18 tuần × 4\)/);
  assert.match(formatScheduleSummary(summaries[2]), /^Học kì II: quỹ 68 tiết \(17 tuần × 4\)/);
});

test("Cảnh báo: thiếu số tiết/tuần, bài đã chốt vượt quỹ, chưa nạp đủ chương (tiết/bài phình to)", () => {
  const policy = buildKhgdSchedulePolicy({ subject: "Toan", tietPerWeek: 4, minutes: 60 });
  const none = planSemester({ rows: unlockedRows(3), hocKi: 1, tietPerWeek: "", policy, makeId });
  assert.equal(none.summary, null);
  assert.match(none.warnings[0], /số tiết\/tuần/);
  assert.equal(none.rows.length, 3);

  const tooMany = tiengVietRows(40); // 200 tiết > 180
  const over = planSemester({ rows: tooMany, hocKi: 1, tietPerWeek: 10, policy: buildTieuHocSchedulePolicy({ subject: "Tieng_Viet", grade: 2 }), makeId });
  assert.ok(over.warnings.some((w) => /vượt quỹ/.test(w)));

  const few = planSemester({ rows: unlockedRows(2), hocKi: 1, tietPerWeek: 4, policy, makeId });
  assert.ok(few.warnings.some((w) => /CHƯA nạp đủ các chương/.test(w)));
});

// ---------------------------------------------------------------------------------------------
// Chính sách Tiểu học (Thông tư 27/2020 Điều 7)
// ---------------------------------------------------------------------------------------------

test("Tiểu học: bài kiểm tra định kì theo Thông tư 27 - cuối HK I/cuối năm; Lớp 4-5 thêm giữa kì Tiếng Việt + Toán", () => {
  assert.deepEqual(getTieuHocKiemTraTiet("Tieng_Viet", 1), { giua: 0, cuoi: 1 });
  assert.deepEqual(getTieuHocKiemTraTiet("Toan", 3), { giua: 0, cuoi: 1 });
  assert.deepEqual(getTieuHocKiemTraTiet("Tieng_Viet", 4), { giua: 1, cuoi: 1 });
  assert.deepEqual(getTieuHocKiemTraTiet("Toan", 5), { giua: 1, cuoi: 1 });
  assert.deepEqual(getTieuHocKiemTraTiet("Khoa_Hoc", 4), { giua: 0, cuoi: 1 }, "giữa kì Lớp 4-5 chỉ Tiếng Việt + Toán");
  assert.deepEqual(getTieuHocKiemTraTiet("Lich_Su_Dia_Li", 5), { giua: 0, cuoi: 1 });
  assert.deepEqual(getTieuHocKiemTraTiet("Tin_Hoc", 3), { giua: 0, cuoi: 1 });
  assert.deepEqual(getTieuHocKiemTraTiet("Cong_Nghe", 4), { giua: 0, cuoi: 1 });
  assert.deepEqual(getTieuHocKiemTraTiet("Tieng_Anh", 3), { giua: 0, cuoi: 1 });
  assert.deepEqual(getTieuHocKiemTraTiet("Tieng_Anh", 2), { giua: 0, cuoi: 0 }, "Ngoại ngữ 1 tự chọn ở Lớp 1-2 → không bắt buộc");
  for (const s of ["Dao_Duc", "Tu_Nhien_Xa_Hoi"]) {
    assert.deepEqual(getTieuHocKiemTraTiet(s, 2), { giua: 0, cuoi: 0 }, `${s} không có bài kiểm tra định kì`);
  }
});

test("Tiểu học: nhãn dòng theo mốc HK I / HK II (cuối năm học) và môn không có bài kiểm tra → 'Ôn tập và đánh giá'", () => {
  const p = buildTieuHocSchedulePolicy({ subject: "Toan", grade: 4 });
  assert.equal(p.labels.onTap("giua", 1, false), "Ôn tập giữa học kì I");
  assert.equal(p.labels.kiemTra("cuoi", 1), "Kiểm tra định kì cuối học kì I");
  assert.equal(p.labels.kiemTra("giua", 2), "Kiểm tra định kì giữa học kì II");
  assert.equal(p.labels.kiemTra("cuoi", 2), "Kiểm tra định kì cuối năm học");
  assert.equal(p.labels.onTap("cuoi", 2, true), "Ôn tập và đánh giá cuối năm học");

  // Đạo đức Lớp 2 (1 tiết/tuần): không có dòng "Kiểm tra", chỉ ôn tập cuối kì (½ tuần giữa kì làm tròn = 0)
  const dd = planSemester({ rows: unlockedRows(8), hocKi: 1, tietPerWeek: 1, policy: buildTieuHocSchedulePolicy({ subject: "Dao_Duc", grade: 2 }), makeId });
  assert.equal(dd.rows.filter((r) => r.loai === "kiemTra").length, 0);
  assert.equal(dd.summary.totalTiet, 18);
});

test("Số tiết/tuần gợi ý CHỈ điền khi có căn cứ; môn/khối khác để trống (không còn mặc định cứng 10)", () => {
  assert.equal(getTieuHocDefaultTietPerWeek("Tieng_Viet", 2), 10);
  assert.equal(getTieuHocDefaultTietPerWeek("Tieng_Viet", 3), 7);
  assert.equal(getTieuHocDefaultTietPerWeek("Dao_Duc", 2), null);
  assert.equal(getKhgdDefaultTietPerWeek("Toan", 7), 4);
  assert.equal(getKhgdDefaultTietPerWeek("Toan", 10), 3);
  assert.equal(getKhgdDefaultTietPerWeek("Tieng_Anh", 7), 3);
  assert.equal(getKhgdDefaultTietPerWeek("Am_Nhac", 7), null);
});

// ---------------------------------------------------------------------------------------------
// Nhận diện phần ôn tập trong Markdown SGK
// ---------------------------------------------------------------------------------------------

test("classifyReviewTitle: nhận đúng mốc học kì, bỏ qua 'ôn tập' thường và 'bài tập cuối chương'", () => {
  assert.deepEqual(classifyReviewTitle("ÔN TẬP VÀ ĐÁNH GIÁ CUỐI HỌC KÌ 1"), { moc: "cuoi", hocKi: 1, coKiemTra: true });
  assert.deepEqual(classifyReviewTitle("Ôn tập giữa học kì 2"), { moc: "giua", hocKi: 2, coKiemTra: false });
  assert.deepEqual(classifyReviewTitle("Ôn tập học kì I"), { moc: "cuoi", hocKi: 1, coKiemTra: false });
  assert.deepEqual(classifyReviewTitle("Ôn tập cuối năm học"), { moc: "cuoi", hocKi: 2, coKiemTra: false });
  assert.equal(classifyReviewTitle("Ôn tập phép cộng, phép trừ trong phạm vi 100"), null);
  assert.equal(classifyReviewTitle("Ôn tập chương I"), null);
  assert.equal(classifyReviewTitle("Bài tập cuối chương II"), null);
  assert.equal(classifyReviewTitle("Bài tập cuối học kì 1"), null);
  assert.equal(classifyReviewTitle("Luyện tập chung"), null);
});

const MD_TV_WITH_REVIEW = `# CHỦ ĐỀ 4: CÔ GIÁO LỚP EM (TUẦN 15 - TUẦN 18)

## TUẦN 17
### BÀI 33: NGÀY MỚI

#### I. HOẠT ĐỘNG ĐỌC
Nội dung đọc.

#### II. HOẠT ĐỘNG VIẾT
Viết chữ hoa **Q**.

## TUẦN 18: ÔN TẬP VÀ ĐÁNH GIÁ CUỐI HỌC KÌ 1 (10 tiết)
Ôn bài đọc, chính tả, từ và câu.
`;

test("Tiếng Việt: tiêu đề 'ÔN TẬP VÀ ĐÁNH GIÁ CUỐI HỌC KÌ 1' trong Markdown → dòng loai:onTap nguon:sgk, tiết đã chốt, đặt sau Bài cuối", () => {
  const h = extractUnnumberedReviewHeadings(MD_TV_WITH_REVIEW);
  assert.equal(h.length, 1);
  assert.equal(h[0].title, "ÔN TẬP VÀ ĐÁNH GIÁ CUỐI HỌC KÌ 1");
  assert.equal(h[0].tiet, 10);
  assert.equal(h[0].afterSoBai, 33);

  const out = buildKhgdTieuHocOutline({ subject: "Tieng_Viet", markdown: MD_TV_WITH_REVIEW });
  const sgk = out.rows.filter((r) => r.nguon === "sgk");
  assert.equal(sgk.length, 1);
  assert.equal(sgk[0].tenBai, "Ôn tập và đánh giá cuối học kì 1");
  assert.equal(sgk[0].soTiet, 10);
  assert.equal(sgk[0].tietChot, true);
  assert.equal(sgk[0].moc, "cuoi");
  assert.equal(sgk[0].coKiemTra, true);
  assert.equal(out.rows[out.rows.length - 1], sgk[0], "đặt SAU dòng cuối của Bài 33");
  assert.ok(out.rows.slice(0, -1).every((r) => r.blockKey === "b33" && r.tietChot === true));
});

test("Bài đánh số (VD 'Bài 17: Ôn tập giữa học kì 1') được phân loại lại thành dòng ôn tập SGK", () => {
  const md = `# CHƯƠNG 1: SỐ TỰ NHIÊN\n\n## Bài 16: Phép nhân\n\n## Bài 17: Ôn tập giữa học kì 1\n\n## Bài 18: Phép chia\n`;
  const out = buildKhgdTieuHocOutline({ subject: "Toan", markdown: md });
  assert.deepEqual(out.rows.map((r) => [r.tenBai, r.loai || "baiHoc"]), [
    ["Bài 16: Phép nhân", "baiHoc"],
    ["Bài 17: Ôn tập giữa học kì 1", "onTap"],
    ["Bài 18: Phép chia", "baiHoc"],
  ]);
  assert.equal(out.rows[1].moc, "giua");
  assert.equal(out.rows[0].tietChot, false, "Markdown không ghi số tiết → chưa chốt, sẽ chia theo quỹ tiết");
});

test("Markdown KHÔNG có phần ôn tập học kì → không tạo dòng SGK (Toán 7 thật: giữ nguyên số dòng)", () => {
  const md = `# CHƯƠNG I: SỐ HỮU TỈ\n\n## Bài 1: Tập hợp các số hữu tỉ\n\n## Bài 2: Cộng, trừ, nhân, chia số hữu tỉ\n\n## TỔNG HỢP CÁC DẠNG BÀI TẬP\n`;
  const out = buildKhgdOutline({ subject: "Toan", markdown: md });
  assert.equal(out.rows.length, 2);
  assert.ok(out.rows.every((r) => !r.nguon));
  assert.deepEqual(out.rows.map((r) => r.blockKey), ["bai1", "bai2"]);
});

test("THCS/THPT: dòng Tiếng Anh từ Markdown đã chốt 1 tiết & cùng khối 'unit'", () => {
  const md = `# Tiếng Anh 7 Global Success - Unit 1: Hobbies (Sở thích)\n\n### 1. GETTING STARTED (Trang 8)\nNội dung.\n\n### 2. A CLOSER LOOK 1 (Trang 10)\nNội dung.\n`;
  const out = buildKhgdOutline({ subject: "Tieng_Anh", markdown: md });
  assert.equal(out.rows.length, 2);
  assert.ok(out.rows.every((r) => r.soTiet === 1 && r.tietChot === true && r.blockKey === "unit"));
});

test("applySgkReviewToRows: heading ôn tập giữa kì ở GIỮA chương chèn đúng sau Bài đứng trước nó", () => {
  const rows = [
    { tenBai: "Bài 1: A", soBai: 1, blockKey: "bai1" },
    { tenBai: "Bài 2: B", soBai: 2, blockKey: "bai2" },
    { tenBai: "Bài 3: C", soBai: 3, blockKey: "bai3" },
  ];
  const md = `## Bài 1: A\n## Bài 2: B\n## ÔN TẬP GIỮA HỌC KÌ I\n## Bài 3: C\n`;
  const out = applySgkReviewToRows(rows, md);
  assert.deepEqual(out.map((r) => r.tenBai), ["Bài 1: A", "Bài 2: B", "ÔN TẬP GIỮA HỌC KÌ I", "Bài 3: C"]);
  assert.equal(out[2].loai, "onTap");
  assert.equal(out[2].moc, "giua");
});

// ---------------------------------------------------------------------------------------------
// Bảng "Kiểm tra, đánh giá định kỳ" (THCS/THPT) tự điền từ kết quả xếp lịch
// ---------------------------------------------------------------------------------------------

const DEFAULT_KT = [
  { ten: "Giữa Học kỳ 1", thoiGian: "60 phút", thoiDiem: "", yeuCauCanDat: "", hinhThuc: "Viết (giấy)" },
  { ten: "Cuối Học kỳ 1", thoiGian: "60 phút", thoiDiem: "", yeuCauCanDat: "", hinhThuc: "Viết (giấy)" },
  { ten: "Giữa Học kỳ 2", thoiGian: "60 phút", thoiDiem: "", yeuCauCanDat: "", hinhThuc: "Viết (giấy)" },
  { ten: "Cuối Học kỳ 2", thoiGian: "60 phút", thoiDiem: "", yeuCauCanDat: "", hinhThuc: "Viết (giấy)" },
];

test("parseKiemTraName: nhận 4 mốc mặc định của form", () => {
  assert.deepEqual(parseKiemTraName("Giữa Học kỳ 1"), { moc: "giua", hocKi: 1 });
  assert.deepEqual(parseKiemTraName("Cuối Học kỳ 2"), { moc: "cuoi", hocKi: 2 });
  assert.equal(parseKiemTraName("Kiểm tra 15 phút"), null);
});

test("applyScheduleToKiemTra: điền Thời điểm/Thời gian/Yêu cầu cần đạt; giữ nguyên ô giáo viên đã tự gõ; mốc học kì chưa xếp lịch không đổi", () => {
  const policy = buildKhgdSchedulePolicy({ subject: "Toan", tietPerWeek: 4, minutes: 45 });
  const { summary } = planSemester({ rows: unlockedRows(8), hocKi: 1, tietPerWeek: 4, policy, makeId });
  const kt0 = DEFAULT_KT.map((k, i) => (i === 1 ? { ...k, yeuCauCanDat: "Do tổ chuyên môn thống nhất" } : k));

  const out = applyScheduleToKiemTra(kt0, { 1: summary }, { minutes: 45 });
  assert.equal(out[0].thoiGian, "45 phút");
  assert.match(out[0].thoiDiem, /^Tuần \d+, Tiết \d+/);
  assert.match(out[0].yeuCauCanDat, /^Từ Bài 1 đến hết Bài \d+$/);
  assert.equal(out[1].yeuCauCanDat, "Do tổ chuyên môn thống nhất", "ô giáo viên đã gõ được giữ");
  assert.equal(out[1].thoiDiem, `${summary.milestones.cuoi.tuan}, Tiết ${summary.milestones.cuoi.tiet}`);
  assert.deepEqual([out[2], out[3]], [kt0[2], kt0[3]], "HK II chưa xếp lịch → không đổi");

  // Tính lại lần 2 (đổi số phút): ô do máy tự điền lần trước được cập nhật, ô giáo viên gõ vẫn giữ
  const policy2 = buildKhgdSchedulePolicy({ subject: "Toan", tietPerWeek: 4, minutes: 90 });
  const { summary: s2 } = planSemester({ rows: unlockedRows(8), hocKi: 1, tietPerWeek: 4, policy: policy2, makeId });
  const again = applyScheduleToKiemTra(out, { 1: s2 }, { minutes: 90 });
  assert.equal(again[0].thoiGian, "90 phút");
  assert.equal(again[1].yeuCauCanDat, "Do tổ chuyên môn thống nhất");
});

test("recomputeTuanTiet: đánh lại Tuần/Tiết riêng từng học kì; chưa có số tiết/tuần → giữ nguyên, không đoán", () => {
  const rows = [
    { id: "a", soTiet: 1, hocKi: 1, tuan: "", tietPPCT: "" },
    { id: "b", soTiet: 3, hocKi: 1, tuan: "", tietPPCT: "" },
    { id: "c", soTiet: 1, hocKi: 2, tuan: "", tietPPCT: "" },
  ];
  const out = recomputeTuanTiet(rows, 4);
  assert.deepEqual(out.map((r) => [r.tuan, r.tietPPCT]), [
    ["Tuần 1", 1],
    ["Tuần 1", "2-4"],
    ["Tuần 19", 73], // Tập 2 = HK II: bắt đầu Tuần 19, tiết 73 (trước Phiên 50 cũng bắt đầu từ Tuần 1)
  ]);
  assert.equal(recomputeTuanTiet(rows, ""), rows);
  assert.equal(recomputeTuanTiet(rows, "abc"), rows);
  // 1 tiết/dòng, 10 tiết/tuần: đúng hành vi cũ ceil(tiết/10)
  const tv = Array.from({ length: 25 }, (_, i) => ({ id: `t${i}`, soTiet: 1 }));
  assert.deepEqual(recomputeTuanTiet(tv, 10).map((r) => r.tuan).filter((x, i, a) => a.indexOf(x) === i), ["Tuần 1", "Tuần 2", "Tuần 3"]);
});

// ---------------------------------------------------------------------------------------------
// Đầu-cuối: Markdown → dòng bảng → xếp lịch → file Word THẬT (soi XML)
// ---------------------------------------------------------------------------------------------

async function docXml(doc) {
  const buf = await Packer.toBuffer(doc);
  const zip = await JSZip.loadAsync(buf);
  return zip.file("word/document.xml").async("string");
}

test("Đầu-cuối Tiểu học: Toán Lớp 4 (Markdown → xếp lịch) xuất Word hợp lệ, có Ôn tập + Kiểm tra giữa/cuối kì", async () => {
  const md = Array.from({ length: 24 }, (_, i) => `## Bài ${i + 1}: Nội dung bài ${i + 1}`).join("\n\n");
  const out = buildKhgdTieuHocOutline({ subject: "Toan", markdown: `# CHƯƠNG 1: SỐ TỰ NHIÊN\n\n${md}\n` });
  assert.equal(out.rows.length, 24);

  const rows0 = out.rows.map((r, i) => ({ id: `r${i}`, chuDe: "Số tự nhiên", hocKi: 1, blockKey: `c1:${r.blockKey}`, ...r }));
  const { rows, summaries, warnings } = planYear({
    rows: rows0,
    tietPerWeek: 5,
    policyFor: () => buildTieuHocSchedulePolicy({ subject: "Toan", grade: 4 }),
    makeId,
  });
  assert.deepEqual(warnings, []);
  assert.equal(summaries[1].capacity, 90);
  assert.equal(summaries[1].totalTiet, 90);
  assert.deepEqual(rows.filter((r) => r.loai === "kiemTra").map((r) => r.tenBai), ["Kiểm tra định kì giữa học kì I", "Kiểm tra định kì cuối học kì I"]);

  const xml = await docXml(buildKhgdTieuHocDocument({ lessons: rows, meta: { subject: "Toan", grade: 4, namHoc: "2026-2027" } }));
  assertValidParagraphNesting(xml, "khgd-tieu-hoc (xếp lịch)");
  assert.ok(xml.includes("Kiểm tra định kì giữa học kì I"));
  assert.ok(xml.includes("Ôn tập cuối học kì I"));
});

test("Đầu-cuối THCS: Toán Lớp 7 (Markdown → xếp lịch → bảng Kiểm tra định kỳ) xuất Word hợp lệ", async () => {
  const md = Array.from({ length: 16 }, (_, i) => `## BÀI ${i + 1}: NỘI DUNG ${i + 1}\n\nNội dung.`).join("\n\n");
  const out = buildKhgdOutline({ subject: "Toan", markdown: `# CHƯƠNG I: SỐ HỮU TỈ\n\n${md}\n` });
  assert.equal(out.rows.length, 16);

  const rows0 = out.rows.map((r, i) => ({ id: `r${i}`, hocKi: 1, thietBi: "SGK", diaDiem: "Phòng học", ...r }));
  const policy = buildKhgdSchedulePolicy({ subject: "Toan", tietPerWeek: 4, minutes: 60 });
  const { rows, summaries } = planYear({ rows: rows0, tietPerWeek: 4, policyFor: () => policy, makeId });
  const kt = applyScheduleToKiemTra(DEFAULT_KT, summaries, { minutes: 60 });
  assert.match(kt[0].thoiDiem, /^Tuần \d+, Tiết \d+,\d+$/);

  const xml = await docXml(
    buildKhgdDocument({
      lessons: rows.map((r) => ({ ...r, swd: [], nls: "" })),
      kiemTraDinhKy: kt,
      meta: { subject: "Toan", grade: 7, namHoc: "2026-2027", enableSwd: true, enableNls: true },
    })
  );
  assertValidParagraphNesting(xml, "khgd (xếp lịch)");
  assert.ok(xml.includes("Kiểm tra giữa Học kỳ 1"));
  assert.ok(xml.includes("Ôn tập cuối Học kỳ 1"));
  assert.ok(xml.includes(kt[1].thoiDiem));
});
