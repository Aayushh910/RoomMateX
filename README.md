# RoomMateX Backend API

Production-ready FastAPI backend for RoomMateX room/roommate finding platform.

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Pydantic
- **Migrations**: Alembic

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup PostgreSQL Database

Install PostgreSQL and create a database:

```sql
CREATE DATABASE RoomMateX_DB;
CREATE USER postgres WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE RoomMateX_DB TO postgres;
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` in the **root directory** (not in backend folder):

```bash
copy .env.example .env
```

Edit `.env` in root:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/roommateX
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:5173
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
```

**Generate a secure SECRET_KEY**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Note**: All environment variables are centralized in the root `.env` file for both frontend and backend.

### 4. Initialize Database

Run migrations:

```bash
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

Or let SQLAlchemy create tables automatically (already configured in main.py).

### 5. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will start at: `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

## API Endpoints

### Authentication

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  "email": "john@example.com",
  "password": "securepass123",
  "city": "New York",
  "role": "room_seeker"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "room_seeker",
    "city": "New York",
    "phone_number": "+1234567890",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00"
  }
}
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}

Response (200):
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "room_seeker",
    "city": "New York",
    "phone_number": "+1234567890",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00"
  }
}
```

## Frontend Integration

### Storing Token

In your frontend (React), store the token in localStorage after successful login:

```javascript
// After successful login
const response = await fetch('http://localhost:8000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();

// Store token
localStorage.setItem('access_token', data.access_token);
localStorage.setItem('user', JSON.stringify(data.user));
```

### Making Authenticated Requests

```javascript
const token = localStorage.getItem('access_token');

const response = await fetch('http://localhost:8000/protected-route', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Logout

```javascript
localStorage.removeItem('access_token');
localStorage.removeItem('user');
```

## Project Structure

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py          # Settings and environment variables
│   │   └── security.py        # JWT and password hashing
│   ├── models/
│   │   └── user.py            # SQLAlchemy User model
│   ├── schemas/
│   │   └── user.py            # Pydantic schemas for validation
│   ├── routes/
│   │   └── auth.py            # Authentication endpoints
│   ├── services/
│   │   └── auth_service.py    # Business logic
│   ├── utils/
│   │   └── dependencies.py    # JWT authentication dependency
│   ├── database.py            # Database connection
│   └── main.py                # FastAPI app initialization
├── alembic/                   # Database migrations
├── requirements.txt           # Python dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors, duplicate email)
- `401`: Unauthorized (invalid credentials)
- `403`: Forbidden (inactive account)
- `404`: Not Found
- `500`: Internal Server Error

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Input validation with Pydantic
- SQL injection protection via SQLAlchemy ORM
- Environment-based configuration

## Development

### Run Tests
```bash
pytest
```

### Create New Migration
```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Rollback Migration
```bash
alembic downgrade -1
```

## Production Deployment

1. Set strong `SECRET_KEY`
2. Use production PostgreSQL database
3. Set `FRONTEND_URL` to production domain
4. Use environment variables (never commit `.env`)
5. Enable HTTPS
6. Use gunicorn or similar WSGI server
7. Set up proper logging
8. Configure rate limiting

## Support

For issues or questions, contact the development team.
