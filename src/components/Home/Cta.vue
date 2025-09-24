<template>
  <div class="bg-primary/5 py-20">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl md:text-4xl mb-6 text-primary">
        Ready to Get Organized?
      </h2>
      <p class="text-xl text-primary/70 mb-8">
        Join thousands of productive people who trust TodoApp to manage their
        daily tasks.
      </p>
      <RouterLink
        to="/add-todo"
        class="text-white bg-primary px-6 py-3 rounded-md font-medium"
      >
        Create Your First Todo
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
<style scoped></style>
