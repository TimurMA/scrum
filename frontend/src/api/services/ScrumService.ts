import apiClient from "@api/client";
import { Scrum, ScrumMember } from "@/types";

export const scrumService = {
  // --- PUT --- //
  // Удаление пользователя из скрама
  kickMember: (scrumId: string, email: string): Promise<void> => {
    return apiClient.put(`/scrum/members/kick/${scrumId}`, email);
  },

  // --- POST --- //
  // Добавление пользователей в скрам
  addMember: (scrumId: string, email: string): Promise<ScrumMember> => {
    return apiClient
      .post(`/scrum/members/add/${scrumId}`, email)
      .then((response) => response.data);
  },

  // Создание скрама
  createScrum: (scrumData: Omit<Scrum, "id">): Promise<Scrum> => {
    return apiClient
      .post("/scrum/create", scrumData)
      .then((response) => response.data);
  },

  // --- GET --- //
  // Получение скрама по id
  getScrumById: (scrumId: string): Promise<Scrum> => {
    return apiClient.get(`/scrum/${scrumId}`).then((response) => response.data);
  },

  // Получение всех скрамов пользователя
  getUserScrums: (): Promise<Scrum[]> => {
    return apiClient.get("/scrum/user").then((response) => response.data);
  },

  // Получение участников скрама
  getScrumMembers: (scrumId: string): Promise<ScrumMember[]> => {
    return apiClient.get(`/scrum/members/${scrumId}`).then((response) =>
      response.data.map((member: any) => ({
        ...member,
        startDate: new Date(member.startDate),
        finishDate: member.finishDate ? new Date(member.finishDate) : undefined,
      }))
    );
  },

  // Получение скрамов создателя
  getCreatorScrums: (): Promise<Scrum[]> => {
    return apiClient.get("/scrum/creator").then((response) => response.data);
  },

  // Получение всех скрамов
  getAllScrums: (): Promise<Scrum[]> => {
    return apiClient.get("/scrum/all").then((response) => response.data);
  },

  // --- DELETE --- //
  // Удаление скрама
  deleteScrum: (scrumId: string): Promise<void> => {
    return apiClient.delete(`/scrum/delete/${scrumId}`);
  },
};
