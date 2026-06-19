<script setup lang="ts">
import { computed, useSlots } from 'vue'

type Props = {
  title?: string
  variant?: 'default' | 'plain'
  component?: 'header' | 'section' | 'div' | 'form'
}

const { title, variant = 'default', component = 'section' } = defineProps<Props>()

const slots = useSlots()
const hasTitle = computed(() => !!title || !!slots.title)
</script>

<template>
  <component :is="component" class="containerBase">
    <slot name="title">
      <h2 v-if="hasTitle" class="containerTitle">
        {{ title }}
      </h2>
    </slot>

    <div class="containerContent">
      <slot />
    </div>
  </component>
</template>

<style scoped lang="scss">
.containerBase {
  @apply mx-auto rounded-xl bg-secondaryBgLight;
}

.containerBase.default {
  @apply border border-toggle p-4;
}

.containerBase.plain {
  @apply p-0;
}

.containerTitle {
  @apply mb-4 text-lg font-semibold;
}

.containerContent {
  @apply flex flex-col;
}
</style>
