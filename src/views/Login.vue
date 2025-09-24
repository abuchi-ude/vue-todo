<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter } from "vue-router";
import { setDoc, doc } from "firebase/firestore";
import {
  PhArrowLeft,
  PhGoogleLogo,
  PhEnvelope,
  PhLock,
  PhEye,
  PhEyeSlash,
} from "@phosphor-icons/vue";
import Seperator from "../components/Seperator.vue";

const router = useRouter();
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const seePassword = ref(false);

const errors = ref({
  email: "",
  password: "",
});

// Email/password login
const login = async () => {
  if (errors.value.email || errors.value.password) return;

  error.value = "";
  loading.value = true;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/todos");
  } catch (err: any) {
    if (err.code === "auth/invalid-credential") {
      error.value = "Invalid email or password.";
    } else {
      error.value = err.message;
    }
  } finally {
    loading.value = false;
  }
};

// Google login
const googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save user in Firestore if first time
    await setDoc(
      doc(db, "users", user.uid),
      { email: user.email, lastLogin: new Date(), fullName: user.displayName || "", },
      { merge: true }
    );

    router.push("/todos");
  } catch (err: any) {
    error.value = err.message;
  }
};

const currentIcon1 = computed(() => (seePassword.value ? PhEyeSlash : PhEye));
const inputType1 = computed(() => (seePassword.value ? "text" : "password"));

// Real-time validation
watch(email, (val) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errors.value.email = !emailRegex.test(val) ? "Invalid email address." : "";
});

watch(password, (val) => {
  errors.value.password =
    val.length < 6 ? "Password must be at least 6 characters." : "";
});
</script>

<template>
  <div class="flex-1 py-8 px-2 max-w-lg mx-auto text-primary">
    <section
      class="px-4 sm:px-6 lg:px-8 border w-fit rounded-xl hover:bg-accent border-accent"
    >
      <RouterLink to="/" class="flex py-3 items-center">
        <ph-arrow-left class="mr-2" size="16" />
        <p>Back to Home</p>
      </RouterLink>
    </section>

    <section
      class="border border-accent px-4 sm:px-6 lg:px-8 rounded-2xl mt-10 py-10"
    >
      <div>
        <section class="text-center pb-4">
          <h1 class="text-2xl text-primary mb-2">Welcome Back</h1>
          <p class="text-primary/70">Sign in to access your todos</p>
        </section>

        <section class="space-y-6">
          <!-- Google login -->
          <button
            @click="googleLogin"
            class="w-full flex gap-4 items-center justify-center border hover:bg-accent border-accent rounded-xl text-primary p-2"
          >
            <ph-google-logo weight="bold" size="30" />
            <p class="font-medium text-xl">Continue with Google</p>
          </button>
        </section>

        <Seperator />

        <section>
          <form @submit.prevent="login" class="space-y-8">
            <section>
              <div>
                <label
                  for="email"
                  class="block mb-2 text-primary font-medium text-xl"
                >
                  Email
                </label>
                <div class="relative flex">
                  <div class="absolute text-primary top-4 left-3">
                    <ph-envelope size="16" weight="bold" />
                  </div>
                  <input
                    v-model="email"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    class="text-primary focus:outline-4 autofill-bg-white focus:border-1 outline-accent w-full py-3 pl-10 bg-primary/10 rounded-xl"
                  />
                </div>
                <p v-if="errors.email" class="text-red-500 pl-1 pt-1 text-sm">
                  {{ errors.email }}
                </p>
              </div>
            </section>

            <section>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-primary font-medium text-xl"
                >
                  Password
                </label>
                <div class="relative flex">
                  <div class="absolute text-primary top-4 left-3">
                    <ph-lock size="16" weight="bold" />
                  </div>
                  <input
                    id="password"
                    v-model="password"
                    :type="inputType1"
                    placeholder="Enter your password"
                    class="text-primary focus:outline-4 focus:border-1 autofill-bg-white outline-accent w-full py-3 pl-10 bg-primary/10 rounded-xl"
                  />
                  <div class="absolute text-primary top-4 right-3">
                    <component
                      :is="currentIcon1"
                      @click="seePassword = !seePassword"
                      size="16"
                      weight="bold"
                    />
                  </div>
                </div>
                <p
                  v-if="errors.password"
                  class="text-red-500 pl-1 pt-1 text-sm"
                >
                  {{ errors.password }}
                </p>
              </div>
            </section>

            <section>
              <div
                class="border border-black rounded-md hover:scale-105 transition-all duration-200"
              >
                <button
                  type="submit"
                  class="flex justify-center w-full bg-primary text-white py-3 font-semibold text-xl"
                >
                  {{ loading ? "Signing In..." : "Sign In" }}
                </button>
              </div>
            </section>

            <p class="text-red-500 mt-2 font-medium text-xl text-center">
              {{ error }}
            </p>
          </form>

          <div class="flex gap-1 justify-center text-lg mt-5">
            <p class="text-primary/70 font-medium">Don't have an account?</p>
            <router-link
              to="/signup"
              class="hover:underline text-primary font-semibold"
              >Sign up</router-link
            >
          </div>
        </section>
      </div>
    </section>
  </div>
</template>
