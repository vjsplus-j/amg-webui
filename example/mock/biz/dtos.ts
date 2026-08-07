/** Backend wire shapes — never imported by business UI components. */

export interface UserDto {
  user_id: number
  display_name: string
  mail: string
  mobile?: string
  role_code: string
  active_flag: 0 | 1
  avatar_url?: string
  perm_codes?: string[]
}

export interface OrderDto {
  id: string
  order_no: string
  buyer_name: string
  amount_cents: number
  status_code: string
  created_at: string
  refundable?: boolean
  timeline?: { at: string; label: string }[]
  remark?: string
}

export interface ContentDto {
  id: string
  title: string
  category_code: string
  status_code: string
  updated_at: string
  summary?: string
  body?: string
}

export interface SettingsDto {
  display_name: string
  mail: string
  notify_mail: boolean
  notify_push: boolean
  params: Record<string, string | number | boolean>
}

export interface AuthResultDto {
  access_token: string
  user_id: string | number
  display_name?: string
}
