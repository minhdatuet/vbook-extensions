---
description: build plugin.zip cho vbook-extensions
---

Chạy lệnh sau từ thư mục gốc của project (`d:\Novel\vbook-extensions`):

// turbo
1. Build lại plugin.zip từ source files:
```
powershell -ExecutionPolicy Bypass -File "build.ps1"
```

Script sẽ tự động:
- Lấy toàn bộ `sangtacviet/src/*.js`, `sangtacviet/plugin.json`, `sangtacviet/icon.png`
- Đóng gói lại thành `sangtacviet/plugin.zip` mới
- Dọn dẹp file tạm
