<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Вход в систему
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Или
          <router-link :to="{ name: 'Register' }" class="font-medium text-indigo-600 hover:text-indigo-500">
            зарегистрируйтесь, если у вас нет аккаунта
          </router-link>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label for="username" class="sr-only">Имя пользователя</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Имя пользователя"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Пароль</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Пароль"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              v-model="form.remember"
              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">Запомнить меня</label>
          </div>
        </div>

        <div>
          <BaseButton
            type="submit"
            :loading="loading"
            class="w-full"
          >
            Войти
          </BaseButton>
        </div>
        
        <div v-if="error" class="rounded-md bg-red-50 p-4 mt-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import BaseButton from '@/components/common/BaseButton.vue';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const error = ref('');

const form = reactive({
  username: '',
  password: '',
  remember: false
});

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    await authStore.login(form.username, form.password);
    router.push({ name: 'Profile' });
  } catch (err: any) {
    error.value = err.message || 'Ошибка при входе. Пожалуйста, проверьте свои данные.';
  } finally {
    loading.value = false;
  }
};
</script>



