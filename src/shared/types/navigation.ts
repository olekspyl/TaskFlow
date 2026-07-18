import { routerTypes } from '@/shared/types'

export type NavItem = {
  img: string
  title?: string
  to?: routerTypes.RouteNames
  permission?: string
  adminOnly?: boolean
}

export enum Navigation {
  DASHBOARD = 'Dashboard',
  LISTS = 'Lists',
  ANALYTICS = 'Analytics',
  PROFILE = 'Profile',
  ADMIN_PANEL = 'Admin Panel',
}
