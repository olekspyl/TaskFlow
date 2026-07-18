import type { RouteRecordName } from 'vue-router'

import type { NavigationTypes } from '@/shared/types'

interface Params {
  navItems: NavigationTypes.NavItem[]
  isAdmin: boolean
  canRead: (permission: string) => boolean
}

export const getFirstAvailableRoute = ({
  navItems,
  isAdmin,
  canRead,
}: Params): RouteRecordName | undefined => {
  return navItems.find((item) => {
    if (item.adminOnly) {
      return isAdmin
    }

    if (item.permission) {
      return canRead(item.permission)
    }

    return true
  })?.to
}
