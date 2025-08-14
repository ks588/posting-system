<script setup lang="ts">
import { ref } from 'vue'

// Get user from sessionStorage
const userStr = sessionStorage.getItem('user')
const user = userStr ? JSON.parse(userStr) : { UserId: 0, username: '', email: '', role: '' }
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

    <div class="flex flex-col gap-1">
      <span class="font-semibold">Role:</span>
      <span>{{ user.role }}</span>
    </div>
  </div>
</template>
