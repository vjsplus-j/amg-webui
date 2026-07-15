export type BizOrderStatus = 'pending' | 'paid' | 'shipped' | 'done' | 'cancelled'

export interface BizOrder {
  id: string
  orderNo: string
  customer: string
  amount: number
  status: BizOrderStatus
  createdAt: string
}

export interface BizOrdersProps {
  orders: BizOrder[]
  loading?: boolean
  title?: string
}

export interface BizOrdersEmits {
  (e: 'view', order: BizOrder): void
  (e: 'cancel', id: string): void
  (e: 'refresh'): void
}
