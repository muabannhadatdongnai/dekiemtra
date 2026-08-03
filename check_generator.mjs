import { generateWorksheet } from "./src/services/worksheetGenerator.testcopy.mjs";

const counts = {
  tinh_nham: 4,
  dem_va_viet_so: 3,
  so_sanh: 4,
  day_so: 2,
  sap_xep_thu_tu: 3,
  noi_phep_tinh: 3,
  nhan_dien_hinh: 5,
  giai_toan: 0,
};

let totalErrors = 0;

for (const grade of ["MAM_NON", "LOP_1", "LOP_2"]) {
  const result = await generateWorksheet({ grade, exerciseCounts: counts });
  const types = result.sections.map(s => s.type);
  console.log(`\n[${grade}] Cac section type theo dung thu tu:`, types.join(" -> "));

  const idxNhanDien = types.indexOf("nhan_dien_hinh");
  const idxDemHinh = types.indexOf("dem_hinh_ung_dung");
  if (idxNhanDien === -1) { console.error("LOI: thieu nhan_dien_hinh"); totalErrors++; }
  if (idxDemHinh === -1) { console.error("LOI: thieu dem_hinh_ung_dung tu dong"); totalErrors++; }
  if (idxDemHinh !== idxNhanDien + 1) { console.error("LOI: dem_hinh_ung_dung khong dung NGAY SAU nhan_dien_hinh"); totalErrors++; }

  const demHinhSection = result.sections[idxDemHinh];
  const nhanDienSection = result.sections[idxNhanDien];
  const sameShapes = demHinhSection.data.questions.every(q => nhanDienSection.shapes.includes(q.shape));
  if (!sameShapes) { console.error("LOI: dem_hinh_ung_dung KHONG dung chung danh sach hinh voi nhan_dien_hinh"); totalErrors++; }
  else console.log("  -> dem_hinh_ung_dung dung chung danh sach hinh: OK");

  if (!types.includes("sap_xep_thu_tu")) { console.error("LOI: thieu sap_xep_thu_tu"); totalErrors++; }
  if (!result.layout?.id) { console.error("LOI: thieu layout"); totalErrors++; }

  console.log("  -> Tong so section:", types.length);
}

console.log(totalErrors === 0 ? "\n=== TAT CA OK ===" : `\n=== THAT BAI: ${totalErrors} loi ===`);
