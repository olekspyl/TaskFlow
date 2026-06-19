# Permissions Page — Compact Redesign Spec

**Date:** 2026-06-18
**Scope:** Visual + layout redesign of `/users/:id/permissions`. No changes to logic, composables, props, or routing.

---

## Goal

Eliminate page scroll by reducing vertical space consumption. Apply the same glass/dark aesthetic used on the auth page.

---

## Constraints

- **No logic changes** — composables, validation, emits, props stay untouched
- **No new features** — no new props, no new components
- CSS overrides scoped to `.perms-layout` in `main.css` where possible
- Minimal template changes: only class names and one layout restructure (Save button moved into toolbar)

---

## Space Savings Summary

| Change | Vertical saved |
|---|---|
| `p-8` → `px-6 py-4` on outer wrapper | −32px |
| `gap-6 × 2` → `gap-3` | −24px |
| UserPanel `p-5` → `py-3 px-4`, avatar `h-12` → `h-9` | −16px |
| Table rows `h-[70px]` → `h-[44px]` (10 rows) | −260px |
| Table internal `p-6` → `px-4 py-3` | −18px |
| Save button row removed (moved into toolbar) | −68px |
| **Total** | **~−418px** |

---

## Layout Structure

```
px-6 py-4, gap-3
├── UserPanel (glass card, py-3 px-4, avatar h-9)
└── Table (glass card, flex-1, overflow-y-auto)
    ├── toolbar: [Permission matrix]  [Role ▼] [All perms ◉] [Save]
    ├── header row
    └── rows h-[44px] × N
```

Save button moves from standalone bottom row into the toolbar's right side — same `@click="saveUserPermissions"`, same `:disabled` / `:loading` props.

---

## Visual Style

### Glass cards (both UserPanel and table container)
```
background: rgba(255, 255, 255, 0.025)
border: 1px solid rgba(108, 124, 255, 0.14)
border-radius: 16px
```
Replaces: `bg-secondaryBg shadow-soft` on UserPanel and table wrapper in `UsersPermissionsFeature.vue`.

### Table header
```
background: rgba(108, 124, 255, 0.06)
border-bottom: 1px solid rgba(108, 124, 255, 0.10)
```
Replaces: `bg-elevated` on sticky header cells in `Table.vue` (CSS override only, no template change).

### Table rows
Row height reduced from `h-[70px]` to `h-[44px]` via CSS override:
```css
.perms-layout [class*="h-\[70px\]"] { height: 44px !important; }
```

### Save button
Same gradient as auth submit button:
```
background: linear-gradient(90deg, #3e4fff, #6c7cff)
box-shadow: 0 3px 12px rgba(62, 79, 255, 0.32)
border-radius: 8px
```
Scoped to `.perms-layout .button.primary`.

---

## Role Badge Icons

| Role | Current icon | New icon |
|---|---|---|
| User | `mdi:account` | `mdi:account-circle` |
| Admin | `mdi:crown` | `mdi:shield-account` |

Change location: `UserPanel.vue` template, `:icon` prop on `VIcon`.

---

## Files to Change

| File | Change |
|---|---|
| `UsersPermissionsFeature.vue` | Class name changes; move Save into `#toolbar` slot |
| `UserPanel.vue` | Reduce padding + avatar size (class names only) |
| `src/app/main.css` | Add `.perms-layout` scoped CSS block |

**Not changed:** `Table.vue`, composables, utils, types, routing.

---

## Dark / Light Mode

Same as auth page — glass surface works in both modes. The existing `bg-secondaryBg` references are removed from the wrapper; the glass card uses fixed rgba values that look good on both `#06080f` (dark) and `#f0f2fb` (light) page backgrounds.

Note: the permissions page lives inside the main app layout (not `AuthLayout`), so it inherits whatever background the app layout provides — no layout background change needed here.

---

## Out of Scope

- Routing changes
- Composable changes
- New props on any component
- Animation (the page is used frequently — no animation per Emil principles)
- Any page outside `/users/:id/permissions`
