<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 class="text-xl font-bold text-gray-900">Scrum Management</h1>
      </div>
    </header>

    <main class="flex-grow">
      <div class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <router-view />
        </div>
      </div>
    </main>

    <footer class="bg-white">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">
          &copy; {{ currentYear }} Scrum Management. Все права защищены.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>



