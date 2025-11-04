<template>
  <div class="relative">
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">{{
      label
    }}</label>
    <div class="relative">
      <div class="flex">
        <input
          :id="id"
          v-model="inputValue"
          :placeholder="placeholder"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          @focus="showDropdown = true"
          @blur="handleBlur"
          @input="filterTags"
          autocomplete="off"
        />
        <div
          class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1"
        >
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600"
            v-if="inputValue !== ''"
            @click="toggleColorPicker"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                :fill="pickedColor"
              />
            </svg>
          </button>

          <button
            type="button"
            class="text-gray-400 hover:text-gray-600"
            v-if="inputValue !== ''"
            @click="saveTag"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM13 17L13 13H17V11H13V7H11V11H7V13H11V17H13Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <button
            type="button"
            class="text-gray-400 hover:text-gray-600"
            @click="toggleDropdown"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
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
        </div>
      </div>
      <div
        v-if="showDropdown"
        class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1 max-h-60 overflow-y-auto custom-scrollbar"
        @click.stop
      >
        <div
          v-for="tag in filteredTags"
          :key="tag.id"
          class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
          @mousedown.prevent="selectTag(tag.name)"
        >
          <div
            class="w-3 h-3 rounded-full mr-2"
            :style="{ backgroundColor: tag.color }"
          ></div>
          <span>{{ tag.name }}</span>
        </div>
      </div>
    </div>
  </div>
  <Vue3ColorPicker v-if="showColorPicker" type="HEX" v-model="pickedColor" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { Vue3ColorPicker } from "@cyhnkckali/vue3-color-picker";
import { taskService } from "@/api/services/TaskService";
import { useTaskStore } from "@stores/taskStore";
import { TaskTag } from "@/types";

const props = defineProps<{
  modelValue: string;
  id: string;
  label: string;
  placeholder?: string;
  scrumId: string | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const taskStore = useTaskStore();

const projectTags = computed(() => taskStore.taskTags);

const inputValue = ref("");
const showDropdown = ref(false);
const filteredTags = ref<Array<any>>([]);
const tagExists = ref(false);
const pickedColor = ref<string>("#FF0000");
const showColorPicker = ref(false);

onMounted(async () => {
  const scrumId = props.scrumId;
  if (scrumId) {
    if (taskStore.taskTags.length === 0) {
      await taskStore.loadTags(scrumId);
    }

    filterTags();
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    const tag = projectTags.value.find((t) => t.id === newValue);
    inputValue.value = tag ? tag.name : "";
  },
  { immediate: true }
);

watch(
  projectTags,
  () => {
    filterTags();
  },
  { deep: true }
);

const filterTags = () => {
  const input = inputValue.value.trim().toLowerCase();

  if (!input) {
    filteredTags.value = projectTags.value;
  } else {
    filteredTags.value = projectTags.value.filter((tag) =>
      tag.name.toLowerCase().includes(input)
    );
  }

  tagExists.value = !!projectTags.value.find(
    (tag) => tag.name.toLowerCase() === input
  );
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
  if (showDropdown.value) {
    filterTags();
  }
};

const toggleColorPicker = () => {
  showColorPicker.value = !showColorPicker.value;
};

const saveTag = async () => {
  const scrumId = props.scrumId;
  if (scrumId) {
    const taskTag = {
      scrumId,
      color: pickedColor.value,
      name: inputValue.value,
    };

    const response = await taskService.createTag(taskTag);

    if (response instanceof Error) {
      console.log(response);
    } else {
      taskStore.taskTags.push(response);

      filterTags();

      emit("update:modelValue", response.id);
    }
  }
};

const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;

    const input = inputValue.value.trim();
    if (!input) {
      emit("update:modelValue", "");
      return;
    }

    const existingTag = projectTags.value.find(
      (tag) => tag.name.toLowerCase() === input.toLowerCase()
    );

    if (existingTag) {
      emit("update:modelValue", existingTag.id);
    } else {
    }
  }, 200);
};

const selectTag = async (tagName: string) => {
  inputValue.value = tagName;

  if (!tagName) {
    emit("update:modelValue", "");
    showDropdown.value = false;
    return;
  }

  const existingTag = projectTags.value.find(
    (tag) => tag.name.toLowerCase() === tagName.toLowerCase()
  );

  if (existingTag) {
    emit("update:modelValue", existingTag.id);
  }

  showDropdown.value = false;
};
</script>
