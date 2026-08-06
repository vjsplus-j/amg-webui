import type { BizCrudAdapter, BizPageQuery, BizPageResult } from '@amg-webui/components/business'
import type { BizUser, BizUserCreate } from '@amg-webui/components/business'
import type { BizOrder } from '@amg-webui/components/business'
import type { BizContentItem, BizContentCreate } from '@amg-webui/components/business'
import type { TreeNode } from '@amg-webui/utils/data-display/tree-types'
import { ref } from 'vue'

function paginate<T>(all: T[], query: BizPageQuery): BizPageResult<T> {
  const start = (query.page - 1) * query.pageSize
  return { list: all.slice(start, start + query.pageSize), total: all.length }
}

export function createUsersMockStore() {
  const users = ref<BizUser[]>([
    {
      id: 1,
      name: 'Avery Quinn',
      email: 'aq@amg.io',
      phone: '13800000001',
      role: 'admin',
      status: 'active',
      permissions: ['users:read', 'users:write', 'settings:write']
    },
    {
      id: 2,
      name: 'Jordan Lee',
      email: 'jl@amg.io',
      phone: '13800000002',
      role: 'ops',
      status: 'active',
      permissions: ['users:read', 'orders:read']
    },
    {
      id: 3,
      name: 'Sam Rivera',
      email: 'sr@amg.io',
      role: 'dev',
      status: 'disabled',
      permissions: ['users:read']
    },
    {
      id: 4,
      name: 'Casey Ng',
      email: 'cn@amg.io',
      role: 'ops',
      status: 'active',
      permissions: ['orders:read']
    },
    {
      id: 5,
      name: 'Riley Chen',
      email: 'rc@amg.io',
      role: 'dev',
      status: 'active',
      permissions: ['users:read']
    }
  ])

  const adapter: BizCrudAdapter<BizUser, BizUserCreate, BizUser> = {
    async list(query) {
      let rows = [...users.value]
      const kw = query.keyword?.trim().toLowerCase()
      if (kw) {
        rows = rows.filter(
          (u) => u.name.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw)
        )
      }
      const role = query.filters?.role
      if (role) rows = rows.filter((u) => u.role === role)
      return paginate(rows, query)
    },
    async get(id) {
      return users.value.find((u) => u.id === id) ?? null
    },
    async create(payload) {
      const next: BizUser = { id: Date.now(), ...payload, status: payload.status || 'active' }
      users.value = [...users.value, next]
      return next
    },
    async update(payload) {
      users.value = users.value.map((u) => (u.id === payload.id ? payload : u))
      return payload
    },
    async remove(id) {
      users.value = users.value.filter((u) => u.id !== id)
    }
  }

  return { users, adapter }
}

export function createOrdersMockStore() {
  const orders = ref<BizOrder[]>([
    {
      id: '1',
      orderNo: 'ORD-10021',
      customer: 'Avery',
      amount: 1280,
      status: 'paid',
      createdAt: '2026-07-12',
      refundable: true,
      timeline: [
        { at: '2026-07-12 10:00', label: 'created' },
        { at: '2026-07-12 10:05', label: 'paid' }
      ]
    },
    {
      id: '2',
      orderNo: 'ORD-10022',
      customer: 'Jordan',
      amount: 560,
      status: 'pending',
      createdAt: '2026-07-13',
      refundable: false
    },
    {
      id: '3',
      orderNo: 'ORD-10023',
      customer: 'Sam',
      amount: 2499,
      status: 'shipped',
      createdAt: '2026-07-14',
      refundable: true,
      timeline: [
        { at: '2026-07-14 09:00', label: 'paid' },
        { at: '2026-07-15 12:00', label: 'shipped' }
      ]
    },
    {
      id: '4',
      orderNo: 'ORD-10024',
      customer: 'Casey',
      amount: 88,
      status: 'done',
      createdAt: '2026-07-10',
      refundable: true
    },
    {
      id: '5',
      orderNo: 'ORD-10025',
      customer: 'Riley',
      amount: 420,
      status: 'paid',
      createdAt: '2026-07-16',
      refundable: true
    }
  ])

  const adapter: BizCrudAdapter<BizOrder> = {
    async list(query) {
      let rows = [...orders.value]
      const kw = query.keyword?.trim().toLowerCase()
      if (kw) {
        rows = rows.filter(
          (o) =>
            o.orderNo.toLowerCase().includes(kw) || o.customer.toLowerCase().includes(kw)
        )
      }
      const status = query.filters?.status
      if (status) rows = rows.filter((o) => o.status === status)
      return paginate(rows, query)
    },
    async get(id) {
      return orders.value.find((o) => o.id === String(id)) ?? null
    }
  }

  function cancel(id: string) {
    orders.value = orders.value.map((o) =>
      o.id === id ? { ...o, status: 'cancelled' as const } : o
    )
  }

  function refund(id: string) {
    orders.value = orders.value.map((o) =>
      o.id === id ? { ...o, status: 'refunded' as const, refundable: false } : o
    )
  }

  function batchCancel(ids: string[]) {
    const set = new Set(ids)
    orders.value = orders.value.map((o) =>
      set.has(o.id) ? { ...o, status: 'cancelled' as const } : o
    )
  }

  return { orders, adapter, cancel, refund, batchCancel }
}

export const contentCategories: TreeNode[] = [
  {
    label: 'announce',
    value: 'announce',
    children: [{ label: 'release', value: 'release' }]
  },
  {
    label: 'docs',
    value: 'docs',
    children: [
      { label: 'theme', value: 'theme' },
      { label: 'i18n', value: 'i18n' }
    ]
  }
]

export function createContentMockStore() {
  const items = ref<BizContentItem[]>([
    {
      id: 'c1',
      title: 'Release notes',
      category: 'announce',
      status: 'published',
      updatedAt: '2026-07-10',
      summary: 'AMG-WebUI packages ready.',
      body: 'Full release body…'
    },
    {
      id: 'c2',
      title: 'Theme guide',
      category: 'docs',
      status: 'draft',
      updatedAt: '2026-07-14',
      summary: 'Six designmd themes handbook.',
      body: 'Draft body…'
    },
    {
      id: 'c3',
      title: 'i18n checklist',
      category: 'i18n',
      status: 'draft',
      updatedAt: '2026-07-15',
      summary: 'Locale pack coverage.'
    }
  ])

  const adapter: BizCrudAdapter<BizContentItem, BizContentCreate, BizContentItem> = {
    async list(query) {
      let rows = [...items.value]
      const kw = query.keyword?.trim().toLowerCase()
      if (kw) {
        rows = rows.filter(
          (i) =>
            i.title.toLowerCase().includes(kw) || i.category.toLowerCase().includes(kw)
        )
      }
      const status = query.filters?.status
      if (status) rows = rows.filter((i) => i.status === status)
      const category = query.filters?.category
      if (category) rows = rows.filter((i) => i.category === category)
      return paginate(rows, query)
    },
    async create(payload) {
      const next: BizContentItem = {
        id: `c${Date.now()}`,
        updatedAt: new Date().toISOString().slice(0, 10),
        ...payload
      }
      items.value = [...items.value, next]
      return next
    },
    async update(payload) {
      items.value = items.value.map((i) => (i.id === payload.id ? payload : i))
      return payload
    }
  }

  function publish(id: string) {
    items.value = items.value.map((i) =>
      i.id === id ? { ...i, status: 'published' as const } : i
    )
  }

  function archive(id: string) {
    items.value = items.value.map((i) =>
      i.id === id ? { ...i, status: 'archived' as const } : i
    )
  }

  return { items, adapter, publish, archive, categories: contentCategories }
}
