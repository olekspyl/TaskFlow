<script setup lang="ts">
import type { UserResponse } from '../types/users'
import { VSkeleton, VDate, VIcon } from '@/shared/ui/common'
import { selectTypes } from '@/shared/types'
import { getInitials } from '@/shared/utils'

type Props = {
  user?: UserResponse | null
  loading: boolean
  role?: selectTypes.Option
  permissionsSummary?: { granted: number; total: number }
}

defineProps<Props>()
</script>

<template>
  <div class="flex w-full items-center justify-between gap-4 rounded-2xl bg-secondaryBg border border-borderDefault py-3 px-4">
    <div class="flex items-center gap-4">
      <VSkeleton v-if="loading" width="48px" height="48px" rounded="50%" />
      <div
        v-else-if="user"
        class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-borderHover text-uiCaption text-white"
      >
        {{ getInitials(user.name) }}
      </div>

      <div class="flex flex-col gap-1">
        <template v-if="loading">
          <VSkeleton width="140px" height="20px" />
          <VSkeleton width="220px" height="14px" />
          <VSkeleton width="160px" height="14px" />
        </template>
        <template v-else-if="user">
          <p class="text-uiHead text-txtPrimary">{{ user.name }}</p>
          <p class="text-bodyM text-muted">{{ user.email }}</p>
          <p class="text-bodyM text-muted">Member since <VDate :date="user.createdAt" /></p>
        </template>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <div class="flex flex-col items-end justify-center gap-1 leading-tight">
        <template v-if="loading">
          <VSkeleton width="60px" height="20px" />
          <VSkeleton width="120px" height="14px" />
        </template>
        <template v-else-if="permissionsSummary">
          <span class="text-headingCard text-txtPrimary">
            {{ permissionsSummary.granted }} / {{ permissionsSummary.total }}
          </span>
          <span class="text-bodyM text-muted">permissions granted</span>
        </template>
      </div>

      <VSkeleton v-if="loading" width="120px" height="44px" rounded="9999px" />
      <div v-else-if="role" class="flex items-center gap-3 rounded-full bg-elevated py-2 pl-2 pr-4">
        <span
          class="flex h-9 w-9 items-center justify-center rounded-full text-white"
          :class="role.value === 'admin' ? 'bg-warning' : 'bg-primary'"
        >
          <VIcon :icon="role.value === 'admin' ? 'mdi:shield-account' : 'mdi:account-circle'" :size="18" />
        </span>
        <span
          class="text-uiLabel font-semibold"
          :class="role.value === 'admin' ? 'text-warning' : 'text-primary'"
        >
          {{ role.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
