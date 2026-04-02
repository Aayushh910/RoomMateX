<div align="center">

# ⚙️ RoomMateX — Setup & Installation Guide

> Complete guide to get RoomMateX running locally on your machine.  
> Back to project overview → [README.md](./README.md)

</div>

---

## 📋 Prerequisites

Make sure the following are installed and ready before you begin:

| Requirement | Version | Link |
|-------------|---------|------|
| Node.js | v16 or higher | [nodejs.org](https://nodejs.org/) |
| Python | 3.9 or higher | [python.org](https://www.python.org/) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |
| Neon PostgreSQL Account | — | [console.neon.tech](https://console.neon.tech/) |
| Cloudinary Account | — | [cloudinary.com](https://cloudinary.com/) |
| Gmail Account | — | For SMTP email delivery |

---

## 📥 Step 1 — Clone the Repository

```bash
git clone https://github.com/yourusername/roommateX.git
cd roommateX
```

---

## 🔧 Step 2 — Backend Setup

### 2.1 Navigate & Create Virtual Environment

```bash
cd backend

# macOS / Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 2.2 Install Dependencies

```bash
pip install -r requirements.txt
```

### 2.3 Configure Environment Variables

Create a `.env` file in the **root directory** of the project (not inside `/backend`):

```bash
cp .env.example .env
```

Fill in your credentials:

```env
# Database
DATABASE_URL=postgresql://username:password@ep-xxx.neon.tech/roommateX?sslmode=require

# JWT
SECRET_KEY=your-generated-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# App
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_gmail_app_password
EMAIL_DEV_MODE=false

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Generate a secure SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Get Gmail App Password:**
1. Go to [Google Account](https://myaccount.google.com/) → Security
2. Enable **2-Step Verification**
3. Go to **App Passwords** → Generate for "Mail"
4. Use the generated password as `EMAIL_HOST_PASSWORD`

### 2.4 Run Database Migrations

```bash
alembic upgrade head
```

### 2.5 Start the Backend Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API running at: `http://localhost:8000`
- Swagger docs at: `http://localhost:8000/docs`

---

## 🎨 Step 3 — Frontend Setup

### 3.1 Navigate & Install Dependencies

```bash
cd ../frontend
npm install
```

### 3.2 Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3.3 Start the Frontend Dev Server

```bash
npm run dev
```

- App running at: `http://localhost:5173`

---

## ✅ Step 4 — Access the Application

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | Main application |
| `http://localhost:8000/docs` | API documentation (Swagger UI) |
| `http://localhost:5173/admin` | Admin dashboard |

**Default Admin Credentials:**
```
Email:    admin@roommatex.com
Password: Admin@123
```

> ⚠️ Change the admin password immediately after first login in production.

---

## 🚀 Production Deployment (Quick Reference)

### Recommended Platforms

| Layer | Platform |
|-------|----------|
| Frontend | Vercel / Netlify |
| Backend | Railway / Render / Heroku |
| Database | Neon PostgreSQL (already serverless) |
| Storage | Cloudinary (already cloud-based) |

### Deployment Checklist

- [ ] Set all environment variables on hosting platform
- [ ] Update `FRONTEND_URL` in `.env` to production domain
- [ ] Update `VITE_API_BASE_URL` in frontend `.env` to backend URL
- [ ] Run `alembic upgrade head` on production database
- [ ] Build frontend: `npm run build`
- [ ] Verify CORS settings allow production domain

---

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| `DATABASE_URL` connection error | Check Neon DB URL format and `?sslmode=require` |
| OTP emails not sending | Verify Gmail App Password (not your regular password) |
| Images not uploading | Check Cloudinary API key/secret |
| Google OAuth failing | Verify redirect URIs in Google Cloud Console |
| CORS errors | Ensure `FRONTEND_URL` matches exactly with frontend origin |

---

<div align="center">

**Need help?** Open an issue or reach out at 📧 roommatex0help@gmail.com

</div>
