# 1.7 — Session State and Resumption

> Domain 1: Agentic Architecture & Orchestration · Tỷ trọng toàn domain: 27%
> Source lesson: https://claudecertificationguide.com/learn/1-agentic-architecture/1-7-session-state-resumption
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **Session State and Resumption**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Resume unchanged work

**Principle (EN):** Resume retains prior tool results and analysis when still valid.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **resume retains prior tool results and analysis when still valid**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Developer returns tomorrow with no repository changes.

**Recommended implementation:** Continue named session via --resume.

**Incorrect shortcut / Sai lầm dễ mắc:** Restart and lose valid context.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Developer returns tomorrow with no repository changes".
- Decision: áp dụng nguyên tắc **Resume unchanged work** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Continue named session via --resume" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Fork divergent investigation

**Principle (EN):** Fork from shared baseline isolates alternative hypotheses.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **fork from shared baseline isolates alternative hypotheses**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Need compare caching versus query optimization.

**Recommended implementation:** Create independent forks.

**Incorrect shortcut / Sai lầm dễ mắc:** Interleave both options into single history.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Need compare caching versus query optimization".
- Decision: áp dụng nguyên tắc **Fork divergent investigation** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Create independent forks" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. Stale context remediation

**Principle (EN):** Changed code makes old tool results unreliable.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **changed code makes old tool results unreliable**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Three files changed after an earlier architecture analysis.

**Recommended implementation:** Fresh session + curated summary + targeted reread of changed files.

**Incorrect shortcut / Sai lầm dễ mắc:** Blindly resume with old source excerpts.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Three files changed after an earlier architecture analysis".
- Decision: áp dụng nguyên tắc **Stale context remediation** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Fresh session + curated summary + targeted reread of changed files" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Targeted re-analysis

**Principle (EN):** Recheck changed artifacts, not unrelated codebase.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **recheck changed artifacts, not unrelated codebase**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Only auth.ts changed among 60 modules.

**Recommended implementation:** Reread auth.ts and dependent boundaries with summary of unchanged areas.

**Incorrect shortcut / Sai lầm dễ mắc:** Read all 60 modules again automatically.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Only auth.ts changed among 60 modules".
- Decision: áp dụng nguyên tắc **Targeted re-analysis** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Reread auth.ts and dependent boundaries with summary of unchanged areas" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Developer returns tomorrow with no repository changes.

**Bad design:** Restart and lose valid context.

**Better design:** Continue named session via --resume.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Developer returns tomorrow with no repository changes.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Continue named session via --resume.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Resume unchanged work:** "Restart and lose valid context" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở resume unchanged work, rồi chọn "Continue named session via --resume".

2. **Bẫy Fork divergent investigation:** "Interleave both options into single history" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở fork divergent investigation, rồi chọn "Create independent forks".

3. **Bẫy Stale context remediation:** "Blindly resume with old source excerpts" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở stale context remediation, rồi chọn "Fresh session + curated summary + targeted reread of changed files".

4. **Bẫy Targeted re-analysis:** "Read all 60 modules again automatically" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở targeted re-analysis, rồi chọn "Reread auth.ts and dependent boundaries with summary of unchanged areas".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Developer returns tomorrow with no repository changes**. Phương án nào phù hợp nhất?

- **A.** Continue named session via --resume; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Restart and lose valid context; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Interleave both options into single history; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Blindly resume with old source excerpts; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Resume retains prior tool results and analysis when still valid. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Restart and lose valid context" được nêu ở cơ chế Resume unchanged work. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Fork divergent investigation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Stale context remediation**, không giải quyết được yêu cầu cốt lõi "Resume retains prior tool results and analysis when still valid" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Developer returns tomorrow with no repository changes", ưu tiên phân biệt `Resume unchanged work` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Interleave both options into single history** cho tình huống: Need compare caching versus query optimization. Cần phản biện thế nào?

- **A.** Read all 60 modules again automatically; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Create independent forks; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Interleave both options into single history; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Blindly resume with old source excerpts; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Targeted re-analysis**, không giải quyết được yêu cầu cốt lõi "Fork from shared baseline isolates alternative hypotheses" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Fork from shared baseline isolates alternative hypotheses. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Interleave both options into single history" được nêu ở cơ chế Fork divergent investigation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Stale context remediation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Need compare caching versus query optimization", ưu tiên phân biệt `Fork divergent investigation` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **Three files changed after an earlier architecture analysis** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Read all 60 modules again automatically; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Restart and lose valid context; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Fresh session + curated summary + targeted reread of changed files; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Blindly resume with old source excerpts; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Targeted re-analysis**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Resume unchanged work**, không giải quyết được yêu cầu cốt lõi "Changed code makes old tool results unreliable" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Changed code makes old tool results unreliable. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Blindly resume with old source excerpts" được nêu ở cơ chế Stale context remediation. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Three files changed after an earlier architecture analysis", ưu tiên phân biệt `Stale context remediation` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Only auth.ts changed among 60 modules**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Read all 60 modules again automatically; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Restart and lose valid context; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Interleave both options into single history; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Reread auth.ts and dependent boundaries with summary of unchanged areas; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Read all 60 modules again automatically" được nêu ở cơ chế Targeted re-analysis. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Resume unchanged work**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Fork divergent investigation**, không giải quyết được yêu cầu cốt lõi "Recheck changed artifacts, not unrelated codebase" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Recheck changed artifacts, not unrelated codebase. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Only auth.ts changed among 60 modules", ưu tiên phân biệt `Targeted re-analysis` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Restart and lose valid context**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Continue named session via --resume; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Restart and lose valid context; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Interleave both options into single history; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Blindly resume with old source excerpts; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Resume retains prior tool results and analysis when still valid. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Restart and lose valid context" được nêu ở cơ chế Resume unchanged work. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Fork divergent investigation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Stale context remediation**, không giải quyết được yêu cầu cốt lõi "Resume retains prior tool results and analysis when still valid" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Developer returns tomorrow with no repository changes", ưu tiên phân biệt `Resume unchanged work` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **Need compare caching versus query optimization**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Read all 60 modules again automatically; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Create independent forks; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Interleave both options into single history; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Blindly resume with old source excerpts; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Targeted re-analysis**, không giải quyết được yêu cầu cốt lõi "Fork from shared baseline isolates alternative hypotheses" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Fork from shared baseline isolates alternative hypotheses. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Interleave both options into single history" được nêu ở cơ chế Fork divergent investigation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Stale context remediation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Need compare caching versus query optimization", ưu tiên phân biệt `Fork divergent investigation` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **Three files changed after an earlier architecture analysis**, nên chọn gì?

- **A.** Read all 60 modules again automatically; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Restart and lose valid context; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Fresh session + curated summary + targeted reread of changed files; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Blindly resume with old source excerpts; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Targeted re-analysis**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **Resume unchanged work**, không giải quyết được yêu cầu cốt lõi "Changed code makes old tool results unreliable" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** Changed code makes old tool results unreliable. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Blindly resume with old source excerpts" được nêu ở cơ chế Stale context remediation. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Three files changed after an earlier architecture analysis", ưu tiên phân biệt `Stale context remediation` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Read all 60 modules again automatically**. Đánh giá chính xác nhất là gì?

- **A.** Read all 60 modules again automatically; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Restart and lose valid context; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Interleave both options into single history; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Reread auth.ts and dependent boundaries with summary of unchanged areas; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Read all 60 modules again automatically" được nêu ở cơ chế Targeted re-analysis. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **Resume unchanged work**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Fork divergent investigation**, không giải quyết được yêu cầu cốt lõi "Recheck changed artifacts, not unrelated codebase" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Recheck changed artifacts, not unrelated codebase. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "Only auth.ts changed among 60 modules", ưu tiên phân biệt `Targeted re-analysis` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Developer returns tomorrow with no repository changes**, tiêu chí pass phù hợp là gì?

- **A.** Continue named session via --resume; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Restart and lose valid context; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Interleave both options into single history; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Blindly resume with old source excerpts; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Resume retains prior tool results and analysis when still valid. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Restart and lose valid context" được nêu ở cơ chế Resume unchanged work. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Fork divergent investigation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Stale context remediation**, không giải quyết được yêu cầu cốt lõi "Resume retains prior tool results and analysis when still valid" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "Developer returns tomorrow with no repository changes", ưu tiên phân biệt `Resume unchanged work` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **Need compare caching versus query optimization**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Read all 60 modules again automatically; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Create independent forks; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Interleave both options into single history; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Blindly resume with old source excerpts; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Targeted re-analysis**, không giải quyết được yêu cầu cốt lõi "Fork from shared baseline isolates alternative hypotheses" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Fork from shared baseline isolates alternative hypotheses. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Interleave both options into single history" được nêu ở cơ chế Fork divergent investigation. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Stale context remediation**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Need compare caching versus query optimization", ưu tiên phân biệt `Fork divergent investigation` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Developer returns tomorrow with no repository changes".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Continue named session via --resume.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Resume unchanged work:** Resume retains prior tool results and analysis when still valid. ✓ Continue named session via --resume. ✗ Restart and lose valid context.
- **Fork divergent investigation:** Fork from shared baseline isolates alternative hypotheses. ✓ Create independent forks. ✗ Interleave both options into single history.
- **Stale context remediation:** Changed code makes old tool results unreliable. ✓ Fresh session + curated summary + targeted reread of changed files. ✗ Blindly resume with old source excerpts.
- **Targeted re-analysis:** Recheck changed artifacts, not unrelated codebase. ✓ Reread auth.ts and dependent boundaries with summary of unchanged areas. ✗ Read all 60 modules again automatically.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/1-agentic-architecture/1-7-session-state-resumption
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
