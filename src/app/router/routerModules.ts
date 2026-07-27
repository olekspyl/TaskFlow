import type { RouteMeta, RouteRecordRaw } from 'vue-router'

import {
  Auth,
  Analytics,
  Dashboard,
  List,
  Lists,
  NotFound,
  Profile,
  UserPermissions,
  Users,
} from '@/pages'

import { HEADER_PARTS } from '@/app/constants/header'

import { routerTypes } from '@/shared/types'

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: RouteMeta
  children?: AppRouteRecordRaw[]
}

const modules: AppRouteRecordRaw[] = [
  {
    path: '/',
    name: routerTypes.RouteNames.ROOT,
    redirect: '/dashboard',
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
    meta: {
      header: {
        title: 'header.users',
      },
    },
  },

  {
    path: '/users/:id',
    name: routerTypes.RouteNames.USER_DETAILS,
    component: UserPermissions,
    meta: {
      header: {
        title: 'header.userDetails',
      },
    },
  },

  {
    path: '/lists',
    name: routerTypes.RouteNames.LISTS,
    component: Lists,
    meta: {
      permission: 'read:list',
      header: {
        title: 'lists.pageTitle',
        showExtra: [HEADER_PARTS.ACTIONS],
      },
    },
  },

  {
    path: '/lists/:id',
    name: routerTypes.RouteNames.LIST_DETAILS,
    component: List,
    meta: {
      header: {
        // Заголовок динамічний (назва конкретного списку) — ListDetail.vue
        // виставляє його через useHeaderParts().setTitleOverride().
        showExtra: [HEADER_PARTS.BACK, HEADER_PARTS.ACTIONS],
      },
    },
  },

  {
    path: '/analytics',
    name: routerTypes.RouteNames.ANALYTICS,
    component: Analytics,
    meta: {
      permission: 'read:analytics',
      header: {
        title: 'header.analytics',
        showExtra: [HEADER_PARTS.PERIOD],
      },
    },
  },

  {
    path: '/profile',
    name: routerTypes.RouteNames.PROFILE,
    component: Profile,
    meta: {
      header: {
        title: 'header.profile',
      },
    },
  },

  {
    path: '/auth',
    name: routerTypes.RouteNames.LOGIN,
    component: Auth,
    meta: {
      layout: routerTypes.RouteLayouts.AUTH,
    },
  },

  {
    path: '/:pathMatch(.*)*',
    name: routerTypes.RouteNames.NOT_FOUND,
    component: NotFound,
    meta: {
      header: {
        title: 'header.notFound',
      },
    },
  },
]

export const routerModules = modules as RouteRecordRaw[]
