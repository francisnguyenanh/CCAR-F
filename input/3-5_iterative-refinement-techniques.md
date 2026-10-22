# 3.5 — Iterative Refinement Techniques

> Domain 3: Claude Code Configuration & Workflows · Tỷ trọng toàn domain: 20%
> Source lesson: https://claudecertificationguide.com/learn/3-claude-code-config/3-5-iterative-refinement
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Iterative Refinement Techniques**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Input-output demonstrations

**Principle (EN):** Concrete transformations clarify inconsistent prose interpretation.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **concrete transformations clarify inconsistent prose interpretation**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** LLM transforms API return types inconsistently.

**Recommended implementation:** Show 2–3 before/after examples.

**Incorrect shortcut / Sai lầm dễ mắc:** Add more vague adjectives to prompt.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "LLM transforms API return types inconsistently".
- Decision: áp dụng nguyên tắc **Input-output demonstrations** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Show 2–3 before/after examples" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Test-driven feedback

**Principle (EN):** Failable tests give precise target behavior.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **failable tests give precise target behavior**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Migration silently replaces null with empty string.

**Recommended implementation:** Give failing test and expected actual outputs.

**Incorrect shortcut / Sai lầm dễ mắc:** Ask model to be more careful.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Migration silently replaces null with empty string".
- Decision: áp dụng nguyên tắc **Test-driven feedback** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Give failing test and expected actual outputs" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Interview unfamiliar domain

**Principle (EN):** Ask clarifying domain questions before implementation.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **ask clarifying domain questions before implementation**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Developer lacks cache invalidation expertise.

**Recommended implementation:** Have agent interview TTL and consistency requirements.

**Incorrect shortcut / Sai lầm dễ mắc:** Start coding with invented requirements.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Developer lacks cache invalidation expertise".
- Decision: áp dụng nguyên tắc **Interview unfamiliar domain** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Have agent interview TTL and consistency requirements" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Batch interacting feedback

**Principle (EN):** Interdependent changes should be reviewed together.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **interdependent changes should be reviewed together**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** New API error field also changes logging and SDK types.

**Recommended implementation:** Provide combined constraints in one review.

**Incorrect shortcut / Sai lầm dễ mắc:** Make isolated edits unaware of dependencies.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "New API error field also changes logging and SDK types".
- Decision: áp dụng nguyên tắc **Batch interacting feedback** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Provide combined constraints in one review" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** LLM transforms API return types inconsistently.

**Bad design:** Add more vague adjectives to prompt.

**Better design:** Show 2–3 before/after examples.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : LLM transforms API return types inconsistently.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Show 2–3 before/after examples.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Input-output demonstrations:** "Add more vague adjectives to prompt" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở input-output demonstrations, rồi chọn "Show 2–3 before/after examples".

2. **Bẫy Test-driven feedback:** "Ask model to be more careful" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở test-driven feedback, rồi chọn "Give failing test and expected actual outputs".

3. **Bẫy Interview unfamiliar domain:** "Start coding with invented requirements" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở interview unfamiliar domain, rồi chọn "Have agent interview TTL and consistency requirements".

4. **Bẫy Batch interacting feedback:** "Make isolated edits unaware of dependencies" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở batch interacting feedback, rồi chọn "Provide combined constraints in one review".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **LLM transforms API return types inconsistently**. Phương án nào phù hợp nhất?

- **A.** Ask model to be more careful; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Start coding with invented requirements; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Show 2–3 before/after examples; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Add more vague adjectives to prompt; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Test-driven feedback**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Interview unfamiliar domain**, không giải quyết được yêu cầu cốt lõi "Concrete transformations clarify inconsistent prose interpretation" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Concrete transformations clarify inconsistent prose interpretation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Add more vague adjectives to prompt" được nêu ở cơ chế Input-output demonstrations. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "LLM transforms API return types inconsistently", ưu tiên phân biệt `Input-output demonstrations` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Ask model to be more careful** cho tình huống: Migration silently replaces null with empty string. Cần phản biện thế nào?

- **A.** Ask model to be more careful; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Start coding with invented requirements; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Make isolated edits unaware of dependencies; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Give failing test and expected actual outputs; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Ask model to be more careful" được nêu ở cơ chế Test-driven feedback. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Interview unfamiliar domain**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Batch interacting feedback**, không giải quyết được yêu cầu cốt lõi "Failable tests give precise target behavior" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Failable tests give precise target behavior. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Migration silently replaces null with empty string", ưu tiên phân biệt `Test-driven feedback` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Developer lacks cache invalidation expertise** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Have agent interview TTL and consistency requirements; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Start coding with invented requirements; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Make isolated edits unaware of dependencies; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Add more vague adjectives to prompt; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Ask clarifying domain questions before implementation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Start coding with invented requirements" được nêu ở cơ chế Interview unfamiliar domain. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Batch interacting feedback**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Input-output demonstrations**, không giải quyết được yêu cầu cốt lõi "Ask clarifying domain questions before implementation" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Developer lacks cache invalidation expertise", ưu tiên phân biệt `Interview unfamiliar domain` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **New API error field also changes logging and SDK types**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Ask model to be more careful; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Provide combined constraints in one review; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Make isolated edits unaware of dependencies; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Add more vague adjectives to prompt; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Test-driven feedback**, không giải quyết được yêu cầu cốt lõi "Interdependent changes should be reviewed together" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Interdependent changes should be reviewed together. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Make isolated edits unaware of dependencies" được nêu ở cơ chế Batch interacting feedback. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Input-output demonstrations**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "New API error field also changes logging and SDK types", ưu tiên phân biệt `Batch interacting feedback` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Add more vague adjectives to prompt**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Ask model to be more careful; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Start coding with invented requirements; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Show 2–3 before/after examples; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Add more vague adjectives to prompt; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Test-driven feedback**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Interview unfamiliar domain**, không giải quyết được yêu cầu cốt lõi "Concrete transformations clarify inconsistent prose interpretation" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Concrete transformations clarify inconsistent prose interpretation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Add more vague adjectives to prompt" được nêu ở cơ chế Input-output demonstrations. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "LLM transforms API return types inconsistently", ưu tiên phân biệt `Input-output demonstrations` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Migration silently replaces null with empty string**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Ask model to be more careful; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Start coding with invented requirements; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Make isolated edits unaware of dependencies; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Give failing test and expected actual outputs; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Ask model to be more careful" được nêu ở cơ chế Test-driven feedback. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Interview unfamiliar domain**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Batch interacting feedback**, không giải quyết được yêu cầu cốt lõi "Failable tests give precise target behavior" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Failable tests give precise target behavior. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Migration silently replaces null with empty string", ưu tiên phân biệt `Test-driven feedback` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Developer lacks cache invalidation expertise**, nên chọn gì?

- **A.** Have agent interview TTL and consistency requirements; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Start coding with invented requirements; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Make isolated edits unaware of dependencies; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Add more vague adjectives to prompt; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Ask clarifying domain questions before implementation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Start coding with invented requirements" được nêu ở cơ chế Interview unfamiliar domain. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Batch interacting feedback**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Input-output demonstrations**, không giải quyết được yêu cầu cốt lõi "Ask clarifying domain questions before implementation" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Developer lacks cache invalidation expertise", ưu tiên phân biệt `Interview unfamiliar domain` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Make isolated edits unaware of dependencies**. Đánh giá chính xác nhất là gì?

- **A.** Ask model to be more careful; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Provide combined constraints in one review; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Make isolated edits unaware of dependencies; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Add more vague adjectives to prompt; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Test-driven feedback**, không giải quyết được yêu cầu cốt lõi "Interdependent changes should be reviewed together" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Interdependent changes should be reviewed together. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Make isolated edits unaware of dependencies" được nêu ở cơ chế Batch interacting feedback. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Input-output demonstrations**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "New API error field also changes logging and SDK types", ưu tiên phân biệt `Batch interacting feedback` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **LLM transforms API return types inconsistently**, tiêu chí pass phù hợp là gì?

- **A.** Ask model to be more careful; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Start coding with invented requirements; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Show 2–3 before/after examples; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Add more vague adjectives to prompt; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Test-driven feedback**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Interview unfamiliar domain**, không giải quyết được yêu cầu cốt lõi "Concrete transformations clarify inconsistent prose interpretation" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Concrete transformations clarify inconsistent prose interpretation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Add more vague adjectives to prompt" được nêu ở cơ chế Input-output demonstrations. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "LLM transforms API return types inconsistently", ưu tiên phân biệt `Input-output demonstrations` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Migration silently replaces null with empty string**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Ask model to be more careful; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Start coding with invented requirements; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Make isolated edits unaware of dependencies; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Give failing test and expected actual outputs; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Ask model to be more careful" được nêu ở cơ chế Test-driven feedback. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Interview unfamiliar domain**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Batch interacting feedback**, không giải quyết được yêu cầu cốt lõi "Failable tests give precise target behavior" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Failable tests give precise target behavior. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Migration silently replaces null with empty string", ưu tiên phân biệt `Test-driven feedback` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "LLM transforms API return types inconsistently".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Show 2–3 before/after examples.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Input-output demonstrations:** Concrete transformations clarify inconsistent prose interpretation. ✓ Show 2–3 before/after examples. ✗ Add more vague adjectives to prompt.
- **Test-driven feedback:** Failable tests give precise target behavior. ✓ Give failing test and expected actual outputs. ✗ Ask model to be more careful.
- **Interview unfamiliar domain:** Ask clarifying domain questions before implementation. ✓ Have agent interview TTL and consistency requirements. ✗ Start coding with invented requirements.
- **Batch interacting feedback:** Interdependent changes should be reviewed together. ✓ Provide combined constraints in one review. ✗ Make isolated edits unaware of dependencies.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/3-claude-code-config/3-5-iterative-refinement
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
