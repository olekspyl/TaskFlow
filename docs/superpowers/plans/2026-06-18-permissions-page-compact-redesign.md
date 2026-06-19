# Permissions Page Compact Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate scroll on the permissions page and apply consistent card styling using Tailwind tokens — no logic changes whatsoever.

**Architecture:** Three files touched. CSS overrides scoped to `.perms-layout` handle shared component (Table.vue) without modifying it. Direct class changes in UserPanel.vue and UsersPermissionsFeature.vue handle layout and icons. No new components, no new props, no logic changes.

**Tech Stack:** Vue 3 `<script setup>`, Tailwind CSS utility classes, `src/app/main.css` for scoped overrides.

---

## Files Changed

| File | What changes |
|---|---|
| `src/features/users/UsersPermissionsFeature.vue` | Outer padding/gap, table wrapper classes, Save button moved into toolbar slot |
| `src/features/users/components/UserPanel.vue` | Compact padding, smaller avatar, new icons |
| `src/app/main.css` | `.perms-layout` scoped block — row height, header padding, Save button gradient |

**Not touched:** `Table.vue`, all composables, all utils, all types, routing.

---

## Context for implementer

### UsersPermissionsFeature.vue — current structure (lines 78–149)

```vue
<div class="flex h-full flex-col gap-6 overflow-hidden p-8">           <!-- OUTER: p-8, gap-6 -->
  <UserPanel class="shrink-0" ... />

  <div class="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl bg-secondaryBg shadow-soft">
    <Table :scrollable="false" ...>
      <template #toolbar>
        <div class="flex items-center justify-between pb-4">
          <span class="text-headingCard text-txtPrimary">Permission matrix</span>
          <div class="flex items-center gap-6">
            <VSelect ... />
            <VCheckbox ... />
          </div>
        </div>
      </template>
      <!-- column slots ... -->
    </Table>
  </div>

  <div class="flex shrink-0 justify-end">                               <!-- REMOVE THIS -->
    <VButton @click="saveUserPermissions" ...>Save</VButton>
  </div>
</div>
```

### UserPanel.vue — current root element (line 18)

```html
<div class="flex w-full items-center justify-between gap-6 rounded-2xl bg-secondaryBg p-5 shadow-soft">
```

### Table.vue — what it renders internally (read-only, DO NOT MODIFY)

The Table component with `scrollable: false` renders this DOM structure:
```html
<div class="p-6 box-border flex flex-col gap-6">          <!-- p-6 container -->
  <slot name="toolbar" />
  <div class="flex flex-col overflow-hidden rounded-xl border border-tableBorder bg-secondaryBg">
    <div class="grid min-w-max auto-rows-max" style="grid-template-columns: ...">
      <!-- header cells: class="sticky top-0 z-20 ... bg-elevated px-5 py-3 ..." -->
      <!-- data cells:   class="flex h-[70px] items-center border-b border-tableBorder bg-secondaryBg px-4 ..." -->
      <!-- skeleton:     class="flex h-[70px] items-center border-b border-tableBorder bg-secondaryBg px-4" -->
    </div>
  </div>
</div>
```

CSS overrides scoped to `.perms-layout` target these Tailwind classes from outside Table.vue.

---

## Task 1: CSS scoped block in main.css

**Files:**
- Modify: `src/app/main.css` — append at end of file

- [ ] **Step 1: Append the `.perms-layout` CSS block to `src/app/main.css`**

Add this entire block at the very end of the file:

```css
/* ─── Permissions Page Compact Layout ─────────────────────── */
.perms-layout {
  padding: 16px 24px !important;
  gap: 12px !important;
}

/* Table's internal p-6 container → no padding, let card handle it */
.perms-layout .p-6.box-border {
  padding: 0 !important;
  gap: 0 !important;
}

/* Table's inner border container → transparent, card border handles it */
.perms-layout .rounded-xl.border.border-tableBorder.bg-secondaryBg {
  border: none !important;
  border-radius: 0 0 14px 14px !important;
  background: transparent !important;
}

/* Table header cells — tighter */
.perms-layout .sticky.top-0.bg-elevated {
  padding-top: 7px !important;
  padding-bottom: 7px !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
}

/* Compact row height (both data rows and skeleton rows) */
.perms-layout .h-\[70px\] {
  height: 44px !important;
}

/* Toolbar bottom spacing */
.perms-layout .pb-4 {
  padding-bottom: 10px !important;
}

/* Save button — gradient matching auth page */
.perms-layout .button.primary {
  background: linear-gradient(90deg, #3e4fff 0%, #6c7cff 100%) !important;
  box-shadow: 0 3px 12px rgba(62, 79, 255, 0.28) !important;
  transition: transform 140ms ease-out, box-shadow 140ms ease-out !important;
}

.perms-layout .button.primary:not(:disabled):not(.is-disabled):active {
  transform: scale(0.97) !important;
  box-shadow: 0 2px 6px rgba(62, 79, 255, 0.18) !important;
}

/* Light mode: keep Save button gradient (overrides light-theme primary color) */
html:not(.dark) .perms-layout .button.primary {
  background: linear-gradient(90deg, #3e4fff 0%, #6c7cff 100%) !important;
}
```

- [ ] **Step 2: Verify CSS parses without errors**

```bash
cd /Users/oleksandra/Desktop/todo-project && npx tsc --noEmit 2>&1 | head -5 || true
```

Expected: no CSS parse errors (TypeScript check only validates .ts/.vue, CSS errors show in browser console).

- [ ] **Step 3: Commit**

```bash
git add src/app/main.css
git commit -m "feat(permissions): add .perms-layout compact CSS overrides"
```

---

## Task 2: UsersPermissionsFeature.vue — layout restructure

**Files:**
- Modify: `src/features/users/UsersPermissionsFeature.vue`

**What changes:**
1. Outer div: `p-8 gap-6` → `perms-layout` class (CSS handles the rest) + keep `flex h-full flex-col overflow-hidden`
2. Table wrapper div: add `border border-borderDefault` and remove `shadow-soft`; keep all layout classes
3. Toolbar slot: add `VButton` Save into the controls row; change `gap-6` → `gap-4`; `pb-4` → `pb-3`
4. Remove the standalone `<div class="flex shrink-0 justify-end">` with VButton at bottom

- [ ] **Step 1: Replace the outer div class**

Find:
```html
<div class="flex h-full flex-col gap-6 overflow-hidden p-8">
```

Replace with:
```html
<div class="perms-layout flex h-full flex-col overflow-hidden">
```

- [ ] **Step 2: Update the table wrapper div**

Find:
```html
<div class="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl bg-secondaryBg shadow-soft">
```

Replace with:
```html
<div class="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl bg-secondaryBg border border-borderDefault">
```

- [ ] **Step 3: Move Save button into toolbar slot, remove standalone Save div**

Find the entire `#toolbar` template slot + the standalone Save div:
```html
        <template #toolbar>
          <div class="flex items-center justify-between pb-4">
            <span class="text-headingCard text-txtPrimary">Permission matrix</span>

            <div class="flex items-center gap-6">
              <VSelect
                v-model="selectedRole"
                @select="applyRolePermissions"
                :options="roleOptions"
                label="Role"
              />

              <VCheckbox
                :model-value="allPerm"
                @update:model-value="onAllPermUpdate"
                label="All permissions"
                variant="switch"
                :disabled="isSelectAllDisabled()"
              />
            </div>
          </div>
        </template>
```

And further down:
```html
    <div class="flex shrink-0 justify-end">
      <VButton
        @click="saveUserPermissions"
        :disabled="patchPermissionsLoading || rolesLoading"
        :loading="rolesLoading || patchPermissionsLoading"
      >
        Save
      </VButton>
    </div>
```

Replace the toolbar slot with (Save button added, gap-6→gap-4, pb-4→pb-3):
```html
        <template #toolbar>
          <div class="flex items-center justify-between pb-3">
            <span class="text-headingCard text-txtPrimary">Permission matrix</span>

            <div class="flex items-center gap-4">
              <VSelect
                v-model="selectedRole"
                @select="applyRolePermissions"
                :options="roleOptions"
                label="Role"
              />

              <VCheckbox
                :model-value="allPerm"
                @update:model-value="onAllPermUpdate"
                label="All permissions"
                variant="switch"
                :disabled="isSelectAllDisabled()"
              />

              <VButton
                @click="saveUserPermissions"
                :disabled="patchPermissionsLoading || rolesLoading"
                :loading="rolesLoading || patchPermissionsLoading"
              >
                Save
              </VButton>
            </div>
          </div>
        </template>
```

And remove the standalone Save div entirely (do not keep it).

- [ ] **Step 4: Verify the file has no duplicate Save buttons**

```bash
grep -n "saveUserPermissions" src/features/users/UsersPermissionsFeature.vue
```

Expected: exactly 1 line with `saveUserPermissions` (inside `#toolbar` slot only).

- [ ] **Step 5: Commit**

```bash
git add src/features/users/UsersPermissionsFeature.vue
git commit -m "feat(permissions): compact layout, Save button in toolbar"
```

---

## Task 3: UserPanel.vue — compact padding + new icons

**Files:**
- Modify: `src/features/users/components/UserPanel.vue`

**What changes:**
1. Root div: `p-5` → `py-3 px-4`, `gap-6` → `gap-4`, add `border border-borderDefault` (remove `shadow-soft`)
2. Avatar: `h-12 w-12` → `h-9 w-9`, font `text-uiHead` → `text-uiCaption`
3. User name: `text-modalHead` → `text-uiHead`
4. Right section: `gap-4` → `gap-3`
5. Icons: `mdi:account` → `mdi:account-circle`, `mdi:crown` → `mdi:shield-account`

- [ ] **Step 1: Update root div**

Find:
```html
  <div class="flex w-full items-center justify-between gap-6 rounded-2xl bg-secondaryBg p-5 shadow-soft">
```

Replace with:
```html
  <div class="flex w-full items-center justify-between gap-4 rounded-2xl bg-secondaryBg border border-borderDefault py-3 px-4">
```

- [ ] **Step 2: Update avatar size and user name size**

Find:
```html
      <div
        v-else-if="user"
        class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-borderHover text-uiHead text-white"
      >
```

Replace with:
```html
      <div
        v-else-if="user"
        class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-borderHover text-uiCaption text-white"
      >
```

Find:
```html
          <p class="text-modalHead text-txtPrimary">{{ user.name }}</p>
```

Replace with:
```html
          <p class="text-uiHead text-txtPrimary">{{ user.name }}</p>
```

- [ ] **Step 3: Update right section gap**

Find:
```html
    <div class="flex items-center gap-4">
```

Replace with:
```html
    <div class="flex items-center gap-3">
```

- [ ] **Step 4: Update role icons**

Find:
```html
          <VIcon :icon="role.value === 'admin' ? 'mdi:crown' : 'mdi:account'" :size="18" />
```

Replace with:
```html
          <VIcon :icon="role.value === 'admin' ? 'mdi:shield-account' : 'mdi:account-circle'" :size="18" />
```

- [ ] **Step 5: Verify file looks correct**

```bash
grep -n "mdi:\|gap-\|p-5\|shadow-soft\|h-12\|text-modalHead" src/features/users/components/UserPanel.vue
```

Expected output — none of these old values remain:
- No `mdi:crown` or `mdi:account"` (without -circle/-shield)
- No `p-5`
- No `shadow-soft`
- No `h-12`
- No `text-modalHead`

- [ ] **Step 6: Commit**

```bash
git add src/features/users/components/UserPanel.vue
git commit -m "feat(permissions): compact UserPanel, new role icons"
```

---

## Final verification

- [ ] Start dev server: `npm run dev`
- [ ] Open the permissions page in browser
- [ ] Confirm: no vertical scroll with 10+ permission rows visible
- [ ] Confirm: Save button is in the toolbar (top right), no Save button at bottom
- [ ] Switch to light theme — confirm cards readable and well-contrasted
- [ ] Switch back to dark theme — confirm
- [ ] Check that other pages using `Table.vue` (e.g. Users list) are unaffected — the `.perms-layout` scope prevents bleedthrough
