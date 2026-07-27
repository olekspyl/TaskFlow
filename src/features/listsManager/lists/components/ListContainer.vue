<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { router } from '@/app/router'
import { useToast, useModal } from '@/shared/composables'
import { modalTypes } from '@/shared/types'
import { ActionMenu } from '@/shared/ui/table'
import { VConfirmModal, VDate } from '@/shared/ui/common'
import { listsApi } from '../api'
import EditListModal from './EditListModal.vue'
import { useListsQuery } from '../stores/useListsQuery'
import { getListPercent, getListUrgency } from '../utils'
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

const percent = computed(() => getListPercent(props.list))
const urgency = computed(() => getListUrgency(props.list))

const deadlineClass = computed(() => {
  if (urgency.value === 'overdue') return 'text-dangerous'
  if (urgency.value === 'soon') return 'text-warning'
  return 'text-muted'
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
    class="flex items-center gap-4 rounded-xl bg-listCardBg px-4 py-3 shadow-soft transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-taught"
  >
    <span
      class="mt-0.5 h-2.5 w-2.5 shrink-0 self-start rounded-full"
      :style="{ backgroundColor: list.hexColor }"
    />

    <div class="min-w-0 flex-1">
      <button
        type="button"
        :disabled="listDetailsLoading"
        class="block max-w-full truncate text-left text-headingCard text-txtPrimary transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        @click="handleOpenList"
      >
        {{ list.title }}
      </button>

      <div class="flex flex-wrap items-center gap-x-1.5 text-uiCaption text-muted">
        <span v-if="list.deadline" :class="deadlineClass">
          <VDate :date="list.deadline" date-format="dd MMM" />
        </span>
        <span v-if="list.deadline">•</span>
        <span>{{ list.completedTasks }}/{{ list.totalTasks }} {{ t('lists.card.tasksLabel') }}</span>
        <template v-if="collection === 'usersLists'">
          <span>•</span>
          <span>{{ list.owner.name }}</span>
        </template>
      </div>
    </div>

    <span class="hidden shrink-0 text-bodyEmphasis text-txtPrimary sm:block">{{ percent }}%</span>

    <div class="shrink-0">
      <ActionMenu :actions="actions" />
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
