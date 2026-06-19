import { defineStore } from 'pinia'
import { computed } from 'vue'
import { tokenManager } from '@ametie/vue-muza-use'
import useUserRequest from '../api/useUserRequest'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const { fetchLogoutUser, fetchUserMe } = useUserRequest()
  const router = useRouter()

  const isAuthenticated = computed(() => !!userState.value)

  const {
    error: fetchUserError,
    loading: fetchUserLoading,
    execute: executeUser,
    data: userState,
  } = fetchUserMe()

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
    if (!isAuthenticated) executeUser()
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
    initAuth,
    clearUser,
    logout,
    executeUser,
  }
})
