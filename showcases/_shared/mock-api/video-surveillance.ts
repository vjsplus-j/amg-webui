export interface VideoTreeNode {
  id: string
  label: string
  type: 'site' | 'nvr' | 'camera'
  children?: number
  status: 'online' | 'offline' | 'partial'
}

export interface VideoChannel {
  id: string
  name: string
  site: string
  resolution: string
  codec: string
  status: 'live' | 'idle' | 'offline'
  bitrate: string
}

export interface VideoStreamInfo {
  channelId: string
  protocol: string
  url: string
  latency: string
  fps: number
  keyframe: string
  packetsLost: number
}

export interface VideoRecording {
  id: string
  channel: string
  start: string
  end: string
  size: string
  type: 'continuous' | 'event' | 'manual'
  status: 'ready' | 'recording' | 'archived'
}

export interface VideoAlarm {
  id: string
  channel: string
  type: string
  time: string
  status: 'new' | 'reviewed' | 'dismissed'
}

export interface VideoSnapshot {
  id: string
  channel: string
  capturedAt: string
  size: string
}

export const mockVideoTree: VideoTreeNode[] = [
  { id: 'site1', label: 'HQ Campus', type: 'site', children: 2, status: 'online' },
  { id: 'nvr1', label: 'NVR-East-01', type: 'nvr', children: 4, status: 'online' },
  { id: 'cam1', label: 'Lobby Cam', type: 'camera', status: 'online' },
  { id: 'cam2', label: 'Parking A', type: 'camera', status: 'online' },
  { id: 'cam3', label: 'Gate PTZ', type: 'camera', status: 'offline' },
  { id: 'site2', label: 'Warehouse', type: 'site', children: 1, status: 'partial' },
  { id: 'nvr2', label: 'NVR-West-02', type: 'nvr', children: 2, status: 'offline' }
]

export const mockVideoChannels: VideoChannel[] = [
  { id: 'ch1', name: 'Lobby Cam', site: 'HQ Campus', resolution: '1920×1080', codec: 'H.265', status: 'live', bitrate: '2.4 Mbps' },
  { id: 'ch2', name: 'Parking A', site: 'HQ Campus', resolution: '1920×1080', codec: 'H.264', status: 'live', bitrate: '1.8 Mbps' },
  { id: 'ch3', name: 'Gate PTZ', site: 'HQ Campus', resolution: '2560×1440', codec: 'H.265', status: 'offline', bitrate: '—' },
  { id: 'ch4', name: 'Warehouse A1', site: 'Warehouse', resolution: '1280×720', codec: 'H.264', status: 'idle', bitrate: '0.8 Mbps' },
  { id: 'ch5', name: 'Loading Dock', site: 'Warehouse', resolution: '1920×1080', codec: 'H.265', status: 'live', bitrate: '2.1 Mbps' },
  { id: 'ch6', name: 'Reception', site: 'HQ Campus', resolution: '1920×1080', codec: 'H.264', status: 'idle', bitrate: '1.2 Mbps' }
]

export const mockVideoStreamInfo: VideoStreamInfo = {
  channelId: 'ch1',
  protocol: 'WebRTC / RTSP fallback',
  url: 'rtsp://192.168.10.21:554/stream1',
  latency: '420 ms',
  fps: 25,
  keyframe: '2.0 s',
  packetsLost: 3
}

export const mockVideoRecordings: VideoRecording[] = [
  { id: 'rec1', channel: 'Lobby Cam', start: '2026-08-08T00:00:00Z', end: '2026-08-08T01:00:00Z', size: '1.2 GB', type: 'continuous', status: 'ready' },
  { id: 'rec2', channel: 'Parking A', start: '2026-08-07T22:15:00Z', end: '2026-08-07T22:20:00Z', size: '84 MB', type: 'event', status: 'ready' },
  { id: 'rec3', channel: 'Gate PTZ', start: '2026-08-08T00:30:00Z', end: '—', size: '—', type: 'manual', status: 'recording' },
  { id: 'rec4', channel: 'Warehouse A1', start: '2026-08-01T00:00:00Z', end: '2026-08-01T23:59:00Z', size: '8.4 GB', type: 'continuous', status: 'archived' }
]

export const mockVideoAlarms: VideoAlarm[] = [
  { id: 'va1', channel: 'Parking A', type: 'Motion detected', time: '2026-08-08T00:42:00Z', status: 'new' },
  { id: 'va2', channel: 'Gate PTZ', type: 'Camera offline', time: '2026-08-07T23:10:00Z', status: 'reviewed' },
  { id: 'va3', channel: 'Loading Dock', type: 'Intrusion zone', time: '2026-08-07T21:05:00Z', status: 'dismissed' },
  { id: 'va4', channel: 'Lobby Cam', type: 'Tamper alert', time: '2026-08-07T18:30:00Z', status: 'reviewed' }
]

export const mockVideoSnapshots: VideoSnapshot[] = [
  { id: 'snap1', channel: 'Lobby Cam', capturedAt: '2026-08-08T00:50:00Z', size: '420 KB' },
  { id: 'snap2', channel: 'Parking A', capturedAt: '2026-08-08T00:42:05Z', size: '380 KB' },
  { id: 'snap3', channel: 'Loading Dock', capturedAt: '2026-08-07T21:05:10Z', size: '510 KB' }
]

export const mockVideoOverview = {
  liveChannels: mockVideoChannels.filter((c) => c.status === 'live').length,
  offlineChannels: mockVideoChannels.filter((c) => c.status === 'offline').length,
  newAlarms: mockVideoAlarms.filter((a) => a.status === 'new').length,
  activeRecordings: mockVideoRecordings.filter((r) => r.status === 'recording').length
}
