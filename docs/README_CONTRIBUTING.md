# 🤝 Contributing to MWT

## Overview

Thank you for contributing to the Multi World Trade (MWT) platform.

This document defines the development standards, contribution workflow, coding conventions, documentation requirements, and quality expectations for all contributors.

The goal is to maintain:

- Code quality
- Architectural consistency
- Security standards
- Documentation quality
- Long-term maintainability

---

# Guiding Principles

Every contribution should follow:

- Simplicity
- Consistency
- Security
- Scalability
- Maintainability
- Testability

---

# Development Workflow

All changes should follow the workflow below:

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

Push
```

---

# Repository Structure

```text
mwt-multi-world-trade/
│
├── backend/
│   └── core/
│
├── docs/
│
├── mobile/
│
├── web/
│
└── infrastructure/
```

---

# Development Standards

## Language

### Documentation

All technical documentation must be written in:

```text
English only
```

Examples:

```text
README files
Code comments
API documentation
Architecture documentation
Testing documentation
```

---

### Source Code

Use:

```text
English only
```

Examples:

```text
Variables
Functions
Classes
Modules
Database models
```

---

# Code Style

All TypeScript code should follow:

- TypeScript best practices
- SOLID principles
- Clean Code principles
- NestJS conventions

---

## Naming Conventions

### Classes

```ts
UserService
AuthController
PrismaModule
```

---

### Methods

```ts
createUser()
login()
findUserByEmail()
```

---

### Variables

```ts
userEmail
hashedPassword
accessToken
```

---

### Constants

```ts
MAX_LOGIN_ATTEMPTS
JWT_EXPIRATION_TIME
```

---

# NestJS Module Structure

Expected structure:

```text
module/
├── controller
├── service
├── dto
├── guards
├── decorators
├── interfaces
└── tests
```

---

# Database Standards

## PostgreSQL

Structured business data belongs in:

```text
PostgreSQL
```

Examples:

```text
Users
Orders
Payments
Stores
Roles
Permissions
```

---

## MongoDB

Flexible document data belongs in:

```text
MongoDB
```

Examples:

```text
Products
Product Variants
Analytics
Logs
Recommendations
```

---

# Prisma Standards

Schema changes must always follow:

```text
Update Schema
      ↓

Generate Client
      ↓

Run Migration
      ↓

Test
      ↓

Commit
```

---

## Example

```bash
npx prisma generate

npx prisma migrate dev --name update_name
```

---

# Security Requirements

Contributors must never commit:

```text
.env
Secrets
API Keys
Private Keys
Database Credentials
```

---

## Sensitive Data

Never expose:

```text
Passwords
JWT Secrets
Database Passwords
Access Tokens
```

---

# Testing Requirements

All functional changes must be tested.

---

## Minimum Requirements

```text
Build Success
E2E Tests Pass
No TypeScript Errors
```

---

## Required Verification

```bash
npm run build

npm run test:e2e
```

---

## Current Test Status Target

```text
100% Passing Tests
```

No pull request should be merged with failing tests.

---

# Documentation Requirements

Documentation must be updated whenever:

- API changes
- Database changes
- Architecture changes
- Deployment changes
- Security changes

---

## Documentation Files

```text
README_API.md
README_DATABASE.md
README_DEPLOYMENT.md
README_ARCHITECTURE.md
README_TESTING.md
README_ENVIRONMENT.md
README_SECURITY.md
CHANGELOG.md
```

---

# Commit Message Guidelines

Use clear and descriptive commit messages.

---

## Good Examples

```text
Add Prisma integration

Implement JWT authentication

Create user database model

Add E2E authentication tests

Improve deployment documentation
```

---

## Avoid

```text
fix

update

changes

work
```

---

# Version Control Rules

Before committing:

```bash
git status
```

Verify:

```text
No secrets included
No temporary files included
Documentation updated
Tests passing
```

---

# Pull Request Checklist

Before submitting changes:

```text
☑ Feature implemented

☑ Code reviewed

☑ Build successful

☑ Tests successful

☑ Documentation updated

☑ No secrets committed

☑ Changelog updated
```

---

# Architecture Compliance

New features should respect:

```text
Controllers
     ↓

Services
     ↓

Prisma
     ↓

Database
```

Business logic must remain inside services.

Controllers should remain thin.

---

# Error Handling Standards

Use structured errors.

Avoid:

```ts
return "Error";
```

Prefer:

```ts
throw new BadRequestException();
```

---

# Future Contribution Areas

Planned areas of contribution:

```text
RBAC
Store Management
Product Catalog
Orders
Payments
Shipping
Notifications
Analytics
Multi-Tenant Features
```

---

# Quality Standards

Every contribution should maintain:

```text
Security
Reliability
Scalability
Readability
Maintainability
```

---

# Definition of Done

A task is considered complete only when:

```text
Code Implemented          ✅
Build Successful          ✅
Tests Passed              ✅
Documentation Updated     ✅
Changelog Updated         ✅
Security Reviewed         ✅
```

---

# Contributor Responsibility

Every contributor is responsible for preserving the quality, security, and architectural integrity of the MWT platform.

---

# MWT Contribution Philosophy

Build carefully.
Test thoroughly.
Document continuously.
Maintain quality always.