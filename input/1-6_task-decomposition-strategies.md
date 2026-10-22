# 1.6 — Task Decomposition Strategies

> Domain 1: Agentic Architecture & Orchestration · Tỷ trọng toàn domain: 27%
> Source lesson: https://claudecertificationguide.com/learn/1-agentic-architecture/1-6-task-decomposition
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Task Decomposition Strategies**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Fixed prompt chaining

**Principle (EN):** Known predictable steps suit fixed pipelines.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **known predictable steps suit fixed pipelines**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Extract fields, validate and format 10,000 standard documents.

**Recommended implementation:** Use defined extraction-validation-report sequence.

**Incorrect shortcut / Sai lầm dễ mắc:** Re-plan every document arbitrarily.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Extract fields, validate and format 10,000 standard documents".
- Decision: áp dụng nguyên tắc **Fixed prompt chaining** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use defined extraction-validation-report sequence" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Adaptive task decomposition

**Principle (EN):** Unknown scope and dependencies need adaptive investigation.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **unknown scope and dependencies need adaptive investigation**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Legacy application tests reveal untested upstream dependency.

**Recommended implementation:** Update task graph as discoveries emerge.

**Incorrect shortcut / Sai lầm dễ mắc:** Keep blindly following original file order.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Legacy application tests reveal untested upstream dependency".
- Decision: áp dụng nguyên tắc **Adaptive task decomposition** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Update task graph as discoveries emerge" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Attention dilution

**Principle (EN):** One pass over many items reduces depth and consistency.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **one pass over many items reduces depth and consistency**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Review first five of fourteen files is thorough, last nine superficial.

**Recommended implementation:** Separate per-file reviews from cross-file integration.

**Incorrect shortcut / Sai lầm dễ mắc:** Only enlarge context window.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Review first five of fourteen files is thorough, last nine superficial".
- Decision: áp dụng nguyên tắc **Attention dilution** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Separate per-file reviews from cross-file integration" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Cross-item integration

**Principle (EN):** Local passes do not detect cross-module contract issues.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **local passes do not detect cross-module contract issues**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Each service looks fine but API contracts mismatch.

**Recommended implementation:** Run separate integration pass over local findings and interfaces.

**Incorrect shortcut / Sai lầm dễ mắc:** Assume individual file correctness proves system consistency.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Each service looks fine but API contracts mismatch".
- Decision: áp dụng nguyên tắc **Cross-item integration** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Run separate integration pass over local findings and interfaces" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Extract fields, validate and format 10,000 standard documents.

**Bad design:** Re-plan every document arbitrarily.

**Better design:** Use defined extraction-validation-report sequence.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Extract fields, validate and format 10,000 standard documents.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Use defined extraction-validation-report sequence.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Fixed prompt chaining:** "Re-plan every document arbitrarily" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở fixed prompt chaining, rồi chọn "Use defined extraction-validation-report sequence".

2. **Bẫy Adaptive task decomposition:** "Keep blindly following original file order" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở adaptive task decomposition, rồi chọn "Update task graph as discoveries emerge".

3. **Bẫy Attention dilution:** "Only enlarge context window" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở attention dilution, rồi chọn "Separate per-file reviews from cross-file integration".

4. **Bẫy Cross-item integration:** "Assume individual file correctness proves system consistency" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở cross-item integration, rồi chọn "Run separate integration pass over local findings and interfaces".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Extract fields, validate and format 10,000 standard documents**. Phương án nào phù hợp nhất?

- **A.** Use defined extraction-validation-report sequence; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Re-plan every document arbitrarily; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Keep blindly following original file order; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Only enlarge context window; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Known predictable steps suit fixed pipelines. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Re-plan every document arbitrarily" được nêu ở cơ chế Fixed prompt chaining. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Adaptive task decomposition**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Attention dilution**, không giải quyết được yêu cầu cốt lõi "Known predictable steps suit fixed pipelines" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Extract fields, validate and format 10,000 standard documents", ưu tiên phân biệt `Fixed prompt chaining` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Keep blindly following original file order** cho tình huống: Legacy application tests reveal untested upstream dependency. Cần phản biện thế nào?

- **A.** Assume individual file correctness proves system consistency; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Update task graph as discoveries emerge; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Keep blindly following original file order; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Only enlarge context window; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Cross-item integration**, không giải quyết được yêu cầu cốt lõi "Unknown scope and dependencies need adaptive investigation" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Unknown scope and dependencies need adaptive investigation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Keep blindly following original file order" được nêu ở cơ chế Adaptive task decomposition. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Attention dilution**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Legacy application tests reveal untested upstream dependency", ưu tiên phân biệt `Adaptive task decomposition` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Review first five of fourteen files is thorough, last nine superficial** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Assume individual file correctness proves system consistency; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Re-plan every document arbitrarily; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Separate per-file reviews from cross-file integration; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Only enlarge context window; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Cross-item integration**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Fixed prompt chaining**, không giải quyết được yêu cầu cốt lõi "One pass over many items reduces depth and consistency" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** One pass over many items reduces depth and consistency. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Only enlarge context window" được nêu ở cơ chế Attention dilution. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Review first five of fourteen files is thorough, last nine superficial", ưu tiên phân biệt `Attention dilution` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Each service looks fine but API contracts mismatch**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Assume individual file correctness proves system consistency; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Re-plan every document arbitrarily; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Keep blindly following original file order; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Run separate integration pass over local findings and interfaces; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Assume individual file correctness proves system consistency" được nêu ở cơ chế Cross-item integration. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Fixed prompt chaining**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Adaptive task decomposition**, không giải quyết được yêu cầu cốt lõi "Local passes do not detect cross-module contract issues" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Local passes do not detect cross-module contract issues. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Each service looks fine but API contracts mismatch", ưu tiên phân biệt `Cross-item integration` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Re-plan every document arbitrarily**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Use defined extraction-validation-report sequence; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Re-plan every document arbitrarily; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Keep blindly following original file order; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Only enlarge context window; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Known predictable steps suit fixed pipelines. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Re-plan every document arbitrarily" được nêu ở cơ chế Fixed prompt chaining. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Adaptive task decomposition**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Attention dilution**, không giải quyết được yêu cầu cốt lõi "Known predictable steps suit fixed pipelines" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Extract fields, validate and format 10,000 standard documents", ưu tiên phân biệt `Fixed prompt chaining` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Legacy application tests reveal untested upstream dependency**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Assume individual file correctness proves system consistency; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Update task graph as discoveries emerge; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Keep blindly following original file order; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Only enlarge context window; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Cross-item integration**, không giải quyết được yêu cầu cốt lõi "Unknown scope and dependencies need adaptive investigation" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Unknown scope and dependencies need adaptive investigation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Keep blindly following original file order" được nêu ở cơ chế Adaptive task decomposition. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Attention dilution**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Legacy application tests reveal untested upstream dependency", ưu tiên phân biệt `Adaptive task decomposition` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Review first five of fourteen files is thorough, last nine superficial**, nên chọn gì?

- **A.** Assume individual file correctness proves system consistency; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Re-plan every document arbitrarily; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Separate per-file reviews from cross-file integration; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Only enlarge context window; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Cross-item integration**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Fixed prompt chaining**, không giải quyết được yêu cầu cốt lõi "One pass over many items reduces depth and consistency" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** One pass over many items reduces depth and consistency. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Only enlarge context window" được nêu ở cơ chế Attention dilution. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Review first five of fourteen files is thorough, last nine superficial", ưu tiên phân biệt `Attention dilution` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Assume individual file correctness proves system consistency**. Đánh giá chính xác nhất là gì?

- **A.** Assume individual file correctness proves system consistency; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Re-plan every document arbitrarily; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Keep blindly following original file order; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Run separate integration pass over local findings and interfaces; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Assume individual file correctness proves system consistency" được nêu ở cơ chế Cross-item integration. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Fixed prompt chaining**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Adaptive task decomposition**, không giải quyết được yêu cầu cốt lõi "Local passes do not detect cross-module contract issues" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Local passes do not detect cross-module contract issues. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Each service looks fine but API contracts mismatch", ưu tiên phân biệt `Cross-item integration` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Extract fields, validate and format 10,000 standard documents**, tiêu chí pass phù hợp là gì?

- **A.** Use defined extraction-validation-report sequence; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Re-plan every document arbitrarily; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Keep blindly following original file order; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Only enlarge context window; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Known predictable steps suit fixed pipelines. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Re-plan every document arbitrarily" được nêu ở cơ chế Fixed prompt chaining. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Adaptive task decomposition**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Attention dilution**, không giải quyết được yêu cầu cốt lõi "Known predictable steps suit fixed pipelines" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Extract fields, validate and format 10,000 standard documents", ưu tiên phân biệt `Fixed prompt chaining` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Legacy application tests reveal untested upstream dependency**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Assume individual file correctness proves system consistency; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Update task graph as discoveries emerge; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Keep blindly following original file order; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Only enlarge context window; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Cross-item integration**, không giải quyết được yêu cầu cốt lõi "Unknown scope and dependencies need adaptive investigation" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Unknown scope and dependencies need adaptive investigation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Keep blindly following original file order" được nêu ở cơ chế Adaptive task decomposition. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Attention dilution**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Legacy application tests reveal untested upstream dependency", ưu tiên phân biệt `Adaptive task decomposition` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Extract fields, validate and format 10,000 standard documents".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Use defined extraction-validation-report sequence.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Fixed prompt chaining:** Known predictable steps suit fixed pipelines. ✓ Use defined extraction-validation-report sequence. ✗ Re-plan every document arbitrarily.
- **Adaptive task decomposition:** Unknown scope and dependencies need adaptive investigation. ✓ Update task graph as discoveries emerge. ✗ Keep blindly following original file order.
- **Attention dilution:** One pass over many items reduces depth and consistency. ✓ Separate per-file reviews from cross-file integration. ✗ Only enlarge context window.
- **Cross-item integration:** Local passes do not detect cross-module contract issues. ✓ Run separate integration pass over local findings and interfaces. ✗ Assume individual file correctness proves system consistency.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/1-agentic-architecture/1-6-task-decomposition
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
