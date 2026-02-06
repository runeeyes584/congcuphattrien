# congcuphattrien

<!-- Removed GitHub Quick UI section (index.html removed) -->

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
