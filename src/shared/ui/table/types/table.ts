export type TableColumn = {
  key: string
  label: string
  actions?: string[]
  width: string
  sortable?: boolean
  backendName?: string
  separator?: boolean
}

export type SortOrder = 'asc' | 'desc'

export type SortingOptions = {
  sortBy: string
  sortOrder: SortOrder
}
