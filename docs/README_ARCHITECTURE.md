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
- Profile retrieval
- Authorization
- Permission resolution
- Multi-role support
- Role assignment
- Role validation
- Future privilege escalation protection

---

## Prisma Module

Responsibilities:

- Database lifecycle management
- Prisma client exposure
- Database connectivity

---

# Planned Modules

```text
Tenant Module
Organization Module
Store Module
Catalog Module
Inventory Module
Customer Module
Cart Module
Order Module
Payment Module
Shipping Module
Notification Module
Search Module
Analytics Module
Media Module
Events Module
Audit Module
I18N Module
SEO Module
Theme Module
Dynamic Configuration Module
Governance Module
Plugin Module
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

# Authorization Architecture

MWT implements Role-Based Access Control (RBAC).

Current authorization hierarchy:

User
 ↓
UserRole
 ↓
Role
 ↓
RolePermission
 ↓
Permission

Permissions follow:

Resource.Action

Examples:

users.read
users.create
products.update
orders.manage
store.approve

---

# Multi-Role Architecture

MWT supports assigning multiple roles to the same user.

Architecture:

User
 ↓
UserRole
 ↓
Role

Example:

User
├── Inventory Manager
├── Product Manager
└── Customer Support

Effective permissions are calculated as the union of permissions granted by all assigned roles.

Duplicate role assignments are prohibited.

---

# Role Assignment Architecture

Role assignment is handled through a dedicated service layer.

Role Assignment Service Responsibilities:

- Assign Role
- Remove Role
- List User Roles
- Validate Assignments
- Prevent Duplicate Assignments

Current validations:

- User Exists
- Role Exists
- Duplicate Prevention

Future validations:

- Privilege Escalation Protection
- Tenant Scope Validation
- Store Scope Validation
- Audit Logging

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

Current Core Models

User
Role
UserRole
Permission
RolePermission
RoleTemplate
RoleTemplatePermission


ثم رسم:

User
 ↓
UserRole
 ↓
Role
 ↓
RolePermission
 ↓
Permission

RoleTemplate
 ↓
RoleTemplatePermission
 ↓
Permission

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
Authorization Testing
Permission Testing
Role Permission Testing
Role Template Testing
UserRole Testing
Role Assignment Testing
User Testing
Database Testing
```

Automation:

```text
Jest
Supertest
Prisma Integration Tests
```

---

# Test Coverage Status

Latest Verified Quality Gate

```text
Authentication E2E           ✅
Authorization E2E            ✅
Permission E2E               ✅
Permission Guard E2E         ✅
Role Permission E2E          ✅
Role Template E2E            ✅
User Role E2E                ✅
Role Assignment E2E          ✅
User E2E                     ✅
Database E2E                 ✅

Test Suites:
10 / 10 Passed

Tests:
105 / 105 Passed
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
NestJS Backend                          ✅
Prisma ORM                              ✅
PostgreSQL                              ✅
JWT Authentication                      ✅
User Management                         ✅
Role System                             ✅
Permission System                       ✅
RolePermission System                   ✅
Authorization Service                   ✅
Permission Guard                        ✅
Role Templates                          ✅
Role Template Permissions               ✅
Multi-Role Architecture                 ✅
UserRole Model                          ✅
Role Assignment Engine                  ✅
Automated E2E Testing                   ✅
Modular Architecture                    ✅
Documentation Suite                     ✅

Tenant Foundation                       Planned
Security Foundation                     Planned
Audit System                            Planned
Internationalization                    Planned
SEO Foundation                          Planned
Commerce Engine                         Planned
Plugin Architecture                     Planned
API Stabilization                       Planned
```

---

# Core Engine Roadmap

The official execution tracker for backend development is:

docs/CORE_ENGINE_ROADMAP.md

All backend phases must follow:

Design
↓
Document
↓
Implement
↓
Migrate
↓
Seed
↓
Test
↓
Verify
↓
Update Documentation
↓
Commit
↓
Push
↓
Mark Completed

---

# Architectural Vision

MWT aims to become a globally scalable commerce platform capable of supporting millions of users, vendors, stores, products, and transactions while maintaining clean architecture, security, and long-term maintainability.

---

# MWT Architecture

Building a secure, scalable, and extensible foundation for next-generation multi-vendor commerce.