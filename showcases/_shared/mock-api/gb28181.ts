export type GbsDeviceStatus = 'online' | 'offline' | 'registering'

export interface GbsDevice {
  id: string
  deviceId: string
  name: string
  ip: string
  port: number
  manufacturer: string
  status: GbsDeviceStatus
  channelCount: number
  lastHeartbeat: string
}

export interface GbsChannel {
  id: string
  deviceId: string
  channelId: string
  name: string
  status: 'idle' | 'streaming' | 'offline'
  ptz: boolean
  resolution: string
}

export interface SipStatus {
  localId: string
  domain: string
  listenIp: string
  listenPort: number
  transport: 'UDP' | 'TCP'
  registeredDevices: number
  activeStreams: number
  uptime: string
}

export const mockSipStatus: SipStatus = {
  localId: '34020000002000000001',
  domain: '3402000000',
  listenIp: '192.168.1.10',
  listenPort: 5060,
  transport: 'UDP',
  registeredDevices: 12,
  activeStreams: 4,
  uptime: '3d 14h 22m'
}

export const mockGbsDevices: GbsDevice[] = [
  {
    id: '1',
    deviceId: '34020000001320000001',
    name: 'NVR-East-01',
    ip: '192.168.10.21',
    port: 5060,
    manufacturer: 'Hikvision',
    status: 'online',
    channelCount: 16,
    lastHeartbeat: '2026-08-08T00:58:00Z'
  },
  {
    id: '2',
    deviceId: '34020000001320000002',
    name: 'IPC-Gate-A',
    ip: '192.168.10.45',
    port: 5060,
    manufacturer: 'Dahua',
    status: 'online',
    channelCount: 1,
    lastHeartbeat: '2026-08-08T00:57:30Z'
  },
  {
    id: '3',
    deviceId: '34020000001320000003',
    name: 'IPC-Parking-03',
    ip: '192.168.10.88',
    port: 5060,
    manufacturer: 'Uniview',
    status: 'registering',
    channelCount: 1,
    lastHeartbeat: '2026-08-08T00:55:00Z'
  },
  {
    id: '4',
    deviceId: '34020000001320000004',
    name: 'NVR-West-02',
    ip: '192.168.20.12',
    port: 5060,
    manufacturer: 'Hikvision',
    status: 'offline',
    channelCount: 32,
    lastHeartbeat: '2026-08-07T18:12:00Z'
  }
]

export const mockGbsChannels: GbsChannel[] = [
  {
    id: '1',
    deviceId: '34020000001320000001',
    channelId: '34020000001320000001',
    name: 'Lobby Cam',
    status: 'streaming',
    ptz: false,
    resolution: '1920×1080'
  },
  {
    id: '2',
    deviceId: '34020000001320000001',
    channelId: '34020000001320000002',
    name: 'Reception PTZ',
    status: 'idle',
    ptz: true,
    resolution: '2560×1440'
  },
  {
    id: '3',
    deviceId: '34020000001320000002',
    channelId: '34020000001320000001',
    name: 'Gate Entry',
    status: 'streaming',
    ptz: false,
    resolution: '1920×1080'
  },
  {
    id: '4',
    deviceId: '34020000001320000004',
    channelId: '34020000001320000001',
    name: 'Warehouse A1',
    status: 'offline',
    ptz: false,
    resolution: '1280×720'
  }
]
