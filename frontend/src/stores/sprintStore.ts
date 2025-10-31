import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Sprint, SprintStatus } from '@/types'
import { useScrumStore } from './scrumStore'
import { useTaskStore } from './taskStore'

export const useSprintStore = defineStore('sprint', () => {
  const sprints = ref<Sprint[]>([])
  const currentSprintId = ref<string | null>(null)
  
  const calculateSprintStatus = (sprint: Sprint): SprintStatus => {
    const now = new Date()
    const startDate = new Date(sprint.startDate)
    const finishDate = new Date(sprint.finishDate)
    
    if (now >= startDate && now <= finishDate) {
      return 'ACTIVE'
    }
    
    if (now > finishDate) {
      return 'DONE'
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
        status: 'DONE' as SprintStatus
      },
      {
        id: '2',
        scrumId: '1',
        name: 'Спринт 2',
        goal: 'Исправить баги и добавить интеграцию с API',
        startDate: new Date('2025-09-25'),
        finishDate: new Date('2025-10-15'),
        status: 'DONE' as SprintStatus
      },
      {
        id: '3',
        scrumId: '1',
        name: 'Спринт 3',
        goal: 'Добавить функциональность экспорта данных',
        startDate: new Date('2025-10-09'),
        finishDate: new Date('2025-10-26'),
        status: 'DONE' as SprintStatus
      },
      {
        id: '4',
        scrumId: '1',
        name: 'Спринт 4',
        goal: 'Улучшить пользовательский интерфейс',
        startDate: new Date('2025-10-23'),
        finishDate: new Date('2025-11-06'),
        status: 'ACTIVE' as SprintStatus
      }
    ]
    
    updateSprintStatuses()
    
    const active = sprints.value.find(s => s.status === 'ACTIVE')
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
      sprint.status === ('ACTIVE' as SprintStatus)
    ) || null
  })
  
  const scrumSprints = computed(() => {
    const scrumStore = useScrumStore()
    if (!scrumStore.currentScrumId) return []
    
    return sprints.value.filter(sprint => 
      sprint.scrumId === scrumStore.currentScrumId
    ).sort((a, b) => {
      if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1
      if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })
  })
  
  const sprintTasks = computed(() => {
    if (!currentSprint.value) return []
    
    const taskStore = useTaskStore()
    return taskStore.tasks.filter(task => {
      const board = taskStore.boards.find(board => board.sprintId === currentSprint.value?.id)
      return task.boardId === board?.id
    })
  })
  
  const getSprintById = (id: string) => {
    return sprints.value.find(sprint => sprint.id === id)
  }
  
  const addSprint = (sprint: Omit<Sprint, 'id'>): string => {
    const newSprint: Sprint = {
      ...sprint,
      id: Date.now().toString()
    }
    
    sprints.value.push(newSprint)
    return newSprint.id
  }
  
  const updateSprint = (sprint: Sprint) => {
    const index = sprints.value.findIndex(s => s.id === sprint.id)
    if (index !== -1) {
      sprints.value[index] = { ...sprint }
    }
  }
  
  const updateSprintStatus = (sprintId: string, status: SprintStatus) => {
    const sprintIndex = sprints.value.findIndex(s => s.id === sprintId)
    if (sprintIndex !== -1) {
      sprints.value[sprintIndex].status = status
      
      if (status === 'ACTIVE') {
        currentSprintId.value = sprintId
        
        sprints.value.forEach((s) => {
          if (s.id !== sprintId && s.status === 'ACTIVE') {
            s.status = 'DONE'
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
          boardId: board!.id
        })
      }
    })
  }
  
  const updateSprintStatuses = () => {
    sprints.value.forEach(sprint => {
      const calculatedStatus = calculateSprintStatus(sprint)
      
      if (sprint.status !== calculatedStatus && 
          !(calculatedStatus === 'ACTIVE' && sprint.status === 'DONE')) {
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

  return {
    sprints,
    currentSprintId,
    currentSprint,
    scrumSprints,
    sprintTasks,
    initSprints,
    getSprintById,
    addSprint,
    updateSprint,
    updateSprintStatus,
    addTasksToSprint,
    updateSprintStatuses
  }
})
