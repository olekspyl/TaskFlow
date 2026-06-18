<script setup lang="ts">
import ThemeToggle from '@/shared/ui/ThemeToggle.vue'
import AuthBackground from '@/features/auth/components/AuthBackground.vue'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-layout__bloom" aria-hidden="true"></div>
    <div class="auth-layout__glow" aria-hidden="true"></div>
    <AuthBackground />

    <div class="absolute left-6 top-6 z-10">
      <ThemeToggle />
    </div>

    <RouterView class="relative z-10" />
  </div>
</template>

<style scoped></style>
