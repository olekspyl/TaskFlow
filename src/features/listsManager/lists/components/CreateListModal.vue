<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { VButton, VInput, VModal } from '@/shared/ui/common'
import { useModal } from '@/shared/composables'
import { modalTypes } from '@/shared/types'
import { useCreateList } from '../composables/useCreateList'
import { useListsQuery } from '../stores/useListsQuery'
import { PRESET_COLORS } from '../constants/createListConfig'

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const listsQuery = useListsQuery()
const { createListForm, createListLoading, executeCreateList, v$ } = useCreateList()

const { open } = useModal(modalTypes.ModalId.CREATE_LIST)

onMounted(open)

const isSubmitDisabled = computed(() => {
  return createListLoading.value || !createListForm.title.trim() || v$.value.$invalid
})

const handleSubmit = async (): Promise<void> => {
  await executeCreateList()
  emit('close')
  await listsQuery.refetch('myLists')
}
</script>

<template>
  <VModal
    :id="modalTypes.ModalId.CREATE_LIST"
    :title="t('lists.create.title')"
    :disable-close="createListLoading"
    @close="emit('close')"
  >
    <template #body="{ formId }">
      <form :id="formId" class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <VInput
          v-model.trim="createListForm.title"
          :label="t('lists.create.titleLabel')"
          :validation="v$.title"
          autocomplete="off"
        />

        <VInput
          v-model="createListForm.deadline"
          type="datetime-local"
          :label="t('lists.create.deadlineLabel')"
          :validation="v$.deadline"
        />

        <div class="flex flex-col gap-1">
          <span class="text-uiLabel text-muted">{{ t('lists.create.colorLabel') }}</span>

          <div class="flex items-center gap-2.5">
            <button
              v-for="color in PRESET_COLORS"
              :key="color"
              type="button"
              class="h-7 w-7 rounded-full transition-transform hover:scale-110"
              :style="{
                backgroundColor: color,
                boxShadow:
                  createListForm.hexColor === color
                    ? `0 0 0 2px var(--color-secondaryBg), 0 0 0 4px ${color}`
                    : 'none',
              }"
              :aria-label="t('lists.create.selectColor', { color })"
              @click="createListForm.hexColor = color"
            ></button>
          </div>
        </div>
      </form>
    </template>

    <template #footer="{ formId }">
      <VButton
        :text="t('lists.create.cancel')"
        type="button"
        variant="primary"
        :disabled="createListLoading"
        @click="emit('close')"
      />

      <VButton
        :form="formId"
        :text="t('lists.create.submit')"
        type="submit"
        variant="primary"
        :disabled="isSubmitDisabled"
        :loading="createListLoading"
      />
    </template>
  </VModal>
</template>

<style scoped></style>
