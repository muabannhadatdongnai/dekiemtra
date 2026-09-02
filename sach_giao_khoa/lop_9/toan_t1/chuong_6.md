# TÀI LIỆU ÔN TẬP TỔNG HỢP TOÁN 9 - TẬP 1
## HỆ THỐNG KIẾN THỨC, CÔNG THỨC VÀ PHƯƠNG PHÁP GIẢI TOÁN TOÀN DIỆN

Tài liệu ôn tập tổng hợp này được biên soạn dựa trên nội dung cốt lõi của 5 chương trong sách giáo khoa Toán 9 - Tập 1. Tài liệu được cấu trúc chặt chẽ thành hai phần: **Đại số** (Chương I, II, III) và **Hình học** (Chương IV, V), giúp học sinh dễ dàng tra cứu, củng cố lý thuyết, nắm vững các công thức trọng tâm và rèn luyện kỹ năng giải các dạng toán điển hình.

---

# PHẦN 1: ĐẠI SỐ

## CHƯƠNG I: HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN

### 1. Kiến thức & Công thức cốt lõi
*   **Phương trình bậc nhất hai ẩn**: Là phương trình có dạng $ax + by = c$ với $a, b, c \in \mathbb{R}$ và $a^2 + b^2 \neq 0$.
    *   *Tập nghiệm*: Phương trình luôn có vô số nghiệm. Trong mặt phẳng tọa độ $Oxy$, tập nghiệm được biểu diễn bởi đường thẳng $d: ax + by = c$.
*   **Hệ hai phương trình bậc nhất hai ẩn**: 
    $$\begin{cases} ax + by = c \\ a'x + b'y = c' \end{cases} \quad (H)$$
    *   *Ý nghĩa hình học*: Hệ có nghiệm duy nhất khi hai đường thẳng cắt nhau; vô nghiệm khi hai đường thẳng song song; vô số nghiệm khi hai đường thẳng trùng nhau.

### 2. Phương pháp giải các dạng toán điển hình
*   **Dạng 1: Giải hệ phương trình bằng phương pháp thế**
    1.  *Bước 1*: Từ một phương trình của hệ, biểu diễn một ẩn theo ẩn kia (ví dụ $y$ theo $x$).
    2.  *Bước 2*: Thế biểu thức vừa tìm được vào phương trình còn lại để thu được phương trình bậc nhất một ẩn ($x$).
    3.  *Bước 3*: Giải phương trình một ẩn đó để tìm $x$, rồi thế ngược lại để tìm $y$.
*   **Dạng 2: Giải hệ phương trình bằng phương pháp cộng đại số**
    1.  *Bước 1*: Nhân hai vế của mỗi phương trình với một hệ số thích hợp sao cho các hệ số của một ẩn nào đó bằng nhau hoặc đối nhau.
    2.  *Bước 2*: Cộng hoặc trừ từng vế hai phương trình để triệt tiêu ẩn đó, thu được phương trình bậc nhất một ẩn.
    3.  *Bước 3*: Giải phương trình một ẩn tìm được rồi tính ẩn còn lại.
*   **Dạng 3: Giải bài toán bằng cách lập hệ phương trình**
    1.  *Bước 1 (Lập hệ)*: Chọn hai ẩn số và đặt điều kiện thích hợp; biểu diễn các đại lượng chưa biết theo ẩn; lập hai phương trình dựa trên các dữ kiện bài toán.
    2.  *Bước 2 (Giải hệ)*: Giải hệ phương trình vừa lập.
    3.  *Bước 3 (Kết luận)*: Đối chiếu điều kiện thực tế của ẩn và trả lời.

### 3. Bài tập minh họa tiêu biểu
*   **Bài toán**: Tìm một số tự nhiên có hai chữ số, biết rằng chữ số hàng chục lớn hơn chữ số hàng đơn vị là $2$. Nếu viết chữ số đó theo thứ tự ngược lại thì được số mới nhỏ hơn số ban đầu là $18$.
    *   *Lời giải*:
        Gọi chữ số hàng chục là $x$, chữ số hàng đơn vị là $y$ ($x \in \{1, 2, ..., 9\}$, $y \in \{0, 1, ..., 9\}$).
        Số ban đầu được biểu diễn là: $\overline{xy} = 10x + y$.
        Số viết ngược lại là: $\overline{yx} = 10y + x$.
        Theo giả thiết thứ nhất, ta có phương trình: $x - y = 2 \quad (1)$.
        Theo giả thiết thứ hai, ta có phương trình: $(10x + y) - (10y + x) = 18 \Leftrightarrow 9x - 9y = 18 \Leftrightarrow x - y = 2 \quad (2)$.
        Vì phương trình (1) và (2) trùng nhau, bài toán có nhiều nghiệm thỏa mãn $x - y = 2$. Các số thỏa mãn là: $20, 31, 42, 53, 64, 75, 86, 97$.

---

## CHƯƠNG II: PHƯƠNG TRÌNH VÀ BẤT PHƯƠNG TRÌNH BẬC NHẤT MỘT ẨN

### 1. Kiến thức & Công thức cốt lõi
*   **Phương trình tích**: $(ax+b)(cx+d) = 0 \Leftrightarrow ax+b=0$ hoặc $cx+d=0$.
*   **Phương trình chứa ẩn ở mẫu**:
    *   *ĐKXĐ*: Các mẫu thức phải khác $0$.
    *   *Quy đồng và khử mẫu*: Tìm mẫu thức chung, quy đồng rồi chỉ lấy tử số bằng nhau.
*   **Bất đẳng thức & Tính chất**:
    *   Cộng hai vế với một số: $a < b \Leftrightarrow a + c < b + c$.
    *   Nhân hai vế với số dương ($c > 0$): $a < b \Leftrightarrow ac < bc$.
    *   Nhân hai vế với số âm ($c < 0$): $a < b \Leftrightarrow ac > bc$ (đổi chiều bất đẳng thức).
*   **Bất phương trình bậc nhất một ẩn**: $ax + b < 0$ (hoặc $> 0, \le 0, \ge 0$) với $a \neq 0$.

### 2. Phương pháp giải các dạng toán điển hình
*   **Dạng 1: Giải phương trình chứa ẩn ở mẫu**
    1.  Tìm ĐKXĐ của phương trình.
    2.  Quy đồng mẫu thức hai vế của phương trình rồi khử mẫu.
    3.  Giải phương trình nhận được sau khi khử mẫu.
    4.  Kiểm tra điều kiện xác định và kết luận tập nghiệm.
*   **Dạng 2: Giải bất phương trình bậc nhất một ẩn**
    1.  Chuyển các hạng tử chứa ẩn sang một vế, các hằng số tự do sang vế còn lại.
    2.  Thu gọn và thực hiện chia cả hai vế cho hệ số của ẩn. **Chú ý**: Đổi chiều bất phương trình nếu chia cho số âm.

### 3. Bài tập minh họa tiêu biểu
*   **Bài toán (Lãi suất gửi tiết kiệm)**: Một người gửi tiết kiệm ngân hàng kỳ hạn 1 tháng với lãi suất $0,4\%/\text{tháng}$. Hỏi để nhận được số tiền lãi mỗi tháng ít nhất là $3$ triệu đồng thì người đó phải gửi tiết kiệm tối thiểu bao nhiêu tiền?
    *   *Lời giải*:
        Gọi số tiền gửi tiết kiệm là $x$ (triệu đồng), điều kiện $x > 0$.
        Số tiền lãi nhận được mỗi tháng là: $T_{\text{lãi}} = x \cdot 0,4\% = 0,004x$ (triệu đồng).
        Để số tiền lãi mỗi tháng nhất là $3$ triệu đồng, ta có bất phương trình:
        $$0,004x \ge 3 \Leftrightarrow x \ge \frac{3}{0,004} \Leftrightarrow x \ge 750$$
        Vậy người đó phải gửi tiết kiệm ít nhất là **750 triệu đồng**.

---

## CHƯƠNG III: CĂN BẬC HAI VÀ CĂN BẬC BA

### 1. Kiến thức & Công thức cốt lõi
*   **Căn bậc hai số học**: Với số dương $a$, số $\sqrt{a}$ được gọi là căn bậc hai số học của $a$.
*   **Hằng đẳng thức**: $\sqrt{A^2} = |A| = \begin{cases} A & \text{nếu } A \ge 0 \\ -A & \text{nếu } A < 0 \end{cases}$
*   **Các công thức biến đổi căn thức cơ bản**:
    1.  $\sqrt{A \cdot B} = \sqrt{A} \cdot \sqrt{B} \quad (A, B \ge 0)$
    2.  $\sqrt{\frac{A}{B}} = \frac{\sqrt{A}}{\sqrt{B}} \quad (A \ge 0, B > 0)$
    3.  $\sqrt{A^2 B} = |A|\sqrt{B} \quad (B \ge 0)$
    4.  $\frac{A}{\sqrt{B}} = \frac{A\sqrt{B}}{B} \quad (B > 0)$
    5.  $\frac{C}{\sqrt{A} \pm B} = \frac{C(\sqrt{A} \mp B)}{A - B^2} \quad (A \ge 0, A \neq B^2)$
    6.  $\frac{C}{\sqrt{A} \pm \sqrt{B}} = \frac{C(\sqrt{A} \mp \sqrt{B})}{A - B} \quad (A, B \ge 0, A \neq B)$
*   **Căn bậc ba**: $\sqrt[3]{a} = x \Leftrightarrow x^3 = a$. Mỗi số thực $a$ đều có một căn bậc ba duy nhất và $\sqrt[3]{A^3} = A$.

### 2. Phương pháp giải các dạng toán điển hình
*   **Dạng 1: Rút gọn biểu thức chứa căn thức bậc hai**
    *   Sử dụng hằng đẳng thức $\sqrt{A^2} = |A|$ để phá căn bậc hai.
    *   Đưa thừa số ra ngoài hoặc vào trong dấu căn để đưa về các căn thức đồng dạng rồi thu gọn.
    *   Trục căn thức ở mẫu bằng cách nhân tử và mẫu với lượng liên hợp thích hợp.
*   **Dạng 2: Tìm điều kiện xác định của biểu thức chứa căn**
    *   Biểu thức $\sqrt{A}$ xác định khi và chỉ khi $A \ge 0$.
    *   Phân thức $\frac{A}{B}$ xác định khi và chỉ khi $B \neq 0$.

### 3. Bài tập minh họa tiêu biểu
*   **Bài toán**: Rút gọn biểu thức $P = \sqrt{(\sqrt{5}-3)^2} + \frac{1}{\sqrt{5}-2}$.
    *   *Lời giải*:
        Ta có: $\sqrt{(\sqrt{5}-3)^2} = |\sqrt{5}-3|$.
        Vì $\sqrt{5} < \sqrt{9} = 3 \Rightarrow \sqrt{5}-3 < 0$, do đó: $|\sqrt{5}-3| = 3 - \sqrt{5}$.
        Thực hiện trục căn thức ở mẫu số hạng tử thứ hai:
        $$\frac{1}{\sqrt{5}-2} = \frac{\sqrt{5}+2}{(\sqrt{5}-2)(\sqrt{5}+2)} = \frac{\sqrt{5}+2}{5-4} = \sqrt{5}+2$$
        Thay vào biểu thức $P$:
        $$P = (3 - \sqrt{5}) + (\sqrt{5} + 2) = (3 + 2) + (-\sqrt{5} + \sqrt{5}) = 5$$
        Vậy giá trị rút gọn của $P = 5$.

---

# PHẦN 2: HÌNH HỌC

## CHƯƠNG IV: HỆ THỨC LƯỢNG TRONG TAM GIÁC VUÔNG

### 1. Kiến thức & Công thức cốt lõi
Xét tam giác $ABC$ vuông tại $A$, cạnh góc vuông $b = AC$, $c = AB$, cạnh huyền $a = BC$, góc nhọn $B = \alpha$.

*   **Tỉ số lượng giác của góc nhọn $\alpha$**:
    $$\sin \alpha = \frac{\text{đối}}{\text{huyền}} = \frac{b}{a}; \quad \cos \alpha = \frac{\text{kề}}{\text{huyền}} = \frac{c}{a}; \quad \tan \alpha = \frac{\text{đối}}{\text{kề}} = \frac{b}{c}; \quad \cot \alpha = \frac{\text{kề}}{\text{đối}} = \frac{c}{b}$$
*   **Tính chất lượng giác quan trọng**:
    *   Nếu $\alpha + \beta = 90^\circ$ (hai góc phụ nhau) thì:
        $$\sin \alpha = \cos \beta; \quad \cos \alpha = \sin \beta; \quad \tan \alpha = \cot \beta; \quad \cot \alpha = \tan \beta$$
    *   Các hệ thức lượng trong tam giác vuông:
        $$\sin^2 \alpha + \cos^2 \alpha = 1; \quad \tan \alpha \cdot \cot \alpha = 1; \quad \tan \alpha = \frac{\sin \alpha}{\cos \alpha}$$
*   **Hệ thức giữa cạnh và góc trong tam giác vuông**:
    *   *Tính cạnh góc vuông qua cạnh huyền*:
        $$b = a \cdot \sin B = a \cdot \cos C; \quad c = a \cdot \sin C = a \cdot \cos B$$
    *   *Tính cạnh góc vuông qua cạnh góc vuông kia*:
        $$b = c \cdot \tan B = c \cdot \cot C; \quad c = b \cdot \tan C = b \cdot \cot B$$

### 2. Phương pháp giải các dạng toán điển hình
*   **Dạng 1: Tính tỉ số lượng giác và độ dài cạnh**
    *   Sử dụng định lý Pythagore để tìm độ dài cạnh còn thiếu của tam giác vuông.
    *   Áp dụng trực tiếp công thức định nghĩa tỉ số lượng giác.
*   **Dạng 2: Giải tam giác vuông**
    *   Tìm tất cả các cạnh và các góc chưa biết của tam giác vuông khi biết trước 2 yếu tố (trong đó có ít nhất một yếu tố cạnh).
*   **Dạng 3: Ứng dụng thực tế đo đạc**
    *   Dựng mô hình tam giác vuông từ bài toán thực tế (đo chiều cao cây, khoảng cách giữa hai bờ sông, độ dốc của mái nhà, v.v.). Sử dụng các tỉ số lượng giác phù hợp để tính toán.

### 3. Bài tập minh họa tiêu biểu
*   **Bài toán (Tính chiều cao cây)**: Một người đứng cách gốc cây một khoảng $15\text{ m}$ nhìn lên đỉnh cây dưới một góc $35^\circ$ so với phương nằm ngang. Biết khoảng cách từ mắt người đó đến mặt đất là $1,6\text{ m}$. Tính chiều cao của cây (làm tròn đến hàng phần mười mét).
    *   *Lời giải*:
        Gọi $A$ là vị trí mắt của người quan sát, $B$ là đỉnh cây, $C$ là điểm trên thân cây có cùng độ cao với mắt người quan sát, $D$ là gốc cây và $H$ là đỉnh cây chiếu thẳng xuống gốc cây (thân cây thẳng đứng).
        Ta có tam giác $ABC$ vuông tại $C$ có:
        *   Cạnh kề $AC = 15\text{ m}$.
        *   Góc nhọn $\widehat{BAC} = 35^\circ$.
        Chiều cao từ điểm $C$ đến đỉnh cây $B$ (cạnh đối $BC$) là:
        $$BC = AC \cdot \tan \widehat{BAC} = 15 \cdot \tan 35^\circ \approx 15 \cdot 0,7002 \approx 10,5\text{ (m)}$$
        Chiều cao tổng cộng của cây là:
        $$h = BC + CD = BC + 1,6 \approx 10,5 + 1,6 = 12,1\text{ (m)}$$
        Vậy chiều cao của cây xấp xỉ **12,1 mét**.

---

## CHƯƠNG V: ĐƯỜNG TRÒN

### 1. Kiến thức & Công thức cốt lõi
*   **Đường tròn**: Đường tròn tâm $O$ bán kính $R$ ký hiệu là $(O; R)$, là tập hợp các điểm cách $O$ một khoảng bằng $R$.
*   **Đường kính và dây cung**:
    *   Đường kính là dây cung lớn nhất của đường tròn.
    *   Đường kính vuông góc với một dây cung thì đi qua trung điểm của dây cung đó.
    *   Đường kính đi qua trung điểm của một dây cung không đi qua tâm thì vuông góc với dây cung đó.
*   **Tính chất tiếp tuyến**:
    *   Nếu một đường thẳng là tiếp tuyến của đường tròn thì nó vuông góc với bán kính tại tiếp điểm.
    *   *Tính chất hai tiếp tuyến cắt nhau*: Nếu $AB, AC$ là hai tiếp tuyến cắt nhau của đường tròn $(O)$ tại $B$ và $C$ thì:
        *   $AB = AC$.
        *   $AO$ là tia phân giác của góc $\widehat{BAC}$.
        *   $OA$ là tia phân giác của góc $\widehat{BOC}$.
        *   $AO$ là đường trung trực của đoạn thẳng $BC$.
*   **Công thức tính độ dài và diện tích**:
    *   Chu vi đường tròn: $C = 2\pi R$.
    *   Độ dài cung tròn $n^\circ$: $l = \frac{\pi R n}{180}$.
    *   Diện tích hình tròn: $S = \pi R^2$.
    *   Diện tích hình quạt tròn bán kính $R$, cung $n^\circ$: $S_q = \frac{\pi R^2 n}{360} = \frac{l \cdot R}{2}$.

### 2. Phương pháp giải các dạng toán điển hình
*   **Dạng 1: Chứng minh đường thẳng là tiếp tuyến của đường tròn**
    *   Chứng minh đường thẳng đó đi qua một điểm của đường tròn và vuông góc với bán kính đi qua điểm đó.
*   **Dạng 2: Tính toán độ dài, góc, diện tích liên quan đến đường tròn**
    *   Sử dụng các tính chất dây cung, tính chất tiếp tuyến kết hợp hệ thức lượng trong tam giác vuông để tính toán độ dài đoạn thẳng, số đo góc, độ dài cung hoặc diện tích hình quạt.

### 3. Bài tập minh họa tiêu biểu
*   **Bài toán**: Cho đường tròn $(O; 5\text{ cm})$ và điểm $A$ nằm ngoài đường tròn sao cho $OA = 13\text{ cm}$. Kẻ tiếp tuyến $AB$ với đường tròn ($B$ là tiếp điểm). Tính độ dài tiếp tuyến $AB$ và diện tích tam giác $OAB$.
    *   *Lời giải*:
        Vì $AB$ là tiếp tuyến của đường tròn $(O)$ tại tiếp điểm $B$ nên bán kính $OB \perp AB$ tại $B$.
        Do đó, tam giác $OAB$ vuông tại $B$.
        Áp dụng định lý Pythagore cho tam giác vuông $OAB$, ta có:
        $$OA^2 = OB^2 + AB^2 \Rightarrow 13^2 = 5^2 + AB^2 \Rightarrow AB^2 = 169 - 25 = 144 \Rightarrow AB = 12\text{ (cm)}$$
        Diện tích tam giác vuông $OAB$ là:
        $$S_{\triangle OAB} = \frac{1}{2} OB \cdot AB = \frac{1}{2} \cdot 5 \cdot 12 = 30\text{ (cm}^2)$$
        Vậy độ dài tiếp tuyến $AB = 12\text{ cm}$ và diện tích tam giác $OAB = 30\text{ cm}^2$.

---
*Chúc các em học sinh học tập tốt và đạt kết quả cao trong kỳ thi!*
