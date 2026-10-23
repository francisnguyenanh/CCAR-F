# 4.4 — Validation, Retry and Feedback Loops

## Tổng quan

Output có cấu trúc của model sẽ có lúc sai. Bài này nói về cách **phát hiện sai bằng validator** và **sửa bằng vòng retry có phản hồi** (feedback loop), đồng thời biết khi nào retry **vô ích** (dữ kiện vốn không tồn tại) và cách ghi lại các mẫu bất đồng giữa model và người duyệt để cải tiến prompt.

Điểm thi hay gặp: retry đúng nghĩa là gửi lại **tài liệu gốc + kết quả sai + thông báo lỗi cụ thể**, chứ không phải gọi lại y nguyên; retry không bịa ra được dữ liệu thiếu; schema hợp lệ vẫn cần validator ngữ nghĩa; và các lần người dùng bác finding là dữ liệu quý cho cải tiến. Quy tắc nhớ nhanh: **cho model biết chính xác sai ở đâu; đừng retry thứ không thể sửa; ghi lại lý do bị bác để học.**

## K1. Retry có phản hồi (feedback-aware retry)

### Trọng tâm

Khi validator báo lỗi, vòng sửa phải gửi **ba thứ**: tài liệu nguồn, kết quả trích xuất sai và **thông báo lỗi cụ thể** từ validator, không chỉ chạy lại prompt cũ.

### Giải thích

Gọi lại cùng một prompt chỉ cho kết quả tương tự (hoặc ngẫu nhiên khác) vì model không biết lần trước sai chỗ nào. Muốn sửa có định hướng, bạn đưa vào lượt sau:

1. **Nguồn gốc**: tài liệu gốc, để model đối chiếu lại.
2. **Kết quả sai**: bản trích xuất lần trước.
3. **Lỗi chính xác**: ví dụ "Tổng các line_items là 450 nhưng total ghi 500. Hãy kiểm tra lại các dòng hoặc total theo tài liệu."

```python
for attempt in range(MAX_RETRIES + 1):
    result = extract(document, feedback=errors_from_last_try)
    errors = validate(result)        # code kiểm tra xác định
    if not errors:
        return result
    messages += [
        {"role": "assistant", "content": result_as_text},
        {"role": "user", "content": f"Kết quả sai: {errors}. Đối chiếu lại tài liệu và sửa."},
    ]
return mark_for_human_review(document, result, errors)
```

Vì sao đủ cả ba? Chỉ có lỗi mà không có nguồn thì model đoán; chỉ có nguồn mà không có lỗi thì model lặp lại cùng cách đọc; thiếu bản sai thì khó biết cần sửa phần nào. Thông báo lỗi càng **cụ thể và có thể hành động** (trường nào, giá trị nào, quy tắc nào bị vi phạm) thì tỉ lệ sửa đúng càng cao.

Luôn đặt **giới hạn số lần retry**, và khi hết lượt vẫn lỗi thì chuyển người xem, không âm thầm trả kết quả sai.

### Keyword

- `feedback loop` — vòng lặp đưa lỗi của lần trước vào lần sau để sửa
- `validation error message` — thông báo lỗi cụ thể do validator tạo ra
- `retry with feedback` — thử lại có kèm phản hồi lỗi, khác với thử lại y nguyên
- `source document` — tài liệu gốc cần đối chiếu
- `retry limit` — giới hạn số lần thử lại
- `human review fallback` — chuyển cho người xem khi không tự sửa được

### Bẫy đề thi

- ✗ Retry bằng đúng prompt cũ khi validator báo lỗi ⇒ ✓ Gửi nguồn + kết quả sai + lỗi cụ thể
- ✗ Chỉ nói "kết quả sai, hãy thử lại" ⇒ ✓ Nêu rõ trường nào sai và quy tắc nào bị vi phạm
- ✗ Retry vô hạn cho đến khi qua ⇒ ✓ Có giới hạn, hết lượt thì chuyển người xem

### Câu hỏi

#### Q1. Validator phát hiện tổng các dòng hoá đơn là 450 nhưng `total` trích ra là 500. Cách thực hiện lần retry hiệu quả nhất?
- A. Gọi lại đúng prompt ban đầu
- B. Gửi tài liệu gốc, bản trích xuất sai và thông báo "tổng các dòng 450 khác total 500", yêu cầu đối chiếu và sửa
- C. Tăng `max_tokens` rồi gọi lại
- D. Bỏ field `total`

**Đáp án:** B

**Giải thích:** B cung cấp đủ ba yếu tố để sửa có định hướng. A thường tái tạo cùng lỗi. C không liên quan nguyên nhân. D loại bỏ dữ liệu cần thiết thay vì sửa.

#### Q2. Sau 3 lần retry có phản hồi, extraction vẫn không qua validator. Hành vi nào phù hợp?
- A. Trả kết quả lần cuối như thể đã hợp lệ
- B. Tiếp tục retry cho tới khi qua, không giới hạn
- C. Xoá kết quả và coi như tài liệu không tồn tại
- D. Đánh dấu thất bại kèm lỗi và chuyển cho người xem

**Đáp án:** D

**Giải thích:** Hết lượt thì phải minh bạch và chuyển người xem. A là thất bại âm thầm. B có thể lặp vô hạn, tốn chi phí. C làm mất dữ liệu.

## K2. Ranh giới hiệu quả của retry

### Trọng tâm

Retry chỉ sửa được lỗi **trích xuất sai dữ kiện có thật** (đọc nhầm, sai định dạng, tính sai); không tạo ra được thông tin **không có trong tài liệu**. Trường hợp đó phải trả `null` hoặc escalate.

### Giải thích

Hai nhóm lỗi khác hẳn nhau:

| Nhóm lỗi | Ví dụ | Retry có ích? |
|---|---|---|
| **Recoverable mis-extraction** | Model đọc nhầm số, bỏ sót dòng, sai định dạng ngày, đặt giá trị vào sai trường | Có, nhất là khi kèm phản hồi cụ thể |
| **Absent information** | Tài liệu không hề ghi tên phòng ban, thiếu ngày, trang bị mất | Không, thông tin không tồn tại |

Với nhóm thứ hai, mỗi lần retry chỉ làm tăng nguy cơ model **bịa** một giá trị cho đạt yêu cầu validator, nhất là khi validator đòi trường phải khác rỗng. Vòng lặp "retry mười lần cho tới khi có tên phòng ban" là cách tốt nhất để lấy về một tên phòng ban giả.

Cách phân biệt trong thực tế:

- Validator nên phân biệt được "giá trị sai" với "không có bằng chứng". Ví dụ cho phép trường là `null` kèm lý do, và không coi `null` hợp lệ là lỗi để retry.
- Nếu retry có phản hồi mà model vẫn khẳng định "không tìm thấy trong tài liệu" thì tin điều đó, trả `null` hoặc chuyển người hay nguồn dữ liệu khác bổ sung (ví dụ hệ thống khác có thông tin phòng ban).

Retry là công cụ sửa lỗi đọc, không phải máy tạo dữ liệu.

### Keyword

- `recoverable error` — lỗi có thể sửa bằng cách thử lại có định hướng
- `absent information` — thông tin vốn không có trong tài liệu
- `fabrication` — bịa thông tin cho đủ yêu cầu
- `escalation` — chuyển lên người hoặc nguồn khác xử lý
- `evidence-based null` — trả `null` vì không có bằng chứng, không phải do lỗi
- `diminishing returns` — thêm nỗ lực nhưng hiệu quả không tăng

### Bẫy đề thi

- ✗ Retry nhiều lần cho tới khi trường thiếu có giá trị ⇒ ✓ Dữ kiện không tồn tại thì trả `null` hoặc escalate
- ✗ Coi mọi lỗi validator đều do model đọc sai ⇒ ✓ Phân biệt lỗi đọc (retry được) với thông tin vắng (retry vô ích)
- ✗ Ép validator bắt trường nào cũng phải khác rỗng ⇒ ✓ Cho phép `null` có chủ đích để tránh khuyến khích bịa

### Câu hỏi

#### Q1. Một số tài liệu hoàn toàn không ghi tên phòng ban, validator báo "department rỗng" và pipeline retry 10 lần. Cách thiết kế đúng hơn?
- A. Tăng số lần retry lên 20
- B. Cho phép `department = null` khi không có bằng chứng và chuyển ca đó cho người hoặc nguồn dữ liệu khác
- C. Thêm vào prompt "luôn phải điền phòng ban"
- D. Dùng giá trị mặc định "General"

**Đáp án:** B

**Giải thích:** Thông tin vắng thì retry không giúp; trả `null` và escalate là trung thực. A, C khuyến khích bịa. D che giấu việc thiếu bằng giá trị giả.

#### Q2. Trong các lỗi sau, lỗi nào hưởng lợi nhiều nhất từ retry có phản hồi?
- A. Hoá đơn bị cắt mất trang chứa tên khách hàng
- B. Model đọc "1,250" thành 1.25 vì nhầm định dạng số
- C. Hợp đồng không có điều khoản bảo hành
- D. File PDF trống

**Đáp án:** B

**Giải thích:** Dữ kiện có trong tài liệu và model đọc sai, phản hồi lỗi giúp đọc lại đúng. A, C, D là thông tin không tồn tại nên retry không tạo ra được.

## K3. Validator xác định cho ngữ nghĩa và nghiệp vụ

### Trọng tâm

Output qua schema vẫn cần **validator bằng code** cho kiểm tra số học và quy tắc nghiệp vụ, kèm **lý do lỗi tường minh** để làm phản hồi retry.

### Giải thích

Schema (xem 4.3) bảo đảm hình dạng. Phần còn lại, ý nghĩa, phải kiểm bằng code vì code **xác định, rẻ, và không bị model "thuyết phục"**. Ví dụ các kiểm tra điển hình:

- Tổng các dòng bằng `total` (cho phép sai số làm tròn nhỏ).
- `due_date` không được trước `issue_date`.
- Mã sản phẩm tồn tại trong danh mục; số tiền không âm; tiền tệ nằm trong tập hỗ trợ.
- Quan hệ giữa các trường (thuế = tổng × thuế suất).

Thiết kế validator nên trả về **danh sách lỗi có cấu trúc**, ví dụ:

```python
def validate(inv) -> list[dict]:
    errs = []
    if inv["due_date"] < inv["issue_date"]:
        errs.append({"field": "due_date",
                     "reason": "due_date sớm hơn issue_date",
                     "values": [inv["due_date"], inv["issue_date"]]})
    return errs
```

Nhờ có `field`, `reason` và giá trị liên quan, bạn dùng nguyên danh sách này làm phản hồi trong vòng retry (K1). Cũng không nên dùng chính model làm "trọng tài" cho phép tính khi code làm được: model tự kiểm tra bản thân dễ gật đầu với lỗi của mình.

Chỉ dùng model-based check cho những tiêu chí thật sự mang tính đánh giá (ví dụ "tóm tắt có trung thực không") mà code không biểu đạt được.

### Keyword

- `deterministic validator` — bộ kiểm tra bằng code cho kết quả xác định
- `business rule` — quy tắc nghiệp vụ (ví dụ hạn thanh toán sau ngày phát hành)
- `semantic check` — kiểm tra ý nghĩa nội dung
- `structured error` — lỗi trả về có cấu trúc: trường, lý do, giá trị
- `rounding tolerance` — sai số làm tròn cho phép khi so sánh số
- `self-verification` — model tự kiểm tra kết quả của chính mình, kém tin cậy hơn code

### Bẫy đề thi

- ✗ Coi kết quả đã khớp schema là đã được kiểm chứng ⇒ ✓ Thêm validator ngữ nghĩa cho số học và nghiệp vụ
- ✗ Nhờ model tự kiểm tra phép cộng của chính nó ⇒ ✓ Dùng code cho kiểm tra xác định
- ✗ Validator chỉ trả "invalid" chung chung ⇒ ✓ Trả trường, lý do và giá trị để làm phản hồi retry

### Câu hỏi

#### Q1. Trích xuất hoá đơn trả JSON hợp lệ theo schema nhưng có `due_date` sớm hơn `issue_date`. Biện pháp phù hợp nhất?
- A. Tin schema vì đã hợp lệ
- B. Thêm ví dụ few-shot cho mọi cặp ngày có thể
- C. Thêm validator kiểm tra thứ tự ngày, trả lỗi có cấu trúc và dùng làm phản hồi retry
- D. Bảo model "hãy kiểm tra lại ngày" mà không có lỗi cụ thể

**Đáp án:** C

**Giải thích:** Quy tắc ngày là xác định, nên kiểm bằng code và đưa lý do vào retry. A bỏ qua lỗi ngữ nghĩa. B không bảo đảm. D thiếu thông tin cụ thể để sửa.

#### Q2. Đội muốn kiểm tra tổng hoá đơn khớp các dòng. Cách đáng tin cậy nhất?
- A. Gọi model thứ hai hỏi "tổng này có đúng không"
- B. Yêu cầu model tự giải thích phép cộng
- C. Dùng code cộng các dòng, so với total với sai số làm tròn nhỏ
- D. Chấp nhận nếu model nói "tôi chắc chắn"

**Đáp án:** C

**Giải thích:** Phép cộng là xác định, code làm chính xác và rẻ. A, B đưa mô hình vào việc không cần thiết và có thể sai. D dựa vào lời tự tin không kiểm chứng.

## K4. Theo dõi mẫu bất đồng để cải tiến (`detected_pattern` và dismissal)

### Trọng tâm

Ghi lại cho mỗi finding một **mẫu phát hiện (`detected_pattern`)** và việc người duyệt **bác/chấp nhận**; nhóm theo pattern để biết cần chỉnh tiêu chí hay ví dụ ở đâu.

### Giải thích

Khi hệ thống chạy thật, người duyệt (developer, kiểm toán viên) sẽ bác một số finding. Mỗi lần bác là **tín hiệu học** nếu bạn lưu lại có cấu trúc. Thiết kế gợi ý: mỗi finding có trường `detected_pattern` (ví dụ `variable_shadowing`, `unused_import`, `sql_concat`) và ghi nhận quyết định (`accepted` / `dismissed`, kèm lý do ngắn nếu có).

Sau một thời gian, nhóm theo `detected_pattern`:

| Pattern | Số finding | Tỉ lệ bị bác | Hành động |
|---|---|---|---|
| `variable_shadowing` | 120 | 85% | Tinh chỉnh tiêu chí, thêm ví dụ ca vô hại (4.1, 4.2) |
| `sql_concat` | 40 | 5% | Giữ nguyên |

Nhờ đó bạn biết cần sửa **đúng chỗ**: pattern bị bác nhiều thì cần tiêu chí/ví dụ tốt hơn hoặc tạm tắt (4.1); pattern ít bị bác thì giữ. Ngược lại, nếu giấu lịch sử bác hoặc không gắn pattern, bạn chỉ có cảm giác chung "hệ thống nhiễu" mà không biết sửa gì, và cùng một loại báo động giả sẽ lặp đi lặp lại.

Đây là vòng cải tiến liên tục: **phát hiện → người duyệt phản hồi → thống kê theo pattern → chỉnh prompt → đo lại**.

### Keyword

- `detected_pattern` — trường ghi mẫu/loại vấn đề đã phát hiện, dùng để nhóm thống kê
- `dismissal` — việc người duyệt bác một finding
- `acceptance rate` — tỉ lệ finding được chấp nhận
- `feedback signal` — dữ liệu phản hồi dùng để cải tiến
- `continuous improvement` — cải tiến liên tục dựa trên số liệu thực tế
- `pattern grouping` — nhóm finding theo mẫu để phân tích

### Bẫy đề thi

- ✗ Xoá hoặc không lưu các finding bị bác ⇒ ✓ Lưu lịch sử bác kèm `detected_pattern` để phân tích
- ✗ Chỉnh prompt dựa trên cảm giác "nhiễu quá" ⇒ ✓ Nhóm theo pattern, sửa nhóm có tỉ lệ bác cao
- ✗ Chỉ lưu tổng số finding ⇒ ✓ Lưu số bị bác theo từng pattern

### Câu hỏi

#### Q1. Developer thường xuyên bác các finding "variable shadowing" của công cụ review. Để cải tiến một cách có hệ thống, bạn nên làm gì?
- A. Xoá các finding bị bác khỏi log cho gọn
- B. Tắt toàn bộ công cụ
- C. Chỉ nhắc model trong prompt "đừng báo quá nhiều"
- D. Ghi `detected_pattern` và trạng thái bác, nhóm theo pattern để chỉnh tiêu chí và ví dụ của nhóm có tỉ lệ bác cao

**Đáp án:** D

**Giải thích:** Có dữ liệu theo pattern thì sửa đúng chỗ. A xoá mất tín hiệu. B quá mức. C là chỉ dẫn mơ hồ không dựa trên dữ liệu.

#### Q2. Bảng thống kê cho thấy pattern `unused_import` có tỉ lệ bác 2%, còn `naming_convention` bác 90%. Kết luận hợp lý?
- A. Cần cải thiện hoặc tạm tắt `naming_convention`, giữ `unused_import`
- B. Cải thiện `unused_import` trước vì nó có tỉ lệ bác thấp
- C. Hai pattern như nhau
- D. Tắt cả hai

**Đáp án:** A

**Giải thích:** Tỉ lệ bác cao cho thấy tiêu chí kém chính xác. B đảo ngược logic. C bỏ qua số liệu. D loại cả nhóm đang hoạt động tốt.
