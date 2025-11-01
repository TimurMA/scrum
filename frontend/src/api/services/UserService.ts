import apiClient from '@api/client';
import {User} from '@/types'

export const userService = {
    // --- GET --- //
    // Получение всех зарегистрированных пользователей
    getAllUsers: (): Promise<User[]> => {
        return apiClient.get('/user/all').then(response => response.data);
    },
};