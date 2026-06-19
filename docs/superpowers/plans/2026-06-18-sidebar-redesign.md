# Sidebar Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the sidebar to Modern Pill style — logo row, tighter nav items, icon-only collapsed state, floating toggle button — without changing routing, auth, or business logic.

**Architecture:** Three component files + one CSS file. NavItem.vue gets tighter styling. Sidebar index.vue gets structural overhaul: logo row, section label, floating toggle, always-visible nav items (icon-only when collapsed via `:deep()` CSS). DefaultLayout.vue gets a one-line event binding fix so grid columns actually update on collapse.

**Tech Stack:** Vue 3 `<script setup>`, Tailwind CSS (tokens only — no hardcoded colors in templates), scoped SCSS with `:deep()`, `src/app/main.css` for light-mode overrides.

---

## Files Changed

| File | What changes |
|---|---|
| `src/app/layout/DefaultLayout.vue` | `@toggle` → `@update`; collapsed column width `92px` → `64px` |
| `src/shared/ui/sidebar/NavItem.vue` | Tighter padding, rounded corners, icon size, active/hover tweaks |
| `src/shared/ui/sidebar/index.vue` | Logo row, section label, floating toggle, remove old toggle, always-show nav, collapsed CSS |
| `src/app/main.css` | Light-mode sidebar overrides |

---

## Context for implementer

### Current DefaultLayout.vue (full file)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Sidebar } from '@/shared/ui/sidebar'
import { DefaultHeader } from '@/widgets'

const isSidebarOpen = ref(true)
</script>

<template>
  <div
    class="grid h-screen grid-rows-[minmax(0,1fr)] overflow-hidden bg-primaryBg text-txtPrimary"
    :class="isSidebarOpen ? 'grid-cols-[256px_minmax(0,1fr)]' : 'grid-cols-[92px_minmax(0,1fr)]'"
  >
    <aside class="row-start-1">
      <Sidebar :is-open="isSidebarOpen" @toggle="isSidebarOpen = !isSidebarOpen" />
    </aside>

    <main class="col-start-2 row-start-1 min-h-0 min-w-0">
      <RouterView />
    </main>
  </div>
</template>
```

**Bug:** Sidebar emits `update` but DefaultLayout listens for `toggle` — grid columns never change. Fix: `@toggle` → `@update`.

### Current sidebar/index.vue (full file)

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import NavItem from './NavItem.vue'
import { VIcon } from '@/shared/ui/common'
import { useUserStore } from '@/shared/stores'

const userStore = useUserStore()
const isSidebarOpen = ref(true)

const emit = defineEmits<{
  update: [isOpen: boolean]
}>()

watch(
  isSidebarOpen,
  (val) => {
    emit('update', val)
  },
  { immediate: true },
)

const handleLogout = () => {
  userStore.logout()
}
</script>

<template>
  <div
    class="sidebar flex flex-col justify-between min-h-screen relative p-6"
    :class="isSidebarOpen ? 'w-[256px]' : 'w-[92px]'"
  >
    <button
      @click="isSidebarOpen = !isSidebarOpen"
      class="absolute top-6 right-6 z-10 text-primary"
      type="button"
      :aria-expanded="isSidebarOpen"
      aria-label="Toggle sidebar"
    >
      <VIcon
        icon="lucide:chevron-left"
        size="44"
        class="transition-transform duration-300"
        :class="{ 'rotate-180': !isSidebarOpen }"
      />
    </button>

    <nav v-show="isSidebarOpen" class="flex flex-col mt-[66px] gap-4" aria-label="Sidebar navigation">
      <NavItem />
    </nav>

    <div v-show="isSidebarOpen">
      <NavItem
        do="action"
        :items="{ title: 'Logout', img: 'lucide:log-out' }"
        :on-click="handleLogout"
      />
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  @apply bg-sidebarSurface shadow-sidebarBgShadow;
}
</style>
```

### Current NavItem.vue (full file)

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { routerTypes } from '@/shared/types'
import VIcon from '@/shared/ui/common/VIcon.vue'

type Item = {
  img: string
  title?: string
  to?: routerTypes.RouteNames
}

type Props = {
  items?: Item | Item[]
  do?: 'action' | 'navigation'
  onClick?: (item: Item) => void
}

const props = withDefaults(defineProps<Props>(), {
  do: 'navigation',
})

enum Navigation {
  DASHBOARD = 'Dashboard',
  LOGIN = 'Login',
}

const navItems: Item[] = [
  { title: Navigation.DASHBOARD, img: 'lucide:home', to: routerTypes.RouteNames.DASHBOARD },
  { title: Navigation.LOGIN,     img: 'lucide:log-in', to: routerTypes.RouteNames.LOGIN },
]

const itemsArr = computed<Item[]>(() => {
  if (!props.items) return navItems
  return Array.isArray(props.items) ? props.items : [props.items]
})

const componentTag = computed(() => {
  return props.do === 'action' ? 'button' : RouterLink
})

const getComponentProps = (item: Item) => {
  if (props.do === 'action') return { type: 'button' as const }
  return { to: { name: item.to } }
}

const handleClick = (item: Item) => {
  if (props.do === 'action') props.onClick?.(item)
}
</script>

<template>
  <component
    :is="componentTag"
    v-for="item in itemsArr"
    :key="`${props.do}-${item.title}`"
    v-bind="getComponentProps(item)"
    class="link group flex items-center gap-2 px-[14px] py-[10px] text-txtSecondaryDark"
    :aria-label="item.title"
    @click="handleClick(item)"
  >
    <slot name="icon" :item="item">
      <VIcon :icon="item.img" :size="14" />
    </slot>
    <span class="leading-[1.3]">{{ item.title }}</span>
  </component>
</template>

<style scoped lang="scss">
.link {
  @apply active:bg-secondaryBgDark active:shadow-sidebarActive hover:text-txtPrimaryDark;

  &.router-link-active {
    @apply bg-secondaryBgDark shadow-sidebarActive text-txtPrimaryDark;
  }
}
</style>
```

### Tokens available (from tailwind.config.ts)

| Token | Dark value | Light value |
|---|---|---|
| `bg-sidebarSurface` | gradient via CSS var | same |
| `shadow-sidebarBgShadow` | `0 0 15px rgba(49,33,191,0.4)` | same |
| `shadow-sidebarActive` | `0 0 8px rgba(0,0,0,0.35)` | same |
| `bg-secondaryBgDark` | `#11162A` | `#11162A` (same — dark surface) |
| `text-txtPrimaryDark` | `#E6E9F5` | `#E6E9F5` (same — always light text) |
| `text-txtSecondaryDark` | `#A6ADCF` | `#A6ADCF` (same) |
| `bg-elevated` | `#1D2645` | `#EEF2FB` |
| `border-borderDefault` | `#222B57` | `#D3E0FC` |
| `text-primary` | `#6C7CFF` | `#476FFF` |
| `from-primary` | `#6C7CFF` | `#476FFF` |
| `to-borderHover` | check config | check config |

---

## Task 1: Fix DefaultLayout.vue — event binding + collapsed width

**Files:**
- Modify: `src/app/layout/DefaultLayout.vue`

- [ ] **Step 1: Apply two changes**

Find:
```html
    :class="isSidebarOpen ? 'grid-cols-[256px_minmax(0,1fr)]' : 'grid-cols-[92px_minmax(0,1fr)]'"
```
Replace with:
```html
    :class="isSidebarOpen ? 'grid-cols-[256px_minmax(0,1fr)]' : 'grid-cols-[64px_minmax(0,1fr)]'"
```

Find:
```html
      <Sidebar :is-open="isSidebarOpen" @toggle="isSidebarOpen = !isSidebarOpen" />
```
Replace with:
```html
      <Sidebar :is-open="isSidebarOpen" @update="isSidebarOpen = $event" />
```

- [ ] **Step 2: TypeScript check**

```bash
cd /Users/oleksandra/Desktop/todo-project && npx tsc --noEmit 2>&1 | head -10
```

Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/app/layout/DefaultLayout.vue
git commit -m "fix(sidebar): listen @update not @toggle, collapse column 64px"
```

---

## Task 2: Redesign NavItem.vue

**Files:**
- Modify: `src/shared/ui/sidebar/NavItem.vue`

Replace the entire `<template>` block and `<style>` block. Script block is **unchanged**.

- [ ] **Step 1: Replace template**

Find:
```html
<template>
  <component
    :is="componentTag"
    v-for="item in itemsArr"
    :key="`${props.do}-${item.title}`"
    v-bind="getComponentProps(item)"
    class="link group flex items-center gap-2 px-[14px] py-[10px] text-txtSecondaryDark"
    :aria-label="item.title"
    @click="handleClick(item)"
  >
    <slot name="icon" :item="item">
      <VIcon :icon="item.img" />
    </slot>

    <span class="leading-[1.3]">
      {{ item.title }}
    </span>
  </component>
</template>
```

Replace with:
```html
<template>
  <component
    :is="componentTag"
    v-for="item in itemsArr"
    :key="`${props.do}-${item.title}`"
    v-bind="getComponentProps(item)"
    class="link group flex w-full items-center gap-[9px] rounded-[7px] px-2 py-[7px] text-txtSecondaryDark"
    :aria-label="item.title"
    @click="handleClick(item)"
  >
    <slot name="icon" :item="item">
      <VIcon :icon="item.img" :size="14" />
    </slot>

    <span class="truncate leading-[1.3]">
      {{ item.title }}
    </span>
  </component>
</template>
```

- [ ] **Step 2: Replace style block**

Find:
```html
<style scoped lang="scss">
.link {
  @apply active:bg-secondaryBgDark active:shadow-sidebarActive hover:text-txtPrimaryDark;

  &.router-link-active {
    @apply bg-secondaryBgDark shadow-sidebarActive text-txtPrimaryDark;
  }
}
</style>
```

Replace with:
```html
<style scoped lang="scss">
.link {
  @apply hover:bg-secondaryBgDark/60 hover:text-txtPrimaryDark;
  @apply active:bg-secondaryBgDark active:shadow-sidebarActive;

  &.router-link-active {
    @apply bg-secondaryBgDark shadow-sidebarActive text-txtPrimaryDark;
  }
}
</style>
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -10
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/shared/ui/sidebar/NavItem.vue
git commit -m "feat(sidebar): tighter nav item padding, rounded corners, hover bg"
```

---

## Task 3: Redesign sidebar/index.vue

**Files:**
- Modify: `src/shared/ui/sidebar/index.vue`

Replace the entire file content. Script `<script setup>` block is **unchanged** — only template and style change.

- [ ] **Step 1: Replace template**

Find:
```html
<template>
  <div
    class="sidebar flex flex-col justify-between min-h-screen relative p-6"
    :class="isSidebarOpen ? 'w-[256px]' : 'w-[92px]'"
  >
    <button
      @click="isSidebarOpen = !isSidebarOpen"
      class="absolute top-6 right-6 z-10 text-primary"
      type="button"
      :aria-expanded="isSidebarOpen"
      aria-label="Toggle sidebar"
    >
      <VIcon
        icon="lucide:chevron-left"
        size="44"
        class="transition-transform duration-300"
        :class="{ 'rotate-180': !isSidebarOpen }"
      />
    </button>

    <nav
      v-show="isSidebarOpen"
      class="flex flex-col mt-[66px] gap-4"
      aria-label="Sidebar navigation"
    >
      <NavItem />
    </nav>

    <div v-show="isSidebarOpen">
      <NavItem
        do="action"
        :items="{
          title: 'Logout',
          img: 'lucide:log-out',
        }"
        :on-click="handleLogout"
      />
    </div>
  </div>
</template>
```

Replace with:
```html
<template>
  <div
    class="sidebar relative flex h-full flex-col"
    :class="isSidebarOpen ? 'w-[256px]' : 'w-[64px] sidebar--collapsed'"
  >
    <!-- Floating toggle -->
    <button
      @click="isSidebarOpen = !isSidebarOpen"
      class="absolute right-[-12px] top-1/2 z-[50] flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-borderDefault bg-elevated text-muted transition-colors hover:border-primary hover:text-primary"
      type="button"
      :aria-expanded="isSidebarOpen"
      aria-label="Toggle sidebar"
    >
      <VIcon
        :icon="isSidebarOpen ? 'lucide:chevron-left' : 'lucide:chevron-right'"
        :size="11"
      />
    </button>

    <!-- Logo row -->
    <div class="flex shrink-0 items-center gap-[9px] border-b border-borderDefault px-4 py-[15px]">
      <div class="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] bg-gradient-to-br from-primary to-borderDefaultDark text-[11px] font-bold text-white">
        A
      </div>
      <span v-show="isSidebarOpen" class="truncate text-[12.5px] font-semibold leading-none text-txtPrimaryDark">
        AdminApp
      </span>
    </div>

    <!-- Section label -->
    <p v-show="isSidebarOpen" class="shrink-0 px-4 pb-1 pt-3 text-[9.5px] font-semibold uppercase tracking-[1.1px] text-txtSecondaryDark opacity-50">
      Navigation
    </p>

    <!-- Nav -->
    <nav class="flex flex-1 flex-col gap-[1px] overflow-y-auto px-2 py-1" aria-label="Sidebar navigation">
      <NavItem />
    </nav>

    <!-- Bottom: logout -->
    <div class="shrink-0 border-t border-borderDefault px-2 py-2">
      <NavItem
        do="action"
        :items="{ title: 'Logout', img: 'lucide:log-out' }"
        :on-click="handleLogout"
      />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Replace style block**

Find:
```html
<style scoped>
.sidebar {
  @apply bg-sidebarSurface shadow-sidebarBgShadow;
}
</style>
```

Replace with:
```html
<style scoped lang="scss">
.sidebar {
  @apply bg-sidebarSurface shadow-sidebarBgShadow;
}

/* Icon-only collapsed state */
.sidebar--collapsed :deep(.link) {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
}

.sidebar--collapsed :deep(.link span) {
  display: none;
}
</style>
```

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -10
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add src/shared/ui/sidebar/index.vue
git commit -m "feat(sidebar): logo row, section label, floating toggle, icon-only collapse"
```

---

## Task 4: Light-mode CSS overrides in main.css

**Files:**
- Modify: `src/app/main.css` — append at end

The sidebar uses `sidebarSurface` (dark gradient) and `txtSecondaryDark` / `txtPrimaryDark` / `secondaryBgDark` tokens that have fixed dark values in both themes. Override them for light mode.

- [ ] **Step 1: Append light-mode sidebar block to end of main.css**

Add this block at the very end of `src/app/main.css`:

```css
/* ─── Sidebar Light Mode ───────────────────────────────────── */
html:not(.dark) .sidebar {
  background: #f4f6fb !important;
  box-shadow: none !important;
  border-right: 1px solid rgba(108, 124, 255, 0.1);
}

html:not(.dark) .sidebar .text-txtSecondaryDark {
  color: rgba(15, 23, 42, 0.45) !important;
}

html:not(.dark) .sidebar .text-txtPrimaryDark {
  color: rgba(15, 23, 42, 0.88) !important;
}

html:not(.dark) .sidebar .bg-secondaryBgDark {
  background-color: rgba(108, 124, 255, 0.09) !important;
}

html:not(.dark) .sidebar .shadow-sidebarActive {
  box-shadow: none !important;
}
```

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit 2>&1 | head -10
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/app/main.css
git commit -m "feat(sidebar): light-mode CSS overrides"
```

---

## Final Verification

- [ ] Open `http://localhost:5174/users` — sidebar shows logo, section label, nav items with new style
- [ ] Click toggle button (floating circle on right edge) — sidebar collapses to 64px, shows icons only
- [ ] Click toggle again — expands back to 256px
- [ ] Grid column correctly resizes (no gap between sidebar and content)
- [ ] Active route (Dashboard) shows `bg-secondaryBgDark` highlight
- [ ] Switch to light mode — sidebar reads clearly (no dark text on dark bg)
- [ ] Switch back to dark mode — confirms tokens correct
