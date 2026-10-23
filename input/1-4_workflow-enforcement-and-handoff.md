# 1.4 — Workflow Enforcement and Handoff

## Tổng quan

Bài này trả lời câu hỏi: **khi nào đủ tin vào prompt, khi nào phải ép bằng code?** Agent làm việc dựa trên xác suất, nên với những thao tác có hậu quả thật (tiền, bảo mật, pháp lý) cần các chốt chặn xác định (**programmatic enforcement**) nằm ngoài model. Bài cũng bàn việc kiểm soát vòng đời subagent và cách xử lý một yêu cầu gồm nhiều vấn đề cùng lúc.

Đề thi rất hay đặt hai phương án: "thêm hướng dẫn mạnh hơn vào system prompt" và "thêm gate bằng code". Với rủi ro cao, đáp án gần như luôn là gate bằng code. Quy tắc nhớ nhanh: **prompt để định hướng, code để bảo đảm.**

## K1. Điều kiện tiên quyết xác định (deterministic prerequisites)

### Trọng tâm

Với thao tác rủi ro cao, hãy chặn ở tầng code cho tới khi điều kiện tiên quyết được thỏa (ví dụ đã xác minh danh tính). Dòng "ALWAYS verify" trong system prompt không phải là bảo đảm.

### Giải thích

Model tuân thủ hướng dẫn rất tốt, nhưng không **tuyệt đối**. Với một yêu cầu bất thường, một chuỗi hội thoại dài, hoặc một người dùng khéo léo, tỉ lệ nhỏ vẫn có thể bỏ qua bước xác minh. Với thao tác hoàn tiền, nhỏ cũng là mất tiền thật.

Cách thiết kế đúng là **gate** (cổng) trong code của tool:

```python
def refund(order_id, amount, session):
    if not session.get("identity_verified"):
        return {"error": "IDENTITY_NOT_VERIFIED",
                "message": "Call verify_customer first"}
    ...  # chỉ chạy tới đây khi điều kiện đã đạt
```

Điểm quan trọng: khi bị chặn, tool trả **lỗi có ý nghĩa** để model biết cần làm gì (gọi `verify_customer`) rồi thử lại. Nghĩa là gate không chỉ chặn mà còn dẫn dắt luồng đúng thứ tự.

Điều kiện được kiểm tra dựa trên **trạng thái hệ thống** (session đã xác minh chưa), không dựa trên lời model nói ("tôi đã xác minh rồi"). Nếu tin vào lời model thì gate chỉ còn là hình thức.

Nhắc lại sự khác biệt: prompt làm tăng xác suất làm đúng; gate làm cho việc làm sai là **không thể xảy ra**. Hai thứ không loại trừ nhau, nhưng gate mới là bảo đảm.

### Keyword

- `programmatic enforcement` — ép quy tắc bằng code, không phụ thuộc model tự giác
- `prerequisite gate` — cổng chặn cho tới khi điều kiện tiên quyết đạt
- `identity verification` — xác minh danh tính người dùng
- `session state` — trạng thái phiên do hệ thống nắm (đã xác minh hay chưa)
- `probabilistic compliance` — tuân thủ mang tính xác suất của model
- `actionable error` — thông báo lỗi chỉ rõ bước cần làm tiếp

### Bẫy đề thi

- ✗ Viết "ALWAYS verify identity before refund" trong system prompt là đủ ⇒ ✓ Chặn tool refund bằng code cho đến khi session đã xác minh
- ✗ Tin câu "tôi đã xác minh" do model sinh ra ⇒ ✓ Kiểm tra trạng thái xác minh thực trong hệ thống
- ✗ Gate chỉ chặn và trả lỗi mơ hồ ⇒ ✓ Trả lỗi chỉ rõ bước tiên quyết để model làm tiếp

### Câu hỏi

#### Q1. Agent hỗ trợ khách hàng đôi khi gọi `process_refund` trước khi gọi `verify_customer`, dù system prompt đã ghi "luôn xác minh trước". Giải pháp đáng tin cậy nhất?
- A. Viết lại prompt bằng chữ in hoa và thêm ví dụ
- B. Thêm điều kiện trong code: `process_refund` từ chối khi session chưa được xác minh
- C. Chuyển sang model lớn hơn
- D. Thêm bước người dùng xác nhận lại bằng văn bản

**Đáp án:** B

**Giải thích:** Gate bằng code làm cho việc hoàn tiền trước khi xác minh là không thể xảy ra. A và C chỉ tăng xác suất, không đảm bảo. D không kiểm tra trạng thái xác minh thật.

#### Q2. Khi `process_refund` bị chặn vì chưa xác minh, tool nên trả về gì?
- A. Một chuỗi rỗng
- B. Thông báo "thành công" để tránh làm gián đoạn hội thoại
- C. Lỗi có cấu trúc nói rõ cần gọi `verify_customer` trước
- D. Đóng phiên ngay lập tức

**Đáp án:** C

**Giải thích:** Lỗi có ý nghĩa giúp model tự sửa luồng. A không cho thông tin. B là silent failure nguy hiểm. D phá hỏng trải nghiệm khi có thể khắc phục dễ dàng.

## K2. Chọn mức kiểm soát theo rủi ro

### Trọng tâm

Tiền, bảo mật và quy định pháp lý dùng **enforcement bằng code**; những thứ mang tính phong cách (giọng điệu, định dạng) dùng prompt là đủ. Chọn mức kiểm soát theo hậu quả của sai sót.

### Giải thích

Không phải quy tắc nào cũng cần gate. Gate tốn công phát triển và làm hệ thống cứng hơn. Tiêu chí chọn:

| Loại quy tắc | Hậu quả khi sai | Cách kiểm soát |
|---|---|---|
| Chống rửa tiền (AML), hạn mức, quyền truy cập | Pháp lý, mất tiền, lộ dữ liệu | Backend/gate bắt buộc |
| Thứ tự bước nghiệp vụ có hậu quả | Giao dịch sai | Gate theo trạng thái |
| Giọng điệu email, độ dài, định dạng | Thẩm mỹ | Prompt, few-shot |

Ví dụ workflow có quy tắc AML nghiêm ngặt và yêu cầu giọng điệu email thân thiện. Đáp án đúng là **AML thực thi ở backend**, giọng điệu để trong prompt. Dùng prompt cho cả hai thì AML không được bảo đảm; dùng code cho cả hai thì quá cứng cho một việc linh hoạt (viết giọng điệu bằng if/else gần như vô nghĩa).

Một quy tắc nhớ: tự hỏi "nếu model làm sai 1 lần trong 1000 lần, hậu quả có chấp nhận được không?". Nếu không, cần enforcement. Ngoài ra, enforcement nên nằm ở **tầng thấp nhất có thể** (backend/API), vì nếu gate chỉ ở lớp agent thì kênh khác gọi thẳng backend vẫn vượt qua.

### Keyword

- `risk-based control` — chọn mức kiểm soát tương xứng với rủi ro
- `compliance rule` — quy tắc tuân thủ pháp lý (ví dụ AML)
- `AML (anti-money laundering)` — chống rửa tiền
- `backend enforcement` — kiểm soát ở backend, bất kể agent làm gì
- `soft guidance` — hướng dẫn mềm qua prompt cho thứ không quan trọng sống còn
- `blast radius` — phạm vi thiệt hại khi một thao tác sai

### Bẫy đề thi

- ✗ Dùng prompt cho cả quy tắc AML lẫn giọng điệu email ⇒ ✓ AML bằng backend, giọng điệu bằng prompt
- ✗ Biến mọi sở thích phong cách thành rule cứng trong code ⇒ ✓ Chỉ enforce ở nơi hậu quả sai là nghiêm trọng
- ✗ Đặt gate chỉ trong lớp agent trong khi backend vẫn mở ⇒ ✓ Enforcement ở tầng backend để không thể vòng qua

### Câu hỏi

#### Q1. Quy trình chuyển tiền có hai yêu cầu: (1) giao dịch trên 10.000 USD phải qua kiểm tra AML, (2) email xác nhận nên có giọng điệu thân thiện. Phân bổ nào phù hợp nhất?
- A. Cả hai đặt trong system prompt
- B. Cả hai viết thành rule cứng trong code
- C. AML kiểm tra ở backend; giọng điệu hướng dẫn trong prompt
- D. AML trong prompt; giọng điệu kiểm tra bằng code

**Đáp án:** C

**Giải thích:** AML là yêu cầu pháp lý cần đảm bảo tuyệt đối nên dùng backend; giọng điệu là phong cách mềm hợp với prompt. A không bảo đảm AML. B quá cứng cho giọng điệu. D đảo ngược logic.

#### Q2. Vì sao quy tắc hạn mức giao dịch nên được kiểm tra ở backend chứ không chỉ trong lớp agent?
- A. Vì backend chạy nhanh hơn
- B. Vì model không đọc được hạn mức
- C. Vì prompt không thể chứa số
- D. Vì nếu chỉ ở lớp agent, kênh khác gọi thẳng backend vẫn vượt qua được

**Đáp án:** D

**Giải thích:** Enforcement ở tầng thấp nhất bảo vệ mọi đường vào. A, B, C là lý do không đúng; model đọc được hạn mức, vấn đề là tính đảm bảo.

## K3. Vòng đời subagent: SubagentStart, SubagentStop và PreToolUse trên Agent

### Trọng tâm

`SubagentStart` chỉ **quan sát** việc subagent bắt đầu; `SubagentStop` có thể **chặn việc kết thúc**; muốn **từ chối việc spawn** thì dùng hook `PreToolUse` trên tool `Agent`/`Task`.

### Giải thích

Vì spawn subagent chính là một lời gọi tool, bạn có thể can thiệp tại ba điểm khác nhau của vòng đời:

- **`PreToolUse` (matcher `Agent`/`Task`)**: chạy **trước** khi subagent được tạo. Có thể **từ chối** hoặc sửa lời gọi. Đây là nơi kiểm tra "lời gọi này có đủ trường bắt buộc không".
- **`SubagentStart`**: sự kiện thông báo subagent đã bắt đầu. Dùng để log, đo lường, theo dõi; **không dùng để hủy** việc spawn vì lúc đó spawn đã xảy ra.
- **`SubagentStop`**: chạy khi subagent sắp kết thúc. Có thể **ngăn nó dừng** (yêu cầu làm tiếp) nếu kết quả chưa đạt tiêu chí, ví dụ thiếu phần kiểm thử.

Tình huống: yêu cầu mọi lời gọi subagent phải có `tenant_id`; thiếu thì từ chối. Cách đúng: hook `PreToolUse` trên `Agent` kiểm tra input, thiếu `tenant_id` thì trả quyết định từ chối kèm lý do. Nếu đặt kiểm tra ở `SubagentStart`, subagent đã chạy rồi, có thể đã làm việc với sai tenant.

Nhớ thứ tự thời gian: PreToolUse (trước spawn) → SubagentStart (đã bắt đầu) → ... → SubagentStop (sắp kết thúc). Muốn chặn càng sớm thì chọn hook càng sớm.

### Keyword

- `PreToolUse` — hook chạy trước khi tool thực thi; có thể từ chối hoặc sửa
- `SubagentStart` — hook thông báo subagent bắt đầu; dùng để quan sát
- `SubagentStop` — hook khi subagent sắp kết thúc; có thể buộc nó làm tiếp
- `matcher` — bộ lọc chọn tool nào hook áp dụng
- `tenant identifier` — mã định danh khách thuê trong hệ thống đa tenant
- `hook` — đoạn code của bạn chạy tại một điểm trong vòng đời agent

### Bẫy đề thi

- ✗ Dùng `SubagentStart` để hủy việc spawn ⇒ ✓ Dùng `PreToolUse` trên `Agent`/`Task` để từ chối trước khi spawn
- ✗ Nghĩ `SubagentStop` dùng để chặn việc bắt đầu ⇒ ✓ `SubagentStop` kiểm soát việc kết thúc
- ✗ Kiểm tra input bắt buộc sau khi subagent đã chạy ⇒ ✓ Kiểm tra từ trước bằng hook `PreToolUse`

### Câu hỏi

#### Q1. Hệ thống đa tenant yêu cầu mọi lời gọi subagent phải kèm `tenant_id`; nếu thiếu phải từ chối trước khi subagent chạy. Hook nào phù hợp?
- A. `SubagentStart`, trả về quyết định hủy
- B. `PreToolUse` trên tool `Agent`/`Task`, từ chối khi thiếu `tenant_id`
- C. `PostToolUse` trên tool `Agent`
- D. `SubagentStop`, chặn kết thúc nếu thiếu `tenant_id`

**Đáp án:** B

**Giải thích:** PreToolUse chạy trước khi spawn nên từ chối được. A: lúc SubagentStart thì subagent đã bắt đầu. C chạy sau khi tool đã thực thi. D kiểm soát lúc kết thúc, quá muộn.

#### Q2. Bạn muốn đảm bảo subagent "test-writer" không được kết thúc nếu chưa chạy bộ kiểm thử. Hook nào nên dùng?
- A. `SubagentStop`, từ chối cho dừng nếu chưa có kết quả kiểm thử
- B. `SubagentStart`, đặt cờ nhắc nhở
- C. `PreToolUse` trên `Agent`
- D. Không hook nào làm được, chỉ có thể sửa prompt

**Đáp án:** A

**Giải thích:** SubagentStop cho phép chặn việc kết thúc và buộc làm tiếp. B chỉ quan sát lúc bắt đầu. C kiểm soát lúc spawn. D sai vì hook có thể thực thi điều này.

## K4. Xử lý yêu cầu nhiều vấn đề và bàn giao (handoff)

### Trọng tâm

Khi một tin nhắn chứa nhiều vấn đề, hãy **tách thành từng yêu cầu riêng**, mỗi yêu cầu có điều kiện tiên quyết và kết quả riêng, và giữ nguyên trạng thái từng việc khi bàn giao.

### Giải thích

Khách nhắn: "Hoàn tiền đơn #12, đổi địa chỉ giao hàng và cho tôi biết điểm thưởng". Ba vấn đề với ba mức rủi ro khác nhau: hoàn tiền cần xác minh và có thể cần duyệt; đổi địa chỉ cần xác minh; xem điểm thưởng chỉ cần tra cứu. Nếu xem cả ba như một "cục" duy nhất:

- Việc đơn giản bị chặn lây bởi việc phức tạp.
- Khi một việc thất bại hoặc cần chuyển người, ta không biết việc nào đã xong.
- Gate theo từng thao tác khó áp dụng đúng.

Cách đúng: phân rã thành danh sách yêu cầu, gắn cho mỗi yêu cầu trạng thái (`done`, `pending_approval`, `failed`...), điều kiện tiên quyết riêng, và xử lý song song hoặc tuần tự tùy phụ thuộc. Phản hồi cuối cùng tổng hợp đủ ba kết quả.

Khi cần **handoff sang người** (escalation), hãy gửi kèm **gói ngữ cảnh có cấu trúc**: tóm tắt khách và vấn đề, việc đã làm, việc còn lại, lý do chuyển. Người nhận không thấy hội thoại của agent, nên nếu chỉ chuyển "khách đang bực" thì họ phải hỏi lại từ đầu, gây trải nghiệm tệ. Giữ trạng thái từng yêu cầu giúp bàn giao chính xác.

### Keyword

- `multi-concern request` — yêu cầu chứa nhiều vấn đề độc lập trong một tin nhắn
- `handoff` — bàn giao công việc sang người hoặc agent khác
- `escalation` — chuyển lên cấp xử lý cao hơn khi agent không giải quyết được
- `status tracking` — theo dõi trạng thái từng yêu cầu con
- `context package` — gói thông tin có cấu trúc đi kèm khi bàn giao
- `per-request prerequisite` — điều kiện tiên quyết áp dụng riêng cho từng yêu cầu

### Bẫy đề thi

- ✗ Xử lý ba vấn đề như một khối chung ⇒ ✓ Tách thành yêu cầu riêng với trạng thái và điều kiện riêng
- ✗ Chuyển cho người chỉ kèm câu "khách đang cần hỗ trợ" ⇒ ✓ Gửi tóm tắt có cấu trúc: đã làm gì, còn gì, vì sao chuyển
- ✗ Để việc đơn giản chờ việc phức tạp xong ⇒ ✓ Hoàn thành độc lập các việc không phụ thuộc

### Câu hỏi

#### Q1. Khách gửi một tin: hoàn tiền một đơn hàng, đổi địa chỉ và hỏi điểm thưởng. Hoàn tiền cần phê duyệt của quản lý nên bị chờ. Cách xử lý tốt nhất?
- A. Dừng tất cả cho đến khi hoàn tiền được duyệt
- B. Tách ba yêu cầu; hoàn thành đổi địa chỉ và tra điểm thưởng, đánh dấu hoàn tiền là chờ duyệt, rồi tổng hợp trạng thái cả ba
- C. Chỉ xử lý yêu cầu đầu tiên và bỏ qua hai yêu cầu còn lại
- D. Trả lời chung chung rằng "chúng tôi sẽ xem xét"

**Đáp án:** B

**Giải thích:** Mỗi yêu cầu có trạng thái và điều kiện riêng, việc độc lập không nên bị chặn lây. A làm chậm vô ích. C bỏ sót nhu cầu của khách. D không nói rõ gì đã xong.

#### Q2. Agent cần chuyển một cuộc hội thoại phức tạp cho nhân viên hỗ trợ. Gói bàn giao nào hữu ích nhất?
- A. Chỉ ghi "khách phàn nàn"
- B. Toàn bộ log thô của agent chưa tóm tắt
- C. Không gửi gì, để nhân viên hỏi lại khách
- D. Tóm tắt khách, các việc đã xử lý, việc còn lại và lý do chuyển

**Đáp án:** D

**Giải thích:** Người nhận cần ngữ cảnh ngắn gọn, có cấu trúc để tiếp tục ngay. A thiếu thông tin. B khó đọc. C gây trải nghiệm tệ vì khách phải lặp lại.
