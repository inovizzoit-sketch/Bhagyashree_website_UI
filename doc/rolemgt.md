
* **Super Admin**
* **Admin**

## Requirements

### 1. Existing Admin Model

Extend the existing `Admin` table instead of creating a new one.

Add a field such as:

* `userType` (SUPER_ADMIN | ADMIN)

or

* `role` (SUPER_ADMIN | ADMIN)

There must be only **one Admin table**.

---

### 2. First Super Admin

Seed one default Super Admin in the database.

Example:

* Username
* Email
* Password (hashed)
* Role = SUPER_ADMIN

This account will manage the entire CMS.

---

### 3. Super Admin Permissions

The Super Admin has unrestricted access.

Only the Super Admin can:

* Create Admin users
* Edit Admin users
* Delete Admin users
* Activate / Deactivate Admin users
* Assign module permissions
* Change Admin permissions
* View all modules
* Access User Management
* Access Permission Management

---

### 4. Admin Permissions

Admin users **cannot** manage permissions.

Their access depends entirely on permissions assigned by the Super Admin.

They should only see the modules they have permission to access.

---

### 5. Dynamic Sidebar

After login:

* If the user is **SUPER_ADMIN**, load every module automatically.
* If the user is **ADMIN**, fetch only the permitted modules from the database.
* Build the sidebar dynamically from the API response.
* No sidebar items should be hardcoded.

---

### 6. Security

The backend must check permissions on every protected API.

Even if an Admin manually enters a restricted URL, return **403 Forbidden**.

---

### Important

Do **NOT** create a separate Super Admin authentication or a separate Super Admin table.

Reuse the existing Admin authentication and Admin table.

The only difference is the user's role:

* SUPER_ADMIN → Full system access
* ADMIN → Access controlled by module permissions assigned by the Super Admin
