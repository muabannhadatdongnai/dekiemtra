# CHƯƠNG VIII: ĐIỆN TỬ SỐ [78]

---

## BÀI 21: TÍN HIỆU SỐ VÀ CÁC CỔNG LOGIC CƠ BẢN [79]

### I. KHÁI NIỆM TÍN HIỆU SỐ VÀ CÁC THAM SỐ ĐẶC TRƯNG [79, 80]

#### 1. Khái niệm tín hiệu số [79]
Tín hiệu số là một chuỗi các tín hiệu rời rạc, có biên độ không đổi trong một khoảng thời gian nhất định [79]. Trái ngược với tín hiệu tương tự (biến thiên liên tục theo thời gian), tín hiệu số chỉ tồn tại ở hai mức trạng thái rời rạc đại diện cho hai mức logic: **0** và **1** [80]. 

* **Ưu điểm:** Ít bị ảnh hưởng bởi nhiễu, dễ dàng khôi phục tín hiệu gốc bằng cách sử dụng bộ lặp hoặc bộ khuếch đại [79]. Tín hiệu số được ứng dụng vô cùng rộng rãi trong máy tính, thiết bị kĩ thuật số, cho phép mã hóa, xử lí và bảo mật thông tin tối ưu [79].

#### 2. Các tham số đặc trưng của tín hiệu số [80]
* **a) Bit và mức điện áp [80]:**
  * Trong tín hiệu số, bit (0 hoặc 1) thường được biểu diễn bằng một mức điện áp xác định.
  * **Ví dụ phổ biến:** Mức thấp 0 V đại diện cho bit 0; mức cao 5 V đại diện cho bit 1.
* **b) Tốc độ bit và khoảng bit [80]:**
  * **Tốc độ bit (R):** Là số lượng bit được truyền đi trong một giây. Đơn vị đo là bit trên giây (bit/s hoặc bps).
  * **Khoảng bit ($T_b$):** Là thời gian kéo dài của một bit trong chuỗi truyền tín hiệu. Khoảng bit tỷ lệ nghịch với tốc độ bit và được tính theo công thức:
    $$T_b = \frac{1}{R} \quad (\text{giây})$$

---

### II. KHÁI NIỆM CỔNG LOGIC [80]
* **Định nghĩa:** Cổng logic là một mạch điện thực hiện chức năng của một hàm logic (hàm Boole) [80]. Mỗi cổng logic thực hiện một phép toán đại số logic trên một hoặc nhiều lối vào để tạo ra một kết quả logic duy nhất ở đầu ra [80].
* Trong thực tế kĩ thuật chế tạo, nhiều cổng logic cùng loại hoặc khác loại được tích hợp chung trong một vi mạch gọi là **IC số (Integrated Circuit)** [81, 82, 83].

---

### III. CÁC CỔNG LOGIC CƠ BẢN [81, 82, 83]

#### 1. Cổng AND (Cổng VÀ) [81]
* **Hàm logic:** $y = x_1 \cdot x_2$ (hoặc viết tắt là $y = x_1 x_2$) [81].
* **Kí hiệu logic:** Hình bán nguyệt dẹt có 2 ngõ vào $x_1, x_2$ và 1 ngõ ra $y$.
* **Bảng chân lí (Bảng 21.4) [81]:**
  
  | Lối vào $x_1$ | Lối vào $x_2$ | Lối ra $y$ |
  | :---: | :---: | :---: |
  | 0 | 0 | **0** |
  | 1 | 0 | **0** |
  | 0 | 1 | **0** |
  | 1 | 1 | **1** |

  > **Quy luật hoạt động:** Lối ra $y$ chỉ lên mức 1 (HIGH) khi và chỉ khi **tất cả** các lối vào đều ở mức 1 [81].
* **IC số tương ứng:** IC **74LS08** chứa 4 cổng AND độc lập bên trong [81].

#### 2. Cổng OR (Cổng HOẶC) [90]
* **Hàm logic:** $y = x_1 + x_2$
* **Kí hiệu logic:** Hình lá bẹt nhọn đầu có ngõ vào cong.
* **Bảng chân lí:**
  
  | Lối vào $x_1$ | Lối vào $x_2$ | Lối ra $y$ |
  | :---: | :---: | :---: |
  | 0 | 0 | **0** |
  | 1 | 0 | **1** |
  | 0 | 1 | **1** |
  | 1 | 1 | **1** |

  > **Quy luật hoạt động:** Lối ra $y$ lên mức 1 khi có **ít nhất một** lối vào ở mức 1. Lối ra $y$ chỉ bằng 0 khi toàn bộ lối vào đều bằng 0.
* **IC số tương ứng:** IC **74LS32** chứa 4 cổng OR độc lập bên trong [90].

#### 3. Cổng NOT (Cổng PHỦ ĐỊNH - Bộ đảo) [81]
* **Hàm logic:** $y = \bar{x}$ [81]
* **Kí hiệu logic:** Hình tam giác có một vòng tròn nhỏ ở đầu ra để biểu thị phép đảo [81].
* **Bảng chân lí (Bảng 21.5) [81]:**
  
  | Lối vào $x$ | Lối ra $y$ |
  | :---: | :---: |
  | 0 | **1** |
  | 1 | **0** |

  > **Quy luật hoạt động:** Lối ra $y$ luôn có trạng thái ngược (đảo) với lối vào $x$ [81].
* **IC số tương ứng:** IC **74LS04** chứa 6 cổng NOT độc lập bên trong [81].

#### 4. Cổng NOR (Cổng HOẶC-NOT) [82]
* **Hàm logic:** $y = \overline{x_1 + x_2}$ [82]
* **Kí hiệu logic:** Cổng OR cơ bản kết hợp thêm một vòng tròn đảo ở ngõ ra [82].
* **Bảng chân lí (Bảng 21.6) [82]:**
  
  | Lối vào $x_1$ | Lối vào $x_2$ | Lối ra $y$ |
  | :---: | :---: | :---: |
  | 0 | 0 | **1** |
  | 1 | 0 | **0** |
  | 0 | 1 | **0** |
  | 1 | 1 | **0** |

  > **Quy luật hoạt động:** Lối ra $y$ chỉ lên mức 1 khi **tất cả** các lối vào đều ở mức 0 [82].
* **IC số tương ứng:** IC **74LS02** chứa 4 cổng NOR độc lập bên trong [82].

#### 5. Cổng NAND (Cổng VÀ-NOT) [82, 83]
* **Hàm logic:** $y = \overline{x_1 \cdot x_2}$ [82]
* **Kí hiệu logic:** Cổng AND cơ bản kết hợp thêm một vòng tròn đảo ở ngõ ra [82].
* **Bảng chân lí (Bảng 21.7) [82]:**
  
  | Lối vào $x_1$ | Lối vào $x_2$ | Lối ra $y$ |
  | :---: | :---: | :---: |
  | 0 | 0 | **1** |
  | 1 | 0 | **1** |
  | 0 | 1 | **1** |
  | 1 | 1 | **0** |

  > **Quy luật hoạt động:** Lối ra $y$ bằng 0 khi **tất cả** lối vào đều bằng 1. Còn khi có ít nhất một lối vào bằng 0 thì lối ra $y$ sẽ bằng 1 [83].
* **IC số tương ứng:** IC **74LS00** chứa 4 cổng NAND độc lập bên trong [83].

---
---

## BÀI 22: MỘT SỐ MẠCH XỬ LÍ TÍN HIỆU TRONG ĐIỆN TỬ SỐ [84]

Hệ thống điện tử số được chia làm hai loại mạch chính dựa trên cấu trúc hoạt động và tính chất nhớ: **Mạch logic tổ hợp** và **Mạch dãy** [84, 85].

### I. MẠCH LOGIC TỔ HỢP [84, 85]
* **Khái niệm:** Mạch logic tổ hợp là mạch được tạo thành từ các cổng logic cơ bản mà trạng thái lối ra ở một thời điểm bất kì chỉ phụ thuộc vào tổ hợp các trạng thái logic ở lối vào tại thời điểm đó [84]. Mạch tổ hợp **không có tính nhớ** (không phụ thuộc vào trạng thái quá khứ trước đó) [84].
* **Các mạch tổ hợp thông dụng gồm [84]:**
  1. Mạch số học (cộng, trừ, nhân, chia...) [84].
  2. Bộ hợp kênh (Multiplexer - MUX), phân kênh (Demultiplexer - DEMUX) [84].
  3. Bộ mã hóa (Encoder), giải mã (Decoder) [84].
  4. Mạch so sánh số [84].
  5. Các bộ khóa và mạch điều khiển logic [84].

#### Mạch so sánh hai số 1 bit [85]
* **Nhiệm vụ:** So sánh giá trị hai số nhị phân $A$ và $B$ (mỗi số 1 bit) [85].
  * Nếu $A = B$ thì ngõ ra báo đồng dạng $C = 1$ [85].
  * Nếu $A \neq B$ thì ngõ ra báo lệch biệt $C = 0$ [85].
* **Bảng chân lí mạch so sánh (Bảng 22.1) [85]:**
  
  | Lối vào $A$ | Lối vào $B$ | Lối ra $C$ | Kết luận |
  | :---: | :---: | :---: | :---: |
  | 0 | 0 | **1** | $A = B$ |
  | 0 | 1 | **0** | $A \neq B$ |
  | 1 | 0 | **0** | $A \neq B$ |
  | 1 | 1 | **1** | $A = B$ |

* **Phương trình logic tối giản:** $C = \bar{A}\bar{B} + AB$ [85].
* **Sơ đồ mạch logic:** Được thiết kế gồm hai cổng NOT (để tạo $\bar{A}$ và $\bar{B}$), hai cổng AND (để tạo số hạng $\bar{A}\bar{B}$ và $AB$) và một cổng OR ở đầu ra để thực hiện phép cộng [85].

---

### II. MẠCH DÃY (MẠCH TUẦN TỰ) [85, 86, 87]
* **Khái niệm:** Mạch dãy là mạch được tạo thành từ các cổng logic cơ bản kết hợp với **phần tử nhớ** [85]. Trạng thái lối ra của mạch dãy ở một thời điểm không chỉ phụ thuộc vào các tín hiệu lối vào ở thời điểm hiện tại, mà còn phụ thuộc vào trạng thái lối ra ở thời điểm trước đó (có tính nhớ, có mạch phản hồi hồi tiếp) [85].
* **Các mạch dãy thông dụng gồm [85]:**
  1. Các phần tử nhớ cơ bản [85].
  2. Các Flip-Flop (Trigger) [85].
  3. Các bộ đếm (đếm đồng bộ, không đồng bộ) [85].
  4. Các bộ ghi dịch (Shift Register) [85].
  5. Các mạch chia tần [85].

#### 1. Bộ Flip-Flop (Trigger) [86]
* Flip-Flop là một mạch điện tử có hai trạng thái cân bằng ổn định tương ứng với mức logic 0 và 1, hoạt động như một phần tử nhớ cơ bản 1 bit [86].
* **Flip-Flop D (Hình 22.6):** Gồm ngõ vào dữ liệu $D$, ngõ vào xung nhịp đồng bộ $CLK$, và hai ngõ ra đảo nhau là $Q$ và $\bar{Q}$ [86].
* **Nguyên lí hoạt động (Bảng 22.2) [86]:**
  * Khi xung nhịp $CLK$ có sự chuyển trạng thái kích thích (ví dụ cạnh sườn lên $\uparrow$), dữ liệu tại ngõ vào $D$ sẽ được truyền trực tiếp ra và chốt lại ở ngõ ra $Q$ [86].
  * Nếu $D = 0$, ngõ ra $Q = 0$ (Trạng thái Xoá) [86].
  * Nếu $D = 1$, ngõ ra $Q = 1$ (Trạng thái Đặt) [86].
* **IC số tương ứng:** IC **HD7474** tích hợp 2 bộ Flip-Flop D độc lập bên trong [86].

#### 2. Mạch đếm nhị phân hai bit sử dụng Flip-Flop D [87]
* **Công dụng:** Dùng để đếm số lượng xung nhịp, chia tần số của tín hiệu xung gốc, làm cơ sở tạo các bộ định thời và xung đồng hồ hệ thống trong máy tính [87].
* **Sơ đồ khối và nguyên lí hoạt động (Bảng 22.3) [87]:**
  * Mạch sử dụng hai Flip-Flop D mắc nối tiếp nối tầng (FF0 và FF1) [87]. Ngõ ra $\bar{Q}$ của FF0 được phản hồi về ngõ vào $D_0$ của chính nó; ngõ ra $Q_0$ đóng vai trò làm xung kích thích cho ngõ vào CLK của FF1 [87].
  * Trạng thái đầu ra của bộ đếm nhị phân 2 bit ($Q_1 Q_0$) thay đổi tuần tự sau mỗi xung nhịp kích thích:
    
    | Xung vào thứ | Ngõ ra $Q_1$ | Ngõ ra $Q_0$ | Giá trị thập phân tương ứng |
    | :---: | :---: | :---: | :---: |
    | Khởi đầu (Xoá) | 0 | 0 | 0 |
    | Xung 1 | 0 | 1 | 1 |
    | Xung 2 | 1 | 0 | 2 |
    | Xung 3 | 1 | 1 | 3 |

  * Sau xung thứ 3, chu trình đếm tự động quay trở lại trạng thái ban đầu (00) để bắt đầu một chu kì mới [88].

---

### III. PHƯƠNG PHÁP THIẾT KẾ MẠCH LOGIC TỔ HỢP [88]
Quy trình thiết kế một mạch logic tổ hợp từ yêu cầu thực tiễn gồm **4 bước bắt buộc** sau [88]:
1. **Bước 1:** Xác định rõ số lượng lối vào, lối ra từ yêu cầu thực tế và tiến hành lập **Bảng chân lí** biểu diễn mối quan hệ logic giữa chúng [88].
2. **Bước 2:** Từ bảng chân lí vừa thiết lập, viết các biểu thức đại số cho các lối ra (biểu thức dưới dạng tổng các tích hoặc tích các tổng) [88].
3. **Bước 3:** Sử dụng các định lí Boole hoặc bìa Karnaugh để **tối giản (rút gọn)** biểu thức logic nhằm tối ưu hóa số lượng cổng cần dùng [88].
4. **Bước 4:** Vẽ **sơ đồ mạch logic nguyên lí** chi tiết dựa trên biểu thức rút gọn bằng các cổng logic cơ bản sẵn có [88].

---
---

## BÀI 23: THỰC HÀNH: LẮP RÁP, KIỂM TRA MẠCH BÁO CHÁY SỬ DỤNG CÁC CỔNG LOGIC CƠ BẢN [89]

### I. MỤC ĐÍCH THỰC HÀNH [89]
* Hiểu rõ sơ đồ nguyên lí hoạt động và tự tay lắp ráp thành công mạch điện tử số báo cháy không gian đơn giản từ các cổng logic tích hợp và thiết bị cảm biến môi trường [89].
* Rèn luyện kĩ năng đọc sơ đồ chân IC số, bố trí dây dẫn khoa học và xử lý sự cố kĩ thuật trên testboard [89].

---

### II. NGUYÊN LÍ HOẠT ĐỘNG CỦA MẠCH [89]
Mạch sử dụng hai loại cảm biến chính để giám sát sự cố: cảm biến khói và cảm biến nhiệt độ [89]. 
* **Cơ chế báo động bằng Còi:** Sử dụng cổng **OR** [89]. Khi có tín hiệu báo khói **hoặc** tín hiệu nhiệt độ báo cháy (hoặc cả hai cùng xảy ra), ngõ ra cổng OR lên mức cao (1) kích hoạt còi chip phát âm thanh cảnh báo [89].
* **Cơ chế báo động bằng LED đỏ:** Sử dụng cổng **AND** [89]. Đèn LED chỉ thị chỉ phát sáng rực cảnh báo nguy cơ nghiêm trọng khi đồng thời xảy ra cả hai hiện tượng: có khói **và** có cháy nhiệt độ cao [89].
* **Lưu ý thực tế:** Các dòng cảm biến nhiệt độ trên thị trường (như LM393) thường xuất tín hiệu mức thấp (0) khi phát hiện nhiệt độ vượt ngưỡng an toàn. Do đó, cần thêm một cổng **NOT** ở ngõ ra của cảm biến nhiệt trước khi kết nối vào đầu vào của cổng AND và OR để đưa tín hiệu về đúng logic mong muốn [89].

---

### III. DANH MỤC THIẾT BỊ, LINH KIỆN VÀ VẬT LIỆU [90]

| STT | Tên thiết bị, linh kiện | Thông số kĩ thuật / Chức năng | Số lượng |
| :---: | :--- | :--- | :---: |
| 1 | **IC 74LS32** | Tích hợp 4 cổng OR [90] | 1 chiếc |
| 2 | **IC 74LS08** | Tích hợp 4 cổng AND [90] | 1 chiếc |
| 3 | **IC 74LS04** | Tích hợp 6 cổng NOT [90] | 1 chiếc |
| 4 | **Cảm biến nhiệt độ** | Module sử dụng Op-amp LM393 [90] | 1 bộ |
| 5 | **Cảm biến khói** | Module MQ2 phát hiện khí khói/khí gas [90] | 1 bộ |
| 6 | **Còi báo động** | Còi chip điện áp hoạt động 5 V [90] | 1 chiếc |
| 7 | **LED đơn** | Màu đỏ, dòng định mức 10 - 20 mA [90] | 1 chiếc |
| 8 | **Điện trở** | Giá trị $1 \text{ k}\Omega$ (hạn dòng cho LED) [90] | 1 chiếc |
| 9 | **Bo mạch thử** | Testboard lỗ cắm tiêu chuẩn (Breadboard) [90] | 1 chiếc |
| 10 | **Nguồn cấp** | Bộ nguồn hoặc pin DC 5 V ổn áp [90] | 1 bộ |
| 11 | **Dây nối** | Dây cắm lõi cứng nhiều màu sắc [90] | 30 sợi |
| 12 | **Đồng hồ đo** | Đồng hồ vạn năng số hoặc kim [90] | 1 chiếc |

---

### IV. QUY TRÌNH THỰC HIỆN LẮP RÁP [90, 91]
* **Bước 1 (Khảo sát sơ đồ):** Đọc kĩ sơ đồ nguyên lí kết nối chân của các IC số (Hình 23.1) [90]. Xác định đúng vị trí chân cấp nguồn dương ($V_{CC}$ - Chân 14) và chân nối đất chung (GND - Chân 7) của các IC 74LS04, 74LS08, 74LS32 [81, 82, 83].
* **Bước 2 (Bố trí linh kiện):** Cắm cố định 3 IC số vào rãnh giữa của testboard [90]. Đảm bảo các IC cắm đúng chiều (hướng khuyết vòng cung quay về bên trái) [88].
* **Bước 3 (Đấu dây nguồn và tín hiệu):**
  * Nối chân 14 của cả 3 IC lên đường nguồn dương (+5V) của testboard. Nối chân 7 của cả 3 IC xuống đường nguồn âm (GND) [81, 82, 83].
  * Cấp điện cho 2 module cảm biến MQ2 và LM393 từ đường nguồn chung [90].
  * Đấu nối dây tín hiệu từ ngõ ra cảm biến khói MQ2 trực tiếp vào đầu vào thứ nhất của cổng AND (74LS08) và cổng OR (74LS32) [89].
  * Đấu nối dây tín hiệu ngõ ra cảm biến nhiệt LM393 vào ngõ vào cổng NOT (74LS04), rồi lấy tín hiệu đảo này đấu tiếp vào ngõ vào thứ hai của cổng AND và OR [89].
  * Đấu ngõ ra cổng AND qua điện trở hạn dòng $1 \text{ k}\Omega$ vào cực Anode (+) của đèn LED đỏ. Cực Cathode (-) của LED nối về GND [89].
  * Đấu ngõ ra cổng OR trực tiếp vào cực dương (+) của còi báo động, cực âm (-) của còi nối về GND [89].
* **Bước 4 (Đo kiểm và thử nghiệm):**
  * Sử dụng đồng hồ vạn năng kiểm tra điện áp nguồn ổn định ở mức 5 V tại chân các IC [90].
  * Dùng nguồn nhiệt (bật lửa) đưa lại gần cảm biến nhiệt độ và dùng khói nhang đưa lại gần cảm biến khói để kích hoạt [91].
  * Quan sát trạng thái hoạt động của LED và còi, đối chiếu ghi nhận kết quả thực tế vào bảng báo cáo thực hành [91].

#### Bảng chân lí báo cáo thực hành (Bảng 23.1) [91]:

| Trạng thái Nhiệt độ | Trạng thái Khói | Trạng thái Còi | Trạng thái LED | Kết luận |
| :---: | :---: | :---: | :---: | :--- |
| Bình thường (Không) | Bình thường (Không) | **TẮT** | **TẮT** | Hệ thống an toàn |
| Bình thường (Không) | Có khói rò rỉ | **KÊU** | **TẮT** | Cảnh báo rò khói |
| Có nhiệt độ cao (Cháy) | Bình thường (Không) | **KÊU** | **TẮT** | Cảnh báo quá nhiệt |
| Có nhiệt độ cao (Cháy) | Có khói rò rỉ | **KÊU** | **SÁNG** | **BÁO ĐỘNG CHÁY LỚN** |

---
---

## TỔNG KẾT CHƯƠNG VIII: SƠ ĐỒ HỆ THỐNG KIẾN THỨC [126/92]

```
                             ┌──────────────────────────────────────────────┐
                             │               ĐIỆN TỬ SỐ [92]                │
                             └──────────────────────┬───────────────────────┘
                                                    │
                 ┌──────────────────────────────────┼──────────────────────────────────┐
                 ▼                                  ▼                                  ▼
┌─────────────────────────────────┐┌─────────────────────────────────┐┌─────────────────────────────────┐
│     1. TÍN HIỆU SỐ & CỔNG LOGIC ││       2. MẠCH XỬ LÍ SỐ          ││       3. THỰC HÀNH BÁO CHÁY      │
└────────────────┬────────────────┘└────────────────┬────────────────┘└────────────────┬────────────────┘
                 │                                  │                                  │
  ├─ Tín hiệu số (Biên độ rời rạc,│  ├─ Mạch logic tổ hợp [84]          │  ├─ Sơ đồ nguyên lí:             │
  │  bit 0, bit 1, R, Tb) [79, 80]│  │  (Không tính nhớ; mạch so sánh)  │  │  OR kích còi, AND sáng LED [89] │
  │                               │  │                                  │  │                                 │
  ├─ Định nghĩa cổng logic [80]   │  ├─ Mạch dãy (tuần tự) [85]         │  ├─ Linh kiện chính:               │
  │                               │  │  (Có tính nhớ; Flip-Flop,        │  │  Cảm biến khói MQ2, Cảm biến    │
  │                               │  │   mạch đếm nhị phân) [86, 87]    │  │  nhiệt LM393, IC cổng logic [90]│
  ├─ Các cổng logic cơ bản [81-83]│  │                                  │  │                                 │
  │  (AND, OR, NOT, NOR, NAND)    │  └─ Quy trình thiết kế mạch tổ hợp  │  └─ Quy trình đo kiểm, thử nghiệm│
  │                               │     (Gồm 4 bước chuẩn hóa) [88]     │     vận hành hệ thống [90, 91]   │
  └─ IC số đại diện [81, 82, 83]  │                                     │                                    
     (74LS08, 74LS32, 74LS04,     │                                     │                                    
      74LS02, 74LS00)             │                                     │                                    
```
