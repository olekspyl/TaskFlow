import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { selectTypes } from '@/shared/types'
import { PermsTypes } from '@/shared/types'
import { getNormalizedRouteId } from '@/shared/utils'
import { usersApi } from '@/features/users/api'
import {
  createPermissionRowsFromGroups,
  permissionsGroup,
  initPermissions,
  setPermissionsValueUtil,
  getRowPermissions,
  getPermissionActions,
  createUserDefaultsMap,
  resetRowToDefaults,
  lockPermissionRow,
  unlockPermissionRow,
  unlockAllPermissionRows,
  isPermissionRowLocked,
} from '@/features/users/utils'

export const usePermissions = () => {
  const { t } = useI18n()

  const getRoleLabel = (role: string): string => {
    return role === 'admin' || role === 'user'
      ? t(`users.roles.${role}`)
      : role.charAt(0).toUpperCase() + role.slice(1)
  }

  const userPermissions = ref<Record<string, boolean>>({})
  const allPerm = ref(false)
  const selectedRole = ref<selectTypes.Option>({ label: getRoleLabel('user'), value: 'user' })
  const baseRole = ref<PermsTypes.Roles>()
  const adminLockedRows = ref<Record<string, boolean>>({})
  const permissionRows = computed<PermsTypes.PermissionRow[]>(() =>
    createPermissionRowsFromGroups(permissionsGroup.value),
  )

  const { fetchUserById, getDefaultPermissionsByRoles, getPermissionsList } = usersApi()

  const {
    loading: getUserLoading,
    data: userData,
    execute: refetchUser,
  } = fetchUserById(getNormalizedRouteId(), {
    immediate: true,
    onSuccess: () => {
      if (!userData.value) return
      const role = userData.value.role
      selectedRole.value = {
        label: role ? getRoleLabel(role) : '',
        value: role,
      }
      baseRole.value = role
      executeGetPermissions()
    },
  })

  const {
    execute: executeGetRolesPerm,
    data: permissionsByRoles,
    loading: getRolesPermissionsLoading,
  } = getDefaultPermissionsByRoles({
    immediate: true,
    cache: { id: 'defaultPermissionsByRole', staleTime: 100_000, swr: true },
  })

  const { execute: executeGetPermissions, data: allPermissions } = getPermissionsList({
    cache: { id: 'allPermissions', staleTime: 100_000, swr: true },
    onSuccess: () => {
      initPermissions(userData.value, allPermissions.value, userPermissions)
    },
  })

  const setPermissionsValue = (permissionList: string[], value: boolean) => {
    userPermissions.value = setPermissionsValueUtil(userPermissions.value, permissionList, value)
  }

  const getUserDefaultsMap = async () => {
    if (!permissionsByRoles.value) {
      await executeGetRolesPerm()
    }

    return createUserDefaultsMap(allPermissions.value ?? undefined, permissionsByRoles.value?.USER)
  }

  const applyUserRoleDefaults = async () => {
    userPermissions.value = await getUserDefaultsMap()
    allPerm.value = false
  }

  const resetRowToUserDefaults = async (row: PermsTypes.PermissionRow) => {
    const userDefaultsMap = await getUserDefaultsMap()

    userPermissions.value = resetRowToDefaults(userPermissions.value, row, userDefaultsMap)
  }

  const isPermissionGroupChecked = (
    row: PermsTypes.PermissionRow,
    action: PermsTypes.PermissionAction,
  ) => {
    const permissions = row.actions[action] ?? []

    if (!permissions.length) return false

    return permissions.every((permission) => userPermissions.value[permission])
  }

  const togglePermissionGroup = async (
    row: PermsTypes.PermissionRow,
    action: PermsTypes.PermissionAction,
    value: boolean,
  ) => {
    if (action === 'admin') {
      if (value) {
        setPermissionsValue(getRowPermissions(row), true)

        adminLockedRows.value = lockPermissionRow(adminLockedRows.value, row)

        return
      }

      await resetRowToUserDefaults(row)

      adminLockedRows.value = unlockPermissionRow(adminLockedRows.value, row)

      return
    }

    const actionPermissions = row.actions[action] ?? []

    setPermissionsValue(actionPermissions, value)

    if (action !== 'read' && value) {
      setPermissionsValue(row.actions.read ?? [], true)
    }

    if (action === 'read' && !value) {
      const permissionsToDisable = Object.entries(row.actions)
        .filter(([actionName]) => actionName !== 'read' && actionName !== 'admin')
        .flatMap(([, permissions]) => permissions)

      setPermissionsValue(permissionsToDisable, false)
    }
  }

  const unlockAllRows = () => {
    adminLockedRows.value = unlockAllPermissionRows()
  }

  const selectAllPerm = () => {
    setPermissionsValue(Object.keys(userPermissions.value), true)
  }

  const onAllPermUpdate = async (value: boolean) => {
    allPerm.value = value

    if (value) {
      selectAllPerm()
      return
    }

    await applyUserRoleDefaults()
  }

  const permissionActions = computed<string[]>(() => getPermissionActions(permissionRows.value))

  const applyRolePermissions = async () => {
    if (selectedRole.value.value === 'admin') {
      allPerm.value = true
      selectAllPerm()
      return
    }

    allPerm.value = false
    unlockAllRows()
    await applyUserRoleDefaults()
  }

  const isRowAdminLocked = (row: PermsTypes.PermissionRow) => {
    return isPermissionRowLocked(adminLockedRows.value, row)
  }

  return {
    permissionsGroup,
    permissionRows,
    userPermissions,
    getUserLoading,
    permissionsByRoles,
    userData,
    allPerm,
    baseRole,
    selectedRole,
    getRolesPermissionsLoading,
    permissionActions,
    refetchUser,
    applyRolePermissions,
    isPermissionGroupChecked,
    togglePermissionGroup,
    getRowPermissions,
    onAllPermUpdate,
    isRowAdminLocked,
  }
}
