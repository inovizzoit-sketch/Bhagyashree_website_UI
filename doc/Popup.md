Build a production-ready Popup Management System using:

Frontend:
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Hook Form + Zod

Backend:
- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger Documentation

Requirements:

1. Authentication
- Admin login/logout
- Role based access (Super Admin, Admin)

2. Popup Management Module
Create CRUD APIs and frontend pages.

Popup fields:

- title
- slug
- popupType
- heading
- subHeading
- description
- image
- videoUrl
- buttonText
- buttonLink
- htmlContent
- triggerType
- showAfterSeconds
- frequency
- priority
- deviceType
- targetType
- targetPages[]
- startDate
- endDate
- isActive

3. Popup Types
- Announcement
- Promotion
- Newsletter
- Lead Form
- Image Popup
- Video Popup
- Custom HTML

4. Trigger Types
- On Page Load
- After X Seconds
- On Scroll
- Exit Intent
- On Button Click

5. Features
- Enable/Disable popup
- Duplicate popup
- Search popup
- Pagination
- Sorting
- Filters
- Bulk Delete
- Bulk Status Update

6. Analytics Module
Track:
- impressions
- clicks
- close count
- lead submissions
- CTR percentage

7. Lead Management
Create popup lead table:

- name
- email
- phone
- message
- popupId

Admin can:
- View Leads
- Search Leads
- Export CSV

8. Dashboard
Create cards:
- Total Popups
- Active Popups
- Total Views
- Total Leads
- Top Performing Popup

9. Database
Create complete Prisma schema with:
- enums
- relations
- indexes
- migrations

10. APIs
Generate:

POST /auth/login

POST /popup
GET /popup
GET /popup/:id
PATCH /popup/:id
DELETE /popup/:id

GET /popup/active

POST /popup/:id/impression
POST /popup/:id/click
POST /popup/:id/close

POST /popup/:id/lead

GET /popup/leads

11. Frontend Pages

/admin/login
/admin/dashboard
/admin/popup
/admin/popup/create
/admin/popup/edit/[id]
/admin/leads

12. UI Requirements
- Responsive design
- Reusable components
- Data table
- Form validation
- Loading states
- Toast notifications
- Confirmation modal

13. Folder Structure
Generate complete enterprise folder structure for:
- Next.js
- NestJS
- Prisma

14. Generate code step by step:

Phase 1:
Create database schema and backend architecture.

Phase 2:
Create APIs.

Phase 3:
Create frontend pages.

Phase 4:
Connect frontend with backend.

Phase 5:
Implement analytics and lead system.

Do not generate everything at once.
First create the complete architecture and Prisma schema, then continue module by module.