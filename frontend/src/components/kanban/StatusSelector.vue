<template>
  <div class="mb-4">
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <div class="relative">
      <button 
        type="button"
        :id="id"
        @click="toggleDropdown"
        class="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <div class="flex items-center">
          <div v-if="selectedStatus" class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: selectedStatus.color }"></div>
          <span>{{ selectedStatus ? selectedStatus.title : placeholder }}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      
      <div 
        v-if="showDropdown" 
        class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1 max-h-60 overflow-auto"
        @click.stop
      >
        <div 
          v-for="status in columns" 
          :key="status.id" 
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
          @mousedown.prevent="selectStatus(status.status)"
        >
          <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: status.color }"></div>
          <span>{{ status.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import type { TaskStatus } from '../../types'

const props = defineProps<{
  modelValue: TaskStatus
  id: string
  label: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: TaskStatus): void
}>()

const taskStore = useTaskStore()
const showDropdown = ref(false)

const columns = computed(() => taskStore.columns)

const selectedStatus = computed(() => {
  return columns.value.find(column => column.status === props.modelValue)
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectStatus = (status: TaskStatus) => {
  emit('update:modelValue', status)
  showDropdown.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest(`#${props.id}`)) {
    showDropdown.value = false
  }
}

watch(() => showDropdown.value, (isOpen) => {
  if (isOpen) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>
