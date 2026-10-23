# 1.3 — Subagent Invocation and Context Passing

## Tổng quan

Bài này nói về **cơ chế kỹ thuật để coordinator gọi subagent** trong Agent SDK: cấp quyền spawn, truyền ngữ cảnh có cấu trúc, chạy song song, và chọn giữa fork với resume. Nếu bài 1.2 trả lời "nên chia agent thế nào", bài 1.3 trả lời "gọi chúng ra sao cho đúng".

Đề thi thích hỏi các lỗi cụ thể: subagent được định nghĩa nhưng không bao giờ chạy; kết quả đúng nhưng mất trích dẫn; hai việc độc lập lại chạy tuần tự; hai hướng thử nghiệm bị trộn vào một lịch sử. Quy tắc nhớ nhanh: **cấp quyền spawn, truyền dữ liệu có cấu trúc kèm nguồn, gọi song song khi độc lập, fork khi cần nhánh rẽ.**

## K1. Quyền spawn subagent: `Task`/`Agent` trong `allowedTools`

### Trọng tâm

Coordinator chỉ có thể khởi chạy subagent khi tool dùng để spawn (tên là `Task`, ở một số phiên bản gọi là `Agent`) nằm trong `allowedTools`. Định nghĩa subagent mà không cấp quyền này thì subagent không bao giờ chạy.

### Giải thích

Trong Agent SDK, việc gọi subagent thực chất là Claude **gọi một tool** (tool spawn). Như mọi tool, nó phải được cho phép. Bạn thường làm hai việc riêng biệt:

1. **Định nghĩa subagent**: mô tả vai trò (`description` để Claude biết khi nào dùng), system prompt riêng, tập tool mà subagent được phép dùng, và có thể cả model.
2. **Cấp quyền cho coordinator** gọi tool spawn bằng cách đưa nó vào `allowedTools`.

```python
options = ClaudeAgentOptions(
    allowed_tools=["Read", "Task"],          # Task = quyền spawn subagent
    agents={
        "code-reviewer": AgentDefinition(
            description="Review code for bugs and security issues",
            prompt="You are a strict code reviewer...",
            tools=["Read", "Grep"],          # tool của subagent, giới hạn hẹp
        )
    },
)
```

Tình huống đề thi: "Subagent `code-reviewer` đã định nghĩa đầy đủ nhưng coordinator không bao giờ gọi nó." Nguyên nhân phổ biến nhất là thiếu `Task`/`Agent` trong `allowedTools`. Viết thêm mô tả vào prompt không thay thế được quyền kỹ thuật. Ngoài ra, `description` của subagent quan trọng cho việc **Claude tự quyết định khi nào dùng**, nên mô tả mơ hồ cũng khiến subagent ít được gọi, nhưng đó là vấn đề thứ hai sau quyền spawn.

Lưu ý nhỏ: tập `tools` của subagent nên theo nguyên tắc **least privilege**; reviewer chỉ cần đọc thì không cấp quyền ghi.

### Keyword

- `allowedTools` — danh sách tool mà agent được phép dùng
- `Task` / `Agent` tool — tool dùng để spawn subagent
- `AgentDefinition` — định nghĩa của subagent: mô tả, prompt, tool, model
- `description` — mô tả giúp Claude quyết định khi nào gọi subagent
- `least privilege` — chỉ cấp quyền tối thiểu cần thiết
- `spawn` — khởi chạy một subagent mới

### Bẫy đề thi

- ✗ Subagent không chạy nên viết prompt mô tả kỹ hơn ⇒ ✓ Kiểm tra `Task`/`Agent` có trong `allowedTools` của coordinator
- ✗ Nghĩ cứ định nghĩa subagent là coordinator tự gọi được ⇒ ✓ Phải cấp quyền gọi tool spawn
- ✗ Cho subagent toàn bộ tool của coordinator cho tiện ⇒ ✓ Giới hạn tool theo vai trò (least privilege)

### Câu hỏi

#### Q1. Nhóm định nghĩa subagent `security-auditor` với mô tả rõ ràng, nhưng khi chạy coordinator luôn tự xử lý và không bao giờ gọi nó. `allowedTools` của coordinator hiện là `["Read", "Grep"]`. Việc nên làm đầu tiên?
- A. Viết lại system prompt của coordinator dài hơn
- B. Đổi sang model lớn hơn
- C. Thêm tool spawn (`Task`/`Agent`) vào `allowedTools` của coordinator
- D. Thêm `Write` vào `allowedTools`

**Đáp án:** C

**Giải thích:** Không có quyền spawn thì coordinator không thể khởi chạy subagent. A chỉ là cải thiện mô tả, không cấp quyền kỹ thuật. B không liên quan. D cấp quyền ghi, không liên quan đến spawn.

#### Q2. Bạn muốn subagent `doc-reader` chỉ để đọc tài liệu. Cấu hình nào đúng nguyên tắc thiết kế?
- A. Cấp cho nó mọi tool của hệ thống để linh hoạt
- B. Chỉ cho các tool đọc như `Read` và `Grep`
- C. Không cấp tool nào và hy vọng nó tự đọc được file
- D. Cấp `Bash` để nó có thể làm mọi thứ

**Đáp án:** B

**Giải thích:** Least privilege: vai trò đọc thì chỉ cần tool đọc, giảm rủi ro hành động ngoài ý muốn. A và D vượt quá nhu cầu. C làm subagent không thể thực hiện nhiệm vụ.

## K2. Truyền bằng chứng có cấu trúc (structured evidence handoff)

### Trọng tâm

Khi giao dữ liệu giữa các agent, truyền **claim kèm metadata nguồn** (URL, tên tài liệu, trang, độ tin cậy) dạng có cấu trúc, không chỉ đoạn văn đã được trau chuốt.

### Giải thích

Khi researcher trả về một đoạn văn mượt như "Thị trường tăng 12% năm 2024", mọi thứ chỉ còn là văn xuôi; nguồn đã mất. Synthesizer nhận được đoạn đó không thể trích dẫn, không thể đánh giá độ tin cậy, và không thể phát hiện hai nguồn mâu thuẫn. Kết quả: báo cáo "đúng sự kiện nhưng không có citation".

Giải pháp là yêu cầu subagent trả về **dữ liệu có cấu trúc** và coordinator giữ nguyên cấu trúc đó khi chuyển tiếp:

```json
{
  "claim": "Thị trường tăng 12% năm 2024",
  "source_url": "https://example.com/report",
  "document_title": "Market Report 2024",
  "page": 14,
  "confidence": "high"
}
```

Lợi ích: (1) synthesizer có thể trích dẫn chính xác; (2) coordinator có thể lọc theo độ tin cậy hoặc ưu tiên nguồn; (3) khi hai claim mâu thuẫn, cả hai nguồn đều còn đó để giải quyết thay vì bị "san phẳng" thành một câu; (4) dễ kiểm tra và test bằng code vì có schema.

Điểm cần phân biệt với bài 1.2: ở 1.2 nhấn mạnh subagent không thừa hưởng ngữ cảnh; ở đây nhấn mạnh **hình thức** của thứ được truyền (có cấu trúc, kèm provenance) và việc giữ metadata xuyên suốt chuỗi.

### Keyword

- `structured output` — đầu ra theo schema xác định (ví dụ JSON), dễ xử lý bằng code
- `claim` — một khẳng định cụ thể cần được chứng minh
- `source metadata` — thông tin nguồn: URL, tiêu đề, trang
- `confidence` — mức độ tin cậy gắn với một claim
- `citation` — trích dẫn nguồn trong báo cáo cuối
- `conflicting sources` — các nguồn mâu thuẫn nhau về cùng một sự kiện

### Bẫy đề thi

- ✗ Chỉ chuyển đoạn văn tóm tắt đã mượt ⇒ ✓ Chuyển claim cùng metadata nguồn có cấu trúc
- ✗ Muốn có citation thì thêm câu "hãy trích dẫn" vào prompt synthesizer ⇒ ✓ Bảo đảm dữ liệu đầu vào đã chứa nguồn
- ✗ Gộp hai nguồn mâu thuẫn thành một câu trung bình ⇒ ✓ Giữ cả hai claim kèm nguồn để giải quyết minh bạch

### Câu hỏi

#### Q1. Pipeline có researcher và synthesizer. Báo cáo cuối luôn đúng nội dung nhưng không có citation. Researcher hiện trả về một đoạn văn tóm tắt. Sửa thế nào?
- A. Yêu cầu synthesizer đoán lại nguồn
- B. Giảm độ dài báo cáo
- C. Thêm bước người dùng tự điền nguồn sau cùng
- D. Cho researcher trả về danh sách claim kèm URL, tiêu đề, trang và độ tin cậy, và giữ nguyên khi chuyển cho synthesizer

**Đáp án:** D

**Giải thích:** Citation chỉ có khi metadata nguồn đi cùng claim. A dẫn tới bịa nguồn. B và C không giải quyết nguyên nhân.

#### Q2. Hai researcher trả về hai con số khác nhau cho cùng một chỉ số. Cách xử lý tốt nhất ở bước tổng hợp?
- A. Lấy trung bình hai con số và bỏ nguồn
- B. Giữ cả hai claim kèm nguồn và độ tin cậy, rồi giải quyết hoặc nêu rõ mâu thuẫn
- C. Chọn ngẫu nhiên một con số
- D. Bỏ cả hai vì không nhất quán

**Đáp án:** B

**Giải thích:** Dữ liệu có cấu trúc cho phép đánh giá nguồn và trình bày minh bạch. A tạo số không có thật. C thiếu căn cứ. D mất thông tin hữu ích.

## K3. Gọi song song các subagent độc lập

### Trọng tâm

Các lời gọi subagent **không phụ thuộc nhau** nên được phát ra đồng thời (nhiều lời gọi spawn trong cùng một lượt) và hợp nhất kết quả sau khi tất cả hoàn tất.

### Giải thích

Nếu coordinator cần (1) tìm kiếm web và (2) phân tích tài liệu nội bộ, và việc (2) không cần kết quả của (1), thì không có lý do để chờ. Claude có thể phát ra **nhiều tool call `Task`/`Agent` trong một response**; chúng chạy đồng thời. Tổng thời gian xấp xỉ thời gian của việc chậm nhất, thay vì tổng các việc.

Quy trình đúng:

1. Xác định đồ thị phụ thuộc: việc nào cần đầu ra của việc nào.
2. Các việc **độc lập** → gọi đồng thời trong cùng một lượt.
3. Các việc **phụ thuộc** → gọi theo thứ tự (ví dụ synthesizer phải chờ kết quả của cả hai).
4. Coordinator hợp nhất sau khi đã nhận đủ kết quả.

Sai lầm kép: chạy tuần tự những việc độc lập (lãng phí độ trễ) và ngược lại, cố song song hóa việc có phụ thuộc (việc sau thiếu đầu vào). Cũng cần nhớ: song song không làm tăng độ chính xác, chỉ giảm độ trễ; và mỗi subagent vẫn tốn token riêng nên tổng chi phí không giảm.

### Keyword

- `parallel execution` — thực thi đồng thời nhiều tác vụ
- `dependency` — quan hệ phụ thuộc: tác vụ B cần đầu ra của A
- `fan-out / fan-in` — tỏa ra nhiều nhánh rồi gom kết quả về
- `latency` — độ trễ tổng thời gian chờ
- `sequential execution` — thực thi tuần tự từng bước
- `independent tasks` — các tác vụ không phụ thuộc nhau

### Bẫy đề thi

- ✗ Chờ web search xong mới bắt đầu phân tích tài liệu nội bộ dù hai việc độc lập ⇒ ✓ Phát hai lời gọi đồng thời rồi hợp nhất
- ✗ Song song hóa cả synthesizer với researcher ⇒ ✓ Việc phụ thuộc phải chờ đầu ra của việc trước
- ✗ Tin rằng song song giảm chi phí token ⇒ ✓ Song song giảm độ trễ, không giảm tổng token

### Câu hỏi

#### Q1. Coordinator cần tìm tin tức mới trên web và đối chiếu với báo cáo nội bộ có sẵn trong thư mục. Hai việc không cần dữ liệu của nhau. Cách gọi tối ưu?
- A. Chạy search trước, xong mới chạy phân tích báo cáo nội bộ
- B. Chạy hai subagent đồng thời rồi hợp nhất kết quả sau khi cả hai xong
- C. Gộp cả hai thành một subagent duy nhất
- D. Chạy báo cáo nội bộ trước, bỏ web search

**Đáp án:** B

**Giải thích:** Việc độc lập nên chạy đồng thời để giảm độ trễ. A lãng phí thời gian chờ. C mất lợi ích chuyên biệt. D bỏ mất một nguồn cần thiết.

#### Q2. Pipeline gồm researcher A, researcher B và synthesizer cần kết quả của cả hai. Cách nào đúng?
- A. Chạy cả ba đồng thời ngay từ đầu
- B. Chạy A rồi B rồi synthesizer, tuần tự hoàn toàn
- C. Chạy A và B đồng thời, đợi cả hai xong rồi mới gọi synthesizer
- D. Chạy synthesizer trước và đưa kết quả cho A, B

**Đáp án:** C

**Giải thích:** A và B độc lập nên song song; synthesizer phụ thuộc cả hai nên phải chờ. A khiến synthesizer thiếu đầu vào. B chậm không cần thiết. D đảo ngược phụ thuộc.

## K4. Fork và resume: khi nào dùng cái nào

### Trọng tâm

**Resume** tiếp tục đúng một lịch sử phiên. **Fork** tạo nhánh mới từ một baseline chung để thử các hướng khác nhau mà không trộn lẫn.

### Giải thích

Hai thao tác này cùng xuất phát từ một phiên đã có, nhưng mục đích khác nhau:

| | Resume | Fork |
|---|---|---|
| Hành vi | Tiếp tục cùng lịch sử, nối thêm vào | Sao chép baseline thành phiên mới độc lập |
| Phù hợp | Làm tiếp một việc đang dở | So sánh nhiều hướng từ cùng điểm xuất phát |
| Rủi ro | Trộn thí nghiệm nếu dùng cho nhiều hướng | Tốn thêm token cho mỗi nhánh |

Tình huống: nhóm đã kiểm toán codebase (baseline), giờ muốn so sánh hai phương án refactor. Nếu resume một phiên duy nhất và thử lần lượt hai phương án, lịch sử của phương án A sẽ lẫn vào phương án B và làm nhiễu phân tích. Cách đúng: **fork hai nhánh độc lập** từ phiên kiểm toán; mỗi nhánh thừa hưởng toàn bộ hiểu biết ban đầu nhưng phát triển riêng; sau đó so sánh kết quả.

Fork tiết kiệm công sức hơn tạo phiên mới hoàn toàn (không phải kiểm toán lại), và giữ cô lập tốt hơn resume. Ngược lại, nếu chỉ tiếp tục một công việc tuyến tính, resume là đủ và rẻ hơn.

### Keyword

- `resume` — tiếp tục một phiên với lịch sử hiện có
- `fork` — tạo nhánh phiên mới từ một baseline chung
- `baseline` — trạng thái chung làm điểm xuất phát cho các nhánh
- `session` — một chuỗi hội thoại và trạng thái làm việc được lưu
- `isolated branch` — nhánh độc lập, không ảnh hưởng nhánh khác
- `parallel exploration` — thăm dò đồng thời nhiều hướng giải quyết

### Bẫy đề thi

- ✗ Resume một phiên và thử hai phương án lần lượt trong đó ⇒ ✓ Fork hai nhánh độc lập từ baseline
- ✗ Dùng fork cho mọi trường hợp kể cả việc tuyến tính ⇒ ✓ Việc tuyến tính chỉ cần resume
- ✗ Tạo phiên hoàn toàn mới và lặp lại phần kiểm toán ban đầu ⇒ ✓ Fork để tái sử dụng baseline đã có

### Câu hỏi

#### Q1. Sau khi kiểm toán một dịch vụ, nhóm muốn thử hai hướng refactor (tách module và viết lại bằng framework mới) và so sánh công bằng. Cách nào phù hợp nhất?
- A. Resume phiên cũ, thử hướng một rồi thử hướng hai trong cùng lịch sử
- B. Tạo hai phiên hoàn toàn mới và lặp lại kiểm toán
- C. Chỉ thử một hướng và bỏ hướng còn lại
- D. Fork hai nhánh từ phiên kiểm toán, mỗi nhánh thử một hướng

**Đáp án:** D

**Giải thích:** Fork giữ baseline và cô lập hai thí nghiệm. A làm lịch sử lẫn lộn. B tốn công kiểm toán lại. C bỏ qua yêu cầu so sánh.

#### Q2. Hôm qua bạn dừng giữa chừng khi đang viết tài liệu một module và không có thay đổi gì mới trong repo. Hôm nay muốn làm tiếp. Nên dùng?
- A. Fork để tạo nhánh mới
- B. Resume phiên đó để tiếp tục với ngữ cảnh sẵn có
- C. Xoá phiên và bắt đầu lại
- D. Tạo ba nhánh fork song song

**Đáp án:** B

**Giải thích:** Công việc tuyến tính chưa đổi gì nên resume là tự nhiên và rẻ nhất. A và D thừa vì không cần so sánh hướng. C bỏ mất ngữ cảnh còn hợp lệ.
