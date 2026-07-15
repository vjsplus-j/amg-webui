export type BizContentStatus = 'draft' | 'published' | 'archived'

export interface BizContentItem {
  id: string
  title: string
  category: string
  status: BizContentStatus
  updatedAt: string
  summary?: string
}

export interface BizContentProps {
  items: BizContentItem[]
  loading?: boolean
  title?: string
}

export interface BizContentEmits {
  (e: 'create'): void
  (e: 'edit', item: BizContentItem): void
  (e: 'publish', id: string): void
  (e: 'archive', id: string): void
  (e: 'refresh'): void
}
