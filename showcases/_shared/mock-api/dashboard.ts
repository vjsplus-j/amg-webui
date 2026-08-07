export interface DashboardKpi {
  id: string
  label: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'flat'
}

export interface DashboardOrder {
  id: string
  customer: string
  product: string
  amount: number
  status: 'pending' | 'shipped' | 'completed' | 'cancelled'
  date: string
}

export interface ChartSeries {
  label: string
  values: number[]
}

export const mockKpis: DashboardKpi[] = [
  { id: 'revenue', label: 'Revenue', value: '¥128,450', delta: '+12.4%', trend: 'up' },
  { id: 'orders', label: 'Orders', value: '1,842', delta: '+5.1%', trend: 'up' },
  { id: 'users', label: 'Active Users', value: '9,204', delta: '-1.2%', trend: 'down' },
  { id: 'conversion', label: 'Conversion', value: '3.8%', delta: '0.0%', trend: 'flat' }
]

export const mockChartSeries: ChartSeries[] = [
  { label: 'Mon', values: [42, 38, 55, 48, 62, 58, 71] },
  { label: 'Tue', values: [38, 44, 51, 53, 49, 65, 68] },
  { label: 'Wed', values: [45, 50, 47, 60, 55, 72, 74] }
]

export const mockRecentOrders: DashboardOrder[] = [
  {
    id: 'ORD-1001',
    customer: 'Acme Corp',
    product: 'Enterprise Plan',
    amount: 12800,
    status: 'completed',
    date: '2026-08-07'
  },
  {
    id: 'ORD-1002',
    customer: 'Beta Labs',
    product: 'Pro Add-on',
    amount: 3200,
    status: 'shipped',
    date: '2026-08-07'
  },
  {
    id: 'ORD-1003',
    customer: 'Cloud Nine',
    product: 'Starter',
    amount: 899,
    status: 'pending',
    date: '2026-08-08'
  },
  {
    id: 'ORD-1004',
    customer: 'Delta IoT',
    product: 'Device Bundle',
    amount: 5600,
    status: 'cancelled',
    date: '2026-08-06'
  },
  {
    id: 'ORD-1005',
    customer: 'Echo Media',
    product: 'Analytics Pack',
    amount: 2100,
    status: 'completed',
    date: '2026-08-06'
  }
]
