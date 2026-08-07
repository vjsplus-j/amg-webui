import { createRouter, createWebHistory } from 'vue-router'
import OverviewPage from '../pages/OverviewPage.vue'
import ArticlesPage from '../pages/ArticlesPage.vue'
import CategoriesPage from '../pages/CategoriesPage.vue'
import TagsPage from '../pages/TagsPage.vue'
import DraftsPage from '../pages/DraftsPage.vue'
import PublishPage from '../pages/PublishPage.vue'
import MediaPage from '../pages/MediaPage.vue'
import EditorPage from '../pages/EditorPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'overview', component: OverviewPage },
    { path: '/articles', name: 'articles', component: ArticlesPage, meta: { title: 'Articles' } },
    { path: '/categories', name: 'categories', component: CategoriesPage, meta: { title: 'Categories' } },
    { path: '/tags', name: 'tags', component: TagsPage, meta: { title: 'Tags' } },
    { path: '/drafts', name: 'drafts', component: DraftsPage, meta: { title: 'Drafts' } },
    { path: '/publish', name: 'publish', component: PublishPage, meta: { title: 'Publish' } },
    { path: '/media', name: 'media', component: MediaPage, meta: { title: 'Media' } },
    { path: '/editor', name: 'editor', component: EditorPage, meta: { title: 'Editor' } }
  ]
})

export default router
