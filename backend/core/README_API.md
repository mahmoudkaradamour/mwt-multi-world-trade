# MWT Core API (Auth)

## Base URL
https://mwt-core-<project-id>.run.app

---

## Register

POST /auth/register

### Request:
{
  "email": "user@test.com",
  "password": "123456"
}

### Response:
{
  "message": "User registered",
  "user": {
    "id": "...",
    "email": "user@test.com"
  }
}

---

## Login

POST /auth/login

### Request:
{
  "email": "user@test.com",
  "password": "123456"
}

### Response:
{
  "message": "Login success",
  "access_token": "JWT_TOKEN"
}

---

## Profile (Protected)

GET /auth/profile

### Headers:
Authorization: Bearer JWT_TOKEN

### Response:
{
  "message": "Protected profile data",
  "user": {
    "sub": "...",
    "email": "user@test.com"
  }
}