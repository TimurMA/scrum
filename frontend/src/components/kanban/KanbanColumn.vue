<template>
  <div 
    class="bg-gray-50 rounded-lg p-4 min-h-[500px] flex flex-col"
    @dragover.prevent
    @drop="onDrop"
  >
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center">
        <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: column.color }"></div>
        <h3 class="font-medium">{{ column.title }}</h3>
      </div>
      <span class="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
        {{ tasks.length }}
      </span>
    </div>
    
    <div class="flex-grow overflow-y-auto custom-scrollbar">
      <div v-if="tasks.length === 0" class="h-full flex items-center justify-center">
        <p class="text-gray-400 text-sm">Нет задач</p>
      </div>
      
      <div v-else class="space-y-3">
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @click="$emit('task-click', task.id)"
          draggable="true"
          @dragstart="onDragStart($event, task.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TaskCard from './TaskCard.vue'
import type { Column, Task, TaskStatus } from '../../types'

const props = defineProps<{
  column: Column
  tasks: Task[]
}>()

const emit = defineEmits<{
  (e: 'task-click', taskId: string): void
  (e: 'drop-task', taskId: string, status: TaskStatus): void
}>()

const onDragStart = (event: DragEvent, taskId: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('taskId', taskId)
  }
}

const onDrop = (event: DragEvent) => {
  if (event.dataTransfer) {
    const taskId = event.dataTransfer.getData('taskId')
    emit('drop-task', taskId, props.column.status)
  }
}
</script>
