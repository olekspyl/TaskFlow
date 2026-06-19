<script setup lang="ts">
import { Icon } from '@iconify/vue'

type Props = {
  icon: string
  size?: number | string
  color?: string
  hoveredColor?: string
}

const { size = 20, color, hoveredColor } = defineProps<Props>()
</script>

<template>
  <Icon
    class="vIcon"
    :style="{ width: size, height: size }"
    aria-hidden="true"
    :icon="icon"
    :width="size"
    :height="size"
  />
</template>

<style scoped lang="scss">
.vIcon {
  @apply inline-flex shrink-0 items-center justify-center;
  line-height: 1;
  color: inherit;
}

.vIcon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
  color: inherit;
}
</style>
