# 1.1 — Agentic Loops

## Tổng quan

**Agentic loop** là vòng lặp cho phép Claude tự làm việc nhiều bước: Claude gọi tool → code của bạn chạy tool → trả kết quả lại cho Claude → Claude quyết định gọi tiếp hay trả lời. Đây là nền tảng của mọi agent (Agent SDK, Claude Code, multi-agent).

Đề thi hay hỏi về **cách điều khiển vòng lặp một cách xác định (deterministic)**: dựa vào gì để biết *tiếp tục* hay *dừng*, giữ lịch sử hội thoại ra sao, và xử lý các trường hợp dừng bất thường. Quy tắc nhớ nhanh: **hãy để `stop_reason` — không phải văn bản của model — điều khiển vòng lặp.**

## K1. `stop_reason` là tín hiệu điều khiển vòng lặp

### Trọng tâm

Mỗi response của Claude có trường `stop_reason`. Vòng lặp phải **tiếp tục khi `tool_use`** và **dừng khi `end_turn`** — không đoán qua nội dung văn bản.

### Giải thích

Khi gọi Messages API, response gồm danh sách `content` (các block `text`, `tool_use`...) và `stop_reason` cho biết *vì sao* model dừng sinh:

- `tool_use` → model muốn gọi tool. Code phải chạy tool, rồi gọi API lại.
- `end_turn` → model đã xong lượt này. Thoát vòng lặp, trả kết quả cho người dùng.

Vòng lặp chuẩn:

```python
while True:
    resp = client.messages.create(model=M, tools=TOOLS, messages=messages)
    if resp.stop_reason == "end_turn":
        break                                   # xong
    if resp.stop_reason == "tool_use":
        results = run_tools(resp.content)       # chạy MỌI tool_use block
        messages.append({"role": "assistant", "content": resp.content})
        messages.append({"role": "user", "content": results})
        continue
    handle_other(resp)                          # xem K4
```

**Vì sao không dựa vào văn bản?** Claude thường viết một đoạn giải thích *rồi mới* gọi tool trong cùng một response (`text` block đứng trước `tool_use` block). Nếu bạn coi "có text = đã xong" hoặc chỉ nhìn `content[0]`, bạn sẽ dừng sớm, bỏ sót tool call chưa chạy. Ngược lại, parse câu như "Tôi đã hoàn thành" là dựa vào ngôn ngữ tự nhiên — không ổn định và không kiểm chứng được.

Một response có thể chứa **nhiều `tool_use` block** (parallel tool calls). Phải duyệt hết `content`, không chỉ block đầu.

### Keyword

- `stop_reason` — trường trong response cho biết lý do model dừng; dùng để điều khiển vòng lặp
- `tool_use` — giá trị `stop_reason`/loại content block: model yêu cầu gọi một tool
- `end_turn` — giá trị `stop_reason`: model đã hoàn tất lượt, không cần gọi thêm tool
- `content block` — từng phần của response (text, tool_use...); một response có thể có nhiều block
- `agentic loop` — vòng lặp gọi model → chạy tool → trả kết quả cho đến khi xong
- `deterministic control` — điều khiển xác định, dựa trên tín hiệu có cấu trúc thay vì suy đoán

### Bẫy đề thi

- ✗ Coi response có `text` block là "đã xong" ⇒ ✓ Kiểm tra `stop_reason`; text có thể đi kèm `tool_use`
- ✗ Chỉ xử lý `content[0]` ⇒ ✓ Duyệt toàn bộ `content`, có thể có nhiều `tool_use`
- ✗ Parse câu "task complete" trong văn bản để thoát vòng lặp ⇒ ✓ Dùng `stop_reason == "end_turn"`

### Câu hỏi

#### Q1. Một service agent trả về response gồm một đoạn text giải thích và một block `tool_use` gọi `lookup_order`. Vòng lặp hiện tại thấy có text nên coi là xong và trả kết quả cho khách. Cách sửa đúng là gì?
- A. Thêm prompt yêu cầu model không viết text trước khi gọi tool
- B. Kiểm tra `stop_reason`: nếu là `tool_use` thì chạy tool và gọi tiếp
- C. Chỉ xử lý block đầu tiên của `content`
- D. Giới hạn vòng lặp tối đa 1 lần cho chắc chắn

**Đáp án:** B

**Giải thích:** Đây là lỗi dùng text làm điều kiện dừng. `stop_reason == "tool_use"` mới là tín hiệu chắc chắn rằng còn tool phải chạy. A là sửa bằng prompt (không đảm bảo, model vẫn có thể viết text trước tool). C bỏ sót tool call. D cắt ngang công việc.

#### Q2. Cách nào dưới đây để quyết định thoát vòng lặp là **đáng tin cậy nhất**?
- A. Tìm cụm "I have completed the task" trong text cuối
- B. Dừng khi response không có `text` block
- C. Dừng khi `stop_reason == "end_turn"`
- D. Dừng sau đúng 5 vòng lặp

**Đáp án:** C

**Giải thích:** `stop_reason` là tín hiệu có cấu trúc do API cung cấp. A phụ thuộc cách diễn đạt của model. B sai vì response cuối thường chính là text. D là giới hạn cố định, không phản ánh việc agent đã xong chưa (xem K3).

## K2. Giữ đầy đủ lịch sử tool (`tool_use` + `tool_result`)

### Trọng tâm

Sau mỗi lần chạy tool, phải **thêm cả message assistant (chứa `tool_use`) và message user (chứa `tool_result` khớp `tool_use_id`)** vào `messages` rồi mới gọi API lại.

### Giải thích

API không có trí nhớ: mỗi lần gọi, bạn gửi lại toàn bộ `messages`. Model chỉ "nhớ" những gì có trong đó. Với tool, một vòng gồm hai message:

1. **assistant**: nguyên `resp.content` (có các block `tool_use`, mỗi block có `id`)
2. **user**: danh sách block `tool_result`, mỗi block mang `tool_use_id` trùng với `id` của `tool_use` tương ứng

```python
messages.append({"role": "assistant", "content": resp.content})
messages.append({"role": "user", "content": [
    {"type": "tool_result", "tool_use_id": tu.id, "content": "Order #123: shipped"}
    for tu in tool_uses
]})
```

Quy tắc cần nhớ:

- Mỗi `tool_use` **phải** có đúng một `tool_result` cùng `tool_use_id`; thiếu hoặc sai ID → API trả lỗi.
- Nếu model gọi nhiều tool song song, gom **tất cả** `tool_result` vào **một** user message.
- `tool_result` phải nằm ngay sau message assistant chứa `tool_use` tương ứng.
- Nếu chỉ gửi lại câu hỏi cuối của user, model mất kết quả tool trước đó và sẽ **gọi lại tool** (lặp vô ích) hoặc trả lời thiếu căn cứ.

Tool lỗi cũng phải trả `tool_result` (với `is_error: true`) để model biết và xử lý, không được bỏ qua.

### Keyword

- `tool_result` — block user message chứa kết quả chạy tool, gửi lại cho model
- `tool_use_id` — ID nối `tool_result` với `tool_use` tương ứng
- `conversation history` — toàn bộ `messages` gửi kèm mỗi lần gọi API; model chỉ biết những gì có trong đó
- `parallel tool calls` — model gọi nhiều tool trong một response
- `is_error` — cờ trong `tool_result` báo tool chạy lỗi
- `stateless API` — API không lưu trạng thái; client chịu trách nhiệm gửi lại ngữ cảnh

### Bẫy đề thi

- ✗ Chỉ gửi lại câu hỏi mới nhất của user ⇒ ✓ Gửi lại toàn bộ lịch sử gồm `tool_use` và `tool_result`
- ✗ Tool chạy lỗi thì bỏ qua, không trả `tool_result` ⇒ ✓ Vẫn trả `tool_result` có `is_error` để model xử lý
- ✗ Trả từng `tool_result` ở nhiều user message cho các tool gọi song song ⇒ ✓ Gom vào một user message

### Câu hỏi

#### Q1. Agent tra cứu đơn hàng thành công, nhưng ở lượt kế tiếp lại gọi `lookup_order` lần nữa với cùng tham số. Nguyên nhân khả dĩ nhất?
- A. Lịch sử gửi đi thiếu `tool_use` và `tool_result` của lần tra cứu trước
- B. Model bị quá tải nên quên
- C. `max_tokens` quá thấp
- D. Chưa đặt giới hạn số vòng lặp

**Đáp án:** A

**Giải thích:** API không có trí nhớ; nếu không gửi lại `tool_use`/`tool_result`, model không biết đã tra cứu rồi. B không phải cơ chế thực tế. C làm response bị cắt, không gây gọi lại. D chỉ là lưới an toàn, không sửa nguyên nhân.

#### Q2. Model trả về 3 `tool_use` block song song. Cách trả kết quả đúng là gì?
- A. Gọi API 3 lần, mỗi lần gửi một `tool_result`
- B. Chỉ trả kết quả tool đầu tiên, hai tool còn lại bỏ qua
- C. Một user message chứa 3 `tool_result`, mỗi cái đúng `tool_use_id`
- D. Gộp 3 kết quả thành một đoạn text trong user message

**Đáp án:** C

**Giải thích:** Mỗi `tool_use` cần đúng một `tool_result` khớp ID, và tất cả nằm trong cùng một user message ngay sau message assistant. A, B làm thiếu `tool_result` → API báo lỗi. D mất liên kết `tool_use_id`.

## K3. Giới hạn số vòng lặp chỉ là lưới an toàn

### Trọng tâm

Điều kiện dừng chính là `end_turn`. **Iteration cap** (ví dụ tối đa 20 vòng) chỉ để chặn vòng lặp vô hạn; khi chạm cap phải **báo chưa hoàn thành**, không được coi là thành công.

### Giải thích

Vòng lặp luôn cần một chốt chặn để tránh agent lặp mãi (tốn tiền, treo hệ thống) nếu có lỗi logic hoặc model liên tục gọi tool. Nhưng cần phân biệt vai trò:

- **Điều kiện dừng đúng** = `stop_reason == "end_turn"` (agent tự kết luận xong).
- **Safety cap** = chỉ cắt khi bất thường. Nên đặt đủ rộng để tác vụ hợp lệ không bị cắt.

Ví dụ: research agent hợp lệ cần 12 lần search mà bạn đặt cap = 10 và coi "đến vòng 10 là xong" → kết quả cụt nhưng được báo như hoàn chỉnh. Cách đúng: để `end_turn` quyết định, cap đặt cao hơn nhu cầu thực (hoặc cấu hình theo loại tác vụ), và khi chạm cap thì trả trạng thái **chưa hoàn thành** (kèm kết quả một phần, log lý do) để người dùng hoặc hệ thống phía trên xử lý tiếp.

Nguyên tắc chung với mọi lỗi: **không âm thầm biến thất bại thành thành công**.

### Keyword

- `iteration cap` / `max_iterations` — giới hạn số vòng lặp tối đa của agent
- `safety bound` — chốt chặn an toàn, không phải điều kiện hoàn thành
- `runaway loop` — vòng lặp chạy mất kiểm soát, không bao giờ dừng
- `termination condition` — điều kiện kết thúc vòng lặp
- `partial result` — kết quả một phần khi chưa xong
- `silent failure` — thất bại nhưng không báo, bị nhầm là thành công

### Bẫy đề thi

- ✗ Coi "đã đến vòng lặp thứ N" là hoàn thành ⇒ ✓ Dừng bằng `end_turn`; cap chỉ chặn bất thường và phải báo chưa hoàn thành
- ✗ Bỏ hẳn iteration cap vì đã có `stop_reason` ⇒ ✓ Vẫn cần cap như lưới an toàn chống vòng lặp vô hạn
- ✗ Đặt cap thật thấp để tiết kiệm chi phí ⇒ ✓ Cap vừa đủ rộng cho tác vụ hợp lệ

### Câu hỏi

#### Q1. Research agent hợp lệ cần 12 lần search, nhưng cap đặt là 10 và code trả kết quả như thể đã xong. Cách thiết kế đúng?
- A. Giữ cap = 10 và coi vòng 10 là điểm hoàn thành
- B. Dùng `end_turn` để kết thúc; cap đặt đủ cao như lưới an toàn, chạm cap thì báo chưa hoàn thành
- C. Bỏ cap hoàn toàn
- D. Bảo model "đừng search quá 10 lần" trong prompt

**Đáp án:** B

**Giải thích:** Hoàn thành phải do `end_turn` quyết định. Cap chỉ để chặn bất thường và nếu chạm cap phải minh bạch là chưa xong. A giấu thất bại. C mất bảo vệ chống vòng lặp vô hạn. D dựa vào prompt, không đảm bảo.

#### Q2. Khi vòng lặp chạm `max_iterations`, hành vi nào phù hợp nhất?
- A. Trả kết quả hiện có như thể thành công
- B. Im lặng khởi động lại vòng lặp từ đầu
- C. Trả kết quả một phần cùng trạng thái "chưa hoàn thành" và lý do
- D. Xoá lịch sử rồi hỏi lại người dùng

**Đáp án:** C

**Giải thích:** Phải báo trung thực để phía trên quyết định (thử lại, tăng cap, chuyển người). A là silent failure. B có thể lặp vô hạn. D mất ngữ cảnh.

## K4. Các `stop_reason` đặc biệt: `pause_turn`, `max_tokens`, `refusal`

### Trọng tâm

`tool_use` và `end_turn` không phải tất cả. Phải xử lý riêng `max_tokens` (bị cắt), `pause_turn` (tạm dừng với server tool), `refusal` (từ chối), `stop_sequence`; **không được giả định mọi lần dừng khác `end_turn` đều là `tool_use`**.

### Giải thích

- **`max_tokens`**: response bị cắt vì hết hạn mức token đầu ra. Nội dung dở dang. Nếu đang cắt giữa một `tool_use`, JSON tham số sẽ hỏng → **không chạy tool**. Cách xử lý: tăng `max_tokens` rồi thử lại, hoặc yêu cầu tiếp tục, hoặc báo response chưa đầy đủ.
- **`pause_turn`**: xảy ra khi model đang chạy các **server tool** (như web search) và lượt kéo dài. Để tiếp tục, gửi lại response vừa nhận như một message assistant rồi gọi API lại; model sẽ chạy tiếp.
- **`refusal`**: model từ chối trả lời vì lý do an toàn. Đừng lặp lại y nguyên request; hãy xử lý có chủ đích (báo người dùng, chuyển hướng).
- **`stop_sequence`**: model dừng vì gặp chuỗi dừng bạn cấu hình. Dừng theo thiết kế, xử lý theo logic của bạn.

Một vòng lặp tốt có nhánh rõ ràng cho từng giá trị, và nhánh mặc định cho giá trị lạ: ghi log, không âm thầm coi là thành công.

```python
match resp.stop_reason:
    case "end_turn":   done()
    case "tool_use":   run_and_continue()
    case "max_tokens": retry_with_more_tokens_or_report_incomplete()
    case "pause_turn": messages.append({"role": "assistant", "content": resp.content}); continue
    case "refusal":    report_refusal()
    case _:            log_and_fail_safe()
```

### Keyword

- `max_tokens` — vừa là tham số giới hạn token đầu ra, vừa là `stop_reason` khi bị cắt
- `truncation` — bị cắt cụt do hết token
- `pause_turn` — `stop_reason` khi lượt dài bị tạm dừng (server tool); gửi lại để tiếp tục
- `server tool` — tool chạy phía Anthropic (ví dụ web search), khác tool do bạn tự chạy
- `refusal` — `stop_reason` khi model từ chối
- `stop_sequence` — chuỗi dừng do bạn đặt; model dừng khi sinh ra chuỗi này
- `fail-safe` — nhánh mặc định an toàn khi gặp trường hợp không lường trước

### Bẫy đề thi

- ✗ Giả định mọi `stop_reason` khác `end_turn` đều là `tool_use` và chạy tool ⇒ ✓ Xử lý riêng từng giá trị
- ✗ Response bị `max_tokens` cắt giữa `tool_use` mà vẫn chạy tool ⇒ ✓ Phát hiện cắt cụt, tăng token hoặc báo chưa đầy đủ
- ✗ Gặp `refusal` thì gửi lại y nguyên request nhiều lần ⇒ ✓ Xử lý có chủ đích, báo người dùng

### Câu hỏi

#### Q1. Response có `stop_reason = "max_tokens"` và block `tool_use` cuối bị cắt dở JSON. Hành động đúng?
- A. Chạy tool với phần JSON đã nhận
- B. Coi như `end_turn` và trả kết quả
- C. Phát hiện bị cắt, không chạy tool; tăng `max_tokens` thử lại hoặc báo chưa đầy đủ
- D. Bỏ qua và gọi API lại với cùng cấu hình

**Đáp án:** C

**Giải thích:** `max_tokens` nghĩa là output bị cắt, tham số tool có thể hỏng. Chạy tool với dữ liệu dở là rủi ro; coi là hoàn thành là sai. D sẽ lặp lại đúng lỗi cũ.

#### Q2. Agent dùng web search (server tool) nhận `stop_reason = "pause_turn"`. Làm gì để tiếp tục?
- A. Coi như đã xong, thoát vòng lặp
- B. Gửi lại response vừa nhận như message assistant rồi gọi API tiếp
- C. Tự chạy web search ở phía client
- D. Xoá lịch sử và bắt đầu lại

**Đáp án:** B

**Giải thích:** `pause_turn` là lượt dài bị tạm dừng, không phải kết thúc. Gửi lại nội dung để model chạy tiếp. A cắt ngang công việc. C sai vì đây là server tool do Anthropic chạy. D mất tiến trình.
