# 2.5 — Built-in Tools

## Tổng quan

Claude Code (và Agent SDK) có sẵn bộ tool tích hợp để làm việc với codebase: **Read, Write, Edit, Grep, Glob, Bash**... Hiểu **tool nào dùng cho việc nào** và **cách khám phá codebase tiết kiệm context** là kỹ năng thực dụng được hỏi nhiều ở đề thi.

Quy tắc nhớ nhanh: **Grep tìm trong nội dung, Glob tìm theo tên file; Edit sửa đoạn có neo duy nhất; khám phá từng bước (tìm trước, đọc có chọn lọc); và lần theo cả re-export/wrapper khi truy vết hàm.**

## K1. Grep so với Glob

### Trọng tâm

**Grep** tìm theo **nội dung** file (regex). **Glob** khớp theo **đường dẫn/tên file** (pattern). Chọn nhầm tool là lỗi phổ biến.

### Giải thích

| Tool | Tìm theo | Ví dụ |
|---|---|---|
| Grep | Nội dung bên trong file | Tìm mọi nơi gọi `legacyCharge(` |
| Glob | Tên/đường dẫn file | Liệt kê `**/*.test.ts` |

Tình huống: "Tìm tất cả nơi gọi hàm đã deprecated `legacyCharge` và liệt kê các file test `*.test.ts`". Đây là **hai** việc khác nhau:

- Tìm nơi gọi hàm cần xem **thân file** → Grep (`legacyCharge\(`), có thể giới hạn theo loại file hoặc thư mục.
- Liệt kê file test theo tên → Glob (`**/*.test.ts`), không cần đọc nội dung.

Dùng Glob để tìm nội dung hàm sẽ không bao giờ ra, vì Glob chỉ nhìn tên file. Ngược lại dùng Grep để liệt kê file theo tên là vòng vo, tốn kém.

Mẹo thực hành với Grep: có các chế độ đầu ra như chỉ liệt kê tên file khớp, hiển thị dòng khớp kèm số dòng, hoặc đếm số lần khớp. Bắt đầu với chế độ gọn (chỉ tên file) để xem phạm vi trước khi lấy nhiều nội dung, giúp bảo vệ context. Tên tham số chính xác có thể khác theo phiên bản; hãy dựa vào mô tả tool trong môi trường của bạn.

### Keyword

- `Grep` — tool tìm kiếm theo nội dung file bằng regex
- `Glob` — tool khớp tên/đường dẫn file bằng pattern
- `regex` — biểu thức chính quy
- `glob pattern` — mẫu đường dẫn như `**/*.ts`
- `output mode` — chế độ đầu ra của Grep (tên file, dòng khớp, số lượng)
- `content search` — tìm kiếm theo nội dung

### Bẫy đề thi

- ✗ Dùng Glob để tìm các lời gọi một hàm ⇒ ✓ Dùng Grep để tìm trong nội dung
- ✗ Dùng Grep để liệt kê file theo tên ⇒ ✓ Dùng Glob cho pattern tên file
- ✗ Dùng Bash `grep`/`find` thay cho tool chuyên dụng khi đã có sẵn ⇒ ✓ Ưu tiên Grep/Glob tích hợp (kết quả có cấu trúc, tích hợp phân quyền)

### Câu hỏi

#### Q1. Bạn cần tìm mọi nơi gọi hàm `legacyCharge` trong repo. Tool nào phù hợp?
- A. Glob với pattern `**/legacyCharge*`
- B. Grep với pattern `legacyCharge\(`
- C. Read toàn bộ thư mục
- D. Write một file ghi chú

**Đáp án:** B

**Giải thích:** Lời gọi nằm trong nội dung file, nên cần Grep. A chỉ khớp tên file. C tốn context. D không tìm kiếm gì.

#### Q2. Để lấy danh sách các file test theo quy ước tên `*.test.ts` trong toàn dự án, cách tốt nhất?
- A. Grep chuỗi `.test.ts` trong nội dung
- B. Read từng file trong repo
- C. Glob với pattern `**/*.test.ts`
- D. Bash `cat` mọi file rồi lọc

**Đáp án:** C

**Giải thích:** Đây là khớp theo tên đường dẫn, đúng sở trường của Glob. A tìm nhầm chỗ. B, D tốn kém không cần.

## K2. Edit chính xác: neo duy nhất

### Trọng tâm

**Edit** thay một đoạn văn bản **xuất hiện duy nhất** trong file. Nếu báo trùng, hãy **mở rộng đoạn neo** bằng các dòng xung quanh, hoặc dùng `replace_all` khi thực sự muốn đổi mọi chỗ.

### Giải thích

Edit hoạt động bằng cách tìm `old_string` và thay bằng `new_string`. Để an toàn, `old_string` phải **khớp đúng và duy nhất**; nếu xuất hiện hai lần, Edit từ chối vì không biết bạn muốn sửa chỗ nào. Cách xử lý:

1. **Thêm ngữ cảnh** (vài dòng trước/sau) vào `old_string` cho đến khi duy nhất.
2. Nếu muốn **đổi tên một biến ở mọi nơi trong file**, dùng `replace_all` có chủ ý.
3. Chỉ khi thay đổi lớn, khó neo, mới cân nhắc viết lại cả file (Write).

Vì sao không "viết lại cả file ngay"? Write ghi đè toàn bộ: dễ **mất nội dung** khác trong file nếu model tái tạo không chính xác, diff khó review, tốn token cho file lớn. Edit nhỏ, có kiểm chứng, diff gọn.

Lưu ý quy trình: cần đọc file (Read) trước khi Edit/Write, để chắc nội dung hiện tại và định dạng (thụt lề, khoảng trắng) khớp với `old_string`. Lỗi hay gặp khác là sai khoảng trắng/tab khiến `old_string` không khớp ("không tìm thấy").

### Keyword

- `Edit` — tool thay thế đoạn văn bản chính xác trong file
- `old_string` / `new_string` — đoạn cũ cần tìm và đoạn mới thay vào
- `unique anchor` — đoạn neo xuất hiện duy nhất trong file
- `replace_all` — tùy chọn thay mọi chỗ khớp
- `Write` — tool ghi (ghi đè) cả file
- `Read` — tool đọc nội dung file

### Bẫy đề thi

- ✗ Edit báo `old_string` xuất hiện hai lần thì viết lại cả file ⇒ ✓ Thêm dòng ngữ cảnh để neo duy nhất, hoặc dùng `replace_all` có chủ ý
- ✗ Dùng `replace_all` khi chỉ muốn sửa một chỗ ⇒ ✓ `replace_all` chỉ khi thực sự muốn đổi mọi nơi
- ✗ Edit khi chưa đọc file ⇒ ✓ Read trước để biết nội dung và định dạng

### Câu hỏi

#### Q1. Edit báo lỗi vì `return total;` xuất hiện ở hai hàm khác nhau, bạn chỉ muốn sửa ở hàm `calcTax`. Cách xử lý đúng?
- A. Viết lại toàn bộ file bằng Write
- B. Dùng `replace_all` để chắc chắn
- C. Chạy lại đúng lệnh Edit đó nhiều lần
- D. Mở rộng `old_string` bằng các dòng quanh `return total;` trong `calcTax` để duy nhất

**Đáp án:** D

**Giải thích:** Neo duy nhất cho phép sửa chính xác. A nhiều rủi ro. B sẽ đổi cả hàm kia. C lặp lại cùng lỗi.

#### Q2. Bạn muốn đổi tên biến `tmpVal` thành `discountRate` ở mọi chỗ trong một file. Cách hợp lý nhất?
- A. Edit với `replace_all` bật
- B. Edit từng chỗ với neo duy nhất cho mỗi lần, dù có đến 15 chỗ
- C. Glob để đổi tên
- D. Grep để thay thế

**Đáp án:** A

**Giải thích:** `replace_all` sinh ra cho việc đổi mọi lần xuất hiện. B làm được nhưng thừa. C và D không sửa nội dung.

## K3. Khám phá tăng dần (incremental discovery)

### Trọng tâm

Với codebase lớn, **tìm trước, đọc có chọn lọc, mở rộng dần**. Đừng đọc toàn bộ file trước khi biết chỗ cần xem, vì context sẽ bị lấp đầy.

### Giải thích

Context window có hạn, và mọi thứ bạn đọc đều chiếm chỗ cũng như làm loãng sự chú ý. Giả sử repo có 200 file, nhưng lỗi nằm ở luồng thanh toán (checkout). Chiến lược tốt:

1. **Grep** điểm vào: tên route, hàm `checkout`, thông báo lỗi trong log.
2. **Read** file khớp (có thể đọc theo đoạn dòng nếu file dài).
3. Từ imports của file đó, **đọc tiếp** các module liên quan, chỉ khi cần.
4. Lặp lại, mở rộng theo bằng chứng.

Chiến lược tồi: đọc cả 200 file "cho chắc". Hậu quả: tràn/loãng context, chậm, chi phí cao, và lại càng dễ bỏ sót chi tiết quan trọng ("lost in the middle"). Có thể cần thêm **subagent** để khám phá lượng lớn rồi tóm tắt lại cho agent chính (xem Domain 5).

Nguyên tắc bao trùm: **mỗi lần đọc phải có lý do dựa trên kết quả tìm kiếm hoặc dấu vết trước đó**.

### Keyword

- `incremental discovery` — khám phá từng bước, mở rộng theo bằng chứng
- `entry point` — điểm vào của luồng cần tìm hiểu (route, hàm chính)
- `context budget` — ngân sách context có hạn
- `targeted read` — đọc có chọn lọc, đúng chỗ cần
- `imports tracing` — lần theo import để tìm module liên quan
- `context dilution` — context bị loãng do nhồi quá nhiều thông tin

### Bẫy đề thi

- ✗ Đọc hết 200 file trước rồi mới tìm ⇒ ✓ Grep điểm vào, đọc file liên quan, mở rộng dần
- ✗ Chỉ Grep mà không đọc file khi cần hiểu ngữ cảnh ⇒ ✓ Kết hợp: tìm để khoanh vùng, đọc để hiểu
- ✗ Đọc file nhưng không có lý do liên quan đến vấn đề ⇒ ✓ Mỗi lần đọc phải xuất phát từ bằng chứng

### Câu hỏi

#### Q1. Repo có 200 file, lỗi chỉ xuất hiện ở bước thanh toán. Chiến lược khám phá tốt nhất?
- A. Đọc toàn bộ 200 file để nắm tổng thể
- B. Grep điểm vào của checkout, đọc file khớp, rồi đọc các module được import khi cần
- C. Đoán file rồi sửa luôn
- D. Hỏi người dùng liệt kê từng file

**Đáp án:** B

**Giải thích:** Khoanh vùng bằng tìm kiếm rồi đọc có chọn lọc bảo vệ context. A tốn và gây loãng. C thiếu bằng chứng. D đẩy việc sang người dùng.

#### Q2. Vì sao đọc toàn bộ codebase ngay từ đầu là rủi ro?
- A. Tool Read bị cấm đọc nhiều file
- B. Làm đầy và loãng context, tăng chi phí và nguy cơ bỏ sót chi tiết quan trọng
- C. Sẽ tự động ghi đè các file
- D. Model sẽ từ chối làm việc

**Đáp án:** B

**Giải thích:** Vấn đề là ngân sách và chất lượng chú ý của context. A, C, D không phải cơ chế thật.

## K4. Dùng hàm gián tiếp: re-export, wrapper và truy vết nhiều bước

### Trọng tâm

Một grep tên hàm gốc **không đủ** khi hàm được **re-export, đổi tên (alias) hoặc bọc (wrapper)**. Cần truy vết nhiều bước: định nghĩa gốc, các lớp export lại, rồi nơi tiêu thụ.

### Giải thích

Ví dụ trong TypeScript: hàm `calcTax` đã được đổi tên nội bộ thành `computeTax`, nhưng `index.ts` vẫn có:

```ts
export { computeTax as calcTax } from "./tax/compute";
```

Nếu bạn chỉ Grep `computeTax`, bạn thấy file định nghĩa và `index.ts`, nhưng **bỏ sót** mọi nơi import `calcTax` từ package. Nếu chỉ Grep `calcTax`, bạn bỏ sót nơi dùng trực tiếp `computeTax`. Phải làm nhiều bước:

1. Grep **định nghĩa gốc** (`computeTax`).
2. Tìm các nơi **export lại hoặc alias** (`export ... as`, `export * from`, file barrel như `index.ts`).
3. Grep **mọi tên mà hàm có thể được gọi** (bí danh, wrapper) để ra danh sách consumer đầy đủ.
4. Kiểm tra các cách gọi động (chuỗi tên, reflection) mà tìm kiếm văn bản có thể bỏ sót.

Hệ quả thực tế: khi refactor hoặc xóa hàm deprecated, bỏ sót consumer gián tiếp sẽ gây lỗi runtime/build. Đề thi hay hỏi "bước nào để chắc chắn đã tìm hết nơi dùng", đáp án là truy vết cả tên gốc lẫn alias qua file re-export, chứ không phải một lần grep.

### Keyword

- `re-export` — export lại một symbol từ module khác
- `alias` — tên thay thế (ví dụ `export { a as b }`)
- `barrel file` — file như `index.ts` gom export của nhiều module
- `wrapper` — hàm/module bọc quanh hàm gốc
- `multi-hop tracing` — truy vết qua nhiều lớp gián tiếp
- `consumer` — nơi sử dụng một hàm/module

### Bẫy đề thi

- ✗ Một lần grep tên gốc là đủ để tìm mọi nơi dùng ⇒ ✓ Truy vết thêm alias và re-export (barrel file), rồi consumer
- ✗ Chỉ grep tên mới sau khi đổi tên ⇒ ✓ Grep cả tên cũ lẫn tên mới và các export trung gian
- ✗ Cho rằng tìm kiếm văn bản bắt được mọi lời gọi động ⇒ ✓ Lưu ý cách gọi động có thể bỏ sót

### Câu hỏi

#### Q1. Hàm `computeTax` được export lại qua `index.ts` dưới tên `calcTax`. Bạn cần liệt kê mọi nơi dùng trước khi xóa. Cách làm đúng?
- A. Chỉ Grep `computeTax`
- B. Chỉ Glob các file tên `*tax*`
- C. Xóa rồi xem build báo lỗi chỗ nào
- D. Grep định nghĩa gốc, tìm re-export/alias trong `index.ts`, rồi Grep mọi tên đang được dùng để lấy đủ consumer

**Đáp án:** D

**Giải thích:** Phải bao phủ cả tên gốc lẫn alias. A bỏ sót consumer của `calcTax`. B tìm theo tên file chứ không theo lời gọi. C chấp nhận lỗi runtime/build không cần thiết.

#### Q2. Sau refactor, grep `calcTax` không còn kết quả nhưng ứng dụng vẫn lỗi khi chạy. Nguyên nhân khả dĩ?
- A. Glob không cập nhật chỉ mục
- B. Edit đã làm hỏng file ngẫu nhiên
- C. Còn nơi gọi bằng tên mới `computeTax` hoặc qua wrapper/gọi động mà tìm kiếm tên cũ không thấy
- D. Grep không hỗ trợ TypeScript

**Đáp án:** C

**Giải thích:** Tên thay đổi hoặc gọi gián tiếp làm tìm kiếm theo một tên bỏ sót. A không có cơ chế chỉ mục như vậy. B vô căn cứ. D sai vì Grep tìm văn bản ở mọi ngôn ngữ.
