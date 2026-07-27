<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { clearAllCache } from '@ametie/vue-muza-use'
import { VIcon } from '@/shared/ui/common'
import { useUserStore } from '@/shared/stores'
import { NavItem } from '.'

const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const userStore = useUserStore()
const isSidebarOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const handleLogout = () => {
  userStore.logout()
  clearAllCache()
}
</script>

<template>
  <div
    class="sidebar relative flex h-full flex-col"
    :class="isSidebarOpen ? 'w-[256px]' : 'w-[64px] sidebar--collapsed'"
  >
    <button
      @click="isSidebarOpen = !isSidebarOpen"
      class="absolute right-[-12px] top-1/2 z-[50] flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-borderDefault bg-elevated text-muted transition-colors hover:border-primary hover:text-primary"
      type="button"
      :aria-expanded="isSidebarOpen"
      :aria-label="t('sidebar.toggleAriaLabel')"
    >
      <VIcon :icon="isSidebarOpen ? 'lucide:chevron-left' : 'lucide:chevron-right'" :size="11" />
    </button>

    <div class="flex shrink-0 items-center gap-[9px] border-b border-borderDefault px-4 py-[15px]">
      <div
        class="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] bg-gradient-to-br from-primary to-borderHover text-[11px] font-bold text-white"
      >
        A
      </div>
      <span
        v-show="isSidebarOpen"
        class="truncate text-[12.5px] font-semibold leading-none text-txtPrimaryDark"
      >
        {{ t('sidebar.appName') }}
      </span>
    </div>

    <p
      v-show="isSidebarOpen"
      class="shrink-0 px-4 pb-1 pt-3 text-[9.5px] font-semibold uppercase tracking-[1.1px] text-txtSecondaryDark opacity-50"
    >
      {{ t('sidebar.navigationTitle') }}
    </p>

    <nav
      class="flex flex-1 flex-col gap-[1px] overflow-y-auto px-2 py-1"
      :aria-label="t('sidebar.navAriaLabel')"
    >
      <NavItem />
    </nav>

    <div class="shrink-0 border-t border-borderDefault px-2 py-2">
      <NavItem
        do="action"
        :items="{ title: t('sidebar.logout'), img: 'lucide:log-out' }"
        :on-click="handleLogout"
      />
    </div>
  </div>
</template>

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
