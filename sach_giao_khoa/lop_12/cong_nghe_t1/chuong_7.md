# CHƯƠNG VII: ĐIỆN TỬ TƯƠNG TỰ [2]

---

## BÀI 18: GIỚI THIỆU VỀ ĐIỆN TỬ TƯƠNG TỰ [2]

### I. TÍN HIỆU TƯƠNG TỰ [70, 71]
- **Khái niệm:** Tín hiệu tương tự (analog signal) là tín hiệu có biên độ biến đổi liên tục theo thời gian [71]. Trong kĩ thuật điện tử, tín hiệu tương tự thường là đại lượng điện (điện áp hoặc dòng điện) biến thị theo thời gian [71].
- **Phân loại:** [71]
  - **Tín hiệu tuần hoàn:** Có biên độ và tần số biến thiên tuần hoàn theo dạng hình sin đặc trưng bởi ba thông số: biên độ, tần số, góc pha và lặp lại hình dạng sau mỗi chu kì [71].
  - **Tín hiệu không tuần hoàn:** Không có tính lặp lại tuần hoàn, biến thiên ngẫu nhiên theo thời gian (ví dụ như tín hiệu tiếng nói) [71].
- **Bộ chuyển đổi (Sensor/Microphone):** Là thiết bị trung gian biến đổi các đại lượng vật lí không điện (âm thanh, nhiệt độ, ánh sáng, lực...) thành tín hiệu điện tương tự [70, 71].
  - *Ví dụ về Microphone điện động:* Sóng âm thanh truyền tới làm màng rung dao động, kéo theo cuộn dây đồng gắn trên màng dao động trong khe từ trường của nam châm vĩnh cửu, sinh ra dòng điện xoay chiều tương tự chạy trong dây dẫn [71].

---

### II. MỘT SỐ MẠCH XỬ LÍ TÍN HIỆU TƯƠNG TỰ [71, 72]
Mạch điện tử tương tự được xây dựng từ các linh kiện điện tử cơ bản như điện trở, tụ điện, cuộn cảm, diode, transistor, khuếch đại thuật toán... để thực hiện các chức năng biến đổi và xử lý tín hiệu [72].

Sơ đồ khối của một hệ thống xử lý tín hiệu âm thanh tương tự điển hình: [71]
`Tín hiệu âm thanh gốc -> Bộ chuyển đổi -> Bộ khuếch đại -> Bộ điều chế -> Bộ phát -> Kênh truyền -> Bộ thu -> Bộ giải điều chế -> Bộ khuếch đại công suất -> Loa -> Âm thanh tái tạo` [71]

Các mạch xử lí tương tự cơ bản bao gồm:
1. **Mạch khuếch đại biên độ điện áp:** [72]
   - **Chức năng:** Biến đổi biên độ của tín hiệu lối ra lớn hơn nhiều lần so với tín hiệu lối vào mà không làm thay đổi hình dạng và tần số của tín hiệu [72].
   - **Cấu tạo:** Thường sử dụng transistor làm linh kiện tích cực đóng vai trò đóng cắt hoặc khuếch đại dòng điện kết hợp với các điện trở phân cực \\(R_1, R_2, R_C, R_E\\) [72].
   - **Hệ số khuếch đại điện áp (A):** Xác định bằng tỉ số giữa biên độ tín hiệu lối ra \\(U_{ra}\\) và biên độ tín hiệu lối vào \\(U_{vao}\\): \\(A = \frac{U_{ra}}{U_{vao}}\\) [72].
   - **Ứng dụng:** Xuất hiện phổ biến trong hệ thống truyền truyền thanh, thiết bị tăng âm, mạch tiền khuếch đại cho cảm biến... [72]
2. **Mạch điều chế biên độ (AM):** [72]
   - **Chức năng:** Tín hiệu mang thông tin ban đầu thường có tần số thấp nên rất dễ bị suy hao khi truyền xa [72]. Do đó, người ta sử dụng mạch điều chế để biến đổi biên độ của một sóng mang tần số cao tỷ lệ thuận theo biên độ của tín hiệu mang thông tin tần số thấp [72].
   - **Ứng dụng:** Phát thanh sóng cực ngắn và truyền dữ liệu vô tuyến tầm xa [72].

---

## BÀI 19: KHUẾCH ĐẠI THUẬT TOÁN (OP-AMP) [2, 74]

### I. GIỚI THIỆU CHUNG [74, 75]
- **Khái niệm:** Khuếch đại thuật toán (Operational Amplifier - kí hiệu tắt là OA hoặc Op-amp) là một mạch tích hợp (IC) đặc biệt có hai lối vào, một lối ra và hệ số khuếch đại cực kỳ lớn [74].
- **Kí hiệu và chức năng các chân ngõ vào:** [74, 75]
  - **Lối vào đảo (Inverting Input):** Kí hiệu bằng dấu trừ (-). Khi đưa tín hiệu vào lối này, điện áp lối ra sẽ biến thiên ngược pha (lệch pha \\(180^\circ\\)) so với tín hiệu lối vào [74, 75].
  - **Lối vào không đảo (Non-inverting Input):** Kí hiệu bằng dấu cộng (+). Khi đưa tín hiệu vào lối này, điện áp lối ra sẽ biến thiên đồng pha so với tín hiệu lối vào [74, 75].
- **Sơ đồ chân của một số IC Op-amp thông dụng:** [74, 75]
  - **IC LM741:** Tích hợp đơn (01 bộ OA) đóng gói dạng DIP-8 chân [74, 75]. Sơ đồ chân chuẩn: Chân 2 (lối vào đảo), chân 3 (lối vào không đảo), chân 6 (lối ra), chân 4 (nối nguồn âm \\(-V_{CC}\\)), chân 7 (nối nguồn dương \\(+V_{CC}\\)), chân 1 và chân 5 (hiệu chỉnh bù Offset), chân 8 (bỏ trống - NC) [74, 75].
  - **IC LM324:** Tích hợp đa năng gồm 4 bộ khuếch đại thuật toán độc lập bên trong một vỏ IC 14 chân, giúp tối ưu diện tích mạch điện [74, 75].

---

### II. NGUYÊN LÍ LÀM VIỆC VÀ CÁC ỨNG DỤNG CƠ BẢN [75, 76]
- **Nguyên lí làm việc:** Op-amp khuếch đại sự sai lệch điện áp giữa hai ngõ vào không đảo và ngõ vào đảo theo biểu thức toán học [75]:
  \\(U_{ra} = A \times (U_2 - U_1)\\)
  Trong đó: \\(U_2\\) là điện áp tại lối vào không đảo (+); \\(U_1\\) là điện áp tại lối vào đảo (-); \\(A\\) là hệ số khuếch đại điện áp vòng hở vô cùng lớn (thường đạt từ \\(10^5\\) đến \\(10^6\\) lần) [75].

Vì hệ số khuếch đại \\(A\\) quá lớn, để mạch hoạt động ổn định ở chế độ tuyến tính, người ta phải kết nối thêm mạng phản hồi âm (đưa một phần tín hiệu ngõ ra quay ngược lại ngõ vào đảo) để tạo ra các mạch ứng dụng thực tiễn [75]:

#### 1. Mạch khuếch đại đảo (Inverting Amplifier) [75]
- **Nguyên lí cấu tạo:** Tín hiệu vào \\(U_{vao}\\) được đưa vào ngõ vào đảo (-) thông qua điện trở \\(R_1\\) [75]. Ngõ vào không đảo (+) được nối trực tiếp xuống mát (0V) [75]. Một điện trở phản hồi \\(R_2\\) được nối từ ngõ ra (chân 6) quay lại ngõ vào đảo (chân 2) [75].
- **Công thức tính điện áp lối ra:**
  \\(U_{ra} = -\frac{R_2}{R_1} U_{vao}\\) [75]
- **Hệ số khuếch đại điện áp vòng kín (G):**
  \\(G = \frac{U_{ra}}{U_{vao}} = -\frac{R_2}{R_1}\\) [75]
  *(Dấu âm thể hiện điện áp ra và điện áp vào luôn luôn ngược pha nhau [75]).*

#### 2. Mạch khuếch đại không đảo (Non-inverting Amplifier) [76]
- **Nguyên lí cấu tạo:** Tín hiệu đầu vào \\(U_{vao}\\) được đưa thẳng vào ngõ vào không đảo (+) [76]. Ngõ vào đảo (-) được nối đất qua điện trở \\(R_1\\), đồng thời nối với lối ra qua điện trở phản hồi \\(R_2\\) [76].
- **Công thức tính điện áp lối ra:**
  \\(U_{ra} = (1 + \frac{R_2}{R_1}) U_{vao}\\) [76]
- **Hệ số khuếch đại điện áp (G):**
  \\(G = 1 + \frac{R_2}{R_1}\\) [76]
  *(Điện áp lối ra luôn đồng pha và cùng dấu với điện áp lối vào [76]).*

#### 3. Mạch so sánh (Comparator) [77]
- **Nguyên lí cấu tạo:** Op-amp hoạt động ở chế độ vòng hở (không có phản hồi âm) để so sánh giá trị điện áp đầu vào \\(U_{vao}\\) với một điện áp ngưỡng chuẩn \\(U_{ngưỡng}\\) [77].
- **Nguyên lí hoạt động mạch so sánh đảo:** [77]
  - Nếu \\(U_{vao} > U_{ngưỡng} \Rightarrow U_{ra} = -U_{CC}\\) (Mức nguồn âm tối đa) [77].
  - Nếu \\(U_{vao} < U_{ngưỡng} \Rightarrow U_{ra} = +U_{CC}\\) (Mức nguồn dương tối đa) [77].

#### 4. Mạch cộng đảo (Inverting Adder) [78]
- **Chức năng:** Cho phép cộng gộp nhiều nguồn tín hiệu điện áp ngõ vào riêng biệt thành một điện áp ngõ ra duy nhất [78].
- **Công thức ngõ ra tiêu biểu (với phản hồi \\(R_f\\)):**
  \\(U_{ra} = -R_f \times (\frac{U_{vao1}}{R_1} + \frac{U_{vao2}}{R_2})\\) [78]

---

## BÀI 20: THỰC HÀNH - MẠCH KHUẾCH ĐẠI ĐẢO [2, 79]

### I. MỤC ĐÍCH, YÊU CẦU [79]
- Thực hành lắp ráp chính xác mạch khuếch đại đảo sử dụng IC LM741 trên bo mạch thử (testboard) theo đúng sơ đồ kĩ thuật [79].
- Sử dụng thành thạo đồng hồ vạn năng điện tử để đo đạc thông số điện áp lối vào và lối ra [79].
- Ghi nhận số liệu thực tế, tính toán lý thuyết và phân tích sai số để củng cố vững chắc lý thuyết đã học [79].

---

### II. CHUẨN BỊ THIẾT BỊ VÀ VẬT LIỆU [79]
1. IC khuếch đại thuật toán LM741: 01 chiếc [79].
2. Điện trở ngõ vào \\(R_1 = 1\text{ k}\Omega\\): 01 chiếc [79].
3. Điện trở phản hồi hồi tiếp \\(R_2 = 2,2\text{ k}\Omega\\): 01 chiếc [79].
4. Đồng hồ vạn năng kỹ thuật số (máy đo VOM): 01 chiếc [79].
5. Nguồn điện xoay chiều một chiều đối xứng \\(\pm 12\text{ V}\\): 01 bộ nguồn ổn áp [79].
6. Pin khô \\(1,5\text{ V}\\): 03 quả để làm nguồn tạo điện áp lối vào biến đổi [79].
7. Bo mạch thử (breadboard), dây cắm mạch chuyên dụng, kìm tuốt dây [79].

---

### III. QUY TRÌNH THỰC HÀNH CHI TIẾT [80]
- **Bước 1:** Kiểm tra chất lượng và trị số chính xác của các điện trở \\(R_1, R_2\\) bằng đồng hồ vạn năng ở thang đo điện trở \\(\Omega\\) [80].
- **Bước 2:** Thực hiện cắm IC LM741 vào khe giữa của testboard [80]. Tiến hành đấu nối mạch theo sơ đồ nguyên lý (Hình 20.1) [79, 80]:
  - Chân 3 (không đảo) nối dây xuống mát (GND) [79, 80].
  - Chân 2 (đảo) nối với một đầu điện trở \\(R_1\\) (đầu còn lại của \\(R_1\\) dùng nhận áp vào \\(U_{vao}\\)), và nối với một đầu điện trở \\(R_2\\) [79, 80].
  - Chân 6 (lối ra) nối với đầu còn lại của điện trở phản hồi \\(R_2\\) [79, 80].
  - Chân 7 kết nối với cực dương \\(+12\text{ V}\\) của nguồn nuôi đối xứng [79, 80].
  - Chân 4 kết nối với cực âm \\(-12\text{ V}\\) của nguồn nuôi đối xứng [79, 80].
- **Bước 3:** Rà soát kiểm tra toàn bộ dây cắm để đảm bảo mạch không bị chạm chập hay đấu nhầm chân nguồn trước khi đóng điện [80].
- **Bước 4:** Tiến hành đo đạc thử nghiệm [80, 81]:
  - Bật nguồn cấp nguồn nuôi \\(\pm 12\text{ V}\\) cho bo mạch [80].
  - Lần lượt đặt các mức điện áp một chiều đầu vào \\(U_{vao} = [0\text{ V}, 1,5\text{ V}, 3\text{ V}, -1,5\text{ V}, -3\text{ V}]\\) [81].
  - Dùng thang đo DCV của đồng hồ vạn năng để đo giá trị thực tế của điện áp đầu ra \\(U_{ra}\\) tại chân 6 so với điểm mát (GND) [80].
  - Ghi số liệu thực tế đo được vào bảng báo cáo để đối chiếu so sánh với điện áp tính toán theo lý thuyết (với tỉ số phản hồi \\(U_{ra} = -2,2 \times U_{vao}\\)) [80, 81].
- **Bước 5:** Tắt nguồn, tháo dỡ thiết bị gọn gàng và hoàn thành báo cáo nhận xét thực hành [80].

---

## TỔNG KẾT CHƯƠNG VII: SƠ ĐỒ HỆ THỐNG KIẾN THỨC [82]

```
                                 ┌─────────────────────────────────┐
                                 │   CHƯƠNG VII: ĐIỆN TỬ TƯƠNG TỰ  │
                                 └────────────────┬────────────────┘
                                                  │
         ┌────────────────────────────────────────┼────────────────────────────────────────┐
         ▼                                        ▼                                        ▼
┌───────────────────────────┐            ┌───────────────────────────┐            ┌───────────────────────────┐
│  Bài 18: Giới thiệu       │            │  Bài 19: Khuếch đại       │            │  Bài 20: Thực hành        │
│  về Điện tử tương tự      │            │  thuật toán (Op-amp)      │            │  Mạch khuếch đại đảo      │
└────────┬──────────────────┘            └────────┬──────────────────┘            └────────┬──────────────────┘
         │                                        │                                        │
         ├─ Tín hiệu tương tự [71]                ├─ Khái niệm Op-amp [74]                 ├─ Lắp ráp mạch đảo [79, 80]
         │  (Biến đổi liên tục,                   │  (2 ngõ vào: đảo (-)                   │  sử dụng IC LM741
         │   tuần hoàn/không tuần hoàn)           │   và không đảo (+))                    │
         │                                        │                                        ├─ Khảo sát & đo đạc [80, 81]
         └─ Mạch xử lí tín hiệu [71, 72]          ├─ Nguyên lí làm việc [75]               │  U_ra tương ứng U_vao
            (Mạch khuếch đại biên độ,             │  (U_ra = A*(U_2 - U_1))                │
             Mạch điều chế biên độ AM)            │                                        └─ Đối chiếu lí thuyết [80, 81]
                                                  ├─ Các mạch ứng dụng [75, 76]               (U_ra = -(R2/R1)*U_vao)
                                                  │  (Khuếch đại đảo,
                                                  │   Khuếch đại không đảo,
                                                  │   Mạch so sánh, mạch cộng)
```
