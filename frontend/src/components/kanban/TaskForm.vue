<template>
  <div class="bg-white rounded-lg shadow-md p-6 custom-scrollbar max-h-[80vh] overflow-y-auto">
    <h2 class="text-lg font-semibold mb-4">{{ isEdit ? 'Редактировать задачу' : 'Создать задачу' }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Название</label>
        <input
          id="title"
          v-model="taskData.title"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div class="mb-4">
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
        <textarea
          id="description"
          v-model="taskData.description"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none overflow-hidden"
        ></textarea>
      </div>
      
      <StatusSelector
        v-if="showStatusSelector && isEdit"
        id="status"
        v-model="taskData.status"
        label="Статус"
        placeholder="Выберите статус"
      />
      
      <UserSelector
        id="assignee"
        v-model="taskData.executorId"
        label="Исполнитель"
        placeholder="Выберите исполнителя"
      />
      
      <TagSelector
        id="tag"
        v-model="taskData.taskTagId"
        label="Тег"
        placeholder="Выберите или введите свой тег"
      />
      
      <div class="flex justify-end gap-2 mt-6">
        <BaseButton
          variant="secondary"
          type="button"
          @click="$emit('cancel')"
        >
          Отмена
        </BaseButton>
        <BaseButton
          variant="primary"
          type="submit"
        >
          {{ isEdit ? 'Сохранить' : 'Создать' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useScrumStore } from '@stores/scrumStore'
import { useTaskStore } from '@stores/taskStore'
import { useAuthStore } from '@stores/authStore'
import type { TaskStatus } from '@/types'

import BaseButton from '@components/common/BaseButton.vue'
import TagSelector from './TagSelector.vue'
import StatusSelector from './StatusSelector.vue'
import UserSelector from './UserSelector.vue'

const props = defineProps<{
  taskId?: string,
  context?: 'backlog' | 'board'
}>()

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const taskStore = useTaskStore()
const scrumStore = useScrumStore()
const authStore = useAuthStore()

interface TaskFormData {
  title: string
  description: string
  status: TaskStatus
  executorId: string
  taskTagId: string
}

const taskData = ref<TaskFormData>({
  title: '',
  description: '',
  status: 'NewTask' as TaskStatus,
  executorId: '',
  taskTagId: ''
})


const autoResizeTextarea = () => {
  setTimeout(() => {
    const textarea = document.getElementById('description') as HTMLTextAreaElement
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }, 0)
}

const isEdit = computed(() => !!props.taskId)

const showStatusSelector = computed(() => {
  return !props.context
})

const getDefaultStatus = (): TaskStatus => {
  if (props.context === 'backlog') return 'InBackLog'
  if (props.context === 'board') return 'NewTask'
  return 'NewTask'
}

const handleSubmit = () => {
  if (isEdit.value && props.taskId) {
    const task = taskStore.getTaskById(props.taskId)
    if (task) {
      taskStore.updateTask({
        ...task,
        title: taskData.value.title,
        description: taskData.value.description,
        status: taskData.value.status,
        executorId: taskData.value.executorId,
        taskTagId: taskData.value.taskTagId
      })
    }
  } else {
    if (!scrumStore.currentScrumId || !taskStore.currentBoardId) {
      console.error('Не выбран проект или доска')
      return
    }
    
    taskStore.addTask({
      title: taskData.value.title,
      description: taskData.value.description,
      status: getDefaultStatus(),
      executorId: taskData.value.executorId,
      taskTagId: taskData.value.taskTagId,
      scrumId: scrumStore.currentScrumId,
      creatorId: authStore.currentUser?.id || ''
    })
  }
  
  emit('submit')
}

watch(() => taskData.value.description, () => {
  autoResizeTextarea()
})

onMounted(() => {
  if (props.taskId) {
    const task = taskStore.getTaskById(props.taskId)
    if (task) {
      taskData.value = {
        title: task.title || '',
        description: task.description || '',
        status: task.status as TaskStatus,
        executorId: task.executorId || '',
        taskTagId: task.taskTagId || ''
      }
      setTimeout(autoResizeTextarea, 50)
    }
  } else {
    if (authStore.currentUser) {
      taskData.value.executorId = authStore.currentUser.id
    }
    taskData.value.status = getDefaultStatus()
  }
})
</script>