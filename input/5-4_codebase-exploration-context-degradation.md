# 5.4 — Codebase Exploration & Context Degradation

## Tổng quan

Khi dùng Claude (đặc biệt trong Claude Code) để khám phá một codebase lớn, phiên làm việc dài sẽ chất đầy kết quả `grep`, nội dung file, log lệnh. Càng nhiều, ngữ cảnh càng nhiễu và **chất lượng suy luận suy giảm** (context degradation): model quên tên class/hàm cụ thể đã thấy trước đó và bắt đầu nói chung chung hoặc đoán.

Bài này dạy cách nhận ra triệu chứng và bốn công cụ đối phó: **scratchpad ngoài ngữ cảnh**, **subagent cô lập khám phá**, **tóm tắt theo giai đoạn / `/compact`**, và **tham chiếu chính xác có mục tiêu**. Quy tắc nhớ nhanh: **đừng để thông tin quan trọng chỉ sống trong ngữ cảnh; ghi ra ngoài, giao việc ồn ào cho subagent, và nén có chủ đích.**

## K1. Nhận diện suy giảm ngữ cảnh

### Trọng tâm

Dấu hiệu điển hình: model **thay tên cụ thể bằng mô tả chung** ("repository class" thay vì `OrderRepository.findById`), lặp lại việc đã làm, hoặc mâu thuẫn với phát hiện trước đó.

### Giải thích

Trong phiên khám phá dài, ngữ cảnh chứa hàng trăm kết quả công cụ. Mặc dù chưa chạm giới hạn cứng, thông tin quan trọng cũ bị chôn giữa nhiều dữ liệu mới (liên hệ hiện tượng lost in the middle ở bài 5.1), và model ưu tiên các mẫu chung hơn chi tiết đã đọc từ lâu.

Các triệu chứng thực tế:

- Trích dẫn "mẫu chung" thay vì ký hiệu chính xác: nói "service layer thường có hàm findById" thay vì chỉ ra `OrderRepository.findById` ở file nào.
- **Hỏi lại** điều đã khám phá hoặc **đọc lại** cùng một file nhiều lần.
- Đề xuất sửa code mâu thuẫn với cấu trúc đã tìm thấy.
- Câu trả lời mơ hồ, thiếu đường dẫn và tên cụ thể.

Biện pháp đúng khi thấy triệu chứng: **phục hồi dữ kiện thực** — ghi lại class, đường dẫn, chuỗi phụ thuộc đã xác nhận vào một nơi ổn định và đưa lại vào ngữ cảnh một cách có mục tiêu (K2, K4). Cách sai: nhắc model "hãy suy nghĩ kỹ hơn" mà không cung cấp bằng chứng nào, vì điều thiếu là **thông tin chính xác trong tầm chú ý**, không phải nỗ lực suy luận.

Việc tăng kích thước cửa sổ không phải thuốc chữa: nhiều ngữ cảnh hơn mà không có tổ chức có thể làm vấn đề nặng thêm.

### Keyword

- `context degradation` — chất lượng suy luận giảm khi ngữ cảnh dài và nhiễu
- `generic pattern` — mẫu chung chung thay thế ký hiệu cụ thể
- `exact symbol` — tên class/hàm/đường dẫn chính xác
- `redundant re-read` — đọc lại không cần thiết thông tin đã biết
- `grounding` — neo câu trả lời vào dữ kiện thực đã xác nhận

### Bẫy đề thi

- ✗ Bảo model "suy nghĩ kỹ hơn" khi nó bắt đầu nói chung chung ⇒ ✓ Cung cấp lại dữ kiện chính xác (scratchpad, tham chiếu có mục tiêu)
- ✗ Coi triệu chứng chỉ xuất hiện khi chạm giới hạn token ⇒ ✓ Suy giảm xảy ra sớm hơn, khi ngữ cảnh dài và nhiễu
- ✗ Chỉ cần model có context lớn hơn ⇒ ✓ Cần tổ chức thông tin, không chỉ tăng dung lượng

### Câu hỏi

#### Q1. Sau 2 giờ khám phá, agent trả lời "lớp repository thường có hàm tìm theo ID" thay vì nói rõ `OrderRepository.findById` mà nó đã đọc lúc đầu. Điều này cho thấy gì và nên làm gì?
- A. Model bị lỗi, cần khởi động lại toàn bộ môi trường
- B. Suy giảm ngữ cảnh; phục hồi dữ kiện chính xác từ ghi chú và đưa lại có mục tiêu
- C. Cần yêu cầu model suy nghĩ kỹ hơn trong prompt tiếp theo
- D. Chỉ cần tăng nhiệt độ lấy mẫu

**Đáp án:** B

**Giải thích:** Đây là triệu chứng thay ký hiệu cụ thể bằng mẫu chung, cách chữa là cung cấp lại dữ kiện đã xác nhận. A quá mức và mất tiến trình. C không thêm thông tin nào. D không liên quan đến độ chính xác của ký hiệu.

#### Q2. Dấu hiệu nào sau đây KHÔNG phải triệu chứng điển hình của suy giảm ngữ cảnh trong phiên khám phá?
- A. Đọc lại cùng một file nhiều lần
- B. Đề xuất sửa code mâu thuẫn với cấu trúc đã khám phá
- C. Trả lời bằng mô tả chung thay vì đường dẫn cụ thể
- D. Trích dẫn đúng đường dẫn và hàm đã tìm thấy trước đó

**Đáp án:** D

**Giải thích:** Trích dẫn chính xác là dấu hiệu ngữ cảnh còn tốt. A, B, C đều là biểu hiện khi dữ kiện cũ bị mờ đi.

## K2. Scratchpad ngoài ngữ cảnh

### Trọng tâm

Ghi các phát hiện then chốt (class, đường dẫn, chuỗi phụ thuộc, quyết định) vào **file ngoài ngữ cảnh** và **đọc lại trước khi ra quyết định**, thay vì dựa vào trí nhớ về kết quả công cụ cũ.

### Giải thích

Ngữ cảnh là bộ nhớ làm việc hạn chế và tạm thời; **file** là bộ nhớ bền. Với refactor nhiều ngày hoặc khám phá lớn, hãy duy trì một file như `NOTES.md` hoặc `architecture-notes.md` có cấu trúc:

```markdown
Kiến trúc đã xác nhận:
- Entry: src/api/orders.ts -> OrderService.create
- OrderService -> OrderRepository.findById (src/repo/order_repo.ts:42)
Quyết định:
- Giữ interface OrderRepository, chỉ đổi cài đặt cache
Việc còn lại:
- [ ] cập nhật test tích hợp
```

Lợi ích:

- **Sống sót qua nén ngữ cảnh** và qua phiên mới: sau `/compact` hay khi mở phiên khác, chỉ cần đọc lại file.
- Là **nguồn sự thật** có thể kiểm tra, sửa và chia sẻ.
- Buộc cô đọng: ghi ký hiệu chính xác và vị trí thay vì văn xuôi.

Quy trình: khi xác nhận một phát hiện thì ghi ngay; trước bước quan trọng thì đọc lại phần liên quan. Trong Claude Code, `CLAUDE.md` cũng đóng vai trò ghi nhớ bền, nhưng dành cho quy ước dự án; ghi chú khám phá tạm thời nên nằm ở file riêng.

Điều cần tránh: tin rằng model sẽ "nhớ" một kết quả tool đã xuất hiện từ rất lâu trước đó.

### Keyword

- `scratchpad` — file ghi chú ngoài ngữ cảnh lưu phát hiện then chốt
- `persistent memory` — bộ nhớ bền, tồn tại qua các lần nén/phiên
- `source of truth` — nguồn sự thật được tham chiếu khi quyết định
- `architecture notes` — ghi chú kiến trúc đã xác nhận
- `working memory` — bộ nhớ làm việc tạm thời (chính là ngữ cảnh)

### Bẫy đề thi

- ✗ Dựa vào việc model nhớ kết quả công cụ cũ ⇒ ✓ Ghi ra file và đọc lại trước khi quyết định
- ✗ Ghi scratchpad một lần ở cuối dự án ⇒ ✓ Ghi ngay khi xác nhận phát hiện, cập nhật liên tục
- ✗ Ghi ghi chú bằng văn xuôi dài ⇒ ✓ Ghi ký hiệu, đường dẫn, quyết định có cấu trúc

### Câu hỏi

#### Q1. Một refactor kéo dài nhiều ngày, qua nhiều phiên. Mỗi sáng agent phải khám phá lại kiến trúc từ đầu. Cải tiến hiệu quả nhất?
- A. Bắt đầu mỗi phiên bằng prompt dài mô tả lại toàn bộ từ trí nhớ của bạn
- B. Chạy phiên liên tục không bao giờ đóng
- C. Yêu cầu agent ghi kiến trúc đã xác nhận vào file ghi chú và đọc file này khi bắt đầu phiên
- D. Chỉ dựa vào lịch sử hội thoại của phiên trước

**Đáp án:** C

**Giải thích:** File ghi chú là bộ nhớ bền, có cấu trúc và dùng lại được qua phiên. A tốn công và dễ sai. B không khả thi và vẫn gặp suy giảm. D phụ thuộc lịch sử có thể bị mờ hoặc không còn.

#### Q2. Khi nào nên đọc lại scratchpad?
- A. Trước khi đưa ra quyết định thay đổi quan trọng hoặc sau khi nén ngữ cảnh
- B. Không bao giờ, vì model đã nhớ
- C. Chỉ khi kết thúc dự án
- D. Chỉ khi có lỗi biên dịch

**Đáp án:** A

**Giải thích:** Đọc lại trước quyết định để neo vào dữ kiện thực, và sau nén để khôi phục chi tiết. B, C, D bỏ lỡ thời điểm quan trọng.

## K3. Cô lập khám phá bằng subagent

### Trọng tâm

Giao các tác vụ khám phá **nhiều output** (grep, đọc nhiều file) cho **subagent** có ngữ cảnh riêng, chỉ nhận lại **bản tóm tắt tập trung**. Ngữ cảnh phiên chính nhờ đó gọn.

### Giải thích

Mỗi subagent chạy với **cửa sổ ngữ cảnh riêng**. Nếu bạn nhờ subagent "tìm mọi nơi dùng `PaymentGateway` và liệt kê các điểm gọi", nó có thể chạy hàng chục `grep` và đọc hàng chục file, nhưng phiên chính chỉ nhận lại vài chục dòng kết quả. Dữ liệu thô nằm lại và được bỏ đi cùng subagent.

Khi dùng:

- Câu hỏi khám phá có phạm vi rõ ràng ("map the auth flow", "tìm các caller của X").
- Cần đọc nhiều tài liệu nhưng chỉ cần kết luận.
- Muốn giữ phiên chính tập trung vào ra quyết định và chỉnh sửa.

Lưu ý thiết kế:

- Ghi rõ **đầu ra mong muốn**: danh sách file:dòng, tóm tắt vai trò, không chép nguyên nội dung.
- Subagent không thấy ngữ cảnh phiên chính, nên **truyền đủ thông tin cần thiết** trong prompt giao việc (xem bài 1.3).
- Nếu kết quả trả về vẫn quá dài, ngữ cảnh chính vẫn phình: cần giới hạn độ dài báo cáo.

Trong Claude Code, các subagent như Explore phục vụ đúng mục đích này. Ngược lại, nạp trực tiếp mọi output thô vào phiên chính sẽ làm suy giảm nhanh (K1).

### Keyword

- `subagent isolation` — mỗi subagent có ngữ cảnh riêng, tách khỏi phiên chính
- `bounded discovery` — khám phá có phạm vi và mục tiêu rõ ràng
- `focused summary` — bản tóm tắt tập trung, chỉ gồm điều cần
- `verbose output` — đầu ra dài dòng (grep, đọc file)
- `Explore subagent` — subagent chuyên khám phá trong Claude Code

### Bẫy đề thi

- ✗ Chạy mọi grep/read trực tiếp trong phiên chính ⇒ ✓ Giao cho subagent và nhận tóm tắt
- ✗ Subagent trả nguyên văn mọi file đã đọc ⇒ ✓ Yêu cầu báo cáo ngắn gọn có file:dòng
- ✗ Giả định subagent tự biết bối cảnh phiên chính ⇒ ✓ Truyền rõ mục tiêu và thông tin cần thiết trong prompt

### Câu hỏi

#### Q1. Phiên chính đã đầy kết quả grep và nội dung file sau khi tìm các điểm gọi của một hàm. Lần tới nên làm thế nào để giữ phiên chính gọn?
- A. Giao việc tìm kiếm cho subagent và chỉ nhận danh sách điểm gọi kèm tóm tắt
- B. Đọc từng file một trong phiên chính
- C. Giảm số file trong repo
- D. Tăng giới hạn token đầu ra

**Đáp án:** A

**Giải thích:** Subagent có ngữ cảnh riêng nên output thô không làm bẩn phiên chính. B làm ngữ cảnh phình hơn. C không thực tế. D không liên quan input.

#### Q2. Subagent khám phá trả về nguyên văn nội dung 30 file đã đọc. Vấn đề là gì?
- A. Không có vấn đề, càng nhiều thông tin càng tốt
- B. Subagent không được phép đọc file
- C. Lợi ích cô lập bị mất vì ngữ cảnh chính vẫn bị chất đầy; cần yêu cầu báo cáo tập trung
- D. Subagent sẽ luôn thất bại

**Đáp án:** C

**Giải thích:** Giá trị của subagent là cô đọng kết quả. Trả nguyên văn đưa gánh nặng trở lại phiên chính. A bỏ qua mục đích cô lập. B, D không đúng.

## K4. Tóm tắt theo giai đoạn và `/compact`

### Trọng tâm

Giữa các giai đoạn, **tóm tắt phát hiện ổn định cùng tham chiếu chính xác** và đưa vào giai đoạn sau; dùng `/compact` khi cần nén phiên. Đừng khởi động agent mới mà không mang theo kết quả giai đoạn trước.

### Giải thích

Công việc lớn thường chia giai đoạn: (1) khám phá kiến trúc, (2) thiết kế thay đổi, (3) cài đặt, (4) kiểm thử. Nếu agent giai đoạn 2 bắt đầu trắng, nó sẽ **lặp lại khám phá của giai đoạn 1**, tốn thời gian và có thể đi đến kết luận khác.

Cách làm:

- Cuối mỗi giai đoạn, tạo **phase summary**: kiến trúc, quyết định, file/ký hiệu quan trọng, câu hỏi còn mở. Lưu vào scratchpad (K2) hoặc đưa vào prompt giai đoạn sau.
- Summary phải chứa **tham chiếu chính xác** (đường dẫn, tên hàm), không chỉ mô tả chung. Đây là cùng nguyên tắc với case facts ở bài 5.1.
- Trong Claude Code, lệnh **`/compact`** nén lịch sử hội thoại thành bản tóm tắt để giải phóng ngữ cảnh. Có thể kèm chỉ dẫn về điều cần giữ lại. Vì nén có mất mát, hãy đảm bảo dữ kiện then chốt đã nằm trong file ghi chú trước khi compact.
- Khi bắt đầu phiên mới cho giai đoạn tiếp theo, đưa vào summary thay vì lịch sử đầy đủ.

So sánh: scratchpad lưu **sự thật bền**; phase summary là **bản chuyển giao** giữa giai đoạn; `/compact` là **nén tại chỗ**. Chúng bổ sung nhau chứ không thay thế.

### Keyword

- `phase summary` — bản tóm tắt cuối mỗi giai đoạn để chuyển giao
- `/compact` — lệnh Claude Code nén lịch sử hội thoại thành bản tóm tắt
- `context handoff` — chuyển giao ngữ cảnh sang agent/phiên khác
- `open questions` — câu hỏi còn bỏ ngỏ cần giải quyết tiếp
- `lossy compression` — nén có mất mát chi tiết

### Bẫy đề thi

- ✗ Khởi động agent giai đoạn sau mà không mang kết quả trước ⇒ ✓ Chèn phase summary có tham chiếu chính xác
- ✗ `/compact` khi dữ kiện then chốt chỉ nằm trong hội thoại ⇒ ✓ Ghi dữ kiện ra file trước khi nén
- ✗ Phase summary chỉ mô tả chung chung ⇒ ✓ Gồm đường dẫn, tên ký hiệu, quyết định, câu hỏi mở

### Câu hỏi

#### Q1. Agent giai đoạn 2 (thiết kế) lặp lại toàn bộ việc khám phá kiến trúc mà giai đoạn 1 đã làm. Cách khắc phục?
- A. Bảo agent làm nhanh hơn
- B. Dùng model lớn hơn cho giai đoạn 2
- C. Bỏ giai đoạn 1 ở lần chạy sau
- D. Đưa phase summary của giai đoạn 1 (kiến trúc, tham chiếu file, quyết định) vào prompt giai đoạn 2

**Đáp án:** D

**Giải thích:** Chuyển giao kết quả đã xác nhận tránh lặp việc. A, B không cung cấp thông tin mới. C làm mất nền tảng cần thiết.

#### Q2. Trước khi chạy `/compact` trong một phiên khám phá dài, bước nào là thận trọng nhất?
- A. Xóa file ghi chú cho đỡ rối
- B. Ghi các phát hiện then chốt (đường dẫn, ký hiệu, quyết định) ra file ghi chú
- C. Không làm gì vì compact luôn bảo toàn mọi chi tiết
- D. Khởi động lại máy

**Đáp án:** B

**Giải thích:** Nén có mất mát nên dữ kiện cần giữ phải nằm ở nơi bền. A phá nguồn sự thật. C sai về bản chất nén. D không liên quan.
