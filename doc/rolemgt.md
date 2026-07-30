

Design a complete **Role & Permission Management (RBAC)** module for a CMS built with Next.js, NestJS, PostgreSQL, Prisma, Tailwind CSS, and Shadcn UI.

The system must allow Super Admins and Admins to securely manage users, roles, and permissions with fine-grained module-level access.

The architecture should be scalable, reusable, secure, and suitable for enterprise SaaS applications.

==================================================
OBJECTIVE
==================================================

Create a Role & Permission Management system where administrators can:

- Create users
- Create custom roles
- Assign roles to users
- Control permissions module-wise
- Restrict actions (View, Create, Edit, Delete, Approve, Export, Import, Publish, etc.)
- Support multiple roles in the future
- Easily extend permissions when new modules are added

==================================================
MODULES
==================================================

Design the following modules:

1. User Management
2. Role Management
3. Permission Management

==================================================
USER MANAGEMENT
==================================================

Allow Admin to:

- Create User
- Edit User
- Delete User
- Activate / Deactivate User
- Reset Password
- Lock / Unlock Account
- Assign Role
- Change Role
- Search Users
- Filter Users
- View User Activity
- Last Login
- Login Status

User Fields

- Full Name
- Email
- Mobile Number
- Username
- Password
- Role
- Department
- Designation
- Profile Image
- Status
- Created By
- Created Date

==================================================
ROLE MANAGEMENT
==================================================

Allow Admin to:

- Create Role
- Edit Role
- Delete Role
- Duplicate Role
- Enable / Disable Role
- Assign Users
- View Users in Role

Example Roles

- Super Admin
- Admin
- Manager
- Sales
- Marketing
- CRM Executive
- Content Manager
- Editor
- Viewer

Each role should have:

- Role Name
- Description
- Status
- Priority
- Default Role
- Created Date
- Last Updated

==================================================
PERMISSION MANAGEMENT
==================================================

Every module should support action-based permissions.

Example:

Dashboard

☐ View

Projects

☐ View
☐ Create
☐ Edit
☐ Delete
☐ Publish
☐ Archive

Properties

☐ View
☐ Create
☐ Edit
☐ Delete

Gallery

☐ View
☐ Upload
☐ Delete

Blogs

☐ View
☐ Create
☐ Edit
☐ Delete
☐ Publish

Testimonials

☐ View
☐ Create
☐ Edit
☐ Delete

Amenities

☐ View
☐ Create
☐ Edit
☐ Delete

Announcements

☐ View
☐ Create
☐ Edit
☐ Delete

Leads

☐ View
☐ Create
☐ Edit
☐ Assign
☐ Delete
☐ Export

Customers

☐ View
☐ Create
☐ Edit
☐ Delete

Users

☐ View
☐ Create
☐ Edit
☐ Delete

Roles

☐ View
☐ Create
☐ Edit
☐ Delete

Theme Management

☐ View
☐ Update

Settings

☐ View
☐ Update

==================================================
SPECIAL PERMISSIONS
==================================================

Support permissions like:

- Import Data
- Export Data
- Approve
- Reject
- Publish
- Archive
- Restore
- Clone
- Bulk Delete
- Bulk Update
- Print
- Download

==================================================
MENU ACCESS
==================================================

The sidebar should automatically hide modules the user cannot access.

Example:

Manager

✔ Dashboard
✔ Projects
✔ Gallery

Hidden

✖ Users
✖ Roles
✖ Settings

==================================================
FIELD LEVEL PERMISSIONS
==================================================

Support future field-level access.

Example

Salary

View ❌

Edit ❌

Customer Mobile

View ✔

Edit ❌

==================================================
DASHBOARD
==================================================

Create dashboard cards:

Total Users

Active Users

Roles

Recent Logins

Locked Users

Inactive Users

==================================================
DATABASE DESIGN
==================================================

Design normalized Prisma models for:

User

Role

Permission

Module

RolePermission

UserRole

UserPermission (future support)

AuditLog

LoginHistory

Include:

Relations

Indexes

Constraints

Enums

==================================================
API DESIGN
==================================================

Design REST APIs for:

Users CRUD

Roles CRUD

Permissions CRUD

Assign Role

Assign Permissions

Get User Permissions

Get Sidebar Menu

Get Current User Access

==================================================
FRONTEND
==================================================

Use:

Next.js App Router

TanStack Query

React Hook Form

Zod

Tailwind CSS

Shadcn UI

Lucide Icons

==================================================
SECURITY
==================================================

Include:

JWT Authentication

Route Guards

Permission Guards

Module Guards

Role Guards

API Authorization

Secure Middleware

==================================================
AUDIT LOG
==================================================

Track:

Who created user

Who edited role

Who changed permissions

Who deleted records

Login history

Logout history

Failed login attempts

==================================================
UX REQUIREMENTS
==================================================

Create a modern enterprise admin interface with:

Permission Matrix

Checkbox Tree

Select All

Select Module

Expand / Collapse Modules

Search Permissions

Duplicate Role

Bulk Permission Assignment

Confirmation Dialogs

Loading States

Responsive Layout

==================================================
DELIVERABLES
==================================================

Generate:

1. Complete feature architecture
2. Prisma database schema
3. Entity relationship diagram
4. Folder structure
5. API endpoints
6. DTO structure
7. Admin UI screens
8. Permission matrix UI
9. Authentication & Authorization flow
10. Best security practices
11. Future scalability strategy

The solution should be enterprise-grade, production-ready, highly scalable, and similar to the permission systems used in enterprise products like Salesforce, Jira, Microsoft Dynamics, and Zoho CRM.

---

# Project-Specific Analysis & Suggested Changes

## What's Already in Your Project (Do NOT duplicate)

| Existing | Detail |
|----------|--------|
| `Admin` model | Only has `username` + `password`. No role, no email, no status. Must be **extended**. |
| `JwtAuthGuard` | Already protects all admin routes. Must evolve to also check **permissions**. |
| Admin sidebar | Already built in `layout.tsx` — must become **permission-driven** (hide inaccessible items). |
| Existing modules | 16 modules already exist: Projects, Gallery, Forms, Leads, Inquiries, Amenities, Testimonials, Templates, Popup, Home Gallery, Blogs, Properties, Footer, Hero, Announcements, Dashboard |
| No user/role tables | Zero RBAC infrastructure. Everything starts from scratch. |

---

## Suggested Changes to the Original Spec

### ✅ Keep As-Is
- Role management with duplicate/enable/disable
- Module-level permission matrix (checkbox grid)
- Sidebar menu access driven by permissions
- Audit log for critical actions
- Login history tracking
- JWT-based security

### ✏️ Modify / Adjust

| Original Spec | Suggested Change for This Project |
|---------------|-----------------------------------|
| Use Shadcn UI for frontend | **Stay with Tailwind CSS + Vanilla CSS** — matches existing codebase. No Shadcn. |
| `Customers` module | Not in your project. **Replace with `Inquiries`** (already exists as `/admin/inbox`). |
| `TanStack Query` | Project currently uses plain `fetch`. **Keep fetch pattern** for consistency — TanStack is optional. |
| `React Hook Form` + `Zod` | Project uses plain `useState`. **Keep pattern** for consistency. |
| `UserPermission` (future) | Move to **Phase 5** — not Phase 1. Adds unnecessary complexity early. |
| `Field Level Permissions` | Move to **Phase 6** (future roadmap). Too complex for initial build. |
| Multiple roles per user | **Phase 1: single role per user**. Multi-role support in Phase 4. |

### ➕ Add to the Spec (Missing from Original)

| Gap | Suggested Addition |
|-----|--------------------|
| Password reset via email | Add **email OTP or reset link** via existing template system |
| Session management | Track **active sessions** per user, allow remote logout |
| First login forced password change | Add `mustChangePassword` flag on new user creation |
| Rate limiting on login | Protect `/auth/login` with IP-based rate limiting (NestJS `throttler`) |
| `Home Gallery` module permissions | Missing from original spec — add it |
| `Templates` module permissions | Missing from original spec — add it |
| `Popup` module permissions | Missing from original spec — add it |
| `Hero` module permissions | Missing from original spec — add it |

---

## Updated Module Permission Matrix (Aligned to Your Project)

| Module | Actions |
|--------|---------|
| Dashboard | View |
| Projects | View, Create, Edit, Delete, Publish, Archive |
| Properties | View, Create, Edit, Delete |
| Gallery | View, Upload, Delete, Reorder |
| Home Gallery | View, Create, Edit, Delete |
| Blogs | View, Create, Edit, Delete, Publish |
| Testimonials | View, Create, Edit, Delete |
| Amenities | View, Create, Edit, Delete |
| Amenity Categories | View, Create, Edit, Delete |
| Forms | View, Create, Edit, Delete, Duplicate |
| Templates | View, Create, Edit, Delete, Duplicate |
| Popup | View, Create, Edit, Delete, Publish |
| Hero | View, Update |
| Footer | View, Update |
| Announcements | View, Create, Edit, Delete |
| Leads | View, Create, Edit, Assign, Delete, Export |
| Inquiries (Inbox) | View, Update Status, Delete, Export |
| Users | View, Create, Edit, Delete, Activate |
| Roles | View, Create, Edit, Delete, Duplicate |
| Theme Management | View, Create, Edit, Publish, Archive |
| Settings | View, Update |

---

## Realistic Role Presets for Your Project

| Role | Access Level |
|------|-------------|
| **Super Admin** | Full access to everything |
| **Admin** | Full access except Users/Roles management |
| **Content Manager** | Projects, Gallery, Blogs, Testimonials, Amenities, Popup |
| **CRM Executive** | Leads, Inquiries only |
| **Editor** | View + Edit only on content modules, no delete |
| **Viewer** | View only on all permitted modules |

---

## Phase-Wise Implementation Plan

### Phase 1 — Foundation: Database + Auth Extension + User Management
**Goal:** Extend existing `Admin` model into a full user management system with roles.

**Backend Tasks:**
- Extend `Admin` model with: `email`, `fullName`, `mobile`, `role`, `department`, `designation`, `profileImage`, `status` (`ACTIVE`/`INACTIVE`/`LOCKED`), `lastLoginAt`, `mustChangePassword`, `createdBy`
- Create `Role` model: `name`, `slug`, `description`, `status`, `priority`, `isDefault`, `createdAt`
- Create `Module` model: seeded list of all 20 modules above
- Create `Permission` model: `moduleId`, `action` (View/Create/Edit/Delete/Publish etc.)
- Create `RolePermission` join table: `roleId` + `permissionId`
- Run `prisma migrate dev`
- Create `AdminUser` CRUD endpoints (rename existing `/auth` user to multi-user)
- `POST /admin-users` — create user (Super Admin only)
- `GET /admin-users` — list with search + filter
- `PATCH /admin-users/:id` — update
- `DELETE /admin-users/:id`
- `POST /admin-users/:id/activate` / `/deactivate` / `/lock` / `/unlock`
- `POST /admin-users/:id/reset-password`

**Files to Create:**
```
src/modules/admin-users/
├── dto/create-admin-user.dto.ts
├── dto/update-admin-user.dto.ts
├── admin-users.controller.ts
├── admin-users.service.ts
└── admin-users.module.ts

src/modules/roles/
├── dto/create-role.dto.ts
├── roles.controller.ts
├── roles.service.ts
└── roles.module.ts
```

---

### Phase 2 — Permission Engine: RBAC Core + Guards
**Goal:** Wire permissions into every existing API route.

**Backend Tasks:**
- Seed all modules + default permissions into DB via `seed.ts`
- Create `POST /roles/:id/permissions` — assign permissions to a role
- Create `GET /roles/:id/permissions` — get permission matrix for a role
- Create `GET /admin-users/me/permissions` — get logged-in user's full permission list
- Create `GET /admin-users/me/menu` — return only modules user has `View` permission for
- Create `PermissionGuard` decorator: `@RequirePermission('projects', 'edit')`
- Apply `@RequirePermission` to all 16 existing module controllers
- Extend `JwtStrategy` to attach user's role + permissions to `req.user`

**Files to Create/Modify:**
```
src/auth/guards/permission.guard.ts    [NEW]
src/auth/decorators/permission.decorator.ts  [NEW]
src/auth/strategies/jwt.strategy.ts   [MODIFY — attach permissions]

src/modules/permissions/
├── permissions.controller.ts
├── permissions.service.ts
└── permissions.module.ts
```

---

### Phase 3 — Admin Frontend: User & Role Management Pages
**Goal:** Build the admin UI for managing users and roles.

**Frontend Tasks:**
- `/admin/users` — Users list page (search, filter by role/status, pagination)
- `/admin/users/new` — Create user form
- `/admin/users/[id]/edit` — Edit user form
- `/admin/roles` — Roles list page (with duplicate, enable/disable)
- `/admin/roles/new` — Create role with permission matrix
- `/admin/roles/[id]/edit` — Edit role + permissions
- Permission Matrix UI: checkbox grid grouped by module (Select All per module, global Select All)
- Update admin `layout.tsx` sidebar to call `/admin-users/me/menu` and **hide** inaccessible menu items dynamically
- Add role/status badge to sidebar header (show current logged-in user's name + role)

**Files to Create:**
```
src/app/admin/(dashboard)/users/page.tsx
src/app/admin/(dashboard)/users/new/page.tsx
src/app/admin/(dashboard)/users/[id]/edit/page.tsx
src/app/admin/(dashboard)/roles/page.tsx
src/app/admin/(dashboard)/roles/new/page.tsx
src/app/admin/(dashboard)/roles/[id]/edit/page.tsx

src/modules/admin/pages/UsersListPage.tsx
src/modules/admin/pages/UserFormPage.tsx
src/modules/admin/pages/RolesListPage.tsx
src/modules/admin/pages/RoleFormPage.tsx       ← includes permission matrix
src/modules/admin/components/PermissionMatrix.tsx
src/modules/admin/services/admin-users.service.ts
src/modules/admin/services/roles.service.ts
src/modules/admin/types/rbac.types.ts
```

---

### Phase 4 — Audit Log + Login History
**Goal:** Track all critical admin actions for accountability.

**Backend Tasks:**
- Create `AuditLog` model: `actorId`, `action`, `module`, `targetId`, `before` (JSON), `after` (JSON), `createdAt`
- Create `LoginHistory` model: `userId`, `ipAddress`, `userAgent`, `status` (`SUCCESS`/`FAILED`), `createdAt`
- Add `AuditInterceptor` that auto-logs Create/Update/Delete operations on any module
- `GET /audit-logs` — admin list with filters (actor, module, date range)
- `GET /login-history` — list with user + IP filters
- Track failed login attempts; auto-lock after 5 failures

**Files to Create:**
```
src/modules/audit-logs/
├── audit-logs.controller.ts
├── audit-logs.service.ts
└── audit-logs.module.ts

src/common/interceptors/audit.interceptor.ts  [NEW — auto-logging]
```

---

### Phase 5 — Multi-Role Support (Optional / Future)
- Add `UserRole` join table to support multiple roles per user
- Create role priority resolution (higher priority role wins on conflict)
- Update `JwtStrategy` to merge permissions from all assigned roles

---

### Phase 6 — Field-Level Permissions (Future Roadmap)
- Add `FieldPermission` model: `roleId`, `module`, `fieldName`, `canView`, `canEdit`
- Apply at API response serialization level (strip restricted fields before returning)
- UI to manage field visibility per role

---

## Security Checklist

- [ ] Bcrypt all passwords (already done for Admin)
- [ ] JWT expiry set to short window (15–60 min) + refresh token
- [ ] Lock account after 5 failed login attempts
- [ ] Force password change on first login (`mustChangePassword`)
- [ ] Rate limit `/auth/login` with NestJS `@nestjs/throttler`
- [ ] Sanitize all inputs (class-validator `@IsString`, `@IsEmail` etc.)
- [ ] Super Admin role cannot be deleted or modified by anyone except themselves
- [ ] All permission checks happen **server-side** — frontend hiding is cosmetic only