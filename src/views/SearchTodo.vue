<template>
  <div class="py-10 px-2 lg:px-20 space-y-10">
    <section>
      <h1 class="text-3xl mb-2">Search Todos</h1>
      <p class="text-primary/70 text-xl">Find specific todos quickly</p>
    </section>
    <section
      class="space-y-8 border border-accent rounded-xl py-10 px-6 lg:w-[80%]"
    >
      <label for="search-todo" class="flex items-center relative">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search by title..."
          class="text-lg px-6 autofill-bg-white w-full focus:outline-4 focus:border-1 bg-primary/10 py-3 rounded-xl outline-accent"
        />
        <ph-x
          v-if="searchTerm"
          @click="searchTerm = ''"
          size="30"
          class="absolute right-3"
        />
      </label>
    </section>
    <section>
      <div v-if="filteredTodos.length === 0" class="text-gray-500">
        Start Searching
      </div>
      <ul>
        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="border-accent px-4 rounded-xl space-y-2 hover:bg-accent py-2"
        >
          <router-link :to="`/todos/${todo.id}`" class="font-semibold text-lg">
            {{ todo.title }}
          </router-link>
          <span
            class="ml-2 px-2 py-1 rounded text-xs"
            :class="
              todo.completed
                ? 'bg-primary/70 text-white'
                : 'border p-2 text-primary'
            "
          >
            {{ todo.completed ? "Completed" : "Pending" }}
          </span>
        </li>
      </ul>
    </section>
    <section
      class="space-y-8 border border-accent rounded-xl py-10 px-6 w-[80%]"
    >
      <h2 class="text-xl font-semibold">Search Tips</h2>
      <ul class="list-disc pl-6 space-y-1 text-lg text-primary/70">
        <li>Search is case-insensitive</li>
        <li>You can search for partial words</li>
        <li>Search is automatic so you can just type</li>
        <li>Use the clear button (×) to reset your search</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTodos } from "../composable/useTodos";
import { PhX } from "@phosphor-icons/vue";

const { fullTodos, fetchTodos } = useTodos();
const searchTerm = ref("");

onMounted(() => {
  fetchTodos();
});

const filteredTodos = computed(() => {
  if (!searchTerm.value.trim()) return [];
  return fullTodos.value.filter((todo) =>
    todo.title?.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
</script>
