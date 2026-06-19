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
