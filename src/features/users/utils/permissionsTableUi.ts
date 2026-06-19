import { PermsTypes } from '@/features/users/types'
import { selectTypes } from '@/shared/types'

export const createPermissionColumns = (actions: string[]) => [
  {
    key: 'module',
    label: 'Module',
    width: '300px',
  },
  ...actions.map((action) => ({
    key: action,
    label: action.charAt(0).toUpperCase() + action.slice(1),
    width: '120px',
    separator: action === 'admin',
  })),
]

export const isPermissionCheckboxVisible = (
  row: PermsTypes.PermissionRow,
  action: PermsTypes.PermissionAction,
) => {
  return action === 'admin' || Boolean(row.actions[action]?.length)
}

export const isPermissionCheckboxDisabled = (
  role: selectTypes.Option,
  isRowAdminLocked: boolean,
  action: PermsTypes.PermissionAction,
) => {
  if (action === 'admin') return false

  return role.value === 'admin' || isRowAdminLocked
}

export const getPermissionCheckboxValue = (
  role: selectTypes.Option,
  isRowAdminLocked: boolean,
  isPermissionChecked: boolean,
  action: PermsTypes.PermissionAction,
) => {
  if (action === 'admin') {
    return role.value === 'admin' || isRowAdminLocked
  }

  return isPermissionChecked
}
