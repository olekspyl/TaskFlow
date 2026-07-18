import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router'

import { routerTypes } from '@/shared/types'

type Permission = NonNullable<RouteLocationNormalized['meta']['permission']>

interface Params {
  to: RouteLocationNormalized
  canRead: (permission: Permission) => boolean
}

export const checkRouteAccess = ({ to, canRead }: Params): RouteLocationRaw | undefined => {
  const requiredReadPermission = to.meta.permission

  if (requiredReadPermission && !canRead(requiredReadPermission)) {
    return {
      name: routerTypes.RouteNames.ROOT,
    }
  }

  return undefined
}
