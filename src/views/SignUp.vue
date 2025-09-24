<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useRouter } from "vue-router";
import Seperator from "../components/Seperator.vue";
import Checkbox from "../components/Checkbox.vue";
import {
  PhArrowLeft,
  PhGoogleLogo,
  PhUser,
  PhEnvelope,
  PhLock,
  PhEye,
  PhEyeSlash,
} from "@phosphor-icons/vue";
const accepted = ref(false);

const router = useRouter();

// Form fields
const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const seePassword = ref(false);
const seeConfirmPassword = ref(false);
const loading = ref(false);
const error = ref("");

// Errors object
const errors = ref({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// Icons
const currentIcon1 = computed(() => (seePassword.value ? PhEyeSlash : PhEye));
const currentIcon2 = computed(() =>
  seeConfirmPassword.value ? PhEyeSlash : PhEye
);
const inputType1 = computed(() => (seePassword.value ? "text" : "password"));
const inputType2 = computed(() =>
  seeConfirmPassword.value ? "text" : "password"
);

// Real-time validation
watch(fullName, (val) => {
  errors.value.fullName =
    val.length < 3 ? "Full name must be at least 3 characters." : "";
});

watch(email, (val) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errors.value.email = !emailRegex.test(val) ? "Invalid email address." : "";
});

watch(password, (val) => {
  errors.value.password =
    val.length < 6 ? "Password must be at least 6 characters." : "";
  // validate confirmPassword too
  errors.value.confirmPassword =
    confirmPassword.value && confirmPassword.value !== val
      ? "Passwords do not match."
      : "";
});

watch(confirmPassword, (val) => {
  errors.value.confirmPassword =
    val !== password.value ? "Passwords do not match." : "";
});

// Email/password signup
const signup = async () => {
  // Prevent submit if there are any errors or missing required fields
  if (
    errors.value.fullName ||
    errors.value.email ||
    errors.value.password ||
    errors.value.confirmPassword ||
    !fullName.value.trim() ||
    !confirmPassword.value.trim()
  ) {
    if (!fullName.value.trim()) {
      errors.value.fullName = "Full name is required.";
    }
    if (!confirmPassword.value.trim()) {
      errors.value.confirmPassword = "Please confirm your password.";
    }
    return;
  }

  error.value = "";
  loading.value = true;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;

    // Save user in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName: fullName.value,
      email: user.email,
      createdAt: new Date(),
    });
    

    await nextTick();
    router.push("/todos");
  } catch (err: any) {
    if (err.code === "auth/email-already-in-use") {
      errors.value.email = "This email is already registered.";
    } else {
      error.value = err.message;
    }
  } finally {
    loading.value = false;
  }
};

// Google signup/login
const googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save user in Firestore if first time
    await setDoc(
      doc(db, "users", user.uid),
      {
        email: user.email,
        createdAt: new Date(),
      },
      { merge: true }
    );
    await nextTick();
    router.push("/todos");
  } catch (err: any) {
    error.value = err.message;
  }
};
</script>

<template>
  <!-- <div class="max-w-lg mx-auto mt-16 p-6 border rounded">
    <h1 class="text-xl font-bold mb-4">Sign Up</h1>

    Email/password form
    <input
      v-model="fullName"
      type="text"
      placeholder="Full Name"
      class="w-full mb-2 p-2 border rounded"
    />
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      class="w-full mb-2 p-2 border rounded"
    />

    <button @click="signup" class="w-full bg-blue-500 text-white p-2 rounded">
      {{ loading ? "Signing Up..." : "Sign Up" }}
    </button>

    <p class="text-center my-2">OR</p>

     Google login 
    <button
      @click="googleLogin"
      class="w-full bg-red-500 text-white p-2 rounded"
    >
      Sign up with Google
    </button>

    
  </div> -->
  <div className="flex-1 py-8 max-w-lg mx-auto px-2 text-primary">
    <section
      className="px-4 sm:px-6  lg:px-8 border w-fit rounded-xl hover:bg-accent border-accent"
    >
      <RouterLink to="/" className=" flex py-3 items-center">
        <ph-arrow-left class="mr-2" size="16" />
        <p>Back to Home</p>
      </RouterLink>
    </section>
    <section
      class="border border-accent px-4 sm:px-6 lg:px-8 rounded-2xl mt-10 py-10"
    >
      <div>
        <section className="text-center pb-4">
          <h1 className="text-2xl text-primary mb-2">Create Account</h1>
          <p className="text-primary/70">
            Join Horizon to start organizing your tasks
          </p>
        </section>
        <section className="space-y-6">
          <!-- Google login -->
          <button
            @click="googleLogin"
            class="w-full flex gap-4 items-center justify-center border hover:bg-accent border-accent rounded-xl text-primary p-2"
          >
            <ph-google-logo weight="bold" size="30" />
            <p class="font-medium text-xl">Continue with Google</p>
          </button>
        </section>
        <seperator />
        <section>
          <form @submit.prevent="signup" class="space-y-8">
            <section>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-primary font-medium text-xl"
                >
                  Full Name
                </label>
                <div className="relative flex">
                  <div className="absolute text-primary top-4 left-3">
                    <ph-user size="16" weight="bold" />
                  </div>
                  <input
                    v-model="fullName"
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    class="text-primary focus:outline-4 focus:border-1 autofill-bg-white outline-accent w-full py-3 pl-10 bg-primary/10 rounded-xl"
                  />
                </div>
                <p
                  v-if="errors.fullName"
                  class="text-red-500 pl-1 pt-1 text-sm"
                >
                  {{ errors.fullName }}
                </p>
              </div>
            </section>
            <section>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-primary font-medium text-xl"
                >
                  Email
                </label>
                <div className="relative flex">
                  <div className="absolute text-primary top-4 left-3">
                    <ph-envelope size="16" weight="bold" class="" />
                  </div>
                  <input
                    v-model="email"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    class="text-primary focus:outline-4 autofill-bg-white focus:border-1 outline-accent w-full py-3 pl-10 bg-primary/10 rounded-xl"
                  />
                </div>
                <p v-if="errors.email" class="text-red-500 text-sm">
                  {{ errors.email }}
                </p>
              </div>
            </section>
            <section>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-primary font-medium text-xl"
                >
                  Password
                </label>
                <div className="relative flex">
                  <div className="absolute text-primary top-4 left-3">
                    <ph-lock size="16" weight="bold" />
                  </div>
                  <input
                    id="password"
                    v-model="password"
                    :type="inputType1"
                    placeholder="Create a password"
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
                <p v-if="errors.password" class="text-red-500 text-sm">
                  {{ errors.password }}
                </p>
              </div>
            </section>
            <section>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-primary font-medium text-xl"
                >
                  Confirm Password
                </label>
                <div className="relative flex">
                  <div className="absolute text-primary top-4 left-3">
                    <ph-user size="16" weight="bold" />
                  </div>
                  <input
                    v-model="confirmPassword"
                    id="confirm-password"
                    :type="inputType2"
                    placeholder="Confirm your password"
                    class="text-primary focus:outline-4 focus:border-1 autofill-bg-white outline-accent w-full py-3 pl-10 bg-primary/10 rounded-xl"
                  />
                  <div class="absolute text-primary top-4 right-3">
                    <component
                      :is="currentIcon2"
                      @click="seeConfirmPassword = !seeConfirmPassword"
                      size="16"
                      weight="bold"
                    />
                  </div>
                </div>
                <p v-if="errors.confirmPassword" class="text-red-500 text-sm">
                  {{ errors.confirmPassword }}
                </p>
              </div>
            </section>
            <section>
              <checkbox
                msg1="I agree to the "
                msg2="Terms of Service"
                msg3="and"
                msg4="Private Policy"
                v-model="accepted"
              />
            </section>
            <section>
              <div
                class="border border-black rounded-md hover:scale-105 transition-all duration-200"
              >
                <button
                  type="submit"
                  class="flex justify-center w-full bg-primary text-white py-3 font-semibold text-xl"
                >
                  {{ loading ? "Creating Account..." : "Create Account" }}
                </button>
              </div>
            </section>
            <p class="text-red-500 mt-2 font-medium text-xl text-center">
              {{ error }}
            </p>
          </form>
          <div class="flex gap-1 justify-center text-lg mt-5">
            <p class="text-primary/70 font-medium">Already have an account?</p>
            <router-link
              to="/login"
              class="hover:underline text-primary font-semibold"
              >Sign in</router-link
            >
          </div>
        </section>
      </div>
    </section>
  </div>
</template>
