<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 overflow-y-auto" @click="closeOnOutsideClick">
    <div :class="['bg-white rounded-lg shadow-md p-6 w-full my-4', sizeClass]" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">{{ title }}</h2>
        <button 
          class="text-gray-400 hover:text-gray-600" 
          @click="$emit('update:modelValue', false)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div class="modal-content max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  modelValue: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}>()

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-sm'
    case 'lg':
      return 'max-w-3xl'
    case 'xl':
      return 'max-w-5xl'
    case 'md':
    default:
      return 'max-w-md'
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const closeOnOutsideClick = () => {
  emit('update:modelValue', false)
}
</script>

