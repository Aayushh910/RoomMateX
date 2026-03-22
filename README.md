# RoomMateX Backend API

Production-ready FastAPI backend for RoomMateX room/roommate finding platform.

## Tech Stack

- **Framework**: FastAPI
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Pydantic
- **Migrations**: Alembic
- **File Storage**: Cloudinary

## Local Development Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` in the **root directory**:

```bash
copy .env.example .env
```

Edit `.env` with your Neon and Cloudinary credentials:
```
DATABASE_URL=postgresql://username:password@ep-example.us-east-2.aws.neon.tech/roommateX?sslmode=require
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=roommatex0help@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=roommatex0help@gmail.com
EMAIL_DEV_MODE=false
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Generate a secure SECRET_KEY**:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Run the Server

```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will start at: `http://localhost:8000`
API Documentation: `http://localhost:8000/docs`

## Deployment on Render

### Prerequisites
- Render account
- Neon PostgreSQL database
- Cloudinary account for file storage

### 1. Prepare Environment Variables
Set the following environment variables in Render dashboard:
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `SECRET_KEY`: Generate with `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- `FRONTEND_URL`: Your deployed frontend URL (e.g., `https://your-frontend.vercel.app`)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `EMAIL_HOST`: `smtp.gmail.com`
- `EMAIL_PORT`: `587`
- `EMAIL_USERNAME`: Your Gmail address (e.g., `roommatex0help@gmail.com`)
- `EMAIL_PASSWORD`: Your Gmail App Password (not your regular password)
- `EMAIL_FROM`: Your Gmail address (e.g., `roommatex0help@gmail.com`)
- `EMAIL_DEV_MODE`: `false` (set to `true` for testing; OTP will be logged instead of sent)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`

### 2. Deploy to Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
5. Deploy

### 3. Run Database Migrations
After deployment, run migrations if needed:
```bash
alembic upgrade head
```

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
```

#### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}
```

## Frontend Integration

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

## Project Structure

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py          # Settings and environment variables
│   │   └── security.py        # JWT and password hashing
│   ├── models/               # SQLAlchemy models
│   ├── schemas/              # Pydantic schemas for validation
│   ├── routes/               # API endpoints
│   ├── services/             # Business logic
│   ├── utils/                # Utilities (email, file upload)
│   ├── database.py           # Database connection
│   └── main.py               # FastAPI app initialization
├── alembic/                  # Database migrations
├── requirements.txt         # Python dependencies
└── README.md               # This file
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Input validation with Pydantic
- SQL injection protection via SQLAlchemy ORM
- Environment-based configuration
- Secure file uploads via Cloudinary

## Platform Integration

- **Neon PostgreSQL**: Serverless database with automatic scaling
- **Cloudinary**: Image storage and optimization with automatic transformations

## Development Commands

### Start Development Server
```bash
python -m uvicorn app.main:app --reload
```

### Create Database Migration
```bash
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

## Support

For issues or questions, contact the development team.
