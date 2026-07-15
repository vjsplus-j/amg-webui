import { mockUsers, type User } from './data'

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const userService = {
  getUsers: async (params?: {
    page?: number
    size?: number
    keyword?: string
  }): Promise<{ list: User[]; total: number }> => {
    await delay()
    let list = mockUsers
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      list = list.filter(
        (u) => u.name.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw)
      )
    }
    const page = params?.page || 1
    const size = params?.size || 10
    const total = list.length
    const start = (page - 1) * size
    const end = start + size
    return { list: list.slice(start, end), total }
  },
  getUser: async (id: number): Promise<User> => {
    await delay()
    return mockUsers.find((u) => u.id === id) || mockUsers[0]
  },
  createUser: async (data: Partial<User>): Promise<User> => {
    await delay()
    const newUser: User = {
      ...data,
      id: Date.now(),
      createTime: new Date().toISOString().split('T')[0],
      lastLogin: '-',
    } as User
    mockUsers.push(newUser)
    return newUser
  },
  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    await delay()
    const index = mockUsers.findIndex((u) => u.id === id)
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...data }
    }
    return mockUsers[index]
  },
  deleteUser: async (id: number): Promise<void> => {
    await delay()
    const index = mockUsers.findIndex((u) => u.id === id)
    if (index !== -1) {
      mockUsers.splice(index, 1)
    }
  }
}
