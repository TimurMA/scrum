import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Task, TaskTag, TaskStatus, Board } from "@/types";
import { useScrumStore } from "./scrumStore";
import { useSprintStore } from "./sprintStore";
import { useAuthStore } from "./authStore";
import { taskService } from "@/api/services/TaskService";

export const useTaskStore = defineStore("task", () => {
  const tasks = ref<Task[]>([]);
  const taskTags = ref<TaskTag[]>([]);
  const boards = ref<Board[]>([]);
  const currentBoardId = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const columns = ref([
    {
      id: "backlog",
      status: "InBackLog" as TaskStatus,
      title: "В бэклоге",
      color: "#64748b",
    },
    {
      id: "new",
      status: "NewTask" as TaskStatus,
      title: "Новые",
      color: "#3B82F6",
    },
    {
      id: "progress",
      status: "InProgress" as TaskStatus,
      title: "В работе",
      color: "#F59E0B",
    },
    {
      id: "verify",
      status: "OnVerification" as TaskStatus,
      title: "На проверке",
      color: "#F97316",
    },
    {
      id: "done",
      status: "Done" as TaskStatus,
      title: "Выполненные",
      color: "#10B981",
    },
  ]);

  const initTasks = () => {
    const authStore = useAuthStore();

    boards.value = [
      {
        id: "1",
        sprintId: "1",
        title: "Kanban доска",
      },
    ];

    currentBoardId.value = "1";

    tasks.value = [
      {
        id: "1",
        sprintId: "1",
        scrumId: "1",
        taskTagId: "3",
        title: "Написать документацию API",
        description:
          "Документировать все эндпоинты REST API с примерами запросов и ответов",
        status: "NewTask" as TaskStatus,
        createdAt: new Date("2025-10-01"),
        creatorId: authStore.users[0]!.id,
        executorId: authStore.users[1]!.id,
      },
      {
        id: "2",
        sprintId: "1",
        scrumId: "1",
        taskTagId: "1",
        title: "Исправить баг с авторизацией",
        description: "Пользователи не могут войти через OAuth провайдеры",
        status: "InProgress" as TaskStatus,
        createdAt: new Date("2025-10-02"),
        creatorId: authStore.users[0]!.id,
        executorId: authStore.users[2]!.id,
      },
      {
        id: "3",
        sprintId: "1",
        scrumId: "1",
        taskTagId: "2",
        title: "Построить CI/CD пайплайн",
        description:
          "Настроить автоматическую сборку и деплой на staging окружение",
        status: "OnVerification" as TaskStatus,
        createdAt: new Date("2025-10-03"),
        creatorId: authStore.users[1]!.id,
        executorId: authStore.users[0]!.id,
      },
      {
        id: "4",
        sprintId: "1",
        scrumId: "1",
        taskTagId: "2",
        title: "Оптимизировать запросы к БД",
        description: "Добавить индексы и оптимизировать медленные запросы",
        status: "InProgress" as TaskStatus,
        createdAt: new Date("2025-10-04"),
        creatorId: authStore.users[2]!.id,
        executorId: authStore.users[3]!.id,
      },
      {
        id: "5",
        sprintId: "1",
        scrumId: "1",
        title: "Новая задача",
        description: "",
        status: "InBackLog" as TaskStatus,
        createdAt: new Date("2025-10-05"),
        creatorId: authStore.users[0]!.id,
        executorId: authStore.users[0]!.id,
      },
    ];

    // Инициализируем теги для демонстрационных данных
    taskTags.value = [
      {
        id: "1",
        name: "Фронтенд",
        color: "#3b82f6",
        scrumId: "1",
      },
      {
        id: "2",
        name: "Бекенд",
        color: "#dc2626",
        scrumId: "1",
      },
      {
        id: "3",
        name: "Документация",
        color: "#16a34a",
        scrumId: "1",
      },
    ];
  };

  const currentBoard = computed(() => {
    if (!currentBoardId.value) return null;
    return (
      boards.value.find((board) => board.id === currentBoardId.value) || null
    );
  });

  const tasksByStatus = computed(() => {
    const result = {
      InBackLog: [],
      NewTask: [],
      InProgress: [],
      OnVerification: [],
      Done: [],
    } as Record<TaskStatus, Task[]>;

    const backlogTasks = tasks.value.filter(
      (task) => task.status === "InBackLog" || !task.sprintId
    );
    result["InBackLog"] = backlogTasks;

    const sprintStore = useSprintStore();
    const activeSprints = sprintStore.activeSprints;

    if (activeSprints.length > 0) {
      const activeSprintIds = activeSprints.map((sprint) => sprint.id);

      tasks.value.forEach((task) => {
        if (
          task.sprintId &&
          activeSprintIds.includes(task.sprintId) &&
          task.status !== "InBackLog"
        ) {
          if (!result[task.status]) {
            result[task.status] = [];
          }
          result[task.status].push(task);
        }
      });
    }

    return result;
  });

  const moveTask = async (
    taskId: string,
    newStatus: TaskStatus
  ): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      const task = tasks.value.find((t: Task) => t.id === taskId);
      if (!task) {
        throw new Error("Задача не найдена");
      }

      const updatedTask = { ...task, status: newStatus };
      await taskService.changeTask(updatedTask);

      const taskIndex = tasks.value.findIndex((t: Task) => t.id === taskId);
      if (taskIndex !== -1) {
        tasks.value[taskIndex].status = newStatus;
      }

      return true;
    } catch (err: any) {
      error.value = err.message || "Ошибка при изменении статуса задачи";
      console.error("Error moving task:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const addTask = async (
    task: Omit<Task, "id" | "createdAt">
  ): Promise<string | null> => {
    const authStore = useAuthStore();
    if (!authStore.currentUser) throw new Error("Пользователь не авторизован");

    try {
      isLoading.value = true;
      error.value = null;

      const newTask = await taskService.createTask({
        ...task,
        creatorId: authStore.currentUser.id,
      });

      tasks.value.push(newTask);
      return newTask.id;
    } catch (err: any) {
      error.value = err.message || "Ошибка при создании задачи";
      console.error("Error creating task:", err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const updateTask = async (task: Task): Promise<boolean> => {
    try {
      isLoading.value = true;
      error.value = null;

      await taskService.changeTask(task);

      const taskIndex = tasks.value.findIndex((t: Task) => t.id === task.id);
      if (taskIndex !== -1) {
        tasks.value[taskIndex] = { ...task };
      }

      return true;
    } catch (err: any) {
      error.value = err.message || "Ошибка при обновлении задачи";
      console.error("Error updating task:", err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const addBoard = (title: string, sprintId?: string): string => {
    const scrumStore = useScrumStore();
    if (!scrumStore.currentScrumId) throw new Error("Не выбран Scrum проект");

    const newBoard: Board = {
      id: Date.now().toString(),
      title,
      sprintId,
    };

    boards.value.push(newBoard);
    return newBoard.id;
  };

  const addTaskTag = (tag: Omit<TaskTag, "id">): string => {
    const newTag: TaskTag = {
      ...tag,
      id: Date.now().toString(),
    };

    taskTags.value.push(newTag);
    return newTag.id;
  };

  const getTaskById = (taskId: string) => {
    return tasks.value.find((task: Task) => task.id === taskId);
  };

  const loadTasks = async (scrumId: string): Promise<void> => {
    try {
      isLoading.value = true;
      error.value = null;

      const tasksData = await taskService.getBoardTasks(scrumId);

      const allTasks: Task[] = [];
      Object.values(tasksData).forEach((taskArray) => {
        allTasks.push(...taskArray);
      });

      tasks.value = allTasks;

      // Также загружаем теги для этого скрама
      await loadTags(scrumId);
    } catch (err: any) {
      error.value = err.message || "Ошибка при загрузке задач";
      console.error("Error loading tasks:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const loadTags = async (scrumId: string): Promise<void> => {
    try {
      const tagsData = await taskService.getScrumTags(scrumId);
      taskTags.value = tagsData;
    } catch (err: any) {
      console.error("Error loading tags:", err);
    }
  };

  return {
    tasks,
    taskTags,
    boards,
    columns,
    currentBoardId,
    currentBoard,
    tasksByStatus,
    isLoading,
    error,
    initTasks,
    loadTasks,
    loadTags,
    moveTask,
    addTask,
    updateTask,
    addBoard,
    addTaskTag,
    getTaskById,
  };
});
