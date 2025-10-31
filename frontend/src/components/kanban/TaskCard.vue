<template>
  <div 
    class="bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
    @click="$emit('click')"
  >
    <div class="absolute left-0 top-0 bottom-0 w-1" :style="{ backgroundColor: statusColor }"></div>
    <div class="pl-2">
    <div class="flex justify-between items-start mb-2">
      <h4 class="font-medium text-gray-900">{{ task.title }}</h4>
      <div 
        v-if="task.taskTagId" 
        class="px-2 py-0.5 text-xs rounded-full"
        :style="{ backgroundColor: tagColor, color: getContrastColor(tagColor) }"
      >
        {{ tagName }}
      </div>
    </div>
    
    <p v-if="task.description" class="text-sm text-gray-600 mb-3 line-clamp-2">
      {{ task.description }}
    </p>
    
    <div class="flex justify-between items-center mt-2">
      <div class="text-xs text-gray-500">
        {{ formatDate(task.createdAt) }}
      </div>
      
      <div v-if="task.executorId" class="flex items-center">
        <div class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
          {{ executorInitials }}
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTaskStore } from '@stores/taskStore'
import { useAuthStore } from '@stores/authStore'
import type { Task } from '@/types'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const taskStore = useTaskStore()
const authStore = useAuthStore()

const tagName = computed(() => {
  if (!props.task.taskTagId) return ''
  const tag = taskStore.taskTags.find(t => t.id === props.task.taskTagId)
  return tag?.name || ''
})

const tagColor = computed(() => {
  if (!props.task.taskTagId) return ''
  const tag = taskStore.taskTags.find(t => t.id === props.task.taskTagId)
  return tag?.color || '#3b82f6'
})

const statusColor = computed(() => {
  const column = taskStore.columns.find(col => col.status === props.task.status)
  return column?.color || '#64748b'
})

const executorInitials = computed(() => {
  if (!props.task.executorId) return ''
  const user = authStore.getUserById(props.task.executorId)
  if (!user || !user.username) return ''
  
  return user.username.substring(0, 2).toUpperCase()
})

const formatDate = (date: Date): string => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ru-RU')
}

const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  
  return brightness > 128 ? '#000000' : '#FFFFFF'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}
</style>
