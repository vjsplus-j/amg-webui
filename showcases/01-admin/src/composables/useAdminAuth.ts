import { computed, ref } from 'vue'

const AUTH_KEY = 'showcase-01-admin-auth'
const USER_KEY = 'showcase-01-admin-user'
const PERMS_KEY = 'showcase-01-admin-perms'

export interface AuthSession {
  username: string
  permissions: string[]
}

const authenticated = ref(false)
const remembered = ref(false)
const username = ref('admin')
const permissionKeys = ref<string[]>([])

function readSession() {
  if (typeof sessionStorage === 'undefined') return
  authenticated.value = sessionStorage.getItem(AUTH_KEY) === '1'
  username.value = sessionStorage.getItem(USER_KEY) ?? 'admin'
  const raw = sessionStorage.getItem(PERMS_KEY)
  permissionKeys.value = raw ? JSON.parse(raw) : []
}

readSession()

export function useAdminAuth() {
  const isAuthenticated = computed(() => authenticated.value)

  function hasPermission(key: string) {
    return permissionKeys.value.includes(key)
  }

  function login(session: AuthSession, remember = false) {
    authenticated.value = true
    remembered.value = remember
    username.value = session.username
    permissionKeys.value = [...session.permissions]

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(AUTH_KEY, '1')
      sessionStorage.setItem(USER_KEY, username.value)
      sessionStorage.setItem(PERMS_KEY, JSON.stringify(permissionKeys.value))
    }
    if (typeof localStorage !== 'undefined') {
      if (remember) {
        localStorage.setItem(AUTH_KEY, '1')
        localStorage.setItem(USER_KEY, username.value)
        localStorage.setItem(PERMS_KEY, JSON.stringify(permissionKeys.value))
      } else {
        localStorage.removeItem(AUTH_KEY)
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(PERMS_KEY)
      }
    }
  }

  function logout() {
    authenticated.value = false
    remembered.value = false
    username.value = 'admin'
    permissionKeys.value = []
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(AUTH_KEY)
      sessionStorage.removeItem(USER_KEY)
      sessionStorage.removeItem(PERMS_KEY)
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUTH_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(PERMS_KEY)
    }
  }

  function initFromStorage() {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(AUTH_KEY) === '1') {
      authenticated.value = true
      remembered.value = true
      username.value = localStorage.getItem(USER_KEY) ?? 'admin'
      const raw = localStorage.getItem(PERMS_KEY)
      permissionKeys.value = raw ? JSON.parse(raw) : []
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(AUTH_KEY, '1')
        sessionStorage.setItem(USER_KEY, username.value)
        sessionStorage.setItem(PERMS_KEY, JSON.stringify(permissionKeys.value))
      }
      return
    }
    readSession()
  }

  return {
    isAuthenticated,
    remembered,
    username: computed(() => username.value),
    permissionKeys: computed(() => permissionKeys.value),
    hasPermission,
    login,
    logout,
    initFromStorage
  }
}
