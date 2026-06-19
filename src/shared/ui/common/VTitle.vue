<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  text: string
  tag?: string
}

const { text, tag = 'h1' } = defineProps<Props>()
const computedStyle = computed(() => {
  return tag === 'h1' ? 'text-headPrimary text-txtPrimary' : ''
})
</script>

<template>
  <component :class="computedStyle" :is="$props.tag">{{ text }} </component>
</template>

<style scoped></style>
