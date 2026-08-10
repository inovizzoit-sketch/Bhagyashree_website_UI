# Bhagyashree CMS — Admin Panel Design System

This document outlines the design goals, color palette, layout, and component specifications of the **Bhagyashree CMS Admin Panel**. 

---

## 1. Design Goals

*   **Premium Dark SaaS Aesthetic**: Inspired by modern dark layouts (Linear, Vercel, Stripe Developer Dashboard) utilizing high-contrast borders and indigo accents.
*   **Minimal and Eye-Friendly**: Low fatigue interface using dark slate shades instead of pure pitch black.
*   **Highly Responsive**: Layout handles desktop, tablet side-drawer states, and clean mobile viewports gracefully.
*   **Intuitive Navigation**: Collapsible sidebar, clear route active states, and persistent top action rows.

---

## 2. Color Theme (Premium Dark System)

*   **Page Background**: `#0F0F14` (Neutral deep gray)
*   **Card / Component Background**: `#13131A` (Elevation gray)
*   **Borders / Dividers**: `#1E1E2E` (Subtle dark slate border)
*   **Primary Accent Color**: Gold (`#DDBD81` / `bg-gold-solid`)
*   **Feedback Colors**:
    *   **Success**: Emerald (`bg-emerald-500/10 text-emerald-400 border-emerald-500/25`)
    *   **Warning/Attention**: Amber (`bg-amber-500/10 text-amber-405 border-amber-500/25`)
    *   **Error/Danger**: Red (`bg-red-500/10 text-red-400 border-red-500/25`)
*   **Text Hierarchy**:
    *   **Main Headings (H1/H2)**: `#F1F5F9` (Slate-100)
    *   **Body Content**: `#CBD5E1` (Slate-300)
    *   **Muted Labels / Details**: `#94A3B8` (Slate-400) / `#64748B` (Slate-500)

---

## 3. Layout Structure

*   **Collapsible Sidebar**:
    *   Sits at `w-[240px]` on desktop.
    *   Collapses into an interactive slide-out drawer on mobile (z-index overlay over page content).
    *   Shows clear active items using a soft gold glow (`bg-gold-solid/15 text-gold-solid`).
*   **Sticky Topbar**:
    *   Height of `60px` with a fine bottom border (`border-[#1e1e2e]`).
    *   Holds view-switching shortcuts and user indicators.
*   **Responsive Padding**:
    *   Mobile/Tablet: `p-4` spacing.
    *   Desktop: `p-8` container spacing.

---

## 4. Components & Styling Rules

*   **Cards**:
    *   `rounded-2xl` (16px border-radius) for modern container curvature.
    *   Fine borders with subtle elevation shadows (`shadow-sm`).
*   **Action Buttons**:
    *   **Primary Action**: Gold filled pill/rounded buttons (`bg-gold-solid hover:bg-gold-hover text-[#020520] font-bold`).
    *   **Secondary Action**: Glassmorphic dark slate button (`bg-[#1c1c27] hover:bg-[#252535] text-slate-300`).
    *   **Danger/Delete**: Red translucent border styling (`bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20`).
*   **Form Inputs**:
    *   Background `#0B0B0F` with `#1E1E2E` borders.
    *   Transition borders to `gold-solid` on focus.
    *   Select lists and dropdowns styled to overlap elements cleanly using custom shadows.

---

## 5. Tables & Lists

*   **Header row**: Styled with subtle backdrop color (`bg-[#171722]/40`) and uppercase tracking headers.
*   **Row Interactions**: Subtle hover highlights (`hover:bg-[#151520]`) with micro-animations.
*   **Multi-Action Columns**: Action rows hold grouped icon buttons for View, Edit, and Delete.

---

## 6. UX Best Practices Implemented

*   **Click-Outside Closures**: Multi-select and overlay dropdowns automatically close when clicking outside using full-screen transparent backdrops (`fixed inset-0 z-20`).
*   **Modal Overlays**: Modals use heavy dark backdrops (`bg-black/75 backdrop-blur-sm`) with clear cross symbols and close buttons.
*   **Load & Error States**: Custom spinning loaders and descriptive inline error blocks with warning icons (`⚠️`).