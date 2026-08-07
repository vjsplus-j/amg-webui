export type DeviceOnlineStatus = 'online' | 'offline' | 'sleep'

export interface IotDevice {
  id: string
  name: string
  model: string
  group: string
  firmware: string
  status: DeviceOnlineStatus
  lastSeen: string
}

export interface IotDeviceDetail extends IotDevice {
  serial: string
  ip: string
  location: string
  battery: number
  signal: number
  tags: string[]
}

export interface IotGroup {
  id: string
  name: string
  devices: number
  region: string
  status: 'active' | 'archived'
}

export interface IotTelemetry {
  id: string
  device: string
  metric: string
  value: string
  recordedAt: string
}

export interface IotAlarm {
  id: string
  device: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  raisedAt: string
  status: 'open' | 'acknowledged' | 'resolved'
}

export interface IotOperation {
  id: string
  device: string
  action: string
  operator: string
  startedAt: string
  status: 'success' | 'failed' | 'running'
}

export const mockIotDevices: IotDevice[] = [
  { id: 'dev1', name: 'Temp Sensor A1', model: 'TS-100', group: 'Warehouse', firmware: '1.4.2', status: 'online', lastSeen: '2026-08-08T00:55:00Z' },
  { id: 'dev2', name: 'Gateway Hub-01', model: 'GW-200', group: 'Warehouse', firmware: '2.1.0', status: 'online', lastSeen: '2026-08-08T00:58:00Z' },
  { id: 'dev3', name: 'Door Lock B3', model: 'DL-50', group: 'Office', firmware: '3.0.1', status: 'offline', lastSeen: '2026-08-07T22:10:00Z' },
  { id: 'dev4', name: 'Air Quality C2', model: 'AQ-80', group: 'Office', firmware: '1.2.8', status: 'online', lastSeen: '2026-08-08T00:57:00Z' },
  { id: 'dev5', name: 'Vibration D1', model: 'VB-10', group: 'Factory', firmware: '1.0.5', status: 'sleep', lastSeen: '2026-08-08T00:30:00Z' },
  { id: 'dev6', name: 'Power Meter E1', model: 'PM-300', group: 'Factory', firmware: '4.2.0', status: 'online', lastSeen: '2026-08-08T00:58:30Z' }
]

export const mockIotDeviceDetails: Record<string, IotDeviceDetail> = {
  dev1: {
    id: 'dev1',
    name: 'Temp Sensor A1',
    model: 'TS-100',
    group: 'Warehouse',
    firmware: '1.4.2',
    status: 'online',
    lastSeen: '2026-08-08T00:55:00Z',
    serial: 'SN-TS100-88421',
    ip: '192.168.50.21',
    location: 'Warehouse / Rack A',
    battery: 78,
    signal: -62,
    tags: ['temperature', 'cold-chain']
  },
  dev2: {
    id: 'dev2',
    name: 'Gateway Hub-01',
    model: 'GW-200',
    group: 'Warehouse',
    firmware: '2.1.0',
    status: 'online',
    lastSeen: '2026-08-08T00:58:00Z',
    serial: 'SN-GW200-00102',
    ip: '192.168.50.1',
    location: 'Warehouse / Main',
    battery: 100,
    signal: -48,
    tags: ['gateway', 'edge']
  }
}

export function getIotDeviceDetail(id: string): IotDeviceDetail | undefined {
  if (mockIotDeviceDetails[id]) return mockIotDeviceDetails[id]
  const base = mockIotDevices.find((d) => d.id === id)
  if (!base) return undefined
  return {
    ...base,
    serial: `SN-${id.toUpperCase()}`,
    ip: '—',
    location: '—',
    battery: 0,
    signal: 0,
    tags: []
  }
}

export const mockIotGroups: IotGroup[] = [
  { id: 'g1', name: 'Warehouse', devices: 24, region: 'East China', status: 'active' },
  { id: 'g2', name: 'Office', devices: 18, region: 'East China', status: 'active' },
  { id: 'g3', name: 'Factory', devices: 56, region: 'South China', status: 'active' },
  { id: 'g4', name: 'Pilot Lab', devices: 4, region: 'HQ', status: 'archived' }
]

export const mockIotTelemetry: IotTelemetry[] = [
  { id: 'tel1', device: 'Temp Sensor A1', metric: 'temperature', value: '4.2 °C', recordedAt: '2026-08-08T00:58:00Z' },
  { id: 'tel2', device: 'Temp Sensor A1', metric: 'humidity', value: '62 %', recordedAt: '2026-08-08T00:58:00Z' },
  { id: 'tel3', device: 'Air Quality C2', metric: 'PM2.5', value: '18 µg/m³', recordedAt: '2026-08-08T00:57:00Z' },
  { id: 'tel4', device: 'Power Meter E1', metric: 'power', value: '12.4 kW', recordedAt: '2026-08-08T00:58:30Z' },
  { id: 'tel5', device: 'Vibration D1', metric: 'rms', value: '0.02 g', recordedAt: '2026-08-08T00:30:00Z' }
]

export const mockIotAlarms: IotAlarm[] = [
  { id: 'al1', device: 'Door Lock B3', severity: 'critical', message: 'Device offline > 2h', raisedAt: '2026-08-08T00:10:00Z', status: 'open' },
  { id: 'al2', device: 'Temp Sensor A1', severity: 'warning', message: 'Temperature above threshold', raisedAt: '2026-08-07T23:45:00Z', status: 'acknowledged' },
  { id: 'al3', device: 'Power Meter E1', severity: 'info', message: 'Firmware update available', raisedAt: '2026-08-07T18:00:00Z', status: 'resolved' },
  { id: 'al4', device: 'Vibration D1', severity: 'warning', message: 'Low battery (12%)', raisedAt: '2026-08-07T12:00:00Z', status: 'open' }
]

export const mockIotOperations: IotOperation[] = [
  { id: 'op1', device: 'Gateway Hub-01', action: 'Reboot', operator: 'ops@acme.io', startedAt: '2026-08-07T20:00:00Z', status: 'success' },
  { id: 'op2', device: 'Door Lock B3', action: 'Remote unlock', operator: 'security@acme.io', startedAt: '2026-08-07T14:30:00Z', status: 'failed' },
  { id: 'op3', device: 'Temp Sensor A1', action: 'Calibrate', operator: 'field@acme.io', startedAt: '2026-08-08T00:45:00Z', status: 'running' },
  { id: 'op4', device: 'Power Meter E1', action: 'OTA firmware', operator: 'ops@acme.io', startedAt: '2026-08-06T10:00:00Z', status: 'success' }
]

export const mockIotOnlineSummary = {
  online: mockIotDevices.filter((d) => d.status === 'online').length,
  offline: mockIotDevices.filter((d) => d.status === 'offline').length,
  sleep: mockIotDevices.filter((d) => d.status === 'sleep').length,
  openAlarms: mockIotAlarms.filter((a) => a.status === 'open').length
}
