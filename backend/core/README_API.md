
# 🚀 MWT Core API Documentation

## 🌐 Production URL
https://mwt-core-854774655607.us-central1.run.app

---

# 🧠 Overview

This document describes the **MWT Core Authentication API**.

The system is built using:

- NestJS (Modular Architecture)
- JWT Authentication
- bcrypt Password Hashing
- Guard-based Authorization
- Cloud Run Deployment (Production)

This API provides core identity functionality required for:

- Multi-tenant commerce systems
- SaaS architectures
- Vendor-based platforms

---

# 🔐 Authentication Flow

```text
1. Register User
2. Login User
3. Receive JWT Token
4. Access Protected APIs using Token
````

***

# 📦 Headers

## Required for all authenticated endpoints:

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

***

# ✅ API Endpoints

***

## 🟢 1. Register User

### 📍 Endpoint

```
POST /auth/register
```

### 📥 Request Body

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### 🧪 Example (cURL)

```bash
curl -X POST https://mwt-core-854774655607.us-central1.run.app/auth/register \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","password":"123456"}'
```

### ✅ Success Response

```json
{
  "message": "User registered",
  "user": {
    "id": "unique_id",
    "email": "user@example.com"
  }
}
```

***

## 🔵 2. Login User

### 📍 Endpoint

```
POST /auth/login
```

### 📥 Request Body

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### 🧪 Example (cURL)

```bash
curl -X POST https://mwt-core-854774655607.us-central1.run.app/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","password":"123456"}'
```

### ✅ Success Response

```json
{
  "message": "Login success",
  "access_token": "JWT_TOKEN"
}
```

***

## 🔐 3. Get Profile (Protected)

### 📍 Endpoint

```
GET /auth/profile
```

### 🔒 Authentication Required

* Valid JWT Token
* Bearer Authorization Header

***

### 🧪 Example (cURL)

```bash
curl https://mwt-core-854774655607.us-central1.run.app/auth/profile \
-H "Authorization: Bearer JWT_TOKEN"
```

***

### ✅ Success Response

```json
{
  "message": "Protected profile data",
  "user": {
    "sub": "user_id",
    "email": "user@example.com",
    "iat": 1680000000,
    "exp": 1680003600
  }
}
```

***

# ❌ Error Handling

***

## 🚫 Missing Token

```json
{
  "statusCode": 401,
  "message": "No token provided"
}
```

***

## 🚫 Invalid Token Format

```json
{
  "statusCode": 401,
  "message": "Invalid token format"
}
```

***

## 🚫 Expired or Invalid Token

```json
{
  "statusCode": 401,
  "message": "Invalid or expired token"
}
```

***

## 🚫 Invalid Credentials

```json
{
  "message": "Invalid credentials"
}
```

***

# 🧪 QA Test Checklist

| Test Case                               | Expected Result |
| --------------------------------------- | --------------- |
| Register new user                       | ✅ Success       |
| Login valid user                        | ✅ JWT returned  |
| Login wrong password                    | ❌ Error         |
| Access protected route without token    | ❌ 401           |
| Access protected route with valid token | ✅ Success       |

***

# 🧰 API Testing Tools

This API is compatible with:

* cURL
* Postman
* Swagger (future)
* Frontend apps (Flutter / Web)

***

# 🔒 Security Notes

* Passwords are hashed using bcrypt
* JWT tokens expire after 1 hour
* Tokens must use Bearer format
* Unauthorized requests are rejected

***

# 🧱 Architecture Notes

* Modular NestJS architecture
* Separation of concerns:
  * Controllers → Routing
  * Services → Business logic
  * Guards → Security layer

***

# 🚀 Future Enhancements

* Refresh Tokens
* Role-Based Access Control (RBAC)
* Multi-tenant isolation
* OAuth providers (Google / Apple)
* Rate limiting
