# CHƯƠNG IV: DÒNG ĐIỆN. MẠCH ĐIỆN [85, 86]

## Bài 22: Cường độ dòng điện [86, 87, 88, 89]

### I. Cường độ dòng điện
* **Thí nghiệm khảo sát:** Khi đóng khoá K, ta thấy bóng đèn Đ sáng và ampe kế chỉ một giá trị nhất định [86]. Khi thay đổi biến trở, số chỉ của ampe kế tăng lên thì độ sáng của đèn cũng tăng theo [86]. Như vậy, độ sáng của đèn đặc trưng cho độ mạnh yếu của dòng điện chạy qua nó [86].
* **Định nghĩa:** Cường độ dòng điện là đại lượng đặc trưng cho tác dụng mạnh, yếu của dòng điện và được xác định bằng điện lượng chuyển qua tiết diện thẳng của vật dẫn trong một đơn vị thời gian [87, 89]:
  $$I = \frac{\Delta q}{\Delta t}$$ [87, 89]
  Trong đó:
  * $I$: Cường độ dòng điện, đơn vị ampe ($\text{A}$) [87].
  * $\Delta q$: Điện lượng dịch chuyển qua tiết diện thẳng của vật dẫn, đơn vị culông ($\text{C}$) [87].
  * $\Delta t$: Khoảng thời gian dịch chuyển, đơn vị giây ($\text{s}$) [87].
* **Mối liên hệ điện tích:** Từ công thức trên, ta rút ra lượng điện tích dịch chuyển:
  $$\Delta q = I \cdot \Delta t$$ [87]
  * Đơn vị của điện lượng là culông ($\text{C}$): $1 \text{ C} = 1 \text{ A} \cdot \text{s}$ [87]. Một culông là lượng điện tích dịch chuyển qua tiết diện thẳng của dây dẫn trong thời gian $1 \text{ s}$ khi dòng điện có cường độ $1 \text{ A}$ [87].

### II. Liên hệ giữa cường độ dòng điện với mật độ và tốc độ của các hạt mang điện
* **Dòng điện trong vật dẫn kim loại:** Trong kim loại tồn tại các electron tự do chuyển động hỗn loạn về mọi hướng [87]. Khi đặt vào một hiệu điện thế, dưới tác dụng của điện trường, các electron tự do mang điện tích âm chuyển động ngược chiều điện trường, tạo ra dòng điện [87]. Chiều quy ước của dòng điện là chiều chuyển động của các điện tích dương (ngược với chiều dịch chuyển của các electron tự do trong kim loại) [87].
* **Công thức liên hệ:**
  $$I = S \cdot n \cdot v \cdot e$$ [88, 89]
  Trong đó:
  * $S$: Diện tích tiết diện thẳng của dây dẫn, đơn vị mét vuông ($\text{m}^2$) [88].
  * $n$: Mật độ hạt mang điện (số electron tự do trong một đơn vị thể tích của dây dẫn), đơn vị $\text{m}^{-3}$ [88].
  * $v$: Tốc độ dịch chuyển có hướng của electron, đơn vị mét trên giây ($\text{m/s}$) [88].
  * $e$: Độ lớn điện tích của electron ($e \approx 1,6 \cdot 10^{-19} \text{ C}$) [88].
* **Bài tập vận dụng:** Một dây dẫn bằng kim loại hình trụ tròn, đường kính tiết diện $d = 2 \text{ mm}$ có dòng điện $I = 5 \text{ A}$ chạy qua. Cho biết mật độ electron tự do trong đồng là $n = 8,45 \cdot 10^{28} \text{ electron/m}^3$. Tính tốc độ dịch chuyển có hướng của các electron [88].
  * *Lời giải:*
    Tiết diện thẳng của dây dẫn: $S = \frac{\pi d^2}{4}$ [88].
    Áp dụng công thức: $I = S \cdot n \cdot v \cdot e \Rightarrow v = \frac{I}{S \cdot n \cdot e} = \frac{4I}{\pi d^2 \cdot n \cdot e}$ [88].
    Thay số: $v = \frac{4 \cdot 5}{3,14 \cdot (2 \cdot 10^{-3})^2 \cdot 8,45 \cdot 10^{28} \cdot 1,6 \cdot 10^{-19}} \approx 1,2 \cdot 10^{-4} \text{ m/s} = 0,12 \text{ mm/s}$ [88].

---

## Bài 23: Điện trở. Định luật Ohm [90, 91, 92, 93, 94, 95, 96, 97]

### I. Điện trở
* **Định nghĩa:** Điện trở là đại lượng đặc trưng cho mức độ cản trở dòng điện của vật dẫn [91, 97]. 
* **Công thức xác định:** Với mỗi vật dẫn, tỉ số giữa hiệu điện thế $U$ và cường độ dòng điện $I$ là một hằng số không đổi gọi là điện trở $R$ của vật dẫn đó [91]:
  $$R = \frac{U}{I}$$ [91, 97]
* **Đơn vị:** ôm ($\Omega$), trong đó:
  $$1 \, \Omega = \frac{1 \text{ V}}{1 \text{ A}}$$ [91]
  * Các bội số thường dùng: $1 \text{ k}\Omega = 1\,000 \, \Omega$; $1 \text{ M}\Omega = 1\,000\,000 \, \Omega$ [91].
* **Đường đặc trưng vôn - ampe:** Là đồ thị biểu diễn sự phụ thuộc của cường độ dòng điện $I$ chạy qua vật dẫn vào hiệu điện thế $U$ giữa hai đầu vật dẫn đó [91]. 
  * Đối với vật dẫn kim loại ở nhiệt độ không đổi, đường đặc trưng vôn - ampe là một đường thẳng đi qua gốc toạ độ, có độ dốc $k = \frac{1}{R}$ không đổi [91, 92]. Điện trở $R$ càng lớn thì đường đặc trưng càng ít dốc [92].

### II. Định luật Ohm
* **Nội dung:** Cường độ dòng điện chạy qua vật dẫn kim loại tỉ lệ thuận với hiệu điện thế giữa hai đầu vật dẫn và tỉ lệ nghịch với điện trở của vật dẫn đó [92, 97].
* **Biểu thức:**
  $$I = \frac{U}{R}$$ [92, 97]

### III. Nguyên nhân gây ra điện trở và ảnh hưởng của nhiệt độ lên điện trở

#### 1. Nguyên nhân gây ra điện trở trong vật dẫn kim loại
* Trong kim loại, các ion dương liên kết với nhau một cách trật tự tạo nên mạng tinh thể kim loại [92]. Các ion này dao động nhiệt quanh các nút mạng [92].
* Các electron tự do dịch chuyển có hướng dưới tác dụng của điện trường sẽ va chạm với các ion ở nút mạng tinh thể đang dao động nhiệt, làm cản trở chuyển động của chúng [92]. Sự cản trở này chính là nguyên nhân gây ra điện trở của kim loại [92].

#### 2. Ảnh hưởng của nhiệt độ lên điện trở
* **Đối với vật dẫn kim loại:** Khi nhiệt độ tăng, các ion ở nút mạng tinh thể dao động mạnh hơn, làm tăng xác suất va chạm với các electron tự do, do đó điện trở của kim loại tăng lên [93].
  Công thức điện trở suất $\rho$ phụ thuộc vào nhiệt độ theo hàm bậc nhất [93]:
  $$\rho = \rho_0 [1 + \alpha(t - t_0)]$$ [93]
  Trong đó: $\rho$ và $\rho_0$ lần lượt là điện trở suất ở nhiệt độ $t$ và $t_0$ ($\Omega\cdot\text{m}$); $\alpha$ là hệ số nhiệt điện trở ($\text{K}^{-1}$) [93].
* **Điện trở của đèn sợi đốt:** Dòng điện chạy qua dây tóc của bóng đèn sợi đốt làm cho dây tóc nóng lên, dẫn đến điện trở của dây tóc tăng lên rõ rệt so với lúc nguội [93]. Do đó, đường đặc trưng vôn - ampe của đèn sợi đốt không còn là đường thẳng mà có dạng cong [93].
* **Điện trở nhiệt (Thermistor):** Là linh kiện điện tử có điện trở thay đổi rõ rệt theo nhiệt độ [94].
  * *Điện trở nhiệt NTC (Negative Temperature Coefficient):* Điện trở giảm mạnh khi nhiệt độ tăng [94].
  * *Điện trở nhiệt PTC (Positive Temperature Coefficient):* Điện trở tăng khi nhiệt độ tăng [94].
* **Hiện tượng siêu dẫn:** Khi một số kim loại hoặc hợp kim được làm lạnh xuống dưới một nhiệt độ tới hạn $T_c$ nhất định thì điện trở của chúng đột ngột giảm xuống bằng không ($R = 0$) [96, 97]. Khi đó, dòng điện có thể duy trì vô hạn trong mạch siêu dẫn mà không hao phí năng lượng tỏa nhiệt [96].

---

## Bài 24: Nguồn điện [97, 98, 99, 100]

### I. Nguồn điện. Suất điện động của nguồn điện
* **Điều kiện duy trì dòng điện:** Để duy trì dòng điện trong mạch điện, cần phải duy trì một hiệu điện thế nhất định giữa hai đầu mạch ngoài [97]. Thiết bị thực hiện nhiệm vụ này được gọi là **ngguồn điện** [97].
* **Cơ chế hoạt động:** Bên trong nguồn điện, dưới tác dụng của các lực có bản chất khác with lực điện (gọi là **lực lạ**), các hạt tải điện dương dịch chuyển ngược chiều điện trường (từ cực âm sang cực dương) [98, 100]. Quá trình này thực hiện công thắng công cản của trường tĩnh điện bên trong nguồn [98].
* **Suất điện động ($\mathcal{E}$):** Là đại lượng đặc trưng cho khả năng thực hiện công của nguồn điện và được đo bằng thương số giữa công $A$ của lực lạ thực hiện khi làm dịch chuyển một điện tích dương $q$ bên trong nguồn từ cực âm đến cực dương và độ lớn của điện tích $q$ đó [98, 100]:
  $$\mathcal{E} = \frac{A}{q}$$ [98, 100]
  * Đơn vị của suất điện động là vôn ($\text{V}$) [98, 100].

### II. Điện trở trong và Định luật Ohm toàn mạch
* **Điện trở trong ($r$):** Bản thân nguồn điện cũng là một vật dẫn nên nó có điện trở, gọi là điện trở trong của nguồn điện [98]. Do đó, mỗi nguồn điện được đặc trưng bởi hai thông số: suất điện động $\mathcal{E}$ và điện trở trong $r$ [98].
* **Định luật Ohm cho toàn mạch:**
  Cường độ dòng điện chạy trong mạch điện kín tỉ lệ thuận với suất điện động của nguồn điện và tỉ lệ nghịch với điện trở toàn phần của mạch đó [99, 100].
  $$I = \frac{\mathcal{E}}{R + r}$$ [99, 100]
  Trong đó:
  * $\mathcal{E}$: Suất điện động của nguồn điện ($\text{V}$) [99].
  * $R$: Điện trở tương đương của mạch ngoài ($\Omega$) [99].
  * $r$: Điện trở trong của nguồn điện ($\Omega$) [99].
* **Hiệu điện thế giữa hai cực của nguồn điện (Hiệu điện thế mạch ngoài):**
  $$U = I \cdot R = \mathcal{E} - I \cdot r$$ [99, 100]
* **Hiện tượng đoản mạch:** Xảy ra khi nguồn điện được nối trực tiếp với mạch ngoài có điện trở rất nhỏ ($R \approx 0$) [100]. Khi đó, cường độ dòng điện trong mạch tăng lên rất lớn và chỉ phụ thuộc vào điện trở trong của nguồn [100]:
  $$I_{đm} = \frac{\mathcal{E}}{r}$$ [100]
  * Cường độ dòng điện đoản mạch cực đại có thể gây hư hỏng thiết bị, gây cháy nổ, hoả hoạn cực kì nguy hiểm [100].

---

## Bài 25: Năng lượng và công suất điện [101, 102, 103, 104, 105]

### I. Năng lượng điện và Công suất điện tiêu thụ

#### 1. Năng lượng điện tiêu thụ của đoạn mạch
* Khi đặt hiệu điện thế $U$ vào hai đầu một đoạn mạch tiêu thụ điện, dưới tác dụng của lực điện, các điện tích dịch chuyển có hướng tạo ra dòng điện [101]. Công của lực điện thực hiện dịch chuyển các điện tích chính là năng lượng điện tiêu thụ của đoạn mạch [101].
* **Công thức:**
  $$W = A = U \cdot I \cdot t$$ [101, 105]
  * Đơn vị của năng lượng điện tiêu thụ là jun ($\text{J}$) [101, 105].
* **Định luật Joule - Lenz (cho đoạn mạch thuần điện trở):** Khi dòng điện chạy qua đoạn mạch chỉ có điện trở $R$, toàn bộ năng lượng điện tiêu thụ chuyển hoá hoàn toàn thành nhiệt lượng tỏa ra trên điện trở [102, 105]:
  $$Q = I^2 \cdot R \cdot t = \frac{U^2}{R} \cdot t$$ [102, 105]

#### 2. Công suất điện tiêu thụ của đoạn mạch
* Công suất điện tiêu thụ của một đoạn mạch là năng lượng điện mà mạch tiêu thụ trong một đơn vị thời gian [102, 105].
* **Công thức:**
  $$\mathcal{P} = \frac{A}{t} = U \cdot I$$ [102, 105]
  * Đơn vị của công suất là oát ($\text{W}$) [102, 105].
  * Đối với đoạn mạch thuần điện trở: $\mathcal{P} = I^2 \cdot R = \frac{U^2}{R}$ [105].

#### 3. Thiết bị đo năng lượng điện - Công tơ điện
* Trong đời sống sinh hoạt, năng lượng điện tiêu thụ được đo bằng **công tơ điện** [102].
* Đơn vị đo lượng điện năng tiêu thụ thường dùng là kilôoát giờ ($\text{kW}\cdot\text{h}$) [102].
  $$1 \text{ kW}\cdot\text{h} = 3\,600\,000 \text{ J} = 3,6 \cdot 10^6 \text{ J}$$ [102]
  * Mỗi số điện hiển thị trên công tơ tương ứng với $1 \text{ kW}\cdot\text{h}$ năng lượng điện tiêu thụ [102].

---

## Bài 26: Thực hành: Đo suất điện động và điện trở trong của pin điện hoá [106, 107, 108]

### I. Dụng cụ thí nghiệm
* Hai pin điện hoá loại $1,5 \text{ V}$ (cũ và mới) [106].
* Một biến trở con chạy hoặc biến trở thập phân $100 \, \Omega$ [106].
* Hai đồng hồ đo điện đa năng hiện số (để đo hiệu điện thế và cường độ dòng điện) [106].
* Khoá K, các dây nối và bảng lắp mạch điện [106].

### II. Cơ sở lí thuyết
* Theo định luật Ohm cho toàn mạch:
  $$U = \mathcal{E} - I \cdot r$$ [107]
* Đồ thị biểu diễn mối quan hệ giữa hiệu điện thế mạch ngoài $U$ và cường độ dòng điện $I$ chạy trong mạch có dạng một đoạn thẳng dốc xuống [107]:
  * Điểm giao của đường thẳng này với trục tung (khi $I = 0$) cho ta giá trị của suất điện động $\mathcal{E}$ ($U_0 = \mathcal{E}$) [107].
  * Độ dốc của đồ thị chính là điện trở trong $r$:
    $$r = \frac{U_P - U_Q}{I_Q - I_P}$$ [107]

### III. Tiến hành thí nghiệm và xử lí kết quả
* **Lắp mạch điện:** Mắc nối tiếp pin cần đo, khoá K, ampe kế, và biến trở thành một mạch kín [106, 107]. Mắc vôn kế song song với hai cực của nguồn pin [106, 107].
* **Thực hiện đo:** Đóng khoá K, điều chỉnh biến trở để thay đổi điện trở mạch ngoài, ghi lại giá trị $U$ (trên vôn kế) và $I$ (trên ampe kế) ứng với từng nấc của biến trở [107]. Lặp lại phép đo ít nhất 5 lần với các giá trị biến trở giảm dần [107].
* **Xử lí số liệu:** Vẽ đồ thị $U = f(I)$ trên hệ trục toạ độ $U-I$ [107]. Đường kéo dài của đồ thị cắt trục tung tại giá trị $U_0$ chính là giá trị suất điện động $\mathcal{E}$ của pin [107]. Tính độ dốc để suy ra điện trở trong $r$ [107].
