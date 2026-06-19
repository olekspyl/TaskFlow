# Animated Background for /auth — Design

## Goal

Replace the current flat `bg-primary` fill on the `/auth` page with a modern, abstract, subtly animated background that works in both light and dark themes, without harming performance or accessibility.

## Current State

- `AuthLayout.vue` wraps the page in a `min-h-screen overflow-hidden bg-primary` container, places `ThemeToggle` in the top-right corner, and centers `<RouterView />` (which renders `AuthFeature.vue` → `AuthCard.vue`).
- `AuthCard.vue` is a card with `bg-gradient-to-r from-authBgFrom to-authBgTo` and `border-b border-primary`.
- The `authBg` (image) and `authForm` tokens in `tailwind.config.ts` are unused leftovers — not part of this design.
- Theme switching is done by toggling a `.dark` class on `<html>` (via `ThemeToggle.vue`); `createThemes` exposes theme colors as CSS custom properties (`--color-*`) that change value under `.dark`.

## Visual Direction (approved via mockups)

- **Light theme:** soft blurred "aurora" gradient blobs slowly drifting/breathing, with a constellation of small glowing dots connected by thin lines layered on top.
- **Dark theme:** constellation only (dots + connecting lines), no aurora blobs.
- Animation is subtle, autonomous (no mouse parallax), and respects `prefers-reduced-motion`.

## Architecture

### New component: `src/features/auth/components/AuthBackground.vue`

- Purely decorative, full-viewport fixed layer:
  ```html
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <!-- aurora blobs (light theme only) -->
    <!-- SVG constellation (both themes) -->
  </div>
  ```
- **Aurora blobs:** 3 absolutely-positioned `div`s with large size, `border-radius: 50%`, `filter: blur(...)`, low opacity. Hidden in dark theme via a `.dark` ancestor selector (e.g. `.dark .aurora-blob { display: none; }`), since `.dark` is set on `<html>`, an ancestor of the component root.
- **Constellation:** one inline SVG containing ~8 `<circle>` dots (varying small radii) and ~6-8 `<line>` connectors between them. Visible in both themes.
- No JS animation loop, no randomization, no mouse tracking — everything is driven by CSS keyframes on fixed, hand-placed positions (matches the approved mockup).

### Color tokens (no new tailwind config entries needed)

Reuse existing theme tokens, which already happen to match the approved mockup colors:

- Aurora blobs: `gradientFrom` (#422CD0 light), `gradientTo` (#7592FF light), `themeSwitchBorder` (#B7C7F8 light)
- Constellation dots/lines: `primary` (#476FFF light / #6C7CFF dark — adapts automatically per theme via the existing CSS variable)

### Animation

- **`auroraDrift` keyframes** (applied to each blob, with per-blob duration/delay variation): subtle `translate` (±30-40px) + slight `scale` change, `20s`–`30s ease-in-out infinite alternate`. Opacity per blob in the `0.15`–`0.35` range.
- **`dotFloat` keyframes** (applied to each SVG dot via CSS, using `transform`): amplitude ~6-10px vertical float, `6s`–`10s ease-in-out infinite`, staggered `animation-delay` per dot for an organic feel.
- Connecting lines are static (no animation), low opacity (~0.15–0.2).
- **Reduced motion:** wrap all `animation` declarations so that `@media (prefers-reduced-motion: reduce)` sets `animation: none` — blobs and dots remain visible as static shapes, just without movement.

### Integration: `AuthLayout.vue`

- Change root container background from `bg-primary` to `bg-primaryBg` (matches the mockup's stage background).
- Add `<AuthBackground />` as the first child inside the relative container, before `ThemeToggle` and the `RouterView` wrapper, so it paints behind all interactive content (`pointer-events: none` + `-z-10` ensure it never intercepts clicks or sits above content).
- No changes to `AuthCard.vue` or any form components — they continue to render on top of the new background unchanged.

## Accessibility & Performance

- `aria-hidden="true"` and `pointer-events: none` on the root — purely decorative, never focusable or interactive.
- `prefers-reduced-motion: reduce` disables all animation (static fallback).
- Animations limited to `transform`/`opacity` (GPU-friendly); `blur()` filter applied to only 3 elements.
- No JS animation loop, no event listeners, no new dependencies.

## Out of Scope

- Mouse-driven parallax (explicitly declined).
- Canvas/particle-system based implementation.
- Randomized/dynamic constellation layout.
- Changes to `AuthCard.vue`, `authBg`/`authForm` tokens, or form styling.

## Testing

- `npm run type-check` — no new TS errors.
- Manual visual check in browser: light theme (blobs + constellation visible, animating subtly), dark theme (constellation only), toggle via `ThemeToggle`.
- Manual check with OS "reduce motion" setting enabled — confirm animations stop, shapes remain static.
