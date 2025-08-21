<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUsers } from '../../composables/useAllUserAdmin'
import { usePosts } from '../../composables/useAllPostAdmin'
import { useSubscriptions } from '../../composables/useAllSubscriptions'

const { users, fetchUsers, loading: usersLoading } = useUsers()
const { posts, fetchPosts, loading: postsLoading } = usePosts()
const { subscriptions, fetchSubscriptions, loading: subsLoading } = useSubscriptions()

onMounted(() => {
  fetchUsers()
  fetchPosts()
  fetchSubscriptions()
})

// Computed properties
const totalUsers = computed(() => Array.isArray(users.value) ? users.value.length : 0)
const totalPosts = computed(() => Array.isArray(posts.value) ? posts.value.length : 0)

// Total earnings from subscriptions
const totalEarnings = computed(() => {
  if (!Array.isArray(subscriptions.value)) return 0
  return subscriptions.value.reduce((sum, sub) => sum + (sub.planPrice || 0), 0)
})

// Get latest 2 posts (sorted by createdAt descending)
const latestPosts = computed(() => {
  if (!Array.isArray(posts.value)) return []
  return [...posts.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)
})
</script>

<template>
  <div class="p-6 space-y-8">
    <h1 class="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

    <!-- Summary cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gray-100 text-gray-900 p-6 rounded shadow text-center">
        <h2 class="text-lg font-semibold">Total Users</h2>
        <p class="text-3xl font-bold mt-2">{{ totalUsers }}</p>
      </div>

      <div class="bg-gray-100 text-gray-900 p-6 rounded shadow text-center">
        <h2 class="text-lg font-semibold">Total Posts</h2>
        <p class="text-3xl font-bold mt-2">{{ totalPosts }}</p>
      </div>

      <div class="bg-gray-100 text-gray-900 p-6 rounded shadow text-center">
        <h2 class="text-lg font-semibold">Total Earnings</h2>
        <div v-if="subsLoading" class="text-gray-500">Calculating...</div>
        <p v-else class="text-3xl font-bold mt-2">${{ totalEarnings.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Latest Posts Section -->
    <div>
      <h2 class="text-2xl font-bold mb-4">Latest Posts</h2>

      <div v-if="postsLoading" class="text-gray-600 text-center">Loading...</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="post in latestPosts"
          :key="post.id"
          class="border rounded shadow p-4 bg-white"
        >
          <h3 class="font-semibold text-lg mb-2">{{ post.title }}</h3>
          <p class="text-gray-700 line-clamp-3 mb-2">{{ post.description }}</p>
          <img
            v-if="post.imageUrl"
            :src="post.imageUrl"
            class="w-full h-36 object-cover rounded mb-2"
          />
          <p class="text-sm text-gray-500">User ID: {{ post.userId }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
