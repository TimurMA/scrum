import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  
  const initUsers = () => {
    users.value = [
      { id: '1', email: 'alexey@example.com', username: 'alexey' },
      { id: '2', email: 'maria@example.com', username: 'maria' },
      { id: '3', email: 'dmitry@example.com', username: 'dmitry' },
      { id: '4', email: 'ekaterina@example.com', username: 'ekaterina' }
    ]
    
    currentUser.value = users.value[0] || null
  }
  
  const getUserById = (userId: string) => {
    return users.value.find((user: User) => user.id === userId)
  }
  
  const allUsers = computed(() => users.value)
  
  return {
    users,
    currentUser,
    initUsers,
    getUserById,
    allUsers
  }
})
