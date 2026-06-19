# Sidebar Redesign — Spec

**Date:** 2026-06-18
**Scope:** Visual redesign of `src/shared/ui/sidebar/`. No changes to routing, auth, or permissions logic.

---

## Design Direction

Modern Pill (Linear/Vercel style):
- Tighter item padding, subtle pill highlight for active state
- Logo row at top (branded icon + app name)
- Section label "Navigation" above nav items
- Floating toggle circle (24px) on the right edge of the sidebar, vertically centered
- Collapsed (64px): icon-only, all text hidden, logo icon stays
- Dark + light mode via Tailwind tokens + `html:not(.dark)` overrides in `main.css`

---

## Layout Structure (expanded, 256px)

```
sidebar (relative, flex-col, h-full, bg-sidebarSurface)
├── [floating toggle: absolute right:-12px top:50%]
├── logo-row (logo-icon "A" + logo-text "AdminApp")
├── section-label "Navigation"
├── nav (flex-col gap-1, flex-1)
│   ├── NavItem → Dashboard (lucide:layout-dashboard)
│   └── NavItem → Login    (lucide:log-in)
└── bottom (logout)
    └── NavItem → Logout (lucide:log-out, action)
```

## Layout Structure (collapsed, 64px)

```
sidebar (64px)
├── [floating toggle: chevron-right]
├── logo-row (logo-icon only, centered)
├── nav (icons centered, text hidden)
│   ├── dashboard icon
│   └── login icon
└── bottom
    └── logout icon
```

---

## Token Usage

| Element | Dark token | Light override |
|---|---|---|
| Sidebar bg | `bg-sidebarSurface` | inherited |
| Item default | `text-txtSecondaryDark` | `html:not(.dark)` override |
| Item active text | `text-txtPrimaryDark` | `html:not(.dark)` override |
| Item active bg | `bg-secondaryBgDark` | `html:not(.dark)` override: `rgba(108,124,255,0.09)` |
| Active shadow | `shadow-sidebarActive` | unchanged |
| Logo icon | `bg-primary` gradient | unchanged |

---

## Floating Toggle

- `position: absolute; right: -12px; top: 50%; transform: translateY(-50%)`
- Size: `24×24px`, `border-radius: 50%`
- Background: `bg-elevated` token, border: `border-borderDefault`
- Icon: `lucide:chevron-left` (expanded) / `lucide:chevron-right` (collapsed), 11px
- Hover: `border-primary/50`, `text-primary`
- Needs `z-index: 50` to appear above main content

---

## NavItem Changes

- Padding: `px-[14px] py-[10px]` → `px-2 py-[7px]` (8px / 7px)
- Gap: `gap-2` → `gap-[9px]`
- Icon size: 14px (current VIcon default)
- Active bg: `bg-secondaryBgDark` (keep token)
- Active shadow: `shadow-sidebarActive` (keep)
- Text: `leading-[1.3]` stays; class names updated

## Collapsed state (in NavItem via parent's :deep())

When sidebar is collapsed (`.sidebar--collapsed` class on sidebar div):
- `.sidebar--collapsed :deep(.link) { justify-content: center; padding-left: 0; padding-right: 0; }`
- `.sidebar--collapsed :deep(.link span) { display: none; }`
- `.sidebar--collapsed :deep(.link svg), .sidebar--collapsed :deep(.link .iconify) { width: 16px; height: 16px; }`

---

## Bug Fix (required for collapse to work)

DefaultLayout.vue listens `@toggle` but Sidebar emits `update`. Fix: change `@toggle` to `@update` in DefaultLayout. This makes grid columns update correctly on collapse.

---

## Files Changed

| File | What changes |
|---|---|
| `src/shared/ui/sidebar/index.vue` | Logo row, section label, floating toggle, remove old toggle, icon-only collapse via CSS class |
| `src/shared/ui/sidebar/NavItem.vue` | Tighter padding, icon size, update active/hover classes |
| `src/app/layout/DefaultLayout.vue` | `@toggle` → `@update` (bug fix), `aside` needs no extra changes |
| `src/app/main.css` | Light mode overrides for sidebar surface + active item |

## Out of Scope

- Nav items content (routes, icons) — unchanged
- Logout handler — unchanged
- Auth logic — unchanged
- Sidebar animation (collapse is instant, no transition needed per Emil: used very frequently)
