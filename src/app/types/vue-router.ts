import 'vue-router'

import type { HeaderComponentName, HeaderPart } from '@/app/constants/header'
import type { routerTypes } from '@/shared/types'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    permission?: string
    layout?: routerTypes.RouteLayouts

    header?: {
      title?: string
      showExtra?: readonly HeaderPart[]
      hide?: readonly HeaderPart[]
      component?: HeaderComponentName
    }
  }
}

export {}
