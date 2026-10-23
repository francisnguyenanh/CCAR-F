# 3.5 — Iterative Refinement Techniques

## Tổng quan

Lần đầu Claude làm chưa đúng ý là chuyện bình thường. Kỹ năng quan trọng là **cách đưa phản hồi** để vòng lặp hội tụ nhanh: thay vì nói "làm tốt hơn đi" hay "cẩn thận hơn", hãy cho model một **mục tiêu cụ thể và kiểm chứng được**. Bài này gồm bốn kỹ thuật: ví dụ input→output, phản hồi bằng test, để Claude phỏng vấn khi bạn chưa rõ domain, và gom các phản hồi liên quan vào một lượt.

Quy tắc nhớ nhanh: **mô tả bằng lời mơ hồ → thay bằng ví dụ cụ thể (2 đến 3 cặp before/after); hành vi sai lặp lại → đưa failing test kèm expected/actual; domain lạ, yêu cầu mơ hồ → để Claude hỏi trước khi code; phản hồi phụ thuộc lẫn nhau → đưa chung một lượt, còn độc lập thì có thể xử lý tuần tự.**

## K1. Minh hoạ bằng ví dụ input→output

### Trọng tâm

Khi mô tả bằng lời bị hiểu không nhất quán, hãy đưa **2 đến 3 cặp ví dụ trước/sau** cụ thể. Ví dụ truyền đạt chính xác điều mà tính từ mơ hồ không làm được.

### Giải thích

Ngôn ngữ tự nhiên có độ mơ hồ cao. Yêu cầu "chuyển kiểu trả về của các hàm API cho hiện đại và gọn hơn" có thể được hiểu thành vài cách khác nhau; mỗi lần chạy model chọn một cách, nên kết quả **không nhất quán** giữa các file. Thêm tính từ ("gọn hơn nữa", "sạch hơn") chỉ khiến mơ hồ hơn.

Ví dụ cụ thể thì khác: nó là một **đặc tả chạy được bằng mắt**. Model thấy phép biến đổi và khái quát hoá mẫu đó cho các trường hợp tương tự.

```text
Chuyển kiểu trả về theo mẫu sau.

Trước:
function getUser(id: string): Promise<User | null>
Sau:
function getUser(id: string): Promise<Result<User, NotFoundError>>

Trước:
function listOrders(): Promise<Order[] | undefined>
Sau:
function listOrders(): Promise<Result<Order[], ServiceError>>

Áp dụng cho mọi hàm trong src/api/.
```

Nguyên tắc chọn ví dụ:

- **2 đến 3 ví dụ** thường đủ; chọn các ví dụ **đa dạng** để phủ các trường hợp khác nhau, bao gồm cả ca biên.
- Ví dụ phải **nhất quán** với nhau, vì ví dụ mâu thuẫn tạo ra kết quả mâu thuẫn.
- Nêu luôn ca **không** biến đổi nếu có (ví dụ hàm đã đúng kiểu thì giữ nguyên).
- Đây cũng chính là few-shot prompting (bài 4.2) áp dụng cho phiên làm việc với Claude Code.

### Keyword

- `input-output examples` — cặp ví dụ đầu vào và đầu ra mong muốn
- `before/after` — ví dụ trước và sau khi biến đổi
- `few-shot` — đưa vài ví dụ trong prompt để model bắt chước mẫu
- `inconsistent interpretation` — mỗi lần hiểu một kiểu do mô tả mơ hồ
- `edge case` — ca biên, trường hợp đặc biệt cần minh hoạ
- `executable specification` — đặc tả cụ thể đến mức có thể kiểm tra

### Bẫy đề thi

- ✗ Thêm nhiều tính từ như "gọn hơn", "hiện đại hơn" vào prompt ⇒ ✓ Đưa 2 đến 3 cặp trước/sau cụ thể
- ✗ Cho ví dụ chỉ toàn ca dễ giống nhau ⇒ ✓ Chọn ví dụ đa dạng, có cả ca biên
- ✗ Đưa các ví dụ mâu thuẫn nhau ⇒ ✓ Ví dụ phải nhất quán, vì chúng được coi là đặc tả

### Câu hỏi

#### Q1. Claude chuyển kiểu trả về các hàm API theo cách khác nhau ở từng file dù prompt đã nói "hiện đại và gọn hơn". Cách cải thiện hiệu quả nhất?
- A. Thêm vào prompt các từ như "rất", "thật sự", "cực kỳ gọn"
- B. Đưa 2 đến 3 cặp ví dụ trước/sau cụ thể về phép chuyển đổi mong muốn
- C. Chạy lại cùng prompt nhiều lần và chọn kết quả tốt nhất cho từng file
- D. Yêu cầu Claude tự quyết định phong cách

**Đáp án:** B

**Giải thích:** Nguyên nhân là mô tả mơ hồ dẫn đến cách hiểu không nhất quán; ví dụ cụ thể làm rõ chính xác phép biến đổi. A chỉ tăng độ nhấn mạnh, không thêm thông tin. C tốn công và vẫn không nhất quán. D chính là điều gây ra vấn đề.

#### Q2. Bạn đưa ba ví dụ cho Claude, nhưng hai trong số đó dùng quy ước đặt tên khác nhau. Kết quả trộn lẫn hai kiểu. Điều gì giải thích hiện tượng này?
- A. Model không thể học từ ví dụ
- B. Ví dụ được coi như đặc tả nên chỉ dẫn mâu thuẫn tạo ra kết quả mâu thuẫn
- C. Số lượng ví dụ phải luôn là 10 mới đủ
- D. Ví dụ chỉ có tác dụng với tên hàm ngắn

**Đáp án:** B

**Giải thích:** Model khái quát từ các mẫu bạn đưa; mẫu mâu thuẫn thì kết quả cũng mâu thuẫn, nên cần làm cho ví dụ nhất quán. A sai vì học từ ví dụ là cơ chế chính. C, D bịa ràng buộc.

## K2. Phản hồi bằng test thất bại (test-driven)

### Trọng tâm

Đưa **failing test** kèm kết quả mong đợi và thực tế (expected vs actual) cho Claude, rồi yêu cầu sửa đến khi test pass. Test là mục tiêu cụ thể, kiểm chứng được; "cẩn thận hơn" thì không.

### Giải thích

Phản hồi như "migration của bạn có vẻ thay `null` bằng chuỗi rỗng, hãy cẩn thận hơn" gần như không chứa thông tin hành động. Claude không biết "cẩn thận" nghĩa là gì, và không có cách nào tự xác nhận mình đã đạt.

Failing test thì khác:

```ts
test("giữ nguyên null khi migrate trường middleName", () => {
  const out = migrate({ firstName: "An", middleName: null });
  expect(out.middleName).toBeNull();      // expected: null
});                                        // actual:   ""
```

Test này:

1. **Chỉ rõ hành vi đúng** (expected) và **hành vi sai hiện tại** (actual).
2. **Kiểm chứng được**: Claude chạy test, thấy đỏ, sửa, chạy lại đến xanh; không cần bạn phán xét từng vòng.
3. **Chống hồi quy**: test ở lại trong repo, lỗi này không quay lại.

Quy trình đề xuất: viết test mô tả hành vi mong muốn (hoặc tái hiện bug) → xác nhận test đang fail → yêu cầu Claude sửa implementation (không sửa test để cho qua) → chạy toàn bộ test suite để chắc không hỏng chỗ khác. Lưu ý quan trọng: nói rõ **không được sửa test để làm nó pass**, vì model có thể đi đường tắt.

Khi bạn không thể viết test ngay, vẫn nên đưa **input cụ thể, output thực tế, output mong đợi**; đó là dạng "test bằng lời" tốt hơn mọi mô tả trừu tượng.

### Keyword

- `failing test` — test đang thất bại, mô tả hành vi mong muốn
- `expected vs actual` — kết quả mong đợi so với kết quả thực tế
- `test-driven development (TDD)` — viết test trước, rồi viết code cho test pass
- `regression` — lỗi cũ quay lại sau khi sửa chỗ khác
- `verifiable feedback` — phản hồi có thể kiểm chứng tự động
- `green/red` — test pass (xanh) và fail (đỏ)

### Bẫy đề thi

- ✗ Nói "hãy cẩn thận hơn" khi hành vi sai lặp lại ⇒ ✓ Đưa failing test với expected/actual cụ thể
- ✗ Để Claude sửa test cho khớp code sai ⇒ ✓ Nói rõ sửa implementation, không sửa test
- ✗ Chỉ chạy đúng test vừa viết, không chạy cả test suite ⇒ ✓ Chạy toàn bộ suite để bắt hồi quy

### Câu hỏi

#### Q1. Script migration của Claude thay `null` bằng chuỗi rỗng ở một số cột. Bạn đã nhắc "chú ý hơn" hai lần nhưng lỗi vẫn lặp lại. Cách tiếp theo hiệu quả nhất?
- A. Nhắc lần thứ ba bằng chữ in hoa
- B. Đổi sang model khác ngay lập tức
- C. Viết một test thất bại có đầu vào cụ thể, giá trị expected là `null`, actual là `""`, rồi yêu cầu Claude sửa đến khi test pass
- D. Tự sửa tay toàn bộ và không dùng Claude nữa

**Đáp án:** C

**Giải thích:** Failing test cho model mục tiêu cụ thể và vòng lặp tự kiểm chứng; nó cũng bảo vệ khỏi hồi quy. A chỉ là lời nhắc mơ hồ lặp lại. B không đảm bảo giải quyết nguyên nhân (thiếu đặc tả). D bỏ phí khả năng sửa lặp có kiểm chứng.

#### Q2. Khi dùng test thất bại để dẫn dắt Claude, chỉ dẫn nào quan trọng nhất để tránh đường tắt?
- A. Cho phép Claude chỉnh test cho đến khi nó pass
- B. Yêu cầu Claude xoá các test đang fail
- C. Chỉ yêu cầu chạy duy nhất test vừa thêm
- D. Yêu cầu sửa implementation, không sửa test, rồi chạy cả test suite để kiểm tra hồi quy

**Đáp án:** D

**Giải thích:** Model có thể "lách" bằng cách làm test dễ hơn hoặc xoá test; cần ràng buộc rõ ràng và kiểm tra toàn suite. A, B tạo đường tắt làm mất ý nghĩa mục tiêu. C bỏ lỡ hồi quy ở nơi khác.

## K3. Phỏng vấn để làm rõ domain lạ (interview pattern)

### Trọng tâm

Khi bạn **chưa rành domain** và yêu cầu còn mơ hồ, hãy để Claude **hỏi bạn các câu làm rõ trước khi viết code** thay vì bắt đầu với các giả định tự bịa.

### Giải thích

Có những bài toán mà bạn biết "cần cache" nhưng không biết các quyết định cần đưa ra: thời gian sống (TTL), chiến lược vô hiệu hoá khi dữ liệu đổi, chấp nhận dữ liệu cũ bao lâu, hành vi khi cache chết, nhiều instance chia sẻ cache hay không. Nếu bảo Claude "thêm cache cho API sản phẩm", nó sẽ **chọn thay bạn** một loạt giá trị mặc định; kết quả có thể chạy được nhưng sai yêu cầu thực (hiển thị giá cũ gây thiệt hại).

Mẫu phỏng vấn:

```text
Tôi cần thêm cache cho API sản phẩm nhưng chưa rành về cache invalidation.
Trước khi viết code, hãy phỏng vấn tôi từng câu một về các yêu cầu và đánh đổi
(độ tươi của dữ liệu, tải, hạ tầng...). Sau khi hỏi xong, tóm tắt yêu cầu để tôi xác nhận.
```

Lợi ích: (1) phát hiện các yêu cầu bạn chưa nghĩ tới; (2) Claude đóng vai chuyên gia dẫn dắt, bạn đóng vai chủ sản phẩm; (3) có bản yêu cầu xác nhận trước khi tốn công sinh code. Phù hợp để kết hợp với Plan mode: phỏng vấn → tóm tắt yêu cầu → lập kế hoạch → thực thi.

Khi nào **không** cần: yêu cầu đã đầy đủ, bạn rành domain và biết rõ muốn gì; khi đó phỏng vấn chỉ làm chậm. Cũng đừng để Claude hỏi vô tận: yêu cầu nó hỏi các câu quan trọng nhất và dừng khi đủ thông tin.

### Keyword

- `interview pattern` — để Claude hỏi bạn các câu làm rõ trước khi làm
- `clarifying questions` — câu hỏi làm rõ yêu cầu
- `invented requirements` — yêu cầu do model tự suy ra, không phải của bạn
- `TTL (time to live)` — thời gian sống của một mục cache
- `cache invalidation` — vô hiệu hoá cache khi dữ liệu nguồn thay đổi
- `requirements confirmation` — tóm tắt yêu cầu để người dùng xác nhận

### Bẫy đề thi

- ✗ Bắt đầu viết code ngay với yêu cầu tự suy ra ở domain lạ ⇒ ✓ Cho Claude phỏng vấn để làm rõ TTL, tính nhất quán... trước
- ✗ Bắt Claude hỏi vô hạn ⇒ ✓ Giới hạn ở các câu quan trọng và kết thúc bằng bản tóm tắt để xác nhận
- ✗ Dùng phỏng vấn cho cả tác vụ đã rõ ràng hoàn toàn ⇒ ✓ Chỉ dùng khi domain lạ hoặc yêu cầu mơ hồ

### Câu hỏi

#### Q1. Bạn cần thêm cache cho dịch vụ giá sản phẩm nhưng không có kinh nghiệm về invalidation và tính nhất quán dữ liệu. Cách tiếp cận tốt nhất với Claude Code?
- A. Yêu cầu "thêm cache" và chấp nhận mặc định mà Claude chọn
- B. Tự đoán các giá trị TTL rồi ghi vào prompt
- C. Yêu cầu Claude phỏng vấn bạn về TTL, độ tươi dữ liệu, chiến lược invalidation, rồi tóm tắt yêu cầu trước khi viết code
- D. Hoãn dự án cho đến khi tuyển được chuyên gia

**Đáp án:** C

**Giải thích:** Interview pattern lộ ra các quyết định bạn chưa biết, tránh giả định sai. A để model quyết định thay bạn những tham số ảnh hưởng nghiệp vụ. B là đoán mò. D không cần thiết khi Claude có thể dẫn dắt làm rõ.

#### Q2. Điều nào sau đây là dấu hiệu việc dùng interview pattern KHÔNG cần thiết?
- A. Bạn mô tả được đầy đủ yêu cầu, ràng buộc và tiêu chí chấp nhận cho một thay đổi nhỏ
- B. Bạn không biết các lựa chọn thiết kế phổ biến của domain
- C. Yêu cầu có nhiều điểm mơ hồ chưa được quyết định
- D. Bạn lo lắng về các hệ quả mà bạn chưa nhìn thấy

**Đáp án:** A

**Giải thích:** Khi yêu cầu đã rõ và đầy đủ thì phỏng vấn chỉ thêm độ trễ. B, C, D đều là tình huống mơ hồ/lạ domain, đúng chỗ dùng phỏng vấn.

## K4. Gom phản hồi phụ thuộc lẫn nhau vào một lượt

### Trọng tâm

Khi các thay đổi **tương tác với nhau** (cùng ảnh hưởng một thiết kế), hãy đưa chúng **cùng một lượt** để Claude xử lý đồng thời. Các vấn đề **độc lập** thì có thể xử lý tuần tự từng cái.

### Giải thích

Hãy xét thay đổi: thêm trường `errorCode` vào phản hồi lỗi API. Điều này còn kéo theo cập nhật logging (ghi `errorCode`), cập nhật kiểu trong SDK client, và có thể cả tài liệu OpenAPI. Nếu bạn yêu cầu từng việc riêng lẻ lần lượt, mỗi lượt Claude tối ưu cục bộ, có thể đặt tên hoặc kiểu khác nhau ở từng chỗ, rồi lượt sau phải sửa lại lượt trước.

Cách tốt: đưa toàn bộ ràng buộc liên quan trong một lượt:

```text
Thêm trường errorCode (enum string) vào phản hồi lỗi API. Đồng thời:
1) logger phải ghi errorCode,
2) kiểu ErrorResponse trong SDK phải có errorCode,
3) cập nhật openapi.yaml.
Giữ tên và kiểu thống nhất ở cả ba nơi.
```

Nhờ thấy toàn bộ bức tranh, Claude thiết kế **một** quyết định nhất quán. Ngược lại, với các phản hồi **độc lập** (sửa lỗi chính tả trong README và đổi tên một biến trong module không liên quan) thì xử lý tuần tự vẫn tốt hoặc tốt hơn, vì mỗi lượt tập trung, dễ review, dễ revert.

Heuristic: hỏi "nếu làm riêng từng cái, quyết định ở cái này có thể làm cái kia sai không?" Nếu có, đó là phản hồi **tương tác**, hãy gom. Nếu không, tách ra cho sạch. Khi gom nhiều phản hồi, nên đánh số và nêu rõ ràng buộc chung để dễ kiểm tra từng mục đã được xử lý.

### Keyword

- `interacting feedback` — các phản hồi phụ thuộc vào nhau, ảnh hưởng chung một thiết kế
- `independent feedback` — phản hồi độc lập, có thể xử lý riêng
- `batching` — gom nhiều yêu cầu liên quan vào một lượt
- `cross-cutting change` — thay đổi cắt ngang nhiều thành phần
- `consistency constraint` — ràng buộc nhất quán giữa các nơi bị ảnh hưởng
- `local optimisation` — tối ưu cục bộ ở một chỗ, bỏ qua tác động chỗ khác

### Bẫy đề thi

- ✗ Sửa từng chỗ riêng lẻ không biết các thay đổi phụ thuộc nhau ⇒ ✓ Gom ràng buộc liên quan vào một lượt
- ✗ Gom tất cả mọi thứ không liên quan vào một prompt khổng lồ ⇒ ✓ Chỉ gom phản hồi tương tác; việc độc lập xử lý tuần tự
- ✗ Gom nhưng không nêu ràng buộc nhất quán giữa các nơi ⇒ ✓ Nêu rõ tên, kiểu cần thống nhất

### Câu hỏi

#### Q1. Thêm trường `errorCode` vào phản hồi lỗi API còn đòi hỏi cập nhật logger, kiểu SDK và tài liệu OpenAPI. Lần trước bạn yêu cầu riêng từng việc và kết quả đặt tên không thống nhất. Cách tốt hơn?
- A. Tiếp tục yêu cầu từng việc riêng lẻ nhưng nhắc "hãy nhất quán"
- B. Đưa toàn bộ ba thay đổi cùng ràng buộc tên và kiểu thống nhất trong một lượt
- C. Chỉ làm API và bỏ qua các phần còn lại
- D. Giao ba việc cho ba phiên Claude khác nhau hoàn toàn

**Đáp án:** B

**Giải thích:** Các thay đổi tương tác nên được xem xét cùng nhau để có một quyết định nhất quán. A vẫn thiếu bức tranh tổng thể ở từng lượt. C để hệ thống lệch pha. D còn làm nặng hơn vấn đề thiếu nhất quán vì không phiên nào thấy toàn cảnh.

#### Q2. Bạn có ba phản hồi: (1) sửa lỗi chính tả trong README, (2) đổi tên biến trong module billing, (3) thêm test cho module search. Chúng không liên quan nhau. Cách xử lý hợp lý?
- A. Bắt buộc gom vào một prompt dài để tiết kiệm lượt
- B. Gom với một yêu cầu thay đổi kiến trúc lớn để Claude thấy toàn cảnh
- C. Xử lý tuần tự từng việc, mỗi việc review và commit riêng
- D. Bỏ cả ba vì không quan trọng

**Đáp án:** C

**Giải thích:** Phản hồi độc lập xử lý tuần tự cho kết quả dễ review và revert. A và B gom không cần thiết, tăng rủi ro lẫn lộn. D bỏ qua công việc hợp lệ.
