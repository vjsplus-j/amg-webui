import type { BizUser } from '@amg-webui/components/business'
import type { BizOrder } from '@amg-webui/components/business'
import type { BizContentItem, BizContentStatus } from '@amg-webui/components/business'
import type { BizSettingsProfile, BizAuthResult } from '@amg-webui/components/business'
import type { BizTenant, BizTenantPlan, BizTenantStatus } from '@amg-webui/components/business'
import type { UserDto, OrderDto, ContentDto, SettingsDto, AuthResultDto, TenantDto } from './dtos'

type OrderStatus = BizOrder['status']

const ORDER_STATUS: Record<string, OrderStatus> = {
  pending: 'pending',
  paid: 'paid',
  shipped: 'shipped',
  done: 'done',
  cancelled: 'cancelled',
  refunding: 'refunding',
  refunded: 'refunded'
}

const CONTENT_STATUS: Record<string, BizContentStatus> = {
  draft: 'draft',
  published: 'published',
  archived: 'archived'
}

export function mapUserDto(dto: UserDto): BizUser {
  return {
    id: dto.user_id,
    name: dto.display_name,
    email: dto.mail,
    phone: dto.mobile,
    role: dto.role_code,
    status: dto.active_flag === 1 ? 'active' : 'disabled',
    avatar: dto.avatar_url,
    permissions: dto.perm_codes ? [...dto.perm_codes] : undefined
  }
}

export function mapUserToDto(user: BizUser): UserDto {
  return {
    user_id: Number(user.id),
    display_name: user.name,
    mail: user.email,
    mobile: user.phone,
    role_code: user.role,
    active_flag: user.status === 'active' ? 1 : 0,
    avatar_url: user.avatar,
    perm_codes: user.permissions ? [...user.permissions] : undefined
  }
}

export function mapOrderDto(dto: OrderDto): BizOrder {
  return {
    id: dto.id,
    orderNo: dto.order_no,
    customer: dto.buyer_name,
    amount: dto.amount_cents / 100,
    status: ORDER_STATUS[dto.status_code] ?? 'pending',
    createdAt: dto.created_at,
    refundable: dto.refundable,
    timeline: dto.timeline ? dto.timeline.map((t) => ({ ...t })) : undefined,
    remark: dto.remark
  }
}

export function mapOrderToDto(order: BizOrder): OrderDto {
  return {
    id: order.id,
    order_no: order.orderNo,
    buyer_name: order.customer,
    amount_cents: Math.round(order.amount * 100),
    status_code: order.status,
    created_at: order.createdAt,
    refundable: order.refundable,
    timeline: order.timeline ? order.timeline.map((t) => ({ ...t })) : undefined,
    remark: order.remark
  }
}

export function mapContentDto(dto: ContentDto): BizContentItem {
  return {
    id: dto.id,
    title: dto.title,
    category: dto.category_code,
    status: CONTENT_STATUS[dto.status_code] ?? 'draft',
    updatedAt: dto.updated_at,
    summary: dto.summary,
    body: dto.body
  }
}

export function mapContentToDto(item: BizContentItem): ContentDto {
  return {
    id: item.id,
    title: item.title,
    category_code: item.category,
    status_code: item.status,
    updated_at: item.updatedAt,
    summary: item.summary,
    body: item.body
  }
}

export function mapSettingsDto(dto: SettingsDto): {
  profile: BizSettingsProfile
  params: Record<string, string | number | boolean>
  notifyMail: boolean
  notifyPush: boolean
} {
  return {
    profile: { displayName: dto.display_name, email: dto.mail },
    params: { ...dto.params },
    notifyMail: dto.notify_mail,
    notifyPush: dto.notify_push
  }
}

export function mapSettingsToDto(snapshot: {
  profile: BizSettingsProfile
  params: Record<string, string | number | boolean>
  notifyMail: boolean
  notifyPush: boolean
}): SettingsDto {
  return {
    display_name: snapshot.profile.displayName ?? '',
    mail: snapshot.profile.email ?? '',
    notify_mail: snapshot.notifyMail,
    notify_push: snapshot.notifyPush,
    params: { ...snapshot.params }
  }
}

export function mapAuthResultDto(dto: AuthResultDto): BizAuthResult {
  return {
    token: dto.access_token,
    userId: dto.user_id,
    displayName: dto.display_name
  }
}

const TENANT_STATUS: Record<string, BizTenantStatus> = {
  active: 'active',
  trial: 'trial',
  suspended: 'suspended',
  archived: 'archived'
}

const TENANT_PLAN: Record<string, BizTenantPlan> = {
  free: 'free',
  pro: 'pro',
  enterprise: 'enterprise'
}

export function mapTenantDto(dto: TenantDto): BizTenant {
  return {
    id: dto.tenant_id,
    name: dto.display_name,
    slug: dto.slug,
    plan: TENANT_PLAN[dto.plan_code] ?? 'free',
    status: TENANT_STATUS[dto.status_code] ?? 'trial',
    members: dto.member_count,
    region: dto.region_code,
    domain: dto.custom_domain,
    createdAt: dto.created_at,
    usage: {
      users: dto.usage_users ?? 0,
      orders: dto.usage_orders ?? 0,
      storageGb: dto.usage_storage_gb
    }
  }
}

export function mapTenantToDto(tenant: BizTenant): TenantDto {
  return {
    tenant_id: String(tenant.id),
    display_name: tenant.name,
    slug: tenant.slug,
    plan_code: tenant.plan,
    status_code: tenant.status,
    member_count: tenant.members,
    region_code: tenant.region,
    custom_domain: tenant.domain,
    created_at: tenant.createdAt,
    usage_users: tenant.usage?.users,
    usage_orders: tenant.usage?.orders,
    usage_storage_gb: tenant.usage?.storageGb
  }
}
