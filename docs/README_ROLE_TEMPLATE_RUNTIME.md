
Role Template Runtime Engine
Overview

The Role Template Runtime Engine converts role templates into actual runtime roles that can be assigned to users.

This feature allows MWT to provide reusable authorization blueprints while still supporting store-specific customization.

The runtime flow is:

RoleTemplate
↓
Clone
↓
Role
↓
Customize
↓
Assign
↓
User

Why This Feature Exists

Role templates are reusable blueprints.

A template should define a standard permission set without being assigned directly to users.

Example:

Store Manager Template


may contain:

stores.read
stores.update
products.create
products.update
orders.read
orders.update


The template itself is not assigned.

Instead:

Store Manager Template
↓
Clone
↓
Store Manager Role
↓
Assign To User

Architecture
Runtime Components
RoleTemplate
RoleTemplatePermission

Role
RolePermission

UserRole


Relationship:

RoleTemplate
↓
RoleTemplatePermission
↓
Permission

Role
↓
RolePermission
↓
Permission

RoleTemplateService

Location:

backend/core/src/modules/auth/role-template.service.ts


Responsibilities:

Clone role templates

Create runtime roles

Retrieve template permissions

Retrieve role permissions

Customize cloned roles

Add permissions

Remove permissions

Validate runtime operations

Supported Operations
Clone Template To Role

Creates an independent role from a role template.

Example:

Template:
Store Manager

↓

Role:
Store Manager - Store A


All template permissions are copied into the new role.

Create Role From Template

Alias operation for:

cloneTemplateToRole()


Used when creating a role directly from a template definition.

Add Permission To Role

Allows runtime customization.

Example:

Role:
Store Manager

Add:
reports.export


Result:

Store Manager
+
reports.export

Remove Permission From Role

Allows reducing permissions from a cloned role.

Example:

Role:
Store Manager

Remove:
orders.update


The template remains unchanged.

Get Template Permissions

Returns:

Template Permissions


Example output:

stores.read
stores.update
products.read
products.update

Get Role Permissions

Returns:

Role Permissions


Including any runtime customizations.

Template Isolation

Template isolation is a core requirement.

The following operation:

Template
↓
Clone
↓
Role


must produce a completely independent role.

Changing:

Role Permissions


must never change:

Template Permissions

Validation Rules
Template Must Exist

Invalid template ids are rejected.

ROLE_TEMPLATE_NOT_FOUND

Role Names Must Be Unique

Duplicate role creation is prevented.

ROLE_ALREADY_EXISTS

Permission Must Exist

Unknown permissions are rejected.

PERMISSION_NOT_FOUND

Duplicate Permissions Are Prevented

A role cannot receive the same permission twice.

ROLE_PERMISSION_ALREADY_EXISTS

Removing Missing Permissions Is Rejected

Removing a permission that is not assigned to the role is prevented.

ROLE_PERMISSION_NOT_FOUND

Runtime Example

Example:

Store Manager Template


Permissions:

stores.read
stores.update
products.create
products.update
orders.read


Clone:

Store Manager - Berlin


Add:

reports.export


Remove:

orders.read


Final result:

stores.read
stores.update
products.create
products.update
reports.export


Original template:

stores.read
stores.update
products.create
products.update
orders.read


Unchanged.

Automated Test Coverage

Current runtime tests validate:

Clone Template Successfully

Created Role Has Template Permissions

Customize Role After Cloning

Original Template Remains Unchanged

Prevent Invalid Template Clone

Prevent Duplicate Role Creation

Add Permission To Role

Prevent Duplicate Permission Assignment

Remove Permission From Role

Reject Missing Permission Removal

Retrieve Template Permissions

Retrieve Role Permissions

Authorization Integration

Permission Resolution After Customization

Quality Status
Build Status                PASSED

Test Suites                 11 / 11

Tests Passed                118 / 118

Phase Status
Phase 3
Role Template Runtime Engine

COMPLETED ✅

