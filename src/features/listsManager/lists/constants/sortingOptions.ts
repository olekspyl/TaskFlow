import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SortingOption } from '../types/lists'

export const SORTING_LABEL_KEYS: Record<string, string> = {
  'recently-updated': 'lists.sorting.recentlyUpdated',
  'a-to-z': 'lists.sorting.aToZ',
  'z-to-a': 'lists.sorting.zToA',
}

export const SORTING_META: Record<string, Pick<SortingOption, 'value' | 'sortCategory'>> = {
  'recently-updated': { value: 'desc', sortCategory: 'createdAt' },
  'a-to-z': { value: 'asc', sortCategory: 'title' },
  'z-to-a': { value: 'desc', sortCategory: 'title' },
}

export const useSortingOptions = () => {
  const { t } = useI18n()

  const sortingOptions = computed<SortingOption[]>(() =>
    Object.entries(SORTING_META).map(([id, meta]) => ({
      id,
      label: t(SORTING_LABEL_KEYS[id]!),
      ...meta,
    })),
  )

  return { sortingOptions }
}
