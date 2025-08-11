<template>
    <section class="flex-1 space-y-6">
      <article
        v-for="(post, i) in posts"
        :key="post.id || i"
        class="bg-gray-100 p-4 rounded-md shadow-sm"
      >
        <h2 class="font-bold mb-2">{{ post.title }}</h2>
        <p class="text-sm text-gray-700">
          {{ post.description }}
        </p>
      </article>
    </section>
</template>

<script setup>
import { usePosts } from '~/composables/allPosts.js'

const { posts, error, pending } = usePosts()

</script>