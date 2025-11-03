<template>
  <header class="bg-white shadow py-4 px-6">
    <div class="container mx-auto flex justify-between items-center">
      <router-link to="/" class="text-xl font-bold">{{ title }}</router-link>

      <div class="flex items-center space-x-4">
        <template v-if="isAuthenticated">
          <router-link
            to="/profile"
            class="flex items-center hover:text-blue-500"
          >
            <div
              class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium mr-2"
            >
              {{ currentUser?.username.substring(0, 2).toUpperCase() }}
            </div>
            <span>Мой профиль</span>
          </router-link>
          <BaseButton
            @click="handleLogout"
            class="bg-transparent text-gray-700 hover:text-red-500 px-2"
          >
            Выйти
          </BaseButton>
        </template>
        <template v-else>
          <router-link to="/login" class="text-gray-700 hover:text-blue-500"
            >Войти</router-link
          >
          <router-link
            to="/register"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Зарегистрироваться
          </router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { useTaskStore } from "@/stores/taskStore";
import BaseButton from "@/components/common/BaseButton.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const taskStore = useTaskStore();

const currentUser = computed(() => authStore.currentUser);
const isAuthenticated = computed(() => authStore.isAuthenticated());

const title = computed(() => {
  if (route.path === "/profile") {
    return "Профиль";
  } else if (route.path === "/login" || route.path === "/register") {
    return "Scrum Management";
  } else {
    return "Скрам проекты";
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
