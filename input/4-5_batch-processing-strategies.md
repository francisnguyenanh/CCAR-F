# 4.5 — Batch Processing Strategies

> Domain 4: Prompt Engineering & Structured Output · Tỷ trọng toàn domain: 20%
> Source lesson: https://claudecertificationguide.com/learn/4-prompt-engineering/4-5-batch-processing
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Batch Processing Strategies**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Latency fit

**Principle (EN):** Batch saves cost but may take up to 24h without fixed response latency.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **batch saves cost but may take up to 24h without fixed response latency**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** CI premerge review blocks developer.

**Recommended implementation:** Keep synchronous path for blocking review.

**Incorrect shortcut / Sai lầm dễ mắc:** Move all jobs to batch because cheaper.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "CI premerge review blocks developer".
- Decision: áp dụng nguyên tắc **Latency fit** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Keep synchronous path for blocking review" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Async reporting use case

**Principle (EN):** Nightly audits and offline extraction fit Message Batches.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **nightly audits and offline extraction fit Message Batches**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Technical debt report only needed tomorrow.

**Recommended implementation:** Submit batched requests and collect later.

**Incorrect shortcut / Sai lầm dễ mắc:** Spend synchronous budget on every report.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Technical debt report only needed tomorrow".
- Decision: áp dụng nguyên tắc **Async reporting use case** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Submit batched requests and collect later" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. custom_id per request

**Principle (EN):** Batch result ordering should not be assumed.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **batch result ordering should not be assumed**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** 1,000 documents return mixed outcomes.

**Recommended implementation:** Correlate by custom_id and retry failed subset.

**Incorrect shortcut / Sai lầm dễ mắc:** Match results by array position.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "1,000 documents return mixed outcomes".
- Decision: áp dụng nguyên tắc **custom_id per request** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Correlate by custom_id and retry failed subset" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. No interactive tool loop inside item

**Principle (EN):** Single batch request cannot dynamically call tools and reenter same item.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **single batch request cannot dynamically call tools and reenter same item**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Agent must fetch latest order info mid-analysis.

**Recommended implementation:** Use synchronous orchestration for tool-dependent phase.

**Incorrect shortcut / Sai lầm dễ mắc:** Assume batch performs arbitrary multi-turn tools.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Agent must fetch latest order info mid-analysis".
- Decision: áp dụng nguyên tắc **No interactive tool loop inside item** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use synchronous orchestration for tool-dependent phase" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** CI premerge review blocks developer.

**Bad design:** Move all jobs to batch because cheaper.

**Better design:** Keep synchronous path for blocking review.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : CI premerge review blocks developer.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Keep synchronous path for blocking review.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Latency fit:** "Move all jobs to batch because cheaper" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở latency fit, rồi chọn "Keep synchronous path for blocking review".

2. **Bẫy Async reporting use case:** "Spend synchronous budget on every report" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở async reporting use case, rồi chọn "Submit batched requests and collect later".

3. **Bẫy custom_id per request:** "Match results by array position" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở custom_id per request, rồi chọn "Correlate by custom_id and retry failed subset".

4. **Bẫy No interactive tool loop inside item:** "Assume batch performs arbitrary multi-turn tools" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở no interactive tool loop inside item, rồi chọn "Use synchronous orchestration for tool-dependent phase".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **CI premerge review blocks developer**. Phương án nào phù hợp nhất?

- **A.** Match results by array position; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Keep synchronous path for blocking review; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Move all jobs to batch because cheaper; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Spend synchronous budget on every report; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **custom_id per request**, không giải quyết được yêu cầu cốt lõi "Batch saves cost but may take up to 24h without fixed response latency" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Batch saves cost but may take up to 24h without fixed response latency. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Move all jobs to batch because cheaper" được nêu ở cơ chế Latency fit. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Async reporting use case**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "CI premerge review blocks developer", ưu tiên phân biệt `Latency fit` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Spend synchronous budget on every report** cho tình huống: Technical debt report only needed tomorrow. Cần phản biện thế nào?

- **A.** Match results by array position; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Assume batch performs arbitrary multi-turn tools; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Submit batched requests and collect later; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Spend synchronous budget on every report; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **custom_id per request**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **No interactive tool loop inside item**, không giải quyết được yêu cầu cốt lõi "Nightly audits and offline extraction fit Message Batches" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Nightly audits and offline extraction fit Message Batches. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Spend synchronous budget on every report" được nêu ở cơ chế Async reporting use case. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Technical debt report only needed tomorrow", ưu tiên phân biệt `Async reporting use case` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **1,000 documents return mixed outcomes** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Match results by array position; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Assume batch performs arbitrary multi-turn tools; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Move all jobs to batch because cheaper; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Correlate by custom_id and retry failed subset; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Match results by array position" được nêu ở cơ chế custom_id per request. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **No interactive tool loop inside item**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Latency fit**, không giải quyết được yêu cầu cốt lõi "Batch result ordering should not be assumed" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Batch result ordering should not be assumed. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "1,000 documents return mixed outcomes", ưu tiên phân biệt `custom_id per request` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Agent must fetch latest order info mid-analysis**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Use synchronous orchestration for tool-dependent phase; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Assume batch performs arbitrary multi-turn tools; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Move all jobs to batch because cheaper; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Spend synchronous budget on every report; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Single batch request cannot dynamically call tools and reenter same item. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Assume batch performs arbitrary multi-turn tools" được nêu ở cơ chế No interactive tool loop inside item. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Latency fit**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Async reporting use case**, không giải quyết được yêu cầu cốt lõi "Single batch request cannot dynamically call tools and reenter same item" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Agent must fetch latest order info mid-analysis", ưu tiên phân biệt `No interactive tool loop inside item` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Move all jobs to batch because cheaper**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Match results by array position; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Keep synchronous path for blocking review; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Move all jobs to batch because cheaper; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Spend synchronous budget on every report; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **custom_id per request**, không giải quyết được yêu cầu cốt lõi "Batch saves cost but may take up to 24h without fixed response latency" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Batch saves cost but may take up to 24h without fixed response latency. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Move all jobs to batch because cheaper" được nêu ở cơ chế Latency fit. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Async reporting use case**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "CI premerge review blocks developer", ưu tiên phân biệt `Latency fit` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Technical debt report only needed tomorrow**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Match results by array position; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Assume batch performs arbitrary multi-turn tools; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Submit batched requests and collect later; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Spend synchronous budget on every report; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **custom_id per request**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **No interactive tool loop inside item**, không giải quyết được yêu cầu cốt lõi "Nightly audits and offline extraction fit Message Batches" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Nightly audits and offline extraction fit Message Batches. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Spend synchronous budget on every report" được nêu ở cơ chế Async reporting use case. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Technical debt report only needed tomorrow", ưu tiên phân biệt `Async reporting use case` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **1,000 documents return mixed outcomes**, nên chọn gì?

- **A.** Match results by array position; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Assume batch performs arbitrary multi-turn tools; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Move all jobs to batch because cheaper; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Correlate by custom_id and retry failed subset; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Match results by array position" được nêu ở cơ chế custom_id per request. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **No interactive tool loop inside item**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Latency fit**, không giải quyết được yêu cầu cốt lõi "Batch result ordering should not be assumed" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Batch result ordering should not be assumed. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "1,000 documents return mixed outcomes", ưu tiên phân biệt `custom_id per request` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Assume batch performs arbitrary multi-turn tools**. Đánh giá chính xác nhất là gì?

- **A.** Use synchronous orchestration for tool-dependent phase; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Assume batch performs arbitrary multi-turn tools; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Move all jobs to batch because cheaper; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Spend synchronous budget on every report; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Single batch request cannot dynamically call tools and reenter same item. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Assume batch performs arbitrary multi-turn tools" được nêu ở cơ chế No interactive tool loop inside item. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Latency fit**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Async reporting use case**, không giải quyết được yêu cầu cốt lõi "Single batch request cannot dynamically call tools and reenter same item" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Agent must fetch latest order info mid-analysis", ưu tiên phân biệt `No interactive tool loop inside item` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **CI premerge review blocks developer**, tiêu chí pass phù hợp là gì?

- **A.** Match results by array position; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Keep synchronous path for blocking review; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Move all jobs to batch because cheaper; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Spend synchronous budget on every report; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **custom_id per request**, không giải quyết được yêu cầu cốt lõi "Batch saves cost but may take up to 24h without fixed response latency" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Batch saves cost but may take up to 24h without fixed response latency. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Move all jobs to batch because cheaper" được nêu ở cơ chế Latency fit. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Async reporting use case**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "CI premerge review blocks developer", ưu tiên phân biệt `Latency fit` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Technical debt report only needed tomorrow**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Match results by array position; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Assume batch performs arbitrary multi-turn tools; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Submit batched requests and collect later; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Spend synchronous budget on every report; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **custom_id per request**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **No interactive tool loop inside item**, không giải quyết được yêu cầu cốt lõi "Nightly audits and offline extraction fit Message Batches" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Nightly audits and offline extraction fit Message Batches. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Spend synchronous budget on every report" được nêu ở cơ chế Async reporting use case. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Technical debt report only needed tomorrow", ưu tiên phân biệt `Async reporting use case` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "CI premerge review blocks developer".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Keep synchronous path for blocking review.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Latency fit:** Batch saves cost but may take up to 24h without fixed response latency. ✓ Keep synchronous path for blocking review. ✗ Move all jobs to batch because cheaper.
- **Async reporting use case:** Nightly audits and offline extraction fit Message Batches. ✓ Submit batched requests and collect later. ✗ Spend synchronous budget on every report.
- **custom_id per request:** Batch result ordering should not be assumed. ✓ Correlate by custom_id and retry failed subset. ✗ Match results by array position.
- **No interactive tool loop inside item:** Single batch request cannot dynamically call tools and reenter same item. ✓ Use synchronous orchestration for tool-dependent phase. ✗ Assume batch performs arbitrary multi-turn tools.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/4-prompt-engineering/4-5-batch-processing
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
