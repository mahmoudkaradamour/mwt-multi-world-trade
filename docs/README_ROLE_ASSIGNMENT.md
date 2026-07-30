# MWT Role Assignment Engine

## Overview

This document defines the Role Assignment Engine architecture for MWT (Multi World Trade).

The Role Assignment Engine is responsible for controlling how roles are assigned, removed, validated, and managed across the platform.

Its primary objective is to ensure that role management remains secure, auditable, maintainable, scalable, and compatible with future tenant-based authorization models.

The Role Assignment Engine serves as the enforcement layer between authorization data structures and real-world organizational operations.

---

# Why This Engine Exists

MWT already supports:

```text
User
↓
UserRole
↓
Role
↓
RolePermission
↓
Permission


However, having role relationships stored in the database is not sufficient.

The platform must control:

Who can assign roles
Who can remove roles
Who can view assigned roles
How assignments are validated
How invalid assignments are prevented
How privilege escalation is avoided


Without a dedicated assignment engine:

Authorization Exists ✅

Permission Resolution Exists ✅

Secure Role Administration ❌


This phase closes that gap.

Objectives

The Role Assignment Engine must provide:

Secure role assignment
Secure role removal
User role retrieval
Assignment validation
Duplicate prevention
Future privilege escalation protection
Future tenant-aware assignment support
Future audit integration
Core Principles

MWT follows:

Least Privilege

Explicit Authorization

Separation Of Responsibility

Future Tenant Isolation

Future Auditability

Enterprise Security


Role assignment must never be performed through direct database manipulation.

Every assignment must pass through a dedicated business service.

Architecture Position

The Role Assignment Engine sits between users and authorization records.

Administrator
        ↓

Role Assignment Engine
        ↓

UserRole Records
        ↓

Authorization Resolution
        ↓

Permissions


This guarantees that all assignments follow the same validation rules.

Initial Scope

Phase 2 implementation includes:

Assign Role

Remove Role

List User Roles

Validate Assignment

Prevent Duplicate Assignment

Validate User Existence

Validate Role Existence

Future Scope

Future phases will extend the engine with:

Privilege Escalation Protection

Tenant Restrictions

Store Restrictions

Role Assignment Policies

Approval Workflows

Assignment Delegation

Audit Logging

Temporary Role Assignments

Expiration-Based Assignments


These are intentionally postponed until their foundational phases are completed.

Service Responsibilities

Primary service:

RoleAssignmentService


The service becomes the single authority for managing role assignments.

No other service should directly create or remove UserRole records.

Service Operations
Assign Role

Purpose:

Assign a role to a target user.


Responsibilities:

Validate User Exists

Validate Role Exists

Prevent Duplicate Assignment

Create UserRole Record


Expected result:

Role Assigned Successfully

Remove Role

Purpose:

Remove an assigned role from a user.


Responsibilities:

Validate User Exists

Validate Role Exists

Validate Assignment Exists

Delete UserRole Record


Expected result:

Role Removed Successfully

Get User Roles

Purpose:

Retrieve all assigned roles for a user.


Expected result:

Role List Returned

Validate Assignment

Purpose:

Validate assignment request before persistence.


Checks:

User Existence

Role Existence

Duplicate Assignment

Assignment Lifecycle
Assignment Request
        ↓

Validate User
        ↓

Validate Role
        ↓

Check Existing Assignment
        ↓

Create UserRole
        ↓

Return Success

Database Interaction

Current assignment persistence relies on:

UserRole


Structure:

id

userId

roleId

createdAt


This model was introduced during:

Phase 1 — Multi-Role Architecture

Assignment Rules
Rule 1

User must exist.

Allowed:

Existing User


Rejected:

Unknown User

Rule 2

Role must exist.

Allowed:

Existing Role


Rejected:

Unknown Role

Rule 3

Duplicate assignments are not allowed.

Rejected:

User
↓
Inventory Manager

Attempt To Assign Inventory Manager Again


Result:

Rejected

Rule 4

Removing a non-existing assignment is not allowed.

Rejected:

Assignment Not Found

Multi-Role Compatibility

The engine operates on top of the Multi-Role Architecture.

Example:

User

├── Inventory Manager

├── Product Manager

└── Customer Support


Assignments must remain independent.

Removing one role must not affect others.

Effective Permissions

Assignments influence authorization automatically.

Example:

Role A Permissions

+

Role B Permissions

+

Role C Permissions

=

Effective User Permissions


The Role Assignment Engine is responsible only for assignment management.

Permission resolution remains handled by:

AuthorizationService

Error Handling

Standardized errors should be used.

User Not Found
USER_NOT_FOUND

Role Not Found
ROLE_NOT_FOUND

Assignment Already Exists
ROLE_ALREADY_ASSIGNED

Assignment Not Found
ROLE_ASSIGNMENT_NOT_FOUND

Security Considerations

Current Phase Security:

User Validation

Role Validation

Duplicate Prevention


Future Security:

Privilege Escalation Protection

Tenant Boundaries

Store Boundaries

Assignment Approval Policies

Audit Logging


The current implementation should be designed to accommodate these future requirements without architectural changes.

Tenant Readiness

Although Tenant Foundation has not yet been implemented, Role Assignment Engine must remain compatible with future tenant-scoped authorization.

Future structure:

Tenant
 ↓
Organization
 ↓
Store
 ↓
Roles
 ↓
Users


The service should avoid assumptions that would prevent future tenant isolation.

Audit Readiness

Audit logging is not implemented during this phase.

However all assignment operations should be structured in a way that future audit integration can be added with minimal changes.

Future audit example:

Actor

Target User

Role

Timestamp

IP Address

User Agent

Tenant

Testing Requirements

The Role Assignment Engine is complete only when the following tests pass.

Assignment Tests
Assign Role Successfully

Remove Role Successfully

List User Roles

Assign Multiple Roles

Validation Tests
Reject Missing User

Reject Missing Role

Prevent Duplicate Assignment

Reject Missing Assignment Removal

Authorization Integrity Tests
Validate Effective Permissions

Validate UserRole Persistence

Validate UserRole Removal

Documentation Requirements

The following documents must be updated when the phase is completed:

README_ROLE_ASSIGNMENT.md

README_AUTHORIZATION.md

README_AUTHORIZATION_TESTING.md

CHANGELOG.md

CORE_ENGINE_ROADMAP.md

Phase Deliverables

Implementation files:

backend/core/src/modules/auth/role-assignment.service.ts

backend/core/test/role-assignment.e2e-spec.ts


Module registration:

backend/core/src/modules/auth/auth.module.ts

Definition Of Done

The Role Assignment Engine phase is complete only when:

RoleAssignmentService Implemented           ✅

Role Assignment Validation Implemented      ✅

Duplicate Prevention Implemented            ✅

Role Removal Implemented                    ✅

Role Retrieval Implemented                  ✅

Build Passed                                ✅

Tests Passed                                ✅

Documentation Updated                       ✅

Git Commit Created                          ✅

Git Push Completed                          ✅

Phase Status
Phase:
2 — Role Assignment Engine

Status:
READY FOR IMPLEMENTATION

Version
Version: 1.0

