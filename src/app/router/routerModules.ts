import { Auth, Dashboard, NotFound, Users, UserPermissions } from '@/pages'
import { routerTypes } from '@/shared/types'
import type { RouteRecordRaw, RouteMeta } from 'vue-router'
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: RouteMeta
  children?: AppRouteRecordRaw[]
}

const routerModules: Array<AppRouteRecordRaw> = [
  {
    path: '/',
    name: routerTypes.RouteNames.ROOT,
  },
  {
    path: '/dashboard',
    name: routerTypes.RouteNames.DASHBOARD,
    component: Dashboard,
  },
  {
    path: '/users',
    name: routerTypes.RouteNames.USERS,
    component: Users,
  },
  {
    path: '/users/:id',
    name: routerTypes.RouteNames.USER_DETAILS,
    component: UserPermissions,
  },
  {
    path: '/auth',
    name: routerTypes.RouteNames.LOGIN,
    component: Auth,
    meta: { layout: routerTypes.RouteLayouts.AUTH },
  },
  {
    path: '/:pathMatch(.*)*',
    name: routerTypes.RouteNames.NOT_FOUND,
    component: NotFound,
    meta: { title: 'Not Found' },
  },
]

export default routerModules as Array<RouteRecordRaw>
