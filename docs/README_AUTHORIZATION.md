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


Users should never be forced to build an authorization system from scratch.

At the same time, advanced organizations should be able to customize every aspect of their internal structure.

Design Goals

The authorization platform must support:

Small vendors
Enterprise organizations
Multiple stores
Multiple employees
Custom organizational structures
Future platform expansion

The system must remain flexible without requiring schema redesign whenever a new feature is added.

Core Concepts

MWT authorization is built around:

User

UserRole

Role

Role Template

Permission

Resource

Action

Authorization Hierarchy
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
 │
 ├── Resource
 └── Action

User

Represents a platform account.

Examples:

Customer

Vendor Owner

Employee

Courier

Administrator

Support Agent


A user may own:

One Role

or

Multiple Roles

Multi-Role Strategy

MWT supports:

One User

Multiple Roles


Example:

User
 ├── Inventory Manager
 ├── Product Manager
 └── Customer Support Agent


Effective permissions are calculated as the union of permissions from all assigned roles.

This architecture allows organizations to model real-world employee responsibilities without requiring multiple accounts.

Effective Permission Resolution

Formula:

Role A Permissions

+

Role B Permissions

+

Role C Permissions

=

Effective Permissions


Duplicate permissions are automatically ignored.

Example:

Role A

products.read

Role B

products.read


Result:

products.read


Only once.

System Roles

System roles are predefined platform roles.

These roles are created automatically and cannot be removed.

Initial System Roles
PLATFORM_ADMIN

CUSTOMER

VENDOR_OWNER

COURIER

SHIPPING_COMPANY_OWNER

Platform Admin

Highest platform authority.

Capabilities:

Manage tenants

Manage global settings

Manage platform permissions

Manage platform users

Access monitoring systems

Customer

Default role assigned during registration.

Capabilities:

Browse products

Place orders

View own orders

Manage own profile

Vendor Owner

Store owner role.

Capabilities:

Create stores

Manage employees

Assign roles

Manage products

Manage inventory

Manage orders

Manage store settings

Courier

Field delivery role.

Capabilities:

View assigned deliveries

Update delivery status

Confirm delivery completion

Shipping Company Owner

Shipping administration role.

Capabilities:

Manage courier accounts

Manage deliveries

Manage shipping operations

Business Roles

Business roles are customizable roles.

These roles belong to organizations.

Examples:

Store Manager

Inventory Manager

Product Manager

Customer Support Agent

Marketing Manager

Warehouse Supervisor

Finance Officer

Custom Roles

Organizations may create custom roles.

Example:

Senior Inventory Specialist


Example permissions:

inventory.read

inventory.update

products.read

reports.read

Role Templates

Role Templates exist to improve user experience.

Users should not be required to build roles manually.

Template Philosophy

Instead of:

Create role from scratch


MWT offers:

Choose Template
↓
Customize
↓
Save

Template Ownership Model

The platform provides default role templates.

Platform administrators define the initial templates.

Examples:

Product Entry Specialist

Inventory Manager

Customer Support Agent

Store Manager


Tenants may:

Clone Templates

Rename Templates

Modify Permissions

Create Custom Roles


Changes made by a tenant affect only that tenant and never modify the original platform template.

This guarantees platform consistency while preserving tenant flexibility.

Examples
Inventory Manager

Default permissions:

products.read

products.update

inventory.read

inventory.update

Customer Support

Default permissions:

customers.read

messages.read

messages.reply

orders.read

Marketing Manager

Default permissions:

campaigns.create

campaigns.update

products.read

analytics.read

Role Naming Strategy

Role names are not enforced by the platform.

The platform provides recommendations only.

Examples:

Product Entry Specialist

Inventory Manager

Customer Support Agent


Tenants may rename roles to match their internal organizational structure.

Examples:

Junior Product Editor

Catalog Operator

Senior Inventory Specialist

Sales Assistant

Customer Care Agent


Role names are organizational labels and do not affect authorization behavior.

Authorization is determined strictly by permissions.

Resources

Permissions are not stored as static strings only.

Every permission belongs to a resource.

Examples:

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

livestreams

Resource-Based Design

MWT uses Resource-Based Authorization.

Example:

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

Actions

Actions describe operations available on a resource.

Standard Actions
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

Future Actions

Modules may introduce additional actions.

Example:

livestream.start

livestream.stop

livestream.moderate


No database redesign should be required.

Permission

A permission is created from:

Resource
+
Action


Example:

products.create

products.read

products.update

products.delete

orders.approve

users.manage

Dynamic Permission Model

Permissions must not be hardcoded throughout the platform.

Modules should declare permissions.

Example:

Products Module


Declares:

products.create

products.read

products.update

products.delete


The authorization system automatically registers them.

Permission Discovery

Future modules will expose metadata.

Example:

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


This prevents permission maintenance from becoming a bottleneck.

Default Permissions

The platform ships with predefined permissions.

Examples:

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

Permission Assignment

Permissions may be assigned through:

Role


and optionally in future:

User Direct Permissions

Direct User Permissions

Future capability.

Example:

User
+
Temporary Permission


Without creating a dedicated role.

Example:

Inventory Manager
+
products.delete

Future Permission Overrides

Future versions of MWT may support:

User Direct Permissions

User Permission Denials


Examples:

Role Grants Permission

User Override Removes Permission

Role Does Not Grant Permission

User Override Grants Permission


This functionality is intentionally postponed to avoid unnecessary complexity during the Core Engine phase.

Feature Entitlements

Authorization grants permission.

Feature Entitlements grant feature availability.

Both checks are required.

Example:

Permission Exists         ✅

Subscription Allows       ✅

Access Granted            ✅

Permission Exists         ✅

Subscription Allows       ❌

Access Denied             ❌


Permissions and Feature Entitlements are separate systems.

Authorization must never implicitly enable paid platform features.

Examples:

Live Streaming

Advanced Analytics

Premium AI Features

Marketplace Advertising

Premium Integrations


A user may have permission to use a feature but still be blocked because the tenant subscription does not include that feature.

Permission Resolution

Effective access is calculated as:

All Assigned Roles

+

Direct Permissions

=

Effective Permissions

Authorization Evaluation Flow
Request
 │
 ▼

Authentication
 │
 ▼

User Retrieved
 │
 ▼

Load User Roles
 │
 ▼

Load Role Permissions
 │
 ▼

Resolve Effective Permissions
 │
 ▼

Permission Check
 │
 ▼

Allow / Deny

Multi-Tenant Authorization

All permissions are tenant-aware.

Example:

Vendor A


Cannot access:

Vendor B


resources.

Permission Scope

Permissions may be limited to:

Platform

Tenant

Store

Department

Store-Level Authorization

Store employees only receive store permissions.

Example:

Store Employee

Products Read

Products Update


Cannot access:

Platform Administration

Permission Escalation Prevention

A role owner cannot grant permissions exceeding their own authority.

Example:

Store Owner


Cannot assign:

platform.admin

Security Rules

The following rules are mandatory.

Rule 1

System roles cannot be deleted.

Rule 2

Platform permissions cannot be assigned by tenants.

Rule 3

Custom roles must remain tenant scoped.

Rule 4

All permission changes must be audited.

Rule 5

Authorization checks must happen server-side.

Never trust client-side checks.

Audit Requirements

Every authorization change must be logged.

Examples:

Role Created

Role Modified

Role Deleted

Permission Assigned

Permission Removed

User Role Changed

Role Cloned

Template Converted To Role

Future Features

Planned capabilities:

Role Cloning

Role Versioning

Permission Groups

Temporary Permissions

Department-Based Permissions

Attribute-Based Access Control (ABAC)

Permission Overrides

Testing Requirements

Authorization changes are critical.

All changes must pass:

Unit Tests

Integration Tests

E2E Tests

Privilege Escalation Tests

Multi-Role Tests

Tenant Isolation Tests

Security Testing

Mandatory test categories:

Unauthorized Access

Cross-Tenant Access

Privilege Escalation

Role Modification

Permission Inheritance

Role Combination

Definition Of Done

Authorization work is not complete until:

Schema Updated                         ✅

Migration Applied                      ✅

Permissions Seeded                     ✅

Multi-Role Architecture Implemented    ✅

Tests Passed                           ✅

Security Review Passed                 ✅

Documentation Updated                  ✅

MWT Authorization Vision

The platform provides ready-to-use role templates for beginners while offering enterprise-grade authorization flexibility for advanced organizations.

Users should never be forced to understand RBAC theory, yet the platform must remain powerful enough to model virtually any organizational structure.

The authorization layer must support small merchants, large enterprises, future subscriptions, premium features, tenant isolation, custom organizational structures, and long-term platform scalability.

Authorization Blueprint Status
Version: 2.0

Status:
APPROVED ARCHITECTURE

Implementation:
MULTI-ROLE FOUNDATION COMPLETED ✅