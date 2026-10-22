# 5.2 — Escalation & Ambiguity Resolution

> Domain 5: Context Management & Reliability · Tỷ trọng toàn domain: 15%
> Source lesson: https://claudecertificationguide.com/learn/5-context-management/5-2-escalation-ambiguity
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Escalation & Ambiguity Resolution**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Explicit human request

**Principle (EN):** Honor direct request for human immediately.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **honor direct request for human immediately**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** User asks transfer me to a human representative.

**Recommended implementation:** Escalate immediately with case context.

**Incorrect shortcut / Sai lầm dễ mắc:** Try sentiment scoring first.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "User asks transfer me to a human representative".
- Decision: áp dụng nguyên tắc **Explicit human request** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Escalate immediately with case context" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Policy gap versus violation

**Principle (EN):** Unspecified case needs judgement; documented violation follows rule.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **unspecified case needs judgement; documented violation follows rule**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Policy covers store price match, customer asks competitor match.

**Recommended implementation:** Escalate gap to empowered human.

**Incorrect shortcut / Sai lầm dễ mắc:** Invent new matching policy.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Policy covers store price match, customer asks competitor match".
- Decision: áp dụng nguyên tắc **Policy gap versus violation** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Escalate gap to empowered human" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Unreliable sentiment and confidence

**Principle (EN):** Frustration or model confidence alone do not measure resolvability.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **frustration or model confidence alone do not measure resolvability**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Angry user asks routine tracking question.

**Recommended implementation:** Solve routine problem while respecting explicit human choice.

**Incorrect shortcut / Sai lầm dễ mắc:** Escalate automatically solely due to negative sentiment.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Angry user asks routine tracking question".
- Decision: áp dụng nguyên tắc **Unreliable sentiment and confidence** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Solve routine problem while respecting explicit human choice" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Ambiguous identity

**Principle (EN):** Several identical-name records require identity disambiguation.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **several identical-name records require identity disambiguation**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Three customer accounts share same name.

**Recommended implementation:** Ask for order number or verified identifier.

**Incorrect shortcut / Sai lầm dễ mắc:** Pick most recently active account.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Three customer accounts share same name".
- Decision: áp dụng nguyên tắc **Ambiguous identity** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Ask for order number or verified identifier" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** User asks transfer me to a human representative.

**Bad design:** Try sentiment scoring first.

**Better design:** Escalate immediately with case context.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : User asks transfer me to a human representative.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Escalate immediately with case context.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Explicit human request:** "Try sentiment scoring first" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở explicit human request, rồi chọn "Escalate immediately with case context".

2. **Bẫy Policy gap versus violation:** "Invent new matching policy" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở policy gap versus violation, rồi chọn "Escalate gap to empowered human".

3. **Bẫy Unreliable sentiment and confidence:** "Escalate automatically solely due to negative sentiment" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở unreliable sentiment and confidence, rồi chọn "Solve routine problem while respecting explicit human choice".

4. **Bẫy Ambiguous identity:** "Pick most recently active account" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở ambiguous identity, rồi chọn "Ask for order number or verified identifier".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **User asks transfer me to a human representative**. Phương án nào phù hợp nhất?

- **A.** Escalate immediately with case context; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Try sentiment scoring first; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Invent new matching policy; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Escalate automatically solely due to negative sentiment; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Honor direct request for human immediately. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Try sentiment scoring first" được nêu ở cơ chế Explicit human request. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Policy gap versus violation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Unreliable sentiment and confidence**, không giải quyết được yêu cầu cốt lõi "Honor direct request for human immediately" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "User asks transfer me to a human representative", ưu tiên phân biệt `Explicit human request` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Invent new matching policy** cho tình huống: Policy covers store price match, customer asks competitor match. Cần phản biện thế nào?

- **A.** Pick most recently active account; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Escalate gap to empowered human; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Invent new matching policy; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Escalate automatically solely due to negative sentiment; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Ambiguous identity**, không giải quyết được yêu cầu cốt lõi "Unspecified case needs judgement; documented violation follows rule" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Unspecified case needs judgement; documented violation follows rule. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Invent new matching policy" được nêu ở cơ chế Policy gap versus violation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Unreliable sentiment and confidence**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Policy covers store price match, customer asks competitor match", ưu tiên phân biệt `Policy gap versus violation` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Angry user asks routine tracking question** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Pick most recently active account; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Try sentiment scoring first; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Solve routine problem while respecting explicit human choice; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Escalate automatically solely due to negative sentiment; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Ambiguous identity**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Explicit human request**, không giải quyết được yêu cầu cốt lõi "Frustration or model confidence alone do not measure resolvability" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Frustration or model confidence alone do not measure resolvability. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Escalate automatically solely due to negative sentiment" được nêu ở cơ chế Unreliable sentiment and confidence. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Angry user asks routine tracking question", ưu tiên phân biệt `Unreliable sentiment and confidence` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Three customer accounts share same name**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Pick most recently active account; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Try sentiment scoring first; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Invent new matching policy; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Ask for order number or verified identifier; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Pick most recently active account" được nêu ở cơ chế Ambiguous identity. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Explicit human request**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Policy gap versus violation**, không giải quyết được yêu cầu cốt lõi "Several identical-name records require identity disambiguation" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Several identical-name records require identity disambiguation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Three customer accounts share same name", ưu tiên phân biệt `Ambiguous identity` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Try sentiment scoring first**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Escalate immediately with case context; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Try sentiment scoring first; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Invent new matching policy; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Escalate automatically solely due to negative sentiment; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Honor direct request for human immediately. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Try sentiment scoring first" được nêu ở cơ chế Explicit human request. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Policy gap versus violation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Unreliable sentiment and confidence**, không giải quyết được yêu cầu cốt lõi "Honor direct request for human immediately" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "User asks transfer me to a human representative", ưu tiên phân biệt `Explicit human request` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Policy covers store price match, customer asks competitor match**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Pick most recently active account; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Escalate gap to empowered human; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Invent new matching policy; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Escalate automatically solely due to negative sentiment; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Ambiguous identity**, không giải quyết được yêu cầu cốt lõi "Unspecified case needs judgement; documented violation follows rule" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Unspecified case needs judgement; documented violation follows rule. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Invent new matching policy" được nêu ở cơ chế Policy gap versus violation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Unreliable sentiment and confidence**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Policy covers store price match, customer asks competitor match", ưu tiên phân biệt `Policy gap versus violation` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Angry user asks routine tracking question**, nên chọn gì?

- **A.** Pick most recently active account; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Try sentiment scoring first; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Solve routine problem while respecting explicit human choice; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Escalate automatically solely due to negative sentiment; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Ambiguous identity**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Explicit human request**, không giải quyết được yêu cầu cốt lõi "Frustration or model confidence alone do not measure resolvability" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Frustration or model confidence alone do not measure resolvability. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Escalate automatically solely due to negative sentiment" được nêu ở cơ chế Unreliable sentiment and confidence. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Angry user asks routine tracking question", ưu tiên phân biệt `Unreliable sentiment and confidence` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Pick most recently active account**. Đánh giá chính xác nhất là gì?

- **A.** Pick most recently active account; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Try sentiment scoring first; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Invent new matching policy; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Ask for order number or verified identifier; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Pick most recently active account" được nêu ở cơ chế Ambiguous identity. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Explicit human request**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Policy gap versus violation**, không giải quyết được yêu cầu cốt lõi "Several identical-name records require identity disambiguation" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Several identical-name records require identity disambiguation. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Three customer accounts share same name", ưu tiên phân biệt `Ambiguous identity` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **User asks transfer me to a human representative**, tiêu chí pass phù hợp là gì?

- **A.** Escalate immediately with case context; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Try sentiment scoring first; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Invent new matching policy; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Escalate automatically solely due to negative sentiment; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Honor direct request for human immediately. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Try sentiment scoring first" được nêu ở cơ chế Explicit human request. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Policy gap versus violation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Unreliable sentiment and confidence**, không giải quyết được yêu cầu cốt lõi "Honor direct request for human immediately" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "User asks transfer me to a human representative", ưu tiên phân biệt `Explicit human request` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Policy covers store price match, customer asks competitor match**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Pick most recently active account; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Escalate gap to empowered human; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Invent new matching policy; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Escalate automatically solely due to negative sentiment; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Ambiguous identity**, không giải quyết được yêu cầu cốt lõi "Unspecified case needs judgement; documented violation follows rule" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Unspecified case needs judgement; documented violation follows rule. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Invent new matching policy" được nêu ở cơ chế Policy gap versus violation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Unreliable sentiment and confidence**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Policy covers store price match, customer asks competitor match", ưu tiên phân biệt `Policy gap versus violation` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "User asks transfer me to a human representative".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Escalate immediately with case context.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Explicit human request:** Honor direct request for human immediately. ✓ Escalate immediately with case context. ✗ Try sentiment scoring first.
- **Policy gap versus violation:** Unspecified case needs judgement; documented violation follows rule. ✓ Escalate gap to empowered human. ✗ Invent new matching policy.
- **Unreliable sentiment and confidence:** Frustration or model confidence alone do not measure resolvability. ✓ Solve routine problem while respecting explicit human choice. ✗ Escalate automatically solely due to negative sentiment.
- **Ambiguous identity:** Several identical-name records require identity disambiguation. ✓ Ask for order number or verified identifier. ✗ Pick most recently active account.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/5-context-management/5-2-escalation-ambiguity
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
