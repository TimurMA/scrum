import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/taskStore'
import type { Task, TaskStatus } from '../types'

export function useTaskManagement() {
  const taskStore = useTaskStore()
  // const authStore = useAuthStore()
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const createTask = async (taskData: {
    title: string
    description: string
    status: TaskStatus
    executorId: string
    taskTagId: string
    boardId: string
    scrumId: string
    creatorId: string
  }) => {
    isLoading.value = true
    error.value = null
    
    try {
      const taskId = taskStore.addTask({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        executorId: taskData.executorId,
        taskTagId: taskData.taskTagId,
        boardId: taskData.boardId,
        scrumId: taskData.scrumId,
        creatorId: taskData.creatorId
      })
      
      return taskId
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка при создании задачи'
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const task = taskStore.getTaskById(taskId)
      if (!task) {
        throw new Error('Задача не найдена')
      }
      
      taskStore.updateTask({
        ...task,
        ...taskData
      })
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка при обновлении задачи'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  const changeTaskStatus = async (taskId: string, status: TaskStatus) => {
    isLoading.value = true
    error.value = null
    
    try {
      taskStore.moveTask(taskId, status)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Ошибка при изменении статуса задачи'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  const tasksByStatus = computed(() => taskStore.tasksByStatus)
  
  const columns = computed(() => taskStore.columns)
  
  return {
    isLoading,
    error,
    createTask,
    updateTask,
    changeTaskStatus,
    tasksByStatus,
    columns
  }
}
