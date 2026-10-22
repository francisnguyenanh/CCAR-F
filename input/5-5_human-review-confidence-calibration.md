# 5.5 — Human Review & Confidence Calibration

> Domain 5: Context Management & Reliability · Tỷ trọng toàn domain: 15%
> Source lesson: https://claudecertificationguide.com/learn/5-context-management/5-5-human-review-calibration
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Human Review & Confidence Calibration**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Segment-level evaluation

**Principle (EN):** Aggregate accuracy hides poor handwritten or international extraction.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **aggregate accuracy hides poor handwritten or international extraction**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Overall accuracy 97% but scanned documents fail often.

**Recommended implementation:** Measure per document type and field.

**Incorrect shortcut / Sai lầm dễ mắc:** Auto-approve based on global accuracy alone.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Overall accuracy 97% but scanned documents fail often".
- Decision: áp dụng nguyên tắc **Segment-level evaluation** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Measure per document type and field" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Stratified audit of high confidence

**Principle (EN):** Review sample from every stratum including automated high-confidence output.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **review sample from every stratum including automated high-confidence output**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** New invoice layout causes confidently wrong totals.

**Recommended implementation:** Stratified random human checks across confidence bands.

**Incorrect shortcut / Sai lầm dễ mắc:** Review only items the model says low confidence.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "New invoice layout causes confidently wrong totals".
- Decision: áp dụng nguyên tắc **Stratified audit of high confidence** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Stratified random human checks across confidence bands" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Calibration with ground truth

**Principle (EN):** Raw model score not empirical correctness probability.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **raw model score not empirical correctness probability**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Model says 0.95 but amounts correct 0.82 on labels.

**Recommended implementation:** Calibrate thresholds on labeled held-out records.

**Incorrect shortcut / Sai lầm dễ mắc:** Treat numeric 0.95 as 95% correctness automatically.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Model says 0.95 but amounts correct 0.82 on labels".
- Decision: áp dụng nguyên tắc **Calibration with ground truth** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Calibrate thresholds on labeled held-out records" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Reviewer queue prioritization

**Principle (EN):** Allocate reviewers by uncertainty and risk, not simple FIFO.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **allocate reviewers by uncertainty and risk, not simple FIFO**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Limited reviewers face ambiguous high-impact fields.

**Recommended implementation:** Prioritize uncertain, contradictory, weak segment outputs.

**Incorrect shortcut / Sai lầm dễ mắc:** Review every item uniformly.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Limited reviewers face ambiguous high-impact fields".
- Decision: áp dụng nguyên tắc **Reviewer queue prioritization** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Prioritize uncertain, contradictory, weak segment outputs" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Overall accuracy 97% but scanned documents fail often.

**Bad design:** Auto-approve based on global accuracy alone.

**Better design:** Measure per document type and field.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Overall accuracy 97% but scanned documents fail often.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Measure per document type and field.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Segment-level evaluation:** "Auto-approve based on global accuracy alone" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở segment-level evaluation, rồi chọn "Measure per document type and field".

2. **Bẫy Stratified audit of high confidence:** "Review only items the model says low confidence" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở stratified audit of high confidence, rồi chọn "Stratified random human checks across confidence bands".

3. **Bẫy Calibration with ground truth:** "Treat numeric 0.95 as 95% correctness automatically" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở calibration with ground truth, rồi chọn "Calibrate thresholds on labeled held-out records".

4. **Bẫy Reviewer queue prioritization:** "Review every item uniformly" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở reviewer queue prioritization, rồi chọn "Prioritize uncertain, contradictory, weak segment outputs".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Overall accuracy 97% but scanned documents fail often**. Phương án nào phù hợp nhất?

- **A.** Measure per document type and field; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Auto-approve based on global accuracy alone; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Review only items the model says low confidence; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Treat numeric 0.95 as 95% correctness automatically; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Aggregate accuracy hides poor handwritten or international extraction. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Auto-approve based on global accuracy alone" được nêu ở cơ chế Segment-level evaluation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Stratified audit of high confidence**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Calibration with ground truth**, không giải quyết được yêu cầu cốt lõi "Aggregate accuracy hides poor handwritten or international extraction" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Overall accuracy 97% but scanned documents fail often", ưu tiên phân biệt `Segment-level evaluation` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Review only items the model says low confidence** cho tình huống: New invoice layout causes confidently wrong totals. Cần phản biện thế nào?

- **A.** Review every item uniformly; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Stratified random human checks across confidence bands; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Review only items the model says low confidence; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Treat numeric 0.95 as 95% correctness automatically; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Reviewer queue prioritization**, không giải quyết được yêu cầu cốt lõi "Review sample from every stratum including automated high-confidence output" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Review sample from every stratum including automated high-confidence output. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Review only items the model says low confidence" được nêu ở cơ chế Stratified audit of high confidence. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Calibration with ground truth**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "New invoice layout causes confidently wrong totals", ưu tiên phân biệt `Stratified audit of high confidence` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Model says 0.95 but amounts correct 0.82 on labels** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Review every item uniformly; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Auto-approve based on global accuracy alone; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Calibrate thresholds on labeled held-out records; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Treat numeric 0.95 as 95% correctness automatically; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Reviewer queue prioritization**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Segment-level evaluation**, không giải quyết được yêu cầu cốt lõi "Raw model score not empirical correctness probability" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Raw model score not empirical correctness probability. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Treat numeric 0.95 as 95% correctness automatically" được nêu ở cơ chế Calibration with ground truth. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Model says 0.95 but amounts correct 0.82 on labels", ưu tiên phân biệt `Calibration with ground truth` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Limited reviewers face ambiguous high-impact fields**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Review every item uniformly; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Auto-approve based on global accuracy alone; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Review only items the model says low confidence; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Prioritize uncertain, contradictory, weak segment outputs; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Review every item uniformly" được nêu ở cơ chế Reviewer queue prioritization. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Segment-level evaluation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Stratified audit of high confidence**, không giải quyết được yêu cầu cốt lõi "Allocate reviewers by uncertainty and risk, not simple FIFO" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Allocate reviewers by uncertainty and risk, not simple FIFO. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Limited reviewers face ambiguous high-impact fields", ưu tiên phân biệt `Reviewer queue prioritization` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Auto-approve based on global accuracy alone**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Measure per document type and field; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Auto-approve based on global accuracy alone; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Review only items the model says low confidence; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Treat numeric 0.95 as 95% correctness automatically; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Aggregate accuracy hides poor handwritten or international extraction. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Auto-approve based on global accuracy alone" được nêu ở cơ chế Segment-level evaluation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Stratified audit of high confidence**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Calibration with ground truth**, không giải quyết được yêu cầu cốt lõi "Aggregate accuracy hides poor handwritten or international extraction" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Overall accuracy 97% but scanned documents fail often", ưu tiên phân biệt `Segment-level evaluation` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **New invoice layout causes confidently wrong totals**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Review every item uniformly; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Stratified random human checks across confidence bands; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Review only items the model says low confidence; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Treat numeric 0.95 as 95% correctness automatically; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Reviewer queue prioritization**, không giải quyết được yêu cầu cốt lõi "Review sample from every stratum including automated high-confidence output" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Review sample from every stratum including automated high-confidence output. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Review only items the model says low confidence" được nêu ở cơ chế Stratified audit of high confidence. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Calibration with ground truth**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "New invoice layout causes confidently wrong totals", ưu tiên phân biệt `Stratified audit of high confidence` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Model says 0.95 but amounts correct 0.82 on labels**, nên chọn gì?

- **A.** Review every item uniformly; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Auto-approve based on global accuracy alone; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Calibrate thresholds on labeled held-out records; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Treat numeric 0.95 as 95% correctness automatically; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Reviewer queue prioritization**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Segment-level evaluation**, không giải quyết được yêu cầu cốt lõi "Raw model score not empirical correctness probability" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Raw model score not empirical correctness probability. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Treat numeric 0.95 as 95% correctness automatically" được nêu ở cơ chế Calibration with ground truth. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Model says 0.95 but amounts correct 0.82 on labels", ưu tiên phân biệt `Calibration with ground truth` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Review every item uniformly**. Đánh giá chính xác nhất là gì?

- **A.** Review every item uniformly; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Auto-approve based on global accuracy alone; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Review only items the model says low confidence; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Prioritize uncertain, contradictory, weak segment outputs; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Review every item uniformly" được nêu ở cơ chế Reviewer queue prioritization. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Segment-level evaluation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Stratified audit of high confidence**, không giải quyết được yêu cầu cốt lõi "Allocate reviewers by uncertainty and risk, not simple FIFO" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Allocate reviewers by uncertainty and risk, not simple FIFO. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Limited reviewers face ambiguous high-impact fields", ưu tiên phân biệt `Reviewer queue prioritization` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Overall accuracy 97% but scanned documents fail often**, tiêu chí pass phù hợp là gì?

- **A.** Measure per document type and field; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Auto-approve based on global accuracy alone; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Review only items the model says low confidence; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Treat numeric 0.95 as 95% correctness automatically; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Aggregate accuracy hides poor handwritten or international extraction. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Auto-approve based on global accuracy alone" được nêu ở cơ chế Segment-level evaluation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Stratified audit of high confidence**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Calibration with ground truth**, không giải quyết được yêu cầu cốt lõi "Aggregate accuracy hides poor handwritten or international extraction" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Overall accuracy 97% but scanned documents fail often", ưu tiên phân biệt `Segment-level evaluation` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **New invoice layout causes confidently wrong totals**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Review every item uniformly; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Stratified random human checks across confidence bands; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Review only items the model says low confidence; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Treat numeric 0.95 as 95% correctness automatically; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Reviewer queue prioritization**, không giải quyết được yêu cầu cốt lõi "Review sample from every stratum including automated high-confidence output" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Review sample from every stratum including automated high-confidence output. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Review only items the model says low confidence" được nêu ở cơ chế Stratified audit of high confidence. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Calibration with ground truth**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "New invoice layout causes confidently wrong totals", ưu tiên phân biệt `Stratified audit of high confidence` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Overall accuracy 97% but scanned documents fail often".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Measure per document type and field.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Segment-level evaluation:** Aggregate accuracy hides poor handwritten or international extraction. ✓ Measure per document type and field. ✗ Auto-approve based on global accuracy alone.
- **Stratified audit of high confidence:** Review sample from every stratum including automated high-confidence output. ✓ Stratified random human checks across confidence bands. ✗ Review only items the model says low confidence.
- **Calibration with ground truth:** Raw model score not empirical correctness probability. ✓ Calibrate thresholds on labeled held-out records. ✗ Treat numeric 0.95 as 95% correctness automatically.
- **Reviewer queue prioritization:** Allocate reviewers by uncertainty and risk, not simple FIFO. ✓ Prioritize uncertain, contradictory, weak segment outputs. ✗ Review every item uniformly.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/5-context-management/5-5-human-review-calibration
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
