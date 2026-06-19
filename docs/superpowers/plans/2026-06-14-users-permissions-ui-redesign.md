# Users Permissions Page UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Note:** This project is not a git repository (no `.git` directory). Steps that would normally say "Commit" are replaced with "Save and move on" — there is nothing to commit to.

**Goal:** Modernize the visual design of `UsersPermissionsFeature.vue` (user permissions matrix page) and its directly-related shared components, using only existing Tailwind design tokens, without changing any business logic.

**Architecture:** Two small new pure utility functions (`getInitials`, `getPermissionsSummary`) feed presentational data into a restyled `UserPanel` card. `VCheckbox` gains a `variant` prop (`'checkbox' | 'switch'`) and a full visual restyle while keeping its existing `modelValue`/`disabled`/`update:modelValue` API. `Table.vue` swaps hardcoded `gray-*` classes for semantic theme tokens. `UsersPermissionsFeature.vue` is restructured into card-based sections (user info, role selector, permission matrix) and wires the new utilities/props together.

**Tech Stack:** Vue 3 `<script setup>` + TypeScript, Tailwind CSS (project theme tokens via `tailwind.config.ts` / `createThemes`), Vitest for unit tests.

**Spec:** `docs/superpowers/specs/2026-06-14-users-permissions-ui-redesign-design.md`

---

## File Structure

- Create: `src/shared/utils/getInitials.ts` — pure helper, name → initials
- Create: `src/shared/utils/getInitials.test.ts` — unit tests
- Modify: `src/shared/utils/index.ts` — export `getInitials`
- Create: `src/features/users/utils/permissionsSummary.ts` — pure helper, `userPermissions` map → `{ granted, total }`
- Create: `src/features/users/utils/permissionsSummary.test.ts` — unit tests
- Modify: `src/features/users/utils/index.ts` — export `getPermissionsSummary`
- Modify: `src/shared/ui/common/VCheckbox.vue` — visual restyle + `variant` prop
- Modify: `src/shared/ui/table/Table.vue` — replace `gray-*` classes with theme tokens
- Modify: `src/features/users/components/UserPanel.vue` — card layout, avatar, role badge, permissions counter
- Modify: `src/features/users/UsersPermissionsFeature.vue` — restructure layout into cards, wire new props/utilities

---

### Task 1: `getInitials` utility

**Files:**
- Create: `src/shared/utils/getInitials.ts`
- Test: `src/shared/utils/getInitials.test.ts`
- Modify: `src/shared/utils/index.ts`

- [ ] **Step 1: Write the failing test**

Create `src/shared/utils/getInitials.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getInitials } from './getInitials'

describe('getInitials', () => {
  it('returns first and last initials for a full name', () => {
    expect(getInitials('Olena Marchenko')).toBe('OM')
  })

  it('returns a single initial for a one-word name', () => {
    expect(getInitials('Olena')).toBe('O')
  })

  it('uses the first and last words for names with more than two parts', () => {
    expect(getInitials('Anna Maria Kovalenko')).toBe('AK')
  })

  it('collapses extra whitespace between words', () => {
    expect(getInitials('  Olena   Marchenko  ')).toBe('OM')
  })

  it('returns an empty string for empty input', () => {
    expect(getInitials('')).toBe('')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/shared/utils/getInitials.test.ts`
Expected: FAIL with "Failed to resolve import './getInitials'" (file does not exist yet)

- [ ] **Step 3: Write minimal implementation**

Create `src/shared/utils/getInitials.ts`:

```ts
export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (!words.length) return ''

  const initials =
    words.length === 1 ? words[0][0] : `${words[0][0]}${words[words.length - 1][0]}`

  return initials.toUpperCase()
}
```

- [ ] **Step 4: Export from the shared utils barrel**

Modify `src/shared/utils/index.ts` — add the export (keep existing exports as-is):

```ts
export { cleanEmptyKeys } from './cleanEmptyKeys.ts'
export { formatDate } from './formatDate.ts'
export { getNormalizedRouteId } from './getNormalizedRouteId.ts'
export { getInitials } from './getInitials.ts'
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- src/shared/utils/getInitials.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 6: Save and move on**

---

### Task 2: `getPermissionsSummary` utility

**Files:**
- Create: `src/features/users/utils/permissionsSummary.ts`
- Test: `src/features/users/utils/permissionsSummary.test.ts`
- Modify: `src/features/users/utils/index.ts`

- [ ] **Step 1: Write the failing test**

Create `src/features/users/utils/permissionsSummary.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getPermissionsSummary } from './permissionsSummary'

describe('getPermissionsSummary', () => {
  it('counts granted permissions out of total', () => {
    expect(getPermissionsSummary({ a: true, b: false, c: true })).toEqual({
      granted: 2,
      total: 3,
    })
  })

  it('returns zeroes for an empty map', () => {
    expect(getPermissionsSummary({})).toEqual({ granted: 0, total: 0 })
  })

  it('returns total equal to granted when everything is true', () => {
    expect(getPermissionsSummary({ a: true, b: true })).toEqual({ granted: 2, total: 2 })
  })

  it('returns granted 0 when everything is false', () => {
    expect(getPermissionsSummary({ a: false, b: false })).toEqual({ granted: 0, total: 2 })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/features/users/utils/permissionsSummary.test.ts`
Expected: FAIL with "Failed to resolve import './permissionsSummary'" (file does not exist yet)

- [ ] **Step 3: Write minimal implementation**

Create `src/features/users/utils/permissionsSummary.ts`:

```ts
export const getPermissionsSummary = (userPermissions: Record<string, boolean>) => {
  const values = Object.values(userPermissions)

  return {
    granted: values.filter(Boolean).length,
    total: values.length,
  }
}
```

- [ ] **Step 4: Export from the users utils barrel**

Modify `src/features/users/utils/index.ts` — add the export at the end (keep all existing exports as-is):

```ts
export { createPermissionRowsFromGroups, getRowPermissions } from './permissionsRows.ts'
export { formatPermissionsToArr } from './formatPermissionsToArr.ts'
export { initPermissions, permissionsGroup } from './permissionsGroups.ts'
export {
  setPermissionsValue as setPermissionsValueUtil,
  createPermissionsMap,
} from './permissionsMap.ts'
export { ACTION_ORDER, getPermissionActions } from './permissionsActions.ts'
export { createUserDefaultsMap, resetRowToDefaults } from './permissionsDefaults.ts'
export {
  lockPermissionRow,
  unlockPermissionRow,
  unlockAllPermissionRows,
  isPermissionRowLocked,
} from './permissionsAdminLocks.ts'
export {
  createPermissionColumns,
  getPermissionCheckboxValue,
  isPermissionCheckboxDisabled,
  isPermissionCheckboxVisible,
} from './permissionsTableUi.ts'
export { getPermissionsSummary } from './permissionsSummary.ts'
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- src/features/users/utils/permissionsSummary.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 6: Save and move on**

---

### Task 3: Restyle `VCheckbox.vue` with `variant` prop

**Files:**
- Modify: `src/shared/ui/common/VCheckbox.vue`

Current content (for reference):

```vue
<script setup lang="ts">
type Props = {
  label?: string
  disabled?: boolean
  modelValue?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div>
    <label v-if="label" :for="label">
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <input
      :id="label"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
  </div>
</template>
```

This component is only used in `UsersPermissionsFeature.vue` (Tasks 6), in two places: matrix cells (`label=""`, default variant) and the "select all" toggle (which Task 6 will switch to `variant="switch"` with `label="All permissions"`).

- [ ] **Step 1: Replace the component**

Replace the entire contents of `src/shared/ui/common/VCheckbox.vue` with:

```vue
<script setup lang="ts">
import VIcon from './VIcon.vue'

type Props = {
  label?: string
  disabled?: boolean
  modelValue?: boolean
  variant?: 'checkbox' | 'switch'
}

withDefaults(defineProps<Props>(), {
  variant: 'checkbox',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <label
    class="inline-flex items-center gap-2"
    :class="disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'"
  >
    <span class="relative inline-flex shrink-0">
      <input
        type="checkbox"
        class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        :checked="modelValue"
        :disabled="disabled"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />

      <span
        v-if="variant === 'switch'"
        class="relative block h-5 w-9 rounded-full transition-colors"
        :class="modelValue ? 'bg-primary' : 'bg-borderDefault'"
      >
        <span
          class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-soft transition-all"
          :class="modelValue ? 'left-[18px]' : 'left-0.5'"
        />
      </span>

      <span
        v-else
        class="flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors"
        :class="modelValue ? 'border-primary bg-primary' : 'border-borderDefault bg-secondaryBg'"
      >
        <VIcon v-if="modelValue" icon="mdi:check" :size="14" class="text-white" />
      </span>
    </span>

    <span v-if="label" class="text-uiLabel text-txtPrimary">
      <slot name="label">{{ label }}</slot>
    </span>
  </label>
</template>
```

Notes for the implementer:
- The native `<input>` is kept for accessibility and `v-model`/`update:modelValue` compatibility — it's transparent and absolutely positioned over the indicator, so clicks and keyboard interaction still work.
- Wrapping everything in a single `<label>` also fixes a latent bug where multiple checkboxes with `label=""` previously generated duplicate empty `id`/`for` attributes.
- `modelValue`/`disabled`/`update:modelValue` behavior is unchanged — existing usages with no `variant` prop get the new `'checkbox'` look automatically.

- [ ] **Step 2: Run type-check to verify no usage breaks**

Run: `npm run type-check`
Expected: no new errors related to `VCheckbox` or `VIcon`

- [ ] **Step 3: Save and move on**

---

### Task 4: Replace hardcoded gray classes in `Table.vue` with theme tokens

**Files:**
- Modify: `src/shared/ui/table/Table.vue`

- [ ] **Step 1: Update the grid wrapper background**

In `src/shared/ui/table/Table.vue`, find:

```vue
    <div class="flex-1 min-h-0 overflow-auto bg-gray-300">
```

Replace with:

```vue
    <div class="flex-1 min-h-0 overflow-auto bg-secondaryBg">
```

- [ ] **Step 2: Update the header cell styling**

Find:

```vue
          <div
            :class="[
              'sticky top-0 z-20 flex items-center bg-gray-100 px-3 py-2 font-semibold',
              getColumnAlignClass(columnIndex),
            ]"
          >
```

Replace with:

```vue
          <div
            :class="[
              'sticky top-0 z-20 flex items-center bg-primaryBg px-3 py-2 text-uiCaption font-semibold uppercase tracking-wide text-muted',
              getColumnAlignClass(columnIndex),
            ]"
          >
```

- [ ] **Step 3: Update the empty-state background**

Find:

```vue
          <div
            v-if="!props.items.length"
            class="flex h-full min-h-[300px] items-center justify-center bg-white"
            :style="{ gridColumn: '1 / -1' }"
          >
            <p>There is no data in the table</p>
          </div>
```

Replace with:

```vue
          <div
            v-if="!props.items.length"
            class="flex h-full min-h-[300px] items-center justify-center bg-secondaryBg text-muted"
            :style="{ gridColumn: '1 / -1' }"
          >
            <p>There is no data in the table</p>
          </div>
```

- [ ] **Step 4: Update data cell styling with hover feedback**

Find:

```vue
                <div
                  class="flex h-[70px] items-center border-b border-gray-200 bg-white break-words"
                >
```

Replace with:

```vue
                <div
                  class="flex h-[70px] items-center border-b border-borderDefault bg-secondaryBg break-words transition-colors hover:bg-primaryBg/60"
                >
```

- [ ] **Step 5: Run type-check**

Run: `npm run type-check`
Expected: no new errors

- [ ] **Step 6: Visually spot-check `UsersTableFeature.vue`**

Run: `npm run dev`, open the Users table page in the browser. Confirm the table header, rows, and empty state now use the light theme tokens (white/blue-gray instead of plain gray) and rows highlight on hover.

- [ ] **Step 7: Save and move on**

---

### Task 5: Restyle `UserPanel.vue` — avatar, role badge, permissions counter

**Files:**
- Modify: `src/features/users/components/UserPanel.vue`

Current content (for reference):

```vue
<script setup lang="ts">
import type { UserResponse } from '../types/users'
import { VSkeleton } from '@/shared/ui/common'

type Props = {
  user: UserResponse
  loading: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="w-full flex flex-col gap-2">
    <template v-if="loading">
      <VSkeleton width="140px" />
      <VSkeleton width="220px" />
      <VSkeleton width="180px" />
    </template>

    <template v-else-if="user">
      <p>{{ user.name }}</p>
      <p>{{ user.email }}</p>
      <p>Member since {{ user.createdAt }}</p>
    </template>
  </div>
</template>

<style scoped></style>
```

- [ ] **Step 1: Replace the component**

Replace the entire contents of `src/features/users/components/UserPanel.vue` with:

```vue
<script setup lang="ts">
import type { UserResponse } from '../types/users'
import { VSkeleton } from '@/shared/ui/common'
import { selectTypes } from '@/shared/types'
import { getInitials } from '@/shared/utils'

type Props = {
  user: UserResponse
  loading: boolean
  role?: selectTypes.Option
  permissionsSummary?: { granted: number; total: number }
}

defineProps<Props>()
</script>

<template>
  <div class="flex w-full items-center justify-between gap-6 rounded-2xl bg-secondaryBg p-5 shadow-soft">
    <template v-if="loading">
      <div class="flex items-center gap-4">
        <VSkeleton width="48px" height="48px" rounded="50%" />
        <div class="flex flex-col gap-2">
          <VSkeleton width="140px" />
          <VSkeleton width="220px" />
        </div>
      </div>
      <VSkeleton width="80px" />
    </template>

    <template v-else-if="user">
      <div class="flex items-center gap-4">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-borderHover text-uiHead text-white"
        >
          {{ getInitials(user.name) }}
        </div>
        <div>
          <p class="text-headingCard text-txtPrimary">{{ user.name }}</p>
          <p class="text-uiCaption text-muted">{{ user.email }} · Member since {{ user.createdAt }}</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div v-if="permissionsSummary" class="flex flex-col items-end leading-tight">
          <span class="text-uiHead text-txtPrimary">
            {{ permissionsSummary.granted }} / {{ permissionsSummary.total }}
          </span>
          <span class="text-uiCaption text-muted">permissions granted</span>
        </div>

        <span
          v-if="role"
          class="rounded-full px-3 py-1 text-uiCaption font-semibold"
          :class="role.value === 'admin' ? 'bg-warning/15 text-warning' : 'bg-primary/15 text-primary'"
        >
          {{ role.label }}
        </span>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
```

- [ ] **Step 2: Run type-check**

Run: `npm run type-check`
Expected: no new errors related to `UserPanel`, `selectTypes`, or `getInitials`

- [ ] **Step 3: Save and move on**

---

### Task 6: Restructure `UsersPermissionsFeature.vue` into card-based layout

**Files:**
- Modify: `src/features/users/UsersPermissionsFeature.vue`

This task wires `permissionsSummary` into `UserPanel`, moves the "select all" toggle into the permission matrix card as a `switch`-variant `VCheckbox`, and wraps the role selector and the matrix in cards using the now-restyled `Table`.

- [ ] **Step 1: Add the `permissionsSummary` computed value**

In `src/features/users/UsersPermissionsFeature.vue`, update the imports (the `permissionsTableUi` import block stays the same, add a new import line):

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { selectTypes } from '@/shared/types'
import { PermsTypes } from '@/features/users/types'
import { Table } from '@/shared/ui/table'
import { VButton, VCheckbox, VSelect } from '@/shared/ui/common'
import { usePermissions, useSaveUserPermissions } from '@/features/users/composables'
import { UserPanel } from '@/features/users/components'
import {
  createPermissionColumns,
  getPermissionCheckboxValue,
  isPermissionCheckboxDisabled,
  isPermissionCheckboxVisible,
  getPermissionsSummary,
} from '@/features/users/utils'
```

Then, after the `permissionColumns` computed definition, add:

```ts
const permissionsSummary = computed(() => getPermissionsSummary(userPermissions.value))
```

So the script now contains (showing the relevant area):

```ts
const permissionColumns = computed(() => createPermissionColumns(permissionActions.value))

const permissionsSummary = computed(() => getPermissionsSummary(userPermissions.value))

const isSelectAllDisabled = () => {
  return selectedRole.value?.value === 'admin'
}
```

- [ ] **Step 2: Run type-check to confirm `permissionsSummary` and the new import resolve**

Run: `npm run type-check`
Expected: no new errors

- [ ] **Step 3: Replace the template**

Replace the entire `<template>` block of `src/features/users/UsersPermissionsFeature.vue` with:

```vue
<template>
  <UserPanel
    v-if="userData"
    :loading="getUserLoading"
    :user="userData"
    :role="selectedRole"
    :permissions-summary="permissionsSummary"
  />

  <div class="mt-6 flex items-center gap-6 rounded-2xl bg-secondaryBg p-5 shadow-soft">
    <VSelect
      v-model="selectedRole"
      @select="applyRolePermissions"
      :options="roleOptions"
      label="Role"
    />
  </div>

  <div class="mt-6 overflow-hidden rounded-2xl bg-secondaryBg shadow-soft">
    <Table
      :columns="permissionColumns"
      :items="permissionRows"
      :loading="getUserLoading || getRolesPermissionsLoading"
      :total-pages="1"
    >
      <template #toolbar>
        <div class="flex items-center justify-between border-b border-borderDefault pb-4">
          <span class="text-headingCard text-txtPrimary">Permission matrix</span>

          <VCheckbox
            :model-value="allPerm"
            @update:model-value="onAllPermUpdate"
            label="All permissions"
            variant="switch"
            :disabled="isSelectAllDisabled()"
          />
        </div>
      </template>

      <template #module="{ item }">
        <span class="px-3 text-sm font-medium text-gray-900">
          {{ item.module }}
        </span>
      </template>

      <template v-for="action in permissionActions" #[action]="{ item }" :key="action">
        <div class="flex w-full justify-center">
          <VCheckbox
            v-if="isPermissionCheckboxVisible(item, action)"
            label=""
            :model-value="getCheckboxValue(item, action)"
            :disabled="getCheckboxDisabled(item, action)"
            @update:model-value="handleCheckboxChange(item, action, $event)"
          />
        </div>
      </template>
    </Table>
  </div>

  <div class="mt-6 flex justify-end">
    <VButton
      @click="saveUserPermissions"
      :disabled="patchPermissionsLoading || rolesLoading"
      :loading="rolesLoading || patchPermissionsLoading"
    >
      Save
    </VButton>
  </div>
</template>

<style scoped></style>
```

Notes for the implementer:
- `Table`'s `#toolbar` slot is rendered inside its own `p-6` wrapper, so the outer card here intentionally has no padding (`overflow-hidden rounded-2xl bg-secondaryBg shadow-soft` only) — this avoids doubled padding/background.
- The `#module`/`#[action]` slots and all script logic are unchanged from the original file.

- [ ] **Step 4: Run type-check**

Run: `npm run type-check`
Expected: no new errors

- [ ] **Step 5: Manual verification in the browser**

Run: `npm run dev`, open the user permissions page (`/users/:id/permissions` or equivalent route).

Confirm:
- User card shows avatar initials, name, email, "Member since", a "X / Y permissions granted" counter, and a role badge (amber for Admin, blue for User)
- Role selector sits in its own card
- Permission matrix card has a header row with "Permission matrix" title and an "All permissions" switch on the right
- Toggling role to Admin disables the "All permissions" switch and the matrix checkboxes behave exactly as before (admin-locked rows, read/write cascading, etc.)
- Checkboxes in the matrix render as filled squares with a checkmark when checked, and the switch toggles smoothly
- Save button still works (triggers `saveUserPermissions`)

- [ ] **Step 6: Save and move on**

---

## Self-Review Summary

- **Spec coverage:** UserPanel card/avatar/badge/counter → Task 5; computed counter → Task 2; role-select card + matrix card + toolbar switch → Task 6; VCheckbox restyle + `switch` variant → Task 3; Table token replacement (incl. cross-feature impact on `UsersTableFeature`) → Task 4.
- **No logic changes:** `usePermissions`, `useSaveUserPermissions`, and all `permissionsTableUi`/`permissionsRows`/etc. utilities are untouched. The only new logic is two pure presentational helpers (`getInitials`, `getPermissionsSummary`), both unit-tested.
- **Type consistency:** `permissionsSummary: { granted: number; total: number }` matches between `getPermissionsSummary` (Task 2) and `UserPanel`'s `Props.permissionsSummary` (Task 5) and the prop passed in Task 6. `role?: selectTypes.Option` matches `selectedRole`'s type (`ref<selectTypes.Option>`) used elsewhere in the file.
