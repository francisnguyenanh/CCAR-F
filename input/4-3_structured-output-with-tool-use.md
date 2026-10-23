# 4.3 — Structured Output with Tool Use

## Tổng quan

Khi cần model trả về dữ liệu có cấu trúc (JSON để ghi vào database, gọi API khác), cách đáng tin nhất trong hệ sinh thái Claude là **tool use với JSON schema**: bạn định nghĩa một "tool" mà tham số chính là cấu trúc dữ liệu mong muốn, model "gọi" tool đó và bạn lấy `input` của lời gọi làm kết quả. Cách này tốt hơn nhiều so với việc xin "hãy trả JSON" rồi parse văn bản.

Đề thi xoay quanh bốn ý: schema chỉ đảm bảo **hình dạng** chứ không đảm bảo **đúng sự thật**; chọn `tool_choice` nào (`auto`, `any`, tool cụ thể); cách thiết kế trường **optional/nullable** để không ép model bịa; và dùng giá trị **`unclear`/`other`** cho ca mơ hồ. Quy tắc nhớ nhanh: **schema đảm bảo cú pháp, không đảm bảo ngữ nghĩa; thiết kế schema sao cho "không biết" là một đáp án hợp lệ.**

## K1. Schema đảm bảo cấu trúc, không đảm bảo ngữ nghĩa

### Trọng tâm

Tool use với JSON schema loại bỏ lỗi cú pháp và sai kiểu, nhưng **giá trị vẫn có thể sai** (tổng tiền không khớp, ngày vô lý). Cần validator bằng code cho phần ngữ nghĩa.

### Giải thích

Khi bạn khai báo tool với `input_schema` (JSON Schema), model sinh tham số theo schema đó: đúng tên field, đúng kiểu, có đủ field bắt buộc, giá trị enum nằm trong tập cho phép. Nhờ vậy bạn không phải xử lý JSON thiếu dấu ngoặc hay field bị đổi tên như khi parse văn bản tự do.

```python
tools = [{
    "name": "record_invoice",
    "description": "Ghi lại thông tin hoá đơn đã trích xuất",
    "input_schema": {
        "type": "object",
        "properties": {
            "invoice_no": {"type": "string"},
            "line_items": {"type": "array", "items": {"type": "number"}},
            "total": {"type": "number"},
        },
        "required": ["invoice_no", "line_items", "total"],
    },
}]
```

Nhưng schema chỉ nói "total là số", không nói "total phải bằng tổng line_items". Model vẫn có thể đưa ra `line_items = [100, 200]` và `total = 350` (đúng kiểu, sai nghĩa). Một output **schema-valid** không đồng nghĩa với **đúng**.

Vì vậy cần hai tầng:

1. **Schema** để chắc chắn về hình dạng (cú pháp, kiểu, trường bắt buộc).
2. **Validator bằng code** để kiểm tra ngữ nghĩa: tổng bằng tổng thành phần, ngày kết thúc sau ngày bắt đầu, mã nằm trong danh mục thật... Nếu fail, đưa vào vòng retry có phản hồi (xem 4.4).

Không nên tin vào việc "model sinh theo schema nên chắc chắn đúng", và cũng không nên dùng prompt để bắt model tự cộng chính xác khi có thể dùng code.

### Keyword

- `tool use` — cơ chế cho model gọi tool; dùng cả để lấy output có cấu trúc
- `input_schema` — JSON Schema mô tả tham số của tool, tức cấu trúc đầu ra mong muốn
- `schema-valid` — hợp lệ về hình dạng theo schema, chưa chắc đúng về nội dung
- `syntax error vs semantic error` — lỗi cú pháp (hình dạng) khác lỗi ngữ nghĩa (nội dung sai)
- `required field` — trường bắt buộc phải có trong output
- `semantic validation` — kiểm tra ý nghĩa nội dung, thường bằng code

### Bẫy đề thi

- ✗ Output đã qua schema nên chắc chắn chính xác ⇒ ✓ Schema chỉ đảm bảo hình dạng; cần validator kiểm tra tổng, ngày, quy tắc nghiệp vụ
- ✗ Xin "trả JSON" trong prompt và parse text là đủ tin cậy ⇒ ✓ Dùng tool use với JSON schema để ép cấu trúc
- ✗ Dùng prompt bắt model "cộng chính xác" thay cho code ⇒ ✓ Phép tính xác định nên do code kiểm tra

### Câu hỏi

#### Q1. Pipeline dùng tool use với schema để trích xuất hoá đơn. Kết quả luôn là JSON hợp lệ, nhưng một số hoá đơn có `total` khác tổng các `line_items`. Cách khắc phục phù hợp nhất?
- A. Thêm `"minimum": 0` vào schema của `total`
- B. Thêm bước validator bằng code so sánh `total` với tổng `line_items`, và xử lý khi lệch
- C. Chuyển sang trả JSON dạng văn bản tự do
- D. Tin kết quả vì đã qua schema

**Đáp án:** B

**Giải thích:** Lỗi này là ngữ nghĩa nên phải kiểm tra bằng code. A không kiểm tra quan hệ giữa các trường. C làm mất lợi ích của schema. D chính là cái bẫy "schema-valid = đúng".

#### Q2. Điều nào schema JSON trong tool use KHÔNG thể đảm bảo?
- A. Trường `invoice_no` là chuỗi
- B. Trường bắt buộc không bị thiếu
- C. Giá trị `status` thuộc tập enum cho phép
- D. Ngày hết hạn thực sự đúng với nội dung tài liệu gốc

**Đáp án:** D

**Giải thích:** Schema kiểm soát hình dạng (kiểu, trường bắt buộc, enum) nhưng không biết tài liệu gốc nói gì. A, B, C đều là ràng buộc hình dạng mà schema xử lý.

## K2. Chọn `tool_choice`: `auto`, `any`, hoặc tool cụ thể

### Trọng tâm

`auto` cho phép model trả văn bản thay vì gọi tool; `any` buộc model gọi **một trong các tool** đã cho; chỉ định tên tool buộc gọi **đúng tool đó**. Cần đầu ra có cấu trúc chắc chắn thì không dùng `auto`.

### Giải thích

Tham số `tool_choice` điều khiển việc model có phải dùng tool không:

| Giá trị | Hành vi | Khi dùng |
|---|---|---|
| `{"type": "auto"}` | Model tự quyết: gọi tool hoặc trả văn bản | Agent hội thoại thông thường |
| `{"type": "any"}` | Phải gọi một tool, model chọn tool nào | Có nhiều extractor theo loại tài liệu, chưa biết loại nào |
| `{"type": "tool", "name": "..."}` | Phải gọi đúng tool này | Luôn cần một cấu trúc cụ thể; ép bước đầu của pipeline |

Ví dụ: hệ thống nhận tài liệu chưa biết loại (hoá đơn, hợp đồng, biên nhận), mỗi loại có một tool trích xuất với schema riêng. Dùng `auto` thì model có thể trả lời bằng văn bản ("đây có vẻ là hoá đơn...") và bạn không có bản ghi có cấu trúc. Dùng `any` thì chắc chắn có một lời gọi tool, và model chọn extractor phù hợp. Nếu bước nào cũng phải ra đúng một cấu trúc (ví dụ luôn `extract_metadata` trước), dùng tên tool cụ thể.

Lưu ý: với `any` hoặc tool cụ thể, model sẽ **không viết text giải thích trước tool call**; nếu muốn có lập luận, hãy đưa một trường như `reasoning` vào schema. Và ép tool bằng `tool_choice` chắc chắn hơn nhiều so với dặn "luôn gọi tool" trong prompt.

### Keyword

- `tool_choice` — tham số điều khiển việc model có bắt buộc gọi tool hay không
- `auto` — model tự quyết định gọi tool hay trả văn bản
- `any` — bắt buộc gọi một tool bất kỳ trong danh sách
- `forced tool` — chỉ định đích danh tool bắt buộc gọi
- `forced tool selection` — buộc chọn tool bằng cấu hình thay vì bằng prompt
- `typed extractor` — tool trích xuất có schema riêng cho từng loại tài liệu

### Bẫy đề thi

- ✗ Dùng `auto` và hy vọng model trả JSON ⇒ ✓ Dùng `any` hoặc chỉ định tool khi bắt buộc có output có cấu trúc
- ✗ Dùng tool cụ thể khi chưa biết loại tài liệu ⇒ ✓ Dùng `any` để model chọn trong các extractor
- ✗ Dặn trong prompt "luôn gọi tool" thay cho `tool_choice` ⇒ ✓ Dùng cấu hình `tool_choice` để bảo đảm

### Câu hỏi

#### Q1. Hệ thống nhận tài liệu có thể là hoá đơn, hợp đồng hoặc biên nhận; mỗi loại có một tool trích xuất riêng, và mọi kết quả đều phải là bản ghi có cấu trúc. Cấu hình `tool_choice` nào phù hợp?
- A. `auto`
- B. `any`
- C. Chỉ định tool `extract_invoice`
- D. Không truyền `tools`, chỉ dặn trong prompt

**Đáp án:** B

**Giải thích:** `any` buộc phải gọi một tool và để model chọn extractor đúng. A cho phép trả văn bản. C sai với hợp đồng và biên nhận. D không có bảo đảm cấu trúc.

#### Q2. Bước đầu của pipeline luôn phải chạy tool `extract_metadata` trước mọi bước khác. Cách đáng tin cậy nhất?
- A. Viết trong prompt "Hãy luôn gọi extract_metadata trước"
- B. Dùng `tool_choice` `auto`
- C. Dùng `tool_choice` chỉ định `{"type": "tool", "name": "extract_metadata"}`
- D. Dùng `any` và hy vọng model chọn đúng

**Đáp án:** C

**Giải thích:** Chỉ định tên tool bảo đảm bằng cấu hình rằng tool này được gọi. A phụ thuộc prompt. B cho phép bỏ qua tool. D vẫn để model chọn tool khác.

## K3. Trường optional và nullable để không ép model bịa

### Trọng tâm

Trường có thể vắng trong tài liệu phải là **optional hoặc nullable** (với ý nghĩa "không có" rõ ràng); đừng đặt `required` cho dữ liệu không phải lúc nào cũng tồn tại.

### Giải thích

Khi schema đánh dấu một trường là bắt buộc, model **buộc phải điền một giá trị** cho nó. Nếu tài liệu (ví dụ hợp đồng) không hề có ngày giao hàng mà `delivery_date` là `required` kiểu string, model chỉ còn cách đoán một ngày hoặc lấy ngày bất kỳ cho đúng hình dạng. Đây là hallucination do chính thiết kế schema gây ra: model làm đúng yêu cầu của bạn, nhưng yêu cầu đó sai.

Thiết kế an toàn:

```json
"delivery_date": {
  "type": ["string", "null"],
  "description": "Ngày giao theo hợp đồng (YYYY-MM-DD). null nếu tài liệu không nêu."
}
```

- Chỉ đưa vào `required` những trường chắc chắn luôn có.
- Với trường có thể vắng: cho phép `null` (hoặc bỏ khỏi `required`) và **nêu rõ trong `description`** rằng vắng thì trả `null`, không đoán.
- Khi xử lý ở downstream, `null` được hiểu là "tài liệu không nói", khác với chuỗi rỗng hay giá trị mặc định giả như "1970-01-01".

Điều này khớp nguyên tắc chung: để thiếu dữ liệu là trạng thái hợp lệ và được ghi nhận, thay vì được che đi bằng dữ liệu bịa.

### Keyword

- `optional field` — trường không bắt buộc phải có trong output
- `nullable` — trường cho phép giá trị `null`
- `required` — danh sách trường bắt buộc trong JSON Schema
- `hallucination` — model tạo ra thông tin không có căn cứ
- `missing data semantics` — quy ước về ý nghĩa khi dữ liệu vắng (ví dụ `null` = không có trong tài liệu)
- `field description` — mô tả của trường, nơi hướng dẫn model cách xử lý khi không có dữ liệu

### Bẫy đề thi

- ✗ Đánh dấu mọi trường là `required` cho "đầy đủ" ⇒ ✓ Trường có thể vắng nên optional/nullable
- ✗ Dùng giá trị mặc định giả (ngày mặc định, chuỗi "N/A" lẫn lộn) cho dữ liệu thiếu ⇒ ✓ Dùng `null` với ý nghĩa rõ ràng
- ✗ Quy lỗi bịa giá trị cho model thay vì schema ⇒ ✓ Kiểm tra xem schema có ép trường bắt buộc không

### Câu hỏi

#### Q1. Một số hợp đồng không nêu ngày giao hàng, nhưng model vẫn điền một ngày nghe hợp lý. Schema hiện có `delivery_date` là `required` kiểu string. Nguyên nhân và cách sửa?
- A. Model bị lỗi; tăng temperature
- B. Nên thêm ví dụ few-shot với nhiều ngày khác nhau
- C. Schema ép phải có giá trị; đổi sang nullable/optional và ghi rõ "null nếu tài liệu không nêu"
- D. Dùng `tool_choice` chỉ định tool để thoát tình trạng này

**Đáp án:** C

**Giải thích:** Trường required buộc model phải điền gì đó. Cho phép null loại bỏ áp lực này. A không liên quan. B có thể làm bịa nhiều hơn. D không thay đổi ràng buộc required.

#### Q2. Cách nào biểu diễn "tài liệu không có thông tin" tốt nhất trong output của tool?
- A. `null` cho trường nullable, có mô tả rõ nghĩa
- B. Chuỗi "unknown" ở một số tài liệu và chuỗi rỗng ở số khác
- C. Ngày mặc định 1970-01-01
- D. Bỏ cả document

**Đáp án:** A

**Giải thích:** `null` có nghĩa thống nhất là "tài liệu không nêu", dễ xử lý ở downstream. B làm dữ liệu không đồng nhất. C là giá trị giả dễ bị nhầm với dữ liệu thật. D vứt bỏ cả phần thông tin còn lại.

## K4. Enum có giá trị `unclear`/`other` cho ca mơ hồ

### Trọng tâm

Với trường enum, luôn có lối thoát như `unclear` hoặc `other` kèm trường chi tiết, để model không phải **ép vào nhãn gần nhất** khi đầu vào không khớp.

### Giải thích

Giả sử `document_type` có enum `["invoice", "receipt"]`. Khi gặp một đơn đặt hàng hoặc một tài liệu hỗn hợp, model buộc phải chọn một trong hai giá trị, và nó sẽ chọn "gần nhất" một cách tự tin. Kết quả trông hợp lệ (đúng enum) nhưng thực tế sai, và còn sai một cách **âm thầm**: downstream không có cách nào phân biệt ca chắc chắn với ca bị ép.

Thiết kế tốt hơn:

```json
"document_type": {"type": "string", "enum": ["invoice", "receipt", "other", "unclear"]},
"document_type_detail": {"type": ["string", "null"],
  "description": "Bắt buộc mô tả ngắn khi document_type là other hoặc unclear"}
```

- `other` + `detail`: tài liệu rõ ràng là một loại **chưa có trong danh sách**; trường chi tiết ghi loại đó (giúp bạn phát hiện loại mới cần bổ sung vào enum).
- `unclear`: không đủ thông tin để phân loại chắc chắn.
- Các ca `other/unclear` được định tuyến cho người xem hoặc pipeline xử lý khác, thay vì đi tiếp như dữ liệu đáng tin.

Đây cũng là cách biến độ không chắc chắn thành tín hiệu có cấu trúc mà code có thể xử lý, ưu việt hơn việc bảo model tự báo "tôi không chắc" bằng văn bản.

### Keyword

- `enum` — tập giá trị cố định được phép của một trường
- `other + detail` — giá trị "khác" kèm trường mô tả chi tiết
- `unclear` — giá trị biểu thị không đủ căn cứ để phân loại
- `forced fit` — bị ép vào nhãn gần nhất dù không thật sự khớp
- `silent misclassification` — phân loại sai mà không có dấu hiệu cảnh báo
- `extensible schema` — schema dễ mở rộng khi phát hiện loại mới

### Bẫy đề thi

- ✗ Enum đóng chỉ gồm các loại đã biết ⇒ ✓ Thêm `other` (kèm detail) và `unclear` cho ca ngoài danh sách hoặc mơ hồ
- ✗ Bảo model chọn nhãn gần nhất rồi tin kết quả ⇒ ✓ Cho phép trả `unclear` để chuyển người xem
- ✗ Thêm `other` nhưng không có trường mô tả ⇒ ✓ Kèm `detail` để biết đó là loại gì

### Câu hỏi

#### Q1. Trường `document_type` có enum `invoice`/`receipt`. Khi gặp đơn đặt hàng, model vẫn trả `invoice` rất tự tin. Thiết kế nào xử lý tốt nhất?
- A. Thêm vào prompt "hãy rất cẩn thận khi phân loại"
- B. Thêm `other` kèm trường `detail` và `unclear` vào enum, định tuyến các ca này cho người xem
- C. Bỏ trường `document_type`
- D. Dùng `auto` thay vì `any`

**Đáp án:** B

**Giải thích:** Enum đóng ép model chọn nhãn gần nhất; thêm lối thoát giúp lộ ra ca không khớp. A chỉ dặn mơ hồ. C mất thông tin phân loại. D không liên quan, còn có thể trả văn bản thay vì tool.

#### Q2. Vì sao `other` nên đi kèm một trường mô tả chi tiết?
- A. Để schema dài hơn cho đầy đủ
- B. Vì JSON Schema bắt buộc
- C. Để tăng tốc độ sinh output
- D. Để biết tài liệu thuộc loại gì và phát hiện loại mới cần thêm vào enum

**Đáp án:** D

**Giải thích:** `detail` biến `other` thành thông tin có thể hành động (bổ sung loại mới, xem lại ca). A, B, C không phải lý do thực tế.
