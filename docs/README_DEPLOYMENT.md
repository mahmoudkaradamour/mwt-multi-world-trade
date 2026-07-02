# 🚀 MWT Deployment Guide

## Overview

This document describes the deployment architecture, deployment procedures, environment configuration, and operational guidelines for the Multi World Trade (MWT) platform.

The deployment strategy is designed to support:

- Cloud-native infrastructure
- Continuous delivery
- Secure configuration management
- Automated deployments
- Production scalability
- High availability

---

# Deployment Architecture

```text
Developer
    │
    ▼

Git Commit
    │
    ▼

GitHub Repository
    │
    ▼

Cloud Build
    │
    ▼

Docker Image
    │
    ▼

Artifact Registry
    │
    ▼

Cloud Run
    │
    ▼

Production Environment
    │
    ▼

PostgreSQL (Neon)
```

---

# Current Infrastructure

| Component | Technology |
|------------|------------|
| Source Control | GitHub |
| Backend Framework | NestJS |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Authentication | JWT |
| Containerization | Docker |
| Build System | Google Cloud Build |
| Container Registry | Artifact Registry |
| Runtime Platform | Google Cloud Run |
| Testing Framework | Jest |

---

# Deployment Environments

## Development

Purpose:

```text
Local development
Feature implementation
Testing
Debugging
```

Environment:

```text
Cloud Shell
Local machine
```

---

## Production

Purpose:

```text
Public platform usage
Business operations
Customer access
```

Environment:

```text
Google Cloud Run
```

---

# Repository Information

Official Repository:

```text
https://github.com/mahmoudkaradamour/mwt-multi-world-trade
```

Default Branch:

```text
main
```

---

# Application Runtime

Current application runtime:

```text
NestJS
Node.js
```

Application Port:

```text
8080
```

---

# Environment Variables

## Required Variables

The following variables are required for application startup.

### Database

```env
DATABASE_URL=
```

Example:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST/DATABASE?sslmode=require"
```

---

### JWT Secret

```env
JWT_SECRET=
```

Purpose:

```text
JWT token signing
JWT token verification
Authentication security
```

---

### Port

```env
PORT=8080
```

---

# Environment Configuration

Example `.env`

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST/DATABASE?sslmode=require"

JWT_SECRET="REPLACE_WITH_SECURE_SECRET"

PORT=8080
```

---

# Security Guidelines

## Never Commit

The following files must never be committed:

```text
.env
Private keys
API keys
Database passwords
Service credentials
```

---

## Git Ignore

Ensure:

```gitignore
.env
node_modules
dist
coverage
```

are excluded from version control.

---

# Docker

MWT uses Docker containers to ensure consistent deployments.

---

## Build Docker Image

From:

```text
backend/core
```

Run:

```bash
docker build -t mwt-core .
```

---

## Run Docker Container

```bash
docker run -p 8080:8080 mwt-core
```

---

# Prisma Deployment Workflow

Whenever schema changes occur:

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Create Migration

```bash
npx prisma migrate dev --name migration_name
```

---

## Production Migration

```bash
npx prisma migrate deploy
```

---

## Verify Migration Status

```bash
npx prisma migrate status
```

---

# Build Verification

Before deployment always execute:

```bash
npm run build
```

Expected Result:

```text
Build successful
No TypeScript errors
```

---

# Automated Testing

Before deployment execute:

```bash
npm run test:e2e
```

Current Result:

```text
Test Suites: 3 passed
Tests: 21 passed
```

---

# Deployment Procedure

## Step 1

Verify build.

```bash
npm run build
```

---

## Step 2

Verify tests.

```bash
npm run test:e2e
```

---

## Step 3

Commit changes.

```bash
git add .
git commit -m "Deployment update"
```

---

## Step 4

Push changes.

```bash
git push
```

---

## Step 5

Trigger Cloud Build.

```bash
gcloud builds submit --config cloudbuild.yaml
```

---

## Step 6

Verify deployment.

```bash
curl https://SERVICE_URL
```

---

# Cloud Build

Configuration File:

```text
cloudbuild.yaml
```

Location:

```text
mwt-multi-world-trade/cloudbuild.yaml
```

Responsibilities:

- Build application
- Build Docker image
- Push container image
- Deploy Cloud Run service

---

# Artifact Registry

Purpose:

```text
Docker image storage
Versioned image management
Deployment source
```

---

# Cloud Run

Purpose:

```text
Production application hosting
```

Benefits:

```text
Serverless
Auto Scaling
HTTPS
Managed Infrastructure
Pay-per-use
```

---

# Database Deployment

Current Provider:

```text
Neon PostgreSQL
```

Connection Type:

```text
SSL
```

ORM Layer:

```text
Prisma
```

---

# Health Verification

After deployment verify:

---

## Authentication

```text
Register Endpoint
Login Endpoint
JWT Generation
Protected Routes
```

---

## Database

```text
Connection Success
Prisma Access
Migration Status
User Persistence
```

---

## Application Startup

Verify logs contain:

```text
Nest application successfully started
```

---

# Monitoring Roadmap

Future monitoring stack:

```text
Cloud Logging
Cloud Monitoring
Application Metrics
Error Tracking
Performance Analytics
```

---

# Backup Strategy

Future implementation:

```text
Automated Backups
Point-in-Time Recovery
Cross-Region Recovery
Disaster Recovery Procedures
```

---

# Release Checklist

Before every deployment:

```text
☑ Build Successful

☑ Tests Successful

☑ Database Migrations Applied

☑ Prisma Client Generated

☑ Documentation Updated

☑ Git Changes Committed

☑ Git Changes Pushed

☑ Environment Variables Verified
```

---

# Current Deployment Status

```text
GitHub Repository                 ✅
NestJS Backend                    ✅
Docker Configuration              ✅
Cloud Build Pipeline              ✅
Artifact Registry                 ✅
Cloud Run Deployment              ✅
PostgreSQL Integration            ✅
Prisma ORM                        ✅
JWT Authentication                ✅
Environment Variables             ✅
Automated E2E Tests               ✅
21 / 21 Tests Passed              ✅
```

---

# Deployment Philosophy

MWT deployment follows:

- Security First
- Build Before Deploy
- Test Before Release
- Infrastructure Automation
- Continuous Delivery
- Production Reliability

---

# MWT Deployment

A cloud-native deployment architecture designed for a scalable, secure, and production-ready multi-vendor commerce platform.