export type TenantStatus = 'active' | 'suspended' | 'trial'

export interface SaasTenant {
  id: string
  name: string
  slug: string
  plan: string
  members: number
  status: TenantStatus
  createdAt: string
}

export interface SaasOrganization {
  id: string
  name: string
  tenant: string
  owner: string
  departments: number
  status: 'active' | 'inactive'
}

export interface SaasMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member'
  tenant: string
  lastLogin: string
  status: 'active' | 'invited' | 'disabled'
}

export interface SaasSubscription {
  id: string
  tenant: string
  plan: string
  seats: number
  mrr: number
  renewsAt: string
  status: 'active' | 'past_due' | 'cancelled'
}

export interface SaasPlan {
  id: string
  name: string
  price: number
  interval: 'monthly' | 'yearly'
  seats: number
  features: string
  status: 'published' | 'draft'
}

export interface SaasUsage {
  id: string
  tenant: string
  metric: string
  used: number
  limit: number
  period: string
}

export interface SaasInvoice {
  id: string
  tenant: string
  amount: number
  currency: string
  issuedAt: string
  status: 'paid' | 'open' | 'void'
}

export const mockSaasTenants: SaasTenant[] = [
  { id: 't1', name: 'Acme Corp', slug: 'acme', plan: 'Business', members: 48, status: 'active', createdAt: '2025-11-02' },
  { id: 't2', name: 'Nova Labs', slug: 'nova', plan: 'Pro', members: 12, status: 'trial', createdAt: '2026-07-15' },
  { id: 't3', name: 'River Retail', slug: 'river', plan: 'Enterprise', members: 210, status: 'active', createdAt: '2024-03-18' },
  { id: 't4', name: 'Pixel Studio', slug: 'pixel', plan: 'Starter', members: 5, status: 'suspended', createdAt: '2026-01-09' },
  { id: 't5', name: 'Cloud Nine', slug: 'cloud9', plan: 'Pro', members: 22, status: 'active', createdAt: '2025-08-22' },
  { id: 't6', name: 'DataForge', slug: 'dataforge', plan: 'Business', members: 67, status: 'active', createdAt: '2025-05-30' }
]

export const mockSaasOrganizations: SaasOrganization[] = [
  { id: 'o1', name: 'Engineering', tenant: 'Acme Corp', owner: 'Alice Chen', departments: 4, status: 'active' },
  { id: 'o2', name: 'Sales EMEA', tenant: 'Acme Corp', owner: 'Bob Miller', departments: 2, status: 'active' },
  { id: 'o3', name: 'R&D', tenant: 'Nova Labs', owner: 'Dana Wu', departments: 3, status: 'active' },
  { id: 'o4', name: 'Store Ops', tenant: 'River Retail', owner: 'Eve Park', departments: 8, status: 'active' },
  { id: 'o5', name: 'Legacy Unit', tenant: 'Pixel Studio', owner: 'Frank Li', departments: 1, status: 'inactive' }
]

export const mockSaasMembers: SaasMember[] = [
  { id: 'm1', name: 'Alice Chen', email: 'alice@acme.io', role: 'owner', tenant: 'Acme Corp', lastLogin: '2026-08-07T18:00:00Z', status: 'active' },
  { id: 'm2', name: 'Bob Miller', email: 'bob@acme.io', role: 'admin', tenant: 'Acme Corp', lastLogin: '2026-08-07T12:30:00Z', status: 'active' },
  { id: 'm3', name: 'Carol Sun', email: 'carol@nova.io', role: 'owner', tenant: 'Nova Labs', lastLogin: '2026-08-06T09:15:00Z', status: 'active' },
  { id: 'm4', name: 'Dan Ortiz', email: 'dan@river.io', role: 'member', tenant: 'River Retail', lastLogin: '2026-08-05T22:00:00Z', status: 'active' },
  { id: 'm5', name: 'Eve Park', email: 'eve@river.io', role: 'admin', tenant: 'River Retail', lastLogin: '2026-08-07T08:45:00Z', status: 'active' },
  { id: 'm6', name: 'Guest Invite', email: 'guest@pixel.io', role: 'member', tenant: 'Pixel Studio', lastLogin: '', status: 'invited' }
]

export const mockSaasSubscriptions: SaasSubscription[] = [
  { id: 's1', tenant: 'Acme Corp', plan: 'Business', seats: 50, mrr: 2490, renewsAt: '2026-09-01', status: 'active' },
  { id: 's2', tenant: 'Nova Labs', plan: 'Pro', seats: 15, mrr: 299, renewsAt: '2026-08-15', status: 'active' },
  { id: 's3', tenant: 'River Retail', plan: 'Enterprise', seats: 250, mrr: 8900, renewsAt: '2027-03-18', status: 'active' },
  { id: 's4', tenant: 'Pixel Studio', plan: 'Starter', seats: 5, mrr: 49, renewsAt: '2026-02-09', status: 'past_due' },
  { id: 's5', tenant: 'Cloud Nine', plan: 'Pro', seats: 25, mrr: 499, renewsAt: '2026-08-22', status: 'active' }
]

export const mockSaasPlans: SaasPlan[] = [
  { id: 'p1', name: 'Starter', price: 49, interval: 'monthly', seats: 5, features: 'Core apps, 10 GB storage', status: 'published' },
  { id: 'p2', name: 'Pro', price: 299, interval: 'monthly', seats: 25, features: 'SSO, audit log, 100 GB', status: 'published' },
  { id: 'p3', name: 'Business', price: 2490, interval: 'monthly', seats: 100, features: 'SAML, SLA 99.9%, 1 TB', status: 'published' },
  { id: 'p4', name: 'Enterprise', price: 8900, interval: 'yearly', seats: 500, features: 'Dedicated VPC, custom contract', status: 'published' },
  { id: 'p5', name: 'Beta Analytics', price: 0, interval: 'monthly', seats: 10, features: 'Preview metrics pack', status: 'draft' }
]

export const mockSaasUsage: SaasUsage[] = [
  { id: 'u1', tenant: 'Acme Corp', metric: 'API calls', used: 1_240_000, limit: 2_000_000, period: 'Aug 2026' },
  { id: 'u2', tenant: 'Acme Corp', metric: 'Storage (GB)', used: 342, limit: 1024, period: 'Aug 2026' },
  { id: 'u3', tenant: 'Nova Labs', metric: 'API calls', used: 89_000, limit: 500_000, period: 'Aug 2026' },
  { id: 'u4', tenant: 'River Retail', metric: 'Seats', used: 210, limit: 250, period: 'Aug 2026' },
  { id: 'u5', tenant: 'Cloud Nine', metric: 'Webhooks', used: 12_400, limit: 50_000, period: 'Aug 2026' }
]

export const mockSaasInvoices: SaasInvoice[] = [
  { id: 'inv-1001', tenant: 'Acme Corp', amount: 2490, currency: 'USD', issuedAt: '2026-08-01', status: 'paid' },
  { id: 'inv-1002', tenant: 'Nova Labs', amount: 299, currency: 'USD', issuedAt: '2026-08-01', status: 'paid' },
  { id: 'inv-1003', tenant: 'Pixel Studio', amount: 49, currency: 'USD', issuedAt: '2026-07-01', status: 'open' },
  { id: 'inv-1004', tenant: 'River Retail', amount: 8900, currency: 'USD', issuedAt: '2026-03-18', status: 'paid' },
  { id: 'inv-1005', tenant: 'Cloud Nine', amount: 499, currency: 'USD', issuedAt: '2026-08-01', status: 'paid' }
]

export const mockSaasOverview = {
  activeTenants: mockSaasTenants.filter((t) => t.status === 'active').length,
  trialTenants: mockSaasTenants.filter((t) => t.status === 'trial').length,
  mrr: mockSaasSubscriptions.reduce((sum, s) => sum + s.mrr, 0),
  pastDue: mockSaasSubscriptions.filter((s) => s.status === 'past_due').length
}
