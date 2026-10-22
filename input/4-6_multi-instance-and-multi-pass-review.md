# 4.6 — Multi-Instance and Multi-Pass Review

> Domain 4: Prompt Engineering & Structured Output · Tỷ trọng toàn domain: 20%
> Source lesson: https://claudecertificationguide.com/learn/4-prompt-engineering/4-6-multi-pass-review
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Multi-Instance and Multi-Pass Review**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Independent reviewer

**Principle (EN):** Separate model session reduces anchoring on generated rationale.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **separate model session reduces anchoring on generated rationale**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Generation session praises its own flawed auth code.

**Recommended implementation:** Review in independent fresh invocation.

**Incorrect shortcut / Sai lầm dễ mắc:** Ask generator to reassert correctness.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Generation session praises its own flawed auth code".
- Decision: áp dụng nguyên tắc **Independent reviewer** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Review in independent fresh invocation" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Local then global review

**Principle (EN):** Focused per-file passes plus cross-file integration avoids attention dilution.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **focused per-file passes plus cross-file integration avoids attention dilution**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** First files checked deeply but later files skimmed.

**Recommended implementation:** Parallel file reviews, then contract consistency pass.

**Incorrect shortcut / Sai lầm dễ mắc:** Put all files into one even larger context.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "First files checked deeply but later files skimmed".
- Decision: áp dụng nguyên tắc **Local then global review** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Parallel file reviews, then contract consistency pass" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Confidence routing calibration

**Principle (EN):** Low confidence routes to humans; calibrated scores use labeled validation data.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **low confidence routes to humans; calibrated scores use labeled validation data**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Security finding has uncertain race condition hypothesis.

**Recommended implementation:** Calibrate and request review where risk/uncertainty high.

**Incorrect shortcut / Sai lầm dễ mắc:** Auto-approve based on raw 0.9 score.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Security finding has uncertain race condition hypothesis".
- Decision: áp dụng nguyên tắc **Confidence routing calibration** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Calibrate and request review where risk/uncertainty high" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Cross-pass contradiction

**Principle (EN):** Integrate findings to detect inconsistent judgments.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **integrate findings to detect inconsistent judgments**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Same SQL pattern flagged in one file but accepted in another.

**Recommended implementation:** Run adjudication and compare evidence.

**Incorrect shortcut / Sai lầm dễ mắc:** Publish conflicting reports separately without reconciliation.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Same SQL pattern flagged in one file but accepted in another".
- Decision: áp dụng nguyên tắc **Cross-pass contradiction** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Run adjudication and compare evidence" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Generation session praises its own flawed auth code.

**Bad design:** Ask generator to reassert correctness.

**Better design:** Review in independent fresh invocation.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Generation session praises its own flawed auth code.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Review in independent fresh invocation.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Independent reviewer:** "Ask generator to reassert correctness" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở independent reviewer, rồi chọn "Review in independent fresh invocation".

2. **Bẫy Local then global review:** "Put all files into one even larger context" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở local then global review, rồi chọn "Parallel file reviews, then contract consistency pass".

3. **Bẫy Confidence routing calibration:** "Auto-approve based on raw 0.9 score" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở confidence routing calibration, rồi chọn "Calibrate and request review where risk/uncertainty high".

4. **Bẫy Cross-pass contradiction:** "Publish conflicting reports separately without reconciliation" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở cross-pass contradiction, rồi chọn "Run adjudication and compare evidence".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Generation session praises its own flawed auth code**. Phương án nào phù hợp nhất?

- **A.** Auto-approve based on raw 0.9 score; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Review in independent fresh invocation; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Ask generator to reassert correctness; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Put all files into one even larger context; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Confidence routing calibration**, không giải quyết được yêu cầu cốt lõi "Separate model session reduces anchoring on generated rationale" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Separate model session reduces anchoring on generated rationale. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Ask generator to reassert correctness" được nêu ở cơ chế Independent reviewer. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Local then global review**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Generation session praises its own flawed auth code", ưu tiên phân biệt `Independent reviewer` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Put all files into one even larger context** cho tình huống: First files checked deeply but later files skimmed. Cần phản biện thế nào?

- **A.** Auto-approve based on raw 0.9 score; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Publish conflicting reports separately without reconciliation; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Parallel file reviews, then contract consistency pass; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Put all files into one even larger context; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Confidence routing calibration**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Cross-pass contradiction**, không giải quyết được yêu cầu cốt lõi "Focused per-file passes plus cross-file integration avoids attention dilution" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Focused per-file passes plus cross-file integration avoids attention dilution. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Put all files into one even larger context" được nêu ở cơ chế Local then global review. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "First files checked deeply but later files skimmed", ưu tiên phân biệt `Local then global review` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Security finding has uncertain race condition hypothesis** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Auto-approve based on raw 0.9 score; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Publish conflicting reports separately without reconciliation; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Ask generator to reassert correctness; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Calibrate and request review where risk/uncertainty high; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Auto-approve based on raw 0.9 score" được nêu ở cơ chế Confidence routing calibration. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Cross-pass contradiction**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Independent reviewer**, không giải quyết được yêu cầu cốt lõi "Low confidence routes to humans; calibrated scores use labeled validation data" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Low confidence routes to humans; calibrated scores use labeled validation data. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Security finding has uncertain race condition hypothesis", ưu tiên phân biệt `Confidence routing calibration` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Same SQL pattern flagged in one file but accepted in another**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Run adjudication and compare evidence; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Publish conflicting reports separately without reconciliation; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Ask generator to reassert correctness; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Put all files into one even larger context; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Integrate findings to detect inconsistent judgments. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Publish conflicting reports separately without reconciliation" được nêu ở cơ chế Cross-pass contradiction. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Independent reviewer**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Local then global review**, không giải quyết được yêu cầu cốt lõi "Integrate findings to detect inconsistent judgments" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Same SQL pattern flagged in one file but accepted in another", ưu tiên phân biệt `Cross-pass contradiction` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Ask generator to reassert correctness**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Auto-approve based on raw 0.9 score; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Review in independent fresh invocation; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Ask generator to reassert correctness; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Put all files into one even larger context; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Confidence routing calibration**, không giải quyết được yêu cầu cốt lõi "Separate model session reduces anchoring on generated rationale" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Separate model session reduces anchoring on generated rationale. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Ask generator to reassert correctness" được nêu ở cơ chế Independent reviewer. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Local then global review**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Generation session praises its own flawed auth code", ưu tiên phân biệt `Independent reviewer` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **First files checked deeply but later files skimmed**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Auto-approve based on raw 0.9 score; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Publish conflicting reports separately without reconciliation; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Parallel file reviews, then contract consistency pass; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Put all files into one even larger context; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Confidence routing calibration**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Cross-pass contradiction**, không giải quyết được yêu cầu cốt lõi "Focused per-file passes plus cross-file integration avoids attention dilution" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Focused per-file passes plus cross-file integration avoids attention dilution. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Put all files into one even larger context" được nêu ở cơ chế Local then global review. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "First files checked deeply but later files skimmed", ưu tiên phân biệt `Local then global review` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Security finding has uncertain race condition hypothesis**, nên chọn gì?

- **A.** Auto-approve based on raw 0.9 score; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Publish conflicting reports separately without reconciliation; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Ask generator to reassert correctness; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Calibrate and request review where risk/uncertainty high; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Auto-approve based on raw 0.9 score" được nêu ở cơ chế Confidence routing calibration. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Cross-pass contradiction**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Independent reviewer**, không giải quyết được yêu cầu cốt lõi "Low confidence routes to humans; calibrated scores use labeled validation data" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Low confidence routes to humans; calibrated scores use labeled validation data. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Security finding has uncertain race condition hypothesis", ưu tiên phân biệt `Confidence routing calibration` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Publish conflicting reports separately without reconciliation**. Đánh giá chính xác nhất là gì?

- **A.** Run adjudication and compare evidence; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Publish conflicting reports separately without reconciliation; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Ask generator to reassert correctness; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Put all files into one even larger context; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Integrate findings to detect inconsistent judgments. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Publish conflicting reports separately without reconciliation" được nêu ở cơ chế Cross-pass contradiction. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Independent reviewer**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Local then global review**, không giải quyết được yêu cầu cốt lõi "Integrate findings to detect inconsistent judgments" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Same SQL pattern flagged in one file but accepted in another", ưu tiên phân biệt `Cross-pass contradiction` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Generation session praises its own flawed auth code**, tiêu chí pass phù hợp là gì?

- **A.** Auto-approve based on raw 0.9 score; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Review in independent fresh invocation; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Ask generator to reassert correctness; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Put all files into one even larger context; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Confidence routing calibration**, không giải quyết được yêu cầu cốt lõi "Separate model session reduces anchoring on generated rationale" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Separate model session reduces anchoring on generated rationale. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Ask generator to reassert correctness" được nêu ở cơ chế Independent reviewer. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Local then global review**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Generation session praises its own flawed auth code", ưu tiên phân biệt `Independent reviewer` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **First files checked deeply but later files skimmed**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Auto-approve based on raw 0.9 score; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Publish conflicting reports separately without reconciliation; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Parallel file reviews, then contract consistency pass; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Put all files into one even larger context; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Confidence routing calibration**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Cross-pass contradiction**, không giải quyết được yêu cầu cốt lõi "Focused per-file passes plus cross-file integration avoids attention dilution" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Focused per-file passes plus cross-file integration avoids attention dilution. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Put all files into one even larger context" được nêu ở cơ chế Local then global review. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "First files checked deeply but later files skimmed", ưu tiên phân biệt `Local then global review` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Generation session praises its own flawed auth code".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Review in independent fresh invocation.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Independent reviewer:** Separate model session reduces anchoring on generated rationale. ✓ Review in independent fresh invocation. ✗ Ask generator to reassert correctness.
- **Local then global review:** Focused per-file passes plus cross-file integration avoids attention dilution. ✓ Parallel file reviews, then contract consistency pass. ✗ Put all files into one even larger context.
- **Confidence routing calibration:** Low confidence routes to humans; calibrated scores use labeled validation data. ✓ Calibrate and request review where risk/uncertainty high. ✗ Auto-approve based on raw 0.9 score.
- **Cross-pass contradiction:** Integrate findings to detect inconsistent judgments. ✓ Run adjudication and compare evidence. ✗ Publish conflicting reports separately without reconciliation.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/4-prompt-engineering/4-6-multi-pass-review
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
