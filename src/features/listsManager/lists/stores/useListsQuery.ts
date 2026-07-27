import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import { cleanEmptyKeys } from '@/shared/utils'
import { listsApi } from '../api'
import { SORTING_LABEL_KEYS } from '../constants/sortingOptions'
import type { SortingOption, ListSegment } from '../types/lists'

export const useListsQuery = defineStore('lists-query', () => {
  const { t, locale } = useI18n()
  const { getLists } = listsApi()

  const createDefaultSorting = (): SortingOption => ({
    id: 'recently-updated',
    label: t(SORTING_LABEL_KEYS['recently-updated']!),
    value: 'desc',
    sortCategory: 'createdAt',
  })

  const filtering = ref('')
  const sorting = ref<SortingOption>(createDefaultSorting())

  watch(locale, () => {
    const labelKey = SORTING_LABEL_KEYS[sorting.value.id]

    if (labelKey) {
      sorting.value = { ...sorting.value, label: t(labelKey) }
    }
  })

  const { data: lists, loading: listsLoading, execute: fetchLists, cacheKey } = getLists()

  const myListsCacheKey = ref<string | null>(null)
  const usersListsCacheKey = ref<string | null>(null)

  function buildParams(segment: ListSegment) {
    const sharedParams = cleanEmptyKeys({
      sort: sorting.value.sortCategory,
      order: sorting.value.value,
      q: filtering.value,
    })

    return segment === 'myLists' ? { ...sharedParams, isOwn: true } : { ...sharedParams }
  }

  async function refetch(segment: ListSegment): Promise<void> {
    if (segment === 'myLists') {
      await fetchLists({
        params: buildParams(segment),
        cache: { staleTime: Number.MAX_SAFE_INTEGER },
      })
      myListsCacheKey.value = cacheKey.value

      return
    }

    await fetchLists({ params: buildParams(segment), cache: false })
    usersListsCacheKey.value = cacheKey.value
  }

  async function resetFilters(segment: ListSegment): Promise<void> {
    filtering.value = ''
    sorting.value = createDefaultSorting()

    await refetch(segment)
  }

  return {
    lists,
    listsLoading,
    filtering,
    sorting,

    myListsCacheKey,
    usersListsCacheKey,

    refetch,
    resetFilters,
  }
})
