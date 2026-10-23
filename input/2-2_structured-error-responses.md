# 2.2 — Structured Error Responses

## Tổng quan

Tool nào rồi cũng có lúc lỗi. Câu hỏi là **model có biết lỗi gì và nên làm gì tiếp theo không**. Nếu tool chỉ trả "Operation failed" (hoặc tệ hơn, trả danh sách rỗng như thể thành công), model sẽ đoán mò: thử lại vô tận, bịa kết quả, hoặc kết luận sai với người dùng.

Bài này dạy cách phân loại lỗi (transient, validation, business, permission), cách báo lỗi bằng `is_error` kèm metadata có cấu trúc, và cách phân biệt **thành công nhưng rỗng** với **truy cập thất bại**. Quy tắc nhớ nhanh: **mỗi loại lỗi có một hành động xử lý khác nhau, và lỗi phải nói rõ nó thuộc loại nào.**

## K1. Lỗi tạm thời (transient) và lỗi do input (validation)

### Trọng tâm

Lỗi **transient** (timeout, dịch vụ quá tải) có thể thử lại **y nguyên** sau một lúc. Lỗi **validation** (input sai định dạng) thử lại y nguyên sẽ **luôn thất bại**; phải sửa input trước.

### Giải thích

Hai loại lỗi này nhìn bề ngoài đều là "request thất bại", nhưng cách xử lý đối nghịch nhau:

| Loại | Ví dụ | Nên làm | Retry y nguyên? |
|---|---|---|---|
| Transient | Order API timeout, 503, rate limit | Retry với **backoff** (chờ tăng dần), giới hạn số lần | Có |
| Validation | Mã đơn thiếu tiền tố `#`, ngày sai định dạng | Sửa input theo thông báo lỗi rồi gọi lại | Không |

Với lỗi transient, lý do thử lại hợp lý là nguyên nhân nằm ở **hệ thống**, không phải ở request; vài giây sau có thể ổn. Cần **exponential backoff** và **giới hạn số lần** để không làm sập thêm dịch vụ đang quá tải.

Với lỗi validation, nguyên nhân nằm ở **dữ liệu bạn gửi**. Nếu tool trả thông điệp rõ như "order_id phải bắt đầu bằng `#`, ví dụ `#4412`", model có thể tự sửa và gọi lại thành công ngay lượt kế tiếp. Nếu lặp lại cùng ID sai, vòng lặp sẽ đốt token mà không bao giờ thành công.

Vì vậy tool nên trả thông tin **đủ để model phân loại**: lỗi thuộc nhóm nào, có nên retry không, và nếu là validation thì sai ở trường nào. Đây là nền tảng cho K3.

### Keyword

- `transient error` — lỗi tạm thời, có thể tự hết (timeout, 503)
- `validation error` — lỗi do dữ liệu đầu vào sai định dạng/giá trị
- `exponential backoff` — chờ lâu dần giữa các lần thử lại
- `retryable` — có thể thử lại mà không đổi gì
- `idempotent retry` — thử lại an toàn vì không gây tác dụng phụ lặp
- `corrective retry` — sửa input rồi mới thử lại

### Bẫy đề thi

- ✗ Gặp lỗi nào cũng retry y nguyên ⇒ ✓ Chỉ retry y nguyên với lỗi transient; validation phải sửa input
- ✗ Retry không giới hạn, không backoff ⇒ ✓ Backoff và giới hạn số lần
- ✗ Coi lỗi định dạng ID là lỗi hệ thống ⇒ ✓ Đó là lỗi input; đọc thông báo và sửa

### Câu hỏi

#### Q1. Tool `get_order` trả lỗi "order_id must start with #" khi model truyền `4412`. Hành vi đúng của agent?
- A. Retry y nguyên 3 lần với backoff
- B. Báo cho khách rằng hệ thống đang gặp sự cố
- C. Sửa thành `#4412` theo thông báo lỗi rồi gọi lại
- D. Chuyển ngay cho nhân viên hỗ trợ

**Đáp án:** C

**Giải thích:** Đây là lỗi validation có hướng dẫn sửa rõ ràng; sửa input rồi gọi lại là cách nhanh nhất. A sẽ thất bại lặp lại. B sai vì không phải lỗi hệ thống. D leo thang không cần thiết.

#### Q2. API đơn hàng trả timeout lúc cao điểm, truy vấn của model hoàn toàn hợp lệ. Xử lý phù hợp nhất?
- A. Retry với backoff và giới hạn số lần; nếu vẫn lỗi thì báo rõ
- B. Đổi mã đơn thành định dạng khác rồi gọi lại
- C. Trả danh sách rỗng cho model để tiếp tục
- D. Retry liên tục không chờ cho đến khi thành công

**Đáp án:** A

**Giải thích:** Timeout là transient; backoff giảm áp lực và có giới hạn để không treo. B vô nghĩa vì input đúng. C che giấu lỗi. D có thể làm sập dịch vụ thêm.

## K2. Lỗi nghiệp vụ (business) và lỗi quyền (permission)

### Trọng tâm

Lỗi **business** (vi phạm chính sách) và **permission** (không có quyền) **không tự hết bằng retry**. Cần phương án thay thế, **leo thang (escalate)** hoặc dùng danh tính có quyền.

### Giải thích

Hai loại này khác transient vì **kết quả sẽ giống hệt** dù thử bao nhiêu lần:

- **Business error**: yêu cầu hợp lệ về kỹ thuật nhưng **vi phạm quy tắc nghiệp vụ**. Ví dụ hoàn tiền 5.000 USD trong khi hạn mức tự động là 500 USD; đơn đã quá hạn đổi trả. Hướng xử lý: giải thích cho khách, đề xuất phương án nằm trong chính sách (hoàn một phần, voucher), hoặc **chuyển người có thẩm quyền**.
- **Permission error**: danh tính hiện tại không có quyền (ví dụ vai trò support không được xem dữ liệu tài chính). Hướng xử lý: không cố "lách"; yêu cầu **principal được cấp quyền** hoặc leo thang.

Thông điệp lỗi nên cho model biết đây là loại **không retry được** và gợi ý bước tiếp theo (ví dụ `"escalate_to": "finance_approver"`). Nhờ đó model không lặp lại request, không tìm cách vòng qua rào chắn (như đổi sang tool khác để làm điều bị cấm) và có thể phản hồi trung thực với người dùng.

Điểm kiến trúc: **chính sách phải được cưỡng chế ở phía tool/backend**, không chỉ dặn trong prompt. Tool từ chối có cấu trúc là "lan can" xác định, trong khi prompt chỉ là lời nhắc xác suất.

### Keyword

- `business rule error` — lỗi vi phạm quy tắc nghiệp vụ/chính sách
- `permission error` — lỗi không đủ quyền truy cập
- `escalation` — chuyển cho người/hệ thống có thẩm quyền xử lý
- `authorized principal` — danh tính (người/service) được cấp quyền thực hiện
- `non-retryable` — không nên thử lại vì kết quả không đổi
- `policy threshold` — ngưỡng chính sách (ví dụ hạn mức hoàn tiền tự động)

### Bẫy đề thi

- ✗ Retry y hệt request bị từ chối vì chính sách ⇒ ✓ Đề xuất phương án trong chính sách hoặc leo thang
- ✗ Thử đổi tool/tham số để lách lỗi quyền ⇒ ✓ Dùng danh tính được cấp quyền hoặc escalate
- ✗ Chỉ dặn trong prompt "không hoàn quá 500 USD" ⇒ ✓ Backend/tool cưỡng chế ngưỡng và trả lỗi có cấu trúc

### Câu hỏi

#### Q1. Agent gọi `issue_refund` cho 2.400 USD, tool trả lỗi "exceeds auto-approval limit (500)". Phản hồi tốt nhất?
- A. Retry sau 30 giây vì có thể là lỗi tạm
- B. Chia thành 5 yêu cầu hoàn tiền nhỏ để vượt ngưỡng
- C. Báo hoàn tiền thành công để khách yên tâm
- D. Giải thích giới hạn và chuyển yêu cầu cho người có thẩm quyền duyệt

**Đáp án:** D

**Giải thích:** Lỗi business không tự hết; hướng đúng là escalate theo chính sách. A vô ích. B là lách chính sách. C là thông tin sai.

#### Q2. Tool tra hồ sơ lương trả lỗi permission vì agent chạy bằng vai trò support. Hành động đúng?
- A. Thử lại với cùng vai trò nhiều lần
- B. Dùng tool khác cũng đọc được dữ liệu đó để vòng qua
- C. Báo không đủ quyền và yêu cầu/escalate sang danh tính có quyền phù hợp
- D. Bỏ qua và trả lời bằng dữ liệu phỏng đoán

**Đáp án:** C

**Giải thích:** Lỗi quyền cần giải quyết bằng cấp quyền hợp lệ hoặc leo thang. A cho kết quả lặp lại. B vi phạm ranh giới bảo mật. D là bịa dữ liệu.

## K3. `is_error` và metadata có cấu trúc

### Trọng tâm

Khi tool lỗi, hãy đánh dấu `is_error: true` và trả **loại lỗi, khả năng retry, mô tả hành động tiếp theo** theo cấu trúc. Đừng trả chuỗi chung chung hay trả như thể thành công.

### Giải thích

Trong Messages API, kết quả tool đi trong block `tool_result`. Block này có cờ `is_error` để báo lỗi (với MCP, kết quả tool cũng có cờ `isError`). Cờ này cho model biết nội dung là **thông báo lỗi**, không phải dữ liệu bình thường.

Hai sai lầm phổ biến:

1. **Nuốt lỗi và trả chuỗi vô nghĩa** như `"Operation failed"` hoặc trả `[]` khi DB không truy cập được. Model sẽ coi đó là "không có bản ghi" và kết luận sai ("khách chưa từng mua hàng").
2. **Trả lỗi nhưng không phân loại**, khiến model không biết nên retry, sửa input hay escalate.

Một lỗi có cấu trúc tốt, ví dụ:

```json
{
  "is_error": true,
  "content": {
    "category": "transient",
    "retryable": true,
    "message": "Orders DB timed out after 5s",
    "suggested_action": "retry_with_backoff"
  }
}
```

Các trường hữu ích: `category` (transient/validation/business/permission), `retryable`, thông điệp dễ hiểu, hành động gợi ý, và (nếu an toàn) chi tiết sai ở trường nào. Đừng lộ thông tin nhạy cảm như stack trace hay chuỗi kết nối.

Lưu ý: khi lỗi vẫn phải gửi `tool_result` tương ứng với `tool_use_id`, nếu bỏ qua, vòng lặp agent sẽ hỏng (xem bài 1.1).

### Keyword

- `is_error` — cờ trong `tool_result` báo kết quả là lỗi
- `isError` — cờ tương ứng trong kết quả tool của MCP
- `error category` — phân loại lỗi (transient, validation, business, permission)
- `retryable flag` — trường báo lỗi có nên retry không
- `actionable message` — thông điệp nêu rõ bước tiếp theo
- `structured error` — lỗi trả dưới dạng cấu trúc, máy đọc được

### Bẫy đề thi

- ✗ Trả "Operation failed" chung chung ⇒ ✓ Trả `is_error` cùng category, retryable và hành động gợi ý
- ✗ Trả danh sách rỗng khi DB không truy cập được ⇒ ✓ Báo lỗi truy cập, không giả làm kết quả rỗng
- ✗ Lộ stack trace đầy đủ cho model/người dùng ⇒ ✓ Thông điệp hữu ích nhưng không lộ chi tiết nhạy cảm

### Câu hỏi

#### Q1. Khi database không khả dụng, tool trả `{"records": []}` với trạng thái thành công. Agent báo cho khách "bạn chưa có đơn nào". Cách sửa tốt nhất?
- A. Dặn model trong prompt rằng danh sách rỗng đôi khi là lỗi
- B. Tool trả `is_error: true` với category và retryable rõ ràng khi truy cập DB thất bại
- C. Bắt model gọi lại tool 3 lần mỗi lần tra cứu
- D. Thêm bước kiểm tra độ dài văn bản trả lời

**Đáp án:** B

**Giải thích:** Lỗi truy cập phải được biểu diễn là lỗi có cấu trúc để model không nhầm với dữ liệu rỗng. A dựa vào suy đoán. C tốn tài nguyên và không phân biệt được. D không liên quan.

#### Q2. Trường nào cung cấp giá trị lớn nhất để model quyết định retry hay không trong kết quả lỗi?
- A. Chuỗi stack trace đầy đủ
- B. Thời gian hệ thống của server
- C. Tên máy chủ nội bộ
- D. Trường `category` kèm cờ `retryable` và `suggested_action`

**Đáp án:** D

**Giải thích:** Model cần phân loại và hành động tiếp theo. A, B, C không giúp quyết định retry và còn có thể lộ thông tin nội bộ.

## K4. Rỗng thành công khác với truy cập thất bại

### Trọng tâm

Truy vấn chạy xong nhưng **0 kết quả** là **thành công** (không retry). Truy vấn **không thực thi được** là **lỗi**. Hai tình huống phải được phân biệt rõ trong response.

### Giải thích

Xét tool `find_customer(email)`:

- Trường hợp A: DB truy cập bình thường, không có khách nào khớp email → đây là **câu trả lời hợp lệ**: "không tồn tại". Trả `is_error: false` cùng `result_count: 0` (hoặc mảng rỗng có ngữ nghĩa rõ ràng). Model nên báo "không tìm thấy" hoặc xin thông tin khác (kiểm tra chính tả email, thử số điện thoại), **không retry** vì kết quả sẽ y hệt.
- Trường hợp B: DB timeout → **không có câu trả lời**. Phải trả lỗi (`is_error: true`, transient). Model có thể retry hoặc báo hệ thống tạm thời gián đoạn.

Nếu gộp chung hai trường hợp:

- Coi rỗng là lỗi → agent retry vô ích, hoặc báo "hệ thống lỗi" sai sự thật.
- Coi lỗi là rỗng → agent kết luận "không có dữ liệu" và có thể đưa ra quyết định sai (ví dụ cho khách đăng ký tài khoản trùng).

Thêm trường `result_count` hoặc `status` làm response tự mô tả, giảm đoán mò. Đây cũng là một dạng của nguyên tắc rộng hơn trong hệ thống agent: **không để thất bại bị che giấu thành thành công**, và **không để thành công bị coi là thất bại**.

### Keyword

- `empty result` — kết quả rỗng sau khi truy vấn chạy thành công
- `access failure` — thất bại khi truy cập (timeout, mất kết nối)
- `result_count` — số bản ghi trả về; giúp phân biệt 0 kết quả với lỗi
- `valid empty` — kết quả rỗng hợp lệ, không phải lỗi
- `silent failure` — thất bại bị che giấu thành thành công
- `false negative` — kết luận "không có" sai do lỗi bị coi là rỗng

### Bẫy đề thi

- ✗ Mảng rỗng luôn là lỗi nên retry ⇒ ✓ Rỗng sau truy vấn thành công là kết quả hợp lệ, không retry
- ✗ Timeout thì trả `[]` cho gọn ⇒ ✓ Timeout là lỗi, phải báo `is_error`
- ✗ Dùng cùng một dạng response cho cả hai trường hợp ⇒ ✓ Phân biệt bằng `is_error` và `result_count`

### Câu hỏi

#### Q1. `find_customer` trả `[]` và `is_error: false`, kèm `result_count: 0`, DB hoạt động bình thường. Agent nên làm gì?
- A. Retry với backoff vì rỗng là dấu hiệu timeout
- B. Báo là hệ thống đang lỗi
- C. Thông báo không tìm thấy khách khớp và đề nghị người dùng kiểm tra thông tin hoặc thử định danh khác
- D. Tự tạo hồ sơ khách mới không hỏi

**Đáp án:** C

**Giải thích:** Rỗng hợp lệ là câu trả lời; retry cho kết quả giống hệt. A và B hiểu sai thành lỗi. D tự ý thay đổi dữ liệu.

#### Q2. Tool kiểm tra kho trả `[]` cả khi tìm thấy 0 mặt hàng lẫn khi kết nối kho thất bại. Hệ quả đáng lo nhất?
- A. Model không thể phân biệt hết hàng thật với lỗi hệ thống nên có thể báo sai
- B. Tool chạy chậm hơn
- C. Response lớn hơn
- D. Model không gọi tool nữa

**Đáp án:** A

**Giải thích:** Gộp hai trường hợp gây kết luận sai (false negative hoặc retry vô ích). B, C, D không phải hệ quả chính.
