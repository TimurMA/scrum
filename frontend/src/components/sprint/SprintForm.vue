<template>
  <div class="bg-white p-6 custom-scrollbar max-h-[80vh] overflow-y-auto">
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Название спринта</label>
        <input
          id="name"
          v-model="sprintData.name"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="Например: Спринт 5"
        />
      </div>
      
      <div class="mb-4">
        <label for="goal" class="block text-sm font-medium text-gray-700 mb-1">Цель спринта</label>
        <textarea
          id="goal"
          v-model="sprintData.goal"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none overflow-hidden"
          placeholder="Опишите цель спринта"
        ></textarea>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Дата начала</label>
          <input
            id="startDate"
            v-model="startDateString"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">Дата окончания</label>
          <input
            id="endDate"
            v-model="endDateString"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div v-if="dateError" class="text-red-500 text-xs mt-1">
            {{ dateError }}
          </div>
        </div>
      </div>
      
      
      <div class="flex justify-end gap-3 mt-6">
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
          :disabled="!!dateError"
        >
          {{ isEdit ? 'Сохранить' : 'Создать' }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import BaseButton from '@components/common/BaseButton.vue'
import { useSprintStore } from '@stores/sprintStore'
import { useScrumStore } from '@stores/scrumStore'
import type { Sprint, SprintStatus } from '@/types'

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
const scrumStore = useScrumStore()

interface SprintFormData {
  name: string
  goal: string
  status: SprintStatus
  startDate: Date
  finishDate: Date
  scrumId: string
}

const formatDateToString = (date: Date): string => {
  return date.toISOString().split('T')[0]
}


const parseStringToDate = (dateString: string): Date => {
  return new Date(dateString)
}

const sprintData = ref<SprintFormData>({
  name: '',
  goal: '',
  status: 'DONE',
  startDate: new Date(),
  finishDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  scrumId: scrumStore.currentScrumId || ''
})


const autoResizeTextarea = () => {
  setTimeout(() => {
    const textarea = document.getElementById('goal') as HTMLTextAreaElement
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }, 0)
}

const startDateString = ref(formatDateToString(sprintData.value.startDate))
const endDateString = ref(formatDateToString(sprintData.value.finishDate))


watch(startDateString, (newVal) => {
  sprintData.value.startDate = parseStringToDate(newVal)
  validateDates()
})

watch(endDateString, (newVal) => {
  sprintData.value.finishDate = parseStringToDate(newVal)
  validateDates()
})


const dateError = ref('')

const validateDates = () => {
  const start = sprintData.value.startDate
  const end = sprintData.value.finishDate
  
  if (start > end) {
    dateError.value = 'Дата начала не может быть позже даты окончания'
    return false
  }
  
  dateError.value = ''
  return true
}

const isEdit = computed(() => !!props.sprintId)

const handleSubmit = () => {
  if (!validateDates()) return
  
  const now = new Date()
  const startDate = new Date(sprintData.value.startDate)
  const finishDate = new Date(sprintData.value.finishDate)
  
  if (now >= startDate && now <= finishDate) {
    sprintData.value.status = 'ACTIVE'
  } else if (now > finishDate) {
    sprintData.value.status = 'DONE'
  } else {
    sprintData.value.status = 'DONE'
  }
  
  if (isEdit.value && props.sprintId) {
    sprintStore.updateSprint({
      ...sprintData.value,
      id: props.sprintId
    })
  } else {
    sprintStore.addSprint(sprintData.value)
  }
  
  emit('submit')
}

watch(() => sprintData.value.goal, () => {
  autoResizeTextarea()
})

onMounted(() => {
  if (props.sprintId) {
    const sprint = sprintStore.getSprintById(props.sprintId)
    if (sprint) {
      sprintData.value = {
        name: sprint.name,
        goal: sprint.goal || '',
        status: sprint.status,
        startDate: new Date(sprint.startDate),
        finishDate: new Date(sprint.finishDate),
        scrumId: sprint.scrumId
      }
      
      startDateString.value = formatDateToString(sprintData.value.startDate)
      endDateString.value = formatDateToString(sprintData.value.finishDate)
      
      setTimeout(autoResizeTextarea, 50)
    }
  }
})
</script>

