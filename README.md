# 💬 ChatApp Realtime

Ứng dụng Chat realtime đơn giản sử dụng:

- ✅ **ASP.NET Core (.NET 9)** cho backend
- ✅ **Angular 19** + **TypeScript** cho frontend
- ✅ **SignalR** cho giao tiếp realtime
- ✅ **JWT + Identity** để xác thực người dùng
- ✅ **SQLite** để lưu trữ dữ liệu
- ✅ **Tailwind CSS** + **Angular Material** cho UI hiện đại
- ✅ **Pagination** cho tin nhắn

---

## 🚀 Tính năng chính

- Đăng ký, đăng nhập, đăng xuất với xác thực JWT
- Chat realtime 1:1 (qua SignalR)
- Danh sách người dùng đang hoạt động
- Danh sách tin nhắn với phân trang
- Bảo mật với ASP.NET Identity + JWT
- Giao diện responsive với Angular Material + Tailwind CSS

---

## 🧰 Công nghệ sử dụng

| Layer       | Công nghệ                                              |
|-------------|--------------------------------------------------------|
| Frontend    | Angular 19, TypeScript, Tailwind CSS, Angular Material |
| Backend     | ASP.NET Core (.NET 9), Entity Framework Core, SQLite   |
| Realtime    | SignalR                                                |
| Auth        | JWT, ASP.NET Core Identity                             |
| ORM         | EF Core + SQLite                                       |

---

## 📁 Cấu trúc thư mục

```
ChatApp/
├── API/                # ASP.NET Core Web API
│   ├── Controllers/
│   ├── Hubs/
│   ├── Services/
│   ├── Data/
│   ├── ChatApp.db      # SQLite DB (tự tạo khi chạy migrate)
│   └── Program.cs
├── client/             # Angular Frontend
│   ├── src/
│   ├── tailwind.config.js
│   ├── angular.json
│   └── package.json
├── ChatApp.sln
└── README.md
```

---

## ⚙️ Cài đặt

### 🔧 Backend (.NET 9 + SQLite)

```bash
cd API
dotnet restore
dotnet ef database update   # Tạo file SQLite DB: ChatApp.db
dotnet run
```

> 📌 Mặc định API chạy tại `https://localhost:5000`

---

### 💻 Frontend (Angular + Tailwind + Material)

```bash
cd client
npm install
ng serve 
```

> 🌐 Web chạy tại: `http://localhost:4200`


---

## 🌐 Một số API Endpoint

| Method | Endpoint               | Mô tả                     |
|--------|------------------------|---------------------------|
| POST   | `/api/account/register`| Đăng ký người dùng        |
| POST   | `/api/account/login`   | Đăng nhập và nhận JWT     |
| GET    | `/api/account/me`      | Thông tin người dùng      |     
| SignalR| `/hub/chat`            | Gửi/nhận tin nhắn realtime|

---

## 🎨 Giao diện

- UI xây dựng bằng **Angular Material**: buttons, inputs, dialog, snackbar…
- Tuỳ biến bằng **Tailwind CSS** để có thiết kế linh hoạt, responsive
- Sử dụng `ngx-pagination` hoặc viết pagination thủ công cho danh sách tin nhắn


---

## 🧪 TODO & Gợi ý mở rộng

- [ ] Thông báo realtime khi người dùng rời phòng
- [ ] Chat nhóm
- [ ] Gửi emoji, file đính kèm/typing...

---

## 🛠 Phụ thuộc chính (frontend)

```json
{
  "@angular/material": "^19.x.x",
  "tailwindcss": "^3.x.x",
  "typescript": "^5.x.x",
  "@angular/animations": "^19.x.x",
  "@angular/cdk": "^19.x.x"
}
```

---

## 📄 License

Dự án phát triển vì mục đích học tập và chia sẻ. Bạn có thể sửa đổi và sử dụng tự do.