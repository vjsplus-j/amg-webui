export interface User {
  id: number
  name: string
  avatar: string
  email: string
  phone: string
  role: string
  status: 'online' | 'offline' | 'away' | 'busy'
  createTime: string
  lastLogin: string
}

/** Mock roster — Latin sample names; role codes map via i18n labels (admin/ops/dev). */
export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Avery Quinn',
    avatar: '',
    email: 'avery@example.com',
    phone: '138****8888',
    role: 'admin',
    status: 'online',
    createTime: '2024-01-15',
    lastLogin: '2024-07-14 09:30'
  },
  {
    id: 2,
    name: 'Jordan Lee',
    avatar: '',
    email: 'jordan@example.com',
    phone: '139****9999',
    role: 'ops',
    status: 'online',
    createTime: '2024-02-20',
    lastLogin: '2024-07-14 09:25'
  },
  {
    id: 3,
    name: 'Sam Rivera',
    avatar: '',
    email: 'sam@example.com',
    phone: '137****7777',
    role: 'dev',
    status: 'away',
    createTime: '2024-03-10',
    lastLogin: '2024-07-14 08:45'
  },
  {
    id: 4,
    name: 'Casey Ng',
    avatar: '',
    email: 'casey@example.com',
    phone: '136****6666',
    role: 'ops',
    status: 'offline',
    createTime: '2024-04-05',
    lastLogin: '2024-07-13 18:00'
  },
  {
    id: 5,
    name: 'Riley Chen',
    avatar: '',
    email: 'riley@example.com',
    phone: '135****5555',
    role: 'dev',
    status: 'busy',
    createTime: '2024-05-20',
    lastLogin: '2024-07-14 09:15'
  },
  {
    id: 6,
    name: 'Taylor Kim',
    avatar: '',
    email: 'taylor@example.com',
    phone: '134****4444',
    role: 'dev',
    status: 'online',
    createTime: '2024-06-01',
    lastLogin: '2024-07-14 09:00'
  }
]
