# congcuphattrien

## GitHub Quick UI

Thêm một giao diện nhỏ để lấy danh sách repository công khai từ GitHub.

Files added:
- `index.html` — giao diện chính
- `styles.css` — kiểu dáng
- `app.js` — logic JS để gọi GitHub API

Usage:

1. Mở `index.html` trực tiếp trong trình duyệt, hoặc serve folder bằng một web server tĩnh (đề xuất):

```bash
python -m http.server 8000
# rồi mở http://localhost:8000
```

2. Nhập GitHub username (ví dụ: `torvalds`) rồi nhấn `Fetch Repos`.

Notes:
- Ứng dụng dùng GitHub public API để lấy repo công khai, không cần auth cho các repo public.
- Nếu cần chức năng nâng cao (token, tạo issue, commit), mình có thể mở rộng sau.

---

## Trang Đọc Chương (Demo)

Mình đã thêm một tiện ích đọc truyện đơn giản: `reader.html`.

Tính năng:
- Hiển thị nội dung chương (từ JSON mẫu `stories/sample_story.json`).
- Nút `Chương trước` / `Chương sau` ở trên và dưới.
- Đổi cỡ chữ (A- / A+): `fs-small`, `fs-normal`, `fs-large`.
- Chuyển nền sáng / tối (toggle). Tùy chọn lưu vào `localStorage`.
- Phím tắt: ← → (chuyển chương), +/- (cỡ chữ), `t` (đổi theme).

Chạy (tương tự web UI trước):

```bash
python -m http.server 8000
# mở http://localhost:8000/reader.html
```
