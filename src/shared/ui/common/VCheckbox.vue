<script setup lang="ts">
import { VIcon } from '.'

type Props = {
  label?: string
  disabled?: boolean
  modelValue?: boolean
  variant?: 'checkbox' | 'switch'
}

withDefaults(defineProps<Props>(), {
  variant: 'checkbox',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <label
    class="group inline-flex items-center gap-2"
    :class="disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
  >
    <span class="relative inline-flex shrink-0">
      <input
        type="checkbox"
        class="peer absolute inset-0 z-10 h-full w-full opacity-0"
        :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
        :checked="modelValue"
        :disabled="disabled"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />

      <span
        v-if="variant === 'switch'"
        class="relative block h-5 w-9 rounded-full transition-colors peer-focus-visible:shadow-focusRing peer-focus-visible:rounded-full"
        :class="[
          disabled ? 'bg-skeletonBg' : modelValue ? 'bg-primary' : 'bg-borderHover',
          !disabled &&
            (modelValue ? 'group-hover:bg-activePrimary' : 'group-hover:shadow-focusRing'),
        ]"
      >
        <span
          class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-soft transition-all"
          :class="modelValue ? 'left-[18px]' : 'left-0.5'"
        />
      </span>

      <span
        v-else
        class="flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors peer-focus-visible:shadow-focusRing peer-focus-visible:rounded-md"
        :class="[
          disabled
            ? 'border-borderDefault bg-skeletonBg text-muted'
            : modelValue
              ? 'border-primary bg-primary text-white'
              : 'border-borderDefault bg-secondaryBg',
          !disabled &&
            (modelValue
              ? 'group-hover:border-activePrimary group-hover:bg-activePrimary'
              : 'group-hover:border-primary'),
        ]"
      >
        <VIcon v-if="modelValue" icon="mdi:check-bold" :size="16" />
      </span>
    </span>

    <span v-if="label" class="text-uiLabel" :class="disabled ? 'text-muted' : 'text-txtPrimary'">
      <slot name="label">{{ label }}</slot>
    </span>
  </label>
</template>
