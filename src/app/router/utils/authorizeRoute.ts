import type { RouteLocationNormalized, RouteLocationRaw, RouteRecordName } from 'vue-router'
import { tokenManager } from '@ametie/vue-muza-use'

import { routerTypes } from '@/shared/types'

interface Params {
  to: RouteLocationNormalized
  initAuth: () => Promise<void>
  resetHeader: () => void
  getFirstAvailableRouteName: () => RouteRecordName | undefined
}

export const authorizeRoute = async ({
  to,
  initAuth,
  resetHeader,
  getFirstAvailableRouteName,
}: Params): Promise<RouteLocationRaw | undefined> => {
  const token = tokenManager.getAccessToken()

  const isLoginRoute = to.name === routerTypes.RouteNames.LOGIN

  if (!token) {
    resetHeader()

    if (!isLoginRoute) {
      return {
        name: routerTypes.RouteNames.LOGIN,
      }
    }

    return undefined
  }

  await initAuth()

  const isRootRoute = to.name === routerTypes.RouteNames.ROOT

  if (!isRootRoute) {
    return undefined
  }

  const firstAvailableRouteName = getFirstAvailableRouteName()

  return {
    name: firstAvailableRouteName ?? routerTypes.RouteNames.PROFILE,
  }
}
