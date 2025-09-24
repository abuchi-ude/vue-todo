<template>
  <div class="flex items-center justify-center space-x-2 mt-6">
    <!-- Previous -->
    <button
      class="px-3 py-1 flex items-center gap-2 rounded disabled:opacity-50"
      :disabled="currentPage === 1"
      @click="$emit('change-page', currentPage - 1)"
    >
      <ph-arrow-left /> Prev
    </button>

    <!-- Page numbers -->
    <button
      v-for="page in totalPages"
      :key="page"
      class="px-3 hidden xl:block py-1 bg-accent rounded"
      :class="{
        'bg-primary text-white': page === currentPage,
        'hover:bg-primary/70 hover:text-white': page !== currentPage,
      }"
      @click="$emit('change-page', page)"
    >
      {{ page }}
    </button>
    <p class="xl:hidden">
      {{ currentPage }} of {{ totalPages }}
    </p>

    <!-- Next -->
    <button
      class="px-3 flex items-center gap-2 py-1 disabled:opacity-50"
      :disabled="currentPage === totalPages"
      @click="$emit('change-page', currentPage + 1)"
    >
      Next <PhArrowRight />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number;
  totalPages: number;
}>();

defineEmits<{
  (e: "change-page", page: number): void;
}>();

import { PhArrowLeft, PhArrowRight } from "@phosphor-icons/vue";
</script>
