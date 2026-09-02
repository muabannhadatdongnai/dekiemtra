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
        1.  **Tính số trung bình (\\(\bar{x}\\))** [89]:
            *   $\bar{x}_{\text{Toán}} = \frac{62+91+43+31+57+63+80+37+43+5+78}{11} = \frac{593}{11} \approx 53,91$ [89].
            *   $\bar{x}_{\text{Anh}} = \frac{65+57+55+37+62+70+73+49+65+41+64}{11} = \frac{635}{11} \approx 57,73$ [89].
        2.  **Tính phương sai (\\(s^2\\))** [89]:
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
        2.  **Khoảng biến thiên (\\(R\\))** [88]:
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
