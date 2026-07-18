# Lists Page — Modern Redesign Spec

**Date:** 2026-07-18
**Scope:** Visual redesign of `ListsFeature.vue` and its child components (`Filters`, `MyLists`, `UsersLists`, `ListContainer`), plus `VSegmentControl.vue`. No changes to logic, composables, props, emits, routing, or data flow.

---

## Goal

Turn the currently unstyled lists page (bare rows, no spacing, no visual hierarchy) into a modern, polished view using existing Tailwind theme tokens (`bg-secondaryBg`, `text-txtPrimary`, `border-borderDefault`, etc. from `createThemes`), consistent with the rest of the app's light/dark theming.

Explored via the brainstorming visual companion (3 rounds of mockups); decisions below were picked by the user directly from rendered options.

---

## Constraints

- **No logic changes** — composables (`useListsQuery`, `useCreateList`, `useUpdateList`), API calls, emits, props, and routing stay untouched.
- **No new features** — no new props, no new components beyond what's needed to express the layout (a wrapping panel `<div>` is not a new component).
- **Shared UI components (`VInput`, `VSelect`, `VButton`) are not restyled** — they're used across the whole app. Only their existing props/classes are used in the new layout.
- **`VSegmentControl.vue` may be restyled directly** — confirmed via grep, it is used exclusively on this page (`src/features/listsManager/lists/ListsFeature.vue`), so styling it here has no blast radius elsewhere.
- Must work in both light and dark theme (CSS variable–backed tokens, no hardcoded hex except per-list accent color already stored on the list).
- Must be responsive (mobile → desktop).

---

## Layout Structure

```
ListsFeature.vue
└── Panel (rounded-2xl bg-secondaryBg border border-borderDefault shadow-soft p-4)
    ├── VSegmentControl (pill toggle, left) — only rendered if canViewUsersLists
    └── Filters (search + sort + reset, right-aligned, same row on desktop)
└── Grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4)
    └── ListContainer × N (tile card)
```

On mobile (`<sm`), the panel stacks: segment control on its own row, filters below, each filter control full-width.

---

## Visual Style

### Panel (segment control + filters)
Wraps the existing `<VSegmentControl>` and `<Filters>` in `ListsFeature.vue`:
```
rounded-2xl bg-secondaryBg border border-borderDefault shadow-soft p-4
flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
```

### VSegmentControl (pill toggle)
```
outer: inline-flex rounded-full bg-elevated p-1
button (active): rounded-full bg-secondaryBg shadow-soft text-txtPrimary
button (inactive): rounded-full text-muted hover:text-txtPrimary
transition: background-color 150ms ease, color 150ms ease
```
No layout-shift animation needed (2 items, low frequency per Emil's frequency table) — plain color/background transition is enough.

### Filters row
No restyle of `VInput`/`VSelect`/`VButton` internals. Layout only:
```
flex flex-col sm:flex-row items-stretch sm:items-center gap-3
search input: w-full sm:w-72 (was w-[320px] fixed)
```
Reset button keeps `variant="primary"`.

### List cards (`ListContainer.vue`) — tinted tile style ("C3")
Each card gets a **per-list tint** derived from `list.hexColor` (arbitrary user-chosen color, so it can't be a fixed Tailwind token — computed inline):

```ts
const cardStyle = computed(() => ({
  backgroundColor: `${props.list.hexColor}14`, // ~8% alpha
  borderColor: `${props.list.hexColor}2E`,     // ~18% alpha
}))
```

```html
<div class="group rounded-2xl border p-4 transition-shadow duration-150 ease-out
            hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)]"
     :style="cardStyle">
```

Card internals:
- Header row: list title (`text-bodyEmphasis text-txtPrimary truncate`) + action menu button, `justify-between`
- Count: `X / Y` — big number (`text-headingCard text-txtPrimary`) + `/ Y` muted (`text-bodyM text-muted`)
- Progress bar: track `bg-secondaryBg/60 h-1.5 rounded-full overflow-hidden`, fill uses the list's own color inline (`backgroundColor: list.hexColor`), `transition: width 200ms ease-out`
- Action menu (`ActionMenu`) button: always visible, muted by default (`text-muted`), `hover:text-txtPrimary transition-colors duration-150` — not hidden behind opacity/hover-reveal (keeps it usable on touch devices)

Grid gap: `gap-4`. Card click target for opening a list stays the existing `<button>` — no change to click handling, only its visual treatment (full-width clickable title area, no default button styling).

### Micro-interactions (per emil-design-eng)
- Card: `transition: box-shadow 160ms ease-out` on hover only — no scale/transform (this is a data list, not a pressable button, and is viewed dozens of times/day).
- Action menu button: `transition: color 150ms ease-out`.
- Progress bar fill: `transition: width 200ms ease-out`.
- Segment control: `transition: background-color 150ms ease-out, color 150ms ease-out`.
- Any existing `VButton` usage in this feature (e.g. reset filters, create list) already has hover/disabled states from the shared component — no changes needed there.

---

## Files to Change

| File | Change |
|---|---|
| `ListsFeature.vue` | Wrap `VSegmentControl` + `Filters` in a panel `<div>`; class names only |
| `VSegmentControl.vue` | Add pill-toggle styling (template classes + active/inactive binding) |
| `Filters.vue` | Layout classes only (flex/gap/width adjustments) |
| `MyLists.vue` | Wrap `ListContainer` loop in responsive grid `<div>` |
| `UsersLists.vue` | Wrap `ListContainer` loop in responsive grid `<div>` |
| `ListContainer.vue` | Full visual rebuild of the template (tile card); add a `computed` for the inline tint style; no changes to script logic (API calls, emits, actions) beyond that one presentational computed |

**Not changed:** `useListsQuery.ts`, `useCreateList.ts`, `useUpdateList.ts`, `listsApi.ts`, `CreateListModal.vue`, `EditListModal.vue`, types, routing.

---

## Dark / Light Mode

All non-accent colors come from theme tokens (`bg-secondaryBg`, `bg-elevated`, `text-txtPrimary`, `text-muted`, `border-borderDefault`) which already resolve correctly per theme via `createThemes`'s CSS variables. The per-list tint (`hexColor` + alpha suffix) is theme-agnostic by construction — it's a translucent overlay so it reads correctly on both the light (`#F9FAFB`) and dark (`#0B0F1A`) page background.

---

## Out of Scope

- Any change to `VInput`, `VSelect`, `VButton` (shared, used app-wide)
- Empty-state design (no lists) — not requested, current behavior (empty grid) is preserved
- Loading-state design — `VLoader` usage unchanged
- Routing, composables, API layer
- Any page other than the lists page
