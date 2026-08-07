import { describe, expect, it } from 'vitest'
import {
  mapAuthResultDto,
  mapContentDto,
  mapContentToDto,
  mapOrderDto,
  mapOrderToDto,
  mapSettingsDto,
  mapSettingsToDto,
  mapUserDto,
  mapUserToDto
} from '../../example/mock/biz/mappers'
import type { AuthResultDto, ContentDto, OrderDto, SettingsDto, UserDto } from '../../example/mock/biz/dtos'

describe('biz mock mappers', () => {
  it('maps UserDto to domain and back without leaking wire keys', () => {
    const dto: UserDto = {
      user_id: 42,
      display_name: 'Avery Quinn',
      mail: 'aq@amg.io',
      mobile: '13800000001',
      role_code: 'admin',
      active_flag: 1,
      perm_codes: ['users:read']
    }
    const domain = mapUserDto(dto)
    expect(domain).toEqual({
      id: 42,
      name: 'Avery Quinn',
      email: 'aq@amg.io',
      phone: '13800000001',
      role: 'admin',
      status: 'active',
      permissions: ['users:read']
    })
    expect(domain).not.toHaveProperty('user_id')
    expect(domain).not.toHaveProperty('mail')

    const roundTrip = mapUserToDto(domain)
    expect(roundTrip.user_id).toBe(42)
    expect(roundTrip.display_name).toBe('Avery Quinn')
  })

  it('maps OrderDto amount cents to domain currency units', () => {
    const dto: OrderDto = {
      id: '1',
      order_no: 'ORD-10021',
      buyer_name: 'Avery',
      amount_cents: 128000,
      status_code: 'paid',
      created_at: '2026-07-12'
    }
    const domain = mapOrderDto(dto)
    expect(domain.amount).toBe(1280)
    expect(domain.orderNo).toBe('ORD-10021')
    expect(mapOrderToDto(domain).amount_cents).toBe(128000)
  })

  it('maps ContentDto status codes to domain enums', () => {
    const dto: ContentDto = {
      id: 'c1',
      title: 'Release notes',
      category_code: 'announce',
      status_code: 'published',
      updated_at: '2026-07-10'
    }
    const domain = mapContentDto(dto)
    expect(domain.status).toBe('published')
    expect(mapContentToDto(domain).status_code).toBe('published')
  })

  it('maps SettingsDto profile fields', () => {
    const dto: SettingsDto = {
      display_name: 'AMG Operator',
      mail: 'ops@example.com',
      notify_mail: true,
      notify_push: false,
      params: { sessionTimeout: 30 }
    }
    const domain = mapSettingsDto(dto)
    expect(domain.profile.displayName).toBe('AMG Operator')
    expect(domain.notifyMail).toBe(true)
    expect(mapSettingsToDto(domain).display_name).toBe('AMG Operator')
  })

  it('maps AuthResultDto to BizAuthResult', () => {
    const dto: AuthResultDto = {
      access_token: 'tok-1',
      user_id: 'admin',
      display_name: 'Admin'
    }
    expect(mapAuthResultDto(dto)).toEqual({
      token: 'tok-1',
      userId: 'admin',
      displayName: 'Admin'
    })
  })
})
