import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from '../pages/DashboardPage.vue'
import UsersPage from '../pages/UsersPage.vue'
import SettingsPage from '../pages/SettingsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardPage },
    { path: '/users', name: 'users', component: UsersPage, meta: { title: 'Users' } },
    { path: '/settings', name: 'settings', component: SettingsPage, meta: { title: 'Settings' } }
  ]
})

export default router
