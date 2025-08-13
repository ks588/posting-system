<template>
  <section class="flex-1 space-y-6">
    <article
      v-for="(post, i) in sortedPosts"
      :key="post.id || i"
      class="bg-gray-100 px-4 pt-4 rounded-md shadow-sm flex gap-4 mx-10  transition"
    >
      <!-- Left column: Title + Description -->
      <div class="flex-1 flex flex-col">
        <h2 class="font-bold mb-2">{{ post.title }}</h2>
        <p class="text-xs text-gray-700 pb-2 mx-5 text-right">
          {{ new Date(post.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }}
        </p>
        <p class="text-sm text-gray-700 overflow-auto h-50 w-150">
          {{ post.description }}
        </p>
      </div>

      <!-- Right column: Image with favorite button -->
      <div class="w-100 flex-shrink-0 relative rounded-md overflow-hidden">
        <img
          :src="post.imageUrl"
          alt="post image"
          class="object-cover w-full h-full rounded-md"
        />
        <!-- Favorite heart button -->
        <button
          class="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center hover:scale-105 transition"
          aria-label="Favorite"
          @click="toggleFavorite(post)"
        >
          <img src="/whiteheart.png" alt="Favorite" class="w-6 h-6" />
        </button>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { usePosts } from '~/composables/allPosts.js'

const { posts, error, pending } = usePosts()

const sortedPosts = computed(() => {
  if (!posts.value) return []
  return [...posts.value].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
})

// Example toggle favorite function
function toggleFavorite(post) {
  // Implement your favorite logic here
  alert(`Toggled favorite for post: ${post.title}`)
}
</script>
