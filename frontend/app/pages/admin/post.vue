<script setup lang="ts">
import { onMounted } from 'vue'
import { usePosts } from '../../composables/useAllPostAdmin'

const { posts, loading, error, fetchPosts, deletePost } = usePosts()

onMounted(() => {
  fetchPosts()
})

// Dummy handler for update (replace with actual logic)
function updatePost(id: number) {
  alert(`Update post ${id}`)
}
</script>

<template>
  <div class="flex justify-center mt-10 px-4">
    <div class="w-full max-w-5xl">
      <h2 class="text-2xl font-bold mb-6 text-center">Posts</h2>

      <div v-if="loading" class="text-center text-gray-600">Loading...</div>
      <div v-if="error" class="text-center text-red-600">{{ error }}</div>

      <table
        v-else
        class="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden"
      >
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-4 text-left">ID</th>
            <th class="py-3 px-4 text-left">User ID</th>
            <th class="py-3 px-4 text-left">Title</th>
            <th class="py-3 px-4 text-left">Description</th>
            <th class="py-3 px-4 text-left">Image</th>
            <th class="py-3 px-4 text-center">Update</th>
            <th class="py-3 px-4 text-center">Delete</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="post in posts"
            :key="post.id"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="py-2 px-4">{{ post.id }}</td>
            <td class="py-2 px-4">{{ post.userId }}</td>
            <td class="py-2 px-4">{{ post.title }}</td>
            <td class="py-2 px-4">
              <p class="line-clamp-3 overflow-hidden">{{ post.description }}</p>
            </td>
            <td class="py-2 px-4">
              <img v-if="post.imageUrl" :src="post.imageUrl" class="w-20 h-12 object-cover rounded" />
            </td>
            <td class="py-2 px-4 text-center">
              <button
                @click="updatePost(post.id)"
                class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Update
              </button>
            </td>
            <td class="py-2 px-4 text-center">
              <button
                @click="deletePost(post.id)"
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="posts.length === 0 && !loading" class="text-center mt-4 text-gray-500">
        No posts found.
      </div>
    </div>
  </div>
</template>

<style>
/* Limit description to 3 lines */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
