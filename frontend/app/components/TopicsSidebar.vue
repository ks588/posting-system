<template>
  <aside class="fixed top-20 right-0 h-[80vh] w-48 bg-gray-100 shadow-lg rounded-l-lg p-4 overflow-y-auto">
    <h3 class="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">Topics</h3>
    <ul class="space-y-2">
      <li
        v-for="topic in topics"
        :key="topic"
        class="cursor-pointer hover:bg-blue-100 rounded px-2 py-1 transition"
        @click="$emit('select-topic', topic)"
      >
        {{ topic }}
      </li>
    </ul>
  </aside>
</template>

<script setup>
defineProps({
  topics: {
    type: Array,
    default: () => ['Tech', 'Science', 'Health', 'Sports', 'Travel']
  }
})
</script>

<style scoped>
/* Optional scrollbar styling */
aside::-webkit-scrollbar {
  width: 6px;
}
aside::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
</style>
