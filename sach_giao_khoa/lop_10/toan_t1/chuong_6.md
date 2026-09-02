# SÁCH GIÁO KHOA TOÁN 10 - TẬP 1
## TỔNG HỢP KIẾN THỨC VÀ BÀI TẬP TRỌNG TÂM (CHƯƠNG I - CHƯƠNG V)

Tài liệu này tổng hợp toàn bộ lý thuyết, công thức, ví dụ minh họa và hệ thống câu hỏi trắc nghiệm cùng bài tập tự luận từ Chương I đến Chương V của Sách giáo khoa Toán 10 Tập 1 (Bộ sách Kết nối tri thức với cuộc sống).

---
---

# CHƯƠNG I: MỆNH ĐỀ VÀ TẬP HỢP

Chương này cung cấp những khái niệm và kí hiệu lôgic thường dùng, củng cố và mở rộng hiểu biết ban đầu về lí thuyết tập hợp đã được học ở các lớp dưới [5].

---

## BÀI 1: MỆNH ĐỀ

### 1. Mệnh đề, mệnh đề chứa biến

#### a) Mệnh đề
*   **Định nghĩa**: Những câu nói là những khẳng định có tính đúng hoặc sai được gọi là **mệnh đề** (gọi tắt là mệnh đề) [6].
*   **Quy tắc**:
    *   Mỗi mệnh đề phải hoặc đúng hoặc sai [6].
    *   Một mệnh đề không thể vừa đúng vừa sai [6].
    *   Những câu nghi vấn, câu cảm thán, câu cầu khiến **không phải là mệnh đề** [6].
*   *Ví dụ*:
    *   "Phương trình $3x^2 - 5x + 2 = 0$ có nghiệm nguyên" là một mệnh đề đúng [6].
    *   "Thời tiết hôm nay thật đẹp!" không phải là mệnh đề [6].

#### b) Mệnh đề chứa biến
*   **Định nghĩa**: Là những khẳng định chứa biến (ví dụ như biến $n$, $x$, $y$) mà tính đúng sai của chúng phụ thuộc vào giá trị cụ thể của biến đó [7].
*   *Ví dụ*: Câu "$n$ chia hết cho 2" (với $n$ là số tự nhiên) là một mệnh đề chứa biến [7].
    *   Với $n = 5$ ta được mệnh đề "$5$ chia hết cho 2" (Mệnh đề sai) [7].
    *   Với $n = 10$ ta được mệnh đề "$10$ chia hết cho 2" (Mệnh đề đúng) [7].

---

### 2. Mệnh đề phủ định
*   **Định nghĩa**: Để phủ định một mệnh đề $P$, ta thường thêm (hoặc bớt) từ "không" hoặc "không phải" vào trước vị ngữ của mệnh đề $P$. Kí hiệu mệnh đề phủ định của $P$ là $\overline{P}$ [7].
*   **Quy luật tính đúng sai**:
    *   Mệnh đề $P$ và mệnh đề phủ định $\overline{P}$ là hai phát biểu trái ngược nhau [7].
    *   Nếu $P$ đúng thì $\overline{P}$ sai [7].
    *   Nếu $P$ sai thì $\overline{P}$ đúng [7].
*   *Ví dụ*: Phủ định của mệnh đề $P$: "17 là số chính phương" là mệnh đề $\overline{P}$: "17 không phải là số chính phương" [7].

---

### 3. Mệnh đề kéo theo, mệnh đề đảo

#### a) Mệnh đề kéo theo
*   **Định nghĩa**: Mệnh đề "Nếu $P$ thì $Q$" được gọi là mệnh đề kéo theo và kí hiệu là $P \Rightarrow Q$ [8].
*   **Tính đúng sai**: Mệnh đề $P \Rightarrow Q$ **chỉ sai** khi $P$ đúng và $Q$ sai [8].
*   **Ứng dụng trong Toán học**: Các định lí toán học thường có dạng $P \Rightarrow Q$. Khi đó ta phát biểu:
    *   $P$ là **giả thiết**, $Q$ là **kết luận** của định lí [8].
    *   $P$ là **điều kiện đủ** để có $Q$ [8].
    *   $Q$ là **điều kiện cần** để có $P$ [8].

#### b) Mệnh đề đảo
*   **Định nghĩa**: Mệnh đề $Q \Rightarrow P$ được gọi là **mệnh đề đảo** của mệnh đề $P \Rightarrow Q$ [9].
*   *Lưu ý*: Mệnh đề đảo của một mệnh đề đúng không nhất thiết là đúng [9].

---

### 4. Mệnh đề tương đương
*   **Định nghĩa**: Mệnh đề "P nếu và chỉ nếu Q" (hoặc "P tương đương Q") được gọi là một **mệnh đề tương đương** và kí hiệu là $P \Leftrightarrow Q$ [9].
*   **Tính đúng sai**: Mệnh đề tương đương $P \Leftrightarrow Q$ đúng khi cả hai mệnh đề kéo theo $P \Rightarrow Q$ và $Q \Rightarrow P$ đều đúng [9].

---

### 5. Mệnh đề có chứa kí hiệu $\forall, \exists$
*   **Kí hiệu $\forall$**: Đọc là "với mọi" [10].
    *   Phát biểu "$\forall x \in M, P(x)$" đúng nếu với mọi $x \in M$, $P(x)$ đều đúng.
*   **Kí hiệu $\exists$**: Đọc là "tồn tại" (hoặc "có ít nhất một") [10].
    *   Phát biểu "$\exists x \in M, P(x)$" đúng nếu có ít nhất một $x \in M$ sao cho $P(x)$ đúng.
*   **Phủ định mệnh đề chứa $\forall, \exists$**:
    *   Phủ định của mệnh đề "$\forall x \in M, P(x)$" là "$\exists x \in M, \overline{P(x)}$" [10].
    *   Phủ định của mệnh đề "$\exists x \in M, P(x)$" là "$\forall x \in M, \overline{P(x)}$" [10].

---
---

## BÀI 2: TẬP HỢP VÀ CÁC PHÉP TOÁN TRÊN TẬP HỢP

### 1. Các khái niệm cơ bản về tập hợp

#### a) Tập hợp và cách mô tả tập hợp
*   **Kí hiệu**: $a \in S$ (phần tử $a$ thuộc tập hợp $S$); $a \notin S$ (phần tử $a$ không thuộc tập hợp $S$) [12].
*   **Hai cách mô tả tập hợp**:
    *   **Cách 1**: Liệt kê các phần tử của tập hợp (ví dụ: $A = \{0; 2; 4; 6\}$) [12].
    *   **Cách 2**: Chỉ ra tính chất đặc trưng cho các phần tử của tập hợp (ví dụ: $A = \{x \in \mathbb{N} \mid x < 7, x \text{ chẵn}\}$) [12].
*   **Tập rỗng**: Tập hợp không chứa phần tử nào được gọi là tập rỗng, kí hiệu là $\varnothing$ [12].

#### b) Tập hợp con
*   **Định nghĩa**: Nếu mọi phần tử của tập hợp $T$ đều là phần tử của tập hợp $S$ thì ta nói $T$ là một **tập hợp con (tập con)** của $S$ và viết là $T \subset S$ (đọc là $T$ chứa trong $S$ hoặc $T$ là tập con của $S$) [13].
*   **Biểu đồ Ven**: Người ta thường minh hoạ một tập hợp bằng một hình phẳng được bao quanh bởi một đường kín, gọi là biểu đồ Ven [13].
*   **Quy ước**: Tập rỗng $\varnothing$ là tập con của mọi tập hợp [13].

#### c) Hai tập hợp bằng nhau
*   **Định nghĩa**: Hai tập hợp $S$ và $T$ được gọi là bằng nhau nếu $S \subset T$ và $T \subset S$. Kí hiệu là $S = T$ [13, 14].

---

### 2. Các tập hợp số

#### a) Mối quan hệ giữa các tập hợp số
$$\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$$
*   Trong đó: $\mathbb{N}$ là tập hợp số tự nhiên, $\mathbb{Z}$ là tập hợp số nguyên, $\mathbb{Q}$ là tập hợp số hữu tỉ, $\mathbb{R}$ là tập hợp số thực [14, 15].

#### b) Các tập con thường dùng của $\mathbb{R}$
Dưới đây là bảng tổng hợp các tập con thường dùng của tập hợp số thực $\mathbb{R}$ (với $a, b \in \mathbb{R}, a < b$) [15]:

| Tên gọi | Kí hiệu và Định nghĩa | Hình ảnh biểu diễn trên trục số |
| :--- | :--- | :--- |
| **Khoảng** | $(a; b) = \{x \in \mathbb{R} \mid a < x < b\}$ | Khoảng giữa hai điểm $a$ và $b$ (bỏ hai đầu mút) |
| **Khoảng** | $(a; +\infty) = \{x \in \mathbb{R} \mid x > a\}$ | Phần trục số bên phải điểm $a$ |
| **Khoảng** | $(-\infty; b) = \{x \in \mathbb{R} \mid x < b\}$ | Phần trục số bên trái điểm $b$ |
| **Khoảng** | $(-\infty; +\infty) = \mathbb{R}$ | Toàn bộ trục số thực |
| **Đoạn** | $[a; b] = \{x \in \mathbb{R} \mid a \le x \le b\}$ | Đoạn gồm hai điểm $a, b$ và phần ở giữa |
| **Nửa khoảng** | $[a; b) = \{x \in \mathbb{R} \mid a \le x < b\}$ | Lấy đầu mút $a$, bỏ đầu mút $b$ |
| **Nửa khoảng** | $(a; b] = \{x \in \mathbb{R} \mid a < x \le b\}$ | Bỏ đầu mút $a$, lấy đầu mút $b$ |
| **Nửa khoảng** | $[a; +\infty) = \{x \in \mathbb{R} \mid x \ge a\}$ | Lấy đầu mút $a$ và phần bên phải |
| **Nửa khoảng** | $(-\infty; b] = \{x \in \mathbb{R} \mid x \le b\}$ | Lấy đầu mút $b$ and phần bên trái |

---

### 3. Các phép toán trên tập hợp

#### a) Giao của hai tập hợp
*   **Định nghĩa**: Tập hợp gồm các phần tử thuộc cả hai tập hợp $S$ và $T$ gọi là giao của hai tập hợp $S$ và $T$, kí hiệu là $S \cap T$ [16].
*   **Công thức**: $$S \cap T = \{x \mid x \in S \text{ và } x \in T\}$$ [16].

#### b) Hợp của hai tập hợp
*   **Định nghĩa**: Tập hợp gồm các phần tử thuộc tập hợp $S$ hoặc thuộc tập hợp $T$ gọi là hợp của hai tập hợp $S$ và $T$, kí hiệu là $S \cup T$ [16].
*   **Công thức**: $$S \cup T = \{x \mid x \in S \text{ hoặc } x \in T\}$$ [16].

#### c) Hiệu của hai tập hợp và phần bù
*   **Hiệu của hai tập hợp**: Hiệu của hai tập hợp $S$ và $T$ là tập hợp gồm các phần tử thuộc $S$ nhưng không thuộc $T$, kí hiệu là $S \setminus T$ [17].
    *   **Công thức**: $$S \setminus T = \{x \mid x \in S \text{ và } x \notin T\}$$ [17].
*   **Phần bù**: Khi $T \subset S$ thì hiệu $S \setminus T$ được gọi là **phần bù** của $T$ trong $S$, kí hiệu là $C_S T$ [17].

---
---

## BÀI TẬP CUỐI CHƯƠNG I

### Các dạng toán trọng tâm
1.  **Xét tính đúng sai của mệnh đề và lập mệnh đề phủ định** [19, 20].
2.  **Xác định tập hợp** bằng cách liệt kê hoặc nêu tính chất đặc trưng, tìm số tập con [19, 20].
3.  **Thực hiện các phép toán trên tập hợp** (Giao $\cap$, Hợp $\cup$, Hiệu $\setminus$, Phần bù $C$) đối với các tập hợp hữu hạn hoặc các tập con của $\mathbb{R}$ (khoảng, đoạn, nửa khoảng) [19, 20].
4.  **Giải toán ứng dụng thực tế bằng biểu đồ Ven** [19, 20]:
    *   *Công thức tính số phần tử của hợp hai tập hợp hữu hạn*: $$n(A \cup B) = n(A) + n(B) - n(A \cap B)$$ [18].


---
---

# CHƯƠNG II: BẤT PHƯƠNG TRÌNH VÀ HỆ BẤT PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN

Các bất phương trình bậc nhất hai ẩn và hệ bất phương trình bậc nhất hai ẩn xuất hiện trong nhiều bài toán kinh tế, như là những ràng buộc trong các bài toán sản xuất, bài toán phân phối hàng hoá,... Chương này cung cấp cách biểu diễn miền nghiệm của các bất phương trình và hệ bất phương trình bậc nhất hai ẩn trên mặt phẳng toạ độ [21].

---

## BÀI 3: BẤT PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN

### 1. Bất phương trình bậc nhất hai ẩn
*   **Định nghĩa**: Bất phương trình bậc nhất hai ẩn $x, y$ có dạng tổng quát là [22]:
    $$ax + by \le c \quad (\text{hoặc } ax + by \ge c, \; ax + by < c, \; ax + by > c)$$
    trong đó $a, b, c$ là những số thực đã cho, $a$ và $b$ không đồng thời bằng $0$, $x$ và $y$ là các ẩn số [22].
*   **Nghiệm**: Cặp số $(x_0; y_0)$ được gọi là một **nghiệm** của bất phương trình bậc nhất hai ẩn $ax + by \le c$ nếu bất đẳng thức $ax_0 + by_0 \le c$ đúng [22].
    *   Tương tự cho các bất phương trình dạng $ax+by \ge c$, $ax+by < c$, $ax+by > c$ [22].
*   *Ví dụ*:
    *   $2x + 3y < 1$ là một bất phương trình bậc nhất hai ẩn [22].
    *   $2x^2 + 3y < 1$ không phải là bất phương trình bậc nhất hai ẩn vì có chứa $x^2$ [22].
    *   Cặp số $(3; 4)$ là một nghiệm của $x + 2y > 5$ vì $3 + 2 \cdot 4 = 11 > 5$ (đúng) [22].
    *   Cặp số $(0; -1)$ không phải là nghiệm của $x + 2y > 5$ vì $0 + 2 \cdot (-1) = -2 > 5$ (sai) [22].
*   *Nhận xét*: Bất phương trình bậc nhất hai ẩn luôn có vô số nghiệm [22].

---

### 2. Biểu diễn miền nghiệm của bất phương trình bậc nhất hai ẩn trên mặt phẳng toạ độ
*   **Định nghĩa miền nghiệm**: Trong mặt phẳng toạ độ Oxy, tập hợp các điểm có toạ độ là nghiệm của bất phương trình $ax + by \le c$ được gọi là **miền nghiệm** của bất phương trình đó [23].
*   **Quy luật hình học**: Đường thẳng $d: ax + by = c$ chia mặt phẳng toạ độ Oxy thành hai nửa mặt phẳng bờ $d$ [23]:
    *   Một nửa mặt phẳng (không kể bờ $d$) gồm các điểm có toạ độ $(x; y)$ thoả mãn $ax + by > c$ [23].
    *   Nửa mặt phẳng còn lại (không kể bờ $d$) gồm các điểm có toạ độ $(x; y)$ thoả mãn $ax + by < c$ [23].
    *   Đường thẳng $d$ gồm các điểm có toạ độ $(x; y)$ thoả mãn $ax + by = c$ [23].

#### **Cách biểu diễn miền nghiệm của bất phương trình $ax + by \le c$**:
1.  **Bước 1**: Vẽ đường thẳng $d: ax + by = c$ trên mặt phẳng toạ độ Oxy [24].
2.  **Bước 2**: Lấy một điểm $M_0(x_0; y_0)$ không thuộc $d$ [24].
    *   *Mẹo*: Nếu $c \ne 0$, ta thường chọn gốc toạ độ $O(0; 0)$ để việc tính toán dễ dàng nhất [24].
    *   Nếu $c = 0$, ta thường chọn điểm $M_0(1; 0)$ hoặc $M_0(0; 1)$ [24].
3.  **Bước 3**: Tính $ax_0 + by_0$ và so sánh với $c$ [24]:
    *   Nếu $ax_0 + by_0 < c$ thì nửa mặt phẳng bờ $d$ chứa điểm $M_0$ là miền nghiệm của $ax + by \le c$ (kể cả bờ $d$) [24].
    *   Nếu $ax_0 + by_0 > c$ thì nửa mặt phẳng bờ $d$ không chứa điểm $M_0$ là miền nghiệm của $ax + by \le c$ (kể cả bờ $d$) [24].
4.  **Bước 4**: Gạch bỏ phần mặt phẳng không phải là miền nghiệm [23, 24].

*Lưu ý*: Với bất phương trình dạng $ax + by < c$ hoặc $ax + by > c$, ta thực hiện tương tự nhưng miền nghiệm không kể bờ $d$ (biểu diễn đường thẳng $d$ bằng **nét đứt**) [24].

---
---

## BÀI 4: HỆ BẤT PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN

### 1. Hệ bất phương trình bậc nhất hai ẩn
*   **Định nghĩa**: Hệ bất phương trình bậc nhất hai ẩn là một hệ gồm hai hay nhiều bất phương trình bậc nhất hai ẩn [25].
*   **Nghiệm**: Cặp số $(x_0; y_0)$ là nghiệm của một hệ bất phương trình bậc nhất hai ẩn khi $(x_0; y_0)$ đồng thời là nghiệm của tất cả các bất phương trình trong hệ đó [25].
*   *Ví dụ*: Hệ bất phương trình:
    $$\begin{cases} x \ge 0 \\ y \ge 0 \\ x + y \le 150 \end{cases}$$
    Cặp số $(x; y) = (0; 0)$ là một nghiệm của hệ này vì nó thoả mãn cả ba bất phương trình của hệ [26].

---

### 2. Biểu diễn miền nghiệm của hệ bất phương trình bậc nhất hai ẩn trên mặt phẳng toạ độ
*   **Định nghĩa**: Trong mặt phẳng toạ độ, miền nghiệm của hệ bất phương trình bậc nhất hai ẩn là phần mặt phẳng chứa các điểm thoả mãn đồng thời tất cả các bất phương trình trong hệ (tức là **giao của các miền nghiệm** của từng bất phương trình trong hệ) [26].

#### **Cách xác định miền nghiệm của một hệ**:
1.  Trên cùng một mặt phẳng toạ độ, xác định miền nghiệm của mỗi bất phương trình bậc nhất hai ẩn trong hệ và gạch bỏ miền còn lại [27].
2.  Miền không bị gạch là miền nghiệm của hệ bất phương trình đã cho [27].
*   *Ví dụ*: Miền nghiệm của hệ $\begin{cases} x \ge 0 \\ y \ge 0 \\ x + y \le 150 \end{cases}$ là miền tam giác $OAB$ (kể cả biên, ngoại trừ một số trường hợp cụ thể có nét đứt) [26, 27].

---

### 3. Ứng dụng của hệ bất phương trình bậc nhất hai ẩn (Bài toán tối ưu hoá)
Hệ bất phương trình bậc nhất hai ẩn thường được sử dụng để giải quyết các bài toán tối ưu hoá trong thực tế (lập kế hoạch sản xuất, kinh doanh, dinh dưỡng...) [21, 28].

*   **Giá trị lớn nhất và nhỏ nhất của biểu thức bậc nhất**:
    Cho biểu thức $F(x; y) = ax + by$ với $(x; y)$ là các điểm nằm trong miền đa giác $A_1A_2...A_n$ [28].
    *   *Định lí*: Giá trị lớn nhất (hoặc nhỏ nhất) của biểu thức $F(x; y) = ax + by$ đạt được tại một trong các đỉnh của đa giác đó [28].
*   **Các bước giải bài toán tối ưu hóa**:
    *   **Bước 1**: Thiết lập hệ bất phương trình bậc nhất hai ẩn biểu diễn các điều kiện ràng buộc thực tế và biểu thức $F(x; y) = ax + by$ cần tối ưu (ví dụ: lợi nhuận tối đa hoặc chi phí tối thiểu) [28].
    *   **Bước 2**: Xác định miền nghiệm của hệ bất phương trình này (thường là một miền đa giác $A_1A_2...A_n$) [28].
    *   **Bước 3**: Tìm toạ độ các đỉnh $A_1, A_2, ..., A_n$ của đa giác [28].
    *   **Bước 4**: Tính giá trị của biểu thức $F(x; y)$ tại tất cả các đỉnh này [28].
    *   **Bước 5**: So sánh các giá trị vừa tính để tìm ra giá trị lớn nhất hoặc nhỏ nhất và đưa ra kết luận kinh tế/thực tế [28].

---
---

## BÀI TẬP CUỐI CHƯƠNG II

### A - TRẮC NGHIỆM
Các câu hỏi trắc nghiệm cuối chương tập trung vào [30]:
*   Nhận diện bất phương trình/hệ bất phương trình bậc nhất hai ẩn (Loại trừ các phương trình bậc hai hoặc chứa tích ẩn $xy$) [30].
*   Xác định cặp số là nghiệm hoặc không là nghiệm của bất phương trình/hệ bất phương trình [30].
*   Xác định miền nghiệm tương ứng từ hình vẽ biểu diễn cho trước [30].

### B - TỰ LUẬN
Các bài tập tự luận yêu cầu [31, 32]:
*   Biểu diễn miền nghiệm của các bất phương trình và hệ bất phương trình bậc nhất hai ẩn trên hệ trục toạ độ Oxy [31].
*   Tìm giá trị lớn nhất, giá trị nhỏ nhất của biểu thức trên một miền nghiệm cho trước [31].
*   Giải quyết bài toán thực tế phức tạp:
    *   *Bài toán tài chính & đầu tư*: Phân bổ vốn đầu tư vào các loại trái phiếu khác nhau với lãi suất và mức độ rủi ro khác nhau sao cho lợi nhuận thu được sau một năm là lớn nhất [31, 32].
    *   *Bài toán quảng cáo*: Thiết lập thời gian quảng cáo trên đài phát thanh và truyền hình với chi phí định trước sao cho tiếp cận được số lượng khán giả tối đa [32].
    *   *Bài toán sản xuất*: Tính toán số lượng máy móc thiết bị cần nhập khẩu (ví dụ máy điều hoà hai chiều và một chiều) thoả mãn nhu cầu thị trường và giới hạn nguồn vốn để đạt lợi nhuận lớn nhất [28, 29].
    *   *Bài toán dinh dưỡng*: Xác định khối lượng thực phẩm cần mua hằng ngày để đảm bảo cung cấp đủ lượng protein và lipid cần thiết với chi phí tối thiểu [29].


---
---

# CHƯƠNG III: HỆ THỨC LƯỢNG TRONG TAM GIÁC

Chương này mở rộng khái niệm tỉ số lượng giác của một góc nhọn đã học ở lớp 9 sang các góc bất kì từ $0^\circ$ đến $180^\circ$ và giới thiệu các hệ thức lượng cơ bản trong tam giác, bao gồm định lí côsin, định lí sin, và các công thức tính diện tích tam giác để ứng dụng vào giải tam giác và đo đạc thực tế [32, 37].

---

## BÀI 5: GIÁ TRỊ LƯỢNG GIÁC CỦA MỘT GÓC TỪ $0^\circ$ ĐẾN $180^\circ$

### 1. Định nghĩa giá trị lượng giác
*   **Nửa đường tròn đơn vị**: Trong mặt phẳng toạ độ $Oxy$, nửa đường tròn tâm $O$, bán kính $R = 1$ nằm phía trên trục hoành (kể cả hai điểm trên trục hoành) được gọi là **nửa đường tròn đơn vị** [33].
*   Với mỗi góc $\alpha$ ($0^\circ \le \alpha \le 180^\circ$), có duy nhất điểm $M(x_0; y_0)$ trên nửa đường tròn đơn vị sao cho $\widehat{xOM} = \alpha$ [33]. Khi đó:
    *   **sin** của góc $\alpha$ là tung độ $y_0$ của điểm $M$, kí hiệu là $\sin \alpha$ [33].
    *   **côsin** (cos) của góc $\alpha$ là hoành độ $x_0$ của điểm $M$, kí hiệu là $\cos \alpha$ [33].
    *   **tang** (tan) của góc $\alpha$ là $\frac{y_0}{x_0}$ (với $\alpha \neq 90^\circ$ hay $x_0 \neq 0$), kí hiệu là $\tan \alpha = \frac{\sin \alpha}{\cos \alpha}$ [33].
    *   **côtang** (cot) của góc $\alpha$ là $\frac{x_0}{y_0}$ (với $\alpha \neq 0^\circ$ và $\alpha \neq 180^\circ$ hay $y_0 \neq 0$), kí hiệu là $\cot \alpha = \frac{\cos \alpha}{\sin \alpha}$ [33].

*   **Bảng giá trị lượng giác của một số góc đặc biệt**:

| $\alpha$ | $0^\circ$ | $30^\circ$ | $45^\circ$ | $60^\circ$ | $90^\circ$ | $180^\circ$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$\sin \alpha$** | $0$ | $\frac{1}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{\sqrt{3}}{2}$ | $1$ | $0$ |
| **$\cos \alpha$** | $1$ | $\frac{\sqrt{3}}{2}$ | $\frac{\sqrt{2}}{2}$ | $\frac{1}{2}$ | $0$ | $-1$ |
| **$\tan \alpha$** | $0$ | $\frac{\sqrt{3}}{3}$ | $1$ | $\sqrt{3}$ | $||$ | $0$ |
| **$\cot \alpha$** | $||$ | $\sqrt{3}$ | $1$ | $\frac{\sqrt{3}}{3}$ | $0$ | $||$ |

*(Kí hiệu $||$ chỉ giá trị lượng giác tương ứng không xác định)* [33]

---

### 2. Mối quan hệ giữa các giá trị lượng giác của hai góc bù nhau
Với mọi góc $\alpha$ thoả mãn $0^\circ \le \alpha \le 180^\circ$, ta luôn có:
*   $\sin(180^\circ - \alpha) = \sin \alpha$ [35]
*   $\cos(180^\circ - \alpha) = -\cos \alpha$ [35]
*   $\tan(180^\circ - \alpha) = -\tan \alpha$ ($\alpha \neq 90^\circ$) [35]
*   $\cot(180^\circ - \alpha) = -\cot \alpha$ ($0^\circ < \alpha < 180^\circ$) [35]

*Ý nghĩa hình học*: Hai góc bù nhau có sin bằng nhau; có côsin, tang, côtang đối nhau [35].

---

### 3. Các hệ thức lượng giác cơ bản
*   $\sin^2 \alpha + \cos^2 \alpha = 1$ ($0^\circ \le \alpha \le 180^\circ$) [36]
*   $1 + \tan^2 \alpha = \frac{1}{\cos^2 \alpha}$ ($\alpha \neq 90^\circ$) [36]
*   $1 + \cot^2 \alpha = \frac{1}{\sin^2 \alpha}$ ($0^\circ < \alpha < 180^\circ$) [36]
*   $\tan \alpha \cdot \cot \alpha = 1$ ($\alpha \notin \{0^\circ; 90^\circ; 180^\circ\}$) [33]

---
---

## BÀI 6: HỆ THỨC LƯỢNG TRONG TAM GIÁC

Kí hiệu đối với tam giác $ABC$:
*   $A, B, C$ là các góc của tam giác tại các đỉnh tương ứng [37].
*   $a, b, c$ tương ứng là độ dài của các cạnh đối diện với đỉnh $A, B, C$ [37].
*   $h_a, h_b, h_c$ lần lượt là độ dài đường cao kẻ từ các đỉnh $A, B, C$.
*   $p$ là nửa chu vi của tam giác ($p = \frac{a+b+c}{2}$) [37, 40].
*   $S$ là diện tích tam giác [37].
*   $R$ và $r$ tương ứng là bán kính đường tròn ngoại tiếp và nội tiếp tam giác [37].

### 1. Định lí côsin
Trong tam giác $ABC$:
$$a^2 = b^2 + c^2 - 2bc \cos A$$ [38]
$$b^2 = a^2 + c^2 - 2ac \cos B$$ [38]
$$c^2 = a^2 + b^2 - 2ab \cos C$$ [38]

*   **Hệ quả (Công thức tính góc)**:
    $$\cos A = \frac{b^2 + c^2 - a^2}{2bc}$$ [38]
    $$\cos B = \frac{a^2 + c^2 - b^2}{2ac}$$ [38]
    $$\cos C = \frac{a^2 + b^2 - c^2}{2ab}$$ [38]

---

### 2. Định lí sin
Trong tam giác $ABC$:
$$\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R$$ [38]

---

### 3. Công thức tính diện tích tam giác
Diện tích $S$ của tam giác $ABC$ được tính theo các công thức sau:
1.  **Công thức đường cao cơ bản**:
    $$S = \frac{1}{2} a h_a = \frac{1}{2} b h_b = \frac{1}{2} c h_c$$ [40]
2.  **Công thức tích hai cạnh và sin của góc xen giữa**:
    $$S = \frac{1}{2} bc \sin A = \frac{1}{2} ca \sin B = \frac{1}{2} ab \sin C$$ [40]
3.  **Công thức liên quan đến bán kính đường tròn ngoại tiếp**:
    $$S = \frac{abc}{4R}$$ [40]
4.  **Công thức liên quan đến bán kính đường tròn nội tiếp**:
    $$S = pr$$  (với $p = \frac{a+b+c}{2}$) [40]
5.  **Công thức Heron**:
    $$S = \sqrt{p(p-a)(p-b)(p-c)}$$ [40]

---

### 4. Giải tam giác và ứng dụng thực tế
*   **Giải tam giác**: Là tìm độ dài các cạnh và số đo các góc còn lại của tam giác khi biết một số yếu tố cho trước [39].
*   **Các trường hợp giải tam giác cơ bản**:
    *   Biết hai cạnh và góc xen giữa (Sử dụng định lí côsin để tìm cạnh thứ ba, sau đó tìm các góc còn lại) [39].
    *   Biết ba cạnh (Sử dụng hệ quả định lí côsin để tính các góc) [39].
    *   Biết một cạnh và hai góc kề (Sử dụng định lí sin) [39].
*   **Ứng dụng thực tế**: Sử dụng các định lí và hệ thức lượng để tính khoảng cách giữa hai điểm không thể tới trực tiếp (ví dụ: tính khoảng cách từ vị trí $A$ trên bờ đến chân tháp $C$ trên đảo nhỏ giữa hồ Hoàn Kiếm, chiều cao của một toà nhà, hay khoảng cách giữa hai đỉnh núi) [37, 39, 40].

---
---

## BÀI TẬP CUỐI CHƯƠNG III

### 1. Câu hỏi trắc nghiệm minh hoạ
*   **Ví dụ 1**: Cho tam giác $ABC$ có $\widehat{B} = 135^\circ$. Khi đó diện tích tam giác tính theo công thức nào? Đáp án đúng là $S = \frac{\sqrt{2}}{4}ac$ (do $S = \frac{1}{2}ac\sin 135^\circ = \frac{\sqrt{2}}{4}ac$) [43].
*   **Ví dụ 2**: Công thức liên quan diện tích và bán kính ngoại tiếp: $S = \frac{abc}{4R}$ hoặc $R = \frac{abc}{4S}$ [43].

### 2. Bài tập tự luận luyện tập
*   **Bài tập tính toán biểu thức lượng giác**: Tính giá trị biểu thức không dùng máy tính:
    *   $M = \sin 45^\circ \cdot \cos 45^\circ + \sin 30^\circ$ [43].
    *   $N = \sin 60^\circ \cdot \cos 30^\circ + \frac{1}{2} \sin 45^\circ \cdot \cos 45^\circ$ [43].
*   **Bài tập giải tam giác**: Cho tam giác $ABC$ có $\widehat{B} = 60^\circ, \widehat{C} = 45^\circ, AC = 10$. Tính các cạnh còn lại, bán kính $R, r$ và diện tích $S$ [43].
*   **Bài tập chứng minh hệ thức lượng**:
    *   Chứng minh hệ thức trung tuyến: $MA^2 = \frac{2(AB^2 + AC^2) - BC^2}{4}$ với $M$ là trung điểm của $BC$ [43].
    *   Chứng minh tính chất góc dựa trên độ dài cạnh:
        *   Nếu góc $A$ nhọn thì $b^2 + c^2 > a^2$ [43].
        *   Nếu góc $A$ tù thì $b^2 + c^2 < a^2$ [43].
        *   Nếu góc $A$ vuông thì $b^2 + c^2 = a^2$ [43].


---
---

# CHƯƠNG IV: VECTƠ

Chương này cung cấp các khái niệm nền tảng về vectơ, các phép toán trên vectơ trong mặt phẳng và hệ tọa độ, giúp học sinh giải quyết các bài toán hình học và các ứng dụng thực tế trong vật lí [45, 46].

---

## BÀI 7: CÁC KHÁI NIỆM MỞ ĐẦU

### 1. Định nghĩa vectơ và độ dài của vectơ

*   **Định nghĩa**: **Vectơ** là một đoạn thẳng có hướng, nghĩa là trong hai điểm mút của đoạn thẳng đã chỉ rõ điểm đầu và điểm cuối [46].
    *   Vectơ có điểm đầu là $A$ và điểm cuối là $B$ được kí hiệu là $\overrightarrow{AB}$ (đọc là "vectơ AB") [46].
    *   Vectơ còn có thể kí hiệu ngắn gọn là $\vec{a}, \vec{b}, \vec{x}, \vec{y}, ...$ [46].
*   **Độ dài của vectơ**: Là khoảng cách giữa điểm đầu và điểm cuối của vectơ đó [46].
    *   Độ dài của vectơ $\overrightarrow{AB}$ được kí hiệu là $|\overrightarrow{AB}|$, nghĩa là $|\overrightarrow{AB}| = AB$ [46].
    *   Độ dài của vectơ $\vec{a}$ được kí hiệu là $|\vec{a}|$ [46].

### 2. Hai vectơ cùng phương, cùng hướng, bằng nhau

#### a) Giá và phương của vectơ
*   **Giá của vectơ**: Đường thẳng đi qua điểm đầu và điểm cuối của một vectơ được gọi là **giá** của vectơ đó [47].
*   **Vectơ cùng phương**: Hai vectơ được gọi là **cùng phương** nếu giá của chúng song song hoặc trùng nhau [47].
    *   *Hệ quả*: Hai vectơ cùng phương chỉ có thể **cùng hướng** hoặc **ngược hướng** [47].

#### b) Hai vectơ bằng nhau
*   **Định nghĩa**: Hai vectơ $\vec{a}$ và $\vec{b}$ được gọi là **bằng nhau** nếu chúng có cùng độ dài và cùng hướng. Kí hiệu là $\vec{a} = \vec{b}$ [47].
*   *Lưu ý*: Khi cho trước một điểm $O$ và một vectơ $\vec{a}$, luôn có duy nhất một điểm $A$ sao cho $\overrightarrow{OA} = \vec{a}$ [47].

#### c) Vectơ-không
*   **Định nghĩa**: Vectơ-không là vectơ có điểm đầu và điểm cuối trùng nhau [47]. Kí hiệu là $\vec{0}$ (ví dụ: $\overrightarrow{AA}, \overrightarrow{BB}, ...$) [47, 48].
*   **Tính chất**:
    *   Độ dài của vectơ-không bằng 0, tức là $|\vec{0}| = 0$ [47].
    *   Quy ước: Vectơ $\vec{0}$ cùng phương và cùng hướng với mọi vectơ [47, 48].

---

## BÀI 8: TỔNG VÀ HIỆU CỦA HAI VECTƠ

### 1. Tổng của hai vectơ

*   **Định nghĩa**: Cho hai vectơ $\vec{a}$ và $\vec{b}$. Lấy một điểm $A$ tùy ý, vẽ $\overrightarrow{AB} = \vec{a}$ và $\overrightarrow{BC} = \vec{b}$. Vectơ $\overrightarrow{AC}$ được gọi là **tổng** của hai vectơ $\vec{a}$ và $\vec{b}$. Kí hiệu là $\vec{a} + \vec{b}$ [51].
*   **Quy tắc ba điểm**: Với ba điểm $A, B, C$ bất kì, ta luôn có:
    $$\overrightarrow{AB} + \overrightarrow{BC} = \overrightarrow{AC}$$ [51, 52]
*   **Quy tắc hình bình hành**: Nếu $ABCD$ là một hình bình hành, ta luôn có:
    $$\overrightarrow{AB} + \overrightarrow{AD} = \overrightarrow{AC}$$ [51, 52]
*   **Tính chất của phép cộng vectơ**: Với ba vectơ $\vec{a}, \vec{b}, \vec{c}$ tùy ý, ta có:
    *   Tính chất giao hoán: $\vec{a} + \vec{b} = \vec{b} + \vec{a}$ [51, 52].
    *   Tính chất kết hợp: $(\vec{a} + \vec{b}) + \vec{c} = \vec{a} + (\vec{b} + \vec{c})$ [51, 52].
    *   Cộng với vectơ-không: $\vec{a} + \vec{0} = \vec{0} + \vec{a} = \vec{a}$ [51, 52].

### 2. Hiệu của hai vectơ

*   **Vectơ đối**: Vectơ có cùng độ dài nhưng ngược hướng với vectơ $\vec{a}$ được gọi là **vectơ đối** của $\vec{a}$, kí hiệu là $-\vec{a}$ [51, 52].
    *   $\vec{a} + (-\vec{a}) = \vec{0}$ [52].
    *   Vectơ đối của $\vec{0}$ là chính nó, tức là $-\vec{0} = \vec{0}$ [52].
*   **Phép trừ vectơ**: Hiệu của hai vectơ $\vec{a}$ và $\vec{b}$ là tổng của $\vec{a}$ với vectơ đối của $\vec{b}$:
    $$\vec{a} - \vec{b} = \vec{a} + (-\vec{b})$$ [52]
*   **Quy tắc hiệu (Quy tắc ba điểm đối với phép trừ)**: Với ba điểm $O, A, B$ bất kì, ta luôn có:
    $$\overrightarrow{AB} = \overrightarrow{OB} - \overrightarrow{OA}$$ [52]

### 3. Tính chất trung điểm và trọng tâm

*   **Tính chất trung điểm**: Điểm $I$ là trung điểm của đoạn thẳng $AB$ khi và chỉ khi:
    $$\overrightarrow{IA} + \overrightarrow{IB} = \vec{0}$$ [52]
*   **Tính chất trọng tâm**: Điểm $G$ là trọng tâm của tam giác $ABC$ khi và chỉ khi:
    $$\overrightarrow{GA} + \overrightarrow{GB} + \overrightarrow{GC} = \vec{0}$$ [52]

---

## BÀI 9: TÍCH CỦA MỘT VECTƠ VỚI MỘT SỐ

### 1. Định nghĩa và tính chất

*   **Định nghĩa**: Tích của một vectơ $\vec{a} \neq \vec{0}$ với một số thực $k \neq 0$ là một vectơ, kí hiệu là $k\vec{a}$, được xác định như sau [55]:
    *   Độ dài: $|k\vec{a}| = |k| \cdot |\vec{a}|$ [55].
    *   Hướng: Cùng hướng với $\vec{a}$ nếu $k > 0$, ngược hướng với $\vec{a}$ nếu $k < 0$ [55].
    *   *Quy ước*: $k\vec{0} = \vec{0}$ và $0\vec{a} = \vec{0}$ [55].
*   **Các tính chất**: Với các số thực $k, t$ và các vectơ $\vec{a}, \vec{b}$ bất kì, ta có [56, 57]:
    *   $k(\vec{a} + \vec{b}) = k\vec{a} + k\vec{b}$
    *   $(k + t)\vec{a} = k\vec{a} + t\vec{a}$
    *   $(kt)\vec{a} = k(t\vec{a})$
    *   $1\vec{a} = \vec{a}$ và $(-1)\vec{a} = -\vec{a}$

### 2. Các hệ thức vectơ quan trọng

*   **Hệ thức trung điểm**: Với $I$ là trung điểm của $AB$, mọi điểm $O$ bất kì đều thỏa mãn:
    $$\overrightarrow{OA} + \overrightarrow{OB} = 2\overrightarrow{OI}$$ [56, 57]
*   **Hệ thức trọng tâm**: Với $G$ là trọng tâm của tam giác $ABC$, mọi điểm $O$ bất kì đều thỏa mãn:
    $$\overrightarrow{OA} + \overrightarrow{OB} + \overrightarrow{OC} = 3\overrightarrow{OG}$$ [57]

### 3. Điều kiện cùng phương và phân tích vectơ

*   **Điều kiện cùng phương**: Hai vectơ $\vec{a}$ and $\vec{b}$ (với $\vec{a} \neq \vec{0}$) cùng phương khi và chỉ khi tồn tại một số thực $k$ duy nhất sao cho $\vec{b} = k\vec{a}$ [55, 56].
*   **Ba điểm thẳng hàng**: Ba điểm phân biệt $A, B, C$ thẳng hàng khi và chỉ khi có số thực $k \neq 0$ sao cho:
    $$\overrightarrow{AB} = k\overrightarrow{AC}$$ [56]
*   **Phân tích (biểu diễn) một vectơ theo hai vectơ không cùng phương**: Cho hai vectơ không cùng phương $\vec{a}$ và $\vec{b}$. Mọi vectơ $\vec{u}$ luôn có thể biểu diễn duy nhất dưới dạng:
    $$\vec{u} = x\vec{a} + y\vec{b}$$
    trong đó $x, y$ là các số thực duy nhất [56, 57].

---

## BÀI 10: VECTƠ TRONG MẶT PHẲNG TỌA ĐỘ

### 1. Hệ trục tọa độ và tọa độ của vectơ

*   **Hệ trục tọa độ $Oxy$**: Gồm hai trục tọa độ vuông góc $Ox$ (trục hoành) và $Oy$ (trục tung) chung gốc $O$ [60].
    *   Các vectơ đơn vị tương ứng trên các trục là $\vec{i}$ và $\vec{j}$ vuông góc với nhau và có độ dài bằng 1 ($|\vec{i}| = |\vec{j}| = 1$) [60].
*   **Tọa độ của vectơ**: Với mỗi vectơ $\vec{u}$ trên mặt phẳng tọa độ, tồn tại duy nhất cặp số $(x; y)$ sao cho:
    $$\vec{u} = x\vec{i} + y\vec{j}$$
    Cặp số $(x; y)$ được gọi là **tọa độ** của vectơ $\vec{u}$, kí hiệu là $\vec{u} = (x; y)$ hoặc $\vec{u}(x; y)$ [60, 61].
    *   $x$ được gọi là **hoành độ**, $y$ được gọi là **tung độ** của vectơ $\vec{u}$ [60, 61].
*   **Độ dài của vectơ**: Nếu $\vec{u} = (x; y)$ thì độ dài của $\vec{u}$ là:
    $$|\vec{u}| = \sqrt{x^2 + y^2}$$ [61]
*   **Hai vectơ bằng nhau**: Cho $\vec{u} = (x; y)$ và $\vec{v} = (x'; y')$, ta có:
    $$\vec{u} = \vec{v} \Leftrightarrow \begin{cases} x = x' \\ y = y' \end{cases}$$ [60, 61]

### 2. Tọa độ của điểm và liên hệ vectơ

*   **Tọa độ điểm**: Tọa độ của điểm $M$ chính là tọa độ của vectơ $\overrightarrow{OM}$ [60, 61]. Kí hiệu $M(x_M; y_M) \Leftrightarrow \overrightarrow{OM} = (x_M; y_M)$ [60, 61].
*   **Tọa độ của vectơ $\overrightarrow{AB}$**: Cho hai điểm $A(x_A; y_A)$ và $B(x_B; y_B)$, ta có:
    $$\overrightarrow{AB} = (x_B - x_A; y_B - y_A)$$ [61, 62]
*   **Khoảng cách giữa hai điểm (Độ dài đoạn thẳng)**:
    $$AB = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$$ [62]

### 3. Biểu thức tọa độ của các phép toán vectơ

Cho hai vectơ $\vec{u} = (x; y)$, $\vec{v} = (x'; y')$ and số thực $k$, ta có [61]:
*   $\vec{u} + \vec{v} = (x + x'; y + y')$
*   $\vec{u} - \vec{v} = (x - x'; y - y')$
*   $k\vec{u} = (kx; ky)$
*   **Điều kiện cùng phương**: Vectơ $\vec{v}(x'; y')$ cùng phương với $\vec{u}(x; y) \neq \vec{0}$ khi và chỉ khi tồn tại số thực $k$ sao cho $x' = kx$ và $y' = ky$ [61].
    *(Nếu $x \neq 0, y \neq 0$ thì hai vectơ cùng phương khi và chỉ khi $\frac{x'}{x} = \frac{y'}{y}$)*.

### 4. Tọa độ trung điểm và trọng tâm

*   **Trung điểm $I$ của đoạn thẳng $AB$**:
    $$x_I = \frac{x_A + x_B}{2}, \quad y_I = \frac{y_A + y_B}{2}$$ [63]
*   **Trọng tâm $G$ của tam giác $ABC$**:
    $$x_G = \frac{x_A + x_B + x_C}{3}, \quad y_G = \frac{y_A + y_B + y_C}{3}$$ [63]

---

## BÀI 11: TÍCH VÔ HƯỚNG CỦA HAI VECTƠ

### 1. Góc giữa hai vectơ

*   **Định nghĩa**: Cho hai vectơ $\vec{u}$ và $\vec{v}$ khác $\vec{0}$. Từ một điểm $A$ tùy ý, vẽ $\overrightarrow{AB} = \vec{u}$ và $\overrightarrow{AC} = \vec{v}$. Góc $\widehat{BAC}$ (với $0^\circ \le \widehat{BAC} \le 180^\circ$) được gọi là **góc giữa hai vectơ** $\vec{u}$ và $\vec{v}$, kí hiệu là $(\vec{u}, \vec{v})$ [65, 66].
*   **Các trường hợp đặc biệt**:
    *   Nếu $(\vec{u}, \vec{v}) = 90^\circ$, ta nói hai vectơ vuông góc với nhau. Kí hiệu $\vec{u} \perp \vec{v}$ [66].
    *   Nếu $\vec{u}$ và $\vec{v}$ cùng hướng thì $(\vec{u}, \vec{v}) = 0^\circ$ [66].
    *   Nếu $\vec{u}$ và $\vec{v}$ ngược hướng thì $(\vec{u}, \vec{v}) = 180^\circ$ [66].

### 2. Tích vô hướng của hai vectơ

*   **Định nghĩa**: Tích vô hướng của hai vectơ $\vec{u}$ và $\vec{v}$ khác $\vec{0}$ là một **số** thực, kí hiệu là $\vec{u} \cdot \vec{v}$ (hoặc viết đơn giản là $\vec{u}\vec{v}$), được xác định bởi công thức [66]:
    $$\vec{u} \cdot \vec{v} = |\vec{u}| \cdot |\vec{v}| \cdot \cos(\vec{u}, \vec{v})$$
*   *Quy ước*: Nếu ít nhất một trong hai vectơ là $\vec{0}$ thì $\vec{u} \cdot \vec{v} = 0$ [66].
*   **Bình phương vô hướng**: Tích vô hướng của vectơ $\vec{u}$ với chính nó $\vec{u} \cdot \vec{u}$ được kí hiệu là $\vec{u}^2$ (gọi là bình phương vô hướng) [66]. Ta có:
    $$\vec{u}^2 = |\vec{u}|^2 \implies |\vec{u}| = \sqrt{\vec{u}^2}$$ [66]
*   **Điều kiện vuông góc**: Với hai vectơ khác $\vec{0}$ [66]:
    $$\vec{u} \perp \vec{v} \Leftrightarrow \vec{u} \cdot \vec{v} = 0$$
*   **Các tính chất**: Với ba vectơ $\vec{u}, \vec{v}, \vec{w}$ bất kì và số thực $k$, ta có [67, 68]:
    *   $\vec{u} \cdot \vec{v} = \vec{v} \cdot \vec{u}$ (giao hoán)
    *   $\vec{u} \cdot (\vec{v} + \vec{w}) = \vec{u} \cdot \vec{v} + \vec{u} \cdot \vec{w}$ (phân phối)
    *   $(k\vec{u}) \cdot \vec{v} = k(\vec{u} \cdot \vec{v}) = \vec{u} \cdot (k\vec{v})$
*   **Hệ quả (Các hằng đẳng thức đáng nhớ)**:
    *   $(\vec{u} + \vec{v})^2 = \vec{u}^2 + 2\vec{u}\vec{v} + \vec{v}^2$ [68]
    *   $(\vec{u} - \vec{v})^2 = \vec{u}^2 - 2\vec{u}\vec{v} + \vec{v}^2$ [68]
    *   $(\vec{u} - \vec{v})(\vec{u} + \vec{v}) = \vec{u}^2 - \vec{v}^2$ [68]

### 3. Biểu thức tọa độ của tích vô hướng

Cho hai vectơ $\vec{u} = (x; y)$ và $\vec{v} = (x'; y')$, ta có [67, 68]:
*   **Công thức tích vô hướng**:
    $$\vec{u} \cdot \vec{v} = xx' + yy'$$
*   **Tính vuông góc**:
    $$\vec{u} \perp \vec{v} \Leftrightarrow xx' + yy' = 0$$
*   **Góc giữa hai vectơ (Tính cosin)**:
    $$\cos(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{|\vec{u}| \cdot |\vec{v}|} = \frac{xx' + yy'}{\sqrt{x^2 + y^2} \cdot \sqrt{x'^2 + y'^2}} \quad (\vec{u}, \vec{v} \neq \vec{0})$$

---

## BÀI TẬP ÔN TẬP CUỐI CHƯƠNG IV

### 1. Câu hỏi trắc nghiệm minh họa tiêu biểu

*   **Câu 1 (Cùng phương)**: Cặp vectơ nào sau đây cùng phương? [71]
    *   A. $\vec{u} = (2;3)$ và $\vec{v} = (\frac{1}{2}; 6)$.
    *   B. $\vec{a} = (\sqrt{2}; 6)$ và $\vec{b} = (1; 3\sqrt{2})$.
    *   *Đáp án*: **B** (vì $\vec{a} = \sqrt{2} \vec{b}$).
*   **Câu 2 (Vuông góc)**: Cặp vectơ nào vuông góc với nhau? [71]
    *   A. $\vec{a} = (1;-1)$ và $\vec{b} = (-1;1)$.
    *   B. $\vec{z} = (a; b)$ và $\vec{t} = (-b; a)$.
    *   *Đáp án*: **B** (vì $\vec{z} \cdot \vec{t} = a(-b) + ba = 0$).
*   **Câu 3 (Độ dài bằng 1)**: Vectơ nào sau đây là vectơ đơn vị (độ dài bằng 1)? [71]
    *   A. $\vec{a} = (1;1)$.
    *   B. $\vec{d} = \left(\frac{1}{\sqrt{2}}; \frac{-1}{\sqrt{2}}\right)$.
    *   *Đáp án*: **B** (vì $|\vec{d}| = \sqrt{(\frac{1}{\sqrt{2}})^2 + (\frac{-1}{\sqrt{2}})^2} = 1$).
*   **Câu 4 (Tính góc)**: Góc giữa hai vectơ $\vec{a} = (1;-1)$ và $\vec{b} = (-2;0)$ là bao nhiêu? [71]
    *   A. $45^\circ$.
    *   B. $135^\circ$.
    *   *Đáp án*: **B** (vì $\cos(\vec{a}, \vec{b}) = \frac{1(-2) + (-1)0}{\sqrt{2}\sqrt{4}} = -\frac{1}{\sqrt{2}} \implies 135^\circ$).

### 2. Các dạng toán tự luận trọng tâm

*   **Dạng 1: Chứng minh đẳng thức vectơ**
    *   *Ví dụ*: Cho hình bình hành $ABCD$. Chứng minh với mọi điểm $M$, ta có:
        $$\overrightarrow{MA} + \overrightarrow{MC} = \overrightarrow{MB} + \overrightarrow{MD}$$ [71]
        *Giải*: Biến đổi đẳng thức về dạng hiệu: $\overrightarrow{MA} - \overrightarrow{MB} = \overrightarrow{MD} - \overrightarrow{MC} \Leftrightarrow \overrightarrow{BA} = \overrightarrow{CD}$ (đúng vì $ABCD$ là hình bình hành).
*   **Dạng 2: Phân tích vectơ**
    *   *Ví dụ*: Trên cạnh $BC$ của tam giác $ABC$ lấy điểm $M$ sao cho $MB = 3MC$. Biểu thị vectơ $\overrightarrow{AM}$ theo $\overrightarrow{AB}$ và $\overrightarrow{AC}$ [71].
        *Giải*: Ta có $MB = 3MC \implies \overrightarrow{BM} = \frac{3}{4}\overrightarrow{BC}$.
        Do đó: $\overrightarrow{AM} = \overrightarrow{AB} + \overrightarrow{BM} = \overrightarrow{AB} + \frac{3}{4}\overrightarrow{BC} = \overrightarrow{AB} + \frac{3}{4}(\overrightarrow{AC} - \overrightarrow{AB}) = \frac{1}{4}\overrightarrow{AB} + \frac{3}{4}\overrightarrow{AC}$.
*   **Dạng 3: Bài toán tọa độ tổng hợp trong Oxy**
    *   *Ví dụ*: Trong mặt phẳng $Oxy$, cho $A(2;1), B(-2;5), C(-5;2)$ [71, 72].
        a) Tính tọa độ các vectơ $\overrightarrow{BA}$ và $\overrightarrow{BC}$ [71].
        b) Chứng minh $A, B, C$ là ba đỉnh của một tam giác vuông [71].
        c) Tìm tọa độ điểm $D$ sao cho tứ giác $BCAD$ là một hình bình hành [71].
        *Giải*:
        a) $\overrightarrow{BA} = (4; -4)$, $\overrightarrow{BC} = (-3; -3)$.
        b) $\overrightarrow{BA} \cdot \overrightarrow{BC} = 4(-3) + (-4)(-3) = -12 + 12 = 0 \implies BA \perp BC \implies \Delta ABC$ vuông tại $B$.
        c) $BCAD$ là hình bình hành khi $\overrightarrow{AD} = \overrightarrow{BC} \Leftrightarrow (x_D - 2; y_D - 1) = (-3; -3) \implies D(-1; -2)$.


---
---

# CHƯƠNG V: CÁC SỐ ĐẶC TRƯNG CỦA MẪU SỐ LIỆU KHÔNG GHÉP NHÓM

Chương này giới thiệu các khái niệm thống kê mô tả cơ bản bao gồm số gần đúng, sai số và các số đặc trưng giúp tóm tắt, đo lường xu thế trung tâm cũng như độ phân tán của một mẫu số liệu không ghép nhóm trong thực tế [72, 73, 77, 83].

---

## BÀI 12: SỐ GẦN ĐÚNG VÀ SAI SỐ

### 1. Số gần đúng
*   **Khái niệm**: Trong thực tế đo đạc, tính toán hay thống kê, ta thường thu được các kết quả là **số gần đúng** (kí hiệu là $a$) thay vì số đúng (kí hiệu là $\bar{a}$) do giới hạn của dụng cụ đo hoặc yêu cầu làm tròn trong thực tế [73].
*   *Ví dụ*: Chiều cao của đỉnh núi Everest thường được công bố dưới các số gần đúng như $8\,848$ m, $8\,848,13$ m, $8\,844,43$ m hoặc $8\,850$ m tùy thuộc vào phương pháp và thời điểm đo đạc [73].

### 2. Sai số tuyệt đối và sai số tương đối

#### a) Sai số tuyệt đối
*   **Định nghĩa**: Nếu $a$ là số gần đúng của số đúng $\bar{a}$ thì đại lượng:
    $$\Delta_a = |\bar{a} - a|$$
    được gọi là **sai số tuyệt đối** của số gần đúng $a$ [74].
*   **Ý nghĩa**: Sai số tuyệt đối phản ánh mức độ sai lệch giữa số đúng $\bar{a}$ và số gần đúng $a$ [74].

#### b) Độ chính xác của một số gần đúng
*   **Khái niệm**: Trên thực tế, ta thường không biết số đúng $\bar{a}$ nên không thể tính được chính xác $\Delta_a$ [74]. Tuy nhiên, ta thường xác định được một số dương $d$ sao cho sai số tuyệt đối không vượt quá $d$:
    $$\Delta_a = |\bar{a} - a| \le d$$
    Khi đó, ta nói $a$ là số gần đúng của $\bar{a}$ với **độ chính xác** $d$, và viết là:
    $$\bar{a} = a \pm d$$ [74]
*   **Mối quan hệ**: Số đúng $\bar{a}$ nằm trong đoạn $[a - d; a + d]$ [74]. Độ chính xác $d$ càng nhỏ thì số gần đúng $a$ càng gần số đúng $\bar{a}$ [74].
*   *Ví dụ*: Khối lượng tịnh ghi trên bao bì gạo đặc sản Bắc Thơm là $5 \pm 0,2$ kg. Nghĩa là khối lượng thực tế của bao gạo $\bar{a}$ nằm trong khoảng từ $4,8$ kg đến $5,2$ kg, với độ chính xác $d = 0,2$ kg [74].

#### c) Sai số tương đối
*   **Định nghĩa**: **Sai số tương đối** của số gần đúng $a$, kí hiệu là $\delta_a$, là tỉ số giữa sai số tuyệt đối $\Delta_a$ và $|a|$:
    $$\delta_a = \frac{\Delta_a}{|a|}$$ [75]
*   **Công thức đánh giá**: Nếu có độ chính xác $d$ thì sai số tương đối được ước lượng bởi công thức:
    $$\delta_a \le \frac{d}{|a|}$$ [75]
*   **Ý nghĩa**: Sai số tương đối dùng để so sánh chất lượng của hai phép đo hoặc phép tính toán [75]. Phép đo nào có sai số tương đối nhỏ hơn thì có chất lượng tốt hơn [75]. Sai số tương đối thường được viết dưới dạng phần trăm [75].

### 3. Quy tròn số gần đúng
*   **Khái niệm**: Số thu được sau khi thực hiện làm tròn số được gọi là **số quy tròn**. Số quy tròn là một số gần đúng của số ban đầu [76].
*   **Quy tắc làm tròn số** [76]:
    *   Đối với chữ số hàng làm tròn: Giữ nguyên nếu chữ số ngay bên phải nhỏ hơn $5$; tăng thêm 1 đơn vị nếu chữ số ngay bên phải lớn hơn hoặc bằng $5$.
    *   Đối với các chữ số sau hàng làm tròn: Bỏ đi nếu ở phần thập phân; thay bằng các chữ số $0$ nếu ở phần số nguyên.
*   **Lựa chọn hàng làm tròn theo độ chính xác cho trước**:
    *   Khi làm tròn số đúng $\bar{a}$ đến một hàng nào đó để được số gần đúng $a$ có độ chính xác $d$ cho trước, ta chọn hàng làm tròn là **hàng lớn nhất** có đơn vị nhỏ hơn hoặc bằng $d$ [76].
    *   *Ví dụ*: Nếu độ chính xác đến hàng trăm ($d = 200$), ta làm tròn đến hàng nghìn [76]. Nếu độ chính xác đến hàng phần trưng ($d = 0,01$), ta làm tròn đến hàng phần mười [76].

---

## BÀI 13: CÁC SỐ ĐẶC TRƯNG ĐO XU THẾ TRUNG TÂM

Các số đặc trưng đo xu thế trung tâm là các số đại diện cho một mẫu số liệu để phản ánh vị trí trung tâm hoặc xu thế tập trung của các số liệu đó [77].

### 1. Số trung bình (Số trung bình cộng)
*   **Công thức tính**: Cho mẫu số liệu $x_1, x_2, ..., x_n$, số trung bình của mẫu, kí hiệu là $\bar{x}$, được tính bằng:
    $$\bar{x} = \frac{x_1 + x_2 + ... + x_n}{n}$$ [77]
*   **Trường hợp mẫu số liệu cho dưới dạng bảng tần số**:
    $$\bar{x} = \frac{m_1x_1 + m_2x_2 + ... + m_kx_k}{n}$$
    trong đó $m_i$ là tần số của giá trị $x_i$ và $n = m_1 + m_2 + ... + m_k$ [77].
*   **Ý nghĩa**: Số trung bình dùng làm đại diện cho mẫu số liệu và có ích khi mẫu số liệu không có các giá trị bất thường (quá lớn hoặc quá bé so với số đông) [78].

### 2. Trung vị
*   **Định nghĩa**: **Trung vị** (kí hiệu là $M_e$) của một mẫu số liệu là giá trị chia đôi mẫu số liệu đã sắp xếp theo thứ tự không giảm thành hai phần bằng nhau [78].
*   **Cách xác định** [78]:
    *   **Bước 1**: Sắp xếp các giá trị trong mẫu số liệu theo thứ tự không giảm.
    *   **Bước 2**: Xác định số phần tử $n$ của mẫu:
        *   Nếu $n$ là **số lẻ**: Trung vị $M_e$ là giá trị ở vị trí chính giữa (vị trí thứ $\frac{n+1}{2}$).
        *   Nếu $n$ là **số chẵn**: Trung vị $M_e$ là trung bình cộng của hai giá trị ở vị trí chính giữa (vị trí thứ $\frac{n}{2}$ và vị trí thứ $\frac{n}{2} + 1$).
*   **Ý nghĩa**: Trung vị không bị ảnh hưởng bởi các giá trị bất thường, do đó có thể dùng để đại diện cho mẫu số liệu khi mẫu chứa các giá trị quá lớn hoặc quá bé [78].

### 3. Tứ phân vị
*   **Định nghĩa**: Các **tứ phân vị** gồm ba giá trị $Q_1, Q_2, Q_3$ chia mẫu số liệu đã sắp xếp thành 4 phần bằng nhau, mỗi phần chứa khoảng $25\%$ số lượng số liệu [79].
    *   $Q_1$: Tứ phân vị thứ nhất (hoặc tứ phân vị dưới) [79].
    *   $Q_2$: Tứ phân vị thứ hai (chính là trung vị $M_e$) [79].
    *   $Q_3$: Tứ phân vị thứ ba (hoặc tứ phân vị trên) [79].
*   **Cách tìm các tứ phân vị** [79]:
    *   **Bước 1**: Sắp xếp mẫu số liệu theo thứ tự không giảm.
    *   **Bước 2**: Tìm trung vị của mẫu số liệu, giá trị này chính là $Q_2$.
    *   **Bước 3**: Tìm trung vị của nửa số liệu bên trái $Q_2$ (không bao gồm $Q_2$ nếu $n$ lẻ). Giá trị tìm được chính là $Q_1$.
    *   **Bước 4**: Tìm trung vị của nửa số liệu bên phải $Q_2$ (không bao gồm $Q_2$ nếu $n$ lẻ). Giá trị tìm được chính là $Q_3$.
*   *Ví dụ*: Với mẫu số liệu: $0, 50, 70, 100, 130, 140, 140, 150, 160, 180, 180, 180, 190, 200, 210, 210, 220, 290, 340$ ($n = 19$, lẻ) [79]:
    *   $Q_2$ (Trung vị): nằm ở vị trí thứ $10$ là $180$ [79].
    *   Nửa bên trái (9 số đầu): $0, 50, 70, 100, 130, 140, 140, 150, 160$ $\implies$ trung vị là số ở vị trí thứ 5: $Q_1 = 130$ [79].
    *   Nửa bên phải (9 số cuối): $180, 180, 190, 200, 210, 210, 220, 290, 340$ $\implies$ trung vị là số ở vị trí thứ 5 của nửa này: $Q_3 = 210$ [79].

### 4. Mốt
*   **Định nghĩa**: **Mốt** (kí hiệu là $M_o$) của một mẫu số liệu là giá trị xuất hiện với tần số lớn nhất trong mẫu số liệu đó [80].
*   *Lưu ý*:
    *   Mốt của một mẫu số liệu có thể không duy nhất (một mẫu có thể có nhiều mốt) [81].
    *   Khi các giá trị xuất hiện với tần số bằng nhau thì mẫu số liệu không có mốt [81].
*   **Ý nghĩa**: Mốt thường được dùng khi ta muốn biết giá trị nào có khả năng xuất hiện cao nhất, đặc biệt hữu ích trong các mẫu dữ liệu định tính [80, 81].

---

## BÀI 14: CÁC SỐ ĐẶC TRƯNG ĐO ĐỘ PHÂN TÁN

Các số đặc trưng đo độ phân tán dùng để mô tả mức độ phân tán hay sự sai lệch giữa các giá trị trong mẫu số liệu [83].

### 1. Khoảng biến thiên và khoảng tứ phân vị

#### a) Khoảng biến thiên
*   **Định nghĩa**: **Khoảng biến thiên** (kí hiệu là $R$) của một mẫu số liệu là hiệu giữa giá trị lớn nhất và giá trị nhỏ nhất của mẫu đó [83]:
    $$R = x_{\text{max}} - x_{\text{min}}$$
*   **Ý nghĩa**: Khoảng biến thiên dùng để đo độ phân tán của mẫu số liệu. Khoảng biến thiên càng lớn thì mẫu số liệu càng phân tán [83]. Khoảng biến thiên dễ tính nhưng nhược điểm là chỉ sử dụng thông tin của giá trị lớn nhất và nhỏ nhất nên dễ bị ảnh hưởng bởi giá trị bất thường [84].

#### b) Khoảng tứ phân vị
*   **Định nghĩa**: **Khoảng tứ phân vị** (kí hiệu là $\Delta_Q$) là hiệu số giữa tứ phân vị thứ ba và tứ phân vị thứ nhất [84]:
    $$\Delta_Q = Q_3 - Q_1$$
*   **Ý nghĩa**: Khoảng tứ phân vị đo độ phân tán của $50\%$ số liệu nằm ở chính giữa của mẫu đã sắp xếp [84]. Khoảng tứ phân vị càng lớn thì $50\%$ số liệu ở giữa càng phân tán [84]. Đặc biệt, đại lượng này không bị ảnh hưởng bởi các giá trị bất thường [84].

### 2. Phương sai và độ lệch chuẩn

#### a) Phương sai
*   **Định nghĩa**: Với mẫu số liệu $x_1, x_2, ..., x_n$, gọi $\bar{x}$ là số trung bình cộng của mẫu. **Phương sai** của mẫu số liệu, kí hiệu là $s^2$, được tính bằng công thức [85]:
    $$s^2 = \frac{(x_1 - \bar{x})^2 + (x_2 - \bar{x})^2 + ... + (x_n - \bar{x})^2}{n}$$
*   **Ý nghĩa**: Phương sai đo lường mức độ lệch của các số liệu so với số trung bình [85]. Phương sai càng lớn thì số liệu càng phân tán xa số trung bình [86].
*   *Chú ý*: Trong thực tế, người ta còn sử dụng phương sai hiệu chỉnh (kí hiệu là $\hat{s}^2$) với mẫu số là $n-1$:
    $$\hat{s}^2 = \frac{(x_1 - \bar{x})^2 + (x_2 - \bar{x})^2 + ... + (x_n - \bar{x})^2}{n-1}$$ [85]

#### b) Độ lệch chuẩn
*   **Định nghĩa**: **Độ lệch chuẩn** (kí hiệu là $s$) là căn bậc hai số học của phương sai [85]:
    $$s = \sqrt{s^2}$$
*   **Ý nghĩa**: Độ lệch chuẩn có cùng đơn vị đo với đơn vị của mẫu số liệu ban đầu, giúp biểu diễn trực quan độ phân tán của mẫu số liệu quanh giá trị trung bình [85].

### 3. Phát hiện số liệu bất thường bằng biểu đồ hộp
*   **Khái niệm**: Một giá trị trong mẫu số liệu được coi là **giá trị bất thường** (outlier) nếu nó quá lớn hoặc quá bé so với phần lớn các giá trị khác trong mẫu [86].
*   **Quy tắc xác định**: Ta dùng khoảng tứ phân vị $\Delta_Q$ làm chuẩn để xác định. Một giá trị $x$ được gọi là giá trị bất thường nếu thỏa mãn một trong hai điều kiện sau:
    *   $$x > Q_3 + 1,5 \cdot \Delta_Q$$ [86]
    *   $$x < Q_1 - 1,5 \cdot \Delta_Q$$ [86]
*   **Ứng dụng**: Phát hiện số liệu bất thường bằng biểu đồ hộp giúp ta loại bỏ những số liệu sai sót do quá trình thu thập hoặc nhận diện các hiện tượng đặc biệt trong thực tế [86].

---

## BÀI TẬP ÔN TẬP CUỐI CHƯƠNG V

### 1. Câu hỏi trắc nghiệm minh họa tiêu biểu

*   **Câu 1 (Sai số)**: Hai mẫu số liệu A và B có phương sai tương ứng là $s_A^2 = 4,5$ và $s_B^2 = 9,2$. Phát biểu nào sau đây đúng? [88]
    *   A. Mẫu số liệu B có độ phân tán quanh số trung bình nhỏ hơn mẫu A.
    *   B. Mẫu số liệu B có độ lệch chuẩn lớn hơn mẫu A.
    *   *Đáp án*: **B** (vì $s_B = \sqrt{9,2} \approx 3,03$ lớn hơn $s_A = \sqrt{4,5} \approx 2,12$) [88].
*   **Câu 2 (Tứ phân vị)**: Có bao nhiêu phần trăm giá trị của mẫu số liệu nằm giữa $Q_1$ và $Q_3$? [88]
    *   A. $25\%$.
    *   B. $50\%$.
    *   *Đáp án*: **B** (khoảng giữa $Q_1$ và $Q_3$ chứa đúng $50\%$ số liệu nằm ở chính giữa của mẫu) [88].
*   **Câu 3 (Số đặc trưng đo độ phân tán)**: Đại lượng nào sau đây không dùng để đo độ phân tán của mẫu số liệu? [88]
    *   A. Khoảng biến thiên.
    *   B. Số trung bình.
    *   *Đáp án*: **B** (Số trung bình đo xu thế trung tâm chứ không đo độ phân tán) [88].

### 2. Các dạng toán tự luận trọng tâm

*   **Dạng 1: So sánh độ học đều của học sinh**
    *   *Đề bài*: Điểm kiểm tra môn Toán và tiếng Anh của 11 học sinh lớp 10 được cho trong bảng dưới đây [89]:
        
        | Học sinh | A | B | C | D | E | F | G | H | I | J | K |
        | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
        | **Toán** | 62 | 91 | 43 | 31 | 57 | 63 | 80 | 37 | 43 | 5 | 78 |
        | **Tiếng Anh** | 65 | 57 | 55 | 37 | 62 | 70 | 73 | 49 | 65 | 41 | 64 |
        
        Hãy so sánh mức độ học đều của học sinh trong môn Toán và môn tiếng Anh [89].
    *   *Lời giải chi tiết*:
        1.  **Tính số trung bình (\(\bar{x}\))** [89]:
            *   $\bar{x}_{\text{Toán}} = \frac{62+91+43+31+57+63+80+37+43+5+78}{11} = \frac{593}{11} \approx 53,91$ [89].
            *   $\bar{x}_{\text{Anh}} = \frac{65+57+55+37+62+70+73+49+65+41+64}{11} = \frac{635}{11} \approx 57,73$ [89].
        2.  **Tính phương sai (\(s^2\))** [89]:
            *   $s_{\text{Toán}}^2 \approx 592,99 \implies s_{\text{Toán}} \approx 24,35$.
            *   $s_{\text{Anh}}^2 \approx 109,29 \implies s_{\text{Anh}} \approx 10,45$.
        3.  **Kết luận**: Vì phương sai và độ lệch chuẩn của môn tiếng Anh nhỏ hơn rất nhiều so với môn Toán ($10,45 < 24,35$), điều này chứng tỏ mức độ phân tán điểm số môn tiếng Anh nhỏ hơn. Do đó, học sinh học môn tiếng Anh **đều hơn** môn Toán [89].

*   **Dạng 2: Phát hiện giá trị bất thường**
    *   *Đề bài*: Mẫu số liệu về cân nặng của 10 trẻ sơ sinh (đơn vị kg) như sau [88]:
        $$2,977 \quad 3,155 \quad 3,920 \quad 3,412 \quad 4,236 \quad 2,593 \quad 3,270 \quad 3,813 \quad 4,042 \quad 3,387$$
        Tìm khoảng biến thiên, khoảng tứ phân vị và kiểm tra xem mẫu số liệu có giá trị bất thường hay không [88].
    *   *Lời giải chi tiết*:
        1.  **Sắp xếp mẫu số liệu theo thứ tự không giảm** [88]:
            $$2,593 \quad 2,977 \quad 3,155 \quad 3,270 \quad 3,387 \quad 3,412 \quad 3,813 \quad 3,920 \quad 4,042 \quad 4,236$$
        2.  **Khoảng biến thiên (\(R\))** [88]:
            $$R = 4,236 - 2,593 = 1,643 \text{ kg}$$
        3.  **Tìm tứ phân vị** [88]:
            *   Vì $n = 10$ (chẵn), trung vị $Q_2$ là trung bình cộng của giá trị thứ 5 và thứ 6:
                $$Q_2 = \frac{3,387 + 3,412}{2} = 3,3995$$
            *   Nửa số liệu bên trái $Q_2$: $2,593; 2,977; 3,155; 3,270; 3,387 \implies Q_1 = 3,155$ [88].
            *   Nửa số liệu bên phải $Q_2$: $3,412; 3,813; 3,920; 4,042; 4,236 \implies Q_3 = 3,920$ [88].
            *   Khoảng tứ phân vị:
                $$\Delta_Q = Q_3 - Q_1 = 3,920 - 3,155 = 0,765 \text{ kg}$$ [88]
        4.  **Kiểm tra giá trị bất thường** [88]:
            *   Ngưỡng dưới:
                $$Q_1 - 1,5 \cdot \Delta_Q = 3,155 - 1,5 \cdot 0,765 = 2,0075$$
            *   Ngưỡng trên:
                $$Q_3 + 1,5 \cdot \Delta_Q = 3,920 + 1,5 \cdot 0,765 = 5,0675$$
            *   **Kết luận**: Do không có giá trị nào trong mẫu nhỏ hơn $2,0075$ hoặc lớn hơn $5,0675$, mẫu số liệu này **không có giá trị bất thường** [88].


---
---
