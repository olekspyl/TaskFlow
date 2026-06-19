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
    <div class="flex justify-center items-center bg-white h-full p-4">
      <slot name="spinner">
        <div
          class="w-[200px] h-[300px] border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"
        ></div>
      </slot>
    </div>
  </div>
</template>

<style scoped></style>
