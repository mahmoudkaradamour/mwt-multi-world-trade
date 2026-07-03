# 🎭 MWT Role Templates Architecture

## Overview

This document defines the Role Template architecture used by the Multi World Trade (MWT) platform.

Role Templates provide predefined authorization blueprints that allow organizations to quickly establish secure and predictable employee roles while preserving complete customization freedom.

The system is designed around:

```text
Smart Defaults
+
Zero Cognitive Load
+
Unlimited Customization
+
Enterprise Scalability
```

---

# Mission

Role Templates exist to solve one major problem:

```text
Most users are not authorization experts.
```

A merchant should not be required to understand:

- RBAC
- Permission Models
- Resource-Based Authorization
- Security Architecture

before being able to create employees and start working.

---

# Design Principles

MWT follows:

```text
Ready To Use

+

Customizable

+

Never Restrictive
```

The platform provides professionally designed templates while preserving complete flexibility.

---

# Core Philosophy

Users should be able to:

```text
Choose Template

↓

Review Permissions

↓

Customize

↓

Save

↓

Assign To Employee
```

without ever needing to start from an empty configuration.

---

# Authorization Stack

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

Role Templates serve as predefined role blueprints.

---

# Template Lifecycle

```text
System Template
       │
       ▼

Clone Template
       │
       ▼

Customize
       │
       ▼

Create Actual Role
       │
       ▼

Assign To User
```

---

# Role Categories

MWT defines two categories of roles.

---

## System Roles

Platform-controlled roles.

Characteristics:

```text
Cannot Be Deleted

Cannot Be Modified By Tenants

Security Critical

Platform Managed
```

---

### System Roles

```text
PLATFORM_ADMIN

CUSTOMER

VENDOR_OWNER

COURIER

SHIPPING_COMPANY_OWNER
```

---

## Business Role Templates

Organization-level templates.

Characteristics:

```text
Reusable

Cloneable

Customizable

Tenant Friendly
```

---

# Default Templates

The platform provides built-in templates.

---

## Store Manager

Purpose:

```text
General store administration.
```

Default permissions:

```text
stores.read
stores.update

products.read
products.create
products.update

orders.read
orders.update

inventory.read

reports.read
```

---

## Inventory Manager

Purpose:

```text
Inventory and stock operations.
```

Default permissions:

```text
products.read

inventory.read
inventory.update

reports.read
```

Restricted by default:

```text
products.delete

users.manage

store.settings
```

---

## Product Manager

Purpose:

```text
Product catalog management.
```

Default permissions:

```text
products.read

products.create

products.update
```

Restricted:

```text
products.delete

users.manage
```

---

## Customer Support

Purpose:

```text
Customer communication and support.
```

Default permissions:

```text
messages.read

messages.reply

orders.read
```

Restricted:

```text
payments.refund

users.manage
```

---

## Marketing Manager

Purpose:

```text
Marketing and campaign activities.
```

Default permissions:

```text
products.read

reports.read
```

Future:

```text
campaigns.read
campaigns.create
campaigns.update

analytics.read
```

---

## Finance Manager

Purpose:

```text
Financial oversight and reporting.
```

Default permissions:

```text
orders.read

reports.read

reports.export
```

Restricted:

```text
users.manage

products.delete
```

---

## Warehouse Supervisor

Purpose:

```text
Warehouse operations and stock supervision.
```

Default permissions:

```text
inventory.read

inventory.update

products.read
```

Future:

```text
shipments.read

shipments.update
```

---

# Template Permission Mapping

Templates are assigned permissions through:

```text
RoleTemplate
          │
          ▼

RoleTemplatePermission
          │
          ▼

Permission
```

The mapping is seeded automatically by the platform.

---

# Resource-Based Authorization

Permissions are generated from:

```text
Resource
+
Action
```

Examples:

```text
products.create

products.read

products.update

orders.read

reports.export
```

---

# Template Customization

Users may:

```text
Add Permissions

Remove Permissions

Rename Roles

Clone Templates

Create New Roles
```

without modifying the original template.

---

# Custom Roles

Organizations may create roles completely from scratch.

Example:

```text
Senior Inventory Coordinator
```

Permissions:

```text
inventory.read

inventory.update

products.read

reports.read
```

---

# Template Cloning

Template cloning creates an independent role.

Example:

```text
Inventory Manager
```

Clone:

```text
Inventory Manager Plus
```

Changes:

```text
Add reports.export

Remove inventory.update
```

Result:

```text
Custom Role
```

---

# Permission Ownership Rules

Permissions are reusable.

The same permission may belong to:

```text
Multiple Templates

Multiple Roles
```

without duplication.

---

# Security Principles

All templates must follow:

```text
Least Privilege Principle
```

Meaning:

```text
Only permissions required for a role are granted.
```

---

# Permission Escalation Prevention

Users cannot grant permissions beyond their authority.

Example:

```text
Vendor Owner
```

cannot grant:

```text
PLATFORM_ADMIN
```

permissions.

---

# Multi-Tenant Isolation

Templates must remain tenant scoped.

Example:

```text
Tenant A
```

cannot modify:

```text
Tenant B Templates
```

---

# Future Multi-Role Support

Future architecture allows:

```text
One User

Multiple Roles
```

Example:

```text
Inventory Manager

+

Customer Support
```

Effective permissions become:

```text
Union Of All Assigned Permissions
```

---

# Auditing Requirements

Every template action must be logged.

Examples:

```text
Template Created

Template Modified

Template Cloned

Permission Added

Permission Removed
```

---

# Testing Requirements

Role Template validation must include:

```text
Template Creation

Template Retrieval

Template Permission Mapping

Duplicate Prevention

Cascade Deletes

Integrity Validation

Permission Relationship Validation
```

---

# Current Database Models

Implemented:

```text
User

Role

Permission

RolePermission

RoleTemplate

RoleTemplatePermission
```

---

# Current Implementation Status

```text
RoleTemplate Model              ✅

RoleTemplatePermission Model    ✅

Template Seeding               ✅

Template Permission Mapping    ✅

Template Testing               ✅

Authorization Integration      ✅
```

---

# Future Enhancements

Planned:

```text
Role Marketplace

Industry Role Packs

Template Import

Template Export

Role Versioning

Department Roles

Role Inheritance

UserRole Model

Direct User Permissions
```

---

# MWT Vision

Role Templates provide immediate productivity for new users while preserving enterprise-grade flexibility for advanced organizations.

The platform should guide beginners with safe defaults while allowing experts to model virtually any internal organizational structure.