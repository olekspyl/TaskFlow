import { createRouter, createWebHistory } from 'vue-router'
import routerModules from './routerModules'
import { routesGuard } from './guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routerModules,
})

router.beforeEach(routesGuard)

export default router
