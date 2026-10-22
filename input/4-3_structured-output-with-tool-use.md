# 4.3 — Structured Output with Tool Use

> Domain 4: Prompt Engineering & Structured Output · Tỷ trọng toàn domain: 20%
> Source lesson: https://claudecertificationguide.com/learn/4-prompt-engineering/4-3-structured-output
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Structured Output with Tool Use**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Tool schema versus semantics

**Principle (EN):** Schema constrains types/shape, not factual or arithmetic correctness.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **schema constrains types/shape, not factual or arithmetic correctness**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Invoice JSON well-formed but total wrong.

**Recommended implementation:** Validate sums using deterministic code.

**Incorrect shortcut / Sai lầm dễ mắc:** Declare every JSON schema-valid output accurate.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Invoice JSON well-formed but total wrong".
- Decision: áp dụng nguyên tắc **Tool schema versus semantics** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Validate sums using deterministic code" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. tool_choice auto any named

**Principle (EN):** auto permits prose, any forces one available tool, named forces one specified.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **auto permits prose, any forces one available tool, named forces one specified**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Must extract unknown document category as structured record.

**Recommended implementation:** Choose any among typed extractors.

**Incorrect shortcut / Sai lầm dễ mắc:** Choose auto and hope for JSON.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Must extract unknown document category as structured record".
- Decision: áp dụng nguyên tắc **tool_choice auto any named** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Choose any among typed extractors" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Nullable optional fields

**Principle (EN):** Missing input must not pressure invented required values.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **missing input must not pressure invented required values**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Contract has no delivery date.

**Recommended implementation:** Allow null/optional with explicit missing semantics.

**Incorrect shortcut / Sai lầm dễ mắc:** Make date required and guess.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Contract has no delivery date".
- Decision: áp dụng nguyên tắc **Nullable optional fields** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Allow null/optional with explicit missing semantics" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Ambiguity enums

**Principle (EN):** Use unclear or other+detail to express uncertainty.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **use unclear or other+detail to express uncertainty**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Input does not fit enum invoice/receipt.

**Recommended implementation:** Return unclear or other plus detail.

**Incorrect shortcut / Sai lầm dễ mắc:** Invent nearest confident category.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Input does not fit enum invoice/receipt".
- Decision: áp dụng nguyên tắc **Ambiguity enums** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Return unclear or other plus detail" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Invoice JSON well-formed but total wrong.

**Bad design:** Declare every JSON schema-valid output accurate.

**Better design:** Validate sums using deterministic code.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Invoice JSON well-formed but total wrong.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Validate sums using deterministic code.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Tool schema versus semantics:** "Declare every JSON schema-valid output accurate" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở tool schema versus semantics, rồi chọn "Validate sums using deterministic code".

2. **Bẫy tool_choice auto any named:** "Choose auto and hope for JSON" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở tool_choice auto any named, rồi chọn "Choose any among typed extractors".

3. **Bẫy Nullable optional fields:** "Make date required and guess" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở nullable optional fields, rồi chọn "Allow null/optional with explicit missing semantics".

4. **Bẫy Ambiguity enums:** "Invent nearest confident category" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở ambiguity enums, rồi chọn "Return unclear or other plus detail".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Invoice JSON well-formed but total wrong**. Phương án nào phù hợp nhất?

- **A.** Make date required and guess; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Validate sums using deterministic code; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Declare every JSON schema-valid output accurate; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Choose auto and hope for JSON; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Nullable optional fields**, không giải quyết được yêu cầu cốt lõi "Schema constrains types/shape, not factual or arithmetic correctness" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Schema constrains types/shape, not factual or arithmetic correctness. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Declare every JSON schema-valid output accurate" được nêu ở cơ chế Tool schema versus semantics. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **tool_choice auto any named**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Invoice JSON well-formed but total wrong", ưu tiên phân biệt `Tool schema versus semantics` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Choose auto and hope for JSON** cho tình huống: Must extract unknown document category as structured record. Cần phản biện thế nào?

- **A.** Make date required and guess; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Invent nearest confident category; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Choose any among typed extractors; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Choose auto and hope for JSON; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Nullable optional fields**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Ambiguity enums**, không giải quyết được yêu cầu cốt lõi "auto permits prose, any forces one available tool, named forces one specified" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** auto permits prose, any forces one available tool, named forces one specified. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Choose auto and hope for JSON" được nêu ở cơ chế tool_choice auto any named. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Must extract unknown document category as structured record", ưu tiên phân biệt `tool_choice auto any named` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Contract has no delivery date** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Make date required and guess; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Invent nearest confident category; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Declare every JSON schema-valid output accurate; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Allow null/optional with explicit missing semantics; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Make date required and guess" được nêu ở cơ chế Nullable optional fields. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Ambiguity enums**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Tool schema versus semantics**, không giải quyết được yêu cầu cốt lõi "Missing input must not pressure invented required values" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Missing input must not pressure invented required values. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Contract has no delivery date", ưu tiên phân biệt `Nullable optional fields` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Input does not fit enum invoice/receipt**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Return unclear or other plus detail; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Invent nearest confident category; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Declare every JSON schema-valid output accurate; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Choose auto and hope for JSON; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Use unclear or other+detail to express uncertainty. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Invent nearest confident category" được nêu ở cơ chế Ambiguity enums. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Tool schema versus semantics**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **tool_choice auto any named**, không giải quyết được yêu cầu cốt lõi "Use unclear or other+detail to express uncertainty" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Input does not fit enum invoice/receipt", ưu tiên phân biệt `Ambiguity enums` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Declare every JSON schema-valid output accurate**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Make date required and guess; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Validate sums using deterministic code; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Declare every JSON schema-valid output accurate; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Choose auto and hope for JSON; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Nullable optional fields**, không giải quyết được yêu cầu cốt lõi "Schema constrains types/shape, not factual or arithmetic correctness" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Schema constrains types/shape, not factual or arithmetic correctness. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Declare every JSON schema-valid output accurate" được nêu ở cơ chế Tool schema versus semantics. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **tool_choice auto any named**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Invoice JSON well-formed but total wrong", ưu tiên phân biệt `Tool schema versus semantics` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Must extract unknown document category as structured record**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Make date required and guess; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Invent nearest confident category; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Choose any among typed extractors; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Choose auto and hope for JSON; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Nullable optional fields**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Ambiguity enums**, không giải quyết được yêu cầu cốt lõi "auto permits prose, any forces one available tool, named forces one specified" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** auto permits prose, any forces one available tool, named forces one specified. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Choose auto and hope for JSON" được nêu ở cơ chế tool_choice auto any named. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Must extract unknown document category as structured record", ưu tiên phân biệt `tool_choice auto any named` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Contract has no delivery date**, nên chọn gì?

- **A.** Make date required and guess; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Invent nearest confident category; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Declare every JSON schema-valid output accurate; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Allow null/optional with explicit missing semantics; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Make date required and guess" được nêu ở cơ chế Nullable optional fields. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Ambiguity enums**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Tool schema versus semantics**, không giải quyết được yêu cầu cốt lõi "Missing input must not pressure invented required values" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Missing input must not pressure invented required values. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Contract has no delivery date", ưu tiên phân biệt `Nullable optional fields` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Invent nearest confident category**. Đánh giá chính xác nhất là gì?

- **A.** Return unclear or other plus detail; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Invent nearest confident category; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Declare every JSON schema-valid output accurate; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Choose auto and hope for JSON; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Use unclear or other+detail to express uncertainty. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Invent nearest confident category" được nêu ở cơ chế Ambiguity enums. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Tool schema versus semantics**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **tool_choice auto any named**, không giải quyết được yêu cầu cốt lõi "Use unclear or other+detail to express uncertainty" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Input does not fit enum invoice/receipt", ưu tiên phân biệt `Ambiguity enums` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Invoice JSON well-formed but total wrong**, tiêu chí pass phù hợp là gì?

- **A.** Make date required and guess; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Validate sums using deterministic code; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Declare every JSON schema-valid output accurate; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Choose auto and hope for JSON; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Nullable optional fields**, không giải quyết được yêu cầu cốt lõi "Schema constrains types/shape, not factual or arithmetic correctness" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Schema constrains types/shape, not factual or arithmetic correctness. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Declare every JSON schema-valid output accurate" được nêu ở cơ chế Tool schema versus semantics. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **tool_choice auto any named**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Invoice JSON well-formed but total wrong", ưu tiên phân biệt `Tool schema versus semantics` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Must extract unknown document category as structured record**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Make date required and guess; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Invent nearest confident category; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Choose any among typed extractors; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Choose auto and hope for JSON; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Nullable optional fields**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Ambiguity enums**, không giải quyết được yêu cầu cốt lõi "auto permits prose, any forces one available tool, named forces one specified" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** auto permits prose, any forces one available tool, named forces one specified. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Choose auto and hope for JSON" được nêu ở cơ chế tool_choice auto any named. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Must extract unknown document category as structured record", ưu tiên phân biệt `tool_choice auto any named` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Invoice JSON well-formed but total wrong".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Validate sums using deterministic code.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Tool schema versus semantics:** Schema constrains types/shape, not factual or arithmetic correctness. ✓ Validate sums using deterministic code. ✗ Declare every JSON schema-valid output accurate.
- **tool_choice auto any named:** auto permits prose, any forces one available tool, named forces one specified. ✓ Choose any among typed extractors. ✗ Choose auto and hope for JSON.
- **Nullable optional fields:** Missing input must not pressure invented required values. ✓ Allow null/optional with explicit missing semantics. ✗ Make date required and guess.
- **Ambiguity enums:** Use unclear or other+detail to express uncertainty. ✓ Return unclear or other plus detail. ✗ Invent nearest confident category.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/4-prompt-engineering/4-3-structured-output
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
