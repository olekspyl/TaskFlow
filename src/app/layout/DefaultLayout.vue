<script setup lang="ts">
import { ref } from 'vue'
import { Sidebar } from '@/shared/ui/sidebar'
import { DefaultHeader } from '@/widgets'

const isSidebarOpen = ref(true)
</script>

<template>
  <div
    class="grid h-screen grid-rows-[minmax(0,1fr)] overflow-hidden bg-primaryBg text-txtPrimary"
    :class="isSidebarOpen ? 'grid-cols-[256px_minmax(0,1fr)]' : 'grid-cols-[64px_minmax(0,1fr)]'"
  >
    <aside class="row-start-1">
      <Sidebar :is-open="isSidebarOpen" @update="isSidebarOpen = $event" />
    </aside>

    <main class="col-start-2 row-start-1 min-h-0 min-w-0">
      <RouterView />
    </main>
  </div>
</template>
