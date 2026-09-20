/**
 * khgdTieuHocMergeUtils.js  (Phiên 48b)
 * Logic GỘP Ô dùng CHUNG cho bản xem trước web (KhgdTieuHocPreview.jsx) và file Word
 * (khgdTieuHocExportService.js) - trước đây mỗi nơi giữ 1 bản sao computeMergeInfo() (Phiên 48),
 * nay thêm gộp cột "Tiết học/Thời lượng" nên gom về 1 chỗ để 2 bản KHÔNG lệch nhau.
 * File thuần (không import docx/React) nên test được trực tiếp.
 */

/**
 * Nhóm các dòng LIÊN TIẾP có CÙNG giá trị 1 cột (Tuần/Chủ đề) để GỘP Ô (rowSpan). CHỈ gộp khi giá
 * trị KHÔNG RỖNG - để trống hàng loạt thì mỗi dòng vẫn hiển thị riêng (tránh 1 ô khổng lồ gây hiểu lầm).
 * @returns {Array<{show: boolean, span: number}>} cùng độ dài `lessons`; `show: false` = dòng này
 *   không render ô ở cột đó (đã gộp vào dòng phía trên).
 */
export function computeMergeInfo(lessons, getKey) {
  const info = lessons.map(() => ({ show: true, span: 1 }));
  let i = 0;
  while (i < lessons.length) {
    const key = getKey(lessons[i]);
    let j = i + 1;
    if (key) {
      while (j < lessons.length && getKey(lessons[j]) === key) j++;
    }
    info[i] = { show: true, span: j - i };
    for (let k = i + 1; k < j; k++) info[k] = { show: false, span: 0 };
    i = j;
  }
  return info;
}

function isNumericLike(v) {
  return v !== null && v !== undefined && String(v).trim() !== "" && Number.isFinite(Number(v));
}

/**
 * Cột "Tiết học/Thời lượng": các dòng liên tiếp cùng `nhomTiet` (VD Đọc Tiết 1 + Tiết 2) GỘP thành 1
 * ô ghi tổng số tiết ("2 tiết") đúng bản mẫu giáo viên; dòng không thuộc nhóm ghi "N tiết" riêng.
 * Giá trị `soTiet` không phải số (giáo viên gõ chữ tự do) thì giữ nguyên chữ đó.
 * @returns {Array<{show: boolean, span: number, label: string}>}
 */
export function computeTietMerge(lessons) {
  const merge = computeMergeInfo(lessons, (l) => l.nhomTiet || "");
  return lessons.map((l, i) => {
    if (!merge[i].show) return { show: false, span: 0, label: "" };
    const span = merge[i].span;
    const group = lessons.slice(i, i + span);
    const allNumeric = group.every((g) => isNumericLike(g.soTiet));
    if (allNumeric) {
      const total = group.reduce((sum, g) => sum + Number(g.soTiet), 0);
      return { show: true, span, label: `${total} tiết` };
    }
    return { show: true, span, label: group.map((g) => String(g.soTiet ?? "")).filter(Boolean).join(" + ") };
  });
}
