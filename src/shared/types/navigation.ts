import { routerTypes } from '@/shared/types'

export type NavItem = {
  img: string
  title?: string
  titleKey?: string
  to?: routerTypes.RouteNames
  permission?: string
  adminOnly?: boolean
}
