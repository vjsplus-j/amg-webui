import { createRouter, createWebHistory } from 'vue-router'
import OverviewPage from '../pages/OverviewPage.vue'
import DevicesPage from '../pages/DevicesPage.vue'
import DeviceDetailPage from '../pages/DeviceDetailPage.vue'
import OnlineStatusPage from '../pages/OnlineStatusPage.vue'
import GroupsPage from '../pages/GroupsPage.vue'
import TelemetryPage from '../pages/TelemetryPage.vue'
import AlarmsPage from '../pages/AlarmsPage.vue'
import OperationsPage from '../pages/OperationsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'overview', component: OverviewPage },
    { path: '/devices', name: 'devices', component: DevicesPage, meta: { title: 'Devices' } },
    { path: '/devices/:id', name: 'device-detail', component: DeviceDetailPage, meta: { title: 'Device Detail' } },
    { path: '/online', name: 'online', component: OnlineStatusPage, meta: { title: 'Online Status' } },
    { path: '/groups', name: 'groups', component: GroupsPage, meta: { title: 'Groups' } },
    { path: '/telemetry', name: 'telemetry', component: TelemetryPage, meta: { title: 'Telemetry' } },
    { path: '/alarms', name: 'alarms', component: AlarmsPage, meta: { title: 'Alarms' } },
    { path: '/operations', name: 'operations', component: OperationsPage, meta: { title: 'Operations' } }
  ]
})

export default router
