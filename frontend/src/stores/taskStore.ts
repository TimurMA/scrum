import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskTag, TaskStatus, Board } from '@/types'
import { useScrumStore } from './scrumStore'
import { useAuthStore } from './authStore'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const taskTags = ref<TaskTag[]>([])
  const boards = ref<Board[]>([])
  const currentBoardId = ref<string | null>(null)
  
  const columns = ref([
    { id: 'backlog', status: 'InBackLog' as TaskStatus, title: 'В бэклоге', color: '#64748b' },
    { id: 'new', status: 'NewTask' as TaskStatus, title: 'Новые', color: '#3B82F6' },
    { id: 'progress', status: 'InProgress' as TaskStatus, title: 'В работе', color: '#F59E0B' },
    { id: 'verify', status: 'OnVerification' as TaskStatus, title: 'На проверке', color: '#F97316' },
    { id: 'done', status: 'Done' as TaskStatus, title: 'Выполненные', color: '#10B981' }
  ])
  
  const initTasks = () => {
    const authStore = useAuthStore()
    
    
    boards.value = [
      {
        id: '1',
        sprintId: '1',
        title: 'Kanban доска'
      }
    ]
    
    currentBoardId.value = '1'
    
    tasks.value = [
      {
        id: '1',
        boardId: '1',
        scrumId: '1',
        taskTagId: '3',
        title: 'Написать документацию API',
        description: 'Документировать все эндпоинты REST API с примерами запросов и ответов',
        status: 'NewTask' as TaskStatus,
        createdAt: new Date('2025-10-01'),
        creatorId: authStore.users[0]!.id,
        executorId: authStore.users[1]!.id
      },
      {
        id: '2',
        boardId: '1',
        scrumId: '1',
        taskTagId: '1',
        title: 'Исправить баг с авторизацией',
        description: 'Пользователи не могут войти через OAuth провайдеры',
        status: 'InProgress' as TaskStatus,
        createdAt: new Date('2025-10-02'),
        creatorId: authStore.users[0]!.id,
        executorId: authStore.users[2]!.id
      },
      {
        id: '3',
        boardId: '1',
        scrumId: '1',
        taskTagId: '2',
        title: 'Построить CI/CD пайплайн',
        description: 'Настроить автоматическую сборку и деплой на staging окружение',
        status: 'OnVerification' as TaskStatus,
        createdAt: new Date('2025-10-03'),
        creatorId: authStore.users[1]!.id,
        executorId: authStore.users[0]!.id
      },
      {
        id: '4',
        boardId: '1',
        scrumId: '1',
        taskTagId: '2',
        title: 'Оптимизировать запросы к БД',
        description: 'Добавить индексы и оптимизировать медленные запросы',
        status: 'InProgress' as TaskStatus,
        createdAt: new Date('2025-10-04'),
        creatorId: authStore.users[2]!.id,
        executorId: authStore.users[3]!.id
      },
      {
        id: '5',
        boardId: '1',
        scrumId: '1',
        title: 'Новая задача',
        description: '',
        status: 'InBackLog' as TaskStatus,
        createdAt: new Date('2025-10-05'),
        creatorId: authStore.users[0]!.id,
        executorId: authStore.users[0]!.id
      }
    ]
  }
  
  const currentBoard = computed(() => {
    if (!currentBoardId.value) return null
    return boards.value.find(board => board.id === currentBoardId.value) || null
  })
  
  const tasksByStatus = computed(() => {
    const result = {
      'InBackLog': [],
      'NewTask': [],
      'InProgress': [],
      'OnVerification': [],
      'Done': []
    } as Record<TaskStatus, Task[]>
    
    tasks.value.forEach(task => {
      if (task.boardId === currentBoardId.value) {
        if (!result[task.status]) {
          result[task.status] = []
        }
        result[task.status].push(task)
      }
    })
    
    return result
  })
  
  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    const taskIndex = tasks.value.findIndex((task: Task) => task.id === taskId)
    if (taskIndex !== -1 && tasks.value[taskIndex]) {
      tasks.value[taskIndex].status = newStatus
    }
  }
  
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>): string => {
    const authStore = useAuthStore()
    if (!authStore.currentUser) throw new Error('Пользователь не авторизован')
    
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      creatorId: authStore.currentUser.id
    }
    
    tasks.value.push(newTask)
    return newTask.id
  }
  
  const updateTask = (task: Task) => {
    const taskIndex = tasks.value.findIndex((t: Task) => t.id === task.id)
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = { ...task }
    }
  }
  
  const addBoard = (title: string, sprintId?: string): string => {
    const scrumStore = useScrumStore()
    if (!scrumStore.currentScrumId) throw new Error('Не выбран Scrum проект')
    
    const newBoard: Board = {
      id: Date.now().toString(),
      title,
      sprintId
    }
    
    boards.value.push(newBoard)
    return newBoard.id
  }
  
  const addTaskTag = (tag: Omit<TaskTag, 'id'>): string => {
    const newTag: TaskTag = {
      ...tag,
      id: Date.now().toString()
    }
    
    taskTags.value.push(newTag)
    return newTag.id
  }
  
  const getTaskById = (taskId: string) => {
    return tasks.value.find((task: Task) => task.id === taskId)
  }
  
  return {
    tasks,
    taskTags,
    boards,
    columns,
    currentBoardId,
    currentBoard,
    tasksByStatus,
    initTasks,
    moveTask,
    addTask,
    updateTask,
    addBoard,
    addTaskTag,
    getTaskById
  }
})
