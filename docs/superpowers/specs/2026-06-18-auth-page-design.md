# Auth Page Redesign — Design Spec

**Date:** 2026-06-18
**Scope:** Visual redesign of `/auth` page (Login + Signup). No changes to form logic, validation, composables, or routing.

---

## Overview

Remove the traditional card-over-background pattern. The form becomes part of the scene — an invisible container that sits inside a deep, radially-lit background. Navigation between Login and Signup uses large typographic headings rather than a pill or tab component.

---

## Background

**Style:** Single radial bloom — one concentrated light source behind the form, fading to near-black at the edges.

```css
background: radial-gradient(ellipse 52% 58% at 50% 48%,
  #1c2d8a 0%,
  #0e1640 38%,
  #06080f 100%
);
```

A soft secondary glow layer (`blur: 30px`, `rgba(71,111,255,0.17)`) sits directly behind the card for depth.

**Constellation dots** (existing `AuthBackground.vue`) are retained as-is — floating animated dots using `--color-primary`.

**Aurora blobs** from `AuthBackground.vue` remain unchanged.

---

## Card

The card has no visible fill — it blends with the background. Its only visual presence is a faint border and a subtle backdrop.

```
background: rgba(255,255,255,0.025)
border: 1px solid rgba(108,124,255,0.14)
border-radius: 24px
padding: 32px 36px 36px
width: 380px
```

No `box-shadow`. No opaque background. The card is a spacing and layout container, not a visual element.

---

## Navigation (Login / Signup switcher)

Replace the current `VTabs` pill with large typographic headings. The tab-switching logic in `AuthFeature.vue` remains unchanged. Since `VTabs` renders its own tab buttons internally, check if it exposes a tab-button slot. If yes — use it to render heading-style tabs. If no — replace `VTabs` in `AuthFeature.vue` with a local `activeTab` ref + `v-if` on the form components (identical switching behavior, no shared component modified).

**Active tab:**
- `font-size: 24px`, `font-weight: 700`, `color: #fff`
- Gradient underline: `height: 2px`, `background: linear-gradient(90deg, #6c7cff, transparent)`

**Inactive tab:**
- Same size/weight, `color: rgba(255,255,255,0.20)`
- No underline

**Transition:** `color 180ms ease` on tab change. The underline animates via `opacity 180ms ease` (GPU-accelerated, no layout reflow).

---

## Input Fields (Floating Label)

All inputs use a floating label pattern. `VInput.vue` needs a new `floatingLabel` prop (or a new variant) — the existing non-floating label mode stays intact for use elsewhere in the app.

### States

**Empty / idle:**
```
label: inside field, vertically centered, font-size 13px, color rgba(255,255,255,0.28)
background: rgba(255,255,255,0.04)
border: 1px solid rgba(255,255,255,0.09)
border-radius: 12px
height: 52px
```

**Filled (label floated up):**
```
label: top: 8px, font-size: 10px, font-weight: 500, color: rgba(108,124,255,0.80)
value text: bottom: 10px, left: 14px, font-size: 13px
```

**Focused:**
```
background: rgba(108,124,255,0.07)
border-color: rgba(108,124,255,0.45)
box-shadow: 0 0 0 3px rgba(108,124,255,0.10)
label: floated up (same as filled state)
```

**Error state:** border-color `rgba(239,68,68,0.6)`, box-shadow `0 0 0 3px rgba(239,68,68,0.10)`. Error message below field, `font-size: 12px`, `color: var(--color-dangerous)`.

**Label transition:** `top`, `font-size`, `color` — all `160ms ease`.

Password fields retain the show/hide eye icon (`VIcon`, right-aligned, `color: rgba(255,255,255,0.18)`).

---

## Submit Button

Uses existing `VButton` with `variant="primary"`. Style override scoped to the auth context:

```
height: 46px
border-radius: 12px
background: linear-gradient(90deg, #3e4fff, #6c7cff)
box-shadow: 0 4px 20px rgba(62,79,255,0.38)
font-size: 14px, font-weight: 600
```

**Active/press state** (Emil principle): `transform: scale(0.97)`, `transition: 140ms ease`.

---

## Forms (unchanged logic)

### Login — `LoginForm.vue`
Fields: Email, Password
Submit text: "Log in"

### Signup — `SignupForm.vue`
Fields: Full Name, Email, Password, Confirm Password
Submit text: "Sign up"

All validation, `v$`, composables (`useLoginForm`, `useSignupForm`), and error handling remain untouched.

---

## Layout — `AuthLayout.vue`

```
background: #06080f (replaces bg-primaryBg to ensure deep dark)
display: flex, align-items: center, justify-content: center
overflow: hidden, position: fixed, inset: 0
```

`ThemeToggle` stays at `top: 22px, left: 22px`.

---

## Dark / Light mode

The auth page is intentionally always dark — the deep-space aesthetic does not adapt to light mode. `AuthBackground.vue` already hides aurora blobs in `.dark` — this behavior is retained. The page background stays `#06080f` regardless of theme.

---

## Animation

| Element | Animation |
|---|---|
| Tab switch | `color 180ms ease`, underline `opacity 180ms ease` |
| Input focus | `border-color`, `box-shadow`, `background` — `160ms ease` |
| Floating label | `top`, `font-size`, `color` — `160ms ease` |
| Button press | `transform: scale(0.97)`, `160ms ease` |
| Constellation dots | Existing `dot-float` keyframe, unchanged |
| Aurora blobs | Existing `aurora-drift` keyframe, unchanged |

No new keyframe animations. All transitions use `ease` or `ease-out` per Emil principles.

---

## Files to change

| File | Change |
|---|---|
| `AuthFeature.vue` | Replace card wrapper styles; adapt tab rendering to use large heading nav |
| `AuthBackground.vue` | No changes |
| `AuthLayout.vue` | Set `bg-[#06080f]` explicitly |
| `AuthCard.vue` | Restyle: invisible card, new padding/radius |
| `LoginForm.vue` | Use floating label variant of VInput |
| `SignupForm.vue` | Use floating label variant of VInput |
| `VInput.vue` | Add `floating` prop/variant for floating label behavior |
| `main.css` | Add auth-scoped CSS for floating label states, nav heading style, card style |

---

## Out of scope

- Routing changes
- Validation logic
- Composable changes (`useLoginForm`, `useSignupForm`)
- Any page outside `/auth`
