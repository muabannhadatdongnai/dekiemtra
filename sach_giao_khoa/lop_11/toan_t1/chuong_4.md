# Chương IV: Quan hệ song song trong không gian

Sách giáo khoa Toán 11 - Tập một (Kết nối tri thức với cuộc sống)

---

## Bài 10: Đường thẳng và mặt phẳng trong không gian

### 1. Khái niệm mở đầu
*   **Mặt phẳng**: Là đối tượng cơ bản của hình học không gian. Mặt phẳng không có bề dày và kéo dài vô hạn về mọi phía. Để biểu diễn mặt phẳng, ta thường dùng một hình bình hành và viết tên của mặt phẳng vào một góc của hình, kí hiệu là $(P)$, $(Q)$, $(\alpha)$, $(\beta)$,... hoặc $\text{mp}(P)$, $\text{mp}(Q)$.
*   **Điểm thuộc mặt phẳng**:
    *   Điểm $A$ thuộc mặt phẳng $(P)$, kí hiệu là $A \in (P)$.
    *   Điểm $B$ không thuộc mặt phẳng $(P)$, kí hiệu là $B \notin (P)$.
*   **Biểu diễn các hình trong không gian lên mặt phẳng giấy**:
    *   Đường thẳng được biểu diễn bằng đường thẳng. Đoạn thẳng được biểu diễn bằng đoạn thẳng.
    *   Giữ nguyên tính thuộc giữa điểm và đường thẳng.
    *   Nét vẽ liền dùng để biểu diễn cho đường nhìn thấy (không bị che khuất).
    *   Nét đứt đoạn dùng để biểu diễn cho đường bị che khuất.

### 2. Các tính chất thừa nhận
*   **Tính chất 1**: Có một và chỉ một đường thẳng đi qua hai điểm phân biệt cho trước.
*   **Tính chất 2**: Có một và chỉ một mặt phẳng đi qua ba điểm không thẳng hàng cho trước.
*   **Tính chất 3**: Nếu một đường thẳng có hai điểm phân biệt thuộc một mặt phẳng thì mọi điểm của đường thẳng đó đều thuộc mặt phẳng đó (đường thẳng nằm trong mặt phẳng hoặc mặt phẳng chứa đường thẳng, kí hiệu $d \subset (P)$).
*   **Tính chất 4**: Tồn tại bốn điểm không cùng thuộc một mặt phẳng (bốn điểm không đồng phẳng).
*   **Tính chất 5**: Nếu hai mặt phẳng phân biệt có một điểm chung thì chúng có một đường thẳng chung duy nhất đi qua điểm chung đó. Đường thẳng chung này gọi là **giao tuyến** của hai mặt phẳng, kí hiệu là $d = (P) \cap (Q)$.
*   **Tính chất 6**: Trên mỗi mặt phẳng, tất cả các kết quả đã biết trong hình học phẳng đều đúng.

### 3. Cách xác định một mặt phẳng
Một mặt phẳng hoàn toàn được xác định bởi một trong ba điều kiện sau:
1.  **Qua ba điểm không thẳng hàng**: Kí hiệu mặt phẳng qua ba điểm không thẳng hàng $A, B, C$ là $(ABC)$.
2.  **Qua một đường thẳng và một điểm không thuộc đường thẳng đó**: Kí hiệu là $\text{mp}(A, d)$.
3.  **Chứa hai đường thẳng cắt nhau**: Kí hiệu là $\text{mp}(a, b)$.

### 4. Hình chóp và hình tứ diện
*   **Hình chóp**: Cho đa giác lồi $A_1A_2...A_n$ nằm trên mặt phẳng $(P)$ và một điểm $S$ nằm ngoài $(P)$. Nối $S$ với các đỉnh $A_1, A_2, ..., A_n$ để được $n$ tam giác $SA_1A_2, SA_2A_3, ..., SA_nA_1$. Hình gồm đa giác đáy $A_1A_2...A_n$ và $n$ tam giác đó được gọi là hình chóp $S.A_1A_2...A_n$.
    *   $S$: Đỉnh của hình chóp.
    *   Đa giác $A_1A_2...A_n$: Mặt đáy.
    *   Các tam giác $SA_1A_2, ..., SA_nA_1$: Các mặt bên.
    *   Các đoạn thẳng $SA_1, SA_2, ..., SA_n$: Các cạnh bên.
    *   Các cạnh của đa giác đáy: Các cạnh đáy.
*   **Hình tứ diện**: Cho bốn điểm $A, B, C, D$ không đồng phẳng. Hình gồm bốn tam giác $ABC, ACD, ABD$ và $BCD$ được gọi là hình tứ diện $ABCD$.
    *   Bốn điểm $A, B, C, D$: Các đỉnh của tứ diện.
    *   Các đoạn thẳng $AB, BC, CD, DA, AC, BD$: Các cạnh của tứ diện. Hai cạnh không có đỉnh chung gọi là **hai cạnh đối diện** (ví dụ: $AB$ và $CD$, $AC$ và $BD$, $AD$ và $BC$).
    *   Các tam giác $ABC, ACD, ABD, BCD$: Các mặt của tứ diện.
    *   Tứ diện có 4 mặt là các tam giác đều được gọi là **tứ diện đều**.

---

## Bài 11: Hai đường thẳng song song

### 1. Vị trí tương đối của hai đường thẳng trong không gian
Cho hai đường thẳng $a$ và $b$ trong không gian. Có hai trường hợp xảy ra:
*   **Trường hợp 1: Đồng phẳng** (cùng nằm trong một mặt phẳng):
    *   $a$ và $b$ cắt nhau tại điểm $M$: $a \cap b = \{M\}$.
    *   $a$ và $b$ song song ($a \parallel b$): $a$ và $b$ đồng phẳng và không có điểm chung.
    *   $a$ và $b$ trùng nhau: $a \equiv b$.
*   **Trường hợp 2: Không đồng phẳng**:
    *   $a$ và $b$ chéo nhau: Không có mặt phẳng nào chứa cả $a$ và $b$.

### 2. Tính chất của hai đường thẳng song song
*   **Định lí 1**: Trong không gian, qua một điểm không nằm trên đường thẳng cho trước, có đúng một đường thẳng song song với đường thẳng đó.
*   **Định lí 2 (Định lí về ba đường giao tuyến)**: Nếu ba mặt phẳng đôi một cắt nhau theo ba giao tuyến phân biệt thì ba giao tuyến đó hoặc đồng quy, hoặc đôi một song song với nhau.
*   **Hệ quả**: Nếu hai mặt phẳng chứa hai đường thẳng song song với nhau thì giao tuyến của chúng (nếu có) cũng song song với hai đường thẳng đó hoặc trùng với một trong hai đường thẳng đó.
    $$\begin{cases} a \subset (P) \\ b \subset (Q) \\ a \parallel b \\ (P) \cap (Q) = d \end{cases} \Rightarrow d \parallel a \parallel b \text{ (hoặc } d \equiv a, d \equiv b \text{)}$$
*   **Định lí 3**: Trong không gian, hai đường thẳng phân biệt cùng song song với một đường thẳng thứ ba thì song song với nhau.
    $$\begin{cases} a \parallel c \\ b \parallel c \\ a \ne b \end{cases} \Rightarrow a \parallel b$$

---

## Bài 12: Đường thẳng và mặt phẳng song song

### 1. Vị trí tương đối của đường thẳng và mặt phẳng
Cho đường thẳng $d$ và mặt phẳng $(\alpha)$. Có ba vị trí tương đối giữa chúng:
1.  **Đường thẳng song song với mặt phẳng**: $d$ và $(\alpha)$ không có điểm chung, kí hiệu là $d \parallel (\alpha)$ hoặc $(\alpha) \parallel d$.
2.  **Đường thẳng cắt mặt phẳng**: $d$ và $(\alpha)$ có một điểm chung duy nhất $M$, kí hiệu là $d \cap (\alpha) = \{M\}$.
3.  **Đường thẳng nằm trong mặt phẳng**: $d$ và $(\alpha)$ có nhiều hơn một điểm chung (mọi điểm của $d$ đều thuộc $(\alpha)$), kí hiệu là $d \subset (\alpha)$.

### 2. Điều kiện và tính chất
*   **Định lí 1 (Điều kiện song song)**: Nếu đường thẳng $a$ không nằm trong mặt phẳng $(P)$ và song song với một đường thẳng $b$ nằm trong $(P)$ thì đường thẳng $a$ song song với mặt phẳng $(P)$.
    $$\begin{cases} a \not\subset (P) \\ b \subset (P) \\ a \parallel b \end{cases} \Rightarrow a \parallel (P)$$
*   **Định lí 2 (Tính chất)**: Cho đường thẳng $a$ song song với mặt phẳng $(P)$. Nếu mặt phẳng $(Q)$ chứa $a$ và cắt $(P)$ theo giao tuyến $b$ thì $b$ song song với $a$.
    $$\begin{cases} a \parallel (P) \\ a \subset (Q) \\ (P) \cap (Q) = b \end{cases} \Rightarrow b \parallel a$$
*   **Hệ quả**: Nếu hai mặt phẳng cắt nhau và cùng song song với một đường thẳng thì giao tuyến của chúng cũng song song với đường thẳng đó.
    $$\begin{cases} (P) \cap (Q) = d \\ a \parallel (P) \\ a \parallel (Q) \end{cases} \Rightarrow d \parallel a$$

---

## Bài 13: Hai mặt phẳng song song

### 1. Khái niệm hai mặt phẳng song song
*   **Định nghĩa**: Hai mặt phẳng $(\alpha)$ và $(\beta)$ được gọi là song song với nhau nếu chúng không có điểm chung, kí hiệu là $(\alpha) \parallel (\beta)$ hoặc $(\beta) \parallel (\alpha)$.
*   **Tính chất**: Nếu hai mặt phẳng song song với nhau thì mọi đường thẳng nằm trong mặt phẳng này đều song song với mặt phẳng kia.
    $$(\alpha) \parallel (\beta) \text{ và } d \subset (\alpha) \Rightarrow d \parallel (\beta)$$

### 2. Điều kiện và tính chất của hai mặt phẳng song song
*   **Định lí 1 (Điều kiện song song)**: Nếu mặt phẳng $(\alpha)$ chứa hai đường thẳng cắt nhau $a, b$ và $a, b$ cùng song song với mặt phẳng $(\beta)$ thì $(\alpha) \parallel (\beta)$.
*   **Định lí 2**: Qua một điểm nằm ngoài một mặt phẳng cho trước có một và chỉ một mặt phẳng song song với mặt phẳng đã cho.
    *   *Hệ quả 1*: Nếu đường thẳng $d$ song song với mặt phẳng $(P)$ thì trong $(P)$ có duy nhất một đường thẳng song song với $d$ và qua một điểm $A \in (P)$ vẽ được duy nhất một đường thẳng song song với $d$.
    *   *Hệ quả 2*: Hai mặt phẳng phân biệt cùng song song với một mặt phẳng thứ ba thì song song với nhau.
*   **Định lí 3 (Tính chất giao tuyến)**: Nếu hai mặt phẳng $(\alpha)$ và $(\beta)$ song song với nhau thì mọi mặt phẳng $(\gamma)$ đã cắt $(\alpha)$ thì cũng cắt $(\beta)$ và hai giao tuyến của chúng song song với nhau.
    $$\begin{cases} (\alpha) \parallel (\beta) \\ (\gamma) \cap (\alpha) = a \\ (\gamma) \cap (\beta) = b \end{cases} \Rightarrow a \parallel b$$

### 3. Định lí Thalès trong không gian
*   **Định lí**: Ba mặt phẳng đôi một song song chắn trên hai cát tuyến bất kì những đoạn thẳng tương ứng tỉ lệ.
    $$\frac{AB}{A'B'} = \frac{BC}{B'C'} = \frac{AC}{A'C'}$$

### 4. Hình lăng trụ và hình hộp
*   **Hình lăng trụ**: Cho hai mặt phẳng song song $(\alpha)$ và $(\alpha')$. Trên $(\alpha)$ cho đa giác lồi $A_1A_2...A_n$. Qua các đỉnh $A_1, A_2, ..., A_n$ vẽ các đường thẳng song song cắt $(\alpha orbit')$ lần lượt tại $A'_1, A'_2, ..., A'_n$. Hình gồm hai đa giác $A_1A_2...A_n$, $A'_1A'_2...A'_n$ và các mặt bên là các tứ giác $A_1A_2A'_2A'_1$, $A_2A_3A'_3A'_2$, ..., $A_nA_1A'_1A'_n$ gọi là hình lăng trụ $A_1A_2...A_n.A'_1A'_2...A'_n$.
    *   **Hai đáy**: Đa giác $A_1A_2...A_n$ (đáy dưới) và đa giác $A'_1A'_2...A'_n$ (đáy trên) là hai đa giác song song và bằng nhau.
    *   **Các mặt bên**: Là các hình bình hành.
    *   **Các cạnh bên**: $A_1A'_1, A_2A'_2, ..., A_nA'_n$ là các đoạn thẳng song song và bằng nhau.
*   **Hình hộp**: Là hình lăng trụ có đáy là hình bình hành.
    *   Có 6 mặt đều là hình bình hành.
    *   Hai mặt không có cạnh chung gọi là **hai mặt đối diện** (song song và bằng nhau).
    *   Các đoạn thẳng nối hai đỉnh đối diện gọi là **đường chéo** (có 4 đường chéo cắt nhau tại trung điểm của mỗi đường).

---

## Bài 14: Phép chiếu song song

### 1. Định nghĩa phép chiếu song song
Cho mặt phẳng $(\alpha)$ và đường thẳng $\Delta$ cắt $(\alpha)$.
*   Với mỗi điểm $M$ trong không gian, ta xác định điểm $M'$ như sau:
    *   Nếu $M \in \Delta$ thì $M'$ là giao điểm của đường thẳng $\Delta$ và mặt phẳng $(\alpha)$.
    *   Nếu $M \notin \Delta$ thì $M'$ là giao điểm của đường thẳng qua $M$ song song với $\Delta$ và mặt phẳng $(\alpha)$.
*   Phép đặt tương ứng mỗi điểm $M$ trong không gian với hình chiếu $M'$ của nó trên $(\alpha)$ được gọi là **phép chiếu song song lên mặt phẳng $(\alpha)$ theo phương $\Delta$**.
    *   $(\alpha)$: Mặt phẳng chiếu.
    *   $\Delta$: Phương chiếu.
    *   $M'$: Hình chiếu song song của điểm $M$ qua phép chiếu trên.

### 2. Các tính chất của phép chiếu song song
*   **Tính chất 1**: Phép chiếu song song biến ba điểm thẳng hàng thành ba điểm thẳng hàng và không làm thay đổi thứ tự của ba điểm đó.
*   **Tính chất 2**: Phép chiếu song song biến đường thẳng thành đường thẳng, tia thành tia, đoạn thẳng thành đoạn thẳng.
*   **Tính chất 3**: Phép chiếu song song biến hai đường thẳng song song thành hai đường thẳng song song hoặc trùng nhau.
*   **Tính chất 4**: Phép chiếu song song giữ nguyên tỉ số độ dài của hai đoạn thẳng cùng nằm trên một đường thẳng hoặc nằm trên hai đường thẳng song song.

### 3. Hình biểu diễn của một hình không gian
Hình biểu diễn của một hình trong không gian là hình chiếu song song của hình đó trên một mặt phẳng theo một phương chiếu nào đó hoặc hình đồng dạng với hình chiếu đó.

**Quy tắc vẽ hình biểu diễn của các hình phẳng**:
*   **Tam giác**: Một tam giác bất kì (cân, đều, vuông) luôn được biểu diễn bằng một tam giác bất kì.
*   **Hình bình hành**: Một hình bình hành, hình chữ nhật, hình thoi, hình vuông luôn được biểu diễn bằng một hình bình hành bất kì.
*   **Hình tròn**: Luôn được biểu diễn bằng một hình elip.
*   **Hình thang**: Hình biểu diễn của một hình thang $ABCD$ ($AB \parallel CD$) là một hình thang $A'B'C'D'$ ($A'B' \parallel C'D'$) thỏa mãn tỉ số tỉ lệ:
    $$\frac{A'B'}{C'D'} = \frac{AB}{CD}$$

---

## Bảng so sánh các quan hệ song song trong không gian

| Loại quan hệ | Cách chứng minh cơ bản (Điều kiện) | Hệ quả / Tính chất giao tuyến tiêu biểu |
| :--- | :--- | :--- |
| **Đường thẳng $\parallel$ Đường thẳng** | Chứng minh cùng song song với đường thẳng thứ ba, hoặc sử dụng định lí ba đường giao tuyến. | Hệ quả định lí giao tuyến: hai mặt phẳng chứa hai đường thẳng song song thì cắt nhau theo giao tuyến song song với chúng. |
| **Đường thẳng $\parallel$ Mặt phẳng** | Chứng minh đường thẳng đó song song với một đường thẳng nằm trong mặt phẳng. | Nếu mặt phẳng chứa đường thẳng cắt mặt phẳng song song thì giao tuyến song song với đường thẳng ban đầu. |
| **Mặt phẳng $\parallel$ Mặt phẳng** | Chứng minh mặt phẳng này chứa hai đường thẳng cắt nhau cùng song song với mặt phẳng kia. | Nếu một mặt phẳng cắt hai mặt phẳng song song thì cắt theo hai giao tuyến song song với nhau. |
