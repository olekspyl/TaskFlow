import { routerTypes, NavigationTypes } from '@/shared/types'

export const navItems: NavigationTypes.NavItem[] = [
  {
    title: NavigationTypes.Navigation.DASHBOARD,
    img: 'lucide:home',
    to: routerTypes.RouteNames.DASHBOARD,
  },
  {
    title: NavigationTypes.Navigation.LISTS,
    img: 'lucide:list',
    to: routerTypes.RouteNames.LISTS,
    permission: 'read:list',
  },
  {
    title: NavigationTypes.Navigation.ANALYTICS,
    img: 'lucide:bar-chart-2',
    to: routerTypes.RouteNames.ANALYTICS,
    permission: 'read:analytics',
  },
  {
    title: NavigationTypes.Navigation.PROFILE,
    img: 'lucide:user',
    to: routerTypes.RouteNames.PROFILE,
  },
  {
    title: NavigationTypes.Navigation.ADMIN_PANEL,
    img: 'lucide:shield-check',
    to: routerTypes.RouteNames.USERS,
    adminOnly: true,
  },
]
