import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import { tokenManager } from '@ametie/vue-muza-use'
import { useAuthUser } from '@/shared/api'
import { PermsTypes } from '@/shared/types'
import { routerTypes } from '../types'

export const useUserStore = defineStore('user', () => {
  const { fetchLogoutUser, fetchUserMe } = useAuthUser()
  const router = useRouter()

  const isAuthenticated = computed(() => !!userState.value)
  const role = ref<PermsTypes.Roles>()
  const perms = ref<string[]>([])
  const userName = ref('')

  const initialRouteName = computed(() => {
    if (role.value === 'admin') {
      return routerTypes.RouteNames.USERS
    }
    // може бути 0 пермішінв, пернести
    const firstReadPerm = perms.value.find((perm) => perm.startsWith('read:'))
    const page = firstReadPerm?.split(':')[1]

    const routesByPerm: Record<string, routerTypes.RouteNames> = {
      list: routerTypes.RouteNames.LISTS,
      dashboard: routerTypes.RouteNames.DASHBOARD,
      analytics: routerTypes.RouteNames.ANALYTICS,
    }

    return routesByPerm[page || ''] || routerTypes.RouteNames.PROFILE
  })

  const canRead = (permission: string) => {
    if (role.value === 'admin') return true
    return perms.value?.includes(permission) ?? false
  }

  const {
    error: fetchUserError,
    loading: fetchUserLoading,
    execute: executeUser,
    data: userState,
  } = fetchUserMe({
    onSuccess: () => {
      role.value = userState.value?.role
      perms.value = userState.value?.permissions ?? []
      userName.value = userState.value?.name ?? ''
    },
  })

  const {
    error: logoutError,
    loading: logoutLoading,
    execute: executeLogout,
  } = fetchLogoutUser({
    method: 'POST',
    onSuccess: async () => {
      clearUser()
      await router.push('/auth')
    },
    onError: () => {
      clearUser()
    },
  })

  async function initAuth() {
    if (!isAuthenticated.value) {
      await executeUser()
    }
  }

  function clearUser() {
    userState.value = null
    tokenManager.clearTokens()
  }

  async function logout() {
    executeLogout()
  }

  return {
    userState,
    fetchUserError,
    fetchUserLoading,
    logoutError,
    logoutLoading,
    isAuthenticated,
    role,
    perms,
    userName,
    initialRouteName,
    canRead,
    initAuth,
    clearUser,
    logout,
    executeUser,
  }
})
