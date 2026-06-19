import { useUserStore } from '@/shared/stores'
import { tokenManager } from '@ametie/vue-muza-use'
import type { RouteLocationNormalized } from 'vue-router'
import { routerTypes } from '@/shared/types'

export const routesGuard = async (
  to: RouteLocationNormalized,
): Promise<{ name: string } | void> => {
  const userStore = useUserStore()
  const token = tokenManager.getAccessToken()

  const isLoginRoute = to.name === routerTypes.RouteNames.LOGIN

  if (!token) {
    if (!isLoginRoute) {
      return { name: routerTypes.RouteNames.LOGIN }
    }

    return
  }

  await userStore.initAuth()

  if (isLoginRoute) {
    return { name: routerTypes.RouteNames.DASHBOARD }
  }
}
