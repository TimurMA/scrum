<template>
  <div class="min-h-screen bg-gray-100">
    <AppHeader />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppHeader from './components/common/AppHeader.vue'
import { useAuthStore } from './stores/authStore'
import { useScrumStore } from './stores/scrumStore'
import { useSprintStore } from './stores/sprintStore'
import { useTaskStore } from './stores/taskStore'

const authStore = useAuthStore()
const scrumStore = useScrumStore()
const sprintStore = useSprintStore()
const taskStore = useTaskStore()

onMounted(() => {
  authStore.initUsers()
  scrumStore.initScrums()
  sprintStore.initSprints()
  taskStore.initTasks()
})
</script>

<style>
.fixed.inset-0 input,
.fixed.inset-0 textarea,
.fixed.inset-0 select {
  background-color: white !important;
  color: #1f2937 !important;
}
</style>