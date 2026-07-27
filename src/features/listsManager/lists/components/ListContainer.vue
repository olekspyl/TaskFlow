<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { router } from '@/app/router'
import { useToast, useModal } from '@/shared/composables'
import { modalTypes } from '@/shared/types'
import { ActionMenu } from '@/shared/ui/table'
import { VConfirmModal } from '@/shared/ui/common'
import { listsApi } from '../api'
import EditListModal from './EditListModal.vue'
import { useListsQuery } from '../stores/useListsQuery'
import { type ListItem, ListActions, type ListSegment } from '../types/lists'

type Props = {
  list: ListItem
  collection: ListSegment
}

const props = defineProps<Props>()

const { t } = useI18n()
const { showSuccess } = useToast()
const { getListById, deleteListById } = listsApi()

const listsQuery = useListsQuery()
const { myListsCacheKey, usersListsCacheKey } = storeToRefs(listsQuery)

const activeListId = ref<string | null>(null)
const isEditModalOpen = ref(false)

const cardStyle = computed(() => ({
  backgroundColor: `${props.list.hexColor}24`,
  borderColor: `${props.list.hexColor}47`,
}))

const progressStyle = computed(() => {
  const total = props.list.totalTasks
  const percent = total > 0 ? Math.round((props.list.completedTasks / total) * 100) : 0

  return {
    width: `${percent}%`,
    backgroundColor: props.list.hexColor,
  }
})

const { loading: listDetailsLoading, execute: getListDetails } = getListById(
  () => activeListId.value,
  {
    lazy: true,
    onSuccess: async () => {
      if (!activeListId.value) {
        return
      }
      await router.push(`/lists/${activeListId.value}`)
    },
  },
)

const { loading: deleteListLoading, execute: deleteList } = deleteListById(
  () => activeListId.value,
  {
    lazy: true,
    onSuccess: () => {
      showSuccess(t('lists.toast.deleted'))
    },
  },
)

const openEditModal = () => {
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
}

const confirmDeleteModalId = `${modalTypes.ModalId.CONFIRM_DELETE_LIST}-${props.list.id}`
const confirmDeleteModal = useModal(confirmDeleteModalId)

async function handleOpenList(): Promise<void> {
  activeListId.value = props.list.id
  await getListDetails()
}

async function handleConfirmedDeleteList(): Promise<void> {
  activeListId.value = props.list.id

  const cacheKeyForCollection =
    props.collection === 'myLists' ? myListsCacheKey.value : usersListsCacheKey.value

  await deleteList({
    invalidateCache: cacheKeyForCollection ?? [],
  })

  confirmDeleteModal.close()

  await listsQuery.refetch(props.collection)
}

const actions = computed(() => [
  {
    name: ListActions.EDIT_LIST,
    label: t('lists.actions.edit'),
    icon: 'lucide:cherry',
    execute: openEditModal,
  },
  {
    name: ListActions.DELETE_LIST,
    label: t('lists.actions.delete'),
    icon: 'lucide:trash-2',
    style: 'dangerous',
    disabled: deleteListLoading.value,
    execute: confirmDeleteModal.open,
  },
])
</script>

<template>
  <div
    class="flex flex-col gap-2 rounded-xl border p-3 transition-[transform,box-shadow] duration-150 ease-out hover:scale-[1.02] hover:shadow-soft"
    :style="cardStyle"
  >
    <div class="flex items-start justify-between gap-2">
      <button
        type="button"
        :disabled="listDetailsLoading"
        class="flex-1 min-w-0 whitespace-normal break-words text-left text-headingCard text-txtPrimary transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        @click="handleOpenList"
      >
        {{ list.title }}
      </button>

      <div class="shrink-0">
        <ActionMenu :actions="actions" />
      </div>
    </div>

    <div>
      <p class="text-bodyEmphasis text-txtPrimary">
        {{ list.completedTasks
        }}<span class="text-bodyM font-normal text-muted"> / {{ list.totalTasks }}</span>
      </p>

      <div class="mt-1.5 h-1 overflow-hidden rounded-full bg-secondaryBg/60">
        <div
          class="h-full rounded-full transition-[width] duration-200 ease-out"
          :style="progressStyle"
        />
      </div>
    </div>
  </div>

  <EditListModal
    v-if="isEditModalOpen"
    :list="list"
    :collection="collection"
    @close="closeEditModal"
  />

  <VConfirmModal
    :id="confirmDeleteModalId"
    :title="t('lists.actions.deleteConfirmTitle')"
    :message="t('lists.actions.deleteConfirmMessage')"
    :confirm-text="t('lists.actions.deleteConfirmSubmit')"
    danger
    :loading="deleteListLoading"
    @confirm="handleConfirmedDeleteList"
    @close="confirmDeleteModal.close"
  />
</template>

<style scoped></style>
