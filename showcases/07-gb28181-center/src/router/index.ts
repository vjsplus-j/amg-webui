import { createRouter, createWebHistory } from 'vue-router'
import OverviewPage from '../pages/OverviewPage.vue'
import DevicesPage from '../pages/DevicesPage.vue'
import ChannelsPage from '../pages/ChannelsPage.vue'
import SipStatusPage from '../pages/SipStatusPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'overview', component: OverviewPage },
    { path: '/devices', name: 'devices', component: DevicesPage, meta: { title: 'Devices' } },
    { path: '/channels', name: 'channels', component: ChannelsPage, meta: { title: 'Channels' } },
    { path: '/sip', name: 'sip', component: SipStatusPage, meta: { title: 'SIP' } }
  ]
})

export default router
