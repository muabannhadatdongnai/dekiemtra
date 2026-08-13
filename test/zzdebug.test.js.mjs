import { Document, Packer } from "docx";
import JSZip from "jszip";
import { buildLessonPlanDocxSections } from "./src/services/lessonPlanExportService.js";

const lessonPlan = {
  tenBai: "Bài test lời dẫn",
  yeuCauCanDat: {},
  doDungDayHoc: {},
  hoatDong: [{ ten: "Khởi động", tienTrinh: [{ hoatDongGVHS: "A", sanPhamDuKien: "B" }] }],
  loiDan: [{ hoatDong: "Khởi động", loiDan: "Nào các con, hôm nay cô có một trò chơi rất thú vị!" }],
};
const meta = { grade: 3, soTiet: 1, columnMode: "one_column" };
const children = buildLessonPlanDocxSections({ lessonPlan, timeline: [], meta });
const doc = new Document({ sections: [{ children }] });
const buf = await Packer.toBuffer(doc);
const zip = await JSZip.loadAsync(buf);
const xml = await zip.file("word/document.xml").async("string");
const idx = xml.indexOf("LỜI DẪN");
console.log("found at", idx);
console.log(xml.slice(Math.max(0,idx-200), idx+200));
