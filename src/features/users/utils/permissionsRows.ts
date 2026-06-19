import { PermsTypes } from '@/features/users/types'

const ADMIN_ACTION = 'admin'

const getPermissionAction = (category: string, value: string) => {
  if (category.startsWith('all-')) {
    return ADMIN_ACTION
  }

  const [action] = value.split(':')

  return action
}

export const getRowPermissions = (row: PermsTypes.PermissionRow) => {
  return Object.values(row.actions).flat()
}

export const createPermissionRowsFromGroups = (
  groups: PermsTypes.PermissionsGroup,
): PermsTypes.PermissionRow[] => {
  return groups.map((group) => {
    const row: PermsTypes.PermissionRow = {
      id: String(group.title),
      module: String(group.title),
      actions: {},
    }

    group.items.forEach((permission) => {
      const action = getPermissionAction(permission.category, permission.value)

      if (!row.actions[action]) {
        row.actions[action] = []
      }

      row.actions[action].push(permission.value)
    })

    return row
  })
}
