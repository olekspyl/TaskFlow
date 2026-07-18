import { createRouter, createWebHistory } from 'vue-router'
import { routerModules, routesGuard } from '.'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routerModules,
})

router.beforeEach(routesGuard)
