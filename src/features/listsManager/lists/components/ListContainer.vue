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
  <div class="flex w-[300px] gap-10">
    <div class="h-4 w-4 rounded-xl" :style="{ backgroundColor: list.hexColor }" />

    <button type="button" :disabled="listDetailsLoading" @click="handleOpenList">
      {{ list.title }}
    </button>

    <div>
      {{ list.totalTasks }}
    </div>

    <div>
      {{ list.completedTasks }}
    </div>

    <ActionMenu :actions="actions" />
  </div>

  <EditListModal
    v-if="isEditModalOpen"
    :list="list"
    :collection="collection"
    @close="closeEditModal"
  />
</template>

<style scoped></style>
