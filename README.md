# CCAR-F Study Hub

Trang tĩnh để học lý thuyết và luyện đề mock **Claude Certified Architect – Foundations**.

- **Lý thuyết** – 30 bài trong `input/`, nhóm theo 5 domain (27/18/20/20/15%). Mỗi bài có mục lục, các câu ôn tập bấm chọn được và có thể đánh dấu là đã học.
- **Luyện đề** – 10 đề trong `question/`. Mỗi đề có 60 câu, làm trong 120 phút, cần 720/1000 để đạt.
  - Có thể làm Full đề, hoặc chỉ 1/2, 1/3, 1/4, 1/5, 1/6 đề, tính 2 phút cho mỗi câu. Mỗi phần vẫn giữ tỷ trọng các domain như đề đầy đủ.
  - Có đồng hồ đếm ngược và tự nộp bài khi hết giờ. Có thể gắn cờ câu cần xem lại và dùng phím tắt (A–D / 1–4, ←/→, F).
  - Bài làm dở được lưu lại để làm tiếp.
  - Kết quả hiện điểm, tỷ lệ đúng theo từng domain và giải thích cho từng phương án. Có nút làm lại các câu sai, và link về bài lý thuyết liên quan.
  - Tiến độ và lịch sử làm bài lưu trong `localStorage` của trình duyệt.

## Cấu trúc

```
index.html            # trang chính
assets/app.js         # logic (không cần build)
assets/style.css
input/*.md            # bài học
input/index.json      # manifest bài học (tự sinh)
question/mock-XX.json # đề + đáp án + giải thích
question/index.json   # manifest đề (tự sinh)
tools/build_manifest.py
```

Mỗi khi thêm hoặc sửa bài học hay đề, chạy lại lệnh sau để cập nhật manifest:

```bash
python3 tools/build_manifest.py
```

## Chạy thử local

Trình duyệt chặn `fetch` khi mở file trực tiếp bằng `file://`, nên cần chạy một server tĩnh:

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

## Deploy GitHub Pages

1. Push toàn bộ thư mục lên một repo GitHub.
2. Vào **Settings → Pages → Build and deployment**, chọn **Deploy from a branch**, branch `main`, thư mục `/ (root)`.
3. File `.nojekyll` đã có sẵn, nên GitHub sẽ phục vụ file nguyên trạng.

## Định dạng đề (`question/mock-XX.json`)

Mỗi câu hỏi có các trường `scenarioId`, `domain`, `taskStatement`, `lesson`, `concept`, `difficulty`, `question`, `options[A–D]`, `answer`, `explanation`, `optionExplanations`, `keyTakeaway`. Phần câu hỏi viết bằng tiếng Anh như đề thật, phần giải thích viết bằng tiếng Việt.
