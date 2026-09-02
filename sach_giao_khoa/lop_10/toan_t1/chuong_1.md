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
