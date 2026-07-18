<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { routerTypes } from '@/shared/types'
import { VLoader } from '@/shared/ui/common'
import { useUserStore } from '@/shared/stores'
import { DefaultLayout, AuthLayout } from '.'

const route = useRoute()
const userStore = useUserStore()

const layout = computed(() => {
  return route.meta.layout || routerTypes.RouteLayouts.DEFAULT
})

const layoutComponent = computed(() => {
  return layout.value === routerTypes.RouteLayouts.AUTH ? AuthLayout : DefaultLayout
})
</script>

<template>
  <VLoader v-if="userStore.fetchUserLoading" size="fullscreen" />
  <component v-else :is="layoutComponent" />
</template>
