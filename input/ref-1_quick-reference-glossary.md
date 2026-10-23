# D1 — Quick Reference & Glossary

> Domain 1 · Agentic Architecture & Orchestration · 27% đề thi. Trang tra cứu nhanh: keyword giữ nguyên tiếng Anh, phần giải nghĩa bằng tiếng Việt.

## Quick Reference

### The Agentic Loop

Chu trình thực thi cốt lõi: **Gửi request → kiểm tra `stop_reason` → chạy tool hoặc kết thúc.**

- `stop_reason: "tool_use"` — Claude muốn gọi tool. **Tiếp tục** vòng lặp.
- `stop_reason: "end_turn"` — Claude đã xong. **Dừng** vòng lặp.
- **Kết quả tool phải được thêm vào conversation history** trước vòng lặp kế tiếp. Nếu không, Claude không thể suy luận về những gì tool trả về.
- `stop_reason` là tín hiệu dừng đáng tin cậy: xác định và không mơ hồ, khác với việc parse văn bản trong response.

**Current state (kiểm tra ngày 6/10/2026):** đề thi chỉ kiểm tra `end_turn` và `tool_use`. Messages API thực tế còn trả về `pause_turn`, `max_tokens`, `stop_sequence`, `refusal` và `model_context_window_exceeded`, nên vòng lặp production phải xử lý nhiều hơn hai giá trị thi.

**Ba anti-pattern cần nhận ra ngay:**

| Anti-pattern | Vì sao sai |
|---|---|
| Parse ngôn ngữ tự nhiên ("I'm done") | Mơ hồ: Claude có thể nói "xong bước 1" trong khi vẫn định làm tiếp |
| Dùng iteration cap làm cơ chế điều khiển chính | Hoặc cắt ngang công việc hữu ích, hoặc chạy thừa vòng lặp |
| Kiểm tra `content[0].type == "text"` | Claude có thể trả text cùng với các block `tool_use` trong một response |

Iteration cap chỉ chấp nhận được **như lưới an toàn** (giới hạn tối đa để chặn agent chạy mất kiểm soát), không bao giờ là cơ chế dừng chính.

### Orchestration Patterns

| Pattern | Khi nào dùng | Đặc điểm chính |
|---|---|---|
| Sequential | Mỗi bước phụ thuộc kết quả bước trước | A → B → C, mỗi bước nhận kết quả trước đó |
| Parallel | Subtask độc lập, cần giảm latency | Fan-out, fan-in; các task không chia sẻ state |
| Pipeline | Các giai đoạn chuyên môn khác nhau | Dây chuyền lắp ráp; output bước này là input bước sau |
| Dynamic Adaptive | Không biết trước độ phức tạp của task | Model tự quyết cách chia nhỏ ở runtime |
| Hub-and-Spoke | Mô hình coordinator + specialist | Agent trung tâm giao việc cho các subagent chuyên biệt |

**Decision rule:** dùng parallel khi subtask độc lập; dùng sequential khi mỗi bước cần kết quả trước; dùng dynamic adaptive khi không thể dự đoán cách chia ở thời điểm thiết kế.

### Guardrails Hierarchy

**Prompt instruction mang tính xác suất (probabilistic). Hook mang tính xác định (deterministic).** Đây là khái niệm được thi nhiều nhất trong domain này.

| Cơ chế | Loại | Mức cưỡng chế | Dùng cho |
|---|---|---|---|
| System prompt rules | Probabilistic | Model có thể không tuân thủ | Hướng dẫn văn phong, sở thích mềm |
| `PreToolUse` hooks | Deterministic | Cấp code, trước khi thực thi | Chặn tool call nguy hiểm, validate tham số |
| `PostToolUse` hooks | Deterministic | Cấp code, sau khi thực thi | Validate output, làm sạch kết quả, audit logging |

**Thứ tự chạy hook:** `PreToolUse` chạy trước khi tool chạy, `PostToolUse` chạy sau. Cả hai đều là code, không thể bị vượt qua bằng prompt injection.

**Khi đề nói "must always" hoặc "guaranteed" → đáp án là hooks, không phải prompt.**

### Claude Agent SDK

- **AgentDefinition:** khai báo `description`, system prompt và field `tools` (danh sách phạm vi tool mà subagent được truy cập). Giữ ở mức **tập nhỏ, tập trung theo vai trò**. Ví dụ trong guide đối chiếu 4–5 tool với 18 tool, nơi độ tin cậy chọn tool bị giảm. **Current state (6/10/2026):** tài liệu tool search của Anthropic đặt ngưỡng này ở 30–50 tool; khi thi hãy trả lời theo số liệu của guide.
- **Task tool:** coordinator dùng để giao việc cho subagent. `allowedTools` của coordinator phải chứa `"Task"` (hoặc `"Agent"`, tên mới từ Claude Code v2.1.63), nếu không nó không thể spawn subagent. Subagent chạy trong context riêng.

**Ràng buộc chính:** subagent không chia sẻ bộ nhớ. Mọi context phải được truyền tường minh qua task definition hoặc handoff payload.

### Multi-Agent Systems

**Mô hình Coordinator + Specialist:**

- Coordinator lo phân rã task, điều phối thứ tự và tổng hợp kết quả.
- Mỗi specialist được giới hạn trong một domain, với tập tool nhỏ.
- Truyền context phải tường minh: không có shared memory, không có state ngầm.

**Vì sao dùng nhiều specialist thay vì một agent lớn:**

- Tập tool tập trung giúp giảm lỗi chọn tool.
- Context window nhỏ hơn cho mỗi agent giúp tăng độ chính xác.
- Có thể scale và test độc lập từng specialist.

**Task decomposition:** coordinator quyết định ở runtime cách chia việc. Chia cố định hợp với task dự đoán được; chia động hợp với khám phá mở.

### Human-in-the-Loop

**Định dạng structured handoff** (đề thi kiểm tra đúng mẫu này):

1. **Customer ID** — ai bị ảnh hưởng
2. **Summary** — chuyện gì đã xảy ra (khách quan, không diễn giải)
3. **Root cause** — vì sao xảy ra
4. **Recommended action** — agent đề xuất gì

**Khi nào escalate:** ngoại lệ chính sách, thao tác phá huỷ, và sự mơ hồ thực sự không giải quyết được bằng context hiện có. Lưu ý phân biệt đề thi dùng: điểm số của **classifier** thấp hơn ngưỡng theo từng danh mục là trigger hợp lệ, nhưng **self-reported confidence** của agent thì không, vì guide coi nó hiệu chỉnh kém.

**Quy tắc chính:** không bao giờ thất bại trong im lặng. Nếu agent không hoàn thành được task, nó phải tạo structured handoff, không phải một thông báo lỗi chung chung.

### Error Recovery & Resilience

| Chiến lược | Khi nào dùng |
|---|---|
| `fork_session` | Khám phá rẽ nhánh: thử nhiều hướng mà không làm bẩn context chính |
| Fresh start + summary injection | Context đã cũ hoặc bị nhiễm; bắt đầu hội thoại mới với các sự kiện đã trích ra |
| Retry with error feedback | Lỗi tạm thời; gửi lại input gốc + output lỗi + thông báo lỗi cụ thể cho model |
| Graceful degradation | Kết quả một phần còn hơn không có gì; trả những gì có kèm metadata |

**Dấu hiệu stale context:** model lặp lại chính nó, mâu thuẫn với phát biểu trước đó, hoặc bỏ qua kết quả tool gần đây. Cách sửa không phải "thêm context" mà là bắt đầu mới với bản tóm tắt đã chọn lọc.

### Decision Rules for the Exam

| Nếu đề nói… | Đáp án nhiều khả năng là… |
|---|---|
| "guaranteed", "must always", "enforce" | Hooks (deterministic), không phải prompt |
| "flexibility", "adapt", "unexpected" | Model-driven decision-making |
| "independent subtasks" | Parallel orchestration |
| "each step needs previous output" | Sequential orchestration |
| "premature termination" | Kiểm tra `stop_reason`, không phải iteration cap |
| "runaway agent" | Iteration cap làm safety net |
| "share context between agents" | Truyền tường minh (subagent không có shared memory) |
| "complex task, unknown structure" | Dynamic adaptive orchestration |
| "compliance", "regulatory", "audit" | Programmatic enforcement (hooks), không phải model judgment |

### Common Exam Traps

| Bẫy | Đáp án đúng |
|---|---|
| "Tăng iteration cap để sửa lỗi dừng sớm" | Sai — sửa việc kiểm tra `stop_reason` |
| "Subagent đọc được context của coordinator" | Sai — chúng không kế thừa lịch sử hội thoại; truyền thứ cần thiết vào prompt |
| "System prompt rules đảm bảo tuân thủ" | Sai — prompt chỉ mang tính xác suất; hooks mới đảm bảo |
| "Dùng một agent với nhiều tool cho đơn giản" | Sai — giới hạn mỗi agent trong tập tool nhỏ, theo vai trò |
| "Iteration cap là cơ chế điều khiển vòng lặp chính" | Sai — `stop_reason` là chính; cap chỉ là lưới an toàn |
| "Có text trong response nghĩa là agent đã xong" | Sai — text có thể xuất hiện cùng các block `tool_use` |

## Glossary

### Agentic Loop

Luồng điều khiển trong đó Claude liên tục nhận input, quyết định một hành động (thường là gọi tool), quan sát kết quả rồi tiếp tục cho đến khi task hoàn thành. Vòng lặp chạy đến khi model trả `stop_reason` là `end_turn` thay vì `tool_use`.

**Ngữ cảnh thi:** kiểm tra bạn có hiểu điều kiện kết thúc vòng lặp và cách giá trị `stop_reason` quyết định tiếp tục hay thoát. *Xem thêm: 1.1 Agentic Loops*

### stop_reason

Field trong response của Claude API cho biết vì sao model dừng sinh. Hai giá trị trọng tâm của đề: `end_turn` (model kết thúc response tự nhiên) và `tool_use` (model muốn gọi tool). Trong agentic loop, `tool_use` nghĩa là tiếp tục, `end_turn` nghĩa là task xong. Vòng lặp production còn phải xử lý `pause_turn`, `max_tokens`, `stop_sequence`, `refusal` và `model_context_window_exceeded`.

**Ngữ cảnh thi:** khái niệm được thi thường xuyên. Đáp án xoay quanh `end_turn` so với `tool_use` và tín hiệu mà mỗi giá trị gửi cho lớp orchestration. *Xem thêm: 1.1 Agentic Loops*

### tool_use

Giá trị `stop_reason` cho biết Claude muốn gọi một tool. Response chứa một content block `tool_use` nêu tên tool và tham số đầu vào. Orchestrator phải chạy tool và trả kết quả dưới dạng message `tool_result` trước lần gọi API kế tiếp.

**Ngữ cảnh thi:** hiểu toàn bộ luồng: Claude trả `tool_use`, orchestrator chạy, rồi gửi lại `tool_result`. Biết chuyện gì xảy ra khi kết quả tool sai định dạng hoặc thiếu. *Xem thêm: 1.1 Agentic Loops*

### end_turn

Giá trị `stop_reason` cho biết Claude đã kết thúc response và không cần gọi thêm tool. Trong agentic loop đây là tín hiệu thoát vòng lặp và trả kết quả cuối cho người dùng.

**Ngữ cảnh thi:** đề có thể đưa tình huống bắt bạn quyết định tiếp tục hay dừng. `end_turn` luôn là tín hiệu kết thúc. *Xem thêm: 1.1 Agentic Loops*

### Orchestration Pattern

Cách thiết kế để điều phối một hoặc nhiều lần gọi Claude nhằm hoàn thành task. Guide nêu: **prompt chaining** (các bước tuần tự cố định), **dynamic adaptive decomposition** (model quyết định cách chia ở runtime) và điều phối **hub-and-spoke**. Chạy song song các subtask độc lập là dạng phổ biến còn lại.

**Ngữ cảnh thi:** phải ghép đúng pattern với use case. Biết khi nào prompt chaining tốt hơn một prompt nguyên khối, và khi nào chạy song song thực sự có lợi. *Xem thêm: 1.2 Multi-Agent Orchestration*

### Multi-Agent System

Kiến trúc nhiều agent chuyên biệt cùng hợp tác hoàn thành task. Mỗi agent có system prompt, tool và trách nhiệm riêng. Topology được thi là **hub-and-spoke**: một coordinator giao việc cho các subagent và mọi giao tiếp giữa agent đều đi qua nó. Subagent không bao giờ giao tiếp trực tiếp với nhau. Các lựa chọn đề xuất giao tiếp peer-to-peer là distractor vì phá vỡ khả năng quan sát, xử lý lỗi nhất quán và kiểm soát luồng thông tin.

**Ngữ cảnh thi:** nắm đánh đổi giữa single-agent và multi-agent. Đề kiểm tra bạn có nhận ra khi nào multi-agent là hợp lý và khi nào pattern đơn giản hơn là đủ. *Xem thêm: 1.2 Multi-Agent Orchestration*

### Coordinator

Agent trung tâm trong hệ thống hub-and-spoke. Nó phân rã task, spawn và sắp xếp thứ tự subagent, rồi tổng hợp kết quả. Đây là thành phần duy nhất nhìn thấy toàn bộ công việc, và mọi message giữa các subagent đều đi qua nó.

**Ngữ cảnh thi:** các tình huống thường hỏng vì coordinator tự làm việc chuyên môn, hoặc vì subagent nói chuyện trực tiếp với nhau. Cả hai đều là distractor: coordinator giao việc và tổng hợp, và là trung tâm giao tiếp duy nhất. *Xem thêm: 1.2 Multi-Agent Orchestration*

### Subagent

Một instance Claude riêng do coordinator spawn để xử lý một phần việc có phạm vi rõ ràng. Nó chạy trong context window riêng, với system prompt và danh sách tool riêng, rồi trả kết quả cho coordinator khi xong.

**Ngữ cảnh thi:** đặc tính được thi nhiều nhất là **isolation**: subagent không thấy hội thoại của coordinator. Mọi thứ nó cần phải được truyền tường minh trong task definition. *Xem thêm: 1.3 Subagent Invocation and Context Passing*

### Task Tool (Agent)

Tool mà coordinator gọi để giao việc cho subagent. Guide gọi nó là `Task`. **Current state (kiểm tra 6/10/2026):** Claude Code gọi là `Agent` (tên từ v2.1.63) và vẫn chấp nhận `Task` như alias. Cả hai tên cùng chỉ một cơ chế giao việc.

**Ngữ cảnh thi:** với các câu có đáp án theo guide, hãy trả lời theo tên `Task`. Nhận ra `Agent` nếu gặp trong tài liệu hoặc công cụ. *Xem thêm: 1.3 Subagent Invocation and Context Passing*

### AgentDefinition

Khai báo của một subagent: `description`, hướng dẫn (instructions) và field `tools` giới hạn các tool nó được dùng. Lưu ý field hướng dẫn tên là `prompt`, **không phải** `systemPrompt` — một đáp án sai thường gặp.

**Ngữ cảnh thi:** biết tên field và biết `tools` giới hạn quyền truy cập. Giới hạn mỗi agent trong tập nhỏ theo vai trò. Ví dụ guide đối chiếu 4–5 tool với 18, khi độ tin cậy chọn tool giảm chỉ vì độ phức tạp quyết định. **Current state (6/10/2026):** tài liệu tool search của Anthropic đặt ngưỡng ở 30–50 tool; khi thi hãy trả lời theo số liệu của guide. *Xem thêm: 1.3 Subagent Invocation and Context Passing*

### allowedTools

Danh sách tool mà một agent được phép gọi. Với coordinator, nó là **cổng chặn chính việc giao việc**: nếu `allowedTools` không có `"Task"` (hoặc `"Agent"`, tên từ Claude Code v2.1.63), coordinator không thể spawn subagent, dù prompt viết thế nào.

**Ngữ cảnh thi:** lỗi hay được thi: coordinator "không chịu giao việc" thường do `allowedTools` thiếu tool giao việc, không phải do prompt. *Xem thêm: 1.3 Subagent Invocation and Context Passing*

### fork_session

Tuỳ chọn rẽ nhánh một session để agent khám phá hướng khác mà không làm bẩn context gốc. Có dạng `fork_session` / `forkSession` trong SDK và `--fork-session` trên CLI. Đặt cạnh `resume`: `resume` chỉ định session, còn `fork_session` rẽ nhánh từ session đó thay vì nối tiếp.

**Ngữ cảnh thi:** là đáp án khi tình huống cần khám phá phân nhánh (thử nhiều cách) mà vẫn giữ mạch công việc chính sạch. *Xem thêm: 1.7 Session State and Resumption*

### Programmatic Enforcement

Cưỡng chế quy tắc workflow bằng code (hook, gate hoặc check) thay vì bằng hướng dẫn trong system prompt. Prompt mang tính xác suất và luôn có tỷ lệ lỗi khác 0. Programmatic enforcement mang tính xác định.

**Ngữ cảnh thi:** quy tắc quyết định mà đề lặp lại: nếu một lần thất bại dẫn đến thiệt hại tài chính, vi phạm bảo mật hoặc vi phạm tuân thủ thì đáp án là programmatic enforcement. Prompt mạnh hơn hay few-shot luôn là distractor trong các tình huống đó. *Xem thêm: 1.4 Workflow Enforcement and Handoff*

### Prerequisite Gate

Kiểm tra cấp code chặn một tool chạy cho đến khi điều kiện trước đó được đáp ứng. Ví dụ: từ chối `process_refund` cho đến khi `get_customer` trả về customer ID đã xác minh trong session hiện tại.

**Ngữ cảnh thi:** cách sửa chuẩn cho tình huống "prompt bảo phải xác minh nhưng nó bỏ qua 8% số lần". Gate đưa tỷ lệ lỗi về 0 vì model không thể đi vòng qua. *Xem thêm: 1.4 Workflow Enforcement and Handoff*

### Structured Handoff

Bản tóm tắt tự đủ mà agent soạn khi escalate sang con người không có transcript hội thoại. Phải gồm customer ID, tóm tắt khách quan, root cause, số tiền (nếu có) và hành động đề xuất.

**Ngữ cảnh thi:** ràng buộc được thi: con người không thấy gì ngoài bản tóm tắt này. Lựa chọn thiếu field bắt buộc, hoặc giả định người đọc xem được lịch sử chat, đều sai. Lưu ý "handoff" trong guide nghĩa là escalate sang con người; Agent SDK không có primitive handoff giữa agent với agent. *Xem thêm: 1.4 Workflow Enforcement and Handoff*

### PreToolUse

Sự kiện hook của Agent SDK chạy **trước** khi tool thực thi. Vì chạy trước, nó có thể từ chối lời gọi hoặc viết lại tham số, nên là cơ chế để chặn thao tác nguy hiểm và validate input.

**Ngữ cảnh thi:** đáp án mỗi khi tình huống đòi hỏi điều gì đó "must never" xảy ra. Ghép với `PostToolUse`: Pre chặn lời gọi, Post xử lý kết quả. *Xem thêm: 1.5 Agent SDK Hooks*

### PostToolUse

Sự kiện hook của Agent SDK chạy **sau** khi tool call thành công. Là nơi chuẩn hoá hoặc validate output của tool, che giá trị nhạy cảm và audit logging.

**Ngữ cảnh thi:** vấn đề ở kết quả tool, như định dạng không nhất quán giữa các nguồn dữ liệu hay số thẻ tín dụng xuất hiện trong kết quả, là việc của `PostToolUse`, không phải của prompt. *Xem thêm: 1.5 Agent SDK Hooks*

### Prompt Chaining

Phân rã tuần tự cố định: task được chia từ lúc thiết kế thành chuỗi bước có thứ tự, mỗi bước nhận output của bước trước.

**Ngữ cảnh thi:** lựa chọn đúng khi cấu trúc công việc biết trước và ổn định. Đối lập với dynamic adaptive decomposition, là đáp án khi không biết trước. *Xem thêm: 1.6 Task Decomposition Strategies*

### Dynamic Adaptive Decomposition

Để model quyết định ở runtime cách chia nhỏ task, thay vì cố định các bước từ trước.

**Ngữ cảnh thi:** dấu hiệu là đề mô tả công việc khó đoán, mở hoặc mang tính khám phá — "cấu trúc không biết trước". Khi các bước dự đoán được thì prompt chaining là đáp án tốt hơn. *Xem thêm: 1.6 Task Decomposition Strategies*

### Attention Dilution

Sự suy giảm xảy ra khi một agent phải giữ quá nhiều mối quan tâm cùng lúc: khi hướng dẫn và tool tích tụ, chất lượng giảm trên tất cả thay vì ở một chỗ.

**Ngữ cảnh thi:** lý do phân rã và subagent theo vai trò thắng một agent lớn làm-tất-cả. Nhận ra đây là nguyên nhân gốc khi đề mô tả agent trở nên kém tin cậy sau khi thêm phạm vi. *Xem thêm: 1.6 Task Decomposition Strategies*

### Session Resumption

Tiếp tục một session trước đó thay vì bắt đầu mới, để giữ lại state đã tích luỹ. Resume theo tên hoặc ID. Tên có thể đặt khi bắt đầu session bằng `-n` / `--name`.

**Ngữ cảnh thi:** đáp án khi tình huống cần liên tục giữa các lần gọi. Đối lập với việc chủ động bắt đầu mới, khi context hiện có đã cũ. *Xem thêm: 1.7 Session State and Resumption*

### Stale Context

Session có lịch sử tích luỹ bắt đầu gây hại: model lặp lại chính nó, mâu thuẫn với phát biểu trước, hoặc bỏ qua kết quả tool gần đây.

**Ngữ cảnh thi:** cách sửa phản trực giác mới là điều được thi: không thêm context, mà bắt đầu session mới được khởi tạo bằng bản tóm tắt chọn lọc các sự kiện còn quan trọng. *Xem thêm: 1.7 Session State and Resumption*

### Error Recovery

Chiến lược xử lý lỗi trong agentic loop mà không làm sập toàn bộ workflow. Các cách phổ biến: retry kèm error feedback, fallback sang chiến lược đơn giản hơn, graceful degradation (trả kết quả một phần) và escalate lên người vận hành.

**Ngữ cảnh thi:** kiểm tra khả năng thiết kế hệ thống agentic bền vững. Biết khi nào retry và khi nào thất bại nhẹ nhàng, và cách ngăn vòng lặp retry vô hạn. *Xem thêm: 1.4 Workflow Enforcement and Handoff*

### Claude Agent SDK

Framework chính thức của Anthropic (Python và TypeScript) để xây ứng dụng agentic. Cung cấp agent definition kèm quản lý tool, hooks và spawn subagent, đồng thời tự xử lý agentic loop bên trong để nhà phát triển tập trung cấu hình hành vi agent thay vì viết logic vòng lặp.

**Ngữ cảnh thi:** biết hình dạng `AgentDefinition`, cổng Task tool để spawn subagent và các SDK hook được thi ở 1.5. *Xem thêm: 1.3 Subagent Invocation and Context Passing*

### Routing Pattern

Cách tiếp cận trong đó một bước phân loại quyết định handler chuyên biệt nào xử lý request.

**Ngữ cảnh thi:** hãy coi đây là **thuật ngữ bẫy** ở Domain 1. Bộ phân loại routing quyết định agent nào nhận request, nhưng không làm gì về cách agent đó hành xử sau đó. Các câu mẫu Domain 1 của guide đánh dấu nó sai hai lần, vì lỗi mô tả xảy ra bên trong quá trình thực thi của agent, nơi cách sửa là prerequisite gate hoặc hook. Routing cũng là phương án sai cho bộ tool quá lớn — chia thành agent theo vai trò mới là đáp án. *Xem thêm: 1.4 Workflow Enforcement and Handoff*

### Guardrail

Cơ chế an toàn giữ hành vi của Claude trong ranh giới chấp nhận được, bằng cách validate input, validate output hoặc hạn chế quyền truy cập tool.

**Ngữ cảnh thi:** Guardrail không còn là task statement độc lập của Domain 1. Các dạng được thi là cưỡng chế xác định qua workflow prerequisite và handoff gate (1.4) và Agent SDK hook như chặn bằng `PreToolUse` (1.5). *Xem thêm: 1.4 Workflow Enforcement and Handoff*

### Human-in-the-Loop

Mẫu thiết kế trong đó một số hành động của agent cần con người phê duyệt rõ ràng trước khi thực thi, thường cho thao tác có tác động lớn.

**Ngữ cảnh thi:** không còn là task statement độc lập của Domain 1. Approval gate được thi như workflow enforcement pattern (1.4), còn escalation sang con người được thi ở Domain 5.2 (escalation và xử lý mơ hồ). *Xem thêm: 1.4 Workflow Enforcement and Handoff*
