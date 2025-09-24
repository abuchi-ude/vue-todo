<!-- src/components/LoadingOverlay.vue -->
<template>
  <div class="overlay">
    <div class="spinner"></div>
    <p>Loading...</p>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #ddd;
  border-top: 4px solid #42b883; /* Vue green */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

p {
  margin-top: 10px;
  font-size: 1.1rem;
  color: #333;
}
</style>
