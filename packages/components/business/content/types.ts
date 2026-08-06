import type { TreeNode } from '@amg-webui/utils/data-display/tree-types'
import type { BizAccess, BizCrudAdapter, BizPageQuery } from '../_shared'

export type BizContentStatus = 'draft' | 'published' | 'archived'

export interface BizContentItem {
  id: string
  title: string
  category: string
  status: BizContentStatus
  updatedAt: string
  summary?: string
  body?: string
}

export type BizContentCreate = Omit<BizContentItem, 'id' | 'updatedAt'> & { updatedAt?: string }

export interface BizContentProps {
  items?: BizContentItem[]
  categories?: TreeNode[]
  loading?: boolean
  error?: string | null
  title?: string
  access?: BizAccess
  adapter?: BizCrudAdapter<BizContentItem, BizContentCreate, BizContentItem>
  page?: number
  pageSize?: number
  total?: number
}

export interface BizContentEmits {
  (e: 'create', payload: BizContentCreate): void
  (e: 'edit', item: BizContentItem): void
  (e: 'save', item: BizContentItem): void
  (e: 'publish', id: string): void
  (e: 'archive', id: string): void
  (e: 'refresh'): void
  (e: 'category-change', category: string | null): void
  (e: 'page-change', query: BizPageQuery): void
  (e: 'update:page', page: number): void
  (e: 'update:pageSize', pageSize: number): void
}
