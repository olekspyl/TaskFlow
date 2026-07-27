<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { VButton, VModal } from '.'

type Props = {
  id: string
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
  loading?: boolean
}

const { danger = false, loading = false } = defineProps<Props>()

const emit = defineEmits<{
  confirm: []
  close: []
}>()

const { t } = useI18n()
</script>

<template>
  <VModal :id="id" :title="title" :disable-close="loading" @close="emit('close')">
    <template #body>
      <p v-if="message" class="text-bodyM text-txtPrimary">
        {{ message }}
      </p>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <VButton
          :text="cancelText ?? t('common.confirmModal.cancel')"
          type="button"
          variant="outline"
          :disabled="loading"
          @click="emit('close')"
        />

        <VButton
          :text="confirmText ?? t('common.confirmModal.confirm')"
          type="button"
          :variant="danger ? 'warning' : 'primary'"
          :loading="loading"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </VModal>
</template>

<style scoped></style>
