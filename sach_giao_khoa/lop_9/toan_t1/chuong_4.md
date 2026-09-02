# CHƯƠNG IV: HỆ THỨC LƯỢNG TRONG TAM GIÁC VUÔNG

Chương IV thiết lập mối liên hệ định lượng giữa cạnh và góc trong tam giác vuông thông qua các tỉ số lượng giác, đồng thời giới thiệu các hệ thức toán học kinh điển cùng các ứng dụng đo đạc thực tế vô cùng phong phú (đo chiều cao, khoảng cách, dốc nghiêng).

---

## BÀI 11: TỈ SỐ LƯỢNG GIÁC CỦA GÓC NHỌN

### 1. Khái niệm Tỉ số lượng giác của Góc nhọn

Xét tam giác $ABC$ vuông tại $A$. Đối với góc nhọn $B = \alpha$, ta định nghĩa:
*   **Cạnh đối** là cạnh đối diện với góc $\alpha$ (cạnh $AC$).
*   **Cạnh kề** là cạnh tạo nên góc $\alpha$ cùng với cạnh huyền (cạnh $AB$).
*   **Cạnh huyền** là cạnh đối diện góc vuông $A$ (cạnh $BC$).

#### Định nghĩa bốn tỉ số lượng giác:
1.  **Sin** của góc $\alpha$ (ký hiệu là $\sin \alpha$):
    $$\sin \alpha = \frac{\text{Cạnh đối}}{\text{Cạnh huyền}} = \frac{AC}{BC}$$
2.  **Côn-sin** (Co-sin) của góc $\alpha$ (ký hiệu là $\cos \alpha$):
    $$\cos \alpha = \frac{\text{Cạnh kề}}{\text{Cạnh huyền}} = \frac{AB}{BC}$$
3.  **Tang** của góc $\alpha$ (ký hiệu là $\tan \alpha$):
    $$\tan \alpha = \frac{\text{Cạnh đối}}{\text{Cạnh kề}} = \frac{AC}{AB}$$
4.  **Cô-tang** của góc $\alpha$ (ký hiệu là $\cot \alpha$):
    $$\cot \alpha = \frac{\text{Cạnh kề}}{\text{Cạnh đối}} = \frac{AB}{AC}$$

#### Nhận xét quan trọng:
*   Vì độ dài các cạnh trong tam giác luôn dương và cạnh huyền luôn lớn hơn cạnh góc vuông nên ta luôn có:
    $$0 < \sin \alpha < 1 \quad \text{và} \quad 0 < \cos \alpha < 1$$
*   Các mối liên hệ lượng giác cơ bản:
    $$\tan \alpha = \frac{\sin \alpha}{\cos \alpha}; \quad \cot \alpha = \frac{\cos \alpha}{\sin \alpha}; \quad \tan \alpha \cdot \cot \alpha = 1; \quad \sin^2 \alpha + \cos^2 \alpha = 1$$

*   **Ví dụ mẫu (Ví dụ 1)**: Cho tam giác $ABC$ vuông tại $A$ có $AB = 3\text{ cm}$ và $AC = 4\text{ cm}$. Tính các tỉ số lượng giác của góc $B = \alpha$.
    *   **Lời giải**: 
        Áp dụng định lý Pythagore cho tam giác vuông $ABC$, ta tìm độ dài cạnh huyền $BC$:
        $$BC^2 = AB^2 + AC^2 = 3^2 + 4^2 = 25 \Rightarrow BC = 5\text{ (cm)}$$
        Theo định nghĩa các tỉ số lượng giác, ta có:
        *   $\sin \alpha = \frac{AC}{BC} = \frac{4}{5} = 0,8$
        *   $\cos \alpha = \frac{AB}{BC} = \frac{3}{5} = 0,6$
        *   $\tan \alpha = \frac{AC}{AB} = \frac{4}{3} \approx 1,33$
        *   $\cot \alpha = \frac{AB}{AC} = \frac{3}{4} = 0,75$

---

### 2. Tỉ số lượng giác của Hai góc phụ nhau

#### Định lý:
> Nếu hai góc phụ nhau (tổng số đo bằng $90^\circ$) thì **sin góc này bằng côsin góc kia, tang góc này bằng côtang góc kia**.

Cụ thể, nếu $\alpha + \beta = 90^\circ$, ta có:
$$\sin \alpha = \cos \beta; \quad \cos \alpha = \sin \beta; \quad \tan \alpha = \cot \beta; \quad \cot \alpha = \tan \beta$$

#### Bảng giá trị lượng giác của các góc đặc biệt ($30^\circ, 45^\circ, 60^\circ$):

| Tỉ số lượng giác | $\alpha = 30^\circ$ | $\alpha = 45^\circ$ | $\alpha = 60^\circ$ |
| :--- | :---: | :---: | :---: |
| **$\sin \alpha$** | $\frac{1}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{\sqrt{3}}{2}$ |
| **$\cos \alpha$** | $\frac{\sqrt{3}}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{1}{2}$ |
| **$\tan \alpha$** | $\frac{\sqrt{3}}{3}$ | $1$ | $\sqrt{3}$ |
| **$\cot \alpha$** | $\sqrt{3}$ | $1$ | $\frac{\sqrt{3}}{3}$ |

*   **Ví dụ mẫu (Ví dụ 3)**: Viết các tỉ số lượng giác sau thành tỉ số lượng giác của các góc nhỏ hơn $45^\circ$: $\sin 60^\circ$, $\cos 75^\circ$, $\tan 80^\circ$, $\cot 82^\circ$.
    *   **Lời giải**: Áp dụng định lý về hai góc phụ nhau:
        *   $\sin 60^\circ = \cos (90^\circ - 60^\circ) = \cos 30^\circ$
        *   $\cos 75^\circ = \sin (90^\circ - 75^\circ) = \sin 15^\circ$
        *   $\tan 80^\circ = \cot (90^\circ - 80^\circ) = \cot 10^\circ$
        *   $\cot 82^\circ = \tan (90^\circ - 82^\circ) = \tan 8^\circ$

---

### 3. Sử dụng Máy tính cầm tay (MTCT) tính Tỉ số lượng giác

#### a) Tìm tỉ số lượng giác khi biết góc nhọn $\alpha$:
*   **Đơn vị đo**: Phải chuyển máy tính sang chế độ đo góc là "Độ" (thường xuất hiện chữ **D** trên màn hình).
*   **Cách bấm**:
    *   *Tính $\sin \alpha, \cos \alpha, \tan \alpha$*: Bấm trực tiếp các phím `sin`, `cos`, `tan` kèm số đo góc rồi ấn phím `=`.
    *   *Tính $\cot \alpha$*: Sử dụng công thức $\cot \alpha = \frac{1}{\tan \alpha}$, bấm `1` `÷` `tan` (góc) rồi ấn phím `=`.
*   *Ví dụ*: Để tính $\sin 27^\circ$, bấm `sin` `27` `=` màn hình hiển thị xấp xỉ $0,4539$.

#### b) Tìm số đo góc nhọn $\alpha$ khi biết trước tỉ số lượng giác:
*   Bấm tổ hợp phím `SHIFT` tương ứng với tỉ số đó: `SHIFT` `sin` (hoặc `SHIFT` `cos`, `SHIFT` `tan`), nhập giá trị tỉ số lượng giác rồi bấm `=`. Sau đó bấm phím độ-phút-giây `° ' "` để đổi kết quả sang dạng độ và phút.
*   *Ví dụ*: Tìm góc nhọn $\alpha$ khi biết $\sin \alpha = 0,3214$. Bấm `SHIFT` `sin` `0.3214` `=` được $18,7476$. Bấm phím `° ' "` được kết quả $\alpha \approx 18^\circ 45'$.

---

## BÀI 12: MỘT SỐ HỆ THỨC GIỮA CẠNH VÀ GÓC TRONG TAM GIÁC VUÔNG VÀ ỨNG DỤNG

Xét tam giác $ABC$ vuông tại $A$ có các cạnh góc vuông $AC = b, AB = c$, cạnh huyền $BC = a$ và các góc nhọn tương ứng là $\widehat{B}, \widehat{C}$.

### 1. Hệ thức giữa Cạnh huyền và Cạnh góc vuông

#### Định lý 1:
> Trong tam giác vuông, mỗi cạnh góc vuông bằng **cạnh huyền nhân với sin góc đối hoặc nhân với côsin góc kề**.

#### Công thức toán học:
$$\begin{cases} b = a \cdot \sin B = a \cdot \cos C \\ c = a \cdot \sin C = a \cdot \cos B \end{cases}$$

*   **Ví dụ mẫu (Ví dụ 1)**: Một chiếc máy bay bay lên với vận tốc $500\text{ km/h}$. Đường bay lên tạo với phương nằm ngang một góc $30^\circ$. Hỏi sau $1,2$ phút, máy bay lên cao được bao nhiêu kilômét theo phương thẳng đứng?
    *   **Lời giải**:
        *   Đổi thời gian: $1,2\text{ phút} = \frac{1,2}{60} = \frac{1}{50}\text{ giờ}$.
        *   Quãng đường máy bay di chuyển dọc theo đường bay (cạnh huyền $BC$) là:
            $$a = 500 \cdot \frac{1}{50} = 10\text{ (km)}$$
        *   Độ cao theo phương thẳng đứng chính là độ dài cạnh góc vuông đối diện góc $30^\circ$ (cạnh $BH$):
            $$BH = BC \cdot \sin 30^\circ = 10 \cdot \frac{1}{2} = 5\text{ (km)}$$
        *   *Kết luận*: Sau $1,2$ phút, máy bay lên cao được $5\text{ km}$.

---

### 2. Hệ thức giữa Hai cạnh góc vuông

#### Định lý 2:
> Trong tam giác vuông, mỗi cạnh góc vuông bằng **cạnh góc vuông kia nhân với tang góc đối hoặc nhân với côtang góc kề**.

#### Công thức toán học:
$$\begin{cases} b = c \cdot \tan B = c \cdot \cot C \\ c = b \cdot \tan C = b \cdot \cot B \end{cases}$$

*   **Ví dụ mẫu (Ví dụ 2)**: Các tia nắng mặt trời tạo với mặt đất một góc xấp xỉ $34^\circ$ và bóng của một tòa tháp trên mặt đất dài $8,6\text{ m}$. Tính chiều cao của tòa tháp (làm tròn đến mét).
    *   **Lời giải**:
        Chiều cao tháp $h$ đóng vai trò là cạnh góc vuông đối diện góc nhọn $34^\circ$, bóng tháp dài $8,6\text{ m}$ là cạnh góc vuông kề. Áp dụng hệ thức:
        $$h = 8,6 \cdot \tan 34^\circ \approx 8,6 \cdot 0,6745 \approx 5,8\text{ (m)}$$
        Làm tròn đến hàng đơn vị, chiều cao tháp khoảng **$6\text{ mét}$**.

---

### 3. Giải Tam giác vuông

**Giải tam giác vuông** là tìm tất cả các cạnh và góc chưa biết của một tam giác vuông khi đã biết trước ít nhất hai yếu tố của nó (trong đó có ít nhất một yếu tố về cạnh và không kể góc vuông).

*   **Ví dụ mẫu (Ví dụ 3 - Biết hai cạnh góc vuông)**: Giải tam giác vuông $ABC$ vuông tại $A$ có $AB = 5\text{ cm}, AC = 8\text{ cm}$ (làm tròn độ dài đến hàng phần mười, số đo góc đến độ).
    *   **Lời giải**:
        1.  *Tìm cạnh huyền $BC$*: Áp dụng định lý Pythagore:
            $$BC = \sqrt{AB^2 + AC^2} = \sqrt{5^2 + 8^2} = \sqrt{89} \approx 9,4\text{ (cm)}$$
        2.  *Tìm số đo góc nhọn $B$*: Ta có:
            $$\tan B = \frac{AC}{AB} = \frac{8}{5} = 1,6$$
            Sử dụng máy tính bấm `SHIFT` `tan` `1.6` được $\widehat{B} \approx 58^\circ$.
        3.  *Tìm số đo góc nhọn $C$*: Hai góc nhọn phụ nhau nên:
            $$\widehat{C} = 90^\circ - \widehat{B} \approx 90^\circ - 58^\circ = 32^\circ$$
        *   *Kết luận*: Tam giác $ABC$ có $BC \approx 9,4\text{ cm}$, $\widehat{B} \approx 58^\circ$, $\widehat{C} \approx 32^\circ$.

---

## BÀI TẬP CUỐI CHƯƠNG IV (ĐỀ BÀI & LỜI GIẢI CHI TIẾT)

### PHẦN A: TRẮC NGHIỆM KHÁCH QUAN

**Bài 4.21**: Cho tam giác vuông có một góc nhọn là $\alpha$, biết cạnh đối là $3$, cạnh kề là $4$, cạnh huyền là $5$. Khi đó $\cos \alpha$ bằng:
*   A. $\frac{5}{3}$
*   B. $\frac{3}{4}$
*   C. $\frac{3}{5}$
*   D. $\frac{4}{5}$
*   **Đáp án chọn**: **D**
*   *Giải thích chi tiết*: Theo định nghĩa, $\cos \alpha = \frac{\text{Cạnh kề}}{\text{Cạnh huyền}} = \frac{4}{5}$.

**Bài 4.22**: Trong tam giác $MNP$ vuông tại $M$ (Hình 4.33), $\sin \widehat{MNP}$ bằng:
*   A. $\frac{PN}{NM}$
*   B. $\frac{MP}{PN}$
*   C. $\frac{MN}{PN}$
*   D. $\frac{MN}{MP}$
*   **Đáp án chọn**: **B**
*   *Giải thích chi tiết*: Góc cần tính sin là góc $N$. Đối diện góc $N$ là cạnh $MP$, cạnh huyền là $PN$. Vậy $\sin N = \frac{MP}{PN}$.

**Bài 4.23**: Trong tam giác $ABC$ vuông tại $A$ (Hình 4.34), $\tan B$ bằng:
*   A. $\frac{AB}{AC}$
*   B. $\frac{AC}{AB}$
*   C. $\frac{AB}{BC}$
*   D. $\frac{BC}{AC}$
*   **Đáp án chọn**: **B**
*   *Giải thích chi tiết*: $\tan B = \frac{\text{Cạnh đối}}{\text{Cạnh kề}} = \frac{AC}{AB}$.

**Bài 4.24**: Với mọi góc nhọn $\alpha$, ta có:
*   A. $\sin (90^\circ - \alpha) = \cos \alpha$
*   B. $\tan (90^\circ - \alpha) = \cos \alpha$
*   C. $\cot (90^\circ - \alpha) = 1 - \tan \alpha$
*   D. $\cot (90^\circ - \alpha) = \sin \alpha$
*   **Đáp án chọn**: **A**
*   *Giải thích chi tiết*: Theo tính chất lượng giác của hai góc phụ nhau, $\sin (90^\circ - \alpha) = \cos \alpha$.

**Bài 4.25**: Giá trị $\tan 30^\circ$ bằng:
*   A. $\sqrt{3}$
*   B. $\frac{\sqrt{3}}{2}$
*   C. $\frac{1}{\sqrt{3}}$
*   D. $1$
*   **Đáp án chọn**: **C** (hoặc $\frac{\sqrt{3}}{3}$ là giá trị đã trục căn thức ở mẫu)
*   *Giải thích chi tiết*: Theo bảng lượng giác góc đặc biệt, $\tan 30^\circ = \frac{\sqrt{3}}{3} = \frac{1}{\sqrt{3}}$.

---

### PHẦN B: TỰ LUẬN RÈN LUYỆN

**Bài 4.26**: Xét các tam giác vuông có một góc nhọn bằng hai lần góc nhọn còn lại. Hỏi các tam giác đó có đồng dạng với nhau không? Tính sin và côsin của góc nhọn lớn hơn trong hai góc nhọn của tam giác đó.
*   **Lời giải chi tiết**:
    *   Gồm hai góc nhọn của tam giác vuông là $\alpha$ và $\beta$ (điều kiện $0^\circ < \alpha, \beta < 90^\circ$).
    *   Giả sử góc lớn bằng hai lần góc bé: $\alpha = 2\beta$.
    *   Vì tổng hai góc nhọn trong một tam giác vuông luôn bằng $90^\circ$, ta có hệ thức:
        $$\alpha + \beta = 90^\circ \Leftrightarrow 2\beta + \beta = 90^\circ \Leftrightarrow 3\beta = 90^\circ \Leftrightarrow \beta = 30^\circ$$
        Từ đó suy ra góc nhọn lớn hơn là: $\alpha = 2 \cdot 30^\circ = 60^\circ$.
    *   Tất cả các tam giác vuông thỏa mãn điều kiện đều có chung bộ ba góc là $(90^\circ, 60^\circ, 30^\circ)$. Do có các góc tương ứng bằng nhau, **tất cả các tam giác vuông này đều đồng dạng với nhau** (theo trường hợp góc-góc).
    *   Tính tỉ số lượng giác của góc nhọn lớn hơn (góc $60^\circ$):
        *   $\sin 60^\circ = \frac{\sqrt{3}}{2}$
        *   $\cos 60^\circ = \frac{1}{2}$

**Bài 4.27 (Bài toán mái lều chữ A)**: Hình 4.35 là mô hình của một túp lều hình chữ A. Biết chiều cao lều là $1,8\text{ m}$, chiều rộng đáy lều là $4,4\text{ m}$. Hãy tìm góc $\alpha$ tạo bởi mái lều và mặt đất (làm tròn kết quả đến độ).
*   **Lời giải chi tiết**:
    *   Mô hình mái lều chữ A cân đối. Đường cao từ đỉnh lều xuống mặt đất có độ dài $h = 1,8\text{ m}$.
    *   Đường cao này chia đáy lều thành hai phần bằng nhau. Độ dài đoạn từ chân đường cao đến góc mái lều trên mặt đất là:
        $$d = \frac{4,4}{2} = 2,2\text{ (m)}$$
    *   Xét tam giác vuông tạo bởi đường cao lều, nửa đáy lều và mái lều. Góc nhọn $\alpha$ kề với cạnh nửa đáy lều ($2,2\text{ m}$) và đối diện với đường cao ($1,8\text{ m}$). Ta có hệ thức:
        $$\tan \alpha = \frac{\text{Cạnh đối}}{\text{Cạnh kề}} = \frac{1,8}{2,2} = \frac{9}{11} \approx 0,8182$$
    *   Sử dụng máy tính bấm `SHIFT` `tan` `(9/11)` rồi bấm phím chuyển độ ta được kết quả:
        $$\alpha \approx 39^\circ 17'$$
    *   Làm tròn kết quả đến độ, ta được **$\alpha \approx 39^\circ$**.

**Bài 4.28 (Bài toán cây bị gãy đổ)**: Một cây cao bị gãy, ngọn cây đổ xuống mặt đất tạo thành một tam giác vuông. Đoạn cây gãy tạo với mặt đất một góc nhọn $20^\circ$ và phần ngọn cây chạm đất cách gốc cây một khoảng $5\text{ m}$. Hỏi trước khi bị gãy, cây cao khoảng bao nhiêu mét (làm tròn đến hàng phần mười)?
*   **Lời giải chi tiết**:
    *   Ký hiệu phần cây còn đứng (vuông góc với mặt đất) là $h_1$ (cạnh góc vuông đối diện góc $20^\circ$).
    *   Ký hiệu phần cây bị đổ chạm xuống đất (cạnh huyền của tam giác vuông) là $h_2$.
    *   Theo hệ thức giữa cạnh và góc trong tam giác vuông:
        *   Tính phần cây đứng $h_1$:
            $$h_1 = 5 \cdot \tan 20^\circ \approx 5 \cdot 0,3640 \approx 1,82\text{ (m)}$$
        *   Tính phần cây gãy $h_2$:
            $$h_2 = \frac{5}{\cos 20^\circ} \approx \frac{5}{0,9397} \approx 5,32\text{ (m)}$$
    *   Tổng chiều cao ban đầu của cây trước khi bị gãy là:
        $$h = h_1 + h_2 \approx 1,82 + 5,32 = 7,14\text{ (m)}$$
    *   Làm tròn đến hàng phần mười, ta được chiều cao ban đầu của cây là khoảng **$7,1\text{ mét}$**.

**Bài 4.30 (Đố vui lịch sử toán học - Chu vi Trái Đất của Eratosthenes)**:
Vào khoảng năm 200 trước Công nguyên, Eratosthenes (một nhà toán học người Hy Lạp) đã ước lượng được chu vi của Trái Đất nhờ hai quan sát sau:
1.  Vào buổi trưa ngày Hạ chí (21/6), ở thành phố Syene (nay là Aswan), các tia sáng mặt trời chiếu thẳng đứng xuống đáy một cái giếng sâu (không tạo bóng, tức góc chiếu bằng $0^\circ$).
2.  Cũng vào trưa ngày hôm đó ở thành phố Alexandria (cách Syene khoảng $800\text{ km}$ về phía Bắc), ông đo được bóng của một tòa tháp cao trên mặt đất dài bằng $3,1\text{ m}$, biết chiều cao của tháp là $25\text{ m}$.
Từ hai quan sát trên, hãy tính xấp xỉ chu vi Trái Đất.
*   **Lời giải chi tiết**:
    *   *Bước 1: Tính góc nghiêng $\alpha$ của tia nắng mặt trời tại Alexandria*:
        Xét tam giác vuông tạo bởi chiều cao tháp ($25\text{ m}$), bóng tháp ($3,1\text{ m}$) và tia sáng mặt trời. Góc nhọn $\alpha$ là góc tạo bởi tia sáng mặt trời và phương thẳng đứng của tòa tháp. Ta có:
        $$\tan \alpha = \frac{\text{Bóng tháp}}{\text{Chiều cao tháp}} = \frac{3,1}{25} = 0,124$$
        Sử dụng máy tính bấm `SHIFT` `tan` `0.124` ta được góc $\alpha$:
        $$\alpha \approx 7,07^\circ \approx 7,2^\circ$$
        (Theo lịch sử ghi lại, phép đo của Eratosthenes tương đương góc $\alpha \approx 7,2^\circ$, bằng $\frac{1}{50}$ của một vòng tròn $360^\circ$).
    *   *Bước 2: Sử dụng hình học vòng tròn tính chu vi Trái Đất*:
        Vì Mặt Trời ở rất xa Trái Đất nên các tia sáng song song nhau. Do đó, góc ở tâm Trái Đất chắn cung giữa hai thành phố Alexandria và Syene chính bằng góc nghiêng của tia nắng $\alpha \approx 7,2^\circ$.
        Khoảng cách giữa hai thành phố là $s = 800\text{ km}$ ứng với cung tròn có góc ở tâm là $7,2^\circ$.
        Tỉ lệ giữa góc ở tâm và vòng tròn hoàn chỉnh ($360^\circ$) là:
        $$\frac{7,2^\circ}{360^\circ} = \frac{1}{50}$$
        Chu vi Trái Đất $C$ xấp xỉ bằng:
        $$C = 50 \cdot s = 50 \cdot 800 = 40\,000\text{ (km)}$$
    *   *Kết luận*: Phép đo toán học kết hợp thiên văn đơn giản của Eratosthenes cho ra chu vi Trái Đất xấp xỉ **$40\,000\text{ km}$**, một kết quả chính xác đến kinh ngạc so với khoa học hiện đại (chu vi thực tế ở xích đạo khoảng $40\,075\text{ km}$).
