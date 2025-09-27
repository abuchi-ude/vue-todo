// src/composables/useTodos.ts

import { ref } from "vue";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  enableIndexedDbPersistence,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  // Handle errors (e.g., multiple tabs open)
  console.warn("Firestore offline persistence error:", err);
});

export function useTodos() {
  // Get current user
  const auth = getAuth();
  const todos = ref<any[]>([]);
  const localTodos = ref<any[]>([]);
  const fullTodos = ref<any[]>([]);
  const error = ref<string | null>(null);
  const loadingTodos = ref(false);
  const adding = ref(false);
  const updating = ref(false);
  const deleting = ref(false);
  const successMessage = ref<string | null>(null);

  // Pagination state (optional, can be improved for Firestore)
  const currentPage = ref(1);
  const totalPages = ref(1);
  const limit = ref(10);
  const totalTodos = ref(0);

  // Fetch todos from both Firebase and JSONPlaceholder
  const firebaseTodos = ref<any[]>([]);
  const jsonTodos = ref<any[]>([]);
  const fetchTodos = async (page = 1) => {
    loadingTodos.value = true;
    error.value = null;
    successMessage.value = null;
    try {
      // Fetch only current user's Firebase todos
      const user = auth.currentUser;
      let q;
      if (user) {
        // Query todos where userId == current user's uid
        q = query(
          collection(db, "todos"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        firebaseTodos.value = querySnapshot.docs
          .map((doc) => {
            const data = doc.data() as any;
            return { id: doc.id, ...data };
          })
          .filter((todo) => todo.userId === user.uid);
      } else {
        // Not logged in, fetch none
        firebaseTodos.value = [];
      }

      // Fetch all JSONPlaceholder todos (max 200)
      const API_URL = "https://jsonplaceholder.typicode.com/todos";
      const res = await fetch(`${API_URL}?_limit=200`);
      if (!res.ok)
        throw new Error("Failed to fetch todos from JSONPlaceholder");
      jsonTodos.value = await res.json();

      // Combine: Firebase todos on top, then JSONPlaceholder todos
      const combined = [...firebaseTodos.value, ...jsonTodos.value];
      fullTodos.value = combined;
      totalTodos.value = combined.length;
      totalPages.value = Math.ceil(totalTodos.value / limit.value);
      currentPage.value = page;
      // Paginate combined todos
      const start = (page - 1) * limit.value;
      const end = start + limit.value;
      todos.value = combined.slice(start, end);
      successMessage.value = "Todos loaded successfully!";
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loadingTodos.value = false;
    }
  };

  // Add a todo to Firestore and local array
  const addTodo = async (title: string) => {
    adding.value = true;
    error.value = null;
    successMessage.value = null;
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const newTodo = {
        title,
        completed: false,
        createdAt: Date.now(),
        userId: user.uid,
      };
      // Add to Firestore
      const docRef = await addDoc(collection(db, "todos"), newTodo);
      const todoWithId = { id: docRef.id, ...newTodo };
      localTodos.value.unshift(todoWithId);
      todos.value.unshift(todoWithId);
      totalTodos.value++;
      totalPages.value = Math.ceil(totalTodos.value / limit.value);
      successMessage.value = "Todo added successfully!";
      return todoWithId;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      adding.value = false;
    }
  };

  // Update a todo in Firestore and local array
  const updateTodo = async (id: string, updates: Partial<any>) => {
    updating.value = true;
    error.value = null;
    successMessage.value = null;
    try {
      // Detect if todo is from Firebase or JSONPlaceholder
      // Firebase IDs are strings, JSONPlaceholder IDs are numbers <= 200
      const isJsonPlaceholder = !isNaN(Number(id)) && Number(id) <= 200;
      if (isJsonPlaceholder) {
        // JSONPlaceholder update (fake, not persisted)
        const API_URL = `https://jsonplaceholder.typicode.com/todos/${id}`;
        const res = await fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error("Failed to update JSONPlaceholder todo");
        // Update local state
        const index = todos.value.findIndex((t) => t.id === Number(id));
        if (index !== -1) todos.value[index] = { ...todos.value[index], ...updates };
        const localIndex = localTodos.value.findIndex((t) => t.id === Number(id));
        if (localIndex !== -1) localTodos.value[localIndex] = { ...localTodos.value[localIndex], ...updates };
        successMessage.value = "JSONPlaceholder todo updated (not persisted)!";
        return todos.value[index];
      } else {
        // Firebase update
        const docRef = doc(db, "todos", id);
        await updateDoc(docRef, updates);
        const index = todos.value.findIndex((t) => t.id === id);
        if (index !== -1) todos.value[index] = { ...todos.value[index], ...updates };
        const localIndex = localTodos.value.findIndex((t) => t.id === id);
        if (localIndex !== -1) localTodos.value[localIndex] = { ...localTodos.value[localIndex], ...updates };
        successMessage.value = "Todo updated successfully!";
        return todos.value[index];
      }
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      updating.value = false;
    }
  };

  // Delete a todo from Firestore and local array
  const deleteTodo = async (id: string) => {
    deleting.value = true;
    error.value = null;
    successMessage.value = null;
    try {
      const isJsonPlaceholder = !isNaN(Number(id)) && Number(id) <= 200;
      if (isJsonPlaceholder) {
        // JSONPlaceholder delete (fake, not persisted)
        const API_URL = `https://jsonplaceholder.typicode.com/todos/${id}`;
        const res = await fetch(API_URL, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete JSONPlaceholder todo");
        todos.value = todos.value.filter((t) => t.id !== Number(id));
        localTodos.value = localTodos.value.filter((t) => t.id !== Number(id));
        totalTodos.value--;
        totalPages.value = Math.ceil(totalTodos.value / limit.value);
        successMessage.value = "JSONPlaceholder todo deleted (not persisted)!";
      } else {
        // Firebase delete
        const docRef = doc(db, "todos", id);
        await deleteDoc(docRef);
        todos.value = todos.value.filter((t) => t.id !== id);
        localTodos.value = localTodos.value.filter((t) => t.id !== id);
        totalTodos.value--;
        totalPages.value = Math.ceil(totalTodos.value / limit.value);
        successMessage.value = "Todo deleted successfully!";
      }
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      deleting.value = false;
    }
  };

  // Combine todos for display (Firestore + local)
  // Keep allTodos for compatibility (search should use fullTodos)
  const allTodos = fullTodos;

  return {
    todos: todos,
    fullTodos,
    error,
    successMessage,
    loadingTodos,
    adding,
    updating,
    deleting,
    currentPage,
    totalPages,
    limit,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    localTodos,
    allTodos,
  };
}
