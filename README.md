<div align="center">

# 🏠 RoomMateX

**Smart Room & Roommate Discovery Platform**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white)](https://cloudinary.com/)

A full-stack web platform connecting room seekers with property owners — with verification, smart recommendations, and admin moderation.

> 📦 For setup & installation instructions, see [SETUP.md](./SETUP.md)

</div>

---

## 📌 Problem & Solution

Finding accommodation is slow, unsafe, and unverified. RoomMateX provides a **secure, centralized platform** for discovering rooms and compatible roommates based on preferences, budget, and lifestyle.

---

## ✨ Features

### 👤 Users
- Email registration with OTP verification + Google OAuth
- Advanced property search (city, rent, type, tenant preference)
- Wishlist, reviews, and property reporting
- Personalized dashboard with preference-based recommendations
- Profile completeness gating for sensitive features

### 🏘️ Property Owners
- Create/edit/delete listings with multi-image upload (min. 3)
- Manage listing status (active/inactive)
- View and respond to reviews

### 🛡️ Admins
- User verification & role management
- Property moderation (activate/deactivate/delete)
- Report management with custom notices to reporters and owners
- Dashboard analytics (users, properties, reviews, reports)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Axios |
| Backend | FastAPI, SQLAlchemy 2.0, Pydantic, Alembic |
| Database | Neon PostgreSQL (Serverless) |
| Auth | JWT, Bcrypt, Google OAuth 2.0, OTP via SMTP |
| Storage | Cloudinary (images + CDN) |
| Email | Gmail SMTP |

---

## 🗄️ Database Schema

- **Users** — profile, preferences, verification flags, OAuth
- **Properties** — listing details, rent, status, owner FK
- **Property Images / Amenities / House Rules** — cascade on delete
- **Reviews** — rating (1–5), comment, user + property FK
- **Wishlists** — unique (user, property) pairs
- **Reports** — reason, status, admin/owner notices, read flags

---

## 🔐 Security

- JWT access tokens (30-min expiry)
- Bcrypt password hashing (cost factor 12)
- 6-digit OTP with 10-min expiry for sensitive operations
- Role-Based Access Control: `User` / `Owner` / `Admin`
- CORS, SQL injection prevention via ORM, input validation via Pydantic

---

## 🌐 API Overview

| Domain | Endpoints |
|--------|-----------|
| Auth | Register, Login, Google OAuth, OTP, Password Reset |
| Users | Profile CRUD, Photo Upload, OTP Operations |
| Properties | CRUD, Search/Filter, My Listings |
| Reviews | Add, Edit, Delete per property |
| Wishlist | Add, View, Remove |
| Reports | Submit, Track, Mark Read |
| Dashboard | Recommendations, Stats |
| Admin | User/Property/Report Management, Analytics |
| Notifications | Fetch, Mark Read |

> Full interactive API docs available at `/docs` when running locally.

---

## 📁 Project Structure

```
roommateX/
├── backend/
│   └── app/
│       ├── core/          # Config, security
│       ├── models/        # DB models
│       ├── schemas/       # Pydantic schemas
│       ├── routes/        # API route handlers
│       ├── services/      # Business logic
│       └── utils/         # Email, upload, JWT helpers
├── frontend/
│   └── src/
│       ├── components/    # Navbar, Modals, Guards
│       ├── context/       # Auth, Theme, Toast
│       ├── pages/         # All page components + Admin views
│       └── services/      # Axios API call modules
├── .env.example
├── README.md              # ← You are here
└── SETUP.md               # Installation & configuration guide
```

---

## 🔮 Planned Enhancements

- [ ] Scalability in location (Current Only for Gujarat)
- [ ] Real-time chat (WebSocket)
- [ ] Payment integration (Razorpay/Stripe)
- [ ] Mobile app (React Native)
- [ ] AI-powered roommate matching (ML)
- [ ] Multi-language support

---

## 📄 License

Developed for academic purposes. All rights reserved.

---

<div align="center">

**Built with ❤️ by [Aayush Savaliya & Mahek Saradva]**  

📧 roommatex0help@gmail.com
</div>
