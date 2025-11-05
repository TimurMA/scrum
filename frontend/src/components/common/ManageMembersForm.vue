<script lang="ts" setup>
import { ref, onMounted } from "vue";

import { useScrumStore } from "@/stores/scrumStore";
import { useAuthStore } from "@/stores/authStore";
import { ScrumMember, User } from "@/types";

const emit = defineEmits<{
  (e: "cancel"): void;
}>();

const emailField = ref("");
const emailError = ref("");

const userStore = useAuthStore();
const scrumStore = useScrumStore();

const members = ref<ScrumMember[]>([]);
const notMembers = ref<User[]>([]);

onMounted(async () => {
  const scrumId = useScrumStore().currentScrumId;
  if (scrumId) {
    userStore.initUsers();
    scrumStore.fetchScrumMembers(scrumId);
    members.value = scrumStore.scrumMembers;

    notMembers.value = userStore.users.filter(
      (user) =>
        members.value.findIndex((m) => m.userEmail === user.email) === -1
    );
  }
});

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function addMemberByEmail() {
  emailError.value = "";

  if (!emailField.value.trim()) {
    emailError.value = "Введите email";
    return;
  }

  if (!validateEmail(emailField.value)) {
    emailError.value = "Введите корректный email";
    return;
  }

  const existingMember = members.value.find(
    (member) =>
      member.userEmail.toLowerCase() === emailField.value.toLowerCase()
  );

  if (existingMember) {
    emailError.value = "Пользователь уже в команде";
    return;
  }

  await addMembers(emailField.value);
  emailField.value = "";
}

const addMembers = async (email: string) => {
  const scrumId = useScrumStore().currentScrumId;
  if (scrumId) {
    await scrumStore.addScrumMembers(scrumId, email);
    members.value = scrumStore.scrumMembers;
    notMembers.value = userStore.users.filter(
      (user) =>
        members.value.findIndex((m) => m.userEmail === user.email) === -1
    );
  }
};

const kickMember = async (email: string) => {
  const scrumId = useScrumStore().currentScrumId;
  if (scrumId) {
    await scrumStore.kickScrumMember(scrumId, email);
    members.value = scrumStore.scrumMembers;
    notMembers.value = userStore.users.filter(
      (user) =>
        members.value.findIndex((m) => m.userEmail === user.email) === -1
    );
  }
};
</script>

<template>
  <div class="scrum-members-modal">
    <div class="scrum-members-modal__header">
      <h2 class="scrum-members-modal__title">Управление участниками скрама</h2>
      <button class="scrum-members-modal__close-btn" @click="emit('cancel')">
        ×
      </button>
    </div>

    <div class="users-management">
      <div class="users-management__columns">
        <div class="users-column">
          <label class="form-label">Добавить участников:</label>
          <div class="email-input-group">
            <input
              v-model="emailField"
              type="email"
              class="form-input"
              :class="{ 'form-input--error': emailError }"
              placeholder="Введите email участника"
              @keypress.enter="addMemberByEmail"
            />
            <button class="email-add-btn" @click="addMemberByEmail">
              Добавить
            </button>
          </div>
          <div v-if="emailError" class="form-error">{{ emailError }}</div>

          <div class="email-hint">
            Введите email и нажмите "Добавить" или Enter
          </div>

          <div class="available-users">
            <label class="form-label">Доступные пользователи:</label>
            <div class="users-list" v-if="notMembers.length > 0">
              <div
                class="user-item"
                v-for="user in notMembers"
                :key="user.email"
              >
                <div class="user-info">
                  <div class="user-name">
                    {{ user.username }}
                  </div>
                  <div class="user-email">
                    {{ user.email }}
                  </div>
                </div>
                <button
                  @click="addMembers(user.email)"
                  class="user-add-btn"
                  title="Добавить в команду"
                >
                  +
                </button>
              </div>
            </div>

            <div class="empty-state" v-else>
              <div class="empty-state__icon">✅</div>
              <div class="empty-state__text">Все пользователи добавлены</div>
              <div class="empty-state__hint">
                Для добавления новых пользователей используйте поле выше
              </div>
            </div>
          </div>
        </div>

        <div class="users-column">
          <label class="form-label">
            Участники скрама: {{ members.length }}
          </label>

          <div class="users-list" v-if="members.length > 0">
            <div
              class="user-item"
              v-for="member in members"
              :key="member.userEmail"
            >
              <div class="user-info">
                <div class="user-name">
                  {{ member.username || "Незарегистрированный" }}
                </div>
                <div class="user-email">
                  {{ member.userEmail }}
                </div>
              </div>
              <button
                class="user-remove-btn"
                @click="kickMember(member.userEmail)"
                title="Удалить из команды"
              >
                ×
              </button>
            </div>
          </div>

          <div class="empty-state" v-else>
            <div class="empty-state__icon">👥</div>
            <div class="empty-state__text">Нет участников в скраме</div>
            <div class="empty-state__hint">
              Добавьте пользователей по email или из списка доступных
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="action-btn action-btn--secondary" @click="emit('cancel')">
        Закрыть
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrum-members-modal {
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  width: 800px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.scrum-members-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
}

.scrum-members-modal__title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.scrum-members-modal__close-btn {
  background: none;
  border: none;
  font-size: 1.75rem;
  cursor: pointer;
  color: #6c757d;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.scrum-members-modal__close-btn:hover {
  background-color: #f8f9fa;
  color: #dc3545;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #fafafa;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input--error {
  border-color: #dc3545;
  background-color: #fef2f2;
}

.form-input--error:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.form-error {
  color: #dc3545;
  font-size: 0.875rem;
  font-weight: 500;
}

.users-management__columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.users-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.email-input-group {
  display: flex;
  gap: 0.75rem;
}

.email-add-btn {
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.email-add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}

.email-add-btn:active {
  transform: translateY(0);
}

.email-hint {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
  line-height: 1.4;
}

.available-users {
  margin-top: 0.5rem;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  background-color: #fafafa;
}

.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.user-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

.user-email {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.user-role {
  font-size: 0.75rem;
  color: #059669;
  background-color: #d1fae5;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  display: inline-block;
  font-weight: 500;
}

.user-add-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1.25rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.user-add-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
}

.user-remove-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1.25rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.user-remove-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.4);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  text-align: center;
  color: #6b7280;
  background-color: #f9fafb;
}

.empty-state__icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-state__text {
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.empty-state__hint {
  font-size: 0.9rem;
  line-height: 1.5;
  max-width: 200px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
}

.action-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn--secondary {
  background-color: #6b7280;
  color: white;
}

.action-btn--secondary:hover {
  background-color: #4b5563;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Scrollbar styling */
.users-list::-webkit-scrollbar {
  width: 6px;
}

.users-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.users-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.users-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
