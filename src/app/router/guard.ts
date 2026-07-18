import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

import { navItems } from '@/shared/constants'
import { useHeaderParts } from '@/app/composables/useHeaderParts'
import { useUserStore } from '@/shared/stores'

import { authorizeRoute, checkRouteAccess, getFirstAvailableRoute, setupRouteHeader } from './utils'

export const routesGuard = async (
  to: RouteLocationNormalized,
): Promise<RouteLocationRaw | void> => {
  const userStore = useUserStore()
  const header = useHeaderParts()

  const authRedirect = await authorizeRoute({
    to,
    initAuth: userStore.initAuth,
    resetHeader: header.reset,
    getFirstAvailableRouteName: () =>
      getFirstAvailableRoute({
        navItems,
        isAdmin: userStore.role === 'admin',
        canRead: userStore.canRead,
      }),
  })

  if (authRedirect) {
    return authRedirect
  }

  const accessRedirect = checkRouteAccess({
    to,
    canRead: userStore.canRead,
  })

  if (accessRedirect) {
    return accessRedirect
  }

  setupRouteHeader({
    to,
    reset: header.reset,
    setVisible: header.setVisible,
  })
}
