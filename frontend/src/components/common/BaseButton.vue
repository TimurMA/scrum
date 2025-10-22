<template>
  <button
    :class="[
      'inline-flex items-center px-4 py-2 rounded-md font-medium text-sm',
      variantClasses,
      { 'opacity-50 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-blue-500 text-white hover:bg-blue-600'
    case 'secondary':
      return 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600'
    default:
      return 'bg-blue-500 text-white hover:bg-blue-600'
  }
})
</script>
