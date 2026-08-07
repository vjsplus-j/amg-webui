import { createRouter, createWebHistory } from 'vue-router'
import OverviewPage from '../pages/OverviewPage.vue'
import TenantsPage from '../pages/TenantsPage.vue'
import OrganizationsPage from '../pages/OrganizationsPage.vue'
import MembersPage from '../pages/MembersPage.vue'
import SubscriptionsPage from '../pages/SubscriptionsPage.vue'
import PlansPage from '../pages/PlansPage.vue'
import UsagePage from '../pages/UsagePage.vue'
import BillingPage from '../pages/BillingPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'overview', component: OverviewPage },
    { path: '/tenants', name: 'tenants', component: TenantsPage, meta: { title: 'Tenants' } },
    { path: '/organizations', name: 'organizations', component: OrganizationsPage, meta: { title: 'Organizations' } },
    { path: '/members', name: 'members', component: MembersPage, meta: { title: 'Members' } },
    { path: '/subscriptions', name: 'subscriptions', component: SubscriptionsPage, meta: { title: 'Subscriptions' } },
    { path: '/plans', name: 'plans', component: PlansPage, meta: { title: 'Plans' } },
    { path: '/usage', name: 'usage', component: UsagePage, meta: { title: 'Usage' } },
    { path: '/billing', name: 'billing', component: BillingPage, meta: { title: 'Billing' } }
  ]
})

export default router
