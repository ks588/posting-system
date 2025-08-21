<script setup lang="ts">
import { onMounted } from 'vue'
import { navigateTo } from '#app'

onMounted(() => {
  // Redirect to home after 2 seconds
  setTimeout(() => {
    navigateTo('/home')
  }, 2000)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-green-100 text-green-800">
    <div class="bg-white p-6 rounded-lg shadow-md text-center">
      <h1 class="text-2xl font-bold mb-2">Success!</h1>
      <p>Your action was completed successfully.</p>
      <p class="text-sm mt-2">Redirecting to home...</p>
    </div>
  </div>
</template>

<style scoped>
/* Optional: simple fade-in animation */
div > div {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
