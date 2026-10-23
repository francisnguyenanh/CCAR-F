# 5.6 — Information Provenance & Multi-Source Synthesis

## Tổng quan

Khi một hệ thống nghiên cứu tổng hợp thông tin từ nhiều nguồn, giá trị của báo cáo phụ thuộc vào việc người đọc có thể **truy ngược mỗi nhận định về nguồn của nó** hay không. **Provenance** là thông tin nguồn gốc: nguồn nào, tài liệu nào, đoạn nào, công bố khi nào. Nếu mất provenance trong khâu tổng hợp, báo cáo trở thành những khẳng định không kiểm chứng được.

Đề thi xoay quanh bốn điểm: giữ **ánh xạ claim–source** có cấu trúc xuyên suốt, **trình bày cả hai** khi nguồn uy tín mâu thuẫn, kiểm tra **khác biệt thời gian** trước khi gọi là mâu thuẫn, và chọn **hình thức trình bày** hợp nội dung (bảng cho số liệu, văn xuôi cho sắc thái). Quy tắc nhớ nhanh: **đừng làm mất nguồn, đừng tự chọn hay tự trung bình khi nguồn bất đồng, và đừng gọi mọi con số khác nhau là mâu thuẫn.**

## K1. Ánh xạ claim–source có cấu trúc

### Trọng tâm

Mỗi nhận định phải đi kèm **URL/tên tài liệu, đoạn trích, và ngày công bố**, và liên kết này phải được **bảo toàn qua mọi bước** đến báo cáo cuối.

### Giải thích

Trong pipeline nhiều agent, subagent nghiên cứu thu thập thông tin, coordinator tổng hợp. Nếu subagent trả về văn xuôi "Nghiên cứu cho thấy thị trường tăng trưởng 12%" mà không kèm nguồn, bước tổng hợp không còn cách nào gắn nguồn vào. Tệ hơn, khi nhiều báo cáo được gộp và viết lại, nguồn dễ bị làm mờ hoặc gán nhầm.

Thiết kế đúng: dùng **bản ghi có cấu trúc** cho mỗi nhận định:

```json
{
  "claim": "Thị trường X tăng trưởng 12% năm 2023",
  "source_url": "https://example.org/report-2023",
  "document": "Industry Outlook 2023",
  "excerpt": "...grew by 12% year over year...",
  "published": "2024-02-10"
}
```

Nguyên tắc:

- Subagent **phải xuất ra cấu trúc này**, không chỉ văn xuôi (liên hệ bài 4.3 về structured output).
- Coordinator **giữ nguyên các trường** khi tổng hợp; câu văn cuối cùng tham chiếu đến bản ghi nguồn (số chú thích hoặc liên kết).
- Đoạn trích (excerpt) cho phép kiểm tra nhanh xem nguồn có thực sự nói điều đó (chống bịa/trích sai).
- Ngày công bố là thành phần cần thiết cho K3.

Không nên chỉ ghi nguồn trong ghi chú ban đầu của researcher rồi viết báo cáo cuối không có tham chiếu, vì người đọc cuối không thể kiểm chứng.

### Keyword

- `provenance` — nguồn gốc thông tin, giúp truy ngược nhận định
- `claim-source mapping` — ánh xạ giữa nhận định và nguồn của nó
- `excerpt` — đoạn trích nguyên văn từ nguồn làm bằng chứng
- `citation` — trích dẫn nguồn trong báo cáo
- `attribution` — gán đúng nguồn cho đúng nhận định

### Bẫy đề thi

- ✗ Subagent trả văn xuôi tổng kết không kèm nguồn ⇒ ✓ Trả bản ghi có cấu trúc: claim, URL, excerpt, ngày
- ✗ Chỉ ghi nguồn ở ghi chú ban đầu, báo cáo cuối không có ⇒ ✓ Giữ ánh xạ xuyên suốt đến văn bản cuối
- ✗ Chỉ ghi tên website chung chung ⇒ ✓ Ghi tài liệu cụ thể, đoạn trích và ngày công bố

### Câu hỏi

#### Q1. Coordinator gộp 3 báo cáo của các subagent thành một bản tổng hợp, nhưng bản cuối không còn chỉ ra nhận định nào đến từ nguồn nào. Gốc rễ thường nằm ở đâu và cách sửa?
- A. Model quên nên cần model lớn hơn
- B. Ghi chú nguồn quá dài nên bị cắt
- C. Subagent trả văn xuôi không có cấu trúc; yêu cầu mỗi nhận định kèm URL, tài liệu, trích đoạn, ngày và giữ nguyên qua bước tổng hợp
- D. Cần giảm số subagent xuống còn một

**Đáp án:** C

**Giải thích:** Provenance chỉ giữ được khi nó là dữ liệu có cấu trúc được truyền đi. A, B là giả thuyết không chạm tới gốc. D giảm quy mô nhưng không giải quyết việc mất nguồn.

#### Q2. Vì sao nên kèm `excerpt` (đoạn trích) trong ánh xạ claim–source?
- A. Để báo cáo dài hơn
- B. Để người đọc và bước kiểm tra xác minh nguồn thực sự hỗ trợ nhận định
- C. Để thay thế URL
- D. Để model không cần đọc nguồn nữa

**Đáp án:** B

**Giải thích:** Đoạn trích là bằng chứng kiểm tra nhanh, giúp phát hiện trích sai hoặc suy diễn quá mức. A không phải mục đích. C: không thay thế, URL vẫn cần để truy nguyên. D sai.

## K2. Nguồn uy tín mâu thuẫn — trình bày cả hai

### Trọng tâm

Khi hai nguồn đáng tin đưa ra số khác nhau, **báo cáo cả hai kèm nguồn và phương pháp**, không tự chọn một bên và không lấy trung bình tùy ý.

### Giải thích

Giả sử hai nghiên cứu cho tăng trưởng 12% và 8%. Có ba hành vi cám dỗ nhưng sai:

- **Chọn một** (vì "nguồn A nghe uy tín hơn") mà không có cơ sở: mất thông tin, thiên lệch.
- **Lấy trung bình 10%**: tạo ra con số không ai đo, không có nguồn nào nói, và che đi sự bất đồng. Trung bình chỉ hợp lý khi có phương pháp luận biện minh.
- **Bỏ qua** nguồn thứ hai.

Cách đúng: trình bày **cả hai nhận định với provenance** và nêu các yếu tố có thể giải thích khác biệt: phương pháp (khảo sát hay số liệu hành chính), mẫu, phạm vi địa lý, định nghĩa chỉ số, ngày công bố. Sau đó người đọc (hoặc người ra quyết định) tự đánh giá.

Coordinator có thể chỉ ra nguồn nào có phương pháp chặt hơn nếu có **căn cứ rõ ràng**, nhưng vẫn không xóa nguồn kia. Trong prompt tổng hợp, nên chỉ thị: "khi nguồn mâu thuẫn, nêu cả hai kèm trích dẫn; không tự giải quyết mâu thuẫn".

Mục tiêu của báo cáo tổng hợp là **trung thực về mức độ chắc chắn**, không phải đưa ra một con số duy nhất cho gọn.

### Keyword

- `conflicting sources` — các nguồn đưa ra thông tin trái ngược
- `methodology` — phương pháp thu thập/tính toán của nguồn
- `arbitrary averaging` — lấy trung bình tùy tiện không có cơ sở
- `source reliability` — độ tin cậy của nguồn
- `uncertainty reporting` — báo cáo mức độ bất định trung thực

### Bẫy đề thi

- ✗ Lấy trung bình hai số liệu thành một con số "ở giữa" ⇒ ✓ Trình bày cả hai kèm nguồn, phương pháp
- ✗ Chọn nguồn nghe uy tín hơn rồi bỏ nguồn còn lại ⇒ ✓ Giữ cả hai, nêu căn cứ nếu có đánh giá độ tin cậy
- ✗ Ẩn mâu thuẫn để báo cáo trông nhất quán ⇒ ✓ Nêu rõ mâu thuẫn và lý do có thể

### Câu hỏi

#### Q1. Hai báo cáo uy tín cho tăng trưởng ngành lần lượt là 12% và 8%. Cách trình bày tốt nhất?
- A. Ghi "khoảng 10%" cho gọn
- B. Chỉ ghi 12% vì cao hơn
- C. Chỉ ghi 8% cho an toàn
- D. Nêu cả hai số với nguồn, phương pháp và ghi chú về yếu tố có thể gây chênh lệch

**Đáp án:** D

**Giải thích:** Giữ trung thực về bất đồng và cung cấp cơ sở để người đọc đánh giá. A tạo số không nguồn. B và C bỏ một nguồn không căn cứ.

#### Q2. Khi nào việc kết hợp (như lấy trung bình) hai số liệu mới có thể chấp nhận?
- A. Luôn luôn, vì làm báo cáo gọn hơn
- B. Khi có một phương pháp luận được biện minh rõ và được nêu trong báo cáo
- C. Khi người viết thấy hợp lý
- D. Không bao giờ, kể cả khi dùng phương pháp meta-analysis hợp lệ

**Đáp án:** B

**Giải thích:** Kết hợp chỉ hợp lệ khi có phương pháp được biện minh và công khai. A, C thiếu căn cứ. D tuyệt đối hóa quá mức, bỏ qua các phương pháp tổng hợp chính đáng.

## K3. So sánh được về thời gian — đừng vội gọi là mâu thuẫn

### Trọng tâm

Hai con số khác nhau có thể đúng cả hai vì **đo ở thời điểm hoặc giai đoạn khác nhau**. Phải đối chiếu ngày/kỳ quan sát trước khi kết luận mâu thuẫn.

### Giải thích

Báo cáo A nói thị phần 18% (dữ liệu 2022), báo cáo B nói 25% (dữ liệu 2024). Đây có thể là **xu hướng**, không phải mâu thuẫn. Gọi nó là mâu thuẫn sẽ khiến người đọc nghĩ nguồn nào đó sai.

Các thứ phải kiểm tra trước khi gắn nhãn "mâu thuẫn":

- **Kỳ quan sát**: năm, quý, giai đoạn; số liệu cuối kỳ hay trung bình kỳ.
- **Ngày công bố khác ngày dữ liệu**: báo cáo công bố 2024 có thể dùng dữ liệu 2022.
- **Định nghĩa và đơn vị**: doanh thu hay số lượng, theo vùng nào, tiền tệ nào.
- **Phạm vi**: toàn cầu hay một khu vực.

Cách xử lý:

1. Ghi cả `published` (ngày công bố) và `data_period` (kỳ dữ liệu) trong ánh xạ claim–source (K1).
2. Nếu chuẩn hóa được (cùng kỳ, cùng đơn vị) thì **chuẩn hóa** rồi so sánh.
3. Nếu không, **chú thích rõ** khác biệt kỳ và trình bày như hai điểm dữ liệu theo thời gian.
4. Chỉ gọi là mâu thuẫn thật khi cùng đối tượng, cùng kỳ mà số khác nhau (rồi áp dụng K2).

Thiếu ngày tháng trong provenance khiến việc phân biệt này không thể thực hiện, do đó ngày công bố là trường bắt buộc.

### Keyword

- `temporal comparability` — khả năng so sánh về mặt thời gian
- `data period` — kỳ mà dữ liệu thực sự đo
- `publication date` — ngày công bố nguồn
- `normalization` — chuẩn hóa về cùng kỳ/đơn vị để so sánh
- `true conflict` — mâu thuẫn thật (cùng đối tượng, cùng kỳ, khác số)

### Bẫy đề thi

- ✗ Mọi con số khác nhau đều là mâu thuẫn ⇒ ✓ Kiểm tra kỳ quan sát, định nghĩa, phạm vi trước
- ✗ Nhầm ngày công bố với kỳ dữ liệu ⇒ ✓ Ghi riêng cả hai
- ✗ Bỏ trường ngày trong provenance cho gọn ⇒ ✓ Giữ ngày để phân biệt xu hướng với mâu thuẫn

### Câu hỏi

#### Q1. Báo cáo A (dữ liệu 2022) cho thị phần 18%, báo cáo B (dữ liệu 2024) cho 25%. Agent tổng hợp nên làm gì?
- A. Nêu mâu thuẫn và yêu cầu người dùng chọn nguồn đúng
- B. Trình bày như hai điểm dữ liệu theo thời gian, chú thích kỳ đo, và không gọi là mâu thuẫn
- C. Bỏ số liệu cũ hơn
- D. Lấy trung bình hai số

**Đáp án:** B

**Giải thích:** Khác biệt có thể do thời gian nên là xu hướng, không phải mâu thuẫn. A gán nhãn mâu thuẫn quá sớm. C bỏ thông tin có giá trị. D tạo con số vô nghĩa.

#### Q2. Vì sao bản ghi claim–source nên có cả `published` và `data_period`?
- A. Vì ngày công bố và kỳ dữ liệu có thể khác nhau, ảnh hưởng đến việc so sánh
- B. Vì hai trường luôn giống nhau
- C. Để tăng độ dài bản ghi
- D. Vì chỉ cần khi nguồn là PDF

**Đáp án:** A

**Giải thích:** Báo cáo xuất bản sau thường dùng dữ liệu cũ hơn; phân biệt hai ngày để so sánh đúng. B, C, D không đúng.

## K4. Trình bày hợp mục đích — bảng cho số liệu, văn xuôi cho sắc thái

### Trọng tâm

Chọn hình thức trình bày theo nội dung: **bảng** cho đối chiếu số liệu giữa nguồn, **văn xuôi có trích dẫn** cho phương pháp và sắc thái. Không dồn mọi thứ vào một đoạn không nguồn.

### Giải thích

Hình thức ảnh hưởng đến khả năng kiểm chứng:

| Loại nội dung | Hình thức phù hợp | Lý do |
|---|---|---|
| Nhiều nguồn, số liệu cùng chỉ số | Bảng so sánh (cột: nguồn, giá trị, kỳ, phương pháp) | Đối chiếu nhanh, thấy chênh lệch |
| Phương pháp, giới hạn, giải thích khác biệt | Văn xuôi có trích dẫn từng ý | Cần diễn giải ngữ cảnh |
| Dữ liệu theo thời gian | Bảng hoặc danh sách theo mốc | Thấy xu hướng |
| Tài liệu kỹ thuật/code | Code block hoặc danh sách | Giữ cấu trúc |

Ví dụ bảng:

| Nguồn | Tăng trưởng | Kỳ dữ liệu | Phương pháp |
|---|---|---|---|
| Report A | 12% | 2023 | Khảo sát doanh nghiệp |
| Report B | 8% | 2023 | Dữ liệu thuế |

kèm đoạn văn giải thích vì sao phương pháp có thể gây chênh lệch.

Điều cần tránh: gộp mọi bằng chứng thành một đoạn văn trơn **không trích dẫn**, khiến độ tin cậy từng ý không thể kiểm tra. Cũng tránh bảng đẹp mà **mất provenance** (không có cột nguồn) hoặc ép mọi thứ thành bảng làm mất sắc thái.

Trong prompt cho agent tổng hợp, hãy nêu rõ định dạng mong muốn cho từng loại nội dung, kèm ví dụ (liên hệ bài 4.1, 4.2).

### Keyword

- `comparison table` — bảng so sánh số liệu giữa các nguồn
- `narrative` — phần văn xuôi giải thích sắc thái, phương pháp
- `output format` — định dạng đầu ra theo mục đích
- `verifiability` — khả năng kiểm chứng của nội dung
- `inline citation` — trích dẫn ngay trong câu

### Bẫy đề thi

- ✗ Dồn mọi bằng chứng vào một đoạn văn không nguồn ⇒ ✓ Bảng cho số liệu, văn xuôi có trích dẫn cho sắc thái
- ✗ Bảng so sánh không có cột nguồn/kỳ ⇒ ✓ Bảng phải giữ provenance
- ✗ Ép nội dung định tính phức tạp vào bảng ⇒ ✓ Dùng văn xuôi cho phần cần diễn giải

### Câu hỏi

#### Q1. Bạn cần trình bày 5 nguồn ước lượng cùng một chỉ số, mỗi nguồn dùng phương pháp khác nhau. Cách trình bày nào tốt nhất?
- A. Một đoạn văn trơn tóm tắt chung
- B. Chỉ liệt kê con số trung bình
- C. Chỉ viết văn xuôi không bảng
- D. Bảng so sánh (nguồn, giá trị, kỳ, phương pháp) kèm đoạn văn diễn giải khác biệt có trích dẫn

**Đáp án:** D

**Giải thích:** Bảng cho đối chiếu số liệu, văn xuôi cho diễn giải. A mất nguồn và khó kiểm. B che bất đồng. C khó đối chiếu số liệu.

#### Q2. Điểm yếu của bảng so sánh chỉ có hai cột "Chỉ số" và "Giá trị" là gì?
- A. Quá dài
- B. Không dùng được cho số liệu
- C. Mất provenance: không biết giá trị của nguồn nào, kỳ nào, nên không kiểm chứng được
- D. Model không đọc được bảng

**Đáp án:** C

**Giải thích:** Bảng phải giữ cột nguồn và kỳ để truy nguyên. A không phải điểm yếu chính. B sai. D sai: model xử lý bảng bình thường.
