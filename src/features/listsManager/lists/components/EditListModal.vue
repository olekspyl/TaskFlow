<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { VButton, VDrawer, VInput, VConfirmModal } from '@/shared/ui/common'
import { useModal } from '@/shared/composables'
import { modalTypes } from '@/shared/types'
import { useUpdateList } from '../composables/useUpdateList'
import { useListsQuery } from '../stores/useListsQuery'
import { PRESET_COLORS } from '../constants/createListConfig'
import type { ListItem, ListSegment } from '../types/lists'

type Props = {
  list: ListItem
  collection: ListSegment
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const listsQuery = useListsQuery()

const { updateListForm, updateListLoading, executeUpdateList, fillUpdateListForm, v$ } =
  useUpdateList(() => props.list.id)

fillUpdateListForm({
  title: props.list.title,
  deadline: props.list.deadline ?? '',
  hexColor: props.list.hexColor,
})

const { open } = useModal(modalTypes.ModalId.EDIT_LIST)
const confirmModal = useModal(modalTypes.ModalId.CONFIRM_EDIT_LIST)

onMounted(open)

function handleSubmit(): void {
  confirmModal.open()
}

async function handleConfirmedSubmit(): Promise<void> {
  await executeUpdateList()
  confirmModal.close()
  emit('close')
  await listsQuery.refetch(props.collection)
}

const isSubmitDisabled = computed(() => {
  return updateListLoading.value || v$.value.$invalid
})
</script>

<template>
  <VDrawer
    :id="modalTypes.ModalId.EDIT_LIST"
    :title="t('lists.edit.title')"
    :disable-close="updateListLoading"
    @close="emit('close')"
  >
    <template #body="{ formId }">
      <form :id="formId" class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <VInput
          v-model.trim="updateListForm.title"
          :label="t('lists.create.titleLabel')"
          required
          autocomplete="off"
        />
        <VInput
          v-model="updateListForm.deadline"
          :label="t('lists.create.deadlineLabel')"
          type="datetime-local"
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
                  updateListForm.hexColor === color
                    ? `0 0 0 2px var(--color-secondaryBg), 0 0 0 4px ${color}`
                    : 'none',
              }"
              :aria-label="t('lists.create.selectColor', { color })"
              @click="updateListForm.hexColor = color"
            />
          </div>
        </div>
      </form>
    </template>

    <template #footer="{ formId }">
      <VButton
        :text="t('lists.create.cancel')"
        type="button"
        variant="icon"
        :disabled="updateListLoading"
        @click="emit('close')"
      />

      <VButton
        :form="formId"
        :text="t('lists.edit.submit')"
        type="submit"
        variant="primary"
        :disabled="isSubmitDisabled"
        :loading="updateListLoading"
      />
    </template>
  </VDrawer>

  <VConfirmModal
    :id="modalTypes.ModalId.CONFIRM_EDIT_LIST"
    :title="t('lists.edit.confirmTitle')"
    :message="t('lists.edit.confirmMessage')"
    :confirm-text="t('lists.edit.confirmSubmit')"
    :loading="updateListLoading"
    @confirm="handleConfirmedSubmit"
    @close="confirmModal.close"
  />
</template>

<style scoped></style>
