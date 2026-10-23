# 1.7 — Session State and Resumption

## Tổng quan

Công việc với agent thường kéo dài nhiều ngày: hôm nay phân tích kiến trúc, mai quay lại sửa tiếp. Bài này nói về cách **quản lý trạng thái phiên**: khi nào tiếp tục (**resume**), khi nào tách nhánh (**fork**), và đặc biệt là khi nào ngữ cảnh cũ đã **lỗi thời (stale)** nên không được tin tiếp.

Đề thi gài bẫy ở chỗ: resume nghe có vẻ luôn "thông minh" vì giữ được ngữ cảnh, nhưng nếu code đã đổi thì kết quả tool cũ trong lịch sử là thông tin sai mà model vẫn tin. Quy tắc nhớ nhanh: **không có thay đổi → resume; cần so sánh hướng → fork; code đã đổi → phiên mới kèm tóm tắt chọn lọc và đọc lại đúng phần đã đổi.**

## K1. Resume khi công việc và dữ liệu chưa đổi

### Trọng tâm

Nếu các tài liệu đã đọc chưa thay đổi, hãy **resume** phiên có tên để giữ nguyên kết quả tool và phân tích cũ, thay vì bắt đầu lại.

### Giải thích

Phiên làm việc lưu lịch sử hội thoại: các file đã đọc, kết quả lệnh, những kết luận trung gian. Resume nạp lại đúng lịch sử đó để bạn tiếp tục như chưa từng dừng. Với Claude Code, bạn tiếp tục phiên gần nhất bằng `--continue`, hoặc chọn một phiên cụ thể bằng `--resume`; đặt **tên phiên** có ý nghĩa giúp tìm lại dễ dàng.

Khi nào resume là đúng:

- Hôm qua bạn phân tích module thanh toán và dừng giữa chừng; hôm nay repo **không có commit mới** → mọi thứ model đã đọc vẫn đúng.
- Công việc là một dòng liên tục (tiếp tục viết, tiếp tục điều tra) chứ không phải thử nhiều hướng.

Lợi ích: không phải đọc lại hàng chục file (tiết kiệm token và thời gian), không mất các kết luận đã rút ra, và giữ nguyên mạch suy luận. Bắt đầu phiên mới trong trường hợp này là lãng phí: model phải khám phá lại, có thể ra kết luận khác nhau giữa các lần.

Cần ý thức giới hạn: lịch sử càng dài thì context càng đầy; phiên rất dài có thể chạm giới hạn context hoặc làm chất lượng giảm. Resume không phải là "bộ nhớ vô hạn" mà chỉ là nạp lại đoạn hội thoại đã lưu.

### Keyword

- `resume` — tiếp tục phiên đã lưu với toàn bộ lịch sử
- `--continue` — tùy chọn tiếp tục phiên gần nhất của Claude Code
- `--resume` — tùy chọn chọn và tiếp tục một phiên cụ thể
- `named session` — phiên được đặt tên để dễ tìm lại
- `conversation history` — lịch sử hội thoại gồm tool use và kết quả
- `context reuse` — tái sử dụng ngữ cảnh đã xây dựng thay vì làm lại

### Bẫy đề thi

- ✗ Bắt đầu phiên mới dù không có gì thay đổi ⇒ ✓ Resume phiên cũ để giữ phân tích còn hợp lệ
- ✗ Coi resume là bộ nhớ không giới hạn ⇒ ✓ Resume chỉ nạp lại lịch sử đã lưu, vẫn bị giới hạn bởi context window
- ✗ Không đặt tên phiên rồi khó tìm lại ⇒ ✓ Đặt tên phiên rõ ràng khi dự kiến quay lại

### Câu hỏi

#### Q1. Hôm qua bạn dành hai giờ để model phân tích module thanh toán rồi dừng. Hôm nay repo không có thay đổi nào. Bạn muốn tiếp tục từ chỗ dừng. Nên làm gì?
- A. Bắt đầu phiên mới và yêu cầu model đọc lại toàn bộ module
- B. Resume phiên đã đặt tên để tiếp tục với ngữ cảnh cũ
- C. Chép tay kết luận hôm qua vào prompt của phiên mới
- D. Fork phiên thành ba nhánh

**Đáp án:** B

**Giải thích:** Dữ liệu không đổi nên toàn bộ ngữ cảnh vẫn hợp lệ; resume tiết kiệm nhất. A và C lãng phí và có thể mất chi tiết. D không cần vì không so sánh hướng.

#### Q2. Điều nào mô tả đúng giới hạn của resume?
- A. Resume cho phép bộ nhớ vô hạn giữa các phiên
- B. Resume xoá mọi lịch sử để làm mới
- C. Resume tự cập nhật lại tất cả file đã đọc theo trạng thái mới nhất
- D. Resume nạp lại hội thoại đã lưu nhưng vẫn bị giới hạn bởi context window

**Đáp án:** D

**Giải thích:** Resume chỉ khôi phục lịch sử đã có. A là hiểu lầm phổ biến. B sai bản chất. C sai vì nó không tự đọc lại file.

## K2. Fork để tách các giả thuyết khác nhau

### Trọng tâm

Khi cần so sánh các hướng đi từ cùng một điểm xuất phát (ví dụ caching hay tối ưu truy vấn), hãy **fork** thành các nhánh độc lập, không trộn vào một lịch sử.

### Giải thích

Fork tạo một phiên mới là bản sao của phiên hiện tại tại thời điểm fork; từ đó mỗi nhánh đi riêng. Mọi nhánh **thừa hưởng baseline** (các hiểu biết đã có) nhưng thay đổi sau đó không ảnh hưởng nhau.

Tình huống: sau khi profile, nhóm thấy API chậm. Có hai giả thuyết: (1) thêm cache; (2) tối ưu truy vấn SQL. Nếu làm cả hai trong cùng một lịch sử, các kết quả sẽ lẫn: thay đổi từ hướng 1 làm nhiễu số đo hướng 2, và model "nhớ" cả hai khiến lập luận lai tạp. Fork khắc phục:

- Nhánh A: thử cache, đo hiệu năng.
- Nhánh B: thử tối ưu truy vấn, đo hiệu năng.
- So sánh kết quả hai nhánh để quyết định, hoặc kết hợp có chủ đích.

Fork tiết kiệm hơn bắt đầu lại hai phiên mới vì baseline (phần profile ban đầu) không cần làm lại. Nó cũng khác resume: resume nối tiếp **một** lịch sử; fork **nhân bản** lịch sử để có nhiều dòng.

Lưu ý: nhánh fork bắt đầu với cùng ngữ cảnh nên cũng mang theo cùng mức độ "cũ" của baseline. Nếu baseline đã stale, fork không chữa được điều đó (xem K3).

### Keyword

- `fork` — nhân bản phiên thành nhánh độc lập từ một điểm
- `baseline` — điểm xuất phát chung của các nhánh
- `hypothesis` — giả thuyết cần kiểm chứng trong điều tra
- `isolation` — cô lập: thay đổi nhánh này không ảnh hưởng nhánh khác
- `A/B comparison` — so sánh hai phương án trên cùng điều kiện nền
- `history contamination` — lịch sử bị nhiễu bởi các thí nghiệm khác nhau

### Bẫy đề thi

- ✗ Thử cả caching và tối ưu SQL trong cùng một phiên ⇒ ✓ Fork hai nhánh độc lập để đo riêng
- ✗ Tạo hai phiên mới hoàn toàn để so sánh ⇒ ✓ Fork để tái sử dụng baseline đã phân tích
- ✗ Nghĩ fork làm baseline tự động mới hơn ⇒ ✓ Fork mang theo ngữ cảnh gốc, kể cả khi đã cũ

### Câu hỏi

#### Q1. Sau khi profile, bạn có hai giả thuyết cải thiện hiệu năng API: thêm Redis cache hoặc viết lại truy vấn SQL. Bạn muốn đo công bằng và không để hai thí nghiệm ảnh hưởng nhau. Cách làm?
- A. Thử cả hai thay đổi liên tiếp trong cùng một phiên
- B. Resume phiên và nhờ model "cân nhắc cả hai"
- C. Fork hai nhánh từ phiên profile, mỗi nhánh thử một hướng
- D. Bỏ phiên cũ và làm hai phiên mới từ đầu

**Đáp án:** C

**Giải thích:** Fork cho baseline chung và cô lập thí nghiệm. A làm lẫn kết quả. B không tạo cô lập. D tốn công làm lại phần profile.

#### Q2. Điểm khác nhau chính giữa fork và resume là gì?
- A. Fork nhân bản lịch sử thành nhánh độc lập; resume tiếp tục nối vào cùng một lịch sử
- B. Fork xoá lịch sử; resume giữ lịch sử
- C. Fork chỉ dùng được với subagent
- D. Hai thao tác hoàn toàn giống nhau

**Đáp án:** A

**Giải thích:** Fork tạo dòng mới từ baseline; resume tiếp nối dòng cũ. B sai vì fork giữ baseline. C và D sai về bản chất.

## K3. Ngữ cảnh lỗi thời (stale context) và cách xử lý

### Trọng tâm

Khi code đã đổi, kết quả tool cũ trong lịch sử trở nên không đáng tin. **Đừng resume mù quáng**; hãy mở phiên mới kèm bản tóm tắt chọn lọc và đọc lại các file đã thay đổi.

### Giải thích

Lịch sử phiên chứa nội dung file ở thời điểm đã đọc. Nếu sau đó ba file được sửa (bởi bạn, đồng nghiệp, hay merge từ nhánh khác), thì trong context vẫn là bản cũ. Model **không biết** file đã đổi; nó sẽ tự tin dùng nội dung cũ để lập luận, gọi hàm đã bị đổi tên, hoặc phân tích kiến trúc không còn đúng. Đây là lỗi nguy hiểm vì không hề báo lỗi: kết quả trông hợp lý nhưng sai.

Cách xử lý được khuyến nghị:

1. **Mở phiên mới** để không mang theo kết quả tool đã cũ.
2. **Viết bản tóm tắt chọn lọc** (curated summary) của những kết luận vẫn đúng: quyết định thiết kế, phần không đổi, phát hiện quan trọng. Đây là thứ bạn kiểm chứng và chịu trách nhiệm, thay vì chép nguyên lịch sử.
3. **Đọc lại có chủ đích** các file đã đổi để model có dữ liệu mới.

Một lựa chọn trung gian khi vẫn muốn resume: nói rõ cho model biết "các file X, Y, Z đã thay đổi từ lần phân tích trước" để nó đọc lại thay vì dựa vào bản cũ. Nhưng nếu thay đổi rộng, phiên mới + tóm tắt sạch hơn vì không phải mang cả đống kết quả đã lỗi thời.

Điểm mấu chốt: quyết định giữa resume và phiên mới dựa vào **mức độ hợp lệ của ngữ cảnh**, không phải sự tiện lợi.

### Keyword

- `stale context` — ngữ cảnh lỗi thời, không còn khớp với trạng thái thực
- `curated summary` — bản tóm tắt chọn lọc, đã kiểm chứng, cho phiên mới
- `tool result` — kết quả tool trong lịch sử, là ảnh chụp tại thời điểm đọc
- `fresh session` — phiên mới, bắt đầu với context sạch
- `silent staleness` — lỗi thời mà không có cảnh báo nào
- `targeted reread` — đọc lại có chủ đích các phần đã thay đổi

### Bẫy đề thi

- ✗ Resume phiên cũ và tin các đoạn mã đã đọc trước đó dù repo đã đổi ⇒ ✓ Mở phiên mới kèm tóm tắt chọn lọc và đọc lại file đã đổi
- ✗ Nghĩ model tự phát hiện file đã đổi trong lịch sử ⇒ ✓ Phải chủ động báo hoặc cho đọc lại; model không biết
- ✗ Chép nguyên toàn bộ lịch sử cũ vào phiên mới ⇒ ✓ Chỉ mang kết luận còn đúng, đã chọn lọc

### Câu hỏi

#### Q1. Tuần trước agent phân tích kiến trúc dịch vụ. Hôm nay bạn biết ba file chính đã được refactor mạnh. Nếu resume phiên cũ và yêu cầu "tiếp tục thiết kế" thì rủi ro lớn nhất là gì?
- A. Phiên sẽ chạy chậm hơn
- B. Model sẽ từ chối tiếp tục
- C. Model dùng nội dung file cũ trong lịch sử để lập luận mà không biết nó đã sai
- D. Lịch sử sẽ tự động bị xoá

**Đáp án:** C

**Giải thích:** Kết quả tool cũ vẫn nằm trong context như thể còn đúng, nên kết luận có thể sai mà không có cảnh báo. A không phải rủi ro chính. B và D không phải hành vi thực tế.

#### Q2. Cách xử lý nào tốt nhất cho tình huống ba file đã thay đổi từ lần phân tích trước?
- A. Resume và hy vọng model tự nhận ra
- B. Phiên mới với tóm tắt chọn lọc các kết luận còn đúng, rồi cho đọc lại ba file đã đổi
- C. Xoá toàn bộ ghi chú và phân tích lại mọi thứ từ đầu
- D. Fork phiên cũ để có ngữ cảnh rộng hơn

**Đáp án:** B

**Giải thích:** Tóm tắt chọn lọc giữ phần giá trị còn đúng, còn đọc lại file đảm bảo dữ liệu mới. A dựa vào may rủi. C lãng phí phần vẫn hợp lệ. D vẫn mang theo ngữ cảnh cũ.

## K4. Phân tích lại có mục tiêu (targeted re-analysis)

### Trọng tâm

Chỉ kiểm tra lại các thành phần **đã thay đổi** và ranh giới phụ thuộc của chúng, cùng bản tóm tắt phần không đổi; đừng đọc lại toàn bộ codebase.

### Giải thích

Codebase có 60 module, chỉ `auth.ts` thay đổi. Đọc lại cả 60 module tốn nhiều token, loãng chú ý (nhớ lại bài 1.6) và hầu hết chỉ xác nhận điều đã biết. Cách hiệu quả:

1. **Xác định phần đã thay đổi**: dùng công cụ phiên bản (ví dụ `git diff` giữa lần phân tích trước và hiện tại).
2. **Mở rộng đến ranh giới ảnh hưởng**: những module gọi hoặc phụ thuộc `auth.ts` (callers, interface, type chia sẻ). Thay đổi chữ ký hàm có thể làm hỏng nơi khác dù file đó không đổi.
3. **Cung cấp tóm tắt phần không đổi** để model có bối cảnh mà không phải đọc lại.
4. **Đọc lại có chủ đích** `auth.ts` và các ranh giới đó, rồi cập nhật kết luận.

Hai cực đoan đều sai: (a) đọc lại tất cả (lãng phí), (b) chỉ đọc đúng file đã đổi mà bỏ qua ranh giới phụ thuộc (có thể bỏ sót tác động lan truyền). Đáp án đúng nằm ở giữa: **thay đổi + vùng ảnh hưởng trực tiếp**.

Kỹ thuật này kết hợp tự nhiên với K3: sau khi mở phiên mới và có tóm tắt, bước đọc lại được giới hạn đúng vào phần cần thiết.

### Keyword

- `targeted re-analysis` — phân tích lại có mục tiêu, giới hạn ở phần thay đổi
- `git diff` — lệnh xem khác biệt giữa hai trạng thái mã nguồn
- `blast radius` — phạm vi bị ảnh hưởng bởi một thay đổi
- `dependents` — các thành phần phụ thuộc vào phần đã thay đổi
- `unchanged-area summary` — tóm tắt phần không đổi để cung cấp bối cảnh
- `change propagation` — tác động của thay đổi lan sang thành phần khác

### Bẫy đề thi

- ✗ Đọc lại toàn bộ 60 module khi chỉ một file đổi ⇒ ✓ Đọc lại file đổi cùng các ranh giới phụ thuộc trực tiếp
- ✗ Chỉ đọc đúng `auth.ts` mà bỏ qua nơi gọi nó ⇒ ✓ Thêm callers và interface liên quan vì thay đổi có thể lan truyền
- ✗ Không dùng công cụ diff mà đoán file nào đổi ⇒ ✓ Dùng `git diff` hoặc log để xác định chính xác

### Câu hỏi

#### Q1. Một codebase 60 module vừa có thay đổi chỉ trong `auth.ts` sau lần phân tích kiến trúc trước. Chiến lược cập nhật phân tích nào hiệu quả nhất?
- A. Đọc lại cả 60 module
- B. Bỏ qua thay đổi vì chỉ một file
- C. Chỉ đọc đúng nội dung `auth.ts`, không quan tâm nơi khác
- D. Dùng diff để xác định thay đổi, đọc lại `auth.ts` cùng các module phụ thuộc trực tiếp, kèm tóm tắt phần không đổi

**Đáp án:** D

**Giải thích:** Cách này giữ trọng tâm nhưng không bỏ sót tác động lan truyền. A tốn kém và loãng chú ý. B rủi ro. C bỏ sót callers có thể bị hỏng bởi thay đổi giao diện.

#### Q2. Trong `auth.ts` hàm `validateToken` đổi chữ ký (thêm tham số bắt buộc). Điều gì bạn cần đưa vào phạm vi đọc lại ngoài `auth.ts`?
- A. Chỉ file test của `auth.ts`
- B. Toàn bộ thư mục `docs`
- C. Các module gọi `validateToken` và các type liên quan
- D. Không cần gì thêm

**Đáp án:** C

**Giải thích:** Thay đổi chữ ký có thể làm hỏng mọi nơi gọi hàm dù file đó không đổi. A quá hẹp. B không liên quan. D bỏ sót tác động lan truyền.
