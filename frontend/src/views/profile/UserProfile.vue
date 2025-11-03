<template>
  <div>
    <div class="container mx-auto py-6 px-4">
      <div class="flex items-center mb-8">
        <div
          class="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-medium"
        >
          {{ currentUser?.username.substring(0, 2).toUpperCase() }}
        </div>
        <div class="ml-4">
          <h1 class="text-2xl font-bold">{{ currentUser?.username }}</h1>
          <p class="text-gray-500">{{ currentUser?.email }}</p>
        </div>
      </div>

      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-xl font-bold">Мои проекты</h2>
        <BaseButton variant="primary" @click="showScrumForm = true">
          <span class="text-lg mr-1">+</span>
          Создать проект
        </BaseButton>
      </div>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <div
          v-for="scrum in userScrums"
          :key="scrum.id"
          class="card hover:shadow-lg cursor-pointer transition-shadow"
          @click="navigateToScrum(scrum.id)"
        >
          <h3 class="text-lg font-semibold mb-2">{{ scrum.name }}</h3>
          <div class="text-xs" :class="getStatusClass(scrum.status)">
            {{ getStatusLabel(scrum.status) }}
          </div>
        </div>
      </div>
    </div>

    <BaseModal v-model="showScrumForm" title="Создать новый проект">
      <form @submit.prevent="createScrum">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1"
            >Название</label
          >
          <input
            id="name"
            v-model="scrumForm.name"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="flex justify-end gap-2">
          <BaseButton
            variant="secondary"
            type="button"
            @click="showScrumForm = false"
          >
            Отмена
          </BaseButton>
          <BaseButton
            variant="primary"
            type="submit"
            :loading="scrumStore.isLoading"
            :disabled="scrumStore.isLoading"
          >
            Создать
          </BaseButton>
        </div>
      </form>

      <div
        v-if="scrumStore.error"
        class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
      >
        <p class="text-red-600 text-sm">{{ scrumStore.error }}</p>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { useUserProfile } from "@composables/useUserProfile";
import BaseButton from "@components/common/BaseButton.vue";
import BaseModal from "@components/common/BaseModal.vue";

const {
  showScrumForm,
  scrumForm,
  currentUser,
  userScrums,
  getStatusLabel,
  getStatusClass,
  navigateToScrum,
  createScrum,
} = useUserProfile();

import { useScrumStore } from "@stores/scrumStore";
const scrumStore = useScrumStore();
</script>

<style scoped>
.card {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
