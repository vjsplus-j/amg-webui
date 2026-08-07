import { createRouter, createWebHistory } from 'vue-router'
import AuditPage from '../pages/AuditPage.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import ErrorPage from '../pages/ErrorPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'
import OrganizationsPage from '../pages/OrganizationsPage.vue'
import PermissionsPage from '../pages/PermissionsPage.vue'
import RolesPage from '../pages/RolesPage.vue'
import SettingsPage from '../pages/SettingsPage.vue'
import UserCreatePage from '../pages/UserCreatePage.vue'
import UserEditPage from '../pages/UserEditPage.vue'
import UsersPage from '../pages/UsersPage.vue'
import { useAdminAuth } from '../composables/useAdminAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { layout: 'blank', public: true }
    },
    { path: '/', name: 'dashboard', component: DashboardPage, meta: { title: 'Dashboard' } },
    {
      path: '/users',
      name: 'users',
      component: UsersPage,
      meta: { title: 'Users', permission: 'users:read' }
    },
    {
      path: '/roles',
      name: 'roles',
      component: RolesPage,
      meta: { title: 'Roles', permission: 'roles:read' }
    },
    {
      path: '/permissions',
      name: 'permissions',
      component: PermissionsPage,
      meta: { title: 'Permissions', permission: 'roles:read' }
    },
    {
      path: '/organizations',
      name: 'organizations',
      component: OrganizationsPage,
      meta: { title: 'Organizations', permission: 'organizations:read' }
    },
    {
      path: '/audit',
      name: 'audit',
      component: AuditPage,
      meta: { title: 'Audit', permission: 'audit:read' }
    },
    {
      path: '/users/create',
      name: 'user-create',
      component: UserCreatePage,
      meta: { title: 'Create user', permission: 'users:write' }
    },
    {
      path: '/users/:id/edit',
      name: 'user-edit',
      component: UserEditPage,
      meta: { title: 'Edit user', permission: 'users:write' }
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
      meta: { title: 'Settings', permission: 'settings:read' }
    },
    {
      path: '/error',
      name: 'error',
      component: ErrorPage,
      meta: { title: 'Error' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
      meta: { title: 'Not found' }
    }
  ]
})

router.beforeEach((to) => {
  const { initFromStorage, isAuthenticated, hasPermission } = useAdminAuth()
  initFromStorage()
  if (to.meta.public) return true
  if (!isAuthenticated.value) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  const permission = to.meta.permission
  if (typeof permission === 'string' && !hasPermission(permission)) {
    return { path: '/', query: { denied: to.path } }
  }
  return true
})

export default router
