import { ref, computed } from 'vue'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  roles: string[]
}

const currentUser = ref<User | null>(null)
const isAuthenticated = ref(false)
const token = ref<string | null>(localStorage.getItem('amg-webui-token'))

const mockUsers: Record<string, { username: string; email: string; password: string; roles: string[] }> = {
  'admin': {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    roles: ['admin']
  },
  'user': {
    username: 'user',
    email: 'user@example.com',
    password: 'user123',
    roles: ['user']
  }
}

export function useAuth() {
  const login = async (username: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const user = mockUsers[username.toLowerCase()]
    if (user && user.password === password) {
      currentUser.value = {
        id: username,
        username: user.username,
        email: user.email,
        roles: user.roles
      }
      isAuthenticated.value = true
      token.value = `token-${Date.now()}`
      localStorage.setItem('amg-webui-token', token.value!)
      localStorage.setItem('amg-webui-user', JSON.stringify(currentUser.value))
      return true
    }
    return false
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (mockUsers[username.toLowerCase()]) {
      return false
    }
    
    mockUsers[username.toLowerCase()] = {
      username,
      email,
      password,
      roles: ['user']
    }
    
    currentUser.value = {
      id: username,
      username,
      email,
      roles: ['user']
    }
    isAuthenticated.value = true
    token.value = `token-${Date.now()}`
    localStorage.setItem('amg-webui-token', token.value!)
    localStorage.setItem('amg-webui-user', JSON.stringify(currentUser.value))
    return true
  }

  const logout = () => {
    currentUser.value = null
    isAuthenticated.value = false
    token.value = null
    localStorage.removeItem('amg-webui-token')
    localStorage.removeItem('amg-webui-user')
  }

  const init = () => {
    const storedUser = localStorage.getItem('amg-webui-user')
    if (storedUser) {
      try {
        currentUser.value = JSON.parse(storedUser)
        isAuthenticated.value = true
      } catch {
        logout()
      }
    }
  }

  const isAdmin = computed(() => currentUser.value?.roles.includes('admin') ?? false)

  return {
    currentUser,
    isAuthenticated,
    token,
    login,
    register,
    logout,
    init,
    isAdmin
  }
}
