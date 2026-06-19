<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import MasterLayout from './layout/MasterLayout.vue'
import { useTheme } from '@/shared/composables'

const { theme } = useTheme()
</script>

<template>
  <Toaster position="top-right" :theme="theme" :gap="10" />
  <MasterLayout />
</template>

<style scoped></style>
