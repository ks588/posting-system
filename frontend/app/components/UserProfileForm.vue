<script setup lang="ts">
import { ref } from 'vue'
import { navigateTo } from '#app'

// Get user from sessionStorage
const userStr = sessionStorage.getItem('user')
const user = userStr ? JSON.parse(userStr) : { UserId: 0, username: '', email: '', role: '' }

// Function to navigate to admin dashboard
function goToAdminDashboard() {
  navigateTo('/admin/dashboard')
}
</script>

<template>
  <div class="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold">User Details</h2>

    <div class="flex flex-col gap-1">
      <span class="font-semibold">Username:</span>
      <span>{{ user.username }}</span>
    </div>

    <div class="flex flex-col gap-1">
      <span class="font-semibold">Email:</span>
      <span>{{ user.email }}</span>
    </div>

    <div class="flex items-center gap-2">
      <span class="font-semibold">Role:</span>
      <span>{{ user.role }}</span>
      <!-- Show button only if role is admin -->
      <button
        v-if="user.role === 'admin'"
        @click="goToAdminDashboard"
        class="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Admin Dashboard
      </button>
    </div>
  </div>
</template>
