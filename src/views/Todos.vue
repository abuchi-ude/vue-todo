<template>
  <LoadingPage v-if="loadingTodos" />
  <div v-else class="px-2 flex flex-col gap-8 lg:px-20 py-10">
    <section class="flex justify-between">
      <div>
        <h1 class="text-3xl mb-2">Your Todos</h1>
        <p class="text-primary/70 text-xl">Manage and track your tasks</p>
      </div>
      <div>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="successMessage" class="success">{{ successMessage }}</div>
      </div>
    </section>
    <section>
      <button
        class="p-2 text-xl rounded-lg hover:bg-accent border-accent border mr-2"
        :class="
          activeFilter === 'all'
            ? 'bg-primary text-white hover:bg-primary'
            : 'bg-white text-primary'
        "
        @click="activeFilter = 'all'"
      >
        ALL
      </button>
      <button
        class="p-2 text-xl rounded-lg hover:bg-accent border-accent border mr-2"
        :class="
          activeFilter === 'completed'
            ? 'bg-primary text-white hover:bg-primary'
            : 'bg-white text-primary'
        "
        @click="activeFilter = 'completed'"
      >
        Completed
      </button>
      <button
        class="p-2 text-xl rounded-lg hover:bg-accent border-accent border mr-2"
        :class="
          activeFilter === 'pending'
            ? 'bg-primary text-white hover:bg-primary'
            : 'bg-white text-primary'
        "
        @click="activeFilter = 'pending'"
      >
        Pending
      </button>
    </section>
    <section>
      <ul>
        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="p-6 border rounded-lg hover:scale-105 transition-all duration-200 border-accent mb-2"
        >
          <div>
            <!-- If editing, show input -->
            <template v-if="editingTodoId === todo.id">
              <input
                v-model="editTitle"
                class="border rounded p-2 mr-2"
                placeholder="Edit todo title"
              />
              <button
                class="bg-green-500 text-white px-3 py-1 rounded mr-2"
                :disabled="updating"
                @click="saveEdit(todo.id)"
              >
                {{ updating ? "Saving..." : "Save" }}
              </button>
              <button
                class="bg-gray-400 text-white px-3 py-1 rounded"
                @click="cancelEdit"
              >
                Cancel
              </button>
            </template>

            <!-- Otherwise just show title -->
            <template v-else>
              <div class="flex justify-between items-center lg:text-xl">
                <div class="flex gap-2 items-center">
                  <div
                    @click="updateTodo(todo.id, { completed: !todo.completed })"
                  >
                    <Checkbox
                      msg1=""
                      msg2=""
                      msg3=""
                      msg4=""
                      v-model="todo.completed"
                    />
                  </div>
                  <router-link
                    :to="`/todos/${todo.id}`"
                    :class="{ done: todo.completed }"
                    class="lg:text-2xl font-medium"
                  >
                    {{ capitalizeFirst(todo.title) }}
                  </router-link>
                </div>

                <div class="flex justify-between items-center">
                  <button
                    class="text-primary font-medium px-4 py-1 rounded-lg mr-2"
                    :class="[
                      todo.completed ? 'bg-accent' : 'border border-accent',
                    ]"
                    :disabled="updating"
                  >
                    {{ todo.completed ? "Completed" : "Pending" }}
                  </button>
                  <button
                    class="text-primary border border-accent px-4 py-1 rounded-lg mr-2 hover:bg-accent"
                    @click="startEdit(todo)"
                  >
                    <PhPen size="30" />
                  </button>
                  <button
                    class="px-4 py-1 rounded-lg border border-accent text-red-800 hover:bg-accent"
                    :disabled="deleting"
                    @click="deleteTodo(todo.id)"
                  >
                    <PhTrash size="30" />
                  </button>
                </div>
              </div>
            </template>
          </div>
        </li>
      </ul>
    </section>
    <section>
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @change-page="fetchTodos"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useTodos } from "../composable/useTodos";
import LoadingPage from "../components/LoadingPage.vue";

const {
  todos,
  error,
  successMessage,
  loadingTodos,
  updating,
  deleting,
  currentPage,
  totalPages,
  fetchTodos,
  updateTodo,
  deleteTodo,
} = useTodos();

const activeFilter = ref<"all" | "completed" | "pending">("all");
const filteredTodos = computed(() => {
  if (activeFilter.value === "completed") {
    return todos.value.filter((todo) => todo.completed);
  } else if (activeFilter.value === "pending") {
    return todos.value.filter((todo) => !todo.completed);
  }
  return todos.value;
});

onMounted(() => {
  fetchTodos();
});

function capitalizeFirst(val: unknown) {
  const s = String(val ?? "");
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

import { ref, watch, computed } from "vue";

// Track editing
const editingTodoId = ref<number | null>(null);
const editTitle = ref("");

function startEdit(todo: any) {
  editingTodoId.value = todo.id;
  editTitle.value = todo.title;
}

function cancelEdit() {
  editingTodoId.value = null;
  editTitle.value = "";
}

async function saveEdit(id: number) {
  if (!editTitle.value.trim()) {
    cancelEdit();
    return;
  }
  try {
    await updateTodo(id, { title: editTitle.value });
    cancelEdit();
  } catch (e) {
    console.error(e);
  }
}

watch(error, (val) => {
  if (val) {
    setTimeout(() => {
      error.value = null;
    }, 2000);
  }
});

// Auto-clear success message after 2 seconds
watch(successMessage, (val) => {
  if (val) {
    setTimeout(() => {
      successMessage.value = null;
    }, 2000);
  }
});

import { PhPen, PhTrash } from "@phosphor-icons/vue";
import Checkbox from "../components/Checkbox.vue";
import Pagination from "../components/Pagination.vue";
</script>

<style scoped>
.success {
  color: green;
}
.error {
  color: red;
}
.done {
  text-decoration: line-through;
}
</style>
