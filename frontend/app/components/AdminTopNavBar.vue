<template>
  <div>
    <nav
      class="fixed top-0 left-0 w-full bg-white shadow-md px-4 py-1 pt-2 flex items-center justify-between z-50"
    >
      <!-- Left: Logo + Thought PAD -->
      <div class="flex items-center space-x-3">
        <img src="/smlogo.png" alt="App Icon" class="w-10" />
        <span class="font-bold text-xl whitespace-nowrap">Thought PAD</span>
      </div>

      <!-- Center: Navigation Links -->
      <ul class="hidden md:flex space-x-10 font-medium text-gray-700 text-sm">
        <li>
          <NuxtLink to="/home" class="hover:underline">User-Home</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/dashboard" class="hover:underline">DashBoard</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/user" class="hover:underline">User</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/post" class="hover:underline">Posts</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/admin/payments" class="hover:underline">Payments</NuxtLink>
        </li>
      </ul>

      <!-- Right: User Icon -->
      <div class="flex items-center space-x-4">
        <NuxtLink @click="userlogic" class="hover:underline">
          <img
            src="/user.png"
            alt="User Icon"
            class="w-7 pb-1 transition-transform duration-300 hover:scale-105"
          />
        </NuxtLink>
      </div>
    </nav>

    <!-- Optional modals -->
    <LoginRegisterChooseCard v-if="showAuthPrompt" @close="showAuthPrompt = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginRegisterChooseCard from './LoginRegisterChooseCard.vue'

const router = useRouter()
const showAuthPrompt = ref(false) // For login/register choice

// User icon click logic
function userlogic() {
  const token = sessionStorage.getItem('authtoken')
  if (token) {
    router.push('/profilepg')
  } else {
    showAuthPrompt.value = !showAuthPrompt.value
  }
}
</script>
