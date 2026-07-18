<script setup lang="ts">
import { PermsTypes } from '@/shared/types'
import { PermRow, PermCell } from '.'

type Props = {
  row: PermsTypes.PermissionRow
  action: PermsTypes.PermissionAction
  visible: boolean
  modelValue: boolean
  disabled?: boolean
}

defineProps<Props>()
// hide visible and disables inside
defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <PermRow>
    <PermCell
      :visible="visible"
      :model-value="modelValue"
      :disabled="disabled"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </PermRow>
</template>
