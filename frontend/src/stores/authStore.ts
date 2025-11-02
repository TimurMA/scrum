import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { authService } from '@/api/services/AuthService'
import { UserService } from '@/api/services/UserService'

export const useAuthStore = defineStore('auth', () => {
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const initUsers = async () => {
    try {
      isLoading.value = true
      const userData = await UserService.getAllUsers()
      users.value = userData
      
      if (authService.isAuthenticated()) {
        await fetchCurrentUser()
      }
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }
  
  const fetchCurrentUser = async () => {
    try {
      isLoading.value = true
      const userData = await UserService.getCurrentUser()
      currentUser.value = userData
    } catch (err: any) {
      error.value = err.message
      logout()
    } finally {
      isLoading.value = false
    }
  }

  const login = async (username: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await authService.signIn({ username, password })
      authService.saveToken(response.token)
      
      await fetchCurrentUser()
      return currentUser.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка при входе'
      throw new Error(error.value || '')
    } finally {
      isLoading.value = false
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await authService.signUp({ username, email, password })
      authService.saveToken(response.token)
      
      await fetchCurrentUser()
      return currentUser.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка при регистрации'
      throw new Error(error.value || '')
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    currentUser.value = null
  }

  const isAuthenticated = () => {
    return authService.isAuthenticated() && !!currentUser.value
  }
  
  const getUserById = (userId: string) => {
    return users.value.find((user: User) => user.id === userId)
  }
  
  const allUsers = computed(() => users.value)
  
  return {
    users,
    currentUser,
    isLoading,
    error,
    initUsers,
    login,
    register,
    logout,
    fetchCurrentUser,
    isAuthenticated,
    getUserById,
    allUsers
  }
})
