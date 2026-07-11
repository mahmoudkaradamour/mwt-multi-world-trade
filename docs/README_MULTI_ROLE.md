# 👥 MWT Multi-Role Architecture

## Overview

This document defines the Multi-Role Architecture used by the Multi World Trade (MWT) platform.

The purpose of this architecture is to allow a single user to hold multiple business responsibilities simultaneously without creating duplicate accounts or duplicating permission structures.

MWT uses a flexible Role-Based Access Control (RBAC) model where permissions are assigned to roles and users may hold one or more roles.

---

# Why Multi-Role Architecture Exists

Real organizations do not operate with a single responsibility per employee.

Examples:

```text
Inventory Manager
+
Customer Support
```

```text
Store Manager
+
Finance Manager
```

```text
Product Manager
+
Marketing Manager
```

A single-role architecture cannot properly represent these real-world scenarios.

---

# Business Objectives

Multi-role support must provide:

```text
Role Reusability

Permission Flexibility

Reduced Administration

Scalable Employee Management

Enterprise Readiness
```

---

# Current Architecture

Legacy architecture:

```text
User
 │
 ▼
Role
 │
 ▼
RolePermission
 │
 ▼
Permission
```

Limitations:

```text
One User

One Role
```

---

# Target Architecture

MWT Multi-Role Architecture:

```text
User
 │
 ▼

UserRole
 │
 ▼

Role
 │
 ▼

RolePermission
 │
 ▼

Permission
```

---

# Core Database Models

## User

Represents system users.

Examples:

```text
Customer

Store Employee

Store Owner

Courier

Administrator
```

---

## Role

Represents a reusable responsibility.

Examples:

```text
Store Manager

Inventory Manager

Customer Support

Finance Manager
```

---

## UserRole

Represents assignment of a role to a user.

Structure:

```text
UserRole

id

userId

roleId

createdAt
```

---

# Relationship Model

One user may have:

```text
1 Role

2 Roles

10 Roles

N Roles
```

One role may belong to:

```text
1 User

100 Users

1000 Users
```

Result:

```text
Many-To-Many Relationship
```

---

# Architecture Diagram

```text
User
 │
 ├─────────────┐
 │             │
 ▼             ▼

UserRole     UserRole
 │             │
 ▼             ▼

Role A       Role B
 │             │
 ▼             ▼

Permissions  Permissions
```

---

# Example Scenarios

## Scenario 1

Employee responsibilities:

```text
Inventory Manager

Customer Support
```

Assigned roles:

```text
Role A

Role B
```

