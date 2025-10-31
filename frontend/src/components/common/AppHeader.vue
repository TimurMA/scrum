<template>
  <header class="bg-white shadow py-4 px-6">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold">{{ title }}</h1>
      
      <div class="flex items-center space-x-4">
        <router-link to="/profile" class="flex items-center">
          <div class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium mr-2">
            {{ currentUser?.username.substring(0, 2).toUpperCase() }}
          </div>
          <span>Мой профиль</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@stores/authStore'
import { useTaskStore } from '@stores/taskStore'

const route = useRoute()
const authStore = useAuthStore()
const taskStore = useTaskStore()

const currentUser = computed(() => authStore.currentUser)

const title = computed(() => {
  if (route.path === '/profile') {
    return ''
  } else {
    return 'Скрам проекты'
  }
})
</script>
