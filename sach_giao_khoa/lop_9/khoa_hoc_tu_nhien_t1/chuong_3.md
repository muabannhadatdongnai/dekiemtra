# CHỦ ĐỀ 3: ĐIỆN (CHƯƠNG III - KHOA HỌC TỰ NHIÊN 9)

## BÀI 11: ĐIỆN TRỞ. ĐỊNH LUẬT OHM

### 1. Điện trở của dây dẫn
- **Khái niệm:** Điện trở là đại lượng đặc trưng cho tính chất cản trở dòng điện của đoạn dây dẫn khi có dòng điện chạy qua.
- **Ký hiệu & Đơn vị:**
  - Điện trở ký hiệu là $R$.
  - Đơn vị đo: Ôm (kí hiệu là $\Omega$). Các bội số thường dùng: kilôôm ($1\text{ k}\Omega = 10^3\ \Omega$), mêgaôm ($1\text{ M}\Omega = 10^6\ \Omega$).
- **Sự phụ thuộc của điện trở vào kích thước và bản chất dây dẫn:**
  - Điện trở của một đoạn dây dẫn tỉ lệ thuận với chiều dài $l$ của đoạn dây, tỉ lệ nghịch với tiết diện $S$ của dây và phụ thuộc vào bản chất chất làm dây dẫn:
    $$R = \rho \frac{l}{S}$$
  - Trong đó:
    - $R$: Điện trở của dây dẫn ($\Omega$).
    - $l$: Chiều dài dây dẫn ($\text{m}$).
    - $S$: Tiết diện của dây dẫn ($\text{m}^2$).
    - $\rho$: Điện trở suất của chất làm dây dẫn ($\Omega\cdot\text{m}$).

### 2. Sự phụ thuộc của cường độ dòng điện vào hiệu điện thế
- Cường độ dòng điện $I$ chạy qua một dây dẫn tỉ lệ thuận với hiệu điện thế $U$ đặt vào hai đầu dây dẫn đó.
- Đồ thị biểu diễn sự phụ thuộc của $I$ vào $U$ là một đường thẳng đi qua gốc tọa độ $(0, 0)$.

### 3. Định luật Ohm
- **Phát biểu định luật:** Cường độ dòng điện chạy qua một đoạn dây dẫn tỉ lệ thuận với hiệu điện thế giữa hai đầu dây dẫn và tỉ lệ nghịch với điện trở của nó.
- **Hệ thức:**
  $$I = \frac{U}{R}$$
- **Trong đó:**
  - $I$: Cường độ dòng điện ($\text{A}$).
  - $U$: Hiệu điện thế ($\text{V}$).
  - $R$: Điện trở ($\Omega$).

---

## BÀI 12: ĐOẠN MẠCH NỐI TIẾP, SONG SONG

### 1. Đoạn mạch nối tiếp
Trong đoạn mạch gồm $n$ điện trở mắc nối tiếp ($R_1, R_2, \dots, R_n$):
- **Cường độ dòng điện:** Cường độ dòng điện có giá trị như nhau tại mọi điểm:
  $$I = I_1 = I_2 = \dots = I_n$$
- **Hiệu điện thế:** Hiệu điện thế giữa hai đầu đoạn mạch bằng tổng các hiệu điện thế trên mỗi điện trở:
  $$U = U_1 + U_2 + \dots + U_n$$
  *(Lưu ý: $U_1 = I \cdot R_1$, $U_2 = I \cdot R_2$,... do đó hiệu điện thế giữa hai đầu mỗi điện trở tỉ lệ thuận với điện trở đó).*
- **Điện trở tương đương:** Điện trở tương đương của đoạn mạch nối tiếp bằng tổng các điện trở thành phần:
  $$R_{td} = R_1 + R_2 + \dots + R_n$$
  *(Điện trở tương đương của đoạn mạch nối tiếp luôn lớn hơn từng điện trở thành phần).*

### 2. Đoạn mạch song song
Trong đoạn mạch gồm $n$ điện trở mắc song song ($R_1, R_2, \dots, R_n$):
- **Cường độ dòng điện:** Cường độ dòng điện trong mạch chính bằng tổng cường độ dòng điện chạy qua các mạch nhánh:
  $$I = I_1 + I_2 + \dots + I_n$$
- **Hiệu điện thế:** Hiệu điện thế giữa hai đầu mỗi điện trở bằng hiệu điện thế giữa hai đầu đoạn mạch:
  $$U = U_1 = U_2 = \dots = U_n$$
- **Điện trở tương đương:** Nghịch đảo của điện trở tương đương bằng tổng các nghịch đảo của từng điện trở thành phần:
  $$\frac{1}{R_{td}} = \frac{1}{R_1} + \frac{1}{R_2} + \dots + \frac{1}{R_n}$$
  - *Đối với đoạn mạch gồm 2 điện trở mắc song song:*
    $$R_{td} = \frac{R_1 \cdot R_2}{R_1 + R_2}$$
  *(Điện trở tương đương của đoạn mạch song song luôn nhỏ hơn từng điện trở thành phần).*

---

## BÀI 13: NĂNG LƯỢNG CỦA DÒNG ĐIỆN VÀ CÔNG SUẤT ĐIỆN

### 1. Năng lượng của dòng điện (Điện năng)
- **Khái niệm:** Dòng điện có năng lượng gọi là điện năng. Điện năng có thể chuyển hóa thành các dạng năng lượng khác như nhiệt năng, quang năng, cơ năng, năng lượng hóa học,...
- **Công thức tính điện năng tiêu thụ:**
  $$W = U \cdot I \cdot t$$
- **Trong đó:**
  - $W$: Năng lượng điện tiêu thụ của đoạn mạch ($\text{J}$).
  - $U$: Hiệu điện thế giữa hai đầu đoạn mạch ($\text{V}$).
  - $I$: Cường độ dòng điện qua đoạn mạch ($\text{A}$).
  - $t$: Thời gian dòng điện chạy qua ($\text{s}$).
- **Đơn vị đo:**
  - Đơn vị chuẩn SI là Jun ($\text{J}$). $1\text{ J} = 1\text{ V} \cdot 1\text{ A} \cdot 1\text{ s} = 1\text{ W}\cdot\text{s}$.
  - Đơn vị thực tế là Kilôoát giờ ($\text{kWh}$):
    $$1\text{ kWh} = 3{,}6 \cdot 10^6\text{ J}$$
- **Dụng cụ đo:** Công tơ điện (đồng hồ đo điện năng) dùng để đo lượng điện năng tiêu thụ. 1 "số điện" trên công tơ tương ứng với $1\text{ kWh}$.

### 2. Công suất điện
- **Khái niệm:** Công suất điện của một đoạn mạch đặc trưng cho tốc độ tiêu thụ điện năng của đoạn mạch đó (hoặc tốc độ thực hiện công của dòng điện).
- **Công thức tính công suất điện:**
  $$\mathcal{P} = \frac{W}{t} = U \cdot I$$
- **Các công thức biến đổi (đối với đoạn mạch chỉ có điện trở $R$):**
  $$\mathcal{P} = I^2 \cdot R = \frac{U^2}{R}$$
- **Trong đó:**
  - $\mathcal{P}$: Công suất điện ($\text{W}$).
  - $W$: Điện năng tiêu thụ ($\text{J}$).
  - $t$: Thời gian ($\text{s}$).
  - $U$: Hiệu điện thế ($\text{V}$).
  - $I$: Cường độ dòng điện ($\text{A}$).
- **Đơn vị công suất:** Oát ($\text{W}$). Các bội số: kilôoát ($1\text{ kW} = 10^3\text{ W}$), mêgaoát ($1\text{ MW} = 10^6\text{ W}$).

### 3. Công suất điện định mức
- **Giá trị định mức:** Trên các thiết bị điện thường có ghi hai số liệu định mức, ví dụ: $220\text{ V} - 60\text{ W}$.
  - $220\text{ V}$: Hiệu điện thế định mức để thiết bị hoạt động bình thường.
  - $60\text{ W}$: Công suất điện định mức của thiết bị khi hoạt động ở hiệu điện thế định mức.
- **Ý nghĩa:** Công suất định mức cho biết mức độ tiêu thụ điện năng của thiết bị khi hoạt động bình thường.
