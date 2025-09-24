<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { PhArrowLeft } from "@phosphor-icons/vue";
import LoadingPage from "../components/LoadingPage.vue";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const route = useRoute();
const todoId = route.params.id as string;

const todo = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);

function capitalizeFirst(val: unknown) {
  const s = String(val ?? "");
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

function isFirebaseId(id: string) {
  // Firebase IDs are usually 20+ chars, JSONPlaceholder IDs are numbers <= 200
  return isNaN(Number(id)) && id.length >= 20;
}

onMounted(async () => {
  try {
    if (isFirebaseId(todoId)) {
      // Fetch from Firebase
      const docRef = doc(db, "todos", todoId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("Todo not found in Firebase");
      todo.value = { id: docSnap.id, ...docSnap.data() };
    } else {
      // Fetch from JSONPlaceholder
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`
      );
      if (!res.ok) throw new Error("Failed to fetch todo details");
      todo.value = await res.json();
    }
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="px-2 lg:px-20 py-10 space-y-10">
    <div v-if="loading"><LoadingPage /></div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <section
      className="px-4 sm:px-6  lg:px-8 border w-fit rounded-xl hover:bg-accent border-accent"
    >
      <RouterLink to="/todos" className=" flex py-3 items-center">
        <ph-arrow-left class="mr-2" size="16" />
        <p>Back to your todos</p>
      </RouterLink>
    </section>
    <section>
      <h1 class="text-3xl mb-2">Todos Details</h1>
      <p class="text-primary/70 text-xl">View and manage your todo</p>
    </section>
    <section
      v-if="todo"
      class="border border-accent px-4 rounded-xl space-y-4 py-10"
    >
      <h1 class="text-2xl font-bold">
        Title: {{ capitalizeFirst(todo.title) }}
      </h1>
      <p class="text-lg">
        Status:
        <span :class="todo.completed ? 'text-green-600' : 'text-red-600'">
          {{ todo.completed ? "Completed" : "Pending" }}
        </span>
      </p>
      <p class="text-lg"><strong>ID:</strong> {{ todo.id }}</p>
      <div></div>
    </section>
  </div>
</template>
