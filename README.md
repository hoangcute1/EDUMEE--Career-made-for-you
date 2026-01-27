# 🎓 EDUMEE - Career Made For You

<div align="center">

![EDUMEE Logo](./docs/Logo-exe.jpg)

**Nền tảng hướng nghiệp và phát triển sự nghiệp cho giới trẻ Việt Nam**


[![License](https://img.shields.io/badge/license-UNLICENSED-red.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org)

</div>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tech Stack](#-tech-stack)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Bắt đầu](#-bắt-đầu)
- [Scripts](#-scripts)
- [Môi trường](#-môi-trường)
- [API Documentation](#-api-documentation)
- [Đóng góp](#-đóng-góp)
- [Team](#-team)

---

## 🎯 Giới thiệu

EDUMEE là nền tảng giáo dục và hướng nghiệp, giúp sinh viên và người trẻ Việt Nam:

- 🎯 Khám phá định hướng nghề nghiệp phù hợp
- 📚 Học các kỹ năng cần thiết cho công việc
- 🤝 Kết nối với mentors và nhà tuyển dụng
- 💼 Tìm kiếm cơ hội việc làm và thực tập

---

## 🛠 Tech Stack

### Backend
- **Framework:** NestJS 11
- **Database:** MongoDB 7
- **Cache:** Redis 7
- **Authentication:** JWT + Passport
- **Documentation:** Swagger/OpenAPI
- **Validation:** class-validator

### Frontend
- **Framework:** Next.js 16
- **UI:** React 19 + Tailwind CSS 4
- **Language:** TypeScript 5

### DevOps
- **Container:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Linting:** ESLint + Prettier
- **Git Hooks:** Husky + lint-staged + commitlint

---

## 📁 Cấu trúc dự án

```
EDUMEE/
├── be/                     # Backend (NestJS)
│   ├── src/
│   │   ├── common/         # Shared utilities, filters, interceptors
│   │   ├── config/         # Configuration files
│   │   └── modules/        # Feature modules (auth, users, ...)
│   ├── test/               # E2E tests
│   └── Dockerfile
│
├── fe/                     # Frontend (Next.js)
│   ├── app/                # App Router pages
│   ├── public/             # Static assets
│   └── Dockerfile
│
├── docker/                 # Docker configurations
│   └── mongo-init.js       # MongoDB initialization
│
├── .github/
│   └── workflows/          # CI/CD workflows
│
├── .husky/                 # Git hooks
├── docker-compose.yml      # Docker Compose for development
└── package.json            # Root package (workspaces)
```

---

## 🚀 Bắt đầu

### Yêu cầu

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Docker** & **Docker Compose**
- **Git**

### Cài đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/edumee.git
   cd edumee
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   cd be && npm install
   cd ../fe && npm install
   cd ..
   ```

3. **Cấu hình môi trường**
   ```bash
   # Copy env files
   cp .env.example .env
   cp be/.env.example be/.env
   cp fe/.env.example fe/.env
   ```

4. **Khởi động databases (Docker)**
   ```bash
   npm run docker:dev
   ```

5. **Chạy development**
   ```bash
   # Chạy cả backend và frontend
   npm run dev

   # Hoặc chạy riêng
   npm run dev:be   # Backend: http://localhost:3001
   npm run dev:fe   # Frontend: http://localhost:3000
   ```

### Quick Start với Docker

```bash
# Chạy toàn bộ stack
docker-compose --profile production up -d

# Xem logs
docker-compose logs -f
```

---

## 📜 Scripts

### Root (Monorepo)

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy cả BE và FE |
| `npm run dev:be` | Chạy backend |
| `npm run dev:fe` | Chạy frontend |
| `npm run build` | Build cả BE và FE |
| `npm run lint` | Lint cả project |
| `npm run docker:dev` | Khởi động MongoDB, Redis |
| `npm run docker:down` | Dừng Docker containers |

### Backend

| Script | Mô tả |
|--------|-------|
| `npm run start:dev` | Development mode với hot-reload |
| `npm run start:debug` | Debug mode |
| `npm run build` | Build production |
| `npm run test` | Chạy unit tests |
| `npm run test:cov` | Test coverage |
| `npm run test:e2e` | E2E tests |

### Frontend

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Development mode |
| `npm run build` | Build production |
| `npm run start` | Start production server |
| `npm run lint` | Lint code |

---

## 🔐 Môi trường

### Environment Variables

Xem chi tiết trong các file `.env.example`:

| Variable | Mô tả |
|----------|-------|
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_HOST` | Redis host |
| `JWT_SECRET` | JWT signing key |
| `CORS_ORIGIN` | Allowed CORS origins |

### Database Access

- **MongoDB:** `mongodb://localhost:27017`
- **Mongo Express:** `http://localhost:8081` (admin/admin123)
- **Redis:** `localhost:6379`

---

## 📚 API Documentation

Swagger UI available at: **http://localhost:3001/api/docs**

### Main Endpoints

```
POST   /api/v1/auth/register     # Đăng ký
POST   /api/v1/auth/login        # Đăng nhập
POST   /api/v1/auth/refresh      # Refresh token

GET    /api/v1/users             # Danh sách users
GET    /api/v1/users/:id         # Chi tiết user
PATCH  /api/v1/users/:id         # Cập nhật user
DELETE /api/v1/users/:id         # Xóa user
```

---

## 🔄 Git Workflow

### Branch Naming

- `main` - Production branch
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Production hotfixes

### Commit Convention

Sử dụng [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add user authentication
fix: resolve login issue
docs: update README
refactor: improve code structure
test: add unit tests
chore: update dependencies
```

---

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

---

## 👥 Team

| Role | Name |
|------|------|
| **Founder** | [Trương Nguyễn Hoàng] |
| **Backend** | [Lê Đức Trung Thi] |
| **Frontend** | [Nguyễn Phương Mỹ Thuận] |
| **Design** | [Nguyễn Thị Diễm Quyên], |
| **Design** | [Bùi Quang Dũng] |
| **Marketing** | [Nguyễn Trần Quốc Huy] |



---

## 📄 License

This project is **UNLICENSED** - Proprietary software.

---

<div align="center">

**Made with ❤️ by EDUMEE Team**

</div>
