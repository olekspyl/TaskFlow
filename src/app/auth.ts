import { createApiClient, tokenManager } from '@ametie/vue-muza-use'
import { routerTypes } from '@/shared/types'
import { router } from './router'

const authApi = createApiClient({
  baseURL: import.meta.env.VITE_BASE_AUTH_URL,
  withAuth: true,
  authOptions: {
    refreshUrl: '/auth/refresh',
    refreshPayload: () => ({
      refreshToken: tokenManager.getRefreshToken(),
    }),
    onTokenRefreshFailed: () => {
      localStorage.removeItem('accessToken')
      router.replace({ name: routerTypes.RouteNames.LOGIN })
    },
  },
})

export { authApi }
