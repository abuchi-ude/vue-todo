<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  msg1: string;
  msg2: string;
  msg3: string;
  msg4: string;
  modelValue?: boolean; // ✅ bind external value (e.g., todo.completed)
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

// internal state synced with modelValue
const checked = ref(props.modelValue ?? false);

watch(
  () => props.modelValue,
  (newVal) => {
    checked.value = newVal ?? false;
  }
);

watch(checked, (val) => {
  emit("update:modelValue", val);
});
</script>

<template>
  <label class="flex items-center space-x-2 cursor-pointer select-none">
    <!-- Hidden native checkbox -->
    <input
      id="checkbox"
      type="checkbox"
      v-model="checked"
      class="hidden peer"
    />

    <!-- Custom checkbox -->
    <div
      class="w-7 h-7 rounded-md flex items-center justify-center bg-primary/10 peer-checked:bg-primary transition-colors duration-200"
    >
      <!-- Tick -->
      <svg
        v-if="checked"
        class="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        viewBox="0 0 24 24"
      >
        <path d="M5 13l4 4L19 7" />
      </svg>
    </div>

    <!-- Dynamic messages -->
    <p class="text-primary/70 text-lg">
      {{ msg1 }}
      <a
        href="#"
        @click.prevent
        class="text-primary font-semibold cursor-default hover:underline"
      >
        {{ msg2 }}
      </a>
      {{ msg3 }}
      <a
        href="#"
        @click.prevent
        class="hover:underline text-primary cursor-default font-semibold"
      >
        {{ msg4 }}
      </a>
    </p>
  </label>
</template>
