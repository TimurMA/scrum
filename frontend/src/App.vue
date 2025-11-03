<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed, onMounted, markRaw } from "vue";
import { useRoute } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { useAuthStore } from "./stores/authStore";
import { useScrumStore } from "./stores/scrumStore";
import { useSprintStore } from "./stores/sprintStore";
import { useTaskStore } from "./stores/taskStore";

const route = useRoute();
const authStore = useAuthStore();
const scrumStore = useScrumStore();
const sprintStore = useSprintStore();
const taskStore = useTaskStore();

const layout = computed(() => {
  if (route.path === "/login" || route.path === "/register") {
    return markRaw(AuthLayout);
  }
  return markRaw(MainLayout);
});

onMounted(async () => {
  if (authStore.isAuthenticated()) {
    await authStore.fetchCurrentUser();
  }
});
</script>

<style>
.fixed.inset-0 input,
.fixed.inset-0 textarea,
.fixed.inset-0 select {
  background-color: white !important;
  color: #1f2937 !important;
}
</style>
