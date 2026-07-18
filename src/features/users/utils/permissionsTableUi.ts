import { PermsTypes } from '@/shared/types'
import { selectTypes } from '@/shared/types'

const formatPermissionActionLabel = (action: PermsTypes.PermissionAction) => {
  return action.charAt(0).toUpperCase() + action.slice(1)
}

export const createPermissionColumns = (actions: PermsTypes.PermissionAction[]) => [
  {
    key: 'module',
    label: 'Module',
    width: '300px',
  },
  ...actions.map((action) => ({
    key: action,
    label: formatPermissionActionLabel(action),
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
