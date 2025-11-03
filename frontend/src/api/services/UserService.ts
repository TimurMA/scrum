import apiClient from '@api/client';
import { User } from '@/types'

export const UserService = {
    // --- GET --- //
    // Получение всех зарегистрированных пользователей
    getAllUsers: (): Promise<User[]> => {
        return apiClient.get('/user/all').then(response => response.data);
    },
    
    getCurrentUser: (): Promise<User> => {
        return apiClient.get('/user/current').then(response => response.data);
    },
    
    getUserById: (userId: string): Promise<User> => {
        return apiClient.get(`/user/${userId}`).then(response => response.data);
    },
    
    updateUser: (userId: string, userData: Partial<User>): Promise<User> => {
        return apiClient.put(`/user/${userId}`, userData).then(response => response.data);
    }
};