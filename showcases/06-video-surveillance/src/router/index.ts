import { createRouter, createWebHistory } from 'vue-router'
import OverviewPage from '../pages/OverviewPage.vue'
import DeviceTreePage from '../pages/DeviceTreePage.vue'
import VideoGridPage from '../pages/VideoGridPage.vue'
import PlayerPage from '../pages/PlayerPage.vue'
import StreamInfoPage from '../pages/StreamInfoPage.vue'
import PTZPage from '../pages/PTZPage.vue'
import SnapshotPage from '../pages/SnapshotPage.vue'
import RecordingPage from '../pages/RecordingPage.vue'
import AlarmsPage from '../pages/AlarmsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'overview', component: OverviewPage },
    { path: '/devices', name: 'devices', component: DeviceTreePage, meta: { title: 'Device Tree' } },
    { path: '/grid', name: 'grid', component: VideoGridPage, meta: { title: 'Video Grid' } },
    { path: '/player', name: 'player', component: PlayerPage, meta: { title: 'Player' } },
    { path: '/stream', name: 'stream', component: StreamInfoPage, meta: { title: 'Stream Info' } },
    { path: '/ptz', name: 'ptz', component: PTZPage, meta: { title: 'PTZ' } },
    { path: '/snapshot', name: 'snapshot', component: SnapshotPage, meta: { title: 'Snapshot' } },
    { path: '/recording', name: 'recording', component: RecordingPage, meta: { title: 'Recording' } },
    { path: '/alarms', name: 'alarms', component: AlarmsPage, meta: { title: 'Alarms' } }
  ]
})

export default router
