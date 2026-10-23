# 5.3 — Error Propagation in Multi-Agent Systems

## Tổng quan

Trong hệ thống multi-agent, coordinator giao việc cho nhiều subagent. Lỗi ở một subagent (timeout, rate limit, nguồn không truy cập được) có thể lan ra toàn pipeline theo hai kiểu xấu: **thất bại bị giấu** (trả kết quả rỗng như thể thành công, bản tổng hợp sai mà không ai biết) hoặc **thất bại lan tràn** (một lỗi làm sập cả pipeline và vứt bỏ phần việc đã xong).

Đề thi kiểm tra khả năng thiết kế đường đi của lỗi: subagent phải trả về **ngữ cảnh lỗi có cấu trúc**, coordinator phải **phục hồi cục bộ** và chỉ báo lên khi cần, **kết quả rỗng khác với lỗi truy cập**, và bản tổng hợp cuối phải **công bố khoảng trống về độ phủ**. Quy tắc nhớ nhanh: **không giấu lỗi, không phóng đại lỗi, luôn minh bạch về phần thiếu.**

## K1. Ngữ cảnh lỗi có cấu trúc từ subagent

### Trọng tâm

Subagent khi thất bại phải trả về **loại lỗi, hành động đã thử, kết quả một phần, và phương án thay thế** — không phải chuỗi lỗi chung chung và càng không phải kết quả rỗng giả danh thành công.

### Giải thích

Coordinator cần thông tin đủ để **quyết định tiếp theo**: thử lại, đổi nguồn, chấp nhận kết quả thiếu hay báo người dùng. Một thông báo như "Search failed" hay một danh sách rỗng không cho phép quyết định nào, và còn tệ hơn nếu rỗng bị hiểu là "không có kết quả".

Cấu trúc nên trả về:

```json
{
  "status": "partial_failure",
  "error_category": "timeout",
  "is_retryable": true,
  "attempted": "search_papers(query='solid-state battery', source='arxiv')",
  "partial_results": [{"title": "Paper A"}, {"title": "Paper B"}, {"title": "Paper C"}],
  "coverage": "3 of 5 expected papers",
  "alternatives": ["retry with narrower date range", "use backup source"]
}
```

Các thành phần và lý do:

- **error_category** (timeout, rate_limit, auth, not_found...) giúp coordinator chọn chiến lược khác nhau cho từng loại.
- **is_retryable** tránh thử lại vô ích với lỗi vĩnh viễn (ví dụ thiếu quyền).
- **attempted** cho biết chính xác thao tác nào thất bại.
- **partial_results** giữ lại giá trị đã làm được, không phí công.
- **alternatives** gợi ý hướng đi tiếp.

Liên hệ với bài 2.2 (structured error responses): cùng nguyên tắc nhưng ở cấp subagent trả lên coordinator.

### Keyword

- `structured error context` — ngữ cảnh lỗi có cấu trúc để ra quyết định
- `error category` — phân loại lỗi (timeout, rate limit, auth...)
- `is_retryable` — cờ cho biết lỗi có thể thử lại
- `partial results` — kết quả một phần đã thu thập trước khi lỗi
- `silent failure` — thất bại không báo, bị hiểu nhầm là thành công

### Bẫy đề thi

- ✗ Subagent trả danh sách rỗng khi gặp lỗi để pipeline "chạy tiếp êm" ⇒ ✓ Trả trạng thái lỗi kèm loại lỗi và kết quả một phần
- ✗ Trả thông báo lỗi chung "operation failed" ⇒ ✓ Trả đủ category, hành động đã thử, phương án thay thế
- ✗ Vứt bỏ kết quả một phần khi có lỗi ⇒ ✓ Giữ partial results kèm chú thích độ phủ

### Câu hỏi

#### Q1. Một subagent tìm bài báo hết thời gian chờ sau khi đã lấy được 3 trong 5 bài. Nó nên trả gì cho coordinator?
- A. Danh sách rỗng, để coordinator tự thử lại
- B. Chuỗi "Search failed" cho ngắn gọn
- C. Ngoại lệ làm dừng toàn bộ pipeline
- D. Trạng thái partial failure, loại lỗi timeout, 3 bài đã có, độ phủ 3/5 và các hướng thử lại

**Đáp án:** D

**Giải thích:** Coordinator cần đầy đủ thông tin để quyết định: thử lại, đổi nguồn hay chấp nhận. A giấu việc thiếu và không giữ giá trị đã có. B không đủ ngữ cảnh để ra quyết định. C vứt bỏ phần việc đã làm.

#### Q2. Trường `is_retryable` trong phản hồi lỗi có vai trò chính gì?
- A. Giúp coordinator tránh thử lại vô ích với lỗi vĩnh viễn và chủ động thử lại lỗi tạm thời
- B. Cho biết model nào đã gây ra lỗi
- C. Thay thế hoàn toàn trường `error_category`
- D. Tự động sửa lỗi trong tool

**Đáp án:** A

**Giải thích:** Cờ này giúp chọn chiến lược đúng: lỗi tạm thời có thể retry, lỗi vĩnh viễn thì không. B, D không phải chức năng của cờ. C sai vì hai trường bổ sung cho nhau.

## K2. Phục hồi cục bộ, lan truyền có chọn lọc

### Trọng tâm

Subagent tự xử lý lỗi tạm thời (retry) trước. Chỉ khi không giải quyết được mới báo lên coordinator; coordinator **tiếp tục các nhánh thành công** và nhắm vào phần thiếu, thay vì sập cả pipeline.

### Giải thích

Có ba mức phản ứng với lỗi:

1. **Phục hồi cục bộ**: subagent gặp timeout thoáng qua thì retry với backoff trong chính nó; coordinator không cần biết.
2. **Lan truyền có chọn lọc**: lỗi không thể tự xử lý thì báo lên kèm ngữ cảnh có cấu trúc (K1), vừa đủ để quyết định.
3. **Thất bại toàn cục**: chỉ khi thiếu phần không thể thiếu để tạo sản phẩm có ý nghĩa.

Ví dụ: coordinator giao 4 worker nghiên cứu 4 mảng; worker số 3 thất bại. Cách đúng là giữ kết quả của 3 worker còn lại, chạy lại **chỉ nhiệm vụ của worker 3** (có thể với nguồn khác hoặc truy vấn hẹp hơn), và nếu vẫn thất bại thì tổng hợp với chú thích thiếu mảng đó (K4). Cách sai là hủy toàn bộ và làm lại từ đầu: tốn chi phí, mất công, và có thể gặp lỗi tương tự lần nữa.

Cũng cần tránh ngược lại: subagent nuốt mọi lỗi và báo "xong" khiến coordinator không biết cần can thiệp. Đường đi lý tưởng là: **retry nội bộ → báo cáo có cấu trúc → coordinator quyết định có chọn lọc.**

### Keyword

- `local recovery` — phục hồi tại chỗ ngay trong subagent
- `selective propagation` — chỉ đẩy lên những lỗi cần coordinator quyết định
- `targeted retry` — chỉ thử lại phần bị thiếu
- `exponential backoff` — chờ tăng dần giữa các lần thử lại
- `graceful degradation` — suy giảm có kiểm soát, vẫn trả kết quả hữu ích dù thiếu một phần

### Bẫy đề thi

- ✗ Một worker lỗi thì hủy toàn bộ pipeline ⇒ ✓ Giữ nhánh thành công, retry có mục tiêu phần lỗi
- ✗ Mọi lỗi nhỏ đều đẩy lên coordinator ⇒ ✓ Lỗi tạm thời xử lý cục bộ trước
- ✗ Subagent nuốt lỗi và báo xong ⇒ ✓ Báo cáo có cấu trúc khi không tự giải quyết được

### Câu hỏi

#### Q1. Coordinator giao 4 subagent nghiên cứu. Subagent số 3 thất bại do nguồn tạm thời không phản hồi, 3 cái còn lại đã xong. Cách xử lý tốt nhất?
- A. Hủy toàn bộ và chạy lại từ đầu
- B. Giữ kết quả 3 nhánh xong, thử lại có mục tiêu nhánh 3, và chú thích nếu vẫn thiếu
- C. Bỏ nhánh 3 và không nhắc đến trong báo cáo
- D. Dừng pipeline và trả lỗi chung cho người dùng

**Đáp án:** B

**Giải thích:** Retry có mục tiêu tận dụng phần đã xong và minh bạch phần thiếu. A phí công và có thể gặp lỗi tương tự. C giấu khoảng trống. D bỏ rơi kết quả hữu ích.

#### Q2. Subagent gặp lỗi timeout thoáng qua khi gọi API. Cách xử lý đầu tiên hợp lý nhất là gì?
- A. Báo ngay lên coordinator và dừng
- B. Retry cục bộ với backoff, chỉ báo lên nếu vẫn thất bại
- C. Trả danh sách rỗng
- D. Chuyển ngay sang chế độ thất bại toàn cục

**Đáp án:** B

**Giải thích:** Lỗi tạm thời thường tự khỏi; xử lý cục bộ giảm nhiễu cho coordinator. A làm coordinator quá tải với lỗi nhỏ. C giấu lỗi. D phản ứng quá mức.

## K3. Kết quả rỗng khác với lỗi truy cập

### Trọng tâm

"**Truy vấn chạy thành công và không có kết quả**" khác hoàn toàn với "**không truy cập được nguồn**". Hệ thống phải phân biệt rõ hai trạng thái này.

### Giải thích

Cả hai cùng cho ra `[]` nếu code ẩu, nhưng ý nghĩa ngược nhau:

| Trạng thái | Ý nghĩa | Hành động hợp lý |
|---|---|---|
| Thành công, 0 kết quả | Nguồn đã được tra cứu; thực sự không có tài liệu khớp | Có thể kết luận "không có bằng chứng" (có chú thích truy vấn) |
| Lỗi truy cập (rate limit, timeout, auth) | Chưa tra cứu được; không biết có hay không | Báo lỗi, retry hoặc đổi nguồn; không được kết luận gì |

Nếu một API học thuật bị **rate limit** nhưng wrapper bắt exception và trả `[]`, coordinator sẽ tin "không có bài nào về chủ đề này" và bản tổng hợp sẽ khẳng định thiếu bằng chứng, trong khi thực ra chưa hề tìm được. Đây là kiểu lỗi nguy hiểm vì nó **trông như kết quả hợp lệ**.

Thiết kế đúng: phản hồi tool có trường trạng thái tường minh (`success` / `error`) và với `error` thì có `error_category`. Kết quả rỗng thành công nên ghi lại phạm vi đã tìm (query, nguồn, khoảng thời gian) để người đọc biết "không có" nghĩa là gì.

### Keyword

- `empty result` — kết quả rỗng nhưng truy vấn đã chạy thành công
- `access failure` — lỗi truy cập nguồn (rate limit, auth, timeout)
- `rate limit` — giới hạn số lần gọi API
- `false negative` — kết luận "không có" trong khi thực ra chưa tìm được
- `explicit status field` — trường trạng thái tường minh phân biệt thành công và lỗi

### Bẫy đề thi

- ✗ Bắt exception rồi trả `[]` cho gọn ⇒ ✓ Trả lỗi có cấu trúc để phân biệt với "không có kết quả"
- ✗ Coi `[]` luôn nghĩa là không có tài liệu ⇒ ✓ Chỉ kết luận khi truy vấn thực sự thành công
- ✗ Không ghi lại phạm vi tìm kiếm ⇒ ✓ Lưu query, nguồn, thời gian để giải thích ý nghĩa "không có"

### Câu hỏi

#### Q1. API bài báo trả HTTP 429 (rate limit), wrapper bắt lỗi và trả `[]`. Báo cáo cuối khẳng định "không có nghiên cứu nào về chủ đề này". Sửa đúng?
- A. Wrapper trả lỗi có cấu trúc (loại rate limit, có thể retry) thay vì danh sách rỗng
- B. Thêm câu "có thể có nghiên cứu" vào mọi báo cáo
- C. Bắt model tìm bằng từ khóa khác mà không sửa wrapper
- D. Tăng thời gian chờ của coordinator

**Đáp án:** A

**Giải thích:** Phải phân biệt lỗi truy cập với rỗng thành công ngay tại nguồn. B là chú thích chung chung, không sửa gốc. C vẫn giữ wrapper giấu lỗi. D không giải quyết rate limit.

#### Q2. Điều nào cho phép coordinator kết luận "không có bằng chứng" một cách chính đáng?
- A. Truy vấn chạy thành công, trả 0 kết quả, và phạm vi tìm đã được ghi lại
- B. Wrapper trả về danh sách rỗng
- C. Subagent không phản hồi trong thời gian chờ
- D. Một nguồn duy nhất bị lỗi xác thực

**Đáp án:** A

**Giải thích:** Chỉ khi truy vấn đã thực sự chạy mới kết luận được; ghi phạm vi làm kết luận có nghĩa. B không phân biệt được lỗi và rỗng. C và D là tình trạng chưa tra cứu được.

## K4. Chú thích độ phủ trong bản tổng hợp

### Trọng tâm

Bản tổng hợp cuối phải **nêu rõ phần nào đã được xác minh, phần nào thiếu và vì sao**, thay vì trình bày như thể mọi chủ đề đều đầy đủ.

### Giải thích

Hệ quả cuối cùng của lỗi trong multi-agent nằm ở báo cáo người dùng đọc. Nếu 3 mảng được nghiên cứu tốt, mảng địa nhiệt không truy cập được nguồn, bản tổng hợp vẫn viết đều đặn cả bốn mảng, người đọc sẽ đưa ra quyết định dựa trên bức tranh thiếu mà không hay biết.

Thực hành tốt:

- Mỗi mảng/chủ đề có **trạng thái độ phủ**: `complete`, `partial`, `unavailable`, kèm **lý do** ("nguồn X bị giới hạn truy cập").
- Phần tóm tắt đầu báo cáo nêu rõ **giới hạn** và ảnh hưởng đến độ tin cậy kết luận.
- Phân biệt "không tìm thấy bằng chứng" với "chưa thể kiểm tra".
- Gợi ý bước tiếp theo (thử lại sau, cần quyền truy cập, cần người xem).

Coordinator có thể được yêu cầu trong prompt tổng hợp: "với mỗi chủ đề, nêu rõ nguồn đã tra cứu thành công và nguồn thất bại". Dữ liệu này đến từ ngữ cảnh lỗi có cấu trúc ở K1: nếu subagent không báo cáo đúng, coordinator không thể chú thích.

Điều này không làm báo cáo kém giá trị: một báo cáo trung thực về giới hạn đáng tin cậy hơn một báo cáo trơn tru nhưng sai lệch.

### Keyword

- `coverage annotation` — chú thích mức độ phủ của bằng chứng
- `coverage gap` — khoảng trống độ phủ: phần chưa có bằng chứng
- `transparency` — minh bạch về giới hạn của kết quả
- `verified vs unverified` — đã xác minh và chưa xác minh
- `synthesis` — bước tổng hợp kết quả từ nhiều subagent

### Bẫy đề thi

- ✗ Viết báo cáo đều đặn cho mọi chủ đề dù một mảng thiếu dữ liệu ⇒ ✓ Đánh dấu mảng thiếu và nêu lý do
- ✗ Ghi chú giới hạn mơ hồ ở cuối trang ⇒ ✓ Nêu rõ theo từng chủ đề và trong phần tóm tắt đầu
- ✗ Gộp "không tìm thấy" và "không truy cập được" ⇒ ✓ Phân biệt hai trạng thái

### Câu hỏi

#### Q1. Báo cáo năng lượng tái tạo có 4 mảng; nguồn của mảng địa nhiệt không truy cập được, 3 mảng còn lại đã xác minh. Cách trình bày đúng?
- A. Viết mảng địa nhiệt từ kiến thức nền của model và trình bày như đã xác minh
- B. Bỏ mảng địa nhiệt khỏi báo cáo mà không nhắc
- C. Đánh dấu mảng địa nhiệt chưa đầy đủ, nêu lý do không truy cập được và ảnh hưởng đến kết luận
- D. Trình bày cả 4 mảng như nhau và thêm câu "dữ liệu có thể chưa đầy đủ" ở cuối

**Đáp án:** C

**Giải thích:** Minh bạch theo từng mảng với lý do giúp người đọc đánh giá đúng độ tin cậy. A bịa độ phủ. B giấu khoảng trống. D ghi chú quá chung và dễ bị bỏ qua.

#### Q2. Điều kiện tiên quyết để coordinator chú thích độ phủ chính xác là gì?
- A. Dùng model có context window lớn hơn
- B. Cho phép subagent tự quyết định bỏ qua mọi lỗi
- C. Chạy subagent tuần tự thay vì song song
- D. Subagent trả về ngữ cảnh lỗi và độ phủ có cấu trúc, không giấu thất bại

**Đáp án:** D

**Giải thích:** Coordinator chỉ chú thích được những gì subagent báo cáo trung thực. A, C không liên quan đến thông tin lỗi. B làm mất dữ liệu để chú thích.
