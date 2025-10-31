<template>
  <div>
    <div class="container mx-auto py-6 px-4">
      <TabNavigation :tabs="tabs" />
      
      <div class="flex justify-between items-center mb-6">
        <div class="kanban-header">
          <h1>{{ board?.title || 'Kanban доска' }}</h1>
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
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KanbanColumn
          v-for="column in visibleColumns"
          :key="column.id"
          :column="column"
          :tasks="tasksByStatus[column.status]"
          @task-click="openTaskForm"
          @drop-task="handleDropTask"
        />
      </div>
    </div>
    
    <BaseModal
      v-model="showTaskForm"
      title="Задача"
    >
      <TaskForm
        :task-id="selectedTaskId"
        context="board"
        @submit="closeTaskForm"
        @cancel="closeTaskForm"
      />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useScrumBoard } from '../../composables/useScrumBoard'
import KanbanColumn from '../../components/kanban/KanbanColumn.vue'
import TaskForm from '../../components/kanban/TaskForm.vue'
import BaseButton from '../../components/common/BaseButton.vue'
import BaseModal from '../../components/common/BaseModal.vue'
import TabNavigation from '../../components/common/TabNavigation.vue'

import { useTaskStore } from '../../stores/taskStore'
import { useScrumStore } from '../../stores/scrumStore'
import { useAuthStore } from '../../stores/authStore'
import { useSprintStore } from '../../stores/sprintStore'

const taskStore = useTaskStore()
const scrumStore = useScrumStore()
const authStore = useAuthStore()
const sprintStore = useSprintStore()

const {
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
  closeTaskForm
} = useScrumBoard()

// Tabs configuration
const tabs = [
  { name: 'backlog', label: 'Бэклог', path: '/backlog' },
  { name: 'board', label: 'Доска', path: '/board/1' },
  { name: 'sprints', label: 'Спринты', path: '/sprints' }
]

// Filter out the 'InBackLog' column
const visibleColumns = computed(() => {
  return columns.value.filter(column => column.status !== 'InBackLog')
})

onMounted(() => {
  authStore.initUsers()
  scrumStore.initScrums()
  sprintStore.initSprints()
  taskStore.initTasks()
  
  initBoard()
})
</script>

<style scoped>
.kanban-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
</style>
