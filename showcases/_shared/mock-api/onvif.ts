export type OnvifDiscoveryState = 'idle' | 'scanning' | 'done'

export interface OnvifDiscoveredDevice {
  id: string
  name: string
  ip: string
  port: number
  manufacturer: string
  model: string
  xaddrs: string
  discoveredAt: string
}

export interface OnvifDevice {
  id: string
  name: string
  ip: string
  port: number
  username: string
  profiles: number
  status: 'online' | 'offline' | 'auth-failed'
  firmware: string
  lastSeen: string
}

export interface OnvifProfile {
  id: string
  deviceId: string
  token: string
  name: string
  codec: string
  resolution: string
  fps: number
  bitrate: string
}

export const mockDiscoveredDevices: OnvifDiscoveredDevice[] = [
  {
    id: 'd1',
    name: 'ONVIF IPC 192.168.1.101',
    ip: '192.168.1.101',
    port: 80,
    manufacturer: 'Axis',
    model: 'P3245-V',
    xaddrs: 'http://192.168.1.101/onvif/device_service',
    discoveredAt: '2026-08-08T00:50:00Z'
  },
  {
    id: 'd2',
    name: 'ONVIF NVR 192.168.1.200',
    ip: '192.168.1.200',
    port: 8080,
    manufacturer: 'Hikvision',
    model: 'DS-7608NI',
    xaddrs: 'http://192.168.1.200/onvif/device_service',
    discoveredAt: '2026-08-08T00:50:02Z'
  }
]

export const mockOnvifDevices: OnvifDevice[] = [
  {
    id: '1',
    name: 'Axis Lobby',
    ip: '192.168.1.101',
    port: 80,
    username: 'admin',
    profiles: 3,
    status: 'online',
    firmware: '10.12.65',
    lastSeen: '2026-08-08T00:58:00Z'
  },
  {
    id: '2',
    name: 'Hik NVR Main',
    ip: '192.168.1.200',
    port: 8080,
    username: 'root',
    profiles: 8,
    status: 'online',
    firmware: 'V4.30.080',
    lastSeen: '2026-08-08T00:57:00Z'
  },
  {
    id: '3',
    name: 'Parking Cam',
    ip: '192.168.1.55',
    port: 80,
    username: 'admin',
    profiles: 2,
    status: 'auth-failed',
    firmware: '—',
    lastSeen: '2026-08-07T22:00:00Z'
  }
]

export const mockOnvifProfiles: OnvifProfile[] = [
  {
    id: '1',
    deviceId: '1',
    token: 'profile_1',
    name: 'MainStream',
    codec: 'H.264',
    resolution: '1920×1080',
    fps: 25,
    bitrate: '4 Mbps'
  },
  {
    id: '2',
    deviceId: '1',
    token: 'profile_2',
    name: 'SubStream',
    codec: 'H.264',
    resolution: '640×480',
    fps: 15,
    bitrate: '512 Kbps'
  },
  {
    id: '3',
    deviceId: '2',
    token: 'profile_1',
    name: 'Channel-01',
    codec: 'H.265',
    resolution: '2560×1440',
    fps: 20,
    bitrate: '6 Mbps'
  },
  {
    id: '4',
    deviceId: '2',
    token: 'profile_2',
    name: 'Channel-02',
    codec: 'H.265',
    resolution: '1920×1080',
    fps: 25,
    bitrate: '4 Mbps'
  }
]
