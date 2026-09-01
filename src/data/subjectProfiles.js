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
    extraRules: `- Công thức Toán học phải viết bằng LaTeX, đặt trong dấu $...$ (inline) hoặc $$...$$ (block).
- SỐ LIỆU PHẢI "ĐẸP" VÀ PHÙ HỢP LỨA TUỔI: với Lớp 1-5, ưu tiên số nguyên hoặc phân số/thập phân
  hữu hạn, kết quả cuối cùng phải là số tròn, dễ kiểm tra (tránh số vô tỉ, thập phân vô hạn,
  phân số quá phức tạp). Với Lớp 6 trở lên có thể dùng căn thức/số vô tỉ nếu phù hợp chương trình,
  nhưng vẫn phải đảm bảo có lời giải "sạch", không sai số làm tròn khó chịu.`,
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
  Lich_Su: {
    label: "Lịch sử",
    expertRole: "một chuyên gia ra đề thi môn Lịch sử chuẩn Bộ Giáo dục Việt Nam",
    extraRules: `- Ưu tiên câu hỏi có mốc thời gian, sự kiện, nhân vật, địa danh lịch sử CỤ THỂ, chính xác theo
  đúng tài liệu được cung cấp - KHÔNG bịa thêm chi tiết lịch sử không có trong nguồn.
- Với câu hỏi trắc nghiệm, các phương án nhiễu (sai) phải là mốc thời gian/sự kiện CÓ THẬT nhưng
  không liên quan trực tiếp đến câu hỏi - không bịa sự kiện giả.
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
      "của Việt Nam (môn dạy xuyên suốt từ Lớp 3 Tiểu học tới hết Lớp 9 THCS)",
    extraRules: `- Nội dung xoay quanh: máy tính và thiết bị số, thông tin và xử lý thông tin, sử dụng phần mềm
  (soạn thảo, trình chiếu, bảng tính), an toàn khi dùng máy tính/Internet, tư duy lập trình - CHỈ
  theo đúng nội dung có trong tài liệu được cung cấp, KHÔNG tự thêm khái niệm vượt quá tài liệu.
- Ưu tiên câu hỏi gắn với thao tác/tình huống sử dụng máy tính thực tế hơn là hỏi lý thuyết suông.
- ⚠️ ĐỘ SÂU KIẾN THỨC THEO KHỐI (khác biệt LỚN giữa Tiểu học và THCS): Lớp 3-5 (Tiểu học) CHỈ dùng
  lập trình trực quan kiểu kéo-thả khối lệnh (Scratch dạng khối, không gõ mã), KHÔNG yêu cầu viết
  mã lệnh/cú pháp lập trình văn bản. Lớp 6-9 (THCS) được phép có nội dung thuật toán cơ bản, cấu
  trúc dữ liệu đơn giản, và bắt đầu làm quen lập trình dạng VĂN BẢN (Scratch nâng cao/Python cơ
  bản) tuỳ đúng nội dung tài liệu cung cấp - KHÔNG áp mức độ Tiểu học cho câu hỏi Lớp 6-9.`,
  },
  Cong_Nghe: {
    label: "Công nghệ",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Công nghệ chuẩn chương trình Giáo dục phổ thông 2018 " +
      "của Việt Nam (môn dạy xuyên suốt từ Lớp 3 Tiểu học tới hết Lớp 9 THCS)",
    extraRules: `- Nội dung xoay quanh: công nghệ trong đời sống, thủ công kỹ thuật, an toàn khi sử dụng dụng
  cụ/thiết bị, trồng trọt/chăn nuôi, và ở THCS có thêm công nghệ trong nông-lâm-ngư nghiệp, thiết
  kế kỹ thuật cơ bản, định hướng nghề nghiệp - CHỈ theo đúng nội dung có trong tài liệu cung cấp.
- Ưu tiên câu hỏi về QUY TRÌNH CÁC BƯỚC, công dụng của đồ dùng/dụng cụ, hoặc an toàn khi sử dụng -
  hơn là hỏi lý thuyết trừu tượng.
- ⚠️ ĐỘ SÂU KIẾN THỨC THEO KHỐI: Lớp 3-5 (Tiểu học) dừng ở mức lắp ráp mô hình đơn giản/đồ thủ
  công/trồng trọt cơ bản, KHÔNG dùng công thức/số liệu kỹ thuật. Lớp 6-9 (THCS) được phép có bản
  vẽ kỹ thuật cơ bản, quy trình công nghệ nhiều bước phức tạp hơn, và nội dung định hướng nghề
  nghiệp (đặc biệt rõ ở Lớp 8-9) - KHÔNG áp mức độ đơn giản của Tiểu học cho câu hỏi Lớp 6-9.`,
  },

  // ================== THCS (Lớp 6-9) - Giai đoạn 32 ==================
  Ngu_Van: {
    label: "Ngữ văn",
    expertRole: "một chuyên gia ra đề kiểm tra/biên soạn nội dung môn Ngữ văn THCS chuẩn chương trình " +
      "Giáo dục phổ thông 2018 của Việt Nam",
    extraRules: `- ⚠️ THEO CÔNG VĂN 3175/BGDĐT-GDTrH (2022, được nhấn mạnh lại ở Công văn 3935/2024): với đề kiểm
  tra/ngữ liệu Đọc hiểu, TUYỆT ĐỐI KHÔNG dùng lại nguyên văn văn bản/đoạn trích ĐÃ CÓ trong SGK -
  phải là ngữ liệu MỚI (có thể cùng tác giả/chủ đề/thể loại nhưng KHÔNG PHẢI đoạn học sinh đã học),
  để đánh giá đúng năng lực đọc hiểu thay vì học thuộc lòng. Đề cương ôn tập được dùng lại ngữ liệu
  SGK vì mục đích ôn tập/hệ thống hoá kiến thức đã học, KHÔNG áp dụng hạn chế này.
- Với dạng bài Tập làm văn/Viết đoạn: phân biệt rõ 3 KIỂU BÀI chính theo chương trình - Nghị luận
  xã hội (bàn về 1 tư tưởng đạo lý/hiện tượng đời sống), Nghị luận văn học (phân tích/cảm nhận tác
  phẩm), và các kiểu bài tự sự/miêu tả/biểu cảm/thuyết minh ở khối đầu cấp (Lớp 6-7) - không nhầm
  lẫn yêu cầu giữa các kiểu bài.
- Với câu hỏi từ vựng/ngữ pháp/Tiếng Việt: bám sát đúng quy tắc chính tả/ngữ pháp tiếng Việt hiện
  hành và đúng phạm vi kiến thức Tiếng Việt của khối lớp (VD biện pháp tu từ, các loại câu, thành
  phần câu - độ phức tạp tăng dần Lớp 6 -> Lớp 9).
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
      "một chuyên gia biên soạn nội dung môn Giáo dục thể chất THCS chuẩn chương trình Giáo dục " +
      "phổ thông 2018 của Việt Nam",
    extraRules: `- Đây là môn THỰC HÀNH VẬN ĐỘNG, đánh giá bằng NHẬN XÉT/kiểm tra kỹ năng thực hành, KHÔNG có bài
  kiểm tra lý thuyết định kỳ theo ma trận đề như các môn kiến thức - hệ thống này chỉ hỗ trợ soạn
  giáo án (kế hoạch bài dạy) cho môn này, không hỗ trợ tạo đề kiểm tra/đề cương ôn tập.
- Giáo án cần nêu rõ: khởi động, bài tập/kỹ thuật chính, trò chơi vận động (nếu có), hồi tĩnh -
  chú trọng AN TOÀN khi vận động, có lưu ý phân hoá thể trạng học sinh khi cần.
- KHÔNG dùng công thức/số liệu học thuật - ngôn ngữ hướng dẫn kỹ thuật động tác cụ thể, dễ hình dung.`,
  },
  Am_Nhac: {
    label: "Âm nhạc",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Âm nhạc THCS chuẩn chương trình Giáo dục phổ thông " +
      "2018 của Việt Nam",
    extraRules: `- Đây là môn NĂNG KHIẾU/THỰC HÀNH, đánh giá bằng NHẬN XÉT, KHÔNG có bài kiểm tra lý thuyết định
  kỳ theo ma trận đề - hệ thống này chỉ hỗ trợ soạn giáo án cho môn này.
- Nội dung xoay quanh: hát, nghe nhạc, nhạc cụ, lý thuyết âm nhạc cơ bản (nhịp, phách, cao độ),
  thường thức âm nhạc (giới thiệu tác giả/tác phẩm/thể loại) - bám sát đúng tài liệu cung cấp.
- KHÔNG bịa tên bài hát/tác giả/tác phẩm không có trong tài liệu được cung cấp.`,
  },
  My_Thuat: {
    label: "Mĩ thuật",
    expertRole:
      "một chuyên gia biên soạn nội dung môn Mĩ thuật THCS chuẩn chương trình Giáo dục phổ thông " +
      "2018 của Việt Nam",
    extraRules: `- Đây là môn NĂNG KHIẾU/THỰC HÀNH, đánh giá bằng NHẬN XÉT, KHÔNG có bài kiểm tra lý thuyết định
  kỳ theo ma trận đề - hệ thống này chỉ hỗ trợ soạn giáo án cho môn này.
- Nội dung xoay quanh: vẽ, nặn, xé dán, thường thức mĩ thuật (giới thiệu tác giả/tác phẩm/trường
  phái), thẩm mĩ ứng dụng - bám sát đúng tài liệu cung cấp, nêu rõ chất liệu/dụng cụ cần chuẩn bị.
- KHÔNG bịa tên tác phẩm/hoạ sĩ không có trong tài liệu được cung cấp.`,
  },
  Hoat_Dong_Trai_Nghiem_Huong_Nghiep: {
    label: "Hoạt động trải nghiệm, hướng nghiệp",
    expertRole:
      "một chuyên gia thiết kế Hoạt động trải nghiệm, hướng nghiệp THCS chuẩn chương trình Giáo " +
      "dục phổ thông 2018 của Việt Nam",
    extraRules: `- Đây là HOẠT ĐỘNG GIÁO DỤC (không phải "môn học" kiến thức thuần tuý), đánh giá bằng NHẬN XÉT,
  KHÔNG có bài kiểm tra lý thuyết định kỳ - hệ thống này chỉ hỗ trợ soạn kế hoạch hoạt động.
- Nội dung xoay quanh 4 mạch: Hoạt động hướng vào bản thân, hướng đến xã hội, hướng đến tự nhiên,
  hướng nghiệp (rõ nét hơn ở Lớp 8-9) - ưu tiên thiết kế dạng HOẠT ĐỘNG TRẢI NGHIỆM THỰC TẾ (thảo
  luận nhóm, đóng vai, dự án nhỏ, tham quan/khảo sát) hơn là truyền đạt lý thuyết một chiều.
- Ngôn ngữ gần gũi, khuyến khích học sinh tự rút ra bài học qua trải nghiệm thay vì áp đặt kết luận.`,
  },
};

/** Trả về profile môn học, mặc định về Toán nếu không tìm thấy (an toàn, không bao giờ throw). */
export function getSubjectProfile(subjectValue) {
  return SUBJECT_PROFILES[subjectValue] || SUBJECT_PROFILES.Toan;
}
