# Kết nối PostgreSQL cho dự án CRM_p1 (Windows)

Tài liệu này hướng dẫn nhanh cách cài đặt PostgreSQL, tạo database, cấu hình `application.yml` và kiểm tra kết nối cho dự án Spring Boot.

## 1) Cài đặt PostgreSQL 16/17/15 (Windows)
- Tải từ https://www.postgresql.org/download/windows/
- Cài đặt kèm `psql` và `pgAdmin`.
- Ghi nhớ tài khoản mặc định: user `postgres` + mật khẩu bạn đặt khi cài.

## 2) Tạo database và user
Mở PowerShell và chạy `psql` (thay mật khẩu thật của bạn):

```powershell
 
# (nếu DB đã tồn tại sẽ báo lỗi, có thể bỏ qua)

# Tạo user (nếu muốn dùng user riêng thay vì postgres)
psql -U postgres -h localhost -p 5432 -c "CREATE USER crm_user WITH PASSWORD 'StrongPassword!123';"
psql -U postgres -h localhost -p 5432 -c "GRANT ALL PRIVILEGES ON DATABASE crm_database TO crm_user;"
```

Nếu dùng firewall/WSL, đảm bảo cổng 5432 cho phép truy cập local.

## 3) Cấu hình Spring Boot
File: `CRM_p1/Backend_CRM/springbootBackend-main/demo/src/main/resources/application.yml`

- Mặc định đã cấu hình:
```
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/crm_database
    username: postgres   # hoặc crm_user nếu bạn tạo ở bước 2
    password: 123456     # đổi thành mật khẩu thật
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
    defer-datasource-initialization: true
  sql:
    init:
      mode: always
```
- `ddl-auto: update` cho phép JPA tự tạo/cập nhật bảng theo entity.
- `sql.init.mode: always` và `defer-datasource-initialization: true` giúp `data.sql` chạy sau khi bảng được tạo.

## 4) Dữ liệu khởi tạo (data.sql)
- `src/main/resources/data.sql` đã có script tạo sẵn roles/permissions.
- Lưu ý: `schema.sql` đang rỗng; không cần nếu dùng `ddl-auto: update`.

## 5) Chạy ứng dụng và kiểm tra kết nối
Tại thư mục `.../springbootBackend-main/demo`:

```powershell
# chạy bằng Maven wrapper
./mvnw.cmd spring-boot:run

# hoặc build jar
./mvnw.cmd -DskipTests clean package; java -jar target/demo-0.0.1-SNAPSHOT.jar
```

Xem log console:
- Tìm dòng kết nối: `HikariPool-... - Start completed` và các câu SQL `insert/select`.
- Nếu lỗi `relation "roles" does not exist`: chạy lại sau khi bật `defer-datasource-initialization: true` (đã bật sẵn).

Kiểm tra DB bằng `psql`:
```powershell
psql -U postgres -h localhost -d crm_database -c "\dt"
psql -U postgres -h localhost -d crm_database -c "SELECT * FROM roles;"
```

## 6) Dùng biến môi trường (khuyên dùng)
Thay vì hard-code mật khẩu, dùng env vars:

```
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/crm_database}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:changeme}
```

Đặt biến trong PowerShell (tạm thời cho session hiện tại):
```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/crm_database"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "YourSecret!"
./mvnw.cmd spring-boot:run
```

## 7) Sự cố thường gặp
- `'psql' is not recognized`: chưa cài PostgreSQL CLI hoặc PATH chưa chứa thư mục `bin` của PostgreSQL.
  - Cách 1 (gọi trực tiếp bằng full path):
    ```powershell
    # Thay <ver> bằng version bạn cài (vd: 16, 17)
    & "C:\Program Files\PostgreSQL\<ver>\bin\psql.exe" -U postgres -h localhost -p 5432 -c "CREATE DATABASE crm_database;"
    ```
  - Cách 2 (thêm PATH tạm thời cho session PowerShell):
    ```powershell
    $env:Path += ";C:\Program Files\PostgreSQL\16\bin"
    psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE crm_database;"
    ```
  - Cách 3 (cài đặt qua winget nếu chưa cài):
    ```powershell
    winget install -e --id PostgreSQL.PostgreSQL
    # Mở PowerShell mới rồi thử lại lệnh psql
    ```
- `FATAL: password authentication failed`: sai username/password → cập nhật `application.yml` hoặc env vars.
- `Connection refused`: PostgreSQL chưa chạy → khởi động dịch vụ `postgresql-x64-<version>` trong Services.msc.
- `relation ... does not exist` khi start: đảm bảo `ddl-auto=update` và `defer-datasource-initialization=true` (đã cấu hình), xóa schema cũ nếu cần.

## 8) Nâng cao: phân quyền production
- Tạo user chỉ có quyền CRUD trên schema ứng dụng.
- Tắt `ddl-auto` (đặt `none`) và dùng migration tool (Flyway/Liquibase).
- Sử dụng secrets manager thay vì env vars khi deploy.
