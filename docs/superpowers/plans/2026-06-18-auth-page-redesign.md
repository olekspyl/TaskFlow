# Auth Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the `/auth` page visually — radial bloom background, invisible card, typographic tab nav, floating label inputs, solid gradient button — without changing any form logic, validation, composables, or routing.

**Architecture:** Pure CSS/template changes. No new components, no new props, no script logic changes. All auth-scoped CSS goes into `main.css`. `VInput`, `VButton`, and all composables are untouched. `VTabs` is replaced in `AuthFeature.vue` with a local `activeTab` ref that replicates the same hash-sync behavior.

**Tech Stack:** Vue 3 `<script setup>`, Tailwind CSS, CSS `:placeholder-shown` + `:has()` for floating labels, `color-mix` for transparent colors.

---

## File Map

| File | What changes |
|---|---|
| `src/app/layout/AuthLayout.vue` | Dark bg `#06080f`, add glow div |
| `src/features/auth/AuthFeature.vue` | Invisible card wrapper, local heading nav replaces VTabs |
| `src/features/auth/components/LoginForm.vue` | Auth-field wrappers, external floating labels, remove `label` prop, add `placeholder=" "` |
| `src/features/auth/components/SignupForm.vue` | Same as LoginForm |
| `src/app/main.css` | All auth CSS: bloom, card, nav, floating label, input, button |

`VInput.vue`, `VButton.vue`, `AuthCard.vue`, `AuthBackground.vue`, all composables — **not touched**.

---

## Task 1: Dark background + radial bloom

**Files:**
- Modify: `src/app/layout/AuthLayout.vue`
- Modify: `src/app/main.css`

- [ ] **Step 1: Replace `bg-primaryBg` with explicit dark color and add glow div in `AuthLayout.vue`**

Full new template (script unchanged):

```vue
<template>
  <div class="auth-layout">
    <div class="auth-layout__bloom" aria-hidden="true"></div>
    <div class="auth-layout__glow" aria-hidden="true"></div>
    <AuthBackground />

    <div class="absolute left-6 top-6 z-10">
      <ThemeToggle />
    </div>

    <RouterView class="relative z-10" />
  </div>
</template>
```

- [ ] **Step 2: Add auth layout CSS to `main.css` (append after existing styles)**

```css
/* ─── Auth Layout ──────────────────────────────────────────── */
.auth-layout {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #06080f;
}

.auth-layout__bloom {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 52% 58% at 50% 48%,
    #1c2d8a 0%,
    #0e1640 38%,
    #06080f 100%
  );
}

.auth-layout__glow {
  position: absolute;
  width: 460px;
  height: 340px;
  background: radial-gradient(ellipse, rgba(71, 111, 255, 0.17), transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -52%);
  filter: blur(30px);
  pointer-events: none;
}
```

- [ ] **Step 3: Open `http://localhost:5174/auth` and verify the page background is deep dark `#06080f` with a blue glow centered behind where the form will sit. Constellation dots from `AuthBackground.vue` should still be visible.**

- [ ] **Step 4: Commit**

```bash
git add src/app/layout/AuthLayout.vue src/app/main.css
git commit -m "feat(auth): dark radial bloom background"
```

---

## Task 2: Invisible card + heading nav in `AuthFeature.vue`

**Files:**
- Modify: `src/features/auth/AuthFeature.vue`
- Modify: `src/app/main.css`

- [ ] **Step 1: Rewrite `AuthFeature.vue` — replace VTabs with local heading nav**

Full new file content:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LoginForm from './components/LoginForm.vue'
import SignupForm from './components/SignupForm.vue'
import VLoader from '@/shared/ui/common/VLoader.vue'
import { useUserStore } from '@/shared/stores'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

type Tab = 'login' | 'signup'
const activeTab = ref<Tab>(route.hash === '#signup' ? 'signup' : 'login')

const setTab = async (tab: Tab) => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  await router.replace({ hash: `#${tab}` })
}
</script>

<template>
  <div class="auth-card">
    <VLoader v-if="userStore.fetchUserLoading" size="section" />
    <template v-else>
      <nav class="auth-nav" aria-label="Auth tabs">
        <button
          class="auth-nav__item"
          :class="{ 'auth-nav__item--active': activeTab === 'login' }"
          type="button"
          @click="setTab('login')"
        >Login</button>
        <button
          class="auth-nav__item"
          :class="{ 'auth-nav__item--active': activeTab === 'signup' }"
          type="button"
          @click="setTab('signup')"
        >Signup</button>
      </nav>
      <LoginForm v-if="activeTab === 'login'" />
      <SignupForm v-else />
    </template>
  </div>
</template>
```

- [ ] **Step 2: Add card + nav CSS to `main.css`**

```css
/* ─── Auth Card ────────────────────────────────────────────── */
.auth-card {
  position: relative;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(108, 124, 255, 0.14);
  border-radius: 24px;
  padding: 32px 36px 36px;
  width: 380px;
  min-height: 0;
}

/* ─── Auth Nav ─────────────────────────────────────────────── */
.auth-nav {
  display: flex;
  gap: 20px;
  margin-bottom: 28px;
}

.auth-nav__item {
  font-size: 24px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.2);
  background: none;
  border: none;
  padding: 0 0 6px;
  position: relative;
  cursor: pointer;
  transition: color 180ms ease;
}

.auth-nav__item--active {
  color: #fff;
}

.auth-nav__item--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #6c7cff, transparent);
  border-radius: 2px;
  opacity: 1;
  transition: opacity 180ms ease;
}

.auth-nav__item:not(.auth-nav__item--active)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #6c7cff, transparent);
  border-radius: 2px;
  opacity: 0;
  transition: opacity 180ms ease;
}
```

- [ ] **Step 3: Verify on `http://localhost:5174/auth` — invisible card with "Login / Signup" large headings, clicking switches between forms. VLoader still shows when `fetchUserLoading` is true. URL hash updates on switch.**

- [ ] **Step 4: Commit**

```bash
git add src/features/auth/AuthFeature.vue src/app/main.css
git commit -m "feat(auth): invisible card + heading nav tab switcher"
```

---

## Task 3: Hide AuthCard title (nav headings replace it)

**Files:**
- Modify: `src/features/auth/components/LoginForm.vue`
- Modify: `src/features/auth/components/SignupForm.vue`

The `AuthCard` component renders an `<h1>` from the `title` prop. In the new design the nav headings serve as the visual title — the `AuthCard` title is redundant. Override the `#title` slot in both forms to render nothing.

- [ ] **Step 1: In `LoginForm.vue` add empty `#title` slot override**

```vue
<template>
  <AuthCard
    title="Welcome back"
    submitText="Log in"
    :loading="loading"
    :errorMessage="error?.message"
    @submit="onSubmit"
  >
    <template #title></template>

    <VInput ... />
    <VInput ... />
  </AuthCard>
</template>
```

- [ ] **Step 2: In `SignupForm.vue` add empty `#title` slot override**

```vue
<template>
  <AuthCard
    title="Create your account"
    submitText="Sign up"
    :loading="loading"
    :error-message="error?.message"
    @submit="onSubmit"
  >
    <template #title></template>

    <VInput ... />
    <VInput ... />
    <VInput ... />
    <VInput ... />
  </AuthCard>
</template>
```

- [ ] **Step 3: Verify on `http://localhost:5174/auth` — no duplicate title appears above the form fields.**

- [ ] **Step 4: Commit**

```bash
git add src/features/auth/components/LoginForm.vue src/features/auth/components/SignupForm.vue
git commit -m "feat(auth): hide AuthCard title — nav headings replace it"
```

---

## Task 4: Floating label inputs

**Files:**
- Modify: `src/features/auth/components/LoginForm.vue`
- Modify: `src/features/auth/components/SignupForm.vue`
- Modify: `src/app/main.css`

Each `VInput` is wrapped in `.auth-field`. We add an external `<label>` and remove the `label` prop from `VInput` (so VInput renders no internal label). We pass `placeholder=" "` (single space) so `:placeholder-shown` detects empty vs filled state. We pass a unique `id` to each VInput so our external label can use `:for`.

- [ ] **Step 1: Rewrite `LoginForm.vue` template**

```vue
<template>
  <AuthCard
    title="Welcome back"
    submitText="Log in"
    :loading="loading"
    :errorMessage="error?.message"
    @submit="onSubmit"
  >
    <template #title></template>

    <div class="auth-field">
      <label class="auth-field__label" for="auth-login-email">Email</label>
      <VInput
        id="auth-login-email"
        v-model.trim="state.email"
        type="email"
        placeholder=" "
        :validation="v$.email"
        @blur="v$.email.$touch()"
      />
    </div>

    <div class="auth-field">
      <label class="auth-field__label" for="auth-login-password">Password</label>
      <VInput
        id="auth-login-password"
        v-model.trim="state.password"
        type="password"
        placeholder=" "
        iconRight="lock"
        :validation="v$.password"
        @blur="v$.password.$touch()"
      />
    </div>
  </AuthCard>
</template>
```

- [ ] **Step 2: Rewrite `SignupForm.vue` template**

```vue
<template>
  <AuthCard
    title="Create your account"
    submitText="Sign up"
    :loading="loading"
    :error-message="error?.message"
    @submit="onSubmit"
  >
    <template #title></template>

    <div class="auth-field">
      <label class="auth-field__label" for="auth-signup-name">Full Name</label>
      <VInput
        id="auth-signup-name"
        v-model.trim="state.fullname"
        type="text"
        placeholder=" "
        :validation="v$.fullname"
        @blur="v$.fullname.$touch()"
      />
    </div>

    <div class="auth-field">
      <label class="auth-field__label" for="auth-signup-email">Email</label>
      <VInput
        id="auth-signup-email"
        v-model.trim="state.email"
        type="email"
        placeholder=" "
        :validation="v$.email"
        @blur="v$.email.$touch()"
      />
    </div>

    <div class="auth-field">
      <label class="auth-field__label" for="auth-signup-password">Password</label>
      <VInput
        id="auth-signup-password"
        v-model.trim="state.password"
        type="password"
        placeholder=" "
        iconRight="lock"
        :validation="v$.password"
        @blur="v$.password.$touch()"
      />
    </div>

    <div class="auth-field">
      <label class="auth-field__label" for="auth-signup-confirm">Confirm Password</label>
      <VInput
        id="auth-signup-confirm"
        v-model.trim="state.confirmPassword"
        type="password"
        placeholder=" "
        iconRight="lock"
        :validation="v$.confirmPassword"
        @blur="v$.confirmPassword.$touch()"
      />
    </div>
  </AuthCard>
</template>
```

- [ ] **Step 3: Add floating label CSS to `main.css`**

```css
/* ─── Auth Floating Label Fields ──────────────────────────── */
.auth-field {
  position: relative;
}

/* External floating label */
.auth-field__label {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.28);
  pointer-events: none;
  z-index: 1;
  transition: top 160ms ease, font-size 160ms ease, color 160ms ease, transform 160ms ease;
}

/* Float label up: when input has value or is focused */
.auth-field:has(input:not(:placeholder-shown)) .auth-field__label,
.auth-field:has(input:focus) .auth-field__label {
  top: 13px;
  transform: translateY(0);
  font-size: 10px;
  font-weight: 500;
  color: rgba(108, 124, 255, 0.85);
}

/* Override VInput's input styles inside auth-field */
.auth-field input {
  height: 52px !important;
  padding-top: 20px !important;
  padding-bottom: 8px !important;
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.09) !important;
  border-radius: 12px !important;
  color: rgba(255, 255, 255, 0.82) !important;
  transition: background 160ms ease, border-color 160ms ease, box-shadow 160ms ease !important;
}

/* Hide the placeholder visually (it's a space used only for :placeholder-shown detection) */
.auth-field input::placeholder {
  color: transparent !important;
}

/* Focus state */
.auth-field input:focus {
  background: rgba(108, 124, 255, 0.07) !important;
  border-color: rgba(108, 124, 255, 0.45) !important;
  box-shadow: 0 0 0 3px rgba(108, 124, 255, 0.1) !important;
}

/* Remove the focus-within border on the VInput wrapper div (we style the input directly) */
.auth-field .focus-within\:border-primary:focus-within {
  border-color: transparent !important;
  box-shadow: none !important;
}

/* Error state */
.auth-field .error input {
  border-color: rgba(239, 68, 68, 0.6) !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}
```

- [ ] **Step 4: Verify on `http://localhost:5174/auth`:**
  - Labels appear inside fields when empty (vertically centered)
  - Labels float to top-left when field is focused or has a value
  - Clicking a field shows the blue glow ring
  - Validation errors still show below the field
  - Password fields still have the eye icon

- [ ] **Step 5: Commit**

```bash
git add src/features/auth/components/LoginForm.vue src/features/auth/components/SignupForm.vue src/app/main.css
git commit -m "feat(auth): floating label inputs via CSS :placeholder-shown"
```

---

## Task 5: Submit button override

**Files:**
- Modify: `src/app/main.css`

`VButton` uses `.button.primary` class. We scope the gradient + press animation to the auth card context only.

- [ ] **Step 1: Add button override CSS to `main.css`**

```css
/* ─── Auth Submit Button ───────────────────────────────────── */
.auth-card .button.primary {
  background: linear-gradient(90deg, #3e4fff 0%, #6c7cff 100%) !important;
  box-shadow: 0 4px 20px rgba(62, 79, 255, 0.38);
  border-radius: 12px !important;
  height: 46px;
  width: 100%;
  transition: transform 140ms ease, box-shadow 140ms ease !important;
}

.auth-card .button.primary:not(:disabled):not(.is-disabled):active {
  transform: scale(0.97);
  box-shadow: 0 2px 10px rgba(62, 79, 255, 0.25);
}

.auth-card .button.primary:not(:disabled):not(.is-disabled):hover {
  background: linear-gradient(90deg, #4858ff 0%, #7888ff 100%) !important;
}
```

- [ ] **Step 2: Verify on `http://localhost:5174/auth` — button has gradient style, press scale(0.97) is visible on click, disabled state (during loading) still shows correctly.**

- [ ] **Step 3: Commit**

```bash
git add src/app/main.css
git commit -m "feat(auth): gradient submit button with press feedback"
```

---

## Task 6: Final polish pass

**Files:**
- Modify: `src/app/main.css` (minor tweaks if needed)

- [ ] **Step 1: Test the full login flow end-to-end:**
  - Open `http://localhost:5174/auth`
  - Verify dark bloom background, no light mode leaking
  - Switch between Login and Signup — tab switch animation works, URL hash updates
  - Fill in Login form — labels float, focus glow shows
  - Submit with empty fields — validation errors appear below inputs
  - Submit with valid credentials — loading state shows, redirect works

- [ ] **Step 2: Test the Signup flow:**
  - Switch to Signup tab
  - All 4 fields present (Full Name, Email, Password, Confirm Password)
  - Fill each field — labels float correctly
  - Submit with mismatched passwords — validation error shows on Confirm Password
  - Submit valid data — success toast fires, redirect works

- [ ] **Step 3: Check `ThemeToggle` is visible (top-left corner) and functions correctly**

- [ ] **Step 4: Check that the constellation dots from `AuthBackground.vue` are visible over the bloom**

- [ ] **Step 5: Commit any remaining CSS tweaks**

```bash
git add src/app/main.css
git commit -m "feat(auth): final polish pass"
```

---

## Self-Review Checklist

- [x] Radial bloom → Task 1
- [x] Invisible card → Task 2
- [x] Heading nav (Login/Signup) → Task 2
- [x] Hash sync on tab switch → Task 2
- [x] Floating labels → Task 4
- [x] Auth title hidden → Task 3
- [x] Gradient submit button + press state → Task 5
- [x] Error states preserved → Task 4 (`.auth-field .error input`)
- [x] VLoader preserved → Task 2 (`v-if="userStore.fetchUserLoading"`)
- [x] VInput untouched → no VInput changes anywhere
- [x] VButton untouched → scoped CSS only
- [x] AuthBackground.vue untouched → not in file map
- [x] All composables untouched → not in file map
