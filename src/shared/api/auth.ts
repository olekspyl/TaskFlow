import { createApiClient } from '@ametie/vue-muza-use'

// add onresreshpayload + ontokenrefreshed + authmode (private routs by default)
const authApi = createApiClient({
  baseURL: import.meta.env.VITE_BASE_AUTH_URL,
  // ця властивість тільки для refresh token
  withCredentials: true,
  // withAuth: true, - default?
  authOptions: {
    refreshUrl: '/auth/refresh',
    onTokenRefreshFailed: () => {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    },
  },
})

export { authApi }
