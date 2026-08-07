export interface EcomProduct {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'on_sale' | 'draft' | 'archived'
  updatedAt: string
}

export interface EcomSku {
  id: string
  product: string
  sku: string
  variant: string
  price: number
  stock: number
  status: 'active' | 'out_of_stock'
}

export interface EcomOrder {
  id: string
  customer: string
  items: number
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'cancelled'
  placedAt: string
}

export interface EcomCustomer {
  id: string
  name: string
  email: string
  orders: number
  lifetime: number
  segment: 'vip' | 'regular' | 'new'
  status: 'active' | 'blocked'
}

export interface EcomInventory {
  id: string
  sku: string
  warehouse: string
  onHand: number
  reserved: number
  reorderAt: number
  status: 'ok' | 'low' | 'critical'
}

export interface EcomPromotion {
  id: string
  name: string
  code: string
  discount: string
  startsAt: string
  endsAt: string
  status: 'scheduled' | 'active' | 'ended'
}

export interface EcomOrderLine {
  sku: string
  name: string
  qty: number
  price: number
}

export interface EcomOrderDetail extends EcomOrder {
  shippingAddress: string
  payment: string
  lines: EcomOrderLine[]
}

export const mockEcomProducts: EcomProduct[] = [
  { id: 'pr1', name: 'Wireless Earbuds X1', category: 'Electronics', price: 299, stock: 420, status: 'on_sale', updatedAt: '2026-08-06' },
  { id: 'pr2', name: 'Organic Cotton Tee', category: 'Apparel', price: 89, stock: 1200, status: 'on_sale', updatedAt: '2026-08-05' },
  { id: 'pr3', name: 'Smart Kettle Pro', category: 'Home', price: 459, stock: 38, status: 'on_sale', updatedAt: '2026-08-07' },
  { id: 'pr4', name: 'Trail Runner Shoes', category: 'Sports', price: 699, stock: 0, status: 'archived', updatedAt: '2026-07-20' },
  { id: 'pr5', name: 'Desk Lamp LED', category: 'Home', price: 159, stock: 210, status: 'draft', updatedAt: '2026-08-01' },
  { id: 'pr6', name: 'USB-C Hub 7-in-1', category: 'Electronics', price: 199, stock: 560, status: 'on_sale', updatedAt: '2026-08-07' }
]

export const mockEcomSkus: EcomSku[] = [
  { id: 'sk1', product: 'Wireless Earbuds X1', sku: 'EAR-X1-BLK', variant: 'Black', price: 299, stock: 220, status: 'active' },
  { id: 'sk2', product: 'Wireless Earbuds X1', sku: 'EAR-X1-WHT', variant: 'White', price: 299, stock: 200, status: 'active' },
  { id: 'sk3', product: 'Organic Cotton Tee', sku: 'TEE-ORG-M', variant: 'M / Natural', price: 89, stock: 400, status: 'active' },
  { id: 'sk4', product: 'Trail Runner Shoes', sku: 'SHO-TR-42', variant: 'EU 42', price: 699, stock: 0, status: 'out_of_stock' },
  { id: 'sk5', product: 'USB-C Hub 7-in-1', sku: 'HUB-7C-GRY', variant: 'Space Gray', price: 199, stock: 560, status: 'active' }
]

export const mockEcomOrders: EcomOrder[] = [
  { id: 'ORD-240801', customer: 'Lin Wei', items: 2, total: 388, status: 'shipped', placedAt: '2026-08-07T10:22:00Z' },
  { id: 'ORD-240802', customer: 'Sarah Kim', items: 1, total: 459, status: 'paid', placedAt: '2026-08-07T14:05:00Z' },
  { id: 'ORD-240803', customer: 'Mike Johnson', items: 3, total: 947, status: 'pending', placedAt: '2026-08-07T16:40:00Z' },
  { id: 'ORD-240804', customer: 'Yuki Tanaka', items: 1, total: 89, status: 'cancelled', placedAt: '2026-08-06T08:11:00Z' },
  { id: 'ORD-240805', customer: 'Lin Wei', items: 1, total: 199, status: 'shipped', placedAt: '2026-08-05T19:30:00Z' }
]

export const mockEcomCustomers: EcomCustomer[] = [
  { id: 'c1', name: 'Lin Wei', email: 'lin@example.com', orders: 12, lifetime: 4280, segment: 'vip', status: 'active' },
  { id: 'c2', name: 'Sarah Kim', email: 'sarah@example.com', orders: 5, lifetime: 1890, segment: 'regular', status: 'active' },
  { id: 'c3', name: 'Mike Johnson', email: 'mike@example.com', orders: 2, lifetime: 620, segment: 'new', status: 'active' },
  { id: 'c4', name: 'Yuki Tanaka', email: 'yuki@example.com', orders: 8, lifetime: 2100, segment: 'regular', status: 'active' },
  { id: 'c5', name: 'Spam Bot', email: 'bot@spam.invalid', orders: 0, lifetime: 0, segment: 'new', status: 'blocked' }
]

export const mockEcomInventory: EcomInventory[] = [
  { id: 'inv1', sku: 'EAR-X1-BLK', warehouse: 'East-01', onHand: 220, reserved: 18, reorderAt: 50, status: 'ok' },
  { id: 'inv2', sku: 'TEE-ORG-M', warehouse: 'East-01', onHand: 42, reserved: 10, reorderAt: 80, status: 'low' },
  { id: 'inv3', sku: 'SHO-TR-42', warehouse: 'West-02', onHand: 0, reserved: 0, reorderAt: 20, status: 'critical' },
  { id: 'inv4', sku: 'HUB-7C-GRY', warehouse: 'West-02', onHand: 560, reserved: 45, reorderAt: 100, status: 'ok' },
  { id: 'inv5', sku: 'EAR-X1-WHT', warehouse: 'East-01', onHand: 35, reserved: 12, reorderAt: 50, status: 'low' }
]

export const mockEcomPromotions: EcomPromotion[] = [
  { id: 'promo1', name: 'Summer Sale 20%', code: 'SUMMER20', discount: '20% off', startsAt: '2026-07-01', endsAt: '2026-08-31', status: 'active' },
  { id: 'promo2', name: 'New User ¥50', code: 'WELCOME50', discount: '¥50 off', startsAt: '2026-01-01', endsAt: '2026-12-31', status: 'active' },
  { id: 'promo3', name: 'Flash Friday', code: 'FLASH-FRI', discount: '15% off electronics', startsAt: '2026-08-15', endsAt: '2026-08-16', status: 'scheduled' },
  { id: 'promo4', name: 'Spring Clearance', code: 'SPRING24', discount: '30% off apparel', startsAt: '2026-03-01', endsAt: '2026-04-30', status: 'ended' }
]

export const mockEcomOrderDetails: Record<string, EcomOrderDetail> = {
  'ORD-240801': {
    id: 'ORD-240801',
    customer: 'Lin Wei',
    items: 2,
    total: 388,
    status: 'shipped',
    placedAt: '2026-08-07T10:22:00Z',
    shippingAddress: '88 Pudong Ave, Shanghai',
    payment: 'Alipay •••• 8821',
    lines: [
      { sku: 'TEE-ORG-M', name: 'Organic Cotton Tee', qty: 1, price: 89 },
      { sku: 'HUB-7C-GRY', name: 'USB-C Hub 7-in-1', qty: 1, price: 199 }
    ]
  },
  'ORD-240802': {
    id: 'ORD-240802',
    customer: 'Sarah Kim',
    items: 1,
    total: 459,
    status: 'paid',
    placedAt: '2026-08-07T14:05:00Z',
    shippingAddress: '12 Marina Blvd, Singapore',
    payment: 'Visa •••• 4242',
    lines: [{ sku: 'KET-PRO', name: 'Smart Kettle Pro', qty: 1, price: 459 }]
  },
  'ORD-240803': {
    id: 'ORD-240803',
    customer: 'Mike Johnson',
    items: 3,
    total: 947,
    status: 'pending',
    placedAt: '2026-08-07T16:40:00Z',
    shippingAddress: '500 Market St, San Francisco',
    payment: 'Pending',
    lines: [
      { sku: 'EAR-X1-BLK', name: 'Wireless Earbuds X1 (Black)', qty: 2, price: 299 },
      { sku: 'TEE-ORG-M', name: 'Organic Cotton Tee', qty: 1, price: 89 }
    ]
  }
}

export function getEcomOrderDetail(id: string): EcomOrderDetail | undefined {
  return mockEcomOrderDetails[id] ?? mockEcomOrders.find((o) => o.id === id)
    ? {
        ...mockEcomOrders.find((o) => o.id === id)!,
        shippingAddress: '—',
        payment: '—',
        lines: []
      }
    : undefined
}
