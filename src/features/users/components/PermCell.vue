<script setup lang="ts">
import { VCheckbox } from '@/shared/ui/common'

type Props = {
  visible: boolean
  modelValue: boolean
  disabled?: boolean
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <VCheckbox
    v-if="visible"
    label=""
    class="h-full w-full justify-center"
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
