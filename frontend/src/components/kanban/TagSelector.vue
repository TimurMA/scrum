<template>
  <div class="relative">
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{ label }}</label>
    <div class="relative">
      <div class="flex">
        <input
          :id="id"
          v-model="inputValue"
          :placeholder="placeholder"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @focus="showDropdown = true"
          @blur="handleBlur"
          @input="filterTags"
          autocomplete="off"
        />
        <button
          type="button"
          class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          @click="toggleDropdown"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div
        v-if="showDropdown"
        class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1 max-h-60 overflow-auto"
        @click.stop
      >
        <div
          v-for="(color, name) in predefinedTags"
          :key="name"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
          @mousedown.prevent="selectTag(String(name))"
        >
          <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: color }"></div>
          <span>{{ name }}</span>
        </div>
        
        <div
          v-for="tag in filteredTags"
          :key="tag.id"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
          @mousedown.prevent="selectTag(tag.name)"
        >
          <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: tag.color }"></div>
          <span>{{ tag.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTagManagement } from '../../composables/useTagManagement'

const props = defineProps<{
  modelValue: string
  id: string
  label: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const {
  predefinedTags,
  projectTags,
  createTag,
  getRandomTagColor
} = useTagManagement()

const inputValue = ref('')
const showDropdown = ref(false)
const filteredTags = ref<Array<any>>([])
const tagExists = ref(false)

watch(() => props.modelValue, (newValue) => {
  // Если modelValue - это ID тега, находим его имя
  const tag = projectTags.value.find(t => t.id === newValue)
  inputValue.value = tag ? tag.name : ''
}, { immediate: true })

const filterTags = () => {
  const input = inputValue.value.trim().toLowerCase()
  
  if (!input) {
    filteredTags.value = projectTags.value.filter(tag => 
      !Object.keys(predefinedTags).includes(tag.name)
    )
  } else {
    filteredTags.value = projectTags.value.filter(tag => 
      tag.name.toLowerCase().includes(input) &&
      !Object.keys(predefinedTags).includes(tag.name)
    )
  }
  
  tagExists.value = !!projectTags.value.find(tag => 
    tag.name.toLowerCase() === input
  )
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    filterTags()
  }
}

const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false
    
    const input = inputValue.value.trim()
    if (!input) {
      emit('update:modelValue', '')
      return
    }
    
    const existingTag = projectTags.value.find(tag => 
      tag.name.toLowerCase() === input.toLowerCase()
    )
    
    if (existingTag) {
      emit('update:modelValue', existingTag.id)
    } else {
      createTag(input, getRandomTagColor()).then(newTagId => {
        if (newTagId) {
          emit('update:modelValue', newTagId)
        }
      })
    }
  }, 200)
}

const selectTag = async (tagName: string) => {
  inputValue.value = tagName
  
  if (!tagName) {
    emit('update:modelValue', '')
    showDropdown.value = false
    return
  }
  
  const existingTag = projectTags.value.find(tag => 
    tag.name.toLowerCase() === tagName.toLowerCase()
  )
  
  if (existingTag) {
    emit('update:modelValue', existingTag.id)
    showDropdown.value = false
  } else {
    let color: string
    
    if (Object.prototype.hasOwnProperty.call(predefinedTags, tagName)) {
      color = predefinedTags[tagName]
    } else {
      color = getRandomTagColor()
    }
    
    const newTagId = await createTag(tagName, color)
    if (newTagId) {
      emit('update:modelValue', newTagId)
    }
    
    showDropdown.value = false
  }
}
</script>
