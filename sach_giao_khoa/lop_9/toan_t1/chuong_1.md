# CHƯƠNG I: PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN

## 📌 TỔNG QUAN CHƯƠNG I
Chương I giới thiệu các khái niệm cơ bản về phương trình bậc nhất hai ẩn, hệ hai phương trình bậc nhất hai ẩn, các phương pháp giải hệ phương trình (phương pháp thế, phương pháp cộng đại số, giải bằng máy tính cầm tay) và ứng dụng của hệ phương trình trong việc giải quyết các bài toán thực tế thông qua việc lập hệ phương trình.

---

## 📘 BÀI 1: KHÁI NIỆM PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN

### 1. Phương trình bậc nhất hai ẩn
#### a. Định nghĩa
**Phương trình bậc nhất hai ẩn** $x$ và $y$ là hệ thức có dạng:
$$ax + by = c \quad (1)$$
Trong đó:
*   $x, y$ là hai ẩn số.
*   $a, b, c$ là các số thực đã biết (gọi là các hệ số), với điều kiện $a \neq 0$ hoặc $b \neq 0$ (tức là hai hệ số $a$ và $b$ không đồng thời bằng 0).

#### b. Nghiệm của phương trình
Nếu tại $x = x_0$ và $y = y_0$, giá trị của vế trái bằng vế phải (tức là $a x_0 + b y_0 = c$ là một khẳng định đúng) thì cặp số $(x_0; y_0)$ được gọi là một **nghiệm** của phương trình (1).
*   *Lưu ý:* Nghiệm của phương trình bậc nhất hai ẩn được viết dưới dạng cặp số $(x; y)$.

**Ví dụ:** Cho phương trình $3x - 2y = 5$.
*   Cặp số $(1; -1)$ là nghiệm của phương trình vì: $3(1) - 2(-1) = 3 + 2 = 5$ (đúng).
*   Cặp số $(2; 1)$ không phải là nghiệm của phương trình vì: $3(2) - 2(1) = 6 - 2 = 4 \neq 5$ (sai).

#### c. Số lượng nghiệm và biểu diễn hình học
Mỗi phương trình bậc nhất hai ẩn $ax + by = c$ luôn có **vô số nghiệm**.
Trong mặt phẳng tọa độ $Oxy$, tập hợp các điểm biểu diễn các nghiệm của phương trình $ax + by = c$ là một **đường thẳng** (kí hiệu là đường thẳng $d: ax + by = c$).

*   **Trường hợp $a \neq 0$ và $b \neq 0$:**
    Phương trình viết lại thành: $y = -\frac{a}{b}x + \frac{c}{b}$.
    Tập nghiệm là đường thẳng $y = -\frac{a}{b}x + \frac{c}{b}$.
*   **Trường hợp $a \neq 0$ và $b = 0$:**
    Phương trình trở thành $ax = c \Leftrightarrow x = \frac{c}{a}$.
    Đường thẳng biểu diễn nghiệm song song hoặc trùng với trục tung $Oy$.
*   **Trường hợp $a = 0$ và $b \neq 0$:**
    Phương trình trở thành $by = c \Leftrightarrow y = \frac{c}{b}$.
    Đường thẳng biểu diễn nghiệm song song hoặc trùng với trục hoành $Ox$.

---

### 2. Hệ hai phương trình bậc nhất hai ẩn
#### a. Định nghĩa
**Hệ hai phương trình bậc nhất hai ẩn** là một cặp gồm hai phương trình bậc nhất hai ẩn:
$$\begin{cases} ax + by = c \\ a'x + b'y = c' \end{cases} \quad (*)$$
Trong đó $ax+by=c$ và $a'x+b'y=c'$ là các phương trình bậc nhất hai ẩn.

#### b. Nghiệm của hệ phương trình
Cặp số $(x_0; y_0)$ được gọi là một **nghiệm của hệ phương trình** (*) nếu nó đồng thời là nghiệm của cả hai phương trình trong hệ.
*   **Giải hệ phương trình** là tìm tất cả các nghiệm của nó.

#### c. Minh họa hình học về tập nghiệm
Mỗi phương trình trong hệ (*) biểu diễn một đường thẳng trên mặt phẳng tọa độ $Oxy$:
- Gọi $d$ là đường thẳng biểu diễn tập nghiệm của phương trình $ax + by = c$.
- Gọi $d'$ là đường thẳng biểu diễn tập nghiệm của phương trình $a'x + b'y = c'$.

Tập nghiệm của hệ (*) tương ứng với số giao điểm của hai đường thẳng $d$ và $d'$:
1.  **Hệ có nghiệm duy nhất** $\Leftrightarrow$ $d$ cắt $d'$. Giao điểm $M(x_0; y_0)$ chính là nghiệm duy nhất của hệ.
2.  **Hệ vô nghiệm** $\Leftrightarrow$ $d \parallel d'$. Hai đường thẳng không có điểm chung.
3.  **Hệ có vô số nghiệm** $\Leftrightarrow$ $d \equiv d'$. Hai đường thẳng trùng nhau.

---

## 📙 BÀI 2: GIẢI HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN

Có hai phương pháp đại số chính để giải hệ phương trình bậc nhất hai ẩn: **Phương pháp thế** và **Phương pháp cộng đại số**.

### 1. Phương pháp thế
#### Quy trình giải (gồm 2 bước):
*   **Bước 1:** Từ một phương trình của hệ, biểu diễn một ẩn theo ẩn kia (ví dụ biểu diễn $y$ theo $x$). Thế biểu thức này vào phương trình còn lại để được một phương trình mới chỉ còn một ẩn (ẩn $x$).
*   **Bước 2:** Giải phương trình một ẩn vừa thu được, từ đó tính ra giá trị của ẩn còn lại và kết luận nghiệm của hệ.

#### Ví dụ minh họa:
Giải hệ phương trình bằng phương pháp thế:
$$\begin{cases} 2x - y = 3 \\ x + 2y = 4 \end{cases}$$

**Giải:**
1.  Từ phương trình thứ nhất, biểu diễn $y$ theo $x$:
    $$y = 2x - 3 \quad (3)$$
2.  Thế biểu thức (3) vào phương trình thứ hai, ta được:
    $$x + 2(2x - 3) = 4 \Leftrightarrow x + 4x - 6 = 4 \Leftrightarrow 5x = 10 \Leftrightarrow x = 2$$
3.  Thay $x = 2$ vào (3), ta được:
    $$y = 2(2) - 3 = 1$$
4.  Vậy hệ phương trình có nghiệm duy nhất là $(2; 1)$.

---

### 2. Phương pháp cộng đại số
#### Quy trình giải (gồm 2 bước):
Áp dụng khi hệ số của cùng một ẩn trong hai phương trình bằng nhau hoặc đối nhau (nếu chưa bằng hoặc đối, ta nhân hai vế của mỗi phương trình với một số thích hợp để đưa về trường hợp này).
*   **Bước 1:** Cộng hay trừ từng vế của hai phương trình trong hệ để triệt tiêu một ẩn, thu được một phương trình mới chỉ chứa một ẩn.
*   **Bước 2:** Giải phương trình một ẩn vừa nhận được, sau đó thế giá trị tìm được vào một trong các phương trình ban đầu để tìm ẩn còn lại.

#### Ví dụ minh họa 1 (Hệ số đối nhau):
Giải hệ phương trình:
$$\begin{cases} 2x + 2y = 3 \\ x - 2y = 6 \end{cases}$$

**Giải:**
Cộng từng vế của hai phương trình (do hệ số của $y$ là $2$ và $-2$ đối nhau):
$$(2x + x) + (2y - 2y) = 3 + 6 \Leftrightarrow 3x = 9 \Leftrightarrow x = 3$$
Thế $x = 3$ vào phương trình thứ hai:
$$3 - 2y = 6 \Leftrightarrow -2y = 3 \Leftrightarrow y = -1.5$$
Vậy hệ phương trình có nghiệm duy nhất là $(3; -1.5)$.

#### Ví dụ minh họa 2 (Nhân hệ số trước khi cộng/trừ):
Giải hệ phương trình:
$$\begin{cases} 3x + 2y = 7 \\ 2x - 3y = -4 \end{cases}$$

**Giải:**
Nhân hai vế của phương trình thứ nhất với $3$ và nhân hai vế của phương trình thứ hai với $2$, ta có hệ phương trình tương đương:
$$\begin{cases} 9x + 6y = 21 \\ 4x - 6y = -8 \end{cases}$$
Cộng từng vế của hai phương trình trên:
$$13x = 13 \Leftrightarrow x = 1$$
Thế $x = 1$ vào phương trình thứ nhất:
$$3(1) + 2y = 7 \Leftrightarrow 2y = 4 \Leftrightarrow y = 2$$
Vậy hệ phương trình có nghiệm duy nhất là $(1; 2)$.

---

### 3. Sử dụng máy tính cầm tay (Casio/Vinacal) để kiểm tra nghiệm
Để giải nhanh hoặc kiểm tra kết quả hệ phương trình $\begin{cases} ax + by = c \\ a'x + b'y = c' \end{cases}$ bằng máy tính:
*   **Dòng máy Casio fx-570VN Plus:** Nhấn `MODE` $\rightarrow$ `5` $\rightarrow$ `1`, sau đó nhập lần lượt các hệ số $a, b, c, a', b', c'$ rồi nhấn dấu `=` để xem nghiệm $x$ và $y$.
*   **Dòng máy Casio fx-580VN X:** Nhấn `MENU` $\rightarrow$ `9` $\rightarrow$ `1` $\rightarrow$ `2` (chọn hệ phương trình 2 ẩn), nhập các hệ số và nhấn `=` để nhận kết quả.

---

## 📕 BÀI 3: GIẢI BÀI TOÁN BẰNG CÁCH LẬP HỆ PHƯƠNG TRÌNH

### 1. Quy trình gồm 3 bước:
*   **Bước 1: Lập hệ phương trình:**
    - Chọn hai ẩn số đại diện cho các đại lượng chưa biết cần tìm và đặt điều kiện thích hợp (đơn vị, tập số) cho các ẩn số.
    - Biểu diễn các đại lượng chưa biết khác theo các ẩn số và các đại lượng đã biết.
    - Lập hai phương trình biểu thị mối liên hệ giữa các đại lượng để lập thành một hệ phương trình.
*   **Bước 2: Giải hệ phương trình** vừa lập bằng phương pháp thế hoặc cộng đại số.
*   **Bước 3: Trả lời:** Đối chiếu các nghiệm tìm được với điều kiện của ẩn, chọn nghiệm thích hợp và kết luận bài toán.

---

### 2. Các dạng toán điển hình

#### Dạng 1: Toán số học (Tìm số)
**Bài toán mẫu:** Tìm hai số tự nhiên có tổng bằng $1\,006$, biết rằng nếu lấy số lớn chia cho số nhỏ thì được thương là $2$ và số dư là $124$.

**Hướng dẫn giải:**
1.  Gọi số nhỏ là $x$, số lớn là $y$ ($x, y \in \mathbb{N}$). Vì số dư là $124$ nên điều kiện của ẩn là $124 < x < y$ và $x + y = 1\,006 \Rightarrow x < 1006$.
2.  Do tổng hai số bằng $1\,006$, ta có phương trình:
    $$x + y = 1\,006 \quad (1)$$
3.  Số lớn $y$ chia cho số nhỏ $x$ được thương là $2$, dư $124$ nên ta có phương trình:
    $$y = 2x + 124 \quad (2)$$
4.  Lập hệ phương trình từ (1) và (2):
    $$\begin{cases} x + y = 1\,006 \\ y = 2x + 124 \end{cases}$$
5.  Thế (2) vào (1), ta được:
    $$x + (2x + 124) = 1\,006 \Leftrightarrow 3x = 882 \Leftrightarrow x = 294 \text{ (thỏa mãn)}$$
6.  Tìm $y$:
    $$y = 2(294) + 124 = 712 \text{ (thỏa mãn)}$$
7.  Vậy hai số cần tìm là $294$ và $712$.

#### Dạng 2: Toán công việc (Làm chung - Làm riêng)
**Bài toán mẫu:** Hai đội công nhân cùng làm chung một đoạn đường trong $24$ ngày thì hoàn thành. Mỗi ngày, đội I làm được lượng công việc gấp rưỡi ($1.5$ lần) đội II. Hỏi nếu làm một mình thì mỗi đội cần bao nhiêu ngày để làm xong đoạn đường đó?

**Hướng dẫn giải:**
1.  Gọi thời gian đội I và đội II hoàn thành công việc một mình lần lượt là $x$ và $y$ (ngày, điều kiện: $x, y > 0$).
2.  Trong một ngày:
    - Đội I làm được $\frac{1}{x}$ công việc.
    - Đội II làm được $\frac{1}{y}$ công việc.
3.  Vì mỗi ngày đội I làm gấp rưỡi đội II, ta có phương trình:
    $$\frac{1}{x} = 1.5 \cdot \frac{1}{y} \Leftrightarrow \frac{1}{x} = \frac{3}{2y} \quad (1)$$
4.  Hai đội làm chung trong $24$ ngày thì xong nên mỗi ngày làm chung được $\frac{1}{24}$ công việc, ta có phương trình:
    $$\frac{1}{x} + \frac{1}{y} = \frac{1}{24} \quad (2)$$
5.  Lập hệ phương trình từ (1) và (2):
    $$\begin{cases} \frac{1}{x} = \frac{3}{2y} \\ \frac{1}{x} + \frac{1}{y} = \frac{1}{24} \end{cases}$$
6.  Đặt ẩn phụ: $u = \frac{1}{x}; v = \frac{1}{y}$ với $u, v > 0$. Hệ phương trình trở thành:
    $$\begin{cases} u = 1.5v \\ u + v = \frac{1}{24} \end{cases}$$
7.  Giải hệ bằng phương pháp thế:
    $$1.5v + v = \frac{1}{24} \Leftrightarrow 2.5v = \frac{1}{24} \Leftrightarrow v = \frac{1}{60}$$
    $$\Rightarrow u = 1.5 \cdot \frac{1}{60} = \frac{1}{40}$$
8.  Suy ra:
    - $x = \frac{1}{u} = 40$ (ngày, thỏa mãn)
    - $y = \frac{1}{v} = 60$ (ngày, thỏa mãn)
9.  Vậy đội I làm một mình xong trong $40$ ngày, đội II làm một mình xong trong $60$ ngày.

---

## 📝 BÀI TẬP CUỐI CHƯƠNG I (TỰ LUYỆN)

### Bài tập Trắc nghiệm chọn lọc (Trích SGK)
**Câu 1:** Cặp số nào sau đây là nghiệm của hệ phương trình $\begin{cases} 5x + 7y = -1 \\ 3x + 2y = -5 \end{cases}$?
*   A. $(-1; 1)$
*   B. $(-3; 2)$
*   C. $(2; -3)$
*   D. $(5; 5)$
*   **Đáp án đúng:** B. $(-3; 2)$ (Vì $5(-3) + 7(2) = -1$ và $3(-3) + 2(2) = -5$).

**Câu 2:** Phương trình nào sau đây là phương trình bậc nhất hai ẩn?
*   A. $3x^2 - 2y = 1$
*   *   B. $2x + 0y = 4$
*   C. $0x + 0y = 5$
*   D. $x + y - z = 0$
*   **Đáp án đúng:** B. $2x + 0y = 4$ (Có dạng $ax + by = c$ with $a = 2 \neq 0$ and $b = 0$).

### Bài tập Tự luận thực hành
**Đề bài:** Giải hệ phương trình sau bằng phương pháp cộng đại số:
$$\begin{cases} 0.5x + 2y = -2.5 \\ 0.7x - 3y = 8.1 \end{cases}$$

**Đáp án hướng dẫn nhanh:**
1.  Nhân hai vế phương trình thứ nhất với $3$ và phương trình thứ hai với $2$:
    $$\begin{cases} 1.5x + 6y = -7.5 \\ 1.4x - 6y = 16.2 \end{cases}$$
2.  Cộng vế theo vế:
    $$2.9x = 8.7 \Leftrightarrow x = 3$$
3.  Thay $x = 3$ vào phương trình thứ nhất:
    $$0.5(3) + 2y = -2.5 \Leftrightarrow 1.5 + 2y = -2.5 \Leftrightarrow 2y = -4 \Leftrightarrow y = -2$$
4.  Nghiệm của hệ là $(3; -2)$.
