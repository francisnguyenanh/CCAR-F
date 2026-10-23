# 1.2 — Multi-Agent Orchestration

## Tổng quan

**Multi-agent orchestration** là cách tổ chức nhiều agent cùng giải một bài toán lớn: một **coordinator** (agent điều phối) chia việc, giao cho các **subagent** chuyên biệt, rồi tổng hợp kết quả. Mô hình thi hay gặp nhất là **hub-and-spoke**: coordinator ở giữa, mọi giao tiếp đi qua nó.

Đề thi xoay quanh bốn câu hỏi: ai chịu trách nhiệm điều phối và tổng hợp; subagent biết gì (và không biết gì); khi báo cáo bị thiếu mảng nội dung thì lỗi nằm ở đâu; và khi nào nên gọi ít hay nhiều specialist. Quy tắc nhớ nhanh: **coordinator chịu trách nhiệm phạm vi và luồng thông tin; subagent chỉ biết những gì được đưa vào prompt của nó.**

## K1. Mô hình hub-and-spoke và vai trò của coordinator

### Trọng tâm

Coordinator là nơi duy nhất phân rã nhiệm vụ, giao việc, định tuyến thông tin giữa các subagent và tổng hợp kết quả. Subagent không nói chuyện trực tiếp với nhau.

### Giải thích

Trong hub-and-spoke, coordinator là "hub", các subagent là "spoke". Mọi luồng dữ liệu đi qua hub: researcher A trả kết quả cho coordinator, coordinator quyết định có chuyển cho researcher B hay synthesizer hay không. Thiết kế này mang lại ba lợi ích mà đề thi hay nhắc:

- **Observability / traceability**: mọi thông tin chuyển giao đều có log tại một điểm, dễ kiểm toán và gỡ lỗi.
- **Kiểm soát**: coordinator quyết định thông tin nào được chia sẻ, tránh lan truyền dữ liệu nhạy cảm hoặc sai.
- **Xử lý lỗi nhất quán**: khi một subagent thất bại, chỉ coordinator cần quyết định thử lại, bỏ qua hay báo cáo thiếu.

Nếu cho hai research agent nhắn tin trực tiếp cho nhau (agent-to-agent), bạn có những đường truyền không ghi log, khó biết kết luận cuối cùng dựa trên thông tin nào, và lỗi của một agent lan sang agent khác mà không ai thấy. Vì vậy khi hai agent cần trao đổi phát hiện, đáp án chuẩn là **định tuyến qua coordinator** (kèm provenance, tức nguồn gốc).

Coordinator thường thực hiện bốn việc: phân rã yêu cầu, giao việc (kèm đủ ngữ cảnh), định tuyến kết quả, và tổng hợp. Cần phân biệt: coordinator có thể là một Claude agent (linh hoạt, dùng khi bài toán mở) hoặc code cố định (xác định, dùng khi luồng đã biết).

### Keyword

- `coordinator` — agent điều phối, phân rã, giao việc và tổng hợp
- `subagent` — agent con chuyên biệt, nhận một nhiệm vụ hẹp từ coordinator
- `hub-and-spoke` — mô hình trung tâm: mọi giao tiếp đi qua coordinator
- `traceability` — khả năng truy vết thông tin đã đi đâu, từ nguồn nào
- `agent-to-agent messaging` — agent nhắn trực tiếp nhau, bỏ qua coordinator (không khuyến nghị)
- `aggregation` — tổng hợp kết quả từ nhiều subagent thành một đầu ra

### Bẫy đề thi

- ✗ Cho hai research agent nhắn trực tiếp để nhanh hơn ⇒ ✓ Định tuyến qua coordinator để có log, kiểm soát và provenance
- ✗ Nghĩ coordinator chỉ là "người chuyển tin" ⇒ ✓ Coordinator chịu trách nhiệm phân rã, giao việc, định tuyến và tổng hợp
- ✗ Coi mô hình nhiều agent nào cũng nhanh và tốt hơn một agent ⇒ ✓ Chọn theo bài toán; thêm agent kéo theo chi phí điều phối

### Câu hỏi

#### Q1. Hai research agent (một tìm tài liệu học thuật, một tìm tin tức) cần chia sẻ phát hiện để tránh trùng lặp. Nhóm kiến trúc muốn đảm bảo có thể kiểm toán được thông tin nào ảnh hưởng đến báo cáo cuối. Thiết kế nào phù hợp nhất?
- A. Cho hai agent gửi tin nhắn trực tiếp cho nhau để giảm độ trễ
- B. Dùng chung một biến toàn cục mà cả hai cùng ghi và đọc
- C. Để cả hai chạy độc lập hoàn toàn và không bao giờ chia sẻ gì
- D. Định tuyến phát hiện của từng agent qua coordinator, giữ log và nguồn gốc

**Đáp án:** D

**Giải thích:** Hub-and-spoke đặt coordinator làm điểm duy nhất chuyển thông tin nên có log và provenance. A và B tạo đường truyền không ghi log, khó truy vết. C bỏ qua nhu cầu tránh trùng lặp; coordinator vẫn có thể chia sẻ thông tin cần thiết.

#### Q2. Một coordinator nhận kết quả của ba subagent, nhưng báo cáo cuối có số liệu mâu thuẫn mà không ai biết do agent nào. Điều gì giải thích tốt nhất lý do hub-and-spoke hữu ích ở đây?
- A. Mọi kết quả đi qua một điểm nên coordinator có thể ghi nguồn, phát hiện mâu thuẫn và xử lý nhất quán
- B. Nó làm các subagent chạy nhanh hơn
- C. Nó loại bỏ nhu cầu viết prompt cho subagent
- D. Nó đảm bảo mô hình không bao giờ sai

**Đáp án:** A

**Giải thích:** Giá trị của hub-and-spoke là tập trung điều phối và truy vết. B không phải mục đích. C sai vì vẫn phải viết prompt cho từng subagent. D là khẳng định quá mức, không kiến trúc nào đảm bảo điều này.

## K2. Ngữ cảnh cô lập của subagent

### Trọng tâm

Subagent **không tự thừa hưởng** lịch sử hội thoại của coordinator. Thứ duy nhất nó biết là prompt mà coordinator truyền vào. Muốn subagent dùng thông tin gì, phải đưa tường minh.

### Giải thích

Mỗi subagent chạy trong context window riêng, bắt đầu "sạch". Điều này có chủ đích: context của subagent không bị nhiễu bởi toàn bộ cuộc hội thoại, và chỉ kết quả cuối cùng của subagent quay về coordinator (không phải toàn bộ các bước trung gian). Hệ quả là không có "bộ nhớ chung" ngầm.

Tình huống kinh điển: researcher đã tìm được các phát hiện, rồi coordinator gọi synthesizer để viết báo cáo, nhưng synthesizer không trích dẫn được nguồn. Nguyên nhân không phải model kém, mà là coordinator **không đưa các phát hiện và nguồn vào prompt** của synthesizer. Synthesizer không thể trích dẫn thứ nó chưa từng thấy.

Cách làm đúng: trong prompt giao việc, đưa vào:

- Mục tiêu và tiêu chí hoàn thành của nhiệm vụ.
- Dữ liệu cần dùng: các phát hiện kèm **evidence và provenance** (URL, tên tài liệu, trang, độ tin cậy).
- Ràng buộc về định dạng đầu ra mong muốn.

Cách sai: giả định "shared memory" (agent kia chắc đã biết), hoặc dán cả đoạn hội thoại dài chưa chọn lọc (tốn token, gây nhiễu). Nguyên tắc là truyền **đủ và có chọn lọc**.

### Keyword

- `isolated context` — mỗi subagent có context window riêng, không dùng chung
- `context passing` — truyền thông tin cần thiết vào prompt của subagent
- `provenance` — nguồn gốc của thông tin (URL, tài liệu, trang)
- `shared memory` — bộ nhớ dùng chung giả định; mặc định không tồn tại giữa subagent
- `delegation prompt` — prompt coordinator dùng để giao việc cho subagent
- `context window` — giới hạn lượng token model xử lý trong một lần

### Bẫy đề thi

- ✗ Giả định subagent tự biết kết quả của agent trước ⇒ ✓ Truyền tường minh phát hiện và nguồn trong prompt giao việc
- ✗ Sửa lỗi thiếu trích dẫn bằng cách yêu cầu synthesizer "nhớ cite nguồn" ⇒ ✓ Đưa metadata nguồn vào dữ liệu đầu vào của synthesizer
- ✗ Nhồi toàn bộ lịch sử hội thoại vào mọi subagent ⇒ ✓ Chỉ truyền thông tin liên quan đến nhiệm vụ

### Câu hỏi

#### Q1. Synthesizer subagent trả về bản tổng hợp đúng nội dung nhưng không có trích dẫn nào, dù researcher đã thu thập URL đầy đủ. Nguyên nhân gốc rễ khả dĩ nhất?
- A. Synthesizer dùng model quá nhỏ
- B. Coordinator không đưa phát hiện kèm nguồn vào prompt của synthesizer
- C. Researcher chưa bật tính năng ghi nhớ dài hạn
- D. Context window của coordinator đã đầy

**Đáp án:** B

**Giải thích:** Subagent chỉ biết những gì nằm trong prompt của nó. Nếu thiếu URL ở đầu vào thì không thể trích dẫn. A là đoán mò, không giải thích hiện tượng cụ thể. C và D không phải cơ chế truyền thông tin giữa subagent.

#### Q2. Coordinator định giao việc cho subagent phân tích tài chính sau 40 lượt hội thoại với người dùng. Cách truyền ngữ cảnh nào tốt nhất?
- A. Không truyền gì, vì subagent tự đọc được lịch sử của coordinator
- B. Dán toàn bộ 40 lượt hội thoại vào prompt
- C. Truyền mục tiêu, các dữ kiện và ràng buộc liên quan trực tiếp, kèm nguồn
- D. Chỉ truyền tên subagent và để nó tự suy đoán

**Đáp án:** C

**Giải thích:** Truyền đủ và có chọn lọc là nguyên tắc. A sai vì ngữ cảnh không được thừa hưởng tự động. B tốn token và gây nhiễu. D khiến subagent thiếu thông tin để làm đúng việc.

## K3. Lỗ hổng phạm vi (coverage) xuất phát từ khâu phân rã

### Trọng tâm

Nếu báo cáo thiếu một mảng nội dung, hãy tìm lỗi ở **cách coordinator phân rã nhiệm vụ**, không phải ở subagent. Thêm worker vào cùng các nhiệm vụ hẹp không lấp được khoảng trống.

### Giải thích

Giả sử yêu cầu là "báo cáo về năng lượng tái tạo", coordinator tách thành hai nhiệm vụ: solar và wind. Các subagent làm rất tốt việc của mình, nhưng báo cáo thiếu tidal và geothermal. Không subagent nào sai: chúng chỉ làm đúng phạm vi được giao. Khoảng trống nằm **ở thượng nguồn** (upstream), ngay khi coordinator chia việc.

Do đó cách sửa là sửa phân rã:

1. Liệt kê các chiều của chủ đề (loại năng lượng, khu vực, thời gian...) thành một **coverage checklist**.
2. Phân rã sao cho mỗi mục của checklist có nhiệm vụ tương ứng.
3. Sau khi nhận kết quả, coordinator đối chiếu với checklist để phát hiện mục còn trống.

Phương án sai điển hình: "thêm nhiều worker cho solar và wind" hoặc "đổi sang model lớn hơn". Chúng làm cùng một phạm vi hẹp sâu hơn hoặc nhanh hơn, nhưng vẫn không bao giờ chạm tới tidal và geothermal. Đề thi hay gài đáp án "tăng song song" hoặc "tăng chất lượng subagent" để thử xem bạn có xác định đúng tầng gây lỗi hay không.

### Keyword

- `task decomposition` — phân rã yêu cầu lớn thành các nhiệm vụ con
- `coverage` — mức độ bao phủ các khía cạnh cần thiết của chủ đề
- `coverage checklist` — danh sách kiểm tra các chiều/chủ đề phải được bao phủ
- `upstream error` — lỗi phát sinh ở bước trước (phân rã), lan xuống kết quả
- `scope gap` — khoảng trống phạm vi: phần nội dung không ai được giao
- `root cause` — nguyên nhân gốc rễ

### Bẫy đề thi

- ✗ Báo cáo thiếu chủ đề nên cho là subagent làm kém ⇒ ✓ Kiểm tra phân rã của coordinator trước
- ✗ Thêm nhiều worker cho cùng các nhiệm vụ cũ ⇒ ✓ Sửa phân rã và bổ sung nhiệm vụ cho phần còn thiếu
- ✗ Dùng model lớn hơn để "tự nhớ ra" chủ đề bị bỏ sót ⇒ ✓ Dùng coverage checklist có thể kiểm tra được

### Câu hỏi

#### Q1. Báo cáo "ngành năng lượng tái tạo" do multi-agent tạo ra chỉ có solar và wind. Log cho thấy coordinator chỉ giao hai nhiệm vụ này và cả hai subagent hoàn thành tốt. Cách khắc phục hiệu quả nhất?
- A. Tăng số subagent chạy song song cho solar và wind
- B. Đổi các subagent sang model lớn hơn
- C. Yêu cầu synthesizer tự bổ sung nội dung còn thiếu từ kiến thức của nó
- D. Sửa bước phân rã của coordinator và thêm coverage checklist để mọi chiều đều có nhiệm vụ

**Đáp án:** D

**Giải thích:** Lỗi là khoảng trống phạm vi do phân rã. D chữa đúng tầng đó. A và B làm tốt hơn trên cùng phạm vi hẹp. C khiến nội dung không có nguồn, khó kiểm chứng.

#### Q2. Phát biểu nào về lỗi thiếu coverage trong hệ multi-agent là đúng?
- A. Lỗi luôn nằm ở subagent có chất lượng thấp nhất
- B. Lỗi thường xuất phát từ khâu coordinator phân rã, nên cần sửa ở đó trước
- C. Chỉ có thể sửa bằng cách chạy lại toàn bộ hệ thống nhiều lần
- D. Lỗi này không thể phát hiện tự động

**Đáp án:** B

**Giải thích:** Subagent chỉ làm trong phạm vi được giao nên khoảng trống bắt nguồn từ upstream. A sai vì nhiệm vụ nào cũng hoàn thành đúng. C lãng phí. D sai vì coverage checklist giúp coordinator đối chiếu tự động.

## K4. Chọn specialist linh hoạt và tinh chỉnh vòng lặp

### Trọng tâm

Chỉ gọi những subagent **cần thiết** cho từng yêu cầu, và nếu kết quả còn thiếu thì **giao lại phần chưa giải quyết**. Không chạy toàn bộ chuỗi cố định cho mọi câu hỏi.

### Giải thích

Hệ thống có nhiều specialist (search, phân tích tài liệu, kiểm tra số liệu, viết). Nếu coordinator luôn chạy đủ cả chuỗi, câu hỏi đơn giản như "thủ đô của Pháp là gì" cũng tốn năm lần gọi: chậm, đắt, và nhiều lần gọi vô ích có thể thêm nhiễu hoặc lỗi. **Dynamic selection** nghĩa là coordinator đánh giá độ phức tạp của yêu cầu rồi chọn tập con specialist tối thiểu.

Mặt còn lại là **iterative refinement**: sau khi tổng hợp, coordinator kiểm tra kết quả so với coverage checklist hoặc tiêu chí chất lượng. Nếu có phần còn thiếu hoặc mâu thuẫn, nó **giao lại** đúng phần đó (kèm ngữ cảnh về những gì đã biết) thay vì làm lại tất cả hoặc chấp nhận kết quả thiếu.

Hai kỹ thuật này cân bằng nhau: chọn tối thiểu để tiết kiệm, rồi tinh chỉnh khi thấy thiếu để bảo đảm chất lượng. Sai lầm là cực đoan ở một phía: luôn chạy full chain (lãng phí) hoặc chạy một lần rồi coi như xong dù còn lỗ hổng.

### Keyword

- `dynamic agent selection` — chọn subagent theo yêu cầu cụ thể thay vì cố định
- `iterative refinement` — lặp lại để bổ sung phần còn thiếu dựa trên đánh giá kết quả
- `re-delegation` — giao lại phần nhiệm vụ chưa được giải quyết
- `fixed pipeline` — chuỗi bước cố định, luôn chạy đủ
- `specialist agent` — agent chuyên một lĩnh vực hẹp
- `cost-latency tradeoff` — đánh đổi giữa chi phí, độ trễ và chất lượng

### Bẫy đề thi

- ✗ Luôn chạy toàn bộ chuỗi specialist cho an toàn ⇒ ✓ Chọn tập con tối thiểu theo độ phức tạp của yêu cầu
- ✗ Thấy kết quả thiếu thì chạy lại toàn bộ từ đầu ⇒ ✓ Giao lại đúng phần chưa giải quyết
- ✗ Chạy một lượt rồi chấp nhận kết quả mà không đối chiếu tiêu chí ⇒ ✓ Kiểm tra coverage và tinh chỉnh khi cần

### Câu hỏi

#### Q1. Hệ thống support luôn gọi năm specialist (tra cứu, chính sách, tài chính, pháp lý, viết) kể cả với câu hỏi đơn giản như "giờ mở cửa là mấy giờ". Cải tiến nào phù hợp nhất?
- A. Cho coordinator đánh giá yêu cầu và chỉ gọi specialist cần thiết
- B. Chạy năm specialist song song để giảm thời gian
- C. Gộp cả năm vai trò vào một prompt khổng lồ cho mọi trường hợp
- D. Bỏ coordinator, để người dùng tự chọn specialist

**Đáp án:** A

**Giải thích:** Dynamic selection giảm chi phí và nhiễu. B giảm độ trễ nhưng vẫn tốn năm lần gọi. C làm mất lợi ích chuyên biệt hóa. D đẩy việc điều phối sang người dùng, không hợp lý.

#### Q2. Sau lượt đầu, coordinator nhận ra phần "rủi ro pháp lý" của báo cáo còn trống trong khi các phần khác đã đủ. Hành động tốt nhất?
- A. Chạy lại toàn bộ pipeline từ đầu
- B. Giữ nguyên và ghi chú "sẽ bổ sung sau"
- C. Giao lại riêng phần pháp lý cho specialist phù hợp, kèm những gì đã biết
- D. Yêu cầu tất cả specialist viết lại phần của mình

**Đáp án:** C

**Giải thích:** Re-delegation tập trung vào phần chưa giải quyết, tiết kiệm và hiệu quả. A và D lãng phí. B bỏ qua lỗ hổng đã phát hiện.
