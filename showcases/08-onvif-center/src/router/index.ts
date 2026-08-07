import { createRouter, createWebHistory } from 'vue-router'
import DiscoveryPage from '../pages/DiscoveryPage.vue'
import DevicesPage from '../pages/DevicesPage.vue'
import ProfilesPage from '../pages/ProfilesPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'discovery', component: DiscoveryPage },
    { path: '/devices', name: 'devices', component: DevicesPage, meta: { title: 'Devices' } },
    { path: '/profiles', name: 'profiles', component: ProfilesPage, meta: { title: 'Profiles' } }
  ]
})

export default router
