<script setup lang="ts">
import { PhSunHorizon, PhList } from "@phosphor-icons/vue";
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const navMenu = ref(false);
const router = useRouter();

const currentUser = ref<{ email: string; fullName?: string } | null>(null);

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Fetch extra user data from Firestore
    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (docSnap.exists()) {
      currentUser.value = docSnap.data() as {
        email: string;
        fullName?: string;
      };
    } else {
      currentUser.value = { email: user.email || "" };
    }
  } else {
    currentUser.value = null;
  }
});

const logout = async () => {
  await signOut(auth);
  router.push("/login");
};
</script>

<template>
  <!-- Mobile Nav -->
  <div
    class="px-2 py-4 flex flex-col gap-2 lg:hidden text-primary border-b border-accent"
  >
    <div class="flex justify-between items-center">
      <section>
        <RouterLink to="/" class="flex gap-2 items-center justify-center">
          <PhSunHorizon size="60" weight="duotone" class="text-[#192D50]" />
          <div>
            <p class="text-sm">HORIZON</p>
            <p class="text-xs">By Abuchi</p>
          </div>
        </RouterLink>
      </section>

      <!-- Auth Section -->
      <section class="font-medium">
        <template v-if="currentUser">
          <span class="mr-2"
            >Hello, {{ currentUser.fullName || currentUser.email }}</span
          >
          <button
            @click="logout"
            class="p-2 text-sm bg-red-500 text-white rounded-md"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <RouterLink
            to="/login"
            class="p-2 text-sm hover:bg-gray-300 border-gray-200 border rounded-md mr-2"
          >
            Login
          </RouterLink>
          <RouterLink
            to="/signup"
            class="p-2 text-sm bg-[#192D50] text-white rounded-md"
            >Sign Up</RouterLink
          >
        </template>
      </section>

      <section>
        <PhList size="30" @click="navMenu = !navMenu" class="text-[#192D50]" />
      </section>
    </div>

    <div
      v-if="navMenu"
      class="border-t border-gray-200 flex flex-col py-2 px-2 font-medium"
    >
      <RouterLink to="/todos" class="p-2 hover:bg-gray-300 rounded-md"
        >Your Todos</RouterLink
      >
      <RouterLink to="/add-todo" class="p-2 hover:bg-gray-300 rounded-md"
        >Add Todos</RouterLink
      >
      <RouterLink to="/search" class="p-2 hover:bg-gray-300 rounded-md"
        >Search</RouterLink
      >
    </div>
  </div>

  <!-- Desktop Nav -->
  <div
    class="px-20 py-4 hidden lg:flex justify-between items-center text-primary border-b border-accent"
  >
    <section>
      <RouterLink to="/" class="flex gap-2 items-center justify-center">
        <PhSunHorizon size="80" weight="duotone" class="text-[#192D50]" />
        <div>
          <p class="text-2xl">HORIZON</p>
          <p class="text-sm">By Abuchi</p>
        </div>
      </RouterLink>
    </section>

    <section class="font-medium flex gap-4">
      <RouterLink to="/todos" class="p-2 text-lg hover:bg-gray-300 rounded-md"
        >Your Todos</RouterLink
      >
      <RouterLink
        to="/add-todo"
        class="p-2 text-lg hover:bg-gray-300 rounded-md"
        >Add Todos</RouterLink
      >
      <RouterLink to="/search" class="p-2 text-lg hover:bg-gray-300 rounded-md"
        >Search</RouterLink
      >
    </section>

    <section class="font-medium">
      <template v-if="currentUser">
        <span class="mr-4"
          >Hello, {{ currentUser.fullName || currentUser.email }}</span
        >
        <button
          @click="logout"
          class="p-2 text-lg bg-red-500 text-white rounded-md"
        >
          Logout
        </button>
      </template>
      <template v-else>
        <RouterLink
          to="/login"
          class="p-2 text-lg hover:bg-gray-300 border-gray-200 border rounded-md mr-2"
        >
          Login
        </RouterLink>
        <RouterLink
          to="/signup"
          class="p-2 text-lg bg-[#192D50] text-white rounded-md"
          >Sign Up</RouterLink
        >
      </template>
    </section>
  </div>
</template>
