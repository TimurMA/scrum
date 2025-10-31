import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useScrumStore } from '@stores/scrumStore'
import { useTaskStore } from '@stores/taskStore'
import { useSprintStore } from '@stores/sprintStore'
import type { TaskStatus } from '@/types'

export function useScrumBoard() {
  const router = useRouter()
  const route = useRoute()
  
  const scrumStore = useScrumStore()
  const taskStore = useTaskStore()
  const sprintStore = useSprintStore()
  
  const showTaskForm = ref(false)
  const selectedTaskId = ref<string | undefined>(undefined)
  
  const initBoard = () => {
    const boardId = route.params.id as string
    if (boardId) {
      taskStore.currentBoardId = boardId
    }
  }
  
  const columns = computed(() => taskStore.columns)
  
  const tasksByStatus = computed(() => taskStore.tasksByStatus)
  
  const board = computed(() => taskStore.currentBoard)
  
  const currentScrum = computed(() => scrumStore.currentScrum)
  
  const statusLabel = computed(() => {
    switch (currentScrum.value?.status) {
      case 'ACTIVE':
        return 'Активен'
      case 'DONE':
        return 'Завершён'
      case 'DELETED':
        return 'Удалён'
      default:
        return ''
    }
  })
  
  const statusClass = computed(() => {
    switch (currentScrum.value?.status) {
      case 'ACTIVE':
        return 'text-green-600 font-medium'
      case 'DONE':
        return 'text-blue-600 font-medium'
      case 'DELETED':
        return 'text-red-600 font-medium'
      default:
        return ''
    }
  })
  
  const handleDropTask = (taskId: string, newStatus: TaskStatus) => {
    taskStore.moveTask(taskId, newStatus)
  }
  
  const openTaskForm = (taskId?: string) => {
    selectedTaskId.value = taskId
    showTaskForm.value = true
  }
  
  const closeTaskForm = () => {
    showTaskForm.value = false
    selectedTaskId.value = undefined
  }
  
  const closeOnOutsideClick = () => {
    showTaskForm.value = false
    selectedTaskId.value = undefined
  }
  
  return {
    showTaskForm,
    selectedTaskId,
    columns,
    tasksByStatus,
    board,
    currentScrum,
    statusLabel,
    statusClass,
    initBoard,
    handleDropTask,
    openTaskForm,
    closeTaskForm,
    closeOnOutsideClick
  }
}
