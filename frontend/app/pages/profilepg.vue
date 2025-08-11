<script setup>
import { ref } from 'vue'
import UserProfileForm from '~/components/UserProfileForm.vue'

const selectedItems = ref(new Array(6).fill(null))

function ordinal(n) {
  return n === 1
    ? 'first'
    : n === 2
    ? 'second'
    : n === 3
    ? 'third'
    : n === 4
    ? 'fourth'
    : n === 5
    ? 'fifth'
    : n === 6
    ? 'sixth'
    : n + 'th'
}
</script>

<template>
  <div class="p-6 min-h-screen flex gap-6 bg-white">
    <!-- Main Profile content - left side, flexible -->
    <main class="flex flex-col items-center bg-gray-200 rounded-lg p-6 space-y-6 mx-auto max-w-md w-full">
      <h2 class="self-start font-serif font-semibold text-lg mb-2">Profile</h2>

      <div
        class="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
        aria-label="User profile icon"
      >
        <img src="/user.png" alt="User profile" class="object-cover w-full h-full" />
      </div>

      <!-- Insert form component -->
      <UserProfileForm />

      <!-- Logout Button -->
      <button
        class="bg-gray-600 text-white px-8 py-2 rounded-md tracking-wider hover:bg-gray-700 transition"
      >
        Log Out
      </button>
    </main>

    <!-- Sidebar - right side fixed width -->
    <aside class="w-72 border-l border-gray-300 p-6 space-y-4">
      <h3 class="font-semibold mb-4">your posts,</h3>
      <div
        v-for="(item, i) in selectedItems"
        :key="i"
        class="bg-gray-300 rounded-md py-3 px-4 text-sm select-text"
      >
        this is your {{ ordinal(i + 1) }} posting
      </div>
    </aside>
  </div>
</template>
