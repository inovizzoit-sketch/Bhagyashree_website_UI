# Bhagyashree CMS — Website Testing Workflow

## Overview

This document outlines the step-by-step manual and automated testing workflow for the **Bhagyashree CMS Web** project. Follow this guide before every release or after major feature changes.

---

## 1. Environment Setup

Before running tests, ensure both services are running:

### Start Backend
```bash
cd /Users/pratibha875695gmail.com/Work/Backend/bhagyashree-backend
npm run start:dev
# Backend should be running at http://localhost:5001
```

### Start Frontend
```bash
cd /Users/pratibha875695gmail.com/Work/frontend/bhagyashree-cms
npm run dev
# Frontend should be running at http://localhost:3000
```

---

## 2. Build Validation (Before Testing)

Always verify a clean TypeScript build passes before testing the UI:

```bash
cd /Users/pratibha875695gmail.com/Work/frontend/bhagyashree-cms
npm run build
```

✅ Expected: `✓ Compiled successfully` with no TypeScript errors.

---

## 3. Web Pages — Smoke Testing Checklist

Test each public-facing route in the browser at `http://localhost:3000`.

### 3.1 Home Page (`/`)
- [ ] Page loads without errors
- [ ] Hero section renders with heading and CTA
- [ ] Gallery section shows a preview
- [ ] Navigation links are all clickable
- [ ] Popup appears (if configured) after trigger

### 3.2 Gallery (`/gallery`)
- [ ] Categories grid renders with cover images and item count
- [ ] Hover effects animate correctly
- [ ] Clicking a category navigates to `/gallery/[slug]`
- [ ] Empty state shows "No Categories Available" if no data

### 3.3 Gallery Category Page (`/gallery/[slug]`)
- [ ] URL is clean (no `?id=...` parameter)
- [ ] Category name shows in the heading
- [ ] Image grid renders in correct responsive layout (1→2→3→4 columns)
- [ ] Lazy loading works (images load as you scroll)
- [ ] Clicking an image opens the lightbox
- [ ] Lightbox: Next/Prev buttons work
- [ ] Lightbox: Arrow keys (← →) navigate images
- [ ] Lightbox: `Esc` key closes the modal
- [ ] Counter (e.g. "2 / 12") shown correctly
- [ ] Pagination renders if > 12 images
- [ ] Pagination navigates correctly
- [ ] "No images available" message shown if category is empty

### 3.4 Projects (`/projects`)
- [ ] Projects grid renders correctly
- [ ] Clicking a project card navigates to `/projects/[slug]`

### 3.5 Blogs (`/blogs`)
- [ ] Blog list renders with thumbnails and dates
- [ ] Clicking a blog navigates to its detail page

### 3.6 About Us (`/about-us`)
- [ ] Page loads without visual errors

### 3.7 Contact (`/contact`)
- [ ] Contact form renders
- [ ] Submitting with empty fields shows validation errors

### 3.8 Other Routes
- [ ] `/amenities` — loads correctly
- [ ] `/governance` — loads correctly
- [ ] `/decoding-land` — loads correctly

---

## 4. Admin Panel — Smoke Testing Checklist

Open `http://localhost:3000/admin` and log in.

### 4.1 Gallery Admin (`/admin/gallery`)
- [ ] Categories list is visible
- [ ] Can create a new category
- [ ] Can upload images to a category
- [ ] Image count updates after upload

### 4.2 Popup Management (`/admin/popup`)
- [ ] Popup list renders
- [ ] Can create a new popup campaign
- [ ] Target Type "All Pages" disables the page selector
- [ ] Target Type "Specific Pages" enables searchable multi-select
- [ ] Search in dropdown filters page list correctly
- [ ] Pages from the CMS (projects, blogs, gallery) appear in dropdown
- [ ] Chips (selected pages) display and are removable
- [ ] Submitting with "Specific Pages" and no selection shows error
- [ ] Editing an existing popup restores previously selected pages

### 4.3 Projects Admin (`/admin/projects`)
- [ ] Projects list renders
- [ ] Can create/edit/delete a project

### 4.4 Blogs Admin (`/admin/blogs`)
- [ ] Blog list renders
- [ ] Can create/edit/delete a blog post

---

## 5. Responsive Design Testing

Test the following breakpoints using Chrome DevTools (`F12` → Device Toolbar):

| Breakpoint | Size     | Pages to Test              |
|------------|----------|----------------------------|
| Mobile     | 375px    | Home, Gallery, Category    |
| Tablet     | 768px    | Gallery, Projects          |
| Desktop    | 1280px   | All pages                  |
| Large      | 1440px+  | Home, Gallery              |

For each breakpoint, check:
- [ ] Navigation collapses into a hamburger menu on mobile
- [ ] Gallery grid adapts (1 col mobile, 2 tablet, 4 desktop)
- [ ] Images don't overflow
- [ ] Text remains readable

---

## 6. Browser Console Checks

Open DevTools Console (`F12`) and verify no errors on:

| Route | Common Error to Watch |
|---|---|
| `/gallery/[slug]` | `categoryId is not defined` |
| `/admin/popup/edit/*` | `API_BASE_URL is not defined` |
| All pages | `Uncaught TypeError` or `ReferenceError` |

✅ Expected: Console is clean (no red errors) after each route visit.

---

## 7. Automated Testing (Playwright)

The project has Playwright installed. Run end-to-end tests:

```bash
cd /Users/pratibha875695gmail.com/Work/frontend/bhagyashree-cms
npx playwright test
```

To run with visible browser:
```bash
npx playwright test --headed
```

To run a specific test file:
```bash
npx playwright test tests/gallery.spec.ts --headed
```

---

## 8. API Health Check

Manually verify the backend APIs the frontend depends on:

```bash
# Gallery categories
curl http://localhost:5001/gallery/category?status=true

# Gallery items
curl http://localhost:5001/gallery?status=true&limit=12

# Projects
curl http://localhost:5001/projects

# Blogs
curl http://localhost:5001/blog
```

✅ All should return JSON arrays.

---

## 9. Known Issues & Workarounds

| Issue | Status | Notes |
|---|---|---|
| `scroll-behavior: smooth` warning in console | ✅ Harmless | Next.js router warning, no fix needed |
| Category page URL previously showed `?id=...` | ✅ Fixed | Now uses clean slug-only URLs |
| Forms appearing in popup page selector | ✅ Fixed | Forms section removed from dropdown |

---

## 10. Pre-Release Checklist

Before pushing to production:

- [ ] `npm run build` passes with no TypeScript errors
- [ ] All smoke tests in Section 3 & 4 pass
- [ ] No console errors on main pages
- [ ] Responsive layout checked on mobile and desktop
- [ ] `git add . && git commit -m "your message" && git push origin main`

---

*Last updated: 2026-07-23*
