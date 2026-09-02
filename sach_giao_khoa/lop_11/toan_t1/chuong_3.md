# CHƯƠNG III: CÁC SỐ ĐẶC TRƯNG ĐO XU THẾ TRUNG TÂM CỦA MẪU SỐ LIỆU GHÉP NHÓM

Sách giáo khoa Toán 11 - Tập một (Kết nối tri thức với cuộc sống)

---

## BÀI 8: MẪU SỐ LIỆU GHÉP NHÓM

### 1. Ý nghĩa và khái niệm mẫu số liệu ghép nhóm
Mẫu số liệu ghép nhóm là mẫu số liệu được trình bày dưới dạng bảng tần số của các nhóm số liệu. Mỗi nhóm là một khoảng hoặc nửa khoảng $[a; b)$ với $a, b \in \mathbb{R}$ và $a < b$.
- **Cỡ mẫu**: Tổng tần số của tất cả các nhóm số liệu, kí hiệu là $n$.
- **Tần số của nhóm**: Số lượng giá trị của mẫu số liệu thuộc vào nhóm đó, kí hiệu là $m_i$.
- **Đầu mút**: Đối với nhóm $[a; b)$, ta gọi $a$ là đầu mút trái, $b$ là đầu mút phải. Trong một số trường hợp, nhóm cuối cùng có thể lấy cả đầu mút bên phải, ví dụ $[a; b]$.

**Khi nào cần ghép nhóm số liệu?**
Ta thường ghép nhóm mẫu số liệu khi:
- Cỡ mẫu $n$ rất lớn.
- Số liệu gốc có độ phân tán rộng hoặc liên tục (ví dụ: chiều cao, cân nặng, thời gian, nhiệt độ...).
- Không thể thu thập được số liệu chính xác tuyệt đối mà chỉ thu thập được theo khoảng.

*Ví dụ về mẫu số liệu ghép nhóm (Dân số Việt Nam năm 2019):*
- Nhóm tuổi dưới 15: $23\ 371\ 882$ người.
- Nhóm tuổi từ 15 đến dưới 65: $65\ 420\ 451$ người.
- Nhóm tuổi từ 65 trở lên: $7\ 416\ 651$ người.
- Cỡ mẫu (Tổng dân số): $n = 96\ 208\ 984$ người.

---

### 2. Phương pháp ghép nhóm mẫu số liệu thô
Để chuyển một mẫu số liệu thô (chưa ghép nhóm) thành mẫu số liệu ghép nhóm, ta thực hiện theo 2 bước:
- **Bước 1**: Chia miền giá trị của mẫu số liệu thành một số nhóm (thường là từ 5 đến 10 nhóm) theo một tiêu chí cho trước. Độ dài của các nhóm nên bằng nhau (kí hiệu độ dài nhóm là $h = b - a$) và tổng độ dài các nhóm phải bao phủ toàn bộ miền giá trị của mẫu số liệu.
- **Bước 2**: Đếm số giá trị thuộc mỗi nhóm (tần số nhóm $m_i$) và lập bảng tần số ghép nhóm.

#### Quy tắc hiệu chỉnh đối với mẫu số liệu rời rạc
Trong thực tế, số liệu rời rạc thường được cho dưới dạng các khoảng nguyên như $k_1 - k_2$ (ví dụ: nhóm tuổi $1 - 4$, nhóm điểm số $5 - 9$). Khi cần tính toán các số đặc trưng đo xu thế trung tâm, ta cần **hiệu chỉnh** mẫu số liệu này về dạng liên tục $[a; b)$ như sau:
Nhóm $k_1 - k_2$ (với $k_1, k_2 \in \mathbb{N}$) sẽ được hiệu chỉnh thành nửa khoảng:
$$[k_1 - 0.5; k_2 + 0.5)$$
- *Ví dụ:* Nhóm $1 - 4$ hiệu chỉnh thành $[0.5; 4.5)$. Nhóm $5 - 7$ hiệu chỉnh thành $[4.5; 7.5)$.

---

## BÀI 9: CÁC SỐ ĐẶC TRƯNG ĐO XU THẾ TRUNG TÂM CỦA MẪU SỐ LIỆU GHÉP NHÓM

### 1. Số trung bình ($\bar{x}$)
Số trung bình của mẫu số liệu ghép nhóm dùng để đại diện cho vị trí trung tâm của mẫu số liệu, xấp xỉ cho số trung bình của mẫu số liệu gốc.

#### Giá trị đại diện của nhóm
Để tính số trung bình, trước hết ta cần tìm giá trị đại diện $x_i$ của mỗi nhóm $[a_i; a_{i+1})$. Giá trị đại diện được tính bằng trung bình cộng hai đầu mút của nhóm đó:
$$x_i = \frac{a_i + a_{i+1}}{2}$$

#### Công thức tính số trung bình
$$\bar{x} = \frac{m_1x_1 + m_2x_2 + \dots + m_kx_k}{n}$$
Trong đó:
- $n = m_1 + m_2 + \dots + m_k$ là cỡ mẫu.
- $m_i$ là tần số của nhóm thứ $i$.
- $x_i$ là giá trị đại diện của nhóm thứ $i$.

#### Ví dụ minh họa chi tiết
Khảo sát cân nặng của 42 học sinh lớp 11D ta có bảng sau:
| Nhóm cân nặng (kg) | $[40.5; 45.5)$ | $[45.5; 50.5)$ | $[50.5; 55.5)$ | $[55.5; 60.5)$ | $[60.5; 65.5)$ | $[65.5; 70.5)$ |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Tần số ($m_i$) | 10 | 7 | 16 | 4 | 2 | 3 |

*Giải:*
- Cỡ mẫu: $n = 10 + 7 + 16 + 4 + 2 + 3 = 42$.
- Xác định giá trị đại diện của từng nhóm:
  - Nhóm 1: $x_1 = \frac{40.5 + 45.5}{2} = 43$
  - Nhóm 2: $x_2 = \frac{45.5 + 50.5}{2} = 48$
  - Nhóm 3: $x_3 = \frac{50.5 + 55.5}{2} = 53$
  - Nhóm 4: $x_4 = \frac{55.5 + 60.5}{2} = 58$
  - Nhóm 5: $x_5 = \frac{60.5 + 65.5}{2} = 63$
  - Nhóm 6: $x_6 = \frac{65.5 + 70.5}{2} = 68$
- Áp dụng công thức tính số trung bình:
  $$\bar{x} = \frac{10 \cdot 43 + 7 \cdot 48 + 16 \cdot 53 + 4 \cdot 58 + 2 \cdot 63 + 3 \cdot 68}{42} = \frac{2176}{42} \approx 51.81\text{ (kg)}$$

---

### 2. Trung vị ($M_e$)
Trung vị là số chia mẫu số liệu thành hai phần bằng nhau, mỗi phần chứa 50% số liệu.

#### Quy trình tính trung vị ghép nhóm
- **Bước 1**: Tìm cỡ mẫu $n$. Tính giá trị $\frac{n}{2}$.
- **Bước 2**: Lập bảng tần số tích lũy (hoặc cộng dồn tần số từ trái sang phải). Tìm nhóm đầu tiên có tần số tích lũy lớn hơn hoặc bằng $\frac{n}{2}$. Giả sử đó là nhóm thứ $p$: $[a_p; a_{p+1})$. Nhóm này được gọi là **nhóm chứa trung vị**.
- **Bước 3**: Áp dụng công thức tính trung vị $M_e$:
  $$M_e = a_p + \frac{\frac{n}{2} - (m_1 + m_2 + \dots + m_{p-1})}{m_p} \cdot (a_{p+1} - a_p)$$
  Trong đó:
  - $a_p$ là đầu mút trái của nhóm chứa trung vị.
  - $a_{p+1} - a_p = h$ là độ dài của nhóm chứa trung vị.
  - $m_p$ là tần số của nhóm chứa trung vị.
  - $m_1 + m_2 + \dots + m_{p-1}$ là tổng tần số của các nhóm đứng trước nhóm thứ $p$ (nếu $p=1$, tổng này bằng $0$).

#### Ví dụ minh họa chi tiết
Khảo sát thời gian truy cập Internet (phút) mỗi buổi tối của 56 học sinh như sau:
| Thời gian (phút) | $[9.5; 12.5)$ | $[12.5; 15.5)$ | $[15.5; 18.5)$ | $[18.5; 21.5)$ | $[21.5; 24.5)$ |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Số học sinh | 3 | 12 | 15 | 24 | 2 |

*Giải:*
- Cỡ mẫu: $n = 56$. Ta có $\frac{n}{2} = 28$.
- Tần số tích lũy của các nhóm:
  - Nhóm $[9.5; 12.5)$: $3$
  - Nhóm $[12.5; 15.5)$: $3 + 12 = 15$
  - Nhóm $[15.5; 18.5)$: $15 + 15 = 30$ (lớn hơn hoặc bằng 28).
  - Nhóm $[18.5; 21.5)$: $30 + 24 = 54$
  - Nhóm $[21.5; 24.5)$: $54 + 2 = 56$
- Do đó, nhóm chứa trung vị là nhóm thứ 3: $[15.5; 18.5)$.
- Các đại lượng tương ứng:
  - $p = 3 \Rightarrow a_3 = 15.5$
  - $m_3 = 15$
  - Tổng tần số đứng trước: $m_1 + m_2 = 3 + 12 = 15$
  - Độ dài nhóm: $h = 18.5 - 15.5 = 3$
- Áp dụng công thức:
  $$M_e = 15.5 + \frac{28 - 15}{15} \cdot 3 = 15.5 + \frac{13}{15} \cdot 3 = 15.5 + 2.6 = 18.1\text{ (phút)}$$

---

### 3. Tứ phân vị ($Q_1, Q_2, Q_3$)
Tứ phân vị chia mẫu số liệu thành bốn phần có số lượng giá trị bằng nhau.
- Tứ phân vị thứ hai: $Q_2 = M_e$ (Trung vị).
- Tứ phân vị thứ nhất ($Q_1$) và thứ ba ($Q_3$) được xác định tương tự trung vị nhưng với các mốc tương ứng là $\frac{n}{4}$ và $\frac{3n}{4}$.

#### Tứ phân vị thứ nhất ($Q_1$)
- **Bước 1**: Xác định nhóm chứa $Q_1$, đó là nhóm đầu tiên có tần số tích lũy lớn hơn hoặc bằng $\frac{n}{4}$. Giả sử đó là nhóm thứ $p$: $[a_p; a_{p+1})$.
- **Bước 2**: Công thức:
  $$Q_1 = a_p + \frac{\frac{n}{4} - (m_1 + m_2 + \dots + m_{p-1})}{m_p} \cdot (a_{p+1} - a_p)$$

#### Tứ phân vị thứ ba ($Q_3$)
- **Bước 1**: Xác định nhóm chứa $Q_3$, đó là nhóm đầu tiên có tần số tích lũy lớn hơn hoặc bằng $\frac{3n}{4}$. Giả sử đó là nhóm thứ $q$: $[a_q; a_{q+1})$.
- **Bước 2**: Công thức:
  $$Q_3 = a_q + \frac{\frac{3n}{4} - (m_1 + m_2 + \dots + m_{q-1})}{m_q} \cdot (a_{q+1} - a_q)$$

#### Ví dụ minh họa chi tiết (sử dụng mẫu số liệu thời gian truy cập Internet ở trên)
Cỡ mẫu $n = 56$.
- **Tìm $Q_1$**:
  - Ta có $\frac{n}{4} = \frac{56}{4} = 14$.
  - Nhóm đầu tiên có tần số tích lũy lớn hơn hoặc bằng 14 là nhóm thứ 2: $[12.5; 15.5)$ (có tần số tích lũy bằng 15).
  - Các đại lượng tương ứng: $a_2 = 12.5$, $m_2 = 12$, tổng tần số đứng trước $m_1 = 3$, độ dài nhóm $h = 3$.
  - Áp dụng công thức:
    $$Q_1 = 12.5 + \frac{14 - 3}{12} \cdot 3 = 12.5 + \frac{11}{4} = 15.25\text{ (phút)}$$

- **Tìm $Q_3$**:
  - Ta có $\frac{3n}{4} = \frac{3 \cdot 56}{4} = 42$.
  - Nhóm đầu tiên có tần số tích lũy lớn hơn hoặc bằng 42 là nhóm thứ 4: $[18.5; 21.5)$ (có tần số tích lũy bằng 54).
  - Các đại lượng tương ứng: $a_4 = 18.5$, $m_4 = 24$, tổng tần số đứng trước $m_1 + m_2 + m_3 = 30$, độ dài nhóm $h = 3$.
  - Áp dụng công thức:
    $$Q_3 = 18.5 + \frac{42 - 30}{24} \cdot 3 = 18.5 + \frac{12}{24} \cdot 3 = 18.5 + 1.5 = 20.0\text{ (phút)}$$

---

### 4. Mốt ($M_o$)
Mốt của mẫu số liệu ghép nhóm xấp xỉ cho mốt của mẫu số liệu gốc, đại diện cho giá trị có khả năng xuất hiện cao nhất trong mẫu số liệu.

*Lưu ý quan trọng:* Người ta chỉ định nghĩa mốt cho mẫu số liệu ghép nhóm có **độ dài các nhóm bằng nhau**. Một mẫu số liệu có thể có nhiều mốt hoặc không có mốt.

#### Quy trình tính mốt ghép nhóm
- **Bước 1**: Xác định nhóm chứa mốt, đó là nhóm có **tần số lớn nhất**. Giả sử đó là nhóm thứ $j$: $[a_j; a_{j+1})$.
- **Bước 2**: Áp dụng công thức tính mốt $M_o$:
  $$M_o = a_j + \frac{m_j - m_{j-1}}{(m_j - m_{j-1}) + (m_j - m_{j+1})} \cdot h$$
  Trong đó:
  - $a_j$ là đầu mút trái của nhóm chứa mốt.
  - $m_j$ là tần số của nhóm chứa mốt.
  - $m_{j-1}$ là tần số của nhóm đứng liền trước nhóm chứa mốt (nếu $j=1$, quy ước $m_0 = 0$).
  - $m_{j+1}$ là tần số của nhóm đứng liền sau nhóm chứa mốt (nếu nhóm chứa mốt là nhóm cuối cùng thứ $k$, quy ước $m_{k+1} = 0$).
  - $h = a_{j+1} - a_j$ là độ dài của nhóm.

#### Ví dụ minh họa chi tiết
Khảo sát chiều cao của 50 học sinh lớp 11A thu được bảng sau:
| Nhóm chiều cao (cm) | $[145; 150)$ | $[150; 155)$ | $[155; 160)$ | $[160; 165)$ | $[165; 170)$ |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Số học sinh | 7 | 14 | 10 | 10 | 9 |

*Giải:*
- Nhóm có tần số lớn nhất là nhóm thứ 2: $[150; 155)$ với tần số $m_2 = 14$. Do đó, nhóm chứa mốt là $[150; 155)$.
- Các đại lượng tương ứng:
  - $j = 2 \Rightarrow a_2 = 150$
  - Tần số nhóm mốt: $m_2 = 14$
  - Tần số liền trước: $m_1 = 7$
  - Tần số liền sau: $m_3 = 10$
  - Độ dài nhóm: $h = 5$
- Áp dụng công thức:
  $$M_o = 150 + \frac{14 - 7}{(14 - 7) + (14 - 10)} \cdot 5 = 150 + \frac{7}{7 + 4} \cdot 5 = 150 + \frac{35}{11} \approx 153.18\text{ (cm)}$$

---

## BẢNG TỔNG HỢP CÔNG THỨC CHƯƠNG III

| Số đặc trưng | Nhóm chứa số đặc trưng | Công thức xác định | Chú thích đại lượng |
| :--- | :--- | :--- | :--- |
| **Số trung bình ($\bar{x}$)** | Không cần | $\bar{x} = \frac{\sum m_i x_i}{n}$ | $x_i = \frac{a_i + a_{i+1}}{2}$ (giá trị đại diện nhóm thứ $i$), $n$: cỡ mẫu. |
| **Trung vị ($M_e$)** | $[a_p; a_{p+1})$ chứa giá trị thứ $\frac{n}{2}$ | $M_e = a_p + \frac{\frac{n}{2} - \sum_{i=1}^{p-1} m_i}{m_p} \cdot h$ | $h$: độ dài nhóm, $m_p$: tần số nhóm chứa trung vị, tử số gồm tổng tần số các nhóm trước. |
| **Tứ phân vị thứ nhất ($Q_1$)** | $[a_p; a_{p+1})$ chứa giá trị thứ $\frac{n}{4}$ | $Q_1 = a_p + \frac{\frac{n}{4} - \sum_{i=1}^{p-1} m_i}{m_p} \cdot h$ | Tương tự trung vị nhưng thay $\frac{n}{2}$ bằng $\frac{n}{4}$. |
| **Tứ phân vị thứ ba ($Q_3$)** | $[a_q; a_{q+1})$ chứa giá trị thứ $\frac{3n}{4}$ | $Q_3 = a_q + \frac{\frac{3n}{4} - \sum_{i=1}^{q-1} m_i}{m_q} \cdot h$ | Tương tự trung vị nhưng thay $\frac{n}{2}$ bằng $\frac{3n}{4}$. |
| **Mốt ($M_o$)** | $[a_j; a_{j+1})$ có tần số lớn nhất | $M_o = a_j + \frac{m_j - m_{j-1}}{(m_j - m_{j-1}) + (m_j - m_{j+1})} \cdot h$ | $m_j$: tần số nhóm mốt, $m_{j-1}, m_{j+1}$: tần số nhóm kề trước và kề sau. |
