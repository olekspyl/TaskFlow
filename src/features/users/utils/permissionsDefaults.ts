import { PermsTypes } from '@/shared/types'
import { createPermissionsMap } from './permissionsMap'
import { getRowPermissions } from './permissionsRows'

export const createUserDefaultsMap = (
  allPermissions: PermsTypes.PermissionItem[] = [],
  userDefaults: string[] = [],
) => {
  return createPermissionsMap(allPermissions, userDefaults)
}

export const resetRowToDefaults = (
  currentPermissions: Record<string, boolean>,
  row: PermsTypes.PermissionRow,
  defaultsMap: Record<string, boolean>,
) => {
  return {
    ...currentPermissions,
    ...getRowPermissions(row).reduce(
      (acc, permission) => {
        acc[permission] = defaultsMap[permission] ?? false
        return acc
      },
      {} as Record<string, boolean>,
    ),
  }
}
