# Uplokal Backend

FastAPI backend for Uplokal PWA platform.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
copy .env.example .env
# Edit .env with your settings
```

4. Run development server:
```bash
uvicorn app.main:app --reload --port 8000
```

5. Access API docs:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI application
│   ├── config.py         # Environment settings
│   ├── database.py       # Database connection
│   ├── models/           # SQLAlchemy models
│   ├── routers/          # API route handlers
│   ├── services/         # Business logic (encryption, auth, AI)
│   ├── middleware/       # Auth, RBAC, sanitization
│   └── utils/            # Helper functions
├── storage/              # Document storage
├── requirements.txt
└── .env.example
```

## API Endpoints

| Prefix | Description |
|--------|-------------|
| `/api/auth` | Authentication (register, login, logout) |
| `/api/business` | Business profile CRUD |
| `/api/diagnostic` | AI-powered business diagnostic |
| `/api/documents` | Document vault with signed URLs |
| `/api/rfq` | RFQ & B2B matchmaking |
| `/api/messages` | B2B messaging system |
| `/api/admin` | Admin panel (RBAC protected) |

## Security Features

- JWT tokens in HttpOnly cookies (XSS-safe)
- Hashids for ID obfuscation
- AES-256 encrypted URL parameters
- Signed URLs with expiration for documents
- Role-based access control (RBAC)
- Input sanitization (XSS/SQLi prevention)
- Rate limiting
- Security headers
