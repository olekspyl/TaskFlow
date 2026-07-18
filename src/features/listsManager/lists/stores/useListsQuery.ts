import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import { cleanEmptyKeys } from '@/shared/utils'

import { listsApi } from '../api'
import type { SortingOption, ListSegment } from '../types/lists'

type ListsParams = {
  sort: string
  order: 'asc' | 'desc'
  q?: string
  isOwn?: boolean
}

const createDefaultSorting = (): SortingOption => ({
  label: 'Recently updated',
  value: 'desc',
  sortCategory: 'createdAt',
})

export const useListsQuery = defineStore('lists-query', () => {
  const { getLists } = listsApi()

  const filtering = ref('')
  const sorting = ref<SortingOption>(createDefaultSorting())

  const myListsParams = reactive<ListsParams>({
    sort: sorting.value.sortCategory,
    order: sorting.value.value,
    isOwn: true,
  })

  const usersListsParams = reactive<ListsParams>({
    sort: sorting.value.sortCategory,
    order: sorting.value.value,
  })

  const {
    data: myLists,
    loading: myListsLoading,
    execute: fetchMyLists,
    cacheKey: myListsCacheKey,
  } = getLists({
    // immediate: true,
    lazy: true,
    params: myListsParams,
  })

  const {
    data: usersLists,
    loading: usersListsLoading,
    execute: fetchUsersLists,
  } = getLists({
    lazy: true,
    params: usersListsParams,
    cache: true,
  })

  function syncParams(): void {
    const sharedParams = cleanEmptyKeys({
      sort: sorting.value.sortCategory,
      order: sorting.value.value,
      q: filtering.value,
    })

    Object.assign(myListsParams, sharedParams, {
      isOwn: true,
    })

    Object.assign(usersListsParams, sharedParams)

    if (!sharedParams.q) {
      delete myListsParams.q
      delete usersListsParams.q
    }
  }

  async function refetch(segment: ListSegment): Promise<void> {
    syncParams()

    if (segment === 'myLists') {
      await fetchMyLists({
        params: { ...myListsParams },
      })

      return
    }

    await fetchUsersLists({
      params: { ...usersListsParams },
    })
  }

  async function resetFilters(segment: ListSegment): Promise<void> {
    filtering.value = ''
    sorting.value = createDefaultSorting()

    await refetch(segment)
  }

  return {
    myLists,
    usersLists,

    myListsLoading,
    usersListsLoading,

    filtering,
    sorting,

    myListsParams,
    usersListsParams,

    myListsCacheKey,

    fetchMyLists,
    fetchUsersLists,
    refetch,
    resetFilters,
  }
})
