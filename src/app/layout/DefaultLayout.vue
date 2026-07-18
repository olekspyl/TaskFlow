<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { HEADER_COMPONENTS } from '@/app/constants/header'
import { Sidebar } from '@/shared/ui/sidebar'
import { VLoader } from '@/shared/ui/common'
import { useUserStore } from '@/shared/stores'

const store = useUserStore()
const route = useRoute()
const isSidebarOpen = ref(true)

const HeaderComponent = computed(() => route.meta.header?.component ?? HEADER_COMPONENTS.DEFAULT)
</script>

<template>
  <div
    class="grid h-screen grid-rows-[minmax(0,1fr)] overflow-hidden bg-primaryBg text-txtPrimary"
    :class="isSidebarOpen ? 'grid-cols-[256px_minmax(0,1fr)]' : 'grid-cols-[64px_minmax(0,1fr)]'"
  >
    <aside class="relative z-10 row-start-1">
      <Sidebar v-model="isSidebarOpen" />
    </aside>

    <main
      v-if="store.userName"
      class="col-start-2 row-start-1 flex min-h-0 min-w-0 flex-col overflow-hidden"
    >
      <component :is="HeaderComponent" />
      <div class="min-h-0 flex-1 overflow-y-auto mx-4">
        <RouterView />
      </div>
    </main>
    <div v-else>
      <VLoader size="section" />
    </div>
  </div>
</template>
