<template>
  <div>
    <div class="container mx-auto py-6 px-4">
      <TabNavigation :tabs="tabs" />

      <div class="flex justify-between items-center mb-6">
        <div class="kanban-header">
          <h1>{{ board?.title || "Kanban доска" }}</h1>
          <p v-if="currentScrum" class="text-gray-500 text-sm">
            Проект: {{ currentScrum.name }} |
            <span :class="statusClass">{{ statusLabel }}</span>
          </p>
          <p
            class="text-sm mt-1"
            :class="
              activeSprints.length > 0
                ? 'text-green-600 font-medium'
                : 'text-gray-500'
            "
          >
            {{ activeSprintsInfo }}
          </p>
        </div>

        <BaseButton variant="primary" @click="openTaskForm">
          <span class="text-lg mr-1">+</span>
          Добавить задачу
        </BaseButton>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KanbanColumn
          v-for="column in visibleColumns"
          :key="column.id"
          :column="column"
          :tasks="tasksByStatus[column.status]"
          @task-click="openTaskForm"
          @drop-task="handleDropTask"
        />
      </div>
    </div>

    <BaseModal v-model="showTaskForm" title="Задача">
      <TaskForm
        :task-id="selectedTaskId"
        context="board"
        @submit="closeTaskForm"
        @cancel="closeTaskForm"
      />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useScrumBoard } from "@composables/useScrumBoard";
import KanbanColumn from "@components/kanban/KanbanColumn.vue";
import TaskForm from "@components/kanban/TaskForm.vue";
import BaseButton from "@components/common/BaseButton.vue";
import BaseModal from "@components/common/BaseModal.vue";
import TabNavigation from "@components/common/TabNavigation.vue";

import { useTaskStore } from "@stores/taskStore";
import { useScrumStore } from "@stores/scrumStore";
import { useAuthStore } from "@stores/authStore";
import { useSprintStore } from "@stores/sprintStore";

const taskStore = useTaskStore();
const scrumStore = useScrumStore();
const authStore = useAuthStore();
const sprintStore = useSprintStore();

const {
  showTaskForm,
  selectedTaskId,
  columns,
  tasksByStatus,
  board,
  currentScrum,
  statusLabel,
  statusClass,
  initBoard,
  handleDropTask,
  openTaskForm,
  closeTaskForm,
} = useScrumBoard();

const tabs = [
  { name: "backlog", label: "Бэклог", path: "/backlog" },
  { name: "board", label: "Доска", path: "/board" },
  { name: "sprints", label: "Спринты", path: "/sprints" },
];

const visibleColumns = computed(() => {
  return columns.value.filter((column) => column.status !== "InBackLog");
});

const activeSprints = computed(() => sprintStore.activeSprints);

const activeSprintsInfo = computed(() => {
  const count = activeSprints.value.length;
  if (count === 0) return "Нет активных спринтов";
  if (count === 1) return `Активный спринт: ${activeSprints.value[0].name}`;
  return `Активных спринтов: ${count} (${activeSprints.value
    .map((s) => s.name)
    .join(", ")})`;
});

onMounted(async () => {
  await authStore.initUsers();

  if (scrumStore.currentScrumId) {
    await Promise.all([
      sprintStore.loadSprints(scrumStore.currentScrumId),
      taskStore.loadTasks(scrumStore.currentScrumId),
    ]);
  }

  initBoard();
});
</script>

<style scoped>
.kanban-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}
</style>
