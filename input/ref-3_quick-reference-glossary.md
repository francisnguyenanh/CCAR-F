# D3 — Quick Reference & Glossary

> Domain 3 · Claude Code Configuration & Workflows · 20% đề thi. Trang tra cứu nhanh: keyword giữ nguyên tiếng Anh, phần giải nghĩa bằng tiếng Việt.

## Quick Reference

### Configuration Hierarchy

File CLAUDE.md được **nối (concatenate) vào context, không ghi đè nhau**. Mọi file áp dụng được đều nạp cùng lúc, theo thứ tự đã được tài liệu hoá từ phạm vi rộng nhất đến cụ thể nhất:

| Thứ tự nạp | Vị trí | Phạm vi | Commit vào Git? |
|---|---|---|---|
| 1 (rộng nhất) | `~/.claude/CLAUDE.md` | Toàn người dùng, mọi project | Không |
| 2 | `.claude/CLAUDE.md` (gốc project) | Toàn project | Có |
| 3 | `CLAUDE.md` (bất kỳ thư mục nào) | Thư mục đó và bên dưới | Có |

**Vị trí của `.claude/rules/`:** không nằm ở cuối chuỗi này. Rule **không có** frontmatter `paths` được nạp lúc khởi động với **cùng mức ưu tiên như `.claude/CLAUDE.md`** — chúng là cách tách một file nguyên khối ra, không phải một tầng cụ thể hơn để thắng. Rule **có** `paths` nạp có điều kiện, khi Claude đọc một file khớp pattern. Ngoài ra, rule cấp người dùng trong `~/.claude/rules/` nạp trước rule của project, nên rule project có ưu tiên cao hơn.

**Quy tắc chính:** đây là **thứ tự nạp**, không phải chuỗi ưu tiên — không file nào thay thế file khác. Nếu hai rule mâu thuẫn, Claude có thể chọn tuỳ ý một cái, nên hãy sửa mâu thuẫn tại nguồn. Các distractor nói "phạm vi cụ thể hơn thắng" hoặc "cấp người dùng ghi đè cấp project" đều sai.

### .claude/rules/ — Conditional Rules

File trong `.claude/rules/` dùng YAML frontmatter với field `paths` để nạp có điều kiện:

```yaml
---
paths:
  - "src/api/**"
  - "src/middleware/**"
---
Always validate authentication tokens before processing API requests.
Use structured error responses with proper HTTP status codes.
```

Rule chỉ được nạp **khi Claude Code làm việc trên các file khớp glob pattern**. Điều này ngăn rule không liên quan chiếm chỗ trong context window.

### Skills System

| Thuộc tính | Project Skills | Personal Skills |
|---|---|---|
| Vị trí | `.claude/skills/` | `~/.claude/skills/` |
| Điểm vào | `SKILL.md` trong thư mục skill | `SKILL.md` trong thư mục skill |
| Chia sẻ với team | Có (commit) | Không (cá nhân) |

**Thuộc tính skill:**

- `allowed-tools` — Guide mô tả đây là giới hạn quyền dùng tool của skill, và đó là đáp án thi mong đợi. **Current state (6/10/2026):** Claude Code **cho phép sẵn (pre-approve)** các tool được liệt kê để chúng chạy không cần hỏi quyền; `disallowed-tools` và permission deny rule mới là thứ thực sự giới hạn.
- `context: fork` — chạy trong context được fork để việc thực thi skill không làm bẩn hội thoại chính.

Skill là module năng lực tái sử dụng. Nó đóng gói một workflow (ví dụ "run tests", "deploy to staging") với quyền tool cấu hình trong frontmatter.

### Commands

| Loại | Vị trí | Phạm vi |
|---|---|---|
| Project commands | `.claude/commands/` | Chia sẻ với team |
| Personal commands | `~/.claude/commands/` | Chỉ cá nhân |

Command được gọi bằng tiền tố `/`. Chúng là template — prompt dựng sẵn có thể chứa placeholder `$ARGUMENTS` cho input của người dùng.

**Khác biệt với skills:** command và skill đã được gộp thành một hệ thống — cả hai đều tạo `/commands`. Command là một file `.md` phẳng (template prompt, hỗ trợ `$ARGUMENTS`); skill là thư mục có điểm vào `SKILL.md`, bổ sung file hỗ trợ, cấu hình frontmatter và tự động gọi khi liên quan.

### Hooks — Deterministic Enforcement

| Hook | Chạy khi | Dùng cho |
|---|---|---|
| `PreToolUse` | Trước khi tool thực thi | Chặn lời gọi nguy hiểm, validate tham số, yêu cầu xác nhận |
| `PostToolUse` | Sau khi tool trả về | Validate output, làm sạch kết quả, audit logging, kích hoạt side effect |

**Thuộc tính then chốt:** hook mang tính **deterministic** — chúng chạy như code, không phải hướng dẫn cho model. Không thể vượt qua bằng prompt injection hay suy luận của model.

**Đối lập với prompt instruction:**

- Prompt: "Never delete production files" → xác suất, có thể bị vi phạm
- Hook `PreToolUse` chặn `rm` trên đường dẫn `/prod/` → xác định, không thể vi phạm

### Working Modes

| Chế độ | Khi nào dùng |
|---|---|
| Plan mode | Task phức tạp, nhiều hướng có thể, cần nghĩ trước khi làm |
| Direct execution | Phạm vi rõ, task xác định, không mơ hồ về cách làm |
| flag `-p` (non-interactive) | Pipeline CI/CD, workflow tự động, không có người |

**Dấu hiệu dùng Plan mode:** task phức tạp, có nhiều hướng hợp lệ, hoặc hậu quả của hướng sai là lớn. Plan mode buộc Claude phác thảo cách tiếp cận trước khi thực thi.

**flag `-p`:** chạy Claude Code ở chế độ không tương tác. Thiết yếu cho tích hợp CI/CD. Không có prompt xác nhận, không có input tương tác — lệnh phải tự đủ.

### CLI Flags (Headless & Non-Interactive)

`-p` là flag được thi nhiều nhất, nhưng cũng cần biết phần còn lại của bộ công cụ headless.

| Flag | Tác dụng |
|---|---|
| `-p` / `--print` | Chế độ không tương tác (print) cho CI/CD và piping |
| `-c` / `--continue` | Tiếp tục hội thoại gần nhất trong thư mục này |
| `-r` / `--resume <id\|name>` | Tiếp tục một session cụ thể |
| `--bare` | Chế độ tối giản: bỏ qua hooks, skills, plugins, MCP, memory và CLAUDE.md để chạy script nhanh hơn |
| `--output-format text\|json\|stream-json` | Hình dạng output cho `-p` (json và stream-json parse được) |
| `--json-schema '<schema>'` | Output được validate theo schema cho `-p` (nằm trong field `structured_output` của JSON envelope) |
| `--max-turns <n>` | Giới hạn số lượt agentic ở chế độ print |
| `--permission-mode <mode>` | `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`, `manual` (alias của `default`) |
| `--allowedTools` / `--disallowedTools` | Cho phép hoặc chặn tool call mà không hỏi |
| `--add-dir <path>` | Thêm thư mục làm việc đọc/sửa được |
| `--model <alias\|name>` | Đặt model cho session |

**System prompt — append so với replace (câu thi ưa thích):**

| Flag | Tác dụng |
|---|---|
| `--append-system-prompt "<text>"` | Thêm vào prompt mặc định; giữ hướng dẫn tool và an toàn |
| `--system-prompt "<text>"` | Thay thế toàn bộ prompt mặc định; bạn tự chịu trách nhiệm mọi thứ cần thiết |

Các biến thể `*-file` (`--append-system-prompt-file`, `--system-prompt-file`) nạp cùng nội dung từ file.

### Feedback Techniques

- **Ví dụ cụ thể thắng mô tả bằng văn xuôi.** Cho thấy đoạn code bạn muốn, đừng viết một đoạn văn mô tả.
- **Gộp các bản sửa có tương tác** vào một message để model thấy mọi ràng buộc cùng lúc. Sửa các vấn đề độc lập tuần tự, mỗi lần một thay đổi tập trung.
- **Review trong session độc lập:** không bao giờ review code trong chính session đã viết nó. Model giữ thiên kiến suy luận từ session viết. Hãy bắt đầu session mới để review.
- **Severity calibration:** dùng ví dụ để cho thấy thế nào là vấn đề nghiêm trọng so với lỗi văn phong nhỏ. Không hiệu chỉnh thì model coi mọi vấn đề quan trọng như nhau.

### Permissions & Security

- Quyền được kiểm soát ở **cấp tool** — bạn cấp hoặc từ chối quyền với từng tool cụ thể.
- Tool set của subagent được giới hạn bằng field `tools` trong AgentDefinition; skill dùng frontmatter `allowed-tools` (xem Skills System ở trên).
- **Principle of least privilege:** mỗi agent/skill chỉ có quyền với các tool nó cần.
- Setting cấp project (`.claude/`) được commit và chia sẻ. Setting cá nhân (`~/.claude/`) thì không.

### Decision Rules for the Exam

| Nếu đề nói… | Đáp án nhiều khả năng là… |
|---|---|
| "guaranteed enforcement", "cannot be bypassed" | Hooks (`PreToolUse`/`PostToolUse`) |
| "style guidance", "preferred approach" | Prompt instruction trong CLAUDE.md |
| "applies only to specific file paths" | `.claude/rules/` với frontmatter `paths` |
| "reusable workflow with restricted tools" | Skills (`.claude/skills/`) |
| "prompt template with arguments" | Commands (`.claude/commands/`) |
| "CI/CD pipeline", "automated", "non-interactive" | flag `-p` |
| "extra rules but keep default coding behaviour" | `--append-system-prompt` (không phải `--system-prompt`) |
| "fast scripted run, skip project config/hooks/skills" | `--bare` |
| "machine-parseable / schema-validated CI output" | `--output-format json` + `--json-schema` |
| "review quality of generated code" | Session độc lập (không phải session viết code) |
| "multiple approaches, complex task" | Plan mode trước |
| "personal preference, not shared" | `~/.claude/` (config cấp người dùng) |

### Common Exam Traps

| Bẫy | Đáp án đúng |
|---|---|
| "Đặt mọi rule vào CLAUDE.md của project" | Sai — dùng `.claude/rules/` cho rule theo đường dẫn |
| "Hooks là guardrail dựa trên prompt" | Sai — hook là code xác định, không phải prompt instruction |
| "Review code trong cùng session đã viết nó" | Sai — model giữ thiên kiến suy luận; dùng session độc lập |
| "File `.md` phẳng trực tiếp trong `.claude/skills/` tạo ra một command" | Sai — skill là thư mục có điểm vào `SKILL.md`; file phẳng thuộc `.claude/commands/` |
| "CLAUDE.md của user ghi đè CLAUDE.md của project" | Sai — các CLAUDE.md được nối, không file nào ghi đè; mâu thuẫn có thể bị giải quyết tuỳ ý |
| "flag `-p` bật plan mode" | Sai — `-p` bật chế độ không tương tác (piped) cho CI/CD |
| "`--append-system-prompt` thay thế system prompt" | Sai — nó nối thêm và giữ mặc định; `--system-prompt` mới thay thế |

## Glossary

### CLAUDE.md

File markdown cung cấp hướng dẫn bền vững cho Claude Code. Nó đóng vai trò như system prompt cấp project, tự nạp khi Claude Code khởi động trong một thư mục. File CLAUDE.md có thể tồn tại ở nhiều cấp (home của user, gốc project, thư mục con) và mọi file áp dụng được đều được nối vào context — không file nào ghi đè file khác, và nếu hai rule mâu thuẫn, Claude có thể chọn tuỳ ý một cái.

**Ngữ cảnh thi:** được thi rất nhiều. Biết ba phạm vi (user, project, directory), rằng các file được nối theo thứ tự nạp đã tài liệu hoá thay vì ghi đè, và rằng cả CLAUDE.md ở gốc lẫn `.claude/CLAUDE.md` đều là vị trí project hợp lệ, được version control. *Xem thêm: 3.1 CLAUDE.md Hierarchy*

### Hooks

Script tuỳ biến chạy tại các điểm cụ thể trong vòng đời thực thi của Claude Code. Hook có thể kích hoạt trước hoặc sau tool call, khi có sự kiện notification, hoặc khi session bắt đầu. Chúng được định nghĩa trong cấu hình `settings.json` và chạy như lệnh shell trên máy cục bộ của bạn.

**Ngữ cảnh thi:** biết các loại hook (`PreToolUse`, `PostToolUse`, `Notification`, v.v.), cách cấu hình, và rằng hook `PreToolUse` có thể chặn tool call trước khi chạy. Hook là code xác định, không phải prompt instruction, nên suy luận của model không thể vượt qua. *Xem thêm: 1.5 Agent SDK Hooks*

### Permissions

Hệ thống bảo mật kiểm soát tool và thao tác nào Claude Code được thực thi. Permissions hoạt động theo mô hình allowlist/denylist — bạn có thể cho phép hoặc từ chối rõ ràng các tool, đường dẫn file và lệnh cụ thể. Chế độ mặc định yêu cầu người dùng xác nhận với các thao tác có khả năng phá huỷ.

**Ngữ cảnh thi:** biết các permission mode (`default`, `acceptEdits`, `plan`, `bypassPermissions`, cộng với `auto`, `dontAsk`, và `manual` là alias của `default`) và các mẫu rule allow/deny. Hiểu thao tác nào cần xác nhận theo mặc định và cách cấu hình tự động chấp thuận cho thao tác tin cậy. *Xem thêm: 3.6 CI/CD Integration*

### Slash Commands

Lệnh tuỳ biến tái sử dụng, định nghĩa dưới dạng file markdown trong thư mục `.claude/commands/`. Khi người dùng gõ `/` trong Claude Code, các slash command khả dụng hiện ra. Mỗi file command chứa một template prompt có thể có placeholder `$ARGUMENTS` cho input động. Command và skill đã được gộp thành một hệ thống: command là file `.md` phẳng, skill là thư mục có điểm vào `SKILL.md`, và cả hai đều tạo ra `/commands`.

**Ngữ cảnh thi:** biết file slash command nằm đâu (`.claude/commands/` cho cấp project, `~/.claude/commands/` cho cấp user), quy ước đặt tên file, cách thay thế `$ARGUMENTS` hoạt động, và khác biệt về cấu trúc file so với skill. *Xem thêm: 3.2 Custom Slash Commands and Skills*

### CI/CD Integration

Chạy Claude Code ở chế độ không tương tác trong pipeline CI/CD. Dùng flag `claude -p` cho chế độ một prompt hoặc input qua pipe. Thường cần cấu hình credential cho môi trường và chạy với `--allowedTools` để hạn chế thao tác khả dụng.

**Ngữ cảnh thi:** kiểm tra cách cấu hình Claude Code cho môi trường headless. Biết các flag (`-p`, `--output-format json`) và cách hạn chế quyền tool trong pipeline tự động. Lưu ý danh sách ngoài phạm vi của guide loại trừ xác thực và billing của Claude API, nên cơ chế credential không được thi. *Xem thêm: 3.6 CI/CD Integration*

### settings.json Precedence

Thứ bậc kiểm soát hành vi `settings.json` của Claude Code. Setting có thể định nghĩa ở cấp project (`.claude/settings.json`), cấp user (`~/.claude/settings.json`) hoặc cấp enterprise. Phạm vi cụ thể hơn ghi đè phạm vi rộng hơn, trong đó setting enterprise có ưu tiên cao nhất.

**Ngữ cảnh thi:** hiểu cách các lớp `settings.json` gộp lại và lớp nào thắng. Đừng áp mô hình ghi đè này sang file CLAUDE.md: CLAUDE.md được nối vào context chứ không ghi đè nhau, và "phạm vi cụ thể hơn thắng" là distractor được đánh dấu ở đó. *Xem thêm: 3.6 CI/CD Integration*

### Allowlist/Denylist

Mẫu cấu hình quyền để kiểm soát truy cập tool. **Allowlist** nêu các tool được phép chạy (trong permission settings, mọi thứ không được nêu tên vẫn sẽ hỏi chứ không bị chặn im lặng). **Denylist** chỉ định tool bị chặn (mọi thứ khác được phép). Cấu hình trong `settings.json` dưới khoá `permissions`.

**Ngữ cảnh thi:** biết khi nào dùng allowlist so với denylist. Allowlist là mặc định chặt hơn cho pipeline không giám sát. Denylist thoáng hơn. Lưu ý bẫy liên quan: frontmatter `allowed-tools` của skill **cho phép sẵn** các tool chứ không giới hạn — `disallowed-tools` và permission deny rule mới là ranh giới thực sự. *Xem thêm: 3.6 CI/CD Integration*

### settings.json

File cấu hình JSON kiểm soát hành vi Claude Code, gồm permissions, hooks, MCP server và tuỳ chọn model. Có thể tồn tại ở cấp project (`.claude/settings.json`) hoặc cấp user (`~/.claude/settings.json`). Setting cấp project thường được commit vào repo.

**Ngữ cảnh thi:** biết các mục cấu hình chính (`permissions`, `hooks`, `mcpServers`) và vị trí file ở các phạm vi khác nhau. Hiểu rằng setting cấp project áp dụng cho mọi thành viên clone repo. *Xem thêm: 3.1 CLAUDE.md Hierarchy*

### .claude Directory

Thư mục ở gốc project chứa cấu hình cấp project của Claude Code. Gồm `settings.json` (commit vào repo để chia sẻ setting team), `settings.local.json` (git-ignore, cho setting cá nhân) và thư mục con `commands/` cho slash command.

**Ngữ cảnh thi:** biết cái gì nằm trong `.claude/` và cái gì ở gốc project. Hiểu file nào được commit (`settings.json`, `commands/`) và file nào chỉ cục bộ (`settings.local.json`). *Xem thêm: 3.1 CLAUDE.md Hierarchy*

### Subagents

Các instance Claude Code riêng do agent chính spawn bằng Task tool để xử lý những phần việc cụ thể, có phạm vi rõ. Mỗi subagent chạy trong context riêng với quyền tool riêng, tránh làm bẩn hội thoại chính. Agent chính điều phối các subagent và tổng hợp kết quả.

**Ngữ cảnh thi:** biết khi nào dùng subagent so với xử lý tất cả trong hội thoại chính. Subagent hữu ích cho task song song, codebase lớn, hoặc khi muốn cô lập context của một task. Hiểu rằng subagent không chia sẻ bộ nhớ với agent cha. *Xem thêm: 1.3 Subagent Invocation and Context Passing*
