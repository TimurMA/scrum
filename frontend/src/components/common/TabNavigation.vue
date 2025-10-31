<template>
  <div class="tab-navigation">
    <div class="flex justify-center mb-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <div class="flex">
          <router-link
            v-for="tab in tabs"
            :key="tab.name"
            :to="tab.path"
            class="tab-item"
            :class="{ 'tab-active': isActive(tab.path) }"
          >
            {{ tab.label }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface Tab {
  name: string
  label: string
  path: string
}

const props = defineProps<{
  tabs: Tab[]
}>()

const route = useRoute()

const isActive = (path: string): boolean => {
  if (route.path.startsWith(path) && path !== '/') {
    return true
  }
  return route.path === path
}
</script>

<style scoped>
.tab-item {
  @apply px-6 py-3 text-sm font-medium text-gray-600 transition-colors duration-200 relative;
}

.tab-active {
  @apply text-blue-600;
  @apply after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600;
}

.tab-item:hover {
  @apply bg-gray-50 text-gray-900;
}

.tab-active:hover {
  @apply bg-blue-50 text-blue-700;
}
</style>

