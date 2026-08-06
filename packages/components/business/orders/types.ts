import type { BizAccess, BizCrudAdapter, BizPageQuery } from '../_shared'

export type BizOrderStatus = 'pending' | 'paid' | 'shipped' | 'done' | 'cancelled' | 'refunding' | 'refunded'

export interface BizOrderTimelineItem {
  at: string
  label: string
}

export interface BizOrder {
  id: string
  orderNo: string
  customer: string
  amount: number
  status: BizOrderStatus
  createdAt: string
  refundable?: boolean
  timeline?: BizOrderTimelineItem[]
  remark?: string
}

export interface BizOrdersProps {
  orders?: BizOrder[]
  loading?: boolean
  error?: string | null
  title?: string
  access?: BizAccess
  adapter?: BizCrudAdapter<BizOrder>
  page?: number
  pageSize?: number
  total?: number
  /** Currency prefix for amount display */
  currency?: string
  selectable?: boolean
}

export interface BizOrdersEmits {
  (e: 'view', order: BizOrder): void
  (e: 'cancel', id: string): void
  (e: 'refund', id: string): void
  (e: 'batch-cancel', ids: string[]): void
  (e: 'refresh'): void
  (e: 'page-change', query: BizPageQuery): void
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
}
