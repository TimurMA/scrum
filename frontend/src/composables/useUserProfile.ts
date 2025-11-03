import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@stores/authStore'
import { useScrumStore } from '@stores/scrumStore'
import { useTaskStore } from '@stores/taskStore'
import type { ScrumStatus } from '@/types'

export function useUserProfile() {
  const router = useRouter()
  const authStore = useAuthStore()
  const scrumStore = useScrumStore()
  const taskStore = useTaskStore()
  
  const showScrumForm = ref(false)
  const scrumForm = ref({
    name: ''
  })
  
  const currentUser = computed(() => authStore.currentUser)
  
  // Получение проектов текущего пользователя
  const userScrums = computed(() => scrumStore.userScrums)
  
  const getStatusLabel = (status: ScrumStatus) => {
    switch(status) {
      case 'Active': return 'Активен'
      case 'Done': return 'Завершён'
      case 'Deleted': return 'Удалён'
      default: return ''
    }
  }
  
  const getStatusClass = (status: ScrumStatus) => {
    switch(status) {
      case 'Active': return 'text-green-600'
      case 'Done': return 'text-blue-600'
      case 'Deleted': return 'text-red-600'
      default: return ''
    }
  }
  
  const navigateToScrum = (scrumId: string) => {
    scrumStore.currentScrumId = scrumId
    router.push('/board')
  }
  
  const createScrum = async () => {
    const scrumId = await scrumStore.addScrum(scrumForm.value.name)
    showScrumForm.value = false
    scrumForm.value = { name: '' }
    
    if (scrumId) {
      navigateToScrum(scrumId)
    }
  }
  
  const closeOnOutsideClick = () => {
    showScrumForm.value = false
    scrumForm.value = { name: '' }
  }
  
  return {
    showScrumForm,
    scrumForm,
    currentUser,
    userScrums,
    getStatusLabel,
    getStatusClass,
    navigateToScrum,
    createScrum,
    closeOnOutsideClick
  }
}
