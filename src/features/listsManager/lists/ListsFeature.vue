<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useUserStore } from '@/shared/stores'
import { VLoader, VSegmentControl } from '@/shared/ui/common'

import { Filters, MyLists, UsersLists } from './components'
import { useListsQuery } from './stores/useListsQuery'
import type { ListSegment } from './types/lists'

const { t } = useI18n()
const user = useUserStore()
const listsQuery = useListsQuery()

const { lists, listsLoading, filtering, sorting } = storeToRefs(listsQuery)

const activeTag = ref<ListSegment>('myLists')

const canViewUsersLists = computed(() => {
  return user.role === 'admin'
})

const activeListComponent = computed(() => {
  return activeTag.value === 'usersLists' && canViewUsersLists.value ? UsersLists : MyLists
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

const tags = computed<Array<{ id: ListSegment; label: string }>>(() => [
  {
    id: 'myLists',
    label: t('lists.segments.myLists'),
  },
  {
    id: 'usersLists',
    label: t('lists.segments.usersLists'),
  },
])
</script>

<template>
  <div>
    <div
      class="sticky -top-4 z-10 mb-6 flex flex-col gap-4 border-b border-borderDefault bg-primaryBg pb-4 sm:flex-row sm:items-center"
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

    <VLoader v-if="listsLoading" size="section" />
    <component :is="activeListComponent" v-show="!listsLoading" :lists="lists?.data ?? []" />
  </div>
</template>

<style scoped></style>
