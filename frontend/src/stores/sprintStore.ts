import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Sprint, SprintStatus } from '@/types'
import { useScrumStore } from './scrumStore'
import { useTaskStore } from './taskStore'
import { sprintService } from '@/api/services/SprintService'

export const useSprintStore = defineStore('sprint', () => {
  const sprints = ref<Sprint[]>([])
  const currentSprintId = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const calculateSprintStatus = (sprint: Sprint): SprintStatus => {
    const now = new Date()
    const startDate = new Date(sprint.startDate)
    const finishDate = new Date(sprint.finishDate)
    
    if (now >= startDate && now <= finishDate) {
      return 'Active'
    }
    
    if (now > finishDate) {
      return 'Done'
    }
    
    return sprint.status
  }
  
  const initSprints = () => {
    sprints.value = [
      {
        id: '1',
        scrumId: '1',
        name: 'Спринт 1',
        goal: 'Реализовать основной функционал канбан-доски',
        startDate: new Date('2025-09-08'),
        finishDate: new Date('2025-09-15'),
        status: 'Done' as SprintStatus
      },
      {
        id: '2',
        scrumId: '1',
        name: 'Спринт 2',
        goal: 'Исправить баги и добавить интеграцию с API',
        startDate: new Date('2025-09-25'),
        finishDate: new Date('2025-10-15'),
        status: 'Done' as SprintStatus
      },
      {
        id: '3',
        scrumId: '1',
        name: 'Спринт 3',
        goal: 'Добавить функциональность экспорта данных',
        startDate: new Date('2025-10-09'),
        finishDate: new Date('2025-10-26'),
        status: 'Done' as SprintStatus
      },
      {
        id: '4',
        scrumId: '1',
        name: 'Спринт 4',
        goal: 'Улучшить пользовательский интерфейс',
        startDate: new Date('2025-10-23'),
        finishDate: new Date('2025-11-06'),
        status: 'Active' as SprintStatus
      }
    ]
    
    updateSprintStatuses()
    
    const active = sprints.value.find(s => s.status === 'Active')
    if (active) {
      currentSprintId.value = active.id
    }
  }
  
  const currentSprint = computed(() => {
    if (currentSprintId.value) {
      return sprints.value.find(sprint => sprint.id === currentSprintId.value) || null
    }
    
    const scrumStore = useScrumStore()
    if (!scrumStore.currentScrumId) return null
    
    return sprints.value.find(sprint => 
      sprint.scrumId === scrumStore.currentScrumId && 
      sprint.status === ('Active' as SprintStatus)
    ) || null
  })
  
  const scrumSprints = computed(() => {
    const scrumStore = useScrumStore()
    if (!scrumStore.currentScrumId) return []
    
    return sprints.value.filter(sprint => 
      sprint.scrumId === scrumStore.currentScrumId
    ).sort((a, b) => {
      if (a.status === 'Active' && b.status !== 'Active') return -1
      if (a.status !== 'Active' && b.status === 'Active') return 1
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })
  })
  
  const sprintTasks = computed(() => {
    if (!currentSprint.value) return []
    
    const taskStore = useTaskStore()
    return taskStore.tasks.filter(task => 
      task.sprintId === currentSprint.value?.id
    )
  })
  
  const getSprintById = (id: string) => {
    return sprints.value.find(sprint => sprint.id === id)
  }
  
  const addSprint = async (sprint: Omit<Sprint, 'id'>): Promise<string | null> => {
    try {
      isLoading.value = true
      error.value = null
      
      const newSprint = await sprintService.createSprint(sprint)
      sprints.value.push(newSprint)
      
      return newSprint.id
    } catch (err: any) {
      error.value = err.message || 'Ошибка при создании спринта'
      console.error('Error creating sprint:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  const updateSprint = async (sprint: Sprint): Promise<boolean> => {
    try {
      isLoading.value = true
      error.value = null
      
      const updatedSprint = await sprintService.updateSprint(sprint)
      
      const index = sprints.value.findIndex(s => s.id === sprint.id)
      if (index !== -1) {
        sprints.value[index] = { ...updatedSprint }
      }
      
      return true
    } catch (err: any) {
      error.value = err.message || 'Ошибка при обновлении спринта'
      console.error('Error updating sprint:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  const updateSprintStatus = (sprintId: string, status: SprintStatus) => {
    const sprintIndex = sprints.value.findIndex(s => s.id === sprintId)
    if (sprintIndex !== -1) {
      sprints.value[sprintIndex].status = status
      
      if (status === 'Active') {
        currentSprintId.value = sprintId
        
        sprints.value.forEach((s) => {
          if (s.id !== sprintId && s.status === 'Active') {
            s.status = 'Done'
          }
        })
      }
    }
  }
  
  const addTasksToSprint = (sprintId: string, taskIds: string[]) => {
    const sprint = getSprintById(sprintId)
    if (!sprint) return
    
    const taskStore = useTaskStore()
    
    let board = taskStore.boards.find(board => board.sprintId === sprintId)
    
    if (!board) {
      const boardId = taskStore.addBoard(`Спринт ${sprint.name}`, sprintId)
      board = taskStore.boards.find(b => b.id === boardId)
      if (!board) return
    }
    
    taskIds.forEach(taskId => {
      const task = taskStore.getTaskById(taskId)
      if (task) {
        taskStore.updateTask({
          ...task,
          status: 'NewTask',
          sprintId: sprintId
        })
      }
    })
  }
  
  const updateSprintStatuses = () => {
    sprints.value.forEach(sprint => {
      const calculatedStatus = calculateSprintStatus(sprint)
      
      if (sprint.status !== calculatedStatus && 
          !(calculatedStatus === 'Active' && sprint.status === 'Done')) {
        sprint.status = calculatedStatus
      }
    })
  }
  
  watch(sprints, () => {
    updateSprintStatuses()
  }, { deep: true })
  
  if (typeof window !== 'undefined') {
    setInterval(() => {
      updateSprintStatuses()
    }, 3600000)
  }

  const loadSprints = async (scrumId: string): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null
      
      const sprintsData = await sprintService.getAllSprints(scrumId)
      sprints.value = sprintsData
      
      updateSprintStatuses()
      
      const active = sprints.value.find(s => s.status === 'Active')
      if (active) {
        currentSprintId.value = active.id
      }
    } catch (err: any) {
      error.value = err.message || 'Ошибка при загрузке спринтов'
      console.error('Error loading sprints:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    sprints,
    currentSprintId,
    currentSprint,
    scrumSprints,
    sprintTasks,
    isLoading,
    error,
    initSprints,
    loadSprints,
    getSprintById,
    addSprint,
    updateSprint,
    updateSprintStatus,
    addTasksToSprint,
    updateSprintStatuses
  }
})
