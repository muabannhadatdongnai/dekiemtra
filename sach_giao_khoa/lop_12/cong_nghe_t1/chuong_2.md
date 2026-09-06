# CHƯƠNG II: HỆ THỐNG ĐIỆN QUỐC GIA [14]

---

## BÀI 3: MẠCH ĐIỆN XOAY CHIỀU BA PHA [15]

### I. KHÁI NIỆM VÀ NGUYÊN LÍ TẠO DÒNG ĐIỆN XOAY CHIỀU BA PHA [15, 16]

#### 1. Khái niệm dòng điện xoay chiều một pha [15, 16]
* **Dòng điện xoay chiều một pha:** Là dòng điện biến thiên tuần hoàn theo dạng hình sin, được đặc trưng bởi các thông số như trị số cực đại (biên độ) $I_m$ (A), tốc độ góc $\omega$ (rad/s), pha ban đầu $\psi$ (rad), trị số hiệu dụng $I = \frac{I_m}{\sqrt{2}}$ (A), chu kì $T = \frac{2\pi}{\omega}$ (s) và tần số $f = \frac{1}{T}$ (Hz) [16].
* **Mạch điện xoay chiều ba pha:** Được tạo ra trong mạch điện ba pha, bao gồm ba thành phần chính: **nguồn điện ba pha**, **đường dây truyền tải ba pha** và **tải điện ba pha** [16]. Hệ thống điện ba pha được ứng dụng rộng rãi và đóng vai trò xương sống trong hầu hết các hoạt động sản xuất công nghiệp và đời sống sinh hoạt [16].

#### 2. Nguyên lí tạo dòng điện xoay chiều ba pha [16, 17]
Để tạo ra nguồn dòng điện xoay chiều ba pha, người ta sử dụng máy phát điện xoay chiều ba pha [16]. Thiết bị này hoạt động dựa trên định luật cảm ứng điện từ và có cấu tạo cơ bản gồm:
* **Phần tĩnh (Stator):** Là lõi thép có xẻ rãnh, đặt ba cuộn dây giống hệt nhau kí hiệu là **AX (pha A)**, **BY (pha B)**, và **CZ (pha C)** [17]. Các cuộn dây này có cùng số vòng dây, cùng tiết diện dây và được đặt lệch nhau một góc $120^\circ$ (tương đương $\frac{2\pi}{3}$ rad) dọc theo chu vi của stator [17]. Mỗi cuộn dây được gọi là một pha [17].
* **Phần quay (Rotor):** Là một nam châm điện mạnh [17]. Khi rotor được quay với tốc độ góc $\omega$ không đổi bởi một động cơ sơ cấp, từ trường của nam châm sẽ lần lượt quét qua các cuộn dây stator và cảm ứng nên trong mỗi cuộn dây một suất điện động xoay chiều hình sin [17].

Do ba cuộn dây hoàn toàn đối xứng và đặt lệch nhau góc $120^\circ$, các suất điện động cảm ứng xuất hiện trong các pha sẽ **có cùng biên độ $E_m$, cùng tần số $\omega$ nhưng lệch pha nhau một góc $\frac{2\pi}{3}$ rad** [17]. Biểu thức các suất điện động tức thời của ba pha tương ứng là:
$$e_A = E_m \sin(\omega t)$$
$$e_B = E_m \sin\left(\omega t - \frac{2\pi}{3}\right)$$
$$e_C = E_m \sin\left(\omega t - \frac{4\pi}{3}\right) = E_m \sin\left(\omega t + \frac{2\pi}{3}\right)$$

---

### II. CÁCH NỐI NGUỒN VÀ TẢI BA PHA [17]

Nguồn và tải ba pha được kết nối với nhau thông qua đường dây ba pha [17]. Tuỳ theo nhu cầu kĩ thuật, nguồn và tải thường được nối theo hai cách cơ bản: **nối hình sao (Y)** hoặc **nối hình tam giác ($\Delta$)** [17].

#### 1. Cách nối nguồn điện ba pha [17]
* **Nối hình sao (Y):** Ba điểm cuối **X, Y, Z** của ba cuộn dây nguồn được liên kết chung lại với nhau tạo thành một điểm gọi là **điểm trung tính O** [17]. Ba điểm đầu **A, B, C** được nối ra ba đường dây pha [17]. Nếu có thêm dây dẫn nối từ điểm trung tính O ra ngoài thì gọi là **dây trung tính** (mạch ba pha bốn dây), ngược lại nếu không có dây trung tính thì gọi là mạch ba pha ba dây [17].
* **Nối hình tam giác ($\Delta$):** Đầu của pha này được nối nối tiếp với cuối của pha kia để tạo thành một vòng kín: điểm cuối **X** nối với đầu **B**, cuối **Y** nối với đầu **C**, và cuối **Z** nối với đầu **A** [17]. Các điểm nối này được dẫn ra ba dây pha [17].

#### 2. Cách nối tải ba pha [17]
* Tương tự như nguồn, tải ba pha (gồm ba nhánh tải $Z_A, Z_B, Z_C$) cũng được nối theo hình sao (có dây trung tính hoặc không có dây trung tính) hoặc nối hình tam giác tùy theo thông số điện áp của tải và nguồn [17].

---

### III. MẠCH ĐIỆN BA PHA ĐỐI XỨNG [17, 19]

#### 1. Khái niệm mạch điện ba pha đối xứng [17]
Mạch điện ba pha được gọi là đối xứng khi đáp ứng đồng thời hai điều kiện:
1. **Nguồn điện ba pha đối xứng:** Ba pha nguồn có biên độ suất điện động bằng nhau, tần số bằng nhau và lệch pha nhau một góc $120^\circ$ [17].
2. **Tải điện ba pha đối xứng:** Trở kháng tải của ba pha bằng nhau cả về trị số lẫn góc pha: $Z_A = Z_B = Z_C$ [17].

#### 2. Các thông số dây và thông số pha trong mạch đối xứng [17, 19]
* **Thông số dây (Dây):** Dòng điện chạy trên dây pha kí hiệu là dòng điện dây ($I_d$), điện áp giữa hai dây pha gọi là điện áp dây ($U_d$) [17].
* **Thông số pha (Pha):** Dòng điện chạy trong mỗi pha nguồn hoặc tải gọi là dòng điện pha ($I_p$), điện áp đo trên mỗi pha gọi là điện áp pha ($U_p$) [17].

Trong điều kiện mạch ba pha đối xứng, mối quan hệ giữa thông số dây và thông số pha được xác định như sau:
* **Khi nối hình sao (Y):** [17]
  $$I_d = I_p$$
  $$U_d = \sqrt{3} U_p$$
* **Khi nối hình tam giác ($\Delta$):** [19]
  $$I_d = \sqrt{3} I_p$$
  $$U_d = U_p$$

> **Ví dụ tính toán thực tế [19]:** Một tải ba pha đối xứng gồm 3 điện trở $R = 50\ \Omega$ nối hình tam giác, đấu vào nguồn điện ba pha đối xứng có điện áp dây $U_d = 380$ V.
> * Vì tải nối tam giác nên điện áp pha của tải bằng điện áp dây: $U_p = U_d = 380$ V [19].
> * Dòng điện pha của tải là: $I_p = \frac{U_p}{R} = \frac{380}{50} = 7,6$ A [19].
> * Dòng điện dây cấp cho tải là: $I_d = \sqrt{3} I_p \approx \sqrt{3} \times 7,6 \approx 13,16$ A [19].

---
---

## BÀI 4: HỆ THỐNG ĐIỆN QUỐC GIA [18]

### I. CẤU TRÚC CHUNG CỦA HỆ THỐNG ĐIỆN QUỐC GIA [18, 20]

Hệ thống điện quốc gia là một hệ thống liên kết vật lí chặt chẽ gồm các thành phần **sản xuất (phát điện), truyền tải, phân phối và sử dụng (tiêu thụ) điện năng** trên phạm vi toàn lãnh thổ quốc gia [18]. Các khâu này hoạt động đồng thời và tức thời (quá trình sản xuất và tiêu thụ diễn ra đồng thời vì điện năng không thể lưu trữ trực tiếp với số lượng cực lớn một cách dễ dàng) [18].

Sơ đồ cấu trúc tổng quát của hệ thống điện quốc gia bao gồm [20]:

```
┌─────────────────┐       ┌──────────────────────┐       ┌──────────────────────┐       ┌─────────────────┐
│  NGUỒN ĐIỆN     │ ───►  │ LƯỚI ĐIỆN TRUYỀN TẢI │ ───►  │ LƯỚI ĐIỆN PHÂN PHỐI  │ ───►  │ TẢI TIÊU THỤ    │
│  (Nhà máy điện) │       │ (Cao áp & Siêu cao)  │       │ (Trung áp & Hạ áp)   │       │ (Hộ GD, Nhà máy)│
└─────────────────┘       └──────────────────────┘       └──────────────────────┘       └─────────────────┘
```

---

### II. VAI TRÒ CỦA CÁC THÀNH PHẦN TRONG HỆ THỐNG ĐIỆN QUỐC GIA [19, 20]

#### 1. Nguồn điện [19]
* **Vai trò:** Là điểm đầu của hệ thống, thực hiện nhiệm vụ biến đổi các dạng năng lượng khác (cơ năng của nước/gió, nhiệt năng của nhiên liệu hoá thạch, năng lượng phản ứng hạt nhân, năng lượng ánh sáng mặt trời...) thành điện năng và cung cấp cho toàn bộ lưới điện quốc gia [19].
* **Thành phần:** Gồm các nhà máy phát điện (thuỷ điện, nhiệt điện than/khí, điện hạt nhân, điện gió, điện mặt trời...) [19]. Các nhà máy này thường phát ra điện ở cấp điện áp trung thế (từ vai kV đến vài chục kV) [19]. Sau đó, thông qua các máy biến áp tăng áp tại trạm điện nhà máy, điện áp được nâng lên mức rất cao để đưa vào lưới điện truyền tải [19].

#### 2. Lưới điện [19]
Lưới điện đóng vai trò huyết mạch kết nối nguồn điện với các nơi tiêu thụ [19]. Lưới điện quốc gia được chia thành hai phân hệ chính dựa trên cấp điện áp và nhiệm vụ [19]:
* **Lưới điện truyền tải:** Có cấp điện áp cao áp và siêu cao áp (ở Việt Nam chủ yếu là các đường dây và trạm biến áp cấp **500 kV, 220 kV**) [19]. Nhiệm vụ của nó là truyền tải dòng điện năng công suất lớn đi xa (liên vùng, liên tỉnh) từ các nhà máy điện chính tới trạm biến áp phân phối trung tâm một cách kinh tế, giảm thiểu hao tổn điện năng trên đường dây [19].
* **Lưới điện phân phối:** Có cấp điện áp trung áp và hạ áp (**từ 110 kV trở xuống như 110 kV, 35 kV, 22 kV, 6 kV, 0,4 kV**) [19]. Nhiệm vụ của nó là nhận điện năng từ lưới truyền tải, thông qua các trạm biến áp hạ áp để phân chia dòng điện tới các hộ tiêu thụ công nghiệp, thương mại và dân dụng [19].

> **Thông tin bổ sung:** Đường dây truyền tải siêu cao áp **500 kV Bắc – Nam (Mạch 1)** có chiều dài **1.487 km** với **3.437 cột điện tháp sắt** [19]. Đường dây được khởi công ngày **05/04/1992** và khánh thành ngày **27/05/1994** [19]. Công trình vĩ đại này đóng vai trò quyết định trong việc thống nhất lưới điện cả nước, truyền tải lượng điện năng dư thừa từ miền Bắc cấp bách bù đắp cho sự thiếu hụt năng lượng nghiêm trọng của miền Nam thời kì đó [19].

#### 3. Tải tiêu thụ [19]
* **Vai trò:** Tiêu thụ năng lượng điện từ lưới điện, biến đổi điện năng thành các dạng năng lượng hữu ích khác (cơ năng cho động cơ, nhiệt năng cho lò sấy/bình sưởi, quang năng cho chiếu sáng...) nhằm phục vụ trực tiếp cho hoạt động sản xuất công nghiệp, dịch vụ và sinh hoạt gia đình [19].

---
---

## BÀI 5: SẢN XUẤT ĐIỆN NĂNG [21]

### I. KHÁI NIỆM VỀ SẢN XUẤT ĐIỆN NĂNG [21]

SẢn xuất điện năng là quá trình biến đổi các dạng năng lượng tự nhiên thành điện năng [21]. Dựa vào khả năng phục hồi của nguồn năng lượng đầu vào, người ta chia làm hai nhóm chính [21]:
* **Nguồn năng lượng tái tạo:** Là những nguồn năng lượng sạch, tự nhiên, có khả năng tự phục hồi liên tục và vô tận như: **nước (thủy năng), gió, ánh sáng mặt trời, sinh khối, địa nhiệt, sóng biển, thủy triều...** [21]
* **Nguồn năng lượng không tái tạo:** Là những nguồn tài nguyên hữu hạn, mất hàng triệu năm để hình thành và sẽ cạn kiệt dần khi khai thác như: **than đá, dầu mỏ, khí tự nhiên, và quặng uranium (năng lượng hạt nhân)...** [21]

---

### II. CÁC PHƯƠNG PHÁP SẢN XUẤT ĐIỆN NĂNG CHỦ YẾU [22, 23, 24]

| Phương pháp sản xuất | Nguyên lí hoạt động cốt lõi | Ưu điểm | Nhược điểm |
| :--- | :--- | :--- | :--- |
| **Thủy điện** [22] | Sử dụng thế năng của nước tích trữ trong hồ chứa cao để tạo dòng chảy mạnh (động năng) làm quay bánh xe turbine, dẫn động trục máy phát điện tạo ra dòng điện [22]. | - Nguồn năng lượng tái tạo, sạch.<br>- Chi phí vận hành, bảo trì rất thấp.<br>- Kết hợp điều tiết lũ, cấp nước tưới tiêu [22]. | - Chi phí đầu tư ban đầu cực lớn.<br>- Thời gian thi công dài.<br>- Làm thay đổi dòng chảy tự nhiên, gây ngập lụt diện rộng vùng lòng hồ [22]. |
| **Nhiệt điện** [22] | Đốt cháy nhiên liệu hóa thạch (than đá, dầu mỏ, khí gas) để đun sôi nước tạo thành hơi nước có nhiệt độ và áp suất cực cao, đẩy cánh quạt turbine quay để chạy máy phát điện [22]. | - Chi phí đầu tư ban đầu vừa phải.<br>- Thời gian xây dựng nhanh.<br>- Hoạt động rất ổn định, chủ động, không phụ thuộc thời tiết [22]. | - Sử dụng tài nguyên không tái tạo.<br>- Phát thải lượng lớn khí nhà kính ($CO_2$, $SO_2$...) gây biến đổi khí hậu và ô nhiễm xỉ than [22]. |
| **Điện hạt nhân** [23] | Sử dụng năng lượng nhiệt khổng lồ giải phóng từ phản ứng phân hạch hạt nhân (thường dùng Uranium) trong lò phản ứng để đun sôi nước tạo hơi áp suất cao làm quay turbine phát điện [23]. | - Công suất phát điện cực kì lớn và liên tục.<br>- Tiết kiệm nhiên liệu vận chuyển.<br>- Hầu như không phát thải khí nhà kính [23]. | - Chi phí xây dựng và tháo dỡ rất đắt đỏ.<br>- Nguy cơ rò rỉ phóng xạ nguy hiểm nếu có sự cố.<br>- Khó xử lí chất thải phóng xạ an toàn [23]. |
| **Điện gió** [23] | Động năng của luồng gió tự nhiên thổi qua làm quay các cánh quạt khổng lồ của turbine gió, thông qua hộp tăng tốc làm quay máy phát điện tạo ra điện năng [23]. | - Nguồn năng lượng tái tạo sạch hoàn toàn.<br>- Không phát thải chất độc hại.<br>- Chiếm ít diện tích mặt đất dưới chân cột [23]. | - Công suất phát điện thấp và không ổn định (phụ thuộc vào thời tiết).<br>- Chi phí lắp đặt cao.<br>- Gây tiếng ồn lớn và ảnh hưởng chim di cư [23]. |
| **Điện mặt trời** [24] | Sử dụng các tấm pin quang điện (thường làm từ bán dẫn Silicon) hấp thụ trực tiếp ánh sáng mặt trời và chuyển hóa trực tiếp thành dòng điện một chiều (DC) nhờ hiệu ứng quang điện [24]. | - Nguồn năng lượng tái tạo dồi dào, vô tận.<br>- Thân thiện với môi trường.<br>- Lắp đặt linh hoạt trên mái nhà, vùng đất cằn cỗi [24]. | - Hiệu suất phụ thuộc vào thời tiết (mây, mưa, ban đêm).<br>- Chi phí đầu tư tấm pin và ác quy lưu trữ cao.<br>- Gây ô nhiễm rác thải pin mặt trời khi hết hạn [24]. |

---
---

## BÀI 6: MẠNG ĐIỆN SẢN XUẤT QUY MÔ NHỎ [25]

### I. CẤU TRÚC CHUNG CỦA MẠNG ĐIỆN SẢN XUẤT QUY MÔ NHỎ [25, 26]

#### 1. Khái niệm và đặc điểm [25]
* Mạng điện sản xuất quy mô nhỏ thường được áp dụng cho các nhà xưởng, cơ sở sản xuất, xí nghiệp gia công vừa và nhỏ có công suất tiêu thụ điện năng từ **vài chục kW đến vài trăm kW** [25].
* **Đặc điểm nổi bật:**
  - Tải tiêu thụ chủ yếu là động cơ điện ba pha kéo máy công cụ (máy CNC, máy hàn, máy tiện, máy khoan bàn...) và hệ thống chiếu sáng nhà xưởng hoạt động công suất lớn [25].
  - Mật độ tải phân bố tương đối tập trung trong không gian phân xưởng [25].
  - Nguồn cấp điện thường được lấy từ đường dây trung thế (22 kV hoặc 35 kV) thông qua trạm biến áp hạ áp riêng hoặc lấy trực tiếp từ lưới hạ áp 380/220 V của khu vực [25].
  - Mạng điện động lực (cấp cho máy móc sản xuất) và mạng điện chiếu sáng, sinh hoạt văn phòng nhà xưởng được thiết kế vận hành hoàn toàn độc lập để tránh nhiễu và đảm bảo an toàn [25].

#### 2. Sơ đồ cấu trúc mạng điện [26]
Sơ đồ mạng điện sản xuất quy mô nhỏ điển hình đi theo mô hình phân cấp mạch lạc sau:

```
Lưới điện phân phối trung thế (22 kV hoặc 35 kV)
       │
       ▼
 ┌───────────┐
 │Trạm hạ áp │ (Hạ xuống điện áp ba pha 380 V / 220 V)
 └─────┬─────┘
       │
       ▼
 ┌─────────────────────────┐
 │Tủ điện phân phối tổng   │ (Đặt tại trạm biến áp, chứa thiết bị đóng cắt bảo vệ)
 └─────┬───────────────────┘
       │
       ├───────────────────────────────┐
       ▼                               ▼
 ┌─────────────────────────┐     ┌─────────────────────────┐
 │Tủ điện phân phối nhánh 1│     │Tủ điện phân phối nhánh 2│ (Đặt tại từng phân xưởng)
 └─────┬───────────────────┘     └─────────────────────────┘
       │
       ├───────────────────────────────┐
       ▼                               ▼
 ┌─────────────────────────┐     ┌─────────────────────────┐
 │Tủ điện động lực         │     │Tủ điện chiếu sáng       │
 └─────┬───────────────────┘     └─────────────────────────┘
       │ (Cấp điện cho)                │ (Cấp điện cho)
       ▼                               ▼
Máy móc sản xuất (Máy CNC, hàn...) Hệ thống đèn chiếu sáng nhà xưởng
```

---

### II. VAI TRÒ CỦA CÁC THIẾT BI TRONG MẠNG ĐIỆN SẢN XUẤT QUY MÔ NHỎ [27]

1. **Trạm biến áp (Trạm hạ áp):** Nhận điện năng từ lưới phân phối trung thế, hạ điện áp xuống cấp điện áp hạ thế thích hợp (thường là ba pha bốn dây 380/220 V) để cung cấp cho các thiết bị sản xuất [27].
2. **Tủ điện phân phối tổng:** Đóng vai trò là đầu mối tiếp nhận nguồn điện hạ áp từ trạm biến áp để phân chia nguồn năng lượng tới các phân xưởng (thông qua các tủ điện phân phối nhánh) [27]. Tủ điện này được trang bị các thiết bị đóng - cắt và bảo vệ tổng công suất lớn như Aptomat (MCCB, ACB) nhằm ngắt điện tự động khi xảy ra ngắn mạch hoặc quá tải toàn hệ thống [27].
3. **Tủ điện phân phối nhánh:** Nhận điện từ tủ tổng, đặt tại lối vào của từng phân xưởng riêng biệt để phân phối tiếp đến các tủ điện động lực và tủ điện chiếu sáng trong phạm vi phân xưởng đó [27].
4. **Tủ điện động lực:** Đóng vai trò cấp nguồn trực tiếp cho các máy sản xuất có công suất lớn (như máy tiện CNC, máy dập, máy khoan...) [27]. Tủ chứa các thiết bị đóng cắt riêng lẻ để bảo vệ an toàn cho từng thiết bị máy móc khi vận hành [27].
5. **Tủ điện chiếu sáng:** Cấp nguồn độc lập cho hệ thống bóng đèn chiếu sáng (đèn LED, đèn huỳnh quang), quạt thông gió trong phân xưởng, giúp duy trì ánh sáng làm việc an toàn ngay cả khi hệ thống động lực gặp sự cố dừng máy [27].
6. **Dây cáp điện:** Đóng vai trò dẫn truyền dòng điện kết nối thông suốt giữa các tủ điện phân phối và các thiết bị tiêu thụ cuối cùng [27].

---
---

## BÀI 7: MẠNG ĐIỆN HẠ ÁP DÙNG TRONG SINH HOẠT [28]

### I. SƠ ĐỒ MẠNG ĐIỆN HẠ ÁP DÙNG TRONG SINH HOẠT [28, 29]

#### 1. Khái niệm và đặc điểm [28]
* Mạng điện hạ áp dùng trong sinh hoạt là một bộ phận cuối cùng của hệ thống điện quốc gia, có nhiệm vụ trực tiếp đưa điện năng từ trạm biến áp khu vực đến công tơ điện của các hộ gia đình phục vụ nhu cầu sinh hoạt, chiếu sáng, giải trí [28].
* **Đặc điểm:**
  - Số lượng hộ tiêu thụ cực kì lớn, phân tán trên diện rộng [28].
  - Công suất tiêu thụ của từng hộ đơn lẻ thường nhỏ, nhưng tổng công suất của toàn khu vực dân cư lại rất lớn [28].
  - Mức điện áp định mức một pha cấp trực tiếp cho hộ gia đình tại Việt Nam là **220 V**, tần số **50 Hz** [28]. Lưới điện phân phối chung ngoài đường phố là lưới ba pha bốn dây (380/220 V) để đảm bảo cân bằng pha [28].

#### 2. Sơ đồ cấu trúc mạng điện hạ áp sinh hoạt [29]
Hệ thống cấp điện sinh hoạt từ lưới điện chung vào nhà dân tuân theo sơ đồ sau:

```
Lưới điện phân phối trung áp (22 kV)
       │
       ▼
 Trạm biến áp hạ áp khu vực (Hạ xuống điện áp 380/220 V)
       │
       ▼
 Tủ điện phân phối tổng của trạm
       │
       ▼
 Tủ điện phân phối khu vực (Tủ điện nhánh dọc các con phố)
       │
       ▼
 Cáp điện hạ áp dọc tuyến đường
       │
       ▼
 Hộp công tơ điện (KWh) của từng hộ gia đình
       │
       ▼
 Aptomat tổng trong nhà dân ──► Các mạch điện trong phòng
```

---

### II. THÔNG SỐ KĨ THUẬT CỦA MẠNG ĐIỆN HẠ ÁP DÙNG TRONG SINH HOẠT [30]

Để mạng điện sinh hoạt hoạt động ổn định và an toàn cho thiết bị gia dụng, lưới điện hạ áp sinh hoạt phải tuân thủ nghiêm ngặt các thông số kĩ thuật định mức sau [30]:

* **Điện áp định mức lưới hạ áp:** [30]
  - Điện áp dây: $380$ V (giữa hai dây pha) [30].
  - Điện áp pha: $220$ V (giữa một dây pha và dây trung tính) [28, 30].
* **Tần số dòng điện định mức:** $50$ Hz [30].
* **Sai số cho phép của các thông số:**
  - **Điện áp:** Độ lệch điện áp cho phép dao động trong khoảng **$\pm$ 5%** so với điện áp định mức (tức là điện áp pha thực tế tại ổ cắm nhà dân được phép dao động ổn định trong khoảng từ $209$ V đến $231$ V) [30].
  - **Tần số:** Độ lệch tần số cho phép dao động trong phạm vi hẹp **$\pm$ 5%** (từ $47,5$ Hz đến $52,5$ Hz) [30].
* **Công suất truyền tải của lưới:** Thường dao động trong khoảng từ **$50$ kW đến $2.500$ kW**, phụ thuộc hoàn toàn vào quy mô dân cư và công suất định mức của máy biến áp hạ thế khu vực được lắp đặt [30].

---
---

## TỔNG KẾT CHƯƠNG II: SƠ ĐỒ HỆ THỐNG KIẾN THỨC [31, 35]

Kiến thức Chương II được tổng hợp toàn diện thông qua sơ đồ cấu trúc hệ thống dưới đây [31]:

```
                                  ┌────────────────────────────────────────────────────────┐
                                  │           HỆ THỐNG ĐIỆN QUỐC GIA (CHƯƠNG II)           │
                                  └───────────────────────────┬────────────────────────────┘
                                                              │
        ┌─────────────────────────────┬───────────────────────┼─────────────────────────────┬─────────────────────────────┐
        ▼                             ▼                       ▼                             ▼                             ▼
┌───────────────┐             ┌───────────────┐       ┌───────────────┐             ┌───────────────┐             ┌───────────────┐
│ 1. MẠCH ĐIỆN  │             │ 2. HỆ THỐNG   │       │ 3. SẢN XUẤT   │             │ 4. MẠNG ĐIỆN  │             │ 5. MẠNG ĐIỆN  │
│ XOAY CHIỀU 3  │             │ ĐIỆN QUỐC GIA │       │ ĐIỆN NĂNG     │             │ SẢN XUẤT QUY  │             │ HẠ ÁP SINH    │
│ PHA [15]      │             │ [18]          │       │ [21]          │             │ MÔ NHỎ [25]   │             │ HOẠT [28]     │
└───────┬───────┘             └───────┬───────┘       └───────┬───────┘             └───────┬───────┘             └───────┬───────┘
        │                             │                       │                             │                             │
  ├─ Khái niệm, cấu             ├─ Cấu trúc chung       ├─ Khái niệm phát             ├─ Đặc điểm, cấu              ├─ Cấu trúc hệ  
  │  tạo máy phát [16,17]       │  (Nguồn, Lưới, Tải)   │  điện từ NL tái             │  trúc (Tủ tổng,             │  thống, sơ đồ 
  ├─ Cách nối hình              ├─ Vai trò của từng     │  tạo & không tái            │  nhánh, động lực,           │  cấp điện [29]
  │  sao (Y), tam               │  khâu [19]            │  tạo [21]                   │  chiếu sáng) [26]           ├─ Thông số kĩ  
  │  giác (Δ) [17]              └─ Vai trò đường        └─ Các nhà máy chính          └─ Vai trò bảo vệ             │  thuật lưới   
  └─ Mối quan hệ                vận hành lưới           (Thủy điện, Nhiệt             và vận hành an                │  điện (220V,  
     Ud/Up và Id/Ip             500 kV Bắc Nam [19]      điện, Hạt nhân,               toàn nhà xưởng [27]           │  50Hz, sai số 
     trong mạch đối                                      Gió, Mặt trời) [22]                                         │  ±5%) [30]
     xứng [17,19]                                                                                                    └───────────────┘
```

---

### CÂU HỎI LUYỆP TẬP & ÔN TẬP CHƯƠNG II [19, 21, 27, 30]
1. *Tại sao máy phát điện xoay chiều ba pha lại có ba cuộn dây giống hệt nhau đặt lệch nhau $120^\circ$? Điều gì xảy ra nếu chúng đặt lệch nhau một góc khác?* [17]
2. *Hãy phân tích tại sao quá trình sản xuất điện năng và tiêu thụ điện năng trong hệ thống điện quốc gia phải diễn ra đồng thời?* [18]
3. *So sánh ưu điểm và nhược điểm của nhà máy điện hạt nhân và nhà máy điện mặt trời về khía cạnh bảo vệ môi trường và độ ổn định công suất.* [23, 24]
4. *Một phân xưởng sản xuất quy mô nhỏ có hệ thống máy CNC cần nguồn điện ổn định cao. Tại sao trong thiết kế mạng điện của phân xưởng, người ta phải tách biệt mạng điện động lực và mạng điện chiếu sáng thành hai hệ thống độc lập?* [25]
5. *Một hộ gia đình sử dụng điện một pha đo được điện áp ổ cắm tại một thời điểm cao điểm là $205$ V. Thông số này có nằm trong sai số điện áp cho phép của mạng điện hạ áp dùng trong sinh hoạt tại Việt Nam không? Tại sao?* [30]
