<template>
  <div>
    <div class="container mx-auto py-6 px-4">
      <TabNavigation :tabs="tabs" />
      
      <div class="flex justify-between items-center mb-6">
        <div class="kanban-header">
          <h1>Бэклог</h1>
          <p v-if="currentScrum" class="text-gray-500 text-sm">
            Проект: {{ currentScrum.name }} | 
            <span :class="statusClass">{{ statusLabel }}</span>
          </p>
        </div>
        
        <BaseButton variant="primary" @click="openTaskForm">
          <span class="text-lg mr-1">+</span>
          Добавить задачу
        </BaseButton>
      </div>
      
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: backlogColumn.color }"></div>
            <h3 class="font-medium">{{ backlogColumn.title }}</h3>
          </div>
          <span class="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
            {{ backlogTasks.length }}
          </span>
        </div>
        
        <div class="space-y-3 mt-4">
          <div v-if="backlogTasks.length === 0" class="h-full flex items-center justify-center py-12">
            <p class="text-gray-400 text-sm">Нет задач в бэклоге</p>
          </div>
          
          <TaskCard
            v-for="task in backlogTasks"
            :key="task.id"
            :task="task"
            @click="openTaskForm(task.id)"
          />
        </div>
      </div>
    </div>
    
    <BaseModal
      v-model="showTaskForm"
      title="Задача"
    >
      <TaskForm
        :task-id="selectedTaskId"
        context="backlog"
        @submit="closeTaskForm"
        @cancel="closeTaskForm"
      />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TaskCard from '@components/kanban/TaskCard.vue'
import TaskForm from '@components/kanban/TaskForm.vue'
import BaseButton from '@components/common/BaseButton.vue'
import BaseModal from '@components/common/BaseModal.vue'
import TabNavigation from '@components/common/TabNavigation.vue'

import { useTaskStore } from '@stores/taskStore'
import { useScrumStore } from '@stores/scrumStore'
import { useAuthStore } from '@stores/authStore'
import { useSprintStore } from '@stores/sprintStore'

const router = useRouter()
const route = useRoute()
const taskStore = useTaskStore()
const scrumStore = useScrumStore()
const authStore = useAuthStore()
const sprintStore = useSprintStore()

const showTaskForm = ref(false)
const selectedTaskId = ref<string | undefined>(undefined)

const backlogColumn = computed(() => {
  return taskStore.columns.find(column => column.status === 'InBackLog') || {
    id: 'backlog',
    status: 'InBackLog',
    title: 'В бэклоге',
    color: '#64748b'
  }
})

const backlogTasks = computed(() => {
  return taskStore.tasksByStatus['InBackLog'] || []
})

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

const openTaskForm = (taskId?: string) => {
  selectedTaskId.value = taskId
  showTaskForm.value = true
}

const closeTaskForm = () => {
  showTaskForm.value = false
  selectedTaskId.value = undefined
}

const tabs = [
  { name: 'backlog', label: 'Бэклог', path: '/backlog' },
  { name: 'board', label: 'Доска', path: '/board/1' },
  { name: 'sprints', label: 'Спринты', path: '/sprints' }
]

onMounted(() => {
  authStore.initUsers()
  scrumStore.initScrums()
  sprintStore.initSprints()
  taskStore.initTasks()
})
</script>

<style scoped>
.kanban-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
</style>
