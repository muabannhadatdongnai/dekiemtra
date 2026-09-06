# CHƯƠNG VI: LINH KIỆN ĐIỆN TỬ [46]

---

## BÀI 15: ĐIỆN TRỞ, TỤ ĐIỆN VÀ CUỘN CẢM [47]

Linh kiện điện tử thụ động là các linh kiện không cần cung cấp nguồn năng lượng bên ngoài vẫn có thể hoạt động được, đóng vai trò cơ bản trong hầu hết các mạch điện tử [47].

### I. ĐIỆN TRỞ [47, 48, 49]

#### 1. Công dụng [48]
Điện trở là linh kiện điện tử dùng để:
* **Hạn chế dòng điện:** Kiểm soát mức độ mạnh, yếu của dòng điện chạy trong mạch.
* **Phân chia điện áp:** Tạo ra các mức điện áp khác nhau từ một nguồn điện áp ban đầu nhằm cung cấp cho các khối chức năng của mạch hoạt động ổn định.
* **Phân chia dòng điện:** Sử dụng trong các mạch phân dòng song song.

#### 2. Hình dạng và kí hiệu [48]
* **Hình dạng thực tế:** Có dạng hình trụ tròn với các vạch màu vòng quanh thân (đối với điện trở công suất nhỏ) hoặc dạng khối hộp/hình trụ to có ghi trực tiếp số liệu (đối với điện trở công suất lớn).
* **Phân loại phổ biến:**
  * **Điện trở cố định:** Có trị số điện trở không thay đổi được.
  * **Biến trở (Chiết áp):** Có trị số điện trở thay đổi được bằng cách xoay núm vặn hoặc trượt thanh gạt.
  * **Điện trở nhiệt (Thermistor):** Trị số điện trở biến thiên theo nhiệt độ. Có hai loại:
    * *NTC (Negative Temperature Coefficient):* Hệ số nhiệt điện trở âm, nhiệt độ tăng thì điện trở giảm.
    * *PTC (Positive Temperature Coefficient):* Hệ số nhiệt điện trở dương, nhiệt độ tăng thì điện trở tăng.
  * **Điện trở quang (LDR - Light Dependent Resistor):** Trị số điện trở biến thiên theo cường độ ánh sáng chiếu vào (ánh sáng càng mạnh thì điện trở càng giảm).
* **Kí hiệu trong sơ đồ mạch điện:** Có hai kiểu kí hiệu chính là kiểu Mỹ (đường zigzag) và kiểu Châu Âu (hình chữ nhật) [48].

#### 3. Thông số kĩ thuật cốt lõi [48]
* **Giá trị điện trở ($R$):** Là đại lượng đặc trưng cho khả năng cản trở dòng điện của điện trở. Đơn vị đo là Ohm ($\Omega$), các đơn vị lớn hơn gồm Kiloohm ($k\Omega$) và Megaohm ($M\Omega$) với quy đổi: $1 M\Omega = 10^3 k\Omega = 10^6 \Omega$.
* **Công suất định mức ($P_{đm}$):** Là công suất tiêu hao tối đa trên điện trở mà nó có thể làm việc liên tục trong thời gian dài mà không bị quá nhiệt dẫn đến cháy, đứt vòng dây. Đơn vị đo là Watt (W).

#### 4. Quy tắc đọc số liệu kĩ thuật [48, 49]
Đối với điện trở nhỏ, giá trị điện trở và sai số được mã hóa dưới dạng các vạch màu bao quanh thân. Có hai tiêu chuẩn đọc phổ biến:

##### a. Điện trở 4 vạch màu [49]
* **Vạch 1:** Chỉ chữ số thứ nhất của trị số điện trở.
* **Vạch 2:** Chỉ chữ số thứ hai của trị số điện trở.
* **Vạch 3:** Chỉ hệ số nhân (số mũ của 10, tức là số lượng chữ số 0 thêm vào sau).
* **Vạch 4:** Chỉ dung sai (sai số cho phép).

##### b. Điện trở 5 vạch màu [49]
* **Vạch 1:** Chỉ chữ số thứ nhất của trị số điện trở.
* **Vạch 2:** Chỉ chữ số thứ hai của trị số điện trở.
* **Vạch 3:** Chỉ chữ số thứ ba của trị số điện trở.
* **Vạch 4:** Chỉ hệ số nhân (số mũ của 10).
* **Vạch 5:** Chỉ dung sai.

##### Bảng quy ước mã màu tiêu chuẩn quốc tế [49]:
| Màu sắc | Giá trị số | Hệ số nhân | Sai số (Dung sai) |
| :--- | :---: | :---: | :---: |
| **Đen** | 0 | $10^0 = 1$ | - |
| **Nâu** | 1 | $10^1 = 10$ | $\pm 1\%$ |
| **Đỏ** | 2 | $10^2 = 100$ | $\pm 2\%$ |
| **Cam** | 3 | $10^3 = 1000$ | - |
| **Vàng** | 4 | $10^4 = 10000$ | - |
| **Lục** | 5 | $10^5 = 100000$ | - |
| **Lam** | 6 | $10^6 = 1000000$ | - |
| **Tím** | 7 | - | - |
| **Xám** | 8 | - | - |
| **Trắng** | 9 | - | - |
| **Vàng kim (Nhũ vàng)** | - | $10^{-1} = 0.1$ | $\pm 5\%$ |
| **Bạc (Nhũ bạc)** | - | $10^{-2} = 0.01$ | $\pm 10\%$ |

* **Ví dụ áp dụng:** 
  * Điện trở $R_1$ có 4 vạch màu: *Xanh lục - Xanh lam - Cam - Nhũ vàng* [49].
    * Trị số: $5 	ext{ (lục)} \ | \ 6 	ext{ (lam)} 	imes 10^3 	ext{ (cam)} = 56 	imes 10^3 \Omega = 56 k\Omega$.
    * Sai số: $\pm 5\%$ (nhũ vàng).
  * Điện trở $R_2$ có 5 vạch màu: *Vàng - Tím - Đen - Đỏ - Nâu* [49].
    * Trị số: $4 	ext{ (vàng)} \ | \ 7 	ext{ (tím)} \ | \ 0 	ext{ (đen)} 	imes 10^2 	ext{ (đỏ)} = 470 	imes 10^2 \Omega = 47 k\Omega$.
    * Sai số: $\pm 1\%$ (nâu).

---

### II. TỤ ĐIỆN [50, 51]

#### 1. Công dụng [50]
Tụ điện là linh kiện có khả năng tích lũy năng lượng điện trường, có công dụng:
* **Ngăn dòng điện một chiều (DC):** Chỉ cho dòng điện xoay chiều (AC) đi qua.
* **Lọc nguồn, lọc nhiễu:** San phẳng các xung điện áp mấp mô trong mạch nguồn để tạo ra điện áp một chiều phẳng, ổn định.
* **Tạo mạch cộng hưởng:** Khi kết hợp song song hoặc nối tiếp với cuộn cảm sẽ tạo thành mạch cộng hưởng tần số (sử dụng trong mạch thu phát sóng vô tuyến).
* **Truyền tín hiệu (Liên lạc):** Truyền tín hiệu xoay chiều giữa các tầng khuếch đại điện tử mà không làm ảnh hưởng đến chế độ điện áp một chiều của các linh kiện bán dẫn.

#### 2. Hình dạng và kí hiệu [50]
* **Hình dạng:** Tụ điện có dạng hình trụ (tụ hóa) hoặc dạng dẹt/hình đĩa (tụ gốm, tụ giấy).
* **Phân loại:**
  * **Tụ không phân cực (Tụ thường - tụ gốm, mica, giấy, nilon...):** Không quy định cực tính chân, có thể đấu nối bất kì chiều nào vào mạch.
  * **Tụ phân cực (Tụ hóa):** Có quy định rõ rệt cực Dương (+) và cực Âm (-). Khi lắp đặt phải đấu đúng cực tính (chân dài hơn thường là cực Dương, hoặc thân tụ có vạch dấu trừ chỉ cực Âm). Nếu đấu ngược cực tụ sẽ bị phồng, hỏng hoặc nổ.
  * **Tụ có điều chỉnh (Tụ xoay):** Có thể xoay núm điều khiển để làm thay đổi diện tích đối diện giữa các bản cực, qua đó làm thay đổi trị số điện dung.

#### 3. Thông số kĩ thuật cốt lõi [51]
* **Điện dung ($C$):** Là đại lượng chỉ khả năng tích lũy năng lượng điện trường của tụ điện khi có điện áp đặt lên hai bản cực. Đơn vị đo là Farad (F). Vì Farad rất lớn nên thực tế hay dùng các đơn vị nhỏ hơn:
  * Microfarad ($\mu F$): $1 \mu F = 10^{-6} F$
  * Nanofarad ($nF$): $1 nF = 10^{-9} F$
  * Picofarad ($pF$): $1 pF = 10^{-12} F$
* **Điện áp định mức ($U_{đm}$):** Là trị số điện áp một chiều tối đa cho phép đặt lên hai bản cực của tụ điện mà lớp điện môi ở giữa không bị đánh thủng. Khi thiết kế mạch, luôn phải chọn tụ có điện áp định mức cao hơn điện áp hoạt động thực tế từ $1.5$ đến $2$ lần.
* **Dung kháng ($X_C$):** Là đại lượng biểu thị sự cản trở của tụ điện đối với dòng điện xoay chiều chạy qua nó. Công thức tính:
$$X_C = rac{1}{2\pi f C}$$
*Trong đó:*
* $X_C$ là dung kháng, đơn vị Ohm ($\Omega$).
* $f$ là tần số dòng điện xoay chiều chạy qua tụ, đơn vị Hertz (Hz).
* $C$ là điện dung của tụ điện, đơn vị Farad (F).
* *Ý nghĩa:* Tần số dòng điện $f$ càng cao hoặc điện dung $C$ càng lớn thì dung kháng $X_C$ càng nhỏ, dòng điện xoay chiều càng dễ dàng đi qua tụ [51].

#### 4. Quy tắc đọc số liệu kĩ thuật trên tụ điện [51]
* **Ghi trực tiếp:** Thường áp dụng trên tụ hóa. Trên thân tụ ghi rõ giá trị điện dung và điện áp định mức. Ví dụ: $8.2 \mu F - 400V$ hoặc $10 \mu F - 16V$.
* **Ghi bằng mã số (3 chữ số):** Thường áp dụng trên tụ gốm, tụ giấy cỡ nhỏ. Đơn vị mặc định của cách ghi này là Picofarad (pF) [51].
  * Hai chữ số đầu tiên: Giữ nguyên để tạo thành phần số có hai chữ số.
  * Chữ số thứ ba: Là hệ số nhân (tương ứng với số lượng chữ số 0 thêm vào sau).
  * *Ví dụ:*
    * Tụ ghi **101** tương ứng với $10 	imes 10^1 pF = 100 pF$.
    * Tụ ghi **103** tương ứng với $10 	imes 10^3 pF = 10000 pF = 10 nF = 0.01 \mu F$.
    * Tụ ghi **104** tương ứng với $10 	imes 10^4 pF = 100000 pF = 100 nF = 0.1 \mu F$.

---

### III. CUỘN CẢM [52, 53]

#### 1. Công dụng [52]
Cuộn cảm là linh kiện được cấu tạo từ các vòng dây dẫn điện cuốn quanh một lõi (lõi sắt, lõi ferrite hoặc không khí), có khả năng tích lũy năng lượng từ trường. Công dụng bao gồm:
* **Ngăn dòng điện xoay chiều tần số cao:** Cho dòng điện một chiều đi qua dễ dàng (cuộn chặn).
* **Mạch lọc nhiễu, mạch lọc nguồn:** Kết hợp với tụ điện để tạo ra mạch lọc LC giúp giữ lại dòng một chiều sạch và triệt tiêu các thành phần xoay chiều nhiễu tần số cao.
* **Mạch cộng hưởng:** Kết hợp với tụ điện để chọn lọc tần số vô tuyến.
* **Ổn định dòng điện và điện áp:** Sử dụng trong các mạch chuyển đổi nguồn xung (Buck/Boost Converter).

#### 2. Hình dạng và kí hiệu [52]
* **Phân loại cuộn cảm dựa vào cấu tạo lõi:**
  * **Cuộn cảm lõi không khí:** Các vòng dây quấn trống rỗng hoặc quấn trên ống nhựa cách điện không có lõi từ bên trong.
  * **Cuộn cảm lõi ferrite:** Cuộn dây có chứa lõi làm bằng chất liệu bột từ ferrite (thường dùng trong các mạch cao tần, trung tần).
  * **Cuộn cảm lõi sắt bụi/sắt lá:** Cuộn dây có chứa lõi thép kĩ thuật điện ghép từ các lá thép hoặc ép bột sắt (thường dùng trong mạch âm tần, biến áp hoặc bộ lọc tần số thấp).
* **Kí hiệu trong sơ đồ:** Thể hiện bằng một chuỗi các vòng dây xoắn liên tiếp, có thể vẽ thêm các đường thẳng song song phía trên biểu thị cho lõi thép hoặc lõi ferrite [52].

#### 3. Thông số kĩ thuật cốt lõi [52]
* **Hệ số điện cảm (Trị số điện cảm - $L$):** Đặc trưng cho khả năng tích lũy từ trường và sinh ra suất điện động tự cảm của cuộn cảm khi có dòng điện biến thiên chạy qua. Đơn vị đo là Henry (H). Các đơn vị nhỏ hơn bao gồm:
  * Milihenry ($mH$): $1 mH = 10^{-3} H$.
  * Microhenry ($\mu H$): $1 \mu H = 10^{-6} H$.
* **Dòng điện định mức ($I_{đm}$):** Là trị số dòng điện một chiều lớn nhất cho phép chạy qua cuộn cảm mà không làm cho cuộn dây bị quá nhiệt, nóng chảy lớp sơn cách điện dẫn đến chập cháy vòng dây.
* **Cảm kháng ($X_L$):** Biểu thị sự cản trở của cuộn cảm đối với dòng điện xoay chiều chạy qua nó. Công thức tính:
$$X_L = 2\pi f L$$
*Trong đó:*
* $X_L$ là cảm kháng, đơn vị Ohm ($\Omega$).
* $f$ là tần số dòng xoay chiều chạy qua cuộn cảm, đơn vị Hertz (Hz).
* $L$ là hệ số điện cảm, đơn vị Henry (H).
* *Ý nghĩa:* Tần số dòng điện $f$ càng cao hoặc trị số điện cảm $L$ càng lớn thì cảm kháng $X_L$ càng lớn, dòng xoay chiều càng bị cản trở mạnh [52].

#### 4. Quy tắc đọc số liệu kĩ thuật [53]
* **Ghi trực tiếp:** Ghi trực tiếp trị số điện cảm lên thân cuộn cảm kèm theo đơn vị đo (thường gặp ở các cuộn cảm lớn).
* **Ghi bằng mã số (3 chữ số):** Áp dụng cho các cuộn cảm vạch hoặc cuộn cảm dán (SMD). Đơn vị mặc định của cách ghi này là Microhenry ($\mu H$) [53].
  * Hai chữ số đầu tiên: Biểu thị giá trị số cơ bản.
  * Chữ số thứ ba: Hệ số nhân (số mũ của 10).
  * Chữ cái thứ tư (nếu có): Chỉ dung sai của cuộn cảm.
  * *Ví dụ:* Cuộn cảm ghi mã **220** tương ứng với trị số $22 	imes 10^0 \mu H = 22 \mu H$ [53].

---

### IV. THỰC HÀNH: ĐO VÀ KIỂM TRA LINH KIỆN THỤ ĐỘNG [54, 55]

Để kiểm tra chất lượng và xác định trị số của các linh kiện thụ động trong thực tế, ta sử dụng **Đồng hồ vạn năng (VOM)** [54].

#### 1. Đo và kiểm tra Điện trở [54]
* **Quy trình:**
  * Bước 1: Xoay núm chọn của đồng hồ vạn năng về thang đo điện trở ($\Omega$). Chọn tầm đo phù hợp với trị số dự kiến của điện trở cần đo.
  * Bước 2: Chạm hai đầu que đo của đồng hồ vào hai đầu điện trở.
  * Bước 3: Đọc trị số hiển thị trên màn hình hiển thị của đồng hồ.
* **Đánh giá:** Nếu giá trị đo được xấp xỉ bằng trị số ghi trên thân điện trở (sai lệch nằm trong khoảng dung sai cho phép) thì điện trở còn tốt. Nếu đồng hồ chỉ vô cùng ($\infty$) tức là điện trở đã bị đứt; nếu bằng $0 \Omega$ tức là điện trở đã bị chập [54].

#### 2. Đo và kiểm tra Tụ điện [54]
* **Quy trình:**
  * Bước 1: Chuyển đồng hồ vạn năng sang thang đo điện dung ($F$ hoặc kí hiệu tụ điện).
  * Bước 2: Đấu hai đầu que đo vào hai chân tụ điện (nếu là tụ hóa phải đấu que đỏ vào chân dương, que đen vào chân âm của tụ).
  * Bước 3: Đọc trị số điện dung hiển thị trên màn hình.
* **Kiểm tra nhanh bằng thang đo ôm (đối với tụ hóa lớn):** Chuyển đồng hồ sang thang đo điện trở ($\Omega$). Chạm hai que đo vào hai cực tụ điện: Kim đồng hồ sẽ phóng lên cao rồi từ từ giảm dần về vô cùng ($\infty$). Đảo chiều que đo và lặp lại: nếu hiện tượng phóng nạp xảy ra như trên tức là tụ điện còn tốt và có khả năng tích điện. Nếu kim phóng lên rồi đứng yên tại một vị trí điện trở thấp, hoặc không lên kim, tụ điện đã bị rò rỉ, chập hoặc đứt [54].

#### 3. Đo và kiểm tra Cuộn cảm [54]
* **Quy trình:**
  * Bước 1: Chuyển đồng hồ vạn năng sang thang đo điện cảm ($H$) hoặc thang đo điện trở thấp ($\Omega$).
  * Bước 2: Đặt hai que đo tiếp xúc trực tiếp vào hai đầu cuộn cảm.
  * Bước 3: Đọc trị số hiển thị.
* **Đánh giá:** Cuộn cảm tốt phải có trị số điện cảm tương đương thông số thiết kế. Nếu đo bằng thang đo ôm ($\Omega$): Nếu điện trở hiển thị rất nhỏ (thường dưới vài chục Ohm tùy kích thước dây quấn) thì cuộn dây thông mạch, không bị đứt. Nếu đo được điện trở bằng vô cùng ($\infty$) thì cuộn cảm đã bị đứt vòng dây bên trong [54].

---
---

## BÀI 16: DIODE, TRANSISTOR VÀ MẠCH TÍCH HỢP IC [56]

Linh kiện bán dẫn là các linh kiện được chế tạo từ các vật liệu bán dẫn chủ yếu như Silicon (Si) hoặc Germanium (Ge), có độ dẫn điện nằm giữa chất dẫn điện và chất cách điện, cho phép điều khiển dòng điện chạy qua một cách linh hoạt [56].

### I. DIODE TRONG MẠCH ĐIỆN TỬ [57]

#### 1. Công dụng [57]
Diode (Điốt bán dẫn) có tính chất dẫn điện một chiều rất đặc trưng (chỉ cho dòng điện đi từ cực Anode sang cực Cathode).
* **Diode chỉnh lưu:** Biến đổi dòng điện xoay chiều (AC) thành dòng điện một chiều (DC) trong các mạch nguồn cấp điện.
* **Diode ổn áp (Diode Zener):** Hoạt động ở vùng phân cực ngược (đánh thủng có kiểm soát) nhằm tạo ra điện áp một chiều ổn định cung cấp cho các mạch điện nhạy cảm.

#### 2. Hình dạng, kí hiệu và nguyên lí dẫn điện [57]
* **Cấu tạo:** Được tạo thành bằng cách ghép hai lớp vật liệu bán dẫn loại P và loại N với nhau tạo nên một tiếp giáp P-N. Hai đầu tiếp giáp được nối ra hai chân cực:
  * **Anode (A):** Nối với vùng bán dẫn P (cực Dương).
  * **Cathode (K):** Nối với vùng bán dẫn N (cực Âm). Trên thân diode thực tế thường vẽ một vòng tròn màu trắng hoặc đen sát một đầu chân cực để đánh dấu cực Cathode (K) [57].
* **Nguyên lí hoạt động phân cực:**
  * **Phân cực thuận ($U_{AK} > U_F$):** Đấu cực Dương nguồn điện vào Anode (A) và cực Âm vào Cathode (K). Khi điện áp nguồn vượt qua điện áp ngưỡng mở $U_F$ ($0.3V$ đối với Ge, $0.7V$ đối với Si), tiếp giáp P-N sẽ mở ra và cho phép dòng điện chạy qua diode một cách dễ dàng.
  * **Phân cực ngược ($U_{AK} < 0$):** Đấu cực Âm nguồn điện vào Anode (A) và cực Dương vào Cathode (K). Diode sẽ đóng lại, cản trở hoàn toàn dòng điện chạy ngược qua nó (chỉ có dòng điện rò cực kì nhỏ không đáng kể) [57].

#### 3. Thông số kĩ thuật cốt lõi [57]
* **Dòng định mức ($I_{dm}$):** Là trị số dòng điện thuận lớn nhất cho phép chạy liên tục qua diode mà không làm hư hỏng, cháy tiếp giáp P-N do quá nhiệt.
* **Điện áp ngược lớn nhất ($U_{NMax}$):** Là giá trị điện áp ngược cực đại cho phép đặt lên hai cực của diode mà diode vẫn chịu đựng được, không bị đánh thủng hỏng tiếp giáp bán dẫn.

---

### II. TRANSISTOR LƯỠNG CỰ (BJT - Bipolar Junction Transistor) [58, 59]

#### 1. Công dụng [58]
Transistor lưỡng cự là linh kiện bán dẫn có 3 cực, đóng vai trò như một chiếc khóa điện tử hoặc một bộ khuếch đại dòng điện:
* **Khuếch đại tín hiệu:** Khuếch đại các tín hiệu điện yếu (âm thanh, sóng vô tuyến...) thành tín hiệu có biên độ lớn hơn nhiều lần.
* **Chuyển mạch (Khóa điện tử - Switch):** Đóng hoặc ngắt dòng điện chạy qua tải tiêu thụ một cách tự động và cực kì nhanh chóng trong các mạch điều khiển số.

#### 2. Hình dạng và kí hiệu [58]
* **Cấu tạo:** Gồm ba lớp bán dẫn loại P và loại N ghép xen kẽ nhau tạo ra hai tiếp giáp P-N song song. Ba cực được nối ra ngoài gồm:
  * **Base (B):** Cực gốc (cực điều khiển dòng điện).
  * **Collector (C):** Cực thu dòng điện.
  * **Emitter (E):** Cực phát dòng điện.
* **Phân loại cấu trúc:**
  * **Transistor NPN (Thuận):** Gồm vùng bán dẫn P nằm xen giữa hai vùng bán dẫn N. Trên kí hiệu sơ đồ, mũi tên chỉ chiều dòng điện ở chân Emitter (E) hướng ra ngoài.
  * **Transistor PNP (Ngược):** Gồm vùng bán dẫn N nằm xen giữa hai vùng bán dẫn P. Trên kí hiệu sơ đồ, mũi tên ở chân Emitter (E) hướng vào trong [58].

#### 3. Nguyên lí hoạt động cơ bản [58]
Transistor hoạt động dựa trên nguyên tắc dùng một dòng điện điều khiển rất nhỏ ($I_B$) chạy qua cực Base để kiểm soát và điều khiển một dòng điện có giá trị lớn hơn rất nhiều lần ($I_C$) chạy từ cực Collector sang Emitter (hoặc ngược lại tùy loại transistor).
* Đối với transistor loại NPN: Transistor bắt đầu dẫn dòng điện từ C sang E khi điện áp kích cực Base lớn hơn điện áp ngưỡng mở ($U_{BE} > U_F$) và điện áp collector dương ($U_{CE} > 0$). Trị số điện áp ngưỡng $U_F$ khoảng $0.3 V$ (vật liệu Germanium) và $0.7 V$ (vật liệu Silicon) [58].

#### 4. Thông số kĩ thuật cốt lõi [59]
* **Hệ số khuếch đại dòng điện ($eta$ hoặc $h_{FE}$):** Là tỉ số giữa dòng điện cực Collector ($I_C$) và dòng điện cực Base ($I_B$) khi hoạt động ở chế độ khuếch đại:
$$eta = rac{I_C}{I_B}$$
* **Điện áp định mức cực đại ($U_{CEO}, U_{BEO}$):** Điện áp tối đa cho phép đặt giữa các chân cực mà không gây hỏng tiếp giáp bán dẫn.
* **Dòng điện collector cực đại ($I_{CMax}$):** Dòng điện tối đa cho phép chạy qua cực C của transistor.

---

### III. MẠCH TÍCH HỢP IC (Integrated Circuit) [59, 60, 61]

#### 1. Khái niệm và công dụng [59]
Mạch tích hợp IC (thường gọi là vi mạch hoặc chip) là một mạch điện tử siêu nhỏ được tích hợp nguyên khối từ hàng triệu linh kiện bán dẫn (transistor, diode) và linh kiện thụ động (điện trở, tụ điện) trên một tấm phiến bán dẫn mỏng (chất Silicon).
* **Công dụng:** Thực hiện các chức năng vô cùng phức tạp như khuếch đại thuật toán, tạo dao động, lưu trữ dữ liệu (bộ nhớ), vi xử lí trung tâm (CPU), vi điều khiển... giúp thu nhỏ tối đa kích thước thiết bị điện tử, nâng cao độ tin cậy và tốc độ xử lí tín hiệu [59, 60].

#### 2. Phân loại IC [60, 61]
IC rất đa dạng và được phân loại dựa theo nhiều tiêu chí khoa học khác nhau:

##### a. Phân loại theo mật độ tích hợp linh kiện [60]
* **SSI (Small Scale Integration):** Mật độ tích hợp nhỏ, chứa vài chục transistor trên chip.
* **MSI (Medium Scale Integration):** Mật độ tích hợp trung bình, chứa vài trăm transistor trên chip.
* **LSI (Large Scale Integration):** Mật độ tích hợp lớn, chứa hàng nghìn transistor trên chip.
* **VLSI (Very Large Scale Integration):** Mật độ tích hợp siêu lớn, tích hợp từ hàng trăm nghìn đến hàng tỷ transistor trên một chip đơn lẻ.

##### b. Phân loại theo đặc điểm tín hiệu xử lí [61]
* **IC tương tự (Analog IC):** Hoạt động với tín hiệu điện biến thiên liên tục (như IC khuếch đại âm thanh, IC ổn áp tuyến tính).
* **IC số (Digital IC):** Hoạt động với tín hiệu nhị phân rời rạc gồm hai mức điện áp Cao (1) và Thấp (0) (như cổng logic, bộ nhớ, vi xử lí).
* **IC hỗn hợp (Mixed-signal IC):** Tích hợp cả khối mạch tương tự và mạch số trên cùng một đế chip (như bộ chuyển đổi ADC, DAC).

##### c. Phân loại theo công dụng chức năng [61]
* IC vi xử lí trung tâm (CPU), vi điều khiển (MCU), bộ nhớ RAM/ROM.
* IC cảm biến thông minh (đo nhiệt độ, gia tốc, ánh sáng...).
* IC công suất (mạch cầu H điều khiển động cơ, IC nguồn xung...).

#### 3. Cách đếm thứ tự chân IC [60]
Để kết nối chính xác IC vào mạch, ta phải xác định đúng số thứ tự của các chân (PIN) dựa theo quy ước quốc tế:
* **IC một hàng chân (Single In-line Package):** Nhìn trực diện vào mặt ghi mã hiệu chữ số kĩ thuật của IC, đếm chân lần lượt từ trái sang phải, bắt đầu từ chân số 1 đến chân cuối cùng [60].
* **IC hai hàng chân (Dual In-line Package):** Nhìn IC từ trên xuống (mặt lưng hướng lên trên). Tìm điểm dấu khuyết hình bán nguyệt hoặc chấm tròn nhỏ nằm ở một đầu của IC [60].
  * Chân số 1 nằm sát điểm đánh dấu này ở phía bên trái.
  * Đếm số thứ tự tăng dần đi xuống dọc theo hàng bên trái [60].
  * Đến chân cuối của hàng bên trái, chuyển sang hàng đối diện bên phải và đếm ngược chiều kim đồng hồ đi lên lại phía đầu đánh dấu ban đầu [60].

---

### IV. THỰC HÀNH: ĐO VÀ KIỂM TRA LINH KIỆN BÁN DẪN [61, 62]

#### 1. Đo và kiểm tra Diode bán dẫn [61]
* **Cách thực hiện:**
  * Bước 1: Xoay núm đồng hồ vạn năng về thang đo kiểm tra Diode (hoặc thang đo điện trở Ohm $	imes 10$ hoặc $	imes 100$).
  * Bước 2: Đo phân cực thuận: Đặt que đỏ tiếp xúc cực Anode (A) và que đen tiếp xúc cực Cathode (K) [61].
    * *Kết quả:* Đồng hồ hiển thị giá trị sụt áp thuận khoảng $0.5V - 0.7V$ đối với diode Silicon (hoặc kim đồng hồ phóng lên trị số điện trở thấp) [61].
  * Bước 3: Đo phân cực ngược: Đảo que đo, đặt que đỏ tiếp xúc Cathode (K) và que đen tiếp xúc Anode (A) [61].
    * *Kết quả:* Đồng hồ hiển thị giá trị ngoài tầm đo hoặc báo "OL" (hoặc kim đồng hồ đứng yên ở vạch điện trở vô cùng $\infty$) [61].
* **Đánh giá:** Diode hoạt động tốt khi và chỉ khi có một chiều đo lên kim (hoặc hiển thị điện áp thuận) và chiều đo ngược lại hoàn toàn không lên [61]. Nếu cả hai chiều đều lên điện trở thấp thì diode bị chập; nếu cả hai chiều đều không lên thì diode đã bị đứt [61].

#### 2. Đo và kiểm tra Transistor (loại NPN) [62]
* **Cách thực hiện:**
  * Bước 1: Chuyển đồng hồ sang chế độ đo diode hoặc ôm.
  * Bước 2: Xác định chân và kiểm tra hai tiếp giáp P-N (tiếp giáp B-E và tiếp giáp B-C) [62].
    * Chạm que đỏ vào cực Base (B), que đen chạm lần lượt vào Emitter (E) và Collector (C) [62].
    * *Kết quả:* Cả hai lần đo đều phải hiển thị điện áp thuận mở tiếp giáp bán dẫn (khoảng $0.6V - 0.7V$).
  * Bước 3: Kiểm tra cách điện ngược B-E và B-C: Chạm que đen vào cực Base (B), que đỏ chạm lần lượt vào E và C. Kết quả đo phải báo hở mạch [62].
  * Bước 4: Kiểm tra thông mạch cách điện giữa C và E: Đo giữa hai chân C và E theo cả hai chiều, kết quả đo phải báo hở mạch (không thông dòng điện) [62].
* **Đánh giá:** Nếu transistor vi phạm bất kì bước kiểm tra nào ở trên (ví dụ thông mạch C-E, hoặc tiếp giáp B-C không dẫn thuận) thì transistor đã bị hỏng chập hoặc đứt [62].

#### 3. Đo và kiểm tra IC bằng đồng hồ vạn năng [62]
* **Quy trình:**
  * Bước 1: Chuyển đồng hồ vạn năng về chế độ đo thông mạch (phát tiếng bíp) [62].
  * Bước 2: Tra cứu sơ đồ chân (datasheet) để xác định chân nguồn dương ($V_{CC}$ hoặc $V_{DD}$) và chân nguồn âm (GND) của IC [62].
  * Bước 3: Đặt lần lượt hai que đo tiếp xúc vào các chân (PIN) liền kề của IC hoặc đo giữa chân nguồn dương và chân đất [62].
* **Đánh giá:** Nếu đồng hồ phát tiếng kêu "bíp" liên tục giữa chân nguồn dương và chân đất, hoặc giữa hai chân tín hiệu kế cận không cùng một mạch điện, thì IC đã bị ngắn mạch (chập chân bên trong) và cần phải thay thế ngay [62].

---
---

## BÀI 17: MẠCH PHÁT HIỆN DÒNG ĐIỆN XOAY CHIỀU TRONG DÂY DẪN [63]

Đây là bài thực hành ứng dụng kĩ thuật điện tử cơ bản giúp chế tạo mạch phát hiện từ trường dòng điện xoay chiều mà không cần tiếp xúc trực tiếp vào lõi đồng của dây dẫn [63].

### I. MỤC ĐÍCH, YÊU CẦU [63]
* Lắp ráp hoàn chỉnh và vận hành thành công một mạch điện tử sử dụng linh kiện bán dẫn cơ bản (cuộn cảm, transistor, LED) [63].
* Rèn luyện kĩ năng đọc hiểu sơ đồ nguyên lí mạch điện tử, kĩ năng cắm chân linh kiện trên bo mạch thử (testboard) đảm bảo tiếp xúc tốt, gọn gàng và đẹp mắt [63].
* Hiểu rõ nguyên lí cảm ứng điện từ và khuếch đại dòng điện của transistor trong mạch thực tế [63].

### II. CHUẨN BỊ DỤNG CỤ VÀ VẬT LIỆU [64]
* **Đồng hồ vạn năng:** 1 chiếc.
* **Bo mạch thử (Testboard):** 1 chiếc.
* **Dây dẫn một lõi đồng nối mạch:** khoảng 2 mét.
* **Điện trở hạn dòng:** $330 \Omega$ (1 chiếc).
* **Cuộn cảm cảm ứng đầu vào:** loại cuộn cảm lõi không khí trị số $13 \mu H$ (1 chiếc).
* **Tụ lọc nhiễu:** loại tụ phân cực hoá $0.47 \mu F - 50V$ (1 chiếc).
* **Transistor khuếch đại:** Transistor NPN mã hiệu C1815 (2 chiếc, ghép nối theo kiểu Darlington để tăng hệ số khuếch đại dòng điện cực đại).
* **Đèn LED chỉ thị:** loại tiêu thụ dòng $5mA - 18mA$ điện áp $2.2V$ (1 chiếc).
* **Nguồn cấp điện:** Nguồn một chiều (DC) $12V$ hoặc dùng pin 9V - 12V.
* **Nguồn tạo từ trường thử nghiệm:** Đường dây dẫn điện xoay chiều $220V - 50Hz$ đang kết nối chạy tải tiêu thụ (ví dụ cấp điện cho quạt điện hoạt động).

### III. SƠ ĐỒ NGUYÊN LÍ VÀ NGUYÊN LÍ HOẠT ĐỘNG [63]

#### 1. Sơ đồ nguyên lí mạch điện [63]:

```
                  +12V (Nguồn một chiều)
                   │
                   ├───[ R = 330 Ohm ]───(Anode) Đèn LED (Cathode)
                   │                                  │
                   │                                  ├──────┐
                   │                                  │      │
                   │                                ┌─┴─┐    │
                   │                         T2     │ C │    │
                   │                      (C1815) ┌─┤ B │    │
                   │                              │ └─┬─┘    │
                   │                              │   │ E    │
                   │                              │   └┬─────┘
                   │                       T1     │    │
                   │                    (C1815) ┌─┴─┐  │
                   │                            │ C │  │
                   │                         ┌──┤ B │  │
                   │                         │  └─┬─┘  │
                   │                         │    │ E  │
                   │                         │    └────┼──┐
                   │                         │         │  │
                   └───[ L = 13 uH ]─────────┼─────────┘  │
                                             │            │
                                           ┌─┴─┐          │
                                           │ C │ Tụ điện  │
                                           └─┬─┘ 0.47 uF  │
                                             │            │
                                             ┴            ┴
                                            GND          GND
```

#### 2. Thuyết minh nguyên lí hoạt động [63]:
* **Hiện tượng cảm ứng:** Khi có dòng điện xoay chiều $220V - 50Hz$ chạy qua dây dẫn điện của thiết bị tải, xung quanh dây dẫn sẽ sinh ra một từ trường biến thiên xoay chiều tương ứng [63].
* **Thu tín hiệu cảm ứng:** Khi ta đưa cuộn cảm cảm ứng $L = 13 \mu H$ lại gần sát vỏ bọc của dây dẫn điện xoay chiều, từ trường biến thiên xung quanh dây dẫn sẽ cắt qua các vòng dây cuộn cảm $L$ và sinh ra một suất điện động cảm ứng xoay chiều $e_B$ nhỏ ở hai đầu cuộn dây [63].
* **Lọc nhiễu:** Suất điện động xoay chiều yếu này được đưa qua tụ lọc $C = 0.47 \mu F$ nhằm triệt tiêu bớt các thành phần nhiễu tần số cao ngoài môi trường trước khi cấp vào cực điều khiển của transistor [63].
* **Khuếch đại Darlington:** Tín hiệu sau lọc được cấp trực tiếp vào cực Base (B) của transistor $T_1$. Nhờ sự phối hợp của cặp transistor Darlington ($T_1$ và $T_2$ mắc nối tiếp liên tầng cực phát sang cực gốc), dòng điện cảm ứng cực kì nhỏ bé $i_B$ ban đầu sẽ được khuếch đại lên gấp hàng ngàn lần tạo ra dòng điện đầu ra $i_C$ đủ lớn [63].
* **Chỉ thị tín hiệu:** Dòng điện $i_C$ đã khuếch đại này chạy từ nguồn $+12V$ qua điện áp định mức của đèn LED khiến LED $Đ$ sáng rực lên, báo hiệu trong dây dẫn có dòng xoay chiều đang chạy qua [63].
* **Trường hợp không có dòng điện chạy qua dây:** Không sinh ra suất điện động cảm ứng, $i_C = 0$ và đèn LED tắt hoàn toàn [63].

### IV. TIẾN TRÌNH THỰC HIỆN LẮP RÁP [64]
* **Bước 1:** Chuẩn bị đầy đủ linh kiện, dùng đồng hồ vạn năng kiểm tra chất lượng của từng linh kiện trước khi cắm mạch [64].
* **Bước 2:** Cắm cặp transistor $T_1, T_2$ lên bo mạch thử theo đúng sơ đồ Darlington, chú ý cắm đúng vị trí các chân E, B, C của transistor C1815 [64].
* **Bước 3:** Cắm cuộn cảm cảm ứng $L$, tụ điện $C$ đấu song song phân cực lọc nhiễu, điện trở $330 \Omega$ và đèn LED chỉ thị theo sơ đồ nguyên lí [64].
* **Bước 4:** Kết nối dây cấp nguồn $12V$ một chiều từ pin hoặc bộ nguồn ổn áp vào hai thanh bus nguồn dương, âm của testboard [64].
* **Bước 5:** Thử nghiệm hoạt động mạch bằng cách cấp điện cho quạt hoạt động, đưa cuộn cảm $L$ của mạch lại gần sát dây nguồn quạt [64]. Quan sát trạng thái đèn LED phát sáng để kiểm chứng tính năng cảm ứng của mạch [64].

---
---

## TỔNG KẾT CHƯƠNG VI: SƠ ĐỒ HỆ THỐNG KIẾN THỨC [66]

```
                                  ┌──────────────────────────┐
                                  │ LINH KIỆN ĐIỆN TỬ (CH. VI)│
                                  └─────────────┬────────────┘
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         ▼                                      ▼                                      ▼
┌───────────────────┐                  ┌───────────────────┐                  ┌───────────────────┐
│ L.K THỤ ĐỘNG [47] │                  │ L.K BÁN DẪN & IC  │                  │ MẠCH THỰC HÀNH    │
└────────┬──────────┘                  └────────┬──────────┘                  └────────┬──────────┘
         │                                      │                                      │
         ├─ Điện trở (Hạn dòng, phân áp)        ├─ Diode bán dẫn (Chỉnh lưu, ổn áp)    └─ Mạch cảm ứng phát hiện
         │  - Trị số R (Ohm)                    │  - Ghép P-N, cực A-K                 │  dòng xoay chiều trong
         │  - Đọc trị số vạch màu               │  - Chỉ dẫn dòng một chiều            │  dây dẫn (L, Darlington,
         │                                      │                                      │  LED chỉ thị) [63]
         ├─ Tụ điện (Cản DC, lọc nguồn)         ├─ Transistor lưỡng cự (NPN/PNP)       │
         │  - Điện dung C (Farad)               │  - Cấu trúc 3 cực B-E-C              │
         │  - Dung kháng X_C = 1 / 2*pi*f*C     │  - Khuếch đại, khóa điện tử          │
         │                                      │                                      │
         └─ Cuộn cảm (Chặn AC, tạo mạch LC)     └─ Mạch tích hợp IC                    │
            - Điện cảm L (Henry)                   - SSI, MSI, LSI, VLSI               │
            - Cảm kháng X_L = 2*pi*f*L             - Quy tắc đếm chân                  │
```
