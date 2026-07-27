<script setup lang="ts">
import { VButton } from '@/shared/ui/common'

type Props = {
  title: string
  submitText: string
  loading?: boolean
  disabled?: boolean
  errorMessage?: string | null
}

defineProps<Props>()

const emit = defineEmits<{
  submit: []
}>()
</script>

<template>
  <div class="relative">
    <form class="flex flex-col gap-6 w-full" @submit.prevent="emit('submit')">
      <slot name="title">
        <h1
          class="text-txtPrimaryDark text-dataMetric inline-flex w-full justify-center whitespace-nowrap text-center"
        >
          {{ title }}
        </h1>
      </slot>
      <slot />
      <VButton
        variant="primary"
        type="submit"
        :text="submitText"
        :disabled="disabled || loading"
        :loading="loading"
      />
      <p v-if="errorMessage" class="text-red-500 text-sm">
        <slot :error="errorMessage" :text="submitText" name="error">
          {{ errorMessage }}
        </slot>
      </p>
    </form>
  </div>
</template>
