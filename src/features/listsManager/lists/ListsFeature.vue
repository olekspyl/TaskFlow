<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useUserStore } from '@/shared/stores'
import { VLoader, VSegmentControl } from '@/shared/ui/common'

import { Filters, MyLists, UsersLists } from './components'
import { useListsQuery } from './stores/useListsQuery'
import type { ListSegment } from './types/lists'

const user = useUserStore()
const listsQuery = useListsQuery()

const { myLists, usersLists, myListsLoading, usersListsLoading, filtering, sorting } =
  storeToRefs(listsQuery)

const activeTag = ref<ListSegment>('myLists')

const canViewUsersLists = computed(() => {
  return user.role === 'admin'
})

const isUsersListsAllowedToAccess = computed(() => {
  return canViewUsersLists.value && activeTag.value === 'usersLists'
})

async function handleFiltersChange(): Promise<void> {
  await listsQuery.refetch(activeTag.value)
}

async function handleResetFilters(): Promise<void> {
  await listsQuery.resetFilters(activeTag.value)
}

async function handleSegmentChange(): Promise<void> {
  if (!canViewUsersLists.value) {
    activeTag.value = 'myLists'
    return
  }

  await listsQuery.resetFilters(activeTag.value)
}

onMounted(async () => {
  await listsQuery.refetch('myLists')
})

const tags: Array<{
  id: ListSegment
  label: string
}> = [
  {
    id: 'myLists',
    label: 'My lists',
  },
  {
    id: 'usersLists',
    label: 'Users list',
  },
]
</script>

<template>
  <div>
    <div
      class="mb-6 flex flex-col gap-4 rounded-2xl border border-borderDefault bg-secondaryBg p-4 shadow-soft sm:flex-row sm:items-center"
    >
      <VSegmentControl
        v-if="canViewUsersLists"
        v-model="activeTag"
        :tags="tags"
        @change-segment="handleSegmentChange"
      />

      <Filters
        v-model:sorting="sorting"
        v-model:filtering="filtering"
        :action="handleResetFilters"
        class="sm:ml-auto"
        @change="handleFiltersChange"
      />
    </div>

    <template v-if="isUsersListsAllowedToAccess">
      <VLoader v-if="usersListsLoading" size="section" />
      <UsersLists v-else :lists="usersLists?.data ?? []" />
    </template>

    <template v-else>
      <VLoader v-if="myListsLoading" size="section" />
      <MyLists v-else :lists="myLists?.data ?? []" />
    </template>
  </div>
</template>

<style scoped></style>
