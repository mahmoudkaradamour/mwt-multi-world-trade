# 🚀 MWT Core

## Overview

MWT Core is the central backend service of the Multi World Trade (MWT) platform.

It provides the foundation for:

- Authentication
- Authorization
- User Management
- Store Management
- Product Management
- Order Processing
- Payment Processing
- Future Multi-Tenant Commerce Services

---

# Technology Stack

| Component | Technology |
|------------|------------|
| Backend Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Authentication | JWT |
| Password Security | bcrypt |
| Validation | class-validator |
| Testing | Jest |
| Deployment | Cloud Run |
| Build Pipeline | Cloud Build |

---

# Current Features

## Authentication

Implemented:

```text
✅ User Registration
✅ User Login
✅ JWT Authentication
✅ Protected Routes
✅ Password Hashing
```

---

## Database

Implemented:

```text
✅ PostgreSQL Integration
✅ Prisma ORM
✅ Database Migrations
✅ User Persistence
```

---

## Testing

Implemented:

```text
✅ Authentication E2E Tests
✅ Database E2E Tests
✅ User E2E Tests
✅ 21 / 21 Tests Passed
```

---

# Quick Start

## Install Dependencies

```bash
npm install
```

---

## Configure Environment

Create:

```text
.env
```

Required configuration:

```env
DATABASE_URL=

JWT_SECRET=

PORT=8080
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Apply Database Migrations

```bash
npx prisma migrate dev
```

---

## Start Development Server

```bash
npm run start:dev
```

Expected output:

```text
Nest application successfully started
MWT Core running on port 8080
```

---

## Build Application

```bash
npm run build
```

---

## Run Automated Tests

```bash
npm run test:e2e
```

Expected result:

```text
Test Suites: 3 passed
Tests: 21 passed
```

---

# API Endpoints

## Register User

```http
POST /auth/register
```

---

## Login User

```http
POST /auth/login
```

---

## Profile

```http
GET /auth/profile
```

Requires:

```text
JWT Token
```

---

# Project Structure

```text
src/
│
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
│
├── modules/
│   └── auth/
│       ├── auth.controller.ts
│       ├── auth.service.ts
│       ├── auth.module.ts
│       └── dto/
│
└── app.module.ts
```

---

# Documentation

Full project documentation is located in:

```text
../../docs/
```

Available documents:

```text
README_API.md
README_DATABASE.md
README_DEPLOYMENT.md
README_ARCHITECTURE.md
README_TESTING.md
README_ENVIRONMENT.md
README_SECURITY.md
README_CONTRIBUTING.md
CHANGELOG.md
```

---

# Development Workflow

Recommended workflow:

```text
Design
  ↓
Implement
  ↓
Test
  ↓
Verify
  ↓
Document
  ↓
Commit
  ↓
Deploy
```

---

# Security

Current security measures:

```text
✅ JWT Authentication
✅ bcrypt Password Hashing
✅ Environment-Based Secrets
✅ Prisma ORM
✅ Input Validation
✅ Protected Routes
```

---

# Quality Status

```text
Build Status                  ✅
Authentication                ✅
PostgreSQL                    ✅
Prisma ORM                    ✅
Automated Tests               ✅
Documentation                 ✅
Production Foundation         ✅
```

---

# Roadmap

Planned modules:

```text
Users
Roles
Permissions
Stores
Products
Categories
Orders
Payments
Shipping
Notifications
Analytics
Subscriptions
```

---

# MWT Core

Production-ready backend foundation for the Multi World Trade platform.

Built with:

- NestJS
- PostgreSQL
- Prisma
- JWT
- TypeScript