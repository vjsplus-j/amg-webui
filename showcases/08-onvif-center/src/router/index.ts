import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ManagePage from '../pages/ManagePage.vue'
import AboutPage from '../pages/AboutPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    {
      path: '/manage',
      name: 'manage',
      component: ManagePage,
      meta: { title: 'ONVIF Devices' }
    },
    { path: '/about', name: 'about', component: AboutPage }
  ]
})

export default router
