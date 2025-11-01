import apiClient from '@api/client';
import {User} from '@/types'

export const authService = {
    // --- POST --- //
    // Регистрация пользователя
    signUp: (userData: {  username: string; email: string; password: string;}): Promise<{ token: string; user: User }> => {
        return apiClient.post('/auth/sign/up', userData).then(response => response.data);
    },

    // Авторизация пользователя
    signIn: (credentials: { username: string; password: string }): Promise<{ token: string; user: User }> => {
        return apiClient.post('/auth/sign/in', credentials).then(response => response.data);
    },

    // Сохранение токена
    saveToken: (token: string): void => {
        localStorage.setItem('auth-token', token);
    },

    // Получение токена
    getToken: (): string | null => {
        return localStorage.getItem('auth-token');
    },

    // Выход
    logout: (): void => {
        localStorage.removeItem('auth-token');
    },

    // Проверка авторизации
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('auth-token');
    }
};