# CHƯƠNG V: ĐƯỜNG TRÒN

Chương V là chương trọng tâm của phần Hình học trong chương trình Toán 9 Tập 1, hệ thống hóa toàn bộ các kiến thức cơ bản về đường tròn, mối quan hệ giữa đường kính và dây cung, các phép đo độ dài cung, diện tích quạt tròn, hình vành khuyên, cùng các vị trí tương đối giữa đường thẳng với đường tròn và giữa hai đường tròn với nhau.

---

## BÀI 13: MỞ ĐẦU VỀ ĐƯỜNG TRÒN

### 1. Định nghĩa và Kí hiệu
*   **Định nghĩa**: Đường tròn tâm $O$ bán kính $R$ (với $R > 0$) là hình gồm các điểm cách điểm $O$ một khoảng bằng $R$.
*   **Kí hiệu**: $(O; R)$ hoặc đơn giản là $(O)$ khi không cần chú ý đến bán kính.
*   **Vị trí tương đối của điểm $M$ đối với đường tròn $(O; R)$**:
    *   $M$ nằm **trên** (thuộc) đường tròn $(O; R) \Leftrightarrow OM = R$.
    *   $M$ nằm **trong** đường tròn $(O; R) \Leftrightarrow OM < R$.
    *   $M$ nằm **ngoài** đường tròn $(O; R) \Leftrightarrow OM > R$.
*   **Hình tròn**: Hình tròn tâm $O$ bán kính $R$ là hình gồm các điểm nằm trên đường tròn và các điểm nằm trong đường tròn đó.

### 2. Tính chất đối xứng của Đường tròn
*   **Đối xứng tâm**: Đường tròn là hình có tâm đối xứng. Tâm của đường tròn chính là tâm đối xứng của đường tròn đó. 
    *   *Chứng minh*: Nếu $A$ là một điểm thuộc đường tròn $(O)$ thì điểm $A'$ đối xứng với $A$ qua tâm $O$ cũng thuộc $(O)$ vì $OA' = OA = R$.
*   **Đối xứng trục**: Đường tròn là hình có trục đối xứng. Bất kì đường thẳng nào đi qua tâm cũng là một trục đối xứng của đường tròn đó (đường tròn có vô số trục đối xứng).
    *   *Chứng minh*: Nếu $A$ là một điểm thuộc đường tròn $(O)$ thì điểm $A'$ đối xứng với $A$ qua đường thẳng $d$ đi qua tâm $O$ cũng thuộc $(O)$ vì $OA' = OA = R$.

---

## BÀI 14: CUNG VÀ DÂY CỦA MỘT ĐƯỜNG TRÒN

### 1. Dãy cung và Đường kính
*   **Dây cung (gọi tắt là dây)**: Là đoạn thẳng nối hai điểm phân biệt bất kì trên đường tròn.
*   **Đường kính**: Là dây cung đi qua tâm của đường tròn.
*   **Định lý 1 (So sánh độ dài của đường kính và dây)**: 
    > Trong các dây của một đường tròn, đường kính là dây có độ dài lớn nhất.
    *   Với mọi dây $AB$ của đường tròn $(O; R)$, ta luôn có: $AB \le 2R$. Dấu bằng xảy ra khi và chỉ khi $AB$ là đường kính.

### 2. Quan hệ vuông góc giữa Đường kính và Dây
*   **Định lý 2**: Trong một đường tròn, đường kính vuông góc với một dây thì đi qua trung điểm của dây ấy.
    *   Nếu đường kính $CD \perp AB$ tại $I$ thì $I$ là trung điểm của $AB$ ($IA = IB$).
*   **Định lý 3 (Đảo)**: Trong một đường tròn, đường kính đi qua trung điểm của một dây không đi qua tâm thì vuông góc với dây ấy.
    *   Nếu đường kính $CD$ đi qua trung điểm $I$ của dây $AB$ (với $AB$ không đi qua tâm $O$) thì $CD \perp AB$.

### 3. Liên hệ giữa Dây và Khoảng cách từ tâm đến Dây
Trong một đường tròn (hoặc hai đường tròn bằng nhau):
*   **Định lý 4**:
    *   Hai dây bằng nhau thì cách đều tâm: Nếu $AB = CD$ thì $OK = OH$ (với $OK \perp AB, OH \perp CD$).
    *   Hai dây cách đều tâm thì bằng nhau: Nếu $OK = OH$ thì $AB = CD$.
*   **Định lý 5**:
    *   Dây lớn hơn thì gần tâm hơn: Nếu $AB > CD$ thì $OK < OH$.
    *   Dây gần tâm hơn thì lớn hơn: Nếu $OK < OH$ thì $AB > CD$.

---

## BÀI 15: ĐỘ DÀI CỦA CUNG TRÒN. DIỆN TÍCH HÌNH QUẠT TRÒN VÀ HÌNH VÀNH KHUYÊN

### 1. Chu vi và Độ dài Cung tròn
*   **Chu vi đường tròn (Độ dài đường tròn)**:
    $$C = \pi d = 2\pi R$$
    *(Trong đó $d = 2R$ là đường kính, $R$ là bán kính, $\pi \approx 3,14$)*.
*   **Độ dài cung tròn $n^\circ$**: Trên đường tròn bán kính $R$, độ dài $l$ của một cung $n^\circ$ được tính theo công thức:
    $$l = \frac{n}{180} \pi R$$

### 2. Diện tích Hình tròn và Hình quạt tròn
*   **Diện tích hình tròn**:
    $$S = \pi R^2$$
*   **Diện tích hình quạt tròn**: Hình quạt tròn là phần hình tròn giới hạn bởi một cung tròn và hai bán kính đi qua hai đầu mút của cung đó. Diện tích $S_q$ của hình quạt tròn bán kính $R$, cung $n^\circ$ được tính bằng:
    $$S_q = \frac{n}{360} \pi R^2 = \frac{l \cdot R}{2}$$
    *(Với $l$ là độ dài cung $n^\circ$ của hình quạt đó)*.

### 3. Diện tích Hình vành khuyên (Hình vành khăn)
*   **Định nghĩa**: Hình vành khuyên là phần nằm giữa hai đường tròn đồng tâm có bán kính khác nhau $R$ và $r$ ($R > r$).
*   **Công thức diện tích**:
    $$S_v = \pi R^2 - \pi r^2 = \pi (R^2 - r^2)$$

---

## BÀI 16: VỊ TRÍ TƯƠNG ĐỐI CỦA ĐƯỜNG THẲNG VÀ ĐƯỜNG TRÒN

Gọi $d$ là khoảng cách từ tâm $O$ của đường tròn $(O; R)$ đến đường thẳng $a$.

| Vị trí tương đối | Số điểm chung | Hệ thức giữa $d$ và $R$ | Minh họa hình học |
| :--- | :---: | :---: | :--- |
| **Đường thẳng và đường tròn cắt nhau** | $2$ | $d < R$ | Đường thẳng đi qua phía trong đường tròn |
| **Đường thẳng và đường tròn tiếp xúc nhau** | $1$ | $d = R$ | Đường thẳng gọi là **tiếp tuyến**, điểm chung duy nhất gọi là **tiếp điểm** |
| **Đường thẳng và đường tròn không giao nhau** | $0$ | $d > R$ | Đường thẳng nằm hoàn toàn bên ngoài đường tròn |

### Định lý Tiếp tuyến của Đường tròn:
1.  **Tính chất**: Nếu một đường thẳng là tiếp tuyến của một đường tròn thì nó vuông góc với bán kính đi qua tiếp điểm.
2.  **Dấu hiệu nhận biết**: Nếu một đường thẳng đi qua một điểm của đường tròn và vuông góc với bán kính đi qua điểm đó thì đường thẳng ấy là một tiếp tuyến của đường tròn.

### Tính chất của Hai tiếp tuyến cắt nhau:
Nếu hai tiếp tuyến của đường tròn $(O)$ cắt nhau tại một điểm $M$ (với $A, B$ là các tiếp điểm):
*   $MA = MB$ (Khoảng cách từ điểm giao đến hai tiếp điểm bằng nhau).
*   $MO$ là tia phân giác của góc tạo bởi hai tiếp tuyến $\widehat{AMB}$ (tức là $\widehat{AMO} = \widehat{BMO}$).
*   $OM$ là tia phân giác của góc tạo bởi hai bán kính $\widehat{AOB}$ (tức là $\widehat{AOM} = \widehat{BOM}$).
*   Đường thẳng $OM$ là đường trung trực của đoạn thẳng nối hai tiếp điểm $AB$.

---

## BÀI 17: VỊ TRÍ TƯƠNG ĐỐI CỦA HAI ĐƯỜNG TRÒN

Xét hai đường tròn $(O; R)$ và $(O'; r)$ với $R \ge r$ và khoảng cách giữa hai tâm là $OO' = d$.

| Vị trí tương đối của hai đường tròn | Số điểm chung | Hệ thức liên hệ giữa $d, R, r$ |
| :--- | :---: | :--- |
| **Hai đường tròn cắt nhau** | $2$ | $R - r < d < R + r$ |
| **Hai đường tròn tiếp xúc nhau** | $1$ | |
| *-- Tiếp xúc ngoài* | | $d = R + r$ |
| *-- Tiếp xúc trong* | | $d = R - r > 0$ |
| **Hai đường tròn không giao nhau** | $0$ | |
| *-- Ở ngoài nhau* | | $d > R + r$ |
| *-- Đựng nhau* | | $d < R - r$ |
| *-- Đồng tâm (Trùng tâm $O \equiv O'$)* | | $d = 0$ |

### Tính chất đường nối tâm:
*   Nếu hai đường tròn cắt nhau thì đường nối tâm là đường trung trực của dây chung.
*   Nếu hai đường tròn tiếp xúc nhau thì tiếp điểm nằm trên đường nối tâm.

---

## BÀI TẬP CUỐI CHƯƠNG V (ĐỀ BÀI & LỜI GIẢI CHI TIẾT)

### PHẦN A: TRẮC NGHIỆM KHÁCH QUAN

**Bài 5.32**: Cho đường tròn $(O; 4\text{ cm})$ và hai điểm $A, B$. Biết rằng $OA = \sqrt{15}\text{ cm}$ và $OB = 4\text{ cm}$. Khi đó:
*   A. Điểm $A$ nằm trong $(O)$, điểm $B$ nằm ngoài $(O)$.
*   B. Điểm $A$ nằm ngoài $(O)$, điểm $B$ nằm trên $(O)$.
*   C. Điểm $A$ nằm trên $(O)$, điểm $B$ nằm trong $(O)$.
*   D. Điểm $A$ nằm trong $(O)$, điểm $B$ nằm trên $(O)$.
*   **Đáp án chọn**: **D**
*   *Giải thích chi tiết*:
    Ta có bán kính đường tròn là $R = 4\text{ cm}$.
    *   Khoảng cách từ tâm $O$ đến điểm $A$ là $OA = \sqrt{15}\text{ cm} \approx 3,87\text{ cm}$. Vì $OA < R$ ($3,87 < 4$) nên điểm $A$ nằm **trong** đường tròn $(O)$.
    *   Khoảng cách từ tâm $O$ đến điểm $B$ là $OB = 4\text{ cm}$. Vì $OB = R = 4$ nên điểm $B$ nằm **trên** (thuộc) đường tròn $(O)$.

**Bài 5.33**: Cho Hình 5.43, trong đó $BD$ là đường kính, $\widehat{AOB} = 40^\circ, \widehat{BOC} = 100^\circ$. Khi đó số đo của cung nhỏ $\overparen{DC}$ và cung nhỏ $\overparen{AD}$ lần lượt là:
*   A. sđ $\overparen{DC} = 80^\circ$ và sđ $\overparen{AD} = 220^\circ$.
*   B. sđ $\overparen{DC} = 280^\circ$ và sđ $\overparen{AD} = 220^\circ$.
*   C. sđ $\overparen{DC} = 280^\circ$ và sđ $\overparen{AD} = 140^\circ$.
*   D. sđ $\overparen{DC} = 80^\circ$ và sđ $\overparen{AD} = 140^\circ$.
*   **Đáp án chọn**: **D**
*   *Giải thích chi tiết*:
    Vì $BD$ là đường kính nên góc bẹt $\widehat{BOD} = 180^\circ$. Ba điểm $B, O, D$ thẳng hàng.
    *   Góc ở tâm $\widehat{COD}$ kề bù với góc $\widehat{BOC}$:
        $$\widehat{COD} = 180^\circ - \widehat{BOC} = 180^\circ - 100^\circ = 80^\circ$$
        Do đó, số đo cung nhỏ $\overparen{DC}$ bằng số đo góc ở tâm chắn nó: sđ $\overparen{DC} = \widehat{COD} = 80^\circ$.
    *   Góc ở tâm $\widehat{AOD}$ kề bù với góc $\widehat{AOB}$:
        $$\widehat{AOD} = 180^\circ - \widehat{AOB} = 180^\circ - 40^\circ = 140^\circ$$
        Do đó, số đo cung nhỏ $\overparen{AD}$ bằng số đo góc ở tâm chắn nó: sđ $\overparen{AD} = \widehat{AOD} = 140^\circ$.

**Bài 5.34**: Cho hai đường tròn $(A; R_1), (B; R_2)$, trong đó $R_2 < R_1$. Biết rằng hai đường tròn $(A)$ và $(B)$ cắt nhau. Khi đó mối quan hệ giữa độ dài đoạn nối tâm $AB$ và hai bán kính là:
*   A. $AB < R_1 - R_2$
*   B. $R_1 - R_2 < AB < R_1 + R_2$
*   C. $AB > R_1 + R_2$
*   D. $AB = R_1 + R_2$
*   **Đáp án chọn**: **B**
*   *Giải thích chi tiết*: Theo hệ thức liên hệ về vị trí tương đối giữa hai đường tròn, hai đường tròn cắt nhau khi và chỉ khi hiệu hai bán kính nhỏ hơn khoảng cách nối tâm và khoảng cách nối tâm nhỏ hơn tổng hai bán kính: $R_1 - R_2 < AB < R_1 + R_2$.

**Bài 5.35**: Cho đường tròn $(O; R)$ và hai đường thẳng $a_1, a_2$. Gọi $d_1, d_2$ lần lượt là khoảng cách từ tâm $O$ đến $a_1, a_2$. Biết rằng đường tròn $(O)$ cắt $a_1$ và tiếp xúc với $a_2$. Khi đó ta có:
*   A. $d_1 < R$ và $d_2 = R$
*   B. $d_1 = R$ và $d_2 < R$
*   C. $d_1 > R$ và $d_2 = R$
*   D. $d_1 < R$ và $d_2 < R$
*   **Đáp án chọn**: **A**
*   *Giải thích chi tiết*:
    *   Đường tròn $(O; R)$ cắt đường thẳng $a_1$ nên khoảng cách từ tâm $O$ đến đường thẳng này nhỏ hơn bán kính: $d_1 < R$.
    *   Đường tròn $(O; R)$ tiếp xúc với đường thẳng $a_2$ nên khoảng cách từ tâm $O$ đến đường thẳng này bằng bán kính: $d_2 = R$.

---

### PHẦN B: TỰ LUẬN RÈN LUYỆN

**Bài 5.36**: Cho đường tròn $(O)$ đường kính $BC$ và điểm $A$ (khác $B$ và $C$).
*   **a) Chứng minh rằng nếu $A$ nằm trên $(O)$ thì $ABC$ là một tam giác vuông.**
    *   *Lời giải*:
        Vì $A$ nằm trên đường tròn $(O)$ đường kính $BC$ nên đoạn thẳng $OA$ chính là bán kính của đường tròn: $OA = OB = OC = R$.
        Xét tam giác $ABC$, đường trung tuyến $AO$ ứng với cạnh $BC$ có độ dài:
        $$AO = \frac{1}{2} BC \quad (\text{vì } BC = 2R, AO = R)$$
        Trong một tam giác, nếu đường trung tuyến ứng với một cạnh bằng nửa cạnh ấy thì tam giác đó là tam giác vuông. 
        Do đó, tam giác $ABC$ vuông tại $A$.
*   **b) Ngược lại, chứng minh rằng nếu $ABC$ là tam giác vuông tại $A$ thì $A$ nằm trên đường tròn $(O)$ đường kính $BC$.**
    *   *Lời giải*:
        Giả sử tam giác $ABC$ vuông tại $A$. Gọi $O'$ là trung điểm của cạnh huyền $BC$.
        Trong tam giác vuông, đường trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền:
        $$AO' = \frac{1}{2} BC = O'B = O'C$$
        Suy ra ba điểm $A, B, C$ cách đều điểm $O'$. Do đó, $A, B, C$ cùng nằm trên đường tròn tâm $O'$ đường kính $BC$.
        Vì đường tròn đường kính $BC$ của đề bài có tâm là $O$ (do $BC$ là đường kính của $(O)$) nên tâm $O'$ trùng với $O$ ($O' \equiv O$).
        Do đó, điểm $A$ phải nằm trên đường tròn $(O)$ đường kính $BC$. (đpcm)

**Bài 5.37**: Cho $AB$ là một dây bất kì (không phải là đường kính) của đường tròn $(O; 4\text{ cm})$. Gọi $C$ và $D$ lần lượt là các điểm đối xứng với $A$ và $B$ qua tâm $O$.
*   **a) Hai điểm $C$ và $D$ có nằm trên đường tròn $(O)$ không? Vì sao?**
    *   *Lời giải*:
        *   Vì $C$ đối xứng với $A$ qua tâm $O$ nên $O$ là trung điểm của đoạn thẳng $AC$. Suy ra $OC = OA$. Vì $A$ nằm trên đường tròn $(O; 4\text{ cm})$ nên $OA = R = 4\text{ cm}$. Do đó $OC = 4\text{ cm} \Rightarrow C$ nằm trên đường tròn $(O)$.
        *   Vì $D$ đối xứng với $B$ qua tâm $O$ nên $O$ là trung điểm của đoạn thẳng $BD$. Suy ra $OD = OB$. Vì $B$ nằm trên đường tròn $(O; 4\text{ cm})$ nên $OB = R = 4\text{ cm}$. Do đó $OD = 4\text{ cm} \Rightarrow D$ nằm trên đường tròn $(O)$.
*   **b) Biết rằng $ABCD$ là một hình vuông. Tính độ dài cung lớn $\overparen{AB}$ và diện tích hình quạt tròn tạo bởi hai bán kính $OA$ và $OB$.**
    *   *Lời giải*:
        Vì $ABCD$ là một hình vuông nội tiếp đường tròn $(O)$, hai đường chéo $AC$ và $BD$ cắt nhau tại tâm $O$ và vuông góc với nhau: $AC \perp BD$ tại $O$.
        Suy ra góc ở tâm $\widehat{AOB} = 90^\circ$.
        1.  **Tính độ dài cung lớn $\overparen{AB}$**:
            *   Số đo cung nhỏ $\overparen{AB}$ bằng số đo góc ở tâm $\widehat{AOB} = 90^\circ$.
            *   Số đo cung lớn $\overparen{AB}$ là: $360^\circ - 90^\circ = 270^\circ$.
            *   Áp dụng công thức tính độ dài cung tròn với $n = 270^\circ, R = 4\text{ cm}$:
                $$l = \frac{n}{180} \pi R = \frac{270}{180} \pi \cdot 4 = 6\pi \approx 18,85\text{ (cm)}$$
        2.  **Tính diện tích hình quạt tròn tạo bởi hai bán kính $OA, OB$ (quạt nhỏ chắn cung nhỏ $90^\circ$)**:
            *   Áp dụng công thức tính diện tích hình quạt tròn với $n = 90^\circ, R = 4\text{ cm}$:
                $$S_q = \frac{n}{360} \pi R^2 = \frac{90}{360} \pi \cdot 4^2 = 4\pi \approx 12,57\text{ (cm}^2)$$
            *(Lưu ý: Nếu tính diện tích hình quạt tròn lớn tương ứng với cung $270^\circ$, ta có $S_{q\text{ lớn}} = \frac{270}{360} \pi \cdot 4^2 = 12\pi \approx 37,70\text{ cm}^2$)*.

**Bài 5.38**: Cho điểm $B$ nằm giữa hai điểm $A$ và $C$, sao cho $AB = 2\text{ cm}$ và $BC = 1\text{ cm}$. Vẽ các đường tròn $(A; 1,5\text{ cm})$, $(B; 3\text{ cm})$ và $(C; 2\text{ cm})$. Hãy xác định các cặp đường tròn cắt nhau, không giao nhau, và tiếp xúc với nhau.
*   *Lời giải*:
    Vì ba điểm $A, B, C$ thẳng hàng và $B$ nằm giữa $A$ và $C$ nên khoảng cách giữa các tâm đường tròn lần lượt là:
    *   $d(A, B) = AB = 2\text{ cm}$
    *   $d(B, C) = BC = 1\text{ cm}$
    *   $d(A, C) = AC = AB + BC = 2 + 1 = 3\text{ cm}$
    
    Ta xét từng cặp đường tròn:
    1.  **Cặp đường tròn $(A; 1,5\text{ cm})$ và $(B; 3\text{ cm})$**:
        *   Khoảng cách hai tâm: $d_1 = AB = 2\text{ cm}$.
        *   Hiệu hai bán kính: $|R_B - R_A| = |3 - 1,5| = 1,5\text{ cm}$.
        *   Tổng hai bán kính: $R_A + R_B = 1,5 + 3 = 4,5\text{ cm}$.
        *   Vì $1,5 < 2 < 4,5$ hay $|R_B - R_A| < d_1 < R_A + R_B$, nên hai đường tròn $(A)$ và $(B)$ **cắt nhau**.
    2.  **Cặp đường tròn $(B; 3\text{ cm})$ và $(C; 2\text{ cm})$**:
        *   Khoảng cách hai tâm: $d_2 = BC = 1\text{ cm}$.
        *   Hiệu hai bán kính: $|R_B - R_C| = |3 - 2| = 1\text{ cm}$.
        *   Vì $d_2 = |R_B - R_C| = 1\text{ cm}$, nên hai đường tròn $(B)$ và $(C)$ **tiếp xúc trong** với nhau.
    3.  **Cặp đường tròn $(A; 1,5\text{ cm})$ và $(C; 2\text{ cm})$**:
        *   Khoảng cách hai tâm: $d_3 = AC = 3\text{ cm}$.
        *   Hiệu hai bán kính: $|R_C - R_A| = |2 - 1,5| = 0,5\text{ cm}$.
        *   Tổng hai bán kính: $R_A + R_C = 1,5 + 2 = 3,5\text{ cm}$.
        *   Vì $0,5 < 3 < 3,5$ hay $|R_C - R_A| < d_3 < R_A + R_C$, nên hai đường tròn $(A)$ và $(C)$ **cắt nhau**.

**Bài 5.39**: Cho tam giác vuông $ABC$ ($\widehat{A} = 90^\circ$). Vẽ hai đường tròn $(B; BA)$ và $(C; CA)$ cắt nhau tại $A$ và $A'$. Chứng minh rằng $BA$ và $BA'$ là hai tiếp tuyến cắt nhau của đường tròn $(C; CA)$.
*   *Lời giải*:
    *   **Xét tiếp tuyến $BA$**:
        Vì tam giác $ABC$ vuông tại $A$ nên $BA \perp AC$ tại $A$.
        Đoạn thẳng $AC$ là bán kính của đường tròn $(C; CA)$. 
        Do đó, đường thẳng $BA$ đi qua điểm $A$ nằm trên đường tròn $(C)$ và vuông góc với bán kính $AC$ tại $A$.
        Suy ra $BA$ là một tiếp tuyến của đường tròn $(C; CA)$ tại tiếp điểm $A$.
    *   **Xét tiếp tuyến $BA'$**:
        Vì hai đường tròn $(B; BA)$ và $(C; CA)$ cắt nhau tại hai điểm $A$ và $A'$ nên đường nối tâm $BC$ is đường trung trực của dây chung $AA'$.
        Do đó, phép đối xứng qua đường thẳng $BC$ biến điểm $A$ thành điểm $A'$ và giữ nguyên tâm $C$ và tâm $B$.
        *   Vì đối xứng trục bảo toàn khoảng cách nên $CA' = CA$ (điểm $A'$ nằm trên đường tròn $(C)$) và $BA' = BA$.
        *   Vì đối xứng trục bảo toàn góc nên:
            $$\widehat{BA'C} = \widehat{BAC}$$
            Mà tam giác $ABC$ vuông tại $A$ nên $\widehat{BAC} = 90^\circ \Rightarrow \widehat{BA'C} = 90^\circ$.
        Suy ra $BA' \perp CA'$ tại $A'$.
        Đoạn thẳng $CA'$ là bán kính của đường tròn $(C; CA)$, do đó $BA'$ vuông góc với bán kính $CA'$ tại tiếp điểm $A'$.
        Suy ra $BA'$ là tiếp tuyến thứ hai của đường tròn $(C; CA)$ tại tiếp điểm $A'$.
    *   **Kết luận**: $BA$ và $BA'$ là hai tiếp tuyến cắt nhau của đường tròn $(C; CA)$ phát xuất từ điểm $B$. (đpcm)