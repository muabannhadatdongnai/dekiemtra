/**
 * subjectProfiles.js
 * Quy tắc riêng cho từng môn học khi sinh đề bằng AI.
 *
 * ⚠️ SỬA LỖI PHÁT HIỆN KHI TÁI CẤU TRÚC: trước đây prompt LUÔN nói AI là "chuyên gia ra đề
 * thi MÔN TOÁN" và hiển thị "Môn: Toan" (không dấu, đúng mã slug) dù đang tạo đề Tiếng Việt/
 * Tiếng Anh/Lịch sử - ảnh hưởng thật đến chất lượng đề 3 môn mới. Bản này định nghĩa vai trò
 * + quy tắc riêng cho từng môn, và dùng "label" (tên tiếng Việt có dấu) thay vì mã slug khi
 * hiển thị trong prompt.
 *
 * Thêm môn học mới: chỉ cần thêm 1 entry vào SUBJECT_PROFILES, không cần sửa promptTemplates.js.
 */

export const SUBJECT_PROFILES = {
  Toan: {
    label: "Toán",
    expertRole: "một chuyên gia ra đề thi môn Toán chuẩn Bộ Giáo dục Việt Nam",
    // ⚠️ Phiên 33: phần "ĐỘ SÂU KIẾN THỨC THEO KHỐI" theo chủ đề Toán cụ thể (tập hợp, đạo hàm,
    // số phức...) CHUYỂN VÀO ĐÂY từ gradeProfiles.js - trước đây field `guidance` bên đó tự ý
    // nhét chủ đề Toán vào prompt của MỌI môn học (kể cả Tiếng Việt/Tiếng Anh/Đạo đức Tiểu học,
    // và sắp tới là Vật lí/Hoá học/Sinh học/Địa lí... THPT) vì `buildBaseRules()` ở
    // promptTemplates.js ghép `gradeProfile.guidance` KHÔNG ĐIỀU KIỆN vào mọi prompt bất kể môn
    // gì. Sửa tại gốc: gradeProfiles.js giờ chỉ giữ phần trung lập theo khối (gợi ý mức độ nhận
    // thức chung), còn chủ đề Toán cụ thể theo từng khối đặt Ở ĐÂY - đúng nguyên tắc "môn nào lo
    // môn nấy" đã áp dụng cho Lich_Su_Dia_Li/Cong_Nghe/Tin_Hoc/Vat_Li/Hoa_Hoc/Sinh_Hoc.
    extraRules: `- Công thức Toán học phải viết bằng LaTeX, đặt trong dấu $...$ (inline) hoặc $$...$$ (block).
- SỐ LIỆU PHẢI "ĐẸP" VÀ PHÙ HỢP LỨA TUỔI: với Lớp 1-5, ưu tiên số nguyên hoặc phân số/thập phân
  hữu hạn, kết quả cuối cùng phải là số tròn, dễ kiểm tra (tránh số vô tỉ, thập phân vô hạn,
  phân số quá phức tạp). Với Lớp 6 trở lên có thể dùng căn thức/số vô tỉ nếu phù hợp chương trình,
  nhưng vẫn phải đảm bảo có lời giải "sạch", không sai số làm tròn khó chịu.
- ⚠️ ĐỘ SÂU KIẾN THỨC/PHẠM VI SỐ LIỆU THEO KHỐI (bám sát đúng chương trình từng lớp, KHÔNG dùng
  chủ đề/công thức của khối khác nếu tài liệu cung cấp không đề cập tới):
  + Lớp 1: số liệu 0-20, ưu tiên cộng/trừ không nhớ, đếm số lượng, so sánh số. Câu hỏi cực đơn
    giản, 1 bước tính duy nhất, không có bối cảnh nhiều lớp thông tin.
  + Lớp 2: số liệu 0-100, có thể có cộng/trừ có nhớ, bài toán có lời văn 1 bước tính.
  + Lớp 3: số liệu 0-1000, bắt đầu có nhân/chia đơn giản (bảng cửu chương), bài toán có lời văn
    1-2 bước tính.
  + Lớp 4: số có nhiều chữ số (tới hàng trăm nghìn), phân số đơn giản (cùng mẫu số), phép tính
    2-3 bước, kết quả cuối cùng vẫn phải là số tròn, dễ kiểm tra.
  + Lớp 5: phân số khác mẫu số, số thập phân, tỉ số phần trăm, bài toán có lời văn nhiều bước
    tính, vẫn tránh số vô tỉ hoặc thập phân vô hạn tuần hoàn.
  + Lớp 6-9 (THCS, không dùng visual, câu hỏi text thuần): Lớp 6 mới bắt đầu chương trình THCS,
    tránh ký hiệu/khái niệm chưa học. Lớp 7 có số hữu tỉ, biểu thức đại số đơn giản. Lớp 8 có hằng
    đẳng thức, phương trình bậc nhất 1 ẩn. Lớp 9 (cuối cấp) có căn thức, hệ phương trình, hàm số
    bậc nhất/bậc hai đơn giản.
  + Lớp 10-12 (THPT, chương trình định hướng nghề nghiệp): Lớp 10 có tập hợp, mệnh đề, hàm số bậc
    hai, lượng giác cơ bản (góc-cung lượng giác), vector, thống kê-xác suất cơ bản. Lớp 11 có dãy
    số-cấp số, giới hạn, đạo hàm cơ bản, hàm số lượng giác, xác suất có điều kiện, quan hệ vuông
    góc trong không gian. Lớp 12 (ôn thi tốt nghiệp THPT, có thể tăng độ phân hoá Vận dụng cao) có
    nguyên hàm-tích phân, ứng dụng đạo hàm (khảo sát hàm số), số phức, phương pháp toạ độ Oxyz,
    thống kê-xác suất nâng cao.`,
  },
  Tieng_Viet: {
    label: "Tiếng Việt",
    expertRole: "một chuyên gia ra đề thi môn Tiếng Việt / Ngữ văn chuẩn Bộ Giáo dục Việt Nam",
    extraRules: `- Với dạng đọc hiểu: PHẢI trích dẫn một đoạn văn/đoạn thơ NGẮN (nguyên văn hoặc phỏng sát theo
  tài liệu được cung cấp) ngay trong "content" TRƯỚC KHI đặt câu hỏi về đoạn đó, để học sinh có
  ngữ liệu để đọc và trả lời.
- Với câu hỏi từ vựng/ngữ pháp/chính tả: bám sát đúng quy tắc chính tả tiếng Việt hiện hành.
- Tránh dùng từ ngữ địa phương/phương ngữ gây khó hiểu, trừ khi bài học yêu cầu.`,
  },
  Tieng_Anh: {
    label: "Tiếng Anh",
    expertRole: "một chuyên gia ra đề thi môn Tiếng Anh chuẩn Bộ Giáo dục Việt Nam",
    extraRules: `- Đề bài và các phương án trả lời viết bằng tiếng Anh, trừ khi câu hỏi chủ đích kiểm tra dịch
  thuật (khi đó phần yêu cầu bằng tiếng Việt, đáp án vẫn bằng tiếng Anh).
- Từ vựng/cấu trúc ngữ pháp dùng trong câu hỏi phải phù hợp đúng trình độ của lớp được chỉ định,
  không dùng từ/thì phức tạp vượt chương trình.
- Với câu hỏi ngữ pháp, chỉ có DUY NHẤT 1 đáp án đúng chuẩn ngữ pháp.`,
  },
  // ⚠️ Phiên 38 - Ngoại ngữ 2 (Lớp 6-12, xem config.js): 3 profile dưới đây dùng chung khuôn với
  // Tieng_Anh (expertRole + extraRules riêng theo đặc thù CHỮ VIẾT/NGỮ ÂM từng tiếng) - khi môn học
  // nằm trong danh bạ foreignLanguageSubjects.js, buildForeignLanguageOutputDirective() sẽ ghi đè
  // "Ngôn ngữ: Tiếng Việt" ở buildBaseRules() và ép AI viết TOÀN BỘ nội dung bằng đúng ngôn ngữ này
  // - extraRules ở đây vẫn giữ NGUYÊN TIẾNG VIỆT (là chỉ thị/hướng dẫn cho AI, không phải nội dung
  // xuất ra), chỉ nêu quy tắc riêng về CHỮ VIẾT/NGỮ PHÁP đặc thù của từng tiếng.
  Tieng_Trung: {
    label: "Tiếng Trung",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Tiếng Trung (Ngoại ngữ 2, Lớp 6-12) chuẩn chương " +
      "trình Giáo dục phổ thông 2018 của Việt Nam, trình độ phù hợp khung năng lực ngoại ngữ 6 bậc " +
      "dùng cho Việt Nam (tương ứng thang tham chiếu HSK cấp độ thấp ở giai đoạn đầu)",
    extraRules: `- CHỮ HÁN: dùng CHỮ GIẢN THỂ (简体字) - đây là chuẩn dạy trong SGK Kết nối tri thức, KHÔNG dùng
  phồn thể (繁體字) trừ khi bài học yêu cầu so sánh/giới thiệu.
- MỌI từ vựng/câu tiếng Trung PHẢI kèm PINYIN (bính âm có đủ dấu thanh điệu, VD "nǐ hǎo") ngay sau
  hoặc bên dưới chữ Hán, để học sinh mới học phát âm được - không được chỉ viết chữ Hán trơn.
- Từ vựng/mẫu câu/số lượng chữ Hán mới phải phù hợp ĐÚNG trình độ khối lớp: Lớp 6-7 chỉ dùng chữ/
  cấu trúc câu CƠ BẢN NHẤT (chào hỏi, số đếm, gia đình, màu sắc, đồ vật quen thuộc - tương đương
  HSK 1), Lớp 8-9 mở rộng dần (tương đương HSK 1-2), Lớp 10-12 có thể phức tạp hơn (HSK 2-3) nhưng
  KHÔNG dùng chữ Hán/ngữ pháp vượt xa trình độ phổ thông.
- Với câu hỏi trắc nghiệm chọn nghĩa/phát âm, các phương án nhiễu phải là chữ Hán/pinyin GẦN GIỐNG
  (dễ nhầm) nhưng rõ ràng sai, không bịa chữ Hán không tồn tại.
- Nếu có phần dịch Việt-Trung/Trung-Việt, bản dịch phải tự nhiên, đúng ngữ pháp tiếng Trung (thứ tự
  Chủ ngữ - Vị ngữ - Tân ngữ, lượng từ đi kèm danh từ...), không dịch word-by-word theo cấu trúc câu
  tiếng Việt.`,
  },
  Tieng_Nhat: {
    label: "Tiếng Nhật",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Tiếng Nhật (Ngoại ngữ 2, Lớp 6-12) chuẩn chương trình " +
      "Giáo dục phổ thông 2018 của Việt Nam, trình độ phù hợp khung năng lực ngoại ngữ 6 bậc dùng " +
      "cho Việt Nam (tương ứng thang tham chiếu JLPT cấp độ thấp ở giai đoạn đầu)",
    extraRules: `- CHỮ VIẾT: Lớp 6-7 ưu tiên HIRAGANA/KATAKANA (viết đủ dấu trường âm/xúc âm đúng chuẩn), CHỈ
  dùng KANJI cơ bản nhất khi bài học đã dạy - mọi Kanji dùng phải có FURIGANA (đọc hiragana nhỏ bên
  trên/cạnh) để học sinh mới học đọc được, không dùng Kanji trơn không có furigana ở giai đoạn đầu.
  Lớp 8 trở lên có thể tăng dần lượng Kanji theo đúng tiến độ bài học được cung cấp.
- MỌI từ vựng/câu tiếng Nhật PHẢI kèm PHIÊN ÂM RÔMAJI (Latin hoá kiểu Hepburn, VD "konnichiwa") bên
  cạnh, để hỗ trợ học sinh chưa đọc thạo hiragana/katakana.
- Cấu trúc ngữ pháp phải phù hợp ĐÚNG trình độ khối lớp, ưu tiên mẫu câu CƠ BẢN (thể lịch sự
  です/ます ở giai đoạn đầu, chưa dùng thể thông thường/kính ngữ phức tạp) - tương đương JLPT N5 cho
  Lớp 6-9, có thể tiệm cận N4 ở Lớp 10-12 nhưng không vượt quá.
- Với câu hỏi trắc nghiệm chọn từ/mẫu câu, các phương án nhiễu phải là từ/cách viết GẦN GIỐNG (dễ
  nhầm hiragana/katakana hoặc nghĩa gần) nhưng rõ ràng sai, không bịa từ không tồn tại.
- Trợ từ (は/が/を/に/で...) phải dùng ĐÚNG NGỮ PHÁP tiếng Nhật chuẩn, không được sai/thiếu trợ từ dù
  chỉ là ngữ liệu minh hoạ.`,
  },
  Tieng_Phap: {
    label: "Tiếng Pháp",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Tiếng Pháp (Ngoại ngữ 2, Lớp 6-12) chuẩn chương trình " +
      "Giáo dục phổ thông 2018 của Việt Nam, trình độ phù hợp khung năng lực ngoại ngữ 6 bậc dùng " +
      "cho Việt Nam (tương ứng thang tham chiếu CEFR cấp độ thấp ở giai đoạn đầu, VD A1-A2)",
    extraRules: `- Viết ĐẦY ĐỦ, CHÍNH XÁC mọi dấu phụ tiếng Pháp (accent aigu é, accent grave è/à/ù, accent
  circonflexe ê/â/î/ô/û, tréma ë/ï/ü, cédille ç...) - thiếu dấu là SAI CHÍNH TẢ tiếng Pháp, không
  được bỏ qua vì lý do trình bày.
- TUÂN THỦ quy tắc GIỐNG (giống đực/giống cái của danh từ) và SỰ HOÀ HỢP (tính từ/mạo từ phải hoà
  hợp giống-số với danh từ đi kèm) - đây là lỗi phổ biến nhất cần tránh khi AI tự sinh câu tiếng Pháp.
- Thì/chia động từ phải phù hợp ĐÚNG trình độ khối lớp: Lớp 6-7 chỉ dùng thì hiện tại đơn (présent)
  với động từ nhóm 1/2/3 cơ bản và các động từ bất quy tắc thông dụng nhất (être, avoir, aller,
  faire), Lớp 8-9 có thể thêm passé composé/futur proche, Lớp 10-12 mở rộng dần thêm imparfait/
  futur simple nhưng vẫn ưu tiên cấu trúc phổ thông, không dùng thì/thức phức tạp (subjonctif,
  conditionnel...) trừ khi tài liệu bài học yêu cầu.
- Với câu hỏi trắc nghiệm ngữ pháp (chia động từ, chọn mạo từ/tính từ đúng giống-số...), CHỈ có DUY
  NHẤT 1 đáp án đúng chuẩn ngữ pháp tiếng Pháp, các phương án nhiễu phải sai rõ ràng (sai giống/số/
  chia động từ) chứ không mập mờ.`,
  },
  Lich_Su: {
    label: "Lịch sử",
    expertRole:
      "một chuyên gia ra đề thi môn Lịch sử THPT chuẩn Bộ Giáo dục Việt Nam (môn RIÊNG từ Lớp 10, " +
      "tách khỏi \"Lịch sử và Địa lí\" gộp ở Tiểu học/THCS)",
    extraRules: `- ⚠️ Theo Thông tư 13/2022/TT-BGDĐT (sửa đổi Thông tư 32/2018), Lịch sử là môn BẮT BUỘC với mọi
  học sinh THPT (không phải môn lựa chọn) - phần cốt lõi 52 tiết/năm dạy chung cho tất cả, học
  sinh chọn định hướng Khoa học xã hội có thêm cụm chuyên đề học tập lựa chọn riêng (hệ thống này
  CHƯA hỗ trợ nội dung chuyên đề, chỉ hỗ trợ phần cốt lõi bắt buộc).
- Ưu tiên câu hỏi có mốc thời gian, sự kiện, nhân vật, địa danh lịch sử CỤ THỂ, chính xác theo
  đúng tài liệu được cung cấp - KHÔNG bịa thêm chi tiết lịch sử không có trong nguồn.
- Với câu hỏi trắc nghiệm, các phương án nhiễu (sai) phải là mốc thời gian/sự kiện CÓ THẬT nhưng
  không liên quan trực tiếp đến câu hỏi - không bịa sự kiện giả.
- ⚠️ Độ khó THPT cao hơn hẳn "Lịch sử và Địa lí" Tiểu học/THCS: ưu tiên câu hỏi PHÂN TÍCH/ĐÁNH GIÁ/
  SO SÁNH (nguyên nhân-kết quả nhiều tầng, so sánh giữa các giai đoạn/sự kiện/xu hướng lịch sử,
  nhận xét vai trò/ý nghĩa lịch sử), không dừng ở mức ghi nhớ sự kiện đơn thuần như Tiểu học/THCS.
- Không đưa quan điểm chính trị gây tranh cãi ngoài phạm vi sách giáo khoa.`,
  },
  // ⚠️ Đạo đức và Khoa học chỉ dạy ở Tiểu học (xem giới hạn minGrade/maxGrade trong config.js) -
  // 2 quy tắc riêng dưới đây viết RIÊNG cho lứa tuổi Tiểu học, KHÔNG dùng chung khuôn với Lịch sử/
  // Tiếng Anh (vốn có thể dạy tới Lớp 12).
  Dao_Duc: {
    label: "Đạo đức",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Đạo đức bậc Tiểu học chuẩn chương trình Giáo dục " +
      "phổ thông 2018 của Việt Nam",
    extraRules: `- Đây là môn giáo dục PHẨM CHẤT (yêu nước, nhân ái, chăm chỉ, trung thực, trách nhiệm) và KỸ
  NĂNG ỨNG XỬ, KHÔNG phải môn kiến thức hàn lâm - TRÁNH tuyệt đối các câu hỏi kiểu học thuộc lòng
  định nghĩa/ghi nhớ máy móc.
- Ưu tiên dạng câu hỏi TÌNH HUỐNG cụ thể, gần gũi đời sống học sinh Tiểu học (ở nhà, ở trường, với
  bạn bè, nơi công cộng...): mô tả 1 tình huống ngắn rồi hỏi "Em sẽ làm gì/ứng xử thế nào là đúng"
  - với trắc nghiệm, chỉ có DUY NHẤT 1 phương án thể hiện đúng chuẩn mực đạo đức/hành vi phù hợp,
  các phương án còn lại phải là hành vi SAI rõ ràng (không mập mờ, gây tranh cãi giữa giáo viên).
- KHÔNG dùng công thức/số liệu/LaTeX. Ngôn ngữ ngắn gọn, gần gũi, đúng độ tuổi (Lớp 1-2 câu cực
  ngắn 1 tình huống đơn giản; Lớp 3-5 có thể có tình huống nhiều chi tiết hơn, bắt đầu phân biệt
  được các sắc thái đúng-sai gần giống nhau).
- Với câu tự luận, có thể yêu cầu học sinh nêu cách xử lý tình huống hoặc kể lại 1 việc đã làm thể
  hiện phẩm chất đang học - KHÔNG yêu cầu "định nghĩa" khái niệm đạo đức trừu tượng.`,
  },
  Khoa_Hoc: {
    label: "Khoa học",
    expertRole:
      "một chuyên gia ra đề thi môn Khoa học bậc Tiểu học (Lớp 4-5) chuẩn chương trình Giáo dục " +
      "phổ thông 2018 của Việt Nam",
    extraRules: `- Nội dung xoay quanh các chủ đề Khoa học Tiểu học: chất, năng lượng, thực vật và động vật, nấm,
  vi khuẩn, con người và sức khoẻ, sinh vật và môi trường - CHỈ dùng kiến thức có trong tài liệu
  được cung cấp, KHÔNG mở rộng sang kiến thức Vật lý/Hoá học/Sinh học bậc THCS trở lên (VD không
  dùng công thức hoá học, không tính toán vật lý bằng công thức).
- Ưu tiên câu hỏi gắn với QUAN SÁT/THÍ NGHIỆM/HIỆN TƯỢNG THỰC TẾ gần gũi (VD mô tả 1 hiện tượng
  rồi hỏi nguyên nhân/kết quả, hoặc mô tả các bước 1 thí nghiệm đơn giản trong SGK rồi hỏi về kết
  quả/giải thích) thay vì hỏi thuộc lòng định nghĩa suông.
- KHÔNG dùng công thức/ký hiệu hoá học/vật lý dạng LaTeX - trình bày bằng ngôn ngữ thông thường,
  phù hợp học sinh Lớp 4-5.
- Với câu hỏi về sức khoẻ/an toàn (VD phòng bệnh, an toàn thực phẩm, an toàn khi dùng điện), đảm
  bảo thông tin ĐÚNG kiến thức y tế/an toàn phổ thông, không đưa lời khuyên y tế chuyên sâu.`,
  },
  Tu_Nhien_Xa_Hoi: {
    label: "Tự nhiên và Xã hội",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Tự nhiên và Xã hội bậc Tiểu học (Lớp 1-3) chuẩn " +
      "chương trình Giáo dục phổ thông 2018 của Việt Nam",
    extraRules: `- Đây là môn TÍCH HỢP cả mảng tự nhiên (thực vật, động vật, cơ thể người, thời tiết, các mùa)
  LẪN mảng xã hội (gia đình, trường học, cộng đồng, an toàn giao thông, an toàn ở nhà) - không
  tách riêng "khoa học" và "xã hội" như 2 môn độc lập vì Lớp 1-3 học chung 1 sách.
- KHÔNG dùng thuật ngữ trừu tượng của môn Khoa học Lớp 4-5 (VD "chất", "năng lượng", "hỗn hợp",
  "dung dịch") - nội dung Lớp 1-3 dừng ở mức quan sát, mô tả, kể tên, nhận biết bằng giác quan.
- Ưu tiên câu hỏi gắn với tranh minh hoạ/tình huống quan sát gần gũi xung quanh học sinh (nhà,
  lớp học, khu phố) thay vì hỏi lý thuyết. Ngôn ngữ ngắn gọn, phù hợp học sinh Lớp 1-3.
- Với nội dung an toàn (an toàn giao thông, phòng tránh nguy hiểm), đảm bảo thông tin ĐÚNG kiến
  thức an toàn phổ thông cho trẻ nhỏ, không đưa hướng dẫn xử lý tình huống nguy hiểm phức tạp.`,
  },
  Lich_Su_Dia_Li: {
    label: "Lịch sử và Địa lí",
    expertRole:
      "một chuyên gia ra đề thi môn Lịch sử và Địa lí chuẩn chương trình " +
      "Giáo dục phổ thông 2018 của Việt Nam (môn gộp xuyên suốt từ Lớp 4 Tiểu học tới hết Lớp 9 THCS)",
    extraRules: `- Đây là 1 môn gộp 2 PHÂN MÔN Lịch sử và Địa lí (SGK Kết nối tri thức in chung 1 cuốn) - trước
  khi ra câu hỏi, xác định rõ chương/bài thuộc phân môn nào dựa vào tài liệu được cung cấp, KHÔNG
  trộn lẫn kiến thức 2 phân môn trong cùng 1 câu hỏi trừ khi tài liệu gốc có liên hệ rõ ràng.
- Phân môn Lịch sử: câu hỏi có mốc thời gian/sự kiện/nhân vật/địa danh lịch sử CỤ THỂ, chính xác
  theo đúng tài liệu - KHÔNG bịa chi tiết lịch sử không có trong nguồn. Phương án nhiễu (sai) phải
  là mốc/sự kiện CÓ THẬT nhưng không liên quan trực tiếp câu hỏi, không bịa sự kiện giả.
- Phân môn Địa lí: câu hỏi về vị trí địa lý, đặc điểm tự nhiên (địa hình, khí hậu, sông ngòi),
  dân cư, hoạt động kinh tế các vùng miền Việt Nam - CHỈ dùng số liệu/địa danh có trong tài liệu
  được cung cấp, KHÔNG tự suy diễn hoặc làm tròn số liệu thống kê không có nguồn.
- ⚠️ ĐỘ SÂU KIẾN THỨC THEO KHỐI (môn này dạy xuyên suốt Lớp 4-9, độ khó tăng dần rõ rệt): Lớp 4-5
  (Tiểu học) dừng ở mức nhận biết/mô tả cơ bản (tên sự kiện, vị trí trên bản đồ, đặc điểm nổi bật).
  Lớp 6-9 (THCS) yêu cầu PHÂN TÍCH/GIẢI THÍCH NGUYÊN NHÂN-KẾT QUẢ (VD "vì sao", "tác động của...",
  so sánh giữa các giai đoạn/vùng miền), có thể dùng thuật ngữ chuyên môn sâu hơn (VD "phong trào",
  "chế độ", "cơ cấu kinh tế") - KHÔNG viết văn phong/độ khó Lớp 6-9 giống hệt Lớp 4-5 và ngược lại.
- Không đưa quan điểm chính trị gây tranh cãi ngoài phạm vi sách giáo khoa.`,
  },
  Tin_Hoc: {
    label: "Tin học",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Tin học chuẩn chương trình Giáo dục phổ thông 2018 " +
      "của Việt Nam (môn dạy xuyên suốt từ Lớp 3 Tiểu học tới hết Lớp 12 THPT)",
    extraRules: `- Nội dung xoay quanh: máy tính và thiết bị số, thông tin và xử lý thông tin, sử dụng phần mềm
  (soạn thảo, trình chiếu, bảng tính), an toàn khi dùng máy tính/Internet, tư duy lập trình, và ở
  THPT có thêm mạng máy tính/Internet nâng cao, cơ sở dữ liệu, đạo đức-pháp luật-văn hoá số - CHỈ
  theo đúng nội dung có trong tài liệu được cung cấp, KHÔNG tự thêm khái niệm vượt quá tài liệu.
- Ưu tiên câu hỏi gắn với thao tác/tình huống sử dụng máy tính thực tế hơn là hỏi lý thuyết suông.
- ⚠️ ĐỘ SÂU KIẾN THỨC THEO KHỐI (khác biệt LỚN qua 3 cấp): Lớp 3-5 (Tiểu học) CHỈ dùng lập trình
  trực quan kiểu kéo-thả khối lệnh (Scratch dạng khối, không gõ mã), KHÔNG yêu cầu viết mã lệnh/cú
  pháp lập trình văn bản. Lớp 6-9 (THCS) được phép có nội dung thuật toán cơ bản, cấu trúc dữ liệu
  đơn giản, và bắt đầu làm quen lập trình dạng VĂN BẢN (Scratch nâng cao/Python cơ bản). Lớp 10-12
  (THPT) chương trình chia 2 định hướng "Tin học ứng dụng" (kỹ năng dùng phần mềm/dữ liệu nâng cao,
  ít code) và "Khoa học máy tính" (thuật toán/cấu trúc dữ liệu/lập trình Python sâu hơn, có thể có
  bài tập viết đoạn mã ngắn) - xác định đúng định hướng đang dạy dựa vào tài liệu cung cấp trước
  khi ra câu hỏi, KHÔNG áp mức độ THCS cho câu hỏi THPT và ngược lại.`,
  },
  Cong_Nghe: {
    label: "Công nghệ",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Công nghệ chuẩn chương trình Giáo dục phổ thông 2018 " +
      "của Việt Nam (môn dạy xuyên suốt từ Lớp 3 Tiểu học tới hết Lớp 12 THPT)",
    extraRules: `- Nội dung xoay quanh: công nghệ trong đời sống, thủ công kỹ thuật, an toàn khi sử dụng dụng
  cụ/thiết bị, trồng trọt/chăn nuôi, và ở THCS/THPT có thêm công nghệ trong nông-lâm-ngư nghiệp,
  thiết kế kỹ thuật, định hướng nghề nghiệp - CHỈ theo đúng nội dung có trong tài liệu cung cấp.
- Ưu tiên câu hỏi về QUY TRÌNH CÁC BƯỚC, công dụng của đồ dùng/dụng cụ, hoặc an toàn khi sử dụng -
  hơn là hỏi lý thuyết trừu tượng.
- ⚠️ ĐỘ SÂU KIẾN THỨC THEO KHỐI: Lớp 3-5 (Tiểu học) dừng ở mức lắp ráp mô hình đơn giản/đồ thủ
  công/trồng trọt cơ bản, KHÔNG dùng công thức/số liệu kỹ thuật. Lớp 6-9 (THCS) được phép có bản
  vẽ kỹ thuật cơ bản, quy trình công nghệ nhiều bước phức tạp hơn, và nội dung định hướng nghề
  nghiệp (đặc biệt rõ ở Lớp 8-9). Lớp 10-12 (THPT) chương trình tách 2 định hướng "Công nghệ công
  nghiệp" (cơ khí, điện-điện tử, tiêu chuẩn kỹ thuật, bản vẽ kỹ thuật đầy đủ) và "Công nghệ nông
  nghiệp" (trồng trọt/chăn nuôi/thuỷ sản/lâm nghiệp quy mô lớn, quy trình công nghệ sản xuất) - xác
  định đúng định hướng đang dạy dựa vào tài liệu cung cấp, KHÔNG áp mức độ THCS cho câu hỏi THPT.`,
  },

  // ================== THCS (Lớp 6-9) - Giai đoạn 32 ==================
  Ngu_Van: {
    label: "Ngữ văn",
    expertRole: "một chuyên gia ra đề kiểm tra/biên soạn nội dung môn Ngữ văn THCS/THPT chuẩn chương " +
      "trình Giáo dục phổ thông 2018 của Việt Nam",
    extraRules: `- ⚠️ THEO CÔNG VĂN 3175/BGDĐT-GDTrH (2022, được nhấn mạnh lại ở Công văn 3935/2024): với đề kiểm
  tra/ngữ liệu Đọc hiểu, TUYỆT ĐỐI KHÔNG dùng lại nguyên văn văn bản/đoạn trích ĐÃ CÓ trong SGK -
  phải là ngữ liệu MỚI (có thể cùng tác giả/chủ đề/thể loại nhưng KHÔNG PHẢI đoạn học sinh đã học),
  để đánh giá đúng năng lực đọc hiểu thay vì học thuộc lòng. Áp dụng CHUNG cho cả THCS lẫn THPT
  (công văn nói "ở trường phổ thông", không tách riêng cấp). Đề cương ôn tập được dùng lại ngữ liệu
  SGK vì mục đích ôn tập/hệ thống hoá kiến thức đã học, KHÔNG áp dụng hạn chế này.
- Với dạng bài Tập làm văn/Viết đoạn: phân biệt rõ 3 KIỂU BÀI chính theo chương trình - Nghị luận
  xã hội (bàn về 1 tư tưởng đạo lý/hiện tượng đời sống), Nghị luận văn học (phân tích/cảm nhận tác
  phẩm), và các kiểu bài tự sự/miêu tả/biểu cảm/thuyết minh ở khối đầu cấp (Lớp 6-7) - không nhầm
  lẫn yêu cầu giữa các kiểu bài.
- Với câu hỏi từ vựng/ngữ pháp/Tiếng Việt: bám sát đúng quy tắc chính tả/ngữ pháp tiếng Việt hiện
  hành và đúng phạm vi kiến thức Tiếng Việt của khối lớp (VD biện pháp tu từ, các loại câu, thành
  phần câu - độ phức tạp tăng dần Lớp 6 -> Lớp 9).
- ⚠️ RIÊNG THPT (Lớp 10-12): Nghị luận văn học nâng cao hơn hẳn THCS (phân tích đặc trưng thể
  loại - truyện thơ, kí, kịch...; so sánh 2 tác phẩm/đoạn trích; đánh giá phong cách tác giả). Nghị
  luận xã hội có thể yêu cầu bàn về vấn đề tư tưởng-đạo lý PHỨC TẠP hơn hoặc hiện tượng đời sống
  gắn bối cảnh xã hội rộng hơn (không còn dạng bài tự sự/miêu tả/biểu cảm thuần tuý như đầu THCS).
  Lớp 12 ôn thi tốt nghiệp THPT nên có thể tăng độ phân hoá (câu hỏi Vận dụng cao rõ nét hơn).
- Tránh dùng từ ngữ địa phương/phương ngữ gây khó hiểu, trừ khi bài học yêu cầu.`,
  },
  Giao_Duc_Cong_Dan: {
    label: "Giáo dục công dân",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Giáo dục công dân THCS chuẩn chương trình Giáo dục " +
      "phổ thông 2018 của Việt Nam",
    extraRules: `- Khác "Đạo đức" Tiểu học (thuần giáo dục phẩm chất qua tình huống): Giáo dục công dân THCS có
  THÊM kiến thức pháp luật cơ bản (quyền/nghĩa vụ công dân, phòng chống tệ nạn xã hội, an toàn
  giao thông, bảo vệ môi trường theo quy định pháp luật) bên cạnh giáo dục đạo đức/kỹ năng sống -
  KHÔNG chỉ dừng ở mức "tình huống ứng xử" đơn giản như Tiểu học.
- Với nội dung pháp luật: bám sát ĐÚNG quy định pháp luật Việt Nam hiện hành có trong tài liệu
  được cung cấp, KHÔNG tự suy diễn hoặc bịa quy định không có thật.
- Với trắc nghiệm tình huống đạo đức/pháp luật, chỉ có DUY NHẤT 1 phương án đúng chuẩn mực/đúng
  luật, các phương án còn lại phải SAI rõ ràng (không mập mờ, gây tranh cãi giữa giáo viên).
- KHÔNG đưa quan điểm chính trị gây tranh cãi ngoài phạm vi sách giáo khoa.`,
  },
  Khoa_Hoc_Tu_Nhien: {
    label: "Khoa học tự nhiên",
    expertRole:
      "một chuyên gia ra đề thi môn Khoa học tự nhiên THCS (môn tích hợp Vật lí - Hoá học - Sinh " +
      "học) chuẩn chương trình Giáo dục phổ thông 2018 của Việt Nam",
    extraRules: `- Đây là môn TÍCH HỢP 3 PHÂN MÔN Vật lí, Hoá học, Sinh học (SGK Kết nối tri thức in chung 1
  cuốn theo chủ đề, không tách riêng như THPT) - trước khi ra câu hỏi, xác định rõ chủ đề/bài
  thuộc phân môn nào dựa vào tài liệu được cung cấp.
- Phân môn Vật lí/Hoá học: công thức/phương trình PHẢI viết bằng LaTeX (đặt trong $...$ hoặc
  $$...$$), đơn vị đo đúng chuẩn SI, số liệu tính toán phải "sạch" (kết quả tròn/dễ kiểm tra, phù
  hợp trình độ THCS - KHÔNG dùng số liệu phức tạp vượt chương trình phổ thông cơ sở).
- Phân môn Sinh học: ưu tiên câu hỏi gắn QUAN SÁT/THÍ NGHIỆM/HIỆN TƯỢNG THỰC TẾ, đúng thuật ngữ
  sinh học chuẩn (không dùng thuật ngữ chuyên sâu vượt cấp THPT/Đại học).
- KHÔNG mở rộng sang kiến thức Vật lí/Hoá học/Sinh học bậc THPT (VD không dùng đạo hàm/tích phân,
  không dùng phản ứng hoá học phức tạp ngoài chương trình THCS) - CHỈ dùng kiến thức có trong tài
  liệu được cung cấp.`,
  },
  Giao_Duc_The_Chat: {
    label: "Giáo dục thể chất",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Giáo dục thể chất THCS/THPT chuẩn chương trình Giáo " +
      "dục phổ thông 2018 của Việt Nam",
    extraRules: `- Đây là môn THỰC HÀNH VẬN ĐỘNG, đánh giá bằng NHẬN XÉT/kiểm tra kỹ năng thực hành (Thông tư
  22/2021/TT-BGDĐT, áp dụng cả THCS lẫn THPT), KHÔNG có bài kiểm tra lý thuyết định kỳ theo ma
  trận đề như các môn kiến thức - hệ thống này chỉ hỗ trợ soạn giáo án (kế hoạch bài dạy) cho môn
  này, không hỗ trợ tạo đề kiểm tra/đề cương ôn tập.
- Giáo án cần nêu rõ: khởi động, bài tập/kỹ thuật chính, trò chơi vận động (nếu có), hồi tĩnh -
  chú trọng AN TOÀN khi vận động, có lưu ý phân hoá thể trạng học sinh khi cần.
- ⚠️ RIÊNG THPT: chương trình có thêm nội dung TỰ CHỌN theo môn thể thao (bóng đá/bóng chuyền/cầu
  lông/bơi/điền kinh...) tuỳ điều kiện trường - xác định đúng nội dung thể thao đang dạy dựa vào
  tài liệu cung cấp, không mặc định 1 môn thể thao cố định nếu tài liệu không nêu rõ.
- KHÔNG dùng công thức/số liệu học thuật - ngôn ngữ hướng dẫn kỹ thuật động tác cụ thể, dễ hình dung.`,
  },
  Am_Nhac: {
    label: "Âm nhạc",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Âm nhạc THCS/THPT chuẩn chương trình Giáo dục phổ " +
      "thông 2018 của Việt Nam",
    extraRules: `- Đây là môn NĂNG KHIẾU/THỰC HÀNH, đánh giá bằng NHẬN XÉT (Thông tư 22/2021/TT-BGDĐT, thuộc
  nhóm "Nghệ thuật" cùng Mĩ thuật), KHÔNG có bài kiểm tra lý thuyết định kỳ theo ma trận đề - hệ
  thống này chỉ hỗ trợ soạn giáo án cho môn này.
- Nội dung xoay quanh: hát, nghe nhạc, nhạc cụ, lý thuyết âm nhạc cơ bản (nhịp, phách, cao độ),
  thường thức âm nhạc (giới thiệu tác giả/tác phẩm/thể loại) - bám sát đúng tài liệu cung cấp.
- ⚠️ RIÊNG THPT: đây là môn LỰA CHỌN theo định hướng nghệ thuật (không phải mọi học sinh đều học),
  nội dung có thể sâu hơn THCS (hoà âm cơ bản, phân tích tác phẩm, định hướng nghề nghiệp âm nhạc).
- KHÔNG bịa tên bài hát/tác giả/tác phẩm không có trong tài liệu được cung cấp.`,
  },
  My_Thuat: {
    label: "Mĩ thuật",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Mĩ thuật THCS/THPT chuẩn chương trình Giáo dục phổ " +
      "thông 2018 của Việt Nam",
    extraRules: `- Đây là môn NĂNG KHIẾU/THỰC HÀNH, đánh giá bằng NHẬN XÉT (Thông tư 22/2021/TT-BGDĐT, thuộc
  nhóm "Nghệ thuật" cùng Âm nhạc), KHÔNG có bài kiểm tra lý thuyết định kỳ theo ma trận đề - hệ
  thống này chỉ hỗ trợ soạn giáo án cho môn này.
- Nội dung xoay quanh: vẽ, nặn, xé dán, thường thức mĩ thuật (giới thiệu tác giả/tác phẩm/trường
  phái), thẩm mĩ ứng dụng - bám sát đúng tài liệu cung cấp, nêu rõ chất liệu/dụng cụ cần chuẩn bị.
- ⚠️ RIÊNG THPT: đây là môn LỰA CHỌN theo định hướng nghệ thuật, nội dung có thể sâu hơn THCS (mĩ
  thuật ứng dụng/thiết kế, định hướng nghề nghiệp mĩ thuật - đồ hoạ, thiết kế, kiến trúc...).
- KHÔNG bịa tên tác phẩm/hoạ sĩ không có trong tài liệu được cung cấp.`,
  },
  Hoat_Dong_Trai_Nghiem_Huong_Nghiep: {
    label: "Hoạt động trải nghiệm, hướng nghiệp",
    expertRole:
      "một chuyên gia thiết kế Hoạt động trải nghiệm, hướng nghiệp THCS/THPT chuẩn chương trình " +
      "Giáo dục phổ thông 2018 của Việt Nam",
    extraRules: `- Đây là HOẠT ĐỘNG GIÁO DỤC (không phải "môn học" kiến thức thuần tuý), đánh giá bằng NHẬN XÉT
  (Thông tư 22/2021/TT-BGDĐT), KHÔNG có bài kiểm tra lý thuyết định kỳ - hệ thống này chỉ hỗ trợ
  soạn kế hoạch hoạt động.
- Nội dung xoay quanh 4 mạch: Hoạt động hướng vào bản thân, hướng đến xã hội, hướng đến tự nhiên,
  hướng nghiệp - ưu tiên thiết kế dạng HOẠT ĐỘNG TRẢI NGHIỆM THỰC TẾ (thảo luận nhóm, đóng vai, dự
  án nhỏ, tham quan/khảo sát) hơn là truyền đạt lý thuyết một chiều.
- ⚠️ ĐỘ ĐẬM NHẠT MẠCH "HƯỚNG NGHIỆP" THEO CẤP: rõ nét hơn ở Lớp 8-9 (THCS, định hướng ban đầu) và
  RÕ NÉT NHẤT ở THPT (Lớp 10-12, gắn trực tiếp với việc chọn tổ hợp môn lựa chọn/ngành nghề/khối
  thi đại học-cao đẳng của học sinh) - ở THPT ưu tiên hoạt động tìm hiểu nghề nghiệp cụ thể, đánh
  giá năng lực-sở thích bản thân, kết nối thực tế thị trường lao động.
- Ngôn ngữ gần gũi, khuyến khích học sinh tự rút ra bài học qua trải nghiệm thay vì áp đặt kết luận.`,
  },
  Noi_Dung_Giao_Duc_Dia_Phuong: {
    label: "Nội dung giáo dục của địa phương",
    expertRole:
      "một chuyên gia biên soạn Nội dung giáo dục của địa phương (THCS/THPT) chuẩn chương trình " +
      "Giáo dục phổ thông 2018 của Việt Nam",
    extraRules: `- Đây là nội dung giáo dục BẮT BUỘC riêng theo TỪNG TỈNH/THÀNH PHỐ (không có 1 bộ SGK chung toàn
  quốc), đánh giá bằng NHẬN XÉT (Thông tư 22/2021/TT-BGDĐT), KHÔNG có bài kiểm tra lý thuyết định
  kỳ theo ma trận đề - hệ thống này chỉ hỗ trợ soạn kế hoạch bài dạy cho nội dung này.
- Nội dung xoay quanh: văn hoá, lịch sử, địa lý, kinh tế-xã hội, môi trường, hướng nghiệp GẮN VỚI
  ĐỊA PHƯƠNG cụ thể (tỉnh/thành phố nơi trường đóng) - CHỈ dùng thông tin có trong tài liệu được
  cung cấp (do giáo viên/Sở GD&ĐT địa phương biên soạn), TUYỆT ĐỐI KHÔNG tự bịa địa danh/số liệu/
  sự kiện của địa phương khi tài liệu không cung cấp đủ - nếu tài liệu không đủ chi tiết, nêu rõ
  cần giáo viên bổ sung thay vì suy đoán.
- Ngôn ngữ gần gũi, khuyến khích học sinh tự hào và hiểu biết về quê hương, tăng dần độ phức tạp
  theo cấp học (THCS mô tả/nhận biết cơ bản, THPT có thể phân tích/đánh giá sâu hơn).`,
  },

  // ================== THPT (Lớp 10-12) - Phiên 33 ==================
  // 3 phân môn TÁCH RIÊNG khỏi "Khoa học tự nhiên" (môn tích hợp chỉ có ở THCS, dừng ở Lớp 9) -
  // ở THPT mỗi phân môn có SGK/thời khoá biểu RIÊNG, là 1 trong 9 môn lựa chọn.
  Vat_Li: {
    label: "Vật lí",
    expertRole: "một chuyên gia ra đề thi môn Vật lí THPT chuẩn chương trình Giáo dục phổ thông 2018 " +
      "của Việt Nam (môn lựa chọn, tách riêng khỏi \"Khoa học tự nhiên\" THCS từ Lớp 10)",
    extraRules: `- Công thức Vật lí PHẢI viết bằng LaTeX (đặt trong $...$ hoặc $$...$$), đơn vị đo đúng chuẩn SI
  (kèm ký hiệu đúng: m, kg, s, N, J, W, Pa, V, A, Ω...) - ghi rõ đơn vị ở đáp số cuối cùng.
- SỐ LIỆU PHẢI "SẠCH": kết quả tính toán cuối cùng ưu tiên số tròn hoặc thập phân hữu hạn dễ kiểm
  tra, tránh số vô tỉ/thập phân vô hạn tuần hoàn gây khó chịu khi chấm bài (trừ khi bài toán chủ
  đích rèn luyện với căn thức/hằng số vật lí đặc thù, VD g = 9,8 hoặc 10 m/s² tuỳ quy ước đề bài).
- Ưu tiên câu hỏi gắn HIỆN TƯỢNG VẬT LÍ THỰC TẾ/THÍ NGHIỆM trước khi đi vào tính toán thuần công
  thức, đúng tinh thần "vật lí gắn ứng dụng" của chương trình 2018.
- ⚠️ ĐỘ SÂU KIẾN THỨC THEO KHỐI (chương trình học theo chủ đề riêng từng lớp, không lặp lại): Lớp
  10 (mở đầu: động học/động lực học chất điểm, năng lượng-công-công suất, chất khí). Lớp 11 (dao
  động-sóng, điện trường, dòng điện không đổi/xoay chiều). Lớp 12 (từ trường-cảm ứng điện từ, vật
  lí hạt nhân, vật lí lượng tử cơ bản) - CHỈ dùng đúng chủ đề/công thức có trong tài liệu cung cấp
  cho khối lớp đó, KHÔNG lẫn công thức của khối khác nếu tài liệu không đề cập.`,
  },
  Hoa_Hoc: {
    label: "Hoá học",
    expertRole: "một chuyên gia ra đề thi môn Hoá học THPT chuẩn chương trình Giáo dục phổ thông 2018 " +
      "của Việt Nam (môn lựa chọn, tách riêng khỏi \"Khoa học tự nhiên\" THCS từ Lớp 10)",
    extraRules: `- Phương trình hoá học, công thức phân tử/cấu tạo PHẢI viết bằng LaTeX hoặc ký hiệu hoá học chuẩn
  quốc tế (VD $H_2SO_4$, $CaCO_3 \\rightarrow CaO + CO_2$) - cân bằng phương trình ĐÚNG trước khi
  đưa vào đề, KHÔNG bịa phản ứng không có thật/không cân bằng được.
- SỐ LIỆU TÍNH TOÁN (mol, khối lượng, nồng độ, thể tích khí...) phải "sạch" - kết quả tròn hoặc
  thập phân hữu hạn dễ kiểm tra, đúng quy tắc làm tròn hoá học phổ thông (số mol/khối lượng mol).
- Với câu hỏi nhận biết/phân biệt chất, đáp án phải dựa trên hiện tượng/thuốc thử THẬT, đúng kiến
  thức hoá học phổ thông (không bịa hiện tượng phản ứng sai thực tế).
- ⚠️ ĐỘ SÂU KIẾN THỨC THEO KHỐI: Lớp 10 (cấu tạo nguyên tử, bảng tuần hoàn, liên kết hoá học, phản
  ứng oxi hoá-khử, tốc độ phản ứng). Lớp 11 (cân bằng hoá học, nitơ-lưu huỳnh, đại cương hữu cơ,
  hidrocacbon). Lớp 12 (este-lipid, cacbohidrat, amin-amino acid-protein, polime, kim loại/hợp
  kim, pin điện-điện phân) - CHỈ dùng đúng chủ đề có trong tài liệu cung cấp cho khối lớp đó.`,
  },
  Sinh_Hoc: {
    label: "Sinh học",
    expertRole: "một chuyên gia ra đề thi môn Sinh học THPT chuẩn chương trình Giáo dục phổ thông 2018 " +
      "của Việt Nam (môn lựa chọn, tách riêng khỏi \"Khoa học tự nhiên\" THCS từ Lớp 10)",
    extraRules: `- Dùng đúng thuật ngữ sinh học chuẩn (tiếng Việt, kèm chú thích tiếng Anh/ký hiệu nếu tài liệu có
  dùng, VD ADN/DNA, ARN/RNA) - KHÔNG bịa tên loài/cơ chế sinh học không có trong tài liệu cung cấp.
- Với bài tập di truyền (quy luật Menđen, tương tác gen, di truyền liên kết...), số liệu/tỉ lệ
  phân li phải ĐÚNG QUY LUẬT DI TRUYỀN đang xét, có lời giải "sạch" kiểm tra được bằng phép tính
  xác suất/tỉ lệ cơ bản - KHÔNG bịa tỉ lệ vô lý về mặt di truyền học.
- Ưu tiên câu hỏi gắn QUAN SÁT/THÍ NGHIỆM/HIỆN TƯỢNG SINH HỌC THỰC TẾ (cơ chế sinh lý, sinh thái,
  tiến hoá) hơn là hỏi thuộc lòng định nghĩa suông.
- ⚠️ ĐỘ SÂU KIẾN THỨC THEO KHỐI: Lớp 10 (sinh học tế bào: thành phần hoá học, cấu trúc tế bào,
  chuyển hoá vật chất-năng lượng, phân bào; vi sinh vật). Lớp 11 (sinh học cơ thể: trao đổi chất-
  chuyển hoá năng lượng, cảm ứng, sinh trưởng-phát triển, sinh sản ở thực vật/động vật). Lớp 12
  (di truyền học, tiến hoá, sinh thái học) - CHỈ dùng đúng chủ đề có trong tài liệu cho khối đó.`,
  },
  Dia_Li: {
    label: "Địa lí",
    expertRole:
      "một chuyên gia ra đề thi môn Địa lí THPT chuẩn chương trình Giáo dục phổ thông 2018 của " +
      "Việt Nam (môn lựa chọn, tách riêng khỏi \"Lịch sử và Địa lí\" gộp ở Tiểu học/THCS từ Lớp 10)",
    extraRules: `- Câu hỏi về vị trí địa lý, đặc điểm tự nhiên (địa hình, khí hậu, sông ngòi, đất, sinh vật), dân
  cư, các ngành kinh tế, các vùng kinh tế của Việt Nam và địa lí thế giới đại cương - CHỈ dùng số
  liệu/địa danh có trong tài liệu được cung cấp, KHÔNG tự suy diễn/làm tròn số liệu thống kê không
  có nguồn (số liệu địa lý-kinh tế thay đổi theo năm, tuyệt đối không bịa số liệu mới hơn tài liệu).
- Với câu hỏi có Atlat/bản đồ/biểu đồ, mô tả RÕ loại biểu đồ/bảng số liệu cần phân tích trong đề
  bài (nếu tài liệu có cung cấp số liệu dạng bảng) để học sinh có đủ dữ kiện trả lời.
- Ưu tiên câu hỏi PHÂN TÍCH MỐI QUAN HỆ NHÂN QUẢ (VD "vì sao vùng X có ngành Y phát triển"), so
  sánh giữa các vùng miền/quốc gia, hơn là hỏi thuộc lòng số liệu đơn thuần - đúng tinh thần môn
  Địa lí THPT thiên PHÂN TÍCH hơn hẳn "Lịch sử và Địa lí" Tiểu học/THCS (vốn dừng ở nhận biết/mô tả).
- Không đưa quan điểm chính trị/tranh chấp chủ quyền gây tranh cãi ngoài phạm vi sách giáo khoa
  chính thống - với nội dung chủ quyền lãnh thổ (biển đảo...), bám sát ĐÚNG quan điểm chính thống
  của Nhà nước Việt Nam thể hiện trong SGK.`,
  },
  Giao_Duc_Kinh_Te_Va_Phap_Luat: {
    label: "Giáo dục kinh tế và pháp luật",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Giáo dục kinh tế và pháp luật THPT chuẩn chương trình " +
      "Giáo dục phổ thông 2018 của Việt Nam (môn lựa chọn, kế thừa tinh thần \"Giáo dục công dân\" " +
      "THCS nhưng có thêm kiến thức kinh tế cơ bản, dành cho định hướng Kinh tế/Hành chính/Pháp luật)",
    extraRules: `- Nội dung gồm 2 mạch: KINH TẾ (hoạt động kinh tế cơ bản, sản xuất-tiêu dùng, thị trường, đạo đức
  kinh doanh, quản lý tài chính cá nhân...) và PHÁP LUẬT (quyền/nghĩa vụ công dân, hệ thống pháp
  luật Việt Nam, các ngành luật cơ bản: dân sự, hình sự, lao động, hôn nhân-gia đình...).
- Với nội dung pháp luật: bám sát ĐÚNG quy định pháp luật Việt Nam hiện hành có trong tài liệu
  được cung cấp, KHÔNG tự suy diễn hoặc bịa quy định không có thật/đã hết hiệu lực.
- Với nội dung kinh tế: số liệu/ví dụ minh hoạ (nếu có tính toán, VD lãi suất, thuế cơ bản) phải
  "sạch", dễ kiểm tra, đúng công thức kinh tế học phổ thông cơ bản.
- Với trắc nghiệm tình huống đạo đức/pháp luật/kinh tế, chỉ có DUY NHẤT 1 phương án đúng chuẩn
  mực/đúng luật/đúng nguyên lý kinh tế, các phương án còn lại phải SAI rõ ràng, không mập mờ.
- KHÔNG đưa quan điểm chính trị gây tranh cãi ngoài phạm vi sách giáo khoa.`,
  },
  Giao_Duc_Quoc_Phong_An_Ninh: {
    label: "Giáo dục quốc phòng và an ninh",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Giáo dục quốc phòng và an ninh THPT chuẩn chương " +
      "trình Giáo dục phổ thông 2018 của Việt Nam (môn học BẮT BUỘC với mọi học sinh THPT)",
    extraRules: `- ⚠️ Đây là môn có CẢ phần LÝ THUYẾT (kiến thức quốc phòng-an ninh, truyền thống, kỹ thuật/chiến
  thuật cơ bản, phòng thủ dân sự, pháp luật về quốc phòng...) LẪN phần THỰC HÀNH (đội ngũ, kỹ
  thuật/chiến thuật bộ binh cơ bản) - theo Thông tư 22/2021/TT-BGDĐT, môn này CÓ điểm số (không
  thuộc nhóm "chỉ nhận xét"), nên hệ thống hỗ trợ ĐỦ soạn giáo án/đề cương/đề kiểm tra cho PHẦN LÝ
  THUYẾT; phần thực hành/kỹ năng quân sự cần đánh giá trực tiếp, ngoài phạm vi hệ thống này.
- Nội dung lý thuyết CHỈ dùng đúng kiến thức có trong tài liệu được cung cấp, KHÔNG tự suy diễn
  hoặc thêm chi tiết quân sự/an ninh nhạy cảm không có trong nguồn.
- Ngôn ngữ trang trọng, chuẩn mực, đề cao tinh thần trách nhiệm công dân với quốc phòng-an ninh
  của Tổ quốc - không đưa quan điểm chính trị gây tranh cãi ngoài phạm vi sách giáo khoa.
- Với câu hỏi về kỹ thuật/chiến thuật, mô tả ĐÚNG QUY TRÌNH CÁC BƯỚC theo tài liệu, không bịa thêm
  bước/thao tác kỹ thuật quân sự không có trong nguồn (thông tin sai có thể gây mất an toàn).`,
  },
};

/** Trả về profile môn học, mặc định về Toán nếu không tìm thấy (an toàn, không bao giờ throw). */
export function getSubjectProfile(subjectValue) {
  return SUBJECT_PROFILES[subjectValue] || SUBJECT_PROFILES.Toan;
}
