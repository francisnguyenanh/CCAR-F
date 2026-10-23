# 1.6 — Task Decomposition Strategies

## Tổng quan

Một tác vụ lớn hiếm khi nên giao cho model trong một lượt duy nhất. **Task decomposition** là việc chia nhỏ tác vụ thành các bước mà mỗi bước model làm tốt. Có hai họ chiến lược chính: **prompt chaining cố định** (các bước biết trước, theo thứ tự cố định) và **phân rã thích ứng** (kế hoạch thay đổi theo những gì phát hiện được). Ngoài ra còn các vấn đề thực tế: một lượt duyệt quá nhiều mục làm model xử lý hời hợt (attention dilution), và kiểm tra từng mục riêng lẻ không bắt được lỗi giữa các mục.

Đề thi hay hỏi "bài toán này nên dùng chiến lược nào" và "vì sao cách làm một lượt cho kết quả không đều". Quy tắc nhớ nhanh: **bước biết trước → pipeline cố định; phạm vi chưa biết → thích ứng; nhiều mục → duyệt riêng từng mục rồi có một lượt tích hợp.**

## K1. Prompt chaining cố định

### Trọng tâm

Khi các bước đã biết trước và lặp lại giống nhau, hãy dùng một chuỗi cố định (ví dụ trích xuất → kiểm tra → định dạng). Không cần agent tự lập kế hoạch lại cho mỗi mục.

### Giải thích

**Prompt chaining** chia tác vụ thành chuỗi bước tuần tự, đầu ra của bước trước là đầu vào của bước sau; mỗi bước có prompt hẹp, rõ ràng, tập trung. Ví dụ xử lý 10.000 hóa đơn chuẩn: (1) trích xuất các trường, (2) kiểm tra hợp lệ theo luật, (3) định dạng thành báo cáo.

Lợi ích của chuỗi cố định:

- **Dễ đoán và dễ kiểm thử**: mỗi bước có đầu vào/đầu ra rõ ràng, bạn có thể đo chất lượng từng bước.
- **Có thể chèn kiểm tra giữa các bước** (gate), ví dụ nếu bước 1 thiếu trường bắt buộc thì dừng hoặc gửi xử lý riêng.
- **Rẻ và nhất quán** khi xử lý hàng loạt: không tốn token để "lập kế hoạch" mỗi lần.
- Mỗi bước dễ tối ưu độc lập (prompt, model nhỏ hơn cho bước đơn giản).

Khi nào dùng: tác vụ có cấu trúc ổn định, input thuộc cùng một loại. Khi nào **không**: khi các bước thực sự phụ thuộc vào thứ chưa biết trước (xem K2). Sai lầm điển hình ngược lại là bắt agent "tự lập kế hoạch lại từ đầu" cho từng tài liệu chuẩn: tốn kém, kết quả giữa các tài liệu không nhất quán, khó kiểm toán.

### Keyword

- `prompt chaining` — chuỗi prompt tuần tự, đầu ra bước trước là đầu vào bước sau
- `fixed pipeline` — quy trình cố định các bước đã biết trước
- `gate` — điểm kiểm tra giữa hai bước để quyết định đi tiếp hay dừng
- `batch processing` — xử lý số lượng lớn mục theo cùng một quy trình
- `consistency` — tính nhất quán giữa các lần xử lý
- `workflow` — quy trình do code định nghĩa, khác với agent tự quyết định

### Bẫy đề thi

- ✗ Cho agent tự lập kế hoạch lại cho mỗi tài liệu chuẩn ⇒ ✓ Dùng pipeline cố định trích xuất, kiểm tra, định dạng
- ✗ Gộp mọi bước vào một prompt khổng lồ cho gọn ⇒ ✓ Chia từng bước hẹp để dễ kiểm thử và tối ưu
- ✗ Dùng pipeline cố định cho bài toán mà bước sau phụ thuộc phát hiện bất ngờ ⇒ ✓ Dùng phân rã thích ứng

### Câu hỏi

#### Q1. Công ty cần xử lý 10.000 hóa đơn cùng định dạng: trích các trường, kiểm tra hợp lệ rồi xuất báo cáo chuẩn. Thiết kế nào hợp lý nhất?
- A. Một agent tự do lập kế hoạch khác nhau cho mỗi hóa đơn
- B. Pipeline cố định ba bước trích xuất, kiểm tra, định dạng
- C. Một prompt duy nhất làm cả ba việc cho cả lô
- D. Nhờ nhân viên làm thủ công và chỉ dùng model để sửa lỗi

**Đáp án:** B

**Giải thích:** Các bước đã biết và lặp lại nên chuỗi cố định cho tính nhất quán, dễ kiểm thử và chi phí thấp. A tốn kém và không nhất quán. C làm khó đo lường từng bước. D không tận dụng tự động hóa.

#### Q2. Lợi ích nào dưới đây KHÔNG phải của prompt chaining cố định?
- A. Dễ kiểm thử từng bước
- B. Có thể chèn kiểm tra chất lượng giữa các bước
- C. Tự động thích ứng khi phát hiện cấu trúc bất ngờ mà không cần sửa quy trình
- D. Chi phí dự đoán được

**Đáp án:** C

**Giải thích:** Chuỗi cố định, theo định nghĩa, không tự thay đổi cấu trúc; khả năng thích ứng thuộc về phân rã thích ứng. A, B, D đều là ưu điểm thật.

## K2. Phân rã thích ứng (adaptive decomposition)

### Trọng tâm

Khi phạm vi và phụ thuộc chưa biết trước, hãy để kế hoạch tiến hóa: bắt đầu bằng khảo sát, rồi cập nhật đồ thị nhiệm vụ khi có phát hiện mới.

### Giải thích

Nhiều tác vụ không thể lên kế hoạch hoàn chỉnh ngay từ đầu. Ví dụ bổ sung test cho một ứng dụng legacy: bạn không biết trước module nào phụ thuộc module nào. Khi viết test cho file A, bạn phát hiện nó dùng một thư viện nội bộ chưa có test nào, và nếu thư viện đó hỏng thì test của A không có ý nghĩa. Thứ tự file ban đầu bỗng không còn tối ưu.

Quy trình thích ứng:

1. **Khảo sát** (map structure): xác định cấu trúc, điểm vào, các phần có rủi ro.
2. **Lập kế hoạch ban đầu** theo ưu tiên (rủi ro cao, ảnh hưởng lớn).
3. **Thực hiện từng phần**, ghi nhận phát hiện mới.
4. **Cập nhật kế hoạch**: thêm nhiệm vụ mới, đổi thứ tự, bỏ nhiệm vụ không còn cần.

Đây cũng là cách agent như Claude Code làm việc với codebase lạ. Điểm khác biệt so với chuỗi cố định: số lượng và thứ tự bước được quyết định lúc chạy bởi **kết quả của các bước trước**. Phải trả giá bằng tính khó đoán và chi phí cao hơn, nên chỉ dùng khi sự bất định là thật.

Sai lầm ngược: bám cứng thứ tự ban đầu ("cứ làm file theo bảng chữ cái") dù phát hiện đã cho thấy thứ tự đó vô nghĩa.

### Keyword

- `adaptive decomposition` — phân rã thay đổi theo phát hiện trong lúc chạy
- `task graph` — đồ thị nhiệm vụ và quan hệ phụ thuộc giữa chúng
- `exploration` — giai đoạn khảo sát để hiểu cấu trúc trước khi hành động
- `emergent dependency` — phụ thuộc chỉ lộ ra trong quá trình làm việc
- `prioritization` — sắp xếp thứ tự theo rủi ro và tác động
- `replanning` — lập lại kế hoạch khi thông tin thay đổi

### Bẫy đề thi

- ✗ Bám thứ tự file ban đầu dù đã phát hiện phụ thuộc mới ⇒ ✓ Cập nhật kế hoạch theo phát hiện
- ✗ Dùng phân rã thích ứng cho tác vụ lặp lại ổn định ⇒ ✓ Tác vụ ổn định dùng pipeline cố định cho rẻ và nhất quán
- ✗ Bắt đầu viết ngay mà chưa khảo sát cấu trúc codebase lạ ⇒ ✓ Khảo sát trước, ưu tiên theo rủi ro rồi mới triển khai

### Câu hỏi

#### Q1. Agent đang bổ sung test cho một codebase legacy 200 module. Giữa chừng phát hiện module `billing` phụ thuộc vào `ledger` chưa có test nào. Hành động tốt nhất?
- A. Tiếp tục theo thứ tự bảng chữ cái đã lập từ đầu
- B. Bỏ `billing` vì quá phức tạp
- C. Chạy lại từ đầu với kế hoạch mới cho cả 200 module
- D. Thêm nhiệm vụ kiểm thử `ledger` vào đồ thị và sắp lại thứ tự hợp lý

**Đáp án:** D

**Giải thích:** Phát hiện phụ thuộc mới cần được phản ánh vào kế hoạch. A bỏ qua thông tin quan trọng. B né vấn đề. C lãng phí khi chỉ cần điều chỉnh cục bộ.

#### Q2. Trường hợp nào phù hợp nhất với phân rã thích ứng thay vì pipeline cố định?
- A. Chuyển 5.000 file CSV cùng schema sang JSON
- B. Dịch hàng loạt tin nhắn theo cùng mẫu
- C. Điều tra nguyên nhân một lỗi hiệu năng chưa rõ trong hệ thống nhiều thành phần
- D. Gửi báo cáo định kỳ theo mẫu có sẵn

**Đáp án:** C

**Giải thích:** Điều tra lỗi chưa rõ cần bước sau phụ thuộc kết quả bước trước. A, B, D đều có bước biết trước và lặp lại nên hợp với pipeline cố định.

## K3. Loãng chú ý khi duyệt nhiều mục trong một lượt (attention dilution)

### Trọng tâm

Khi giao quá nhiều mục trong một lượt, chất lượng không đều: các mục đầu được xem kỹ, các mục sau hời hợt. Hãy tách thành từng lượt cho mỗi mục; **không** chỉ phóng to context window.

### Giải thích

Review 14 file trong một prompt thường cho kết quả quen thuộc: năm file đầu được phân tích sâu, chín file sau chỉ lướt, hoặc nhận xét trùng lặp và mâu thuẫn. Đây là **attention dilution**: nhiều nội dung cạnh tranh sự chú ý, độ sâu trên mỗi mục giảm, và tính nhất quán của tiêu chuẩn đánh giá kém đi.

Phản xạ sai là "dùng model có context lớn hơn". Context lớn giúp **chứa** được nhiều nội dung hơn, nhưng không đảm bảo chú ý đồng đều với mọi phần của nó. Bạn vẫn gặp hiện tượng bỏ sót ở giữa dài.

Cách chữa:

- **Per-item pass**: mỗi file một lượt review riêng, cùng một prompt và tiêu chí, nên độ sâu và tiêu chuẩn đồng đều. Các lượt này độc lập nên có thể chạy song song (ví dụ bằng subagent).
- Đầu ra mỗi lượt theo **schema cố định** (vấn đề, mức độ, vị trí) để dễ gộp.
- Các vấn đề liên quan nhiều mục được xử lý ở bước riêng (xem K4).

Tương đương: thay vì "hãy review toàn bộ PR 14 file", hãy "review file này theo checklist", lặp 14 lần, rồi tổng hợp. Chi phí có thể tăng chút, nhưng chất lượng ổn định và dễ kiểm chứng hơn.

### Keyword

- `attention dilution` — loãng chú ý khi nội dung quá nhiều trong một lượt
- `per-file pass` — lượt xử lý riêng cho từng file/mục
- `context window` — giới hạn lượng nội dung model xử lý, chứa được không đồng nghĩa chú ý đều
- `consistency of criteria` — tính nhất quán của tiêu chí đánh giá giữa các mục
- `fan-out` — tỏa ra nhiều lượt xử lý độc lập
- `structured findings` — kết quả review theo schema cố định, dễ gộp

### Bẫy đề thi

- ✗ Review hết 14 file trong một prompt vì context đủ lớn ⇒ ✓ Mỗi file một lượt review với cùng tiêu chí
- ✗ Chỉ nâng cấp model có context lớn hơn để hết hời hợt ⇒ ✓ Chia nhỏ để độ sâu đồng đều
- ✗ Dặn "hãy xem kỹ từng file" trong một prompt dài là đủ ⇒ ✓ Cấu trúc hóa quy trình thay vì chỉ nhắc nhở

### Câu hỏi

#### Q1. Một PR có 14 file. Review một lượt cho thấy nhận xét chi tiết ở 5 file đầu và hời hợt ở các file còn lại. Cách cải thiện tốt nhất?
- A. Chuyển sang model có context window lớn hơn và giữ một prompt
- B. Thêm câu "hãy xem kỹ tất cả file" vào đầu prompt
- C. Chạy một lượt review riêng cho mỗi file với cùng tiêu chí, rồi gộp kết quả
- D. Chỉ review 5 file đầu vì đó là quan trọng nhất

**Đáp án:** C

**Giải thích:** Tách lượt cho từng file giữ độ sâu và tiêu chí đồng đều. A không giải quyết phân bổ chú ý. B vẫn dựa vào nhắc nhở. D bỏ sót 9 file.

#### Q2. Vì sao việc tăng context window không tự động chữa được attention dilution?
- A. Vì context lớn hơn chỉ cho phép chứa nhiều hơn, chứ không bảo đảm sự chú ý đồng đều trên mọi phần
- B. Vì context window lớn luôn chậm hơn
- C. Vì model không đọc phần giữa của context
- D. Vì context window không ảnh hưởng đến chất lượng

**Đáp án:** A

**Giải thích:** Sức chứa khác với độ chú ý. B và C khẳng định quá mức. D sai vì context ảnh hưởng chất lượng, nhưng lớn hơn không phải giải pháp cho hiện tượng này.

## K4. Lượt tích hợp xuyên mục (cross-item integration)

### Trọng tâm

Review từng mục riêng lẻ không phát hiện được sự không khớp **giữa** các mục (ví dụ hợp đồng API giữa hai service). Cần một lượt tích hợp riêng nhìn vào các phát hiện cục bộ và các giao diện.

### Giải thích

Giả sử ba service A, B, C. Review riêng từng service: code sạch, test qua, không lỗi. Nhưng A gọi B với trường `userId` (chuỗi) trong khi B mong `user_id` (số). Lỗi chỉ lộ ra khi nhìn **hai phía của giao diện cùng lúc**. Lượt per-file không thể thấy vì mỗi lượt chỉ biết một phía.

Do đó thiết kế review hai tầng:

1. **Tầng cục bộ (per-item)**: tìm lỗi trong từng mục, chạy song song, đầu ra có cấu trúc.
2. **Tầng tích hợp (cross-item)**: nhận tóm tắt các phát hiện cục bộ cùng định nghĩa giao diện (API schema, type, contract) để kiểm tra tính nhất quán: tên trường, kiểu dữ liệu, thứ tự gọi, giả định về lỗi.

Tầng tích hợp **không** đọc lại toàn bộ mã nguồn; nó dùng bản tóm tắt và chỉ những phần ranh giới, nên vẫn gọn và có trọng tâm. Cách làm này cũng đáp ứng K3 (độ sâu cục bộ) và bổ sung góc nhìn hệ thống.

Sai lầm cần tránh: suy luận "mỗi file đúng nên cả hệ thống đúng". Tính đúng đắn cục bộ không đảm bảo tính nhất quán toàn cục.

### Keyword

- `integration pass` — lượt kiểm tra tính nhất quán giữa các thành phần
- `API contract` — thỏa thuận về schema, kiểu dữ liệu giữa hai bên giao tiếp
- `interface mismatch` — sự không khớp giữa hai phía của một giao diện
- `local vs global correctness` — đúng cục bộ khác với đúng toàn hệ thống
- `two-stage review` — review hai tầng: từng mục rồi tích hợp
- `summary handoff` — truyền bản tóm tắt phát hiện cục bộ sang bước tích hợp

### Bẫy đề thi

- ✗ Mỗi file đều đạt nên hệ thống nhất quán ⇒ ✓ Cần lượt tích hợp để kiểm tra hợp đồng giữa các thành phần
- ✗ Lượt tích hợp phải đọc lại toàn bộ mã nguồn của mọi file ⇒ ✓ Dùng tóm tắt phát hiện cục bộ và định nghĩa giao diện
- ✗ Chỉ làm lượt tích hợp mà bỏ review từng file ⇒ ✓ Cần cả hai tầng: sâu cục bộ và nhất quán toàn cục

### Câu hỏi

#### Q1. Review từng service riêng đều không có lỗi, nhưng khi deploy thì service A gọi service B thất bại do khác tên trường và kiểu dữ liệu. Biện pháp quy trình nào sẽ bắt được lỗi loại này?
- A. Tăng độ sâu của review từng service
- B. Thêm lượt review tích hợp so sánh hai phía của mỗi API contract
- C. Chạy lại review từng service bằng model mạnh hơn
- D. Bỏ qua vì mỗi service đã đạt

**Đáp án:** B

**Giải thích:** Lỗi nằm ở giao diện giữa hai thành phần, chỉ phát hiện khi nhìn cả hai phía. A và C vẫn chỉ nhìn từng phía. D bỏ qua rủi ro thực tế.

#### Q2. Thiết kế quy trình review 20 module nào hợp lý nhất?
- A. Một lượt duy nhất đọc toàn bộ 20 module
- B. Chỉ lượt tích hợp, không review từng module
- C. Chỉ review từng module, không cần tích hợp
- D. Review từng module song song với đầu ra có cấu trúc, rồi một lượt tích hợp dùng các phát hiện và định nghĩa giao diện

**Đáp án:** D

**Giải thích:** Hai tầng vừa giữ độ sâu cục bộ vừa kiểm tra nhất quán toàn cục. A gặp attention dilution. B thiếu chi tiết cục bộ. C bỏ sót lỗi giao diện.
