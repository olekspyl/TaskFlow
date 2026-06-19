<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  size: 'fullscreen' | 'section'
}

const props = defineProps<Props>()

const styles = computed(() => {
  return props.size === 'fullscreen' ? 'fixed z-50 inset-0' : 'w-full h-full'
})
</script>

<template>
  <div :class="styles">
    <div class="flex justify-center items-center h-full p-4">
      <slot name="spinner">
        <div class="h-10 w-10 animate-spin rounded-full border-[3px] border-borderDefault border-t-primary" />
      </slot>
    </div>
  </div>
</template>

<style scoped></style>
