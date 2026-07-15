import { describe, it, expect } from 'vitest'
import { BUSINESS_MODULES } from '../../packages/constants'

describe('constants', () => {
  it('lists five business modules', () => {
    expect(BUSINESS_MODULES).toEqual(['login', 'users', 'orders', 'content', 'settings'])
  })
})
