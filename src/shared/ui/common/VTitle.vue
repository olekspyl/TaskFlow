<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  text: string
  tag?: string
}

const { text, tag = 'h1' } = defineProps<Props>()
const computedStyle = computed(() => {
  if (tag === 'h1') return 'text-headPrimary text-txtPrimary'
  if (tag === 'h3') return 'text-headingCard text-txtPrimary'
  return ''
})
</script>

<template>
  <component :class="computedStyle" :is="$props.tag">{{ text }} </component>
</template>

<style scoped></style>
