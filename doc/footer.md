# Footer Management Module Documentation

Build a production-ready Footer Management System for the **Nandeeka CMS** web portal.

## 1. Module Overview
The Footer module provides dynamic configuration and management of the web portal's footer. It consists of three primary components:
1. **Footer Settings**: Site metadata, company address, logos, and custom colors (managed as a Singleton).
2. **Footer Links**: Quick links grouped or ordered, pointing to pages within or outside the website.
3. **Footer Social Links**: Social media handles (Facebook, Instagram, LinkedIn, YouTube, etc.) with custom icon identifiers and sort order.

---

## 2. Database Schema (Prisma)
The database structure is designed in PostgreSQL using Prisma ORM.

### 2.1. Footer Settings Model (`FooterSettings`)
Handles the global branding details, contact details, and theme configurations of the footer.
*   **Database Table**: `footer_settings`
*   **Prisma Definition**:
```prisma
model FooterSettings {
  id                String   @id @default(uuid())
  logoUrl           String?  @map("logo_url") @db.VarChar(500)
  bottomLogoUrl     String?  @map("bottom_logo_url") @db.VarChar(500)
  companyName       String   @default("Nandeeka Enterprises") @map("company_name") @db.VarChar(255)
  description       String?  @db.Text
  address           String?  @db.Text
  phone             String?  @db.VarChar(50)
  email             String?  @db.VarChar(255)
  copyrightText     String?  @map("copyright_text") @db.VarChar(255)
  privacyPolicyUrl  String?  @map("privacy_policy_url") @db.VarChar(500)
  termsOfServiceUrl String?  @map("terms_of_service_url") @db.VarChar(500)
  backgroundColor   String?  @map("background_color") @db.VarChar(50)
  textColor         String?  @map("text_color") @db.VarChar(50)
  accentColor       String?  @map("accent_color") @db.VarChar(50)
  isActive          Boolean  @default(true) @map("is_active")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  @@map("footer_settings")
}
```

### 2.2. Footer Link Model (`FooterLink`)
Manages navigation links presented in the footer.
*   **Database Table**: `footer_links`
*   **Prisma Definition**:
```prisma
model FooterLink {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  title        String   @db.VarChar(255)
  url          String   @db.VarChar(500)
  openInNewTab Boolean  @default(false) @map("open_in_new_tab")
  sortOrder    Int      @default(0) @map("sort_order")
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@map("footer_links")
}
```

### 2.3. Footer Social Link Model (`FooterSocial`)
Manages social platform icons and redirection URLs.
*   **Database Table**: `footer_socials`
*   **Prisma Definition**:
```prisma
model FooterSocial {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  platform  String   @db.VarChar(100)
  url       String   @db.VarChar(500)
  icon      String?  @db.VarChar(255)
  sortOrder Int      @default(0) @map("sort_order")
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("footer_socials")
}
```

---

## 3. API Routing Configuration
The backend controllers run under NestJS, handling the following API endpoints (base URL: `/api/footer` or `/footer` depending on routing):

| Method | Endpoint | Description | Payload (DTO) / Response |
| :--- | :--- | :--- | :--- |
| **GET** | `/footer` | Fetch combined active footer details (Settings + active Links + active Socials) | Combined response object |
| **GET** | `/footer/settings` | Fetch current footer settings | `FooterSettings` object |
| **PUT** | `/footer` | Update footer settings (supports multipart/form-data for Logo upload) | `UpdateFooterSettingsDto` |
| **GET** | `/footer/links` | Fetch all footer links | Array of `FooterLink` |
| **POST** | `/footer/links` | Create a new footer navigation link | `CreateFooterLinkDto` |
| **PUT** | `/footer/links/:id` | Update an existing footer navigation link | `UpdateFooterLinkDto` |
| **DELETE**| `/footer/links/:id` | Remove a footer link | Success confirmation |
| **GET** | `/footer/socials` | Fetch all social media links | Array of `FooterSocial` |
| **POST** | `/footer/socials` | Create a new social media profile link | `CreateFooterSocialDto` |
| **PUT** | `/footer/socials/:id`| Update an existing social media profile link | `UpdateFooterSocialDto` |
| **DELETE**| `/footer/socials/:id`| Remove a social media link | Success confirmation |

---

## 4. Administrative Features
The Admin Control Panel allows content administrators to perform:
1. **Settings configuration**: Update logo graphics, office address, contact numbers, primary email, privacy links, and styling parameters (background colors, accent highlights).
2. **Links management**:
   - Create, edit, and delete internal/external navigation links.
   - Adjust ordering using the `sortOrder` integer.
   - Toggle visibility status dynamically (`isActive`).
3. **Socials configuration**: Register new handles, assign appropriate icon mappings, and rank ordering.
