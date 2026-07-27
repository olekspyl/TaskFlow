import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/shared/composables'
import { getNormalizedRouteId } from '@/shared/utils'
import { usersApi } from '@/features/users/api'
import { formatPermissionsToArr } from '@/features/users/utils'
import { PermsTypes } from '@/shared/types'

type Params = {
  userPermissions: Ref<Record<string, boolean>>
  selectedRole: Ref<{ label: string; value: string }>
  baseRole: Ref<PermsTypes.Roles | undefined>
}

export const useSaveUserPermissions = ({ userPermissions, selectedRole, baseRole }: Params) => {
  const { t } = useI18n()
  const { showSuccess } = useToast()
  const { patchUserPermissions, patchUserRole } = usersApi()

  const { loading: patchPermissionsLoading, execute: executePatchPermissions } =
    patchUserPermissions(getNormalizedRouteId(), {
      lazy: true,
      data: () => formatPermissionsToArr(userPermissions.value),
      onSuccess: () => {
        showSuccess(t('users.toast.permissionsChanged'))
      },
    })

  const { loading: rolesLoading, execute: executeRoles } = patchUserRole(getNormalizedRouteId(), {
    lazy: true,
    data: () => ({ role: selectedRole.value.value }),
    onSuccess: () => {
      showSuccess(t('users.toast.roleChanged'))
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
