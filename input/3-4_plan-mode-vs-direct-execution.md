# 3.4 — Plan Mode vs Direct Execution

## Tổng quan

Claude Code có hai cách tiếp cận một tác vụ: **Plan mode** (chế độ lập kế hoạch, chỉ đọc: khám phá codebase, so sánh phương án, đưa ra kế hoạch để bạn duyệt rồi mới sửa) và **direct execution** (làm thẳng: sửa, chạy test, xong). Không có cách nào "luôn tốt hơn"; vấn đề là chọn đúng theo **độ mơ hồ và phạm vi** của tác vụ.

Đề thi cho một tình huống rồi hỏi nên bắt đầu thế nào. Quy tắc nhớ nhanh: **thay đổi lớn, nhiều file, nhiều thiết kế khả thi → Plan mode trước; sửa nhỏ, rõ vị trí, rõ cách → làm trực tiếp rồi test; migration lớn → plan rồi thoát plan mode để thực thi từng đợt; khám phá dài dòng → giao cho Explore subagent để giữ context chính sạch.**

## K1. Khi nào dùng Plan mode: mơ hồ và phạm vi rộng

### Trọng tâm

Dùng Plan mode khi tác vụ **mơ hồ**, ảnh hưởng **nhiều file/module**, hoặc có **nhiều hướng thiết kế**. Cần khám phá và quyết định trước khi viết, vì sửa sai hướng rất tốn kém.

### Giải thích

**Plan mode** là chế độ chỉ đọc: Claude có thể đọc file, tìm kiếm, phân tích phụ thuộc, nhưng **không sửa file hay chạy lệnh có tác dụng phụ**. Kết thúc, Claude trình bày một kế hoạch để bạn duyệt. Chuyển chế độ bằng phím tắt (Shift+Tab xoay vòng giữa các chế độ quyền) hoặc khởi động với `--permission-mode plan`.

Tín hiệu nên dùng:

- **Phạm vi lớn**: ví dụ refactor tầng dịch vụ trải ra 40 module.
- **Nhiều phương án hợp lý** với đánh đổi khác nhau (đổi sang event-driven hay giữ REST? thêm cache ở tầng nào?).
- **Chưa biết rõ codebase**: phải hiểu cấu trúc, điểm gọi, ràng buộc trước.
- **Rủi ro cao hoặc khó đảo ngược**: thay đổi schema, đổi API công khai.

Vì sao có lợi: (1) lỗi hướng đi được bắt ở bước rẻ nhất, trước khi 30 file bị sửa; (2) con người xem lại kế hoạch trước khi hành động (human-in-the-loop); (3) thao tác chỉ đọc nên an toàn để khám phá. Ngược lại, nếu lao vào sửa file ngay, Claude dễ chọn giải pháp cục bộ rồi phát hiện đụng chạm ở file khác giữa chừng, phải sửa lại nhiều lần.

Một kế hoạch tốt nêu: các file/module bị ảnh hưởng, thứ tự thay đổi, rủi ro, cách kiểm chứng (test nào chạy), và các câu hỏi còn mở cho bạn quyết định.

### Keyword

- `Plan mode` — chế độ chỉ đọc để khám phá và lập kế hoạch trước khi sửa
- `permission mode` — chế độ quyền của Claude Code (bình thường, plan, tự chấp nhận sửa...)
- `ambiguity` — độ mơ hồ của yêu cầu hoặc thiết kế
- `blast radius` — phạm vi ảnh hưởng của một thay đổi
- `human-in-the-loop` — con người duyệt trước khi thực hiện
- `design trade-offs` — các đánh đổi giữa những phương án thiết kế

### Bẫy đề thi

- ✗ Bắt đầu sửa file ngay với refactor lớn nhiều phương án ⇒ ✓ Vào Plan mode, khám phá và chọn phương án trước
- ✗ Nghĩ Plan mode vẫn có thể ghi file nhưng "cẩn thận hơn" ⇒ ✓ Plan mode chỉ đọc; chưa sửa gì cho đến khi bạn duyệt kế hoạch
- ✗ Dùng plan cho mọi thay đổi, kể cả sửa một dòng ⇒ ✓ Chỉ dùng khi mơ hồ, rộng hoặc rủi ro (xem K2)

### Câu hỏi

#### Q1. Bạn cần tách monolith thành các service, ảnh hưởng 40 module, có ít nhất ba hướng thiết kế khác nhau và chưa rõ phụ thuộc giữa các module. Cách bắt đầu nào hợp lý nhất?
- A. Bắt đầu sửa module đầu tiên, các module còn lại tính sau
- B. Vào Plan mode, khám phá phụ thuộc, so sánh phương án và duyệt kế hoạch trước khi sửa
- C. Yêu cầu Claude viết toàn bộ code mới trong một lượt
- D. Chạy `claude -p` trong CI để tự làm mà không xem xét

**Đáp án:** B

**Giải thích:** Phạm vi rộng, nhiều phương án, phụ thuộc chưa biết là ba tín hiệu cho Plan mode. A dễ chọn sai hướng rồi sửa lại hàng loạt. C bỏ qua bước khám phá và tăng rủi ro. D không phải cách để quyết định thiết kế quan trọng.

#### Q2. Điều nào mô tả đúng Plan mode?
- A. Claude ghi file ngay nhưng đánh dấu là bản nháp
- B. Claude chạy mọi lệnh shell có tác dụng phụ để thử nghiệm
- C. Claude bỏ qua codebase và chỉ dựa vào mô tả của bạn
- D. Claude chỉ đọc và phân tích, rồi đưa kế hoạch để người dùng duyệt trước khi chỉnh sửa

**Đáp án:** D

**Giải thích:** Plan mode là chế độ chỉ đọc kèm đề xuất kế hoạch để duyệt. A và B mô tả hành vi có tác dụng phụ, trái với bản chất của plan. C sai vì khám phá codebase là phần cốt lõi của lập kế hoạch.

## K2. Khi nào làm trực tiếp (direct execution)

### Trọng tâm

Thay đổi **nhỏ, rõ ràng, biết vị trí, biết cách sửa** thì làm trực tiếp và chạy test. Lập kế hoạch dài cho việc này là tốn thời gian, không thêm giá trị.

### Giải thích

Plan mode có chi phí: thêm một vòng tương tác, thêm token và thời gian chờ. Chi phí đó chỉ đáng khi nó giảm rủi ro hoặc làm rõ lựa chọn. Với tác vụ như "hàm `getUser` crash khi `user` là `null`, thêm null guard ở `src/users/get.ts`", không còn gì để khám phá hay chọn: vị trí rõ, cách sửa rõ, kiểm chứng đơn giản (chạy test liên quan).

Quy trình hợp lý cho direct execution:

1. Mô tả chính xác thay đổi và vị trí.
2. Claude sửa.
3. Chạy test/lint để xác nhận không hồi quy.
4. Xem diff trước khi commit.

Dấu hiệu nên làm trực tiếp: có thể mô tả kết quả trong một câu; chạm vào ít file (thường một); đã biết điểm sửa; có test hoặc cách kiểm chứng nhanh; dễ hoàn tác (git revert).

Ranh giới không phải cứng nhắc: nếu giữa chừng phát hiện việc "nhỏ" thực ra đụng nhiều nơi (ví dụ hàm được dùng ở 30 chỗ với giả định khác nhau), hãy dừng và chuyển sang Plan mode. Ngược lại, nếu đã có kế hoạch được duyệt, từng bước trong kế hoạch lại là direct execution. Nguyên tắc: **độ phức tạp của quy trình tỷ lệ với độ phức tạp và rủi ro của tác vụ**.

### Keyword

- `direct execution` — làm thẳng, không qua bước lập kế hoạch riêng
- `well-scoped change` — thay đổi rõ phạm vi
- `null guard` — kiểm tra null để tránh lỗi tham chiếu
- `regression test` — test xác nhận hành vi cũ không bị hỏng
- `over-planning` — lập kế hoạch quá mức cần thiết, gây lãng phí
- `reversibility` — khả năng hoàn tác thay đổi dễ dàng

### Bẫy đề thi

- ✗ Yêu cầu nghiên cứu kiến trúc dài cho một lỗi null ở hàm đã biết ⇒ ✓ Sửa trực tiếp, thêm/chạy test
- ✗ Bỏ qua bước chạy test sau khi sửa trực tiếp ⇒ ✓ Direct execution vẫn cần xác minh bằng test
- ✗ Cố chấp làm trực tiếp khi thấy tác vụ lan ra nhiều module ⇒ ✓ Dừng lại, chuyển Plan mode khi phạm vi lớn hơn dự kiến

### Câu hỏi

#### Q1. Stack trace cho thấy `formatPrice()` trong `src/utils/price.ts` ném lỗi khi `amount` là `undefined`. Bạn muốn thêm kiểm tra và một unit test. Cách làm hiệu quả nhất?
- A. Mở Plan mode, yêu cầu báo cáo kiến trúc toàn dự án trước khi sửa
- B. Chuyển sang Plan mode và so sánh ba kiến trúc xử lý lỗi
- C. Yêu cầu Claude sửa trực tiếp hàm đó, thêm test và chạy test
- D. Viết lại toàn bộ module `utils`

**Đáp án:** C

**Giải thích:** Lỗi có vị trí và cách sửa rõ ràng, đúng loại việc làm trực tiếp rồi kiểm chứng bằng test. A và B là over-planning không thêm giá trị. D mở rộng phạm vi không cần thiết và tăng rủi ro.

#### Q2. Đang sửa trực tiếp một lỗi "nhỏ", Claude phát hiện hàm đó được gọi ở 30 nơi với các giả định khác nhau về giá trị trả về. Hành động hợp lý?
- A. Tiếp tục sửa và hy vọng không hỏng gì
- B. Dừng lại, chuyển sang Plan mode để phân tích tác động và lập kế hoạch thay đổi
- C. Xoá hàm đó để các lời gọi tự báo lỗi
- D. Bỏ qua phát hiện này và commit

**Đáp án:** B

**Giải thích:** Phạm vi hoá ra rộng và rủi ro cao hơn dự kiến, là tín hiệu để lập kế hoạch. A và D bỏ qua rủi ro hồi quy. C gây phá vỡ diện rộng.

## K3. Kết hợp: plan rồi thực thi theo đợt

### Trọng tâm

Với thay đổi lớn: **plan trước (chỉ đọc), duyệt, rồi thoát Plan mode để thực thi có kiểm soát** theo từng bước/đợt, kiểm tra sau mỗi đợt. Không "ở mãi" trong Plan mode.

### Giải thích

Plan mode và direct execution không đối lập mà là hai pha của cùng một quy trình lớn. Ví dụ migration thư viện (đổi HTTP client ở 120 file):

1. **Pha 1, Plan**: khám phá cách thư viện cũ đang được dùng, nhóm các mẫu sử dụng, đề xuất chiến lược (tạo adapter, đổi dần theo module, giữ test xanh ở mọi bước), liệt kê rủi ro.
2. **Duyệt**: con người xem kế hoạch, chỉnh sửa, đồng ý.
3. **Pha 2, Execute**: thoát Plan mode, làm từng đợt (ví dụ module `auth` trước), chạy test sau mỗi đợt, commit nhỏ, rồi sang đợt kế.

Lợi ích: kế hoạch cho chiến lược chung; thực thi theo đợt cho vòng phản hồi nhanh và giảm rủi ro. Nếu sai ở đợt 2, bạn revert một commit nhỏ chứ không phải cả migration.

Sai lầm phổ biến là nghĩ rằng Plan mode là đích đến: kế hoạch không thay đổi code. Giá trị chỉ xuất hiện khi chuyển sang thực thi. Sai lầm ngược lại là nhảy sang thực thi cả khối lớn trong một lượt, mất khả năng kiểm soát và khó review.

Có thể lưu kế hoạch ra file (ví dụ `PLAN.md`) hoặc dùng danh sách việc để theo dõi tiến độ, đặc biệt khi công việc kéo qua nhiều phiên.

### Keyword

- `plan then execute` — mẫu hai pha: lập kế hoạch rồi thực thi
- `phased rollout` — triển khai theo đợt nhỏ, kiểm chứng từng đợt
- `exit plan mode` — thoát Plan mode sau khi kế hoạch được duyệt để bắt đầu sửa
- `incremental commits` — commit nhỏ sau mỗi đợt, dễ revert
- `migration strategy` — chiến lược chuyển đổi thư viện/hệ thống
- `checkpoint` — điểm kiểm tra sau mỗi bước để xác nhận trước khi đi tiếp

### Bẫy đề thi

- ✗ Ở mãi trong Plan mode và mong code tự thay đổi ⇒ ✓ Duyệt kế hoạch rồi thoát Plan mode để thực thi
- ✗ Thực thi cả migration lớn trong một lượt duy nhất ⇒ ✓ Chia đợt, test và commit sau mỗi đợt
- ✗ Bỏ qua bước duyệt kế hoạch vì "model chắc làm đúng" ⇒ ✓ Con người duyệt chiến lược trước khi thực thi diện rộng

### Câu hỏi

#### Q1. Team cần chuyển 120 file từ thư viện HTTP cũ sang thư viện mới, vừa phải giữ CI xanh vừa phải dễ revert. Quy trình nào phù hợp nhất?
- A. Plan mode để lập chiến lược và duyệt, sau đó thoát Plan mode và thực thi từng module, test và commit sau mỗi đợt
- B. Thực thi toàn bộ 120 file trong một lượt rồi chạy test một lần
- C. Chỉ lập kế hoạch và không bao giờ thực thi vì kế hoạch đã là kết quả
- D. Để Claude tự chọn thư viện mới mà không cần duyệt

**Đáp án:** A

**Giải thích:** Migration lớn cần chiến lược (plan) và thực thi có kiểm soát theo đợt. B làm khó phát hiện và revert lỗi. C bỏ quên việc thực sự thay đổi code. D bỏ bước duyệt cho quyết định ảnh hưởng lớn.

#### Q2. Sau khi Claude trình bày kế hoạch ở Plan mode và bạn đồng ý, bước tiếp theo hợp lý nhất là gì?
- A. Giữ nguyên Plan mode và yêu cầu Claude sửa file
- B. Thoát Plan mode và thực thi kế hoạch theo từng bước kèm kiểm tra
- C. Xoá kế hoạch và bắt đầu lại ở chế độ thường
- D. Chuyển kế hoạch sang CLAUDE.md rồi xoá

**Đáp án:** B

**Giải thích:** Plan mode chỉ đọc nên cần thoát ra mới sửa được; thực thi nên theo từng bước có kiểm chứng. A mâu thuẫn với tính chỉ đọc. C bỏ phí kế hoạch đã duyệt. D lạm dụng CLAUDE.md, vốn dành cho hướng dẫn bền vững.

## K4. Explore subagent: cô lập khám phá dài dòng

### Trọng tâm

Khi cần khám phá nhiều (tìm cây phụ thuộc, đọc hàng chục file), giao cho **Explore subagent**: nó đọc trong ngữ cảnh riêng và chỉ trả **bản tóm tắt**, giữ context chính gọn.

### Giải thích

Khám phá codebase lạ sinh ra rất nhiều output trung gian: kết quả grep, nội dung file, cây thư mục. Nếu tất cả nằm trong cuộc trò chuyện chính, context phình ra, các chỉ dẫn và quyết định quan trọng bị đẩy xa, và chất lượng giảm dần (context degradation, bài 5.4).

**Subagent** là một instance Claude chạy trong **context window riêng**. Claude Code có sẵn subagent **Explore** chuyên khám phá codebase ở chế độ chỉ đọc (được tối ưu cho tìm kiếm nhanh). Luồng làm việc:

1. Luồng chính ra lệnh: "Tìm mọi nơi dùng `LegacyAuth` và cho biết module nào phụ thuộc."
2. Explore chạy hàng chục lần grep/đọc file trong ngữ cảnh riêng.
3. Chỉ trả về: "12 nơi dùng, thuộc 4 module (auth, billing, admin, reports); các điểm vào quan trọng là..."
4. Luồng chính dùng bản tóm tắt này để lập kế hoạch.

Điểm cần nhớ:

- Subagent **không thấy** lịch sử luồng chính, nên cần mô tả nhiệm vụ đầy đủ và nêu rõ muốn nhận lại gì (bài 1.3).
- Giá trị nằm ở **cô lập context**, không phải phép màu về độ chính xác; tóm tắt cần chứa đường dẫn/bằng chứng để luồng chính kiểm chứng khi cần.
- Kết hợp tự nhiên với Plan mode: Explore thu thập dữ kiện, luồng chính lập kế hoạch.

### Keyword

- `Explore subagent` — subagent chỉ đọc chuyên khám phá codebase, trả về tóm tắt
- `subagent` — instance Claude chạy trong context riêng để làm một việc cụ thể
- `context isolation` — tách context để output trung gian không làm bẩn luồng chính
- `summary handoff` — bàn giao kết quả cô đọng cho luồng chính
- `dependency discovery` — tìm hiểu cây phụ thuộc giữa các thành phần
- `evidence in summary` — tóm tắt kèm đường dẫn file để kiểm chứng

### Bẫy đề thi

- ✗ Dán hàng nghìn dòng kết quả tìm kiếm vào luồng chính ⇒ ✓ Dùng Explore subagent và nhận lại tóm tắt
- ✗ Nghĩ subagent tự biết toàn bộ cuộc trò chuyện trước đó ⇒ ✓ Phải truyền đủ ngữ cảnh trong yêu cầu giao việc
- ✗ Dùng subagent cho việc nhỏ chỉ cần đọc một file ⇒ ✓ Dùng khi khám phá đủ lớn để cô lập có lợi

### Câu hỏi

#### Q1. Bạn cần hiểu cây phụ thuộc của một monorepo 3.000 file trước khi refactor. Bạn lo ngại kết quả tìm kiếm sẽ làm đầy context chính. Phương án tốt nhất?
- A. Chạy grep trực tiếp trong luồng chính rồi đọc từng kết quả
- B. Dán toàn bộ cây thư mục vào CLAUDE.md
- C. Giảm `max_tokens` để output ngắn hơn
- D. Giao cho Explore subagent khám phá và chỉ trả về bản tóm tắt phụ thuộc

**Đáp án:** D

**Giải thích:** Subagent khám phá trong context riêng, trả về kết luận cô đọng nên luồng chính sạch. A làm context phình. B nhồi dữ liệu tạm thời vào file bền vững và vẫn tốn context. C không giảm lượng khám phá cần thiết.

#### Q2. Một kỹ sư giao cho Explore subagent câu "xem các chỗ đó có sao không" sau một cuộc trò chuyện dài, và kết quả trả về lạc đề. Nguyên nhân hợp lý nhất?
- A. Subagent không thấy lịch sử luồng chính nên yêu cầu thiếu ngữ cảnh ("các chỗ đó" là gì?)
- B. Subagent bị khoá không được đọc file
- C. Explore chỉ hoạt động khi Plan mode đang tắt
- D. Tóm tắt luôn lạc đề do cơ chế của subagent

**Đáp án:** A

**Giải thích:** Subagent chạy ở context riêng, nên chỉ biết những gì nằm trong yêu cầu giao việc; cần nêu rõ đối tượng, mục tiêu và định dạng kết quả. B sai vì Explore vốn được thiết kế để đọc. C không có cơ sở. D khái quát hoá sai từ một lỗi do brief thiếu.
