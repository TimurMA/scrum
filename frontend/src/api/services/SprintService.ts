import apiClient from '@api/client';
import type { Sprint } from '@/types';

export const sprintService = {
    // Обновление спринта
    updateSprint: async (sprintData: Sprint): Promise<Sprint> => {
        const payload = {
            ...sprintData,
            startDate: sprintData.startDate?.toISOString(),
            finishDate: sprintData.finishDate?.toISOString(),
        };
        
        const response = await apiClient.put('/sprint/update', payload);
        return {
            ...response.data,
            startDate: response.data.startDate ? new Date(response.data.startDate) : new Date(),
            finishDate: response.data.finishDate ? new Date(response.data.finishDate) : new Date(),
        };
    },

    // Создание спринта
    createSprint: async (sprintData: Sprint): Promise<Sprint> => {
        const payload = {
            ...sprintData,
            startDate: sprintData.startDate?.toISOString(),
            finishDate: sprintData.finishDate?.toISOString(),
        };

        const response = await apiClient.post('/sprint/create', payload);
        return {
            ...response.data,
            startDate: response.data.startDate ? new Date(response.data.startDate) : new Date(),
            finishDate: response.data.finishDate ? new Date(response.data.finishDate) : new Date(),
        };
    },

    // Старт спринта
    startSprint: (sprintId: string): Promise<void> => {
        return apiClient.patch(`/sprint/start/${sprintId}`);
    },

    // Завершение спринта
    completeSprint: (sprintId: string, report: string): Promise<void> => {
        return apiClient.patch(`/sprint/complete/${sprintId}`, report, {
            headers: { 'Content-Type': 'text/plain' }
        });
    },

    // Получение всех спринтов скрама
    getAllSprints: async (scrumId: string): Promise<Sprint[]> => {
        const response = await apiClient.get(`/sprint/all/${scrumId}`);
        return response.data.map((sprint: any) => ({
            ...sprint,
            startDate: sprint.startDate ? new Date(sprint.startDate) : new Date(),
            finishDate: sprint.finishDate ? new Date(sprint.finishDate) : new Date(),
        }));
    },

    // Получение активных спринтов
    getActiveSprints: async (scrumId: string): Promise<Sprint[]> => {
        const response = await apiClient.get(`/sprint/active/${scrumId}`);
        return response.data.map((sprint: any) => ({
            ...sprint,
            startDate: sprint.startDate ? new Date(sprint.startDate) : new Date(),
            finishDate: sprint.finishDate ? new Date(sprint.finishDate) : new Date(),
        }));
    },

    // Удаление спринта
    deleteSprint: (sprintId: string): Promise<void> => {
        return apiClient.delete(`/sprint/delete/${sprintId}`);
    },
};