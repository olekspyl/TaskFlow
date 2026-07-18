export type ListRequest = {
  title: string
  deadline: string
  hexColor: string
}

type User = {
  id: string
  email: string
  name: string
  role: string
}

type TaskItem = {
  id: string
  title: string
  status: string
  isWeeklyGoal: boolean
}

export type ListItem = {
  id: string
  title: string
  owner: User
  deadline: string
  hexColor: string
  createdAt: string
  updatedAt: string
  totalTasks: number
  completedTasks: number
  tasks: TaskItem[]
}

export type Pagination = {
  total: number
  limit: number
  offset: number
  hasMore: boolean
  currentPage: number
  totalPages: number
}

export type ListsResponse = {
  data: ListItem[]
  pagination: Pagination
}

export type CreateListRequest = ListRequest
export type CreateListResponse = ListItem

export type ListByIdResponse = ListItem

export type UpdateListRequest = ListRequest
export type UpdateListResponse = ListItem

export type DeleteListResponse = void

export enum ListActions {
  EDIT_LIST = 'Edit List',
  DELETE_LIST = 'Delete List',
}

export type ListSegment = 'myLists' | 'usersLists'

export type SortingOption = {
  label: string
  value: 'asc' | 'desc'
  sortCategory: string
}
