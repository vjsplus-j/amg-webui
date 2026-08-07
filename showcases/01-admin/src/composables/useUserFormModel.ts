import { reactive } from 'vue'
import type { AdminUser, AdminUserPayload } from '../mock/admin-users'

export function createEmptyUserModel(): AdminUserPayload {
  return {
    username: '',
    displayName: '',
    email: '',
    phone: '',
    department: '',
    orgId: 'org-root',
    role: 'editor',
    roleIds: ['role-editor'],
    status: 'active',
    sortOrder: 0,
    remark: ''
  }
}

export function userToModel(user: AdminUser): AdminUserPayload {
  return {
    username: user.username,
    displayName: user.displayName,
    email: user.email,
    phone: user.phone,
    department: user.department,
    orgId: user.orgId,
    role: user.role,
    roleIds: [...user.roleIds],
    status: user.status,
    sortOrder: user.sortOrder,
    remark: user.remark
  }
}

export function useUserFormModel(initial?: AdminUserPayload) {
  return reactive<AdminUserPayload>({ ...createEmptyUserModel(), ...initial })
}
