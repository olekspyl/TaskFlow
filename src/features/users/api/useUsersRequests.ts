import { useApi, useApiDelete, useApiPatch, type UseApiOptions } from '@ametie/vue-muza-use'
import { UsersTypes, PermsTypes } from '@/features/users/types'
import { toValue, type MaybeRefOrGetter } from 'vue'

export default () => {
  const fetchUsers = (options?: UseApiOptions<UsersTypes.UsersResponse>) => {
    return useApi('/users', options)
  }

  const fetchUserById = (
    id: MaybeRefOrGetter<string | null>,
    options?: UseApiOptions<UsersTypes.UserResponse>,
  ) => {
    return useApi(() => `/users/${toValue(id)}`, options)
  }

  const deleteUserById = (id: MaybeRefOrGetter<string | null>, options?: UseApiOptions) => {
    return useApiDelete(() => `/users/${toValue(id)}`, options)
  }

  const getDefaultPermissionsByRoles = (options?: UseApiOptions<PermsTypes.RolesPermissions>) => {
    return useApi(() => '/permissions/roles', options)
  }

  const getPermissionsList = (options?: UseApiOptions<Permissions>) => {
    return useApi(() => '/permissions', options)
  }

  const patchUserPermissions = (id: MaybeRefOrGetter<string | null>, options?: UseApiOptions) => {
    return useApiPatch(() => `/users/${toValue(id)}/permissions`, options)
  }

  const patchUserRole = (id: MaybeRefOrGetter<string | null>, options?: UseApiOptions) => {
    return useApiPatch(() => `/users/${toValue(id)}/role`, options)
  }

  return {
    fetchUsers,
    fetchUserById,
    deleteUserById,
    patchUserPermissions,
    patchUserRole,
    getDefaultPermissionsByRoles,
    getPermissionsList,
  }
}
