# CHƯƠNG IX: VI ĐIỀU KHIỂN [92]

---

## BÀI 24: KHÁI QUÁT VỀ VI ĐIỀU KHIỂN [93]

### I. KHÁI NIỆM VÀ ỨNG DỤNG CỦA VI ĐIỀU KHIỂN [93, 94]

#### 1. Khái niệm [93, 94]
* **Vi điều khiển (Microcontroller):** Là một mạch tích hợp (IC) tích hợp một bộ xử lí trung tâm (CPU), bộ nhớ (ROM, RAM), các cổng vào/ra (I/O) và các khối chức năng ngoại vi khác trên một chip bán dẫn duy nhất [93, 94]. 
* **Mục đích:** Vi điều khiển được thiết kế tối giản, tối ưu hóa về mặt kích thước và chi phí để thực hiện các chức năng tính toán, đo lường và điều khiển tự động cho một hệ thống hoặc một thiết bị cụ thể [94].
* **So với máy tính truyền thống:** Máy tính cá nhân đa năng có thể thực hiện nhiều nhiệm vụ khác nhau như soạn thảo văn bản, truy cập internet, chơi game... Trong khi đó, vi điều khiển thường được thiết kế chuyên biệt cho một mục đích sử dụng cố định (đóng vai trò là lõi của các **hệ thống nhúng**) [94].
  * *Ví dụ:* Khi cần thay đổi chu kì đếm ngược của đèn LED điều khiển giao thông, người ta chỉ cần viết lại và nạp lại chương trình mới vào vi điều khiển cũ mà không cần thay đổi phần cứng [94].

#### 2. Ứng dụng của vi điều khiển [94]
Vi điều khiển hiện diện ở hầu khắp các thiết bị hiện đại xung quanh chúng ta:
* **Giao thông vận tải:** Hệ thống phanh chống bó cứng (ABS), điều khiển phun xăng điện tử tự động trên ô tô, hệ thống điều khiển tàu điện... [94]
* **Thiết bị gia dụng:** Máy giặt, điều hòa nhiệt độ, lò vi sóng, nồi cơm điện thông minh... [94, 95]
* **Y tế:** Máy đo huyết áp điện tử, máy đo nhịp tim, các thiết bị giám sát sức khỏe cầm tay... [94]
* **Công nghiệp và nông nghiệp:** Hệ thống điều khiển cánh tay robot công nghiệp, máy tiện CNC, hệ thống tưới nước tự động cảm biến, máy sưởi điều nhiệt trong nhà kính... [95]

#### 3. Phân loại vi điều khiển [95]
Có hai cách phân loại chính phổ biến hiện nay:
* **Theo độ rộng dữ liệu mà CPU xử lí tại một thời điểm:** Vi điều khiển 8-bit, 16-bit, 32-bit... [95]
* **Theo họ vi điều khiển (kiến trúc chế tạo):** Họ 8051, họ PIC, họ AVR (như ATmega), họ ARM... [95]

---

### II. SƠ ĐỒ CHỨC NĂNG VÀ VAI TRÒ CỦA CÁC KHỐI TRONG VI ĐIỀU KHIỂN [95, 96]

Một vi điều khiển cơ bản gồm 4 khối chức năng cốt lõi kết nối với nhau qua hệ thống các đường bus nội bộ [95]:

```
                ┌────────────────────────────────────────┐
                │               Bộ nhớ                   │
                │   ┌───────────────┐ ┌────────────────┐ │
                │   │  Bộ nhớ ROM   │ │   Bộ nhớ RAM   │ │
                │   └───────┬───────┘ └───────┬────────┘ │
                └───────────┼─────────────────┼──────────┘
                            ▲                 ▲
                            │     Dữ liệu     │
                            ▼                 ▼
  ┌───────────────┐    ┌───────────────────────────┐    ┌───────────────┐
  │ Tín hiệu vào  ├───►│     Bộ xử lí trung tâm    ├───►│ Tín hiệu ra   │
  │ (Cảm biến...) │    │         (CPU)             │    │ (Cơ cấu chấp  │
  └───────────────┘    └───────────────────────────┘    │ hành...)      │
  [Khối đầu vào]                                        └───────────────┘
                                                        [Khối đầu ra]
```

#### 1. Bộ xử lí trung tâm (CPU - Central Processing Unit) [96]
* **Vai trò:** Là bộ não của vi điều khiển, nơi thực hiện mọi thao tác tính toán số học (cộng, trừ, nhân, chia...), các phép toán logic (AND, OR, XOR, NOT...) và điều hành toàn bộ hoạt động của hệ thống theo các tập lệnh chương trình [96].
* **Nguyên lí hoạt động:** CPU đọc dữ liệu và lệnh từ bộ nhớ, giải mã lệnh, thực thi lệnh và gửi kết quả đầu ra hoặc lưu trữ lại vào bộ nhớ [96]. Tần số xung nhịp (clock speed) càng cao thì tốc độ xử lí của CPU càng nhanh [96].

#### 2. Bộ nhớ (Memory) [96]
Bộ nhớ dùng để lưu trữ mã chương trình (câu lệnh) và các số liệu trong quá trình hoạt động. Vi điều khiển thường tích hợp sẵn hai loại bộ nhớ cơ bản [96]:
* **Bộ nhớ chỉ đọc (ROM - Read-Only Memory):** 
  * Dùng để lưu trữ vĩnh viễn chương trình hoạt động của vi điều khiển [96].
  * Dữ liệu trong ROM không bị mất đi khi ngắt nguồn điện [96].
  * Các dòng vi điều khiển hiện đại thường sử dụng loại ROM cho phép xóa và ghi lại dữ liệu bằng tín hiệu điện, được gọi là **EEPROM** hoặc bộ nhớ **Flash** [96].
* **Bộ nhớ truy cập ngẫu nhiên (RAM - Random Access Memory):**
  * Dùng để lưu trữ tạm thời các dữ liệu, biến số, kết quả tính toán trung gian phát sinh trong quá trình CPU thực thi chương trình [96].
  * Dữ liệu trong RAM sẽ bị xóa sạch hoàn toàn ngay khi vi điều khiển bị tắt nguồn điện [96].

#### 3. Khối đầu vào/ra (I/O - Input/Output) [97]
* **Vai trò:** Là cầu nối trung gian ghép nối vi điều khiển với thế giới vật lí bên ngoài (các thiết bị ngoại vi) [97].
* **Cấu tạo:** Gồm các cổng vào (Input) để tiếp nhận dữ liệu từ các cảm biến, nút bấm, thiết bị quét vân tay... và các cổng ra (Output) để gửi tín hiệu điều khiển tới các LED, còi báo, động cơ, rơ-le... [95, 97]

#### 4. Hệ thống các đường Bus nội bộ [97]
Các khối chức năng trong vi điều khiển trao đổi thông tin với nhau thông qua ba loại bus chính [97]:
* **Bus dữ liệu (Data Bus):** Truyền tải thông tin và dữ liệu số giữa CPU, bộ nhớ và các cổng I/O [97].
* **Bus địa chỉ (Address Bus):** Truyền chỉ số địa chỉ của ô nhớ hoặc cổng I/O mà CPU muốn truy cập để đọc/ghi dữ liệu [97].
* **Bus điều khiển (Control Bus):** Truyền các tín hiệu điều khiển đồng bộ và quản lí hoạt động đọc/ghi giữa các khối [97].

---
---

## BÀI 25: BO MẠCH LẬP TRÌNH VI ĐIỀU KHIỂN [98]

### I. GIỚI THIỆU CHUNG VỀ BO MẠCH LẬP TRÌNH VI ĐIỀU KHIỂN [98, 99]
* Do tài nguyên phần cứng của bản thân chip vi điều khiển rất tối giản, việc lập trình, nạp code trực tiếp rất phức tạp [98].
* Vì vậy, người ta thiết kế các **bo mạch lập trình vi điều khiển** (development boards) tích hợp sẵn vi điều khiển trung tâm, các cổng kết nối máy tính (USB), nguồn ổn áp, thạch anh tạo dao động, các chân cắm mở rộng... giúp người dùng dễ dàng thử nghiệm và phát triển ứng dụng [98, 99].
* Bo mạch lập trình thông dụng nhất trong học tập và nghiên cứu hiện nay là **Arduino Uno R3** sử dụng chip vi điều khiển **ATmega328P** của họ AVR [95, 98].

---

### II. CẤU TRÚC PHẦN CỨNG CỦA BO MẠCH ARDUINO UNO [100]

```
                     [ Chân cấp nguồn & Đất ]  [ Chân vào tương tự ]
                               │                         │
                               ▼                         ▼
            ┌────────────────────────────────────────────────────────┐
            │ [ ] RESET                                              │
            │               ========= ARDUINO UNO =========          │
  Cổng ────►│ [USB]                                   ANALOG IN      │
  USB       │                                         [A0] [A1] [A2] │
            │               ┌─────────────┐           [A3] [A4] [A5] │
  Khe ─────►│ [DC IN]       │ Vi điều khiển│                         │
  nguồn     │               │ ATmega328P  │                          │
            │               └─────────────┘                          │
            │                                         DIGITAL (PWM~) │
            │               [TX] [RX]                 [0] [1] ...    │
            │               (LED chỉ thị)             [~9] ... [13]  │
            └────────────────────────────────────────────────────────┘
                                ▲                           ▲
                                │                           │
                       [ LED báo truyền dữ liệu ]     [ Chân vào/ra số ]
```

Các thành phần cơ bản trên bo mạch Arduino Uno R3 bao gồm [100]:
1. **Vi điều khiển trung tâm ATmega328P:** Đảm nhiệm vai trò lưu trữ chương trình, xử lí các thuật toán điều khiển và điều phối hoạt động của toàn bộ các cổng ngoại vi [100].
2. **Cổng kết nối USB (Type-B):** 
   * Dùng để kết nối bo mạch với máy tính nhằm nạp chương trình (code) [100].
   * Truyền thông dữ liệu hai chiều (Serial) giữa máy tính và vi điều khiển [100].
   * Cung cấp nguồn điện 5V trực tiếp từ máy tính để vận hành bo mạch [100].
3. **Khe cắm nguồn ngoài (Jack DC):** Cho phép cấp nguồn điện một chiều độc lập (khuyến cáo từ 7V đến 12V) từ pin hoặc adapter khi không kết nối với máy tính [100].
4. **Các chân vào/ra số (Digital I/O Pins - từ chân số 0 đến chân số 13):**
   * Sử dụng để đọc hoặc xuất các tín hiệu logic nhị phân (chỉ gồm hai mức: 0 - tương ứng với 0V và 1 - tương ứng với 5V) [100].
   * Các chân có kí hiệu dấu ngã (**~**), gồm các chân **3, 5, 6, 9, 10, 11**, có khả năng xuất tín hiệu điều chế độ rộng xung (**PWM**) dùng để điều khiển độ sáng LED, tốc độ động cơ... [100]
   * Chân **0 (RX)** và Chân **1 (TX)** được dùng cho truyền thông nối tiếp nối tiếp UART [100].
5. **Các chân vào tương tự (Analog In - từ chân A0 đến chân A5):**
   * Sử dụng để tiếp nhận các tín hiệu điện áp tương tự biến thiên liên tục (từ 0V đến 5V) từ các cảm biến nhiệt độ, độ ẩm, ánh sáng... [100]
   * Bên trong vi điều khiển có tích hợp bộ chuyển đổi tương tự - số (ADC) giúp chuyển đổi điện áp thành số nguyên từ 0 đến 1023 phục vụ tính toán [100].
6. **Các chân cấp nguồn và đất (Power Pins):**
   * **GND (Ground):** Các chân cực âm (đất) chung của mạch [100].
   * **5V và 3.3V:** Các chân xuất nguồn điện áp ổn định để cấp nguồn cho các cảm biến, linh kiện bên ngoài [100].
   * **Reset:** Chân dùng để khởi động lại chương trình của vi điều khiển từ đầu [100].
7. **Các đèn LED chỉ thị:** Đèn LED **ON** (báo nguồn), LED **L** (nối với chân số 13), đèn **TX** và **RX** nhấp nháy báo hiệu quá trình truyền/nhận dữ liệu đang diễn ra qua cổng USB [100].

---

### III. CÔNG CỤ LẬP TRÌNH VÀ MÔI TRƯỜNG ARDUINO IDE [101, 102]

#### 1. Quy trình lập trình và nạp code cho vi điều khiển [101]:
```
  ┌───────────────┐      ┌─────────────────┐      ┌─────────────────┐      ┌───────────────┐
  │ Lập trình viên│      │ Arduino IDE     │      │ Biên dịch ra    │      │ Nạp mã máy    │
  │ soạn thảo mã  ├─────►│ biên dịch mã    ├─────►│ mã máy (.hex)   ├─────►│ qua cáp USB   │
  │ nguồn (C/C++) │      │ nguồn và sửa lỗi│      │ và lưu bộ nhớ   │      │ vào ATmega328P│
  └───────────────┘      └─────────────────┘      └─────────────────┘      └───────────────┘
```

#### 2. Môi trường phát triển tích hợp Arduino IDE [102]
Arduino IDE là phần mềm chuyên dụng được cài đặt trên máy tính, giao diện gồm ba thành phần chính [102]:
* **Thanh công cụ:** Chứa các nút chức năng nhanh như Kiểm tra lỗi (Verify/Compile), Nạp chương trình (Upload), Tạo file mới, Mở/Lưu file, và nút mở màn hình giám sát Serial Monitor [102].
* **Cửa sổ lập trình:** Nơi soạn thảo mã nguồn bằng ngôn ngữ lập trình C/C++ cải tiến [102].
* **Cửa sổ thông báo:** Nơi hiển thị kết quả biên dịch thành công hay thất bại, liệt kê các lỗi cú pháp (dòng lỗi, mã lỗi) và dung lượng bộ nhớ mà chương trình đã chiếm dụng [102].

#### 3. Cấu trúc một chương trình Arduino cơ bản [103]
Một chương trình Arduino (gọi là một *sketch*) luôn bắt buộc phải có hai hàm chính sau [103]:

```cpp
void setup() {
  // Đoạn mã đặt ở đây chỉ chạy duy nhất 1 LẦN khi bo mạch mới khởi động hoặc khi ấn nút Reset.
  // Thường dùng để khai báo chế độ chân (INPUT/OUTPUT), khởi tạo cổng Serial truyền thông...
}

void loop() {
  // Đoạn mã đặt ở đây sẽ tự động chạy LẶP ĐI LẶP LẠI vô hạn theo chu kì tuần hoàn.
  // Chứa các câu lệnh đọc cảm biến, tính toán logic và điều khiển thiết bị chấp hành.
}
```

*Ví dụ: Chương trình mẫu điều khiển nhấp nháy đèn LED tích hợp sẵn (chân số 13) với chu kì 2 giây [103]:*
```cpp
void setup() {
  pinMode(LED_BUILTIN, OUTPUT); // Khởi tạo chân LED tích hợp làm cổng ra điện áp
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH); // Bật LED sáng (xuất điện áp mức cao 5V)
  delay(1000);                     // Chờ 1000 mili-giây (1 giây)
  digitalWrite(LED_BUILTIN, LOW);  // Tắt LED (xuất điện áp mức thấp 0V)
  delay(1000);                     // Chờ thêm 1 giây
}
```

---
---

## BÀI 26: THỰC HÀNH: THIẾT KẾ, LẮP RÁP, KIỂM TRA MẠCH TỰ ĐỘNG ĐIỀU CHỈNH CƯỜNG ĐỘ SÁNG CỦA LED THEO MÔI TRƯỜNG XUNG QUANH [104]

### I. MỤC ĐÍCH, YÊU CẦU THỰC HÀNH [104]
* **Mục đích:** Giúp học sinh nắm vững nguyên lí hoạt động, cách kết nối linh kiện và lập trình điều khiển thực tế một hệ thống nhúng tự động hóa đơn giản: tự động điều chỉnh độ sáng bóng đèn LED theo độ sáng của môi trường (ứng dụng công nghệ Smart Home, đèn đường thông minh) [104].
* **Yêu cầu:** 
  * Thiết kế, lắp ráp mạch điện tử liên kết cảm biến ánh sáng và đèn LED với Arduino Uno chính xác, an toàn, thẩm mĩ [104].
  * Viết chương trình xử lí tín hiệu tương tự (Analog) từ cảm biến và xuất tín hiệu điều chế độ rộng xung (PWM) để điều khiển tuyến tính độ sáng LED tương ứng [104].

---

### II. CHUẨN BỊ THIẾT BỊ VÀ LINH KIỆN [105]

| STT | Tên thiết bị, linh kiện | Số lượng | Thông số kĩ thuật yêu cầu |
| :--- | :--- | :--- | :--- |
| 1 | **Máy tính cá nhân** | 1 chiếc | Đã cài đặt sẵn phần mềm Arduino IDE [105] |
| 2 | **Bo mạch Arduino Uno R3** | 1 chiếc | Kèm cáp kết nối USB Type-B [105] |
| 3 | **Bo mạch thử (Breadboard)** | 1 chiếc | Kích thước trung bình, thông vách nguồn [105] |
| 4 | **Điện trở quang (LDR / ĐTQ)** | 1 chiếc | Cảm biến ánh sáng biến thiên điện trở theo môi trường [105] |
| 5 | **Điện trở cố định 10 kΩ** | 1 chiếc | Dùng làm điện trở kéo tạo cầu phân áp cho cảm biến [105] |
| 6 | **Điện trở cố định 220 Ω** | 1 chiếc | Điện trở hạn dòng bảo vệ bóng đèn LED [105] |
| 7 | **Đèn LED đơn màu** | 1 chiếc | LED siêu sáng (màu đỏ hoặc xanh), điện áp làm việc 1.8V - 2V [105] |
| 8 | **Dây nối** | 1 bộ | Dây cắm đực-đực chuyên dụng cho breadboard [105] |

---

### III. SƠ ĐỒ MẠCH ĐIỆN NGUYÊN LÍ KẾT NỐI [104]

Mạch sử dụng hai khối chức năng ghép nối với Arduino Uno R3 [104]:
1. **Khối cảm biến đầu vào (Cầu phân áp):** Điện trở quang **R1** kết hợp nối tiếp với điện trở kéo **R3** (10 kΩ) nối giữa nguồn 5V và GND. Điểm giữa của cầu phân áp được đấu trực tiếp vào chân đầu vào tương tự **A0** của Arduino Uno [104].
   * *Nguyên lí:* Khi ánh sáng môi trường thay đổi, điện trở của R1 thay đổi làm điện áp phân áp tại điểm nối giữa R1 và R3 biến động tuyến tính. Điện áp này được chân A0 tiếp nhận dưới dạng giá trị tương tự [104].
2. **Khối điều khiển đầu ra:** Đèn LED nối tiếp với điện trở hạn dòng **R2** (220 Ω) để chống cháy, cực dương (Anode) nối vào chân ra số hỗ trợ PWM - **chân số 9** của Arduino, cực âm (Cathode) nối đất GND [104].

```
                     +5V
                      │
                    ┌─┴─┐
                    │R3 │ (10k)
                    └─┬─┘
                      ├─────────► Chân Analog A0 (Arduino)
                    ┌─┴─┐
                    │R1 │ (Điện trở quang LDR)
                    └─┬─┘
                      │
                     GND
                     
  Chân PWM 9 ────────►[ R2 (220) ]───►[ LED Anode(+) ]───►[ LED Cathode(-) ]───► GND
```

---

### IV. NỘI DUNG VÀ QUY TRÌNH THỰC HÀNH [105, 106]

#### Bước 1: Lắp ráp phần cứng trên breadboard [105]
* Ngắt hoàn toàn nguồn điện của bo mạch Arduino Uno [105].
* Cắm điện trở quang R1 và điện trở kéo R3 (10k) lên breadboard để tạo cầu phân áp. Đấu dây từ đầu còn lại của R3 lên chân 5V của Arduino. Đấu dây từ đầu còn lại của R1 xuống chân GND của Arduino. Trích dây từ điểm nối chung giữa R1 và R3 cắm vào chân A0 [105].
* Cắm LED và điện trở hạn dòng R2 (220) lên breadboard. Đấu cực dương LED thông qua R2 vào chân số 9 của Arduino. Đấu cực âm LED trực tiếp xuống chân GND [105].
* Đảm bảo các mối nối cơ học chắc chắn, không chạm chập, chồng chéo dây [104].

#### Bước 2: Viết mã nguồn điều khiển và hiệu chuẩn cảm biến (Calib) [105, 106]
Kết nối cáp USB từ Arduino vào máy tính, khởi động phần mềm Arduino IDE và tiến hành nạp đoạn chương trình chuẩn hóa tự động sau [105, 106]:

```cpp
// Khai báo các hằng số chân kết nối [105]
const int sensorPin = A0;  // Chân nhận tín hiệu tương tự từ điện trở quang (ĐTQ)
const int ledPin = 9;      // Chân xuất tín hiệu PWM điều khiển độ sáng LED

// Khai báo các biến lưu trữ giá trị [105]
int sensorValue = 0;       // Giá trị đọc trực tiếp từ cảm biến (0 - 1023)
int sensorMin = 1023;      // Giá trị cảm biến nhỏ nhất ghi nhận khi hiệu chuẩn
int sensorMax = 0;         // Giá trị cảm biến lớn nhất ghi nhận khi hiệu chuẩn

void setup() {
  // Dùng đèn LED tích hợp trên chân 13 để báo hiệu trạng thái hiệu chuẩn [105]
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH); // Bật LED báo hiệu bắt đầu hiệu chuẩn
  
  // Khởi tạo chân ledPin 9 là cổng xuất tín hiệu [105]
  pinMode(ledPin, OUTPUT);
  
  // Quá trình tự động hiệu chuẩn (calib) diễn ra trong 5 giây đầu tiên [105, 106]
  while (millis() < 5000) {
    sensorValue = analogRead(sensorPin); // Đọc giá trị cảm biến liên tục
    
    // Ghi nhận và lưu lại giá trị tương tự khi ánh sáng yếu nhất [106]
    if (sensorValue > sensorMax) {
      sensorMax = sensorValue;
    }
    // Ghi nhận và lưu lại giá trị tương tự khi ánh sáng mạnh nhất [106]
    if (sensorValue < sensorMin) {
      sensorMin = sensorValue;
    }
    delay(50);
  }
  
  digitalWrite(LED_BUILTIN, LOW); // Tắt LED báo hiệu hoàn tất hiệu chuẩn [106]
}

void loop() {
  // Đọc giá trị điện áp thực tế từ cảm biến [106]
  sensorValue = analogRead(sensorPin);
  
  // Ánh xạ dải giá trị từ dải calib thực tế sang dải PWM (0 - 255) [106]
  sensorValue = map(sensorValue, sensorMin, sensorMax, 0, 255);
  
  // Khống chế giá trị nằm nghiêm ngặt trong dải an toàn từ 0 đến 255 [106]
  sensorValue = constrain(sensorValue, 0, 255);
  
  // Xuất tín hiệu điều chế độ rộng xung (PWM) ra chân số 9 điều khiển LED [106]
  analogWrite(ledPin, sensorValue);
  
  delay(50);
}
```

*Giải thích thuật toán:* Trong 5 giây đầu tiên khởi động, người dùng dùng tay che khuất hoàn toàn cảm biến (ánh sáng yếu nhất) rồi dùng đèn pin rọi thẳng vào cảm biến (ánh sáng mạnh nhất). Vi điều khiển sẽ tự động lưu lại dải giới hạn này thành `sensorMin` và `sensorMax` [105, 106]. Trong chương trình `loop()`, hàm `map()` và `constrain()` giúp chuyển đổi giá trị cảm biến đọc được thành giá trị xuất PWM tương ứng để tăng/giảm cường độ sáng LED mượt mà [106].

#### Bước 3: Đo kiểm và ghi nhận kết quả [106, 107]
* Tiến hành nạp code, thực hiện hiệu chuẩn [106].
* Thực nghiệm che tối cảm biến hoặc chiếu sáng và ghi nhận trạng thái vào bảng báo cáo [107]:

| Lần đo | Trạng thái (Cường độ sáng của môi trường) | Cường độ sáng của LED | Ghi chú |
| :---: | :--- | :---: | :--- |
| **1** | Chiếu sáng yếu (dùng tay che cảm biến) | **Sáng mạnh nhất** | LED đạt độ sáng cực đại để bù đắp ánh sáng [107] |
| **2** | Chiếu sáng tự nhiên (môi trường bình thường) | **Sáng trung bình** | LED sáng ở mức vừa phải để tiết kiệm điện [107] |
| **3** | Chiếu sáng mạnh (rọi đèn trực tiếp) | **Tắt hẳn** | LED tắt hoàn toàn vì môi trường đã đủ sáng [107] |

---
---

## TỔNG KẾT CHƯƠNG IX: SƠ ĐỒ HỆ THỐNG KIẾN THỨC [108]

```
                                  ┌──────────────────────────────┐
                                  │     VI ĐIỀU KHIỂN (CHƯƠNG IX)│
                                  └──────────────┬───────────────┘
                                                 │
            ┌────────────────────────────────────┼────────────────────────────────────┐
            ▼                                    ▼                                    ▼
┌───────────────────────┐            ┌───────────────────────┐            ┌───────────────────────┐
│ 1. Khái quát về       │            │ 2. Bo mạch lập trình  │            │ 3. Thực hành mạch tự  │
│    Vi điều khiển      │            │    Vi điều khiển      │            │    động điều chỉnh    │
└───────────┬───────────┘            └───────────┬───────────┘            └───────────┬───────────┘
            │                                    │                                    │
  ├─ Định nghĩa & Ứng dụng [93,94]     ├─ Bo mạch Arduino Uno  │                    ├─ Sơ đồ mạch điện [104]
  │  (Hệ thống nhúng, xe cộ,...)       │  R3 (ATmega328P) [95,98]                  │  (ĐTQ R1, R3, R2, LED)
  ├─ Sơ đồ chức năng [95]              ├─ Cấu trúc chân [100]                      ├─ Lập trình Arduino IDE [105,106]
  │  (CPU, Bộ nhớ, Cổng I/O)           │  (14 Digital, 6 Analog,                   │  (Hiệu chuẩn calib,
  └─ Các đường Bus truyền [97]         │   các chân Power, Reset)                  │   hàm map, constrain)
     (Bus dữ liệu, địa chỉ,            ├─ Công cụ lập trình [101]                  └─ Hoàn thành báo cáo [107]
      bus điều khiển)                  │  (Phần mềm Arduino IDE)                      (Đo kiểm 3 trạng thái)
                                       └─ Cấu trúc chương trình [103]
                                          (Hàm setup() và loop())
```
