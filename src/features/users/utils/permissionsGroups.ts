import { ref } from 'vue'
import { PermsTypes } from '@/shared/types'

const { PermissionsSetTitle } = PermsTypes

export const permissionsGroup = ref<PermsTypes.PermissionsGroup>([
  {
    title: PermissionsSetTitle.LIST_PERMISSIONS,
    category: ['list', 'all-lists'],
    items: [],
  },
  {
    title: PermissionsSetTitle.USER_MANAGEMENT,
    category: ['users', 'user', 'roles', 'permissions'],
    items: [],
  },
  {
    title: PermissionsSetTitle.TASKS_PERMISSIONS,
    category: ['task', 'all-tasks'],
    items: [],
  },
  {
    title: PermissionsSetTitle.ANALYTICS,
    category: ['analytics'],
    items: [],
  },
  {
    title: PermissionsSetTitle.DASHBOARD,
    category: ['dashboard'],
    items: [],
  },
])

export const initPermissions = (userData, permissions, userPermissions) => {
  const result = permissions.reduce(
    (acc, perm) => {
      acc.permissionsMap[perm.value] = userData.permissions.includes(perm.value) ?? false

      acc.groups = acc.groups.map((group) => {
        if (group.category.includes(perm.category)) {
          return {
            ...group,
            items: [...group.items, perm],
          }
        }

        return group
      })

      return acc
    },
    {
      permissionsMap: {} as Record<string, boolean>,
      groups: permissionsGroup.value.map((group) => ({
        ...group,
        items: [],
      })),
    },
  )

  userPermissions.value = result?.permissionsMap ?? {}
  permissionsGroup.value = result?.groups ?? permissionsGroup.value
}
