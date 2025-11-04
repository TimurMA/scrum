import apiClient from "@api/client";
import { Task, TaskStatus, TaskTag } from "@/types";

export const taskService = {
  // --- PUT --- //
  // Изменение задачи
  changeTask: (taskData: Task): Promise<void> => {
    const payload = {
      ...taskData,
    };
    return apiClient.put("/task/change", payload);
  },

  // --- POST --- //
  // Создание задания
  createTask: (taskData: Omit<Task, "id" | "createdAt">): Promise<Task> => {
    return apiClient.post("/task/create", taskData).then((response) => ({
      ...response.data,
      createdAt: new Date(response.data.createdAt),
    }));
  },

  // Создание тэга
  createTag: (tagData: Omit<TaskTag, "id">): Promise<TaskTag> => {
    return apiClient
      .post("/task/create/tag", tagData)
      .then((response) => response.data);
  },

  // --- GET --- //
  // Получение всех тэгов задач скрама
  getScrumTags: (scrumId: string): Promise<TaskTag[]> => {
    return apiClient
      .get(`/task/tag/all/${scrumId}`)
      .then((response) => response.data);
  },

  // Получение задач спринта
  getSprintTasks: (sprintId: string): Promise<Task[]> => {
    return apiClient.get(`/task/sprint/${sprintId}`).then((response) =>
      response.data.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }))
    );
  },

  // Получение всех задач для доски (сгруппированные по статусу)
  getBoardTasks: (scrumId: string): Promise<Record<TaskStatus, Task[]>> => {
    return apiClient
      .get(`/task/board/${scrumId}`)
      .then((response) => response.data);
  },

  // --- DELETE --- //
  // Удаление задачи
  deleteTask: (taskId: string): Promise<void> => {
    return apiClient.delete(`/task/delete/${taskId}`);
  },
};
