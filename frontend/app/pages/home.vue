<template>
  <div class="p-4 min-h-screen flex gap-6">
    
    <!-- Posts List - left side -->
    <PostList/>

    <!-- Sidebar - right side -->
    <aside class="w-70 space-y-4 pl-2 border-l border-gray-300 border-t-0 border-r-0 border-b-0">
      <h3 class="font-semibold mb-2">Selected for you</h3>
      <div
        v-for="(item, i) in selectedItems"
        :key="i"
        class="bg-gray-300 h-12 rounded-md"
      ></div>
    </aside>
    
  </div>
</template>

<script setup>
import { usePosts } from '~/composables/allPosts.js'

const { posts, error, pending } = usePosts()

const selectedItems = new Array(5).fill(null)
</script>
