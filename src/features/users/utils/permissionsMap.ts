import { PermsTypes } from '@/shared/types'

export const setPermissionsValue = (
  currentPermissions: Record<string, boolean>,
  permissionList: string[],
  value: boolean,
) => {
  return {
    ...currentPermissions,
    ...permissionList.reduce(
      (acc, permission) => {
        acc[permission] = value
        return acc
      },
      {} as Record<string, boolean>,
    ),
  }
}

export const createPermissionsMap = (
  permissions: PermsTypes.PermissionItem[] = [],
  enabledPermissions: string[] = [],
) => {
  return permissions.reduce(
    (acc, permission) => {
      acc[permission.value] = enabledPermissions.includes(permission.value)
      return acc
    },
    {} as Record<string, boolean>,
  )
}
