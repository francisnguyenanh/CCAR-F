# 3.2 — Custom Slash Commands and Skills

## Tổng quan

**Slash command** là lệnh bắt đầu bằng `/` (ví dụ `/review`, `/deploy-check`) để chạy lại một quy trình làm việc đã được đóng gói sẵn, thay vì gõ lại prompt dài mỗi lần. **Skill** là dạng đóng gói mới và đầy đủ hơn: một thư mục chứa `SKILL.md` cùng file hỗ trợ (template, script, checklist). Claude có thể tự kích hoạt skill khi mô tả khớp yêu cầu, hoặc bạn gọi trực tiếp bằng `/tên-skill`.

Đề thi xoay quanh bốn câu hỏi: workflow dùng chung phải đặt ở đâu để cả team có, làm sao để workflow nhiều output không làm "ngập" cuộc trò chuyện chính, `allowed-tools` thực sự làm gì, và làm sao Claude biết khi nào nên dùng skill. Quy tắc nhớ nhanh: **workflow của team → `.claude/skills/<tên>/SKILL.md` được commit; output dài dòng → `context: fork`; `allowed-tools` chỉ là tiền phê duyệt, không phải danh sách cấm; `description` rõ ràng quyết định việc tự khớp.**

## K1. Vị trí skill và command: `.claude/skills/` là chuẩn

### Trọng tâm

Skill nằm tại `.claude/skills/<tên>/SKILL.md` (trong repo để chia sẻ, hoặc `~/.claude/skills/` cho cá nhân). File `.claude/commands/<tên>.md` là dạng cũ, vẫn chạy được như alias của lệnh. Workflow cần chia sẻ cho team phải nằm trong repo và được commit.

### Giải thích

Có hai nơi lưu và hai phạm vi:

| Vị trí | Phạm vi |
|---|---|
| `.claude/skills/<tên>/SKILL.md` (trong repo) | Cả team, qua git |
| `~/.claude/skills/<tên>/SKILL.md` | Chỉ bạn, mọi dự án |
| `.claude/commands/<tên>.md` | Dạng cũ, vẫn dùng được; một file = một lệnh |
| `~/.claude/commands/<tên>.md` | Cá nhân, dạng cũ |

Skill hơn command ở chỗ nó là **một thư mục**: ngoài `SKILL.md` (có frontmatter và hướng dẫn) còn chứa được file đi kèm như template báo cáo, script kiểm tra, danh sách tiêu chí. Ví dụ:

```
.claude/skills/review/
├── SKILL.md            # frontmatter + các bước review
├── checklist.md        # tiêu chí review của team
└── scripts/lint.sh     # script hỗ trợ
```

`SKILL.md` mở đầu bằng frontmatter YAML, tối thiểu có `name` và `description`; phần thân là hướng dẫn Claude làm theo. Có thể truyền tham số bằng `$ARGUMENTS` trong nội dung khi gọi `/review src/auth`.

Vì sao vị trí quan trọng: một workflow chỉ nằm ở `~/.claude/` thì đồng đội không có nó; workflow trong repo thì ai clone cũng dùng được, được review qua PR và có version. Với tình huống "team cần lệnh `/review` có file hỗ trợ" đáp án chuẩn là skill trong `.claude/skills/` được commit. Command dạng `commands/<tên>.md` vẫn hợp lệ cho prompt một file đơn giản, nhưng đề thi coi skill là đường dẫn chính.

### Keyword

- `SKILL.md` — file định nghĩa skill: frontmatter cùng hướng dẫn
- `.claude/skills/` — thư mục skill cấp project, commit để chia sẻ
- `~/.claude/skills/` — thư mục skill cá nhân, chỉ máy bạn
- `.claude/commands/` — nơi lưu slash command dạng cũ (một file Markdown một lệnh)
- `$ARGUMENTS` — chỗ giữ phần tham số người dùng gõ sau tên lệnh
- `supporting files` — file đi kèm skill (template, script, checklist)

### Bẫy đề thi

- ✗ Để workflow dùng chung chỉ trong `~/.claude/` của một người ⇒ ✓ Đặt trong `.claude/skills/<tên>/SKILL.md` của repo và commit
- ✗ Nghĩ `commands/<tên>.md` đã bị xoá bỏ hoàn toàn ⇒ ✓ Nó vẫn hoạt động như alias dạng cũ, nhưng skill là đường dẫn chuẩn
- ✗ Nhét template và script vào prompt của một file command ⇒ ✓ Dùng skill dạng thư mục với file hỗ trợ

### Câu hỏi

#### Q1. Team muốn chuẩn hoá lệnh `/review` kèm checklist riêng và một script lint, để mọi thành viên sau khi clone repo đều dùng được. Cách làm đúng nhất?
- A. Tạo `~/.claude/skills/review/SKILL.md` trên máy tech lead rồi hướng dẫn mọi người xin file
- B. Viết prompt dài vào wiki nội bộ để mọi người copy-paste
- C. Dùng `CLAUDE.local.md` ở gốc repo để lưu lệnh
- D. Tạo `.claude/skills/review/SKILL.md` cùng `checklist.md` và script trong thư mục đó, rồi commit

**Đáp án:** D

**Giải thích:** Skill dạng thư mục trong repo mang theo file hỗ trợ và đi theo git đến mọi người. A chỉ có tác dụng trên một máy. B thủ công, không tích hợp với `/review`. C sai mục đích: `CLAUDE.local.md` chứa hướng dẫn cá nhân, không định nghĩa slash command.

#### Q2. Một dev cũ đang dùng file `.claude/commands/deploy.md` và hỏi liệu có phải di chuyển ngay không. Phát biểu nào đúng?
- A. File commands vẫn chạy như alias dạng cũ, nhưng skill (`.claude/skills/<tên>/SKILL.md`) là dạng chuẩn và hỗ trợ file đi kèm
- B. File commands đã bị vô hiệu hoá, lệnh `/deploy` sẽ báo lỗi
- C. Phải đổi tên thành `.claude/hooks/deploy.md` mới hoạt động
- D. Chỉ skill cá nhân ở `~/.claude/skills/` mới được hỗ trợ

**Đáp án:** A

**Giải thích:** Command dạng cũ vẫn hoạt động, nhưng skill là dạng canonical vì có thể gom nhiều file và có `description` để tự khớp. B sai vì không bị vô hiệu hoá. C bịa một thư mục không dùng cho mục đích này. D sai vì skill cấp project cũng được hỗ trợ.

## K2. Skill chạy trong ngữ cảnh tách biệt: `context: fork`

### Trọng tâm

Đặt `context: fork` trong frontmatter để skill chạy trong ngữ cảnh riêng; phần công việc dài dòng (đọc nhiều file, log) nằm ngoài cuộc trò chuyện chính và chỉ **bản tóm tắt** được trả về.

### Giải thích

Context window là tài nguyên hữu hạn. Một skill kiểu "khảo sát toàn bộ codebase rồi liệt kê điểm cần sửa" có thể đọc hàng chục file, in ra hàng nghìn dòng. Nếu chạy ngay trong cuộc trò chuyện chính, toàn bộ đoạn trích đó nằm lại trong context: tốn token, đẩy các chỉ dẫn quan trọng ra xa và làm model dễ lẫn (context degradation, xem bài 5.4).

Với `context: fork`, skill được chạy ở một ngữ cảnh con (giống một subagent): nó tự đọc, tự suy luận, rồi chỉ gửi về kết quả cô đọng. Cuộc trò chuyện chính chỉ thấy phần tóm tắt.

```markdown
---
name: audit-deps
description: Khảo sát phụ thuộc lỗi thời và rủi ro bảo mật, trả về danh sách ngắn
context: fork
allowed-tools: Read, Grep, Glob
---
Quét toàn bộ repo, tìm dependency lỗi thời. Chỉ trả về tối đa 10 mục
quan trọng nhất, mỗi mục một dòng kèm đường dẫn file.
```

Dùng fork khi: output trung gian lớn, công việc khảo sát/tìm kiếm, bạn chỉ cần kết luận. Không cần fork khi: skill ngắn, kết quả trung gian chính là thứ bạn muốn xem và thảo luận tiếp. Một điểm cần nhớ: vì ngữ cảnh con là tách biệt, hướng dẫn trong skill cần **tự đủ thông tin** (không dựa vào các tin nhắn trước của cuộc trò chuyện) và nên chỉ định rõ định dạng kết quả muốn nhận lại.

### Keyword

- `context: fork` — thiết lập frontmatter chạy skill trong ngữ cảnh tách biệt
- `context isolation` — cô lập ngữ cảnh để output dài không làm bẩn cuộc trò chuyện chính
- `verbose output` — output nhiều chi tiết (đoạn trích, log) tiêu tốn context
- `summary return` — chỉ trả kết luận cô đọng về luồng chính
- `context degradation` — chất lượng giảm khi context quá dài, nhiều nhiễu
- `self-contained instructions` — hướng dẫn đủ thông tin để chạy độc lập

### Bẫy đề thi

- ✗ Chạy skill khảo sát nặng ngay trong luồng chính, để mọi đoạn trích nằm lại ⇒ ✓ Dùng `context: fork` và trả về bản tóm tắt
- ✗ Nghĩ fork làm skill chạy nhanh hơn hoặc rẻ hơn về số lần gọi model ⇒ ✓ Lợi ích chính là bảo vệ context của luồng chính
- ✗ Dùng fork rồi mong skill đọc được các trao đổi trước đó trong luồng chính ⇒ ✓ Ngữ cảnh con tách biệt, hướng dẫn phải tự đủ

### Câu hỏi

#### Q1. Skill `/map-deps` đọc 200 file và in từng đoạn trích ra. Sau hai lần chạy, cuộc trò chuyện chính đầy rác và Claude bắt đầu quên quy ước đã nêu ở đầu phiên. Điều chỉnh phù hợp nhất?
- A. Tăng `max_tokens` của response
- B. Thêm `context: fork` vào frontmatter và yêu cầu skill chỉ trả về danh sách tóm tắt
- C. Xoá `description` để skill không tự kích hoạt
- D. Chuyển skill sang `~/.claude/skills/`

**Đáp án:** B

**Giải thích:** Vấn đề là output trung gian làm đầy context chính. `context: fork` cô lập công việc và chỉ trả bản tóm tắt. A chỉ liên quan giới hạn output của một response, không giảm rác tích tụ. C đổi cách kích hoạt chứ không đổi nơi output nằm. D đổi phạm vi chia sẻ, không đổi context.

#### Q2. Trường hợp nào sau đây KHÔNG nên dùng `context: fork`?
- A. Skill quét log 10.000 dòng rồi chỉ báo 5 lỗi chính
- B. Skill khảo sát kiến trúc toàn repo và trả về sơ đồ thư mục ngắn
- C. Skill giải thích từng bước một đoạn code nhỏ để bạn hỏi tiếp ngay trong cuộc trò chuyện
- D. Skill tìm mọi nơi dùng một API cũ trong 300 file

**Đáp án:** C

**Giải thích:** Khi chính các bước trung gian là thứ bạn cần xem và thảo luận tiếp, tách ra ngữ cảnh riêng sẽ che mất chúng. A, B, D đều có output trung gian lớn mà chỉ cần kết luận, đúng chỗ dùng fork.

## K3. `allowed-tools` là tiền phê duyệt, không phải danh sách cấm

### Trọng tâm

`allowed-tools` trong skill cho phép các tool liệt kê chạy **không cần hỏi quyền** khi skill đang hoạt động. Nó **không** chặn các tool còn lại; tool không liệt kê vẫn bị kiểm tra quyền theo cấu hình thông thường. Muốn cấm hẳn phải dùng quy tắc `deny` trong permissions.

### Giải thích

Hãy phân biệt hai khái niệm: **cấp phép trước (pre-approve)** và **cấm (deny)**.

- `allowed-tools: Read, Grep` nghĩa là khi skill chạy, `Read` và `Grep` được dùng ngay, không bật hộp thoại xin phép. Điều này tiện cho skill chỉ đọc, giúp chạy mượt trong CI hoặc khi cần ít gián đoạn.
- Nếu `Bash` không nằm trong danh sách, Claude vẫn có thể muốn gọi `Bash`; khi đó áp dụng hệ thống quyền bình thường của dự án (hỏi người dùng, hoặc theo allow/deny đã cấu hình). `Bash` không tự "biến mất".

Hệ quả thiết kế: nếu bạn coi `allowed-tools: Read, Grep` là "hàng rào" bảo đảm skill không thể sửa file, bạn đang hiểu sai; một lời gọi tool khác vẫn có thể diễn ra nếu quyền thông thường cho phép hoặc người dùng chấp thuận. Muốn bảo đảm tool bị chặn, hãy dùng `permissions.deny` trong settings (hoặc hook chặn), chúng mới là cơ chế cưỡng chế. Bảng so sánh:

| Mục tiêu | Cơ chế đúng |
|---|---|
| Cho phép tool chạy mượt trong skill | `allowed-tools` |
| Cấm chắc chắn một tool/lệnh | `permissions.deny` hoặc hook |
| Chỉ gợi ý hành vi | Hướng dẫn trong SKILL.md |

Cách nghĩ này nhất quán với nguyên lý xuyên suốt của Domain 3: văn bản/chỉ dẫn là xác suất, cấu hình quyền và hook mới là đảm bảo.

### Keyword

- `allowed-tools` — danh sách tool được tiền phê duyệt khi skill chạy
- `pre-approve` — cho phép trước, không cần hỏi quyền từng lần
- `permissions.deny` — quy tắc trong settings để cấm tool/lệnh chắc chắn
- `permission checks` — hệ thống kiểm tra quyền thông thường áp cho tool chưa được phê duyệt
- `denylist` — danh sách cấm; `allowed-tools` không phải thứ này
- `least privilege` — chỉ cấp đúng quyền cần thiết cho skill

### Bẫy đề thi

- ✗ Nghĩ `allowed-tools: Read, Grep` làm mọi tool khác không thể dùng ⇒ ✓ Tool khác vẫn qua kiểm tra quyền thông thường
- ✗ Dùng `allowed-tools` làm rào chắn an toàn cho thao tác nguy hiểm ⇒ ✓ Dùng `permissions.deny` hoặc hook để cấm chắc chắn
- ✗ Bỏ trống `allowed-tools` rồi cho rằng skill không có tool nào ⇒ ✓ Skill vẫn dùng tool theo quyền thông thường, chỉ là phải hỏi nhiều hơn

### Câu hỏi

#### Q1. Skill `/inspect` khai báo `allowed-tools: Read, Grep`. Một kỹ sư kết luận "skill này không thể chạy lệnh Bash, nên an toàn để chạy tự động". Đánh giá đúng nhất?
- A. Đúng, mọi tool không nằm trong danh sách đều bị chặn
- B. Đúng, nhưng chỉ khi skill dùng `context: fork`
- C. Sai; `allowed-tools` chỉ tiền phê duyệt, `Bash` vẫn đi qua kiểm tra quyền thông thường nên cần `permissions.deny` nếu muốn cấm
- D. Sai; vì `allowed-tools` chỉ ảnh hưởng đến giao diện hiển thị

**Đáp án:** C

**Giải thích:** `allowed-tools` là danh sách cho phép trước, không phải denylist; tool khác vẫn tuân theo quyền thông thường. Muốn cấm chắc chắn cần `permissions.deny` hoặc hook. A và B khẳng định một cơ chế chặn không tồn tại. D đoán sai bản chất.

#### Q2. Bạn muốn skill `/summarize-logs` chạy mà không bật hộp thoại xin phép cho các lần đọc file và grep. Cách phù hợp?
- A. Thêm `allowed-tools: Read, Grep` vào frontmatter của skill
- B. Thêm câu "đừng hỏi quyền" vào thân SKILL.md
- C. Đặt `context: fork` vì fork bỏ qua toàn bộ kiểm tra quyền
- D. Đổi tên skill thành `/auto`

**Đáp án:** A

**Giải thích:** `allowed-tools` chính là cơ chế tiền phê duyệt cho tool liệt kê. B chỉ là văn bản, không thay đổi hệ thống quyền. C sai vì fork liên quan context chứ không phải quyền. D vô nghĩa vì tên skill không ảnh hưởng quyền.

## K4. Phạm vi và khả năng được phát hiện (`description`)

### Trọng tâm

Skill cấp project được chia sẻ qua repo; **`description`** trong frontmatter là thứ Claude dùng để biết khi nào nên tự áp dụng skill. Description mơ hồ thì skill khó được tự khớp; command chỉ nằm ở máy cá nhân thì đồng đội không thấy.

### Giải thích

Hai yếu tố quyết định việc một skill "được dùng đúng lúc": ai có nó (phạm vi) và Claude có nhận ra nó phù hợp hay không (khả năng phát hiện).

**Phạm vi.** Muốn mọi đồng đội dùng chung checklist deploy: commit skill vào `.claude/skills/` của repo. Nếu tạo skill/command riêng ở `~/.claude/`, chỉ bạn có nó. Nên đặt tên skill đặc thù cho dự án để tránh trùng với skill cá nhân hoặc skill khác.

**Khả năng phát hiện.** Ở đầu phiên, Claude chỉ thấy phần metadata của các skill (chủ yếu `name` và `description`), còn nội dung đầy đủ của `SKILL.md` được nạp khi skill thực sự được dùng. Vì thế `description` giống như "tờ rơi quảng cáo": phải nói rõ **skill làm gì** và **khi nào dùng**, bằng từ ngữ người dùng hay nói.

- Kém: `description: Helper cho deploy` (mơ hồ).
- Tốt: `description: Chạy checklist trước khi deploy lên production: kiểm tra migration, feature flag, rollback plan. Dùng khi người dùng nhắc đến deploy, release hoặc go-live.`

Nếu bạn không muốn Claude tự kích hoạt (ví dụ skill có tác dụng phụ như deploy thật), có thể cấu hình để skill chỉ chạy khi người dùng gõ `/tên-skill` một cách chủ động (tùy chọn kiểu `disable-model-invocation`). Với thao tác nguy hiểm, nên bắt buộc gọi thủ công kèm xác nhận thay vì để model tự quyết.

### Keyword

- `description` — trường frontmatter mô tả skill làm gì và khi nào dùng, để tự khớp
- `automatic matching` — Claude tự chọn skill dựa trên mô tả và yêu cầu hiện tại
- `progressive loading` — chỉ metadata nạp sớm, nội dung đầy đủ nạp khi skill được dùng
- `project skill` — skill trong repo, chia sẻ qua git
- `manual invocation` — người dùng chủ động gõ `/tên-skill`
- `disable-model-invocation` — tùy chọn ngăn model tự kích hoạt skill, chỉ cho gọi thủ công

### Bẫy đề thi

- ✗ Tạo command riêng ở `~/.claude/` rồi mong cả team dùng được ⇒ ✓ Commit skill vào `.claude/skills/` của project
- ✗ Viết description chung chung như "helper" ⇒ ✓ Mô tả rõ chức năng và thời điểm dùng bằng từ khóa người dùng hay nhắc
- ✗ Để skill có tác dụng phụ nặng (deploy thật) tự kích hoạt theo suy đoán ⇒ ✓ Giới hạn ở gọi thủ công cho thao tác nguy hiểm

### Câu hỏi

#### Q1. Team có skill `release-checklist` trong repo, nhưng Claude hiếm khi tự dùng nó khi dev nói "tôi chuẩn bị release bản 2.3". Frontmatter hiện chỉ có `description: Helper`. Sửa gì hiệu quả nhất?
- A. Nhồi toàn bộ checklist vào CLAUDE.md gốc
- B. Đổi tên skill thành `helper`
- C. Viết lại `description` nêu rõ skill làm gì (checklist trước release) và khi nào dùng (release, deploy, go-live)
- D. Chuyển skill vào `~/.claude/skills/`

**Đáp án:** C

**Giải thích:** Claude dùng description để quyết định khớp skill; mô tả cụ thể kèm tình huống sử dụng làm tăng khả năng được chọn đúng lúc. A làm tốn context cho mọi phiên. B làm tên vô nghĩa. D thu hẹp phạm vi xuống một người, không giúp khớp.

#### Q2. Skill `/deploy-prod` thực hiện deploy thật. Team lo ngại Claude tự gọi skill khi dev chỉ hỏi chung chung về release. Biện pháp hợp lý nhất?
- A. Viết description thật dài để model khó nhầm
- B. Xoá skill khỏi repo và chạy lệnh deploy bằng tay
- C. Dùng `allowed-tools` để cấm Bash
- D. Cấu hình skill chỉ cho gọi thủ công (không cho model tự kích hoạt) và vẫn yêu cầu xác nhận

**Đáp án:** D

**Giải thích:** Thao tác có tác dụng phụ nên do người chủ động kích hoạt, không để model tự suy đoán. A không đảm bảo. B bỏ mất lợi ích tự động hoá. C sai vì `allowed-tools` không phải denylist (xem K3).
