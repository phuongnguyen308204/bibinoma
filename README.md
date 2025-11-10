# Bibinoma - AI Chat Application

Bibinoma là ứng dụng chat AI với 2 trợ lý thông minh: **Bibi** (hỗ trợ tâm lý) và **Noma** (lập kế hoạch). Ứng dụng được xây dựng với kiến trúc microservices, hỗ trợ đa ngôn ngữ (Tiếng Việt/English), tích hợp thanh toán và quản lý ký ức chat.

## ✨ Tính năng chính

### Chat AI
- **Bibi**: Trợ lý tâm lý, hỗ trợ tâm sự và chia sẻ cảm xúc
- **Noma**: Trợ lý lập kế hoạch, giúp tổ chức công việc và thói quen
- Lưu trữ lịch sử chat với mã hóa dữ liệu
- Quản lý ký ức (memories) cho từng trợ lý
- Hỗ trợ đa ngôn ngữ (Tiếng Việt/English)

### Authentication & User Management
- Đăng nhập qua Google OAuth2
- Quản lý session và token
- Đăng xuất đơn hoặc đăng xuất tất cả thiết bị

### Payment System
- Tích hợp PayOS payment gateway
- Tạo QR code thanh toán
- Webhook xử lý callback thanh toán
- Quản lý số dư tài khoản

### Security
- Mã hóa dữ liệu chat với AES-256
- Session management an toàn
- CORS configuration
- Rate limiting

## 🛠 Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router DOM 7** - Routing
- **Tailwind CSS** - Styling
- **React Context API** - State management (Auth, Chat, Theme, Language, Modal)
- **PWA Support** - Progressive Web App

### Backend
- **Go 1.25** - Backend language
- **Gin Framework** - HTTP web framework
- **GORM** - ORM for PostgreSQL
- **PostgreSQL 15** - Database
- **OAuth2** - Google authentication
- **Session Management** - Cookie-based sessions

### AI Model Service
- **Python** - Model service language
- **FastAPI** - API framework
- **OpenAI API** - GPT-4o-mini integration
- **Uvicorn** - ASGI server

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy & load balancer
- **Certbot** - SSL certificate management
- **PostgreSQL** - Relational database

## 📁 Cấu trúc Project

```
bibinoma/
├── backend/                 # Go backend service
│   ├── config/             # Database & session config
│   ├── controllers/        # API controllers
│   │   ├── chat_bibi_controller.go
│   │   ├── chat_noma_controller.go
│   │   ├── chat_history_controller.go
│   │   ├── chat_memories_controller.go
│   │   ├── oauth_controller.go
│   │   ├── payment_controller.go
│   │   └── webhook_controller.go
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utilities (encryption)
│   ├── main.go
│   ├── go.mod
│   └── Dockerfile
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Auth/
│   │   │   ├── Chat/
│   │   │   ├── Layout/
│   │   │   ├── Modal/
│   │   │   └── Settings/
│   │   ├── contexts/       # Context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── utils/          # Utilities
│   ├── public/             # Static files
│   ├── package.json
│   └── Dockerfile
│
├── model/                  # Python AI service
│   ├── app/
│   │   ├── routes_heart.py      # Bibi chat routes
│   │   ├── routes_planning.py   # Noma chat routes
│   │   ├── routes_misc.py       # Misc routes
│   │   ├── openai_client.py     # OpenAI client
│   │   ├── prompts.py           # AI prompts
│   │   └── services.py          # Business logic
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── nginx/                  # Nginx configuration
│   ├── nginx.conf
│   └── conf.d/
│       ├── default.conf    # HTTPS config
│       └── http-only.conf  # HTTP-only config
│
└── docker-compose.yml      # Docker orchestration
```

## 🚀 Quick Start

Project sử dụng Docker Compose để chạy tất cả services. Nginx chạy trong Docker container như reverse proxy cho production, không ảnh hưởng khi chạy local development.

```bash
docker-compose up -d --build
```

Cần cấu hình environment variables trong file `.env` trước khi chạy (OpenAI API key, Google OAuth, Payment keys, Database credentials, etc.)

## 🔒 Bảo mật

- Chat data được mã hóa với AES-256-CFB
- Session management an toàn với cookie-based sessions
- CORS configuration và rate limiting
- ⚠️ **Quan trọng**: Không commit secrets vào repository. Sử dụng environment variables.

---

**Lưu ý**: Cần cấu hình lại tất cả secrets và credentials trước khi deploy production.

