import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Scrum, ScrumStatus } from '@/types'
import { useAuthStore } from './authStore'

export const useScrumStore = defineStore('scrum', () => {
  const scrums = ref<Scrum[]>([])
  const currentScrumId = ref<string | null>(null)
  
  const initScrums = () => {
    const authStore = useAuthStore()
    
    scrums.value = [
      {
        id: '1',
        name: 'Проект Канбан',
        status: 'ACTIVE' as ScrumStatus,
        creatorId: authStore.currentUser?.id || '1'
      }
    ]
    
    currentScrumId.value = '1'
  }
  
  const currentScrum = computed(() => {
    if (!currentScrumId.value) return null
    return scrums.value.find((scrum: Scrum) => scrum.id === currentScrumId.value) || null
  })
  
  const userScrums = computed(() => {
    const authStore = useAuthStore()
    if (!authStore.currentUser) return []
    
    return scrums.value.filter((scrum: Scrum) => 
      scrum.creatorId === authStore.currentUser?.id
    )
  })
  
  const addScrum = (name: string): string => {
    const authStore = useAuthStore()
    if (!authStore.currentUser) throw new Error('Пользователь не авторизован')
    
    const newScrum: Scrum = {
      id: Date.now().toString(),
      name,
      status: 'ACTIVE' as ScrumStatus,
      creatorId: authStore.currentUser.id
    }
    
    scrums.value.push(newScrum)
    return newScrum.id
  }
  
  const updateScrumStatus = (scrumId: string, status: ScrumStatus) => {
    const scrumIndex = scrums.value.findIndex((s: Scrum) => s.id === scrumId)
    if (scrumIndex !== -1) {
      scrums.value[scrumIndex].status = status
    }
  }
  
  return {
    scrums,
    currentScrumId,
    currentScrum,
    userScrums,
    initScrums,
    addScrum,
    updateScrumStatus
  }
})
