import { createRouter, createWebHistory } from 'vue-router'
import OverviewPage from '../pages/OverviewPage.vue'
import ProductsPage from '../pages/ProductsPage.vue'
import SkusPage from '../pages/SkusPage.vue'
import OrdersPage from '../pages/OrdersPage.vue'
import OrderDetailPage from '../pages/OrderDetailPage.vue'
import CustomersPage from '../pages/CustomersPage.vue'
import InventoryPage from '../pages/InventoryPage.vue'
import PromotionsPage from '../pages/PromotionsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'overview', component: OverviewPage },
    { path: '/products', name: 'products', component: ProductsPage, meta: { title: 'Products' } },
    { path: '/skus', name: 'skus', component: SkusPage, meta: { title: 'SKU' } },
    { path: '/orders', name: 'orders', component: OrdersPage, meta: { title: 'Orders' } },
    { path: '/orders/:id', name: 'order-detail', component: OrderDetailPage, meta: { title: 'Order Detail' } },
    { path: '/customers', name: 'customers', component: CustomersPage, meta: { title: 'Customers' } },
    { path: '/inventory', name: 'inventory', component: InventoryPage, meta: { title: 'Inventory' } },
    { path: '/promotions', name: 'promotions', component: PromotionsPage, meta: { title: 'Promotions' } }
  ]
})

export default router
