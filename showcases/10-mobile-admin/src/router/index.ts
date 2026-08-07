import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import TasksPage from '../pages/TasksPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/tasks', name: 'tasks', component: TasksPage, meta: { title: 'Tasks' } },
    { path: '/profile', name: 'profile', component: ProfilePage, meta: { title: 'Profile' } }
  ]
})

export default router
