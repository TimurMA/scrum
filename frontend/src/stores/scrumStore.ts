import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Scrum, ScrumStatus } from "@/types";
import { scrumService } from "@/api/services/ScrumService";
import { useAuthStore } from "./authStore";

export const useScrumStore = defineStore("scrum", () => {
  const scrums = ref<Scrum[]>([]);
  const currentScrumId = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const initScrums = () => {
    const authStore = useAuthStore();

    scrums.value = [
      {
        id: "1",
        name: "Проект Канбан",
        status: "Active" as ScrumStatus,
        creatorId: authStore.currentUser?.id || "1",
      },
    ];

    currentScrumId.value = "1";
  };

  const currentScrum = computed(() => {
    if (!currentScrumId.value) return null;
    return (
      scrums.value.find((scrum: Scrum) => scrum.id === currentScrumId.value) ||
      null
    );
  });

  const userScrums = computed(() => {
    const authStore = useAuthStore();
    if (!authStore.currentUser) return [];

    return scrums.value.filter(
      (scrum: Scrum) => scrum.creatorId === authStore.currentUser?.id
    );
  });

  const addScrum = async (name: string): Promise<string | null> => {
    const authStore = useAuthStore();
    if (!authStore.currentUser) throw new Error("Пользователь не авторизован");

    try {
      isLoading.value = true;
      error.value = null;

      const newScrum = await scrumService.createScrum({
        name,
        status: "Active" as ScrumStatus,
        creatorId: authStore.currentUser.id,
      });

      scrums.value.push(newScrum);
      return newScrum.id;
    } catch (err: any) {
      error.value = err.message || "Ошибка при создании проекта";
      console.error("Error creating scrum:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const updateScrumStatus = (scrumId: string, status: ScrumStatus) => {
    const scrumIndex = scrums.value.findIndex((s: Scrum) => s.id === scrumId);
    if (scrumIndex !== -1) {
      scrums.value[scrumIndex].status = status;
    }
  };

  const loadScrums = async (): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;

      const scrumsData = await scrumService.getUserScrums();
      scrums.value = scrumsData;

      const activeScrum = scrumsData.find((s) => s.status === "Active");
      if (activeScrum && !currentScrumId.value) {
        currentScrumId.value = activeScrum.id;
      }
    } catch (err: any) {
      error.value = err.message || "Ошибка при загрузке проектов";
      console.error("Error loading scrums:", err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    scrums,
    currentScrumId,
    currentScrum,
    userScrums,
    isLoading,
    error,
    initScrums,
    loadScrums,
    addScrum,
    updateScrumStatus,
  };
});
