# Hero Section Module Documentation

This module provides administrators with absolute control over the homepage Hero landing section—enabling real-time configuration of text headings, call-to-actions, list tags, background videos, and color styling directly via the CMS dashboard.

---

## 1. Database Schema (Prisma)

The dynamic parameters are managed through a singleton model `HeroSettings` representing the primary top fold:

```prisma
model HeroSettings {
  id               String   @id @default(uuid())
  badgeText        String?  @map("badge_text") @db.VarChar(255)
  heading          String   @default("Kashi \nhas Chosen You") @db.Text
  description      String?  @db.Text
  videoUrl         String?  @map("video_url") @db.VarChar(500)
  primaryCtaText   String   @default("Enquire Now") @map("primary_cta_text") @db.VarChar(100)
  secondaryCtaText String   @default("View Projects →") @map("secondary_cta_text") @db.VarChar(100)
  secondaryCtaLink String   @default("/projects") @map("secondary_cta_link") @db.VarChar(500)
  features         String[] @default([])
  backgroundColor  String?  @map("background_color") @db.VarChar(50)
  textColor        String?  @map("text_color") @db.VarChar(50)
  accentColor      String?  @map("accent_color") @db.VarChar(50)
  isActive         Boolean  @default(true) @map("is_active")
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@map("hero_settings")
}
```

### Fields Definition
- `badgeText`: Sub-badge/tagline text appearing above the main heading (e.g. Ganges Waterfront Plots).
- `heading`: Primary header content. Line breaks are preserved using `\n`.
- `description`: Secondary subtext description paragraphs.
- `videoUrl`: Embed URL or 11-character YouTube video ID.
- `primaryCtaText` / `secondaryCtaText`: Label strings for CTA buttons.
- `secondaryCtaLink`: Route path string representing redirect target for the secondary CTA link.
- `features`: Array checklist tags summarizing key property aspects (e.g. RERA Approved).
- `backgroundColor` / `textColor` / `accentColor`: Hexadecimal color strings configuring inline layouts dynamically.
- `isActive`: Boolean toggle allowing custom overrides on the front-end homepage.

---

## 2. NestJS Backend API Routes

The backend module exposes the following endpoints:

| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---|
| **GET** | `/hero` | Retrieves current active hero config. Auto-populates defaults on first request if empty. | No |
| **PUT** | `/hero` | Updates the settings parameters. | Yes (Bearer Token) |

---

## 3. Frontend Integration

- **CMS Configuration**: Located at `/admin/hero` (registered in [HeroPage.tsx](file:///Users/pratibha875695gmail.com/Work/frontend/nandeeka-cms/src/modules/admin/pages/HeroPage.tsx)). Admin is presented with standard input controls, color color pickers, tags editor, and a reactive preview syncing color adjustments in real-time.
- **Home Integration**: Located in [Hero.tsx](file:///Users/pratibha875695gmail.com/Work/frontend/nandeeka-cms/src/modules/web/components/Hero.tsx). Auto-fetches current values upon component mounting and maps them inline, falling back to static styling templates if requested or when endpoints are offline.
