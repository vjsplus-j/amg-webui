import type {
  BizAuthAdapter,
  BizAuthResult,
  BizCrudAdapter,
  BizPageQuery,
  BizPageResult,
  BizSettingsAdapter,
  BizSettingsSnapshot
} from '@amg-webui/components/business'
import type { BizUser, BizUserCreate } from '@amg-webui/components/business'
import type { BizOrder } from '@amg-webui/components/business'
import type { BizContentItem, BizContentCreate } from '@amg-webui/components/business'
import type { BizTenant, BizTenantCreate } from '@amg-webui/components/business'
import type { TreeNode } from '@amg-webui/utils/data-display/tree-types'
import { ref } from 'vue'
import type { AuthResultDto, ContentDto, OrderDto, SettingsDto, TenantDto, UserDto } from './dtos'
import { assertNotAborted, simDelay } from './fetch-utils'
import {
  mapAuthResultDto,
  mapContentDto,
  mapContentToDto,
  mapOrderDto,
  mapOrderToDto,
  mapSettingsDto,
  mapSettingsToDto,
  mapTenantDto,
  mapTenantToDto,
  mapUserDto,
  mapUserToDto
} from './mappers'

function paginate<T>(all: T[], query: BizPageQuery): BizPageResult<T> {
  const start = (query.page - 1) * query.pageSize
  return { list: all.slice(start, start + query.pageSize), total: all.length }
}

const SEED_USERS: UserDto[] = [
  {
    user_id: 1,
    display_name: 'Avery Quinn',
    mail: 'aq@amg.io',
    mobile: '13800000001',
    role_code: 'admin',
    active_flag: 1,
    perm_codes: ['users:read', 'users:write', 'settings:write']
  },
  {
    user_id: 2,
    display_name: 'Jordan Lee',
    mail: 'jl@amg.io',
    mobile: '13800000002',
    role_code: 'ops',
    active_flag: 1,
    perm_codes: ['users:read', 'orders:read']
  },
  {
    user_id: 3,
    display_name: 'Sam Rivera',
    mail: 'sr@amg.io',
    role_code: 'dev',
    active_flag: 0,
    perm_codes: ['users:read']
  },
  {
    user_id: 4,
    display_name: 'Casey Ng',
    mail: 'cn@amg.io',
    role_code: 'ops',
    active_flag: 1,
    perm_codes: ['orders:read']
  },
  {
    user_id: 5,
    display_name: 'Riley Chen',
    mail: 'rc@amg.io',
    role_code: 'dev',
    active_flag: 1,
    perm_codes: ['users:read']
  }
]

const SEED_ORDERS: OrderDto[] = [
  {
    id: '1',
    order_no: 'ORD-10021',
    buyer_name: 'Avery',
    amount_cents: 128000,
    status_code: 'paid',
    created_at: '2026-07-12',
    refundable: true,
    timeline: [
      { at: '2026-07-12 10:00', label: 'created' },
      { at: '2026-07-12 10:05', label: 'paid' }
    ]
  },
  {
    id: '2',
    order_no: 'ORD-10022',
    buyer_name: 'Jordan',
    amount_cents: 56000,
    status_code: 'pending',
    created_at: '2026-07-13',
    refundable: false
  },
  {
    id: '3',
    order_no: 'ORD-10023',
    buyer_name: 'Sam',
    amount_cents: 249900,
    status_code: 'shipped',
    created_at: '2026-07-14',
    refundable: true,
    timeline: [
      { at: '2026-07-14 09:00', label: 'paid' },
      { at: '2026-07-15 12:00', label: 'shipped' }
    ]
  },
  {
    id: '4',
    order_no: 'ORD-10024',
    buyer_name: 'Casey',
    amount_cents: 8800,
    status_code: 'done',
    created_at: '2026-07-10',
    refundable: true
  },
  {
    id: '5',
    order_no: 'ORD-10025',
    buyer_name: 'Riley',
    amount_cents: 42000,
    status_code: 'paid',
    created_at: '2026-07-16',
    refundable: true
  }
]

const SEED_CONTENT: ContentDto[] = [
  {
    id: 'c1',
    title: 'Release notes',
    category_code: 'announce',
    status_code: 'published',
    updated_at: '2026-07-10',
    summary: 'AMG-WebUI packages ready.',
    body: 'Full release body…'
  },
  {
    id: 'c2',
    title: 'Theme guide',
    category_code: 'docs',
    status_code: 'draft',
    updated_at: '2026-07-14',
    summary: 'Six designmd themes handbook.',
    body: 'Draft body…'
  },
  {
    id: 'c3',
    title: 'i18n checklist',
    category_code: 'i18n',
    status_code: 'draft',
    updated_at: '2026-07-15',
    summary: 'Locale pack coverage.'
  }
]

export function createUsersMockStore() {
  const dtos = ref<UserDto[]>(SEED_USERS.map((d) => ({ ...d, perm_codes: d.perm_codes ? [...d.perm_codes] : undefined })))
  const users = ref<BizUser[]>(dtos.value.map(mapUserDto))

  const adapter: BizCrudAdapter<BizUser, BizUserCreate, BizUser> = {
    async list(query, options) {
      await simDelay(120, options?.signal)
      assertNotAborted(options?.signal)
      let rows = dtos.value.map(mapUserDto)
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
    async get(id, options) {
      await simDelay(80, options?.signal)
      assertNotAborted(options?.signal)
      const hit = dtos.value.find((u) => u.user_id === Number(id))
      return hit ? mapUserDto(hit) : null
    },
    async create(payload, options) {
      await simDelay(100, options?.signal)
      assertNotAborted(options?.signal)
      const dto: UserDto = mapUserToDto({
        id: Date.now(),
        ...payload,
        status: payload.status || 'active'
      })
      dtos.value = [...dtos.value, dto]
      const next = mapUserDto(dto)
      users.value = [...users.value, next]
      return next
    },
    async update(payload, options) {
      await simDelay(100, options?.signal)
      assertNotAborted(options?.signal)
      const dto = mapUserToDto(payload)
      dtos.value = dtos.value.map((u) => (u.user_id === dto.user_id ? dto : u))
      users.value = users.value.map((u) => (u.id === payload.id ? payload : u))
      return payload
    },
    async remove(id, options) {
      await simDelay(100, options?.signal)
      assertNotAborted(options?.signal)
      dtos.value = dtos.value.filter((u) => u.user_id !== Number(id))
      users.value = users.value.filter((u) => u.id !== id)
    }
  }

  return { users, adapter }
}

export function createOrdersMockStore() {
  const dtos = ref<OrderDto[]>(SEED_ORDERS.map((d) => ({ ...d })))
  const orders = ref<BizOrder[]>(dtos.value.map(mapOrderDto))

  const adapter: BizCrudAdapter<BizOrder> = {
    async list(query, options) {
      await simDelay(120, options?.signal)
      assertNotAborted(options?.signal)
      let rows = dtos.value.map(mapOrderDto)
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
    async get(id, options) {
      await simDelay(80, options?.signal)
      assertNotAborted(options?.signal)
      const hit = dtos.value.find((o) => o.id === String(id))
      return hit ? mapOrderDto(hit) : null
    },
    async update(payload, options) {
      await simDelay(100, options?.signal)
      assertNotAborted(options?.signal)
      const dto = mapOrderToDto(payload)
      dtos.value = dtos.value.map((o) => (o.id === dto.id ? dto : o))
      orders.value = orders.value.map((o) => (o.id === payload.id ? payload : o))
      return payload
    }
  }

  function cancel(id: string) {
    orders.value = orders.value.map((o) =>
      o.id === id ? { ...o, status: 'cancelled' as const } : o
    )
    dtos.value = dtos.value.map((o) =>
      o.id === id ? { ...o, status_code: 'cancelled' } : o
    )
  }

  function refund(id: string) {
    orders.value = orders.value.map((o) =>
      o.id === id ? { ...o, status: 'refunded' as const, refundable: false } : o
    )
    dtos.value = dtos.value.map((o) =>
      o.id === id ? { ...o, status_code: 'refunded', refundable: false } : o
    )
  }

  function batchCancel(ids: string[]) {
    const set = new Set(ids)
    orders.value = orders.value.map((o) =>
      set.has(o.id) ? { ...o, status: 'cancelled' as const } : o
    )
    dtos.value = dtos.value.map((o) =>
      set.has(o.id) ? { ...o, status_code: 'cancelled' } : o
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
  const dtos = ref<ContentDto[]>(SEED_CONTENT.map((d) => ({ ...d })))
  const items = ref<BizContentItem[]>(dtos.value.map(mapContentDto))

  const adapter: BizCrudAdapter<BizContentItem, BizContentCreate, BizContentItem> = {
    async list(query, options) {
      await simDelay(120, options?.signal)
      assertNotAborted(options?.signal)
      let rows = dtos.value.map(mapContentDto)
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
    async create(payload, options) {
      await simDelay(100, options?.signal)
      assertNotAborted(options?.signal)
      const domain: BizContentItem = {
        id: `c${Date.now()}`,
        updatedAt: new Date().toISOString().slice(0, 10),
        ...payload
      }
      const dto = mapContentToDto(domain)
      dtos.value = [...dtos.value, dto]
      items.value = [...items.value, domain]
      return domain
    },
    async update(payload, options) {
      await simDelay(100, options?.signal)
      assertNotAborted(options?.signal)
      const dto = mapContentToDto(payload)
      dtos.value = dtos.value.map((i) => (i.id === dto.id ? dto : i))
      items.value = items.value.map((i) => (i.id === payload.id ? payload : i))
      return payload
    }
  }

  function publish(id: string) {
    items.value = items.value.map((i) =>
      i.id === id ? { ...i, status: 'published' as const } : i
    )
    dtos.value = dtos.value.map((i) =>
      i.id === id ? { ...i, status_code: 'published' } : i
    )
  }

  function archive(id: string) {
    items.value = items.value.map((i) =>
      i.id === id ? { ...i, status: 'archived' as const } : i
    )
    dtos.value = dtos.value.map((i) =>
      i.id === id ? { ...i, status_code: 'archived' } : i
    )
  }

  return { items, adapter, publish, archive, categories: contentCategories }
}

const DEFAULT_SETTINGS_DTO: SettingsDto = {
  display_name: 'AMG Operator',
  mail: 'ops@example.com',
  notify_mail: true,
  notify_push: false,
  params: { sessionTimeout: 30, featureFlagBeta: false }
}

export function createSettingsMockStore() {
  const dto = ref<SettingsDto>({ ...DEFAULT_SETTINGS_DTO, params: { ...DEFAULT_SETTINGS_DTO.params } })

  const adapter: BizSettingsAdapter = {
    async load(options) {
      await simDelay(150, options?.signal)
      assertNotAborted(options?.signal)
      return mapSettingsDto(dto.value)
    },
    async save(snapshot, options) {
      await simDelay(180, options?.signal)
      assertNotAborted(options?.signal)
      dto.value = mapSettingsToDto(snapshot)
      return mapSettingsDto(dto.value)
    },
    async changePassword(payload, options) {
      await simDelay(200, options?.signal)
      assertNotAborted(options?.signal)
      if (payload.oldPassword !== 'admin') {
        throw new Error('Invalid current password')
      }
    }
  }

  return { adapter, dto }
}

const SEED_TENANTS: TenantDto[] = [
  {
    tenant_id: 't1',
    display_name: 'AMG HQ',
    slug: 'amg-hq',
    plan_code: 'enterprise',
    status_code: 'active',
    member_count: 48,
    region_code: 'cn-east',
    custom_domain: 'hq.amg.io',
    created_at: '2025-11-01',
    usage_users: 42,
    usage_orders: 1280,
    usage_storage_gb: 86
  },
  {
    tenant_id: 't2',
    display_name: 'North Retail',
    slug: 'north-retail',
    plan_code: 'pro',
    status_code: 'active',
    member_count: 12,
    region_code: 'cn-north',
    created_at: '2026-01-18',
    usage_users: 11,
    usage_orders: 340,
    usage_storage_gb: 12
  },
  {
    tenant_id: 't3',
    display_name: 'Pilot Lab',
    slug: 'pilot-lab',
    plan_code: 'free',
    status_code: 'trial',
    member_count: 3,
    region_code: 'cn-south',
    created_at: '2026-06-02',
    usage_users: 3,
    usage_orders: 18,
    usage_storage_gb: 1
  },
  {
    tenant_id: 't4',
    display_name: 'Legacy Ops',
    slug: 'legacy-ops',
    plan_code: 'pro',
    status_code: 'suspended',
    member_count: 7,
    region_code: 'cn-east',
    created_at: '2024-08-20',
    usage_users: 7,
    usage_orders: 90,
    usage_storage_gb: 4
  },
  {
    tenant_id: 't5',
    display_name: 'APAC Partner',
    slug: 'apac-partner',
    plan_code: 'enterprise',
    status_code: 'active',
    member_count: 26,
    region_code: 'ap-southeast',
    custom_domain: 'apac.partner.amg.io',
    created_at: '2025-03-12',
    usage_users: 24,
    usage_orders: 620,
    usage_storage_gb: 33
  }
]

export function createTenantsMockStore() {
  const dtos = ref<TenantDto[]>(SEED_TENANTS.map((d) => ({ ...d })))
  const tenants = ref<BizTenant[]>(dtos.value.map(mapTenantDto))
  const activeTenantId = ref<string | null>('t1')

  const adapter: BizCrudAdapter<BizTenant, BizTenantCreate, BizTenant> = {
    async list(query, options) {
      await simDelay(120, options?.signal)
      assertNotAborted(options?.signal)
      let rows = dtos.value.map(mapTenantDto)
      const kw = query.keyword?.trim().toLowerCase()
      if (kw) {
        rows = rows.filter(
          (row) =>
            row.name.toLowerCase().includes(kw) ||
            row.slug.toLowerCase().includes(kw) ||
            (row.domain?.toLowerCase().includes(kw) ?? false)
        )
      }
      const status = query.filters?.status
      if (status) rows = rows.filter((row) => row.status === status)
      const plan = query.filters?.plan
      if (plan) rows = rows.filter((row) => row.plan === plan)
      return paginate(rows, query)
    },
    async get(id, options) {
      await simDelay(80, options?.signal)
      assertNotAborted(options?.signal)
      const hit = dtos.value.find((row) => row.tenant_id === String(id))
      return hit ? mapTenantDto(hit) : null
    },
    async create(payload, options) {
      await simDelay(100, options?.signal)
      assertNotAborted(options?.signal)
      const domain: BizTenant = {
        id: `t${Date.now()}`,
        createdAt: new Date().toISOString().slice(0, 10),
        usage: { users: 0, orders: 0, storageGb: 0 },
        ...payload
      }
      const dto = mapTenantToDto(domain)
      dtos.value = [...dtos.value, dto]
      tenants.value = [...tenants.value, domain]
      return domain
    },
    async update(payload, options) {
      await simDelay(100, options?.signal)
      assertNotAborted(options?.signal)
      const dto = mapTenantToDto(payload)
      dtos.value = dtos.value.map((row) => (row.tenant_id === dto.tenant_id ? dto : row))
      tenants.value = tenants.value.map((row) => (row.id === payload.id ? payload : row))
      return payload
    },
    async remove(id, options) {
      await simDelay(100, options?.signal)
      assertNotAborted(options?.signal)
      dtos.value = dtos.value.filter((row) => row.tenant_id !== String(id))
      tenants.value = tenants.value.filter((row) => row.id !== id)
      if (activeTenantId.value === String(id)) activeTenantId.value = null
    }
  }

  function setActive(id: string | null) {
    activeTenantId.value = id
  }

  return { tenants, adapter, activeTenantId, setActive }
}

export function createAuthMockAdapter(): BizAuthAdapter {
  return {
    async login(credentials, options) {
      await simDelay(220, options?.signal)
      assertNotAborted(options?.signal)
      if (!credentials.username?.trim() && !credentials.phone?.trim()) {
        throw new Error('Account is required')
      }
      if (credentials.mode !== 'sms' && !credentials.password) {
        throw new Error('Password is required')
      }
      const wire: AuthResultDto = {
        access_token: `mock-${Date.now()}`,
        user_id: credentials.username || credentials.phone || 'guest',
        display_name: credentials.username || credentials.phone
      }
      return mapAuthResultDto(wire)
    },
    async register(payload, options) {
      await simDelay(240, options?.signal)
      assertNotAborted(options?.signal)
      if (payload.password !== payload.confirmPassword) {
        throw new Error('Passwords do not match')
      }
      const wire: AuthResultDto = {
        access_token: `mock-reg-${Date.now()}`,
        user_id: payload.username,
        display_name: payload.username
      }
      return mapAuthResultDto(wire)
    },
    async resetPassword(payload, options) {
      await simDelay(200, options?.signal)
      assertNotAborted(options?.signal)
      if (payload.password !== payload.confirmPassword) {
        throw new Error('Passwords do not match')
      }
    },
    async sendCode(_channel, _target, options) {
      await simDelay(160, options?.signal)
      assertNotAborted(options?.signal)
    }
  }
}

export type { BizAuthResult, BizSettingsSnapshot }
