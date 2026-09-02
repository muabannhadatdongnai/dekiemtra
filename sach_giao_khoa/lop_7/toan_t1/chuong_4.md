# CHƯƠNG IV: TAM GIÁC BẰNG NHAU

Chương này giới thiệu các kiến thức cơ bản về hình học phẳng của tam giác, bao gồm định lí tổng các góc trong một tam giác, khái niệm hai tam giác bằng nhau, ba trường hợp bằng nhau cơ bản của tam giác (c.c.c, c.g.c, g.c.g), các trường hợp bằng nhau đặc biệt của tam giác vuông, khái niệm tam giác cân, tam giác đều và định nghĩa, tính chất của đường trung trực của một đoạn thẳng.

---

## BÀI 12: TỔNG CÁC GÓC TRONG MỘT TAM GIÁC

### 1. Định lí tổng ba góc trong một tam giác
* **Phát biểu:** Tổng số đo ba góc trong một tam giác bằng $180^\circ$.
* **Chứng minh định lí:**
  * **Giả thiết (GT):** $\Delta ABC$.
  * **Kết luận (KL):** $\widehat{A} + \widehat{B} + \widehat{C} = 180^\circ$.
  * **Chứng minh:**
    1. Qua đỉnh $A$, kẻ đường thẳng $xy$ song song với cạnh $BC$ ($xy // BC$).
    2. Vì $xy // BC$, ta có các cặp góc so le trong bằng nhau:
       $$\widehat{BAx} = \widehat{B} \quad (1)$$
       $$\widehat{CAy} = \widehat{C} \quad (2)$$
    3. Ta thấy góc $\widehat{xAy}$ là góc bẹt nên:
       $$\widehat{BAx} + \widehat{BAC} + \widehat{CAy} = \widehat{xAy} = 180^\circ \quad (3)$$
    4. Thay (1) và (2) vào (3) ta được:
       $$\widehat{B} + \widehat{BAC} + \widehat{C} = 180^\circ \quad \text{hay} \quad \widehat{A} + \widehat{B} + \widehat{C} = 180^\circ \quad \text{(ĐPCM)}$$

### 2. Tam giác nhọn, tam giác vuông, tam giác tù
* **Tam giác nhọn:** Là tam giác có cả ba góc đều là góc nhọn (số đo nhỏ hơn $90^\circ$).
* **Tam giác vuông:** Là tam giác có một góc vuông (số đo bằng $90^\circ$).
  * Cạnh đối diện với góc vuông gọi là **cạnh huyền**.
  * Hai cạnh kề với góc vuông gọi là **hai cạnh góc vuông**.
  * **Tính chất:** Trong một tam giác vuông, hai góc nhọn phụ nhau (tổng số đo của chúng bằng $90^\circ$).
    $$\Delta ABC \text{ vuông tại } A \implies \widehat{B} + \widehat{C} = 90^\circ$$
* **Tam giác tù:** Là tam giác có một góc tù (số đo lớn hơn $90^\circ$).

### 3. Góc ngoài của một tam giác
* **Định nghĩa:** Góc ngoài của một tam giác là góc kề bù với một góc trong của tam giác đó.
* **Tính chất:**
  * Mỗi góc ngoài của một tam giác có số đo bằng tổng số đo hai góc trong không kề với nó.
  * Góc ngoài tại đỉnh $C$ của $\Delta ABC$ (kí hiệu là $\widehat{ACx}$, với $Cx$ là tia đối của $CB$) được tính theo công thức:
    $$\widehat{ACx} = \widehat{A} + \widehat{B}$$
  * **Nhận xét:** Góc ngoài của một tam giác luôn lớn hơn mỗi góc trong không kề với nó:
    $$\widehat{ACx} > \widehat{A} \quad \text{và} \quad \widehat{ACx} > \widehat{B}$$

---

## BÀI 13: HAI TAM GIÁC BẰNG NHAU. TRƯỜNG HỢP BẰNG NHAU THỨ NHẤT CỦA TAM GIÁC: CẠNH - CẠNH - CẠNH (C.C.C)

### 1. Khái niệm hai tam giác bằng nhau
* **Định nghĩa:** Hai tam giác bằng nhau là hai tam giác có các cạnh tương ứng bằng nhau và các góc tương ứng bằng nhau.
* **Kí hiệu:** Để kí hiệu hai tam giác $ABC$ và $A'B'C'$ bằng nhau, ta viết:
  $$\Delta ABC = \Delta A'B'C'$$
* **Định nghĩa bằng kí hiệu toán học:**
  $$\Delta ABC = \Delta A'B'C' \iff \begin{cases} AB = A'B', \, AC = A'C', \, BC = B'C' \\ \widehat{A} = \widehat{A'}, \, \widehat{B} = \widehat{B'}, \, \widehat{C} = \widehat{C'} \end{cases}$$
* **Quy ước:** Khi viết kí hiệu sự bằng nhau giữa hai tam giác, tên đỉnh của hai tam giác phải được sắp xếp theo đúng thứ tự các đỉnh tương ứng.

### 2. Trường hợp bằng nhau thứ nhất: Cạnh - Cạnh - Cạnh (c.c.c)
* **Định lí:** Nếu ba cạnh của tam giác này bằng ba cạnh của tam giác kia thì hai tam giác đó bằng nhau.
* **Ứng dụng:** Để chứng minh $\Delta ABC = \Delta A'B'C'$ theo trường hợp c.c.c, ta cần chỉ ra:
  $$\begin{cases} AB = A'B' \\ AC = A'C' \\ BC = B'C' \end{cases} \implies \Delta ABC = \Delta A'B'C' \quad \text{(c.c.c)}$$

---

## BÀI 14: TRƯỜNG HỢP BẰNG NHAU THỨ HAI VÀ THỨ BA CỦA TAM GIÁC

### 1. Trường hợp bằng nhau thứ hai: Cạnh - Góc - Cạnh (c.g.c)
* **Khái niệm góc xen giữa:** Góc xen giữa hai cạnh của một tam giác là góc tạo bởi hai cạnh đó. Ví dụ: Góc $\widehat{A}$ xen giữa hai cạnh $AB$ và $AC$.
* **Định lí:** Nếu hai cạnh và góc xen giữa của tam giác này bằng hai cạnh và góc xen giữa của tam giác kia thì hai tam giác đó bằng nhau.
* **Ứng dụng:** Để chứng minh $\Delta ABC = \Delta A'B'C'$ theo trường hợp c.g.c, ta cần chỉ ra:
  $$\begin{cases} AB = A'B' \\ \widehat{BAC} = \widehat{B'A'C'} \quad \text{(góc xen giữa)} \\ AC = A'C' \end{cases} \implies \Delta ABC = \Delta A'B'C' \quad \text{(c.g.c)}$$

### 2. Trường hợp bằng nhau thứ ba: Góc - Cạnh - Góc (g.c.g)
* **Khái niệm góc kề một cạnh:** Hai góc có đỉnh là hai đầu mút của một cạnh được gọi là hai góc kề cạnh đó. Ví dụ: Góc $\widehat{B}$ và góc $\widehat{C}$ là hai góc kề cạnh $BC$.
* **Định lí:** Nếu một cạnh và hai góc kề của tam giác này bằng một cạnh và hai góc kề của tam giác kia thì hai tam giác đó bằng nhau.
* **Ứng dụng:** Để chứng minh $\Delta ABC = \Delta A'B'C'$ theo trường hợp g.c.g, ta cần chỉ ra:
  $$\begin{cases} \widehat{B} = \widehat{B'} \\ BC = B'C' \quad \text{(cạnh kề)} \\ \widehat{C} = \widehat{C'} \end{cases} \implies \Delta ABC = \Delta A'B'C' \quad \text{(g.c.g)}$$

---

## BÀI 15: CÁC TRƯỜNG HỢP BẰNG NHAU CỦA TAM GIÁC VUÔNG

Dựa trên ba trường hợp bằng nhau cơ bản của tam giác, ta suy ra bốn trường hợp bằng nhau đặc biệt của tam giác vuông:

### 1. Trường hợp Hai cạnh góc vuông (c-g-c)
* Nếu hai cạnh góc vuông của tam giác vuông này lần lượt bằng hai cạnh góc vuông của tam giác vuông kia thì hai tam giác vuông đó bằng nhau.

### 2. Trường hợp Cạnh góc vuông - Góc nhọn kề (g-c-g)
* Nếu một cạnh góc vuông và một góc nhọn kề cạnh ấy của tam giác vuông này lần lượt bằng một cạnh góc vuông và một góc nhọn kề cạnh ấy của tam giác vuông kia thì hai tam giác vuông đó bằng nhau.

### 3. Trường hợp Cạnh huyền - Góc nhọn (g-c-g)
* **Phát biểu:** Nếu cạnh huyền và một góc nhọn của tam giác vuông này bằng cạnh huyền và một góc nhọn của tam giác vuông kia thì hai tam giác vuông đó bằng nhau.
* **Ý nghĩa:** Trường hợp này là hệ quả trực tiếp từ trường hợp g.c.g (do góc nhọn còn lại phụ với góc nhọn đã cho, từ đó chứng minh được góc kề cạnh huyền bằng nhau).

### 4. Trường hợp Cạnh huyền - Cạnh góc vuông
* **Phát biểu:** Nếu cạnh huyền và một cạnh góc vuông của tam giác vuông này bằng cạnh huyền và một cạnh góc vuông của tam giác vuông kia thì hai tam giác vuông đó bằng nhau.

---

## BÀI 16: TAM GIÁC CÂN. ĐƯỜNG TRUNG TRỰC CỦA ĐOẠN THẲNG

### 1. Tam giác cân và tính chất
* **Định nghĩa:** **Tam giác cân** là tam giác có hai cạnh bằng nhau.
  * Xét tam giác cân $ABC$ cân tại $A$ ($AB = AC$):
    * Hai cạnh $AB, AC$ gọi là **cạnh bên**.
    * Cạnh $BC$ gọi là **cạnh đáy**.
    * Hai góc $\widehat{B}, \widehat{C}$ ở đáy gọi là **góc ở đáy**.
    * Góc $\widehat{A}$ gọi là **góc ở đỉnh**.
* **Tính chất của tam giác cân:**
  * Trong một tam giác cân, hai góc ở đáy bằng nhau:
    $$\Delta ABC \text{ cân tại } A \iff AB = AC \implies \widehat{B} = \widehat{C}$$
  * Ngược lại, nếu một tam giác có hai góc bằng nhau thì tam giác đó là tam giác cân.
* **Tam giác đều:**
  * **Định nghĩa:** Tam giác đều là tam giác có ba cạnh bằng nhau.
  * **Tính chất:** Trong một tam giác đều, cả ba góc đều bằng nhau và mỗi góc có số đo bằng $60^\circ$.
    $$\Delta ABC \text{ đều} \implies \begin{cases} AB = BC = CA \\ \widehat{A} = \widehat{B} = \widehat{C} = 60^\circ \end{cases}$$

### 2. Đường trung trực của một đoạn thẳng
* **Định nghĩa:** Đường thẳng vuông góc với một đoạn thẳng tại trung điểm của nó được gọi là **đường trung trực** của đoạn thẳng đó.
* **Tính chất của đường trung trực:**
  * **Tính chất 1 (Điểm nằm trên trung trực):** Một điểm nằm trên đường trung trực của một đoạn thẳng thì cách đều hai đầu mút của đoạn thẳng đó.
    $$d \text{ là trung trực của } AB, \, M \in d \implies MA = MB$$
  * **Tính chất 2 (Điểm cách đều):** Ngược lại, một điểm cách đều hai đầu mút của một đoạn thẳng thì nằm trên đường trung trực của đoạn thẳng đó.
    $$NA = NB \implies N \text{ nằm trên đường trung trực của } AB$$
  * **Hệ quả:** Tập hợp tất cả các điểm cách đều hai đầu mút của một đoạn thẳng $AB$ chính là đường trung trực của đoạn thẳng $AB$.

---

## BÀI TẬP CUỐI CHƯƠNG IV (TRANG 87)

Dưới đây là lời giải chi tiết, chặt chẽ cho toàn bộ các bài tập cuối Chương IV nhằm củng cố vững chắc lý thuyết về tam giác và kỹ năng lập luận chứng minh hình học.

### Bài 4.33 (Trang 87)
**Đề bài:** Tính các số đo $x, y$ trong các tam giác dưới đây (Hình 4.75).
* **Hình bên trái:** Tam giác có ba góc với số đo lần lượt là $x$, $x+20^\circ$, $x+10^\circ$.
* **Hình bên phải:** Tam giác vuông có một góc nhọn bằng $60^\circ$, góc nhọn còn lại bằng $2y$.

**Lời giải:**
1. **Xét tam giác bên trái:**
   * Áp dụng định lí tổng ba góc trong một tam giác, ta có:
     $$x + (x + 20^\circ) + (x + 10^\circ) = 180^\circ$$
   * Thu gọn biểu thức vế trái:
     $$3x + 30^\circ = 180^\circ$$
     $$3x = 180^\circ - 30^\circ$$
     $$3x = 150^\circ \implies x = 50^\circ$$
   * Vậy $x = 50^\circ$ (các góc của tam giác này lần lượt là $50^\circ, 70^\circ, 60^\circ$).

2. **Xét tam giác vuông bên phải:**
   * Vì tam giác này là tam giác vuông (có ký hiệu góc vuông $90^\circ$), nên hai góc nhọn phụ nhau. Ta có:
     $$60^\circ + 2y = 90^\circ$$
   * Giải phương trình tìm $y$:
     $$2y = 90^\circ - 60^\circ$$
     $$2y = 30^\circ \implies y = 15^\circ$$
   * Vậy $y = 15^\circ$.

---

### Bài 4.34 (Trang 87)
**Đề bài:** Trong Hình 4.76, có $AM = BM$, $AN = BN$. Chứng minh rằng $\widehat{MAN} = \widehat{MBN}$.

**Lời giải:**
1. Xét hai tam giác $\Delta AMN$ và $\Delta BMN$. Ta có:
   * $AM = BM$ (theo giả thiết).
   * $AN = BN$ (theo giả thiết).
   * Cạnh $MN$ là cạnh chung của hai tam giác.
2. Từ ba điều kiện trên, suy ra hai tam giác bằng nhau theo trường hợp cạnh - cạnh - cạnh:
   $$\Delta AMN = \Delta BMN \quad \text{(c.c.c)}$$
3. Do hai tam giác bằng nhau, các góc tương ứng của chúng phải bằng nhau. Do đó:
   $$\widehat{MAN} = \widehat{MBN} \quad \text{(hai góc tương ứng)}$$
   *(Điều phải chứng minh).*

---

### Bài 4.35 (Trang 87)
**Đề bài:** Trong Hình 4.77, có $AO = BO$, $\widehat{OAM} = \widehat{OBN}$. Chứng minh rằng $AM = BN$.

**Lời giải:**
1. Xét hai tam giác $\Delta OAM$ và $\Delta OBN$. Ta có:
   * $\widehat{OAM} = \widehat{OBN}$ (theo giả thiết).
   * $AO = BO$ (theo giả thiết).
   * Góc $\widehat{O}$ (tức góc $\widehat{AOM}$ và $\widehat{BON}$) là góc chung của cả hai tam giác.
2. Từ các yếu tố trên, ta có một cạnh và hai góc kề bằng nhau. Suy ra hai tam giác bằng nhau theo trường hợp góc - cạnh - góc:
   $$\Delta OAM = \Delta OBN \quad \text{(g.c.g)}$$
3. Vì hai tam giác bằng nhau, các cạnh tương ứng của chúng bằng nhau. Do đó:
   $$AM = BN \quad \text{(hai cạnh tương ứng)}$$
   *(Điều phải chứng minh).*

---

### Bài 4.36 (Trang 87)
**Đề bài:** Trong Hình 4.78, có $AN = BM$, $\widehat{BAN} = \widehat{ABM}$. Chứng minh rằng $\widehat{BAM} = \widehat{ABN}$.

**Lời giải:**
1. Xét hai tam giác $\Delta ABN$ và $\Delta BAM$. Ta có:
   * $AN = BM$ (theo giả thiết).
   * $\widehat{BAN} = \widehat{ABM}$ (theo giả thiết).
   * Cạnh $AB$ là cạnh chung của hai tam giác.
2. Do đó, hai tam giác bằng nhau theo trường hợp cạnh - góc - cạnh:
   $$\Delta ABN = \Delta BAM \quad \text{(c.g.c)}$$
3. Vì hai tam giác bằng nhau, các góc tương ứng bằng nhau. Suy ra:
   $$\widehat{ABN} = \widehat{BAM} \quad \text{(hai góc tương ứng)}$$
   Hay ta viết ngược lại:
   $$\widehat{BAM} = \widehat{ABN} \quad \text{(ĐPCM)}$$

---

### Bài 4.37 (Trang 87)
**Đề bài:** Cho $M, N$ là hai điểm phân biệt nằm trên đường trung trực của đoạn thẳng $AB$ sao cho $AM = AN$. Chứng minh rằng $MB = NB$ và $\widehat{AMB} = \widehat{ANB}$.

**Lời giải:**
1. **Chứng minh $MB = NB$:**
   * Vì điểm $M$ nằm trên đường trung trực của đoạn thẳng $AB$, nên theo tính chất đường trung trực, $M$ cách đều hai đầu mút $A$ và $B$. Ta có:
     $$MA = MB \quad (1)$$
   * Tương tự, vì điểm $N$ nằm trên đường trung trực của đoạn thẳng $AB$, nên $N$ cách đều hai đầu mút $A$ và $B$. Ta có:
     $$NA = NB \quad (2)$$
   * Theo giả thiết, ta có $AM = AN$ hay $MA = NA$. Từ (1) và (2) suy ra:
     $$MB = NB \quad \text{(vì cùng bằng } MA = NA \text{)} \quad (3)$$

2. **Chứng minh $\widehat{AMB} = \widehat{ANB}$:**
   * Xét hai tam giác $\Delta AMB$ và $\Delta ANB$. Ta có:
     * $AM = AN$ (theo giả thiết).
     * $MB = NB$ (theo chứng minh ở trên).
     * Cạnh $AB$ là cạnh chung của hai tam giác.
   * Suy ra hai tam giác bằng nhau theo trường hợp cạnh - cạnh - cạnh:
     $$\Delta AMB = \Delta ANB \quad \text{(c.c.c)}$$
   * Do đó, các góc tương ứng bằng nhau:
     $$\widehat{AMB} = \widehat{ANB} \quad \text{(hai góc tương ứng)}$$
     *(Điều phải chứng minh).*

---

### Bài 4.38 (Trang 87)
**Đề bài:** Cho tam giác $ABC$ cân tại $A$ có $\widehat{A} = 120^\circ$. Trên cạnh $BC$ lấy hai điểm $M, N$ sao cho $MA, NA$ lần lượt vuông góc với $AB, AC$. Chứng minh rằng:
a) $\Delta BAM = \Delta CAN$;
b) Các tam giác $\Delta ANB$, $\Delta AMC$ lần lượt cân tại $N, M$.

**Lời giải:**
* **Phân tích ban đầu:**
  * Vì $\Delta ABC$ cân tại $A$ nên ta có $AB = AC$ và hai góc ở đáy bằng nhau: $\widehat{B} = \widehat{C}$.
  * Áp dụng định lí tổng ba góc trong $\Delta ABC$:
    $$\widehat{A} + \widehat{B} + \widehat{C} = 180^\circ \implies 120^\circ + 2\widehat{B} = 180^\circ$$
    $$2\widehat{B} = 60^\circ \implies \widehat{B} = \widehat{C} = 30^\circ$$

* **Câu a) Chứng minh $\Delta BAM = \Delta CAN$:**
  1. Theo đề bài, ta có $MA \perp AB \implies \widehat{BAM} = 90^\circ$ (tam giác $BAM$ vuông tại $A$).
  2. Tương tự, $NA \perp AC \implies \widehat{CAN} = 90^\circ$ (tam giác $CAN$ vuông tại $A$).
  3. Xét hai tam giác vuông $\Delta BAM$ (vuông tại $A$) và $\Delta CAN$ (vuông tại $A$):
     * Cạnh góc vuông $AB = AC$ (do $\Delta ABC$ cân tại $A$).
     * Góc nhọn kề cạnh góc vuông này: $\widehat{B} = \widehat{C} = 30^\circ$.
  4. Suy ra:
     $$\Delta BAM = \Delta CAN \quad \text{(cạnh góc vuông - góc nhọn kề)}$$

* **Câu b) Chứng minh $\Delta ANB$ cân tại $N$ và $\Delta AMC$ cân tại $M$:**
  1. **Chứng minh $\Delta AMC$ cân tại $M$:**
     * Trong tam giác vuông $\Delta BAM$ (vuông tại $A$), ta có:
       $$\widehat{AMB} = 90^\circ - \widehat{B} = 90^\circ - 30^\circ = 60^\circ$$
     * Mặt khác, ta có:
       $$\widehat{CAM} = \widehat{BAC} - \widehat{BAM} = 120^\circ - 90^\circ = 30^\circ$$
     * Xét tam giác $\Delta AMC$, ta có:
       $$\widehat{CAM} = 30^\circ \quad \text{và} \quad \widehat{ACM} = \widehat{C} = 30^\circ$$
     * Vì tam giác $\Delta AMC$ có hai góc bằng nhau: $\widehat{CAM} = \widehat{ACM} = 30^\circ$, nên tam giác $\Delta AMC$ cân tại đỉnh $M$ (với $MA = MC$).
  2. **Chứng minh $\Delta ANB$ cân tại $N$:**
     * Tương tự, ta có:
       $$\widehat{BAN} = \widehat{BAC} - \widehat{CAN} = 120^\circ - 90^\circ = 30^\circ$$
     * Xét tam giác $\Delta ANB$, ta có:
       $$\widehat{BAN} = 30^\circ \quad \text{và} \quad \widehat{ABN} = \widehat{B} = 30^\circ$$
     * Vì tam giác $\Delta ANB$ có hai góc bằng nhau: $\widehat{BAN} = \widehat{ABN} = 30^\circ$, nên tam giác $\Delta ANB$ cân tại đỉnh $N$ (với $NA = NB$).

---

### Bài 4.39 (Trang 87)
**Đề bài:** Cho tam giác $ABC$ vuông tại $A$ có $\widehat{B} = 60^\circ$. Trên cạnh $BC$ lấy điểm $M$ sao cho $\widehat{CAM} = 30^\circ$. Chứng minh rằng:
a) Tam giác $\Delta CAM$ cân tại $M$;
b) Tam giác $\Delta BAM$ là tam giác đều;
c) $M$ là trung điểm của đoạn thẳng $BC$.

**Lời giải:**
* **Câu a) Chứng minh tam giác $\Delta CAM$ cân tại $M$:**
  1. Xét tam giác vuông $\Delta ABC$ vuông tại $A$ (có $\widehat{BAC} = 90^\circ$):
     * Hai góc nhọn phụ nhau nên:
       $$\widehat{C} = 90^\circ - \widehat{B} = 90^\circ - 60^\circ = 30^\circ$$
  2. Xét tam giác $\Delta CAM$, ta có:
     * $\widehat{CAM} = 30^\circ$ (theo giả thiết).
     * $\widehat{C} = 30^\circ$ (theo chứng minh trên).
  3. Vì $\widehat{CAM} = \widehat{C} = 30^\circ$, tam giác $\Delta CAM$ có hai góc bằng nhau nên tam giác này cân tại đỉnh $M$ (suy ra $MA = MC$).

* **Câu b) Chứng minh tam giác $\Delta BAM$ là tam giác đều:**
  1. Ta có:
     $$\widehat{BAM} = \widehat{BAC} - \widehat{CAM} = 90^\circ - 30^\circ = 60^\circ$$
  2. Xét tam giác $\Delta BAM$, áp dụng định lí tổng ba góc trong một tam giác:
     $$\widehat{AMB} = 180^\circ - (\widehat{B} + \widehat{BAM}) = 180^\circ - (60^\circ + 60^\circ) = 60^\circ$$
  3. Tam giác $\Delta BAM$ có cả ba góc bằng nhau và bằng $60^\circ$ ($\widehat{B} = \widehat{BAM} = \widehat{AMB} = 60^\circ$). Do đó, $\Delta BAM$ là tam giác đều (suy ra $AB = BM = MA$).

* **Câu c) Chứng minh $M$ là trung điểm của đoạn thẳng $BC$:**
  1. Từ kết quả câu a ($\Delta CAM$ cân tại $M$), ta có:
     $$MA = MC \quad (1)$$
  2. Từ kết quả câu b ($\Delta BAM$ đều), ta có:
     $$MA = BM \quad (2)$$
  3. Từ (1) và (2), suy ra:
     $$BM = MC \quad (\text{vì cùng bằng } MA)$$
  4. Vì điểm $M$ nằm trên cạnh $BC$ (theo giả thiết) và cách đều hai đầu mút $B$ và $C$ ($BM = MC$), nên $M$ chính là trung điểm của đoạn thẳng $BC$.
     *(Điều phải chứng minh).*
