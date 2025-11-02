<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <AppHeader />
    
    <main class="flex-grow">
      <router-view />
    </main>
    
    <footer class="bg-white">
      <div class="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">
          &copy; {{ currentYear }} Scrum Management. Все права защищены.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const currentYear = computed(() => new Date().getFullYear());

onMounted(() => {
  // Инициализируем данные пользователя при загрузке страницы
  authStore.initUsers();
});
</script>



