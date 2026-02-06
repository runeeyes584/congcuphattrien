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

Nâng cấp giao diện (mới):
- Giao diện "dark book" mặc định, font serif dễ đọc.
- Thanh tiến trình đọc (progress bar) cập nhật khi cuộn.
- Bảng `Cài đặt đọc`: chọn `Font chữ` (Serif / Sans) và `Khoảng dòng`.
- Mục lục (TOC) dạng modal, highlight chương hiện tại.
- Lưu tuỳ chọn người dùng (chủ đề, font, line spacing, chương hiện tại) vào `localStorage`.


Chạy (tương tự web UI trước):

```bash
python -m http.server 8000
# mở http://localhost:8000/reader.html
```
