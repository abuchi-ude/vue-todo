import { createRouter, createWebHistory } from "vue-router";

// import your pages (views)
import Home from "../views/Home.vue";
import Todos from "../views/Todos.vue";
import AddTodo from "../views/AddTodo.vue";
import SearchTodo from "../views/SearchTodo.vue";
import Login from "../views/Login.vue";
import SignUp from "../views/SignUp.vue";

import { auth } from "../firebase"; // import firebase auth
import { onAuthStateChanged } from "firebase/auth";
import TodoDetails from "../views/TodoDetails.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/todos", component: Todos, meta: { requiresAuth: true } },
  { path: "/add-todo", component: AddTodo, meta: { requiresAuth: true } },
  { path: "/todos/:id", component: TodoDetails, props: true },
  { path: "/login", component: Login },
  { path: "/search", component: SearchTodo, meta: { requiresAuth: true } },
  { path: "/signup", component: SignUp },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard
let authResolved = false;
let currentUser: any = null;

function waitForAuth() {
  return new Promise((resolve) => {
    if (authResolved) {
      resolve(currentUser);
    } else {
      onAuthStateChanged(auth, (user) => {
        currentUser = user;
        authResolved = true;
        resolve(user);
      });
    }
  });
}

router.beforeEach(async (to, _, next) => {
  const user = await waitForAuth();
  if (to.meta.requiresAuth && !user) {
    next("/login");
  } else {
    next();
  }
});

export default router;
