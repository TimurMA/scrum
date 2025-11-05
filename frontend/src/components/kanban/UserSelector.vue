<template>
  <div class="mb-4">
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{
      label
    }}</label>
    <div class="relative">
      <button
        type="button"
        :id="id"
        @click="toggleDropdown"
        class="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <div class="flex items-center">
          <div
            v-if="selectedScrumMember"
            class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2 text-sm"
          >
            {{ selectedScrumMember.initials }}
          </div>
          <span>{{
            selectedScrumMember ? selectedScrumMember.username : placeholder
          }}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <div
        v-if="showDropdown"
        class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1 max-h-60 overflow-y-auto custom-scrollbar"
        @click.stop
      >
        <div
          v-for="scrumMember in scrumMembers"
          :key="scrumMember.userEmail"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
          @mousedown.prevent="selectScrumMember(scrumMember.userEmail)"
        >
          <div
            v-if="scrumMember.username"
            class="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2 text-sm"
          >
            {{ getScrumMemberInitials(scrumMember) }}
          </div>
          <span>{{ scrumMember.username }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useScrumStore } from "@stores/scrumStore";

const props = defineProps<{
  modelValue: string;
  id: string;
  label: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const scrumStore = useScrumStore();
const showDropdown = ref(false);

const scrumMembers = computed(() => scrumStore.scrumMembers);

const selectedScrumMember = computed(() => {
  const scrumMember = scrumStore.getScrumMemberById(props.modelValue);
  if (!scrumMember) return null;

  return {
    ...scrumMember,
    initials: getScrumMemberInitials(scrumMember),
  };
});

const getScrumMemberInitials = (scrumMember: any): string => {
  if (!scrumMember || !scrumMember.username) return "";
  const username = scrumMember.username.trim();
  if (!username) return "";

  return username.substring(0, 2).toUpperCase();
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const selectScrumMember = (scrumMemberId: string) => {
  emit("update:modelValue", scrumMemberId);
  showDropdown.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(`#${props.id}`)) {
    showDropdown.value = false;
  }
};

watch(
  () => showDropdown.value,
  (isOpen) => {
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
  }
);
</script>
