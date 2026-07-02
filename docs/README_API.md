# 🚀 MWT Core API Documentation

## 🌐 Development URL

```text
http://localhost:8080
```

---

# 🧠 Overview

MWT Core is the central backend service of the Multi World Trade (MWT) platform.

The current implementation provides:

- User Registration
- User Authentication
- JWT Token Generation
- Password Hashing
- PostgreSQL Database Integration
- Prisma ORM
- Protected Endpoints

---

# 🏗 Technology Stack

| Component | Technology |
|------------|------------|
| Framework | NestJS |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Authentication | JWT |
| Password Security | bcrypt |
| Language | TypeScript |

---

# 🔐 Authentication Flow

```text
Register
   ↓
Hash Password
   ↓
Store User in PostgreSQL
   ↓
Login
   ↓
Validate Credentials
   ↓
Generate JWT
   ↓
Access Protected Routes
```

---

# 📦 Required Headers

## Public Endpoints

```http
Content-Type: application/json
```

---

## Protected Endpoints

```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

---

# ✅ API Endpoints

---

# 🟢 Register User

Creates a new user account.

## Endpoint

```http
POST /auth/register
```

---

## Request Body

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

---

## Example

```bash
curl -X POST http://localhost:8080/auth/register \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","password":"123456"}'
```

---

## Success Response

```json
{
  "message": "User registered",
  "user": {
    "id": "bbe40c98-d792-431f-a953-a98f9eda5ba0",
    "email": "user@example.com"
  }
}
```

---

## Validation Rules

### Email

Must be a valid email address.

### Password

Minimum length:

```text
6 characters
```

---

# 🔵 Login User

Authenticates an existing user.

## Endpoint

```http
POST /auth/login
```

---

## Request Body

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

---

## Example

```bash
curl -X POST http://localhost:8080/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","password":"123456"}'
```

---

## Success Response

```json
{
  "message": "Login success",
  "access_token": "JWT_TOKEN"
}
```

---

## Failure Responses

### User Not Found

```json
{
  "message": "User not found"
}
```

### Invalid Credentials

```json
{
  "message": "Invalid credentials"
}
```

---

# 🔐 Profile Endpoint

Returns information extracted from a valid JWT token.

## Endpoint

```http
GET /auth/profile
```

---

## Example

```bash
curl http://localhost:8080/auth/profile \
-H "Authorization: Bearer JWT_TOKEN"
```

---

## Success Response

```json
{
  "message": "Protected profile data",
  "user": {
    "sub": "USER_ID",
    "email": "user@example.com"
  }
}
```

---

# 🗄 Database Architecture

The authentication module uses PostgreSQL as the primary data store.

Prisma ORM manages:

- Database connections
- Query generation
- Migrations
- Type-safe database access

---

## User Model

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

---

# 🔒 Security

Current security measures:

- Password hashing using bcrypt
- JWT token generation
- Protected route guards
- Email uniqueness enforcement
- Database persistence

---

# 🧪 Test Checklist

| Test Case | Expected Result |
|-----------|----------------|
| Register new user | ✅ Success |
| Register existing user | ✅ Rejected |
| Login valid user | ✅ JWT Returned |
| Login invalid password | ✅ Rejected |
| Access protected endpoint with token | ✅ Success |
| Access protected endpoint without token | ✅ Unauthorized |

---

# 📂 Project Structure

```text
backend/
└── core/
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations
    │
    ├── src/
    │   ├── prisma/
    │   │   ├── prisma.module.ts
    │   │   └── prisma.service.ts
    │   │
    │   └── modules/
    │       └── auth/
    │
    ├── .env
    ├── package.json
    └── README_API.md
```

---

# 🚀 Current Status

```text
Authentication Module: READY
Database Integration: READY
JWT Authentication: READY
Prisma ORM: READY
PostgreSQL: READY
Production Foundation: READY
```

---

# 👑 MWT Core

Multi World Trade Backend Platform

Production-grade backend foundation built with:

- NestJS
- PostgreSQL
- Prisma
- JWT Authentication
- TypeScript