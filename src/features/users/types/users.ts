import type { Roles } from '@/shared/types/permissions'

export type User = {
  id: string
  email: string
  name: string
  role: string
  permissions: string[]
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

type Pagination = {
  total: number
  limit: number
  offset: number
  hasMore: boolean
  currentPage: number
  totalPages: number
}

export type UsersResponse = {
  data: User[]
  pagination: Pagination
}

export type UserResponse = {
  id: string
  email: string
  name: string
  role: Roles
  permissions: string[]
  isAdmin: boolean
  createdAt: string
}

export enum UserActions {
  DELETE_USER = 'Remove',
  PROFILE_USER = 'Profile',
}
