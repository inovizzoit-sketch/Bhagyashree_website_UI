Act as a Senior Product Manager, UI/UX Architect, and Full Stack Solution Architect.

Design a complete **Theme Management Module** for a modern CMS built with **Next.js, NestJS, PostgreSQL, Prisma, Tailwind CSS, and Shadcn UI**.

The goal is to create a powerful, scalable, and user-friendly Theme Management feature that allows administrators to customize the website's visual identity without writing code.

The module should be enterprise-grade, reusable, and future-ready.

# Objective

Create a dedicated **Theme Management** section in the Admin Panel where administrators can create, manage, preview, duplicate, publish, and organize website themes.

---

## Theme Dashboard

Design a clean dashboard showing:

- Theme Name
- Theme Preview Thumbnail
- Theme Status (Active / Draft / Archived)
- Created Date
- Last Updated
- Created By
- Version
- Actions (Edit, Duplicate, Preview, Publish, Archive, Delete)

Include:
- Search
- Filters
- Sort by Date/Name
- Grid & List View
- Pagination

---

## Theme Features

Each theme should support:

- Theme Name
- Description
- Slug
- Preview Image
- Theme Version
- Active / Draft Status
- Default Theme
- Duplicate Theme
- Publish Theme
- Archive Theme
- Delete Theme
- Theme Notes

---

## Theme Settings

Organize settings into tabs:

### 1. Colors
- Primary Color
- Secondary Color
- Accent Color
- Background Color
- Surface Color
- Text Color
- Border Color
- Success Color
- Warning Color
- Error Color

Include:
- Color Picker
- HEX Input
- RGB Support
- Live Preview

---

### 2. Typography

Allow selecting:

- Heading Font
- Body Font
- Button Font

Controls:
- Font Size
- Font Weight
- Line Height
- Letter Spacing

Support Google Fonts.

---

### 3. Layout

Configure:

- Container Width
- Border Radius
- Card Radius
- Button Radius
- Shadow Style
- Section Spacing

---

### 4. Branding

Allow uploading:

- Logo
- Dark Logo
- Favicon
- Loading Logo

---

### 5. Buttons

Customize:

- Background
- Text Color
- Border
- Radius
- Hover Color
- Disabled State

---

### 6. Cards

Customize:

- Background
- Border
- Shadow
- Radius
- Padding

---

### 7. Forms

Customize:

- Input Border
- Input Radius
- Label Style
- Placeholder Color
- Focus State
- Error State

---

### 8. Navigation

Customize:

- Navbar Background
- Navbar Height
- Menu Color
- Active Menu Color
- Hover Color
- Sticky Header Toggle

---

### 9. Footer

Customize:

- Background
- Text Color
- Link Color
- Social Icon Color

---

### 10. Dark Mode

- Enable / Disable
- Auto Detect
- Dark Theme Colors
- Dark Logo

---

## Live Preview

Provide a real-time preview with:

- Desktop View
- Tablet View
- Mobile View

Changes should appear instantly before publishing.

---

## Theme Actions

Support:

- Save Draft
- Publish Theme
- Duplicate Theme
- Reset Changes
- Undo Changes
- Export Theme (JSON)
- Import Theme (JSON)

---

## Validation

Ensure:

- Unique Theme Name
- Unique Slug
- Required Fields Validation
- Image Validation
- Color Format Validation

---

## Database Design

Design normalized Prisma models for:

- Theme
- ThemeColor
- ThemeTypography
- ThemeLayout
- ThemeBranding
- ThemeComponent
- ThemeVersion

Include:
- Proper Relations
- Indexes
- Constraints
- Enums

---

## API Design (NestJS)

Create REST APIs for:

- Create Theme
- Update Theme
- Delete Theme
- Duplicate Theme
- Publish Theme
- Archive Theme
- Get Theme List
- Get Theme Details
- Import Theme
- Export Theme

---

## Frontend Requirements

Use:

- Next.js App Router
- React Hook Form
- Zod Validation
- TanStack Query
- Tailwind CSS
- Shadcn UI
- Lucide Icons

Include:

- Responsive UI
- Loading Skeletons
- Error Handling
- Success Toasts
- Confirmation Dialogs

---

## User Experience

Design a modern admin interface with:

- Professional dashboard
- Sticky action bar
- Collapsible sidebar
- Search & Filters
- Breadcrumbs
- Empty states
- Keyboard shortcuts
- Responsive layout

---

## Deliverables

Generate:

1. Feature architecture
2. Database schema (Prisma)
3. API endpoints
4. DTO structure
5. Folder structure
6. Admin UI layout
7. Component hierarchy
8. Permission matrix
9. Validation rules
10. Production-ready implementation plan

The final design should feel comparable to professional CMS platforms like Shopify, Webflow, and WordPress while remaining clean, scalable, and easy to maintain.

---

# Implementation Plan

## Architecture Overview

The active theme's settings are stored in PostgreSQL and exposed via a **public unauthenticated endpoint** (`GET /website/active-theme`). The Next.js public layout reads this at render time and injects the values as CSS custom properties (`--color-primary`, `--font-heading`, etc.) into the `<html>` tag so every page reflects the theme instantly without rebuilds.

```
Admin Panel (Next.js)
       │  REST API (JWT)
       ▼
  NestJS Backend  ──►  PostgreSQL (Prisma)
       │
       ▼  GET /website/active-theme (public)
Public Website (Next.js)
       │
       ▼  CSS Variables injected at layout level
  All Public Pages
```

---

## Phase 1 — Database Schema & Backend API

### 1.1 Prisma Schema — New Models

Add the following models to `prisma/schema.prisma`:

**Enums**
```prisma
enum ThemeStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}
```

**Theme (root model)**
```prisma
model Theme {
  id           String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name         String      @unique @db.VarChar(255)
  slug         String      @unique @db.VarChar(255)
  description  String?
  previewImage String?     @map("preview_image") @db.VarChar(500)
  version      String      @default("1.0.0") @db.VarChar(50)
  status       ThemeStatus @default(DRAFT)
  isDefault    Boolean     @default(false) @map("is_default")
  notes        String?
  createdBy    String?     @map("created_by") @db.VarChar(255)
  createdAt    DateTime    @default(now()) @map("created_at")
  updatedAt    DateTime    @updatedAt @map("updated_at")
  colors       ThemeColor?
  typography   ThemeTypography?
  layout       ThemeLayout?
  branding     ThemeBranding?
  components   ThemeComponent?
  @@map("themes")
}
```

**ThemeColor**
```prisma
model ThemeColor {
  id          String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  themeId     String @unique @map("theme_id") @db.Uuid
  primary     String @default("#DDBD81") @db.VarChar(20)
  secondary   String @default("#020520") @db.VarChar(20)
  accent      String @default("#B8963E") @db.VarChar(20)
  background  String @default("#020520") @db.VarChar(20)
  surface     String @default("#13131a") @db.VarChar(20)
  textPrimary String @default("#FFFFFF") @map("text_primary") @db.VarChar(20)
  textMuted   String @default("#8E90A2") @map("text_muted") @db.VarChar(20)
  border      String @default("#1e1e2e") @db.VarChar(20)
  success     String @default("#22c55e") @db.VarChar(20)
  warning     String @default("#f59e0b") @db.VarChar(20)
  error       String @default("#ef4444") @db.VarChar(20)
  theme       Theme  @relation(fields: [themeId], references: [id], onDelete: Cascade)
  @@map("theme_colors")
}
```

**ThemeTypography**
```prisma
model ThemeTypography {
  id            String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  themeId       String @unique @map("theme_id") @db.Uuid
  headingFont   String @default("Cormorant Garamond") @map("heading_font") @db.VarChar(100)
  bodyFont      String @default("Jost") @map("body_font") @db.VarChar(100)
  buttonFont    String @default("Jost") @map("button_font") @db.VarChar(100)
  baseFontSize  String @default("16px") @map("base_font_size") @db.VarChar(20)
  lineHeight    String @default("1.6") @map("line_height") @db.VarChar(20)
  letterSpacing String @default("0em") @map("letter_spacing") @db.VarChar(20)
  theme         Theme  @relation(fields: [themeId], references: [id], onDelete: Cascade)
  @@map("theme_typography")
}
```

**ThemeLayout**
```prisma
model ThemeLayout {
  id             String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  themeId        String @unique @map("theme_id") @db.Uuid
  containerWidth String @default("1280px") @map("container_width") @db.VarChar(20)
  borderRadius   String @default("0.5rem") @map("border_radius") @db.VarChar(20)
  cardRadius     String @default("1rem") @map("card_radius") @db.VarChar(20)
  buttonRadius   String @default("0.5rem") @map("button_radius") @db.VarChar(20)
  shadowStyle    String @default("md") @map("shadow_style") @db.VarChar(50)
  sectionSpacing String @default("5rem") @map("section_spacing") @db.VarChar(20)
  theme          Theme  @relation(fields: [themeId], references: [id], onDelete: Cascade)
  @@map("theme_layouts")
}
```

**ThemeBranding**
```prisma
model ThemeBranding {
  id          String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  themeId     String  @unique @map("theme_id") @db.Uuid
  logo        String? @db.VarChar(500)
  darkLogo    String? @map("dark_logo") @db.VarChar(500)
  favicon     String? @db.VarChar(500)
  loadingLogo String? @map("loading_logo") @db.VarChar(500)
  theme       Theme   @relation(fields: [themeId], references: [id], onDelete: Cascade)
  @@map("theme_branding")
}
```

**ThemeComponent**
```prisma
model ThemeComponent {
  id              String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  themeId         String  @unique @map("theme_id") @db.Uuid
  btnBg           String  @default("#DDBD81") @map("btn_bg") @db.VarChar(20)
  btnText         String  @default("#020520") @map("btn_text") @db.VarChar(20)
  btnBorder       String  @default("transparent") @map("btn_border") @db.VarChar(20)
  btnHover        String  @default("#B8963E") @map("btn_hover") @db.VarChar(20)
  btnRadius       String  @default("0.5rem") @map("btn_radius") @db.VarChar(20)
  navBg           String  @default("#020520") @map("nav_bg") @db.VarChar(20)
  navHeight       String  @default("72px") @map("nav_height") @db.VarChar(20)
  navMenuColor    String  @default("#8E90A2") @map("nav_menu_color") @db.VarChar(20)
  navActiveColor  String  @default("#DDBD81") @map("nav_active_color") @db.VarChar(20)
  navSticky       Boolean @default(true) @map("nav_sticky")
  footerBg        String  @default("#13131a") @map("footer_bg") @db.VarChar(20)
  footerText      String  @default("#8E90A2") @map("footer_text") @db.VarChar(20)
  footerLink      String  @default("#DDBD81") @map("footer_link") @db.VarChar(20)
  cardBg          String  @default("#13131a") @map("card_bg") @db.VarChar(20)
  cardBorder      String  @default("#1e1e2e") @map("card_border") @db.VarChar(20)
  cardRadius      String  @default("1rem") @map("card_radius_comp") @db.VarChar(20)
  darkModeEnabled Boolean @default(true) @map("dark_mode_enabled")
  theme           Theme   @relation(fields: [themeId], references: [id], onDelete: Cascade)
  @@map("theme_components")
}
```

### 1.2 NestJS Backend Module Structure

```
src/modules/themes/
├── dto/
│   ├── create-theme.dto.ts       # name, slug, description, status, notes
│   ├── update-theme.dto.ts       # all optional fields (PartialType)
│   └── theme-settings.dto.ts    # nested DTOs for colors, typography etc.
├── themes.controller.ts          # Admin CRUD (JWT protected)
├── themes.service.ts
├── themes.module.ts
└── website-themes.controller.ts  # Public endpoint (no auth required)
```

### 1.3 Admin REST API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `POST` | `/themes` | Create new theme | ✅ JWT |
| `GET` | `/themes` | List themes (search, filter, sort, paginate) | ✅ JWT |
| `GET` | `/themes/:id` | Get full theme with all sub-settings | ✅ JWT |
| `PATCH` | `/themes/:id` | Update theme settings | ✅ JWT |
| `DELETE` | `/themes/:id` | Delete theme | ✅ JWT |
| `POST` | `/themes/:id/duplicate` | Duplicate a theme as new DRAFT | ✅ JWT |
| `POST` | `/themes/:id/publish` | Set as ACTIVE (deactivates all others) | ✅ JWT |
| `POST` | `/themes/:id/archive` | Set status to ARCHIVED | ✅ JWT |
| `GET` | `/themes/:id/export` | Export theme as JSON download | ✅ JWT |
| `POST` | `/themes/import` | Import theme from JSON body | ✅ JWT |
| `POST` | `/themes/:id/branding` | Upload logos/favicon (multipart) | ✅ JWT |

### 1.4 Public Website API

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| `GET` | `/website/active-theme` | Return active theme CSS variable map | ❌ None |

---

## Phase 2 — Admin Theme List Page + Editor (Colors & Typography)

### 2.1 New Frontend Files

```
src/
├── app/admin/(dashboard)/
│   └── themes/
│       ├── page.tsx              → ThemesListPage
│       ├── new/page.tsx          → ThemeEditorPage (create mode)
│       └── edit/[id]/page.tsx    → ThemeEditorPage (edit mode)
├── modules/admin/
│   ├── pages/
│   │   ├── ThemesListPage.tsx
│   │   └── ThemeEditorPage.tsx
│   ├── services/
│   │   └── theme-management.service.ts
│   └── types/
│       └── theme-management.types.ts
```

### 2.2 ThemesListPage — Dashboard Layout

- Grid view cards showing: preview thumbnail, name, status badge, version, last updated, actions
- List toggle with sortable table view
- Search bar + Status filter (All / Draft / Active / Archived)
- Sort by: Name A-Z, Date Created, Last Updated
- Pagination
- Top action: **+ Create Theme** button
- Per-card actions: Edit, Duplicate, Preview, Publish, Archive, Delete

### 2.3 ThemeEditorPage — Tabbed Layout

```
┌────────────────────────────────────────────────────────────┐
│ ← Themes   "My Dark Theme"   [DRAFT]   [Save Draft] [Publish]│
├────────────────────────────────────────────────────────────┤
│  Colors | Typography | Layout | Branding | Components      │
├──────────────────────────┬─────────────────────────────────┤
│  Settings Form Panel     │   Live Preview Pane             │
│  (scrollable)            │   [Desktop] [Tablet] [Mobile]   │
│                          │   <iframe src="/preview">       │
└──────────────────────────┴─────────────────────────────────┘
```

**Colors Tab fields:** Primary, Secondary, Accent, Background, Surface, Text Primary, Text Muted, Border, Success, Warning, Error — each with a native color picker + HEX text input.

**Typography Tab fields:** Heading Font (Google Fonts selector), Body Font, Button Font, Base Font Size, Line Height, Letter Spacing.

---

## Phase 3 — Layout, Branding & Components Tabs + Live Preview

### 3.1 Layout Tab
- Container Width (px or %)
- Border Radius, Card Radius, Button Radius (rem/px)
- Shadow Style dropdown (none / sm / md / lg / xl)
- Section Spacing (rem)

### 3.2 Branding Tab
- Logo upload (light background)
- Dark Logo upload (dark background)
- Favicon upload
- Loading Logo upload
- Preview renders uploads inline

### 3.3 Components Tab
- **Buttons:** Background, Text Color, Border Color, Hover Color, Radius, Disabled Opacity
- **Navigation:** Navbar Background, Height, Menu Color, Active Color, Hover Color, Sticky toggle
- **Footer:** Background, Text Color, Link Color, Social Icon Color
- **Cards:** Background, Border, Shadow, Radius, Padding
- **Forms:** Input Border, Input Radius, Placeholder Color, Focus State Color, Error State Color

### 3.4 Live Preview
- Renders an `<iframe>` pointing to `/preview?themeId=xxx` (a special preview-only public page)
- Viewport toggle buttons: Desktop (1280px) / Tablet (768px) / Mobile (375px)
- Preview reflects unsaved in-memory changes via `postMessage` CSS variable injection

---

## Phase 4 — Export / Import / Duplicate / Publish Flow

### 4.1 Export Theme
- `GET /themes/:id/export` returns a JSON blob with all theme sub-models merged
- Admin UI shows an **Export JSON** button → triggers browser download of `theme-name.json`

### 4.2 Import Theme
- Admin UI shows an **Import** button → file picker for `.json`
- Sends JSON body to `POST /themes/import`
- Backend validates and creates a new DRAFT theme from the imported data

### 4.3 Duplicate
- `POST /themes/:id/duplicate` clones the entire theme tree (colors, typography, layout, branding, components) as a new DRAFT with `"Copy of ..."` prefix

### 4.4 Publish Flow
- `POST /themes/:id/publish` sets target theme `status = ACTIVE`, sets `isDefault = true`
- All other themes are set to `status = DRAFT` in the same transaction
- Only one ACTIVE theme can exist at any time

---

## Phase 5 — CSS Variable Injection into Public Website

### 5.1 Public Layout Integration

In `app/(web)/layout.tsx`, call the backend before rendering:

```tsx
// Fetch active theme at request time (no cache)
const theme = await fetch(`${API_BASE}/website/active-theme`, {
  cache: "no-store"
}).then(r => r.json()).catch(() => null);

// Convert to CSS custom properties object
const cssVars = theme ? {
  "--color-primary": theme.colors?.primary,
  "--color-secondary": theme.colors?.secondary,
  "--color-accent": theme.colors?.accent,
  "--color-bg": theme.colors?.background,
  "--color-surface": theme.colors?.surface,
  "--color-text": theme.colors?.textPrimary,
  "--color-muted": theme.colors?.textMuted,
  "--font-heading": `"${theme.typography?.headingFont}"`,
  "--font-body": `"${theme.typography?.bodyFont}"`,
  "--radius-card": theme.layout?.cardRadius,
  "--radius-btn": theme.layout?.buttonRadius,
  "--section-spacing": theme.layout?.sectionSpacing,
} : {};

return (
  <html lang="en" style={cssVars as React.CSSProperties}>
    ...
  </html>
);
```

### 5.2 CSS Variable Usage in Components

Update key website components to reference CSS variables instead of hardcoded values:

```css
/* Before */
color: #DDBD81;
background: #020520;

/* After */
color: var(--color-primary);
background: var(--color-bg);
```

---

## Sidebar Navigation Update

Add a **Customization** section in the admin sidebar (`layout.tsx`):

```
Customization
  └── 🎨 Theme Management  → /admin/themes
```

---

## Verification Plan

| Check | Method |
|-------|--------|
| Models migrate cleanly | `npx prisma migrate dev` |
| Active theme endpoint works | `GET /website/active-theme` returns JSON |
| Publish deactivates others | DB query after publish confirms only 1 ACTIVE |
| CSS vars apply site-wide | Inspect `<html>` tag on public pages |
| Theme editor saves & reloads | Create → Edit → verify DB values |
| Duplicate creates copy | Confirm new DRAFT row with cloned sub-models |
| Export downloads JSON | Browser download triggered |
| Import creates new theme | POST with JSON → verify DB record |