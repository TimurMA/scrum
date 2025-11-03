import { ref, computed } from "vue";
import { useTaskStore } from "@stores/taskStore";
import { useScrumStore } from "@stores/scrumStore";
import type { TaskTag } from "@/types";

export function useTagManagement() {
  const taskStore = useTaskStore();
  const scrumStore = useScrumStore();

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const predefinedTags: Record<string, string> = {
    Фронтенд: "#3b82f6",
    Бекенд: "#FF0000",
    "База данных": "#8b5cf6",
    Дизайн: "#ec4899",
    Рефакторинг: "#f97316",
  };

  const projectTags = computed(() => {
    if (!scrumStore.currentScrumId) return [];

    return taskStore.taskTags.filter(
      (tag) => tag.scrumId === scrumStore.currentScrumId
    );
  });

  const createTag = async (
    name: string,
    color: string
  ): Promise<string | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      if (!scrumStore.currentScrumId) {
        throw new Error("Не выбран Scrum проект");
      }

      if (!name.trim()) {
        throw new Error("Название тега не может быть пустым");
      }

      const existingTag = projectTags.value.find(
        (tag) => tag.name.toLowerCase() === name.toLowerCase()
      );

      if (existingTag) {
        return existingTag.id;
      }

      const newTagId = taskStore.addTaskTag({
        name,
        color,
        scrumId: scrumStore.currentScrumId,
      });

      return newTagId;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Ошибка при создании тега";
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const getRandomTagColor = (): string => {
    const colors = [
      "#3b82f6",
      "#376f5cff",
      "#f97316",
      "#8b5cf6",
      "#ef4444",
      "#ec4899",
    ];
    return colors[Math.floor(Math.random() * colors.length)] || "#3b82f6";
  };

  const getTagColorById = (tagId: string): string => {
    const tag = taskStore.taskTags.find((t) => t.id === tagId);
    return tag?.color || "#3b82f6";
  };

  const getTagNameById = (tagId: string): string => {
    const tag = taskStore.taskTags.find((t) => t.id === tagId);
    return tag?.name || "";
  };

  return {
    isLoading,
    error,
    predefinedTags,
    projectTags,
    createTag,
    getRandomTagColor,
    getTagColorById,
    getTagNameById,
  };
}
