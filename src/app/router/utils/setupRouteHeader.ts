import type { RouteLocationNormalized } from 'vue-router'

import { HEADER_COMPONENTS } from '@/app/constants/header'

type RouteHeader = RouteLocationNormalized['meta']['header']

interface Params {
  to: RouteLocationNormalized
  reset: () => void
  setVisible: (header: RouteHeader) => void
}

export const setupRouteHeader = ({ to, reset, setVisible }: Params): void => {
  const usesDefaultLayout = !to.meta.layout

  const headerComponent = to.meta.header?.component ?? HEADER_COMPONENTS.DEFAULT

  const usesDefaultHeader = headerComponent === HEADER_COMPONENTS.DEFAULT

  if (!usesDefaultLayout || !usesDefaultHeader) {
    reset()
    return
  }

  setVisible(to.meta.header)
}
