import { createRouter, createWebHistory } from 'vue-router'
import { routes, resolveRouteTitle } from './routes'
import { useAuth } from '../stores/auth'
import { LocaleService } from '@amg-webui/locale'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const { isAuthenticated, init } = useAuth()
  init()

  const isPublic = Boolean(to.meta.public)
  const needsAuth = to.matched.some((r) => r.meta.requiresAuth)

  if (needsAuth && !isAuthenticated.value) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  if (isPublic && isAuthenticated.value && (to.name === 'login' || to.name === 'register')) {
    return { name: 'dashboard' }
  }

  return true
})

function applyDocumentTitle(to = router.currentRoute.value) {
  const comp =
    to.name === 'base-component' ? String(to.params.name ?? '') : undefined
  const title = resolveRouteTitle(to.meta, LocaleService.t.bind(LocaleService), comp)
  document.title = title ? `${title} · AMG-WebUI` : 'AMG-WebUI'
}

router.afterEach((to) => {
  applyDocumentTitle(to)
})

LocaleService.subscribe(() => {
  applyDocumentTitle()
})

export default router
