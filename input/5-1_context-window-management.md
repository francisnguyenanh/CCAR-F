# 5.1 — Context Window Management

## Tổng quan

**Context window** là toàn bộ văn bản model "nhìn thấy" trong một lần gọi: system prompt, lịch sử hội thoại, tool definitions và mọi `tool_result`. Nó có giới hạn cứng, và ngay cả khi chưa chạm giới hạn, chất lượng chú ý của model vẫn giảm khi ngữ cảnh dài và nhiễu. Vì API là stateless, **chính bạn quyết định giữ gì, bỏ gì, đặt ở đâu** trong ngữ cảnh.

Đề thi hay đặt tình huống: hội thoại dài bị tóm tắt làm mất số tiền/mã đơn, tài liệu dài khiến ý quan trọng ở giữa bị bỏ sót, tool trả về quá nhiều trường, hoặc khách có nhiều vấn đề lẫn lộn. Quy tắc nhớ nhanh: **dữ kiện chính xác thì giữ nguyên dạng có cấu trúc; thông tin quan trọng đặt ở đầu/cuối; dữ liệu thô thì cắt bớt; mỗi vấn đề một bản ghi riêng.**

## K1. Persistent case facts — dữ kiện vụ việc không được tóm tắt mất

### Trọng tâm

Mã giao dịch, số tiền, ngày tháng, mã đơn là dữ kiện chính xác: phải lưu trong một **khối có cấu trúc, bất biến** và đưa vào mọi lượt, không để nằm trong đoạn tóm tắt tự nhiên.

### Giải thích

Khi hội thoại dài, cách phổ biến là **tóm tắt** các lượt cũ để tiết kiệm token. Tóm tắt bằng ngôn ngữ tự nhiên là nén có mất mát (lossy): "khách muốn hoàn tiền cho đơn hàng bị lỗi" nghe hợp lý nhưng đã đánh rơi `order #8891`, số tiền `247.83` và ngày mua. Những giá trị này không thể được model "suy ra lại" — nếu mất, model sẽ đoán hoặc hỏi lại khách, gây trải nghiệm tệ và rủi ro sai tiền.

Cách thiết kế đúng:

- Tách riêng một **`case facts block`** (JSON hoặc bảng key-value) gồm các dữ kiện bất biến: customer ID, order ID, số tiền, ngày, trạng thái hiện tại.
- Block này được **chèn lại ở đầu mỗi lượt** (hoặc trong system prompt/đầu message), không bị đưa qua bước tóm tắt.
- Phần diễn biến, cảm xúc, lý lẽ mới được phép tóm tắt tự do.
- Khi có dữ kiện mới (ví dụ phát hiện thêm mã giao dịch), cập nhật block có kiểm soát bằng code chứ không nhờ model "nhớ".

```json
{
  "customer_id": "C-4412",
  "order_id": "8891",
  "refund_amount": 247.83,
  "purchase_date": "2025-03-02",
  "status": "refund_pending_approval"
}
```

Lý do cốt lõi: dữ liệu có cấu trúc, xác định thì phải được xử lý bằng cơ chế xác định, không để phụ thuộc vào việc một bản tóm tắt có giữ lại hay không.

### Keyword

- `case facts block` — khối dữ kiện vụ việc có cấu trúc, đưa vào mọi lượt
- `lossy summarization` — tóm tắt có mất mát thông tin chi tiết
- `immutable facts` — dữ kiện bất biến (mã, số tiền, ngày) không được diễn đạt lại
- `progressive summarization` — tóm tắt dần nhiều lần, mỗi lần mất thêm chi tiết
- `structured context` — ngữ cảnh có cấu trúc (JSON/bảng) thay cho văn xuôi

### Bẫy đề thi

- ✗ Tóm tắt cả hội thoại thành vài câu tự nhiên cho gọn ⇒ ✓ Giữ riêng khối dữ kiện có cấu trúc, chỉ tóm tắt phần diễn biến
- ✗ Dặn model "nhớ kỹ số tiền và mã đơn" trong prompt ⇒ ✓ Đưa dữ kiện vào ngữ cảnh mỗi lượt bằng cơ chế của code
- ✗ Tăng context window là giải quyết được việc mất dữ kiện ⇒ ✓ Vấn đề là cách nén, không chỉ là dung lượng

### Câu hỏi

#### Q1. Trợ lý hỗ trợ khách hàng chạy hội thoại dài, cứ 15 lượt lại tóm tắt lịch sử. Sau vài lần, trợ lý hỏi lại khách "đơn hàng nào và số tiền bao nhiêu?". Thiết kế nào khắc phục tận gốc?
- A. Yêu cầu model viết bản tóm tắt dài hơn và chi tiết hơn
- B. Tách dữ kiện bất biến (mã đơn, số tiền, ngày) vào một khối có cấu trúc, chèn lại mỗi lượt và chỉ tóm tắt phần diễn biến
- C. Tắt hẳn tóm tắt và gửi nguyên toàn bộ lịch sử cho đến khi lỗi tràn ngữ cảnh
- D. Thêm câu "luôn nhớ số tiền và mã đơn" vào system prompt

**Đáp án:** B

**Giải thích:** Dữ kiện chính xác phải được bảo toàn bằng cấu trúc xác định, không phụ thuộc bản tóm tắt. A vẫn là nén tự nhiên nên vẫn có thể rơi dữ kiện qua nhiều lần tóm tắt. C chỉ trì hoãn vấn đề và cuối cùng gây tràn ngữ cảnh. D là chỉ dẫn bằng prompt, không tạo ra dữ liệu để model nhớ.

#### Q2. Khối "case facts" nên được cập nhật như thế nào khi trong hội thoại khách cung cấp thêm mã giao dịch mới?
- A. Để model tự viết lại toàn bộ khối bằng ngôn ngữ tự nhiên sau mỗi lượt
- B. Không cập nhật, vì mã giao dịch nằm sẵn trong lịch sử
- C. Xóa khối cũ và dựa vào bản tóm tắt gần nhất
- D. Code trích xuất giá trị mới và thêm vào khối có cấu trúc, các trường cũ giữ nguyên

**Đáp án:** D

**Giải thích:** Cập nhật có kiểm soát bằng code giữ các trường cũ nguyên vẹn và thêm trường mới đúng định dạng. A để model viết lại có thể làm biến dạng giá trị. B khiến mã giao dịch sẽ bị mất khi lịch sử cũ bị tóm tắt hoặc cắt. C quay lại đúng vấn đề nén có mất mát.

## K2. Lost in the middle — vị trí thông tin trong ngữ cảnh dài

### Trọng tâm

Model chú ý tốt nhất vào **đầu** và **cuối** ngữ cảnh, kém hơn ở **giữa**. Hãy đặt kết luận chính lên đầu, kèm tiêu đề và mục lục, thay vì chôn giữa một khối dài.

### Giải thích

Hiện tượng **lost in the middle**: khi đầu vào dài (hàng chục trang, nhiều tài liệu), thông tin nằm ở giữa có xác suất được sử dụng thấp hơn thông tin ở đầu hoặc cuối. Hậu quả điển hình: một cảnh báo an toàn quan trọng nằm ở trang 40 của 70 trang bị bỏ sót trong bản tổng hợp.

Cách giảm thiểu:

- **Front-load**: đặt phát hiện/kết luận quan trọng nhất ở đầu, phần chi tiết hỗ trợ theo sau.
- Dùng **tiêu đề, section anchors** và mục lục để model định hướng và truy hồi theo cấu trúc.
- Với đầu vào gồm nhiều tài liệu, đặt tài liệu dài ở trên cùng và **câu hỏi/chỉ dẫn ở cuối** giúp model bám đúng nhiệm vụ.
- Với bản tổng hợp do subagent trả về: yêu cầu mỗi subagent đưa **key findings lên đầu**, rồi mới đến chi tiết.
- Chia nhỏ (chunking) tài liệu quá dài, xử lý từng phần có mục tiêu rồi hợp nhất, thay vì dồn tất cả vào một lần.

Điều **không** hiệu quả: thêm nhiều đoạn vào giữa, hoặc chỉ dặn "hãy đọc kỹ toàn bộ". Đây là đặc tính về phân bố chú ý, nên giải pháp là cấu trúc và vị trí, không phải lời nhắc chung chung.

### Keyword

- `lost in the middle` — hiện tượng thông tin ở giữa ngữ cảnh dài bị chú ý kém
- `front-loading` — đặt thông tin quan trọng nhất lên đầu
- `section anchors` — tiêu đề/mốc định hướng giúp truy hồi thông tin
- `attention distribution` — phân bố sự chú ý của model trên toàn bộ ngữ cảnh
- `chunking` — chia nhỏ tài liệu dài để xử lý từng phần

### Bẫy đề thi

- ✗ Thêm càng nhiều chi tiết vào giữa càng đầy đủ ⇒ ✓ Phát hiện then chốt nên ở đầu, chi tiết có tiêu đề rõ ràng
- ✗ Chỉ cần dặn "đọc kỹ từng trang" là đủ ⇒ ✓ Dùng vị trí và cấu trúc, vì đây là đặc tính của model chứ không phải thiếu nỗ lực
- ✗ Cửa sổ ngữ cảnh lớn nghĩa là mọi thông tin được dùng đều như nhau ⇒ ✓ Dung lượng lớn không đảm bảo độ chú ý đồng đều

### Câu hỏi

#### Q1. Một agent tóm tắt 70 trang báo cáo an toàn nhưng bản tổng hợp bỏ sót một cảnh báo nghiêm trọng nằm ở giữa. Cải tiến nào hợp lý nhất?
- A. Chèn thêm nhiều đoạn giải thích vào giữa tài liệu cho rõ nghĩa
- B. Tăng nhiệt độ để model khám phá nhiều chi tiết hơn
- C. Yêu cầu đầu ra theo cấu trúc có phát hiện quan trọng ở đầu, đồng thời chia tài liệu thành các phần có tiêu đề để xử lý
- D. Chỉ gửi trang đầu và trang cuối của báo cáo

**Đáp án:** C

**Giải thích:** Vị trí và cấu trúc là công cụ trực tiếp để chống lost in the middle; chia phần giúp từng phần được chú ý đầy đủ. A làm giữa tài liệu dài thêm. B không liên quan đến phân bố chú ý. D vứt bỏ phần chứa cảnh báo.

#### Q2. Bạn đưa cho model 5 tài liệu dài kèm một câu hỏi phân tích. Cách bố trí prompt nào thường cho kết quả tốt hơn?
- A. Câu hỏi ở giữa các tài liệu để model đọc lướt qua
- B. Tài liệu dài ở trên, câu hỏi và chỉ dẫn nhiệm vụ đặt ở cuối
- C. Câu hỏi chỉ xuất hiện ở đầu và không lặp lại
- D. Xáo trộn ngẫu nhiên đoạn văn của các tài liệu

**Đáp án:** B

**Giải thích:** Đặt chỉ dẫn gần cuối giúp nhiệm vụ nằm ở vùng được chú ý mạnh khi sinh câu trả lời. A đặt yêu cầu ở vùng yếu. C để chỉ dẫn cách xa điểm sinh. D phá cấu trúc tài liệu, làm giảm khả năng truy hồi.

## K3. Cắt tỉa `tool_result` — giữ trường cần thiết

### Trọng tâm

Tool backend thường trả về rất nhiều trường. Hãy **lọc ở tầng code** để chỉ đưa vào ngữ cảnh những trường cần cho tác vụ hiện tại, thay vì tích lũy dữ liệu thô mãi mãi.

### Giải thích

Mỗi `tool_result` được gửi lại ở mọi lượt kế tiếp, nên một tool trả 40 trường (địa chỉ kho, mã nội bộ, log, audit trail...) khi tác vụ hoàn tiền chỉ cần 5 trường sẽ làm ngữ cảnh phình rất nhanh qua nhiều lượt. Hậu quả: tốn token, chậm, tăng chi phí, và **tín hiệu bị loãng** nên model dễ chú ý nhầm trường không liên quan.

Nguyên tắc:

- Thêm **lớp hậu xử lý (post-processing hook)** giữa tool và model: chỉ giữ các trường cần (ví dụ `order_id`, `status`, `total`, `delivery_date`, `return_eligible`).
- Giữ lại thông tin **nguồn gốc (provenance)** tối thiểu để có thể truy lại bản ghi gốc (ví dụ ID bản ghi hoặc timestamp), thay vì giữ toàn bộ payload.
- Với kết quả cũ không còn cần, có thể thay bằng bản rút gọn hoặc loại bỏ; dữ kiện bất biến vẫn nằm trong case facts block (K1).
- Cắt tỉa theo **nhu cầu tác vụ**, không cắt theo cảm tính: trường cần cho quyết định tiếp theo phải còn nguyên.

Không nên dựa vào model để tự lọc khi chính việc nhận dữ liệu thừa đã làm tốn ngữ cảnh. Lọc trước khi đưa vào là rẻ và xác định.

### Keyword

- `tool result trimming` — cắt tỉa kết quả tool trước khi đưa vào ngữ cảnh
- `post-processing hook` — bước xử lý sau khi tool chạy, trước khi trả cho model
- `context bloat` — ngữ cảnh phình to do dữ liệu thừa
- `field projection` — chỉ chọn những trường cần dùng từ bản ghi
- `provenance` — thông tin nguồn gốc giúp truy lại dữ liệu gốc

### Bẫy đề thi

- ✗ Giữ nguyên toàn bộ output thô để "không mất gì" ⇒ ✓ Lọc còn các trường cần thiết, giữ ID để truy nguyên
- ✗ Đợi ngữ cảnh đầy rồi mới tính chuyện cắt ⇒ ✓ Cắt ngay ở tầng tool result
- ✗ Cắt bớt trường ngẫu nhiên để tiết kiệm token ⇒ ✓ Cắt theo nhu cầu quyết định, giữ trường then chốt

### Câu hỏi

#### Q1. Tool `get_order` trả về 40 trường, trong khi quy trình hoàn tiền chỉ dùng 5. Sau 10 lượt, ngữ cảnh đã rất lớn và agent bắt đầu trả lời lạc đề. Giải pháp phù hợp?
- A. Tăng `max_tokens` để chứa được response dài hơn
- B. Chuyển sang model có context window lớn hơn mà vẫn giữ nguyên dữ liệu
- C. Thêm lời nhắc trong prompt: "bỏ qua các trường không liên quan"
- D. Thêm bước lọc ở tầng code để chỉ đưa 5 trường cần thiết (và ID bản ghi) vào `tool_result`

**Đáp án:** D

**Giải thích:** Lọc trước khi vào ngữ cảnh giảm token và nhiễu một cách xác định. A liên quan đến output, không giảm input. B chỉ dời vấn đề, nhiễu vẫn còn. C vẫn buộc model đọc và tiêu tốn ngữ cảnh cho dữ liệu thừa.

#### Q2. Khi cắt tỉa kết quả tool, điều nào sau đây là sai lầm?
- A. Bỏ các trường audit nội bộ không dùng trong quyết định
- B. Giữ ID bản ghi để truy lại dữ liệu gốc khi cần
- C. Xóa luôn trường `return_eligible` vì thấy nhiều trường quá, dù bước tiếp theo cần nó để quyết định
- D. Rút gọn kết quả cũ không còn dùng đến

**Đáp án:** C

**Giải thích:** Cắt tỉa phải dựa trên nhu cầu quyết định; trường then chốt cho bước kế tiếp phải được giữ. A, B, D đều là thực hành đúng: bỏ dữ liệu thừa, giữ khả năng truy nguyên và gọn kết quả cũ.

## K4. Nhiều vấn đề trong một hội thoại — bản ghi có cấu trúc riêng

### Trọng tâm

Khi một khách nêu nhiều yêu cầu (đổi trả + sửa địa chỉ giao hàng), hãy lưu **mỗi vấn đề thành một bản ghi riêng** với ID, trạng thái, dữ kiện của nó, thay vì gộp thành "khách có vấn đề".

### Giải thích

Hội thoại thực tế hiếm khi chỉ có một vấn đề. Nếu tóm tắt cả hai yêu cầu thành một câu chung, model sẽ trộn lẫn: áp dụng chính sách đổi trả cho yêu cầu đổi địa chỉ, hoặc báo "đã xử lý xong" khi mới giải quyết một nửa.

Thiết kế tốt: duy trì danh sách **issue records**:

```json
[
  {"issue_id": "I-1", "type": "return", "order_id": "8891",
   "amount": 247.83, "status": "approved"},
  {"issue_id": "I-2", "type": "address_correction", "order_id": "8902",
   "status": "awaiting_customer_confirmation"}
]
```

Lợi ích:

- Mỗi vấn đề có **vòng đời riêng** (open, pending, resolved), không bị lẫn.
- Dữ kiện không bị gán nhầm giữa các vấn đề (số tiền hoàn của I-1 không thể bị dùng cho I-2).
- Khi chuyển cho người xử lý hoặc tóm tắt cuối hội thoại, có thể liệt kê chính xác từng việc đã/chưa xong.
- Có thể kiểm tra bằng code: chỉ kết thúc hội thoại khi tất cả record ở trạng thái cuối.

Đây là sự mở rộng của K1: dữ kiện bất biến cũng cần được tổ chức theo **từng vấn đề**, không chỉ theo khách hàng.

### Keyword

- `issue record` — bản ghi riêng cho từng vấn đề của khách
- `multi-concern case` — vụ việc có nhiều vấn đề cùng lúc
- `status tracking` — theo dõi trạng thái từng vấn đề
- `state object` — đối tượng trạng thái do code quản lý, truyền vào ngữ cảnh
- `fact attribution` — gán dữ kiện đúng vào vấn đề tương ứng

### Bẫy đề thi

- ✗ Tóm tắt nhiều vấn đề thành một câu chung "khách cần hỗ trợ" ⇒ ✓ Mỗi vấn đề một bản ghi với ID và trạng thái riêng
- ✗ Coi hội thoại xong khi giải quyết vấn đề đầu tiên ⇒ ✓ Chỉ kết thúc khi mọi record đạt trạng thái cuối
- ✗ Dùng chung một số tiền/mã đơn cho mọi vấn đề ⇒ ✓ Gắn dữ kiện vào đúng record

### Câu hỏi

#### Q1. Khách vừa yêu cầu trả hàng đơn #8891 vừa muốn sửa địa chỉ cho đơn #8902. Sau khi xử lý trả hàng, agent chào kết thúc và quên vụ địa chỉ. Thiết kế nào ngăn lỗi này tốt nhất?
- A. Duy trì danh sách issue record, mỗi vấn đề có trạng thái riêng, và chỉ kết thúc khi tất cả đã giải quyết
- B. Yêu cầu khách chỉ nêu một vấn đề mỗi hội thoại
- C. Tóm tắt "khách có hai vấn đề" vào đầu hội thoại
- D. Tăng nhiệt độ để model nhớ nhiều việc hơn

**Đáp án:** A

**Giải thích:** Bản ghi có cấu trúc cho phép code kiểm tra các việc còn mở một cách xác định. B làm xấu trải nghiệm và không phải giải pháp kỹ thuật. C là tóm tắt chung, không có trạng thái. D không có cơ sở cơ chế.

#### Q2. Trong hội thoại đa vấn đề, agent áp số tiền hoàn của đơn #8891 vào yêu cầu đổi địa chỉ của đơn #8902. Nguyên nhân khả dĩ nhất?
- A. Context window quá nhỏ
- B. Dữ kiện của các vấn đề bị gộp trong một bản tóm tắt chung nên bị gán nhầm
- C. Tool trả về quá ít trường
- D. Thiếu iteration cap trong vòng lặp

**Đáp án:** B

**Giải thích:** Khi không tách record, dữ kiện dùng chung một vùng văn xuôi nên dễ bị gán nhầm. A không giải thích việc gán sai. C ngược với thực tế (thiếu cấu trúc chứ không phải thiếu trường). D là lưới an toàn vòng lặp, không liên quan đến gán dữ kiện.
