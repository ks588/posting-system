<template>
  <div class=" p-4 min-h-screen flex gap-6">
    
    <!-- Posts List - left side -->
    <section class="flex-1 space-y-6">
      <article
        v-for="(post, i) in posts"
        :key="i"
        class="bg-gray-100 p-4 rounded-md shadow-sm"
      >
        <h2 class="font-bold mb-2">Title of the posting</h2>
        <p class="text-sm text-gray-700">
          {{ post.text }}
        </p>
      </article>
    </section>

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
const posts = [
  { text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...` },
  { text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...` },
  { text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...` },
]

const selectedItems = new Array(5).fill(null) // 5 gray blocks on the right
</script>
