# D5 — Quick Reference & Glossary

> Domain 5 · Context Management & Reliability · 15% đề thi. Trang tra cứu nhanh: keyword giữ nguyên tiếng Anh, phần giải nghĩa bằng tiếng Việt.

## Quick Reference

### Progressive Summarisation Trap

**Sai lầm phổ biến nhất:** dựa vào model để tóm tắt dần context cũ khi hội thoại dài ra. Mỗi lượt tóm tắt **làm mất chi tiết cụ thể** — tên, con số, trích dẫn chính xác, mốc thời gian chính xác.

**Cách sửa:** trích các sự kiện cụ thể vào **persistent structured block** và mang theo nguyên văn. Đừng bảo model "tóm tắt những gì ta đã bàn" — hãy duy trì một mục facts có cấu trúc:

```text
## Persistent Facts
- Customer: Jane Smith (ID: 12847)
- Order: #ORD-2024-8821, placed 2024-01-15
- Issue: Delivery address incorrect (postcode SW1A 1AA, should be SW1A 2AA)
- Status: Refund approved, reshipment pending
```

Khối này được sao chép chuyển tiếp **nguyên văn**, không tóm tắt. Model không thể làm mất những chi tiết này.

### Scratchpad Files

Dùng scratchpad file để **lưu giữ phát hiện qua ranh giới context** trong quá trình khám phá nhiều bước.

**Khi nào dùng:** task chạy lâu có thể vượt context window, hoặc task có kết quả trung gian cần sống sót qua lần reset context.

**Mẫu:**

1. Ghi phát hiện vào scratchpad file ngay khi khám phá ra
2. Ở ranh giới context, đọc scratchpad để khôi phục state
3. Scratchpad là file trên đĩa — nó sống sót qua mọi lần reset context

**Phân biệt then chốt:** scratchpad là lưu trữ bền **bên ngoài** (file). Conversation history là lưu trữ bền **bên trong** (context window). Khi context window đầy, conversation history mất — scratchpad file thì không.

### Two TS 5.1 Facts the Guide Names Explicitly

- **Lost in the middle.** Model xử lý tin cậy thông tin ở đầu và cuối input dài, nhưng có thể bỏ sót phát hiện ở các phần giữa. Thứ tự quan trọng: đặt thứ không được bỏ sót ở hai đầu, đừng chôn giữa context.
- **The API is stateless.** Không có gì được nhớ giữa các lời gọi. Mỗi request phải mang toàn bộ lịch sử nó cần, đó chính là lý do kết quả tool tích tụ và vì sao context window đầy lên.

### Error Propagation

**Structured error context** phải gồm:

| Field | Mục đích | Ví dụ |
|---|---|---|
| Failure type | Loại lỗi nào | `"network_timeout"`, `"validation_error"` |
| What was attempted | Truy vấn, tham số và hệ thống đích | `"Searched academic DB for 'renewable energy policy', 2022-2024"` |
| Partial results | Phần đã lấy được thành công trước khi lỗi | `{ "orders": [...], "payments": null }` |
| Potential alternatives | Các cách tiếp cận coordinator có thể thử tiếp | `"Try the mirror index, or broaden the date range"` |

Chú ý kỹ hai dòng cuối: guide yêu cầu các hướng tiếp cận **tiềm năng** mà coordinator có thể chọn, không phải log phục hồi đã thử. "Retried twice" thuộc về mục *what was attempted*.

**Không bao giờ truyền thông báo lỗi chung chung.** "Something went wrong" không cho agent kế tiếp (hay con người) gì để làm việc. Structured error context cho phép phục hồi thông minh.

### Valid Empty Results vs Access Failures

| Tình huống | Loại | Hành động đúng |
|---|---|---|
| Tìm kiếm trả 0 kết quả | Valid empty | Chấp nhận — việc không có dữ liệu là câu trả lời |
| API trả 401 Unauthorised | Access failure | Retry với credential đúng hoặc escalate |
| Truy vấn database trả tập rỗng | Valid empty | Chấp nhận — bản ghi không tồn tại |
| Network timeout | Access failure | Retry hoặc dùng fallback |
| Filter không khớp mục nào | Valid empty | Chấp nhận — tinh chỉnh filter hoặc báo không có kết quả |
| Rate limit (429) | Access failure | Chờ và retry (tôn trọng `Retry-After`) |

**Đề thi hỏi phân biệt này lặp đi lặp lại.** Nếu tool chạy thành công và không trả gì, đó là kết quả hợp lệ. Nếu tool thất bại khi thực thi, đó là lỗi cần phục hồi.

### Confidence Calibration & Stratified Validation

**Metric tổng hợp che giấu vấn đề theo loại.** Độ chính xác tổng thể 95% có thể che giấu việc một danh mục chỉ đạt 60%.

**Mẫu stratified validation:**

1. Nhóm các kết quả trích xuất theo loại/danh mục
2. Tính độ chính xác theo từng loại
3. Xác định các danh mục mà model kém
4. Áp dụng cách sửa có mục tiêu (ví dụ tốt hơn, schema chặt hơn) cho danh mục yếu

**Stratified random sampling:** chọn mẫu validation từ mỗi danh mục theo tỷ lệ. Cách này phát hiện các mẫu lỗi mới mà lấy mẫu ngẫu nhiên trên tất cả danh mục sẽ bỏ sót.

**Điểm thi chính:** khi đề nhắc "độ chính xác tổng thể cao nhưng người dùng báo lỗi", đáp án là stratified validation — tách độ chính xác theo danh mục để tìm điểm yếu.

### Source Attribution

**Structured claim-source mapping** sống sót qua bước tổng hợp. Link inline thì không.

| Cách tiếp cận | Sống sót qua synthesis? | Dùng khi |
|---|---|---|
| Structured mapping: `{ claim: "...", source: "...", url: "...", date: "..." }` | Có | Hệ thống production, pipeline nhiều bước |
| Link inline trong văn bản | Không — mất khi tóm tắt | Chỉ để làm prototype nhanh |

**Nguồn mâu thuẫn:** chú thích cả hai kèm provenance và ngày tháng. Không bao giờ lấy trung bình các nhận định mâu thuẫn hay im lặng chọn một. Trình bày cả hai với nguồn của chúng và để bên tiêu thụ quyết định.

```text
Claim: "Sonnet's context window is 1M tokens"
  Source A: Anthropic docs (2026-08-14) — 1M tokens
  Source B: Blog post (2024-03-15) — 200K tokens
  Annotation: temporal change, not a conflict — the window grew
  between the two publication dates. Both kept, dated, for the
  consumer to interpret.
```

### Escalation & Ambiguity

**Ba trigger escalation hợp lệ:**

- Khách hàng yêu cầu rõ ràng gặp con người — thực hiện ngay, không cố điều tra trước
- Policy gap hoặc ngoại lệ — chính sách im lặng hoặc mơ hồ về yêu cầu (ví dụ: price matching với đối thủ trong khi chính sách chỉ nói về điều chỉnh giá trên site của mình)
- Agent không thể tiến triển có ý nghĩa

**Trigger không đáng tin (distractor của đề):** escalation theo cảm xúc (sentiment) và điểm confidence tự báo cáo. Cả hai đều không phản ánh độ phức tạp thực của vụ việc. Khách hàng bực bội nhưng vấn đề giải quyết được thì nhận lời ghi nhận và đề nghị giải quyết; chỉ escalate nếu họ nhắc lại mong muốn đó.

**Nhiều kết quả khớp:** khi tool trả về nhiều bản ghi khách hàng, hãy hỏi thêm định danh. Không bao giờ chọn bằng heuristic.

**Policy gap so với violation:** gap (chính sách im lặng) nghĩa là escalate; violation (chính sách cấm) nghĩa là từ chối kèm giải thích chính sách.

### Context Window Strategies

| Chiến lược | Khi nào dùng |
|---|---|
| Persistent fact blocks | Chi tiết quan trọng phải sống sót qua tóm tắt |
| Scratchpad files | Khám phá nhiều bước qua ranh giới context |
| Per-file passes + integration | Codebase lớn — tránh attention dilution |
| Fresh start + summary injection | Context đã cũ hoặc mâu thuẫn |
| Prompt caching | System prompt lặp lại qua nhiều request (tiết kiệm chi phí + latency) |

**Tín hiệu áp lực context window:** model bắt đầu lặp lại, mâu thuẫn với phát biểu trước, hoặc bỏ qua thông tin gần đây. Những dấu hiệu này cho thấy window quá đầy hoặc context đã cũ.

### Decision Rules for the Exam

| Nếu đề nói… | Đáp án nhiều khả năng là… |
|---|---|
| "details lost over long conversation" | Persistent fact blocks, không phải progressive summarisation |
| "findings need to survive context reset" | Scratchpad files (lưu bền bên ngoài) |
| "tool returned nothing" | Phân biệt: valid empty (chấp nhận) và access failure (retry) |
| "high overall accuracy, users report errors" | Stratified validation — kiểm tra độ chính xác theo từng loại |
| "sources disagree" | Chú thích cả hai kèm provenance và ngày tháng |
| "generic error message" | Thay bằng structured error context |
| "model contradicts itself" | Fresh start + summary injection |
| "inline citations lost after processing" | Chuyển sang structured claim-source mappings |
| "monitoring shows stable metrics but quality complaints" | Tỷ lệ lỗi theo từng loại thay vì tổng hợp |
| "long task exceeds context window" | Scratchpad files + quản lý ranh giới context |

### Common Exam Traps

| Bẫy | Đáp án đúng |
|---|---|
| "Tóm tắt hội thoại để tiết kiệm context" | Sai — tóm tắt làm mất chi tiết; dùng persistent fact blocks |
| "Độ chính xác tổng 95% nghĩa là hệ thống đáng tin" | Sai — kiểm tra độ chính xác theo loại; số tổng che vấn đề theo danh mục |
| "Chọn nguồn mới hơn khi chúng mâu thuẫn" | Sai — chú thích cả hai kèm provenance; để bên tiêu thụ quyết định |
| "Trả 'No results found — please try again'" | Sai nếu tìm kiếm thực sự không có gì — chấp nhận kết quả rỗng |
| "Citation inline trong văn bản là đủ" | Sai cho production — chúng mất khi tổng hợp; dùng structured mapping |
| "Theo dõi tỷ lệ lỗi tổng thể để đánh giá chất lượng" | Sai — theo dõi tỷ lệ lỗi theo từng loại để bắt suy giảm theo danh mục |
| "Giữ mọi context trong conversation history" | Sai — dùng scratchpad file để lưu bền bên ngoài qua các ranh giới |

## Glossary

### Context Window

Số token tối đa (input cộng output) mà Claude xử lý được trong một lời gọi API. Mọi thứ trong hội thoại — system prompt, message history, tool definition và response — đều phải nằm trong giới hạn này.

**Current state (kiểm tra 14/10/2026):** kích thước context window phụ thuộc từng model, không phải một con số duy nhất. Bốn model hiện tại (Fable 5.1, Opus 5.5, Sonnet 5.5 và Haiku 5.5) có window 1M token; các model cũ như Haiku 4.5 có 200K. Exam guide không nêu kích thước window ở bất cứ đâu trong Domain 5, và các câu luyện tập của domain này không bao giờ phụ thuộc vào con số đó. Hãy coi mọi con số cụ thể trong một tình huống là ràng buộc do tình huống đặt ra, không phải thuộc tính của model.

**Ngữ cảnh thi:** đề kiểm tra các chiến lược ở trong giới hạn: progressive summarisation, cắt tỉa message và ưu tiên nội dung. Biết cái bẫy của progressive summarisation — nén lặp lại có thể làm rơi các chi tiết cụ thể mà bước sau cần. *Xem thêm: 5.1 Context Window Management*

### Token Counting

Quá trình đo xem prompt hoặc response tiêu tốn bao nhiêu token. Response của API có `input_tokens` và `output_tokens` trong field `usage`. Hạch toán token chính xác là điều thiết yếu cho quản lý context window.

**Ngữ cảnh thi:** biết cách đọc field `usage` và rằng số token tính cả mọi nội dung (system prompt, message, tool definition). Thuật toán tokenization và tỷ lệ theo ký tự nằm ngoài phạm vi — danh sách ngoài phạm vi của guide loại trừ "token counting algorithms or tokenization specifics". *Xem thêm: 5.1 Context Window Management*

### Prompt Caching

Tính năng API cho phép cache nội dung prompt dùng lại thường xuyên, giảm latency và chi phí cho các request sau. Nội dung được đánh dấu bằng breakpoint `cache_control` (`type: "ephemeral"`, TTL khoảng năm phút) đặt ở cuối khối tĩnh — system prompt, tool definition, tài liệu lớn — còn nội dung động xếp sau đó. Cache hit được tính phí ở mức giảm.

**Ngữ cảnh thi:** biết caching tồn tại, yêu cầu thứ tự tĩnh-trước-động, và vị trí breakpoint ở cuối prefix tĩnh. Danh sách ngoài phạm vi của guide loại trừ "prompt caching implementation details (beyond knowing it exists)", nên chiều sâu hơn mức này không được thi. *Xem thêm: 5.1 Context Window Management*

### Escalation Triggers

Điều kiện để agent chuyển một vụ việc cho con người thay vì tiếp tục tự động. Trigger hợp lệ: khách hàng yêu cầu rõ ràng gặp con người (thực hiện ngay, không điều tra trước), chính sách có khoảng trống hoặc ngoại lệ mà agent không giải quyết được, và agent không thể tiến triển có ý nghĩa.

**Ngữ cảnh thi:** escalation dựa trên cảm xúc và điểm confidence tự báo cáo là proxy không đáng tin cho độ phức tạp của vụ việc — lựa chọn dựa trên chúng là distractor. Khi khách hàng bực bội nhưng vấn đề nằm trong khả năng của agent, hãy ghi nhận sự bực bội và đề nghị giải quyết, chỉ escalate nếu họ nhắc lại mong muốn. *Xem thêm: 5.2 Escalation & Ambiguity*

### Policy Gap vs Policy Violation

Phân biệt giữa yêu cầu mà chính sách không đề cập (gap) và yêu cầu mà chính sách cấm (violation). **Gap** — ví dụ price matching với đối thủ trong khi chính sách chỉ nói về điều chỉnh trên site của mình — cần escalate vì agent không có thẩm quyền quyết định. **Violation** cần từ chối rõ ràng kèm giải thích chính sách.

**Ngữ cảnh thi:** đề kiểm tra việc nhận ra chính sách mơ hồ hoặc im lặng nghĩa là escalate, không phải tự ứng biến. Khi kết quả tool trả về nhiều khách hàng khớp, hãy hỏi thêm định danh thay vì chọn theo heuristic. *Xem thêm: 5.2 Escalation & Ambiguity*

### Structured Error Context

Mẫu báo lỗi giúp coordinator đưa ra quyết định phục hồi thông minh: loại lỗi, truy vấn đã thử, kết quả một phần (nếu có) và các cách tiếp cận thay thế tiềm năng. Các trạng thái chung chung như "search unavailable" che mất ngữ cảnh mà coordinator cần.

**Ngữ cảnh thi:** cả việc nuốt lỗi im lặng (trả kết quả rỗng như thành công) lẫn chấm dứt toàn bộ workflow chỉ vì một lỗi đều là anti-pattern. Subagent nên tự phục hồi cục bộ với lỗi tạm thời và chỉ truyền lên những gì không giải quyết được, kèm kết quả một phần. *Xem thêm: 5.3 Error Propagation*

### Access Failure vs Valid Empty Result

Phân biệt giữa truy vấn **không chạy được** (timeout, lỗi auth — cần quyết định retry) và truy vấn **chạy thành công mà không tìm thấy gì** (việc không có dữ liệu chính là câu trả lời). Báo lỗi phải phân biệt được hai loại để coordinator phản ứng phù hợp.

**Ngữ cảnh thi:** coi valid empty result là lỗi, hoặc coi access failure là "không có kết quả", đều là đáp án sai. Output tổng hợp nên kèm chú thích phạm vi phủ (coverage annotation) đánh dấu phát hiện nào có căn cứ tốt và vùng nào còn khoảng trống do nguồn không truy cập được. *Xem thêm: 5.3 Error Propagation*

### Context Degradation

Dạng thất bại của các session khám phá kéo dài: model bắt đầu đưa câu trả lời không nhất quán và nhắc đến "typical patterns" thay vì các class và file cụ thể nó đã khám phá trước đó. Đó là dấu hiệu context window đã đầy output khám phá dài dòng.

**Ngữ cảnh thi:** các cách xử lý là scratchpad file, giao việc cho subagent để cô lập output dài dòng, tóm tắt từng giai đoạn khám phá trước khi sang giai đoạn tiếp, và `/compact` để giảm dùng context giữa session. *Xem thêm: 5.4 Codebase Exploration*

### Scratchpad Files

File mà agent duy trì để lưu giữ phát hiện chính qua các ranh giới context khi khám phá codebase lớn. Agent ghi lại khám phá khi đi và đọc lại scratchpad để trả lời các câu hỏi sau, chống lại context degradation.

**Ngữ cảnh thi:** cũng cần biết biến thể phục hồi sau crash: mỗi agent xuất state có cấu trúc ra một vị trí đã biết, và coordinator nạp một manifest khi resume rồi đưa vào prompt của các agent. *Xem thêm: 5.4 Codebase Exploration*

### Stratified Sampling

Lấy mẫu ngẫu nhiên các kết quả trích xuất độ tin cậy cao để con người review, phân tầng theo loại tài liệu và field, nhằm đo tỷ lệ lỗi thật và bắt các mẫu lỗi mới. Nó chống bẫy của metric tổng hợp: độ chính xác tổng 97% có thể che giấu hiệu năng kém ở một loại tài liệu hay field cụ thể.

**Ngữ cảnh thi:** hãy validate độ chính xác theo từng phân đoạn trước khi tự động hoá các kết quả độ tin cậy cao. Lựa chọn tin vào con số tổng, hoặc ngừng review hẳn các mục độ tin cậy cao, đều là distractor. *Xem thêm: 5.5 Human Review & Calibration*

### Confidence Calibration

Đối chiếu độ tin cậy do model báo cáo với độ chính xác thực tế bằng tập validation có nhãn, rồi đặt ngưỡng review dựa trên điểm đã hiệu chỉnh. Điểm tin cậy cấp field giúp dồn năng lực reviewer hạn chế vào nơi cần nhất: các kết quả trích xuất độ tin cậy thấp và tài liệu nguồn mơ hồ hoặc mâu thuẫn.

**Ngữ cảnh thi:** self-reported confidence thô tự nó không đáng tin — hiệu chỉnh với dữ liệu có nhãn là bước được đánh dấu trước khi dùng confidence để định tuyến. *Xem thêm: 5.5 Human Review & Calibration*

### Claim-Source Mapping

Bản ghi có cấu trúc gắn mỗi nhận định với nguồn của nó (URL, tên tài liệu, đoạn trích liên quan), phải được giữ và gộp qua mọi bước tổng hợp. Attribution bị mất khi các phát hiện bị nén mà không mang theo các mapping này.

**Ngữ cảnh thi:** khi các nguồn đáng tin mâu thuẫn, hãy chú thích sự mâu thuẫn kèm cả hai attribution thay vì tuỳ ý chọn một giá trị; coordinator quyết định cách dung hoà. Báo cáo nên tách phát hiện đã được xác lập vững khỏi phát hiện còn tranh cãi. *Xem thêm: 5.6 Information Provenance*

### Temporal Annotation

Yêu cầu có ngày xuất bản hoặc ngày thu thập dữ liệu trong output có cấu trúc để số liệu thuộc các giai đoạn khác nhau không bị đọc nhầm là mâu thuẫn. Thống kê năm 2023 và thống kê năm 2026 khác nhau là **sự thay đổi theo thời gian**, không phải xung đột.

**Ngữ cảnh thi:** mẫu được đánh dấu là đưa ngày tháng vào output của subagent và giữ chúng qua bước tổng hợp, để bên tiêu thụ diễn giải đúng các khác biệt. *Xem thêm: 5.6 Information Provenance*

### Rate Limits & Quotas (out of scope)

Cơ chế kiểm soát throughput của API (số request hoặc token mỗi phút, trả về 429 khi vượt) và giới hạn sử dụng theo kỳ thanh toán. Nên biết chúng tồn tại — nhưng danh sách ngoài phạm vi của exam guide nêu rằng "rate limiting, quotas, or API pricing calculations" sẽ không xuất hiện trong đề.

**Ngữ cảnh thi:** nếu một lựa chọn xoay quanh chiến lược xử lý rate-limit trong câu hỏi Domain 5, hãy nghi ngờ nó; mã 429 chỉ xuất hiện trong domain này như ví dụ của access failure (retry theo `Retry-After`), không bao giờ là chủ đề riêng.

### Batches API

Endpoint API để gửi khối lượng lớn request xử lý bất đồng bộ với chi phí giảm 50%, hoàn tất trong khoảng 24 giờ nhưng không đảm bảo thời gian trả kết quả. Lý tưởng cho công việc hàng loạt offline; sai cho luồng thời gian thực hoặc hướng người dùng.

**Ngữ cảnh thi:** xử lý batch được thi ở Domain 4, không phải Domain 5 — biết con số chi phí, khung thời gian và đánh đổi không đảm bảo. *Xem thêm: 4.5 Batch Processing*
