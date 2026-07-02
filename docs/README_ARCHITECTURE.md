# 🏗 MWT System Architecture

## Overview

This document describes the overall architecture of the Multi World Trade (MWT) platform.

MWT is designed as a scalable, secure, cloud-native, multi-tenant commerce platform capable of supporting vendors, customers, stores, products, orders, payments, and future AI-powered services.

---

# Architectural Principles

The platform is built around the following principles:

- Modularity
- Scalability
- Security
- Maintainability
- Extensibility
- Multi-Tenant Readiness
- Cloud-Native Infrastructure
- Test-Driven Reliability

---

# High-Level Architecture

```text
                           Clients
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼

   Flutter Mobile App     Web Application     Admin Portal

         └─────────────────────┬─────────────────────┘
                               │
                               ▼

                    ┌────────────────────┐
                    │     API Layer      │
                    │       NestJS       │
                    └─────────┬──────────┘
                              │

     ┌────────────────────────┼────────────────────────┐
     │                        │                        │
     ▼                        ▼                        ▼

 Authentication       Business Services        Integrations

     │                        │                        │
     └────────────────────────┼────────────────────────┘
                              │
                              ▼

                      Prisma ORM Layer

                              │

          ┌───────────────────┴───────────────────┐
          ▼                                       ▼

     PostgreSQL                               MongoDB
```

---

# Architecture Style

## Modular Monolith

The current implementation follows a Modular Monolith architecture.

Each business domain is isolated into dedicated modules while remaining inside a single deployable application.

Benefits:

- Faster development
- Easier debugging
- Simpler deployment
- Lower infrastructure complexity
- Clear module boundaries

---

# System Layers

```text
Presentation Layer
        │
        ▼
Controllers
        │
        ▼
Services
        │
        ▼
Data Access Layer
        │
        ▼
Databases
```

---

# Layer Responsibilities

## Presentation Layer

Responsibilities:

- HTTP endpoints
- Request handling
- Request validation
- Response formatting

Technology:

```text
NestJS Controllers
```

---

## Business Layer

Responsibilities:

- Authentication logic
- Business workflows
- Domain-specific rules
- Authorization decisions

Technology:

```text
NestJS Services
```

---

## Data Access Layer

Responsibilities:

- Database communication
- Query execution
- Persistence operations
- ORM abstraction

Technology:

```text
Prisma ORM
```

---

## Storage Layer

Responsibilities:

- Persistent data storage
- Data integrity
- Data retrieval

Technologies:

```text
PostgreSQL
MongoDB
```

---

# Configuration Architecture

Configuration is centralized through environment variables.

Current configuration sources:

```text
.env
Environment Variables
ConfigModule
```

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
```

---

# Current Environment Variables

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

---

# Backend Architecture

Current backend modules:

```text
src/
│
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
│
├── modules/
│   └── auth/
│
└── app.module.ts
```

---

# Current Modules

## Auth Module

Responsibilities:

- User registration
- User authentication
- Password hashing
- JWT generation
- Access control

---

## Prisma Module

Responsibilities:

- Database lifecycle management
- Prisma client exposure
- Database connectivity

---

# Planned Modules

```text
Users Module
Roles Module
Permissions Module
Stores Module
Products Module
Categories Module
Orders Module
OrderItems Module
Payments Module
Coupons Module
Reviews Module
Shipping Module
Notifications Module
Subscriptions Module
Analytics Module
```

---

# Authentication Architecture

```text
Client
   │
   ▼

AuthController
   │
   ▼

AuthService
   │
   ▼

PrismaService
   │
   ▼

PostgreSQL
```

---

# Authentication Workflow

## Registration Flow

```text
User Registration
        │
        ▼

Validate Input
        │
        ▼

Hash Password (bcrypt)
        │
        ▼

Store User (Prisma)
        │
        ▼

PostgreSQL
```

---

## Login Flow

```text
User Login
      │
      ▼

Find User By Email
      │
      ▼

Validate Password
      │
      ▼

Generate JWT
      │
      ▼

Return Access Token
```

---

# Security Architecture

## Authentication

Technology:

```text
JWT
```

Purpose:

```text
Stateless authentication
```

---

## Password Protection

Technology:

```text
bcrypt
```

Purpose:

```text
Secure password hashing
```

---

## Secret Management

Secrets are loaded from environment variables.

Examples:

```env
JWT_SECRET=
DATABASE_URL=
```

Secrets are never hardcoded inside application logic.

---

# Data Architecture

MWT uses a dual-database strategy.

---

## PostgreSQL

Primary transactional database.

Stores:

```text
Users
Roles
Permissions
Stores
Orders
Payments
Invoices
Shipments
Subscriptions
```

---

## MongoDB

Flexible document storage.

Planned usage:

```text
Products
Product Variants
Product Specifications
Logs
Analytics
Recommendation Data
```

---

# Current Database Model

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

---

# Multi-Tenant Strategy

MWT is designed as a multi-tenant platform.

Future entities will include:

```text
tenant_id
```

Example:

```text
Tenant
 ├─ Users
 ├─ Stores
 ├─ Products
 ├─ Orders
 └─ Payments
```

---

# Mobile Architecture

Technology:

```text
Flutter
```

Targets:

```text
Android
iOS
```

---

# Web Architecture

Planned technologies:

```text
Next.js
React
TypeScript
```

Applications:

```text
Admin Portal
Vendor Dashboard
Customer Portal
```

---

# API Architecture

MWT follows REST principles.

Examples:

```http
POST /auth/register
POST /auth/login

GET /auth/profile
GET /products

POST /orders
PUT /orders/{id}
DELETE /orders/{id}
```

---

# Testing Architecture

Current testing coverage includes:

```text
Authentication Testing
Database Testing
User Testing
```

Automation:

```text
Jest
Supertest
Prisma Integration Tests
```

---

# Test Coverage Status

```text
Authentication E2E      ✅
Database E2E            ✅
User E2E                ✅

Total:
21 / 21 Tests Passed
```

---

# Deployment Architecture

```text
GitHub
   │
   ▼

Cloud Build
   │
   ▼

Docker
   │
   ▼

Artifact Registry
   │
   ▼

Cloud Run
   │
   ▼

Production Environment
```

---

# Scalability Strategy

Current Stage:

```text
Modular Monolith
```

Future Evolution:

```text
Modular Monolith
        ↓
Domain Extraction
        ↓
Selective Microservices
```

Potential future candidates:

```text
Payments
Notifications
Analytics
Search
Recommendations
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
│   ├── README_API.md
│   ├── README_DATABASE.md
│   ├── README_DEPLOYMENT.md
│   ├── README_ARCHITECTURE.md
│   ├── README_TESTING.md
│   └── CHANGELOG.md
│
├── mobile/
├── web/
└── infrastructure/
```

---

# Current Architecture Status

```text
NestJS Backend                 ✅
Prisma ORM                     ✅
PostgreSQL                     ✅
JWT Authentication             ✅
ConfigModule                   ✅
Environment-Based Secrets      ✅
Automated E2E Testing          ✅
Modular Architecture           ✅
Documentation Suite            ✅

MongoDB Integration            Planned
Store Management               Planned
Product Catalog                Planned
Orders System                  Planned
Payments System                Planned
Multi-Tenant Isolation         Planned
```

---

# Architectural Vision

MWT aims to become a globally scalable commerce platform capable of supporting millions of users, vendors, stores, products, and transactions while maintaining clean architecture, security, and long-term maintainability.

---

# MWT Architecture

Building a secure, scalable, and extensible foundation for next-generation multi-vendor commerce.