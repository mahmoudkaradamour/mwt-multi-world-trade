# 🔐 MWT Authorization Architecture

## Overview

This document defines the complete authorization architecture of the Multi World Trade (MWT) platform.

Authorization is responsible for determining:

- Who can access a resource
- What actions can be performed
- Which permissions are granted
- How permissions are inherited
- How organizations build their internal hierarchy
- How platform-wide security is enforced

This document serves as the official reference for all future authorization development.

---

# Authorization Philosophy

MWT follows the following principle:

```text
Smart Defaults
+
Unlimited Customization
+
Zero Cognitive Load
+
Enterprise-Level Security
```

Users should never be forced to build an authorization system from scratch.

At the same time, advanced organizations should be able to customize every aspect of their internal structure.

---

# Design Goals

The authorization platform must support:

- Small vendors
- Enterprise organizations
- Multiple stores
- Multiple employees
- Custom organizational structures
- Future platform expansion

The system must remain flexible without requiring schema redesign whenever a new feature is added.

---

# Core Concepts

MWT authorization is built around:

```text
User
Role
Role Template
Permission
Resource
Action
```

---

# Authorization Hierarchy

```text
User
 │
 ├── UserRole
 │
 ▼

Role
 │
 ├── RolePermission
 │
 ▼

Permission
 │
 ├── Resource
 └── Action
```

---

# User

Represents a platform account.

Examples:

```text
Customer
Vendor Owner
Employee
Courier
Administrator
Support Agent
```

A user may own:

```text
One Role
or
Multiple Roles
```

---

# Multi-Role Strategy

MWT supports:

```text
One User
Multiple Roles
```

Example:

```text
User
 ├── Inventory Manager
 └── Support Agent
```

Effective permissions are the union of all assigned roles.

---

# System Roles

System roles are predefined platform roles.

These roles are created automatically and cannot be removed.

---

## Initial System Roles

```text
PLATFORM_ADMIN

CUSTOMER

VENDOR_OWNER

COURIER

SHIPPING_COMPANY_OWNER
```

---

## Platform Admin

Highest platform authority.

Capabilities:

```text
Manage tenants
Manage global settings
Manage platform permissions
Manage platform users
Access monitoring systems
```

---

## Customer

Default role assigned during registration.

Capabilities:

```text
Browse products
Place orders
View own orders
Manage own profile
```

---

## Vendor Owner

Store owner role.

Capabilities:

```text
Create stores
Manage employees
Assign roles
Manage products
Manage inventory
Manage orders
Manage store settings
```

---

## Courier

Field delivery role.

Capabilities:

```text
View assigned deliveries
Update delivery status
Confirm delivery completion
```

---

## Shipping Company Owner

Shipping administration role.

Capabilities:

```text
Manage courier accounts
Manage deliveries
Manage shipping operations
```

---

# Business Roles

Business roles are customizable roles.

These roles belong to organizations.

Examples:

```text
Store Manager

Inventory Manager

Product Manager

Customer Support Agent

Marketing Manager

Warehouse Supervisor

Finance Officer
```

---

# Custom Roles

Users may create custom roles.

Example:

```text
Senior Inventory Specialist
```

Example permissions:

```text
inventory.read
inventory.update

products.read

reports.read
```

---

# Role Templates

Role Templates exist to improve user experience.

Users should not be required to build roles manually.

---

## Template Philosophy

Instead of:

```text
Create role from scratch
```

MWT offers:

```text
Choose Template
↓
Customize
↓
Save
```

---

## Examples

### Inventory Manager

Default permissions:

```text
Products Read
Products Update

Inventory Read
Inventory Update
```

---

### Customer Support

Default permissions:

```text
Customers Read

Messages Read
Messages Reply

Orders Read
```

---

### Marketing Manager

Default permissions:

```text
Campaigns Create
Campaigns Update

Products Read

Analytics Read
```

---

# Resources

Permissions are not stored as static strings only.

Every permission belongs to a resource.

Examples:

```text
users

stores

products

inventory

orders

customers

payments

messages

reviews

reports

analytics

campaigns
```

---

# Resource-Based Design

MWT uses Resource-Based Authorization.

Example:

```text
Resource:
Products

Allowed Actions:
Create
Read
Update
Delete
Publish
Archive
Export
```

---

# Actions

Actions describe operations available on a resource.

---

## Standard Actions

```text
create

read

update

delete

assign

approve

publish

archive

export

manage
```

---

## Future Actions

Modules may introduce additional actions.

Example:

```text
livestream.start

livestream.stop

livestream.moderate
```

No database redesign should be required.

---

# Permission

A permission is created from:

```text
Resource
+
Action
```

Example:

```text
products.create

products.read

products.update

products.delete

orders.approve

users.manage
```

---

# Dynamic Permission Model

Permissions must not be hardcoded throughout the platform.

Modules should declare permissions.

Example:

```text
Products Module
```

Declares:

```text
products.create

products.read

products.update

products.delete
```

The authorization system automatically registers them.

---

# Permission Discovery

Future modules will expose metadata.

Example:

```text
Module
 │
 ▼

Resources
 │
 ▼

Actions
 │
 ▼

Permission Registry
```

This prevents permission maintenance from becoming a bottleneck.

---

# Default Permissions

The platform ships with predefined permissions.

Examples:

```text
users.read
users.create
users.update
users.delete

products.read
products.create
products.update
products.delete

orders.read
orders.update
orders.approve

messages.read
messages.reply
```

---

# Permission Assignment

Permissions may be assigned through:

```text
Role
```

and optionally in future:

```text
User Direct Permissions
```

---

# Direct User Permissions

Future capability.

Example:

```text
User
+
Temporary Permission
```

Without creating a dedicated role.

Example:

```text
Inventory Manager
+
products.delete
```

---

# Permission Resolution

Effective access is calculated as:

```text
All Assigned Roles

+
Direct Permissions

=
Effective Permissions
```

---

# Authorization Evaluation Flow

```text
Request
 │
 ▼

Authentication

 │
 ▼

User Retrieved

 │
 ▼

Load Roles

 │
 ▼

Load Permissions

 │
 ▼

Permission Check

 │
 ▼

Allow / Deny
```

---

# Multi-Tenant Authorization

All permissions are tenant-aware.

Example:

```text
Vendor A
```

Cannot access:

```text
Vendor B
```

resources.

---

# Permission Scope

Permissions may be limited to:

```text
Platform

Tenant

Store

Department
```

---

# Store-Level Authorization

Store employees only receive store permissions.

Example:

```text
Store Employee

Products Read
Products Update
```

Cannot access:

```text
Platform Administration
```

---

# Permission Escalation Prevention

A role owner cannot grant permissions exceeding their own authority.

Example:

```text
Store Owner
```

Cannot assign:

```text
platform.admin
```

---

# Security Rules

The following rules are mandatory:

---

## Rule 1

System roles cannot be deleted.

---

## Rule 2

Platform permissions cannot be assigned by tenants.

---

## Rule 3

Custom roles must remain tenant scoped.

---

## Rule 4

All permission changes must be audited.

---

## Rule 5

Authorization checks must happen server-side.

Never trust client-side checks.

---

# Audit Requirements

Every authorization change must be logged.

Examples:

```text
Role Created

Role Modified

Role Deleted

Permission Assigned

Permission Removed

User Role Changed
```

---

# Future Features

Planned capabilities:

```text
Role Cloning

Role Versioning

Permission Groups

Temporary Permissions

Department-Based Permissions

Attribute-Based Access Control (ABAC)
```

---

# Testing Requirements

Authorization changes are critical.

All changes must pass:

```text
Unit Tests

Integration Tests

E2E Tests

Privilege Escalation Tests

Multi-Role Tests

Tenant Isolation Tests
```

---

# Security Testing

Mandatory test categories:

```text
Unauthorized Access

Cross-Tenant Access

Privilege Escalation

Role Modification

Permission Inheritance

Role Combination
```

---

# Definition of Done

Authorization work is not complete until:

```text
Schema Updated ✅

Migration Applied ✅

Permissions Seeded ✅

Tests Passed ✅

Security Review Passed ✅

Documentation Updated ✅
```

---

# MWT Authorization Vision

The platform provides ready-to-use role templates for beginners while offering enterprise-grade authorization flexibility for advanced organizations.

Users should never be forced to understand RBAC theory, yet the platform must remain powerful enough to model virtually any organizational structure.

---

# Authorization Blueprint Status

```text
Version: 1.0

Status:
APPROVED ARCHITECTURE

Implementation:
IN PROGRESS
```