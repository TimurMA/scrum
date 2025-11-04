import apiClient from "@api/client";
import type { Sprint } from "@/types";

const parseSprintDates = (sprint: any): Sprint => ({
  ...sprint,
  startDate: new Date(sprint.startDate),
  finishDate: new Date(sprint.finishDate),
});

export const sprintService = {
  // --- PUT --- //
  // Обновление спринта
  updateSprint: async (sprintData: Sprint): Promise<Sprint> => {
    const response = await apiClient.put("/sprint/update", sprintData);
    return parseSprintDates(response.data);
  },

  // --- POST --- //
  // Создание спринта
  createSprint: async (sprintData: Omit<Sprint, "id">): Promise<Sprint> => {
    const response = await apiClient.post("/sprint/create", sprintData);
    return parseSprintDates(response.data);
  },

  // --- PATCH --- //
  // Старт спринта
  startSprint: (sprintId: string): Promise<void> => {
    return apiClient.patch(`/sprint/start/${sprintId}`);
  },

  // Завершение спринта
  completeSprint: (sprintId: string, report: string): Promise<void> => {
    return apiClient.patch(`/sprint/complete/${sprintId}`, report, {
      headers: { "Content-Type": "text/plain" },
    });
  },

  // --- GET --- //
  // Получение всех спринтов скрама
  getAllSprints: async (scrumId: string): Promise<Sprint[]> => {
    const response = await apiClient.get(`/sprint/all/${scrumId}`);
    return response.data.map(parseSprintDates);
  },

  // Получение активных спринтов
  getActiveSprints: async (scrumId: string): Promise<Sprint[]> => {
    const response = await apiClient.get(`/sprint/active/${scrumId}`);
    return response.data.map(parseSprintDates);
  },

  // --- DELETE --- //
  // Удаление спринта
  deleteSprint: (sprintId: string): Promise<void> => {
    return apiClient.delete(`/sprint/delete/${sprintId}`);
  },
};
