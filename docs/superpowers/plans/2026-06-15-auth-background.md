# Animated /auth Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a subtle, abstract, theme-aware animated background (aurora blobs + constellation in light theme, constellation only in dark theme) to the `/auth` page, per `docs/superpowers/specs/2026-06-15-auth-background-design.md`.

**Architecture:** A single new presentational component `AuthBackground.vue` renders a fixed full-viewport decorative layer (CSS-animated blurred blobs + CSS-positioned dot/line "constellation"), themed entirely via existing CSS custom properties (`--color-gradientFrom`, `--color-gradientTo`, `--color-themeSwitchBorder`, `--color-primary`). `AuthLayout.vue` renders it as the first element and switches its own background from `bg-primary` to `bg-primaryBg`.

**Tech Stack:** Vue 3 `<script setup lang="ts">`, Tailwind CSS (existing theme tokens via `createThemes`), scoped CSS with `@keyframes` and `@media (prefers-reduced-motion: reduce)`.

---

### Task 1: Create `AuthBackground.vue`

**Files:**
- Create: `src/features/auth/components/AuthBackground.vue`

- [ ] **Step 1: Create the component file**

Create `src/features/auth/components/AuthBackground.vue` with the following content:

```vue
<script setup lang="ts">
import { computed } from 'vue'

type Dot = {
  x: number
  y: number
  size: number
  delay: number
}

const dots: Dot[] = [
  { x: 10, y: 15, size: 6, delay: 0 },
  { x: 80, y: 10, size: 8, delay: 0.6 },
  { x: 20, y: 70, size: 10, delay: 1.2 },
  { x: 70, y: 75, size: 6, delay: 1.8 },
  { x: 45, y: 40, size: 8, delay: 2.4 },
  { x: 90, y: 55, size: 10, delay: 3.0 },
  { x: 5, y: 50, size: 6, delay: 3.6 },
  { x: 60, y: 20, size: 8, delay: 4.2 },
  { x: 30, y: 90, size: 10, delay: 4.8 },
  { x: 88, y: 85, size: 6, delay: 5.4 },
]

const connections: [number, number][] = [
  [0, 4],
  [4, 1],
  [2, 4],
  [4, 3],
  [5, 3],
  [6, 2],
  [7, 5],
  [8, 2],
  [9, 5],
]

const lines = computed(() =>
  connections.map(([fromIndex, toIndex]) => {
    const from = dots[fromIndex]
    const to = dots[toIndex]
    const dx = to.x - from.x
    const dy = to.y - from.y
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI)

    return {
      left: `${from.x}%`,
      top: `${from.y}%`,
      width: `${length}%`,
      transform: `rotate(${angle}deg)`,
    }
  }),
)
</script>

<template>
  <div class="auth-background pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
    <div class="aurora-blob aurora-blob--1" />
    <div class="aurora-blob aurora-blob--2" />
    <div class="aurora-blob aurora-blob--3" />

    <div
      v-for="(line, index) in lines"
      :key="`line-${index}`"
      class="constellation-line"
      :style="{ left: line.left, top: line.top, width: line.width, transform: line.transform }"
    />

    <div
      v-for="(dot, index) in dots"
      :key="`dot-${index}`"
      class="constellation-dot"
      :style="{
        left: `${dot.x}%`,
        top: `${dot.y}%`,
        width: `${dot.size}px`,
        height: `${dot.size}px`,
        animationDelay: `${dot.delay}s`,
      }"
    />
  </div>
</template>

<style scoped>
.aurora-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  animation: aurora-drift 26s ease-in-out infinite alternate;
}

.aurora-blob--1 {
  top: -15%;
  left: -10%;
  width: 38vw;
  height: 38vw;
  background: var(--color-gradientFrom);
  opacity: 0.28;
}

.aurora-blob--2 {
  right: -10%;
  bottom: -15%;
  width: 32vw;
  height: 32vw;
  background: var(--color-gradientTo);
  opacity: 0.22;
  animation-duration: 32s;
}

.aurora-blob--3 {
  top: 45%;
  right: 8%;
  width: 24vw;
  height: 24vw;
  background: var(--color-themeSwitchBorder);
  opacity: 0.25;
  animation-duration: 38s;
}

.dark .aurora-blob {
  display: none;
}

.constellation-dot {
  position: absolute;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 8px var(--color-primary);
  opacity: 0.6;
  animation: dot-float 8s ease-in-out infinite;
}

.constellation-line {
  position: absolute;
  height: 1px;
  background: var(--color-primary);
  opacity: 0.15;
  transform-origin: left center;
}

@keyframes aurora-drift {
  0% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(4%, -3%) scale(1.08);
  }
  100% {
    transform: translate(-3%, 2%) scale(0.96);
  }
}

@keyframes dot-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .aurora-blob,
  .constellation-dot {
    animation: none;
  }
}
</style>
```

- [ ] **Step 2: Type-check**

Run: `npm run type-check`
Expected: no new errors introduced (pre-existing unrelated errors in `api2.test.ts`, `usePermissions.ts`, `permissionsGroups.ts`, `permissionsRows.ts`, `VSelect.vue`, `formatDate.ts` are expected and unrelated).

---

### Task 2: Integrate `AuthBackground` into `AuthLayout.vue`

**Files:**
- Modify: `src/app/layout/AuthLayout.vue`

- [ ] **Step 1: Add the import and component, update background color**

Replace the full contents of `src/app/layout/AuthLayout.vue` with:

```vue
<script setup lang="ts">
import ThemeToggle from '@/shared/ui/ThemeToggle.vue'
import AuthBackground from '@/features/auth/components/AuthBackground.vue'
</script>

<template>
  <div class="min-h-screen overflow-hidden bg-primaryBg">
    <AuthBackground />

    <div class="container relative mx-auto min-h-screen">
      <ThemeToggle class="absolute right-6 top-6" />

      <div class="min-h-screen flex justify-center items-center">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
```

This places `AuthBackground` as the first child of the root element (so it paints behind the `bg-primaryBg` background's sibling content per normal DOM stacking order) while `pointer-events: none` on its root ensures it never blocks interaction with `ThemeToggle` or the auth forms.

- [ ] **Step 2: Type-check**

Run: `npm run type-check`
Expected: no new errors introduced.

---

### Task 3: Manual visual verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Verify light theme**

Open `/auth` in the browser (default theme is light, since `ThemeToggle`'s `enabled` ref defaults to `false`). Confirm:
- Three soft blurred gradient blobs are visible and slowly drifting/breathing.
- ~10 small glowing dots connected by thin lines are visible, gently floating up and down with staggered timing.
- The background sits behind the auth card and `ThemeToggle`, and does not block clicks on either.

- [ ] **Step 3: Verify dark theme**

Click `ThemeToggle` (top-right) to switch to dark mode. Confirm:
- The aurora blobs disappear (`display: none` via `.dark .aurora-blob`).
- The constellation dots/lines remain visible, recolored via `var(--color-primary)` (`#6C7CFF` in dark theme).

- [ ] **Step 4: Verify reduced motion**

In macOS: System Settings → Accessibility → Display → enable "Reduce motion". Reload `/auth` in both light and dark theme. Confirm:
- Blobs and dots no longer animate (no drifting/floating), but remain visible in their static positions.

Re-disable "Reduce motion" afterwards if it's not the user's normal preference.
