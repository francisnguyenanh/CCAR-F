# 4.5 — Batch Processing Strategies

## Tổng quan

**Message Batches API** cho phép gửi nhiều request cùng lúc để xử lý bất đồng bộ với **chi phí thấp hơn** (giảm giá khoảng một nửa so với gọi đồng bộ), đổi lại là **độ trễ không đảm bảo**: kết quả có thể cần tới 24 giờ mới xong (thường nhanh hơn nhưng không có cam kết). Do đó nó hợp với công việc nền, không hợp với luồng có người hoặc pipeline đang chờ.

Đề thi hỏi cách chọn giữa batch và đồng bộ theo **độ trễ chấp nhận được**, các use case điển hình của batch, cách đối chiếu kết quả bằng **`custom_id`**, và giới hạn: một request batch **không thể chạy vòng lặp tool tương tác** giữa chừng. Quy tắc nhớ nhanh: **việc chặn người chờ dùng đồng bộ; việc nền, không gấp dùng batch; luôn khớp kết quả bằng `custom_id`; việc cần tool nhiều lượt không đi batch.**

## K1. Chọn batch hay đồng bộ theo độ trễ (latency fit)

### Trọng tâm

Batch rẻ hơn nhưng không có cam kết thời gian (tối đa khoảng 24 giờ). **Đừng chuyển mọi thứ sang batch chỉ vì rẻ**; việc đang chặn người dùng hoặc quy trình phải ở đường đồng bộ.

### Giải thích

Message Batches API xử lý request theo khả năng của hệ thống, không đảm bảo thời gian trả kết quả. Bạn nhận một ID batch, sau đó kiểm tra trạng thái (poll) và lấy kết quả khi xong. Đổi lại, chi phí token thấp hơn đáng kể so với gọi `messages.create` đồng bộ.

Cách ra quyết định dựa trên câu hỏi: **có ai hoặc hệ thống nào đang chờ kết quả này ngay không?**

| Tình huống | Cách dùng | Lý do |
|---|---|---|
| Pre-merge check: developer chờ để merge PR | Đồng bộ | Chặn người dùng, cần phản hồi trong vài giây-phút |
| Chatbot hỗ trợ khách | Đồng bộ | Tương tác thời gian thực |
| Báo cáo đêm, kết quả cần vào sáng mai | Batch | Có thời gian, tiết kiệm chi phí |

Sai lầm hay gặp là lý luận "batch rẻ hơn nên chuyển tất cả". Với pre-merge review, nếu dùng batch, developer có thể phải chờ hàng giờ mà không có SLA nào. Chi phí tiết kiệm không bù được việc chặn công việc.

Khi dùng batch cho việc có thời hạn, hãy tính sao cho **cửa sổ xử lý lớn nhất (24 giờ)** vẫn nằm trong hạn bạn cần: ví dụ gửi sớm hơn, không gửi sát giờ deadline.

### Keyword

- `Message Batches API` — API gửi nhiều request xử lý bất đồng bộ, chi phí thấp hơn
- `asynchronous processing` — xử lý bất đồng bộ, không chờ kết quả ngay
- `synchronous path` — đường gọi đồng bộ, nhận kết quả ngay trong request
- `cost savings` — tiết kiệm chi phí (khoảng một nửa với batch)
- `processing window` — khoảng thời gian tối đa batch có thể mất (đến khoảng 24 giờ)
- `blocking workflow` — luồng công việc có người hoặc hệ thống đang chờ kết quả

### Bẫy đề thi

- ✗ Chuyển mọi việc sang batch vì rẻ hơn ⇒ ✓ Giữ đường đồng bộ cho việc đang chặn người dùng
- ✗ Giả định batch luôn xong trong vài phút ⇒ ✓ Không có cam kết độ trễ; có thể tới khoảng 24 giờ
- ✗ Gửi batch sát deadline ⇒ ✓ Chừa đủ thời gian cho cửa sổ xử lý tối đa

### Câu hỏi

#### Q1. Công ty muốn giảm chi phí cho việc review code tự động chạy trước khi merge PR, nơi developer chờ kết quả để tiếp tục. Đề xuất nào hợp lý?
- A. Chuyển review pre-merge sang Message Batches vì rẻ hơn
- B. Giữ review pre-merge ở đường đồng bộ; dùng batch cho các tác vụ nền không gấp
- C. Chạy review mỗi tuần một lần bằng batch
- D. Bỏ review tự động

**Đáp án:** B

**Giải thích:** Review pre-merge chặn developer nên cần phản hồi nhanh, batch không cam kết độ trễ. A đánh đổi sai. C làm mất tác dụng kiểm tra trước merge. D bỏ mất giá trị.

#### Q2. Nhận định nào đúng về độ trễ của Message Batches?
- A. Luôn hoàn thành trong 1 phút
- B. Hoàn thành đúng bằng thời gian đồng bộ nhưng rẻ hơn
- C. Không có cam kết độ trễ cố định; có thể mất đến khoảng 24 giờ
- D. Phải chờ đúng 24 giờ

**Đáp án:** C

**Giải thích:** Batch có cửa sổ xử lý tối đa nhưng nhiều batch xong sớm hơn; không có cam kết. A, B sai vì độ trễ không được bảo đảm. D sai vì không phải luôn chờ hết 24 giờ.

## K2. Use case phù hợp cho batch: công việc nền, ngoại tuyến

### Trọng tâm

Batch phù hợp với việc **khối lượng lớn, không cần kết quả ngay**: audit hằng đêm, trích xuất tài liệu ngoại tuyến, báo cáo nợ kỹ thuật, đánh giá hàng loạt.

### Giải thích

Đặc điểm của công việc nên đưa vào batch:

- **Khối lượng lớn**, nhiều item độc lập nhau (mỗi tài liệu, mỗi file là một request riêng).
- **Không có người chờ**: kết quả được dùng sau (sáng hôm sau, cuối tuần).
- **Nhạy cảm chi phí hơn độ trễ**: tiết kiệm lớn khi nhân với hàng nghìn request.

Ví dụ phù hợp: báo cáo nợ kỹ thuật chỉ cần ngày mai; trích xuất thông tin từ kho hợp đồng cũ; chạy bộ đánh giá (evaluation) prompt trên hàng nghìn mẫu; phân loại/gắn nhãn dữ liệu cũ; sinh bản tóm tắt cho kho tài liệu.

Không phù hợp: chatbot, review chặn merge, bất cứ bước nào trong chuỗi mà bước sau phụ thuộc kết quả ngay.

Mẹo thực dụng: có thể **kết hợp**: dùng đồng bộ cho một vài mẫu để thử prompt (nhanh, sửa lặp lại), khi prompt ổn định mới gửi toàn bộ khối lượng bằng batch. Cách này tránh lãng phí cả batch lớn chỉ vì prompt có lỗi.

Dùng đồng bộ cho báo cáo đêm là lãng phí ngân sách: bạn trả giá đầy đủ cho độ trễ thấp mà không ai cần.

### Keyword

- `offline processing` — xử lý ngoại tuyến, không cần kết quả tức thì
- `nightly audit` — kiểm tra hằng đêm chạy nền
- `bulk extraction` — trích xuất hàng loạt từ nhiều tài liệu
- `independent items` — các mục độc lập, xử lý song song không phụ thuộc nhau
- `evaluation run` — chạy đánh giá hàng loạt trên tập mẫu
- `prompt iteration` — thử và chỉnh prompt trên mẫu nhỏ trước khi chạy khối lượng lớn

### Bẫy đề thi

- ✗ Dùng đồng bộ cho báo cáo chỉ cần vào ngày mai ⇒ ✓ Dùng batch để tiết kiệm
- ✗ Gửi cả 50.000 tài liệu bằng batch khi prompt chưa kiểm thử ⇒ ✓ Thử trên mẫu nhỏ trước, rồi mới gửi cả khối
- ✗ Dùng batch cho chuỗi tác vụ phụ thuộc kết quả tức thời ⇒ ✓ Batch cho item độc lập, không chờ

### Câu hỏi

#### Q1. Nhóm cần một báo cáo nợ kỹ thuật cho 800 module, kết quả chỉ được xem vào sáng mai. Phương án tốt nhất?
- A. Gọi đồng bộ từng module để có kết quả ngay
- B. Gửi qua Message Batches và thu kết quả sau
- C. Dùng chatbot tương tác hỏi từng module
- D. Bỏ qua vì khối lượng quá lớn

**Đáp án:** B

**Giải thích:** Khối lượng lớn, độc lập, không gấp là mẫu use case batch. A trả giá đầy đủ cho độ trễ không cần. C kém hiệu quả. D không cần thiết.

#### Q2. Bạn cần trích xuất dữ liệu từ 40.000 hợp đồng cũ bằng một prompt mới chưa thử. Quy trình hợp lý?
- A. Gửi ngay cả 40.000 bằng batch
- B. Gọi đồng bộ từng hợp đồng cho đến hết
- C. Thử prompt trên mẫu nhỏ bằng đường đồng bộ, chỉnh cho ổn, rồi gửi toàn bộ bằng batch
- D. Chỉ thử một hợp đồng rồi gửi batch

**Đáp án:** C

**Giải thích:** Thử mẫu nhỏ tránh lãng phí cả khối lớn nếu prompt lỗi, sau đó batch tiết kiệm chi phí. A rủi ro cao. B tốn chi phí. D mẫu quá ít.

## K3. `custom_id` để đối chiếu kết quả

### Trọng tâm

Đừng giả định kết quả batch trả về theo thứ tự gửi; hãy gán **`custom_id` duy nhất** cho mỗi request và đối chiếu kết quả bằng nó, rồi retry riêng tập item lỗi.

### Giải thích

Mỗi request trong batch có một `custom_id` do bạn đặt. Kết quả được trả về kèm đúng `custom_id` đó, **không bảo đảm cùng thứ tự** với lúc gửi vì các request được xử lý song song. Ghép kết quả bằng chỉ số mảng (item thứ 1 ↔ kết quả thứ 1) là lỗi: dữ liệu của tài liệu này sẽ bị gán cho tài liệu khác mà không có lỗi nào báo ra.

```python
requests = [
    {"custom_id": f"doc-{doc.id}",
     "params": {"model": M, "max_tokens": 1024,
                "messages": [{"role": "user", "content": doc.text}]}}
    for doc in docs
]
# Khi nhận kết quả: lấy result.custom_id -> tra lại doc tương ứng
```

Trong một batch lớn, kết quả từng request có thể khác nhau (thành công, lỗi, hết hạn hoặc bị huỷ). Quy trình chuẩn:

1. Đặt `custom_id` ổn định, có ý nghĩa (ví dụ ID tài liệu trong hệ thống của bạn).
2. Khi lấy kết quả, duyệt theo `custom_id`; tách các item thành công và thất bại.
3. **Chỉ gửi lại tập con thất bại** trong một batch mới, đừng chạy lại toàn bộ.

Thiết kế `custom_id` theo ID thực thể giúp bạn cũng dễ chứng minh tính idempotent (không xử lý trùng) khi retry.

### Keyword

- `custom_id` — mã do bạn đặt cho mỗi request để nối kết quả với đầu vào
- `result ordering` — thứ tự kết quả; không được giả định giống thứ tự gửi
- `partial failure` — một phần item thất bại trong khi phần khác thành công
- `retry failed subset` — chỉ gửi lại các item thất bại
- `idempotency` — xử lý lặp lại không gây hiệu ứng trùng lặp
- `batch id` — mã định danh của cả batch dùng để kiểm tra trạng thái

### Bẫy đề thi

- ✗ Ghép kết quả với đầu vào theo vị trí trong mảng ⇒ ✓ Dùng `custom_id` để đối chiếu
- ✗ Một item lỗi thì chạy lại cả batch ⇒ ✓ Chỉ retry các item thất bại bằng batch mới
- ✗ Dùng `custom_id` ngẫu nhiên không lưu lại ⇒ ✓ Dùng ID ổn định gắn với thực thể nguồn

### Câu hỏi

#### Q1. Sau khi một batch 1.000 tài liệu xong, dev ghép kết quả theo thứ tự trong mảng và phát hiện nhiều tài liệu nhận nhầm thông tin của tài liệu khác. Nguyên nhân và cách sửa?
- A. Model bị lỗi; đổi model
- B. Thứ tự kết quả không đảm bảo; đặt `custom_id` cho mỗi request và đối chiếu theo đó
- C. Giảm số tài liệu mỗi batch
- D. Chuyển sang đồng bộ hoàn toàn

**Đáp án:** B

**Giải thích:** Kết quả batch không bảo đảm thứ tự gửi. A sai nguyên nhân. C và D không giải quyết cơ chế ghép sai.

#### Q2. Trong 1.000 request, 37 request thất bại. Xử lý hợp lý nhất?
- A. Gửi lại cả 1.000 request
- B. Bỏ qua 37 request đó
- C. Dựa trên `custom_id` lọc 37 item lỗi, kiểm tra nguyên nhân (nếu cần chỉnh) rồi gửi riêng trong batch mới
- D. Đợi 24 giờ và hy vọng chúng tự được xử lý

**Đáp án:** C

**Giải thích:** `custom_id` cho phép xác định đúng tập lỗi và chỉ chạy lại phần đó, tiết kiệm chi phí. A lãng phí. B mất dữ liệu. D không có cơ chế tự động như vậy.

## K4. Không có vòng lặp tool tương tác trong một request batch

### Trọng tâm

Mỗi request batch là một lượt hoàn chỉnh, **không thể dừng giữa chừng để chạy tool rồi tiếp tục**. Tác vụ cần gọi tool nhiều lượt phải điều phối đồng bộ.

### Giải thích

Agentic loop (bài 1.1) cần: model yêu cầu `tool_use` → code của bạn chạy tool → gửi `tool_result` → model tiếp tục. Mỗi bước phụ thuộc vào kết quả của bước trước và cần code chạy xen kẽ. Một request trong Message Batches được xử lý bất đồng bộ như **một lần gọi độc lập**: không có chỗ để bạn chèn kết quả tool giữa chừng và để cùng item đó tiếp tục.

Hệ quả thiết kế:

- Nếu phân tích một item cần dữ liệu tươi (ví dụ tra thông tin đơn hàng mới nhất giữa chừng), **không dùng batch cho giai đoạn phụ thuộc tool đó**. Dùng điều phối đồng bộ (vòng lặp agent bình thường).
- Có thể **tách pipeline**: giai đoạn thu thập dữ liệu bằng tool chạy trước (đồng bộ hoặc bằng code), sau đó đưa toàn bộ dữ liệu đã chuẩn bị vào request batch, nơi model chỉ cần phân tích/tổng hợp trong một lượt.
- Một request batch vẫn có thể có tool definition để lấy output có cấu trúc (4.3), nhưng đó là tool "ghi kết quả", không phải vòng lặp tương tác.

Nhớ rằng nếu bạn cần lặp lại nhiều lượt, bạn sẽ phải gửi nhiều batch nối tiếp, mỗi lượt chờ không đảm bảo thời gian, thường không thực tế.

### Keyword

- `interactive tool loop` — vòng lặp gọi tool tương tác xen kẽ giữa model và code
- `single-turn request` — request chỉ một lượt, không tiếp tục sau khi có kết quả tool
- `synchronous orchestration` — điều phối đồng bộ cho phần cần nhiều lượt
- `pipeline staging` — tách pipeline thành giai đoạn chuẩn bị dữ liệu và giai đoạn phân tích
- `data preparation` — chuẩn bị dữ liệu trước khi đưa vào batch
- `multi-turn dependency` — phụ thuộc giữa các lượt, kết quả bước trước quyết định bước sau

### Bẫy đề thi

- ✗ Cho rằng batch xử lý được agent gọi tool nhiều lượt cho mỗi item ⇒ ✓ Giai đoạn cần tool tương tác phải đồng bộ
- ✗ Bỏ hẳn batch vì một số bước cần tool ⇒ ✓ Tách giai đoạn: chuẩn bị dữ liệu trước, phân tích một lượt bằng batch
- ✗ Gửi nhiều batch nối tiếp để mô phỏng vòng lặp ⇒ ✓ Dùng điều phối đồng bộ cho phần nhiều lượt

### Câu hỏi

#### Q1. Mỗi item cần agent tra cứu thông tin đơn hàng mới nhất giữa chừng phân tích rồi mới kết luận. Bạn nên làm gì?
- A. Đưa toàn bộ vào batch, model sẽ tự gọi tool nhiều lần
- B. Gửi nhiều batch liên tiếp để giả lập vòng lặp
- C. Bỏ bước tra cứu
- D. Dùng điều phối đồng bộ cho phần cần tool; hoặc tra cứu dữ liệu trước rồi mới đưa vào batch phân tích một lượt

**Đáp án:** D

**Giải thích:** Batch không có chỗ chèn kết quả tool giữa chừng. D dùng đồng bộ hoặc tách giai đoạn. A sai cơ chế. B chậm và không thực tế. C mất thông tin cần thiết.

#### Q2. Tính chất nào của một request trong Message Batches khiến nó không thích hợp cho agentic loop?
- A. Đắt hơn đồng bộ
- B. Chỉ chạy được với một model
- C. Chỉ hỗ trợ văn bản ngắn
- D. Xử lý bất đồng bộ như một lượt độc lập, không thể xen kẽ chạy tool rồi trả kết quả cho cùng item

**Đáp án:** D

**Giải thích:** Vòng lặp tool cần code của bạn chèn `tool_result` giữa các lượt, điều batch không hỗ trợ. A sai vì batch rẻ hơn. B và C không phải lý do thực tế.
