import { useToast } from '@/shared/composables'
import { getNormalizedRouteId } from '@/shared/utils'
import { useUsersRequests } from '@/features/users/api'
import { formatPermissionsToArr } from '@/features/users/utils'
import type { Ref } from 'vue'
import { PermsTypes } from '@/features/users/types'

type Params = {
  userPermissions: Ref<Record<string, boolean>>
  selectedRole: Ref<{ label: string; value: string }>
  baseRole: Ref<PermsTypes.Roles | undefined>
}

export const useSaveUserPermissions = ({ userPermissions, selectedRole, baseRole }: Params) => {
  const { showSuccess } = useToast()
  const { patchUserPermissions, patchUserRole } = useUsersRequests()

  const { loading: patchPermissionsLoading, execute: executePatchPermissions } =
    patchUserPermissions(getNormalizedRouteId(), {
      lazy: true,
      data: () => formatPermissionsToArr(userPermissions.value),
      onSuccess: () => {
        showSuccess('Permissions have changed')
      },
    })

  const { loading: rolesLoading, execute: executeRoles } = patchUserRole(getNormalizedRouteId(), {
    lazy: true,
    data: () => ({ role: selectedRole.value.value }),
    onSuccess: () => {
      showSuccess('Role has changed')
      baseRole.value = selectedRole.value.value as PermsTypes.Roles
      executePatchPermissions()
    },
  })

  const saveUserPermissions = () => {
    if (selectedRole.value.value !== baseRole.value) {
      executeRoles()
    } else {
      executePatchPermissions()
    }
  }

  return {
    patchPermissionsLoading,
    rolesLoading,
    saveUserPermissions,
  }
}
