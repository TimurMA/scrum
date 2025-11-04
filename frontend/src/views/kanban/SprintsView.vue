<template>
  <div>
    <div class="container mx-auto py-6 px-4">
      <TabNavigation :tabs="tabs" />

      <div class="flex justify-between items-center mb-6">
        <div class="kanban-header">
          <h1>Список спринтов: {{ sprints.length }}</h1>
          <p v-if="currentScrum" class="text-gray-500 text-sm">
            Проект: {{ currentScrum.name }} |
            <span :class="statusClass">{{ statusLabel }}</span>
          </p>
        </div>

        <BaseButton variant="primary" @click="openCreateSprintModal">
          <span class="text-lg mr-1">+</span>
          Создать спринт
        </BaseButton>
      </div>

      <div class="mb-6">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Поиск"
            class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Название
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Статус
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Дата старта
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Дата окончания
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Действия
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredSprints.length === 0">
                <td
                  colspan="5"
                  class="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Нет данных для отображения
                </td>
              </tr>
              <tr
                v-for="sprint in filteredSprints"
                :key="sprint.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="ml-0">
                      <div class="text-sm font-medium text-gray-900">
                        {{ sprint.name }}
                      </div>
                      <div
                        v-if="sprint.goal"
                        class="text-xs text-gray-500 truncate max-w-xs"
                      >
                        {{ sprint.goal }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="
                      sprint.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    "
                  >
                    {{ sprint.status === "Active" ? "Активен" : "Завершен" }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(sprint.startDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(sprint.finishDate) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <div class="flex justify-end gap-2">
                    <button
                      @click="editSprint(sprint.id)"
                      class="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded"
                    >
                      Редактировать
                    </button>
                    <button
                      v-if="sprint.status === 'NotActive'"
                      @click="activateSprint(sprint.id)"
                      class="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded"
                    >
                      Активировать
                    </button>
                    <button
                      v-if="sprint.status === 'Active'"
                      @click="completeSprint(sprint.id)"
                      class="text-yellow-600 hover:text-yellow-900 bg-yellow-50 hover:bg-yellow-100 px-2 py-1 rounded"
                    >
                      Завершить
                    </button>
                    <button
                      v-if="sprint.status === 'Active'"
                      @click="manageSprintTasks(sprint.id)"
                      class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded"
                    >
                      Задачи спринта
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <BaseModal
      v-model="showSprintModal"
      :title="editingSprintId ? 'Редактировать спринт' : 'Создать спринт'"
    >
      <SprintForm
        :sprint-id="editingSprintId"
        @submit="closeSprintModal"
        @cancel="closeSprintModal"
      />
    </BaseModal>

    <BaseModal
      v-model="showTasksModal"
      title="Управление задачами спринта"
      size="lg"
    >
      <SprintTasksManager
        :sprint-id="selectedSprintId"
        @submit="closeTasksModal"
        @cancel="closeTasksModal"
      />
    </BaseModal>

    <BaseModal v-model="showReportModal" title="Отчет о спринте" size="md">
      <div class="space-y-4">
        <div>
          <label
            for="sprint-report"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Напишите отчет о завершении спринта
          </label>
          <textarea
            id="sprint-report"
            v-model="sprintReport"
            rows="6"
            placeholder="Опишите результаты спринта, что было достигнуто, какие задачи выполнены..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <BaseButton variant="secondary" @click="closeReportModal">
            Отмена
          </BaseButton>
          <BaseButton
            variant="primary"
            @click="confirmCompleteSprintWithReport"
            :disabled="!sprintReport.trim()"
          >
            Завершить спринт
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import BaseButton from "@components/common/BaseButton.vue";
import TabNavigation from "@components/common/TabNavigation.vue";
import BaseModal from "@components/common/BaseModal.vue";
import SprintForm from "@components/sprint/SprintForm.vue";
import SprintTasksManager from "@components/sprint/SprintTasksManager.vue";

import { useScrumStore } from "@stores/scrumStore";
import { useSprintStore } from "@stores/sprintStore";

const scrumStore = useScrumStore();
const sprintStore = useSprintStore();

const searchQuery = ref("");
const showSprintModal = ref(false);
const showTasksModal = ref(false);
const showReportModal = ref(false);
const editingSprintId = ref<string | undefined>();
const selectedSprintId = ref<string | undefined>();
const completingSprintId = ref<string | undefined>();
const sprintReport = ref("");

const currentScrum = computed(() => scrumStore.currentScrum);
const sprints = computed(() => sprintStore.scrumSprints);

const filteredSprints = computed(() => {
  if (!searchQuery.value) return sprints.value;

  const query = searchQuery.value.toLowerCase();
  return sprints.value.filter(
    (sprint) =>
      sprint.name.toLowerCase().includes(query) ||
      (sprint.goal && sprint.goal.toLowerCase().includes(query))
  );
});

const statusLabel = computed(() => {
  switch (currentScrum.value?.status) {
    case "Active":
      return "Активен";
    case "Done":
      return "Завершён";
    case "Deleted":
      return "Удалён";
    default:
      return "";
  }
});

const statusClass = computed(() => {
  switch (currentScrum.value?.status) {
    case "Active":
      return "text-green-600 font-medium";
    case "Done":
      return "text-blue-600 font-medium";
    case "Deleted":
      return "text-red-600 font-medium";
    default:
      return "";
  }
});

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const openCreateSprintModal = () => {
  editingSprintId.value = undefined;
  showSprintModal.value = true;
};

const editSprint = (sprintId: string) => {
  editingSprintId.value = sprintId;
  showSprintModal.value = true;
};

const closeSprintModal = () => {
  showSprintModal.value = false;
  editingSprintId.value = undefined;
};

const activateSprint = async (sprintId: string) => {
  const success = await sprintStore.startSprint(sprintId);

  if (!success) {
    console.error("Не удалось активировать спринт");
  }
};

const completeSprint = (sprintId: string) => {
  completingSprintId.value = sprintId;
  sprintReport.value = "";
  showReportModal.value = true;
};

const confirmCompleteSprintWithReport = async () => {
  if (!completingSprintId.value) return;

  const success = await sprintStore.completeSprint(
    completingSprintId.value,
    sprintReport.value
  );

  if (success) {
    closeReportModal();
  } else {
    console.error("Не удалось завершить спринт");
  }
};

const closeReportModal = () => {
  showReportModal.value = false;
  completingSprintId.value = undefined;
  sprintReport.value = "";
};

const manageSprintTasks = (sprintId: string) => {
  selectedSprintId.value = sprintId;
  showTasksModal.value = true;
};

const closeTasksModal = () => {
  showTasksModal.value = false;
};

const tabs = [
  { name: "backlog", label: "Бэклог", path: "/backlog" },
  { name: "board", label: "Доска", path: "/board" },
  { name: "sprints", label: "Спринты", path: "/sprints" },
];

onMounted(async () => {
  if (scrumStore.currentScrumId) {
    await sprintStore.loadSprints(scrumStore.currentScrumId);
  }
});
</script>

<style scoped>
.kanban-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
</style>
