<script setup lang="ts">
import { Switch } from '@headlessui/vue'
import { Icon } from '@iconify/vue'
import { useTheme } from '@/shared/composables'

const { isDark } = useTheme()
</script>

<template>
  <Switch
    v-model="isDark"
    class="relative inline-flex h-7 w-12 items-center rounded-full border border-borderDefault bg-secondaryBg shadow-soft transition-colors focus:outline-none focus-visible:shadow-focusRing"
  >
    <span class="sr-only">Toggle theme</span>

    <span
      :class="isDark ? 'translate-x-6' : 'translate-x-1'"
      class="flex h-5 w-5 transform items-center justify-center rounded-full bg-primary shadow-soft transition-all"
    >
      <Icon :icon="isDark ? 'heroicons:moon' : 'heroicons:sun'" class="h-3 w-3 text-secondaryBg" />
    </span>
  </Switch>
</template>
