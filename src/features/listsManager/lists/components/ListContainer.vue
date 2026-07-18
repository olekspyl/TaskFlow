<script setup lang="ts">
import { computed, ref } from 'vue'

import { router } from '@/app/router'
import { useToast } from '@/shared/composables'
import { ActionMenu } from '@/shared/ui/table'

import { listsApi } from '../api'
import EditListModal from './EditListModal.vue'
import { useListsQuery } from '../stores/useListsQuery.ts'
import { type ListItem, ListActions, type ListSegment } from '../types/lists'

const LISTS_AUTO_CACHE_PREFIX = 'auto:GET:/lists:'

type Props = {
  list: ListItem
  collection: ListSegment
}

defineEmits<{
  edit: [list: ListItem]
}>()

const props = defineProps<Props>()

const { showSuccess } = useToast()
const { getListById, deleteListById } = listsApi()

const listsQuery = useListsQuery()

const activeListId = ref<string | null>(null)
const isEditModalOpen = ref(false)

const deleteOptions = computed(() => ({
  lazy: true,

  invalidateCache:
    props.collection === 'myLists'
      ? {
          prefix: LISTS_AUTO_CACHE_PREFIX,
        }
      : undefined,

  onSuccess: () => {
    showSuccess('List deleted successfully')
  },
}))

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
  deleteOptions.value,
)

function openEditModal(): void {
  isEditModalOpen.value = true
}

function closeEditModal(): void {
  isEditModalOpen.value = false
}

async function handleOpenList(): Promise<void> {
  activeListId.value = props.list.id
  await getListDetails()
}

async function handleDeleteList(): Promise<void> {
  activeListId.value = props.list.id

  await deleteList()

  if (props.collection === 'myLists') {
    await listsQuery.fetchMyLists()
  } else {
    await listsQuery.fetchUsersLists()
  }
}

const actions = computed(() => [
  {
    name: ListActions.EDIT_LIST,
    icon: 'lucide:cherry',
    execute: openEditModal,
  },
  {
    name: ListActions.DELETE_LIST,
    icon: 'lucide:trash-2',
    style: 'dangerous',
    disabled: deleteListLoading.value,
    execute: handleDeleteList,
  },
])
</script>

<template>
  <div
    class="flex flex-col gap-3 rounded-2xl border p-4 transition-shadow duration-150 ease-out hover:shadow-soft"
    :style="cardStyle"
  >
    <div class="flex items-start justify-between gap-2">
      <button
        type="button"
        :disabled="listDetailsLoading"
        class="flex-1 min-w-0 whitespace-normal break-words text-left text-bodyEmphasis text-txtPrimary transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
        @click="handleOpenList"
      >
        {{ list.title }}
      </button>

      <div class="shrink-0">
        <ActionMenu :actions="actions" />
      </div>
    </div>

    <div>
      <p class="text-headingCard text-txtPrimary">
        {{ list.completedTasks
        }}<span class="text-bodyM font-normal text-muted"> / {{ list.totalTasks }}</span>
      </p>

      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-secondaryBg/60">
        <div class="h-full rounded-full transition-[width] duration-200 ease-out" :style="progressStyle" />
      </div>
    </div>
  </div>

  <EditListModal
    v-if="isEditModalOpen"
    :list="list"
    :collection="collection"
    @close="closeEditModal"
  />
</template>

<style scoped></style>
