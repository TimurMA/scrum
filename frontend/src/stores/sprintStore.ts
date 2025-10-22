import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Sprint, SprintStatus } from '@/types'
import { useScrumStore } from './scrumStore'

export const useSprintStore = defineStore('sprint', () => {
  const sprints = ref<Sprint[]>([])
  
  const initSprints = () => {
    sprints.value = [
      {
        id: '1',
        scrumId: '1',
        name: 'Спринт 1',
        goal: 'Реализовать основной функционал канбан-доски',
        startDate: new Date('2025-10-01'),
        finishDate: new Date('2025-10-15'),
        status: 'ACTIVE' as SprintStatus
      }
    ]
  }
  
  const currentSprint = computed(() => {
    const scrumStore = useScrumStore()
    if (!scrumStore.currentScrumId) return null
    
    return sprints.value.find(sprint => 
      sprint.scrumId === scrumStore.currentScrumId && 
      sprint.status === ('ACTIVE' as SprintStatus)
    ) || null
  })
  
  const scrumSprints = computed(() => {
    const scrumStore = useScrumStore()
    if (!scrumStore.currentScrumId) return []
    
    return sprints.value.filter(sprint => 
      sprint.scrumId === scrumStore.currentScrumId
    )
  })
  
  const addSprint = (sprint: Omit<Sprint, 'id'>): string => {
    const newSprint: Sprint = {
      ...sprint,
      id: Date.now().toString()
    }
    
    sprints.value.push(newSprint)
    return newSprint.id
  }
  
  const updateSprintStatus = (sprintId: string, status: SprintStatus) => {
    const sprintIndex = sprints.value.findIndex(s => s.id === sprintId)
    if (sprintIndex !== -1) {
      sprints.value[sprintIndex].status = status
    }
  }
  
  return {
    sprints,
    currentSprint,
    scrumSprints,
    initSprints,
    addSprint,
    updateSprintStatus
  }
})
