import { PermsTypes } from '@/shared/types'

export const ACTION_ORDER = ['read', 'create', 'update', 'delete', 'manage', 'admin']

export const getPermissionActions = (rows: PermsTypes.PermissionRow[]) => {
  const actions = new Set<string>()

  rows.forEach((row) => {
    Object.keys(row.actions).forEach((action) => {
      actions.add(action)
    })
  })

  return ACTION_ORDER.filter((action) => actions.has(action))
}
