import { routerTypes, NavigationTypes } from '@/shared/types'

export const navItems: NavigationTypes.NavItem[] = [
  {
    titleKey: 'navigation.dashboard',
    img: 'lucide:home',
    to: routerTypes.RouteNames.DASHBOARD,
  },
  {
    titleKey: 'navigation.lists',
    img: 'lucide:list',
    to: routerTypes.RouteNames.LISTS,
    permission: 'read:list',
  },
  {
    titleKey: 'navigation.analytics',
    img: 'lucide:bar-chart-2',
    to: routerTypes.RouteNames.ANALYTICS,
    permission: 'read:analytics',
  },
  {
    titleKey: 'navigation.profile',
    img: 'lucide:user',
    to: routerTypes.RouteNames.PROFILE,
  },
  {
    titleKey: 'navigation.adminPanel',
    img: 'lucide:shield-check',
    to: routerTypes.RouteNames.USERS,
    adminOnly: true,
  },
]
