<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserProfileForm from '../components/UserProfileForm.vue'
import EditPostModal from '../components/EditPostModal.vue'
import { postByUserId } from '../composables/postsByUser' // <-- import the composable


interface Post {
  id: number
  title: string
  description: string
  imageUrl?: string
  userId: number
  createdAt?: string
}

const posts = ref<Post[]>([])
const selectedPost = ref<Post | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(loadPosts)

async function loadPosts() {
  loading.value = true
  try {
    posts.value = await postByUserId() // <-- use composable here
  } catch (err) {
    error.value = (err as Error).message || 'Failed to load posts'
  } finally {
    loading.value = false
  }
}

function logout() {
  sessionStorage.removeItem('authtoken')
  sessionStorage.removeItem('user')
  window.location.href = '/home' // Redirect to login page
}
</script>

<template>
  <div class="p-6 min-h-screen flex gap-6 bg-white relative">
    <!-- Main Profile -->
    <main class="flex flex-col items-center bg-gray-200 rounded-lg p-6 space-y-6 mx-auto max-w-md w-full">
      <h2 class="self-start font-serif font-semibold text-lg mb-2">Profile</h2>

      <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
        <img src="/user.png" alt="User profile" class="object-cover w-full h-full" />
      </div>

      <UserProfileForm />

      <button
        @click="logout"
        class="bg-gray-600 text-white px-8 py-2 rounded-md tracking-wider hover:bg-gray-700 transition mt-6"
      >
        Log Out
      </button>
    </main>

    <!-- Sidebar -->
    <aside class="w-72 border-l border-gray-300 p-6 space-y-4 overflow-y-auto max-h-screen">
      <h3 class="font-semibold mb-4">Your posts</h3>

      <p v-if="loading">Loading posts...</p>
      <p v-else-if="error" class="text-red-600">{{ error }}</p>
      <p v-else-if="posts.length === 0">No posts found.</p>

      <div
        v-else
        v-for="post in posts"
        :key="post.id"
        class="flex items-center gap-3 bg-gray-300 rounded-md py-2 px-3 text-sm cursor-pointer select-text truncate hover:bg-gray-400"
        :title="post.title"
        @click="selectedPost = post"
      >
        <img
          :src="post.imageUrl"
          alt="post image"
          class="w-10 h-10 object-cover rounded"
          loading="lazy"
        />
        <span class="truncate">{{ post.title }}</span>
      </div>
    </aside>

    <!-- Edit Modal -->
    <EditPostModal
      :post="selectedPost"
      @close="selectedPost = null"
      @refresh="loadPosts"
    />
  </div>
</template>

function definePageMeta(arg0: {
  middleware: string[] // will run in order: auth → role
}) {
  throw new Error('Function not implemented.')
}
