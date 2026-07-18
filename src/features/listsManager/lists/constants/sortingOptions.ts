import type { SortingOption } from '../types/lists'

export const SORTING_OPTIONS: SortingOption[] = [
  {
    label: 'Recently updated',
    value: 'desc',
    sortCategory: 'createdAt',
  },
  {
    label: 'A -> Z',
    value: 'asc',
    sortCategory: 'title',
  },
  {
    label: 'Z -> A',
    value: 'desc',
    sortCategory: 'title',
  },
]

export const DEFAULT_SORTING = SORTING_OPTIONS[0]
