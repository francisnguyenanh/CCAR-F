# 3.1 — CLAUDE.md Hierarchy, Scoping, and Modular Organisation

> Domain 3: Claude Code Configuration & Workflows · Tỷ trọng toàn domain: 20%
> Source lesson: https://claudecertificationguide.com/learn/3-claude-code-config/3-1-claude-md-hierarchy
> Ngôn ngữ: giải thích tiếng Việt, thuật ngữ và mini-case tiếng Anh.
> Tài liệu học tập diễn giải độc lập; không phải bản sao nguyên văn và không chứa câu hỏi thi thật.

## 1. Learning outcomes / Mục tiêu

Sau bài này bạn phải phân biệt được các cơ chế cốt lõi của **CLAUDE.md Hierarchy, Scoping, and Modular Organisation**, chọn đúng thiết kế trước tình huống thực tế, và giải thích được tại sao các đáp án gây nhiễu sai.

## 2. Lý thuyết kỹ thuật từ bài học nguồn

### 2.1. Personal and project guidance

**Principle (EN):** ~/.claude/CLAUDE.md personal; root or .claude/CLAUDE.md shared.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **~/.claude/CLAUDE.md personal; root or .claude/CLAUDE.md shared**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Team wants standard unit test conventions.

**Recommended implementation:** Commit project CLAUDE.md.

**Incorrect shortcut / Sai lầm dễ mắc:** Put conventions only in personal home file.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Team wants standard unit test conventions".
- Decision: áp dụng nguyên tắc **Personal and project guidance** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Commit project CLAUDE.md" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.2. Directory-specific guidance

**Principle (EN):** Nested CLAUDE.md applies to relevant subtree.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **nested CLAUDE.md applies to relevant subtree**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** API module needs different error practices from frontend.

**Recommended implementation:** Use package-local CLAUDE.md.

**Incorrect shortcut / Sai lầm dễ mắc:** Repeat API rules globally for all packages.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "API module needs different error practices from frontend".
- Decision: áp dụng nguyên tắc **Directory-specific guidance** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Use package-local CLAUDE.md" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.3. No guaranteed precedence

**Principle (EN):** Loaded instruction files concatenate; conflicting rules are not deterministic overrides.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **loaded instruction files concatenate; conflicting rules are not deterministic overrides**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** User and repo CLAUDE.md disagree on required process.

**Recommended implementation:** Resolve contradiction or enforce invariant via settings/hook.

**Incorrect shortcut / Sai lầm dễ mắc:** Assume most-specific file deterministically wins.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "User and repo CLAUDE.md disagree on required process".
- Decision: áp dụng nguyên tắc **No guaranteed precedence** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Resolve contradiction or enforce invariant via settings/hook" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

### 2.4. Modular @path imports

**Principle (EN):** Split reusable project standards across imported Markdown files.

**Giải thích (VI):** Điểm quan trọng là xác định đúng *lớp chịu trách nhiệm* và *ranh giới bảo đảm*. Trong tình huống này, **split reusable project standards across imported Markdown files**. Vì thế không nên giải quyết bằng cách phỏng đoán hành vi của mô hình hoặc tăng prompt một cách chung chung. Cần thiết kế hợp đồng dữ liệu, điều kiện đầu vào/đầu ra và điểm kiểm tra có thể quan sát được.

**Case study / Tình huống:** Root CLAUDE.md grows to hundreds of lines.

**Recommended implementation:** Reference focused standards using @./path.md.

**Incorrect shortcut / Sai lầm dễ mắc:** Use fictional @import keyword.

**Technical checklist:**
- Input: xác định nguồn thông tin và điều kiện tiền đề của tình huống "Root CLAUDE.md grows to hundreds of lines".
- Decision: áp dụng nguyên tắc **Modular @path imports** thay vì chỉ dựa vào câu trả lời tự nhiên của model.
- Output: kiểm tra đã thực hiện được hành động "Reference focused standards using @./path.md" với evidence hoặc log phù hợp.
- Failure path: nếu điều kiện chưa đạt, báo trạng thái chưa hoàn thành, không âm thầm coi là thành công.

## 3. Ví dụ thiết kế / Worked engineering example

**Problem:** Team wants standard unit test conventions.

**Bad design:** Put conventions only in personal home file.

**Better design:** Commit project CLAUDE.md.

**Implementation steps:**
1. Định nghĩa trước trạng thái đầu vào và dữ liệu tin cậy.
2. Đặt ranh giới giữa quyết định của LLM và validation/business logic của code.
3. Ghi rõ action, result, evidence và các nhánh lỗi.
4. Kiểm thử cả happy path, sai định dạng, thiếu dữ liệu và trường hợp sai quyền.

### Walkthrough: decision trace / Luồng xử lý

```text
INPUT  : Team wants standard unit test conventions.
CHECK  : Xác định nguyên nhân gốc và dữ liệu cần thiết
DESIGN : Commit project CLAUDE.md.
VERIFY : Tạo một kiểm thử thể hiện lỗi cũ không còn xảy ra
RECORD : Lưu quyết định, kết quả và trạng thái còn bất định
```

**Tại sao cách này đúng:** Phương án thiết kế phải tác động vào cơ chế gây lỗi, chứ không chỉ đổi cách model diễn đạt. Hãy viết một acceptance test có thể phân biệt rõ kết quả khi dùng phương án sai và phương án được khuyến nghị.

## 4. Exam traps / Bẫy dễ nhầm

1. **Bẫy Personal and project guidance:** "Put conventions only in personal home file" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở personal and project guidance, rồi chọn "Commit project CLAUDE.md".

2. **Bẫy Directory-specific guidance:** "Repeat API rules globally for all packages" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở directory-specific guidance, rồi chọn "Use package-local CLAUDE.md".

3. **Bẫy No guaranteed precedence:** "Assume most-specific file deterministically wins" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở no guaranteed precedence, rồi chọn "Resolve contradiction or enforce invariant via settings/hook".

4. **Bẫy Modular @path imports:** "Use fictional @import keyword" nghe có vẻ nhanh nhưng không xử lý đúng điều kiện của bài. Khi đọc đề, xác định thông tin nào chứng minh nguyên nhân nằm ở modular @path imports, rồi chọn "Reference focused standards using @./path.md".

## 5. Practice exam — 10 câu tình huống tự biên soạn

Mỗi câu chọn **một** đáp án tốt nhất. Câu hỏi và giải thích là nội dung luyện tập được soạn mới từ khái niệm bài học, không sao chép câu hỏi trên website.

### Q01. Nhóm triển khai cần chọn cách khắc phục đáng tin cậy nhất cho sự cố sau: **Team wants standard unit test conventions**. Phương án nào phù hợp nhất?

- **A.** Repeat API rules globally for all packages; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Assume most-specific file deterministically wins; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Commit project CLAUDE.md; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Put conventions only in personal home file; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Directory-specific guidance**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **No guaranteed precedence**, không giải quyết được yêu cầu cốt lõi "~/.claude/CLAUDE.md personal; root or .claude/CLAUDE.md shared" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** ~/.claude/CLAUDE.md personal; root or .claude/CLAUDE.md shared. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Put conventions only in personal home file" được nêu ở cơ chế Personal and project guidance. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Team wants standard unit test conventions", ưu tiên phân biệt `Personal and project guidance` với các lựa chọn mô tả chuyện khác.

### Q02. Một kỹ sư đề xuất **Repeat API rules globally for all packages** cho tình huống: API module needs different error practices from frontend. Cần phản biện thế nào?

- **A.** Repeat API rules globally for all packages; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Assume most-specific file deterministically wins; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Use fictional @import keyword; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Use package-local CLAUDE.md; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Repeat API rules globally for all packages" được nêu ở cơ chế Directory-specific guidance. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **No guaranteed precedence**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Modular @path imports**, không giải quyết được yêu cầu cốt lõi "Nested CLAUDE.md applies to relevant subtree" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Nested CLAUDE.md applies to relevant subtree. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "API module needs different error practices from frontend", ưu tiên phân biệt `Directory-specific guidance` với các lựa chọn mô tả chuyện khác.

### Q03. Nếu sự cố **User and repo CLAUDE.md disagree on required process** xảy ra ngay trước khi release, quyết định kỹ thuật nào nên ưu tiên?

- **A.** Resolve contradiction or enforce invariant via settings/hook; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Assume most-specific file deterministically wins; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Use fictional @import keyword; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Put conventions only in personal home file; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Loaded instruction files concatenate; conflicting rules are not deterministic overrides. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Assume most-specific file deterministically wins" được nêu ở cơ chế No guaranteed precedence. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Modular @path imports**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Personal and project guidance**, không giải quyết được yêu cầu cốt lõi "Loaded instruction files concatenate; conflicting rules are not deterministic overrides" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "User and repo CLAUDE.md disagree on required process", ưu tiên phân biệt `No guaranteed precedence` với các lựa chọn mô tả chuyện khác.

### Q04. Để viết acceptance criteria cho tình huống **Root CLAUDE.md grows to hundreds of lines**, lựa chọn nào thể hiện ranh giới đúng?

- **A.** Repeat API rules globally for all packages; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Reference focused standards using @./path.md; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Use fictional @import keyword; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Put conventions only in personal home file; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Directory-specific guidance**, không giải quyết được yêu cầu cốt lõi "Split reusable project standards across imported Markdown files" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Split reusable project standards across imported Markdown files. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Use fictional @import keyword" được nêu ở cơ chế Modular @path imports. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Personal and project guidance**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Root CLAUDE.md grows to hundreds of lines", ưu tiên phân biệt `Modular @path imports` với các lựa chọn mô tả chuyện khác.

### Q05. Nhóm đang sửa lỗi bằng cách **Put conventions only in personal home file**. Giải pháp thay thế nào xử lý nguyên nhân gốc?

- **A.** Repeat API rules globally for all packages; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Assume most-specific file deterministically wins; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Commit project CLAUDE.md; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Put conventions only in personal home file; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Directory-specific guidance**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **No guaranteed precedence**, không giải quyết được yêu cầu cốt lõi "~/.claude/CLAUDE.md personal; root or .claude/CLAUDE.md shared" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** ~/.claude/CLAUDE.md personal; root or .claude/CLAUDE.md shared. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Put conventions only in personal home file" được nêu ở cơ chế Personal and project guidance. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Team wants standard unit test conventions", ưu tiên phân biệt `Personal and project guidance` với các lựa chọn mô tả chuyện khác.

### Q06. Sau khi audit phát hiện **API module needs different error practices from frontend**, điều gì là cải tiến có thể kiểm chứng?

- **A.** Repeat API rules globally for all packages; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Assume most-specific file deterministically wins; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Use fictional @import keyword; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Use package-local CLAUDE.md; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Repeat API rules globally for all packages" được nêu ở cơ chế Directory-specific guidance. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **No guaranteed precedence**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Modular @path imports**, không giải quyết được yêu cầu cốt lõi "Nested CLAUDE.md applies to relevant subtree" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Nested CLAUDE.md applies to relevant subtree. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "API module needs different error practices from frontend", ưu tiên phân biệt `Directory-specific guidance` với các lựa chọn mô tả chuyện khác.

### Q07. Nếu chỉ được thay đổi một lớp của hệ thống liên quan đến **User and repo CLAUDE.md disagree on required process**, nên chọn gì?

- **A.** Resolve contradiction or enforce invariant via settings/hook; kèm kiểm thử lại điều kiện và ghi evidence.
- **B.** Assume most-specific file deterministically wins; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **C.** Use fictional @import keyword; áp dụng trực tiếp dù cơ chế sự cố khác.
- **D.** Put conventions only in personal home file; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.

**Đáp án: A**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Đúng.** Loaded instruction files concatenate; conflicting rules are not deterministic overrides. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **B:** **Sai.** Đây chính là bẫy "Assume most-specific file deterministically wins" được nêu ở cơ chế No guaranteed precedence. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **C:** **Sai.** Phương án thuộc cơ chế **Modular @path imports**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **D:** **Sai.** Phương án thuộc **Personal and project guidance**, không giải quyết được yêu cầu cốt lõi "Loaded instruction files concatenate; conflicting rules are not deterministic overrides" và thiếu điều kiện kiểm chứng.

**Exam heuristic:** Nếu đề xuất hiện "User and repo CLAUDE.md disagree on required process", ưu tiên phân biệt `No guaranteed precedence` với các lựa chọn mô tả chuyện khác.

### Q08. Một reviewer nêu giải pháp **Use fictional @import keyword**. Đánh giá chính xác nhất là gì?

- **A.** Repeat API rules globally for all packages; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **B.** Reference focused standards using @./path.md; kèm kiểm thử lại điều kiện và ghi evidence.
- **C.** Use fictional @import keyword; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **D.** Put conventions only in personal home file; áp dụng trực tiếp dù cơ chế sự cố khác.

**Đáp án: B**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc **Directory-specific guidance**, không giải quyết được yêu cầu cốt lõi "Split reusable project standards across imported Markdown files" và thiếu điều kiện kiểm chứng.
- **B:** **Đúng.** Split reusable project standards across imported Markdown files. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **C:** **Sai.** Đây chính là bẫy "Use fictional @import keyword" được nêu ở cơ chế Modular @path imports. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **D:** **Sai.** Phương án thuộc cơ chế **Personal and project guidance**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.

**Exam heuristic:** Nếu đề xuất hiện "Root CLAUDE.md grows to hundreds of lines", ưu tiên phân biệt `Modular @path imports` với các lựa chọn mô tả chuyện khác.

### Q09. Trong thử nghiệm đối chứng với tình huống **Team wants standard unit test conventions**, tiêu chí pass phù hợp là gì?

- **A.** Repeat API rules globally for all packages; áp dụng trực tiếp dù cơ chế sự cố khác.
- **B.** Assume most-specific file deterministically wins; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **C.** Commit project CLAUDE.md; kèm kiểm thử lại điều kiện và ghi evidence.
- **D.** Put conventions only in personal home file; kỳ vọng mô hình tự hiểu và sửa vấn đề.

**Đáp án: C**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Phương án thuộc cơ chế **Directory-specific guidance**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **B:** **Sai.** Phương án thuộc **No guaranteed precedence**, không giải quyết được yêu cầu cốt lõi "~/.claude/CLAUDE.md personal; root or .claude/CLAUDE.md shared" và thiếu điều kiện kiểm chứng.
- **C:** **Đúng.** ~/.claude/CLAUDE.md personal; root or .claude/CLAUDE.md shared. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.
- **D:** **Sai.** Đây chính là bẫy "Put conventions only in personal home file" được nêu ở cơ chế Personal and project guidance. Không đảm bảo xử lý được case và dễ che mất failure mode.

**Exam heuristic:** Nếu đề xuất hiện "Team wants standard unit test conventions", ưu tiên phân biệt `Personal and project guidance` với các lựa chọn mô tả chuyện khác.

### Q10. Để giảm lỗi tái diễn với **API module needs different error practices from frontend**, biện pháp nào phù hợp với cơ chế đã học?

- **A.** Repeat API rules globally for all packages; kỳ vọng mô hình tự hiểu và sửa vấn đề.
- **B.** Assume most-specific file deterministically wins; áp dụng trực tiếp dù cơ chế sự cố khác.
- **C.** Use fictional @import keyword; bỏ qua nguyên nhân gốc vì có vẻ nhanh hơn.
- **D.** Use package-local CLAUDE.md; kèm kiểm thử lại điều kiện và ghi evidence.

**Đáp án: D**

**Giải thích từng lựa chọn / Option-by-option reasoning:**

- **A:** **Sai.** Đây chính là bẫy "Repeat API rules globally for all packages" được nêu ở cơ chế Directory-specific guidance. Không đảm bảo xử lý được case và dễ che mất failure mode.
- **B:** **Sai.** Phương án thuộc cơ chế **No guaranteed precedence**. Nó có thể hợp lý trong ngữ cảnh khác nhưng chưa xử lý lỗi của case đang hỏi.
- **C:** **Sai.** Phương án thuộc **Modular @path imports**, không giải quyết được yêu cầu cốt lõi "Nested CLAUDE.md applies to relevant subtree" và thiếu điều kiện kiểm chứng.
- **D:** **Đúng.** Nested CLAUDE.md applies to relevant subtree. Đây là hành động tác động trực tiếp lên nguyên nhân trong case, đồng thời tạo điểm kiểm chứng được.

**Exam heuristic:** Nếu đề xuất hiện "API module needs different error practices from frontend", ưu tiên phân biệt `Directory-specific guidance` với các lựa chọn mô tả chuyện khác.

## 6. Lab / Bài thực hành tự kiểm tra

**Bài tập:** Dựng một mô phỏng nhỏ cho tình huống "Team wants standard unit test conventions".

1. Viết test tái hiện thiết kế sai và lưu log trước khi sửa.
2. Áp dụng: Commit project CLAUDE.md.
3. Lập 3 test: thành công, thiếu dữ liệu, lỗi quyền/trạng thái.
4. Ghi ngắn gọn decision record: tại sao giải pháp sai không phù hợp.

## 7. Cheat sheet / Ôn nhanh

- **Personal and project guidance:** ~/.claude/CLAUDE.md personal; root or .claude/CLAUDE.md shared. ✓ Commit project CLAUDE.md. ✗ Put conventions only in personal home file.
- **Directory-specific guidance:** Nested CLAUDE.md applies to relevant subtree. ✓ Use package-local CLAUDE.md. ✗ Repeat API rules globally for all packages.
- **No guaranteed precedence:** Loaded instruction files concatenate; conflicting rules are not deterministic overrides. ✓ Resolve contradiction or enforce invariant via settings/hook. ✗ Assume most-specific file deterministically wins.
- **Modular @path imports:** Split reusable project standards across imported Markdown files. ✓ Reference focused standards using @./path.md. ✗ Use fictional @import keyword.

## 8. Provenance & phạm vi

- **Nguồn bài học:** https://claudecertificationguide.com/learn/3-claude-code-config/3-1-claude-md-hierarchy
- **Đối chiếu:** Các chủ điểm, ví dụ loại sự cố và exam-trap được đối chiếu với bài học nguồn đã truy cập qua web; toàn bộ phần hỏi đáp 10 câu và cách diễn giải là nội dung mới.
- **Giới hạn:** Trang ôn thi bên thứ ba có thể đơn giản hóa so với sản phẩm hiện hành; khi triển khai production cần kiểm chứng lại API/hook bằng tài liệu chính thức của Anthropic.
