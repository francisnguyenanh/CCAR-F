# D4 — Quick Reference & Glossary

> Domain 4 · Prompt Engineering & Structured Output · 20% đề thi. Trang tra cứu nhanh: keyword giữ nguyên tiếng Anh, phần giải nghĩa bằng tiếng Việt.

## Quick Reference

### System Prompts

- **Ví dụ code cụ thể thắng mô tả bằng văn xuôi.** Thay vì viết "dùng tên biến rõ ràng", hãy đưa đoạn code before/after.
- **Severity calibration:** nếu không có ví dụ về thế nào là "critical" so với "minor", model coi mọi vấn đề quan trọng như nhau. Đưa 2–3 ví dụ hiệu chỉnh cho thấy các mức nghiêm trọng bằng đoạn code cụ thể.

**Cấu trúc một system prompt:**

1. Vai trò và ngữ cảnh (model là ai, đang làm gì)
2. Quy tắc và ràng buộc (phải/không được làm gì)
3. Đặc tả định dạng output
4. Ví dụ hiệu chỉnh (mức nghiêm trọng, giọng điệu, mức chi tiết)

**Quy tắc chính:** system prompt là cách tiết kiệm chi phí nhất để kiểm soát hành vi, vì một prompt định hình mọi request thay vì lặp lại trong từng lời gọi.

### Structured Output — tool_use vs Text

| Phương pháp | Đảm bảo | Dùng khi |
|---|---|---|
| Forced `tool_choice` (`{ type: "tool", name: ... }`) | Chắc chắn có tool call; JSON schema của tool ràng buộc hình dạng | Cần một cấu trúc cụ thể mọi lần |
| `tool_choice: any` | Chắc chắn có tool call, model chọn tool nào | Nhiều schema trích xuất, chưa biết loại tài liệu |
| `tool_choice: auto` | Model có thể dùng hoặc không dùng tool | Agentic loop mà response dạng text cũng hợp lệ |
| Prompt-based JSON | Không cưỡng chế schema | Trường hợp đơn giản, chỉ để làm prototype |

**Mẫu ưa thích của đề thi:** định nghĩa một tool có mục đích duy nhất là cấu trúc hoá output (ví dụ `extract_entities`), rồi ép nó bằng `tool_choice: { type: "tool", name: "extract_entities" }`. Cách này đảm bảo response khớp schema của bạn.

**Current state (6/10/2026):** forced `tool_choice` và `tool_choice: any` trả lỗi 400 trên Claude Opus 5.5, Sonnet 5.5, Fable 5.1 và Mythos 5.1, và không dùng được với extended thinking thủ công trên mọi model. Phương án thay thế được tài liệu hoá là `auto` kèm `strict: true` trên tool, hoặc `output_config.format` khi bản thân response cần hình dạng JSON cố định. Khi thi hãy trả lời mẫu forced.

**Vì sao tool_use hơn prompt-based JSON:**

- Schema được API validate, không phải hậu xử lý
- Loại bỏ lỗi cú pháp: JSON sai định dạng, thiếu field, thừa field
- Hoạt động với streaming (các chunk có cấu trúc)

**Lưu ý đề thi hỏi nhiều nhất:** JSON schema chặt loại bỏ lỗi **syntax** nhưng **không** ngăn lỗi **semantic** — các dòng không cộng ra tổng, giá trị trích vào sai field, ngày hợp lý nhưng không phải ngày có trong tài liệu. Các lựa chọn nói tool_use ngăn mọi lỗi trích xuất đều sai.

### Schema Design for Structured Output

- Làm field **optional hoặc union-type với `null`** khi dữ liệu có thể thiếu. Nếu field là required mà dữ liệu vắng, model sẽ **bịa (fabricate)** giá trị để thoả schema.
- Dùng `enum` cho lựa chọn có ràng buộc để tránh giá trị tự do.
- Giữ schema **phẳng nếu có thể** — schema lồng sâu làm tăng lỗi trích xuất.
- Thêm field `description` cho từng property — chúng hướng dẫn model biết cần trích gì.

**Quy tắc chống fabrication:** nếu một field có thể không có giá trị thật, hãy cho nó kiểu union — `{"type": ["string", "null"]}` — và để nó ra ngoài mảng `required` của object cha. Như vậy model được phép trả `null` thay vì bịa dữ liệu.

Lưu ý cú pháp: `nullable: true` là của OpenAPI, không phải JSON Schema, và `required` là mảng trên object cha chứ không phải boolean theo từng property. `input_schema` dùng một trong hai dạng sai này sẽ bị từ chối.

### Few-Shot Examples

**Khi nào dùng few-shot:** khi chỉ dùng hướng dẫn thì output không nhất quán. Few-shot minh hoạ đúng định dạng và cách suy luận bạn mong đợi.

**Best practice:**

- **2–4 ví dụ** là điểm tối ưu. Nhiều hơn tăng chi phí context; ít hơn có thể không phủ edge case.
- Đưa **reasoning** vào ví dụ, không chỉ input → output. Cho thấy vì sao đáp án là như vậy.
- Phủ **edge case** — ít nhất một ví dụ thể hiện hành vi ở biên.
- Đặt ví dụ trong **system prompt** để hưởng lợi caching, hoặc trong user message nếu thay đổi theo từng request.

**Lợi ích giảm dần:** đi từ 0 lên 2 ví dụ có tác động lớn nhất. Đi từ 4 lên 8 hiếm khi cải thiện chất lượng mà tốn thêm context.

### Prompt Chaining

**Ghi chú phạm vi:** guide xếp prompt chaining ở Task Statement 1.6 (pipeline tuần tự cố định so với dynamic adaptive decomposition), không thuộc Domain 4. Nó được nhắc lại ở đây vì validation giữa các bước là bạn đồng hành tự nhiên của vòng retry ở TS 4.4, nhưng khi thi hãy mong nó được tính là khái niệm Domain 1.

Pipeline nhiều bước, mỗi bước là một prompt tập trung với một trách nhiệm.

**Mẫu:** Bước 1 (extract) → Bước 2 (validate) → Bước 3 (format) → Bước 4 (synthesise)

**Ưu điểm:**

- Mỗi bước có prompt nhỏ, tập trung hơn — độ chính xác mỗi bước cao hơn
- Kết quả trung gian có thể validate trước khi đi tiếp
- Từng bước có thể retry mà không phải chạy lại cả chuỗi
- Có thể dùng model khác nhau cho từng bước (tối ưu chi phí)

**Khi nào chain, khi nào dùng một prompt:** chain khi task có các giai đoạn riêng với yêu cầu khác nhau. Dùng một prompt khi task thống nhất và định dạng output đơn giản.

### Retry Pattern — retry-with-error-feedback

Khi output không qua validation, gửi lại: **prompt gốc + output lỗi + thông báo lỗi validation cụ thể.**

```text
Original: "Extract all dates from this contract"
Failed output: { dates: ["2024-01-15", "next Tuesday"] }
Error: "dates[1] is relative ('next Tuesday'), not absolute. All dates must be ISO 8601 format."
```

Model thấy nó đã tạo ra gì, sai ở đâu, và có thể sửa đúng chỗ. Không bao giờ chỉ nói "try again" — luôn kèm lỗi cụ thể.

**Khi nào retry, khi nào escalate:**

- **Retry:** lỗi validation, sai định dạng, thiếu field — model sửa được
- **Escalate:** thất bại lặp lại (>2 lần retry), confidence dưới ngưỡng, diễn giải sai về căn bản

**Vai trò của Pydantic (Python):** parsing cưỡng chế schema; custom validator cưỡng chế các quy tắc ngữ nghĩa mà JSON schema không biểu đạt được (tổng phải khớp, ngày phải theo thứ tự). `ValidationError` của nó cho thông báo theo từng field mà bạn đưa thẳng vào prompt retry.

### Batch API

| Thuộc tính | Giá trị |
|---|---|
| Tiết kiệm chi phí | Rẻ hơn 50% so với đồng bộ |
| Độ trễ | Tới 24 giờ (không đảm bảo nhanh hơn) |
| Use case | Khối lượng lớn chịu được độ trễ |
| Không dùng cho | Request thời gian thực, tương tác hoặc hướng người dùng |

**Điểm thi chính:** Batch API dành cho throughput và chi phí, không phải tốc độ. Nếu đề nhắc "real-time" hoặc "user-facing" thì Batch API là sai.

### Self-Review Limitation

Model **không thể review hiệu quả output của chính nó trong cùng session.** Nó giữ lại lập luận đã tạo ra output ban đầu và thiên về xác nhận nó.

**Cách sửa:** dùng **instance model riêng** (hội thoại mới, không chia sẻ lịch sử) để review. Instance review chỉ thấy output, không thấy lập luận đã tạo ra nó.

**Với input lớn:** dùng **per-file pass** (phân tích từng file độc lập) cộng một **cross-file integration pass** (tổng hợp phát hiện). Đây là cách giảm "attention dilution" — xử lý mọi thứ trong một lượt khiến model bỏ sót chi tiết.

### Decision Rules for the Exam

| Nếu đề nói… | Đáp án nhiều khả năng là… |
|---|---|
| "guaranteed schema compliance" | Forced `tool_choice` với tool cụ thể; `tool_choice: any` khi chưa biết loại tài liệu |
| "output sometimes has wrong format" | Thêm few-shot examples (2–4) |
| "model fabricates missing data" | Làm field schema optional/nullable |
| "validation failed, need to fix" | retry-with-error-feedback (gốc + lỗi + thông báo lỗi) |
| "50% cost reduction", "bulk processing" | Batch API |
| "real-time", "user-facing" | KHÔNG dùng Batch API — dùng đồng bộ |
| "inconsistent output quality" | Few-shot examples hoặc prompt chaining |
| "review its own output" | Instance riêng (không phải cùng session) |
| "large document, missing details" | Per-file pass + cross-file integration |
| "instructions alone aren't working" | Thêm few-shot examples |

### Common Exam Traps

| Bẫy | Đáp án đúng |
|---|---|
| "Dùng prompt-based JSON cho production" | Sai — dùng tool use với schema; guide ép `tool_choice`, trong khi một số model hiện tại (10/2026), gồm Opus 5.5 và Sonnet 5.5, từ chối forced choice; trên các model đó dùng `auto` với `strict: true` |
| "Chỉ nói 'try again' khi validation thất bại" | Sai — kèm output gốc + output lỗi + thông báo lỗi cụ thể |
| "Batch API cho phản hồi nhanh hơn" | Sai — Batch API đổi độ trễ lấy tiết kiệm chi phí |
| "Review output trong cùng hội thoại" | Sai — review cùng session bị thiên kiến; dùng instance riêng |
| "Thêm 10+ few-shot examples cho kết quả tốt nhất" | Sai — guide nói 2–4 ví dụ có chủ đích (tài liệu hiện hành gợi ý 3–5); nhiều hơn lãng phí token |
| "Required field ngăn việc bịa dữ liệu" | Sai — required field GÂY RA fabrication khi dữ liệu thiếu |
| "Một prompt lớn xử lý mọi thứ" | Sai — chain prompt khi task có các giai đoạn riêng |

## Glossary

### System Prompt

Message hướng dẫn ban đầu gửi cho Claude bằng tham số `system` trong lời gọi API. Nó đặt hành vi tổng thể, persona, ràng buộc và định dạng output cho hội thoại. System prompt không nằm trong message history — nó đứng trên và tồn tại xuyên suốt mọi lượt.

**Ngữ cảnh thi:** biết khác biệt giữa system prompt và user message. Đề kiểm tra best practice cho system prompt: định nghĩa vai trò rõ, ràng buộc tường minh, đặc tả định dạng output và tránh hướng dẫn mâu thuẫn. *Xem thêm: 4.1 System Prompts*

### Structured Output

Kỹ thuật để Claude trả response theo định dạng cụ thể, máy parse được như JSON, XML hay YAML. Đạt được qua hướng dẫn định dạng tường minh trong prompt, định nghĩa JSON Schema, hoặc schema của tool-use.

**Ngữ cảnh thi:** đề kiểm tra hai cách tiếp cận: hướng dẫn dựa trên prompt và tool-use schema. Biết đánh đổi, và biết rằng tool-use schema loại bỏ lỗi cú pháp nhưng không ngăn lỗi ngữ nghĩa.

**Current state (6/10/2026):** điều khiển cấp API cho output bị ràng buộc hiện là `output_config.format` (structured outputs), phần mà guide không đề cập. *Xem thêm: 4.3 Structured Output*

### Prompt Chaining

Kỹ thuật orchestration trong đó output của một lần gọi Claude trở thành input của lần kế tiếp. Mỗi bước trong chuỗi có task tập trung, cụ thể. Chaining phân rã bài toán phức tạp thành các bước quản lý được và cho phép validate hoặc biến đổi giữa các bước.

**Ngữ cảnh thi:** biết khi nào dùng prompt chaining so với một prompt đơn. Đề kiểm tra nguyên tắc mỗi mắt xích chỉ làm tốt một việc. Hiểu cách truyền context giữa các bước và nơi chèn validation gate.

**Ghi chú phạm vi:** guide xếp prompt chaining dưới Task Statement 1.6, không thuộc Domain 4. *Xem thêm: 4.4 Validation-Retry Loops*

### Few-Shot Examples

Các cặp input-output đưa vào prompt để minh hoạ hành vi, định dạng hoặc kiểu suy luận mong muốn. Bằng cách cho Claude thấy ví dụ cụ thể về response đúng, bạn giảm mơ hồ và tăng tính nhất quán. Few-shot đặt trong system prompt hoặc user message trước request thực.

**Ngữ cảnh thi:** biết best practice: dùng ví dụ đa dạng phủ edge case, đặt trước request, và khớp đúng định dạng bạn muốn ở output. Đề có thể hỏi cần bao nhiêu ví dụ (2–4 ví dụ có chủ đích; hơn 4 lãng phí token). *Xem thêm: 4.2 Few-Shot Prompting*

### Prompt Optimisation

Quá trình lặp lại để tinh chỉnh prompt nhằm cải thiện chất lượng output, giảm chi phí và tăng độ tin cậy. Kỹ thuật gồm đơn giản hoá hướng dẫn, loại bỏ mơ hồ, thêm ràng buộc và kiểm thử với bộ evaluation case.

**Ngữ cảnh thi:** đề kiểm tra cách tiếp cận có hệ thống để cải thiện prompt thay vì chỉnh tuỳ hứng. Biết quy trình dựa trên đánh giá: xác định test case, đo hiệu năng nền, thay đổi có chủ đích, rồi đo lại. *Xem thêm: 4.5 Batch Processing*

### Output Validation

Kiểm tra bằng code lên response của Claude để xác nhận chúng đáp ứng tiêu chí mong đợi trước khi dùng ở bước sau. Validation có thể kiểm tra định dạng (JSON hợp lệ, đúng schema), nội dung (đủ field bắt buộc, giá trị trong khoảng) và an toàn (không có nội dung bị cấm). Validation thất bại kích hoạt retry hoặc fallback.

**Ngữ cảnh thi:** biết các chiến lược validation phổ biến: schema validation (JSON Schema, Zod, Pydantic), kiểm tra nội dung, và review bởi một instance Claude độc lập không có context sinh output (review cùng session giữ thiên kiến suy luận và là bẫy được đánh dấu). Hiểu validation nằm ở đâu trong agentic loop. *Xem thêm: 4.4 Validation-Retry Loops*

### Prefilling

Bắt đầu response của Claude bằng cách cung cấp phần mở đầu của assistant message, trước đây dùng để ép response theo một định dạng.

**Current state (6/10/2026):** prefill ở lượt assistant cuối bị từ chối với HTTP 400 trên Claude 4.6 trở lên. Từ "prefill" không xuất hiện ở đâu trong exam guide, nên đây cũng không phải kỹ thuật được thi. Nó chỉ được liệt kê để bạn nhận ra thuật ngữ nếu gặp trong tài liệu cũ; phương án thay thế được tài liệu hoá là `output_config.format`. *Xem thêm: 4.3 Structured Output*

### XML Tags

Dấu phân cách dùng trong prompt để cấu trúc nội dung thành các phần có nhãn rõ ràng. Claude được huấn luyện để hiểu các tag kiểu XML như `<instructions>`, `<context>` và `<examples>`. Dùng tag giúp prompt dễ đọc hơn và giúp Claude nhận ra mục đích của từng phần.

**Ngữ cảnh thi:** "XML" không xuất hiện ở đâu trong exam guide, nên đừng mong có câu hỏi về cú pháp tag. Thực hành này vẫn là hướng dẫn thật của Anthropic và đáng biết: phần được gắn tag giúp giảm hiểu sai ranh giới trong prompt. *Xem thêm: 4.1 System Prompts*

### Chain of Thought

Kỹ thuật prompting yêu cầu Claude trình bày suy luận từng bước trước khi đưa ra đáp án cuối. Giúp tăng độ chính xác với task phức tạp bằng cách buộc model đi qua bài toán một cách có phương pháp. Có thể kích hoạt bằng chỉ dẫn như "think step by step" hoặc dùng extended thinking.

**Ngữ cảnh thi:** biết khi nào chain of thought giúp ích (suy luận phức tạp, bài toán nhiều bước) và khi nào không cần (truy xuất sự kiện đơn giản). Hiểu quan hệ giữa chain of thought prompting và tính năng extended thinking của Claude. *Xem thêm: 4.1 System Prompts*

### Temperature

Tham số lấy mẫu trước đây điều khiển độ ngẫu nhiên của response Claude. Temperature thấp (ví dụ 0.0) cho output xác định, tập trung hơn. Temperature cao (ví dụ 0.8) cho output đa dạng, sáng tạo hơn. Mặc định là 1.0.

**Ngữ cảnh thi:** "Temperature" không xuất hiện ở đâu trong exam guide — không trong task statement nào, cũng không trong phụ lục — nên đừng mong nó là đáp án. Các câu luyện tập của domain này chỉ dùng nó như lựa chọn sai.

**Current state (6/10/2026):** giá trị temperature, `top_p` và `top_k` khác mặc định bị từ chối với HTTP 400 trên Claude 4.7 trở lên. Hãy điều khiển hành vi bằng prompting. *Xem thêm: 4.5 Batch Processing*
