# 🌍 MWT Environment Configuration Guide

## Overview

This document describes the environment configuration strategy used by the Multi World Trade (MWT) platform.

The purpose of environment configuration is to:

- Separate code from configuration
- Protect sensitive information
- Support multiple deployment environments
- Improve security
- Simplify deployments

---

# Configuration Principles

MWT follows these core principles:

- No secrets in source code
- Environment-specific configuration
- Secure secret management
- Deployment portability
- Infrastructure independence

---

# Environment Types

## Development

Purpose:

```text
Local development
Cloud Shell development
Debugging
Feature implementation
```

File:

```text
.env
```

---

## Staging

Purpose:

```text
Pre-production testing
Release validation
Integration verification
```

File:

```text
.env.staging
```

---

## Production

Purpose:

```text
Live platform usage
Customer traffic
Business operations
```

Configuration Source:

```text
Cloud Run Environment Variables
Secret Management Systems
```

---

# Current Environment Variables

## DATABASE_URL

Purpose:

```text
PostgreSQL database connection string
```

Example:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST/DATABASE?sslmode=require"
```

Used By:

```text
Prisma ORM
Authentication Module
Future Business Modules
```

---

## JWT_SECRET

Purpose:

```text
JWT token signing
JWT token verification
Authentication security
```

Example:

```env
JWT_SECRET="YOUR_SECURE_SECRET"
```

Requirements:

```text
High entropy
Randomly generated
Long enough to resist brute-force attacks
```

---

## PORT

Purpose:

```text
Application listening port
```

Example:

```env
PORT=8080
```

Current Usage:

```text
NestJS Application
Cloud Run Deployment
Docker Container
```

---

# Current .env Example

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST/DATABASE?sslmode=require"

JWT_SECRET="REPLACE_WITH_SECURE_SECRET"

PORT=8080
```

---

# .env.example

The repository should include:

```env
DATABASE_URL=

JWT_SECRET=

PORT=
```

Purpose:

```text
Documentation
Developer onboarding
Environment setup guidance
```

---

# Configuration Loading

MWT uses:

```text
@nestjs/config
```

for centralized configuration management.

---

## Configuration Flow

```text
Environment Variables
         │
         ▼

ConfigModule
         │
         ▼

Application Services
         │
         ▼

Business Logic
```

---

# Security Guidelines

## Never Commit

The following must never be committed:

```text
.env
Secrets
Database passwords
Private keys
API keys
Access tokens
```

---

## Git Ignore

Ensure the following entries exist:

```gitignore
.env
.env.local
.env.production
.env.staging
```

---

# Secret Generation

## JWT Secret

Generate a secure JWT secret using OpenSSL:

```bash
openssl rand -base64 64
```

Or using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

# Environment Validation

Before application startup verify:

- DATABASE_URL exists
- JWT_SECRET exists
- PORT exists

Example validation:

```text
Missing configuration should prevent startup.
```

---

# Configuration by Environment

## Development

```env
NODE_ENV=development

DATABASE_URL=...

JWT_SECRET=...

PORT=8080
```

---

## Staging

```env
NODE_ENV=staging

DATABASE_URL=...

JWT_SECRET=...

PORT=8080
```

---

## Production

```env
NODE_ENV=production

DATABASE_URL=...

JWT_SECRET=...

PORT=8080
```

---

# Docker Environment Variables

Pass environment variables using:

```bash
docker run \
-e DATABASE_URL=... \
-e JWT_SECRET=... \
-e PORT=8080 \
mwt-core
```

---

# Cloud Run Environment Variables

Environment variables can be supplied through:

```text
Google Cloud Run
```

Typical values:

```text
DATABASE_URL
JWT_SECRET
PORT
NODE_ENV
```

---

# Testing Environment

Current test configuration:

```text
Jest
Supertest
Prisma Integration Tests
```

Testing variables:

```env
NODE_ENV=test

DATABASE_URL=...

JWT_SECRET=MWT_TEST_SECRET
```

---

# Environment Verification Checklist

Before running the application:

```text
☑ DATABASE_URL configured

☑ JWT_SECRET configured

☑ PORT configured

☑ .env excluded from Git

☑ Prisma can connect to PostgreSQL

☑ Tests pass successfully
```

---

# Current Environment Status

```text
Database Configuration          ✅
JWT Secret Configuration        ✅
ConfigModule Integration        ✅
Prisma Environment Support      ✅
Development Environment         ✅
Testing Environment             ✅
Production Readiness            ✅
```

---

# Future Improvements

Planned enhancements:

```text
Secret Manager Integration
Cloud Secret Storage
Encrypted Configuration
Environment Validation Layer
Configuration Health Checks
```

---

# Environment Philosophy

MWT environment management follows:

- Security First
- Configuration as Data
- Environment Isolation
- Least Privilege
- Production Readiness

---

# MWT Environment Configuration

A secure and scalable environment management strategy designed for modern cloud-native commerce systems.