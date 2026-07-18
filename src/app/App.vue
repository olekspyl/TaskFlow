<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { useTheme } from '@/features/theme'
import { MasterLayout } from './layout'

const { theme } = useTheme()
</script>

<template>
  <Toaster position="top-right" :theme="theme" :gap="10" />
  <MasterLayout />
</template>

<style scoped></style>
