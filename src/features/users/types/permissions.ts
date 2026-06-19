export enum PermissionsSetTitle {
  LIST_PERMISSIONS = 'List Permissions',
  USER_MANAGEMENT = 'User Management',
  TASKS_PERMISSIONS = 'Tasks Permissions',
  ANALYTICS = 'Analytics',
  DASHBOARD = 'Dashboard',
}

export interface PermissionItem {
  key: string
  value: string
  category: string
  description: string
}

export type Permissions = PermissionItem[]

export type RolesPermissions = Record<string, string[]>

export type Roles = 'admin' | 'user'

export type PermissionsGroup = Array<{
  title: PermissionsSetTitle
  category: string[]
  items: PermissionItem[]
}>

export type PermissionAction = string

export type PermissionRow = {
  id: string
  module: string
  actions: Record<string, string[]>
}

export type PermissionColumnKey = 'module' | PermissionAction
