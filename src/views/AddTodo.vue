<template>
  <div class="px-2 lg:px-20 py-10 space-y-10">
    <!-- Back Button -->
    <section
      class="px-4 sm:px-6 lg:px-8 border w-fit rounded-xl hover:bg-accent border-accent"
    >
      <RouterLink to="/todos" class="flex py-3 items-center">
        <ph-arrow-left class="mr-2" size="16" />
        <p>Back to your todos</p>
      </RouterLink>
    </section>

    <!-- Page Header -->
    <section>
      <h1 class="text-3xl mb-2">Add New Todo</h1>
      <p class="text-primary/70 text-xl">
        Create a new task to help you stay organized and productive
      </p>
    </section>

    <!-- Add Todo Form -->
    <section>
      <form
        @submit.prevent="handleAddTodo"
        class="space-y-8 border border-accent rounded-xl py-10 px-6 lg:w-[80%]"
      >
        <div class="flex flex-col gap-4">
          <label for="todo" class="mb-1 text-xl font-medium">Todo Title</label>
          <input
            id="todo"
            v-model="title"
            type="text"
            placeholder="Enter your todo title..."
            class="text-lg px-6 autofill-bg-white focus:outline-4 focus:border-1 bg-primary/10 py-3 rounded-xl outline-accent"
            required
            @keydown.enter="handleAddTodo"
          />
        </div>

        <div class="flex justify-between space-x-4  lg:text-lg font-medium">
          <button
            type="submit"
            class="flex items-center bg-primary/70 justify-center text-white w-5/10 lg:w-3/5 px-4 py-2 rounded-lg hover:bg-primary/50 disabled:opacity-50"
            :disabled="adding"
          >
            <ph-plus size="16" class="mr-2" color="#ffffff" />
            <span>{{ adding ? "Adding..." : "Add Todo" }}</span>
          </button>

          <RouterLink
            to="/todos"
            class="px-4 py-2 w-5/10 lg:w-3/10 text-center rounded-lg border border-accent hover:bg-accent"
          >
            View All Todos
          </RouterLink>
        </div>
      </form>

      <!-- Success & Error Messages -->
      <p v-if="successMessage" class="text-green-600 mt-2">
        {{ successMessage }}
      </p>
      <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
    </section>

    <!-- Tips Section -->
    <section
      class="space-y-8 border border-accent rounded-xl py-10 px-6 lg:w-[80%]"
    >
      <h2 class="text-xl font-semibold">Tips for Better Todo Management</h2>
      <ul class="list-disc pl-6 space-y-1 text-lg text-primary/70">
        <li>Keep titles clear and specific</li>
        <li>Break large tasks into smaller, actionable items</li>
        <li>Use the search feature to quickly find specific todos</li>
        <li>Review and update your todos regularly</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PhArrowLeft, PhPlus } from "@phosphor-icons/vue";
import { useTodos } from "../composable/useTodos";
import { useRouter } from "vue-router";

const { addTodo, adding, error, successMessage } = useTodos();
const title = ref("");
const router = useRouter();

const handleAddTodo = async () => {
  if (!title.value.trim()) return;
  try {
    await addTodo(title.value);
    title.value = ""; // reset input
    // Optionally redirect after adding:
    router.push("/todos");
  } catch (err) {
    console.error(err);
  }
};
</script>
