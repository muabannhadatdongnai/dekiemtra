/**
 * khgdSchedule.js  (Phiên 50)
 * Lõi TÍNH TOÁN THUẦN (không import React/docx/AI) cho việc "xếp lịch" bảng Khung KHGD của CẢ 2 tab
 * (Tiểu học - Phụ lục 2 CV2345 và THCS/THPT - Phụ lục III CV5512):
 *   (1) Khung thời gian năm học: 35 tuần thực học, HỌC KÌ I = 18 tuần (Tuần 1-18), HỌC KÌ II = 17 tuần
 *       (Tuần 19-35) - Khung kế hoạch thời gian năm học của Bộ GD&ĐT (áp dụng từ 2026-2027, trước đó
 *       Quyết định 2269/QĐ-BGDĐT cho 2025-2026 cũng quy định y hệt).
 *   (2) QUỸ TIẾT của 1 học kì = số tiết/tuần × số tuần.
 *   (3) Chia số tiết cho các bài học CHƯA có số tiết (Markdown SGK KHÔNG ghi số tiết mỗi bài - đó là dữ
 *       liệu của PPCT/Sách giáo viên) bằng cách chia đều phần quỹ tiết còn lại (sau khi trừ ôn tập/kiểm tra).
 *   (4) Chèn các dòng "Ôn tập"/"Kiểm tra định kì" giữa kì (khoảng Tuần 9 / Tuần 27) và cuối kì (cuối HK).
 *   (5) Đánh lại Tuần + Tiết PPCT (chạy suốt năm) cho MỌI dòng.
 *
 * ⚠️ NGUYÊN TẮC "KHÔNG TỰ BỊA" (Hoan chốt sau Phiên 49b):
 *   - Chính sách riêng từng cấp (bài nào có kiểm tra viết, kiểm tra mấy tiết, ôn tập mấy tiết) KHÔNG nằm
 *     ở đây mà được TRUYỀN VÀO qua `policy` - xem khgdTieuHocSchedulePolicy.js (Thông tư 27/2020) và
 *     khgdSchedulePolicy.js (Thông tư 22/2021). File này chỉ làm số học.
 *   - Dòng ôn tập/đánh giá có trong Markdown SGK (loai:"onTap", nguon:"sgk" - xem khgdSgkReview.js) được
 *     GIỮ NGUYÊN và ưu tiên; hệ thống CHỈ đề xuất thêm khi SGK không có (dòng `deXuat: true`, giáo viên sửa/xoá được).
 *   - Đề xuất tính từ QUỸ TIẾT (không phải con số bịa): nếu mọi bài đã có số tiết chốt (VD Tiếng Việt Lớp 2,
 *     Tiếng Anh) thì phần quỹ còn lại chính là thời lượng ôn tập/dự phòng.
 *
 * Kiểu dòng (mọi field ngoài danh sách này được GIỮ NGUYÊN, không đụng tới):
 *   loai: "baiHoc" (mặc định) | "onTap" | "kiemTra";  soTiet; tietChot (số tiết đã chốt từ nguồn, không chia lại);
 *   soTietSuaTay (giáo viên đã tự sửa số tiết → coi như chốt); blockKey (các dòng cùng khoá KHÔNG bị tách khi
 *   chèn ôn tập/kiểm tra, VD mọi tiết của 1 Bài); hocKi (1|2); nguon:"sgk" (dòng ôn tập lấy từ Markdown);
 *   moc: "giua"|"cuoi"; coKiemTra (dòng SGK ôn tập ĐÃ gồm đánh giá/kiểm tra); deXuat (dòng hệ thống đề xuất).
 */

export const KHGD_WEEKS_PER_YEAR = 35;
export const KHGD_SEMESTER_WEEKS = { 1: 18, 2: 17 };
/** Tuần giữa kì = tuần thứ 9 của học kì (thực tế PPCT: Tuần 9 / Tuần 27). */
export const KHGD_MID_WEEK_OFFSET = 8; // sau 8 tuần học → ôn tập/kiểm tra giữa kì ở tuần thứ 9

export function normalizeHocKi(v) {
  return Number(v) === 2 ? 2 : 1;
}

export function semesterFirstWeek(hocKi) {
  return normalizeHocKi(hocKi) === 1 ? 1 : KHGD_SEMESTER_WEEKS[1] + 1;
}

export function semesterLastWeek(hocKi) {
  return normalizeHocKi(hocKi) === 1 ? KHGD_SEMESTER_WEEKS[1] : KHGD_WEEKS_PER_YEAR;
}

/** "4" / "1.5" / "1,5" → số dương; còn lại → null. */
export function parseTietPerWeek(v) {
  if (v === null || v === undefined) return null;
  const n = Number(String(v).trim().replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Quỹ tiết của học kì = số tiết/tuần × số tuần (làm tròn - môn 1,5 tiết/tuần có thể lẻ nửa tiết). */
export function semesterCapacity(tietPerWeek, hocKi) {
  const tpw = parseTietPerWeek(tietPerWeek);
  if (!tpw) return 0;
  return Math.round(tpw * KHGD_SEMESTER_WEEKS[normalizeHocKi(hocKi)]);
}

/** Số tiết PPCT đã "trôi qua" trước khi học kì bắt đầu (HK II bắt đầu từ tiết 18×tiết/tuần + 1). */
export function semesterStartTiet(tietPerWeek, hocKi) {
  const tpw = parseTietPerWeek(tietPerWeek);
  if (!tpw) return 0;
  return Math.round(tpw * (semesterFirstWeek(hocKi) - 1));
}

/** Tuần (tuyệt đối, 1-35) của tiết PPCT thứ `tiet` (1-based). */
export function weekOfTiet(tiet, tietPerWeek) {
  const tpw = parseTietPerWeek(tietPerWeek) || 1;
  return Math.floor((Math.max(1, tiet) - 1) / tpw) + 1;
}

export function weekLabel(weekStart, weekEnd) {
  return weekEnd > weekStart ? `Tuần ${weekStart}-${weekEnd}` : `Tuần ${weekStart}`;
}

/** [33] → "33"; [33,34] → "33,34"; [33,34,35,36] → "33-36" (đúng cách viết PPCT: "Tuần 9, Tiết 26,27"). */
export function tietListLabel(start, end) {
  if (end <= start) return String(start);
  if (end - start === 1) return `${start},${end}`;
  return `${start}-${end}`;
}

/** Chia `total` thành `n` phần nguyên, tổng ĐÚNG bằng total, dàn đều (không dồn hết phần dư vào 1 chỗ). */
export function spreadEvenly(total, n) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(Math.round(((i + 1) * total) / n) - Math.round((i * total) / n));
  return out;
}

/** Chia `total` cho `n` phần, phần dư dồn cho các phần SAU (cuối kì thường dài hơn giữa kì). */
function splitLaterHeavier(total, n) {
  if (n <= 0) return [];
  const base = Math.floor(total / n);
  const extra = total - base * n;
  return Array.from({ length: n }, (_, i) => base + (i >= n - extra ? 1 : 0));
}

function numericTiet(r) {
  const n = Number(r?.soTiet);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

const isReviewRow = (r) => r?.loai === "onTap" || r?.loai === "kiemTra";
/** Số tiết đã CHỐT (nguồn xác định hoặc giáo viên sửa tay) và hợp lệ → không chia lại. */
const isLocked = (r) => (r?.tietChot === true || r?.soTietSuaTay === true) && numericTiet(r) !== null;

/**
 * Các vị trí có thể chèn khối ôn tập/kiểm tra: đầu/cuối danh sách hoặc ranh giới giữa 2 khối (blockKey) khác nhau.
 * Dòng không có blockKey coi như mỗi dòng 1 khối riêng.
 */
function boundaryIndexes(seq) {
  const out = [];
  for (let i = 0; i <= seq.length; i++) {
    if (i === 0 || i === seq.length) {
      out.push(i);
      continue;
    }
    const a = seq[i - 1].blockKey;
    const b = seq[i].blockKey;
    if (!a || !b || a !== b) out.push(i);
  }
  return out;
}

/** Chọn ranh giới khối gần nhất với `targetTiet` (số tiết đã dạy trước mốc) - hoà thì lấy mốc SAU. */
function pickMidBoundary(seq, tiets, targetTiet) {
  const candidates = boundaryIndexes(seq);
  const inner = candidates.filter((i) => i > 0 && i < seq.length);
  const pool = inner.length > 0 ? inner : candidates;
  let best = pool[0];
  let bestDiff = Infinity;
  for (const i of pool) {
    const cum = tiets.slice(0, i).reduce((s, x) => s + x, 0);
    const diff = Math.abs(cum - targetTiet);
    if (diff < bestDiff || (diff === bestDiff && i > best)) {
      best = i;
      bestDiff = diff;
    }
  }
  return best;
}

/**
 * Xếp lịch 1 HỌC KÌ.
 * @param {Object} args
 * @param {Array<Object>} args.rows - các dòng của học kì này, theo thứ tự bảng
 * @param {1|2} args.hocKi
 * @param {number|string} args.tietPerWeek
 * @param {Object} args.policy
 * @param {{giua:number, cuoi:number}} args.policy.kiemTraTiet - số tiết bài kiểm tra mỗi mốc (0 = không có bài kiểm tra riêng)
 * @param {(tietPerWeek:number, moc:"giua"|"cuoi") => number} args.policy.onTapDefault - số tiết ôn tập gợi ý theo quy tắc (dùng khi còn bài chưa có số tiết)
 * @param {{onTap:(moc:string,hocKi:number,coKiemTra:boolean)=>string, kiemTra:(moc:string,hocKi:number)=>string}} args.policy.labels
 * @param {(loai:string)=>Object} [args.policy.rowDefaults] - field bổ sung cho dòng đề xuất (VD thiết bị/địa điểm)
 * @param {()=>string} args.makeId
 */
export function planSemester({ rows, hocKi, tietPerWeek, policy, makeId }) {
  const hk = normalizeHocKi(hocKi);
  const tpw = parseTietPerWeek(tietPerWeek);
  const warnings = [];

  // 1) Bỏ các dòng ĐỀ XUẤT cũ (trừ dòng giáo viên đã tự sửa số tiết) → chạy lại nhiều lần cho cùng kết quả
  const base = (rows || []).filter((r) => !(r?.deXuat === true && r?.soTietSuaTay !== true)).map((r) => ({ ...r }));

  if (!tpw) {
    return { rows: base, summary: null, warnings: ["Chưa khai báo số tiết/tuần nên chưa thể tính quỹ tiết học kì."] };
  }

  const capacity = semesterCapacity(tpw, hk);
  const startTiet = semesterStartTiet(tpw, hk);
  const firstWeek = semesterFirstWeek(hk);
  const lastWeek = semesterLastWeek(hk);

  const lessons = base.filter((r) => !isReviewRow(r));
  const reviewRows = base.filter(isReviewRow);
  const onTapByMoc = { giua: reviewRows.filter((r) => r.loai === "onTap" && r.moc === "giua"), cuoi: reviewRows.filter((r) => r.loai === "onTap" && r.moc === "cuoi") };
  const ktByMoc = { giua: reviewRows.filter((r) => r.loai === "kiemTra" && r.moc === "giua"), cuoi: reviewRows.filter((r) => r.loai === "kiemTra" && r.moc === "cuoi") };

  // 2) Trạng thái từng mốc
  const mocs = ["giua", "cuoi"].map((moc) => {
    const onTapRows = onTapByMoc[moc];
    const coKiemTra = onTapRows.some((r) => r.coKiemTra) || ktByMoc[moc].length > 0;
    const ktTiet = coKiemTra ? 0 : Math.max(0, Math.round(policy.kiemTraTiet?.[moc] || 0));
    return { moc, onTapRows, needOnTapProposal: onTapRows.length === 0, ktTiet, needKt: ktTiet > 0 };
  });

  // 3) Ngân sách
  const unlockedLessons = lessons.filter((r) => !isLocked(r));
  const lockedLessonTiet = lessons.filter(isLocked).reduce((s, r) => s + numericTiet(r), 0);
  const fixedReviewTiet = reviewRows.filter(isLocked).reduce((s, r) => s + numericTiet(r), 0);
  const ktTotal = mocs.reduce((s, m) => s + m.ktTiet, 0);
  const ktExistingTiet = reviewRows.filter((r) => r.loai === "kiemTra" && !isLocked(r)).length; // dòng KT sẵn có chưa có số tiết → tối thiểu 1 tiết/dòng

  // Các phần ôn tập "linh hoạt" (chưa có số tiết): dòng SGK chưa chốt tiết + dòng đề xuất mới
  const flex = [];
  for (const m of mocs) {
    for (const r of m.onTapRows) if (!isLocked(r)) flex.push({ moc: m.moc, row: r });
    if (m.needOnTapProposal) flex.push({ moc: m.moc, row: null });
  }

  const minFlex = flex.map((f) => (f.row ? 1 : 0)); // dòng ôn tập lấy từ SGK luôn ≥ 1 tiết; dòng đề xuất có thể = 0 (bỏ qua)
  let remaining = capacity - lockedLessonTiet - fixedReviewTiet - ktTotal - ktExistingTiet;
  const nU = unlockedLessons.length;
  let flexSizes;
  let lessonBudget = 0;

  if (nU === 0) {
    // Mọi bài đã chốt tiết → phần quỹ CÒN LẠI chính là thời lượng ôn tập/dự phòng
    if (remaining < 0) {
      warnings.push(`Các bài đã chốt chiếm ${capacity - remaining} tiết, vượt quỹ ${capacity} tiết của học kì (${KHGD_SEMESTER_WEEKS[hk]} tuần × ${tpw} tiết/tuần) ${-remaining} tiết.`);
      remaining = 0;
    }
    flexSizes = splitLaterHeavier(remaining, flex.length).map((x, i) => Math.max(minFlex[i], x));
  } else {
    flexSizes = flex.map((f, i) => Math.max(minFlex[i], Math.round(policy.onTapDefault?.(tpw, f.moc) || 0)));
    lessonBudget = remaining - flexSizes.reduce((s, x) => s + x, 0);
    if (lessonBudget < nU) {
      // Thu hẹp ôn tập (cuối kì trước) để mỗi bài còn ít nhất 1 tiết - dòng SGK luôn giữ tối thiểu 1 tiết
      let need = nU - lessonBudget;
      for (let i = flexSizes.length - 1; i >= 0 && need > 0; i--) {
        const take = Math.min(flexSizes[i] - minFlex[i], need);
        flexSizes[i] -= take;
        need -= take;
      }
      lessonBudget = remaining - flexSizes.reduce((s, x) => s + x, 0);
    }
    if (lessonBudget < nU) {
      warnings.push(`Học kì chỉ có ${capacity} tiết nhưng đã có ${nU} bài chưa chốt tiết cộng các bài đã chốt/ôn tập/kiểm tra - không đủ 1 tiết/bài. Kiểm tra lại số tiết/tuần hoặc số bài đã nạp.`);
      lessonBudget = nU;
    }
  }

  // 4) Gán số tiết
  const lessonDist = nU > 0 ? spreadEvenly(lessonBudget, nU) : [];
  let uIdx = 0;
  const flexBySource = new Map(); // row(SGK) → size
  const proposalSizeByMoc = {};
  flex.forEach((f, i) => {
    if (f.row) flexBySource.set(f.row, flexSizes[i]);
    else proposalSizeByMoc[f.moc] = flexSizes[i];
  });

  const seq = base.map((r) => {
    let tiet;
    if (isLocked(r)) tiet = numericTiet(r);
    else if (isReviewRow(r)) tiet = flexBySource.get(r) ?? numericTiet(r) ?? 1;
    else tiet = lessonDist[uIdx++];
    return { ...r, soTiet: tiet };
  });
  const tiets = seq.map((r) => r.soTiet);

  // 5) Dựng & chèn các dòng ĐỀ XUẤT
  const makeProposal = (loai, moc, tiet, coKiemTra = false) => ({
    id: makeId(),
    tenBai: loai === "onTap" ? policy.labels.onTap(moc, hk, coKiemTra) : policy.labels.kiemTra(moc, hk),
    soTiet: tiet,
    loai,
    moc,
    hocKi: hk,
    deXuat: true,
    tietChot: true,
    blockKey: `de-xuat-${moc}-${loai}`,
    ...(policy.rowDefaults ? policy.rowDefaults(loai) : {}),
  });

  const insertAt = (index, items) => {
    seq.splice(index, 0, ...items);
    tiets.splice(index, 0, ...items.map((x) => x.soTiet));
  };
  const lastIndexOfMoc = (moc, loai) => {
    for (let i = seq.length - 1; i >= 0; i--) if (seq[i].loai === loai && seq[i].moc === moc) return i;
    return -1;
  };

  const blockFor = (m) => {
    const items = [];
    if (m.needOnTapProposal && (proposalSizeByMoc[m.moc] || 0) > 0) {
      const hasKt = m.needKt;
      items.push(makeProposal("onTap", m.moc, proposalSizeByMoc[m.moc], !hasKt));
    }
    if (m.needKt) items.push(makeProposal("kiemTra", m.moc, m.ktTiet));
    return items;
  };

  // Cuối kì trước (chèn ở CUỐI, hoặc ngay sau dòng SGK cuối kì) để không làm lệch chỉ số giữa kì
  const cuoi = mocs[1];
  const cuoiBlock = blockFor(cuoi);
  if (cuoiBlock.length > 0) {
    const lastSgkOnTap = lastIndexOfMoc("cuoi", "onTap");
    if (cuoi.needOnTapProposal) insertAt(seq.length, cuoiBlock);
    else insertAt(lastSgkOnTap + 1, cuoiBlock); // chỉ còn dòng KT
  }

  const giua = mocs[0];
  const giuaBlock = blockFor(giua);
  if (giuaBlock.length > 0) {
    if (giua.needOnTapProposal) {
      const target = KHGD_MID_WEEK_OFFSET * tpw;
      // chỉ xét phần TRƯỚC khối ôn tập/kiểm tra cuối kì (dòng SGK hoặc dòng vừa đề xuất) - giữa kì không thể nằm sau cuối kì
      const cutoff = seq.findIndex((r) => isReviewRow(r) && r.moc === "cuoi");
      const scope = cutoff === -1 ? seq.length : cutoff;
      const idx = pickMidBoundary(seq.slice(0, scope), tiets.slice(0, scope), target);
      insertAt(idx, giuaBlock);
    } else {
      insertAt(lastIndexOfMoc("giua", "onTap") + 1, giuaBlock);
    }
  }

  // 6) Đánh lại Tuần + Tiết PPCT
  let running = startTiet;
  let totalLesson = 0;
  let totalOnTap = 0;
  let totalKt = 0;
  const out = seq.map((r) => {
    const t = r.soTiet;
    const from = running + 1;
    const to = running + t;
    running = to;
    const w1 = weekOfTiet(from, tpw);
    const w2 = weekOfTiet(to, tpw);
    if (r.loai === "onTap") totalOnTap += t;
    else if (r.loai === "kiemTra") totalKt += t;
    else totalLesson += t;
    return { ...r, tuan: weekLabel(w1, w2), tietPPCT: t > 1 ? `${from}-${to}` : from, _from: from, _to: to };
  });

  const total = totalLesson + totalOnTap + totalKt;
  const usedLastWeek = out.length > 0 ? weekOfTiet(out[out.length - 1]._to, tpw) : firstWeek;
  if (total > capacity) warnings.push(`Tổng ${total} tiết vượt quỹ ${capacity} tiết của học kì (kết thúc Tuần ${usedLastWeek}, học kì chỉ đến Tuần ${lastWeek}).`);
  if (nU > 0 && lessonBudget / nU > 6) {
    warnings.push(`Trung bình ${(lessonBudget / nU).toFixed(1)} tiết/bài - có vẻ CHƯA nạp đủ các chương của học kì này (số tiết mỗi bài có thể bị phóng đại). Nạp đủ chương rồi bấm tính lại.`);
  }

  // 7) Tóm tắt từng mốc (dùng cho bảng "Kiểm tra, đánh giá định kỳ" của THCS/THPT)
  const isLesson = (r) => !isReviewRow(r);
  const firstLessonIdx = out.findIndex(isLesson);
  const summarizeMoc = (moc, prevBoundaryIdx) => {
    const ot = out.filter((r) => r.loai === "onTap" && r.moc === moc);
    const kt = out.filter((r) => r.loai === "kiemTra" && r.moc === moc);
    const anchor = kt[0] || ot[0] || null;
    const anchorIdx = anchor ? out.indexOf(anchor) : -1;
    const startIdx = prevBoundaryIdx == null ? firstLessonIdx : prevBoundaryIdx;
    const covered = out.slice(Math.max(0, startIdx), anchorIdx === -1 ? out.length : anchorIdx).filter(isLesson);
    const kt0 = kt[0];
    return {
      onTap: ot,
      kiemTra: kt,
      tuan: anchor ? anchor.tuan : "",
      tiet: kt0 ? tietListLabel(kt0._from, kt0._to) : anchor ? tietListLabel(anchor._from, anchor._to) : "",
      coverage: covered.length > 0 ? { from: covered[0].tenBai, to: covered[covered.length - 1].tenBai } : null,
      anchorIdx,
    };
  };
  const giuaSum = summarizeMoc("giua", null);
  const cuoiSum = summarizeMoc("cuoi", giuaSum.anchorIdx >= 0 ? giuaSum.anchorIdx + 1 : null);

  const cleaned = out.map(({ _from, _to, ...rest }) => rest);
  return {
    rows: cleaned,
    summary: {
      hocKi: hk,
      tietPerWeek: tpw,
      weeks: KHGD_SEMESTER_WEEKS[hk],
      capacity,
      lessonTiet: totalLesson,
      onTapTiet: totalOnTap,
      kiemTraTiet: totalKt,
      totalTiet: total,
      leftover: capacity - total,
      lastWeek: usedLastWeek,
      milestones: { giua: giuaSum, cuoi: cuoiSum },
    },
    warnings,
  };
}

/**
 * Chỉ ĐÁNH LẠI "Tuần" + "Tiết PPCT" theo số tiết từng dòng (không chia tiết, không chèn ôn tập) - dùng khi giáo viên
 * sửa số tiết/xoá dòng/đổi số tiết/tuần. Tính RIÊNG từng học kì (`hocKi` của dòng): HK II bắt đầu từ Tuần 19.
 * Chưa có số tiết/tuần hợp lệ → trả về nguyên `rows` (KHÔNG đoán, khác bản cũ mặc định cứng 10 tiết/tuần).
 */
export function recomputeTuanTiet(rows, tietPerWeek) {
  const tpw = parseTietPerWeek(tietPerWeek);
  if (!tpw) return rows;
  const running = { 1: semesterStartTiet(tpw, 1), 2: semesterStartTiet(tpw, 2) };
  return rows.map((r) => {
    const hk = normalizeHocKi(r.hocKi);
    const soTiet = Math.max(1, Math.round(Number(r.soTiet)) || 1);
    const from = running[hk] + 1;
    const to = running[hk] + soTiet;
    running[hk] = to;
    return { ...r, tietPPCT: soTiet > 1 ? `${from}-${to}` : from, tuan: weekLabel(weekOfTiet(from, tpw), weekOfTiet(to, tpw)) };
  });
}

/**
 * Xếp lịch CẢ NĂM: nhóm dòng theo `hocKi` (mặc định HK I), xếp từng học kì, nối lại HK I trước HK II.
 * @returns {{ rows: Array<Object>, summaries: {1?: Object, 2?: Object}, warnings: string[] }}
 */
export function planYear({ rows, tietPerWeek, policyFor, makeId }) {
  const groups = { 1: [], 2: [] };
  for (const r of rows || []) groups[normalizeHocKi(r?.hocKi)].push(r);

  const outRows = [];
  const summaries = {};
  const warnings = [];
  for (const hk of [1, 2]) {
    if (groups[hk].length === 0) continue;
    const res = planSemester({ rows: groups[hk], hocKi: hk, tietPerWeek, policy: policyFor(hk), makeId });
    outRows.push(...res.rows);
    if (res.summary) summaries[hk] = res.summary;
    for (const w of res.warnings) warnings.push(`Học kì ${hk === 1 ? "I" : "II"}: ${w}`);
  }
  return { rows: outRows, summaries, warnings };
}

/** Câu tóm tắt cho giao diện: "Học kì I: quỹ 72 tiết (18 tuần × 4) = 60 bài học + 6 ôn tập + 4 kiểm tra; còn 2 tiết." */
export function formatScheduleSummary(summary) {
  if (!summary) return "";
  const hk = summary.hocKi === 1 ? "I" : "II";
  const parts = [`${summary.lessonTiet} bài học`];
  if (summary.onTapTiet > 0) parts.push(`${summary.onTapTiet} ôn tập`);
  if (summary.kiemTraTiet > 0) parts.push(`${summary.kiemTraTiet} kiểm tra`);
  const tail = summary.leftover > 0 ? `; còn ${summary.leftover} tiết chưa xếp` : summary.leftover < 0 ? `; VƯỢT ${-summary.leftover} tiết` : "";
  return `Học kì ${hk}: quỹ ${summary.capacity} tiết (${summary.weeks} tuần × ${summary.tietPerWeek}) = ${parts.join(" + ")}${tail}. Kết thúc Tuần ${summary.lastWeek}.`;
}
