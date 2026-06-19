<script setup lang="ts">
type Props = {
  width?: string
  height?: string
  rounded?: string
}

const { width = '100%', height = '16px', rounded = '8px' } = defineProps<Props>()
</script>

<template>
  <div
    class="v-skeleton"
    :style="{
      width,
      height,
      borderRadius: rounded,
    }"
  />
</template>

<style scoped>
.v-skeleton {
  position: relative;
  overflow: hidden;
  background-color: var(--color-skeletonBg);
}

.v-skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 25%, rgba(255, 255, 255, 0.18) 50%, transparent 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s linear infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
