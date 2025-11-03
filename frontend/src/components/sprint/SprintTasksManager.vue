<template>
  <div class="bg-white p-6 custom-scrollbar max-h-[80vh] overflow-y-auto">
    <div v-if="sprint" class="mb-6">
      <h3 class="text-lg font-medium text-gray-900 mb-1">{{ sprint.name }}</h3>
      <p v-if="sprint.goal" class="text-gray-600">{{ sprint.goal }}</p>
      <div class="flex items-center gap-2 mt-2">
        <span 
          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
          :class="sprint.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
        >
          {{ sprint.status === 'Active' ? 'Активен' : 'Завершен' }}
        </span>
        <span class="text-sm text-gray-500">
          {{ formatDateRange(sprint.startDate, sprint.finishDate) }}
        </span>
      </div>
    </div>
    
    <div class="flex flex-col md:flex-row md:space-x-6">
      <div class="w-full md:w-1/2">
        <div class="bg-gray-50 p-4 rounded-md">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-gray-900">Задачи в бэклоге</h3>
            <span class="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
              {{ backlogTasks.length }}
            </span>
          </div>
          
          <div class="mb-3">
            <div class="relative">
              <input 
                type="text" 
                v-model="backlogSearchQuery" 
                placeholder="Поиск задач" 
                class="w-full px-3 py-2 pl-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="overflow-y-auto max-h-96 custom-scrollbar">
            <div v-if="filteredBacklogTasks.length === 0" class="p-4 text-center text-gray-500">
              Нет задач в бэклоге
            </div>
            <div v-else class="space-y-2">
              <div 
                v-for="task in filteredBacklogTasks" 
                :key="task.id" 
                class="bg-white p-3 rounded shadow-sm hover:shadow-md border-l-4 border-gray-400 flex justify-between items-center"
              >
                <div>
                  <div class="font-medium text-gray-900">{{ task.title }}</div>
                  <div v-if="task.description" class="text-xs text-gray-500 truncate max-w-xs">{{ task.description }}</div>
                </div>
                <button 
                  @click="addTaskToSprint(task.id)"
                  class="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md px-2 py-1 text-xs"
                >
                  <span class="mr-1">+</span> В спринт
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="w-full md:w-1/2 mt-6 md:mt-0">
        <div class="bg-gray-50 p-4 rounded-md">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-gray-900">Задачи в спринте</h3>
            <span class="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
              {{ sprintTasks.length }}
            </span>
          </div>
          
          <div class="mb-3">
            <div class="relative">
              <input 
                type="text" 
                v-model="sprintSearchQuery" 
                placeholder="Поиск задач" 
                class="w-full px-3 py-2 pl-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div class="overflow-y-auto max-h-96 custom-scrollbar">
            <div v-if="filteredSprintTasks.length === 0" class="p-4 text-center text-gray-500">
              Нет задач в спринте
            </div>
            <div v-else class="space-y-2">
              <div 
                v-for="task in filteredSprintTasks" 
                :key="task.id" 
                class="bg-white p-3 rounded shadow-sm hover:shadow-md border-l-4 border-blue-400 flex justify-between items-center"
              >
                <div>
                  <div class="font-medium text-gray-900">{{ task.title }}</div>
                  <div v-if="task.description" class="text-xs text-gray-500 truncate max-w-xs">{{ task.description }}</div>
                  <div class="text-xs text-blue-500 mt-1">
                    Статус: {{ getStatusName(task.status) }}
                  </div>
                </div>
                <button 
                  @click="removeTaskFromSprint(task.id)"
                  class="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-md px-2 py-1 text-xs"
                >
                  <span class="mr-1">-</span> В бэклог
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex justify-end gap-3 mt-6">
      <BaseButton
        variant="secondary"
        type="button"
        @click="$emit('cancel')"
      >
        Закрыть
      </BaseButton>
      <BaseButton
        variant="primary"
        type="button"
        @click="$emit('submit')"
      >
        Готово
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BaseButton from '@components/common/BaseButton.vue'
import { useSprintStore } from '@stores/sprintStore'
import { useTaskStore } from '@stores/taskStore'
import type { Task, TaskStatus } from '@/types'

interface Props {
  sprintId?: string
}

const props = withDefaults(defineProps<Props>(), {
  sprintId: undefined
})

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const sprintStore = useSprintStore()
const taskStore = useTaskStore()

const backlogSearchQuery = ref('')
const sprintSearchQuery = ref('')
const tasksToAdd = ref<string[]>([])

const sprint = computed(() => {
  if (!props.sprintId) return null
  return sprintStore.getSprintById(props.sprintId)
})

const backlogTasks = computed(() => {
  return taskStore.tasks.filter(task => task.status === 'InBackLog')
})

const sprintTasks = computed(() => {
  if (!props.sprintId) return []
  
  return taskStore.tasks.filter(task => task.sprintId === props.sprintId)
})

const filteredBacklogTasks = computed(() => {
  if (!backlogSearchQuery.value) return backlogTasks.value
  
  const query = backlogSearchQuery.value.toLowerCase()
  return backlogTasks.value.filter(task => 
    task.title.toLowerCase().includes(query) ||
    (task.description && task.description.toLowerCase().includes(query))
  )
})

const filteredSprintTasks = computed(() => {
  if (!sprintSearchQuery.value) return sprintTasks.value
  
  const query = sprintSearchQuery.value.toLowerCase()
  return sprintTasks.value.filter(task => 
    task.title.toLowerCase().includes(query) ||
    (task.description && task.description.toLowerCase().includes(query))
  )
})

const formatDateRange = (start: Date, end: Date) => {
  const startDate = new Date(start).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit'
  })
  
  const endDate = new Date(end).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  
  return `${startDate} - ${endDate}`
}

const getStatusName = (status: TaskStatus) => {
  const statusMap: Record<TaskStatus, string> = {
    'InBackLog': 'В бэклоге',
    'NewTask': 'Новая',
    'InProgress': 'В работе',
    'OnVerification': 'На проверке',
    'Done': 'Выполнена'
  }
  return statusMap[status] || status
}

const addTaskToSprint = (taskId: string) => {
  if (!props.sprintId) return
  sprintStore.addTasksToSprint(props.sprintId, [taskId])
}

const removeTaskFromSprint = async (taskId: string) => {
  const task = taskStore.getTaskById(taskId)
  if (task) {
    await taskStore.updateTask({
      ...task,
      status: 'InBackLog',
      sprintId: undefined
    })
  }
}

onMounted(() => {
})
</script>
