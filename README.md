# Horizon Vue Todo App

A modern, full-featured todo application built with Vue 3, TypeScript, Vite, and Firebase. This app demonstrates authentication, CRUD operations, search, filtering, and offline persistence, with a beautiful responsive UI.

## Features

- **User Authentication**: Sign up and log in with email/password or Google. Auth state is managed globally.
- **Firebase Integration**: Todos are stored in Firestore, with offline persistence enabled.
- **JSONPlaceholder Integration**: Fetches 200 sample todos from JSONPlaceholder for demo/testing.
- **Combined Todo List**: Displays user-created todos (Firebase) on top, followed by sample todos (JSONPlaceholder).
- **Pagination**: Main todos page shows 10 todos per page, with working pagination controls.
- **Search**: Search all todos (Firebase + JSONPlaceholder) by title. Results update instantly as you type.
- **Filtering**: Filter todos by status (All, Completed, Pending).
- **Edit & Delete**: Edit todo titles inline, mark as completed, or delete todos.
- **Add Todo**: Add new todos to Firebase with instant feedback and validation.
- **Todo Details**: View details for any todo. Fetches from Firebase or JSONPlaceholder depending on source.
- **Offline Support**: Firestore persistence allows usage without internet.
- **Responsive UI**: Mobile and desktop navigation, modern design, and icons via Phosphor Icons.

## Project Structure

```
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Checkbox.vue
│   │   ├── LoadingPage.vue
│   │   ├── Nav.vue
│   │   ├── Pagination.vue
│   │   └── Seperator.vue
│   ├── composable/
│   │   └── useTodos.ts
│   ├── views/
│   │   ├── AddTodo.vue
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── SearchTodo.vue
│   │   ├── SignUp.vue
│   │   ├── Todos.vue
│   │   └── TodoDetails.vue
│   ├── App.vue
│   ├── firebase.ts
│   ├── main.ts
│   ├── router/
│   │   └── index.ts
│   └── style.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Setup & Installation

1. **Clone the repository**
	```bash
	git clone https://github.com/abuchi-ude/vue-todo.git
	cd vue-todo
	```
2. **Install dependencies**
	```bash
	npm install
	# or
	pnpm install
	```
3. **Firebase Setup**
	- Create a Firebase project.
	- Enable Firestore and Authentication (Email/Password, Google).
	- Replace the config in `src/firebase.ts` with your Firebase credentials.
	- Make sure Firestore rules allow read/write for authenticated users.
4. **Run the app**
	```bash
	npm run dev
	# or
	pnpm dev
	```
5. **Access the app**
	- Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- **Sign Up**: Create an account with email/password or Google.
- **Login**: Access your todos after authentication.
- **Add Todo**: Create new todos with validation.
- **View Todos**: Paginated list, filter by status, edit, delete, and mark as completed.
- **Search**: Find todos by title from both Firebase and JSONPlaceholder.
- **Todo Details**: Click any todo to view details. Source is detected automatically.
- **Offline**: Your Firebase todos are available offline.

## Technologies Used

- Vue 3 + Vite
- TypeScript
- Firebase (Auth, Firestore)
- JSONPlaceholder (demo todos)
- Phosphor Icons
- Tailwind CSS (or custom CSS)

## Notes

- No license is provided for this project.
- For production, update Firebase rules and remove demo todos.
- This app is for learning/demo purposes.

## Author

Created by Abuchi Ude.

---

Feel free to fork, modify, and use for your own learning or portfolio!
# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
