# 🏢 CRM System - Hệ thống Quản lý Quan hệ Khách hàng

Hệ thống CRM (Customer Relationship Management) được xây dựng với **Spring Boot 3.3** (Backend) và **React + Vite** (Frontend).

---

## 📋 Mục lục

1. [Tổng quan hệ thống](#-tổng-quan-hệ-thống)
2. [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
3. [Cài đặt và Chạy dự án](#-cài-đặt-và-chạy-dự-án)
4. [Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
5. [API Endpoints](#-api-endpoints)
6. [Cấu trúc dự án](#-cấu-trúc-dự-án)
7. [Xử lý sự cố](#-xử-lý-sự-cố)

---

## 🌟 Tổng quan hệ thống

### Tính năng chính

| Tính năng | Mô tả |
|-----------|-------|
| 🔐 **Xác thực & Phân quyền** | Đăng nhập/Đăng ký với JWT, phân quyền theo Role (SUPERADMIN, ADMIN, USER) |
| 👥 **Quản lý người dùng** | CRUD users, gán role, quản lý permissions |
| 📦 **Quản lý sản phẩm** | Thêm, sửa, xóa, xem danh sách sản phẩm |
| 📝 **Quản lý hợp đồng** | Tạo và theo dõi hợp đồng với khách hàng |
| 📊 **Dashboard** | Thống kê tổng quan: users, đơn hàng, doanh thu |
| 📈 **Báo cáo** | Xem báo cáo và phân tích dữ liệu |

### Công nghệ sử dụng

**Backend:**
- Java 17 + Spring Boot 3.3.0
- Spring Security + JWT Authentication
- Spring Data JPA + PostgreSQL
- Spring Mail (gửi email xác thực)

**Frontend:**
- React 18 + Vite 7
- Ant Design + Material UI
- React Router DOM
- Axios

---

## 💻 Yêu cầu hệ thống

| Thành phần | Phiên bản | Ghi chú |
|------------|-----------|---------|
| **Java** | 17+ | Bắt buộc |
| **Maven** | 3.9+ | Build tool |
| **Node.js** | 18+ | Cho frontend |
| **PostgreSQL** | 16 | Database |

### Kiểm tra cài đặt

```powershell
# Kiểm tra Java
java -version

# Kiểm tra Maven
& "C:\Users\Admin\maven\apache-maven-3.9.11\bin\mvn.cmd" -version

# Kiểm tra Node.js
node -v
npm -v

# Kiểm tra PostgreSQL
sc query postgresql-x64-16
```

---

## 🚀 Cài đặt và Chạy dự án

### Bước 1: Chuẩn bị Database

```powershell
# Tạo database (nếu chưa có)
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE crm_database;"
```

### Bước 2: Cấu hình Backend

File: `src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/crm_database
    username: postgres
    password: 123123  # ← Thay bằng mật khẩu PostgreSQL của bạn
```

### Bước 3: Chạy Backend

```powershell
# Di chuyển đến thư mục backend
Set-Location "c:\Users\Admin\Desktop\Backend-CRM-main\CRM_p1\Backend_CRM\springbootBackend-main\demo"

# Chạy Spring Boot
& "C:\Users\Admin\maven\apache-maven-3.9.11\bin\mvn.cmd" spring-boot:run
```

✅ Backend sẵn sàng khi thấy: `Started DemoApplication` và `Tomcat started on port 8080`

### Bước 4: Chạy Frontend

```powershell
# Di chuyển đến thư mục frontend
Set-Location "c:\Users\Admin\Desktop\Backend-CRM-main\CRM_p1\frontend"

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

✅ Frontend sẵn sàng tại: `http://localhost:3000`

### Tổng quan sau khi chạy

| Service | URL | Port |
|---------|-----|------|
| Backend API | http://localhost:8080 | 8080 |
| Frontend | http://localhost:3000 | 3000 |

---

## 📖 Hướng dẫn sử dụng

### 1. Đăng ký tài khoản mới

1. Truy cập http://localhost:3000/register
2. Điền thông tin:
   - **Username**: Tên đăng nhập
   - **Email**: Email hợp lệ (dùng để xác thực)
   - **Password**: Mật khẩu (tối thiểu 6 ký tự)
3. Click **"Đăng ký"**
4. Kiểm tra console Backend để lấy mã xác thực (dòng `✅ [DEBUG] Mã xác thực...`)
5. Truy cập link xác thực hoặc gọi API verify

### 2. Đăng nhập

1. Truy cập http://localhost:3000/login
2. Nhập **Email** và **Password**
3. Tick **"Ghi nhớ tôi"** nếu muốn lưu đăng nhập
4. Click **"Đăng nhập"**
5. Sau khi đăng nhập thành công → chuyển đến Dashboard

### 3. Dashboard

Sau khi đăng nhập, bạn sẽ thấy:
- **Thống kê tổng quan**: Số users, đơn hàng, doanh thu, sản phẩm
- **Đơn hàng gần đây**: Danh sách các đơn hàng mới nhất
- **Hoạt động gần đây**: Log các hoạt động trong hệ thống

### 4. Quản lý người dùng (Admin/SuperAdmin)

| Chức năng | Mô tả | Quyền yêu cầu |
|-----------|-------|---------------|
| Xem danh sách users | Xem tất cả users trong hệ thống | ADMIN, SUPERADMIN |
| Gán role cho user | Thay đổi role của user | SUPERADMIN |
| Quản lý permissions | Cấu hình quyền cho role | SUPERADMIN |

### 5. Quản lý sản phẩm

- **Xem danh sách**: `/products` - Xem tất cả sản phẩm
- **Thêm sản phẩm**: `/products/add` - Tạo sản phẩm mới
- **Sửa sản phẩm**: Click vào sản phẩm để chỉnh sửa

### 6. Quản lý hợp đồng

- **Xem danh sách**: `/contracts` - Xem tất cả hợp đồng
- **Thêm hợp đồng**: `/contracts/add` - Tạo hợp đồng mới
- **Sửa hợp đồng**: `/contracts/edit/:id` - Chỉnh sửa hợp đồng

### 7. Phân quyền hệ thống

| Role | Quyền |
|------|-------|
| **USER** | Xem dashboard, quản lý profile cá nhân |
| **ADMIN** | USER + Quản lý users, sản phẩm, hợp đồng |
| **SUPERADMIN** | ADMIN + Gán role, quản lý permissions |

---

## 🔌 API Endpoints

### Authentication (`/req`)

| Method | Endpoint | Mô tả | Body |
|--------|----------|-------|------|
| POST | `/req/signup` | Đăng ký | `{username, email, password}` |
| POST | `/req/login` | Đăng nhập | `{email, password}` |
| GET | `/req/verify?token=xxx` | Xác thực email | - |

### Users (`/api/users`)

| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| GET | `/api/users/me` | Thông tin user hiện tại | Authenticated |
| GET | `/api/users` | Danh sách tất cả users | ADMIN |
| GET | `/api/users/roles` | Danh sách roles | ADMIN |
| POST | `/api/users/assign-role` | Gán role cho user | SUPERADMIN |

### Products (`/api/products`)

| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| GET | `/api/products` | Danh sách sản phẩm | Public |
| POST | `/api/products` | Tạo sản phẩm mới | Authenticated |

### Ví dụ gọi API với PowerShell

```powershell
$base = "http://localhost:8080"

# 1) Đăng nhập lấy token
$loginBody = @{ email = "your@email.com"; password = "yourpassword" } | ConvertTo-Json
$loginResp = Invoke-RestMethod -Uri "$base/req/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResp.token

# 2) Gọi API với token
Invoke-RestMethod -Uri "$base/api/users/me" -Headers @{ Authorization = "Bearer $token" } -Method GET

# 3) Lấy danh sách sản phẩm
Invoke-RestMethod -Uri "$base/api/products" -Headers @{ Authorization = "Bearer $token" } -Method GET
```

---

## 📁 Cấu trúc dự án

```
Backend-CRM-main/
├── CRM_p1/
│   ├── Backend_CRM/
│   │   └── springbootBackend-main/
│   │       └── demo/
│   │           ├── src/main/java/com/example/demo/
│   │           │   ├── Controller/          # REST Controllers
│   │           │   ├── Model/               # Entity classes
│   │           │   ├── dto/                 # Data Transfer Objects
│   │           │   ├── repository/          # JPA Repositories
│   │           │   ├── Security/            # JWT & Security config
│   │           │   ├── service/             # Business logic
│   │           │   └── utils/               # Utilities
│   │           ├── src/main/resources/
│   │           │   ├── application.yml      # Cấu hình app
│   │           │   └── data.sql             # Seed data
│   │           └── pom.xml                  # Maven dependencies
│   │
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   │   ├── auth/                    # Login, Register, ForgotPassword
│       │   │   ├── contracts/               # Quản lý hợp đồng
│       │   │   ├── products/                # Quản lý sản phẩm
│       │   │   ├── users/                   # Quản lý users
│       │   │   ├── layout/                  # MainLayout
│       │   │   ├── Dashboard.js
│       │   │   └── Reports.js
│       │   ├── contexts/                    # React Context (Auth)
│       │   ├── utils/                       # Helper functions
│       │   ├── App.js                       # Main App component
│       │   └── index.jsx                    # Entry point
│       ├── package.json
│       └── vite.config.js
```

---

## 🔧 Xử lý sự cố

### Port 8080 đã bị chiếm

```powershell
# Tìm process đang dùng port 8080
netstat -ano | findstr ":8080"

# Dừng process theo PID
Stop-Process -Id <PID> -Force
```

### Lỗi kết nối Database

1. Kiểm tra PostgreSQL đang chạy:
   ```powershell
   sc query postgresql-x64-16
   ```

2. Kiểm tra database tồn tại:
   ```powershell
   & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -c "\l"
   ```

3. Kiểm tra `application.yml` có đúng password

### Lỗi CORS

Thêm domain vào `application.yml`:
```yaml
cors:
  allowed-origins: >
    http://localhost:3000,http://127.0.0.1:3000
```

### Lỗi npm install

```powershell
# Xóa cache và cài lại
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Không nhận được email xác thực

- Kiểm tra console Backend để lấy mã xác thực (dòng có `✅ [DEBUG] Mã xác thực...`)
- Hoặc cấu hình SMTP trong `application.yml` với email thật

---

## 🌐 Chia sẻ link công khai (Cloudflare Tunnel)

```powershell
# Mở tunnel cho Backend
& "$env:LOCALAPPDATA\cloudflared\cloudflared.exe" tunnel --url http://127.0.0.1:8080 --edge-ip-version 4 --protocol http2
```

Sau vài giây sẽ in ra URL: `https://<subdomain>.trycloudflare.com`

> ⚠️ Nhớ thêm URL tunnel vào `allowed-origins` trong `application.yml` nếu gọi từ frontend

---

## 📞 Liên hệ hỗ trợ

Nếu gặp lỗi, vui lòng:
1. Copy nguyên văn log lỗi
2. Mô tả các bước đã thực hiện
3. Gửi để được hỗ trợ

---

**© 2025 CRM System** - Built with ❤️ using Spring Boot & React
