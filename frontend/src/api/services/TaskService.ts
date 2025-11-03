import apiClient from '@api/client';
import {Task, TaskStatus} from '@/types'

export const taskService = {
    // --- PUT --- //
    // Изменение задачи
    changeTask: (taskData: Task): Promise<void> => {
        const payload = {
            ...taskData,
            createdAt: taskData.createdAt.toISOString(),
        };
        return apiClient.put('/task/change', payload);
    },

    // --- GET --- //
    // Получение задач спринта
    getSprintTasks: (sprintId: string): Promise<Task[]> => {
        return apiClient.get(`/task/sprint/${sprintId}`).then(response => 
            response.data.map((task: any) => ({
                ...task,
                createdAt: new Date(task.createdAt)
            }))
        );
    },

    // Получение всех задач для доски (сгруппированные по статусу)
    getBoardTasks: (scrumId: string): Promise<Record<TaskStatus, Task[]>> => {
        return apiClient.get(`/task/board/${scrumId}`).then(response => {
            // Преобразуем GroupedFlux в объект с группировкой по статусу
            const groupedTasks: Record<TaskStatus, Task[]> = {
                'InBackLog': [],
                'NewTask': [],
                'InProgress': [],
                'OnVerification': [],
                'Done': []
            };

            // Обрабатываем ответ от бэкенда
            response.data.forEach((group: any) => {
                const status = group.key as TaskStatus;
                const tasks = group.values.map((task: any) => ({
                    ...task,
                    createdAt: new Date(task.createdAt)
                }));
                groupedTasks[status] = tasks;
            });

            return groupedTasks;
        });
    },

    // --- POST --- //
    // Создание задачи
    createTask: (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
        const payload = {
            ...taskData,
        };
        return apiClient.post('/task/create', payload).then(response => ({
            ...response.data,
            createdAt: new Date(response.data.createdAt)
        }));
    },

    // --- DELETE --- //
    // Удаление задачи
    deleteTask: (taskId: string): Promise<void> => {
        return apiClient.delete(`/task/delete/${taskId}`);
    },
};